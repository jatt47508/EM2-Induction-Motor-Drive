import React from 'react'

export function Slider({
  label, value, min, max, step, unit, onChange
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="control">
      <label htmlFor={'s-' + label}>
        <span>{label}</span>
        <output>{value}{unit ? ' ' + unit : ''}</output>
      </label>
      <input
        id={'s-' + label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
    </div>
  )
}

export function Select<T extends string | number>({
  label, value, options, onChange
}: {
  label: string
  value: T
  options: { label: string; value: T }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="control">
      <label htmlFor={'sel-' + label}><span>{label}</span></label>
      <select
        id={'sel-' + label}
        value={value}
        onChange={e => {
          const raw = e.target.value
          const match = options.find(o => String(o.value) === raw)
          if (match) onChange(match.value)
        }}
      >
        {options.map(o => (
          <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
