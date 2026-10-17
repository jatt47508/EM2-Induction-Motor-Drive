import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import MotorModel, { type MotorPartId } from './MotorModel'
import type { Palette } from '../theme/palette'
import type { ThemeName } from '../theme/palette'

type Props = {
  progressRef: React.MutableRefObject<number>
  palette: Palette
  theme: ThemeName
  selected: MotorPartId | null
  onSelect: (id: MotorPartId | null) => void
  playing: boolean
  resetSignal: number
  reducedMotion: boolean
}

function SceneEnvironment({ theme }: { theme: ThemeName }) {
  const gl = useThree(s => s.gl)
  const scene = useThree(s => s.scene)
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  useEffect(() => {
    ;(scene as any).environmentIntensity = theme === 'light' ? 1.2 : 0.6
  }, [scene, theme])
  return null
}

function CameraFit({ controls, k }: { controls: React.MutableRefObject<any>; k: number }) {
  const camera = useThree(s => s.camera)
  const last = useRef(-1)
  useEffect(() => {
    if (k === last.current) return
    last.current = k
    // Pull the camera back on narrow (portrait/phone) viewports so the motor fits.
    camera.position.set(4.5 * k, 3.1 * k, 5.5 * k)
    const c = controls.current
    if (c) {
      c.target.set(0, 0, 0)
      c.update()
      c.saveState?.()
    }
  }, [camera, controls, k])
  return null
}

function useViewportFit() {
  const [k, setK] = useState(1)
  useEffect(() => {
    const update = () => {
      const aspect = window.innerWidth / Math.max(1, window.innerHeight)
      setK(aspect >= 1.5 ? 1 : Math.pow(1.5 / aspect, 0.9))
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])
  return k
}

export default function MotorScene({ progressRef, palette, theme, selected, onSelect, playing, resetSignal, reducedMotion }: Props) {
  const controls = useRef<any>(null)
  const [hovering, setHovering] = useState(false)
  const isLight = theme === 'light'
  const fitK = useViewportFit()
  // On touch devices there is no hover, so keep pinch-zoom always enabled.
  const [coarse] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)

  useEffect(() => {
    if (resetSignal > 0 && controls.current) controls.current.reset()
  }, [resetSignal])

  return (
    <Canvas
      className="scene-canvas"
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      camera={{ position: [4.5, 3.1, 5.5], fov: 42 }}
      onPointerMissed={() => onSelect(null)}
    >
      <SceneEnvironment theme={theme} />
      <hemisphereLight intensity={isLight ? 1.0 : 0.5} groundColor={palette.motor.ground} color={isLight ? '#ffffff' : palette.text} />
      <ambientLight intensity={isLight ? 0.55 : 0.28} />
      <directionalLight position={[5, 6, 4]} intensity={isLight ? 1.7 : 1.05} />
      <directionalLight position={[-5, 2, -4]} intensity={isLight ? 0.5 : 0.4} color={palette.accent} />
      <directionalLight position={[0, -5, 2]} intensity={0.25} />
      <MotorModel
        progressRef={progressRef}
        palette={palette}
        selected={selected}
        onSelect={onSelect}
        playing={playing}
        reducedMotion={reducedMotion}
        onHover={setHovering}
      />
      <OrbitControls
        ref={controls}
        enabled={!coarse}
        enablePan={false}
        enableRotate={!coarse}
        enableZoom={coarse || hovering}
        minDistance={3}
        maxDistance={11 * fitK}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI - 0.35}
        rotateSpeed={0.7}
        zoomSpeed={0.8}
        makeDefault
      />
      <CameraFit controls={controls} k={fitK} />
    </Canvas>
  )
}
