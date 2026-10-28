import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import SidebarPage from '../components/SidebarPage'
import LoopVideo, { type LoopVideoSource } from '../components/LoopVideo'
import PixelRevealMedia from '../components/PixelRevealMedia'
import { registerPageImages } from '../lib/pageAssets'

// Streets, Memento and Rocket play as video (their GIFs stay in the repo, unused): 5-26x smaller, no dithering
import streetsMp4     from '../assets/images/streets-work.mp4'
import streetsWebm    from '../assets/images/streets-work.webm'
import streetsPoster  from '../assets/images/streets-work-poster.jpg'
// Pixel-art cut of the Streets clip (same length and frame rate), shown until the card is hovered
import streetsPixelMp4    from '../assets/images/streets-work-pixel.mp4'
import streetsPixelWebm   from '../assets/images/streets-work-pixel.webm'
import streetsPixelPoster from '../assets/images/streets-work-pixel-poster.jpg'
import mementoMp4     from '../assets/images/memento-work.mp4'
import mementoWebm    from '../assets/images/memento-work.webm'
import mementoPoster  from '../assets/images/memento-work-poster.jpg'
// Pixel-art cut of the Memento clip (same length and frame rate), shown until the card is hovered
import mementoPixelMp4    from '../assets/images/memento-work-pixel-v3.mp4'
import mementoPixelWebm   from '../assets/images/memento-work-pixel.webm'
import mementoPixelPoster from '../assets/images/memento-work-pixel-poster.jpg'
import rocketMp4      from '../assets/images/rocket-work-sparkle.mp4'
import rocketWebm     from '../assets/images/rocket-work-sparkle.webm'
import rocketPoster   from '../assets/images/rocket-work-sparkle-poster.jpg'
// Pixel-art cut of the Rocket clip (same length and frame rate), shown until the card is hovered
import rocketPixelMp4    from '../assets/images/rocket-work-sparkle-pixel.mp4'
import rocketPixelWebm   from '../assets/images/rocket-work-sparkle-pixel.webm'
import rocketPixelPoster from '../assets/images/rocket-work-sparkle-pixel-poster.jpg'
// Findy's phone clips have the card's #fafdff fill baked in (the card is a fixed colour, so no transparency is needed)
import findyMp4          from '../assets/images/findy-work-phone.mp4'
import findyWebm         from '../assets/images/findy-work-phone.webm'
import findyPoster       from '../assets/images/findy-work-phone-poster.jpg'
import findyPixelMp4     from '../assets/images/findy-work-phone-pixel.mp4'
import findyPixelWebm    from '../assets/images/findy-work-phone-pixel.webm'
import findyPixelPoster  from '../assets/images/findy-work-phone-pixel-poster.jpg'

const STREETS_VIDEO: LoopVideoSource = { webm: streetsWebm, mp4: streetsMp4, poster: streetsPoster }
const STREETS_PIXEL_VIDEO: LoopVideoSource = { webm: streetsPixelWebm, mp4: streetsPixelMp4, poster: streetsPixelPoster }
const MEMENTO_VIDEO: LoopVideoSource = { webm: mementoWebm, mp4: mementoMp4, poster: mementoPoster }
const MEMENTO_PIXEL_VIDEO: LoopVideoSource = { webm: mementoPixelWebm, mp4: mementoPixelMp4, poster: mementoPixelPoster }
const ROCKET_VIDEO: LoopVideoSource = { webm: rocketWebm, mp4: rocketMp4, poster: rocketPoster }
const ROCKET_PIXEL_VIDEO: LoopVideoSource = { webm: rocketPixelWebm, mp4: rocketPixelMp4, poster: rocketPixelPoster }
const FINDY_VIDEO: LoopVideoSource = { webm: findyWebm, mp4: findyMp4, poster: findyPoster }
const FINDY_PIXEL_VIDEO: LoopVideoSource = { webm: findyPixelWebm, mp4: findyPixelMp4, poster: findyPixelPoster }

registerPageImages('/', [streetsPixelPoster, rocketPixelPoster, mementoPixelPoster, findyPixelPoster, streetsPoster, mementoPoster, rocketPoster, findyPoster])

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
