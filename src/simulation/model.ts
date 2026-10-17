/**
 * Simplified induction-motor model used for the interactive lab.
 *
 * IMPORTANT: All quantities below are SIMULATED values from a reduced-order
 * model, not experimental measurements. The model is intentionally simple and
 * is documented so the assumptions are explicit.
 *
 * Core relations:
 *   Synchronous speed   Ns = 120 f / P            (rev/min)
 *   Slip                s  = (Ns - Nr) / Ns
 *   Torque (Kloss)      Te = Tmax * 2 / (s/smax + smax/s)
 *
 * Approximations / assumptions:
 *   - Steady torque-slip shape (Kloss) with s_max = 0.20 (typical small IM).
 *   - Max torque scales with flux^2. For V/f control flux ~ (V/f) relative to
 *     the rated V/f, so Tmax = Tmax_rated * (V/f)^2. FOC/DTC are assumed to
 *     hold flux constant (Tmax = Tmax_rated) as long as enough voltage is
 *     available.
 *   - Mechanical dynamics: J dw/dt = Te - TL - B*w (single inertia).
 *   - Stator current magnitude grows from a no-load (magnetising) value with
 *     the load component, I = sqrt(I0^2 + (k*Te/flux)^2).
 *   - No magnetic saturation effects; sinusoidal supply; balanced phases.
 */

import type { ThemeName } from '../theme/palette'
export type { ThemeName }

export type ControlMethod = 'vf' | 'foc' | 'dtc'

export type SimParams = {
  frequency: number // Hz
  voltage: number // V (line-to-line, rms)
  poles: number // 2, 4, 6, 8
  loadTorque: number // N.m
  control: ControlMethod
}

export type SimState = {
  omega: number // mechanical rotor speed, rad/s
  thetaE: number // electrical angle, rad (unwrapped)
  t: number // simulated time, s
}

export type Derived = {
  Ns: number // synchronous speed, rpm
  Nr: number // rotor speed, rpm
  slip: number // per-unit
  Te: number // electromagnetic torque, N.m
  Tl: number // load torque, N.m
  current: number // stator rms current estimate, A
  cosPhi: number
  pOut: number // mechanical output power, W
  pIn: number // electrical input power estimate, W
  efficiency: number // 0..1
  flux: number // relative flux (1 = rated)
  tmax: number // available breakdown torque, N.m
  phase: { a: number; b: number; c: number } // instantaneous phase currents, A
}

/** Reference (nameplate-like) values used to anchor the model. */
export const RATED = {
  voltage: 400, // V line-to-line
  frequency: 50, // Hz
  poles: 4,
  power: 4000, // W shaft
  speed: 1440, // rpm at rated load
  current: 8.5, // A rated
  cosPhi: 0.85
}

const S_MAX = 0.2 // slip at breakdown torque
const TMAX_RATIO = 2.5 // breakdown torque / rated torque
const INERTIA = 0.06 // kg.m^2 (small motor + load)
const VISCOUS = 0.004 // N.m.s
const NO_LOAD_FRACTION = 0.35 // I0 / I_rated

const N_S_RATED = (120 * RATED.frequency) / RATED.poles
const OMEGA_RATED = (2 * Math.PI * RATED.speed) / 60
const T_RATED = RATED.power / OMEGA_RATED
const TMAX_RATED = TMAX_RATIO * T_RATED
const I0 = NO_LOAD_FRACTION * RATED.current
const LOAD_CURRENT_K = RATED.current * Math.sqrt(1 - NO_LOAD_FRACTION * NO_LOAD_FRACTION) / T_RATED

export function ratedInfo() {
  return { N_S_RATED, T_RATED, TMAX_RATED, RATED_SPEED: RATED.speed }
}

function fluxFactor(p: SimParams): number {
  const base = RATED.voltage / RATED.frequency
  const requested = p.voltage / Math.max(p.frequency, 1)
  const raw = requested / base
  // Reasonable control practice: avoid over-flux; FOC/DTC regulate flux ~1.
  if (p.control === 'vf') return Math.min(raw, 1.3)
  return Math.min(raw, 1.0)
}

function tmax(p: SimParams, flux: number): number {
  // Over a wide frequency range V/f keeps flux ~ constant; below base speed the
  // available breakdown torque is limited by voltage, above it by the field.
  return TMAX_RATED * flux * flux
}

function klossTorque(s: number, tmaxVal: number): number {
  const sm = S_MAX
  const denom = s / sm + sm / s
  if (!isFinite(denom) || Math.abs(s) < 1e-6) return 0
  return (tmaxVal * 2) / denom
}

export function initialDerived(p: SimParams): Derived {
  return deriveFrom(p, { omega: 0, thetaE: 0, t: 0 })
}

export function deriveFrom(p: SimParams, st: SimState): Derived {
  const Ns = (120 * p.frequency) / p.poles
  const omegaS = (2 * Math.PI * Ns) / 60
  const Nr = (st.omega * 60) / (2 * Math.PI)
  const slip = omegaS > 0 ? (omegaS - st.omega) / omegaS : 0
  const flux = p.control === 'vf' ? fluxFactor(p) : 1
  const tmaxVal = tmax(p, flux)
  const Te = klossTorque(slip, tmaxVal)

  const loadComponent = (Math.abs(Te) / T_RATED) * LOAD_CURRENT_K
  const current = Math.sqrt(I0 * I0 + loadComponent * loadComponent)
  const cosPhi = Math.min(0.95, 0.25 + 0.6 * Math.min(1, Math.abs(Te) / T_RATED))

  const pOut = Math.max(0, Te * st.omega)
  const pIn = Math.max(1e-6, Math.sqrt(3) * p.voltage * current * cosPhi)
  const efficiency = Math.max(0, Math.min(0.95, pOut / pIn))

  const peak = Math.SQRT2 * current
  const th = st.thetaE
  const w = (2 * Math.PI) / 3
  const phase = {
    a: peak * Math.sin(th),
    b: peak * Math.sin(th - w),
    c: peak * Math.sin(th + w)
  }

  return { Ns, Nr, slip, Te, Tl: p.loadTorque, current, cosPhi, pOut, pIn, efficiency, flux, tmax: tmaxVal, phase }
}

export function stepSim(p: SimParams, st: SimState, dt: number, phaseDirection: 1 | -1): { state: SimState; derived: Derived } {
  const d0 = deriveFrom(p, st)
  const Te = d0.Te
  // Mechanical integration (semi-implicit Euler)
  const alpha = (Te - p.loadTorque - VISCOUS * st.omega) / INERTIA
  const omega = Math.max(0, st.omega + alpha * dt)
  const thetaE = st.thetaE + phaseDirection * 2 * Math.PI * p.frequency * dt
  const next: SimState = { omega, thetaE, t: st.t + dt }
  return { state: next, derived: deriveFrom(p, next) }
}
