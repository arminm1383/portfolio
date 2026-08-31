import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Home.css'
import Navbar from '../components/Navbar'
import { lenis, scrollTo } from '../lib/scroll'

import heroIllustration from '../assets/images/hero-illustration.png'
import streetsGif from '../assets/images/streetsgif.gif'
import rocketArtwork from '../assets/images/rocket-artwork.gif'
import findyGif from '../assets/images/FindyGif.gif'
import auraGif from '../assets/images/auragif.gif'
import navCat from '../assets/images/nav-cat.svg'
import orgStreets from '../assets/images/org-streets.png'
import orgRocket from '../assets/images/org-rocket.png'
import orgUci from '../assets/images/org-uci.png'
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
  { logo: orgAdobe,            org: 'Adobe',                    role: 'Project Teams Lead' },
  { logo: orgPacuci,           org: 'Product Association @ UCI', role: 'Product Design Lead' },
  { logo: orgAccessComputing,  org: 'Access Computing',         role: 'Research & Design Assistant' },
]

export default function Home() {
  const [resumeOpen, setResumeOpen] = useState(false)

  const heroRef   = useRef<HTMLElement>(null)
  const worksRef  = useRef<HTMLElement>(null)
  const resumeRef = useRef<HTMLElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  const aboutLowerRef = useRef<HTMLDivElement>(null)
  const heroIllRef    = useRef<HTMLImageElement>(null)

  // Real pointer tracking for popup positioning
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastPointerPos.x = e.clientX
      lastPointerPos.y = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // All GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Hero entrance timeline ──────────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.hero-topnav',       { opacity: 0, y: -10, duration: 0.75 }, 0.05)
      tl.from(heroIllRef.current,   { opacity: 0, y: 10,  duration: 0.75 }, 0.1)
      tl.from('.hero-name-block',   { opacity: 0, y: 10,  duration: 0.75 }, 0.2)
      tl.from('.hero-tag-designer', { opacity: 0, y: 10,  duration: 0.75 }, 0.48)
      tl.from('.hero-tag-anteater', { opacity: 0, y: 10,  duration: 0.75 }, 0.58)
      tl.from('.hero-star', {
        opacity: 0, scale: 0.3, duration: 0.4,
        stagger: 0.1, ease: 'back.out(2)',
      }, 0.45)
      tl.from('.navbar', { opacity: 0, y: 12, duration: 0.75 }, 0.68)

      // ── Perpetual tag bob ───────────────────────────────────────────────
      gsap.to('.hero-tag-designer', {
        y: -3, duration: 1.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.23,
      })
      gsap.to('.hero-tag-anteater', {
        y: -3, duration: 1.85, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.33,
      })

      // ── Work cards: staggered fade-in on section enter ─────────────────
      ScrollTrigger.create({
        trigger: worksRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.fromTo('.work-card',
            { opacity: 0 },
            { opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power2.out' }
          )
        },
      })

      // ── About lower: tagline + position cards slide up ─────────────────
      ScrollTrigger.create({
        trigger: aboutLowerRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ['.about-tagline-eyebrow', '.about-tagline-line', '.about-position'],
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
          )
        },
      })

    })

    return () => {
      ctx.revert()
      ScrollTrigger.clearScrollMemory()
    }
  }, [])

  // ── Hero parallax via GSAP quickTo (smooth inertia mouse tracking) ──────
  useEffect(() => {
    const ill = heroIllRef.current
    if (!ill) return
    const xTo = gsap.quickTo(ill, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(ill, 'y', { duration: 0.6, ease: 'power3.out' })
    const startedAt = Date.now()
    const onMove = (e: MouseEvent) => {
      if (Date.now() - startedAt < 900) return
      const mx = e.clientX / window.innerWidth - 0.5
      const my = e.clientY / window.innerHeight - 0.5
      const max = Math.min(window.innerWidth * 0.02, 22)
      xTo(mx * max * 0.6)
      yTo(my * max * 0.5)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.set(ill, { x: 0, y: 0 })
    }
  }, [])

  // ── Resume modal: pause / resume Lenis so the page stays locked ─────────
  useEffect(() => {
    if (!resumeOpen) return
    lenis.stop()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setResumeOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      lenis.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [resumeOpen])

  return (
    <>
      <div className="home">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="hero" ref={heroRef}>
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

        {/* ── Works grid ────────────────────────────────────────────────── */}
        <section className="works" ref={worksRef}>
          <div className="works-header">
            <h2 className="works-heading">featured work</h2>
            <p className="works-subtitle">a collection of some of my latest projects</p>
          </div>
          <div className="works-grid">
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

        {/* ── Resume ────────────────────────────────────────────────────── */}
        <section className="resume-section" ref={resumeRef}>
          <div className="resume-section-header">
            <h2 className="resume-section-heading">resume</h2>
            <p className="resume-section-subtitle">some of my involvements</p>
          </div>
          <div className="resume-lower" ref={aboutLowerRef}>
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
        </section>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <section className="footer" ref={footerRef}>
          <div className="footer-inner">
            <div className="footer-sep" aria-hidden />
            <div className="footer-content">
              <div className="footer-left">
                <h2 className="footer-tagline">Designing Connection through Collaboration</h2>
                <p className="footer-copy">@ Armin Mohammadi 2026</p>
              </div>
              <nav className="footer-nav" aria-label="Footer navigation">
                <div className="footer-nav-col">
                  <button className="footer-nav-link" onClick={() => scrollTo(0)}>Home</button>
                  <button className="footer-nav-link" onClick={() => scrollTo(worksRef.current!)}>Works</button>
                  <button className="footer-nav-link" onClick={() => scrollTo(resumeRef.current!)}>Resume</button>
                </div>
                <div className="footer-nav-col">
                  <a href="mailto:arminmohammadi1342@gmail.com" className="footer-nav-link">Email</a>
                  <button className="footer-nav-link" onClick={() => setResumeOpen(true)}>View Resume</button>
                  <a href="https://www.linkedin.com/in/arminmoh" target="_blank" rel="noreferrer" className="footer-nav-link">LinkedIn</a>
                </div>
              </nav>
            </div>
          </div>
        </section>
      </div>

      {/* ── Fixed top nav ────────────────────────────────────────────────── */}
      <div className="hero-topnav">
        <button className="hero-topnav-logo" onClick={() => scrollTo(0)}>
          <img src={navCat} alt="" className="hero-topnav-cat" />
          <div className="hero-topnav-identity">
            <span className="hero-topnav-name">Armin Mohammadi</span>
            <span className="hero-topnav-role">Product Designer</span>
          </div>
        </button>
      </div>

      <Navbar
        onWork={() => scrollTo(worksRef.current!)}
        onAbout={() => scrollTo(resumeRef.current!)}
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
