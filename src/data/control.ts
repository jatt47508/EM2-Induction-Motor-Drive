export type Technique = {
  id: string
  name: string
  principle: string
  advantages: string[]
  limitations: string[]
  applications: string[]
}

export const techniques: Technique[] = [
  {
    id: 'scalar',
    name: 'Scalar (V/f) Control',
    principle: 'Maintains a constant ratio between supply voltage and frequency so that the air-gap flux remains approximately constant over the speed range.',
    advantages: [
      'Simple to implement and inexpensive',
      'Independent of accurate motor parameters',
      'Adequate for fan and pump type loads',
      'Widely used in industrial drives'
    ],
    limitations: [
      'Slower dynamic torque response',
      'No inherent torque/flux decoupling',
      'Lower accuracy at low speed'
    ],
    applications: ['Fans and blowers', 'Centrifugal pumps', 'General-purpose constant-speed drives']
  },
  {
    id: 'foc',
    name: 'Field-Oriented Control (FOC)',
    principle: 'Uses coordinate transformation to decouple stator current into flux-producing and torque-producing components that are controlled independently.',
    advantages: [
      'Fast and smooth torque response',
      'Decoupled flux and torque control',
      'Good low-speed performance',
      'High steady-state efficiency'
    ],
    limitations: [
      'Requires accurate motor parameters',
      'Depends on speed/flux information',
      'More complex and computationally intensive'
    ],
    applications: ['Servo drives', 'Electric vehicles', 'Machine tools', 'Precision industrial drives']
  },
  {
    id: 'dtc',
    name: 'Direct Torque Control (DTC)',
    principle: 'Selects inverter switching states directly to keep stator flux and electromagnetic torque within hysteresis bands, without a modulation stage.',
    advantages: [
      'Very fast torque response',
      'No current-loop / PWM modulator',
      'Robust to parameter variation',
      'Simple overall control structure'
    ],
    limitations: [
      'Higher torque ripple',
      'Variable switching frequency',
      'Torque/flux estimation required'
    ],
    applications: ['Traction drives', 'High-dynamic industrial drives', 'Metal rolling']
  }
]

export type ComparisonRow = { criterion: string; scalar: string; foc: string; dtc: string }

export const comparison: ComparisonRow[] = [
  { criterion: 'Control complexity', scalar: 'Low', foc: 'High', dtc: 'Moderate' },
  { criterion: 'Torque response', scalar: 'Moderate', foc: 'Fast', dtc: 'Very fast' },
  { criterion: 'Parameter sensitivity', scalar: 'Low', foc: 'High', dtc: 'Moderate' },
  { criterion: 'Torque ripple', scalar: 'Low', foc: 'Low', dtc: 'Higher' },
  { criterion: 'Typical use cases', scalar: 'Fans, pumps', foc: 'Servo, EV, precision drives', dtc: 'Traction, high-dynamic drives' }
]
