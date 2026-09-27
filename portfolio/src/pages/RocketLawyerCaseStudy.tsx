import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './FindyCaseStudy.css'
import CsTopbar from '../components/CsTopbar'

import rocketHeroGif from '../assets/images/rocket-cs-hero-new.gif'
import rocketFdsSidebar  from '../assets/images/rocket-cs-fds-sidebar.png'
import rocketUsabilityTest from '../assets/images/rocket-cs-usability-test.png'
import rocketTestResults from '../assets/images/rocket-cs-test-results.png'
import rocketStatsConnector from '../assets/images/rocket-cs-stats-connector.svg'
import appliedResearch from '../assets/images/applied-research.png'
import diagClaude      from '../assets/images/rocket-cs-diag-claude.svg'
import diagFigma       from '../assets/images/rocket-cs-diag-figma.svg'
import diagArrow1      from '../assets/images/rocket-cs-diag-arrow1.svg'
import diagUT          from '../assets/images/rocket-cs-diag-ut.svg'
import diagArrow2      from '../assets/images/rocket-cs-diag-arrow2.svg'
import diagRL          from '../assets/images/rocket-cs-diag-rl.svg'
import rocketChart from '../assets/images/rocket-cs-chart.gif'
import rocketAffinityMap from '../assets/images/rocket-cs-affinity-map.png'
import rocketVersionHistoryBefore from '../assets/images/rocket-cs-version-history-before.png'
import rocketVersionHistoryAfter  from '../assets/images/version-history.gif'
import rocketBizCenterBreakdown from '../assets/images/rocket-cs-business-center-breakdown.png'
import rocketBizCenter from '../assets/images/rocket-cs-biz-center.gif'
import rocketBizCenterBefore from '../assets/images/rocket-cs-dashboard.png'
import rqIcon1 from '../assets/images/rq-icon-1.svg'
import rqIcon2 from '../assets/images/rq-icon-2.svg'
import rqIcon3 from '../assets/images/rq-icon-3.svg'
import orgRocket from '../assets/images/org-rocket.png'
import upnextStreets from '../assets/images/upnext-streets.gif'
import upnextFindy   from '../assets/images/upnext-findy.png'

const NAV_ITEMS = [
  { id: '',            label: 'Background',             routable: false },
  { id: 'problem',     label: 'Problem',                routable: true  },
  { id: 'research',    label: 'Research',               routable: true  },
  { id: 'process',    label: ' Process',    routable: true  },
  { id: 'next-steps', label: 'Next Steps',  routable: true  },
  { id: 'reflections', label: 'Reflections', routable: true  },
]

// ── Rocket Lawyer design-system color palette (carousel) ─────────────────────
const RL_COLORS = [
  '#7A0000', '#C41C1C', '#E05252',
  '#FFFDE7', '#F5D200', '#C8A000',
  '#1B5E20', '#2E7D32', '#43A047', '#1565C0',
]

function ColorCarousel() {
  const doubled = [...RL_COLORS, ...RL_COLORS]
  return (
    <div className="rl-carousel-outer">
      <div className="rl-carousel-track">
        {doubled.map((color, i) => (
          <div
            key={i}
            className="rl-carousel-chip"
            style={{ backgroundColor: color, '--chip-color': color } as React.CSSProperties}
            data-hex={color}
          />
        ))}
      </div>
    </div>
  )
}

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

