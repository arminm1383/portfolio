import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './PixelRevealMedia.css'
import LoopVideo, { type LoopVideoSource } from './LoopVideo'

interface PixelRevealMediaProps {
  pixel: LoopVideoSource   // default state: the pixel-art cut of the clip
  actual: LoopVideoSource  // revealed state: the real clip (same length and frame rate, so the two stay in sync)
  revealed: boolean        // driven by the parent (e.g. hovering the work card)
  label?: string
  cols?: number            // grid columns; rows follow from the box so tiles stay square
}

type Phase = 'pixel' | 'revealing' | 'actual'
interface Tile { p: number } // 0 = pixel cut, 1 = real clip; in between = mosaic levels
interface Mosaic { n: number; c: HTMLCanvasElement; ctx: CanvasRenderingContext2D }
interface Crop { video: HTMLVideoElement; sx: number; sy: number; sw: number; sh: number }

// Each tile resolves through these mosaics (blocks per tile side) on its way from the pixel cut to the real clip:
// one solid square, then 2x2, 4x4, 8x8, 16x16, then the crisp frame
const LEVELS = [1, 2, 4, 8, 16]
const STEPS = LEVELS.length + 1      // mosaic levels + the final crisp step
const PIXEL = -1, CRISP = LEVELS.length, UNDRAWN = 99
const TILE_RESOLVE = 0.6             // seconds for one tile to go from pixel cut to crisp
const RIPPLE_IN = 0.55               // seconds from the first tile (bottom-left) starting to the last one starting
const TILE_PIXELATE = 0.45
const RIPPLE_OUT = 0.55

// A tile's stage: PIXEL = pixel cut, 0..LEVELS-1 = mosaic level, CRISP = real clip
const stageOf = (p: number) => (p <= 0 ? PIXEL : Math.min(CRISP, Math.floor(p * STEPS)))

// Reads `object-position` percentages so the canvas crops exactly like the <video> it stands in for
function focusOf(video: HTMLVideoElement): [number, number] {
  const [x = '50%', y = '50%'] = getComputedStyle(video).objectPosition.split(' ')
  const pct = (v: string) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5)
  return [pct(x), pct(y)]
}

// Calls `onFrame` each time the video presents a new frame (about 14/s here), so canvas work follows the clip's
// frame rate instead of the display's 60-120Hz. Falls back to every animation frame where unsupported.
function watchFrames(video: HTMLVideoElement, onFrame: () => void): () => void {
  if (!('requestVideoFrameCallback' in video)) {
    gsap.ticker.add(onFrame)
    return () => gsap.ticker.remove(onFrame)
  }
  let id = 0
  const cb = () => { onFrame(); id = video.requestVideoFrameCallback(cb) }
  id = video.requestVideoFrameCallback(cb)
  return () => video.cancelVideoFrameCallback(id)
}

