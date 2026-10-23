import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './FindyCaseStudy.css'
import TopNavbar from '../components/TopNavbar'
import { useRevealWhenReady } from '../lib/pageReady'

import backArrow        from '../assets/images/cs-back-arrow.svg'
import orgLogo          from '../assets/images/findy-v2-org.png'
import bubbleDetective  from '../assets/images/findy-v2-detective.svg'
import bubbleZen        from '../assets/images/findy-v2-zen.svg'
import headphones       from '../assets/images/findy-v2-headphones.svg'
import bubbleClumsy     from '../assets/images/findy-v2-clumsy.svg'
import competitors      from '../assets/images/findy-v2-competitors.png'
import tableSetup       from '../assets/images/findy-v2-table-setup.jpg'
import focusGroup       from '../assets/images/findy-v2-focus-group.gif'
import usabilityShot    from '../assets/images/findy-v2-usability.jpg'
import beforeScreen     from '../assets/images/findy-v2-before.png'
import afterScreen      from '../assets/images/findy-v2-after.png'
import arrowRight       from '../assets/images/findy-v2-arrow-right.svg'
import stateDefault     from '../assets/images/findy-v2-state-default.png'
import stateListening   from '../assets/images/findy-v2-state-listening.png'
import stateAssisting   from '../assets/images/findy-v2-state-assisting.png'
import phoneHome        from '../assets/images/findy-v2-phone-home.gif'
import phoneApps        from '../assets/images/findy-v2-phone-apps.jpg'
import phoneMaps        from '../assets/images/findy-v2-phone-maps.jpg'
import phonePay         from '../assets/images/findy-v2-phone-pay.jpg'
import demoDay          from '../assets/images/findy-v2-demo-day.jpg'
import upStreets        from '../assets/images/findy-v2-up-streets-projects.png'
import rocketArtwork    from '../assets/images/rocket-artwork-v2.gif'

// Figma sidebar order (Design Recs / User Testing are listed out of page order — scroll-spy handles it)
const NAV_ITEMS = [
  { id: '',             label: 'Background',            routable: false },
  { id: 'problem',      label: 'Problem',               routable: true  },
  { id: 'research',     label: 'Initial Research',      routable: true  },
  { id: 'shifting',     label: 'Shifting the Approach', routable: true  },
  { id: 'design-recs',  label: 'Design Recs',           routable: true  },
  { id: 'user-testing', label: 'User Testing',          routable: true  },
  { id: 'reflections',  label: 'Reflection',            routable: true  },
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

// Figma "Frame 1720 (Bezel)": 281×560 iPhone with side buttons; `fit`/`bg` follow each screen's fill
function Phone({ src, alt, fit = 'cover', bg, screen }: {
  src: string; alt: string; fit?: 'cover' | 'contain'; bg?: string
  screen?: { w: number; h: number; x: number; y: number }   // Figma image box inside the 242×521 screen
}) {
  const box = screen ?? { w: 242, h: 525, x: -0.17, y: -0.67 }
  return (
    <div className="findy-phone">
      <span className="findy-phone-btn findy-phone-btn--vol-up" />
      <span className="findy-phone-btn findy-phone-btn--vol-dn" />
      <span className="findy-phone-btn findy-phone-btn--power" />
      <div className="findy-phone-outer" />
      <div className="findy-phone-inner" />
      <div className="findy-phone-screen">
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            left: `${(box.x / 242) * 100}%`, top: `${(box.y / 521) * 100}%`,
            width: `${(box.w / 242) * 100}%`, height: `${(box.h / 521) * 100}%`,
            objectFit: fit, background: bg,
          }}
        />
      </div>
    </div>
  )
}

const ROLE_ITEMS = [
  { icon: 'explore', text: 'Owned the design direction and vision for the entire team, from first concept to final prototype.' },
  { icon: 'palette', text: 'Created the brand identity and design system that Findy is built on.' },
  { icon: 'forum',   text: 'Assisted our lead with project management and UX research, including interviews at two senior centers.' },
  { icon: 'school',  text: 'Served as a mentor and educational resource for the early-stage designers on my team.' },
]

