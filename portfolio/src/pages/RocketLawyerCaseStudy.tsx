import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './FindyCaseStudy.css'

import rocketHeroFrame from '../assets/images/rocket-cs-hero-frame.png'
import rocketArtwork from '../assets/images/rocket-artwork.png'
import rocketDashboard from '../assets/images/rocket-cs-dashboard.png'
import orgRocket from '../assets/images/org-rocket.png'
import orgUci from '../assets/images/org-uci.png'
import orgStreets from '../assets/images/org-streets.png'
import navCat from '../assets/images/nav-cat.svg'
import navLinkedin from '../assets/images/nav-linkedin.png'
import navEmail from '../assets/images/nav-email.png'
import navResume from '../assets/images/nav-resume.png'
import findyGif from '../assets/images/FindyGif.gif'
import streetsGif from '../assets/images/streetsgif.gif'

const NAV_ITEMS = [
  { id: '',             label: 'Background',  routable: false },
  { id: 'problem',      label: 'Problem',     routable: true  },
  { id: 'research',     label: 'Research',    routable: true  },
  { id: 'solution',     label: 'Solution',    routable: false },
  { id: 'reflections',  label: 'Reflections', routable: false },
]

function cubicBezierEase(t: number, x1: number, y1: number, x2: number, y2: number): number {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  const sX = (u: number) => ((ax * u + bx) * u + cx) * u
  const sY = (u: number) => ((ay * u + by) * u + cy) * u
  const dX = (u: number) => (3 * ax * u + 2 * bx) * u + cx
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

const EASE_X1 = 0.76, EASE_Y1 = 0, EASE_X2 = 0.24, EASE_Y2 = 1
const SCROLL_DURATION = 650

export default function RocketLawyerCaseStudy() {
  const [active, setActive] = useState('problem')
  const [resumeOpen, setResumeOpen] = useState(false)
  const targetYRef = useRef(0)
  const currentYRef = useRef(0)
  const rafRef = useRef<number | null>(null)

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

  useEffect(() => {
    currentYRef.current = window.scrollY
    targetYRef.current = currentYRef.current

    function tick() {
      const diff = targetYRef.current - currentYRef.current
      if (Math.abs(diff) < 0.5) {
        currentYRef.current = targetYRef.current
        window.scrollTo(0, currentYRef.current)
        rafRef.current = null
        return
      }
      currentYRef.current += diff * 0.085
      window.scrollTo(0, currentYRef.current)
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

  const scrollTo = useCallback((id: string) => {
    if (!id) {
      const startY = window.scrollY
      const startTime = performance.now()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      targetYRef.current = 0
      function frameTop(now: number) {
        const elapsed = Math.min(now - startTime, SCROLL_DURATION)
        const eased = cubicBezierEase(elapsed / SCROLL_DURATION, EASE_X1, EASE_Y1, EASE_X2, EASE_Y2)
        const y = startY * (1 - eased)
        window.scrollTo(0, y)
        if (elapsed < SCROLL_DURATION) {
          rafRef.current = requestAnimationFrame(frameTop)
        } else {
          currentYRef.current = 0
          targetYRef.current = 0
          rafRef.current = null
        }
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
        currentYRef.current = targetY
        rafRef.current = null
      }
    }
    rafRef.current = requestAnimationFrame(frame)
  }, [])

  return (
    <div className="fcs-page">

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

        <aside className="fcs-sidebar">
          <nav className="fcs-nav">
            {NAV_ITEMS.map(({ id, label, routable }, i) => (
              <button
                key={`${label}-${i}`}
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

        <main className="fcs-content">
          <div className="fcs-inner">

            <header className="fcs-header">
              <div className="fcs-hero-frame-container fcs-hero-rocket">
                <img src={rocketHeroFrame} alt="" className="fcs-rocket-main" draggable={false} />
                <img src={rocketArtwork} alt="" className="fcs-rocket-artwork" draggable={false} />
              </div>
              <div className="fcs-org-row">
                <img src={orgRocket} alt="" className="fcs-org-logo" />
                <span className="fcs-org-name">Rocket Lawyer</span>
              </div>
              <h1 className="fcs-title">Rocket Copilot</h1>
              <div className="fcs-tags">
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Role</span>
                  <span className="fcs-tag-value">UI/UX Intern</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Internship Duration</span>
                  <span className="fcs-tag-value">June 2026 – Sep. 2026</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Tools</span>
                  <span className="fcs-tag-value">Figma, UserTesting, Amplitude</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">AI</span>
                  <span className="fcs-tag-value">Claude Design, Claude Cowork, Figma Make</span>
                </div>
              </div>
            </header>

            <section className="fcs-section" id="problem">
              <span className="fcs-section-label">Background</span>
              <p className="fcs-section-body">
                Rocket Lawyer is a legal platform designed towards empowering small business users with access
                to otherwise costly legal services. Rocket Copilot aims to integrate AI as part of the document
                generation, negotiation, and organization processes that define working with attorneys.
              </p>
              <p className="fcs-section-body">
                I led the research and discovery for the Negotiation &amp; Sign end-to-end experience, translating
                survey, interview, and usability testing insights into design decisions presented and shipped to
                project management and engineering stakeholders.
              </p>
              <img
                src={rocketDashboard}
                alt="Old: Copilot Agent Negotiation View"
                className="fcs-section-img"
              />
            </section>

            <section className="fcs-section" id="research">
              <span className="fcs-section-label">Research</span>
              <p className="fcs-section-body">
                I conducted and synthesized 100+ user test respondents through surveys, usability sessions,
                and stakeholder interviews — mapping findings into themes, pain points, and potential
                feature recommendations.
              </p>

              <h3 className="fcs-subsection-heading">
                Affinity Mapping 100+ User Test Respondents into Themes, Pain Points, and Potential Feature Recommendations
              </h3>

              {/* Affinity map images — image fills in Figma, export each frame at 3x */}
              <img
                src={rocketDashboard}
                alt="Old: Copilot Agent Negotiation View — affinity mapping source"
                className="fcs-section-img"
              />

              <h3 className="fcs-subsection-heading">Key Insights</h3>

              <div className="fcs-insight-grid">
                <div className="fcs-insight-card">
                  <div className="fcs-insight-number">01</div>
                  <p className="fcs-insight-body">
                    Users trust Copilot to accurately validate, flag, and redline any clauses
                    throughout the negotiate process.
                  </p>
                </div>
                <div className="fcs-insight-card">
                  <div className="fcs-insight-number">02</div>
                  <p className="fcs-insight-body">
                    Users often face frustration with version control and tracking changes,
                    leading to a desire for enhanced organization.
                  </p>
                </div>
              </div>
            </section>

            <section className="fcs-upnext">
              <div className="fcs-upnext-divider" />
              <h2 className="fcs-upnext-heading">Up Next</h2>
              <div className="fcs-upnext-cards">
                <Link to="/work/findy" className="fcs-upnext-card">
                  <div className="fcs-upnext-card-artwork">
                    <img src={findyGif} alt="" draggable={false} />
                  </div>
                  <div className="fcs-upnext-card-info">
                    <div className="fcs-upnext-card-org">
                      <img src={orgUci} alt="" className="fcs-upnext-card-org-logo" />
                      <span>Design @ UCI</span>
                    </div>
                    <div className="fcs-upnext-card-title">Findy</div>
                  </div>
                </Link>
                <Link to="/work/streets" className="fcs-upnext-card">
                  <div className="fcs-upnext-card-artwork">
                    <img src={streetsGif} alt="" draggable={false} />
                  </div>
                  <div className="fcs-upnext-card-info">
                    <div className="fcs-upnext-card-org">
                      <img src={orgStreets} alt="" className="fcs-upnext-card-org-logo" />
                      <span>Streets by Plyance</span>
                    </div>
                    <div className="fcs-upnext-card-title">Streets Enterprise UI</div>
                  </div>
                </Link>
              </div>
            </section>

          </div>
        </main>

      </div>

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
