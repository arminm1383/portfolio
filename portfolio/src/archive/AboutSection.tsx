// Archived landing About section (polaroid card throw + bio/stat cards), as it
// shipped on the landing page before the Portfolio-v4 redesign.
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './AboutSection.css'

import ab2PhotoHorse from '../assets/images/ab2-photo-horse.jpg'
import ab2PhotoClimb from '../assets/images/ab2-photo-climb.jpg'
import ab2PhotoTeam  from '../assets/images/ab2-photo-team.jpg'

export default function AboutSection() {
  const aboutScaleRef = useRef<HTMLDivElement>(null)

  // Card throw animation on mount
  useEffect(() => {
    // Suppress CSS transitions so GSAP can snap to the from state without triggering them
    const cardEls = Array.from(document.querySelectorAll<HTMLElement>('.ab2-polaroid-card'))
    cardEls.forEach(el => { el.style.transition = 'none' })

    // Cards thrown onto the table — each one flies in from above and lands with a bounce
    gsap.fromTo(
      [
        '.ab2-polaroid--horse .ab2-polaroid-card',
        '.ab2-polaroid--team .ab2-polaroid-card',
        '.ab2-polaroid--climb .ab2-polaroid-card',
      ],
      { y: -380, scale: 0.82, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.62,
        ease: 'back.out(1.75)',
        stagger: 0.13,
        clearProps: 'transform,opacity',
        onComplete: () => {
          requestAnimationFrame(() => cardEls.forEach(el => { el.style.transition = '' }))
        },
      }
    )

    // Text fades up after cards land
    gsap.fromTo(
      '.ab2-text > *',
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.42, stagger: 0.09, ease: 'power2.out', delay: 0.28, clearProps: 'opacity,transform' }
    )
  }, [])

  // About section — scale to fit viewport, leaving room for the fixed topbar
  useEffect(() => {
    const update = () => {
      const el = aboutScaleRef.current
      if (!el) return
      // 64px = topbar (top:12 + height:44) + 8px gap
      const navH = 64
      const scale = Math.min(1, (window.innerWidth - 176) / 1472, (window.innerHeight - navH) / 887)
      el.style.zoom = String(scale)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <section className="about-section">
      <div className="ab2-nav-spacer" />
      <div className="ab2-scale-wrap" ref={aboutScaleRef}>
      <div className="ab2-main">
        <div className="ab2-content">

          {/* ── Text — left column, flex:1 ── */}
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

          {/* ── Graphics — right column, fixed 655×615 ── */}
          <div className="ab2-graphics">
            <div className="ab2-images">

              {/* Card 1 — horse (top-left, −8°) */}
              <div className="ab2-polaroid ab2-polaroid--horse">
                <div className="ab2-polaroid-card">
                  <div className="ab2-polaroid-frame">
                    <div className="ab2-photo-crop">
                      <img src={ab2PhotoHorse} alt="" aria-hidden draggable={false} className="ab2-photo-horse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 — climb (bottom-left, −14°) */}
              <div className="ab2-polaroid ab2-polaroid--climb">
                <div className="ab2-polaroid-card">
                  <div className="ab2-polaroid-frame">
                    <img src={ab2PhotoClimb} alt="" aria-hidden draggable={false} className="ab2-photo-fill" />
                  </div>
                </div>
              </div>

              {/* Card 3 — team (right, +10°) */}
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

      </div> {/* ab2-scale-wrap */}
    </section>
  )
}
