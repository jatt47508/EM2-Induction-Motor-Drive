import React from 'react'

export type Method = 'scalar' | 'foc' | 'dtc'

type Block = { x: number; y: number; w: number; h: number; lines: string[]; kind: 'ctrl' | 'power' | 'machine' | 'est' }
type Arrow = { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }

const KIND_COLOR: Record<Block['kind'], string> = {
  ctrl: 'var(--accent)',
  power: 'var(--blue)',
  machine: 'var(--heading)',
  est: 'var(--muted)'
}

const DIAGRAMS: Record<Method, { blocks: Block[]; arrows: Arrow[]; note: string }> = {
  scalar: {
    blocks: [
      { x: 16, y: 110, w: 132, h: 62, lines: ['Speed reference', '+ V/f ramp'], kind: 'ctrl' },
      { x: 196, y: 110, w: 140, h: 62, lines: ['V/f controller', '+ PWM modulator'], kind: 'ctrl' },
      { x: 384, y: 110, w: 132, h: 62, lines: ['Voltage-source', 'inverter'], kind: 'power' },
      { x: 564, y: 110, w: 140, h: 62, lines: ['Three-phase', 'induction motor'], kind: 'machine' }
    ],
    arrows: [
      { x1: 148, y1: 141, x2: 196, y2: 141 },
      { x1: 336, y1: 141, x2: 384, y2: 141 },
      { x1: 516, y1: 141, x2: 564, y2: 141 },
      { x1: 634, y1: 172, x2: 634, y2: 250, dashed: true },
      { x1: 634, y1: 250, x2: 82, y2: 250, dashed: true },
      { x1: 82, y1: 250, x2: 82, y2: 172, dashed: true }
    ],
    note: 'Voltage and frequency are varied together so the air-gap flux stays approximately constant. A speed feedback loop corrects the reference. Simple, but torque and flux are not decoupled.'
  },
  foc: {
    blocks: [
      { x: 12, y: 110, w: 104, h: 62, lines: ['ω* and i_d*', 'references'], kind: 'ctrl' },
      { x: 150, y: 110, w: 128, h: 62, lines: ['Speed and current', 'PI controllers'], kind: 'ctrl' },
      { x: 312, y: 110, w: 122, h: 62, lines: ['dq→abc', 'inverse Park'], kind: 'ctrl' },
      { x: 468, y: 110, w: 106, h: 62, lines: ['PWM +', 'inverter'], kind: 'power' },
      { x: 606, y: 110, w: 108, h: 62, lines: ['Three-phase', 'induction motor'], kind: 'machine' },
      { x: 150, y: 252, w: 128, h: 54, lines: ['abc→dq', 'Clarke + Park'], kind: 'est' },
      { x: 360, y: 252, w: 150, h: 54, lines: ['Flux / speed', 'estimator'], kind: 'est' }
    ],
    arrows: [
      { x1: 116, y1: 141, x2: 150, y2: 141 },
      { x1: 278, y1: 141, x2: 312, y2: 141 },
      { x1: 434, y1: 141, x2: 468, y2: 141 },
      { x1: 574, y1: 141, x2: 606, y2: 141 },
      { x1: 660, y1: 172, x2: 660, y2: 279, dashed: true },
      { x1: 660, y1: 279, x2: 510, y2: 279, dashed: true },
      { x1: 360, y1: 279, x2: 278, y2: 279, dashed: true },
      { x1: 214, y1: 252, x2: 214, y2: 172, dashed: true },
      { x1: 435, y1: 252, x2: 373, y2: 172, dashed: true }
    ],
    note: 'Measured currents are transformed to the rotating d-q frame, where flux (d) and torque (q) currents are controlled independently by PI loops. The inverse Park transform and PWM then generate the inverter switching signals.'
  },
  dtc: {
    blocks: [
      { x: 12, y: 110, w: 118, h: 62, lines: ['Torque T* and', 'flux ψ* refs'], kind: 'ctrl' },
      { x: 160, y: 110, w: 150, h: 62, lines: ['Torque / flux', 'hysteresis comparators'], kind: 'ctrl' },
      { x: 348, y: 110, w: 150, h: 62, lines: ['Switching table', '+ inverter'], kind: 'power' },
      { x: 540, y: 110, w: 150, h: 62, lines: ['Three-phase', 'induction motor'], kind: 'machine' },
      { x: 350, y: 250, w: 170, h: 56, lines: ['Stator flux and', 'torque estimator'], kind: 'est' }
    ],
    arrows: [
      { x1: 130, y1: 141, x2: 160, y2: 141 },
      { x1: 310, y1: 141, x2: 348, y2: 141 },
      { x1: 498, y1: 141, x2: 540, y2: 141 },
      { x1: 615, y1: 172, x2: 615, y2: 278, dashed: true },
      { x1: 615, y1: 278, x2: 520, y2: 278, dashed: true },
      { x1: 350, y1: 278, x2: 235, y2: 278, dashed: true },
      { x1: 235, y1: 278, x2: 235, y2: 172, dashed: true }
    ],
    note: 'Stator flux and torque are estimated from measured quantities and compared with references in hysteresis controllers. A switching table chooses the inverter state directly — there is no PWM modulator and no d-q current loops.'
  }
}

export default function ControlDiagram({ method }: { method: Method }) {
  const { blocks, arrows, note } = DIAGRAMS[method]
  const mid = `cd-${method}`
  return (
    <div className="viz-panel">
      <h4>Signal-flow block diagram</h4>
      <svg className="viz-svg" viewBox="0 0 724 316" role="img" aria-label={`Block diagram for ${method} control of an induction motor`}>
        <defs>
          <marker id={`${mid}-ah`} markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="var(--muted)" />
          </marker>
        </defs>
        {arrows.map((a, i) => (
          <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
            stroke="var(--muted)" strokeWidth="1.6" markerEnd={`url(#${mid}-ah)`}
            strokeDasharray={a.dashed ? '5 4' : undefined} />
        ))}
        {blocks.map((b, i) => {
          const c = KIND_COLOR[b.kind]
          return (
            <g key={i}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="9" fill="transparent" stroke={c} strokeWidth="1.8" />
              {b.lines.map((ln, j) => (
                <text key={j} x={b.x + b.w / 2} y={b.y + b.h / 2 + (j - (b.lines.length - 1) / 2) * 14 + 4}
                  textAnchor="middle" fontSize="12" fill="var(--text)">{ln}</text>
              ))}
            </g>
          )
        })}
        <text x="352" y="14" textAnchor="middle" fontSize="11" fill="var(--muted)">solid = forward signal path · dashed = feedback / measurement</text>
      </svg>
      <p className="viz-note">{note}</p>
    </div>
  )
}
