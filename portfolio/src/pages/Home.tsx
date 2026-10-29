import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import SidebarPage from '../components/SidebarPage'
import LoopVideo, { type LoopVideoSource } from '../components/LoopVideo'
import PixelRevealMedia from '../components/PixelRevealMedia'
import { registerPageImages } from '../lib/pageAssets'

import {
  STREETS_VIDEO, STREETS_PIXEL_VIDEO, MEMENTO_VIDEO, MEMENTO_PIXEL_VIDEO,
  ROCKET_VIDEO, ROCKET_PIXEL_VIDEO, FINDY_VIDEO, FINDY_PIXEL_VIDEO, ALL_WORK_POSTERS,
} from '../lib/workMedia'

registerPageImages('/', ALL_WORK_POSTERS)

interface WorkCardProps {
  artwork?: string
  video?: LoopVideoSource // looping clip instead of `artwork`
  pixelVideo?: LoopVideoSource // pixel-art cut of `video`: shown by default, depixelizes into `video` on hover
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
  framed?: boolean // artwork sits in an inner frame instead of filling the card
}

export function WorkCard({ artwork, video, pixelVideo, artworkAlt, title, status, year, description, isGif, to, href, objectPosition, className, framed }: WorkCardProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const artworkRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  // Restart the animation from its first frame each time the card scrolls into view; clips pause while it's off
  // screen so they don't keep decoding. A pixel/actual pair manages its own two clips (PixelRevealMedia).
  useEffect(() => {
    const el = video ? artworkRef.current : isGif ? imgRef.current : null
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!(el instanceof HTMLImageElement)) {
          el.querySelectorAll<HTMLVideoElement>('video:not(.pixel-reveal-video)').forEach(v => {
            if (!entry.isIntersecting) return v.pause()
            v.currentTime = 0
            v.play().catch(() => {})
          })
        } else if (entry.isIntersecting && el.complete) {
          // Only once fully loaded: resetting src mid-download would restart it (and the page waits on it)
          const src = el.src
          el.src = ''
          el.src = src
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isGif, video])

  const cursorVariant = to ? 'case-study' : href ? 'devpost' : 'coming-soon'
  const cls = `work-card${className ? ` ${className}` : ''}`

  const image = video && pixelVideo ? (
    <PixelRevealMedia pixel={pixelVideo} actual={video} revealed={hovered} label={artworkAlt} />
  ) : video ? (
    <LoopVideo src={video} label={artworkAlt} style={objectPosition ? { objectPosition } : undefined} />
  ) : artwork && (
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
      <div ref={artworkRef} className="work-card-artwork">
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

  // Hovering anywhere on the card (artwork or caption) reveals a pixel/actual pair
  const hover = {
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
  }

  if (to) {
    return <Link to={to} className={cls} data-cursor={cursorVariant} {...hover}>{content}</Link>
  }

  if (href) {
    return <a href={href} target="_blank" rel="noreferrer" className={cls} data-cursor={cursorVariant} {...hover}>{content}</a>
  }

  return <div className={cls} data-cursor={cursorVariant} {...hover}>{content}</div>
}

export default function Home() {
  return (
    <SidebarPage
      title="armin mohammadi"
      bio={
        <>
          <p className="sidebar-tagline">
            i’m a builder designing with taste, engineering with intuition, and putting it all together with a commitment to visual craft
          </p>
          <p className="sidebar-role">
            <span className="sidebar-role-label">current</span>
            <span>cs + business @ uci</span>
          </p>
          <p className="sidebar-role">
            <span className="sidebar-role-label">prev</span>
            <span>ux research @ rocket lawyer</span>
          </p>
        </>
      }
    >
      <section className="landing-works">
        <div className="landing-works-col">
          <WorkCard
            className="work-card--streets"
            video={STREETS_VIDEO}
            pixelVideo={STREETS_PIXEL_VIDEO}
            artworkAlt="Streets"
            title="Streets"
            status="Shipping"
            year="2026"
            description="design engineering enterprise B2B software"
            to="/work/streets"
          />
          <WorkCard
            className="work-card--findy"
            video={FINDY_VIDEO}
            pixelVideo={FINDY_PIXEL_VIDEO}
            artworkAlt="Findy"
            framed
            title="Findy"
            status="Concept"
            year="2026"
            description="case-competition winning story built for elders, tested by elders"
            to="/work/findy"
          />
        </div>
        <div className="landing-works-col landing-works-col--right">
          <WorkCard
            className="work-card--rocket"
            video={ROCKET_VIDEO}
            pixelVideo={ROCKET_PIXEL_VIDEO}
            artworkAlt="Rocket Copilot"
            title="Rocket Copilot"
            status="Shipped"
            year="2026"
            description="redefining legal tech software through data-driven research"
            to="/work/rocket-lawyer"
          />
          <WorkCard
            className="work-card--memento"
            video={MEMENTO_VIDEO}
            pixelVideo={MEMENTO_PIXEL_VIDEO}
            artworkAlt="Memento"
            title="Memento"
            status="Concept"
            year="2026"
            description="connecting memories through emerging interfaces"
            href="https://devpost.com/software/memento-3p1kjl"
          />
        </div>
      </section>
    </SidebarPage>
  )
}
