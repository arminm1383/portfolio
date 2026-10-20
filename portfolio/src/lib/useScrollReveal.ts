import { useEffect, useRef, useState } from 'react'

// Scroll-reveal for fixed top bars: hidden while scrolling down, revealed on
// scroll-up once past 120px. With showAtTop it is also shown near the top (≤80px).
export function useScrollReveal(showAtTop: boolean): boolean {
  const [visible, setVisible] = useState(showAtTop)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY

    function onScroll() {
      const y = window.scrollY
      const scrollingUp = y < lastY.current
      setVisible(showAtTop ? (y <= 80 || (y > 120 && scrollingUp)) : (y > 120 && scrollingUp))
      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [showAtTop])

  return visible
}
