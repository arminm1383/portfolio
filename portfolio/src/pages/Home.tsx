import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

import heroIllustration from '../assets/images/hero-illustration.png'
import streetsGif from '../assets/images/streetsgif.gif'
import rocketArtwork from '../assets/images/rocket-artwork.png'
import findyGif from '../assets/images/FindyGif.gif'
import auraGif from '../assets/images/auragif.gif'
import navStar from '../assets/images/nav-star.svg'
import navPerson from '../assets/images/nav-person.svg'
import navCat from '../assets/images/nav-cat.svg'
import navLinkedin from '../assets/images/nav-linkedin.png'
import navEmail from '../assets/images/nav-email.png'
import navResume from '../assets/images/nav-resume.png'
import orgStreets from '../assets/images/org-streets.png'
import orgRocket from '../assets/images/org-rocket.png'
import orgUci from '../assets/images/org-uci.png'
import orgPacuci from '../assets/images/org-pacuci.png'

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
  isGif?: boolean
}

function WorkCard({ artwork, artworkAlt, orgLogo, org, title, role, isGif }: WorkCardProps) {
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

  return (
    <div className="work-card">
      <div className="work-card-artwork">
        <img ref={imgRef} src={artwork} alt={artworkAlt} />
      </div>
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
    </div>
  )
}

export default function Home() {
  const [page, setPage] = useState(0) // 0 = hero, 1 = works
  const worksRef = useRef<HTMLElement>(null)
  const transitioning = useRef(false)
  // Timestamp when works first settled at scrollTop === 0.
  // null means works is not at the top, or we haven't settled yet.
  const atTopSince = useRef<number | null>(null)
  // Minimum ms the user must have been resting at the top before a
  // new upward gesture is allowed to switch pages. This drains
  // trackpad momentum so only a deliberate nudge triggers the switch.
  const TOP_COOLDOWN = 500

  const goTo = useCallback((p: number) => {
    if (transitioning.current) return
    transitioning.current = true
    // Arriving at works — start cooldown clock immediately (works starts at scrollTop 0).
    // Arriving at hero — clear it.
    atTopSince.current = p === 1 ? Date.now() : null
    setPage(p)
    setTimeout(() => { transitioning.current = false }, 700)
  }, [])

  // Track when works settles at the top so we can distinguish
  // momentum bleed-through from a deliberate new gesture.
  useEffect(() => {
    const works = worksRef.current
    if (!works || page !== 1) return
    const onScroll = () => {
      if (works.scrollTop === 0) {
        if (atTopSince.current === null) atTopSince.current = Date.now()
      } else {
        atTopSince.current = null
      }
    }
    works.addEventListener('scroll', onScroll, { passive: true })
    return () => works.removeEventListener('scroll', onScroll)
  }, [page])

  // Wheel handler
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (page === 0 && e.deltaY > 0) { goTo(1); return }
      if (page === 1 && e.deltaY < 0) {
        const works = worksRef.current
        if (!works) return
        const settled = atTopSince.current
        // Must already be at top AND cooldown must have elapsed —
        // this rejects momentum events and requires a fresh nudge.
        if (works.scrollTop === 0 && settled !== null && Date.now() - settled >= TOP_COOLDOWN) {
          goTo(0)
        }
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [page, goTo])

  // Touch swipe — start must begin while already at the top
  useEffect(() => {
    let startY = 0
    let startedAtTop = false
    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      const works = worksRef.current
      startedAtTop = page === 1 && !!works && works.scrollTop === 0
    }
    const onEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY
      if (page === 0 && dy > 40) { goTo(1); return }
      if (page === 1 && dy < -40 && startedAtTop) goTo(0)
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [page, goTo])

  return (
    <div className="home-clip">
    <div className="home" style={{ transform: `translateY(${page === 0 ? '0' : '-100vh'})`, transition: 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)' }}>
      {/* Hero / Title section */}
      <section className="hero">
        {/* Top navbar — matches Figma frame 221:30193 at x=78, y=47 */}
        <div className="hero-topnav">
          <div className="hero-topnav-logo">
            <img src={navCat} alt="" className="hero-topnav-cat" />
            <div className="hero-topnav-identity">
              <span className="hero-topnav-name">Armin Mohammadi</span>
              <span className="hero-topnav-role">Product Designer</span>
            </div>
          </div>
          <div className="hero-topnav-contact">
            <a href="https://www.linkedin.com/in/arminmohammadi1" target="_blank" rel="noreferrer" className="hero-topnav-icon-link">
              <img src={navLinkedin} alt="LinkedIn" width={30} height={29} />
            </a>
            <a href="mailto:arminmohammadi1342@gmail.com" className="hero-topnav-icon-link">
              <img src={navEmail} alt="Email" width={29} height={22} />
            </a>
            <a href="#" className="hero-topnav-icon-link" aria-label="Resume">
              <img src={navResume} alt="Resume" width={22} height={27} />
            </a>
          </div>
        </div>

        <img
          className="hero-illustration"
          src={heroIllustration}
          alt=""
        />

        <div className="hero-name-block">
          <h1 className="hero-name">
            <span className="first">armin</span>
            <span className="last">mohammadi</span>
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

        {/* New pill navbar */}
        <nav className="hero-nav">
          <div className="hero-nav-backdrop" />
          <Link to="/" className="hero-nav-item">
            <img src={navStar} alt="" width={20} height={16} />
            <span>work</span>
          </Link>
          <Link to="/playground" className="hero-nav-item">
            <img src={navPerson} alt="" width={24} height={22} />
            <span>play</span>
          </Link>
          <a href="#about" className="hero-nav-item">
            <img src={navPerson} alt="" width={24} height={22} />
            <span>about</span>
          </a>
        </nav>
      </section>

      {/* Work cards – 2×2 grid */}
      <section className="works" ref={worksRef}>
        <div className="works-grid">
          <WorkCard
            artwork={streetsGif}
            artworkAlt="Streets Enterprise UI"
            orgLogo={orgStreets}
            org="Streets by Plyance"
            title="Streets Enterprise UI"
            role="Founding Product Designer"
            isGif
          />
          <WorkCard
            artwork={rocketArtwork}
            artworkAlt="Rocket Copilot AI"
            orgLogo={orgRocket}
            org="Rocket Lawyer"
            title="Rocket Copilot AI"
            role="Founding Product Designer"
          />
          <WorkCard
            artwork={findyGif}
            artworkAlt="Findy"
            orgLogo={orgUci}
            org="Design @ UCI"
            title="Findy"
            role="Product Designer"
            isGif
          />
          <WorkCard
            artwork={auraGif}
            artworkAlt="Aura"
            orgLogo={orgPacuci}
            org="Product Association @ UCI"
            title="Aura"
            role="Product Designer"
            isGif
          />
        </div>
      </section>
    </div>
    </div>
  )
}
