import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = process.env.SMOKE_URL || 'http://localhost:4300/EM2-Induction-Motor-Drive/'

const errors = []
const logs = []
const bad = []

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: [
    '--no-sandbox',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--window-size=1280,900'
  ]
})

const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
page.on('console', m => logs.push(`${m.type()}: ${m.text()}`))
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))
page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()) })

await page.goto(URL, { waitUntil: 'load', timeout: 60000 })
try {
  await page.waitForSelector('#root > *', { timeout: 20000 })
} catch {
  errors.push('ROOT_EMPTY after wait')
}
await new Promise(r => setTimeout(r, 3000))

const report = await page.evaluate(() => {
  const root = document.getElementById('root')
  const text = document.body.innerText || ''
  return {
    rootChildren: root ? root.children.length : -1,
    hasTitle: text.includes('THREE-PHASE INDUCTION MOTOR DRIVE'),
    hasSim: text.includes('Simulation lab'),
    hasRefs: text.includes('References'),
    hasExplorerCaption: text.includes('The complete motor'),
    canvases: document.querySelectorAll('canvas').length,
    charts: document.querySelectorAll('svg.chart-svg').length,
    buttons: document.querySelectorAll('button').length,
    dark: document.documentElement.getAttribute('data-theme'),
    textLen: text.length
  }
})

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4))
await new Promise(r => setTimeout(r, 1500))
const mid = await page.evaluate(() => ({ scrollY: window.scrollY }))

const themeAfter = await page.evaluate(() => {
  const b = document.querySelector('button.nav-theme')
  if (b) b.click()
  return document.documentElement.getAttribute('data-theme')
})

console.log(JSON.stringify({ report, mid, themeAfter, bad, errors, logsTail: logs.slice(-10) }, null, 2))
await browser.close()
