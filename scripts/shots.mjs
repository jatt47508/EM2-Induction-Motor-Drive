import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = process.env.SMOKE_URL || 'http://localhost:4303/EM2-Induction-Motor-Drive/'
const OUT = process.env.SHOT_DIR || 'C:\\Users\\jatin\\AppData\\Local\\Temp\\opencode\\em2shots'
mkdirSync(OUT, { recursive: true })

const errors = []
const bad = []

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=1360,900']
})
const page = await browser.newPage()
await page.setViewport({ width: 1360, height: 900 })
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))
page.on('response', r => { if (r.status() >= 400 && !r.url().includes('favicon')) bad.push(r.status() + ' ' + r.url()) })

await page.goto(URL, { waitUntil: 'load', timeout: 60000 })
await page.waitForSelector('#root > *', { timeout: 20000 })
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })
await new Promise(r => setTimeout(r, 2500))

const setTheme = (t) =>
  page.evaluate(name => {
    document.documentElement.setAttribute('data-theme', name)
    window.localStorage.setItem('em2-theme', name)
  }, t)

const shot = async (name) => { await page.screenshot({ path: `${OUT}\\${name}.png` }) }

const active = () => page.evaluate(() => {
  const a = document.querySelector('.nav-link.is-active')
  return a ? a.textContent : null
})

const topOf = (id) => page.evaluate(sid => {
  const el = document.getElementById(sid)
  if (!el) return null
  const y = el.getBoundingClientRect().top + window.scrollY - 4
  window.scrollTo(0, y)
  return Math.round(y)
}, id)

await setTheme('light'); await new Promise(r => setTimeout(r, 900)); await shot('01-light-top')
await setTheme('dark'); await new Promise(r => setTimeout(r, 900)); await shot('02-dark-top')

await setTheme('light')

const setExplorerProgress = (p) => page.evaluate(prog => {
  const el = document.getElementById('explorer')
  const track = el.querySelector('.explorer-track')
  const total = track.offsetHeight - window.innerHeight
  const top = el.getBoundingClientRect().top + window.scrollY
  window.scrollTo(0, top + prog * total)
  return { top, total }
}, p)

await setExplorerProgress(0.1); await new Promise(r => setTimeout(r, 1800)); await shot('03-light-explorer-assembled')
await setExplorerProgress(0.45); await new Promise(r => setTimeout(r, 1800)); await shot('04-light-explorer-mid')
await setExplorerProgress(0.8); await new Promise(r => setTimeout(r, 1800)); await shot('05-light-explorer-exploded')

await topOf('simulation'); await new Promise(r => setTimeout(r, 1600))
const simActive = await active(); await shot('06-light-simulation')

await setTheme('dark')
await topOf('operating'); await new Promise(r => setTimeout(r, 1600))
const opActive = await active(); await shot('07-dark-operating')

const bottom = await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight); return document.body.scrollHeight })
await new Promise(r => setTimeout(r, 1200)); await shot('08-light-bottom')
const botActive = await active()

const clickByText = (text) => page.evaluate(t => {
  const b = Array.from(document.querySelectorAll('button')).find(x => (x.textContent || '').trim().toLowerCase().includes(t.toLowerCase()))
  if (b) b.click()
  return !!b
}, text)

// ---- visualisation QA ----
await setTheme('light')
await topOf('overview'); await new Promise(r => setTimeout(r, 1200)); await shot('09-light-overview-dq')
const setRange = (id, val) => page.evaluate((i, v) => {
  const el = document.getElementById(i)
  if (!el) return false
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  setter.call(el, String(v))
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
  return true
}, id, val)
await setRange('dq-angle', 70)
await setRange('dq-mag', 0.5)
await new Promise(r => setTimeout(r, 600)); await shot('10-light-dq-changed')
const dqValues = await page.evaluate(() => Array.from(document.querySelectorAll('.readout strong')).map(e => e.textContent).slice(0, 4))

await topOf('control'); await new Promise(r => setTimeout(r, 1200)); await shot('11-light-control-scalar')
const foc = await clickByText('Field-Oriented'); await new Promise(r => setTimeout(r, 700)); await shot('12-light-control-foc')
const dtc = await clickByText('Direct Torque'); await new Promise(r => setTimeout(r, 700)); await shot('13-light-control-dtc')

await setTheme('dark')
await topOf('overview'); await new Promise(r => setTimeout(r, 1000)); await shot('14-dark-overview-dq')

await setTheme('light')
await topOf('references'); await new Promise(r => setTimeout(r, 1000))
const qrClicked = await page.evaluate(() => {
  const b = document.querySelector('.qr-wrap button')
  if (b) b.click()
  return !!b
})
await new Promise(r => setTimeout(r, 1000)); await shot('15-light-references-qr')

await page.setViewport({ width: 390, height: 844 })
await setTheme('light')
await topOf('overview'); await new Promise(r => setTimeout(r, 900)); await shot('16-mobile-overview')
await topOf('control'); await new Promise(r => setTimeout(r, 900)); await shot('17-mobile-control')
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
await page.setViewport({ width: 1360, height: 900 })

// ---- motor interaction QA ----
await page.setViewport({ width: 1360, height: 900 })
await setTheme('light')
const expl = await page.evaluate(() => {
  const b = Array.from(document.querySelectorAll('.explorer-hud button')).find(x => x.textContent.includes('Exploded view'))
  if (b) b.click()
  return !!b
})
await new Promise(r => setTimeout(r, 1800))
const explodedY = await page.evaluate(() => Math.round(window.scrollY))
const asm = await page.evaluate(() => {
  const b = Array.from(document.querySelectorAll('.explorer-hud button')).find(x => x.textContent.includes('Assembled view'))
  if (b) b.click()
  return !!b
})
await new Promise(r => setTimeout(r, 1800))
const assembledY = await page.evaluate(() => Math.round(window.scrollY))

await setExplorerProgress(0.1)
await new Promise(r => setTimeout(r, 1600))
const box = await page.evaluate(() => {
  const c = document.querySelector('.scene-canvas')
  const r = c.getBoundingClientRect()
  return { x: r.x, y: r.y, w: r.width, h: r.height }
})
await page.mouse.click(box.x + box.w * 0.5, box.y + box.h * 0.5)
await new Promise(r => setTimeout(r, 700))
const partInfo = await page.evaluate(() => { const e = document.querySelector('.part-info h3'); return e ? e.textContent : null })
await shot('18-light-motor-part-selected')

console.log(JSON.stringify({ OUT, simActive, opActive, botActive, foc, dtc, qrClicked, dqValues, overflow, expl, asm, explodedY, assembledY, partInfo, bad, errors }, null, 2))
await browser.close()
