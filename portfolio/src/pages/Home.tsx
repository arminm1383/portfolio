import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import './Home.css'
import Navbar from '../components/Navbar'
import CsTopbar from '../components/CsTopbar'

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
import heroKoi         from '../assets/images/koi.gif'
import heroKoiMask     from '../assets/images/hero-koi-mask.png'
import heroKoiBorder   from '../assets/images/hero-koi-border.png'
import heroBoy         from '../assets/images/hero-boy.png'
import heroStarLg      from '../assets/images/hero-star-lg.png'
import heroStarMd      from '../assets/images/hero-star-md.png'
import heroStarSm      from '../assets/images/hero-star-sm.png'
import rocketArtwork     from '../assets/images/rocket-artwork-v2.gif'
import findyGif          from '../assets/images/findy-artwork-v2.gif'
import workStreetsPanel   from '../assets/images/work-streets-projects.png'
import workMementoArtwork from '../assets/images/work-memento-artwork.png'
import amlmSend    from '../assets/images/amlm-send.svg'
import amlmStarSm  from '../assets/images/nav-topbar-star-sm.svg'
import amlmStarLg  from '../assets/images/nav-topbar-star-lg.svg'
import amlmStarMd  from '../assets/images/nav-topbar-star-md.svg'
import amlmStarTex from '../assets/images/nav-topbar-star-texture.png'
import resumePdf from '../assets/images/Armin Mohammadi - Resume.pdf'