const PAIN_POINTS = [
  { chip: 'Confusion',   title: 'Confusion creates friction',          text: 'Navigational confusion without clarity is the source of users’ core struggles.' },
  { chip: 'Exclusion',   title: 'Exclusion hinders empowerment',       text: 'Without support tailored to their dynamic needs, users feel neglected.' },
  { chip: 'Frustration', title: 'Frustration results from overwhlem',  text: 'Overwhelming interfaces fuel frustration and distaste towards tech.' },
]

const STATES = [
  { label: 'DEFAULT',   img: stateDefault,   text: 'Always waiting on screen for user input.' },
  { label: 'LISTENING', img: stateListening, text: 'Findy records user audio, a research-validated form of input.' },
  { label: 'ASSISTING', img: stateAssisting, text: 'Findy guides step by step, with a menu for support whenever needed.' },
]

const VALUE_PROPS = [
  { icon: 'all_inclusive', title: 'Persistent Support', text: 'Findy is available on any screen, at any time, so seniors never have to go looking for help.' },
  { icon: 'phone_iphone',  title: 'iOS Ecosystem',      text: 'Rather than forcing users to learn a completely new experience, Findy is integrated directly into iOS.' },
  { icon: 'support_agent', title: 'Friendly Assistant', text: 'Findy is not just a tool, but a tech-support style assistant that feels like a patient helper.' },
]

function PhoneFigure({ label, caption, children }: { label: string; caption: string; children: React.ReactNode }) {
  return (
    <div className="fcs-media-card fcs-media-card--padded findy-phone-figure">
      <p className="fcs-media-card-label">{label}</p>
      <div className="findy-phone-panel">
        {children}
        <div className="fcs-divider" />
        <p className="findy-phone-caption">{caption}</p>
      </div>
    </div>
  )
}

