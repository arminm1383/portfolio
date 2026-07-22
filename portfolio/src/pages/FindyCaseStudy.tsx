import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './FindyCaseStudy.css'

import findyHeroFrame from '../assets/images/findy-cs-hero-frame.png'
import orgUci from '../assets/images/org-uci.png'
import navCat from '../assets/images/nav-cat.svg'
import navLinkedin from '../assets/images/nav-linkedin.png'
import navEmail from '../assets/images/nav-email.png'
import navResume from '../assets/images/nav-resume.png'
import researchCard from '../assets/images/findy-cs-research-card.png'
import researchPhotos from '../assets/images/findy-cs-research-photos.png'
import insights from '../assets/images/findy-cs-insights.png'
import feature1 from '../assets/images/findy-cs-feature1.png'
import feature2 from '../assets/images/findy-cs-feature2.png'
import feature3 from '../assets/images/findy-cs-feature3.png'
import reflectionPhoto1 from '../assets/images/findy-cs-reflection-photo1.png'
import reflectionPhoto2 from '../assets/images/findy-cs-reflection-photo2.png'

const NAV_ITEMS = [
  { id: '',            label: 'Background',  routable: false },
  { id: 'problem',     label: 'Problem',     routable: true  },
  { id: 'research',    label: 'Research',    routable: true  },
  { id: 'solution',    label: 'Solution',    routable: true  },
  { id: 'reflections', label: 'Reflections', routable: true  },
]

// Cubic bezier evaluator matching CSS cubic-bezier(x1,y1,x2,y2)
function cubicBezierEase(t: number, x1: number, y1: number, x2: number, y2: number): number {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  const sX = (u: number) => ((ax * u + bx) * u + cx) * u
  const sY = (u: number) => ((ay * u + by) * u + cy) * u
  const dX = (u: number) => (3 * ax * u + 2 * bx) * u + cx
  // Newton-Raphson to solve for parametric u where sX(u) = t
  let u = t
  for (let i = 0; i < 8; i++) {
    const dx = sX(u) - t
    if (Math.abs(dx) < 1e-7) break
    const d = dX(u)
    if (Math.abs(d) < 1e-7) break
    u -= dx / d
  }
  return sY(u)
}

// Landing page easing: cubic-bezier(0.76, 0, 0.24, 1), 650ms
const EASE_X1 = 0.76, EASE_Y1 = 0, EASE_X2 = 0.24, EASE_Y2 = 1
const SCROLL_DURATION = 650

