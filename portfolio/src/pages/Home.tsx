import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

import heroIllustration from '../assets/images/hero-illustration.png'
import streetsGif from '../assets/images/streetsgif.gif'
import rocketArtwork from '../assets/images/rocket-artwork.png'
import findyGif from '../assets/images/FindyGif.gif'
import auraGif from '../assets/images/auragif.gif'
import navStar from '../assets/images/nav-star.svg'
import navPerson from '../assets/images/nav-person.svg'
import navCat from '../assets/images/nav-cat.svg'
import navLinkedin from '../assets/images/nav-linkedin.png'
import navEmail from '../assets/images/nav-email.png'
import navResume from '../assets/images/nav-resume.png'

function CornerDots() {
  return (
    <>
      <div className="hero-corner-dot tl" />
      <div className="hero-corner-dot tr" />
      <div className="hero-corner-dot bl" />
      <div className="hero-corner-dot br" />
    </>
  )
}

interface WorkCardProps {
  artwork: string
  artworkAlt: string
  org: string
  title: string
  role: string
  isGif?: boolean
}

function WorkCard({ artwork, artworkAlt, org, title, role, isGif }: WorkCardProps) {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!isGif) return
    const img = imgRef.current
    if (!img) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && img) {
          const src = img.src
          img.src = ''
          img.src = src
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(img)
    return () => observer.disconnect()
  }, [isGif])

  return (
    <div className="work-card">
      <div className="work-card-artwork">
        <img ref={imgRef} src={artwork} alt={artworkAlt} />
      </div>
      <div className="work-card-content">
        <p className="work-card-org">{org}</p>
        <div className="work-card-title-block">
          <h2 className="work-card-title">{title}</h2>
          <p className="work-card-role">{role}</p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="home">
      {/* Hero / Title section */}
      <section className="hero">
        {/* Top navbar — matches Figma frame 221:30193 at x=78, y=47 */}
        <div className="hero-topnav">
          <div className="hero-topnav-logo">
            <img src={navCat} alt="" className="hero-topnav-cat" />
            <div className="hero-topnav-identity">
              <span className="hero-topnav-name">Armin Mohammadi</span>
              <span className="hero-topnav-role">Product Designer</span>
            </div>
          </div>
          <div className="hero-topnav-contact">
            <a href="https://www.linkedin.com/in/arminmohammadi1" target="_blank" rel="noreferrer" className="hero-topnav-icon-link">
              <img src={navLinkedin} alt="LinkedIn" width={30} height={29} />
            </a>
            <a href="mailto:arminmohammadi1342@gmail.com" className="hero-topnav-icon-link">
              <img src={navEmail} alt="Email" width={29} height={22} />
            </a>
            <a href="#" className="hero-topnav-icon-link" aria-label="Resume">
              <img src={navResume} alt="Resume" width={22} height={27} />
            </a>
          </div>
        </div>

        <img
          className="hero-illustration"
          src={heroIllustration}
          alt=""
        />

        <div className="hero-name-block">
          <h1 className="hero-name">
            <span className="first">armin</span>
            <span className="last">mohammadi</span>
          </h1>
          <div className="hero-tagline-wrap">
            <div className="hero-tagline-box">
              <p>designing connection through collaboration</p>
            </div>
            <CornerDots />
          </div>
        </div>

        <span className="tag hero-tag-designer">product designer</span>
        <span className="tag hero-tag-anteater">anteater</span>

        {/* New pill navbar */}
        <nav className="hero-nav">
          <div className="hero-nav-backdrop" />
          <Link to="/" className="hero-nav-item">
            <img src={navStar} alt="" width={20} height={16} />
            <span>work</span>
          </Link>
          <Link to="/playground" className="hero-nav-item">
            <img src={navPerson} alt="" width={24} height={22} />
            <span>play</span>
          </Link>
          <a href="#about" className="hero-nav-item">
            <img src={navPerson} alt="" width={24} height={22} />
            <span>about</span>
          </a>
        </nav>
      </section>

      {/* Work cards – 2×2 grid */}
      <section className="works">
        <div className="works-grid">
          <WorkCard
            artwork={streetsGif}
            artworkAlt="Streets Enterprise UI"
            org="Streets by Plyance"
            title="Streets Enterprise UI"
            role="Founding Product Designer"
            isGif
          />
          <WorkCard
            artwork={rocketArtwork}
            artworkAlt="Rocket Copilot AI"
            org="Rocket Lawyer"
            title="Rocket Copilot AI"
            role="Founding Product Designer"
          />
          <WorkCard
            artwork={findyGif}
            artworkAlt="Findy"
            org="Design @ UCI"
            title="Findy"
            role="Product Designer"
            isGif
          />
          <WorkCard
            artwork={auraGif}
            artworkAlt="Aura"
            org="Product Association @ UCI"
            title="Aura"
            role="Product Designer"
            isGif
          />
        </div>
      </section>
    </div>
  )
}
