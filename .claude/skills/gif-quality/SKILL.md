---
name: gif-quality
description: Export, encode, verify and apply animated assets (gifs) from the Portfolio-v4 Figma file at 2x quality. ALWAYS run this whenever a gif or animated image is involved — adding, replacing, re-exporting, compressing, resizing or cropping a .gif/.webp animation, a Figma node whose fill is a gif, or a report that an animation looks blurry, pixelated, banded or low quality. Run it as a subroutine inside any larger task that touches an animation; do not hand-roll gifsicle/Pillow settings instead.
---

# gif-quality — 2x animated assets, verified before they ship

Animations on this site come from gif fills in Figma (file `Gh9WW3Dl4tQc40mRzkvwVv`, Portfolio-v4). Low quality
has always come from the same three mistakes: exporting below 2x (soft on retina), squeezing a GIF palette
(banding/posterizing on footage and wallpapers), and heavy `--lossy`. This skill prevents all three and proves it.

Run every step. Do not skip verification because an encode "looks fine".

## Setup

```sh
export PATH=/Library/Frameworks/Python.framework/Versions/3.13/bin:/usr/local/bin:/opt/homebrew/bin:$PATH
K=<repo>/.claude/skills/gif-quality/scripts      # this skill's scripts
W=<scratchpad>/gif/<asset-name>                    # one fresh working dir per asset (downloads are untrusted)
```
Run Python with `python3 -I` (Pillow lives in that framework Python).

## 1. Find the node and its rendered box

- Get the gif node (the rectangle with the IMAGE fill, not its parent frame) with `get_metadata`, then a read-only
  `use_figma` to read `fills[0].imageHash`, `scaleMode`, `imageTransform`, the node's width/height and the
  image's `getSizeAsync()`.
- **Box width** = the width of the `<img>` element on the page in CSS px. If the page crops by overscanning
  (e.g. `.findy-media-frame--table img { width: 105.79% }`), the box is frame width × that %. If you bake the
  crop into the file (preferred, see step 3), the box is the frame width.
- Crop from `imageTransform` `[[sx,0,tx],[0,sy,ty]]` on a W×H source: `x0=tx·W, y0=ty·H, x1=x0+sx·W, y1=y0+sy·H`.

## 2. Export from Figma at 2x and fetch the original

Call `download_assets` on the gif node with **`defaultScale: 2`** (format png). It returns:
- `export` — Figma's own **2x render** of the node. Save as `$W/figma-2x.png`; it is the visual reference.
  (Figma's export flattens a gif fill to one still frame, so this render cannot be the shipped asset.)
- `rawImages` — the **original** uploaded gif (`format: "gif"`). Save as `$W/original.gif`.

Then confirm it is the right file: `shasum -a 1 $W/original.gif` must equal the fill's `imageHash`.
If it doesn't, you grabbed the wrong raw image — stop and pick the one that matches.

## 3. Encode at 2x

**Pick the format first.** Opaque clips (no transparency needed: UI recordings, footage, card artwork) ship as
**video**: `<LoopVideo>` (`src/components/LoopVideo.tsx`, WebM + MP4 + poster). It is 3-25x smaller than GIF or
WebP at the same quality (landing: Streets 5.1 MB GIF to 194 KB WebM, Memento 5.8 MB to 1.1 MB). Anything that
needs **transparency** (phone mockups with transparent corners, pixel sprites) ships as **animated WebP**,
because MP4 has no alpha and Safari won't play alpha WebM. Tiny pixel art (under ~50 KB) can stay GIF.

Video (needs `ffmpeg`; `brew install ffmpeg`):
```sh
$K/encode_video.sh $W/original.gif <src/assets/images/name> <2W>x<2H> <bg hex, e.g. 0xF4F4F3>
```
- Size = 2x the rendered box after `object-fit: cover` (e.g. a 570x368 box showing a 1800x1040 GIF is
  height-bound: 1274x736). Never above the source.
- Timing is exact (constant rate = GCD of the GIF delays, last-frame hold kept, trimmed to the GIF's total);
  check the printed durations match. Render with `<LoopVideo src={{ webm, mp4, poster }} label=... />`.
- `waitForPage` treats a video as ready once its poster or first frame loads; register the poster with
  `registerPageImages`. Keep the replaced GIF in the repo only if something else still imports it.

Animated WebP (transparency):
```sh
python3 -I $K/encode_animated.py $W/original.gif $W/<name>.webp --width <2 × box> [--crop x0,y0,x1,y1]
```
- Output is **animated WebP** (plays like a gif in `<img>`, full colour, keeps alpha). Never ship a new GIF.
- `--width` = 2 × box width, rounded. The script never upscales past the source; that is fine (verify allows it).
- Bake the Figma crop in with `--crop` when the frame should show exactly the cropped region; then style the
  `<img>` with `inset:0; width/height:100%; object-fit:cover` (`.findy-media-frame--cover`).
- Quality 85 by default; never below 78. Budget is ~7 MB per asset. If over, the script retries at half
  frame rate (summed delays keep the speed) and says so. Prefer that over lowering quality or width.
- Encoding takes ~1 min for a few hundred frames; run long ones in the background.

## 4. Verify (must print `RESULT: PASS`)

```sh
python3 -I $K/verify_animated.py $W/<name>.webp --source $W/original.gif --box <box width> \
  [--crop x0,y0,x1,y1] --reference $W/figma-2x.png [--max-mb 7]
```
Checks: width ≥ 2x box (or full source width), still animated, total duration matches the source, alpha kept,
size budget, **fidelity** (PSNR vs the same source frames ≥ 33 dB — good encodes measure 34–38, the old
posterized gifs ~29), and **crop** vs Figma's 2x render (≥ 24 dB). Any FAIL: fix and re-encode, don't ship.

Then look at it: crop the same region from the encode and from `figma-2x.png`, put them side by side, and Read
the image. Text and edges must be as crisp as Figma's.

## 5. Apply

- Save as `src/assets/images/<name>.webp`, update the import, delete the replaced `.gif` (check nothing else
  imports it first). Images hold the page-ready gate, so never add `loading="lazy"`.
- `npx tsc -b && npm run lint && npm run build`.

## 6. Audit in the browser at retina density (must print `RESULT: PASS`)

Start the dev server (`npx vite --port 5199 --strictPort`, in the background), then:
```sh
PUPPETEER_DIR=<dir with node_modules/puppeteer-core> node $K/audit_page.cjs http://localhost:5199/<route> [...]
```
(`npm i --prefix <scratchpad>/pp puppeteer-core` if no such dir exists.) It loads each page at DPR 2 and checks
every `.gif`/`.webp` image and every `<video>` is loaded, has ≥ 2x pixel density in its real box (accounting for
`object-fit`), and is moving. Stop the dev server afterwards.

## 7. Report

Tell the user: the asset's resolution and size, before/after, every verify/audit result, and any tradeoff
(reduced frame rate, source smaller than 2x). Don't claim "high quality" without a PASS from steps 4 and 6.
