import React, { useState } from 'react'
import { CONFIG } from '../config'
import { sections } from '../data/sections'
import { useTheme } from '../theme/ThemeContext'

export default function Navbar({ active }: { active: string }) {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="nav-root">
      <div className="container nav-bar">
        <a href="#hero" className="nav-brand" aria-label="EM II Research home">
          <span className="nav-logo" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="26" height="26">
              <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="16" cy="16" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M16 2 v6 M16 24 v6 M2 16 h6 M24 16 h6" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <span className="nav-brand-text">
            <strong>EM II | Research</strong>
            <small>{CONFIG.title}</small>
          </span>
        </a>

        <button className="nav-toggle" aria-expanded={open} aria-controls="primary-nav" aria-label="Toggle navigation" onClick={() => setOpen(o => !o)}>
          <span /><span /><span />
        </button>

        <nav id="primary-nav" className={'nav-links' + (open ? ' is-open' : '')} aria-label="Main navigation">
          {sections.map(s => (
            <a
              key={s.id}
              href={'#' + s.id}
              className={'nav-link' + (active === s.id ? ' is-active' : '')}
              onClick={() => setOpen(false)}
            >
              {s.label}
            </a>
          ))}
          <button className="nav-theme" onClick={toggle} aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme'}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </nav>
      </div>
    </header>
  )
}
