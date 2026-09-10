import { useEffect, useRef } from 'react'
import './CustomCursor.css'
import cursorCsIcon from '../assets/images/cursor-cs-icon.svg'
import cursorSoonIcon from '../assets/images/cursor-soon-icon.svg'
import cursorDevpostIcon from '../assets/images/cursor-devpost-icon.svg'

const EASE = 0.18

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let mouseX = 0, mouseY = 0
    let x = 0, y = 0
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const tick = () => {
      x += (mouseX - x) * EASE
      y += (mouseY - y) * EASE
      el.style.transform = `translate(${x}px, ${y}px)`
      rafId = requestAnimationFrame(tick)
    }

    const onOver = (e: MouseEvent) => {
      const card = (e.target as Element)?.closest('[data-cursor]')
      const variant = card?.getAttribute('data-cursor') ?? 'default'
      if (el.dataset.variant !== variant) el.dataset.variant = variant
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={ref} className="custom-cursor" data-variant="default" aria-hidden>
      <div className="cursor-pill">
        <div className="cursor-layer cursor-layer--cs">
          <img src={cursorCsIcon} className="cursor-icon" alt="" />
          <span className="cursor-label">view case study</span>
        </div>
        <div className="cursor-layer cursor-layer--soon">
          <img src={cursorSoonIcon} className="cursor-icon" alt="" />
          <span className="cursor-label">coming soon</span>
        </div>
        <div className="cursor-layer cursor-layer--devpost">
          <img src={cursorDevpostIcon} className="cursor-icon" alt="" />
          <span className="cursor-label">view devpost</span>
        </div>
      </div>
    </div>
  )
}
