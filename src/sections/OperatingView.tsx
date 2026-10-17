import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { useSimulator } from '../simulation/SimulatorContext'
import { useTheme } from '../theme/ThemeContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { hasWebGL } from '../utils/webgl'
import LineChart, { type Series } from '../components/LineChart'
import { Slider } from '../components/Controls'

const OperatingScene = lazy(() => import('../three/OperatingScene'))
const MemoScene = React.memo(function MemoScene(props: any) {
  return <OperatingScene {...props} />
})

export default function OperatingView() {
  const { params, simRef, derivedRef, historyRef, running, toggleRun, direction, toggleDirection, speedScale, setSpeedScale, tick, reset } = useSimulator()
  const { palette } = useTheme()
  const reducedMotion = usePrefersReducedMotion()
  const [phaseDeg, setPhaseDeg] = useState(0)
  const phaseOffsetRef = useRef(0)
  const paramsRef = useRef(params)
  paramsRef.current = params
  void tick

  useEffect(() => {
    phaseOffsetRef.current = (phaseDeg * Math.PI) / 180
  }, [phaseDeg])

  const d = derivedRef.current
  const h = historyRef.current

  const waveSeries: Series[] = useMemo(
    () => [
      { name: 'iA', color: palette.series.a, data: h.a },
      { name: 'iB', color: palette.series.b, data: h.b },
      { name: 'iC', color: palette.series.c, data: h.c }
    ],
    [tick, palette]
  )

  const webgl = hasWebGL()

  return (
    <div>
      <h2>Operating principle</h2>
      <p style={{ color: 'var(--muted)', maxWidth: '900px' }}>
        Three phase windings, displaced 120° apart, carry three currents displaced by 120° electrical degrees. Their
        combined mmf produces a magnetic field rotating at synchronous speed. This field sweeps past the rotor bars,
        inducing an EMF and hence a current in them, and the interaction between the rotor current and the field
        produces electromagnetic torque.
      </p>

      <div className="op-layout" style={{ marginTop: '1rem' }}>
        <div className="op-scene">
          {webgl ? (
            <Suspense fallback={<div className="scene-loading">Loading field view…</div>}>
              <MemoScene
                simRef={simRef}
                derivedRef={derivedRef}
                paramsRef={paramsRef}
                palette={palette}
                phaseOffsetRef={phaseOffsetRef}
                reducedMotion={reducedMotion}
              />
            </Suspense>
          ) : (
            <div className="scene-fallback">
              <p style={{ color: 'var(--muted)' }}>WebGL is unavailable — the animated field view is hidden, but the waveforms and values below still update.</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem' }}>Controls</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.6rem 0' }}>
            <button className="btn is-active" aria-pressed={running} onClick={toggleRun}>{running ? 'Pause' : 'Resume'}</button>
            <button className="btn" onClick={toggleDirection}>Reverse phase sequence</button>
            <button className="btn" onClick={reset}>Reset</button>
          </div>
          <Slider label="Electrical phase offset" value={phaseDeg} min={-180} max={180} step={5} unit="°" onChange={setPhaseDeg} />
          <Slider label="Animation speed" value={speedScale} min={0.25} max={2} step={0.25} unit="×" onChange={setSpeedScale} />
          <div className="readout-grid" style={{ marginTop: '0.8rem' }}>
            <div className="readout"><span>Synchronous speed</span><strong>{d.Ns.toFixed(0)} rpm</strong></div>
            <div className="readout"><span>Rotor speed</span><strong>{d.Nr.toFixed(0)} rpm</strong></div>
            <div className="readout"><span>Slip</span><strong>{(d.slip * 100).toFixed(2)} %</strong></div>
            <div className="readout"><span>Torque</span><strong>{d.Te.toFixed(1)} N·m</strong></div>
            <div className="readout"><span>Phase sequence</span><strong>{direction === 1 ? 'A–B–C' : 'A–C–B'}</strong></div>
            <div className="readout"><span>iA (now)</span><strong>{d.phase.a.toFixed(2)} A</strong></div>
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginTop: '1.25rem' }}>
        <h4>Three-phase currents vs time</h4>
        <LineChart series={waveSeries} x={h.t} xLabel="time (s)" yLabel="current" yUnit="A" tooltipFmt={v => v.toFixed(2) + ' A'} />
      </div>
    </div>
  )
}
