import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './FindyCaseStudy.css'
import CsTopbar from '../components/CsTopbar'

import rocketHeroGif from '../assets/images/rocket-cs-hero-new.gif'
import rocketDiagram from '../assets/images/rocket-cs-diagram.png'
import rocketChart from '../assets/images/rocket-cs-chart.png'
import rocketAffinityMap from '../assets/images/rocket-cs-affinity-map.png'
import rocketResearch from '../assets/images/rocket-cs-research.png'
import rocketVersionHistory from '../assets/images/rocket-cs-version-history.png'
import rocketCommsTimeline from '../assets/images/rocket-cs-comms-timeline.png'
import iconSparkles from '../assets/images/icon-sparkles.svg'
import iconDocument from '../assets/images/icon-document.svg'
import iconEmail from '../assets/images/icon-email.svg'
import rqIcon1 from '../assets/images/rq-icon-1.svg'
import rqIcon2 from '../assets/images/rq-icon-2.svg'
import rqIcon3 from '../assets/images/rq-icon-3.svg'
import orgRocket from '../assets/images/org-rocket.png'
import orgUci from '../assets/images/org-uci.png'
import orgStreets from '../assets/images/org-streets.png'
import findyGif from '../assets/images/FindyGif.gif'
import streetsGif from '../assets/images/streetsgif.gif'

const NAV_ITEMS = [
  { id: '',            label: 'Background',             routable: false },
  { id: 'problem',     label: 'Problem',                routable: true  },
  { id: 'research',    label: 'Research',               routable: true  },
  { id: 'design-recs', label: 'Design Recommendations', routable: true  },
  { id: 'solution',    label: 'Solution & Results',     routable: true  },
  { id: 'reflections', label: 'Reflections',            routable: true  },
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

function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const [val, setVal] = useState(0)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = spanRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.disconnect()
      const start = performance.now()
      const dur = 650
      function frame(now: number) {
        const t = Math.min((now - start) / dur, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setVal(eased * to)
        if (t < 1) requestAnimationFrame(frame)
        else setVal(to)
      }
      requestAnimationFrame(frame)
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])

  return <span ref={spanRef}>{val.toFixed(decimals)}%</span>
}

