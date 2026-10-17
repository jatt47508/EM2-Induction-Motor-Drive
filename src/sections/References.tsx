import React from 'react'
import { papers } from '../data/papers'
import { CONFIG } from '../config'
import QrButton from '../components/QrButton'

function ieee(p: any): string {
  const year = p.year
  const title = p.title
  const authors = p.authors
  let base = authors + ', "' + title + '," ' + year + '.'
  if (p.doi) base += ' ' + p.doi
  else if (p.link) base += ' ' + p.link
  return base
}

export default function References() {
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Citation copied')
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      alert('Citation copied')
    }
  }
  return (
    <section id="references">
      <div className="container">
        <div className="section-label">07</div>
        <h2>References</h2>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Project Link</div>
          <div style={{ color: 'var(--muted)' }}>Published research website URL (for report/portfolio):</div>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href={CONFIG.liveUrl} target="_blank" rel="noopener" className="btn">{CONFIG.liveUrl}</a>
            <a href={CONFIG.repoUrl} target="_blank" rel="noopener" className="btn">GitHub Repository</a>
            <QrButton url={CONFIG.repoUrl} label="QR" caption="Scan to open in phone" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '0.9rem' }}>
          {papers.map(p => {
            const url = p.doi || p.link
            return (
              <article key={p.id} className="card">
                <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>{p.title}</div>
                <div style={{ color: 'var(--muted)', marginBottom: '0.4rem' }}>{p.authors}, {p.year}. {p.area}.</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {p.doi && <a href={p.doi} target="_blank" rel="noopener" className="btn">DOI</a>}
                  {!p.doi && p.link && <a href={p.link} target="_blank" rel="noopener" className="btn">Link</a>}
                  {url && <QrButton url={url} />}
                  <button onClick={() => copy(ieee(p))} className="btn">Copy IEEE-style citation</button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
