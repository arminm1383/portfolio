// Archived landing hero — the animated collage (birds, Mac, Wii, koi gif, skill
// icons, "Hi, I'm Armin") with amLM click-to-ask graphics, as it shipped on the
// landing page before the Portfolio-v4 redesign. Self-contained: drop
// <HeroCollage /> into any page to bring it back.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './HeroCollage.css'
import { runHeroEntrance } from '../lib/heroEntrance'

import heroMac     from '../assets/images/hero-mac.png'
import heroMeGreen from '../assets/images/hero-me-green.png'
import heroWii     from '../assets/images/hero-wii.png'
import heroIpod    from '../assets/images/hero-ipod.png'
import heroBird1   from '../assets/images/hero-bird1.png'
import heroBird2   from '../assets/images/hero-bird2.png'
import heroBird3   from '../assets/images/hero-bird3.png'
import heroYosemite    from '../assets/images/hero-yosemite.png'
import heroIconFigma   from '../assets/images/hero-icon-figma.png'
import heroIconReact   from '../assets/images/hero-icon-react.png'
import heroIconClaude  from '../assets/images/hero-icon-claude.png'
import heroMusicNote   from '../assets/images/hero-music-note.png'
import heroKoiBorder   from '../assets/images/hero-koi-border.png'
import heroKoiGif      from '../assets/images/koi.gif'
import heroBoy         from '../assets/images/hero-boy.png'
import heroStarLg      from '../assets/images/hero-star-lg.png'
import heroStarMd      from '../assets/images/hero-star-md.png'
import heroStarSm      from '../assets/images/hero-star-sm.png'
import amlmSend    from '../assets/images/amlm-send.svg'
import amlmStarSm  from '../assets/images/nav-topbar-star-sm.svg'
import amlmStarLg  from '../assets/images/nav-topbar-star-lg.svg'
import amlmStarMd  from '../assets/images/nav-topbar-star-md.svg'
import amlmStarTex from '../assets/images/nav-topbar-star-texture.png'

// arminLM backend — a Cloudflare Worker that holds the Anthropic key server-side.
// Set VITE_ARMINLM_ENDPOINT in portfolio/.env.local, or replace the fallback URL
// with your deployed Worker URL (see worker/README.md).
const ARMINLM_ENDPOINT =
  import.meta.env.VITE_ARMINLM_ENDPOINT || 'https://arminlm.YOUR-SUBDOMAIN.workers.dev'

// ── amLM: sparkle badge (AI Tag) ─────────────────────────────────────────────
function AmLMTag({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <button className="amlm-tag" onClick={onClick} aria-label="Open amLM">
      <div className="amlm-tag-stars">
        <div className="amlm-tag-star amlm-tag-star--sm">
          <img src={amlmStarSm} alt="" />
          <img src={amlmStarTex} alt="" className="amlm-star-tex" />
        </div>
        <div className="amlm-tag-star amlm-tag-star--lg">
          <img src={amlmStarLg} alt="" />
          <img src={amlmStarTex} alt="" className="amlm-star-tex" />
        </div>
        <div className="amlm-tag-star amlm-tag-star--md">
          <img src={amlmStarMd} alt="" />
          <img src={amlmStarTex} alt="" className="amlm-star-tex" />
        </div>
      </div>
    </button>
  )
}

