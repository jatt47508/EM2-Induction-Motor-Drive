import React, { useState } from 'react'
import { techniques, comparison } from '../data/control'
import ControlDiagram, { type Method } from '../components/ControlDiagram'

export default function ControlComparison() {
  const [active, setActive] = useState(techniques[0].id)
  const cur = techniques.find(t => t.id === active)!

  return (
    <section id="control">
      <div className="container">
        <div className="section-label">Control Techniques</div>
        <h2>Comparing Control Schemes</h2>
        <p style={{ color: 'var(--muted)', maxWidth: '900px' }}>Select a technique to review its principle, advantages, limitations, and typical applications. The table below summarises the main trade-offs.</p>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
          {techniques.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)} className="btn" role="tab" aria-selected={active === t.id} style={active === t.id ? { background: 'var(--accent)', color: 'var(--accent-contrast)', borderColor: 'var(--accent)' } : undefined}>{t.name}</button>
          ))}
        </div>

        <ControlDiagram method={active as Method} />

        <div className="grid-2" style={{ marginTop: '1.5rem' }}>
          <div className="card">
            <h3>{cur.name}</h3>
            <p style={{ color: 'var(--muted)' }}>{cur.principle}</p>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', marginBottom: '0.3rem' }}>Advantages</h4>
            <ul style={{ color: 'var(--muted)', paddingLeft: '1.1rem' }}>
              {cur.advantages.map(a => <li key={a}>{a}</li>)}
            </ul>
          </div>
          <div className="card">
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', marginBottom: '0.3rem' }}>Limitations</h4>
            <ul style={{ color: 'var(--muted)', paddingLeft: '1.1rem' }}>
              {cur.limitations.map(a => <li key={a}>{a}</li>)}
            </ul>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', margin: '0.8rem 0 0.3rem' }}>Typical Applications</h4>
            <ul style={{ color: 'var(--muted)', paddingLeft: '1.1rem' }}>
              {cur.applications.map(a => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--surface)', border: '1px solid var(--divider)' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.8rem', borderBottom: '1px solid var(--divider)' }}>Criterion</th>
                <th style={{ textAlign: 'left', padding: '0.8rem', borderBottom: '1px solid var(--divider)' }}>Scalar (V/f)</th>
                <th style={{ textAlign: 'left', padding: '0.8rem', borderBottom: '1px solid var(--divider)' }}>FOC</th>
                <th style={{ textAlign: 'left', padding: '0.8rem', borderBottom: '1px solid var(--divider)' }}>DTC</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(r => (
                <tr key={r.criterion}>
                  <td style={{ padding: '0.7rem 0.8rem', borderBottom: '1px solid var(--divider)', fontWeight: 600 }}>{r.criterion}</td>
                  <td style={{ padding: '0.7rem 0.8rem', borderBottom: '1px solid var(--divider)', color: 'var(--muted)' }}>{r.scalar}</td>
                  <td style={{ padding: '0.7rem 0.8rem', borderBottom: '1px solid var(--divider)', color: 'var(--muted)' }}>{r.foc}</td>
                  <td style={{ padding: '0.7rem 0.8rem', borderBottom: '1px solid var(--divider)', color: 'var(--muted)' }}>{r.dtc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