// Two-state work artwork: the pixel clip by default, the real clip once revealed. The change is a depixelization:
// a square grid ripples out from the bottom-left corner and each tile resolves from one solid block through finer
// and finer mosaics of the live real clip until it's crisp (and back again, re-pixelating, when unrevealed).
//
// Performance: everything is allocated once (on mount/resize), the real clip is read into the mosaics once per
// new video frame (coarser levels are downsampled from that small canvas, not from the video), only tiles whose
// stage or source frame changed are redrawn, and the clip that isn't on screen is paused.
export default function PixelRevealMedia({ pixel, actual, revealed, label, cols = 14 }: PixelRevealMediaProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelRef = useRef<HTMLVideoElement>(null)
  const actualRef = useRef<HTMLVideoElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const drawRef = useRef<(() => void) | null>(null)
  const [phase, setPhase] = useState<Phase>('pixel')

  // Everything the per-frame draw needs, built once and rebuilt only on resize
  const stateRef = useRef({
    tiles: [] as Tile[],
    drawn: new Uint8Array(0),          // stage each tile was last drawn at (UNDRAWN forces a redraw)
    rows: 1, w: 0, h: 0, dpr: 1,
    mosaics: [] as Mosaic[],
    crops: null as [Crop, Crop] | null,
    newPixelFrame: true,               // set by the video frame callbacks, cleared by draw
    newActualFrame: true,
    onScreen: true,
  })

  // Grid, canvases and crop: on mount and whenever the box resizes. Tile progress survives resizes.
  useLayoutEffect(() => {
    const box = boxRef.current, canvas = canvasRef.current
    if (!box || !canvas) return
    const s = stateRef.current
    const fit = () => {
      const { width: w, height: h } = box.getBoundingClientRect()
      if (!w || !h) return
      const rows = Math.max(1, Math.round((h / w) * cols))
      if (rows !== s.rows || s.tiles.length !== rows * cols) {
        const settled = s.tiles[0]?.p ?? 0
        s.rows = rows
        s.tiles = Array.from({ length: rows * cols }, () => ({ p: settled }))
        s.drawn = new Uint8Array(rows * cols)
        s.mosaics = LEVELS.map(n => {
          const c = document.createElement('canvas')
          c.width = cols * n
          c.height = rows * n
          const ctx = c.getContext('2d')!
          ctx.imageSmoothingQuality = 'high'
          return { n, c, ctx }
        })
      }
      s.w = w
      s.h = h
      s.dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(w * s.dpr)
      canvas.height = Math.round(h * s.dpr)
      s.crops = null
      s.drawn.fill(UNDRAWN)
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(box)
    return () => observer.disconnect()
  }, [cols])

  // New-frame flags from both clips, and pausing everything while the card is off screen
  useEffect(() => {
    const box = boxRef.current, pixelVideo = pixelRef.current, actualVideo = actualRef.current
    if (!box || !pixelVideo || !actualVideo) return
    const s = stateRef.current
    const stopPixel = watchFrames(pixelVideo, () => { s.newPixelFrame = true })
    const stopActual = watchFrames(actualVideo, () => { s.newActualFrame = true })
    const observer = new IntersectionObserver(([entry]) => {
      s.onScreen = entry.isIntersecting
      // Back on screen: both clips restart from the top together; only the one being shown plays
      if (entry.isIntersecting) {
        pixelVideo.currentTime = 0
        actualVideo.currentTime = 0
      }
      syncPlayback()
    }, { threshold: 0 })
    observer.observe(box)
    return () => { stopPixel(); stopActual(); observer.disconnect() }
  }, [])

  // Plays the clip(s) currently visible and pauses the rest: off screen, nothing plays; at rest, only the visible
  // face plays; mid-reveal both play. A clip resuming is first lined up with the one that kept playing.
  function syncPlayback(resumeFrom?: HTMLVideoElement) {
    const s = stateRef.current, pixelVideo = pixelRef.current, actualVideo = actualRef.current
    if (!pixelVideo || !actualVideo) return
    const moving = !!tweenRef.current
    const settledActual = s.tiles.length > 0 && s.tiles.every(t => t.p >= 1)
    const wantPixel = s.onScreen && (moving || !settledActual)
    const wantActual = s.onScreen && (moving || settledActual)
    for (const [video, want] of [[pixelVideo, wantPixel], [actualVideo, wantActual]] as const) {
      if (want && video.paused) {
        if (resumeFrom && resumeFrom !== video && Math.abs(video.currentTime - resumeFrom.currentTime) > 0.05) {
          video.currentTime = resumeFrom.currentTime
        }
        video.play().catch(() => {})
      } else if (!want && !video.paused) {
        video.pause()
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const pixelVideo = pixelRef.current, actualVideo = actualRef.current
    if (!canvas || !pixelVideo || !actualVideo) return
    const s = stateRef.current
    const { tiles } = s
    const target = revealed ? 1 : 0
    if (tiles.every(t => t.p === target) && !tweenRef.current) return

    tweenRef.current?.kill()
    if (drawRef.current) gsap.ticker.remove(drawRef.current)

    // Checked before any seek: a seek drops readyState while it's in flight
    const ready = pixelVideo.readyState >= 2 && actualVideo.readyState >= 2
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    if (!ready || reduceMotion || !ctx) {
      tiles.forEach(t => { t.p = target })
      tweenRef.current = null
      syncPlayback(revealed ? pixelVideo : actualVideo)
      setPhase(revealed ? 'actual' : 'pixel')
      return
    }

    const crop = (video: HTMLVideoElement): Crop => {
      const vw = video.videoWidth, vh = video.videoHeight
      const scale = Math.max(s.w / vw, s.h / vh)
      const sw = s.w / scale, sh = s.h / scale
      const [fx, fy] = focusOf(video)
      return { video, sx: (vw - sw) * fx, sy: (vh - sh) * fy, sw, sh }
    }

    const draw = () => {
      const { rows, w, h, dpr, mosaics, drawn } = s
      if (!s.crops) s.crops = [crop(pixelVideo), crop(actualVideo)]
      const [pixelFace, actualFace] = s.crops
      const tw = w / cols, th = h / rows
      const newPixel = s.newPixelFrame, newActual = s.newActualFrame
      s.newPixelFrame = s.newActualFrame = false

      // Which kinds of tile are on screen, and which changed stage, this frame
      let anyMosaic = false, anyChange = false
      for (let i = 0; i < tiles.length; i++) {
        const st = stageOf(tiles[i].p)
        if (st >= 0 && st < CRISP) anyMosaic = true
        if (st !== drawn[i] - 1) anyChange = true
      }
      if (!anyChange && !newPixel && !newActual) return // nothing new to show: skip the frame entirely

      // One read of the real clip per new video frame, into the finest mosaic; every coarser level is a 2:1
      // downsample of the one above it (small canvas to small canvas), never another read of the video
      const refreshMosaics = anyMosaic && newActual
      if (refreshMosaics) {
        const finest = mosaics[mosaics.length - 1]
        finest.ctx.drawImage(actualVideo, actualFace.sx, actualFace.sy, actualFace.sw, actualFace.sh, 0, 0, finest.c.width, finest.c.height)
        for (let i = mosaics.length - 2; i >= 0; i--) {
          mosaics[i].ctx.drawImage(mosaics[i + 1].c, 0, 0, mosaics[i].c.width, mosaics[i].c.height)
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Pass 1: mosaic tiles, smoothing off so blocks stay hard-edged squares
      ctx.imageSmoothingEnabled = false
      for (let r = 0, i = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++, i++) {
          const st = stageOf(tiles[i].p)
          if (st < 0 || st >= CRISP) continue
          if (st === drawn[i] - 1 && !refreshMosaics) continue
          const { n, c } = mosaics[st]
          ctx.drawImage(c, col * n, r * n, n, n, col * tw, r * th, tw, th)
          drawn[i] = st + 1
        }
      }
      // Pass 2: tiles showing a clip directly (pixel cut or crisp real frame)
      ctx.imageSmoothingEnabled = true
      for (let r = 0, i = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++, i++) {
          const st = stageOf(tiles[i].p)
          if (st >= 0 && st < CRISP) continue
          const fresh = st === PIXEL ? newPixel : newActual
          if (st === drawn[i] - 1 && !fresh) continue
          const f = st === PIXEL ? pixelFace : actualFace
          const x = col * tw, y = r * th
          ctx.drawImage(f.video, f.sx + (x / w) * f.sw, f.sy + (y / h) * f.sh, (tw / w) * f.sw, (th / h) * f.sh, x, y, tw, th)
          drawn[i] = st + 1
        }
      }
    }
    // `drawn` stores stage + 1 so PIXEL (-1) fits a Uint8Array; UNDRAWN never matches, forcing a full first paint
    s.drawn.fill(UNDRAWN)
    s.newPixelFrame = s.newActualFrame = true

    drawRef.current = draw
    tweenRef.current = gsap.to(tiles, {
      p: target,
      duration: revealed ? TILE_RESOLVE : TILE_PIXELATE,
      ease: 'none', // the mosaic levels already step; a linear ride gives each level equal time
      // GSAP grid stagger: delay grows with each tile's distance from `from` ([x, y] ratios; [0, 1] = bottom-left).
      // Re-pixelating runs the ripple in reverse, from the top-right corner home.
      stagger: { grid: [s.rows, cols], from: revealed ? [0, 1] : [1, 0], amount: revealed ? RIPPLE_IN : RIPPLE_OUT },
      overwrite: true,
      onComplete: () => {
        gsap.ticker.remove(draw)
        drawRef.current = null
        tweenRef.current = null
        syncPlayback()
        setPhase(revealed ? 'actual' : 'pixel')
      },
    })
    // Both clips play during the change; the one waking up is lined up with the one already showing
    syncPlayback(revealed ? pixelVideo : actualVideo)
    draw()
    gsap.ticker.add(draw)
    setPhase('revealing')

    return () => {
      gsap.ticker.remove(draw)
    }
  }, [revealed, cols])

  useEffect(() => () => {
    tweenRef.current?.kill()
    if (drawRef.current) gsap.ticker.remove(drawRef.current)
  }, [])

  return (
    <div ref={boxRef} className="pixel-reveal" data-phase={phase}>
      <LoopVideo ref={pixelRef} src={pixel} label={label} className="pixel-reveal-video pixel-reveal-video--pixel" />
      <LoopVideo ref={actualRef} src={actual} className="pixel-reveal-video pixel-reveal-video--actual" />
      <canvas ref={canvasRef} className="pixel-reveal-canvas" aria-hidden />
    </div>
  )
}
