import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import PixelPage from '../components/PixelPage'
import { registerPageImages } from '../lib/pageAssets'

import workStreetsGif from '../assets/images/streetsgif.gif'
import mementoGif     from '../assets/images/memento-work-artwork.gif'
import rocketArtwork  from '../assets/images/rocket-copilot-sparkle.gif'
import findyPhoneGif  from '../assets/images/findy-work-phone.gif'

registerPageImages('/', [workStreetsGif, mementoGif, rocketArtwork, findyPhoneGif])

interface WorkCardProps {
  artwork?: string
  artworkAlt?: string
  title: string
  status?: string
  year?: string
  description: string
  isGif?: boolean
  to?: string
  href?: string
  objectPosition?: string
  className?: string
  framed?: boolean // artwork sits in a centred inner frame instead of filling the card
  glow?: boolean   // soft radial glow behind the artwork
}

export function WorkCard({ artwork, artworkAlt, title, status, year, description, isGif, to, href, objectPosition, className, framed, glow }: WorkCardProps) {
  const imgRef = useRef<HTMLImageElement>(null)

  // Restart the gif from frame 0 each time the card scrolls into view
  useEffect(() => {
    if (!isGif) return
    const img = imgRef.current
    if (!img) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only once fully loaded — resetting src mid-download would restart it (and the page waits on it)
        if (entry.isIntersecting && img && img.complete) {
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

  const cursorVariant = to ? 'case-study' : href ? 'devpost' : 'coming-soon'
  const cls = `work-card${className ? ` ${className}` : ''}`

  const image = artwork && (
    <img
      ref={imgRef}
      src={artwork}
      alt={artworkAlt ?? ''}
      decoding="async"
      style={objectPosition ? { objectPosition } : undefined}
    />
  )

  const content = (
    <>
      <div className="work-card-artwork">
        {glow && <div className="work-card-glow" aria-hidden />}
        {framed ? <div className="work-card-media">{image}</div> : image}
        <div className="work-card-artwork-inset" aria-hidden />
      </div>
      <div className="work-card-content">
        <div className="work-card-meta">
          <h2 className="work-card-title">
            <strong>{title}</strong>
            {status && <span className="work-card-status"> / {status}</span>}
          </h2>
          {year && <span className="work-card-year">{year}</span>}
        </div>
        <p className="work-card-description">{description}</p>
      </div>
    </>
  )

  if (to) {
    return <Link to={to} className={cls} data-cursor={cursorVariant}>{content}</Link>
  }

  if (href) {
    return <a href={href} target="_blank" rel="noreferrer" className={cls} data-cursor={cursorVariant}>{content}</a>
  }

  return <div className={cls} data-cursor={cursorVariant}>{content}</div>
}

export default function Home() {
  return (
    <PixelPage
      before="hi,"
      after="i’m armin"
      intro={
        <p className="landing-tagline">
          i’m a builder designing with taste, engineering with intuition, and putting it all together with a commitment to visual craft
        </p>
      }
    >
      <section className="landing-works">
        <div className="landing-works-col">
          <WorkCard
            className="work-card--streets"
            artwork={workStreetsGif}
            artworkAlt="Streets"
            title="Streets"
            status="Shipping"
            year="2026"
            description="design engineering enterprise B2B software"
            isGif
          />
          <WorkCard
            className="work-card--memento"
            artwork={mementoGif}
            artworkAlt="Memento"
            title="Memento"
            status="Concept"
            year="2026"
            description="connecting memories through emerging interfaces"
            isGif
            href="https://devpost.com/software/memento-3p1kjl"
          />
        </div>
        <div className="landing-works-col landing-works-col--right">
          <WorkCard
            className="work-card--rocket"
            artwork={rocketArtwork}
            artworkAlt="Rocket Copilot"
            title="Rocket Copilot"
            status="Shipped"
            year="2026"
            description="redefining legal tech software through data-driven research"
            isGif
            to="/work/rocket-lawyer"
          />
          <WorkCard
            className="work-card--findy"
            artwork={findyPhoneGif}
            artworkAlt="Findy"
            isGif
            framed
            glow
            title="Findy"
            status="Concept"
            year="2026"
            description="case-competition winning story built for elders, tested by elders"
            to="/work/findy"
          />
        </div>
      </section>
    </PixelPage>
  )
}
