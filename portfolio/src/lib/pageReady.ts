import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'

// Faces used across the site. Loading them explicitly (rather than waiting for layout to discover them)
// starts the downloads as early as possible; main.tsx kicks this off before React renders.
const CORE_FONTS = [
  "400 24px 'Pokemon Pixel'",
  "400 16px 'Open Sans'",
  "600 16px 'Open Sans'",
  "700 16px 'Open Sans'",
]

// Safety valve only — if an asset is broken or the network stalls, show the page anyway rather than hang.
const MAX_WAIT_MS = 10000

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

// document.fonts.load() resolves empty if the @font-face rule isn't known yet (the Google Fonts
// stylesheet is still arriving), so retry briefly until the face is registered.
async function loadFace(spec: string): Promise<void> {
  for (let i = 0; i < 30; i++) {
    const faces = await document.fonts.load(spec).catch(() => [])
    if (faces.length) return
    await sleep(100)
  }
}

export function preloadCoreFonts(): Promise<void> {
  return Promise.all(CORE_FONTS.map(loadFace)).then(() => {})
}

async function fontsSettled(): Promise<void> {
  // Force a layout so every bit of (still hidden) text requests its face, then wait for all pending loads
  void document.body.offsetHeight
  await preloadCoreFonts()
  await document.fonts.ready
}

function imageSettled(img: HTMLImageElement): Promise<void> {
  const decode = () => img.decode().catch(() => {})
  if (img.complete) return img.naturalWidth ? decode() : Promise.resolve() // broken images don't block
  return new Promise<void>(resolve => {
    img.addEventListener('load', () => decode().then(resolve), { once: true })
    img.addEventListener('error', () => resolve(), { once: true })
  })
}

// A looping clip is ready once its first frame or its poster (the same frame) can be shown. The poster is
// enough on its own: iOS Low Power Mode never loads autoplay video, and the page mustn't wait on it.
function videoSettled(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return Promise.resolve()
  const frame = new Promise<void>(resolve => {
    video.addEventListener('loadeddata', () => resolve(), { once: true })
    video.addEventListener('error', () => resolve(), { once: true })
  })
  if (!video.poster) return frame
  const poster = new Image()
  poster.src = video.poster
  return Promise.race([frame, imageSettled(poster)])
}

// Resolves once every font the page uses and every <img> and <video> in it is ready to show
export function waitForPage(root: ParentNode = document): Promise<void> {
  const images = Array.from(root.querySelectorAll('img')).map(imageSettled)
  const videos = Array.from(root.querySelectorAll('video')).map(videoSettled)
  return Promise.race([
    Promise.all([fontsSettled(), ...images, ...videos]).then(() => {}),
    sleep(MAX_WAIT_MS),
  ])
}

// For pages without the gif (case studies): hold the whole page until its fonts and images are ready,
// then fade it in — nothing renders in a fallback font or loads in visibly.
export function useRevealWhenReady(selectors: string[] = ['.top-navbar', '.fcs-page']) {
  useLayoutEffect(() => {
    const targets = selectors.join(',')
    gsap.set(targets, { opacity: 0 })
    let tween: gsap.core.Tween | undefined
    let cancelled = false
    waitForPage().then(() => {
      if (cancelled) return
      tween = gsap.to(targets, { opacity: 1, duration: 0.35, ease: 'power2.out', clearProps: 'opacity' })
    })
    return () => {
      cancelled = true
      tween?.kill()
      gsap.set(targets, { clearProps: 'opacity' })
    }
  // selectors is a static list per page
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
