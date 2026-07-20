import { useEffect, useRef } from 'react'
import './CustomCursor.css'

const EASE = 0.10  // lower = heavier/more lag

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

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <div ref={ref} className="custom-cursor" aria-hidden />
}
