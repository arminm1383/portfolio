import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import './Home.css'
import Navbar from '../components/Navbar'
import CsTopbar from '../components/CsTopbar'

import heroGuitar  from '../assets/images/hero-guitar.png'
import heroMac     from '../assets/images/hero-mac.png'
import heroMeGreen from '../assets/images/hero-me-green.png'
import heroWii     from '../assets/images/hero-wii.svg'
import heroIpod    from '../assets/images/hero-ipod.png'
import heroBird1   from '../assets/images/hero-bird1.png'
import heroBird2   from '../assets/images/hero-bird2.png'
import heroBird3   from '../assets/images/hero-bird3.png'
import rocketArtwork     from '../assets/images/rocket-artwork-v2.gif'
import findyGif          from '../assets/images/findy-artwork-v2.gif'
import workStreetsPanel   from '../assets/images/work-streets-projects.jpg'
import workMementoArtwork from '../assets/images/work-memento-artwork.png'
import individualStar from '../assets/images/individual-star.svg'
import amlmSend    from '../assets/images/amlm-send.svg'
import amlmStarSm  from '../assets/images/nav-topbar-star-sm.svg'
import amlmStarLg  from '../assets/images/nav-topbar-star-lg.svg'
import amlmStarMd  from '../assets/images/nav-topbar-star-md.svg'
import amlmStarTex from '../assets/images/nav-topbar-star-texture.png'

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

