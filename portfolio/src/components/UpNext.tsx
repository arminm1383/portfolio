import { useState } from 'react'
import { Link } from 'react-router-dom'
import PixelRevealMedia from './PixelRevealMedia'
import {
  STREETS_VIDEO, STREETS_PIXEL_VIDEO, ROCKET_VIDEO, ROCKET_PIXEL_VIDEO, FINDY_VIDEO, FINDY_PIXEL_VIDEO,
} from '../lib/workMedia'

// The case studies the "Up Next" section can link to. Artwork and subtext match the landing's work cards, so a card
// shows the same pixel clip that depixelizes into the real one on hover.
const WORKS = {
  streets: {
    to: '/work/streets', title: 'Streets', desc: 'design engineering enterprise B2B software',
    pixel: STREETS_PIXEL_VIDEO, actual: STREETS_VIDEO,
  },
  findy: {
    to: '/work/findy', title: 'Findy', desc: 'case-competition winning story built for elders, tested by elders',
    pixel: FINDY_PIXEL_VIDEO, actual: FINDY_VIDEO, framed: true,
  },
  rocket: {
    to: '/work/rocket-lawyer', title: 'Rocket Copilot', desc: 'redefining legal tech software through data-driven research',
    pixel: ROCKET_PIXEL_VIDEO, actual: ROCKET_VIDEO,
  },
} as const

export type UpNextWork = keyof typeof WORKS

function UpNextCard({ work }: { work: UpNextWork }) {
  const w = WORKS[work]
  const [hovered, setHovered] = useState(false)
  const media = <PixelRevealMedia pixel={w.pixel} actual={w.actual} revealed={hovered} label={w.title} />

  return (
    <Link
      to={w.to}
      className={`rl-upnext-card rl-upnext-card--${work}`}
      data-cursor="case-study"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div className="rl-upnext-artwork">
        {'framed' in w ? <div className="rl-upnext-media">{media}</div> : media}
      </div>
      <div>
        <p className="rl-upnext-title">{w.title}</p>
        <p className="rl-upnext-desc">{w.desc}</p>
      </div>
    </Link>
  )
}

export default function UpNext({ works }: { works: [UpNextWork, UpNextWork] }) {
  return (
    <section className="rl-upnext">
      <h2 className="rl-upnext-heading">Up Next</h2>
      <div className="rl-upnext-row">
        {works.map(w => <UpNextCard key={w} work={w} />)}
      </div>
    </section>
  )
}