export default function FindyCaseStudy() {
  useRevealWhenReady()
  const [active, setActive] = useState('')
  const targetYRef = useRef(0)
  const currentYRef = useRef(0)
  const rafRef = useRef<number | null>(null)

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
      // The sidebar lists sections out of page order, so pick whichever passed the threshold last
      const threshold = window.innerHeight * 0.35 + 60
      let found = '', foundTop = -Infinity
      for (const { id } of routable) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= threshold && top > foundTop) { found = id; foundTop = top }
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
    <div className="fcs-page fcs-page--findy">

      <TopNavbar />

      <div className="fcs-body">

        <aside className="fcs-sidebar">
          <Link to="/" className="fcs-nav-back"><img src={backArrow} alt="" className="fcs-nav-back-icon" />Back</Link>
          <nav className="fcs-nav">
            {NAV_ITEMS.map(({ id, label }, i) => (
              <button
                key={`${label}-${i}`}
                className={['fcs-nav-item', active === id ? 'fcs-nav-item--active' : ''].filter(Boolean).join(' ')}
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
                  <span className="findy-org-logo"><img src={orgLogo} alt="" /></span>
                  <span className="fcs-org-name">Design @ UCI</span>
                </div>
                <h1 className="fcs-title">Findy</h1>
                <ul className="fcs-chips">
                  {['UX Research', 'Brand Identity', 'Design Systems', 'Interaction Design', 'UX/UI'].map(chip => (
                    <li key={chip} className="fcs-chip">{chip}</li>
                  ))}
                </ul>
              </div>
              <p className="fcs-section-body fcs-section-body--muted findy-intro">
                Findy is a B2B AI companion designed to be built into iOS to assist elderly users. Grounded in hands-on research, Findy
                takes on an innovative approach towards addressing elderly care through its AI-powered native
                integration into local interfaces.
              </p>
              {/* Figma: the hero is an empty white 779×450 panel for now */}
              <div className="findy-hero" aria-hidden />
              <div className="fcs-tags">
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Role</span>
                  <span className="fcs-tag-value">Lead UI/UX Designer</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Timeline</span>
                  <span className="fcs-tag-value">March 2026 - June 2026</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Team</span>
                  <div className="fcs-tag-values">
                    <span className="fcs-tag-value">Product Management</span>
                    <span className="fcs-tag-value">Product Design</span>
                  </div>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Tools</span>
                  <div className="fcs-tag-values">
                    <span className="fcs-tag-value">Figma</span>
                  </div>
                </div>
              </div>
            </header>

            {/* ── Background ── */}
            <section className="fcs-section">
              <span className="fcs-section-label">Background</span>
              <h2 className="fcs-section-heading">
                How could we bring hands-on care to seniors without complicating their screens?
              </h2>
              <p className="fcs-section-body">
                As our team ideated concepts towards helping others navigate the unknown, we shared memories helping
                out our grandparents with their phones. Whenever faced with trouble, the nurturing support of another
                individual patiently guiding them resonated, and we were inspired to scale that experience for those
                without nearby family or support.
              </p>
              <div className="fcs-card fcs-role-card">
                <p className="fcs-card-label">My role as Lead UI/UX Designer</p>
                {ROLE_ITEMS.map((item, i) => (
                  <div key={item.icon} className="fcs-role-group">
                    {i > 0 && <div className="fcs-divider" />}
                    <div className="fcs-role-item">
                      <span className="fcs-icon" aria-hidden>{item.icon}</span>
                      <p className="fcs-role-text">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Problem ── */}
            <section className="fcs-section" id="problem">
              <span className="fcs-section-label">Problem</span>
              <h2 className="fcs-section-heading">
                As tech embeds itself deeper within everyday interactions, seniors are left navigating unfamiliar
                systems on their own.
              </h2>
              <p className="findy-problem-lead">leading to feelings of....</p>
              <div className="findy-pain-points">
                {PAIN_POINTS.map((point, i) => (
                  <div key={point.chip} className="findy-pain-point">
                    <div className="findy-pain-card">
                      <div className="findy-pain-chip-row"><span className="findy-pain-chip">{point.chip}</span></div>
                      <div className="findy-pain-art" aria-hidden>
                        {i === 0 && <img src={bubbleDetective} alt="" className="findy-bubble findy-bubble--detective" draggable={false} />}
                        {i === 1 && (
                          <div className="findy-bubble findy-bubble--listening">
                            <img src={bubbleZen} alt="" className="findy-bubble-zen" draggable={false} />
                            <img src={headphones} alt="" className="findy-bubble-headphones" draggable={false} />
                          </div>
                        )}
                        {i === 2 && <img src={bubbleClumsy} alt="" className="findy-bubble findy-bubble--clumsy" draggable={false} />}
                      </div>
                    </div>
                    <div className="findy-pain-text">
                      <p className="findy-pain-title">{point.title}</p>
                      <p className="findy-pain-body">{point.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Research ── */}
            <section className="fcs-section" id="research">
              <span className="fcs-section-label">Research</span>
              <h2 className="fcs-section-heading">Analyzing Competitors Revealed Gaps in Approaches to Senior Care</h2>
              <div className="fcs-media-card fcs-media-card--padded findy-figure--bleed">
                <p className="fcs-media-card-label">BREAKING DOWN iOS ACCESSIBILITY MODE</p>
                <img src={competitors} alt="Breakdown of iOS Assistive Access" className="findy-competitors" draggable={false} />
              </div>
            </section>

            <section className="fcs-section" id="shifting">
              <h2 className="fcs-section-heading">
                To actually understand the problem, we needed to talk to those who knew best...actual seniors!
              </h2>
              <div className="fcs-media-card fcs-media-card--padded">
                <p className="fcs-media-card-label">CONDUCTING RESEARCH IN PERSON</p>
                <div className="findy-media-row">
                  <figure className="findy-media">
                    <div className="findy-media-frame findy-media-frame--table">
                      <img src={tableSetup} alt="Table setup at the Huntington Beach Council on Aging" draggable={false} />
                    </div>
                    <figcaption className="fcs-media-card-label">Table Setup at the Huntington Beach Council on Aging</figcaption>
                  </figure>
                  <figure className="findy-media">
                    <div className="findy-media-frame findy-media-frame--focus">
                      <img src={focusGroup} alt="Focus group with individuals aged 75-90+" draggable={false} />
                    </div>
                    <figcaption className="fcs-media-card-label">Focus Group with Individuals Aged 75-90+</figcaption>
                  </figure>
                </div>
              </div>
              <p className="fcs-section-body">
                By actually talking to elderly users, it became clear how beautifully unique this core group was.
                Instead of simply making assumptions about how elderly users act, we now understood the specific pain
                points they come across every day.
              </p>
            </section>

            <section className="fcs-section" id="user-testing">
              <h2 className="fcs-section-heading">
                Usability testing helped us identify navigational challenges within our design
              </h2>
              <div className="fcs-media-card fcs-media-card--padded">
                <p className="fcs-media-card-label">CONDUCTING RESEARCH IN PERSON</p>
                <div className="findy-media-row">
                  <figure className="findy-media">
                    <div className="findy-media-frame findy-media-frame--usability">
                      <img src={usabilityShot} alt="Usability testing session" draggable={false} />
                    </div>
                    <figcaption className="fcs-media-card-label">Table Setup at the Huntington Beach Council on Aging</figcaption>
                  </figure>
                  <figure className="findy-media">
                    <div className="findy-media-frame findy-media-frame--focus">
                      <img src={focusGroup} alt="Focus group with individuals aged 75-90+" draggable={false} />
                    </div>
                    <figcaption className="fcs-media-card-label">Focus Group with Individuals Aged 75-90+</figcaption>
                  </figure>
                </div>
              </div>
              <p className="fcs-section-body">
                By actually talking to elderly users, it became clear how beautifully unique this core group was.
                Instead of simply making assumptions about how elderly users act, we now understood the specific pain
                points they come across every day.
              </p>
              <div className="fcs-media-card fcs-media-card--padded">
                <p className="fcs-media-card-label">BEFORE &amp; AFTER USER TESTING</p>
                <div className="findy-before-after">
                  <div className="findy-ba-phone">
                    <span className="findy-ba-label">Before</span>
                    <img src={beforeScreen} alt="Findy before user testing" draggable={false} />
                  </div>
                  <img src={arrowRight} alt="" className="findy-ba-arrow" aria-hidden draggable={false} />
                  <div className="findy-ba-phone">
                    <span className="findy-ba-label">After</span>
                    <img src={afterScreen} alt="Findy after user testing" draggable={false} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Solution ── */}
            <section className="fcs-section" id="design-recs">
              <span className="fcs-section-label">Solution</span>
              <h2 className="fcs-section-heading">
                A conversational assistant built to integrate directly within already comfortable experiences.
              </h2>
              <div className="fcs-media-card fcs-media-card--padded findy-figure--start">
                <p className="fcs-media-card-label">THE ASSISTANCE LOOP</p>
                <div className="findy-states">
                  {STATES.map(state => (
                    <div key={state.label} className="findy-state">
                      <p className="fcs-media-card-label">{state.label}</p>
                      <img src={state.img} alt="" className="findy-state-img" draggable={false} />
                      <p className="findy-state-text">{state.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="findy-value-props">
                {VALUE_PROPS.map(prop => (
                  <div key={prop.title} className="fcs-card findy-value-prop">
                    <span className="fcs-icon fcs-icon--lg" aria-hidden>{prop.icon}</span>
                    <p className="findy-value-title">{prop.title}</p>
                    <p className="findy-value-text">{prop.text}</p>
                  </div>
                ))}
              </div>
              <p className="fcs-section-body">
                Findy redefines what it means for seniors to interact with their mobile devices. Instead of asking
                them to learn something new, it works inside the system they already know.
              </p>
              <div className="findy-phone-row">
                <PhoneFigure label="THE MAIN INTERACTION - HOME" caption="The main button ensures Findy is apparent, readily-available, and easy to interact with.">
                  <Phone src={phoneHome} alt="Findy on the iOS home screen" />
                </PhoneFigure>
                <PhoneFigure label="THE MAIN INTERACTION - WITHIN APPS" caption="Persistence across apps allows the functionality to support elders primary mobile use cases">
                  <Phone src={phoneApps} alt="Findy within Messages" fit="contain" bg="#e8eee0" screen={{ w: 244, h: 529, x: -0.17, y: 0.33 }} />
                </PhoneFigure>
              </div>
              <div className="findy-phone-row">
                <PhoneFigure label="CONNECTIVITY WITH MAPS" caption="Before every redirect, the user is informed and prompted, ensuring seniors are the ones in control, not their phones.">
                  <Phone src={phoneMaps} alt="Findy redirecting to Maps" />
                </PhoneFigure>
                <PhoneFigure label="CONNECTIVITY WITH APPLE PAY" caption="By synching with Apple Pay, transactions are simplified without burderning users hesitant to share financial information.">
                  <Phone src={phonePay} alt="Findy with Apple Pay" fit="contain" bg="#26416d" screen={{ w: 249, h: 541, x: -3.17, y: -11.67 }} />
                </PhoneFigure>
              </div>
            </section>

            {/* ── Reflection ── */}
            <section className="fcs-section" id="reflections">
              <span className="fcs-section-label">Reflection</span>
              <h2 className="fcs-section-heading">Every insight, feature, and flow, was shaped by genuine conversation</h2>
              <p className="fcs-section-body">
                Findy won first place as part of a case study competition hosted by Design @ UCI, proving that creative
                vision and a dedication towards connecting with users is key towards building resonant emerging
                interfaces.
              </p>
              <div className="fcs-stats">
                {[['15', 'In-person interviews'], ['3 → 3', 'Insights mapped to features'], ['1st', 'Place, Design @ UCI competition']].map(([num, label]) => (
                  <div key={label} className="fcs-stat">
                    <span className="fcs-stat-num">{num}</span>
                    <span className="fcs-stat-label">{label}</span>
                  </div>
                ))}
              </div>
              <div className="fcs-media-card fcs-media-card--padded">
                <p className="fcs-media-card-label">DEMO-DAY</p>
                <div className="findy-media-frame findy-media-frame--demo">
                  <img src={demoDay} alt="My team presenting Findy on demo day" draggable={false} />
                </div>
              </div>
            </section>

            <div className="fcs-divider fcs-divider--section" />

            {/* ── Up Next ── */}
            <section className="rl-upnext">
              <h2 className="rl-upnext-heading">Up Next</h2>
              <div className="rl-upnext-row">
                <Link to="/work/streets" className="rl-upnext-card" data-cursor="case-study">
                  <div className="rl-upnext-artwork findy-upnext-streets">
                    <img src={upStreets} alt="Streets" draggable={false} />
                  </div>
                  <div>
                    <p className="rl-upnext-title">Streets</p>
                    <p className="rl-upnext-desc">design engineering enterprise B2B software</p>
                  </div>
                </Link>
                <Link to="/work/rocket-lawyer" className="rl-upnext-card" data-cursor="case-study">
                  <div className="rl-upnext-artwork rl-upnext-artwork--rocket">
                    <img src={rocketArtwork} alt="Rocket Copilot" draggable={false} />
                  </div>
                  <div>
                    <p className="rl-upnext-title">Rocket Copilot</p>
                    <p className="rl-upnext-desc">redefining legal tech software through data-driven research</p>
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
