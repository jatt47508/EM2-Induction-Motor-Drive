import React, { useMemo, useState } from 'react'
import { papers } from '../data/papers'
import { CONFIG } from '../config'

const areas = ['All', 'Dynamic Modelling', 'Parameter Estimation', 'Torque and Speed Control', 'Sensorless Control', 'Intelligent Control']

export default function LiteratureReview() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const filtered = useMemo(() => {
    return papers.filter(p => {
      const matchArea = filter === 'All' || p.area === filter
      const q = query.toLowerCase()
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q) || p.contribution.toLowerCase().includes(q)
      return matchArea && matchQ
    })
  }, [query, filter])

  return (
    <section id="literature-review">
      <div className="container">
        <div className="section-label">03</div>
        <h2>Literature Review</h2>
        <p style={{ color: 'var(--muted)', maxWidth: '900px' }}>Interactive explorer of the selected research papers covering dynamic modelling, parameter estimation, and control schemes.</p>
        <div style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--muted)', letterSpacing: '0.02em' }}>Compiled &amp; curated by <strong style={{ color: 'var(--heading)' }}>{CONFIG.student}</strong></div>
        <div className="card" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.8rem', alignItems: 'center' }}>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title, authors, or contribution..." aria-label="Search papers" style={{ flex: '1 1 260px', padding: '0.7rem 0.9rem', borderRadius: '999px', border: '1px solid var(--divider)', background: 'var(--surface)' }} />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {areas.map(a => (
              <button key={a} onClick={() => setFilter(a)} className="btn" style={{ padding: '0.5rem 0.8rem', background: filter === a ? 'var(--navy)' : 'var(--bg-alt)', color: filter === a ? '#fff' : 'var(--navy)' }}>{a}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {filtered.map(p => (
            <article key={p.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{p.title}</h3>
                <span className="btn" style={{ padding: '0.25rem 0.6rem' }}>{p.year}</span>
              </div>
              <div style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}><strong>{p.authors}</strong> · {p.area}</div>
              <p style={{ color: 'var(--muted)' }}>{p.contribution}</p>
              {p.link && <a href={p.link} target="_blank" rel="noopener" className="btn" style={{ marginTop: '0.5rem' }}>View publication</a>}
            </article>
          ))}
          {filtered.length === 0 && <div className="card" style={{ color: 'var(--muted)' }}>No papers match your search/filter.</div>}
        </div>
      </div>
    </section>
  )
}
