import React from 'react'
import { CONFIG } from '../config'
import { sections } from '../data/sections'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <h4>Research</h4>
          <div style={{ fontFamily: "Newsreader, 'Source Serif 4', serif", fontSize: '1.05rem', color: 'var(--heading)' }}>{CONFIG.title}</div>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>{CONFIG.subtitle}</p>
        </div>

        <div className="footer-col">
          <h4>Academic context</h4>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: 0 }}>
            {CONFIG.academic.department}<br />
            {CONFIG.academic.course} · {CONFIG.academic.programme} · Sem {CONFIG.academic.semester}<br />
            AY {CONFIG.academic.academicYear}<br />
            {CONFIG.academic.university}
          </p>
        </div>

        <div className="footer-col">
          <h4>Sections</h4>
          <div className="footer-links">
            {sections.map(s => (
              <a key={s.id} href={'#' + s.id}>{s.label}</a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>Links</h4>
          <div className="footer-links">
            <a href={CONFIG.repoUrl} target="_blank" rel="noopener">GitHub repository</a>
            <a href={CONFIG.liveUrl} target="_blank" rel="noopener">Live site</a>
            <a href="#references">References</a>
            <a href="#hero">Back to top</a>
          </div>
        </div>
      </div>

      <div className="container footer-credit">
        © {year} · Built by {CONFIG.student} with OpenCode · for academic use
      </div>
    </footer>
  )
}
