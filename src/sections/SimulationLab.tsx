import React, { useMemo, useState } from 'react'
import { useSimulator } from '../simulation/SimulatorContext'
import { deriveFrom, type ControlMethod, type SimParams } from '../simulation/model'
import { useTheme } from '../theme/ThemeContext'
import LineChart, { type Series } from '../components/LineChart'
import { Slider, Select } from '../components/Controls'

const CONTROL_OPTIONS: { label: string; value: ControlMethod }[] = [
  { label: 'V/f (scalar)', value: 'vf' },
  { label: 'Field-Oriented (FOC)', value: 'foc' },
  { label: 'Direct Torque (DTC)', value: 'dtc' }
]

function curveFor(p: SimParams) {
  const base = deriveFrom(p, { omega: 0, thetaE: 0, t: 0 })
  const Ns = (120 * p.frequency) / p.poles
  const speed: number[] = []
  const torque: number[] = []
  const SM = 0.2
  for (let i = 0; i <= 60; i++) {
    const s = i / 60
    const te = (base.tmax * 2) / (s / SM + SM / Math.max(s, 1e-4))
    speed.push(Ns * (1 - s))
    torque.push(te)
  }
  return { speed, torque, Ns }
}

export default function SimulationLab() {
  const { params, setParam, running, toggleRun, reset, direction, toggleDirection, speedScale, setSpeedScale, tick, derivedRef, historyRef } = useSimulator()
  const { theme, palette } = useTheme()
  const [compare, setCompare] = useState<'none' | ControlMethod>('none')
  void tick

  const d = derivedRef.current
  const h = historyRef.current

  const currentSeries: Series[] = [
    { name: 'Phase A', color: palette.series.a, data: h.a },
    { name: 'Phase B', color: palette.series.b, data: h.b },
    { name: 'Phase C', color: palette.series.c, data: h.c }
  ]
  const torqueSeries: Series[] = [
    { name: 'Electromagnetic torque', color: palette.series.torque, data: h.torque },
    { name: 'Load torque (reference)', color: palette.series.ref, data: h.torque.map(() => params.loadTorque), dashed: true }
  ]
  const speedSeries: Series[] = [
    { name: 'Rotor speed', color: palette.series.speed, data: h.speed },
    { name: 'Synchronous speed (reference)', color: palette.series.ref, data: h.speed.map(() => d.Ns), dashed: true }
  ]
  const curve = useMemo(() => curveFor(params), [params])
  const opPoint = useMemo(() => ({ Nr: d.Nr, Te: d.Te }), [d.Nr, d.Te])
  const torqueSpeedSeries: Series[] = [
    { name: 'Torque–speed curve', color: palette.series.torque, data: curve.torque },
    ...(compare !== 'none'
      ? [{ name: 'Compare: ' + compare.toUpperCase(), color: palette.series.ref, data: curveFor({ ...params, control: compare }).torque, dashed: true } as Series]
      : [])
  ]

  const slipSeries: Series[] = [
    { name: 'slip vs rotor speed', color: palette.series.a, data: curve.speed.map(sp => (d.Ns > 0 ? (1 - sp / d.Ns) * 100 : 0)) }
  ]

  return (
    <div>
      <h2>Simulation lab</h2>
      <p className="note">
        Simulated values from a reduced-order model (Kloss torque–slip curve, flux ∝ V/f, single inertia). These are not
        experimental measurements. <span className="tag sim">Simulated</span>
      </p>

      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="control-grid">
          <Slider label="Supply frequency" value={params.frequency} min={5} max={60} step={1} unit="Hz" onChange={v => setParam({ frequency: v })} />
          <Slider label="Supply voltage" value={params.voltage} min={100} max={480} step={5} unit="V" onChange={v => setParam({ voltage: v })} />
          <Slider label="Load torque" value={params.loadTorque} min={0} max={80} step={0.5} unit="N·m" onChange={v => setParam({ loadTorque: v })} />
          <Select label="Number of poles" value={params.poles} options={[{ label: '2', value: 2 }, { label: '4', value: 4 }, { label: '6', value: 6 }, { label: '8', value: 8 }]} onChange={v => setParam({ poles: v })} />
          <Select label="Control method" value={params.control} options={CONTROL_OPTIONS} onChange={v => setParam({ control: v })} />
          <Slider label="Animation speed" value={speedScale} min={0.25} max={2} step={0.25} unit="×" onChange={setSpeedScale} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <button className="btn is-active" aria-pressed={running} onClick={toggleRun}>{running ? 'Pause' : 'Resume'}</button>
          <button className="btn" onClick={reset}>Reset</button>
          <button className="btn" onClick={toggleDirection}>Reverse phase sequence</button>
          <Select label="" value={compare} options={[{ label: 'Compare: off', value: 'none' as const }, ...CONTROL_OPTIONS.map(c => ({ label: 'Compare: ' + c.label, value: c.value }))]} onChange={setCompare} />
        </div>
      </div>

      <div className="readout-grid" style={{ marginTop: '1rem' }}>
        <div className="readout"><span>Synchronous speed</span><strong>{d.Ns.toFixed(0)} rpm</strong></div>
        <div className="readout"><span>Rotor speed</span><strong>{d.Nr.toFixed(0)} rpm</strong></div>
        <div className="readout"><span>Slip</span><strong>{(d.slip * 100).toFixed(2)} %</strong></div>
        <div className="readout"><span>Torque</span><strong>{d.Te.toFixed(1)} N·m</strong></div>
        <div className="readout"><span>Stator current</span><strong>{d.current.toFixed(2)} A</strong></div>
        <div className="readout"><span>Power factor</span><strong>{d.cosPhi.toFixed(2)}</strong></div>
        <div className="readout"><span>Output power</span><strong>{(d.pOut / 1000).toFixed(2)} kW</strong></div>
        <div className="readout"><span>Efficiency (approx.)</span><strong>{(d.efficiency * 100).toFixed(0)} %</strong></div>
      </div>

      <div className="chart-grid" style={{ marginTop: '1.5rem' }}>
        <div className="chart-card">
          <h4>Three-phase currents vs time</h4>
          <LineChart series={currentSeries} x={h.t} xLabel="time (s)" yLabel="current" yUnit="A" tooltipFmt={v => v.toFixed(2) + ' A'} />
        </div>
        <div className="chart-card">
          <h4>Torque vs time</h4>
          <LineChart series={torqueSeries} x={h.ts} xLabel="time (s)" yLabel="torque" yUnit="N·m" tooltipFmt={v => v.toFixed(1) + ' N·m'} />
        </div>
        <div className="chart-card">
          <h4>Rotor speed vs time</h4>
          <LineChart series={speedSeries} x={h.ts} xLabel="time (s)" yLabel="speed" yUnit="rpm" tooltipFmt={v => v.toFixed(0) + ' rpm'} />
        </div>
        <div className="chart-card">
          <h4>Electromagnetic torque vs speed</h4>
          <LineChart series={torqueSpeedSeries} x={curve.speed} xLabel="rotor speed (rpm)" yLabel="torque" yUnit="N·m" tooltipFmt={v => v.toFixed(1) + ' N·m'} />
          <p className="note" style={{ marginTop: '0.5rem' }}>Operating point (simulated): {opPoint.Nr.toFixed(0)} rpm · {opPoint.Te.toFixed(1)} N·m</p>
        </div>
        <div className="chart-card">
          <h4>Slip vs rotor speed</h4>
          <LineChart series={slipSeries} x={curve.speed} xLabel="rotor speed (rpm)" yLabel="slip" yUnit="%" tooltipFmt={v => v.toFixed(1) + ' %'} />
        </div>
      </div>

      <p className="note" style={{ marginTop: '1rem' }}>
        Theme: {theme}. Charts, readouts, and the 3D views share the same theme tokens and update from the same model.
      </p>
    </div>
  )
}
