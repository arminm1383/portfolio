import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({ lerp: 0.08 })

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

export { lenis, gsap, ScrollTrigger }

export function scrollTo(
  target: HTMLElement | number,
  opts?: { offset?: number; duration?: number; immediate?: boolean }
) {
  lenis.scrollTo(target as Parameters<typeof lenis.scrollTo>[0], {
    offset: opts?.offset ?? 0,
    duration: opts?.duration ?? 1.2,
    immediate: opts?.immediate,
  })
}