// ── amLM: chat popup ──────────────────────────────────────────────────────────
// Self-contained: owns its input/answer state and calls the arminLM Worker with
// the selected graphic's id. Mounted per-selected-graphic, so switching graphics
// resets the conversation.
function AmLMPopup({ graphicId, onStop }: { graphicId: string; onStop: (e: React.MouseEvent) => void }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ask = useCallback(async () => {
    const q = question.trim()
    if (!q || loading) return
    setLoading(true); setError(''); setAnswer('')
    try {
      const res = await fetch(ARMINLM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ graphicId, question: q }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Request failed')
      setAnswer((data.answer as string) || '')
    } catch {
      setError('arminLM is offline right now — try again later.')
    } finally {
      setLoading(false)
    }
  }, [question, loading, graphicId])

  return (
    <div className="amlm-popup" onClick={onStop}>
      <span className="amlm-popup-label">ask amLM</span>
      <div className="amlm-popup-input-row">
        <input
          className="amlm-popup-input"
          type="text"
          placeholder="ask anything..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); ask() } }}
          onClick={e => e.stopPropagation()}
          autoFocus
        />
        <button
          className="amlm-popup-send-btn"
          aria-label="Send"
          disabled={loading}
          onClick={e => { e.stopPropagation(); ask() }}
        >
          <img src={amlmSend} alt="" className="amlm-popup-send-icon" />
        </button>
      </div>
      {(loading || answer || error) && (
        <div
          className={`amlm-popup-answer${error ? ' amlm-popup-answer--error' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          {loading ? 'thinking…' : error || answer}
        </div>
      )}
    </div>
  )
}

// ── CV: perimeter tracing — two modes ────────────────────────────────────────
// 'alpha'  — original approach: uses raw alpha channel. Works perfectly for
//            images with true transparent backgrounds (birds, meGreen).
// 'infer'  — background inference: composites each pixel over the page colour
//            (#f7f7f5) and checks perceptual contrast. Handles images whose
//            backgrounds are opaque near-white (Mac, iPod, Wii SVG, guitar).
//            Uses the same simple 2-direction row scan as 'alpha' to avoid the
//            self-intersecting polygon that caused the "double outline" bug.
interface OutlineBbox { minX: number; minY: number; maxX: number; maxY: number }

// ── Shared silhouette registry ───────────────────────────────────────────────
// Every traced graphic registers its silhouette bbox (in element-local %) plus
// the element it's measured against. This lets badge placement for one graphic
// see where all the OTHER graphics actually are, so it can avoid landing the
// badge on top of a neighbouring graphic (the collage overlaps heavily).
const silhouettes = new Map<string, { el: HTMLElement; bbox: OutlineBbox }>()

const BADGE_HALF = 13     // ~26px badge (20px × 1.3 scale) ÷ 2
const BADGE_GAP = 6       // px clearance between silhouette edge and badge
const VIEWPORT_PAD = 10   // keep the badge this far inside the viewport

// Map an element-local % point to viewport coordinates.
function localToViewport(el: HTMLElement, xPct: number, yPct: number) {
  const r = el.getBoundingClientRect()
  return { x: r.left + (xPct / 100) * r.width, y: r.top + (yPct / 100) * r.height }
}

// How many OTHER registered graphics' silhouettes does this viewport point land on?
function foreignOverlap(selfId: string, vx: number, vy: number): number {
  let hits = 0
  for (const [otherId, s] of silhouettes) {
    if (otherId === selfId) continue
    const r = s.el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const lx = ((vx - r.left) / r.width) * 100
    const ly = ((vy - r.top) / r.height) * 100
    if (lx >= s.bbox.minX && lx <= s.bbox.maxX && ly >= s.bbox.minY && ly <= s.bbox.maxY) hits++
  }
  return hits
}

// Pick the optimal badge placement: among the four sides, hug the silhouette in
// whitespace that (1) stays on-screen and (2) doesn't overlap another graphic;
// break ties by the most local whitespace.
function choosePlacement(selfId: string, bbox: OutlineBbox, el: HTMLElement): React.CSSProperties {
  const midX = (bbox.minX + bbox.maxX) / 2
  const midY = (bbox.minY + bbox.maxY) / 2

  type Candidate = {
    style: React.CSSProperties
    vx: number; vy: number   // badge centre in viewport coords
    margin: number           // local whitespace on this side (%)
  }

  const mk = (
    anchorX: number, anchorY: number, transform: string,
    dx: number, dy: number, margin: number,
  ): Candidate => {
    const p = localToViewport(el, anchorX, anchorY)
    return {
      style: { left: `${anchorX}%`, top: `${anchorY}%`, transform },
      vx: p.x + dx, vy: p.y + dy, margin,
    }
  }

  const candidates: Candidate[] = [
    mk(bbox.maxX, midY, `translate(${BADGE_GAP}px, -50%)`,                       BADGE_GAP + BADGE_HALF, 0,  100 - bbox.maxX),
    mk(bbox.minX, midY, `translate(calc(-100% - ${BADGE_GAP}px), -50%)`,        -(BADGE_GAP + BADGE_HALF), 0, bbox.minX),
    mk(midX, bbox.minY, `translate(-50%, calc(-100% - ${BADGE_GAP}px))`,         0, -(BADGE_GAP + BADGE_HALF), bbox.minY),
    mk(midX, bbox.maxY, `translate(-50%, ${BADGE_GAP}px)`,                       0,  BADGE_GAP + BADGE_HALF,    100 - bbox.maxY),
  ]

  let best = candidates[0]
  let bestScore = -Infinity
  for (const c of candidates) {
    const offscreen =
      c.vx < VIEWPORT_PAD || c.vx > window.innerWidth - VIEWPORT_PAD ||
      c.vy < VIEWPORT_PAD || c.vy > window.innerHeight - VIEWPORT_PAD
    // Prefer: on-screen (huge weight) → no graphic overlap (large weight) → whitespace.
    const score = c.margin - foreignOverlap(selfId, c.vx, c.vy) * 1000 - (offscreen ? 100000 : 0)
    if (score > bestScore) { bestScore = score; best = c }
  }
  return best.style
}

function useAlphaOutline(
  ref: React.RefObject<HTMLImageElement | null>,
  mode: 'alpha' | 'infer' = 'alpha',
  graphicId?: string,
): { pts: string; bbox: OutlineBbox | null } {
  const [pts, setPts] = useState('')
  const [bbox, setBbox] = useState<OutlineBbox | null>(null)

  useEffect(() => {
    const img = ref.current
    if (!img) return

    function trace() {
      const W = img!.naturalWidth
      const H = img!.naturalHeight
      if (!W || !H) return

      const scale = Math.min(1, 250 / Math.max(W, H))
      const cw = Math.round(W * scale)
      const ch = Math.round(H * scale)

      const canvas = document.createElement('canvas')
      canvas.width = cw
      canvas.height = ch
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      try {
        if (mode === 'infer') {
          // Pre-fill with page colour so SVG files (no explicit bg) composite
          // onto the right surface before we read pixels.
          ctx.fillStyle = '#f7f7f5'
          ctx.fillRect(0, 0, cw, ch)
        }
        ctx.drawImage(img!, 0, 0, cw, ch)
        const { data } = ctx.getImageData(0, 0, cw, ch)

        const PR = 247, PG = 247, PB = 245

        function isFg(x: number, y: number): boolean {
          if (x < 0 || x >= cw || y < 0 || y >= ch) return false
          const i = (y * cw + x) * 4
          const a = data[i + 3]
          if (mode === 'alpha') return a >= 12
          if (a < 10) return false
          const f = a / 255
          const cr = data[i]   * f + PR * (1 - f)
          const cg = data[i+1] * f + PG * (1 - f)
          const cb = data[i+2] * f + PB * (1 - f)
          return (Math.abs(cr - PR) + Math.abs(cg - PG) + Math.abs(cb - PB)) >= 22
        }

        const N = 56

        // 2-direction row scan — simple left/right per row.
        // This avoids the self-intersecting 4-edge polygon that produced double outlines.
        const left:  Array<[number, number]> = []
        const right: Array<[number, number]> = []
        for (let s = 0; s <= N; s++) {
          const y = Math.round((s / N) * (ch - 1))
          let l = -1, r = -1
          for (let x = 0; x < cw; x++)      if (isFg(x, y)) { l = x; break }
          for (let x = cw - 1; x >= 0; x--) if (isFg(x, y)) { r = x; break }
          if (l !== -1 && r !== -1) {
            left.push([l / cw * 100, y / ch * 100])
            right.push([r / cw * 100, y / ch * 100])
          }
        }

        if (left.length > 2) {
          const allPts = [...left, ...right]
          const xs = allPts.map(([x]) => x)
          const ys = allPts.map(([, y]) => y)
          const minX = Math.min(...xs), minY = Math.min(...ys)
          const maxX = Math.max(...xs), maxY = Math.max(...ys)
          const box = { minX, minY, maxX, maxY }
          setBbox(box)
          setPts([...left, ...right.reverse()]
            .map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`)
            .join(','))

          // Register this silhouette so other graphics can place their badge
          // without overlapping it. Placement itself happens at selection time
          // (choosePlacement) when all graphics are laid out and measurable.
          if (graphicId) silhouettes.set(graphicId, { el: img!, bbox: box })
        }
      } catch { /* CORS / tainted canvas */ }
    }

    if (img.complete && img.naturalWidth > 0) trace()
    else img.addEventListener('load', trace, { once: true })
    return () => {
      img.removeEventListener('load', trace)
      if (graphicId) silhouettes.delete(graphicId)
    }
  }, [ref, mode, graphicId])

  return { pts, bbox }
}

