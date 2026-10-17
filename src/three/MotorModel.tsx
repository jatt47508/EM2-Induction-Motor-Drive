import React, { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Palette } from '../theme/palette'

export type MotorPartId =
  | 'housing'
  | 'stator'
  | 'windings'
  | 'rotor'
  | 'shaft'
  | 'bearingFront'
  | 'bearingBack'
  | 'fan'

type Props = {
  progressRef: React.MutableRefObject<number>
  palette: Palette
  selected: MotorPartId | null
  onSelect: (id: MotorPartId | null) => void
  playing: boolean
  reducedMotion: boolean
  onHover?: (hovering: boolean) => void
}

const AXIS = Math.PI / 2 // align cylinders (default +Y) to +X

const EXPLODE = 0.74 // global scale on explode offsets to keep parts in frame

// Explode offsets for each group (world units, applied at full explode)
const OFFSETS: Record<string, [number, number, number]> = {
  housing: [0, 2.0, 0],
  endFront: [1.9, 1.4, 0],
  endBack: [-1.9, 1.4, 0],
  windings: [0, 1.05, 0],
  stator: [0, -1.5, 0],
  rotor: [0, 0, 1.9],
  shaft: [0, 0, -1.9],
  bearingFront: [2.3, 0.8, 0],
  bearingBack: [-2.3, 0.8, 0],
  fan: [-2.9, 0, 0]
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function useMaterial(color: string, selected: boolean, base: THREE.MeshStandardMaterialParameters = {}) {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: base.metalness ?? 0.7,
        roughness: base.roughness ?? 0.42,
        emissive: new THREE.Color(selected ? '#2e6df6' : '#000000'),
        emissiveIntensity: selected ? 0.35 : 0
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color, selected, base.metalness, base.roughness]
  )
  return mat
}

