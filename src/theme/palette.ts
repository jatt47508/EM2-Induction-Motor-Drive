export type ThemeName = 'light' | 'dark'

export type Palette = {
  bg: string
  surface: string
  surface2: string
  text: string
  muted: string
  heading: string
  accent: string
  divider: string
  grid: string
  axis: string
  series: { a: string; b: string; c: string; torque: string; speed: string; ref: string }
  motor: {
    housing: string
    housingEdge: string
    core: string
    coreEdge: string
    copper: string
    rotor: string
    rotorBar: string
    shaft: string
    bearing: string
    fan: string
    field: string
    currentPos: string
    currentNeg: string
    ground: string
  }
}

export const PALETTES: Record<ThemeName, Palette> = {
  light: {
    bg: '#f7f6f1',
    surface: '#ffffff',
    surface2: '#f1efe8',
    text: '#1a1a1a',
    muted: '#4b4b4b',
    heading: '#0b1d3a',
    accent: '#1a3d73',
    divider: '#e5e3dc',
    grid: 'rgba(11,29,58,0.10)',
    axis: '#7b828c',
    series: { a: '#c0392b', b: '#1a7f4b', c: '#1f4fa8', torque: '#8e44ad', speed: '#0b7285', ref: '#9aa1ab' },
    motor: {
      housing: '#738396',
      housingEdge: '#4a586a',
      core: '#b6bfca',
      coreEdge: '#8b96a3',
      copper: '#c07c37',
      rotor: '#a8afb8',
      rotorBar: '#d0a92c',
      shaft: '#8b939f',
      bearing: '#5c6b7c',
      fan: '#47586c',
      field: '#2e6df6',
      currentPos: '#d24b34',
      currentNeg: '#2f6fd0',
      ground: '#d9d6cd'
    }
  },
  dark: {
    bg: '#0d1117',
    surface: '#141a22',
    surface2: '#1b232e',
    text: '#e6e9ee',
    muted: '#a3acb8',
    heading: '#dbe4f0',
    accent: '#7ea6e0',
    divider: '#232b36',
    grid: 'rgba(230,233,238,0.10)',
    axis: '#6f7885',
    series: { a: '#ff6b5a', b: '#4bd08b', c: '#6aa2ff', torque: '#c58bff', speed: '#39d0e0', ref: '#5d6673' },
    motor: {
      housing: '#4a5b72',
      housingEdge: '#2c3849',
      core: '#aab4c0',
      coreEdge: '#7d8895',
      copper: '#cf8a44',
      rotor: '#98a0aa',
      rotorBar: '#e0be4a',
      shaft: '#7b8592',
      bearing: '#54657a',
      fan: '#3d4c5f',
      field: '#5b9dff',
      currentPos: '#ff7358',
      currentNeg: '#5b9dff',
      ground: '#11161d'
    }
  }
}