function BeforeAfterContainer({
  beforeSrc,
  afterSrc,
  beforeLayout = 'fill',
}: {
  beforeSrc: string
  afterSrc: string
  beforeLayout?: 'inset' | 'fill'
}) {
  const [active, setActive] = useState<'before' | 'after'>('after')

  return (
    <div className="fcs-ba">
      <div className="fcs-ba-tabs">
        <button
          className="fcs-ba-tab"
          onClick={() => setActive('before')}
          aria-pressed={active === 'before'}
        >
          BEFORE
        </button>
        <div className="fcs-ba-tab-divider" aria-hidden />
        <button
          className="fcs-ba-tab"
          onClick={() => setActive('after')}
          aria-pressed={active === 'after'}
        >
          AFTER
        </button>
        <div
          className={`fcs-ba-indicator${active === 'after' ? ' fcs-ba-indicator--right' : ''}`}
          aria-hidden
        />
      </div>

      <div className="fcs-ba-mockup">
        <img src={afterSrc} alt="" className="fcs-ba-sizer" draggable={false} />

        {/* AFTER panel */}
        <div className={`fcs-ba-panel${active === 'after' ? ' fcs-ba-panel--active' : ''}`}>
          <img src={afterSrc} alt="" className="fcs-ba-fill-img" draggable={false} />
          <div className="fcs-ba-inset" aria-hidden />
        </div>

        {/* BEFORE panel */}
        <div className={`fcs-ba-panel${beforeLayout === 'inset' ? ' fcs-ba-panel--inset' : ''}${active === 'before' ? ' fcs-ba-panel--active' : ''}`}>
          {beforeLayout === 'inset' ? (
            <div className="fcs-ba-before-frame">
              <img src={beforeSrc} alt="" className="fcs-ba-frame-img" draggable={false} />
            </div>
          ) : (
            <img src={beforeSrc} alt="" className="fcs-ba-fill-img" draggable={false} />
          )}
          <div className="fcs-ba-inset" aria-hidden />
        </div>
      </div>
    </div>
  )
}

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