export default function MotorModel({ progressRef, palette, selected, onSelect, playing, reducedMotion, onHover }: Props) {
  const root = useRef<THREE.Group>(null)
  const spin = useRef(0)
  const groups = {
    housing: useRef<THREE.Group>(null),
    endFront: useRef<THREE.Group>(null),
    endBack: useRef<THREE.Group>(null),
    windings: useRef<THREE.Group>(null),
    stator: useRef<THREE.Group>(null),
    rotor: useRef<THREE.Group>(null),
    shaft: useRef<THREE.Group>(null),
    bearingFront: useRef<THREE.Group>(null),
    bearingBack: useRef<THREE.Group>(null),
    fan: useRef<THREE.Group>(null)
  }
  const fieldRef = useRef<THREE.Group>(null)
  const barsRef = useRef<THREE.Group>(null)
  const [showLabels, setShowLabels] = useState(false)

  const m = palette.motor
  const matHousing = useMaterial(m.housing, selected === 'housing', { metalness: 0.75, roughness: 0.38 })
  const matCore = useMaterial(m.core, selected === 'stator', { metalness: 0.85, roughness: 0.35 })
  const matCopper = useMaterial(m.copper, selected === 'windings', { metalness: 0.9, roughness: 0.3 })
  const matRotor = useMaterial(m.rotor, selected === 'rotor', { metalness: 0.85, roughness: 0.38 })
  const matBar = useMaterial(m.rotorBar, selected === 'rotor', { metalness: 0.9, roughness: 0.3 })
  const matShaft = useMaterial(m.shaft, selected === 'shaft', { metalness: 0.9, roughness: 0.25 })
  const matBearing = useMaterial(m.bearing, selected === 'bearingFront' || selected === 'bearingBack', { metalness: 0.8, roughness: 0.4 })
  const matFan = useMaterial(m.fan, selected === 'fan', { metalness: 0.6, roughness: 0.5 })

  const rotorBars = useMemo(() => Array.from({ length: 20 }, (_, i) => (i / 20) * Math.PI * 2), [])
  const slugs = useMemo(() => Array.from({ length: 18 }, (_, i) => -1.35 + i * 0.16), [])
  const fanBlades = useMemo(() => Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2), [])
  const fins = useMemo(() => Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2), [])

  useFrame((state, delta) => {
    const p = progressRef.current
    const e = smoothstep(0.2, 0.68, p) // explode factor
    const d = Math.min(delta, 0.05)

    if (playing && !reducedMotion) spin.current += d * 0.55

    if (root.current) {
      root.current.rotation.y = 0.5 + p * 0.5
      root.current.rotation.x = -0.1 + p * 0.05
    }

    const apply = (ref: React.RefObject<THREE.Group | null>, key: string, mult = 1) => {
      const g = ref.current
      if (!g) return
      const [x, y, z] = OFFSETS[key]
      const k = e * mult * EXPLODE
      // smooth lerp toward target keeps reversal smooth
      g.position.x += (x * k - g.position.x) * Math.min(1, d * 8)
      g.position.y += (y * k - g.position.y) * Math.min(1, d * 8)
      g.position.z += (z * k - g.position.z) * Math.min(1, d * 8)
    }
    apply(groups.housing, 'housing')
    apply(groups.endFront, 'endFront')
    apply(groups.endBack, 'endBack')
    apply(groups.windings, 'windings')
    apply(groups.stator, 'stator')
    apply(groups.rotor, 'rotor')
    apply(groups.shaft, 'shaft')
    apply(groups.bearingFront, 'bearingFront')
    apply(groups.bearingBack, 'bearingBack')
    apply(groups.fan, 'fan')

    if (!reducedMotion) {
      if (barsRef.current) barsRef.current.rotation.x = spin.current
      if (groups.fan.current) groups.fan.current.rotation.x = spin.current
    }

    const showField = p > 0.82
    if (fieldRef.current) {
      fieldRef.current.visible = showField
      if (showField && !reducedMotion) fieldRef.current.rotation.x = spin.current * 3
    }

    const wantLabels = e > 0.55
    if (wantLabels !== showLabels) setShowLabels(wantLabels)
  })

  const stop = (fn: () => void) => (e: any) => {
    e.stopPropagation()
    fn()
  }

  return (
    <group
      ref={root}
      dispose={null}
      scale={0.84}
      onPointerOver={e => { e.stopPropagation(); onHover?.(true) }}
      onPointerOut={() => onHover?.(false)}
    >
      {/* Housing shell + fins */}
      <group ref={groups.housing} onClick={stop(() => onSelect(selected === 'housing' ? null : 'housing'))}>
        <mesh rotation={[0, 0, AXIS]} material={matHousing} castShadow>
          <cylinderGeometry args={[1.4, 1.4, 3.0, 48, 1, true]} />
        </mesh>
        {fins.map((a, i) => (
          <mesh key={i} position={[0, Math.cos(a) * 1.44, Math.sin(a) * 1.44]} rotation={[a, 0, 0]} material={matHousing}>
            <boxGeometry args={[2.8, 0.14, 0.08]} />
          </mesh>
        ))}
      </group>

      {/* End plates */}
      <group ref={groups.endFront} onClick={stop(() => onSelect(selected === 'housing' ? null : 'housing'))}>
        <mesh position={[1.52, 0, 0]} rotation={[0, 0, AXIS]} material={matHousing} castShadow>
          <cylinderGeometry args={[1.4, 1.4, 0.12, 40]} />
        </mesh>
      </group>
      <group ref={groups.endBack} onClick={stop(() => onSelect(selected === 'housing' ? null : 'housing'))}>
        <mesh position={[-1.52, 0, 0]} rotation={[0, 0, AXIS]} material={matHousing} castShadow>
          <cylinderGeometry args={[1.4, 1.4, 0.12, 40]} />
        </mesh>
      </group>

      {/* Stator core (laminated) */}
      <group ref={groups.stator} onClick={stop(() => onSelect(selected === 'stator' ? null : 'stator'))}>
        <mesh rotation={[0, 0, AXIS]} material={matCore} castShadow>
          <cylinderGeometry args={[1.18, 1.18, 2.7, 48, 1, false]} />
        </mesh>
        {slugs.map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, AXIS]} material={matCore}>
            <torusGeometry args={[1.19, 0.012, 6, 40]} />
          </mesh>
        ))}
      </group>

      {/* Stator windings (copper slots + end windings) */}
      <group ref={groups.windings} onClick={stop(() => onSelect(selected === 'windings' ? null : 'windings'))}>
        {Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2).map((a, i) => (
          <mesh key={i} position={[0, Math.cos(a) * 1.08, Math.sin(a) * 1.08]} rotation={[a, 0, 0]} material={matCopper}>
            <boxGeometry args={[2.5, 0.16, 0.12]} />
          </mesh>
        ))}
        <mesh position={[1.35, 0, 0]} rotation={[0, 0, AXIS]} material={matCopper}>
          <torusGeometry args={[1.05, 0.14, 12, 40]} />
        </mesh>
        <mesh position={[-1.35, 0, 0]} rotation={[0, 0, AXIS]} material={matCopper}>
          <torusGeometry args={[1.05, 0.14, 12, 40]} />
        </mesh>
      </group>

      {/* Squirrel-cage rotor */}
      <group ref={groups.rotor} onClick={stop(() => onSelect(selected === 'rotor' ? null : 'rotor'))}>
        <mesh rotation={[0, 0, AXIS]} material={matRotor} castShadow>
          <cylinderGeometry args={[0.92, 0.92, 2.5, 40]} />
        </mesh>
        <group ref={barsRef}>
          {rotorBars.map((a, i) => (
            <mesh key={i} position={[0, Math.cos(a) * 0.9, Math.sin(a) * 0.9]} rotation={[a, 0, 0]} material={matBar}>
              <boxGeometry args={[2.5, 0.1, 0.1]} />
            </mesh>
          ))}
        </group>
        <mesh position={[1.26, 0, 0]} rotation={[0, 0, AXIS]} material={matBar}>
          <torusGeometry args={[0.9, 0.07, 10, 40]} />
        </mesh>
        <mesh position={[-1.26, 0, 0]} rotation={[0, 0, AXIS]} material={matBar}>
          <torusGeometry args={[0.9, 0.07, 10, 40]} />
        </mesh>
      </group>

      {/* Shaft */}
      <group ref={groups.shaft} onClick={stop(() => onSelect(selected === 'shaft' ? null : 'shaft'))}>
        <mesh rotation={[0, 0, AXIS]} material={matShaft} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 5.2, 24]} />
        </mesh>
      </group>

      {/* Bearings */}
      <group ref={groups.bearingFront} onClick={stop(() => onSelect(selected === 'bearingFront' ? null : 'bearingFront'))}>
        <mesh position={[1.75, 0, 0]} rotation={[0, 0, AXIS]} material={matBearing}>
          <cylinderGeometry args={[0.28, 0.28, 0.3, 24]} />
        </mesh>
      </group>
      <group ref={groups.bearingBack} onClick={stop(() => onSelect(selected === 'bearingBack' ? null : 'bearingBack'))}>
        <mesh position={[-1.75, 0, 0]} rotation={[0, 0, AXIS]} material={matBearing}>
          <cylinderGeometry args={[0.28, 0.28, 0.3, 24]} />
        </mesh>
      </group>

      {/* Cooling fan */}
      <group ref={groups.fan} onClick={stop(() => onSelect(selected === 'fan' ? null : 'fan'))}>
        <mesh position={[-2.05, 0, 0]} rotation={[0, 0, AXIS]} material={matFan}>
          <cylinderGeometry args={[0.3, 0.3, 0.35, 20]} />
        </mesh>
        {fanBlades.map((a, i) => (
          <mesh key={i} position={[-2.05, Math.cos(a) * 0.45, Math.sin(a) * 0.45]} rotation={[a, 0.5, 0]} material={matFan}>
            <boxGeometry args={[0.12, 0.7, 0.34]} />
          </mesh>
        ))}
      </group>

      {/* Rotating field indicator (operating principle) */}
      <group ref={fieldRef} visible={false}>
        <mesh rotation={[0, 0, AXIS]}>
          <torusGeometry args={[1.5, 0.03, 8, 48]} />
          <meshBasicMaterial color={m.field} transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color={m.field} />
        </mesh>
      </group>

      {showLabels && (
        <group>
          <Html position={[0, 1.95, 0]} center distanceFactor={9} className="part-label" style={{ pointerEvents: 'none' }}>
            <span style={{ pointerEvents: 'none' }}>Housing</span>
          </Html>
          <Html position={[0, -1.7, 0]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
            <span>Stator core</span>
          </Html>
          <Html position={[0, 1.1, 0]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
            <span>Windings</span>
          </Html>
          <Html position={[0, 0, 2.15]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
            <span>Rotor (cage)</span>
          </Html>
          <Html position={[0, 0, -2.15]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
            <span>Shaft</span>
          </Html>
          <Html position={[-3.2, 0, 0]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
            <span>Fan</span>
          </Html>
        </group>
      )}
    </group>
  )
}
