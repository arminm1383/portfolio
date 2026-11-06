#!/bin/zsh
# Encode an opaque animation as MP4 (H.264) + WebM (VP9) + first-frame JPEG poster for <LoopVideo>.
#
# usage: encode_video.sh SRC OUT_BASENAME WxH BG_HEX
#   WxH     output size = 2x the rendered box (cover-fitted), never above the source
#   BG_HEX  colour to flatten any stray transparent pixels onto, e.g. 0xF4F4F3
#
# Timing is exact: frames go to a constant rate equal to the GCD of the GIF's delays, the last frame's hold is
# kept, and the clip is trimmed to the GIF's total length (VFR MP4 drops the final frame's hold).
set -e
src=$1 out=$2 wh=$3 bg=$4
w=${wh%x*} h=${wh#*x}
read -r fps total <<< "$(python3 -I - "$src" <<'EOF'
import sys, math
from functools import reduce
from PIL import Image, ImageSequence
d = [(f.info.get('duration', 100) or 100) for f in ImageSequence.Iterator(Image.open(sys.argv[1]))]
g = reduce(math.gcd, d)
print(f'1000/{g}', sum(d) / 1000)
EOF
)"
F="color=c=${bg}:s=${wh}:r=${fps}[bg];[0:v]scale=${w}:${h}:flags=lanczos,format=rgba,tpad=stop_mode=clone:stop_duration=5[fg];[bg][fg]overlay=shortest=1:format=auto,fps=${fps},trim=end=${total},setpts=PTS-STARTPTS,format=yuv420p"
ffmpeg -v error -y -i "$src" -filter_complex "$F" -c:v libx264 -preset slow -crf 20 -profile:v high -movflags +faststart -an "$out.mp4"
ffmpeg -v error -y -i "$src" -filter_complex "$F" -c:v libvpx-vp9 -crf 33 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 -an "$out.webm"
ffmpeg -v error -y -i "$src" -filter_complex "$F" -frames:v 1 -q:v 3 "$out-poster.jpg"
for f in "$out.mp4" "$out.webm"; do
  echo "$f: $(ffprobe -v error -select_streams v -show_entries stream=width,height -of csv=p=0 "$f"), $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")s (gif ${total}s), $(( $(stat -f %z "$f") / 1024 ))KB"
done
echo "$out-poster.jpg: $(( $(stat -f %z "$out-poster.jpg") / 1024 ))KB"
