"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, Suspense, useMemo } from "react"
import type { Points, Group } from "three"
import * as THREE from "three"

const VIOLET = "#a855f7"
const PINK = "#ec4899"
const INDIGO = "#6366f1"

/* ── Grid of floating cubes ── */
function FloatingGrid() {
  const groupRef = useRef<Group>(null)

  const cubes = useMemo(() => {
    const items: { x: number; z: number; delay: number }[] = []
    for (let x = -4; x <= 4; x += 1.2) {
      for (let z = -3; z <= 3; z += 1.2) {
        items.push({ x, z, delay: Math.sqrt(x * x + z * z) * 0.3 })
      }
    }
    return items
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
    groupRef.current.children.forEach((child, i) => {
      const cube = cubes[i]
      if (!cube) return
      child.position.y = Math.sin(state.clock.elapsedTime * 0.5 + cube.delay) * 0.15
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      mat.opacity = 0.04 + Math.sin(state.clock.elapsedTime * 0.8 + cube.delay) * 0.02
    })
  })

  return (
    <group ref={groupRef} position={[0, -1, 0]} rotation={[0.4, 0, 0]}>
      {cubes.map((cube, i) => (
        <mesh key={i} position={[cube.x, 0, cube.z]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshStandardMaterial
            color={VIOLET}
            transparent
            opacity={0.05}
            emissive={VIOLET}
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Slowly drifting particles ── */
function DriftParticles() {
  const pointsRef = useRef<Points>(null)

  const positions = useMemo(() => {
    const count = 150
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.008
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={PINK}
        size={0.02}
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ── Floating hexagon wireframes ── */
function FloatingHexagons() {
  const groupRef = useRef<Group>(null)

  const hexagons = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4 - 2,
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.4,
        rotSpeed: 0.1 + Math.random() * 0.2,
        color: i % 2 === 0 ? VIOLET : INDIGO,
      })),
    []
  )

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      const hex = hexagons[i]
      if (!hex) return
      child.rotation.z = state.clock.elapsedTime * hex.rotSpeed
      child.rotation.x = state.clock.elapsedTime * hex.rotSpeed * 0.5
    })
  })

  return (
    <group ref={groupRef}>
      {hexagons.map((hex, i) => (
        <mesh key={i} position={hex.position} scale={hex.scale}>
          <cylinderGeometry args={[1, 1, 0.1, 6]} />
          <meshStandardMaterial
            color={hex.color}
            wireframe
            transparent
            opacity={0.06}
            emissive={hex.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

export function FeaturesScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.08} />
          <pointLight position={[5, 5, 5]} intensity={0.3} color={VIOLET} />
          <pointLight position={[-5, -3, 3]} intensity={0.15} color={PINK} />

          <FloatingGrid />
          <DriftParticles />
          <FloatingHexagons />
        </Suspense>
      </Canvas>
    </div>
  )
}
