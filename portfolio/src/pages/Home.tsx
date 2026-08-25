import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import './Home.css'
import Navbar from '../components/Navbar'

import heroIllustration from '../assets/images/hero-illustration.png'
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
import orgRocketLawyerLogo from '../assets/images/org-rocket-lawyer-logo.png'
import orgEatStudios from '../assets/images/org-eat-studios.png'
import orgAdobe from '../assets/images/org-adobe.png'
import orgAccessComputing from '../assets/images/org-access-computing.png'
import individualStar from '../assets/images/individual-star.svg'
import about2Portrait from '../assets/images/about2-portrait.png'
import about2PortraitSelfie from '../assets/images/about2-portrait-rect.png'
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
import galleryVrDevice from '../assets/images/gallery-vr-device.png'
import galleryBurger from '../assets/images/gallery-burger.jpg'
import gallerySalad from '../assets/images/gallery-salad.png'
import galleryBereal from '../assets/images/gallery-bereal.jpg'
import galleryFindyTeam from '../assets/images/gallery-findy-team.jpg'
import galleryPanelOutdoors from '../assets/images/gallery-panel-outdoors.jpg'
import galleryLaptopScreenshot from '../assets/images/gallery-laptop-screenshot.jpg'
import galleryTshirtCrop from '../assets/images/gallery-tshirt-crop.png'
import galleryAuraTile from '../assets/images/gallery-aura-tile.png'
import galleryConferencePhoto from '../assets/images/gallery-conference-photo.jpg'

// Real, pointer-driven mouse position — used (instead of the mouseenter event's own
// coordinates) to place the case-study popup. When a work card slides under a stationary
// cursor via the wheel-triggered page transform, browsers can fire a phantom mouseenter
// with clientX/clientY stuck at 0, which would otherwise pin the popup to the corner.
const lastPointerPos = { x: 0, y: 0 }

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

const POSITIONS = [
  { logo: orgRocketLawyerLogo, org: 'Rocket Lawyer',            role: 'UX Research Intern, AI Experience' },
  { logo: orgEatStudios,       org: 'EAT Studios',              role: 'Incoming Brand Design Intern' },
  { logo: orgAdobe,            org: 'Adobe',                    role: 'Project Teams Lead' },
  { logo: orgPacuci,           org: 'Product Association @ UCI', role: 'Product Design Lead' },
  { logo: orgAccessComputing,  org: 'Access Computing',         role: 'Research & Design Assistant' },
]

