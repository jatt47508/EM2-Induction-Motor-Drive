export type NavLink = { id: string; label: string }

export const sections: NavLink[] = [
  { id: 'explorer', label: '3D Motor' },
  { id: 'operating', label: 'Operating' },
  { id: 'simulation', label: 'Simulation' },
  { id: 'overview', label: 'Overview' },
  { id: 'literature-review', label: 'Literature' },
  { id: 'control', label: 'Control' },
  { id: 'research-gap', label: 'Research Gap' },
  { id: 'references', label: 'References' }
]

export const allSectionIds = [
  'explorer',
  'operating',
  'simulation',
  'overview',
  'introduction',
  'background',
  'literature-review',
  'control',
  'contributions',
  'research-gap',
  'conclusion',
  'resources',
  'references'
]
