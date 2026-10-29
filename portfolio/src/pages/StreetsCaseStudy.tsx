import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import UpNext from '../components/UpNext'
import './FindyCaseStudy.css'
import './StreetsCaseStudy.css'
import TopNavbar from '../components/TopNavbar'
import StreetsDemo from '../components/StreetsDemo'
import LoopVideo, { type LoopVideoSource } from '../components/LoopVideo'
import backArrow from '../assets/images/cs-back-arrow.svg'
import { useRevealWhenReady } from '../lib/pageReady'

import orgStreets from '../assets/images/org-streets.png'
import heroMp4 from '../assets/images/streets-v2-hero.mp4'
import heroWebm from '../assets/images/streets-v2-hero.webm'
import heroPoster from '../assets/images/streets-v2-hero-poster.jpg'
import shotSearch from '../assets/images/streets-v2-search.jpg'
import shotPersonas from '../assets/images/streets-v2-personas.jpg'
import shotWorkspace from '../assets/images/streets-v2-workspace.jpg'
import sidebarMenu from '../assets/images/streets-v2-sidebar-menu.png'
import searchBarMp4 from '../assets/images/streets-v2-searchbar.mp4'
import searchBarWebm from '../assets/images/streets-v2-searchbar.webm'
import searchBarPoster from '../assets/images/streets-v2-searchbar-poster.jpg'
import iconExplore from '../assets/images/streets-icon-explore.svg'
import iconPalette from '../assets/images/streets-icon-palette.svg'
import iconForum from '../assets/images/streets-icon-forum.svg'
import iconSchool from '../assets/images/streets-icon-school.svg'

const HERO_VIDEO: LoopVideoSource = { webm: heroWebm, mp4: heroMp4, poster: heroPoster }
// The search bar typing, cut from the start of the landing graphic (the hero clip), at the mockup's 444×94 slot
const SEARCHBAR_VIDEO: LoopVideoSource = { webm: searchBarWebm, mp4: searchBarMp4, poster: searchBarPoster }

// Sidebar tabs, one per labelled section of the Figma Main (2174:8136), in page order
const NAV_ITEMS = [
  { id: 'background', label: 'Background' },
  { id: 'solution',   label: 'Solution'   },
  { id: 'approach',   label: 'Approach'   },
  { id: 'process',    label: 'Process'    },
  // { id: 'storybook',  label: 'Storybook'  },
  { id: 'demo',       label: 'Demo'       },
  { id: 'reflection', label: 'Reflection' },
]

const SPY_LINE = 0.35        // a section is current once its top passes this fraction of the window
const SCROLL_LOCK_MS = 1200  // fallback for browsers without `scrollend`

const CHIPS = ['Design Engineering', 'UI/UX', 'Design Systems', 'Motion Design', '0→1']

const ROLE_ITEMS = [
  { icon: iconExplore, text: 'Owned the design direction and vision for the entire team, from first concept to production.' },
  { icon: iconPalette, text: 'Created the brand identity and design system that Streets is built on.' },
  { icon: iconForum,   text: 'Partnered with our engineers from research through production, connecting Figma to our codebase through MCP.' },
  { icon: iconSchool,  text: 'Shipped the enterprise GIS interface to 3 clients and presented it in investor showcases.' },
]

const FEATURES = [
  { label: 'Search within Population Tracts', img: shotSearch, alt: 'Searching across population tracts, trade areas, and places of interest',
    title: 'Search within Population Tracts', text: 'Users can search across tracts, trade areas, and places of interest.' },
  { label: 'View & Track Personas', img: shotPersonas, alt: 'Viewing the customer personas for an area',
    title: 'View & Track Personas', text: 'View the characteristics and attributes that define the different customer segments.' },
]

