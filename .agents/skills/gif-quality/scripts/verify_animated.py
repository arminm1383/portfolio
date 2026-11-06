"""Verify an encoded animation against its Figma original before it ships. Exits 1 on any FAIL.

usage: python3 -I verify_animated.py OUT --source SRC --box W [--crop x0,y0,x1,y1]
                                     [--reference figma-2x.png] [--max-mb 7]

  --box        rendered width (CSS px) of the <img> box on the page; for a Figma crop done in CSS this is
               the overscanned image box (frame width x crop %), not the frame
  --reference  Figma's own 2x render of the node (get_screenshot at maxDimension = 2x its longest side);
               compared with frame 0 to catch wrong crops and visible quality loss

Checks: resolution >= 2x box (or the full source when the source is smaller), still animated, same
total duration as the source, alpha kept when the source has it, size budget, fidelity to the source
(PSNR of three frames vs the same source frames at the same size: >= 33 dB; good encodes measure 34-38,
posterized/heavy-lossy gifs <= 30), and crop vs Figma's 2x render (>= 24 dB).
"""
import argparse
import math
import os
import sys

from PIL import Image, ImageChops, ImageSequence, ImageStat

p = argparse.ArgumentParser()
p.add_argument('out')
p.add_argument('--source', required=True)
p.add_argument('--box', type=float, required=True)
p.add_argument('--crop')
p.add_argument('--reference')
p.add_argument('--max-mb', type=float, default=7)
a = p.parse_args()

fails = 0


def check(ok, label):
    global fails
    print(('PASS ' if ok else 'FAIL ') + label)
    fails += 0 if ok else 1


def info(path):
    im = Image.open(path)
    durs, alpha = [], False
    for f in ImageSequence.Iterator(im):
        f.load()  # Pillow only fills in a WebP frame's duration once the frame is decoded
        durs.append(f.info.get('duration', 100) or 100)
        if not alpha:
            alpha = f.convert('RGBA').getchannel('A').getextrema()[0] < 128
    return im.size, len(durs), sum(durs), alpha


out_size, out_n, out_ms, out_alpha = info(a.out)
src_size, src_n, src_ms, src_alpha = info(a.source)
crop = tuple(int(v) for v in a.crop.split(',')) if a.crop else None
src_w = (crop[2] - crop[0]) if crop else src_size[0]

need = min(round(a.box * 2), src_w)
check(out_size[0] >= need - 1,
      f'resolution {out_size[0]}px wide, needs >= {need}px (2x the {a.box:g}px box'
      + (', capped at the source width)' if need < a.box * 2 else ')'))
check(out_n > 1, f'animated ({out_n} frames; source has {src_n})')
check(abs(out_ms - src_ms) <= max(100, src_ms * 0.03),
      f'duration {out_ms / 1000:.2f}s vs source {src_ms / 1000:.2f}s')
if src_alpha:
    check(out_alpha, 'transparency kept (source has transparent pixels)')
mb = os.path.getsize(a.out) / 1e6
check(mb <= a.max_mb, f'size {mb:.2f} MB (budget {a.max_mb} MB)')
if out_n < src_n:
    print(f'NOTE {out_n}/{src_n} frames: WebP merges identical consecutive frames losslessly; if --step was '
          f'used, the frame rate was reduced — mention that tradeoff to the user')

def psnr(x, y):
    mse = sum(v ** 2 for v in ImageStat.Stat(ImageChops.difference(x, y)).rms) / 3
    return 99 if mse == 0 else 10 * math.log10(255 ** 2 / mse)


def flat(im):
    """RGBA -> RGB over white, so transparent corners compare equal whatever their hidden colour."""
    im = im.convert('RGBA')
    return Image.alpha_composite(Image.new('RGBA', im.size, (255, 255, 255, 255)), im).convert('RGB')


# Fidelity: encoded frames vs the matching source frames, resized to the encoded size
out_im, src_im = Image.open(a.out), Image.open(a.source)
step = max(1, round(src_n / out_n))
scores = []
for k in (0, out_n // 3, 2 * out_n // 3):
    out_im.seek(k)
    src_im.seek(min(k * step, src_n - 1))
    s = src_im.convert('RGBA')
    s = s.crop(crop) if crop else s
    scores.append(psnr(flat(out_im), flat(s.resize(out_size, Image.LANCZOS))))
fid = sum(scores) / len(scores)
check(fid >= 33, f'fidelity to source: PSNR {fid:.1f} dB over 3 frames (>= 33; posterized/lossy gifs score <= 30)')

if a.reference:
    # Figma renders a gif fill from its first frame, so frame 0 should line up with Figma's 2x export
    ref = Image.open(a.reference).convert('RGB')
    out_im.seek(0)
    crop_psnr = psnr(flat(out_im).resize(ref.size, Image.LANCZOS), ref)
    check(crop_psnr >= 24, f'crop vs Figma 2x render: PSNR {crop_psnr:.1f} dB (>= 24; lower means a wrong crop)')

print('RESULT: ' + ('PASS' if fails == 0 else f'{fails} FAIL'))
sys.exit(1 if fails else 0)
