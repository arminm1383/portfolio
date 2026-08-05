import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import './Home.css'
import Navbar from '../components/Navbar'

import heroIllustration from '../assets/images/hero-illustration.png'
import y2kStar from '../assets/images/y2k-star.png'
import streetsGif from '../assets/images/streetsgif.gif'
import rocketArtwork from '../assets/images/rocket-artwork.gif'
import findyGif from '../assets/images/FindyGif.gif'
import auraGif from '../assets/images/auragif.gif'
import navCat from '../assets/images/nav-cat.svg'
import navLinkedin from '../assets/images/nav-linkedin.png'
import navEmail from '../assets/images/nav-email.png'
import navResume from '../assets/images/nav-resume.png'
import orgStreets from '../assets/images/org-streets.png'
import orgRocket from '../assets/images/org-rocket.png'
import orgUci from '../assets/images/org-uci.png'
import orgPacuci from '../assets/images/org-pacuci.png'
import starsImg from '../assets/images/stars.png'
import about2Paper from '../assets/images/about2-paper.png'
import about2Boy from '../assets/images/about2-boy.png'
import about2MusicNote from '../assets/images/about2-music-note.png'
import about2Birds1 from '../assets/images/about2-birds-1.png'
import about2Birds2 from '../assets/images/about2-birds-2.png'
import about2StarTexture from '../assets/images/about2-star-texture.png'
import about2StarSm from '../assets/images/about2-star-sm.svg'
import about2StarMd from '../assets/images/about2-star-md.svg'
import about2StarLg from '../assets/images/about2-star-lg.svg'
import about2BuffaloContent from '../assets/images/about2-buffalo-content.png'
import about2BuffaloFrame from '../assets/images/about2-buffalo-frame.png'

// Real, pointer-driven mouse position — used (instead of the mouseenter event's own
// coordinates) to place the case-study popup. When a work card slides under a stationary
// cursor via the wheel-triggered page transform, browsers can fire a phantom mouseenter
// with clientX/clientY stuck at 0, which would otherwise pin the popup to the corner.
const lastPointerPos = { x: 0, y: 0 }

function CornerDots() {
  return (
    <>
      <div className="hero-corner-dot tl" />
      <div className="hero-corner-dot tr" />
      <div className="hero-corner-dot bl" />
      <div className="hero-corner-dot br" />
    </>
  )
}

interface WorkCardProps {
  artwork: string
  artworkAlt: string
  orgLogo: string
  org: string
  title: string
  role: string
  slug: string
  isGif?: boolean
  to?: string
}

function WorkCard({ artwork, artworkAlt, orgLogo, org, title, role, slug, isGif, to }: WorkCardProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [hovered, setHovered] = useState(false)
  // Outer wrapper: positioned by JS transform; inner .cs-popup animates independently
  const floatRef = useRef<HTMLDivElement>(null)

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

  const positionPopup = useCallback((clientX: number, clientY: number) => {
    const el = floatRef.current
    if (!el) return
    const W = el.offsetWidth || 300
    const H = el.offsetHeight || 80
    // Default: top-right of cursor
    let x = clientX + 20
    let y = clientY - H - 14
    // Clamp right edge
    if (x + W > window.innerWidth - 12) x = clientX - W - 20
    // Clamp top edge
    if (y < 12) y = clientY + 20
    el.style.transform = `translate(${x}px, ${y}px)`
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    positionPopup(e.clientX, e.clientY)
  }, [positionPopup])

  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    // Position from the last real pointer position, not the enter event's own
    // coordinates (see lastPointerPos comment above) — give React one frame to
    // mount the portal first.
    requestAnimationFrame(() => positionPopup(lastPointerPos.x, lastPointerPos.y))
  }, [positionPopup])

  const cardInner = (
    <div className="work-card-artwork">
      <img ref={imgRef} src={artwork} alt={artworkAlt} />
    </div>
  )

  const cardMeta = (
    <div className="work-card-content">
      <div className="work-card-org">
        <img src={orgLogo} alt="" className="work-card-org-logo" />
        <span>{org}</span>
      </div>
      <div className="work-card-title-block">
        <h2 className="work-card-title">{title}</h2>
        <p className="work-card-role">{role}</p>
      </div>
    </div>
  )

  const popup = hovered && createPortal(
    <div ref={floatRef} className="cs-float">
      <div className="cs-popup">
        <div className="cs-title-bar">
          <div className="cs-controls">
            <span className="cs-dot cs-dot--close" />
            <span className="cs-dot cs-dot--min" />
            <span className="cs-dot cs-dot--zoom" />
          </div>
        </div>
        <div className="cs-content">
          <p className="cs-command">{`$ grep "${slug}" case-study.txt`}</p>
          {to
            ? <p className="cs-result cs-result--found">{`case-study.txt:1: case_study_found ↗`}</p>
            : <p className="cs-result">grep: case-study.txt: Case Study Coming Soon</p>
          }
        </div>
      </div>
    </div>,
    document.body
  )

  if (to) {
    return (
      <>
        <Link
          to={to}
          className="work-card"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setHovered(false)}
          onMouseMove={handleMouseMove}
        >
          {cardInner}
          {cardMeta}
        </Link>
        {popup}
      </>
    )
  }

  return (
    <>
      <div
        className="work-card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {cardInner}
        {cardMeta}
      </div>
      {popup}
    </>
  )
}