function useAlphaOutline(
  ref: React.RefObject<HTMLImageElement | null>,
  mode: 'alpha' | 'infer' = 'alpha',
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
          setBbox({
            minX: Math.min(...xs),
            minY: Math.min(...ys),
            maxX: Math.max(...xs),
            maxY: Math.max(...ys),
          })
          setPts([...left, ...right.reverse()]
            .map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`)
            .join(','))
        }
      } catch (_) { /* CORS / tainted canvas */ }
    }

    if (img.complete && img.naturalWidth > 0) trace()
    else {
      img.addEventListener('load', trace, { once: true })
      return () => img.removeEventListener('load', trace)
    }
  }, [ref, mode])

  return { pts, bbox }
}

// ── Selectable hero graphic wrapper ──────────────────────────────────────────
interface HeroGraphicProps {
  id: string
  src: string
  cls: string
  mode?: 'alpha' | 'infer'
  selected: string | null
  popupOpen: boolean
  onSelect: (id: string) => void
  onTag: (e: React.MouseEvent) => void
  onPopupStop: (e: React.MouseEvent) => void
}

function HeroGraphic({ id, src, cls, mode = 'alpha', selected, popupOpen, onSelect, onTag, onPopupStop }: HeroGraphicProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const { pts: outlinePts, bbox } = useAlphaOutline(imgRef, mode)
  const isSelected = selected === id

  const anchorStyle: React.CSSProperties = bbox
    ? { left: `${bbox.maxX}%`, top: `${bbox.minY}%`, transform: 'translate(-50%, -50%)' }
    : { right: '4px', top: '4px' }

  return (
    <div
      className={`hero-selectable${isSelected ? ' is-selected' : ''}`}
      data-graphic={id}
      onClick={(e) => { e.stopPropagation(); onSelect(id) }}
    >
      <img ref={imgRef} className={cls} src={src} alt="" aria-hidden />
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
}

function WorkCard({ artwork, artworkAlt, title, description, isGif, to, href, bgColor, panel, objectFit = 'cover' }: WorkCardProps) {
  const imgRef = useRef<HTMLImageElement>(null)

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
      <div className="work-card-artwork" style={bgColor ? { backgroundColor: bgColor } : undefined}>
        {artwork && (
          <img
            ref={imgRef}
            src={artwork}
            alt={artworkAlt ?? ''}
            style={objectFit === 'contain' ? { objectFit: 'contain' } : undefined}
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
  // 0 = hero, 1 = works, 2 = footer
  const [page, setPage] = useState(0)
  const [worksKey, setWorksKey] = useState(0)
  const [resumeOpen, setResumeOpen] = useState(false)
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

  const worksRef        = useRef<HTMLElement>(null)
  const resumeFooterRef = useRef<HTMLElement>(null)

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
    atTopSince.current = (p === 1 || p === 2) ? Date.now() : null
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

  // Resume+footer internal-scroll tracking — only gates the go-back-to-works transition
  useEffect(() => {
    const section = resumeFooterRef.current
    if (!section || page !== 2) return
    const onScroll = () => {
      if (section.scrollTop === 0) {
        if (atTopSince.current === null) atTopSince.current = Date.now()
      } else {
        atTopSince.current = null
      }
    }
    section.addEventListener('scroll', onScroll, { passive: true })
    return () => section.removeEventListener('scroll', onScroll)
  }, [page])


  // Keep hero canvas scaled to fit the viewport while preserving Figma proportions
  useLayoutEffect(() => {
    function updateScale() {
      const scale = Math.min(window.innerWidth / 1648, window.innerHeight / 890)
      document.documentElement.style.setProperty('--hero-scale', scale.toString())
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // Hero entrance timeline — fires once on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-topnav',       { opacity: 0, y: -10, duration: 0.75 }, 0.05)
      tl.from(['.hero-bird1', '.hero-bird2', '.hero-bird3'],
                                    { opacity: 0, y: -10, duration: 0.7, stagger: 0.07 }, 0.08)
      tl.from('.hero-me-green',      { opacity: 0, x: -20, duration: 0.8 }, 0.15)
      tl.from('.hero-wii',          { opacity: 0, x: -20, duration: 0.8 }, 0.18)
      tl.from('.hero-ipod',         { opacity: 0, x: 20,  duration: 0.8 }, 0.18)
      tl.from(['.hero-mac', '.hero-guitar'],
                                    { opacity: 0, y: 20,  duration: 0.8, stagger: 0.05 }, 0.22)
      tl.from('.hero-arrow',        { opacity: 0, scale: 0.5, duration: 0.5 }, 0.55)
      tl.from('.hero-name-block',   { opacity: 0, y: 10,  duration: 0.75 }, 0.2)
      tl.fromTo('.hero-star',
        { opacity: 0, scale: 0.3 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' },
        0.45
      )
      tl.from('.navbar', { opacity: 0, y: 12, duration: 0.75 }, 0.68)
    })
    return () => ctx.revert()
  }, [])

  // Work cards animate in each time Works becomes active
  useEffect(() => {
    if (page !== 1) return
    gsap.fromTo('.work-card',
      { opacity: 0 },
      { opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power2.out', delay: 0.15 }
    )
  }, [page, worksKey])


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

      if (page === 2 && e.deltaY < 0) {
        const section = resumeFooterRef.current
        if (!section) return
        const settled = atTopSince.current
        if (section.scrollTop === 0 && settled !== null && Date.now() - settled >= TOP_COOLDOWN) goTo(1)
        return
      }
      // page 2 scrolling down: native scroll handles showing footer — no snap target beyond
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
      const rf = resumeFooterRef.current
      if (page === 2 && rf) {
        startedAtTop    = rf.scrollTop === 0
        startedAtBottom = rf.scrollTop + rf.clientHeight >= rf.scrollHeight - 1
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY
      if (page === 0 && dy > 40)                     { goTo(1); return }
      if (page === 1 && dy < -40 && startedAtTop)    { goTo(0); return }
      if (page === 1 && dy > 40  && startedAtBottom) { goTo(2); return }
      if (page === 2 && dy < -40 && startedAtTop)    { goTo(1) }
      // page 2 swipe down at bottom: no more pages
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
      <CsTopbar />
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
              <HeroGraphic id="bird2"    src={heroBird2}   cls="hero-bird2"
                selected={selectedGraphic} popupOpen={popupOpen}
                onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

              <HeroGraphic id="bird1"    src={heroBird1}   cls="hero-bird1"
                selected={selectedGraphic} popupOpen={popupOpen}
                onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

              <HeroGraphic id="bird3"    src={heroBird3}   cls="hero-bird3"
                selected={selectedGraphic} popupOpen={popupOpen}
                onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

              <HeroGraphic id="wii"      src={heroWii}     cls="hero-wii"      mode="infer"
                selected={selectedGraphic} popupOpen={popupOpen}
                onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

              <HeroGraphic id="me-green" src={heroMeGreen} cls="hero-me-green"
                selected={selectedGraphic} popupOpen={popupOpen}
                onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

              <HeroGraphic id="ipod"     src={heroIpod}    cls="hero-ipod"    mode="infer"
                selected={selectedGraphic} popupOpen={popupOpen}
                onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

              <HeroGraphic id="mac"      src={heroMac}     cls="hero-mac"     mode="infer"
                selected={selectedGraphic} popupOpen={popupOpen}
                onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

              <HeroGraphic id="guitar"   src={heroGuitar}  cls="hero-guitar"  mode="infer"
                selected={selectedGraphic} popupOpen={popupOpen}
                onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

              {/* Star ring */}
              <div className="hero-stars" aria-hidden>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <img key={n} className={`hero-star hero-star--${n}`} src={individualStar} alt="" />
                ))}
              </div>

              {/* Name text */}
              <div className="hero-name-block">
                <h1 className="hero-name">
                  <span className="first">hi, i'm</span>
                  <span className="last">armin</span>
                </h1>
              </div>
            </div>
          </section>

          {/* ── Works grid ────────────────────────────────────────────────── */}
          <section className="works" ref={worksRef}>
            <div className="works-header">
              <h2 className="works-heading">featured work</h2>
              <p className="works-subtitle">a collection of some of my latest projects</p>
            </div>
            <div className="works-grid" key={worksKey}>
              <WorkCard
                artwork={rocketArtwork}
                artworkAlt="Rocket Lawyer"
                title="Rocket Lawyer"
                description="redefining AI software through data-driven research"
                isGif
                to="/work/rocket-lawyer"
              />
              <WorkCard
                bgColor="#369af1"
                panel={workStreetsPanel}
                title="Streets"
                description="design engineering enterprise B2B software"
              />
              <WorkCard
                artwork={findyGif}
                artworkAlt="Findy"
                title="Findy"
                description="a case-competition winning solution built for elders, tested by elders"
                isGif
                to="/work/findy"
              />
              <WorkCard
                artwork={workMementoArtwork}
                artworkAlt="Memento"
                title="Memento"
                description="connecting memories through emerging interfaces"
                bgColor="#1b130f"
                objectFit="contain"
                href="https://devpost.com/software/memento-3p1kjl"
              />
            </div>
          </section>

          {/* ── Footer section ────────────────────────────────────────────── */}
          <section className="footer-section" ref={resumeFooterRef}>
            <div className="footer-inner">
              <div className="footer-sep" aria-hidden />
              <div className="footer-content">
                <div className="footer-left">
                  <h2 className="footer-tagline">Designing Connection through Collaboration</h2>
                  <p className="footer-copy">@ Armin Mohammadi 2026</p>
                </div>
                <nav className="footer-nav" aria-label="Footer navigation">
                  <div className="footer-nav-col">
                    <button className="footer-nav-link" onClick={() => goTo(0)}>Home</button>
                    <button className="footer-nav-link" onClick={() => goTo(1)}>Works</button>
                  </div>
                  <div className="footer-nav-col">
                    <a href="mailto:arminmohammadi1342@gmail.com" className="footer-nav-link">Email</a>
                    <button className="footer-nav-link" onClick={() => setResumeOpen(true)}>Resume</button>
                    <a href="https://www.linkedin.com/in/arminmoh" target="_blank" rel="noreferrer" className="footer-nav-link">LinkedIn</a>
                  </div>
                </nav>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Fixed top nav ────────────────────────────────────────────────── */}

      <Navbar
        onWork={() => goTo(1)}
        onAbout={() => goTo(2)}
        onResume={() => setResumeOpen(true)}
      />

      {resumeOpen && createPortal(
        <div className="resume-overlay" onClick={() => setResumeOpen(false)}>
          <div className="resume-modal" onClick={e => e.stopPropagation()}>
            <button className="resume-modal-close" onClick={() => setResumeOpen(false)}>×</button>
            <iframe
              className="resume-iframe"
              src="https://embed.figma.com/proto/leZEBxJorC3mH2RtuKTTQN/Resume?node-id=1-3&viewport=-3405%2C1260%2C1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share"
              allowFullScreen
              title="Resume"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
