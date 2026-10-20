import { useCallback, useLayoutEffect, useState } from 'react'
import './Home.css'
import '../archive/HeroCollage.css'
import '../archive/AboutSection.css'
import './HomeAlt.css'
import CsTopbar from '../components/CsTopbar'
import { WorkCard } from './Home'
import { HeroGraphic } from '../archive/HeroCollage'
import { runHeroEntrance } from '../lib/heroEntrance'

import heroMac     from '../assets/images/hero-mac.png'
import heroMeGreen from '../assets/images/hero-me-green.png'
import heroWii     from '../assets/images/hero-wii.png'
import heroIpod    from '../assets/images/hero-ipod.png'
import heroBird1   from '../assets/images/hero-bird1.png'
import heroBird2   from '../assets/images/hero-bird2.png'
import heroBird3   from '../assets/images/hero-bird3.png'
import heroYosemite    from '../assets/images/hero-yosemite.png'
import heroIconFigma   from '../assets/images/hero-icon-figma.png'
import heroIconReact   from '../assets/images/hero-icon-react.png'
import heroIconClaude  from '../assets/images/hero-icon-claude.png'
import heroMusicNote   from '../assets/images/hero-music-note.png'
import heroKoiBorder   from '../assets/images/hero-koi-border.png'
import heroKoiGif      from '../assets/images/koi.gif'
import heroBoy         from '../assets/images/hero-boy.png'
import heroStarLg      from '../assets/images/hero-star-lg.png'
import heroStarMd      from '../assets/images/hero-star-md.png'
import heroStarSm      from '../assets/images/hero-star-sm.png'

import rocketArtwork  from '../assets/images/rocket-work-artwork.gif'
import findyGif       from '../assets/images/findy-work-artwork.gif'
import workStreetsGif from '../assets/images/streetsgif.gif'
import mementoGif     from '../assets/images/memento-work-artwork.gif'

import navWork  from '../assets/images/alt-nav-work.svg'
import navAbout from '../assets/images/alt-nav-about.svg'
import navFun   from '../assets/images/alt-nav-fun.svg'

import ab2PhotoHorse from '../assets/images/ab2-photo-horse.jpg'
import ab2PhotoClimb from '../assets/images/ab2-photo-climb.jpg'
import ab2PhotoTeam  from '../assets/images/ab2-photo-team.jpg'

type Tab = 'work' | 'about' | 'fun'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'work',  label: 'work',  icon: navWork },
  { id: 'about', label: 'about', icon: navAbout },
  { id: 'fun',   label: 'fun',   icon: navFun },
]

