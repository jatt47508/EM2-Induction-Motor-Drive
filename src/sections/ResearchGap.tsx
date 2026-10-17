import React from 'react'

export default function ResearchGap() {
  return (
    <section id="research-gap">
      <div className="container">
        <div className="section-label">05</div>
        <h2>Research Gap</h2>
        <div className="card">
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--muted)' }}>
            <li>Changes in motor parameters (stator/rotor resistance, inductances) during operation due to temperature and magnetic saturation affect control accuracy.</li>
            <li>Challenges in sensorless low-speed operation and reliable speed/flux estimation under dynamic load conditions.</li>
            <li>Trade-offs between torque response, torque ripple, and control complexity across scalar, FOC, and DTC schemes.</li>
            <li>Computational requirements and real-time implementation constraints of advanced and intelligent control techniques.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
