import React, { useState, useEffect, useCallback, useRef } from 'react'

type Slide = { id: number; kicker: string; title: string; text: string; svg: React.ReactNode }

const slides: Slide[] = [
  {
    id: 0,
    kicker: 'The Machine',
    title: 'Construction and Reliability',
    text: 'A three-phase induction motor uses a stationary stator and a rotating squirrel-cage or wound rotor. Its rugged, brushless construction makes it reliable and maintenance-friendly, which is why it dominates industrial drives.',
    svg: (
      <svg viewBox="0 0 420 240" width="100%" height="100%" role="img" aria-label="Induction motor cross-section">
        <circle cx="210" cy="120" r="90" fill="none" stroke="var(--navy)" strokeWidth="2" />
        <circle cx="210" cy="120" r="60" fill="none" stroke="var(--blue)" strokeWidth="2" />
        <circle cx="210" cy="120" r="20" fill="none" stroke="var(--navy)" strokeWidth="2" />
        <text x="210" y="30" textAnchor="middle" fontSize="12" fill="var(--heading)">Stator</text>
        <text x="210" y="124" textAnchor="middle" fontSize="11" fill="var(--blue)">Rotor</text>
      </svg>
    )
  },
  {
    id: 1,
    kicker: 'The Model',
    title: 'Dynamic Modelling and Estimation',
    text: 'The d-q reference-frame model represents the electrical and mechanical behaviour of the machine. Accurate estimation of stator resistance, rotor resistance, and inductances is essential for reliable control.',
    svg: (
      <svg viewBox="0 0 420 240" width="100%" height="100%" role="img" aria-label="d-q reference frame">
        <line x1="40" y1="200" x2="400" y2="200" stroke="var(--divider)" strokeWidth="2" />
        <line x1="60" y1="20" x2="60" y2="220" stroke="var(--divider)" strokeWidth="2" />
        <text x="380" y="220" fontSize="12" fill="var(--muted)">d</text>
        <text x="70" y="30" fontSize="12" fill="var(--muted)">q</text>
        <line x1="60" y1="200" x2="300" y2="60" stroke="var(--navy)" strokeWidth="2" markerEnd="url(#a)" />
        <defs>
          <marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--navy)" />
          </marker>
        </defs>
        <text x="200" y="110" fontSize="12" fill="var(--navy)">flux / current vector</text>
      </svg>
    )
  },
  {
    id: 2,
    kicker: 'The Control',
    title: 'Scalar, FOC, and DTC',
    text: 'Control schemes range from simple scalar (V/f) control to Field-Oriented Control and Direct Torque Control. Advanced schemes trade complexity for faster torque response and better low-speed performance.',
    svg: (
      <svg viewBox="0 0 420 240" width="100%" height="100%" role="img" aria-label="Drive block diagram">
        <rect x="20" y="90" width="90" height="60" rx="6" fill="none" stroke="var(--navy)" strokeWidth="2" />
        <text x="65" y="125" textAnchor="middle" fontSize="11" fill="var(--navy)">Controller</text>
        <rect x="150" y="90" width="90" height="60" rx="6" fill="none" stroke="var(--blue)" strokeWidth="2" />
        <text x="195" y="125" textAnchor="middle" fontSize="11" fill="var(--navy)">Inverter</text>
        <rect x="280" y="90" width="110" height="60" rx="6" fill="none" stroke="var(--navy)" strokeWidth="2" />
        <text x="335" y="125" textAnchor="middle" fontSize="11" fill="var(--navy)">Induction Motor</text>
        <line x1="110" y1="120" x2="150" y2="120" stroke="var(--muted)" strokeWidth="2" />
        <line x1="240" y1="120" x2="280" y2="120" stroke="var(--muted)" strokeWidth="2" />
      </svg>
    )
  }
]

export default function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<number | null>(null)

  const go = useCallback((n: number) => setIndex((n + slides.length) % slides.length), [])
  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || paused) return
    timer.current = window.setInterval(() => setIndex(i => (i + 1) % slides.length), 6000)
    return () => { if (timer.current) window.clearInterval(timer.current) }
  }, [paused])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
  }

  const s = slides[index]
  return (
    <div className="card" role="region" aria-roledescription="carousel" aria-label="Research highlights" tabIndex={0} onKeyDown={onKey} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      style={{ marginTop: '2rem', padding: 0, overflow: 'hidden' }}>
      <div className="hero-slider-grid">
        <div style={{ padding: 'clamp(1.2rem, 3vw, 2rem)' }}>
          <div className="section-label" style={{ marginBottom: '0.6rem' }}>{s.kicker}</div>
          <h3 style={{ minHeight: '2.2em' }}>{s.title}</h3>
          <p style={{ color: 'var(--muted)', minHeight: '6em' }}>{s.text}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
            <button className="btn" onClick={prev} aria-label="Previous slide">Prev</button>
            <button className="btn" onClick={next} aria-label="Next slide">Next</button>
            <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '0.5rem' }}>
              {slides.map((sl, i) => (
                <button key={sl.id} onClick={() => go(i)} aria-label={'Go to slide ' + (i + 1)} aria-current={i === index}
                  style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid var(--navy)', background: i === index ? 'var(--navy)' : 'transparent', padding: 0, cursor: 'pointer' }} />
              ))}
            </div>
          </div>
        </div>
        <div key={s.id} className="slide-visual" style={{ background: 'linear-gradient(160deg, var(--surface), var(--surface-2))', display: 'grid', placeItems: 'center', minHeight: 240, padding: '1rem' }}>
          {s.svg}
        </div>
      </div>
    </div>
  )
}
