import React from 'react'
import { CONFIG } from '../config'
import HeroSlider from './HeroSlider'

export default function Hero() {
  return (
    <section id="hero" style={{ borderTop: 'none', paddingTop: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container">
        <div className="section-label">Research Review</div>
        <h1 style={{ maxWidth: '1100px' }}>{CONFIG.title.toUpperCase()}</h1>
        <p className="lead" style={{ maxWidth: '900px' }}>{CONFIG.subtitle}</p>
        <p style={{ maxWidth: '900px', color: 'var(--muted)' }}>Three-phase induction motors remain the workhorse of modern industry owing to their robustness, simplicity, low cost, and ease of maintenance. This systematic review focuses on dynamic modelling, parameter estimation, and control schemes for three-phase induction motor drives, with emphasis on their role in improving reliability, efficiency, and performance.</p>
        <div className="card" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div><strong>Department</strong><div style={{ color: 'var(--muted)' }}>{CONFIG.academic.department}</div></div>
          <div><strong>Course</strong><div style={{ color: 'var(--muted)' }}>{CONFIG.academic.course}</div></div>
          <div><strong>Programme</strong><div style={{ color: 'var(--muted)' }}>{CONFIG.academic.programme}</div></div>
          <div><strong>Semester</strong><div style={{ color: 'var(--muted)' }}>{CONFIG.academic.semester}</div></div>
          <div><strong>Academic Year</strong><div style={{ color: 'var(--muted)' }}>{CONFIG.academic.academicYear}</div></div>
        </div>
        <HeroSlider />
      </div>
    </section>
  )
}
