import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './FindyCaseStudy.css'
import CsTopbar from '../components/CsTopbar'

import findyGif           from '../assets/images/FindyGif.gif'
import rocketArtwork     from '../assets/images/rocket-artwork-v2.gif'
import ellipse            from '../assets/images/findy-cs-ellipse.svg'
import screen1            from '../assets/images/findy-cs-screen1.png'
import screen2            from '../assets/images/findy-cs-screen2.png'
import screen3            from '../assets/images/findy-cs-screen3.png'
import researchCard       from '../assets/images/findy-cs-research-card.png'
import researchPhoto1     from '../assets/images/findy-cs-research-photo1.png'
import researchPhoto2     from '../assets/images/findy-cs-research-photo2.png'
import mascotDetective    from '../assets/images/findy-cs-mascot-detective.svg'
import mascotGuy          from '../assets/images/findy-cs-mascot-guy.svg'
import listeningBubble    from '../assets/images/findy-cs-listening-bubble.svg'
import teamPhoto          from '../assets/images/findy-cs-team-photo.png'
import surveyPhoto        from '../assets/images/findy-cs-survey-photo.png'
import upnextStreets      from '../assets/images/work-streets-projects.png'
import projectTeams      from '../assets/images/org-uci.png'
import bgPhoto1          from '../assets/images/findy-cs-bg-photo1.png'
import bgPhoto2          from '../assets/images/findy-cs-bg-photo2.png'
import bgPhoto3          from '../assets/images/findy-cs-bg-photo3.png'
import bgMascot          from '../assets/images/findy-cs-bg-mascot.svg'
import probMascotHappy   from '../assets/images/findy-cs-prob-mascot-happy.svg'
import probMascotWalking from '../assets/images/findy-cs-prob-mascot-walking.svg'
import probMascotWave    from '../assets/images/findy-cs-prob-mascot-wave.svg'
import probArrow1        from '../assets/images/findy-cs-prob-arrow1.svg'
import probArrow2        from '../assets/images/findy-cs-prob-arrow2.svg'
import probArrow3        from '../assets/images/findy-cs-prob-arrow3.svg'

