import { useLayoutEffect } from 'react'
import './PixelPage.css'
import TopNavbar from './TopNavbar'
import Navbar from './Navbar'
import SiteFooter from './SiteFooter'
import { runPageEntrance } from '../lib/pageTransition'
import sprites from '../assets/images/landing-sprites.gif'

interface PixelPageProps {
  before: string            // title word left of the sprite gif
  after: string             // title word right of the sprite gif
  intro?: React.ReactNode   // header content under the title (tagline, bio…)
  children: React.ReactNode // page body (works, photos…)
}

// Shared shell for the pixel-title pages (Landing, About…). The title row — and so the sprite gif —
// sits at the exact same spot on every page, which is what lets the gif stay put during page transitions.
export default function PixelPage({ before, after, intro, children }: PixelPageProps) {
  useLayoutEffect(() => runPageEntrance(), [])

  return (
    <>
      <TopNavbar />
      <Navbar />

      <div className="pixel-page">
        <main className="pixel-page-main">
          <header className="pixel-page-header">
            <h1 className="pixel-title">
              <span>{before}</span>
              <img src={sprites} alt="" className="pixel-sprites" aria-hidden draggable={false} />
              <span>{after}</span>
            </h1>
            {intro && <div className="pixel-page-intro">{intro}</div>}
          </header>
          <div className="pixel-page-body">{children}</div>
        </main>

        <SiteFooter />
      </div>
    </>
  )
}
