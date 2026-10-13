import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './FindyCaseStudy.css'
import './StreetsCaseStudy.css'
import CsTopbar from '../components/CsTopbar'

import streetsHeroGif from '../assets/images/streetsgif.gif'
import orgStreets from '../assets/images/org-streets.png'
import streetsOverview from '../assets/images/streets-cs-overview.png'
import streetsPipeline from '../assets/images/streets-cs-pipeline.png'
import streetsTokens from '../assets/images/streets-cs-tokens.png'
import streetsCode from '../assets/images/streets-cs-code.png'
import streetsLibrary from '../assets/images/streets-cs-library.png'
import streetsFlow01 from '../assets/images/streets-cs-flow-01.png'
import streetsFlow02 from '../assets/images/streets-cs-flow-02.png'
import streetsFlow03 from '../assets/images/streets-cs-flow-03.png'
import rocketGif from '../assets/images/rocket-work-artwork.gif'
import findyGif from '../assets/images/findy-work-artwork.gif'

const NAV_ITEMS = [
  { id: '',           label: 'Overview',    routable: false },
  { id: 'pipeline',   label: 'Pipeline',    routable: true  },
  { id: 'tokens',     label: 'Tokens',      routable: true  },
  { id: 'components', label: 'Components',  routable: true  },
  { id: 'in-product', label: 'In Product',  routable: true  },
  { id: 'takeaways',  label: 'Takeaways',   routable: true  },
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

function CountUp({ to }: { to: number }) {
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

  return <span ref={spanRef}>{Math.round(val)}</span>
}

function StatCard({ to, text, delay }: { to: number; text: string; delay: number }) {
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
      <span className="scs-stat-num"><CountUp to={to} /></span>
      <p className="scs-stat-text">{text}</p>
    </div>
  )
}

const FLOW_STEPS = [
  { img: streetsFlow01, label: 'Start from a project on the map' },
  { img: streetsFlow02, label: 'Search, filter by distance, and compare block groups' },
  { img: streetsFlow03, label: 'Open a block group for key details, stats, and similar personas' },
]

