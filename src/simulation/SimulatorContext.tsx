import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  deriveFrom,
  initialDerived,
  stepSim,
  type Derived,
  type SimParams,
  type SimState
} from './model'

export type History = {
  /** fast buffer (currents) - sampled every integration step */
  t: number[]
  a: number[]
  b: number[]
  c: number[]
  /** slow buffer (mechanical) - decimated for a longer window */
  ts: number[]
  torque: number[]
  speed: number[]
}

const DT = 1 / 1000 // fine step so 50 Hz currents are not aliased
const SLOW_EVERY = 20 // 50 Hz mechanical sampling
const MAX_FAST = 150 // ~0.15 s window for currents
const MAX_SLOW = 260 // ~5 s window for torque/speed

function emptyHistory(): History {
  return { t: [], a: [], b: [], c: [], ts: [], torque: [], speed: [] }
}

type SimContextValue = {
  params: SimParams
  setParam: (patch: Partial<SimParams>) => void
  reset: () => void
  running: boolean
  toggleRun: () => void
  direction: 1 | -1
  toggleDirection: () => void
  speedScale: number
  setSpeedScale: (s: number) => void
  tick: number
  simRef: React.MutableRefObject<SimState>
  derivedRef: React.MutableRefObject<Derived>
  historyRef: React.MutableRefObject<History>
  curve: { speed: number[]; torque: number[] }
}

const SimContext = createContext<SimContextValue | null>(null)

export const DEFAULT_PARAMS: SimParams = {
  frequency: 50,
  voltage: 400,
  poles: 4,
  loadTorque: 15,
  control: 'vf'
}

function buildCurve(p: SimParams) {
  const speed: number[] = []
  const torque: number[] = []
  const Ns = (120 * p.frequency) / p.poles
  const base = deriveFrom(p, { omega: 0, thetaE: 0, t: 0 })
  const SM = 0.2
  for (let i = 0; i <= 60; i++) {
    const s = i / 60
    const te = (base.tmax * 2) / (s / SM + SM / Math.max(s, 1e-4))
    speed.push(Ns * (1 - s))
    torque.push(te)
  }
  return { speed, torque }
}

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const [params, setParams] = useState<SimParams>(DEFAULT_PARAMS)
  const [running, setRunning] = useState(true)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [speedScale, setSpeedScale] = useState(1)
  const [tick, setTick] = useState(0)

  const simRef = useRef<SimState>({ omega: 0, thetaE: 0, t: 0 })
  const derivedRef = useRef<Derived>(initialDerived(DEFAULT_PARAMS))
  const historyRef = useRef<History>(emptyHistory())

  const paramsRef = useRef(params)
  const runningRef = useRef(running)
  const directionRef = useRef(direction)
  const speedRef = useRef(speedScale)

  paramsRef.current = params
  runningRef.current = running
  directionRef.current = direction
  speedRef.current = speedScale

  const reset = useCallback(() => {
    simRef.current = { omega: 0, thetaE: 0, t: 0 }
    historyRef.current = emptyHistory()
    derivedRef.current = deriveFrom(paramsRef.current, simRef.current)
    setTick(t => t + 1)
  }, [])

  useEffect(() => {
    derivedRef.current = deriveFrom(params, simRef.current)
    setTick(t => t + 1)
  }, [params])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let acc = 0
    let sinceTick = 0
    let stepCount = 0

    const loop = (now: number) => {
      const real = Math.min((now - last) / 1000, 0.05)
      last = now
      if (runningRef.current) {
        acc += real * speedRef.current
        let guard = 0
        while (acc >= DT && guard < 2000) {
          const { state, derived } = stepSim(paramsRef.current, simRef.current, DT, directionRef.current)
          simRef.current = state
          derivedRef.current = derived
          acc -= DT
          guard++
          stepCount++
          const h = historyRef.current
          h.t.push(state.t)
          h.a.push(derived.phase.a)
          h.b.push(derived.phase.b)
          h.c.push(derived.phase.c)
          if (h.t.length > MAX_FAST) { h.t.shift(); h.a.shift(); h.b.shift(); h.c.shift() }
          if (stepCount % SLOW_EVERY === 0) {
            h.ts.push(state.t)
            h.torque.push(derived.Te)
            h.speed.push(derived.Nr)
            if (h.ts.length > MAX_SLOW) { h.ts.shift(); h.torque.shift(); h.speed.shift() }
          }
        }
        sinceTick += real
        if (sinceTick > 0.08) {
          sinceTick = 0
          setTick(t => t + 1)
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const setParam = useCallback((patch: Partial<SimParams>) => setParams(prev => ({ ...prev, ...patch })), [])
  const toggleRun = useCallback(() => setRunning(r => !r), [])
  const toggleDirection = useCallback(() => setDirection(d => (d === 1 ? -1 : 1)), [])

  const curve = useMemo(() => buildCurve(params), [params])

  const value = useMemo<SimContextValue>(
    () => ({
      params, setParam, reset, running, toggleRun,
      direction, toggleDirection, speedScale, setSpeedScale,
      tick, simRef, derivedRef, historyRef, curve
    }),
    [params, setParam, reset, running, toggleRun, direction, toggleDirection, speedScale, tick, curve]
  )

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>
}

export function useSimulator(): SimContextValue {
  const ctx = useContext(SimContext)
  if (!ctx) throw new Error('useSimulator must be used within SimulatorProvider')
  return ctx
}
