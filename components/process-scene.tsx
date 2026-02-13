"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, Suspense, useMemo } from "react"
import type { Points, Group, Mesh } from "three"
import * as THREE from "three"

/* ── DNA double helix representing the process flow ── */
function DNAHelix() {
  const groupRef = useRef<Group>(null)

  const { spheres, linePositions } = useMemo(() => {
    const items: { pos: [number, number, number]; color: string }[] = []
    const lines: number[] = []
    const turns = 3
    const pointsPerTurn = 20
    const total = turns * pointsPerTurn

    for (let i = 0; i < total; i++) {
      const t = (i / total) * Math.PI * 2 * turns
      const y = ((i / total) - 0.5) * 8
      const r = 1.2

      const x1 = Math.cos(t) * r
      const z1 = Math.sin(t) * r
      const x2 = Math.cos(t + Math.PI) * r
      const z2 = Math.sin(t + Math.PI) * r

      items.push({ pos: [x1, y, z1], color: "#26d9a0" })
      items.push({ pos: [x2, y, z2], color: "#3b82f6" })

      // Cross-connection every 4 steps
      if (i % 4 === 0) {
        lines.push(x1, y, z1, x2, y, z2)
      }
    }
    return { spheres: items, linePositions: new Float32Array(lines) }
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.06
  })

  return (
    <group ref={groupRef} position={[3.5, 0, -2]}>
      {spheres.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={1.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
      {linePositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#26d9a0" transparent opacity={0.06} />
        </lineSegments>
      )}
    </group>
  )
}

/* ── Floating circuit-like paths ── */
function CircuitPaths() {
  const groupRef = useRef<Group>(null)

  const paths = useMemo(() => {
    const items: { points: Float32Array; speed: number }[] = []
    for (let p = 0; p < 8; p++) {
      const verts: number[] = []
      let x = (Math.random() - 0.5) * 10
      let y = (Math.random() - 0.5) * 6
      const z = (Math.random() - 0.5) * 3 - 2
      for (let s = 0; s < 6; s++) {
        verts.push(x, y, z)
        if (s % 2 === 0) x += (Math.random() - 0.5) * 2
        else y += (Math.random() - 0.5) * 2
        verts.push(x, y, z)
      }
      items.push({ points: new Float32Array(verts), speed: 0.2 + Math.random() * 0.3 })
    }
    return items
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      const mat = (child as THREE.LineSegments).material as THREE.LineBasicMaterial
      mat.opacity = 0.04 + Math.sin(state.clock.elapsedTime * paths[i].speed + i) * 0.03
    })
  })

  return (
    <group ref={groupRef}>
      {paths.map((path, i) => (
        <lineSegments key={i}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[path.points, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#26d9a0" transparent opacity={0.05} />
        </lineSegments>
      ))}
    </group>
  )
}

/* ── Ambient particles ── */
function AmbientDust() {
  const pointsRef = useRef<Points>(null)

  const positions = useMemo(() => {
    const count = 100
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#3b82f6" size={0.015} transparent opacity={0.25} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export function ProcessScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.06} />
          <pointLight position={[5, 3, 4]} intensity={0.3} color="#26d9a0" />
          <pointLight position={[-4, -2, 3]} intensity={0.15} color="#3b82f6" />

          <DNAHelix />
          <CircuitPaths />
          <AmbientDust />
        </Suspense>
      </Canvas>
    </div>
  )
}