export default function HomeAlt() {
  const [tab, setTab] = useState<Tab>('work')
  const [selectedGraphic, setSelectedGraphic] = useState<string | null>(null)
  const [popupOpen, setPopupOpen] = useState(false)

  const handleSelect = useCallback((id: string) => {
    setSelectedGraphic(prev => {
      setPopupOpen(false)
      return prev === id ? null : id
    })
  }, [])
  const handleDeselect = useCallback(() => { setSelectedGraphic(null); setPopupOpen(false) }, [])
  const handleTag = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setPopupOpen(p => !p) }, [])
  const stopProp = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])

  // Hero entrance — same one-shot motion as the full landing, scaled down by CSS
  useLayoutEffect(() => {
    const ctx = runHeroEntrance()
    return () => ctx.revert()
  }, [])

  return (
    <>
      <CsTopbar showAtTop onNameClick={handleDeselect} />
      <div className="home-alt" onClick={handleDeselect}>

        {/* ── Hero (shrunk) ─────────────────────────────────────────────── */}
        <section className="alt-hero">
          <div className="hero-canvas">
            <div className="hero-content">

              <div className="hero-left-side">
                <img src={heroStarLg} alt="" className="hero-star-lg" aria-hidden />
                <img src={heroStarMd} alt="" className="hero-star-md" aria-hidden />
                <img src={heroStarSm} alt="" className="hero-star-sm" aria-hidden />

                <HeroGraphic id="bird3" src={heroBird3} cls="hero-bird3"
                  selected={selectedGraphic} popupOpen={popupOpen}
                  onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                <img src={heroBird2} alt="" className="hero-bird2" aria-hidden />

                <HeroGraphic id="bird1" src={heroBird1} cls="hero-bird1"
                  selected={selectedGraphic} popupOpen={popupOpen}
                  onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                <HeroGraphic id="me-green" src={heroMeGreen} cls="hero-me-green"
                  selected={selectedGraphic} popupOpen={popupOpen}
                  onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                <HeroGraphic id="mac" src={heroMac} cls="hero-mac" mode="infer"
                  selected={selectedGraphic} popupOpen={popupOpen}
                  onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                <HeroGraphic id="wii" src={heroWii} cls="hero-wii" mode="infer"
                  selected={selectedGraphic} popupOpen={popupOpen}
                  onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />
              </div>

              <div className="hero-name-block">
                <h1 className="hero-name">
                  <span className="first">Hi, I'm</span>
                  <span className="last">Armin</span>
                </h1>
              </div>

              <div className="hero-right-side">
                <img src={heroMusicNote} alt="" className="hero-music-note hero-music-note--1" aria-hidden />
                <img src={heroMusicNote} alt="" className="hero-music-note hero-music-note--2" aria-hidden />

                <HeroGraphic id="yosemite" src={heroYosemite} cls="hero-yosemite" mode="infer"
                  selected={selectedGraphic} popupOpen={popupOpen}
                  onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                <HeroGraphic id="boy" src={heroBoy} cls="hero-boy" mode="infer"
                  selected={selectedGraphic} popupOpen={popupOpen}
                  onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                <HeroGraphic id="ipod" src={heroIpod} cls="hero-ipod" mode="infer"
                  selected={selectedGraphic} popupOpen={popupOpen}
                  onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />

                <div className="hero-koi-entrance">
                  <HeroGraphic id="koi" outlineSrc={heroKoiBorder} mode="alpha"
                    selected={selectedGraphic} popupOpen={popupOpen}
                    onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp}>
                    <div className="hero-koi-wrap">
                      <img src={heroKoiBorder} alt="" className="hero-koi-paper" aria-hidden draggable={false} />
                      <img src={heroKoiGif} alt="" className="hero-koi-gif" aria-hidden draggable={false} />
                    </div>
                  </HeroGraphic>
                </div>

                <HeroGraphic id="icon-figma" src={heroIconFigma} cls="hero-icon" mode="infer"
                  selected={selectedGraphic} popupOpen={popupOpen}
                  onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />
                <HeroGraphic id="icon-react" src={heroIconReact} cls="hero-icon" mode="infer"
                  selected={selectedGraphic} popupOpen={popupOpen}
                  onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />
                <HeroGraphic id="icon-claude" src={heroIconClaude} cls="hero-icon" mode="infer"
                  selected={selectedGraphic} popupOpen={popupOpen}
                  onSelect={handleSelect} onTag={handleTag} onPopupStop={stopProp} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Section switcher ──────────────────────────────────────────── */}
        <nav className="alt-nav" onClick={e => e.stopPropagation()}>
          <div className="alt-nav-pill">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`alt-nav-tab${tab === t.id ? ' alt-nav-tab--active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <img src={t.icon} alt="" className="alt-nav-icon" width={20} height={20} aria-hidden />
                <span className="alt-nav-label">{t.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* ── Swappable body ────────────────────────────────────────────── */}
        <main className="alt-body">
          {tab === 'work' && (
            <div className="alt-works-grid">
              <WorkCard artwork={workStreetsGif} artworkAlt="Streets" title="Streets"
                description="Design-engineering enterprise B2B software"
                isGif to="/work/streets" objectPosition="center" />
              <WorkCard artwork={findyGif} artworkAlt="Findy" title="Findy"
                description="A case-competition winning solution built for elders, tested by elders"
                isGif to="/work/findy" objectPosition="center" />
              <WorkCard artwork={rocketArtwork} artworkAlt="Rocket Lawyer" title="Rocket Lawyer"
                description="Redefining AI software through data-driven research"
                isGif to="/work/rocket-lawyer" objectPosition="center" />
              <WorkCard artwork={mementoGif} artworkAlt="Memento" title="Memento"
                description="Connecting memories through emerging interfaces"
                isGif objectPosition="center" href="https://devpost.com/software/memento-3p1kjl" />
            </div>
          )}

          {tab === 'about' && (
            <div className="alt-about">
              <div className="ab2-content">
                <div className="ab2-text">
                  <p className="ab2-heading">About Me</p>
                  <div className="ab2-body">
                    <p className="ab2-bio">
                      From the stories 6-year old me used to doodle in my journal to the case study stories I inspire my audience to connect with, I've always been a story teller. This imaginative and creative side has always been innate, and it is this natural passion that made me fall in love with product design.
                    </p>
                    <p className="ab2-bio">
                      I want my stories to not just reflect my craft but to also reflect the journeys, culture, and individuality that continues to excite me to connect with others every single day.
                    </p>
                  </div>
                  <div className="ab2-stat-cards">
                    <div className="ab2-stat">
                      <p className="ab2-stat-label">currently...</p>
                      <p className="ab2-stat-value">Business Administration &amp; Computer Science @ University of California, Irvine</p>
                    </div>
                    <div className="ab2-stat">
                      <p className="ab2-stat-label">exploring...</p>
                      <p className="ab2-stat-value">Design Engineering, 3D Modeling, and Brand Design</p>
                    </div>
                  </div>
                </div>

                <div className="ab2-graphics">
                  <div className="ab2-images">
                    <div className="ab2-polaroid ab2-polaroid--horse">
                      <div className="ab2-polaroid-card">
                        <div className="ab2-polaroid-frame">
                          <div className="ab2-photo-crop">
                            <img src={ab2PhotoHorse} alt="" aria-hidden draggable={false} className="ab2-photo-horse" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ab2-polaroid ab2-polaroid--climb">
                      <div className="ab2-polaroid-card">
                        <div className="ab2-polaroid-frame">
                          <img src={ab2PhotoClimb} alt="" aria-hidden draggable={false} className="ab2-photo-fill" />
                        </div>
                      </div>
                    </div>
                    <div className="ab2-polaroid ab2-polaroid--team">
                      <div className="ab2-polaroid-card">
                        <div className="ab2-polaroid-frame">
                          <div className="ab2-photo-crop">
                            <img src={ab2PhotoTeam} alt="" aria-hidden draggable={false} className="ab2-photo-team" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'fun' && (
            <div className="alt-fun">
              <p className="alt-fun-text">fun — coming soon</p>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