const LOOP_STEPS = [
  { tag: '01 · FIGMA',       title: 'Streets DS',  text: 'Tokens, styles, and 55 components' },
  { tag: '02 · FIGMA MCP',   title: 'Context',     text: 'Reads tokens and components by name' },
  { tag: '03 · CLAUDE CODE', title: 'Generation',  text: 'Writes components using our tokens' },
  { tag: '04 · NEXT.JS',     title: 'Codebase',    text: 'Ships as reusable components' },
]

const RULES = [
  { label: 'COMPONENT', value: 'Sidebar Menu' },
  { label: 'VARIANTS', value: 'Default (263px)  ·  Collapsed (65px)' },
  { label: 'ANATOMY', value: 'Logo, File Search, New Project, Dashboard and Search toggle, Tools, Projects, Personas' },
  { label: 'DESCRIPTION FOR CLAUDE', value: 'Use as the persistent left rail in every workspace view. Collapse it when the map needs full width.' },
]

const STATS = [
  { num: 55,  label: 'Components Claude can read' },
  { num: 157, label: 'Tokens mapped to CSS variables' },
  { num: 11,  label: 'Search screens restyled through MCP' },
]

// Terminal code, as [colour, text] runs: w = white, b = blue (names/tokens), g = grey (comments)
type Run = ['w' | 'b' | 'g', string]

const CODE_SEARCH: Run[] = [
  ['w', '// Inputs/Search\n// Use in task and workspace controls.\n \n.search {\n  background: '],
  ['b', 'var(--surface-on-light-base)'],
  ['w', ';\n  border: 1px solid '],
  ['b', 'var(--border-on-light-soft-04)'],
  ['w', ';\n  color: '],
  ['b', 'var(--text-icon-on-light-secondary)'],
  ['w', ';\n}'],
]

const CODE_SKILL: Run[] = [
  ['w', '---\n'], ['b', 'name:'], ['w', ' frame-cleanup\n'], ['b', 'description:'],
  ['w', ' Restructure and rename a page\'s layers to match\n  design system conventions, without changing how anything looks.\n---\n\n'],
  ['b', 'HIERARCHY'], ['w', '     Screen > Section > Container > Component or Element\n              Remove empty wrappers and keep nesting shallow.\n              Layer order matches visual order.\n\n'],
  ['b', 'NAMING'], ['w', '        Title Case, semantic names: "Hero Content", "Card List"\n              Never "Frame 123", "Group 4", or "Blue Box"\n\n'],
  ['b', 'DO NOT TOUCH'], ['w', '  Instances, fills, text, sizes, or positions\n\n'],
  ['b', 'PROCESS'], ['w', '       Map > restructure > rename > compare screenshots > next frame'],
]

const CODE_SEARCHBAR: Run[] = [
  ['g', '// Inputs/Search Bar\n// Built by Claude Code from the Figma component and its tokens.\n'],
  ['w', '\nexport function '], ['b', 'SearchBar('],
  ['w', '{ placeholder }: SearchBarProps) {\n  return (\n    <form className="search-bar">\n      <'],
  ['b', 'SearchIcon'], ['w', ' className="search-bar__icon" />\n      <input placeholder={placeholder} />\n      <'],
  ['b', 'SendButton'], ['w', ' />\n    </form>\n  );\n}'],
]

function Terminal({ code, label }: { code: Run[]; label: string }) {
  return (
    <pre className="scs-terminal" aria-label={label}>
      <code>
        {code.map(([c, t], i) => <span key={i} className={`scs-code-${c}`}>{t}</span>)}
      </code>
    </pre>
  )
}

function Figure({ label, children, className = '' }: { label: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`fcs-media-card fcs-media-card--padded ${className}`}>
      <p className="fcs-media-card-label">{label}</p>
      {children}
    </div>
  )
}

