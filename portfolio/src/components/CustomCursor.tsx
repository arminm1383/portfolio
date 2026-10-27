import { useEffect, useRef } from 'react'
import './CustomCursor.css'
import cursorCsIcon from '../assets/images/cursor-cs-icon.svg'
import cursorSoonIcon from '../assets/images/cursor-soon-icon.svg'
import cursorDevpostIcon from '../assets/images/cursor-devpost-icon.svg'

const EASE = 0.55
// Same query as the CSS: only devices with a precise, hovering pointer get the custom cursor
const FINE_POINTER = '(hover: hover) and (pointer: fine)'

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const query = window.matchMedia(FINE_POINTER)
    if (!el) return

    let mouseX = 0, mouseY = 0
    let x = 0, y = 0
    let rafId: number | undefined
    let shown = false

    // Eases toward the mouse, then sleeps once it has caught up (no per-frame work while the mouse is still)
    const tick = () => {
      x += (mouseX - x) * EASE
      y += (mouseY - y) * EASE
      if (Math.abs(mouseX - x) < 0.1 && Math.abs(mouseY - y) < 0.1) {
        x = mouseX
        y = mouseY
        rafId = undefined
      } else {
        rafId = requestAnimationFrame(tick)
      }
      el.style.transform = `translate(${x}px, ${y}px)`
    }

    // Shown (and the native cursor hidden) only from the first real mouse movement, starting where the
    // mouse is, so it never flashes at (0,0)
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (shown) {
        if (rafId === undefined) rafId = requestAnimationFrame(tick)
        return
      }
      shown = true
      x = mouseX
      y = mouseY
      el.classList.add('custom-cursor--active')
      document.documentElement.classList.add('has-custom-cursor')
      rafId = requestAnimationFrame(tick)
    }

    const onOver = (e: MouseEvent) => {
      const card = (e.target as Element)?.closest('[data-cursor]')
      const variant = card?.getAttribute('data-cursor') ?? 'default'
      if (el.dataset.variant !== variant) el.dataset.variant = variant
    }

    const start = () => {
      window.addEventListener('mousemove', onMove, { passive: true })
      document.addEventListener('mouseover', onOver, { passive: true })
    }

    const stop = () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      if (rafId !== undefined) cancelAnimationFrame(rafId)
      rafId = undefined
      shown = false
      el.classList.remove('custom-cursor--active')
      document.documentElement.classList.remove('has-custom-cursor')
    }

    // Follow the device: e.g. a tablet that gains or loses a trackpad
    const onChange = () => (query.matches ? start() : stop())
    if (query.matches) start()
    query.addEventListener('change', onChange)

    return () => {
      query.removeEventListener('change', onChange)
      stop()
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
