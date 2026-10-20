import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

// Everything on a PixelPage except the sprite gif — it fades out on exit and back in on entry,
// while the gif (anchored at the same spot on every PixelPage) stays put across the route change.
export const PAGE_CONTENT = ['.pixel-title > span', '.pixel-page-intro', '.pixel-page-body', '.navbar', '.site-footer']

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Entrance — the gif is visible from the first frame; after a short solo moment the rest arrives
export function runPageEntrance(): gsap.Context | null {
  if (prefersReducedMotion()) return null

  // The top navbar owns a CSS transform transition (scroll reveal) that would fight GSAP mid-tween
  const topbar = document.querySelector<HTMLElement>('.top-navbar')
  if (topbar) topbar.style.transition = 'none'
  const restore = () => requestAnimationFrame(() => { if (topbar) topbar.style.transition = '' })

  return gsap.context(() => {
    const REVEAL = 0.3 // the sprite gif's solo moment
    const EASE = 'power2.out'
    const tl = gsap.timeline({ onComplete: restore })

    gsap.set(PAGE_CONTENT, { opacity: 0 })
    gsap.set('.top-navbar', { y: -80 })

    // Title words slide outward from the sprite
    tl.fromTo('.pixel-title > span:first-child', { x: 8 },
      { opacity: 1, x: 0, duration: 0.45, ease: EASE, clearProps: 'opacity,transform' }, REVEAL)
    tl.fromTo('.pixel-title > span:last-child', { x: -8 },
      { opacity: 1, x: 0, duration: 0.45, ease: EASE, clearProps: 'opacity,transform' }, REVEAL)

    // Top navbar — same slide-down as the previous landing's cs-topbar
    tl.to('.top-navbar', { y: 0, duration: 0.55, ease: EASE, clearProps: 'transform' }, REVEAL)

    tl.fromTo('.pixel-page-intro', { y: 6 },
      { opacity: 1, y: 0, duration: 0.45, ease: EASE, clearProps: 'opacity,transform' }, REVEAL + 0.08)
    tl.fromTo('.navbar', { x: -10 },
      { opacity: 1, x: 0, duration: 0.45, ease: EASE, clearProps: 'opacity,transform' }, REVEAL + 0.08)
    // Page body (works / photos) arrives as one unit so everything in it is in sync
    tl.fromTo('.pixel-page-body', { y: 10 },
      { opacity: 1, y: 0, duration: 0.45, ease: EASE, clearProps: 'opacity,transform' }, REVEAL + 0.12)
    tl.to('.site-footer', { opacity: 1, duration: 0.4, ease: EASE, clearProps: 'opacity' }, REVEAL + 0.2)
  })
}

// Exit — everything but the gif fades out (top navbar slides back up)
function runPageExit(): Promise<void> {
  return new Promise(resolve => {
    const topbar = document.querySelector<HTMLElement>('.top-navbar')
    if (topbar) topbar.style.transition = 'none'
    const tl = gsap.timeline({ onComplete: resolve })
    tl.to(PAGE_CONTENT, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)
    if (topbar) tl.to(topbar, { y: -80, duration: 0.3, ease: 'power2.in' }, 0)
  })
}

// The gif sits at the top of the page, so bring it into view while the content fades
function scrollToTop(): Promise<void> {
  if (window.scrollY === 0) return Promise.resolve()
  window.scrollTo({ top: 0, behavior: 'smooth' })
  const start = performance.now()
  return new Promise(resolve => {
    const check = () => (window.scrollY === 0 || performance.now() - start > 800 ? resolve() : requestAnimationFrame(check))
    requestAnimationFrame(check)
  })
}

let leaving = false

// navigate() that plays the exit first when leaving one PixelPage for another
export function useTransitionNavigate() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useCallback((to: string) => {
    if (to === pathname || leaving) return
    if (prefersReducedMotion() || !document.querySelector('.pixel-sprites')) { navigate(to); return }
    leaving = true
    Promise.all([runPageExit(), scrollToTop()]).then(() => {
      leaving = false
      navigate(to)
    })
  }, [navigate, pathname])
}
