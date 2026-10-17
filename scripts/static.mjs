import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const ROOT = process.argv[2] || 'dist'
const BASE = process.argv[3] || '/EM2-Induction-Motor-Drive/'
const PORT = Number(process.argv[4] || 4303)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon'
}

http
  .createServer(async (req, res) => {
    let p = decodeURIComponent((req.url || '/').split('?')[0])
    if (p.startsWith(BASE)) p = p.slice(BASE.length)
    if (p === '' || p === '/') p = 'index.html'
    const file = join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ''))
    try {
      const data = await readFile(file)
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' })
      res.end(data)
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('404')
    }
  })
  .listen(PORT, () => console.log('static on ' + PORT))
