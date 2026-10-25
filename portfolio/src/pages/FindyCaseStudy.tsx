import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './FindyCaseStudy.css'
import TopNavbar from '../components/TopNavbar'
import { useRevealWhenReady } from '../lib/pageReady'

import backArrow        from '../assets/images/cs-back-arrow.svg'
import orgLogo          from '../assets/images/findy-v2-org.png'
import heroGif          from '../assets/images/findy-assisting.gif'
import bubbleDetective  from '../assets/images/findy-v2-detective.svg'
import bubbleZen        from '../assets/images/findy-v2-zen.svg'
import headphones       from '../assets/images/findy-v2-headphones.svg'
import bubbleClumsy     from '../assets/images/findy-v2-clumsy.svg'
import competitors      from '../assets/images/findy-v2-competitors.png'
import researchSetup    from '../assets/images/findy-v2-research-setup.webp'
import tableSetup       from '../assets/images/findy-v2-table-setup.jpg'
import focusGroup       from '../assets/images/findy-v2-focus-group.gif'
import usabilityShot    from '../assets/images/findy-v2-usability.jpg'
import adrianaHomes     from '../assets/images/findy-v2-adriana-homes.jpg'
import usabilityResults from '../assets/images/findy-v2-usability-results.png'
import stateDefault     from '../assets/images/findy-v2-state-default.png'
import stateListening   from '../assets/images/findy-v2-state-listening.png'
import stateAssisting   from '../assets/images/findy-v2-state-assisting.png'
import phoneHome        from '../assets/images/findy-v2-phone-home.webp'
import phoneSpotlight   from '../assets/images/findy-v2-phone-spotlight.webp'
import phoneNavigation  from '../assets/images/findy-v2-phone-navigation.webp'
import phonePay         from '../assets/images/findy-v2-phone-pay.webp'
import demoDay          from '../assets/images/findy-v2-demo-day.jpg'
import upStreets        from '../assets/images/findy-v2-up-streets-projects.png'
import rocketArtwork    from '../assets/images/rocket-artwork-v2.gif'
import iconExplore      from '../assets/images/cs-icon-explore.svg'
import iconPalette      from '../assets/images/cs-icon-palette.svg'
import iconForum        from '../assets/images/cs-icon-forum.svg'
import iconSchool       from '../assets/images/cs-icon-school.svg'
import iconAllInclusive from '../assets/images/cs-icon-all-inclusive.svg'
import iconPhoneIphone  from '../assets/images/cs-icon-phone-iphone.svg'
import iconSupportAgent from '../assets/images/cs-icon-support-agent.svg'

// Figma sidebar tabs (1657:189080), one per labelled section, in page order. Research covers the
// unlabelled competitor and usability-testing sections that follow it.
const NAV_ITEMS = [
  { id: 'background',  label: 'Background' },
  { id: 'problem',     label: 'Problem'    },
  { id: 'research',    label: 'Research'   },
  { id: 'solution',    label: 'Solution'   },
  { id: 'reflections', label: 'Reflection' },
]

// A section is current once its top passes this line (sections land at their 100px scroll-margin on click)
const SPY_LINE = 0.35
const SCROLL_LOCK_MS = 1200 // fallback for browsers without `scrollend`

