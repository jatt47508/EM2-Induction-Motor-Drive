import React, { useId, useMemo, useState } from 'react'

type Kind = 'current' | 'flux'

const OX = 74
const OY = 252
const L = 178
const MAX_MAG = 1.2

export default function DqVector() {
  const [kind, setKind] = useState<Kind>('current')
  const [angle, setAngle] = useState(35)
  const [mag, setMag] = useState(0.9)
  const uid = useId().replace(/[:]/g, '')

  const comp = useMemo(() => {
    const dc = mag * Math.cos((angle * Math.PI) / 180)
    const qc = mag * Math.sin((angle * Math.PI) / 180)
    return { dc, qc, tipX: OX + (dc / MAX_MAG) * L, tipY: OY - (qc / MAX_MAG) * L }
  }, [angle, mag])

  const isCurrent = kind === 'current'
  const vecColor = isCurrent ? 'var(--blue)' : 'var(--accent)'
  const dl = isCurrent ? 'i_d' : 'ψ_d'
  const ql = isCurrent ? 'i_q' : 'ψ_q'
  const main = isCurrent ? 'i_s' : 'ψ_s'

  const arcTipX = OX + 54 * Math.cos((angle * Math.PI) / 180)
  const arcTipY = OY - 54 * Math.sin((angle * Math.PI) / 180)
  const arcPath = `M ${OX + 54} ${OY} A 54 54 0 0 1 ${arcTipX} ${arcTipY}`

  return (
    <div className="viz-panel">
      <h4>d–q reference-frame vector</h4>
      <div className="viz-tabs" role="tablist" aria-label="Vector type">
        <button className="btn" role="tab" aria-selected={isCurrent} onClick={() => setKind('current')} style={isCurrent ? { background: 'var(--accent)', color: 'var(--accent-contrast)', borderColor: 'var(--accent)' } : undefined}>Current vector</button>
        <button className="btn" role="tab" aria-selected={!isCurrent} onClick={() => setKind('flux')} style={!isCurrent ? { background: 'var(--accent)', color: 'var(--accent-contrast)', borderColor: 'var(--accent)' } : undefined}>Flux vector</button>
      </div>

      <svg className="viz-svg" viewBox="0 0 380 300" role="img" aria-label={`d-q ${kind} vector, angle ${angle} degrees, magnitude ${mag.toFixed(2)}`}>
        <defs>
          <marker id={'ah' + uid} markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill={vecColor} />
          </marker>
        </defs>

        <line x1="30" y1={OY} x2="364" y2={OY} stroke="var(--divider)" strokeWidth="2" />
        <line x1={OX} y1="286" x2={OX} y2="18" stroke="var(--divider)" strokeWidth="2" />
        <text x="356" y={OY - 10} textAnchor="end" fontSize="13" fill="var(--muted)">d-axis</text>
        <text x={OX + 8} y="26" fontSize="13" fill="var(--muted)">q-axis</text>

        <line x1={comp.tipX} y1={comp.tipY} x2={comp.tipX} y2={OY} stroke="var(--muted)" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
        <line x1={comp.tipX} y1={comp.tipY} x2={OX} y2={comp.tipY} stroke="var(--muted)" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />

        <line x1={OX} y1={OY} x2={comp.tipX} y2={OY} stroke={vecColor} strokeWidth="4" opacity="0.55" />
        <line x1={OX} y1={OY} x2={OX} y2={comp.tipY} stroke={vecColor} strokeWidth="4" opacity="0.55" />
        <text x={(OX + comp.tipX) / 2} y={OY + 20} textAnchor="middle" fontSize="12" fill={vecColor}>{dl} = {comp.dc.toFixed(2)}</text>
        <text x={OX - 8} y={(OY + comp.tipY) / 2} textAnchor="end" fontSize="12" fill={vecColor}>{ql} = {comp.qc.toFixed(2)}</text>

        <path d={arcPath} fill="none" stroke="var(--muted)" strokeWidth="1.5" />
        <text x={OX + 62} y={OY - 16} fontSize="12" fill="var(--muted)">θ = {angle}°</text>

        <line x1={OX} y1={OY} x2={comp.tipX} y2={comp.tipY} stroke={vecColor} strokeWidth="3.5" markerEnd={'url(#ah' + uid + ')'} />
        <circle cx={OX} cy={OY} r="4" fill="var(--heading)" />
        <text x={comp.tipX + 8} y={comp.tipY - 6} fontSize="12" fill={vecColor} fontWeight="600">{main}</text>
      </svg>

      <div className="viz-controls">
        <div className="control">
          <label htmlFor="dq-angle">Vector angle θ <output>{angle}°</output></label>
          <input id="dq-angle" type="range" min={0} max={90} step={1} value={angle} onChange={e => setAngle(Number(e.target.value))} />
        </div>
        <div className="control">
          <label htmlFor="dq-mag">Magnitude <output>{mag.toFixed(2)} p.u.</output></label>
          <input id="dq-mag" type="range" min={0.1} max={1.2} step={0.05} value={mag} onChange={e => setMag(Number(e.target.value))} />
        </div>
      </div>

      <div className="readout-grid" style={{ marginTop: '1rem' }}>
        <div className="readout"><span>{dl}</span><strong>{comp.dc.toFixed(2)}</strong></div>
        <div className="readout"><span>{ql}</span><strong>{comp.qc.toFixed(2)}</strong></div>
        <div className="readout"><span>Angle θ</span><strong>{angle}°</strong></div>
        <div className="readout"><span>|vector|</span><strong>{mag.toFixed(2)}</strong></div>
      </div>

      <p className="viz-note">
        In field-oriented control the stator quantities are expressed in a frame that rotates with the rotor flux.
        The d-axis is aligned with the flux, so {isCurrent ? 'i_d' : 'ψ_d'} controls flux and {isCurrent ? 'i_q' : 'ψ_q'} controls
        torque, decoupling the two. Induction-motor models and parameter estimation operate in this frame; the
        diagram shows how the {isCurrent ? 'current' : 'flux'} vector decomposes into its d and q components.
      </p>
    </div>
  )
}
