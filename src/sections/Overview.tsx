import React, { useState } from 'react'
import DqVector from '../components/DqVector'

const items = [
  { id: 'modelling', title: 'Dynamic Modelling', desc: 'Represents electrical and mechanical behaviour mathematically to analyse transient and steady-state performance.' },
  { id: 'param', title: 'Parameter Estimation', desc: 'Determines stator/rotor resistances and inductances accurately for reliable control.' },
  { id: 'control', title: 'Control Schemes', desc: 'Includes scalar (V/f), Field-Oriented Control (FOC), and Direct Torque Control (DTC).' }
]

export default function Overview() {
  const [active, setActive] = useState('modelling')
  const cur = items.find(i => i.id === active)!
  return (
    <section id="overview">
      <div className="container">
        <div className="section-label">Overview</div>
        <h2>Understanding the Drive</h2>
        <div className="grid-2" style={{ marginTop: '1.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {items.map(i => (
                <button key={i.id} onClick={() => setActive(i.id)} className="btn" role="tab" aria-selected={active === i.id} style={active === i.id ? { background: 'var(--accent)', color: 'var(--accent-contrast)', borderColor: 'var(--accent)' } : undefined}>{i.title}</button>
              ))}
            </div>
            <h3 style={{ marginBottom: '0.6rem' }}>{cur.title}</h3>
            <p style={{ color: 'var(--muted)' }}>{cur.desc}</p>
            <p style={{ color: 'var(--muted)', marginBottom: 0 }}>
              The d–q reference-frame vector on the right shows how the machine quantities used for dynamic modelling
              and parameter estimation are represented. Use the controls to change the vector.
            </p>
          </div>
          <DqVector />
        </div>
      </div>
    </section>
  )
}