export default function Home() {
  const [page, setPage] = useState(0) // 0 = hero, 1 = works, 2 = about, 3 = gallery, 4 = footer
  const [worksKey, setWorksKey] = useState(0)
  const [aboutKey, setAboutKey] = useState(0)
  const [galleryKey, setGalleryKey] = useState(0)
  const [resumeOpen, setResumeOpen] = useState(false)
  const worksRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLElement>(null)
  const aboutLowerRef = useRef<HTMLDivElement>(null)
  const heroIllRef = useRef<HTMLImageElement>(null)
  const transitioning = useRef(false)
  const atTopSince = useRef<number | null>(null)
  const atBottomSince = useRef<number | null>(null)
  const arrivedAt = useRef(0)
  const TOP_COOLDOWN = 500
  const WHEEL_SETTLE = 900
  const SCROLL_GAP = 200
  const lastWheelTime = useRef(0)
  const lastWheelDir = useRef(0)

  const goTo = useCallback((p: number) => {
    if (transitioning.current) return
    transitioning.current = true
    arrivedAt.current = Date.now()
    // Seed atTopSince immediately for scrollable sections (1, 2, 3) — they remount at top
    atTopSince.current = (p === 1 || p === 2 || p === 3) ? Date.now() : null
    atBottomSince.current = null
    if (p === 1) setWorksKey(k => k + 1)
    if (p === 2) setAboutKey(k => k + 1)
    if (p === 3) setGalleryKey(k => k + 1)
    setPage(p)
    setTimeout(() => { transitioning.current = false }, 700)
  }, [])

  // Works scroll tracking
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

  // About scroll tracking — mirrors works behavior
  useEffect(() => {
    const about = aboutRef.current
    if (!about || page !== 2) return
    const onScroll = () => {
      if (about.scrollTop === 0) {
        if (atTopSince.current === null) atTopSince.current = Date.now()
      } else {
        atTopSince.current = null
      }
      const atBottom = about.scrollTop + about.clientHeight >= about.scrollHeight - 1
      if (atBottom) {
        if (atBottomSince.current === null) atBottomSince.current = Date.now()
      } else {
        atBottomSince.current = null
      }
    }
    const atBottom = about.scrollTop + about.clientHeight >= about.scrollHeight - 1
    if (atBottom) atBottomSince.current = Date.now()
    about.addEventListener('scroll', onScroll, { passive: true })
    return () => about.removeEventListener('scroll', onScroll)
  }, [page])

  // Gallery scroll tracking — needed to gate transition to footer
  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery || page !== 3) return
    const onScroll = () => {
      if (gallery.scrollTop === 0) {
        if (atTopSince.current === null) atTopSince.current = Date.now()
      } else {
        atTopSince.current = null
      }
      const atBottom = gallery.scrollTop + gallery.clientHeight >= gallery.scrollHeight - 1
      if (atBottom) {
        if (atBottomSince.current === null) atBottomSince.current = Date.now()
      } else {
        atBottomSince.current = null
      }
    }
    const atBottom = gallery.scrollTop + gallery.clientHeight >= gallery.scrollHeight - 1
    if (atBottom) atBottomSince.current = Date.now()
    gallery.addEventListener('scroll', onScroll, { passive: true })
    return () => gallery.removeEventListener('scroll', onScroll)
  }, [page])

  // Trigger about-lower animations after the user scrolls down to reveal them.
  // IntersectionObserver fires immediately (about-lower is ~22% visible at scrollTop=0),
  // so we use a scroll event and fire when scrollTop crosses 400px instead.
  useEffect(() => {
    const about = aboutRef.current
    const lower = aboutLowerRef.current
    if (!about || !lower) return
    lower.classList.remove('about-lower--visible')
    const onScroll = () => {
      if (about.scrollTop > 400) {
        lower.classList.add('about-lower--visible')
        about.removeEventListener('scroll', onScroll)
      }
    }
    about.addEventListener('scroll', onScroll, { passive: true })
    return () => about.removeEventListener('scroll', onScroll)
  }, [aboutKey])

  // Track the real cursor position at all times (see lastPointerPos above)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastPointerPos.x = e.clientX
      lastPointerPos.y = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Hero parallax
  useEffect(() => {
    if (page !== 0) return
    const startedAt = Date.now()
    let raf = 0
    const onMove = (e: MouseEvent) => {
      if (Date.now() - startedAt < 900) return
      const mx = e.clientX / window.innerWidth - 0.5
      const my = e.clientY / window.innerHeight - 0.5
      const max = Math.min(window.innerWidth * 0.02, 22)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (heroIllRef.current)
          heroIllRef.current.style.transform = `translate(${mx * max * 0.6}px, ${my * max * 0.5}px)`
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      if (heroIllRef.current) heroIllRef.current.style.transform = ''
    }
  }, [page])

  // Wheel handler
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const now = Date.now()
      const gap = now - lastWheelTime.current
      const dir = e.deltaY > 0 ? 1 : -1
      const dirChanged = lastWheelDir.current !== 0 && dir !== lastWheelDir.current
      lastWheelTime.current = now
      lastWheelDir.current = dir
      if (now - arrivedAt.current < WHEEL_SETTLE) return
      // For non-scrollable pages (hero=0, footer=4), only act on the first event of a new gesture.
      if ((page === 0 || page === 4) && gap < SCROLL_GAP && !dirChanged) return
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
      if (page === 2 && e.deltaY < 0) {
        const about = aboutRef.current
        if (!about) return
        const settled = atTopSince.current
        if (about.scrollTop === 0 && settled !== null && Date.now() - settled >= TOP_COOLDOWN) {
          goTo(1)
        }
      }
      if (page === 2 && e.deltaY > 0) {
        const about = aboutRef.current
        if (!about) return
        const settled = atBottomSince.current
        if (settled !== null && Date.now() - settled >= TOP_COOLDOWN) {
          goTo(3)
        }
      }
      if (page === 3 && e.deltaY < 0) {
        const gallery = galleryRef.current
        if (!gallery) return
        const settled = atTopSince.current
        if (gallery.scrollTop === 0 && settled !== null && Date.now() - settled >= TOP_COOLDOWN) {
          goTo(2)
        }
      }
      if (page === 3 && e.deltaY > 0) {
        const gallery = galleryRef.current
        if (!gallery) return
        const settled = atBottomSince.current
        if (settled !== null && Date.now() - settled >= TOP_COOLDOWN) {
          goTo(4)
        }
      }
      if (page === 4 && e.deltaY < 0) { goTo(3) }
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
      const about = aboutRef.current
      const gallery = galleryRef.current
      startedAtTop =
        (page === 1 && !!works && works.scrollTop === 0) ||
        (page === 2 && !!about && about.scrollTop === 0) ||
        (page === 3 && !!gallery && gallery.scrollTop === 0)
      startedAtBottom =
        (page === 1 && !!works && works.scrollTop + works.clientHeight >= works.scrollHeight - 1) ||
        (page === 2 && !!about && about.scrollTop + about.clientHeight >= about.scrollHeight - 1) ||
        (page === 3 && !!gallery && gallery.scrollTop + gallery.clientHeight >= gallery.scrollHeight - 1)
    }
    const onEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY
      if (page === 0 && dy > 40) { goTo(1); return }
      if (page === 1 && dy < -40 && startedAtTop) { goTo(0); return }
      if (page === 1 && dy > 40 && startedAtBottom) { goTo(2); return }
      if (page === 2 && dy < -40 && startedAtTop) { goTo(1); return }
      if (page === 2 && dy > 40 && startedAtBottom) { goTo(3); return }
      if (page === 3 && dy < -40 && startedAtTop) { goTo(2); return }
      if (page === 3 && dy > 40 && startedAtBottom) { goTo(4); return }
      if (page === 4 && dy < -40) { goTo(3) }
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

          <span className="tag hero-tag-designer">product designer</span>
          <span className="tag hero-tag-anteater">anteater</span>
        </div>
      </section>

      {/* Work cards – 2×2 grid */}
      <section className="works" ref={worksRef}>
        <div className="works-header">
          <h2 className="works-heading">featured work</h2>
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

      {/* About section — scrollable, mirrors works behavior */}
      <section className="about" ref={aboutRef} key={aboutKey}>
        <div className="about-inner">

          {/* Upper portion — existing portrait, text, and decoratives */}
          <div className="about-upper">
            <div className="about-portrait">
              <div className="about-portrait-frame">
                <img src={about2Portrait} alt="" className="about-portrait-frame-img" />
              </div>
              <div className="about-portrait-selfie">
                <img src={about2PortraitSelfie} alt="Armin Mohammadi" className="about-portrait-selfie-img" />
              </div>
            </div>

            <div className="about2-text">
              <h2 className="about2-title">about me</h2>
              <div className="about2-body">
                <p>From the stories 6-year old me used to doodle in my journal to the case study stories I inspire my audience to connect with, I've always been a story teller. This imaginative and creative side has always been innate to me, and it is this natural passion that made me fall in love with product design altogether.</p>
                <p>Living around such diverse perspectives, I want my stories to not just reflect my craft but to also reflect the journeys, culture, and individuality that continues to excite me to connect with others every single day.</p>
              </div>
            </div>

            <img src={about2Paper} alt="" className="about2-paper" aria-hidden />
            <img src={about2Boy} alt="" className="about2-boy" />

            <img src={about2MusicNote} alt="" className="about2-note about2-note--1" aria-hidden />
            <img src={about2MusicNote} alt="" className="about2-note about2-note--2" aria-hidden />
            <img src={about2MusicNote} alt="" className="about2-note about2-note--3" aria-hidden />

            <img src={about2Birds1} alt="" className="about2-birds about2-birds--1" aria-hidden />
            <img src={about2Birds2} alt="" className="about2-birds about2-birds--2" aria-hidden />

            <div className="about2-star about2-star--a" aria-hidden>
              <img src={about2StarMd} alt="" className="about2-star-svg" />
              <img src={about2StarTexture} alt="" className="about2-star-tex" />
            </div>
            <div className="about2-star about2-star--b" aria-hidden>
              <img src={about2StarLg} alt="" className="about2-star-svg" />
              <img src={about2StarTexture} alt="" className="about2-star-tex" />
            </div>
            <div className="about2-star about2-star--c" aria-hidden>
              <img src={about2StarSm} alt="" className="about2-star-svg" />
              <img src={about2StarTexture} alt="" className="about2-star-tex" />
            </div>
            <div className="about2-buffalo-content" aria-hidden>
              <img src={about2BuffaloContent} alt="" className="about2-buffalo-content-img" />
            </div>
          </div>

          {/* Lower portion — tagline + experience list */}
          <div className="about-lower" ref={aboutLowerRef}>
            <div className="about-tagline-col">
              <span className="about-tagline-eyebrow">Driving design through</span>
              <p className="about-tagline-line">
                <span className="about-tagline-big">collaboration</span>
                <span className="about-tagline-and"> and</span>
              </p>
              <p className="about-tagline-line">
                <span className="about-tagline-big">communication</span>
              </p>
            </div>
            <div className="about-positions">
              {POSITIONS.map(({ logo, org, role }) => (
                <div className="about-position" key={org}>
                  <img src={logo} alt="" className="about-position-logo" />
                  <div className="about-position-info">
                    <span className="about-position-name">{org}</span>
                    <span className="about-position-role">{role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Gallery section */}
      <section className="gallery" ref={galleryRef}>
        <div className="gallery-header">
          <h2 className="gallery-heading">gallery</h2>
        </div>

        <div className="gallery-collage" key={galleryKey}>
          <div className="gallery-row">
            <div className="gallery-col gallery-col--a">
              <div className="gallery-tile gallery-tile--video">
                <img src={galleryVrDevice} alt="VR walking-tour prototype preview" />
              </div>
              <div className="gallery-row">
                <div className="gallery-tile gallery-tile--burger">
                  <img src={galleryBurger} alt="Bison burger plate" />
                </div>
                <div className="gallery-tile-rotate-wrap">
                  <div className="gallery-tile gallery-tile--salad">
                    <img src={gallerySalad} alt="Salad bowl" />
                  </div>
                </div>
              </div>
            </div>
            <div className="gallery-tile gallery-tile--bereal">
              <img src={galleryBereal} alt="BeReal photo at a team workspace" />
            </div>
          </div>

          <div className="gallery-row gallery-row--lower">
            <div className="gallery-tile gallery-tile--findy">
              <img src={galleryFindyTeam} alt="Findy team presenting at a case study competition" />
            </div>
            <div className="gallery-col gallery-col--c">
              <div className="gallery-row">
                <div className="gallery-tile gallery-tile--panel">
                  <img src={galleryPanelOutdoors} alt="Holding a black panel outdoors" />
                </div>
                <div className="gallery-tile gallery-tile--laptop">
                  <img src={galleryLaptopScreenshot} alt="Laptop screen showing a research dashboard" />
                </div>
              </div>
              <div className="gallery-tshirt-wrap">
                <div className="gallery-tile gallery-tile--tshirt">
                  <img src={galleryTshirtCrop} alt="T-shirt cropping tool screenshot" />
                </div>
                <div className="gallery-stars" aria-hidden>
                  <div className="about2-star gallery-star--a">
                    <img src={about2StarSm} alt="" className="about2-star-svg" />
                    <img src={about2StarTexture} alt="" className="about2-star-tex" />
                  </div>
                  <div className="about2-star gallery-star--b">
                    <img src={about2StarLg} alt="" className="about2-star-svg" />
                    <img src={about2StarTexture} alt="" className="about2-star-tex" />
                  </div>
                  <div className="about2-star gallery-star--c">
                    <img src={about2StarSm} alt="" className="about2-star-svg" />
                    <img src={about2StarTexture} alt="" className="about2-star-tex" />
                  </div>
                  <div className="about2-star gallery-star--d">
                    <img src={about2StarMd} alt="" className="about2-star-svg" />
                    <img src={about2StarTexture} alt="" className="about2-star-tex" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="gallery-row gallery-row--last">
            <div className="gallery-tile gallery-tile--aura">
              <img src={galleryAuraTile} alt="Aura app — Ready to begin your Quest?" />
            </div>
            <div className="gallery-tile gallery-tile--conference">
              <img src={galleryConferencePhoto} alt="Group photo from a product design conference" />
            </div>
          </div>
        </div>

        <div className="gallery-bottom-mark" aria-label="End of page">
          <span className="gallery-bottom-text">bottom</span>
        </div>
      </section>

      {/* Footer section */}
      <section className="footer">
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
                <button className="footer-nav-link" onClick={() => goTo(2)}>About</button>
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
      onAbout={() => goTo(2)}
      onGallery={() => goTo(3)}
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
