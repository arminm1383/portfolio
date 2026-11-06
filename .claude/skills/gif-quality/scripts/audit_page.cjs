// Audit every animated image (.gif / .webp) and <video> on one or more pages at retina density. Exits 1 on any FAIL.
//
// usage: PUPPETEER_DIR=<dir whose node_modules has puppeteer-core> node audit_page.cjs <url> [<url> ...]
//
// For each animated <img>: loaded, intrinsic width >= 2x the rendered image box (the box is the <img>
// element itself, so CSS crops that overscan the frame are measured correctly), and visibly animating.
const puppeteer = require(require.resolve('puppeteer-core', { paths: [process.env.PUPPETEER_DIR || process.cwd()] }))

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const ANIMATED = /\.(gif|webp)(\?|$)/i

;(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
  let fails = 0
  for (const url of process.argv.slice(2)) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1648, height: 1000, deviceScaleFactor: 2 })
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 180000 })
    await new Promise(r => setTimeout(r, 1000))
    const imgs = await page.$$eval('img, video', els => els.map((el, i) => {
      const r = el.getBoundingClientRect()
      const video = el.tagName === 'VIDEO'
      return {
        i, video, src: el.currentSrc || el.src, complete: video ? el.readyState >= 2 : el.complete,
        nw: video ? el.videoWidth : el.naturalWidth, nh: video ? el.videoHeight : el.naturalHeight, w: r.width, h: r.height,
        fit: getComputedStyle(el).objectFit,
      }
    }))
    console.log(`\n${url}`)
    for (const img of imgs.filter(im => im.video || ANIMATED.test(im.src))) {
      const name = decodeURIComponent(img.src.split('/').pop().split('?')[0])
      if (!img.complete || !img.nw) { console.log(`FAIL ${name}: not loaded`); fails++; continue }
      if (!img.w) { console.log(`SKIP ${name}: not rendered`); continue }
      // object-fit: cover fills the box on its tighter axis; contain/fill scale to the box width
      const scale = img.fit === 'cover' ? Math.max(img.w / img.nw, img.h / img.nh) : img.w / img.nw
      const density = 1 / scale
      const ok = density >= 1.95
      if (!ok) fails++
      // Animation check: two element screenshots ~1.2s apart must differ
      const handle = (await page.$$('img, video'))[img.i]
      await handle.evaluate(e => e.scrollIntoView({ block: 'center' }))
      await new Promise(r => setTimeout(r, 300))
      const a = await handle.screenshot({ encoding: 'base64' })
      await new Promise(r => setTimeout(r, 1200))
      const b = await handle.screenshot({ encoding: 'base64' })
      const moving = a !== b
      console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${img.nw}x${img.nh} in a ${Math.round(img.w)}x${Math.round(img.h)} box `
        + `= ${density.toFixed(2)}x density (needs 2x)${moving ? '' : ' — WARN: no motion seen in 1.2s'}`)
    }
    await page.close()
  }
  await browser.close()
  console.log(`\nRESULT: ${fails ? `${fails} FAIL` : 'PASS'}`)
  process.exit(fails ? 1 : 0)
})()
