import React, { Suspense, lazy, useState } from 'react'
import { useElementProgress } from '../hooks/useElementProgress'
import { useTheme } from '../theme/ThemeContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { hasWebGL } from '../utils/webgl'
import type { MotorPartId } from '../three/MotorModel'

const MotorScene = lazy(() => import('../three/MotorScene'))

const SEGMENTS = 6

const CAPTIONS = [
  {
    title: 'The complete motor',
    text: 'A three-phase induction motor: rugged, brushless, and maintenance-friendly. Scroll to take it apart, or drag to orbit around it.'
  },
  {
    title: '1 · Construction',
    text: 'The motor rotates to reveal its cylindrical stator frame and cooling fins. The frame carries the stator and both end plates.'
  },
  {
    title: '2 · Stator and rotor',
    text: 'The laminated stator core carries the three-phase windings in its slots. Inside it sits the squirrel-cage rotor: conducting bars joined by end rings.'
  },
  {
    title: '3 · Shaft, bearings and fan',
    text: 'The rotor is pressed onto the shaft, which is supported by bearings in each end plate. A cooling fan is mounted at the non-drive end.'
  },
  {
    title: '4 · Operating principle',
    text: 'The three-phase currents set up a magnetic field that rotates at synchronous speed. It induces currents in the rotor bars, and their interaction produces torque.'
  },
  {
    title: '5 · From construction to analysis',
    text: 'Understanding the physical machine leads into dynamic modelling, parameter estimation, and control schemes — explored in the sections that follow.'
  }
]

const PARTS: Record<MotorPartId, { name: string; desc: string }> = {
  housing: { name: 'Stator frame (housing)', desc: 'Cylindrical frame with external cooling fins. It carries the laminated stator core, holds both end plates, and helps dissipate heat.' },
  stator: { name: 'Stator core', desc: 'Laminated silicon-steel cylinder with internal slots. The slots hold the three-phase stator windings and provide the low-reluctance path for the magnetic flux.' },
  windings: { name: 'Three-phase stator windings', desc: 'Distributed copper coils. Fed with a balanced three-phase supply, they produce the magnetic field that rotates at synchronous speed Ns = 120f/P.' },
  rotor: { name: 'Squirrel-cage rotor', desc: 'Conducting bars short-circuited by end rings. The rotating field induces currents in the bars; their interaction with the flux produces electromagnetic torque.' },
  shaft: { name: 'Shaft', desc: 'Transmits the electromagnetic torque from the rotor to the driven load. It rotates at the rotor speed Nr, which is slightly below synchronous speed.' },
  bearingFront: { name: 'Front bearing', desc: 'Supports the drive-end of the shaft and keeps the rotor centred so the air-gap stays uniform.' },
  bearingBack: { name: 'Rear bearing', desc: 'Supports the non-drive end of the shaft. Together with the front bearing it locates the rotor axially and radially.' },
  fan: { name: 'Cooling fan', desc: 'Mounted at the non-drive end of the shaft. It forces air over the finned frame to remove the heat produced by the machine losses.' }
}

function scrollExplorerTo(progress: number) {
  const wrap = document.getElementById('explorer')
  const track = wrap?.querySelector('.explorer-track') as HTMLElement | null
  if (!wrap || !track) return
  const total = track.offsetHeight - window.innerHeight
  const top = wrap.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top: top + progress * total, behavior: 'smooth' })
}

export default function MotorExplorer() {
  const { targetRef, progressRef, index } = useElementProgress(SEGMENTS)
  const { theme, palette } = useTheme()
  const reducedMotion = usePrefersReducedMotion()
  const [selected, setSelected] = useState<MotorPartId | null>(null)
  const [playing, setPlaying] = useState(true)
  const [resetSignal, setResetSignal] = useState(0)
  const webgl = hasWebGL()

  const step = (dir: number) => {
    const i = Math.min(SEGMENTS - 1, Math.max(0, Math.floor(progressRef.current * SEGMENTS)))
    const ni = Math.min(SEGMENTS - 1, Math.max(0, i + dir))
    scrollExplorerTo((ni + 0.5) / SEGMENTS)
  }

  return (
    <section id="explorer" className="explorer" style={{ borderTop: 'none' }}>
      <div ref={targetRef} className="explorer-track">
        <div className="explorer-sticky">
          <div className="scene-wrap">
            {webgl ? (
              <Suspense fallback={<div className="scene-loading">Loading 3D motor…</div>}>
                <MotorScene
                  progressRef={progressRef}
                  palette={palette}
                  theme={theme}
                  selected={selected}
                  onSelect={setSelected}
                  playing={playing}
                  resetSignal={resetSignal}
                  reducedMotion={reducedMotion}
                />
              </Suspense>
            ) : (
              <div className="scene-fallback">
                <div className="card" style={{ maxWidth: 520 }}>
                  <h3>3D view unavailable</h3>
                  <p style={{ color: 'var(--muted)' }}>
                    Your browser does not support WebGL, so the interactive motor model is hidden. The full written
                    explanation of construction, modelling, estimation, and control is available in the sections below.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="scene-overlay">
            {CAPTIONS.map((c, i) => (
              <div key={c.title} className={`caption cap-${i}${index === i ? ' is-on' : ''}`}>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>

          <div className="explorer-hud">
            <div className="hud-group" role="group" aria-label="Explode view">
              <button className="btn" onClick={() => scrollExplorerTo(0)}>Assembled view</button>
              <button className="btn" onClick={() => scrollExplorerTo(0.97)}>Exploded view</button>
            </div>
            <div className="hud-group" role="group" aria-label="Step through parts">
              <button className="btn" onClick={() => step(-1)} aria-label="Previous part">Prev</button>
              <button className="btn" onClick={() => step(1)} aria-label="Next part">Next</button>
            </div>
            <button className="btn" onClick={() => setResetSignal(s => s + 1)}>Reset view</button>
            <button className="btn" aria-pressed={playing} onClick={() => setPlaying(p => !p)}>
              {playing ? 'Pause' : 'Play'}
            </button>
          </div>

          {selected ? (
            <div className="part-info" role="status">
              <h3>{PARTS[selected].name}</h3>
              <p>{PARTS[selected].desc}</p>
            </div>
          ) : (
            <div className="explorer-hint">Scroll to explore · drag to rotate · scroll over the motor to zoom · click a part</div>
          )}
        </div>
      </div>
    </section>
  )
}
