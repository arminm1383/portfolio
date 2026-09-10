import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './FindyCaseStudy.css'
import CsTopbar from '../components/CsTopbar'

import orgUci         from '../assets/images/org-uci.png'
import findyMokker    from '../assets/images/findy-cs-mokker.png'
import findyBubble    from '../assets/images/findy-cs-bubble-frame.svg'
import findyGuyHero   from '../assets/images/findy-cs-lil-finder-guy.svg'
import researchPhoto1 from '../assets/images/findy-cs-research-photo1.jpg'
import researchPhoto2 from '../assets/images/findy-cs-research-photo2.jpg'
import mascotDetective from '../assets/images/findy-cs-mascot-detective.svg'
import mascotGuy      from '../assets/images/findy-cs-mascot-guy.svg'
import mascotZen      from '../assets/images/findy-cs-mascot-zen.svg'
import mascotHeadphones from '../assets/images/findy-cs-headphones.svg'
import rqIcon1        from '../assets/images/findy-cs-rq-icon1.svg'
import rqIcon2        from '../assets/images/findy-cs-rq-icon2.svg'
import rqIcon3        from '../assets/images/findy-cs-rq-icon3.svg'
import screen1        from '../assets/images/findy-cs-screen1.png'
import screen2        from '../assets/images/findy-cs-screen2.jpg'
import screen3        from '../assets/images/findy-cs-screen3.png'
import ellipse        from '../assets/images/findy-cs-ellipse.svg'
import teamPhoto      from '../assets/images/findy-cs-team-photo.jpg'
import surveyPhoto    from '../assets/images/findy-cs-survey-photo.jpg'
import streetsGif     from '../assets/images/streetsgif.gif'
import workMementoArtwork from '../assets/images/work-memento-artwork.png'
import orgStreets     from '../assets/images/org-streets.png'