export default function FindyCaseStudy() {
  const [active, setActive] = useState('problem')
  const [resumeOpen, setResumeOpen] = useState(false)
  const targetYRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  // Unlock body scroll
  useEffect(() => {
    document.documentElement.style.overflow = 'auto'
    document.documentElement.style.height = 'auto'
    document.body.style.overflow = 'auto'
    document.body.style.height = 'auto'
    return () => {
      document.documentElement.style.overflow = ''
      document.documentElement.style.height = ''
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
  }, [])

  // Smooth wheel scroll with lerp-style weighted feel (matches landing page weight)
  useEffect(() => {
    let currentY = window.scrollY
    targetYRef.current = currentY

    function tick() {
      const diff = targetYRef.current - currentY
      if (Math.abs(diff) < 0.5) {
        currentY = targetYRef.current
        window.scrollTo(0, currentY)
        rafRef.current = null
        return
      }
      // Lerp factor tuned to match 650ms cubic-bezier(0.76,0,0.24,1) feel
      currentY += diff * 0.085
      window.scrollTo(0, currentY)
      rafRef.current = requestAnimationFrame(tick)
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const maxY = document.body.scrollHeight - window.innerHeight
      targetYRef.current = Math.max(0, Math.min(maxY, targetYRef.current + e.deltaY * 1.2))
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Scroll-spy: track which routable section is in the 35% viewport zone
  useEffect(() => {
    const routable = NAV_ITEMS.filter(i => i.routable)

    function update() {
      const threshold = window.innerHeight * 0.35
      let found = routable[0].id
      for (const { id } of routable) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= threshold + 60) found = id
      }
      setActive(found)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  // Sidebar click: animated scroll to section (or to top for Background)
  const scrollTo = useCallback((id: string) => {
    if (!id) {
      // Background — scroll to top
      const startY = window.scrollY
      const startTime = performance.now()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      targetYRef.current = 0
      function frameTop(now: number) {
        const elapsed = Math.min(now - startTime, SCROLL_DURATION)
        const eased = cubicBezierEase(elapsed / SCROLL_DURATION, EASE_X1, EASE_Y1, EASE_X2, EASE_Y2)
        window.scrollTo(0, startY * (1 - eased))
        if (elapsed < SCROLL_DURATION) rafRef.current = requestAnimationFrame(frameTop)
        else rafRef.current = null
      }
      rafRef.current = requestAnimationFrame(frameTop)
      return
    }
    const el = document.getElementById(id)
    if (!el) return
    const startY = window.scrollY
    const targetY = el.getBoundingClientRect().top + startY - 80
    const startTime = performance.now()

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    targetYRef.current = targetY

    function frame(now: number) {
      const elapsed = Math.min(now - startTime, SCROLL_DURATION)
      const t = elapsed / SCROLL_DURATION
      const eased = cubicBezierEase(t, EASE_X1, EASE_Y1, EASE_X2, EASE_Y2)
      const y = startY + (targetY - startY) * eased
      window.scrollTo(0, y)
      if (elapsed < SCROLL_DURATION) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(frame)
  }, [])

  return (
    <div className="fcs-page">

      {/* ── Fixed top bar ── */}
      <header className="fcs-topbar">
        <Link to="/" className="fcs-topbar-logo">
          <img src={navCat} alt="" className="fcs-topbar-cat" />
          <div className="fcs-topbar-identity">
            <span className="fcs-topbar-name">Armin Mohammadi</span>
            <span className="fcs-topbar-role">Product Designer</span>
          </div>
        </Link>
        <div className="fcs-topbar-contact">
          <a href="https://www.linkedin.com/in/arminmoh" target="_blank" rel="noreferrer" className="fcs-topbar-icon">
            <img src={navLinkedin} alt="LinkedIn" width={30} height={29} />
          </a>
          <a href="mailto:arminmohammadi1342@gmail.com" className="fcs-topbar-icon">
            <img src={navEmail} alt="Email" width={29} height={22} />
          </a>
          <button className="fcs-topbar-icon" aria-label="Resume" onClick={() => setResumeOpen(true)}>
            <img src={navResume} alt="Resume" width={22} height={27} />
          </button>
        </div>
      </header>

      <div className="fcs-body">

        {/* Left sidebar — fixed, plain text nav */}
        <aside className="fcs-sidebar">
          <nav className="fcs-nav">
            {NAV_ITEMS.map(({ id, label, routable }) => (
              <button
                key={label}
                className={[
                  'fcs-nav-item',
                  !routable && id !== '' ? 'fcs-nav-item--soon' : '',
                  active === id && id !== '' ? 'fcs-nav-item--active' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => (routable || id === '') ? scrollTo(id) : undefined}
                disabled={!routable && id !== ''}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="fcs-content">
          <div className="fcs-inner">

            {/* ── Header ── */}
            <header className="fcs-header">
              {/* Hero frame — exact 1028×628 Figma export, breaks out of inner padding */}
              <img
                src={findyHeroFrame}
                alt=""
                className="fcs-hero-frame"
                draggable={false}
              />
              <div className="fcs-org-row">
                <img src={orgUci} alt="" className="fcs-org-logo" />
                <span className="fcs-org-name">Design @ UCI</span>
              </div>
              <h1 className="fcs-title">Findy</h1>
              <div className="fcs-tags">
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Role</span>
                  <span className="fcs-tag-value">Product Designer</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Project Duration</span>
                  <span className="fcs-tag-value">March 2026 – June 2026</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Tools</span>
                  <span className="fcs-tag-value">Figma</span>
                </div>
              </div>
            </header>

            {/* ── Problem ── */}
            <section className="fcs-section" id="problem">
              <span className="fcs-section-label">Problem</span>
              <p className="fcs-section-body">
                As technology deeply embeds itself in society, seniors are left to navigate
                unfamiliar systems on their own, sparking feelings of confusion, exclusion,
                and frustration.
              </p>
            </section>

            {/* ── Research ── */}
            <section className="fcs-section" id="research">
              <span className="fcs-section-label">Research</span>
              <p className="fcs-section-body">
                Our initial attempts to gauge research proved our thought process was glaringly
                flawed: we needed to connect and bond with target users face-to-face.
              </p>
              <img
                src={researchCard}
                alt="Finding: surveys weren't working — 73.3% frustration stat"
                className="fcs-research-card-img"
              />
              <img
                src={researchPhotos}
                alt="Conducting usability tests with the Adriana Elderly Care Home and focus group with the Huntington Beach Council on Aging"
                className="fcs-section-img"
              />
              <img
                src={insights}
                alt="Three insights: no general approach, barrier is overwhelm not ability, when support takes over learning stops"
                className="fcs-section-img"
              />
            </section>

            {/* ── Solution ── */}
            <section className="fcs-section" id="solution">
              <span className="fcs-section-label">Solution</span>
              <img
                src={feature1}
                alt="Feature 1: Assistance at the press of a button — Need something? Just call Findy."
                className="fcs-section-img"
              />
              <img
                src={feature2}
                alt="Feature 2: Spotlight and dimming user interactions — Decreasing overwhelm. Maintaining control."
                className="fcs-section-img"
              />
              <img
                src={feature3}
                alt="Feature 3: Synchronization across apps — App Integration Providing Clarity and Empowerment."
                className="fcs-section-img"
              />
            </section>

            {/* ── Reflections ── */}
            <section className="fcs-section" id="reflections">
              <span className="fcs-section-label">Reflections</span>
              <p className="fcs-section-body">
                Moving forward, next steps are such...
              </p>

              <div className="fcs-next-steps">
                <div className="fcs-next-step">
                  <div className="fcs-next-step-left">
                    <div className="fcs-next-step-circle" />
                    <h3 className="fcs-next-step-title">Tailoring User Preferences Becomes the Core</h3>
                  </div>
                  <p className="fcs-next-step-body">
                    The most important element of seniors is that their needs vary drastically across age, medical condition,
                    tech literacy, and more. By building upon the onboarding and preference-tailoring aspects of the app,
                    we could connect with far more groups of seniors than the specific niche our base approach captures.
                  </p>
                </div>

                <div className="fcs-next-step">
                  <div className="fcs-next-step-left">
                    <div className="fcs-next-step-circle" />
                    <h3 className="fcs-next-step-title">Diving even Further in the UX Research Process</h3>
                  </div>
                  <p className="fcs-next-step-body">
                    With our research being highly targeted towards higher-income, technologically fluent individuals,
                    the scope of Findy is limited. I'd love to reach out to other drastically different communities,
                    including immigrant communities, low-income individuals, users with memory conditions, and more,
                    to further usability test and probe how Findy's current state can be adapted for inclusivity.
                  </p>
                </div>
              </div>

              <p className="fcs-section-body fcs-award-text">
                Findy won first place as part of a case study competition hosted by Design @ UCI, proving that
                creative vision and a dedication towards connecting with users is key towards building resonant
                emerging interfaces.
              </p>

              <div className="fcs-reflection-photos">
                <figure className="fcs-reflection-photo">
                  <img src={reflectionPhoto1} alt="My team and I after placing first in the Spring case competition" />
                  <figcaption>My team and I after placing first in the Spring case competition</figcaption>
                </figure>
                <figure className="fcs-reflection-photo">
                  <img src={reflectionPhoto2} alt="Interactive survey setup at the Huntington Beach Council of Aging" />
                  <figcaption>Interactive survey setup at the Huntington Beach Council of Aging</figcaption>
                </figure>
              </div>
            </section>

          </div>
        </main>

      </div>

      {/* Resume modal */}
      {resumeOpen && (
        <div className="fcs-resume-overlay" onClick={() => setResumeOpen(false)}>
          <div className="fcs-resume-modal" onClick={e => e.stopPropagation()}>
            <button className="fcs-resume-close" onClick={() => setResumeOpen(false)}>×</button>
            <iframe
              className="fcs-resume-iframe"
              src="https://embed.figma.com/proto/leZEBxJorC3mH2RtuKTTQN/Resume?node-id=1-3&viewport=-3405%2C1260%2C1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share"
              allowFullScreen
              title="Resume"
            />
          </div>
        </div>
      )}
    </div>
  )
}
