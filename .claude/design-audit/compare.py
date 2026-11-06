"""Side-by-side of the site screenshot and Figma's render of the same frame, for a visual check.

usage: python3 -I compare.py SITE.png FIGMA.png OUT.png [--scale 0.6] [--stack]

Both images are scaled by --scale (default 0.6); --stack puts them one above the other instead of side by side.
A red bar separates them. Read OUT.png afterwards: the site is first (left/top), Figma second.
"""
import argparse

from PIL import Image

p = argparse.ArgumentParser()
p.add_argument('site')
p.add_argument('figma')
p.add_argument('out')
p.add_argument('--scale', type=float, default=0.6)
p.add_argument('--stack', action='store_true')
a = p.parse_args()

site, fig = (Image.open(x).convert('RGB') for x in (a.site, a.figma))
site, fig = (im.resize((round(im.width * a.scale), round(im.height * a.scale))) for im in (site, fig))
gap = 12
if a.stack:
    out = Image.new('RGB', (max(site.width, fig.width), site.height + fig.height + gap), 'red')
    out.paste(site, (0, 0))
    out.paste(fig, (0, site.height + gap))
else:
    out = Image.new('RGB', (site.width + fig.width + gap, max(site.height, fig.height)), 'red')
    out.paste(site, (0, 0))
    out.paste(fig, (site.width + gap, 0))
out.save(a.out)
print(a.out, out.size)