const NAV_ITEMS = [
  { id: '',             label: 'Background',            routable: false },
  { id: 'problem',      label: 'Problem',               routable: true  },
  { id: 'research',     label: 'Initial Research',      routable: true  },
  { id: 'design-recs',  label: 'Design Recs',           routable: true  },
  // { id: 'user-testing', label: 'User Testing',          routable: true  },
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
    els.forEach(el => obs.observe(el))
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
    <div className="fcs-page fcs-page--findy">

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
                  <img src={projectTeams} alt="" className="fcs-org-logo" />
                  <span className="fcs-org-name">Design @ UCI</span>
                </div>
                <h1 className="fcs-title">Findy</h1>
              </div>
              <img src={findyGif} alt="" className="fcs-hero-single" draggable={false} data-reveal="" />
              <div className="fcs-tags" data-reveal="" data-reveal-delay="150">
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Role</span>
                  <span className="fcs-tag-value">Lead UI/UX Designer</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Timeline</span>
                  <span className="fcs-tag-value">April 2026 - June 2026</span>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Team</span>
                  <div className="fcs-tag-values">
                    <span className="fcs-tag-value">Project Management</span>
                    <span className="fcs-tag-value">UI/UX Design</span>
                  </div>
                </div>
                <div className="fcs-tag">
                  <span className="fcs-tag-label">Tools</span>
                  <div className="fcs-tag-values">
                    <span className="fcs-tag-value">Figma</span>
                    <span className="fcs-tag-value">iOS Human Interface Guidelines</span>
                  </div>
                </div>
              </div>
            </header>


            {/* ── Background ── */}
            <section className="fcs-section">
              <span className="fcs-section-label" data-reveal="">Background</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">
                Addressing Accessibility Barriers for Elderly Users
              </h2>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="100">
                Findy is an AI companion built into iOS to assist elderly users. Grounded in hands-on
                research, Findy takes on an innovative approach towards addressing elderly care through
                its AI-powered native integration into local devices.
              </p>
              <div className="findy-bg-gallery" data-reveal="" data-reveal-delay="120">
                <div className="findy-bg-photo-wrap findy-bg-photo-wrap--1">
                  <div className="findy-bg-photo-card">
                    <img src={bgPhoto1} alt="" draggable={false} />
                  </div>
                </div>
                <div className="findy-bg-photo-wrap findy-bg-photo-wrap--2">
                  <div className="findy-bg-photo-card">
                    <img src={bgPhoto2} alt="" draggable={false} />
                  </div>
                </div>
                <div className="findy-bg-photo-wrap findy-bg-photo-wrap--3">
                  <div className="findy-bg-photo-card">
                    <img src={bgPhoto3} alt="" draggable={false} />
                  </div>
                </div>
                <img src={bgMascot} alt="" className="findy-bg-mascot" draggable={false} aria-hidden />
              </div>
              <h3 className="fcs-subsection-heading" data-reveal="">Tackling the Unfamiliar</h3>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="50">
                As our team ideated concepts towards helping others navigate the unknown, we shared
                memories helping out our grandparents with their phones. Whenever faced with trouble,
                the nurturing support of another individual patiently guiding them resonated, and we
                were inspired to scale that experience for those without nearby family or support.
              </p>
              <p className="fcs-problem-statement-alt" data-reveal="">
                How could we bring that feeling of hands-on care to elderly users without
                complicating already confusing user interfaces?
              </p>
            </section>

            {/* ── Problem ── */}
            <section className="fcs-section" id="problem">
              <span className="fcs-section-label" data-reveal="">Problem</span>

              <div className="findy-problem-statement" data-reveal="">
                <p className="findy-problem-headline">
                  <span>As technology grows more powerful and deeply embedded in society, </span>
                  <span className="findy-problem-headline--blue">seniors are left to navigate unfamiliar systems on their own.</span>
                </p>
                <p className="findy-problem-subtext">
                  Seniors are constantly left facing feelings of <em>confusion</em>, <em>exclusion</em>, and <em>frustration</em>
                </p>
              </div>

              <p className="findy-problem-lead" data-reveal="">We needed a solution that could...</p>

              <div className="findy-problem-illustration" data-reveal="pop" data-reveal-delay="80">
                <div className="findy-prob-mascot findy-prob-mascot--happy">
                  <img src={probMascotHappy} alt="" draggable={false} />
                </div>
                <div className="findy-prob-mascot findy-prob-mascot--walking">
                  <img src={probMascotWalking} alt="" draggable={false} />
                </div>
                <div className="findy-prob-mascot findy-prob-mascot--wave">
                  <img src={probMascotWave} alt="" draggable={false} />
                </div>
                <img src={probArrow1} alt="" className="findy-prob-arrow findy-prob-arrow--1" aria-hidden draggable={false} />
                <img src={probArrow2} alt="" className="findy-prob-arrow findy-prob-arrow--2" aria-hidden draggable={false} />
                <img src={probArrow3} alt="" className="findy-prob-arrow findy-prob-arrow--3" aria-hidden draggable={false} />
                <p className="findy-prob-label findy-prob-label--1">Clarify and Explain</p>
                <p className="findy-prob-label findy-prob-label--2">Guide Direction</p>
                <p className="findy-prob-label findy-prob-label--3">Enhance Autonomy</p>
              </div>
            </section>

            {/* ── Initial Research ── */}
            <section className="fcs-section" id="research">
              <span className="fcs-section-label" data-reveal="">Research</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">Recognizing the Gap</h2>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="100">
                When it came to support for elderly users, existing integrations were limited. Many
                accessibility features, such as within the native iOS ecosystem, while valuable, strip
                away core pieces of functionality from the interaction.
              </p>

              <div className="fcs-media-card fcs-media-card--padded" data-reveal="" data-reveal-delay="120">
                <p className="fcs-media-card-label">BREAKING DOWN iOS ACCESSIBILITY FEATURES</p>
                <div className="findy-research-photos">
                  <img src={researchPhoto1} alt="" className="findy-research-photo" draggable={false} />
                  <img src={researchPhoto2} alt="" className="findy-research-photo" draggable={false} />
                </div>
              </div>

              <h3 className="fcs-subsection-heading" data-reveal="">Talking with Elderly Users</h3>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="50">
                We knew that if we actually truly wanted to understand this user group, we would need to
                sit down with them and have genuine, lengthy, and nuanced discussions actually breaking
                down their pain points.
              </p>

              <div className="fcs-media-card fcs-media-card--padded" data-reveal="" data-reveal-delay="80">
                <p className="fcs-media-card-label">FOCUS GROUP SESSION WITH THE HUNTINGTON BEACH COUNCIL ON AGING</p>
                <div className="findy-focus-group">
                  <img src={researchCard} alt="" className="findy-focus-group-img" draggable={false} />
                </div>
              </div>

              <p className="fcs-section-body" data-reveal="" data-reveal-delay="50">
                By actually talking to elderly users, it became clear how beautifully unique this core
                group was. Instead of simply making assumptions about how elderly users act, we now
                understood the specific pain points they come across every day.
              </p>

              <h3 className="fcs-subsection-heading" data-reveal="">Shifting the Approach</h3>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="100">
                Three core insights from our research redefined how we approached the design,
                moving away from a one-size-fits-all assistive tool to a personalized, non-intrusive companion.
              </p>

              <div className="findy-insight-grid" data-reveal="pop" data-reveal-delay="80">
                <InsightCard
                  label="INSIGHT #1"
                  heading="There's no general approach to our problem."
                  link="View Solution"
                  mascotSrc={mascotDetective}
                  mascotClass="findy-insight-mascot--detective"
                  mascotAlt=""
                />
                <InsightCard
                  label="INSIGHT #2"
                  heading="The barrier is overwhelm, not ability."
                  link="View Solution"
                  mascotSrc={listeningBubble}
                  mascotClass="findy-insight-mascot--zen"
                  mascotAlt=""
                />
                <InsightCard
                  label="INSIGHT #3"
                  heading="When support takes over, learning stops."
                  link="View Solution"
                  mascotSrc={mascotGuy}
                  mascotClass="findy-insight-mascot--guy"
                  mascotAlt=""
                />
              </div>
            </section>

            {/* ── Design Recommendations ── */}
            <section className="fcs-section" id="design-recs">
              <span className="fcs-section-label" data-reveal="">Design Recommendations</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">Translating Research into a Living Companion</h2>

              <div className="fcs-rec-cards">

                <div className="fcs-rec-cards-numcol">
                  <div className="fcs-num-row"><span className="fcs-numbered-card-num">01</span></div>
                  <div className="fcs-num-row"><span className="fcs-numbered-card-num">02</span></div>
                  <div className="fcs-num-row"><span className="fcs-numbered-card-num">03</span></div>
                </div>

                <div className="fcs-rec-cards-contentcol">

                  <div className="fcs-numbered-card" data-reveal="pop">
                    <div className="fcs-numbered-card-content">
                      <h3 className="fcs-rec-heading fcs-rec-heading--lg">Findy Lives within iOS</h3>
                      <p className="fcs-section-body">
                        Always present on users' screens, Findy is there to provide on-screen support
                        whenever and wherever seniors need.
                      </p>
                      <div className="findy-phone-section">
                        <img src={ellipse} alt="" className="findy-phone-ellipse" aria-hidden />
                        <FindyPhone src={screen1} alt="Findy Lives within iOS" />
                      </div>
                    </div>
                  </div>

                  <div className="fcs-numbered-card" data-reveal="pop" data-reveal-delay="80">
                    <div className="fcs-numbered-card-content">
                      <h3 className="fcs-rec-heading fcs-rec-heading--lg">Spotlighting &amp; Dimming Guides User Focus</h3>
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
                  </div>

                  <div className="fcs-numbered-card" data-reveal="pop" data-reveal-delay="160">
                    <div className="fcs-numbered-card-content">
                      <h3 className="fcs-rec-heading fcs-rec-heading--lg">Synchronization Across Applications</h3>
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
                  </div>

                </div>
              </div>
            </section>

            {/* ── Reflection ── */}
            <section className="fcs-section" id="reflections">
              <span className="fcs-section-label" data-reveal="">REFLECTION</span>
              <h2 className="fcs-section-heading" data-reveal="" data-reveal-delay="50">Testing with Real Elderly Users</h2>
              <p className="fcs-section-body" data-reveal="" data-reveal-delay="100">
                Findy was built for a specific user — and validated by that same user. We ran in-person
                testing sessions with elderly participants at the Huntington Beach Council on Aging,
                observing directly how they interacted with the prototype.
              </p>

              <div className="findy-stats-row" data-reveal="" data-reveal-delay="120">
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

              <div className="findy-photo-grid findy-photo-grid--wide" data-reveal="pop" data-reveal-delay="100">
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
            <section className="rl-upnext">
              <h2 className="rl-upnext-heading" data-reveal="">Up Next</h2>
              <div className="rl-upnext-row">
                <div className="rl-upnext-card" data-cursor="coming-soon" data-reveal="pop" data-reveal-delay="50">
                  <div className="rl-upnext-artwork rl-upnext-artwork--streets">
                    <img src={upnextStreets} alt="Streets" draggable={false} />
                  </div>
                  <div>
                    <p className="rl-upnext-title">Streets</p>
                    <p className="rl-upnext-desc">Design-engineering enterprise B2B software</p>
                  </div>
                </div>
                <Link to="/work/rocket-lawyer" className="rl-upnext-card" data-cursor="case-study" data-reveal="pop" data-reveal-delay="150">
                  <div className="rl-upnext-artwork rl-upnext-artwork--rocket">
                    <img src={rocketArtwork} alt="Rocket Copilot" draggable={false} />
                  </div>
                  <div>
                    <p className="rl-upnext-title">Rocket Copilot</p>
                    <p className="rl-upnext-desc">Redefining AI legal support through data-driven research</p>
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
