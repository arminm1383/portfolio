import { gsap } from 'gsap'

// Hero entrance — one-shot. Elements start bunched toward center, fly to natural
// positions. Shared by Home (full-viewport hero) and HomeAlt (shrunk hero); the
// motion is driven entirely by class selectors, so it works for any hero markup
// that uses the shared .hero-* classes. Returns a gsap.Context for cleanup.
export function runHeroEntrance(): gsap.Context {
  return gsap.context(() => {
    const leftEl = document.querySelector('.hero-left-side') as HTMLElement
    const S = leftEl ? leftEl.offsetWidth * 0.58 : 328.5

    gsap.set('.hero-star-lg, .hero-star-md, .hero-star-sm, .hero-bird3, .hero-bird2, .hero-bird1, .hero-me-green, .hero-mac, .hero-wii', { x: S })
    gsap.set('.hero-koi-entrance, .hero-yosemite, .hero-ipod, .hero-boy, .hero-music-note--1, .hero-music-note--2', { x: -S })
    const iconEls = Array.from(document.querySelectorAll<HTMLElement>(
      '.hero-selectable[data-graphic="icon-figma"],' +
      '.hero-selectable[data-graphic="icon-react"],' +
      '.hero-selectable[data-graphic="icon-claude"]'
    ))
    iconEls.forEach(el => { el.style.transition = 'none' })
    gsap.set('.hero-selectable[data-graphic="icon-figma"], .hero-selectable[data-graphic="icon-react"], .hero-selectable[data-graphic="icon-claude"]', { x: -S })
    requestAnimationFrame(() => iconEls.forEach(el => { el.style.transition = '' }))
    gsap.set('.hero-name-block', { opacity: 0 })
    gsap.set('.cs-topbar', { y: -80 })

    function enter(sel: string, mid: number, t: number[]) {
      const D = 2
      const tl = gsap.timeline({ delay: t[1] * D })
      tl.to(sel, { x: mid, duration: (t[2] - t[1]) * D, ease: 'expo.out'     })
      tl.to(sel, { x: 0,   duration: (t[3] - t[2]) * D, ease: 'power2.inOut' })
    }

    // ── Left side: slide in from the right ──
    enter('.hero-star-lg',  10, [0, 0.4905, 0.92, 1.04, 1])
    enter('.hero-star-md',  13, [0, 0.4905, 0.93, 1.05, 1])
    enter('.hero-star-sm',  16, [0, 0.4905, 0.94, 1.06, 1])
    enter('.hero-bird3',    10, [0, 0.525,  0.95, 1.07, 1])
    enter('.hero-bird2',    13, [0, 0.525,  0.96, 1.08, 1])
    enter('.hero-bird1',    16, [0, 0.525,  0.97, 1.09, 1])
    enter('.hero-me-green', 10, [0, 0.531,  0.98, 1.10, 1])
    enter('.hero-mac',      13, [0, 0.542,  0.99, 1.11, 1])
    enter('.hero-wii',      16, [0, 0.531,  1.00, 1.12, 1])

    // ── Right side: slide in from the left ──
    enter('.hero-koi-entrance',  -10, [0, 0.505,  0.925, 1.045, 1])
    enter('.hero-yosemite',      -13, [0, 0.49,   0.94,  1.06,  1])
    enter('.hero-ipod',          -16, [0, 0.5105, 0.955, 1.075, 1])
    enter('.hero-boy',           -10, [0, 0.5105, 0.97,  1.09,  1])
    enter('.hero-music-note--1', -13, [0, 0.5105, 0.985, 1.105, 1])
    enter('.hero-music-note--2', -13, [0, 0.5105, 0.985, 1.105, 1])

    const IT = [0, 0.495, 1.00, 1.12, 1]
    const D = 2
    const iconSelectors = [
      '.hero-selectable[data-graphic="icon-figma"]',
      '.hero-selectable[data-graphic="icon-react"]',
      '.hero-selectable[data-graphic="icon-claude"]',
    ]
    for (const sel of iconSelectors) {
      const tl = gsap.timeline({ delay: IT[1] * D })
      tl.to(sel, { x: -16, duration: (IT[2] - IT[1]) * D, ease: 'expo.out' })
      tl.to(sel, { x: 0,   duration: (IT[3] - IT[2]) * D, ease: 'power2.inOut', clearProps: 'transform' })
    }

    gsap.to('.hero-name-block', { opacity: 1, duration: 0.76, ease: 'power3.out', delay: 1.15 })

    gsap.to('.cs-topbar', { y: 0, duration: 0.55, ease: 'power3.out', delay: 2.20,
      onComplete: () => gsap.set('.cs-topbar', { clearProps: 'transform' }) })
  })
}