// ── Selectable hero graphic wrapper ──────────────────────────────────────────
interface HeroGraphicProps {
  id: string
  src?: string
  cls?: string
  wrapperCls?: string
  // For complex children (e.g. koi): supply the image to use for outline tracing
  outlineSrc?: string
  mode?: 'alpha' | 'infer'
  selected: string | null
  popupOpen: boolean
  onSelect: (id: string) => void
  onTag: (e: React.MouseEvent) => void
  onPopupStop: (e: React.MouseEvent) => void
  children?: React.ReactNode
}

export function HeroGraphic({ id, src, cls, wrapperCls, outlineSrc, mode = 'alpha', selected, popupOpen, onSelect, onTag, onPopupStop, children }: HeroGraphicProps) {
  const outlineRef = useRef<HTMLImageElement>(null)
  const displayRef = useRef<HTMLImageElement>(null)
  // When children are provided, trace from a dedicated hidden img; otherwise trace the display img
  const tracingRef = (children || outlineSrc) ? outlineRef : displayRef
  const { pts: outlinePts, bbox } = useAlphaOutline(tracingRef, mode, id)
  const isSelected = selected === id

  // Collision-aware placement, computed once the badge is shown (all graphics
  // are laid out by then, so other silhouettes can be consulted).
  const [anchorStyle, setAnchorStyle] = useState<React.CSSProperties>({ right: '4px', top: '4px' })
  useLayoutEffect(() => {
    if (!isSelected || !bbox) return
    const el = tracingRef.current
    if (el) setAnchorStyle(choosePlacement(id, bbox, el))
  }, [isSelected, bbox, id, tracingRef])

  return (
    <div
      className={`hero-selectable${isSelected ? ' is-selected' : ''}${wrapperCls ? ` ${wrapperCls}` : ''}`}
      data-graphic={id}
      onClick={(e) => { e.stopPropagation(); onSelect(id) }}
    >
      {/* Hidden tracing image — used when display content differs from what to trace */}
      {(children || outlineSrc) && (
        <img
          ref={outlineRef}
          src={outlineSrc ?? src}
          alt=""
          aria-hidden
          style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none' }}
        />
      )}
      {children ?? <img ref={displayRef} className={cls} src={src} alt="" aria-hidden />}
      <svg className="hero-sel-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {outlinePts && (
          <polygon
            points={outlinePts}
            fill="none"
            stroke="#18671F"
            strokeWidth="2"
            strokeDasharray="5 3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      {isSelected && (
        <div className="amlm-anchor" style={anchorStyle}>
          <AmLMTag onClick={onTag} />
          {popupOpen && <AmLMPopup graphicId={id} onStop={onPopupStop} />}
        </div>
      )}
    </div>
  )
}