export default function RocketLawyerCaseStudy() {
  const [active, setActive] = useState('')
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
      let found = ''
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
        window.scrollTo(0, startY * (1 - eased))
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
      const eased = cubicBezierEase(elapsed / SCROLL_DURATION, EASE_X1, EASE_Y1, EASE_X2, EASE_Y2)
      window.scrollTo(0, startY + (targetY - startY) * eased)
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
    <div className="fcs-page fcs-page--rocket">

      <CsTopbar showAtTop />

      <div className="fcs-body">

        <aside className="fcs-sidebar">
          <nav className="fcs-nav">
            {NAV_ITEMS.map(({ id, label }, i) => (
              <button
                key={`${label}-${i}`}
                className={[
                  'fcs-nav-item',
                  active === id ? 'fcs-nav-item--active' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => scrollTo(id)}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="fcs-content">
          <div className="fcs-inner">

            {/* ── Header ── */}
            <header className="fcs-header">
              <div className="fcs-name-org">
                <div className="fcs-org-row">
                  <img src={orgRocket} alt="" className="fcs-org-logo" />
                  <span className="fcs-org-name">Rocket Lawyer</span>
                </div>
                <h1 className="fcs-title">Rocket Copilot</h1>
              </div>
              <img src={rocketHeroGif} alt="" className="fcs-hero-single" draggable={false} />
              <div className="fcs-tags">
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Role</span>
                  <span className="fcs-tag-value">UX Research Intern</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Timeline</span>
                  <span className="fcs-tag-value">June 2026 – Sep. 2026</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Team</span>
                  <div className="fcs-tag-values">
                    <span className="fcs-tag-value">Product Management</span>
                    <span className="fcs-tag-value">Product Design</span>
                    <span className="fcs-tag-value">UX Research</span>
                  </div>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Tools</span>
                  <div className="fcs-tag-values">
                    <span className="fcs-tag-value">Figma</span>
                    <span className="fcs-tag-value">UserTesting</span>
                    <span className="fcs-tag-value">Claude</span>
                    <span className="fcs-tag-value">Amplitude</span>
                  </div>
                </div>
              </div>
            </header>

            {/* ── Background ── */}
            <section className="fcs-section">
              <span className="fcs-section-label">Background</span>
              <h2 className="fcs-section-heading">Redefining Legal Tech with AI</h2>
              <p className="fcs-section-body">
                In pursuit of evolving the legal-tech experience to incorporate AI tools for customers,
                internally, the design team was also completely restructuring their workflow to maximize
                data-backed solutions. As part of this, I was brought on to not only drive design through
                UX research but to also build, from the ground up, Claude-powered UX research pipelines
                that puts customer insights at the forefront of every design project.
              </p>
              <img src={rocketDiagram} alt="" className="fcs-section-img" draggable={false} />
              <p className="fcs-media-caption-red">Design System Component for Copilot Sidebar Menu</p>
              <p className="fcs-section-body">
                In addition to ux research, AI was used to help integrate connectivity with upgraded
                design systems, using Claude skills and Design Engineering principles to update the
                updated visuals, components typography attributes.
              </p>
            </section>

            {/* ── Problem ── */}
            <section className="fcs-section" id="problem">
              <span className="fcs-section-label">Problem</span>
              <h2 className="fcs-section-heading">Negotiate &amp; Sign felt Disconnected from User Needs</h2>
              <p className="fcs-section-body">
                Users' business needs were not quite captured by the existing E2E flows, with Copilot
                seemingly feeling misaligned with what small business cohorts need to continue using
                the platform.
              </p>

              <div className="fcs-problem-stats">
                <div className="fcs-problem-stat">
                  <span className="fcs-problem-stat-num"><CountUp to={26.9} decimals={1} /></span>
                  <p className="fcs-problem-stat-text">drop in subscription rates over the course of 3 months</p>
                </div>
                <div className="fcs-problem-stat">
                  <span className="fcs-problem-stat-num"><CountUp to={44} decimals={0} /></span>
                  <p className="fcs-problem-stat-text">drop in weekly user activity after 3 weeks of use</p>
                </div>
                <div className="fcs-problem-stat">
                  <span className="fcs-problem-stat-num"><CountUp to={13.7} decimals={1} /></span>
                  <p className="fcs-problem-stat-text">drop in Copilot Usage over the course of 3 months</p>
                </div>
              </div>

              <p className="fcs-section-body">
                To address this, we centered our study around addressing user concerns in hopes of
                better optimizing Rocket Lawyer for the aforementioned business metrics.
              </p>

              <div className="fcs-rq-card">
                <span className="fcs-rq-label">Research Questions</span>
                <div className="fcs-rq-item">
                  <img src={rqIcon1} alt="" className="fcs-rq-icon-img" aria-hidden="true" />
                  <p className="fcs-rq-text">To what extent do users trust Copilot AI when it comes to automating legal tasks?</p>
                </div>
                <div className="fcs-rq-divider" />
                <div className="fcs-rq-item">
                  <img src={rqIcon2} alt="" className="fcs-rq-icon-img" aria-hidden="true" />
                  <p className="fcs-rq-text">What pain points do users face when trying to negotiate a document with other parties?</p>
                </div>
                <div className="fcs-rq-divider" />
                <div className="fcs-rq-item">
                  <img src={rqIcon3} alt="" className="fcs-rq-icon-img" aria-hidden="true" />
                  <p className="fcs-rq-text">How are users currently managing their own documents and small business workflows?</p>
                </div>
              </div>
            </section>

            {/* ── Research ── */}
            <section className="fcs-section" id="research">
              <span className="fcs-section-label">Research</span>
              <h3 className="fcs-subsection-heading">Automating the Workflow</h3>
              <p className="fcs-section-body">
                Beyond traditional methods for developing user tests, I created an AI pipeline to automate
                the generation of direct comparison usability tests, experimented on throughout the
                Negotiate &amp; Sign project.
              </p>
              <div className="fcs-media-card fcs-media-card--padded">
                <div className="fcs-media-card-inner fcs-media-card-inner--frame">
                  <div className="fcs-media-frame-overflow">
                    <img src={rocketResearch} alt="AI pipeline for building user tests" className="fcs-media-card-img fcs-media-card-img--frame" draggable={false} />
                  </div>
                </div>
                <p className="fcs-media-caption-red">Building User Tests using Claude Cowork and Chrome &amp; Figma MCPs</p>
              </div>

              <h3 className="fcs-subsection-heading">Quantifying our Users</h3>
              <p className="fcs-section-body">
                UserTesting was used to connect with 100+ Rocket Lawyer users, gathering a high-level
                understanding of the research themes further explored through user interviews.
              </p>
              <div className="fcs-media-card">
                <img src={rocketChart} alt="Survey results chart" className="fcs-media-card-img fcs-media-chart" draggable={false} />
              </div>

              <h3 className="fcs-subsection-heading">Talking to Customers</h3>
              <p className="fcs-section-body">
                By conducting user interviews with both attorneys and Rocket Lawyer users, I surfaced
                critical research themes that addressed user opinions towards everything from AI use and
                document generation to case management and workspace organization.
              </p>

              <div className="fcs-quote-card">
                <div className="fcs-quote-entry">
                  <span className="fcs-quote-icon" aria-hidden="true">"</span>
                  <div className="fcs-quote-content">
                    <span className="fcs-quote-attr">Small-business owner</span>
                    <p className="fcs-quote-text">"how do I have to get these things drafted without calling an attorney."</p>
                  </div>
                </div>
                <div className="fcs-quote-divider" />
                <div className="fcs-quote-entry">
                  <span className="fcs-quote-icon" aria-hidden="true">"</span>
                  <div className="fcs-quote-content">
                    <span className="fcs-quote-attr">Attorney</span>
                    <p className="fcs-quote-text">"how do I have to get these things drafted without calling an attorney."</p>
                  </div>
                </div>
              </div>

              <div className="fcs-media-card fcs-media-card--padded">
                <div className="fcs-media-card-inner">
                  <img src={rocketAffinityMap} alt="Affinity map of user interview insights" className="fcs-media-card-img" draggable={false} />
                </div>
                <p className="fcs-media-caption-red">Affinity Map Breaking Down User Interview Insights into Thematic Analysis</p>
              </div>

              <h3 className="fcs-subsection-heading">Synthesizing Findings into Themes</h3>
              <p className="fcs-section-body">
                Through the results analyzed, I put together the following key themes that best capture
                our users' expectations of the Copilot experience within Negotiate &amp; Sign end-to-end flows.
              </p>

              <div className="fcs-theme-cards">
                <div className="fcs-theme-card">
                  <img src={iconSparkles} alt="" className="fcs-theme-icon" aria-hidden="true" />
                  <div className="fcs-theme-content">
                    <p className="fcs-theme-title">AI Integrated in the Document Authorship Process</p>
                    <p className="fcs-theme-body">As long as there is some human making the final confirmation, users want to be able to offload tasks and processes to Copilot.</p>
                  </div>
                </div>
                <div className="fcs-theme-card">
                  <img src={iconDocument} alt="" className="fcs-theme-icon" aria-hidden="true" />
                  <div className="fcs-theme-content">
                    <p className="fcs-theme-title">Document and Templates Organized</p>
                    <p className="fcs-theme-body">Users struggle with managing, organizing, and editing multiple documents across platform, especially when AI support should be seemingly available.</p>
                  </div>
                </div>
                <div className="fcs-theme-card">
                  <img src={iconEmail} alt="" className="fcs-theme-icon" aria-hidden="true" />
                  <div className="fcs-theme-content">
                    <p className="fcs-theme-title">Communication is a Blocker</p>
                    <p className="fcs-theme-body">There is a clear need to manage the sending and receiving of information. The generation and deployment of automated emails resonated, and time management systems can help enhance the process further.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Design Recommendations ── */}
            <section className="fcs-section" id="design-recs">
              <span className="fcs-section-label">Design Recommendations</span>
              <h2 className="fcs-section-heading">Designing Features to Address Research Findings</h2>
              <p className="fcs-section-body">
                The following design recommendations were built to help inform potential future directions
                for the experience. While not directly implemented, their existence shaped the trajectory
                of the iterative project.
              </p>

              <div className="fcs-rec-subsection">
                <h3 className="fcs-rec-heading">Adding Version History to Track Changes over Time</h3>
                <p className="fcs-section-body">
                  The following design recommendations were built to help inform potential future directions
                  for the experience. While not directly implemented, their existence shaped the trajectory
                  of the iterative project.
                </p>
                <div className="fcs-rec-image-wrap">
                  <img src={rocketVersionHistory} alt="Version history design recommendation" className="fcs-rec-image" draggable={false} />
                </div>
              </div>

              <div className="fcs-rec-subsection">
                <h3 className="fcs-rec-heading">Communication Timeline Managing Notifications and Statuses</h3>
                <p className="fcs-section-body">
                  The following design recommendations were built to help inform potential future directions
                  for the experience. While not directly implemented, their existence shaped the trajectory
                  of the iterative project.
                </p>
                <div className="fcs-rec-image-wrap">
                  <img src={rocketCommsTimeline} alt="Communication timeline design recommendation" className="fcs-rec-image" draggable={false} />
                </div>
              </div>

              <div className="fcs-rec-subsection">
                <h3 className="fcs-rec-heading">Building the Business Center for Information Management</h3>
                <p className="fcs-section-body">
                  The following design recommendations were built to help inform potential future directions
                  for the experience. While not directly implemented, their existence shaped the trajectory
                  of the iterative project.
                </p>
                <div className="fcs-rec-image-wrap">
                  <img src={rocketVersionHistory} alt="Business center design recommendation" className="fcs-rec-image" draggable={false} />
                </div>
              </div>
            </section>

            {/* ── Solution & Results ── */}
            <section className="fcs-section" id="solution">
              <span className="fcs-section-label">Solution &amp; Results</span>
              <h2 className="fcs-section-heading">Automated Copilot Assistance as the Core of the End-to-End Flow</h2>
              <p className="fcs-section-body">
                The following design recommendations were built to help inform potential future directions
                for the experience. While not directly implemented, their existence shaped the trajectory
                of the iterative project.
              </p>
              <div className="fcs-rec-image-wrap">
                <img src={rocketVersionHistory} alt="Copilot dashboard solution" className="fcs-rec-image" draggable={false} />
              </div>
            </section>

            {/* ── Reflections ── */}
            <section className="fcs-section" id="reflections">
              <span className="fcs-section-label">Reflections</span>
              <h2 className="fcs-section-heading">Learning, Growing, and Evolving</h2>
              <p className="fcs-section-body">
                The following design recommendations were built to help inform potential future directions
                for the experience. While not directly implemented, their existence shaped the trajectory
                of the iterative project.
              </p>
              <div className="fcs-reflection-row">
                <div className="fcs-reflection-num-card">
                  <span className="fcs-reflection-num">01</span>
                  <p className="fcs-reflection-placeholder-text">lores ipsum</p>
                </div>
                <div className="fcs-reflection-num-card">
                  <span className="fcs-reflection-num">02</span>
                  <p className="fcs-reflection-placeholder-text">lores ipsum</p>
                </div>
                <div className="fcs-reflection-num-card">
                  <span className="fcs-reflection-num">03</span>
                  <p className="fcs-reflection-placeholder-text">lores ipsum</p>
                </div>
              </div>
            </section>

            {/* ── Up Next ── */}
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

    </div>
  )
}