function StatCard({ to, decimals, text, delay }: { to: number; decimals: number; text: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`fcs-stat-card${visible ? ' fcs-stat-card--visible' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="fcs-problem-stat-num"><CountUp to={to} decimals={decimals} /></span>
      <p className="fcs-problem-stat-text">{text}</p>
    </div>
  )
}

export default function RocketLawyerCaseStudy() {
  const [active, setActive] = useState('')
  const targetYRef = useRef(0)
  const currentYRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    document.documentElement.style.overflow = 'auto'
    document.documentElement.style.height = 'auto'
    return () => {
      document.documentElement.style.overflow = ''
      document.documentElement.style.height = ''
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
      currentYRef.current += diff * 0.12
      window.scrollTo(0, currentYRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const maxY = document.body.scrollHeight - window.innerHeight
      targetYRef.current = Math.max(0, Math.min(maxY, targetYRef.current + e.deltaY * 1.5))
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

  useEffect(() => {
    function checkArrows() {
      document.querySelectorAll<HTMLElement>('.fcs-diag-arrow-wrap, .fcs-stats-connector-wrap').forEach(el => {
        if (el.classList.contains('fcs-arrow--drawn')) return
        const { top, bottom } = el.getBoundingClientRect()
        if (top < window.innerHeight * 0.9 && bottom > 0) {
          el.classList.add('fcs-arrow--drawn')
        }
      })
    }
    window.addEventListener('scroll', checkArrows, { passive: true })
    checkArrows()
    return () => window.removeEventListener('scroll', checkArrows)
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const delay = Number((entry.target as HTMLElement).dataset.revealDelay ?? 0)
          if (delay) {
            setTimeout(() => entry.target.classList.add('reveal--visible'), delay)
          } else {
            entry.target.classList.add('reveal--visible')
          }
          obs.unobserve(entry.target)
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
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
          <Link to="/" className="fcs-nav-back">← Back</Link>
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
              <img src={rocketHeroGif} alt="" className="fcs-hero-single" draggable={false} data-reveal="" />
              <div className="fcs-tags" data-reveal="" data-reveal-delay="150">
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Role</span>
                  <span className="fcs-tag-value">UX Research Intern</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Timeline</span>
                  <span className="fcs-tag-value">June 2026 - Sep. 2026</span>
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
              <div className="fcs-bg-group">
                <div className="fcs-bg-sub" data-reveal="">
                  <span className="fcs-section-label">Background</span>
                  <h2 className="fcs-section-heading">About Rocket Copilot</h2>
                  <p className="fcs-section-body">
                    Our Rocket Lawyer users resonate deeply with the legal support our platform provides
                    their small businesses. Between offering legal information and generating documents,
                    the platform has done well to build an audience, but to retain these users consistently,
                    our team designed an ecosystem dedicated to managing the business experience
                  </p>
                </div>

                <div className="fcs-bg-sub" data-reveal="" data-reveal-delay="100">
                  <h2 className="fcs-section-heading">Redefining Legal Tech with AI</h2>
                  <p className="fcs-section-body">
                    In pursuit of evolving the legal-tech experience to incorporate AI tools for customers,
                    internally, the design team was also completely restructuring their workflow to maximize
                    data-backed solutions. As part of this, I was brought on to develop a Claude-powered
                    UX research pipeline.
                  </p>
                  <div className="fcs-bg-diagram" aria-hidden>
                    <div className="fcs-bg-diagram-left">
                      <img src={diagClaude} alt="Claude" className="fcs-bg-diag-logo fcs-bg-diag-logo--claude" />
                      <img src={diagFigma}  alt="Figma"  className="fcs-bg-diag-logo fcs-bg-diag-logo--figma" />
                    </div>
                    <div className="fcs-diag-arrow-wrap">
                      <img src={diagArrow1} alt="" className="fcs-bg-diag-arrow fcs-bg-diag-arrow--1" />
                    </div>
                    <img src={diagUT}     alt="UserTesting" className="fcs-bg-diag-logo fcs-bg-diag-logo--ut" />
                    <div className="fcs-diag-arrow-wrap fcs-diag-arrow-wrap--seq">
                      <img src={diagArrow2} alt="" className="fcs-bg-diag-arrow fcs-bg-diag-arrow--2" />
                    </div>
                    <img src={diagRL}     alt="Rocket Lawyer" className="fcs-bg-diag-logo fcs-bg-diag-logo--rl" />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Problem ── */}
            <section className="fcs-section" id="problem">
              <span className="fcs-section-label" data-reveal="">Problem</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">Negotiate &amp; Sign felt Disconnected from User Needs</h2>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="100">
                Users' business needs were not quite captured by the existing E2E flows, with Copilot, Rocket Lawyer's AI-powered legal assistant,
                seemingly feeling misaligned with what small business cohorts need to continue using
                the platform.
              </p>

              <div className="fcs-stat-cards">
                <StatCard to={26.9} decimals={1} text="drop in subscription rates over the course of 3 months" delay={0} />
                <StatCard to={44}   decimals={0} text="drop in weekly user activity after 3 weeks of use"      delay={100} />
                <StatCard to={13.7} decimals={1} text="drop in Copilot Usage over the course of 3 months"      delay={200} />
              </div>

              <div className="fcs-stats-connector-wrap" aria-hidden>
                <img src={rocketStatsConnector} alt="" className="fcs-stats-connector" />
              </div>

              <p className="fcs-problem-statement" data-reveal="">
                How can we design a platform centered around the use cases, experiences, and hyper-specific legal needs small business users with limited legal knowledge face every single day?
              </p>

              <p className="fcs-section-body" data-reveal="" data-reveal-delay="50">
                To address this, we centered our study around addressing user concerns in hopes 
                of better optimizing Rocket Lawyer for the aforementioned business metrics.
              </p>

              <div className="fcs-rq-card" data-reveal="pop">
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
              <span className="fcs-section-label" data-reveal="">Research</span>

              <div className="fcs-sub-group">
                <div className="fcs-sub">
                  <h3 className="fcs-subsection-heading" data-reveal="">Quantifying our Users</h3>
                  <p className="fcs-section-body" data-reveal="" data-reveal-delay="50">
                    To start, we broke down our users into distinct use cases, segmenting document receivers,
                    document authors, and legal professionals to better understand how pain points varied across these groups.
                  </p>
                  <div className="fcs-media-card fcs-media-card--padded" data-reveal="pop" data-reveal-delay="100">
                    <p className="fcs-media-card-label">DEFINING COHORTS TO SEGMENT COPILOT USE CASES IN AMPLITUDE</p>
                    <div className="fcs-chart-crop">
                      <img src={rocketChart} alt="" className="fcs-media-card-img" draggable={false} />
                    </div>
                  </div>
                </div>

                <div className="fcs-sub">
                  <h3 className="fcs-subsection-heading" data-reveal="">Talking to Customers</h3>
                  <p className="fcs-section-body" data-reveal="" data-reveal-delay="50">
                    Despite prior data consistently validating the need for small business users to streamline
                    legal workflows, our analytics simply weren't upholding as expected.
                  </p>
                  <p className="fcs-research-callout" data-reveal="">
                    How might we understand specific use cases at a way finer level?
                  </p>
                  <p className="fcs-section-body" data-reveal="" data-reveal-delay="80">
                    I started by talking to customers right away, recognizing that through in-depth, engaging,
                    genuine conversations, I could only then truly understand the barriers to negotiation.
                  </p>
                  <div className="fcs-quote-card" data-reveal="pop">
                    <div className="fcs-quote-entry">
                      <span className="fcs-quote-icon" aria-hidden="true">"</span>
                      <div className="fcs-quote-content">
                        <span className="fcs-quote-attr">Small Business Owner</span>
                        <p className="fcs-quote-text">"How do I have to get these pieces of critical information organized and communicated without constantly relying an attorney communication."</p>
                      </div>
                    </div>
                    <div className="fcs-quote-divider" />
                    <div className="fcs-quote-entry">
                      <span className="fcs-quote-icon" aria-hidden="true">"</span>
                      <div className="fcs-quote-content">
                        <span className="fcs-quote-attr">Attorney</span>
                        <p className="fcs-quote-text">“How do I have to get these pieces of critical information organized and communicated without constantly relying on an attorney at every step.”</p>
                      </div>
                    </div>
                  </div>
                  <div className="fcs-media-card fcs-media-card--padded" data-reveal="pop">
                    <p className="fcs-media-card-label">TRANSLATING INTERVIEW INSIGHTS INTO THEMES</p>
                    <img src={rocketAffinityMap} alt="" className="fcs-media-card-img" draggable={false} />
                  </div>
                  <p className="fcs-section-body" data-reveal="">
                    Moving beyond the designs, I explored how my research findings and themes could be applied
                    to current iterations of Negotiate &amp; Sign components.
                  </p>
                  <div className="fcs-media-card fcs-media-card--padded" data-reveal="pop">
                    <p className="fcs-media-card-label">MOCKUPS + APPLIED RESEARCH</p>
                    <img src={appliedResearch} alt="" className="fcs-media-card-img" draggable={false} />
                  </div>
                </div>

              </div>
            </section>

            {/* ── Process ── */}
            <section className="fcs-section" id="process">
              <span className="fcs-section-label" data-reveal="">Process</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">Transitioning from Design Recommendations to a New Project</h2>

              <div className="fcs-rec-cards">

                <div className="fcs-rec-cards-numcol">
                  <div className="fcs-num-row"><span className="fcs-numbered-card-num">01</span></div>
                  <div className="fcs-num-row"><span className="fcs-numbered-card-num">02</span></div>
                  <div className="fcs-num-row"><span className="fcs-numbered-card-num">03</span></div>
                </div>

                <div className="fcs-rec-cards-contentcol">

                  <div className="fcs-numbered-card" data-reveal="pop">
                    <div className="fcs-numbered-card-content">
                      <h3 className="fcs-rec-heading fcs-rec-heading--lg">Experimenting with Validated Features in the Current Workspace</h3>
                      <p className="fcs-section-body">
                        Version control was consistently requested in user interviews, so as part of my design
                        recommendations to stakeholders, I designed the feature's integration using the current
                        design system.
                      </p>
                      <BeforeAfterContainer
                        beforeSrc={rocketVersionHistoryBefore}
                        afterSrc={rocketVersionHistoryAfter}
                        beforeLayout="inset"
                      />
                      <p className="fcs-section-body">
                        As we experimented with our designs, it was clear that users were disinterested in negotiation support. To truly account for users' need for AI support and organization systems, a dedicated legal management workspace would be necessary to encapsulate our product's shifting direction.
                      </p>
                    </div>
                  </div>

                  <div className="fcs-numbered-card" data-reveal="pop" data-reveal-delay="80">
                    <div className="fcs-numbered-card-content">
                      <h3 className="fcs-rec-heading fcs-rec-heading--lg">Shifting Focus over to the Business Center Dashboard</h3>
                      <p className="fcs-section-body">
                        Directed by our PMs, the Negotiate & Sign project had evolved into what became 
                        the Business Center Dashboard, a workspace designed to centralize small businesses’ 
                        legal interactions.
                      </p>
                      <div className="fcs-media-card fcs-media-card--padded fcs-media-card--borderless">
                        <p className="fcs-media-card-label">TEST RESULTS INFORMING AN AI-DRIVEN DESIGN PROCESS</p>
                        <div className="fcs-media-card-inner fcs-media-card-inner--results">
                          <img src={rocketBizCenterBreakdown} alt="" className="fcs-media-card-img--results" draggable={false} />
                        </div>
                      </div>
                      <p className="fcs-section-body">
                        Based on a series of surveys launched to small business users, the 
                        following design recommendation was built to inform the project’s 
                        direction.
                      </p>
                      <BeforeAfterContainer
                        beforeSrc={rocketBizCenterBefore}
                        afterSrc={rocketBizCenter}
                      />
                    </div>
                  </div>

                  <div className="fcs-numbered-card" data-reveal="pop" data-reveal-delay="160">
                    <div className="fcs-numbered-card-content">
                      <h3 className="fcs-rec-heading fcs-rec-heading--lg">Testing and Iterating the Business Center's Core Feature: AI-Guided Workflows</h3>
                      <p className="fcs-section-body">
                        The Business Center experience became the emphasis of the small business user experience,
                        aiming to better alleviate the core problem surfaced in interviews. As we built out this
                        experience, I made use of AI-powered UX research pipelines to optimize the iterative process.
                      </p>
                      <div className="fcs-media-card fcs-media-card--padded">
                        <p className="fcs-media-card-label">LAUNCHING A USABILITY TEST USING CUSTOM CLAUDE SKILLS</p>
                        <div className="fcs-chart-crop">
                          <img src={rocketUsabilityTest} alt="" className="fcs-media-card-img" draggable={false} />
                        </div>
                      </div>
                      <p className="fcs-section-body">
                        In addition to ux research, AI was used to help integrate connectivity with upgraded design
                        systems, using Claude skills and Design Engineering principles to update the visuals,
                        components, and typography attributes.
                      </p>
                      <div className="fcs-media-card fcs-media-card--padded fcs-media-card--borderless">
                        <p className="fcs-media-card-label">DESIGN SYSTEM USED TO POWER AI-DESIGN WORKFLOWS</p>
                        <div className="fcs-media-card-inner fcs-media-card-inner--results">
                          <img src={rocketFdsSidebar} alt="" className="fcs-media-card-img--results" draggable={false} />
                        </div>
                      </div>
                      <div className="fcs-media-card fcs-media-card--padded rl-color-sys-card">
                        <p className="fcs-media-card-label">COLOR SYSTEM</p>
                        <ColorCarousel />
                      </div>
                      <p className="fcs-section-body">
                        Through automated user testing, I validated and built an AI-powered guided, autonomous
                        workflows serving as the new core value proposition of the evolving project.
                      </p>
                      <div className="fcs-media-card fcs-media-card--padded">
                        <p className="fcs-media-card-label">TEST RESULTS INFORMING AN AI-DRIVEN DESIGN PROCESS</p>
                        <div className="fcs-media-card-inner fcs-media-card-inner--results">
                          <img src={rocketTestResults} alt="" className="fcs-media-card-img--results" draggable={false} />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* ── Next Steps ── */}
            <section className="fcs-section" id="next-steps">
              <span className="fcs-section-label" data-reveal="">Next Steps</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">Expanding the Business Center</h2>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="100">
                Throughout my time at Rocket Lawyer, my skills as a researcher flourished as I integrated
                human-centric qualitative tasks with AI-powered quantitative methodologies to evolve the
                core UX research pipeline.
              </p>
              <div className="fcs-next-steps-cards" data-reveal="pop" data-reveal-delay="150">
                <div className="fcs-next-steps-card">
                  <p className="fcs-next-steps-title">Continue to Build the Business Center</p>
                  <p className="fcs-next-steps-body">Design engineering components built by me are to be continuously iterated upon and tested for future business center versions.</p>
                </div>
                <div className="fcs-next-steps-card">
                  <p className="fcs-next-steps-title">Integrating Requested Features into Backend</p>
                  <p className="fcs-next-steps-body">With version control and the document management system being validated, their functionality should be further explored by engineering teams.</p>
                </div>
                <div className="fcs-next-steps-card">
                  <p className="fcs-next-steps-title">Applying 5+ Claude Skills to UX Research</p>
                  <p className="fcs-next-steps-body">With 6 different Claude skills shipped by me to the team, Rocket Lawyer is ready to overhaul their design process with a data-driven emphasis.</p>
                </div>
              </div>
            </section>

            {/* ── Reflections ── */}
            <section className="fcs-section" id="reflections">
              <span className="fcs-section-label" data-reveal="">Reflections</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">Learning, Growing, and Evolving</h2>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="100">
                Throughout my time at Rocket Lawyer, my skills as a researcher flourished as I integrated
                human-centric qualitative tasks with AI-powered quantitative methodologies to evolve the
                core UX research pipeline.
              </p>
              <div className="fcs-reflection-list">
                <div className="fcs-reflection-item" data-reveal="">
                  <p className="fcs-reflection-item-title">Experimenting with Validated Features in the Current Workspace</p>
                  <p className="fcs-reflection-item-body">Design engineering components built by me are to be continuously iterated upon and tested for future business center versions.</p>
                </div>
                <div className="fcs-reflection-item" data-reveal="" data-reveal-delay="80">
                  <p className="fcs-reflection-item-title">Shifting Focus over to the Business Center Dashboard</p>
                  <p className="fcs-reflection-item-body">With version control and the document management system being validated, their functionality should be further explored by engineering teams.</p>
                </div>
                <div className="fcs-reflection-item" data-reveal="" data-reveal-delay="160">
                  <p className="fcs-reflection-item-title">Connection and Communication are Key to a Remote Environment</p>
                  <p className="fcs-reflection-item-body">With 6 different Claude skills shipped by me to the team, Rocket Lawyer is ready to overhaul their design process with a data-driven emphasis.</p>
                </div>
              </div>
            </section>

            {/* ── Up Next ── */}
            <section className="rl-upnext">
              <h2 className="rl-upnext-heading" data-reveal="">Up Next</h2>
              <div className="rl-upnext-row">
                <Link to="/work/streets" className="rl-upnext-card" data-reveal="pop" data-reveal-delay="50">
                  <div className="rl-upnext-artwork rl-upnext-artwork--streets">
                    <img src={upnextStreets} alt="Streets" draggable={false} />
                  </div>
                  <div>
                    <p className="rl-upnext-title">Streets</p>
                    <p className="rl-upnext-desc">design engineering enterprise B2B software</p>
                  </div>
                </Link>
                <Link to="/work/findy" className="rl-upnext-card" data-reveal="pop" data-reveal-delay="150">
                  <div className="rl-upnext-artwork rl-upnext-artwork--findy">
                    <img src={upnextFindy} alt="Findy" draggable={false} />
                  </div>
                  <div>
                    <p className="rl-upnext-title">Findy</p>
                    <p className="rl-upnext-desc">a case-competition winning solution built for elders, tested by elders</p>
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