import ab2TreeFrame    from '../assets/images/ab2-tree-frame.png'
import ab2TreePhoto    from '../assets/images/ab2-tree-photo.png'
import ab2JumpingFrame from '../assets/images/ab2-jumping-frame.png'
import ab2JumpingPhoto from '../assets/images/ab2-jumping-photo.png'
import ab2TeamFrame    from '../assets/images/ab2-team-frame.png'
import ab2TeamPhoto    from '../assets/images/ab2-team-photo.png'
import ab2MeFrame      from '../assets/images/ab2-me-frame.png'
import ab2MePhoto      from '../assets/images/ab2-me-photo.png'
import ab2CarFrame     from '../assets/images/ab2-car-frame.png'
import ab2CarPhoto1    from '../assets/images/ab2-car-photo1.png'
import ab2CarPhoto2    from '../assets/images/ab2-car-photo2.png'
import ab2FoodFrame    from '../assets/images/ab2-food-frame.png'
import ab2FoodPhoto    from '../assets/images/ab2-food-photo.png'
import ab2AlbumFrame   from '../assets/images/ab2-album-frame.png'
import ab2AlbumPhoto   from '../assets/images/ab2-album-photo.png'
import ab2LucasFrame   from '../assets/images/ab2-lucas-frame.png'
import ab2LucasPhoto1  from '../assets/images/ab2-lucas-photo1.png'
import ab2LucasPhoto2  from '../assets/images/ab2-lucas-photo2.png'
import ab2StarSm       from '../assets/images/ab2-star-sm.svg'
import ab2StarLg       from '../assets/images/ab2-star-lg.svg'
import ab2StarMd       from '../assets/images/ab2-star-md.svg'
import ab2StarTex      from '../assets/images/ab2-star-texture.png'

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
function AmLMPopup({ onStop }: { onStop: (e: React.MouseEvent) => void }) {
  return (
    <div className="amlm-popup" onClick={onStop}>
      <span className="amlm-popup-label">ask amLM</span>
      <div className="amlm-popup-input-row">
        <input
          className="amlm-popup-input"
          type="text"
          placeholder="ask anything..."
          onClick={e => e.stopPropagation()}
          autoFocus
        />
        <button
          className="amlm-popup-send-btn"
          aria-label="Send"
          onClick={e => e.stopPropagation()}
        >
          <img src={amlmSend} alt="" className="amlm-popup-send-icon" />
        </button>
      </div>
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

// WCAG relative luminance + contrast ratio — used to pick the highest-contrast anchor corner
function _wcagLum(r: number, g: number, b: number): number {
  const lin = (c: number) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}
function _contrast(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const l1 = _wcagLum(r1, g1, b1), l2 = _wcagLum(r2, g2, b2)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}
const BADGE_R = 43, BADGE_G = 110, BADGE_B = 42 // #2b6e2a

function useAlphaOutline(
  ref: React.RefObject<HTMLImageElement | null>,
  mode: 'alpha' | 'infer' = 'alpha',
): { pts: string; bbox: OutlineBbox | null; anchorPos: [number, number] | null } {
  const [pts, setPts] = useState('')
  const [bbox, setBbox] = useState<OutlineBbox | null>(null)
  const [anchorPos, setAnchorPos] = useState<[number, number] | null>(null)

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
          setBbox({ minX, minY, maxX, maxY })
          setPts([...left, ...right.reverse()]
            .map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`)
            .join(','))

          // ── Contrast-based anchor placement ──────────────────────────────
          // Sample background pixels just outside each bbox corner, then pick
          // the corner where badge green (#2b6e2a) has the highest WCAG contrast.
          const PAD = Math.max(3, Math.round(Math.min(cw, ch) * 0.06))

          function sampleBgAt(cx: number, cy: number): [number, number, number] {
            let sr = 0, sg = 0, sb = 0, n = 0
            for (let dy = -PAD; dy <= PAD; dy++) {
              for (let dx = -PAD; dx <= PAD; dx++) {
                const px = cx + dx, py = cy + dy
                if (px < 0 || px >= cw || py < 0 || py >= ch) continue
                if (isFg(px, py)) continue
                const i = (py * cw + px) * 4
                const a = data[i + 3], f = a / 255
                sr += data[i]   * f + PR * (1 - f)
                sg += data[i+1] * f + PG * (1 - f)
                sb += data[i+2] * f + PB * (1 - f)
                n++
              }
            }
            return n > 0 ? [sr / n, sg / n, sb / n] : [PR, PG, PB]
          }

          // Four candidates: [pctX, pctY, samplePixelX, samplePixelY]
          const candidates: Array<[number, number, number, number]> = [
            [maxX, minY, Math.round(maxX / 100 * cw) + PAD, Math.round(minY / 100 * ch) - PAD],
            [minX, minY, Math.round(minX / 100 * cw) - PAD, Math.round(minY / 100 * ch) - PAD],
            [maxX, maxY, Math.round(maxX / 100 * cw) + PAD, Math.round(maxY / 100 * ch) + PAD],
            [minX, maxY, Math.round(minX / 100 * cw) - PAD, Math.round(maxY / 100 * ch) + PAD],
          ]

          let bestX = maxX, bestY = minY, bestContrast = 0
          for (const [px, py, cpx, cpy] of candidates) {
            const [r, g, b] = sampleBgAt(cpx, cpy)
            const cr = _contrast(BADGE_R, BADGE_G, BADGE_B, r, g, b)
            if (cr > bestContrast) { bestContrast = cr; bestX = px; bestY = py }
          }
          setAnchorPos([bestX, bestY])
        }
      } catch (_) { /* CORS / tainted canvas */ }
    }

    if (img.complete && img.naturalWidth > 0) trace()
    else {
      img.addEventListener('load', trace, { once: true })
      return () => img.removeEventListener('load', trace)
    }
  }, [ref, mode])

  return { pts, bbox, anchorPos }
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

function HeroGraphic({ id, src, cls, wrapperCls, outlineSrc, mode = 'alpha', selected, popupOpen, onSelect, onTag, onPopupStop, children }: HeroGraphicProps) {
  const outlineRef = useRef<HTMLImageElement>(null)
  const displayRef = useRef<HTMLImageElement>(null)
  // When children are provided, trace from a dedicated hidden img; otherwise trace the display img
  const tracingRef = (children || outlineSrc) ? outlineRef : displayRef
  const { pts: outlinePts, anchorPos } = useAlphaOutline(tracingRef, mode)
  const isSelected = selected === id

  const anchorStyle: React.CSSProperties = anchorPos
    ? { left: `${anchorPos[0]}%`, top: `${anchorPos[1]}%`, transform: 'translate(-50%, -50%)' }
    : { right: '4px', top: '4px' }

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
          {popupOpen && <AmLMPopup onStop={onPopupStop} />}
        </div>
      )}
    </div>
  )
}

interface WorkCardProps {
  artwork?: string
  artworkAlt?: string
  title: string
  description: string
  isGif?: boolean
  to?: string
  href?: string
  bgColor?: string
  panel?: string
  objectFit?: 'cover' | 'contain'
  objectPosition?: string
  graphicId?: string
  selected?: string | null
  popupOpen?: boolean
  onSelect?: (id: string) => void
  onTag?: (e: React.MouseEvent) => void
  onPopupStop?: (e: React.MouseEvent) => void
}

function WorkCard({ artwork, artworkAlt, title, description, isGif, to, href, bgColor, panel, objectFit = 'cover', objectPosition, graphicId, selected, popupOpen, onSelect, onTag, onPopupStop }: WorkCardProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const nullRef = useRef<HTMLImageElement | null>(null)
  const isSelected = Boolean(graphicId && selected === graphicId)
  const { pts: outlinePts, anchorPos } = useAlphaOutline(graphicId ? imgRef : nullRef, 'infer')

  const anchorStyle: React.CSSProperties = anchorPos
    ? { left: `${anchorPos[0]}%`, top: `${anchorPos[1]}%`, transform: 'translate(-50%, -50%)' }
    : { right: '4px', top: '4px' }

  useEffect(() => {
    if (!isGif) return
    const img = imgRef.current
    if (!img) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && img) {
          const src = img.src
          img.src = ''
          img.src = src
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(img)
    return () => observer.disconnect()
  }, [isGif])

  const cursorVariant = to ? 'case-study' : href ? 'devpost' : 'coming-soon'

  const content = (
    <>
      <div
        className={`work-card-artwork${isSelected ? ' is-selected' : ''}`}
        style={bgColor ? { backgroundColor: bgColor } : undefined}
        {...(graphicId && onSelect ? {
          'data-graphic': graphicId,
          onClick: (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); onSelect(graphicId) },
        } : {})}
      >
        {artwork && (
          <img
            ref={imgRef}
            src={artwork}
            alt={artworkAlt ?? ''}
            style={{ objectFit, objectPosition: objectPosition ?? undefined }}
          />
        )}
        {panel && (
          <div className="work-card-panel">
            <div className="work-card-panel-inner">
              <img src={panel} alt="" />
            </div>
          </div>
        )}
        <div className="work-card-artwork-inset" aria-hidden />
        {graphicId && (
          <svg className="hero-sel-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {outlinePts && (
              <polygon points={outlinePts} fill="none" stroke="#18671F" strokeWidth="2"
                strokeDasharray="5 3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            )}
          </svg>
        )}
        {isSelected && graphicId && (
          <div className="amlm-anchor" style={anchorStyle}>
            <AmLMTag onClick={onTag!} />
            {popupOpen && <AmLMPopup onStop={onPopupStop!} />}
          </div>
        )}
      </div>
      <div className="work-card-content">
        <h2 className="work-card-title">{title}</h2>
        <p className="work-card-description">{description}</p>
      </div>
    </>
  )

  if (to) {
    return (
      <Link to={to} className="work-card" data-cursor={cursorVariant}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="work-card" data-cursor={cursorVariant}>
        {content}
      </a>
    )
  }

  return (
    <div className="work-card" data-cursor={cursorVariant}>
      {content}
    </div>
  )
}

export default function Home() {
  // 0 = hero, 1 = works, 2 = about
  const [page, setPage] = useState(0)
  const [worksKey, setWorksKey] = useState(0)
  const [selectedGraphic, setSelectedGraphic] = useState<string | null>(null)
  const [popupOpen, setPopupOpen] = useState(false)
  const [navbarRevealed, setNavbarRevealed] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)

  const handleSelect = useCallback((id: string) => {
    setSelectedGraphic(prev => {
      setPopupOpen(false)
      return prev === id ? null : id
    })
  }, [])
  const handleDeselect = useCallback(() => { setSelectedGraphic(null); setPopupOpen(false) }, [])
  const handleTag = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setPopupOpen(p => !p) }, [])
  const stopProp = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])

  const worksRef = useRef<HTMLElement>(null)
  const aboutScaleRef = useRef<HTMLDivElement>(null)

  const transitioning = useRef(false)
  const atTopSince    = useRef<number | null>(null)
  const atBottomSince = useRef<number | null>(null)
  const arrivedAt     = useRef(0)
  const lastWheelTime = useRef(0)
  const lastWheelDir  = useRef(0)
  const TOP_COOLDOWN  = 500
  const WHEEL_SETTLE  = 900
  const SCROLL_GAP    = 200

  const goTo = useCallback((p: number) => {
    if (transitioning.current) return
    transitioning.current = true
    arrivedAt.current = Date.now()
    atTopSince.current = (p === 1) ? Date.now() : null
    atBottomSince.current = null
    if (p === 1) setWorksKey(k => k + 1)
    setPage(p)
    setTimeout(() => { transitioning.current = false }, 700)
  }, [])

  // Works internal-scroll tracking — gates transitions at top/bottom edges
  useEffect(() => {
    const works = worksRef.current
    if (!works || page !== 1) return
    const onScroll = () => {
      if (works.scrollTop === 0) {
        if (atTopSince.current === null) atTopSince.current = Date.now()
      } else {
        atTopSince.current = null
      }
      const atBottom = works.scrollTop + works.clientHeight >= works.scrollHeight - 1
      if (atBottom) {
        if (atBottomSince.current === null) atBottomSince.current = Date.now()
      } else {
        atBottomSince.current = null
      }
    }
    const atBottom = works.scrollTop + works.clientHeight >= works.scrollHeight - 1
    if (atBottom) atBottomSince.current = Date.now()
    works.addEventListener('scroll', onScroll, { passive: true })
    return () => works.removeEventListener('scroll', onScroll)
  }, [page])

  // Canvas is aspect-ratio based — no JS scale needed

  // Hero — one-shot entrance animation. Elements start bunched at center, fly to natural positions.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const leftEl = document.querySelector('.hero-left-side') as HTMLElement
      const S = leftEl ? leftEl.offsetWidth * 0.58 : 328.5

      // Snap everything to starting positions immediately (before any animation)
      gsap.set('.hero-star-lg, .hero-star-md, .hero-star-sm, .hero-bird3, .hero-bird2, .hero-bird1, .hero-me-green, .hero-mac, .hero-wii', { x: S })
      gsap.set('.hero-koi-wrap, .hero-yosemite, .hero-ipod, .hero-boy, .hero-music-note--1, .hero-music-note--2', { x: -S })
      gsap.set('.hero-selectable[data-graphic="icon-figma"] .hero-icon, .hero-selectable[data-graphic="icon-react"] .hero-icon, .hero-selectable[data-graphic="icon-claude"] .hero-icon', { x: -S })
      gsap.set('.hero-name-block', { opacity: 0 })
      gsap.set('.cs-topbar', { y: -80 })

      // t = [0, holdEnd, flyEnd, settleEnd, 1], D = 2s. holdEnd becomes start delay.
      function enter(sel: string, mid: number, t: number[]) {
        const D = 2
        const tl = gsap.timeline({ delay: t[1] * D })
        tl.to(sel, { x: mid, duration: (t[2] - t[1]) * D, ease: 'expo.out'     })
        tl.to(sel, { x: 0,   duration: (t[3] - t[2]) * D, ease: 'power2.inOut' })
      }

      // ── Left side: slide in from the right ───────────────────────────────────────
      enter('.hero-star-lg',  10, [0, 0.4905, 0.92, 1.04, 1])
      enter('.hero-star-md',  13, [0, 0.4905, 0.93, 1.05, 1])
      enter('.hero-star-sm',  16, [0, 0.4905, 0.94, 1.06, 1])
      enter('.hero-bird3',    10, [0, 0.525,  0.95, 1.07, 1])
      enter('.hero-bird2',    13, [0, 0.525,  0.96, 1.08, 1])
      enter('.hero-bird1',    16, [0, 0.525,  0.97, 1.09, 1])
      enter('.hero-me-green', 10, [0, 0.531,  0.98, 1.10, 1])
      enter('.hero-mac',      13, [0, 0.542,  0.99, 1.11, 1])
      enter('.hero-wii',      16, [0, 0.531,  1.00, 1.12, 1])

      // ── Right side: slide in from the left ───────────────────────────────────────
      enter('.hero-koi-wrap',      -10, [0, 0.505,  0.925, 1.045, 1])
      enter('.hero-yosemite',      -13, [0, 0.49,   0.94,  1.06,  1])
      enter('.hero-ipod',          -16, [0, 0.5105, 0.955, 1.075, 1])
      enter('.hero-boy',           -10, [0, 0.5105, 0.97,  1.09,  1])
      enter('.hero-music-note--1', -13, [0, 0.5105, 0.985, 1.105, 1])
      enter('.hero-music-note--2', -13, [0, 0.5105, 0.985, 1.105, 1])
      const IT = [0, 0.495, 1.00, 1.12, 1]
      enter('.hero-selectable[data-graphic="icon-figma"]  .hero-icon',  -16, IT)
      enter('.hero-selectable[data-graphic="icon-react"]  .hero-icon',  -16, IT)
      enter('.hero-selectable[data-graphic="icon-claude"] .hero-icon',  -16, IT)

      // ── Name: fade in while elements are mid-flight ───────────────────────────────
      gsap.to('.hero-name-block', { opacity: 1, duration: 0.76, ease: 'power3.out', delay: 1.15 })

      // ── Top navbar: reveal after elements settle ─────────────────────────────────
      gsap.to('.cs-topbar', { y: 0, duration: 0.55, ease: 'power3.out', delay: 2.20 })
    })
    return () => ctx.revert()
  }, [])

  // Bottom navbar — reveal in sync with cs-topbar (2.20s delay, 0.60s fade)
  useEffect(() => {
    const t = setTimeout(() => setNavbarRevealed(true), 2200)
    return () => clearTimeout(t)
  }, [])

  // Work cards animate in each time Works becomes active
  useEffect(() => {
    if (page !== 1) return
    gsap.fromTo('.work-card',
      { opacity: 0 },
      { opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power2.out', delay: 0.15 }
    )
  }, [page, worksKey])


  // About section — scale to fit viewport, leaving room for the fixed topbar
  useEffect(() => {
    const update = () => {
      const el = aboutScaleRef.current
      if (!el) return
      // 64px = topbar (top:12 + height:44) + 8px gap
      const navH = 64
      const scale = Math.min(1, (window.innerWidth - 176) / 1472, (window.innerHeight - navH) / 887)
      el.style.zoom = String(scale)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Wheel handler — drives page transitions
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const now = Date.now()
      const gap = now - lastWheelTime.current
      const dir = e.deltaY > 0 ? 1 : -1
      const dirChanged = lastWheelDir.current !== 0 && dir !== lastWheelDir.current
      lastWheelTime.current = now
      lastWheelDir.current = dir

      if (now - arrivedAt.current < WHEEL_SETTLE) return

      // Hero is non-scrollable — only advance on fresh gestures (not trackpad momentum)
      if (page === 0 && gap < SCROLL_GAP && !dirChanged) return

      if (page === 0 && e.deltaY > 0) { goTo(1); return }

      if (page === 1 && e.deltaY < 0) {
        const works = worksRef.current
        if (!works) return
        const settled = atTopSince.current
        if (works.scrollTop === 0 && settled !== null && Date.now() - settled >= TOP_COOLDOWN) goTo(0)
        return
      }
      if (page === 1 && e.deltaY > 0) {
        const works = worksRef.current
        if (!works) return
        const settled = atBottomSince.current
        if (settled !== null && Date.now() - settled >= TOP_COOLDOWN) goTo(2)
        return
      }

      // About page has no internal scroll — use gap-based debounce like hero
      if (page === 2 && e.deltaY < 0) {
        if (gap < SCROLL_GAP && !dirChanged) return
        goTo(1); return
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [page, goTo])

  // Touch swipe handler
  useEffect(() => {
    let startY = 0
    let startedAtTop = false
    let startedAtBottom = false

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      const works = worksRef.current
      if (page === 1 && works) {
        startedAtTop    = works.scrollTop === 0
        startedAtBottom = works.scrollTop + works.clientHeight >= works.scrollHeight - 1
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY
      if (page === 0 && dy > 40)                     { goTo(1); return }
      if (page === 1 && dy < -40 && startedAtTop)    { goTo(0); return }
      if (page === 1 && dy > 40  && startedAtBottom) { goTo(2); return }
      if (page === 2 && dy < -40) { goTo(1); return }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
    }
  }, [page, goTo])


  return (
    <>
      <CsTopbar showAtTop visible={page === 0} />
      <div className="home-clip">
        <div
          className="home"
          style={{
            transform: `translateY(${page * -100}vh)`,
            transition: 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)',
          }}
        >
          {/* ── Hero ──────────────────────────────────────────────────────── */}
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

                  <HeroGraphic id="koi" outlineSrc={heroKoiBorder} mode="alpha"
                    selected={selectedGraphic} popupOpen={popupOpen}
                    onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp}>
                    <div className="hero-koi-wrap">
                      <img src={heroKoiBorder} alt="" className="hero-koi-border-bg" aria-hidden />
                      <div
                        className="hero-koi-gif-layer"
                        style={{
                          maskImage: `url(${heroKoiMask})`,
                          WebkitMaskImage: `url(${heroKoiMask})`,
                          maskSize: 'cover',
                          WebkitMaskSize: 'cover',
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskPosition: 'center',
                        }}
                      >
                        <img src={heroKoi} alt="" aria-hidden />
                      </div>

                    </div>
                  </HeroGraphic>

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

          {/* ── Works grid ────────────────────────────────────────────────── */}
          <section className="works" ref={worksRef} onClick={handleDeselect}>
            <div className="works-nav-spacer" />
            <div className="works-grid" key={worksKey}>
              <WorkCard
                artwork={rocketArtwork}
                artworkAlt="Rocket Lawyer"
                title="Rocket Lawyer"
                description="Redefining AI software through data-driven research"
                isGif
                to="/work/rocket-lawyer"
                objectPosition="center"
                graphicId="work-rocket"
                selected={selectedGraphic}
                popupOpen={popupOpen}
                onSelect={handleSelect}
                onTag={handleTag}
                onPopupStop={stopProp}
              />
              <WorkCard
                bgColor="#369af1"
                panel={workStreetsPanel}
                title="Streets"
                description="Design-engineering enterprise B2B software"
              />
              <WorkCard
                artwork={findyGif}
                artworkAlt="Findy"
                title="Findy"
                description="A case-competition winning solution built for elders, tested by elders"
                isGif
                to="/work/findy"
                objectPosition="center"
                graphicId="work-findy"
                selected={selectedGraphic}
                popupOpen={popupOpen}
                onSelect={handleSelect}
                onTag={handleTag}
                onPopupStop={stopProp}
              />
              <WorkCard
                artwork={workMementoArtwork}
                artworkAlt="Memento"
                title="Memento"
                description="Connecting memories through emerging interfaces"
                bgColor="#1b130f"
                objectFit="contain"
                href="https://devpost.com/software/memento-3p1kjl"
                graphicId="work-memento"
                selected={selectedGraphic}
                popupOpen={popupOpen}
                onSelect={handleSelect}
                onTag={handleTag}
                onPopupStop={stopProp}
              />
            </div>
          </section>

          {/* ── About Me ─────────────────────────────────────────────── */}
          <section className="about-section" onClick={handleDeselect}>
            <div className="ab2-nav-spacer" />
            <div className="ab2-scale-wrap" ref={aboutScaleRef}>
            <div className="ab2-main">
              <div className="ab2-content">

                {/* Graphics */}
                <div className="ab2-graphics">
                  <div className="ab2-images">

                    {/* jumping — z:1/2 */}
                    <div className="ab2-frame-wrap ab2-jumping-frame-wrap">
                      <div className="ab2-frame-inner ab2-jumping-frame-inner">
                        <img src={ab2JumpingFrame} alt="" />
                      </div>
                    </div>
                    <HeroGraphic id="ab2-jumping" src={ab2JumpingPhoto} mode="infer" wrapperCls="ab2-photo ab2-jumping-photo" selected={selectedGraphic} popupOpen={popupOpen} onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                    {/* findy-team — z:3/4 */}
                    <div className="ab2-frame-wrap ab2-team-frame-wrap">
                      <div className="ab2-frame-inner ab2-team-frame-inner">
                        <img src={ab2TeamFrame} alt="" />
                      </div>
                    </div>
                    <HeroGraphic id="ab2-team" src={ab2TeamPhoto} mode="infer" wrapperCls="ab2-photo ab2-team-photo" selected={selectedGraphic} popupOpen={popupOpen} onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                    {/* me — z:5/6 */}
                    <div className="ab2-frame-wrap ab2-me-frame-wrap">
                      <div className="ab2-frame-inner ab2-me-frame-inner">
                        <img src={ab2MeFrame} alt="" />
                      </div>
                    </div>
                    <HeroGraphic id="ab2-me" src={ab2MePhoto} mode="infer" wrapperCls="ab2-photo ab2-me-photo" selected={selectedGraphic} popupOpen={popupOpen} onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                    {/* car — z:7/8/9 */}
                    <div className="ab2-frame-wrap ab2-car-frame-wrap">
                      <div className="ab2-frame-inner ab2-car-frame-inner">
                        <img src={ab2CarFrame} alt="" />
                      </div>
                    </div>
                    <HeroGraphic id="ab2-car1" src={ab2CarPhoto1} mode="infer" wrapperCls="ab2-photo ab2-car-photo1" selected={selectedGraphic} popupOpen={popupOpen} onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />
                    <HeroGraphic id="ab2-car2" src={ab2CarPhoto2} mode="infer" wrapperCls="ab2-photo ab2-car-photo2" selected={selectedGraphic} popupOpen={popupOpen} onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                    {/* food — z:10/11 */}
                    <div className="ab2-frame-wrap ab2-food-frame-wrap">
                      <div className="ab2-frame-inner ab2-food-frame-inner">
                        <img src={ab2FoodFrame} alt="" />
                      </div>
                    </div>
                    <HeroGraphic id="ab2-food" src={ab2FoodPhoto} mode="infer" wrapperCls="ab2-photo ab2-food-photo" selected={selectedGraphic} popupOpen={popupOpen} onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                    {/* tree — z:12/13 — above me/selfie and food */}
                    <div className="ab2-frame-wrap ab2-tree-frame-wrap">
                      <div className="ab2-frame-inner ab2-tree-frame-inner">
                        <img src={ab2TreeFrame} alt="" />
                      </div>
                    </div>
                    <HeroGraphic id="ab2-tree" src={ab2TreePhoto} mode="infer" wrapperCls="ab2-photo ab2-tree-photo" selected={selectedGraphic} popupOpen={popupOpen} onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                    {/* album — z:16/17 */}
                    <div className="ab2-frame-wrap ab2-album-frame-wrap">
                      <div className="ab2-frame-inner ab2-album-frame-inner">
                        <img src={ab2AlbumFrame} alt="" />
                      </div>
                    </div>
                    <HeroGraphic id="ab2-album" src={ab2AlbumPhoto} mode="infer" wrapperCls="ab2-photo ab2-album-photo" selected={selectedGraphic} popupOpen={popupOpen} onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                    {/* lucas — z:16/17/18 */}
                    <div className="ab2-frame-wrap ab2-lucas-frame-wrap">
                      <div className="ab2-frame-inner ab2-lucas-frame-inner">
                        <img src={ab2LucasFrame} alt="" />
                      </div>
                    </div>
                    <HeroGraphic id="ab2-lucas1" src={ab2LucasPhoto1} mode="infer" wrapperCls="ab2-photo ab2-lucas-photo1" selected={selectedGraphic} popupOpen={popupOpen} onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />
                    <HeroGraphic id="ab2-lucas2" src={ab2LucasPhoto2} mode="infer" wrapperCls="ab2-photo ab2-lucas-photo2" selected={selectedGraphic} popupOpen={popupOpen} onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                    {/* Stars — z:20 */}
                    <div className="ab2-star ab2-star-sm" aria-hidden>
                      <img src={ab2StarSm} alt="" />
                      <img src={ab2StarTex} alt="" className="ab2-star-tex" />
                    </div>
                    <div className="ab2-star ab2-star-lg" aria-hidden>
                      <img src={ab2StarLg} alt="" />
                      <img src={ab2StarTex} alt="" className="ab2-star-tex" />
                    </div>
                    <div className="ab2-star ab2-star-md" aria-hidden>
                      <img src={ab2StarMd} alt="" />
                      <img src={ab2StarTex} alt="" className="ab2-star-tex" />
                    </div>

                  </div>
                </div>

                {/* Text */}
                <div className="ab2-text">
                  <p className="ab2-heading">About Me</p>
                  <p className="ab2-bio">
                    From the stories 6-year old me used to doodle in my journal to the case study stories I inspire my audience to connect with, I've always been a story teller. This imaginative and creative side has always been innate to me, and it is this natural passion that made me fall in love with product design.
                  </p>
                  <p className="ab2-bio">
                    Living around such diverse perspectives, I want my stories to not just reflect my craft but to also reflect the journeys, culture, and individuality that continues to excite me to connect with others every single day.
                  </p>
                </div>

              </div>
            </div>

            {/* Footer */}
            {/* <div className="ab2-footer">
              <div className="ab2-footer-divider" />
              <p className="ab2-footer-email">arminmohammadi1342@gmail.com</p>
            </div> */}
            </div> {/* ab2-scale-wrap */}
          </section>

        </div>
      </div>

      <Navbar
        onWork={() => goTo(1)}
        onAbout={() => goTo(2)}
        onResume={() => setResumeOpen(true)}
        revealed={navbarRevealed}
      />

      {resumeOpen && (
        <div className="resume-modal-overlay" onClick={() => setResumeOpen(false)}>
          <div className="resume-modal" onClick={e => e.stopPropagation()}>
            <button className="resume-modal-close" onClick={() => setResumeOpen(false)} aria-label="Close resume">✕</button>
            <iframe
              className="resume-modal-frame"
              src={resumePdf}
              title="Armin Mohammadi Resume"
            />
          </div>
        </div>
      )}
    </>
  )
}
