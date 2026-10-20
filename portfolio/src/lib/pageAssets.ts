// Images each pixel page waits for before revealing. Registered by the pages themselves so they can be
// warmed into the browser cache ahead of navigation, making page-to-page transitions near-instant.
const pageImages = new Map<string, string[]>()
const warmed = new Set<string>()

export function registerPageImages(path: string, urls: string[]) {
  pageImages.set(path, urls)
}

export function prefetchPage(path: string) {
  for (const url of pageImages.get(path) ?? []) {
    if (warmed.has(url)) continue
    warmed.add(url)
    const img = new Image()
    img.decoding = 'async'
    img.src = url
  }
}

const whenIdle = (fn: () => void) => {
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(fn, { timeout: 3000 })
  else setTimeout(fn, 1000) // Safari
}

// After a page has revealed, quietly preload the other pixel pages in idle time
export function prefetchOtherPages(current: string) {
  whenIdle(() => {
    for (const path of pageImages.keys()) if (path !== current) prefetchPage(path)
  })
}
