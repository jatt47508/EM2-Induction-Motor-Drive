import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Palette } from '../theme/palette'
import type { Derived, SimParams, SimState } from '../simulation/model'

type Props = {
  simRef: React.MutableRefObject<SimState>
  derivedRef: React.MutableRefObject<Derived>
  paramsRef: React.MutableRefObject<SimParams>
  palette: Palette
  phaseOffsetRef: React.MutableRefObject<number>
  reducedMotion: boolean
}

function Field({ simRef, derivedRef, paramsRef, palette, phaseOffsetRef, reducedMotion }: Props) {
  const field = useRef<THREE.Group>(null)
  const rotor = useRef<THREE.Group>(null)
  const torqueArc = useRef<THREE.Mesh>(null)
  const arrows = [useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null)]

  const coils = useMemo(() => [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3], [])
  const bars = useMemo(() => Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2), [])

  useFrame((_, delta) => {
    const st = simRef.current
    const d = derivedRef.current
    const p = paramsRef.current
    const ang = st.thetaE + phaseOffsetRef.current
    if (field.current) field.current.rotation.z = ang
    if (rotor.current) {
      const mech = ang / Math.max(1, p.poles / 2)
      rotor.current.rotation.z = mech * (1 - d.slip)
    }
    const phases = [d.phase.a, d.phase.b, d.phase.c]
    arrows.forEach((r, i) => {
      if (r.current) r.current.rotation.z = phases[i] >= 0 ? 0 : Math.PI
    })
    if (torqueArc.current) {
      const t = Math.min(1, Math.abs(d.Te) / Math.max(1, d.tmax))
      torqueArc.current.scale.setScalar(0.6 + t * 0.9)
    }
  })

  const m = palette.motor
  const phaseColors = [palette.series.a, palette.series.b, palette.series.c]

  return (
    <group>
      {/* Stator coil ring */}
      <mesh>
        <torusGeometry args={[2.1, 0.06, 8, 64]} />
        <meshStandardMaterial color={m.housing} metalness={0.7} roughness={0.4} />
      </mesh>

      {coils.map((a, i) => (
        <group key={i} rotation={[0, 0, a]}>
          <mesh position={[2.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.42, 0.11, 12, 32]} />
            <meshStandardMaterial color={phaseColors[i]} metalness={0.5} roughness={0.35} />
          </mesh>
          <group ref={arrows[i]} position={[2.1, 0, 0]}>
            <mesh position={[0, 0.75, 0]}>
              <coneGeometry args={[0.16, 0.42, 14]} />
              <meshStandardMaterial color={phaseColors[i]} emissive={phaseColors[i]} emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.7, 10]} />
              <meshStandardMaterial color={phaseColors[i]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Rotor cage */}
      <group ref={rotor}>
        <mesh>
          <cylinderGeometry args={[1.15, 1.15, 0.18, 40]} />
          <meshStandardMaterial color={m.rotor} metalness={0.85} roughness={0.35} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.15, 1.15, 0.18, 40]} />
          <meshStandardMaterial color={m.rotor} metalness={0.85} roughness={0.35} />
        </mesh>
        {bars.map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 1.02, Math.sin(a) * 1.02, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color={m.rotorBar} emissive={m.rotorBar} emissiveIntensity={0.35} />
          </mesh>
        ))}
      </group>

      {/* Rotating magnetic field vector */}
      <group ref={field}>
        <mesh position={[0.8, 0, 0.25]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 1.6, 12]} />
          <meshStandardMaterial color={m.field} emissive={m.field} emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[1.7, 0, 0.25]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.17, 0.45, 16]} />
          <meshStandardMaterial color={m.field} emissive={m.field} emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Torque indicator */}
      <mesh ref={torqueArc} position={[0, 0, 0.5]}>
        <torusGeometry args={[1.7, 0.05, 8, 48, Math.PI / 2]} />
        <meshStandardMaterial color={palette.series.torque} emissive={palette.series.torque} emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

export default function OperatingScene(props: Props) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.4, 7.4], fov: 45 }} gl={{ antialias: true, alpha: true }} aria-label="Rotating magnetic field and rotor">
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 6]} intensity={1.0} />
      <directionalLight position={[-4, -2, -5]} intensity={0.3} color={props.palette.accent} />
      <Field {...props} />
    </Canvas>
  )
}
