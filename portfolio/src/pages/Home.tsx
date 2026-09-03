import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import './Home.css'
import Navbar from '../components/Navbar'

import heroIllustration from '../assets/images/hero-illustration.png'
import streetsGif from '../assets/images/streetsgif.gif'
import rocketArtwork from '../assets/images/rocket-artwork.gif'
import findyGif from '../assets/images/FindyGif.gif'
import auraGif from '../assets/images/auragif.gif'
import navCat from '../assets/images/nav-cat.svg'
import orgPacuci from '../assets/images/org-pacuci.png'
import orgRocketLawyerLogo from '../assets/images/org-rocket-lawyer-logo.png'
import orgAdobe from '../assets/images/org-adobe.png'
import orgAccessComputing from '../assets/images/org-access-computing.png'
import individualStar from '../assets/images/individual-star.svg'

// Real pointer position — guards against phantom mouseenter events (clientX/Y=0)
const lastPointerPos = { x: 0, y: 0 }

interface WorkCardProps {
  artwork: string
  artworkAlt: string
  title: string
  description: string
  slug: string
  isGif?: boolean
  to?: string
}

function WorkCard({ artwork, artworkAlt, title, description, slug, isGif, to }: WorkCardProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [hovered, setHovered] = useState(false)
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
    let x = clientX + 20
    let y = clientY - H - 14
    if (x + W > window.innerWidth - 12) x = clientX - W - 20
    if (y < 12) y = clientY + 20
    el.style.transform = `translate(${x}px, ${y}px)`
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    positionPopup(e.clientX, e.clientY)
  }, [positionPopup])

  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    requestAnimationFrame(() => positionPopup(lastPointerPos.x, lastPointerPos.y))
  }, [positionPopup])

  const cardInner = (
    <div className="work-card-artwork">
      <img ref={imgRef} src={artwork} alt={artworkAlt} />
    </div>
  )

  const cardMeta = (
    <div className="work-card-content">
      <h2 className="work-card-title">{title}</h2>
      <p className="work-card-description">{description}</p>
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

const POSITIONS = [
  { logo: orgRocketLawyerLogo, org: 'Rocket Lawyer',                    role: 'UX Research Intern, AI Experience' },
  { logo: orgAdobe,            org: 'Adobe',                            role: 'Campus Ambassador' },
  { logo: orgPacuci,           org: 'Product Association @ UCI',        role: 'Product Design Lead' },
  { logo: orgAccessComputing,  org: 'Design 4 Access / AccessComputing', role: 'Research & Design Assistant' },
]

export default function Home() {
  // 0 = hero, 1 = works, 2 = resume+footer
  const [page, setPage] = useState(0)
  const [worksKey, setWorksKey] = useState(0)
  const [resumeOpen, setResumeOpen] = useState(false)

  const worksRef        = useRef<HTMLElement>(null)
  const resumeFooterRef = useRef<HTMLElement>(null)
  const heroIllRef      = useRef<HTMLImageElement>(null)

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

  // Real pointer tracking for popup positioning
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastPointerPos.x = e.clientX
      lastPointerPos.y = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Hero entrance timeline — fires once on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-topnav',       { opacity: 0, y: -10, duration: 0.75 }, 0.05)
      tl.from(heroIllRef.current,   { opacity: 0, y: 10,  duration: 0.75 }, 0.1)
      tl.from('.hero-name-block',   { opacity: 0, y: 10,  duration: 0.75 }, 0.2)
      tl.from('.hero-tag-designer', { opacity: 0, y: 10,  duration: 0.75 }, 0.48)
      tl.from('.hero-tag-anteater', { opacity: 0, y: 10,  duration: 0.75 }, 0.58)
      tl.fromTo('.hero-star',
        { opacity: 0, scale: 0.3 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' },
        0.45
      )
      tl.from('.navbar', { opacity: 0, y: 12, duration: 0.75 }, 0.68)
      gsap.to('.hero-tag-designer', {
        y: -3, duration: 1.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.23,
      })
      gsap.to('.hero-tag-anteater', {
        y: -3, duration: 1.85, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.33,
      })
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

  // Resume section elements animate in when Resume becomes active
  useEffect(() => {
    if (page !== 2) return
    gsap.fromTo('.about-position',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out', delay: 0.6 }
    )
  }, [page])

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

  // Resume modal keyboard close
  useEffect(() => {
    if (!resumeOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setResumeOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [resumeOpen])

  return (
    <>
      <div className="home-clip">
        <div
          className="home"
          style={{
            transform: `translateY(${page * -100}vh)`,
            transition: 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)',
          }}
        >
          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <section className="hero">
            <div className="hero-main-content">
              <img
                ref={heroIllRef}
                className="hero-illustration"
                src={heroIllustration}
                alt=""
              />

              <div className="hero-name-block">
                <h1 className="hero-name">
                  <span className="first">hi, i'm</span>
                  <span className="last">
                    <span className="last-text">
                      armin
                      <div className="hero-stars" aria-hidden>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                          <img
                            key={n}
                            className={`hero-star hero-star--${n}`}
                            src={individualStar}
                            alt=""
                          />
                        ))}
                      </div>
                    </span>
                  </span>
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
                slug="rocket-lawyer"
                isGif
                to="/work/rocket-lawyer"
              />
              <WorkCard
                artwork={streetsGif}
                artworkAlt="Streets"
                title="Streets"
                description="design engineering enterprise B2B software"
                slug="streets"
                isGif
              />
              <WorkCard
                artwork={findyGif}
                artworkAlt="Findy"
                title="Findy"
                description="a case-competition winning solution built for elders, tested by elders"
                slug="findy"
                isGif
                to="/work/findy"
              />
              <WorkCard
                artwork={auraGif}
                artworkAlt="Aura"
                title="Aura"
                description="connecting users with algorithmic accountability and motivation"
                slug="aura"
                isGif
              />
            </div>
          </section>

          {/* ── Resume + Footer (combined scrollable section) ─────────────── */}
          <section className="resume-footer-section" ref={resumeFooterRef}>
            <div className="resume-content-area">
              <div className="resume-section-header">
                <h2 className="resume-section-heading">resume</h2>
                <p className="resume-section-subtitle">some of my involvements</p>
              </div>
              <div className="resume-positions-wrap">
                {POSITIONS.map(({ logo, org, role }) => (
                  <div className="about-position" key={org}>
                    <div className="about-position-logo-wrap">
                      <img src={logo} alt="" className="about-position-logo" />
                    </div>
                    <div className="about-position-info">
                      <span className="about-position-name">{org}</span>
                      <span className="about-position-role">{role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="footer-area">
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
                      <button className="footer-nav-link" onClick={() => goTo(2)}>Resume</button>
                    </div>
                    <div className="footer-nav-col">
                      <a href="mailto:arminmohammadi1342@gmail.com" className="footer-nav-link">Email</a>
                      <button className="footer-nav-link" onClick={() => setResumeOpen(true)}>View Resume</button>
                      <a href="https://www.linkedin.com/in/arminmoh" target="_blank" rel="noreferrer" className="footer-nav-link">LinkedIn</a>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Fixed top nav ────────────────────────────────────────────────── */}
      <div className="hero-topnav">
        <button className="hero-topnav-logo" onClick={() => goTo(0)}>
          <img src={navCat} alt="" className="hero-topnav-cat" />
          <div className="hero-topnav-identity">
            <span className="hero-topnav-name">Armin Mohammadi</span>
            <span className="hero-topnav-role">Product Designer</span>
          </div>
        </button>
      </div>

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
