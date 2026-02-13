"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Float } from "@react-three/drei"
import { useRef, Suspense, useMemo } from "react"
import type { Points, Group, Mesh } from "three"
import * as THREE from "three"

/* ── Rotating torus knot ── */
function TorusKnot() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.08
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.12
  })

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.5, 0.04, 200, 16, 2, 3]} />
        <meshStandardMaterial
          color="#26d9a0"
          transparent
          opacity={0.12}
          emissive="#26d9a0"
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>
    </Float>
  )
}

/* ── Expanding/contracting rings ── */
function PulsingRings() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      const scale = 1 + Math.sin(t * 0.6 + i * 0.8) * 0.15
      child.scale.setScalar(scale)
      const mat = (child as Mesh).material as THREE.MeshStandardMaterial
      mat.opacity = 0.04 + Math.sin(t * 0.6 + i * 0.8) * 0.03
    })
  })

  return (
    <group ref={groupRef}>
      {[1.8, 2.2, 2.6, 3.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.006, 8, 100]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#26d9a0" : "#3b82f6"}
            transparent
            opacity={0.06}
            emissive={i % 2 === 0 ? "#26d9a0" : "#3b82f6"}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Spiral particle stream ── */
function SpiralParticles() {
  const pointsRef = useRef<Points>(null)

  const positions = useMemo(() => {
    const count = 200
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 8
      const r = 0.5 + (i / count) * 3
      pos[i * 3] = Math.cos(t) * r
      pos[i * 3 + 1] = (i / count - 0.5) * 4
      pos[i * 3 + 2] = Math.sin(t) * r
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#26d9a0"
        size={0.02}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export function CtaScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.08} />
          <pointLight position={[4, 4, 4]} intensity={0.5} color="#26d9a0" />
          <pointLight position={[-4, -2, 2]} intensity={0.25} color="#3b82f6" />

          <TorusKnot />
          <PulsingRings />
          <SpiralParticles />
        </Suspense>
      </Canvas>
    </div>
  )
}
