import React, { useMemo, useRef, useState } from 'react'

export type Series = { name: string; color: string; data: number[]; dashed?: boolean }

type Props = {
  series: Series[]
  x: number[]
  xLabel: string
  yLabel: string
  height?: number
  yUnit?: string
  yMin?: number
  yMax?: number
  tooltipFmt?: (v: number) => string
}

const W = 620
const PAD = { l: 52, r: 16, t: 14, b: 34 }

export default function LineChart({ series, x, xLabel, yLabel, height = 260, yUnit = '', yMin, yMax, tooltipFmt }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const H = height
  const iw = W - PAD.l - PAD.r
  const ih = H - PAD.t - PAD.b

  const { lo, hi } = useMemo(() => {
    let l = Infinity
    let h = -Infinity
    series.forEach(s => s.data.forEach(v => { if (isFinite(v)) { l = Math.min(l, v); h = Math.max(h, v) } }))
    if (!isFinite(l)) { l = 0; h = 1 }
    if (l === h) { l -= 1; h += 1 }
    const pad = (h - l) * 0.08
    let lo = l - pad
    let hi = h + pad
    if (yMin !== undefined) lo = yMin
    if (yMax !== undefined) hi = yMax
    return { lo, hi }
  }, [series, yMin, yMax])

  const xLo = x.length ? x[0] : 0
  const xHi = x.length ? x[x.length - 1] : 1
  const n = x.length

  const sx = (i: number) => PAD.l + (n <= 1 ? 0 : (i / (n - 1)) * iw)
  const sy = (v: number) => PAD.t + ih - ((v - lo) / (hi - lo)) * ih

  const path = (data: number[]) => {
    if (!data.length) return ''
    let d = ''
    for (let i = 0; i < data.length; i++) {
      const v = data[i]
      if (!isFinite(v)) continue
      d += (i === 0 ? 'M' : 'L') + sx(i).toFixed(1) + ' ' + sy(v).toFixed(1) + ' '
    }
    return d.trim()
  }

  const ticks = 5
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => lo + (i / ticks) * (hi - lo))
  const xTicks = Array.from({ length: ticks + 1 }, (_, i) => xLo + (i / ticks) * (xHi - xLo))
  const xSpan = Math.abs(xHi - xLo)
  const xDec = xSpan < 0.5 ? 3 : xSpan < 5 ? 2 : 1

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
    const frac = (e.clientX - rect.left) / rect.width
    const ux = (frac * W - PAD.l) / iw
    const idx = Math.round(ux * (n - 1))
    setHover(Math.min(n - 1, Math.max(0, idx)))
  }

  const fmt = tooltipFmt || ((v: number) => v.toFixed(2))

  return (
    <div ref={wrap} style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img" aria-label={yLabel + ' chart'}>
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={sy(t)} y2={sy(t)} stroke="var(--divider)" strokeWidth="1" />
            <text x={PAD.l - 8} y={sy(t) + 4} textAnchor="end" fontSize="10" fill="var(--muted)">{t.toFixed(Math.abs(hi - lo) < 5 ? 1 : 0)}</text>
          </g>
        ))}
        {xTicks.map((t, i) => (
          <text key={i} x={sx((i / ticks) * (n - 1))} y={H - 12} textAnchor="middle" fontSize="10" fill="var(--muted)">{t.toFixed(xDec)}</text>
        ))}
        <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + ih} y2={PAD.t + ih} stroke="var(--axis, var(--muted))" strokeWidth="1" />
        <text x={W / 2} y={H - 1} textAnchor="middle" fontSize="10" fill="var(--muted)">{xLabel}</text>
        <text x={12} y={H / 2} textAnchor="middle" fontSize="10" fill="var(--muted)" transform={`rotate(-90 12 ${H / 2})`}>{yLabel}{yUnit ? ' (' + yUnit + ')' : ''}</text>

        {series.map(s => (
          <path key={s.name} d={path(s.data)} fill="none" stroke={s.color} strokeWidth="2" strokeDasharray={s.dashed ? '5 4' : undefined} strokeLinejoin="round" />
        ))}

        {hover !== null && (
          <g>
            <line x1={sx(hover)} x2={sx(hover)} y1={PAD.t} y2={PAD.t + ih} stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" />
            {series.map(s => (
              <circle key={s.name} cx={sx(hover)} cy={sy(s.data[hover])} r="3.4" fill={s.color} />
            ))}
          </g>
        )}
      </svg>

      <div className="chart-legend">
        {series.map(s => (
          <span key={s.name}><i style={{ background: s.color }} />{s.name}</span>
        ))}
      </div>

      {hover !== null && (
        <div style={{ position: 'absolute', top: 6, right: 6, background: 'var(--surface)', border: '1px solid var(--divider)', borderRadius: 10, padding: '0.45rem 0.6rem', fontSize: '0.78rem', boxShadow: 'var(--shadow-sm)', pointerEvents: 'none' }}>
          <div style={{ color: 'var(--muted)' }}>t = {x[hover]?.toFixed(xDec)} s</div>
          {series.map(s => (
            <div key={s.name}><i className="chart-tip-dot" style={{ background: s.color }} /> {s.name}: <strong style={{ color: 'var(--heading)' }}>{fmt(s.data[hover])}</strong></div>
          ))}
        </div>
      )}
    </div>
  )
}