const ROLE_ITEMS = [
  { icon: iconExplore, text: 'Owned the design direction and vision for the entire team, from first concept to final prototype.' },
  { icon: iconPalette, text: 'Created the brand identity and design system that Findy is built on.' },
  { icon: iconForum,   text: 'Assisted our lead with project management and UX research, including interviews at two senior centers.' },
  { icon: iconSchool,  text: 'Served as a mentor and educational resource for the early-stage designers on my team.' },
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
  { icon: iconAllInclusive, title: 'Persistent Support', text: 'Findy is available on any screen, at any time, so seniors never have to go looking for help.' },
  { icon: iconPhoneIphone,  title: 'iOS Ecosystem',      text: 'Rather than forcing users to learn a completely new experience, Findy is integrated directly into iOS.' },
  { icon: iconSupportAgent, title: 'Friendly Assistant', text: 'Findy is not just a tool, but a tech-support style assistant that feels like a patient helper.' },
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
    <div className="fcs-page fcs-page--findy">

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
              {/* Figma hero frame (779×450, radius 12) holding the original Findy gif */}
              <div className="findy-hero">
                <img src={heroGif} alt="Findy guiding a senior through their iPhone" draggable={false} />
              </div>
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
            <section className="fcs-section" id="background">
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
                      <img src={item.icon} alt="" className="fcs-icon" aria-hidden draggable={false} />
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
              <h2 className="fcs-section-heading">
                To actually understand the problem, we needed to talk to those who knew best...actual seniors!
              </h2>
              <div className="fcs-media-card fcs-media-card--padded">
                <p className="fcs-media-card-label">CONDUCTING RESEARCH IN PERSON</p>
                <div className="findy-media-row">
                  <figure className="findy-media">
                    <div className="findy-media-frame findy-media-frame--cover">
                      <img src={researchSetup} alt="Setting up at the Huntington Beach Council of Aging" draggable={false} />
                    </div>
                    <figcaption className="fcs-media-card-label">Setting Up at the Huntington Beach Council of Aging</figcaption>
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

            <section className="fcs-section">
              <h2 className="fcs-section-heading">Analyzing Competitors Revealed Gaps in Approaches to Senior Care</h2>
              <div className="fcs-media-card fcs-media-card--padded findy-figure--bleed">
                <p className="fcs-media-card-label">BREAKING DOWN iOS ACCESSIBILITY MODE</p>
                <img src={competitors} alt="Breakdown of iOS Assistive Access" className="findy-competitors" draggable={false} />
              </div>
            </section>

            <section className="fcs-section">
              <h2 className="fcs-section-heading">
                Usability testing helped us identify navigational challenges within our design
              </h2>
              <div className="fcs-media-card fcs-media-card--padded">
                <p className="fcs-media-card-label">CONDUCTING RESEARCH IN PERSON</p>
                <div className="findy-media-row">
                  <figure className="findy-media">
                    <div className="findy-media-frame findy-media-frame--adriana">
                      <img src={adrianaHomes} alt="Adriana Elderly Homes" draggable={false} />
                    </div>
                    <figcaption className="fcs-media-card-label">Adriana Elderly Homes</figcaption>
                  </figure>
                  <figure className="findy-media">
                    <div className="findy-media-frame findy-media-frame--cover">
                      <img src={usabilityShot} alt="A senior taking an assisted usability test" draggable={false} />
                    </div>
                    <figcaption className="fcs-media-card-label">Conducting Assisted Usability Tests</figcaption>
                  </figure>
                </div>
              </div>
              <p className="fcs-section-body">
                By actually talking to elderly users, it became clear how beautifully unique this core group was.
                Instead of simply making assumptions about how elderly users act, we now understood the specific pain
                points they come across every day.
              </p>
              {/* Figma 2162:1611 — annotated before → after screens */}
              <div className="fcs-media-card fcs-media-card--padded findy-figure--start">
                <p className="fcs-media-card-label">APPLYING USABILITY TEST RESULTS ACROSS ITERATIONS</p>
                <img
                  src={usabilityResults}
                  alt="Findy before and after usability testing, annotated with what each iteration changed"
                  className="findy-usability-results"
                  draggable={false}
                />
              </div>
            </section>

            {/* ── Solution ── */}
            <section className="fcs-section" id="solution">
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
                    <img src={prop.icon} alt="" className="fcs-icon fcs-icon--lg" aria-hidden draggable={false} />
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
                  <img src={phoneHome} alt="Findy listening on the iOS home screen" className="findy-phone" draggable={false} />
                </PhoneFigure>
                <PhoneFigure label="SPOTLIGHT & DIMMING" caption="After talking to experts in aging psychology, we added spotlight/dimming to guide seniors’ focus">
                  <img src={phoneSpotlight} alt="Findy dimming the screen to spotlight one control" className="findy-phone" draggable={false} />
                </PhoneFigure>
              </div>
              <div className="findy-phone-row">
                <PhoneFigure label="ASSISTED NAVIGATION WITH GUIDED CHECKS" caption="Before every redirect, the user is informed and prompted, ensuring seniors are the ones in control, not their phones.">
                  <img src={phoneNavigation} alt="Findy asking before redirecting to another app" className="findy-phone" draggable={false} />
                </PhoneFigure>
                <PhoneFigure label="CONNECTIVITY WITH APPLE PAY" caption="By synching with Apple Pay, transactions are simplified without burderning users hesitant to share financial information.">
                  <img src={phonePay} alt="Findy completing a purchase with Apple Pay" className="findy-phone" draggable={false} />
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
              {/* Figma 2157:1597 */}
              <div className="fcs-media-card fcs-media-card--padded">
                <p className="fcs-media-card-label">DOCUMENTING OUR JOURNEY</p>
                <div className="findy-media-row">
                  <figure className="findy-media">
                    <div className="findy-media-frame findy-media-frame--cover">
                      <img src={demoDay} alt="Our team receiving first place at demo day" draggable={false} />
                    </div>
                    <figcaption className="fcs-media-card-label">Receiving First Place at Demo Day</figcaption>
                  </figure>
                  <figure className="findy-media">
                    <div className="findy-media-frame findy-media-frame--table">
                      <img src={tableSetup} alt="Our table at the first round of UX research" draggable={false} />
                    </div>
                    <figcaption className="fcs-media-card-label">First Round of UX Research</figcaption>
                  </figure>
                </div>
              </div>
            </section>

            <div className="fcs-divider fcs-divider--section" />

            {/* ── Up Next ── */}
            <section className="rl-upnext">
              <h2 className="rl-upnext-heading">Up Next</h2>
              <div className="rl-upnext-row">
                <div className="rl-upnext-card" data-cursor="coming-soon">
                  <div className="rl-upnext-artwork findy-upnext-streets">
                    <img src={upStreets} alt="Streets" draggable={false} />
                  </div>
                  <div>
                    <p className="rl-upnext-title">Streets</p>
                    <p className="rl-upnext-desc">design engineering enterprise B2B software</p>
                  </div>
                </div>
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