function SearchFlowDemo() {
  const [step, setStep] = useState(0)
  const advance = () => setStep(s => (s + 1) % FLOW_STEPS.length)

  return (
    <div className="scs-flow" data-reveal="pop" data-reveal-delay="100">
      <div className="scs-flow-top">
        <p className="scs-flow-label">The core search flow, rebuilt with library components</p>
        <span className="scs-flow-hint" aria-hidden>click to step through →</span>
      </div>

      <button
        className="scs-flow-stage"
        onClick={advance}
        aria-label={`Search flow step ${step + 1} of ${FLOW_STEPS.length}: ${FLOW_STEPS[step].label}. Click to advance.`}
      >
        {FLOW_STEPS.map((s, i) => (
          <img
            key={i}
            src={s.img}
            alt=""
            className={`scs-flow-screen${i === step ? ' is-active' : ''}`}
            draggable={false}
          />
        ))}
      </button>

      <div className="scs-flow-steps" role="tablist">
        {FLOW_STEPS.map((s, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === step}
            className={`scs-flow-step${i === step ? ' is-active' : ''}`}
            onClick={() => setStep(i)}
          >
            <span className="scs-flow-step-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="scs-flow-step-label">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function StreetsCaseStudy() {
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
    <div className="fcs-page fcs-page--rocket fcs-page--streets">

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
                  <img src={orgStreets} alt="" className="fcs-org-logo" />
                  <span className="fcs-org-name">Streets</span>
                </div>
                <h1 className="fcs-title">Streets Design System</h1>
              </div>
              <img src={streetsHeroGif} alt="" className="fcs-hero-single" draggable={false} data-reveal="" />
              <div className="fcs-tags" data-reveal="" data-reveal-delay="150">
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Role</span>
                  <span className="fcs-tag-value">Founding Design Engineer</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Timeline</span>
                  <span className="fcs-tag-value">May 2026 - Present</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Focus</span>
                  <div className="fcs-tag-values">
                    <span className="fcs-tag-value">MCP Integration</span>
                    <span className="fcs-tag-value">Design Systems</span>
                  </div>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Tools</span>
                  <div className="fcs-tag-values">
                    <span className="fcs-tag-value">Figma</span>
                    <span className="fcs-tag-value">Claude Code</span>
                    <span className="fcs-tag-value">Figma MCP</span>
                    <span className="fcs-tag-value">Next.js</span>
                  </div>
                </div>
              </div>
            </header>

            {/* ── Overview ── */}
            <section className="fcs-section">
              <span className="fcs-section-label" data-reveal="">Overview</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">Design Engineering Evolving the Workflow</h2>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="100">
                Streets builds two products: an enterprise GIS tool for exploring Dallas-Fort Worth census
                block groups, and a Small Business Portfolio for managing a business's online presence. With
                our scope shifting week to week, I built our design system around one goal: letting Claude Code
                read our designs through Figma's MCP server and turn them into Next.js components.
              </p>
              <img src={streetsOverview} alt="The enterprise GIS view and the Small Business Portfolio, built from one shared library" className="scs-figure" draggable={false} data-reveal="pop" data-reveal-delay="150" />
            </section>

            {/* ── Pipeline ── */}
            <section className="fcs-section" id="pipeline">
              <span className="fcs-section-label" data-reveal="">Pipeline</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">Connecting Figma to Code Through MCP</h2>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="100">
                Through Figma's MCP server, Claude Code pulls the variables and components behind a design and
                writes them straight into our codebase. When a design changes, the same connection brings the
                update over.
              </p>
              <img src={streetsPipeline} alt="The design to code loop" className="scs-figure" draggable={false} data-reveal="pop" data-reveal-delay="150" />
            </section>

            {/* ── Tokens ── */}
            <section className="fcs-section" id="tokens">
              <span className="fcs-section-label" data-reveal="">Tokens</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">Adopting Best Practices for Efficient MCP Integration</h2>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="100">
                For Claude to pull accurate values, every token is named for its role and carries its CSS
                variable as code syntax. 70 primitives feed into 87 semantic tokens, so a color picked in Figma
                is the exact variable we use in code.
              </p>
              <img src={streetsTokens} alt="One token, from primitive to code" className="scs-figure" draggable={false} data-reveal="pop" data-reveal-delay="150" />
            </section>

            {/* ── Components ── */}
            <section className="fcs-section" id="components">
              <span className="fcs-section-label" data-reveal="">Components</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">Tailoring Components with AI Specifications</h2>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="100">
                I organized our 55 components using the format I learned from Rocket Lawyer's design system, with
                Category/Component names and a short description on each one. These descriptions double as
                instructions for Claude, telling it where a component belongs before it writes any code.
              </p>
              <img src={streetsCode} alt="A component description and its tokens in code (simplified)" className="scs-figure" draggable={false} data-reveal="pop" data-reveal-delay="150" />

              <div className="scs-subsection">
                <h3 className="fcs-subsection-heading scs-subsection-heading" data-reveal="">Building Screens from Shared Pieces</h3>
                <p className="fcs-section-body" data-reveal="" data-reveal-delay="50">
                  Larger panels are built from the same controls and rows, so Claude can put together a full
                  screen from components it already knows.
                </p>
                <img src={streetsLibrary} alt="Controls, patterns, and compositions from the library" className="scs-figure" draggable={false} data-reveal="pop" data-reveal-delay="100" />
              </div>
            </section>

            {/* ── In Product ── */}
            <section className="fcs-section" id="in-product">
              <span className="fcs-section-label" data-reveal="">In Product</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">Restyling the Search Flow with MCP</h2>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="100">
                To test the system, I used the MCP connection to apply it to our enterprise search flow. All 11
                screens moved to the new design language with the same steps and features, and the sidebar and
                search bar became reusable components along the way.
              </p>
              <SearchFlowDemo />
            </section>

            {/* ── Takeaways ── */}
            <section className="fcs-section" id="takeaways">
              <span className="fcs-section-label" data-reveal="">Takeaways</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">Adapting and Testing within a Fast-Paced World</h2>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="100">
                Throughout my time at Streets, designing around MCP changed how I think about handing off design
                to code.
              </p>
              <div className="fcs-stat-cards">
                <StatCard to={55}  text="components, each with a description Claude can read" delay={0} />
                <StatCard to={157} text="tokens, each with a matching CSS variable" delay={100} />
                <StatCard to={11}  text="search flow screens restyled through MCP" delay={200} />
              </div>
            </section>

            {/* ── Up Next ── */}
            <section className="fcs-section">
              <h2 className="rl-upnext-heading" data-reveal="">Up Next</h2>
              <div className="rl-upnext-row">
                <Link to="/work/rocket-lawyer" className="rl-upnext-card" data-cursor="case-study" data-reveal="pop" data-reveal-delay="50">
                  <div className="rl-upnext-artwork rl-upnext-artwork--rocket">
                    <img src={rocketGif} alt="Rocket Lawyer" draggable={false} />
                  </div>
                  <div>
                    <p className="rl-upnext-title">Rocket Lawyer</p>
                    <p className="rl-upnext-desc">a Claude-powered UX research pipeline for Rocket Copilot</p>
                  </div>
                </Link>
                <Link to="/work/findy" className="rl-upnext-card" data-cursor="case-study" data-reveal="pop" data-reveal-delay="150">
                  <div className="rl-upnext-artwork rl-upnext-artwork--findy">
                    <img src={findyGif} alt="Findy" draggable={false} />
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
