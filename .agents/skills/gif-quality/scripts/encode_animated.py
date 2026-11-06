"""Encode a Figma gif original as a high-quality animated WebP for the site.

usage: python3 -I encode_animated.py SRC OUT --width W [--crop x0,y0,x1,y1] [--quality 85]
                                     [--step 1] [--max-mb 7]

  --width    output width in px = 2x the rendered width of the <img> box (never upscale past the source)
  --crop     source-pixel box to keep (bake Figma's crop in when the CSS frame shows the whole image)
  --quality  WebP quality; 85 default, never below 78
  --step     keep every Nth frame (delays are summed so playback speed is unchanged)
  --max-mb   size budget; if the first pass is over it, retries once at --step 2 and says so

Keeps alpha (phone mockups have transparent corners) and every frame's real delay.
"""
import argparse
import os
import sys

from PIL import Image, ImageSequence

p = argparse.ArgumentParser()
p.add_argument('src')
p.add_argument('out')
p.add_argument('--width', type=int, required=True)
p.add_argument('--crop')
p.add_argument('--quality', type=int, default=85)
p.add_argument('--step', type=int, default=1)
p.add_argument('--max-mb', type=float, default=7)
a = p.parse_args()

if a.quality < 78:
    sys.exit('quality below 78 visibly degrades footage and UI text; pick a smaller --step instead')

crop = tuple(int(v) for v in a.crop.split(',')) if a.crop else None
src = Image.open(a.src)
frames, durations = [], []
for f in ImageSequence.Iterator(src):
    fr = f.convert('RGBA')
    if crop:
        fr = fr.crop(crop)
    frames.append(fr)
    durations.append(f.info.get('duration', 100) or 100)

src_w, src_h = frames[0].size
width = a.width
if width > src_w:
    print(f'note: requested {width}px but the source is only {src_w}px wide; using {src_w}px (no upscaling)')
    width = src_w
height = round(src_h * width / src_w)
frames = [fr.resize((width, height), Image.LANCZOS) for fr in frames]


def encode(step):
    keep = range(0, len(frames), step)
    out = [frames[i] for i in keep]
    dur = [sum(durations[i:i + step]) for i in keep]
    out[0].save(a.out, save_all=True, append_images=out[1:], duration=dur, loop=0,
                quality=a.quality, alpha_quality=100, method=4, kmax=20)
    return len(out), os.path.getsize(a.out) / 1e6


n, mb = encode(a.step)
if mb > a.max_mb and a.step == 1:
    print(f'{mb:.1f} MB at full frame rate is over the {a.max_mb} MB budget; retrying at half frame rate')
    n, mb = encode(2)
    a.step = 2
print(f'{os.path.basename(a.out)}: {width}x{height}, {n}/{len(frames)} frames (step {a.step}), '
      f'q{a.quality}, {mb:.2f} MB')