export default function HeroCollage() {
  const [selectedGraphic, setSelectedGraphic] = useState<string | null>(null)
  const [popupOpen, setPopupOpen] = useState(false)

  const handleSelect = useCallback((id: string) => {
    setSelectedGraphic(prev => {
      setPopupOpen(false)
      return prev === id ? null : id
    })
  }, [])
  const handleDeselect = useCallback(() => { setSelectedGraphic(null); setPopupOpen(false) }, [])
  const handleTag = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setPopupOpen(p => !p) }, [])
  const stopProp = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])

  // One-shot entrance: elements start bunched at center and fly to natural positions
  useLayoutEffect(() => {
    const ctx = runHeroEntrance()
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" onClick={handleDeselect}>
      <div className="hero-canvas">
        {/* Content — mirrors Figma auto-layout row: Left Side | Name | Right Side, gap 20 */}
        <div className="hero-content">

          {/* ── Left Side column (565×548) ── */}
          <div className="hero-left-side">
            <img src={heroStarLg} alt="" className="hero-star-lg" aria-hidden />
            <img src={heroStarMd} alt="" className="hero-star-md" aria-hidden />
            <img src={heroStarSm} alt="" className="hero-star-sm" aria-hidden />

            <HeroGraphic id="bird3" src={heroBird3} cls="hero-bird3"
              selected={selectedGraphic} popupOpen={popupOpen}
              onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

            <img src={heroBird2} alt="" className="hero-bird2" aria-hidden />

            <HeroGraphic id="bird1" src={heroBird1} cls="hero-bird1"
              selected={selectedGraphic} popupOpen={popupOpen}
              onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

            <HeroGraphic id="me-green" src={heroMeGreen} cls="hero-me-green"
              selected={selectedGraphic} popupOpen={popupOpen}
              onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

            <HeroGraphic id="mac" src={heroMac} cls="hero-mac" mode="infer"
              selected={selectedGraphic} popupOpen={popupOpen}
              onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

            <HeroGraphic id="wii" src={heroWii} cls="hero-wii" mode="infer"
              selected={selectedGraphic} popupOpen={popupOpen}
              onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />
          </div>

          {/* ── Name — vertically centered by parent align-items: center ── */}
          <div className="hero-name-block">
            <h1 className="hero-name">
              <span className="first">Hi, I'm</span>
              <span className="last">Armin</span>
            </h1>
          </div>

          {/* ── Right Side column (565×548) ── */}
          <div className="hero-right-side">
            <img src={heroMusicNote} alt="" className="hero-music-note hero-music-note--1" aria-hidden />
            <img src={heroMusicNote} alt="" className="hero-music-note hero-music-note--2" aria-hidden />

            <HeroGraphic id="yosemite" src={heroYosemite} cls="hero-yosemite" mode="infer"
              selected={selectedGraphic} popupOpen={popupOpen}
              onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

            <HeroGraphic id="boy" src={heroBoy} cls="hero-boy" mode="infer"
              selected={selectedGraphic} popupOpen={popupOpen}
              onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

            <HeroGraphic id="ipod" src={heroIpod} cls="hero-ipod" mode="infer"
              selected={selectedGraphic} popupOpen={popupOpen}
              onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

            <div className="hero-koi-entrance">
              <HeroGraphic id="koi" outlineSrc={heroKoiBorder} mode="alpha"
                selected={selectedGraphic} popupOpen={popupOpen}
                onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp}>
                <div className="hero-koi-wrap">
                  <img src={heroKoiBorder} alt="" className="hero-koi-paper" aria-hidden draggable={false} />
                  <img src={heroKoiGif} alt="" className="hero-koi-gif" aria-hidden draggable={false} />
                </div>
              </HeroGraphic>
            </div>

            <HeroGraphic id="icon-figma" src={heroIconFigma} cls="hero-icon" mode="infer"
              selected={selectedGraphic} popupOpen={popupOpen}
              onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />
            <HeroGraphic id="icon-react" src={heroIconReact} cls="hero-icon" mode="infer"
              selected={selectedGraphic} popupOpen={popupOpen}
              onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />
            <HeroGraphic id="icon-claude" src={heroIconClaude} cls="hero-icon" mode="infer"
              selected={selectedGraphic} popupOpen={popupOpen}
              onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />
          </div>
        </div>

      </div>
    </section>
  )
}
