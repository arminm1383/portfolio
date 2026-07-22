import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import './Home.css'

import heroIllustration from '../assets/images/hero-illustration.png'
import streetsGif from '../assets/images/streetsgif.gif'
import rocketArtwork from '../assets/images/rocket-artwork.gif'
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
import aboutBirds2 from '../assets/images/about-birds-2.png'
import aboutBirds3 from '../assets/images/about-birds-3.png'
import aboutCoverBg from '../assets/images/about-cover-bg.png'
import aboutBinderRings from '../assets/images/about-binder-rings.png'
import aboutCoverPerson from '../assets/images/about-cover-person.png'
import aboutCoverBird1 from '../assets/images/about-cover-bird1.png'
import aboutCoverNote from '../assets/images/about-cover-note.png'
import aboutCoverStar from '../assets/images/about-cover-star.png'
import aboutP2PhotoNew from '../assets/images/about-p2-photo-new.png'
import aboutP2PersianText from '../assets/images/about-p2-persian-text.png'
import aboutP3BotanicalNew from '../assets/images/about-p3-botanical-new.png'
import aboutP3Note1 from '../assets/images/about-p3-note-1.png'
import aboutP3Note3 from '../assets/images/about-p3-note-3.png'
import aboutP3PolaroidPhotoNew from '../assets/images/about-p3-polaroid-photo-new.png'
import aboutP3BuffaloPaintingFrameNew from '../assets/images/about-p3-buffalo-painting-frame-new.png'
import aboutP3BuffaloPaintingContentNew from '../assets/images/about-p3-buffalo-painting-content-new.png'

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

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    setHovered(true)
    // Give React one frame to mount the portal before positioning
    requestAnimationFrame(() => positionPopup(e.clientX, e.clientY))
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
  const [page, setPage] = useState(0) // 0 = hero, 1 = works, 2 = about
  const [worksKey, setWorksKey] = useState(0)
  const [magazineOpen, setMagazineOpen] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  const worksRef = useRef<HTMLElement>(null)
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
      if (page === 2 && dy < -40) { goTo(1) }
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
        <img
          className="hero-illustration"
          src={heroIllustration}
          alt=""
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

      </section>

      {/* Work cards – 2×2 grid */}
      <section className="works" ref={worksRef}>
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
          <WorkCard
            artwork={auraGif}
            artworkAlt="Aura"
            orgLogo={orgPacuci}
            org="Product Association @ UCI"
            title="Aura"
            role="Product Designer"
            slug="aura"
            isGif
          />
        </div>
      </section>

      {/* About section */}
      <section className="about">
        <div
          className={`about-magazine${magazineOpen ? ' is-open' : ''}`}
          onClick={() => setMagazineOpen(o => !o)}
        >
          <div className="magazine-book">

            {/* Page 3 — right inner page, always visible behind the cover */}
            <div className="magazine-right-page">
              <div className="p3-quote-block p3-quote-block--first">
                <p className="p3-quote-text">I used to fear the ability to be myself in open spaces, but through design and the people i've met in the field, I've discovered that authenticity is to be cherished. By embracing the naturally inquisitive, creative, and people-driven nature that defines my thought process, I was able to let out that weird, funny, and vibrant side of me that defines the span of my visions and strength of my bonds.</p>
              </div>
              <div className="p3-botanical-wrap">
                <img src={aboutP3BotanicalNew} alt="" className="p3-botanical-img" />
              </div>
              <div className="p3-quote-block p3-quote-block--second">
                <p className="p3-quote-text p3-quote-text--right">I've learned to love the charm that I bring to discussions and this energy paired with my ever-growing excitement to learn goes beyond design and taps into my innate ability to connect with, to resonate with others.</p>
                <p className="p3-signature">- Armin Mohammadi</p>
              </div>
              <div className="p3-polaroid">
                <div className="p3-polaroid-photo">
                  <img src={aboutP3PolaroidPhotoNew} alt="" className="p3-polaroid-photo-img" />
                </div>
              </div>
              <div className="p3-buffalo-painting-wrap">
                <div className="p3-buffalo-painting-content-clip">
                  <img src={aboutP3BuffaloPaintingContentNew} alt="" className="p3-buffalo-painting-content-img" />
                </div>
                <img src={aboutP3BuffaloPaintingFrameNew} alt="" className="p3-buffalo-painting-frame-img" />
              </div>
            </div>

            {/* Pages 1+2 — flippable cover (page 1 front, page 2 back) */}
            <div className="magazine-cover">

              {/* Page 1 — front cover (cardboard journal) */}
              <div className="about-card">
                <img src={aboutCoverBg} alt="" className="about-card-bg" />
                <img src={aboutCoverBird1} alt="" className="about-img about-img--birds1" />
                <img src={aboutBirds2} alt="" className="about-img about-img--birds2" />
                <img src={aboutBirds3} alt="" className="about-img about-img--birds3" />
                <h1 className="about-heading-about">about</h1>
                <h1 className="about-heading-me">me</h1>
                <img src={aboutCoverPerson} alt="" className="about-cover-person" />
                <img src={aboutP3Note1} alt="" className="cover-note cover-note--1" />
                <img src={aboutCoverNote} alt="" className="cover-note cover-note--2" />
                <img src={aboutP3Note3} alt="" className="cover-note cover-note--3" />
                <img src={aboutCoverStar} alt="" className="cover-star cover-star--tl-sm" />
                <img src={aboutCoverStar} alt="" className="cover-star cover-star--tl-lg" />
                <img src={aboutCoverStar} alt="" className="cover-star cover-star--br-sm" />
                <img src={aboutCoverStar} alt="" className="cover-star cover-star--br-md" />
                <img src={aboutCoverStar} alt="" className="cover-star cover-star--br-lg" />
                <p className="cover-press-hint">press to turn page →</p>
              </div>

              {/* Page 2 — inside back cover (left page when open) */}
              <div className="magazine-cover-back">
                <div className="p2-photo-clip">
                  <img src={aboutP2PhotoNew} alt="" className="p2-photo-img" />
                  <img src={aboutP2PersianText} alt="" className="p2-text-top" />
                  <div className="p2-caption">
                    <p className="p2-caption-main">me visiting the worlds largest tree</p>
                    <p className="p2-caption-note">*by volume</p>
                  </div>
                </div>
                <p className="p2-name p2-name--first">ARMIN</p>
                <p className="p2-name p2-name--last">MOHAMMADI</p>
              </div>

            </div>

            {/* Binder rings — sit at spine, above the flipping cover */}
            <img src={aboutBinderRings} alt="" className="magazine-binder-rings" />

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

    <nav className="hero-nav">
      <div className="hero-nav-backdrop" />
      <button className="hero-nav-item" onClick={() => goTo(1)}>
        <img src={navStar} alt="" width={20} height={16} />
        <span>work</span>
      </button>
      <button className="hero-nav-item" onClick={() => goTo(2)}>
        <img src={navPerson} alt="" width={24} height={22} />
        <span>about</span>
      </button>
      <Link to="/playground" className="hero-nav-item">
        <img src={navPerson} alt="" width={24} height={22} />
        <span>play</span>
      </Link>
    </nav>

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
