import React from 'react'
import { papers } from '../data/papers'

export default function Contributions() {
  return (
    <section id="contributions">
      <div className="container">
        <div className="section-label">04</div>
        <h2>Major Contributions of Researchers</h2>
        <div className="grid-3" style={{ marginTop: '1rem' }}>
          {papers.slice(0, 6).map(p => (
            <article key={p.id} className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{p.authors} ({p.year})</h3>
              <div style={{ color: 'var(--blue)', marginBottom: '0.5rem' }}>{p.area}</div>
              <p style={{ color: 'var(--muted)' }}>{p.contribution}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