const NAV_ITEMS = [
  { id: '',            label: 'Background',             routable: false },
  { id: 'problem',     label: 'Problem',                routable: true  },
  { id: 'research',    label: 'Research',               routable: true  },
  { id: 'design-recs', label: 'Design Recommendations', routable: true  },
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

function FindyPhone({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="findy-phone" aria-hidden>
      <div className="findy-phone-btn findy-phone-btn--vol-up" />
      <div className="findy-phone-btn findy-phone-btn--vol-dn" />
      <div className="findy-phone-btn findy-phone-btn--power" />
      <div className="findy-phone-outer-bezel">
        <div className="findy-phone-inner-bezel">
          <div className="findy-phone-screen">
            <img src={src} alt={alt} draggable={false} />
          </div>
        </div>
      </div>
    </div>
  )
}

function InsightCard({
  label, heading, link, mascotSrc, mascotClass, mascotAlt,
  extraMascot,
}: {
  label: string
  heading: string
  link: string
  mascotSrc: string
  mascotClass: string
  mascotAlt: string
  extraMascot?: React.ReactNode
}) {
  return (
    <div className="findy-insight-card">
      <div className={`findy-insight-mascot ${mascotClass}`} aria-hidden>
        {extraMascot ?? <img src={mascotSrc} alt={mascotAlt} draggable={false} />}
      </div>
      <div className="findy-insight-body">
        <span className="findy-insight-label">{label}</span>
        <p className="findy-insight-heading">{heading}</p>
        <span className="findy-insight-link">{link} →</span>
      </div>
      <div className="findy-insight-inset" aria-hidden />
    </div>
  )
}

export default function FindyCaseStudy() {
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
    <div className="fcs-page fcs-page--findy">

      <CsTopbar showAtTop />

      <div className="fcs-body">

        <aside className="fcs-sidebar">
          <nav className="fcs-nav">
            {NAV_ITEMS.map(({ id, label, routable }) => (
              <button
                key={label}
                className={[
                  'fcs-nav-item',
                  !routable && id !== '' ? 'fcs-nav-item--soon' : '',
                  active === id ? 'fcs-nav-item--active' : '',
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

            {/* ── Header ── */}
            <header className="fcs-header fcs-header--findy">
              <div className="fcs-name-org">
                <div className="fcs-org-row">
                  <img src={orgUci} alt="" className="fcs-org-logo" />
                  <span className="fcs-org-name">Design @ UCI</span>
                </div>
                <h1 className="fcs-title">Findy</h1>
              </div>

              {/* Hero illustration card */}
              <div className="findy-hero-card">
                <img src={findyMokker} alt="" className="findy-hero-mokker" draggable={false} aria-hidden />
                <div className="findy-hero-bubble-wrap" aria-hidden>
                  <img src={findyBubble} alt="" className="findy-hero-bubble-frame" />
                  <img src={findyGuyHero} alt="" className="findy-hero-guy" />
                </div>
                <div className="findy-hero-speech" aria-hidden>
                  <span className="findy-hero-speech-text">Here to help!</span>
                </div>
              </div>

              <div className="fcs-tags">
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Role</span>
                  <span className="fcs-tag-value">Product Designer</span>
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
                  <span className="fcs-tag-value">Figma</span>
                </div>
              </div>
            </header>

            {/* ── Background ── */}
            <section className="fcs-section">
              <span className="fcs-section-label">Background</span>
              <p className="fcs-section-body">
                As technology deeply embeds itself in society, seniors are left to navigate
                unfamiliar systems on their own, sparking feelings of confusion, exclusion,
                and frustration.
              </p>
            </section>

            {/* ── Problem ── */}
            <section className="fcs-section" id="problem">
              <span className="fcs-section-label">Problem</span>
              <p className="fcs-section-body">
                Existing assistive technology solutions fail to meet seniors where they are —
                overwhelming interfaces, steep learning curves, and one-size-fits-all approaches
                leave the most in-need users behind.
              </p>
              <p className="fcs-section-body">
                To address this, we centered our study around understanding how seniors actually
                interact with unfamiliar technology in hopes of designing something that truly
                empowers rather than replaces their agency.
              </p>
              <div className="fcs-rq-card fcs-rq-card--findy">
                <span className="fcs-rq-label">Research Questions</span>
                <div className="fcs-rq-item">
                  <img src={rqIcon1} alt="" className="fcs-rq-icon-img" aria-hidden />
                  <p className="fcs-rq-text">How do seniors currently seek help when they encounter unfamiliar technology on their devices?</p>
                </div>
                <div className="fcs-rq-divider" />
                <div className="fcs-rq-item">
                  <img src={rqIcon2} alt="" className="fcs-rq-icon-img" aria-hidden />
                  <p className="fcs-rq-text">What on-screen guidance feels helpful versus overwhelming for elderly users?</p>
                </div>
                <div className="fcs-rq-divider" />
                <div className="fcs-rq-item">
                  <img src={rqIcon3} alt="" className="fcs-rq-icon-img" aria-hidden />
                  <p className="fcs-rq-text">How does assistance style impact the independence and confidence of senior users?</p>
                </div>
              </div>
            </section>

            {/* ── Research ── */}
            <section className="fcs-section" id="research">
              <span className="fcs-section-label">Research</span>
              <h3 className="fcs-subsection-heading">Talking with Elderly Users</h3>
              <p className="fcs-section-body">
                Our initial attempts to gauge research proved our thought process was glaringly
                flawed: we needed to connect and bond with target users face-to-face.
              </p>

              {/* 2-column research photo grid */}
              <div className="findy-photo-grid">
                <div className="findy-photo-col">
                  <div className="findy-photo-frame">
                    <img src={researchPhoto1} alt="Conducting usability tests with the Adriana Elderly Care Home" draggable={false} />
                  </div>
                  <p className="findy-photo-caption">Conducting Usability Tests with the Adriana Elderly Care Home</p>
                </div>
                <div className="findy-photo-col">
                  <div className="findy-photo-frame">
                    <img src={researchPhoto2} alt="Focus group session with the Huntington Beach Council on Aging" draggable={false} />
                  </div>
                  <p className="findy-photo-caption">Focus Group Session with the Huntington Beach Council on Aging</p>
                </div>
              </div>

              {/* 3-column insight cards */}
              <div className="findy-insight-grid">
                <InsightCard
                  label="INSIGHT #1"
                  heading="There's no general approach to our problem."
                  link="Addressed by Feature #3"
                  mascotSrc={mascotDetective}
                  mascotClass="findy-insight-mascot--detective"
                  mascotAlt=""
                />
                <InsightCard
                  label="INSIGHT #3"
                  heading="When support takes over, learning stops."
                  link="Addressed by Feature #1"
                  mascotSrc={mascotGuy}
                  mascotClass="findy-insight-mascot--guy"
                  mascotAlt=""
                />
                <InsightCard
                  label="INSIGHT #2"
                  heading="The barrier is overwhelm, not ability."
                  link="Addressed by Feature #2"
                  mascotSrc={mascotZen}
                  mascotClass="findy-insight-mascot--zen"
                  mascotAlt=""
                  extraMascot={
                    <div className="findy-listening-bubble">
                      <img src={mascotZen} alt="" className="findy-listening-zen" draggable={false} />
                      <img src={mascotHeadphones} alt="" className="findy-listening-headphones" draggable={false} />
                    </div>
                  }
                />
              </div>
            </section>

            {/* ── Design Recommendations ── */}
            <section className="fcs-section" id="design-recs">
              <span className="fcs-section-label">Design Recommendations</span>

              <div className="findy-rec">
                <h3 className="findy-rec-heading">Findy Lives within iOS</h3>
                <p className="fcs-section-body">
                  Always present on users' screens, Findy is there to provide on-screen support
                  whenever and wherever seniors need.
                </p>
                <div className="findy-phone-section">
                  <img src={ellipse} alt="" className="findy-phone-ellipse" aria-hidden />
                  <FindyPhone src={screen1} alt="Findy Lives within iOS" />
                </div>
              </div>

              <div className="findy-rec">
                <h3 className="findy-rec-heading">Spotlighting &amp; Dimming Guides User Focus</h3>
                <p className="fcs-section-body">
                  Rather than directly acting for users, visual cues like dimming allow Findy to
                  naturally draw the user's attention towards specific inputs on the screen,
                  keeping their core interaction within user control.
                </p>
                <div className="findy-phone-section">
                  <img src={ellipse} alt="" className="findy-phone-ellipse" aria-hidden />
                  <FindyPhone src={screen2} alt="Spotlight and dimming" />
                </div>
              </div>

              <div className="findy-rec">
                <h3 className="findy-rec-heading">Synchronization Across Applications</h3>
                <p className="fcs-section-body">
                  Apps are synced, with persistent checks and engagement that ensures the
                  streamlined, clearly defined UI is balanced with that sense of empowerment
                  so important for elderly users.
                </p>
                <div className="findy-phone-section">
                  <img src={ellipse} alt="" className="findy-phone-ellipse" aria-hidden />
                  <FindyPhone src={screen3} alt="Synchronization across apps" />
                </div>
              </div>
            </section>

            {/* ── Reflections ── */}
            <section className="fcs-section" id="reflections">
              <span className="fcs-section-label">Reflections</span>
              <h2 className="fcs-section-heading">Learning, Growing, and Evolving</h2>
              <p className="fcs-section-body">
                Findy was the project that taught me to lead with empathy before assumption —
                that real design research means meeting people where they are, not where we
                expect them to be.
              </p>

              <div className="fcs-reflection-row">
                <div className="fcs-reflection-num-card">
                  <span className="fcs-reflection-num fcs-reflection-num--findy">01</span>
                  <p className="fcs-reflection-body">Tailoring the experience to individual preferences becomes the most powerful design lever — no two seniors experience technology the same way.</p>
                </div>
                <div className="fcs-reflection-num-card">
                  <span className="fcs-reflection-num fcs-reflection-num--findy">02</span>
                  <p className="fcs-reflection-body">Designing with users in-person — not just for them — revealed friction points no survey could surface, and built trust that made the research richer.</p>
                </div>
                <div className="fcs-reflection-num-card">
                  <span className="fcs-reflection-num fcs-reflection-num--findy">03</span>
                  <p className="fcs-reflection-body">The best assistive interface is one that makes itself unnecessary: it empowers users to act independently rather than creating a new dependency.</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="findy-stats-row">
                <div className="findy-stats-col">
                  <span className="findy-stats-num">15</span>
                  <span className="findy-stats-label">In-person interviews</span>
                </div>
                <div className="findy-stats-col findy-stats-col--bordered">
                  <span className="findy-stats-num">3 → 3</span>
                  <span className="findy-stats-label">Insights mapped to features</span>
                </div>
                <div className="findy-stats-col findy-stats-col--bordered">
                  <span className="findy-stats-num">1st</span>
                  <span className="findy-stats-label">Place, Design @ UCI competition</span>
                </div>
              </div>

              <p className="fcs-section-body">
                Findy won first place as part of a case study competition hosted by Design @ UCI, proving that
                creative vision and a dedication towards connecting with users is key towards building resonant
                emerging interfaces.
              </p>

              <div className="findy-photo-grid findy-photo-grid--wide">
                <div className="findy-photo-col">
                  <div className="findy-photo-frame findy-photo-frame--reflection">
                    <img src={teamPhoto} alt="My team and I after placing first in the Spring case competition" draggable={false} />
                  </div>
                  <p className="findy-photo-caption">My team and I after placing first in the Spring case competition</p>
                </div>
                <div className="findy-photo-col">
                  <div className="findy-photo-frame findy-photo-frame--reflection">
                    <img src={surveyPhoto} alt="Interactive survey setup at the Huntington Beach Council of Aging" draggable={false} />
                  </div>
                  <p className="findy-photo-caption">Interactive survey setup at the Huntington Beach Council of Aging</p>
                </div>
              </div>
            </section>

            {/* ── Up Next ── */}
            <section className="fcs-upnext">
              <div className="fcs-upnext-divider" />
              <h2 className="fcs-upnext-heading">Up Next</h2>
              <div className="fcs-upnext-cards">
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
                <a
                  href="https://devpost.com/software/memento-3p1kjl"
                  target="_blank"
                  rel="noreferrer"
                  className="fcs-upnext-card"
                >
                  <div className="fcs-upnext-card-artwork fcs-upnext-card-artwork--dark">
                    <img src={workMementoArtwork} alt="" draggable={false} />
                  </div>
                  <div className="fcs-upnext-card-info">
                    <div className="fcs-upnext-card-org">
                      <span>Emerging Interfaces</span>
                    </div>
                    <div className="fcs-upnext-card-title">Memento</div>
                  </div>
                </a>
              </div>
            </section>

          </div>
        </main>

      </div>

    </div>
  )
}
