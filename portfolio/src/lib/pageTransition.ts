import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { waitForPage } from './pageReady'
import { prefetchOtherPages, prefetchPage } from './pageAssets'

// Everything on a PixelPage except the sprite gif — it fades out on exit and back in on entry,
// while the gif (anchored at the same spot on every PixelPage) stays put across the route change.
export const PAGE_CONTENT = ['.pixel-title > span', '.pixel-page-intro', '.pixel-page-body', '.navbar', '.site-footer']

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Minimum time the sprite gif is on screen alone before the rest of the page arrives — on first load and
// on every page transition. It stays alone for longer if the page's fonts/images are still loading.
const GIF_SOLO = 0.38

// When an exit finished fading the old content out. The next entrance only waits for whatever is left
// of GIF_SOLO, so the time spent finishing the exit and swapping routes counts toward the solo moment.
let gifAloneSince: number | null = null

// Where the gif sat (page coordinates) on the page being left. If the new page's gif sits elsewhere,
// it glides across instead of jumping.
let gifFrom: { x: number; y: number } | null = null

const gifPosition = () => {
  const r = document.querySelector('.pixel-sprites')?.getBoundingClientRect()
  return r ? { x: r.left + window.scrollX, y: r.top + window.scrollY } : null
}

// Entrance — the gif is visible from the first frame. Everything else stays hidden until every font and
// image on the page is ready (so nothing pops in or swaps fonts), and at least GIF_SOLO has passed.
// Returns a cleanup function.
export function runPageEntrance(): () => void {
  const reduceMotion = prefersReducedMotion()
  const aloneSince = gifAloneSince ?? performance.now()
  const path = window.location.pathname

  // The top navbar owns a CSS transform transition (scroll reveal) that would fight GSAP mid-tween
  const topbar = document.querySelector<HTMLElement>('.top-navbar')
  if (topbar) topbar.style.transition = 'none'
  const restore = () => requestAnimationFrame(() => { if (topbar) topbar.style.transition = '' })

  const hidden = gsap.context(() => {
    gsap.set(PAGE_CONTENT, { opacity: 0 })
    gsap.set('.top-navbar', { y: -80 })

    const sprite = document.querySelector<HTMLElement>('.pixel-sprites')
    const to = gifPosition()
    if (sprite && to && gifFrom && !reduceMotion) {
      const dx = gifFrom.x - to.x, dy = gifFrom.y - to.y
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        // Cleared on completion (not up front) so a re-run of this effect still sees where it came from
        gsap.fromTo(sprite, { x: dx, y: dy }, { x: 0, y: 0, duration: 0.35, ease: 'power2.inOut', clearProps: 'transform', onComplete: () => { gifFrom = null } })
      } else gifFrom = null
    }
  })

  let reveal: gsap.Context | undefined
  let cancelled = false

  waitForPage().then(() => {
    if (cancelled) return
    gifAloneSince = null
    const done = () => { restore(); prefetchOtherPages(path) }

    if (reduceMotion) {
      gsap.set(PAGE_CONTENT, { clearProps: 'opacity' })
      gsap.set('.top-navbar', { clearProps: 'transform' })
      done()
      return
    }

    reveal = gsap.context(() => {
      const REVEAL = Math.max(0, GIF_SOLO - (performance.now() - aloneSince) / 1000)
      const EASE = 'power2.out'
      const tl = gsap.timeline({ onComplete: done })

      // Title words slide outward from the sprite
      tl.fromTo('.pixel-title > span:first-child', { opacity: 0, x: 8 },
        { opacity: 1, x: 0, duration: 0.45, ease: EASE, clearProps: 'opacity,transform' }, REVEAL)
      tl.fromTo('.pixel-title > span:last-child', { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.45, ease: EASE, clearProps: 'opacity,transform' }, REVEAL)

      // Top navbar — same slide-down as the previous landing's cs-topbar
      tl.fromTo('.top-navbar', { y: -80 }, { y: 0, duration: 0.55, ease: EASE, clearProps: 'transform' }, REVEAL)

      tl.fromTo('.pixel-page-intro', { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.45, ease: EASE, clearProps: 'opacity,transform' }, REVEAL + 0.08)
      tl.fromTo('.navbar', { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.45, ease: EASE, clearProps: 'opacity,transform' }, REVEAL + 0.08)
      // Page body (works / photos) arrives as one unit so everything in it is in sync
      tl.fromTo('.pixel-page-body', { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, ease: EASE, clearProps: 'opacity,transform' }, REVEAL + 0.12)
      tl.fromTo('.site-footer', { opacity: 0 }, { opacity: 1, duration: 0.4, ease: EASE, clearProps: 'opacity' }, REVEAL + 0.2)
    })
  })

  return () => {
    cancelled = true
    reveal?.revert()
    hidden.revert()
    if (topbar) topbar.style.transition = ''
  }
}

// Exit — everything but the gif fades out (top navbar slides back up)
function runPageExit(): Promise<void> {
  return new Promise(resolve => {
    const topbar = document.querySelector<HTMLElement>('.top-navbar')
    if (topbar) topbar.style.transition = 'none'
    const tl = gsap.timeline({ onComplete: resolve })
    tl.to(PAGE_CONTENT, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)
    tl.call(() => { gifAloneSince = performance.now() }, undefined, 0.25)
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
    prefetchPage(to) // start loading the destination's images while the exit plays
    if (prefersReducedMotion() || !document.querySelector('.pixel-sprites')) { navigate(to); return }
    leaving = true
    Promise.all([runPageExit(), scrollToTop()]).then(() => {
      leaving = false
      gifFrom = gifPosition()
      navigate(to)
    })
  }, [navigate, pathname])
}