export default function Home() {
  const [page, setPage] = useState(0) // 0 = hero, 1 = works, 2 = gallery, 3 = about
  const [worksKey, setWorksKey] = useState(0)
  const [resumeOpen, setResumeOpen] = useState(false)
  const worksRef = useRef<HTMLElement>(null)
  const heroIllRef = useRef<HTMLImageElement>(null)
  const heroStarsRef = useRef<HTMLImageElement>(null)
  const transitioning = useRef(false)
  const atTopSince = useRef<number | null>(null)
  const atBottomSince = useRef<number | null>(null)
  const TOP_COOLDOWN = 500

  const goTo = useCallback((p: number) => {
    if (transitioning.current) return
    transitioning.current = true
    atTopSince.current = p === 1 ? Date.now() : null
    atBottomSince.current = null
    if (p === 1) setWorksKey(k => k + 1)
    setPage(p)
    setTimeout(() => { transitioning.current = false }, 700)
  }, [])

  // Track works scroll position at top (for going back to hero).
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
    // Seed bottom tracking immediately in case works has no overflow.
    const atBottom = works.scrollTop + works.clientHeight >= works.scrollHeight - 1
    if (atBottom) atBottomSince.current = Date.now()
    works.addEventListener('scroll', onScroll, { passive: true })
    return () => works.removeEventListener('scroll', onScroll)
  }, [page])

  // Track the real cursor position at all times (see lastPointerPos above)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastPointerPos.x = e.clientX
      lastPointerPos.y = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Hero parallax — max shift is 2% of viewport width so sensitivity scales with screen size
  useEffect(() => {
    if (page !== 0) return
    const startedAt = Date.now()
    let raf = 0
    const onMove = (e: MouseEvent) => {
      if (Date.now() - startedAt < 900) return // let entrance animations finish
      const mx = e.clientX / window.innerWidth - 0.5
      const my = e.clientY / window.innerHeight - 0.5
      const max = Math.min(window.innerWidth * 0.02, 22)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (heroIllRef.current)
          heroIllRef.current.style.transform = `translate(${mx * max * 0.6}px, ${my * max * 0.5}px)`
        if (heroStarsRef.current)
          heroStarsRef.current.style.transform = `translate(${mx * max * 1.6}px, ${my * max * 1.3}px)`
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      if (heroIllRef.current) heroIllRef.current.style.transform = ''
      if (heroStarsRef.current) heroStarsRef.current.style.transform = ''
    }
  }, [page])

  // Wheel handler
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (page === 0 && e.deltaY > 0) { goTo(1); return }
      if (page === 1 && e.deltaY < 0) {
        const works = worksRef.current
        if (!works) return
        const settled = atTopSince.current
        if (works.scrollTop === 0 && settled !== null && Date.now() - settled >= TOP_COOLDOWN) {
          goTo(0)
        }
      }
      if (page === 1 && e.deltaY > 0) {
        const works = worksRef.current
        if (!works) return
        const settled = atBottomSince.current
        if (settled !== null && Date.now() - settled >= TOP_COOLDOWN) {
          goTo(2)
        }
      }
      if (page === 2 && e.deltaY < 0) { goTo(1) }
      if (page === 2 && e.deltaY > 0) { goTo(3) }
      if (page === 3 && e.deltaY < 0) { goTo(2) }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [page, goTo])

  // Touch swipe
  useEffect(() => {
    let startY = 0
    let startedAtTop = false
    let startedAtBottom = false
    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      const works = worksRef.current
      startedAtTop = page === 1 && !!works && works.scrollTop === 0
      startedAtBottom = page === 1 && !!works &&
        works.scrollTop + works.clientHeight >= works.scrollHeight - 1
    }
    const onEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY
      if (page === 0 && dy > 40) { goTo(1); return }
      if (page === 1 && dy < -40 && startedAtTop) { goTo(0); return }
      if (page === 1 && dy > 40 && startedAtBottom) { goTo(2); return }
      if (page === 2 && dy < -40) { goTo(1); return }
      if (page === 2 && dy > 40) { goTo(3); return }
      if (page === 3 && dy < -40) { goTo(2) }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [page, goTo])

  useEffect(() => {
    if (!resumeOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setResumeOpen(false) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [resumeOpen])

  return (
    <>
    <div className="home-clip">
    <div className="home" style={{ transform: `translateY(${page * -100}vh)`, transition: 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)' }}>
      {/* Hero / Title section */}
      <section className="hero">
        {/* Main Title Content — vertically centered in 100vh at all screen sizes */}
        <div className="hero-main-content">
          <img
            ref={heroIllRef}
            className="hero-illustration"
            src={heroIllustration}
            alt=""
          />
          <img
            ref={heroStarsRef}
            className="hero-stars"
            src={starsImg}
            alt=""
            aria-hidden
          />

          <div className="hero-name-block">
            <h1 className="hero-name">
              <span className="first">hi, i'm</span>
              <span className="last">armin</span>
            </h1>
            <div className="hero-tagline-wrap">
              <div className="hero-tagline-box">
                <p>designing connection through collaboration</p>
              </div>
              <CornerDots />
            </div>
          </div>

          <span className="tag hero-tag-designer">product designer</span>
          <span className="tag hero-tag-anteater">anteater</span>
        </div>
      </section>

      {/* Work cards – 2×2 grid */}
      <section className="works" ref={worksRef}>
        <div className="works-header">
          <img src={y2kStar} alt="" className="works-y2k-star" aria-hidden />
          <h2 className="works-heading">works</h2>
        </div>
        <div className="works-grid" key={worksKey}>
          <WorkCard
            artwork={rocketArtwork}
            artworkAlt="Rocket Copilot"
            orgLogo={orgRocket}
            org="Rocket Lawyer"
            title="Rocket Copilot"
            role="UI/UX Intern"
            slug="rocket-lawyer"
            isGif
            to="/work/rocket-lawyer"
          />
          <WorkCard
            artwork={auraGif}
            artworkAlt="Aura"
            orgLogo={orgPacuci}
            org="Product Association @ UCI"
            title="Aura"
            role="Product Designer"
            slug="aura"
            isGif
            to="/work/aura"
          />
          <WorkCard
            artwork={findyGif}
            artworkAlt="Findy"
            orgLogo={orgUci}
            org="Design @ UCI"
            title="Findy"
            role="Product Designer"
            slug="findy"
            isGif
            to="/work/findy"
          />
          <WorkCard
            artwork={streetsGif}
            artworkAlt="Streets Enterprise UI"
            orgLogo={orgStreets}
            org="Streets by Plyance"
            title="Streets Enterprise UI"
            role="Founding Product Designer"
            slug="streets"
            isGif
          />
        </div>
      </section>

      {/* Gallery section — placeholder area, content coming soon */}
      <section className="gallery">
        <div className="gallery-header">
          <h2 className="gallery-heading">gallery</h2>
        </div>
      </section>

      {/* About section */}
      <section className="about">
        <div className="about-inner">
          {/* Boy photo + paper shadow */}
          <img src={about2Paper} alt="" className="about2-paper" aria-hidden />
          <img src={about2Boy} alt="" className="about2-boy" />

          {/* Music notes */}
          <img src={about2MusicNote} alt="" className="about2-note about2-note--1" aria-hidden />
          <img src={about2MusicNote} alt="" className="about2-note about2-note--2" aria-hidden />
          <img src={about2MusicNote} alt="" className="about2-note about2-note--3" aria-hidden />

          {/* Birds */}
          <img src={about2Birds1} alt="" className="about2-birds about2-birds--1" aria-hidden />
          <img src={about2Birds2} alt="" className="about2-birds about2-birds--2" aria-hidden />

          {/* Stars */}
          <div className="about2-star about2-star--sm" aria-hidden>
            <img src={about2StarSm} alt="" className="about2-star-svg" />
            <img src={about2StarTexture} alt="" className="about2-star-tex" />
          </div>
          <div className="about2-star about2-star--lg" aria-hidden>
            <img src={about2StarLg} alt="" className="about2-star-svg" />
            <img src={about2StarTexture} alt="" className="about2-star-tex" />
          </div>
          <div className="about2-star about2-star--md" aria-hidden>
            <img src={about2StarMd} alt="" className="about2-star-svg" />
            <img src={about2StarTexture} alt="" className="about2-star-tex" />
          </div>

          {/* Buffalo painting */}
          <div className="about2-buffalo-frame" aria-hidden>
            <img src={about2BuffaloFrame} alt="" className="about2-buffalo-frame-img" />
          </div>
          <div className="about2-buffalo-content" aria-hidden>
            <img src={about2BuffaloContent} alt="" className="about2-buffalo-content-img" />
          </div>

          {/* Text content */}
          <div className="about2-text">
            <h2 className="about2-title">about me</h2>
            <div className="about2-body">
              <p>From the stories 6-year old me used to doodle in my journal to the case study stories I inspire my audience to connect with, I've always been a story teller. This imaginative and creative side has always been innate to me, and it is this natural passion that made me fall in love with product design altogether.</p>
              <p>Living around such diverse perspectives, I want my stories to not just reflect my craft but to also reflect the journeys, culture, and individuality that continues to excite me to connect with others every single day.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>

    {/* Top bar and pill nav both live outside the transformed .home div
        so position:fixed is relative to the viewport */}
    <div className="hero-topnav">
      <button className="hero-topnav-logo" onClick={() => goTo(0)}>
        <img src={navCat} alt="" className="hero-topnav-cat" />
        <div className="hero-topnav-identity">
          <span className="hero-topnav-name">Armin Mohammadi</span>
          <span className="hero-topnav-role">Product Designer</span>
        </div>
      </button>
      <div className={`hero-topnav-contact${page !== 0 ? ' hero-topnav-contact--hidden' : ''}`}>
        <a href="https://www.linkedin.com/in/arminmoh" target="_blank" rel="noreferrer" className="hero-topnav-icon-link">
          <img src={navLinkedin} alt="LinkedIn" width={30} height={29} />
        </a>
        <a href="mailto:arminmohammadi1342@gmail.com" className="hero-topnav-icon-link">
          <img src={navEmail} alt="Email" width={29} height={22} />
        </a>
        <button className="hero-topnav-icon-link" aria-label="Resume" onClick={() => setResumeOpen(true)}>
          <img src={navResume} alt="Resume" width={22} height={27} />
        </button>
      </div>
    </div>

    <Navbar
      onWork={() => goTo(1)}
      onAbout={() => goTo(3)}
      onGallery={() => goTo(2)}
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
