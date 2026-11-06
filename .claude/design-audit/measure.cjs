// Measure the running site against Figma coordinates. Exits 1 if anything is Major or worse.
//
// usage: PUPPETEER_DIR=<dir whose node_modules has puppeteer-core> node measure.cjs <spec.json> [--shot out.png]
//
// spec.json:
// {
//   "url": "http://localhost:5199/",
//   "viewport": [1648, 1024],            // the Figma frame size
//   "items": [
//     { "name": "sidebar text", "selector": ".sidebar-text", "figma": [32, 116, 302, 712] },
//     { "name": "cards", "selector": ".work-card-artwork", "all": true, "figma": [[478, 76, 513, 317], ...] },
//     { "name": "footer", "selector": ".site-footer", "figma": [366, 994, 1282, 96], "accept": "why it differs" }
//   ]
// }
// "accept" marks a known, intentional deviation: it's still measured and shown, but doesn't fail the audit.
// Figma boxes are [x, y, w, h] in frame coordinates (page coordinates on the site, so scroll doesn't matter).
// Also reports horizontal overflow, which should be 0 at every width.
const fs = require('fs')
const puppeteer = require(require.resolve('puppeteer-core', { paths: [process.env.PUPPETEER_DIR || process.cwd()] }))

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const severity = d => (d <= 1 ? 'ok' : d < 2 ? 'nitpick' : d <= 8 ? 'MINOR' : 'MAJOR')
const rank = { ok: 0, accepted: 0, nitpick: 1, MINOR: 2, MAJOR: 3, MISSING: 4 }

;(async () => {
  const [specPath, ...rest] = process.argv.slice(2)
  const shotAt = rest.indexOf('--shot')
  const shot = shotAt >= 0 ? rest[shotAt + 1] : null
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
  const [vw, vh] = spec.viewport
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
  const page = await browser.newPage()
  await page.setViewport({ width: vw, height: vh })
  await page.goto(spec.url, { waitUntil: 'networkidle0', timeout: 120000 })
  await new Promise(r => setTimeout(r, spec.settleMs ?? 1800)) // let entrance animations finish

  const measured = await page.evaluate(items => items.map(it => {
    const els = it.all ? [...document.querySelectorAll(it.selector)] : [document.querySelector(it.selector)].filter(Boolean)
    return els.map(e => { const b = e.getBoundingClientRect(); return [b.x + scrollX, b.y + scrollY, b.width, b.height].map(v => +v.toFixed(1)) })
  }), spec.items)
  const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)

  let worst = 'ok'
  const rows = []
  const accepted = []
  spec.items.forEach((it, i) => {
    const expected = it.all ? it.figma : [it.figma]
    expected.forEach((fig, j) => {
      const got = measured[i][j]
      if (!got) { rows.push({ element: `${it.name}${it.all ? ` #${j + 1}` : ''}`, figma: fig.join(','), site: '-', delta: '-', status: 'MISSING' }); worst = 'MISSING'; return }
      const delta = got.map((v, k) => +(v - fig[k]).toFixed(1))
      const measuredStatus = severity(Math.max(...delta.map(Math.abs)))
      const s = it.accept && rank[measuredStatus] >= rank.MINOR ? 'accepted' : measuredStatus
      if (rank[s] > rank[worst]) worst = s
      rows.push({ element: `${it.name}${it.all ? ` #${j + 1}` : ''}`, figma: fig.join(','), site: got.join(','), delta: delta.join(','), status: s })
      if (s === 'accepted') accepted.push(`${it.name}: ${it.accept}`)
    })
  })
  console.log(`${spec.url} @ ${vw}x${vh}`)
  console.table(rows)
  for (const a of accepted) console.log(`accepted deviation: ${a}`)
  console.log(`horizontal overflow: ${overflowX}px${overflowX > 0 ? '  <- MAJOR' : ''}`)
  if (shot) { await page.screenshot({ path: shot }); console.log(`screenshot: ${shot}`) }
  console.log(`RESULT: ${worst === 'ok' || worst === 'nitpick' ? 'PASS' : worst}`)
  await browser.close()
  process.exit(rank[worst] >= rank.MAJOR || overflowX > 0 ? 1 : 0)
})()