// Counts up from 0 once it scrolls into view
function CountUp({ to }: { to: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.disconnect()
      const start = performance.now()
      const frame = (now: number) => {
        const t = Math.min((now - start) / 650, 1)
        setVal(to * (1 - Math.pow(1 - t, 3)))
        if (t < 1) requestAnimationFrame(frame)
        else setVal(to)
      }
      requestAnimationFrame(frame)
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{Math.round(val)}</span>
}

export default function StreetsCaseStudy() {
  useRevealWhenReady()
  const [active, setActive] = useState(NAV_ITEMS[0].id)
  // While a sidebar click is scrolling, the spy stays on the clicked tab instead of flickering through
  const lockedRef = useRef(false)
  const unlockTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
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

  // Scroll-spy: the last section whose top has passed the spy line; the final tab once the page bottoms out
  useEffect(() => {
    function update() {
      if (lockedRef.current) return
      const root = document.documentElement
      if (window.scrollY + window.innerHeight >= root.scrollHeight - 2) {
        setActive(NAV_ITEMS[NAV_ITEMS.length - 1].id)
        return
      }
      const line = window.innerHeight * SPY_LINE
      let found = NAV_ITEMS[0].id
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) found = id
      }
      setActive(found)
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // Release the click lock once the scroll settles, or as soon as the user takes over with wheel/touch/keys
  useEffect(() => {
    const unlock = () => {
      lockedRef.current = false
      window.clearTimeout(unlockTimer.current)
    }
    const events = ['scrollend', 'wheel', 'touchstart', 'keydown'] as const
    events.forEach(e => window.addEventListener(e, unlock, { passive: true }))
    return () => {
      events.forEach(e => window.removeEventListener(e, unlock))
      window.clearTimeout(unlockTimer.current)
    }
  }, [])

  // Native smooth scroll to the section, offset by its CSS scroll-margin-top; the clicked tab lights up at once
  function goTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    setActive(id)
    lockedRef.current = true
    window.clearTimeout(unlockTimer.current)
    unlockTimer.current = window.setTimeout(() => { lockedRef.current = false }, SCROLL_LOCK_MS)
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="fcs-page fcs-page--streets">

      <TopNavbar />

      <div className="fcs-body">

        <aside className="fcs-sidebar">
          <Link to="/" className="fcs-nav-back"><img src={backArrow} alt="" className="fcs-nav-back-icon" />Back</Link>
          <nav className="fcs-nav">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={['fcs-nav-item', active === id ? 'fcs-nav-item--active' : ''].filter(Boolean).join(' ')}
                aria-current={active === id ? 'location' : undefined}
                onClick={() => goTo(id)}
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
                <h1 className="fcs-title">Streets</h1>
                <ul className="fcs-chips">
                  {CHIPS.map(chip => <li key={chip} className="fcs-chip">{chip}</li>)}
                </ul>
              </div>
              <p className="fcs-section-body fcs-section-body--muted">
                Streets is a GIS tool that helps businesses research and compare population demographics across geographic segments.
                Working on a lean team, I shipped a design system that kept design in step with fast-paced development.
              </p>
              <div className="scs-hero">
                <LoopVideo src={HERO_VIDEO} label="The Streets enterprise search interface" />
              </div>
              <div className="fcs-tags">
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Role</span>
                  <span className="fcs-tag-value">Founding Design Engineer</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Timeline</span>
                  <span className="fcs-tag-value">May 2026 - Present</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Team</span>
                  <div className="fcs-tag-values">
                    <span className="fcs-tag-value">Software Engineering</span>
                    <span className="fcs-tag-value">Product Design</span>
                  </div>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Tools</span>
                  <div className="fcs-tag-values">
                    <span className="fcs-tag-value">Figma MCP</span>
                    <span className="fcs-tag-value">Claude Code</span>
                    <span className="fcs-tag-value">Next.js</span>
                  </div>
                </div>
              </div>
            </header>

            {/* ── Background ── */}
            <section className="fcs-section" id="background">
              <span className="fcs-section-label">Background</span>
              <h2 className="fcs-section-heading">
                How can we provide small businesses with the tools they need to expand and grow their local presence?
              </h2>
              <p className="fcs-section-body">
                When expanding regionally, understanding population demographics is key. Current enterprise tools overlook small
                businesses, who need a dashboard that is simple and usable yet rich in detail. Streets aims to fill this gap.
              </p>
              <div className="fcs-card fcs-role-card">
                <p className="fcs-card-label">My role as Founding Design Engineer</p>
                {ROLE_ITEMS.map((item, i) => (
                  <div key={item.text} className="fcs-role-group">
                    {i > 0 && <div className="fcs-divider" />}
                    <div className="fcs-role-item">
                      <img src={item.icon} alt="" className="fcs-icon" aria-hidden draggable={false} />
                      <p className="fcs-role-text">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Solution ── */}
            <section className="fcs-section" id="solution">
              <span className="fcs-section-label">Solution</span>
              <h2 className="fcs-section-heading">
                We are building an AI-powered geographic search engine centered around categorizing user personas.
              </h2>
              {FEATURES.map(f => (
                <div key={f.title} className="scs-feature">
                  <Figure label={f.label} className="scs-feature-figure">
                    <div className="scs-shot"><img src={f.img} alt={f.alt} draggable={false} /></div>
                  </Figure>
                  <div className="scs-feature-text">
                    <p className="scs-feature-title">{f.title}</p>
                    <p className="scs-feature-desc">{f.text}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* ── Adapting My Approach ── */}
            <section className="fcs-section" id="approach">
              <span className="fcs-section-label">Adapting my approach</span>
              <h2 className="fcs-section-heading">
                As our startup’s founding design engineer, I needed a design workflow that could keep up with our rapidly evolving pace.
              </h2>
              <p className="fcs-section-body">
                As our engineers built, tested, and debugged new features, my existing workflow struggled to keep up with the
                team’s design needs, pushing me to explore new processes.
              </p>
              <div className="scs-feature">
                <Figure label="Portfolios Workspace" className="scs-feature-figure">
                  <div className="scs-shot"><img src={shotWorkspace} alt="The Portfolios Workspace" draggable={false} /></div>
                </Figure>
                <div className="scs-feature-text">
                  <p className="scs-feature-title">Portfolios Workspace</p>
                  <p className="scs-feature-desc">Before our use case shifted toward geographic areas, the Portfolios Workspace streamlined management for small businesses.</p>
                  <p className="scs-feature-desc">As our product direction shifted, it became clear my approach needed to change too.</p>
                </div>
              </div>

              <div className="scs-subsection">
                <h2 className="fcs-section-heading">Using Agents to Connect the Design and Engineering Handoff</h2>
                <p className="fcs-section-body">
                  Through Figma’s MCP server, Claude Code pulls the variables and components behind a design and writes them
                  straight into our codebase. When a design changes, the same connection brings the update over.
                </p>
                <Figure label="THE DESIGN TO CODE LOOP">
                  <ol className="scs-loop">
                    {LOOP_STEPS.map((s, i) => (
                      <li key={s.tag} className="scs-loop-item">
                        {i > 0 && <span className="scs-loop-arrow" aria-hidden>→</span>}
                        <div className="scs-loop-step">
                          <span className="scs-loop-tag">{s.tag}</span>
                          <span className="scs-loop-title">{s.title}</span>
                          <span className="scs-loop-text">{s.text}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Figure>
              </div>
            </section>

            {/* ── Design Process ── */}
            <section className="fcs-section" id="process">
              <span className="fcs-section-label">Design process</span>
              <h2 className="fcs-section-heading">An AI-first Approach to Designing</h2>
              <p className="fcs-section-body">
                At every step, I used AI to keep my work consistent and to work more autonomously. Building this workflow let me
                take on many roles as both a designer and a builder.
              </p>

              <div className="scs-step">
                <h3 className="fcs-section-heading">1. Building the Component Library</h3>
                <p className="fcs-section-body">
                  Every rule, spacing pattern, and container parameter is defined within the core component library, which I
                  built first to keep every element consistent.
                </p>
                <Figure label="Searchbar Component">
                  <Terminal code={CODE_SEARCH} label="The search component's CSS" />
                </Figure>
              </div>

              <div className="scs-step">
                <h3 className="fcs-section-heading">2. Applying AI Skills to Help Scale</h3>
                <p className="fcs-section-body">
                  As I built out elements, I relied on AI skills to check and clean up my work, ensuring every piece of the Streets
                  dashboard was carefully crafted, consistently applied, and built to scale.
                </p>
                <Figure label="The frame-cleanup Skill">
                  <Terminal code={CODE_SKILL} label="The frame-cleanup skill" />
                </Figure>
              </div>

              <div className="scs-step">
                <h3 className="fcs-section-heading">3. Establishing System Rules</h3>
                <p className="fcs-section-body">
                  Once I had a standard approach to building UI elements, I wrote it into a design system that defines every rule
                  and implementation detail, optimized for MCP and for agents to understand the application.
                </p>
                <Figure label="Sidebar Component Rules and Implementation Guidelines">
                  <div className="scs-rules-row">
                    <img src={sidebarMenu} alt="The sidebar menu component" className="scs-rules-sidebar" draggable={false} />
                    <div className="scs-rules">
                      {RULES.map((r, i) => (
                        <div key={r.label} className="scs-rule-group">
                          {i > 0 && <div className="scs-rule-divider" />}
                          <p className="scs-rule-label">{r.label}</p>
                          <p className="scs-rule-value">{r.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Figure>
                <p className="fcs-section-body">
                  With these rules in place, I use agents through Figma MCP to translate components into front-end code. Giving
                  agents this context created a scalable approach suited to our team’s rapid development.
                </p>
                <Figure label="Adapting from System to Code (Simplified)">
                  <p className="scs-pane-label">IN FIGMA</p>
                  <div className="scs-pane-stage">
                    <LoopVideo src={SEARCHBAR_VIDEO} label="The search bar component, typing a search" />
                  </div>
                  <p className="scs-pane-label">IN CODE</p>
                  <Terminal code={CODE_SEARCHBAR} label="The search bar component in code" />
                </Figure>
              </div>
            </section>

            {/* ── Storybook ──
            <section className="fcs-section" id="storybook">
              <span className="fcs-section-label">Storybook</span>
              <h2 className="fcs-section-heading">
                My main deliverable to the team was a Storybook design system detailing each component’s implementation rules.
              </h2>
              <p className="fcs-section-body">
                All 55 components are documented with their tokens, variants, and usage rules, so engineers and agents build from
                the same source of truth.
              </p>
              <Figure label="STORYBOOK COMPONENT COMING SOON :)" className="scs-soon" />
            </section> */}

            {/* ── Demo ── */}
            <section className="fcs-section" id="demo">
              <span className="fcs-section-label">Demo</span>
              <h2 className="fcs-section-heading">
                Through this system, designed to adapt to a rapidly evolving scope, I delivered the core workspace flow and its visual design.
              </h2>
              <p className="fcs-section-body">
                All 11 screens of our enterprise search flow moved to the new design language, and the sidebar and search bar
                became reusable components along the way.
              </p>
              <Figure label="STREETS DEMO">
                <StreetsDemo />
              </Figure>
            </section>

            {/* ── Reflection ── */}
            <section className="fcs-section" id="reflection">
              <span className="fcs-section-label">Reflection</span>
              <h2 className="fcs-section-heading">
                Approaching Problems from an AI-First Perspective Reinvented How I Collaborate with Developers.
              </h2>
              <p className="fcs-section-body">
                Throughout my time at Streets, designing around MCP changed how I think about handing off design to code. The
                system now carries the context engineers and agents need, instead of me translating every detail by hand.
              </p>
              <div className="fcs-stats">
                {STATS.map(s => (
                  <div key={s.label} className="fcs-stat">
                    <span className="fcs-stat-num"><CountUp to={s.num} /></span>
                    <span className="fcs-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="fcs-divider fcs-divider--section" />

            <UpNext works={['rocket', 'findy']} />

          </div>
        </main>

      </div>

    </div>
  )
}
