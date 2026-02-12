"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sphere, Torus } from "@react-three/drei"
import { useRef, Suspense, useMemo } from "react"
import type { Mesh, Group } from "three"

function CoreSphere() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1.6, 128, 128]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#26d9a0"
          roughness={0.15}
          metalness={0.9}
          emissive="#26d9a0"
          emissiveIntensity={0.15}
        />
      </Sphere>
    </Float>
  )
}

function OrbitalRing({ radius, speed, tilt }: { radius: number; speed: number; tilt: number }) {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = tilt
      groupRef.current.rotation.y = state.clock.elapsedTime * speed
    }
  })

  return (
    <group ref={groupRef}>
      <Torus args={[radius, 0.008, 16, 100]}>
        <meshStandardMaterial color="#26d9a0" transparent opacity={0.3} emissive="#26d9a0" emissiveIntensity={0.3} />
      </Torus>
    </group>
  )
}

function DataNodes() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
    }
  })

  const nodes = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const r = 2.5 + Math.sin(i * 1.5) * 0.5
        return {
          position: [Math.cos(angle) * r, Math.sin(i * 0.8) * 0.6, Math.sin(angle) * r] as [number, number, number],
          scale: 0.04 + (((i * 7 + 3) % 11) / 11) * 0.03,
        }
      }),
    []
  )

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Float key={i} speed={2 + i * 0.3} floatIntensity={0.3}>
          <Sphere args={[node.scale, 16, 16]} position={node.position}>
            <meshStandardMaterial color="#26d9a0" emissive="#26d9a0" emissiveIntensity={2} />
          </Sphere>
        </Float>
      ))}
    </group>
  )
}

function GlassSphere() {
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <Sphere args={[2.2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1a2a3a"
          transparent
          opacity={0.12}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#26d9a0" />
          <pointLight position={[-5, -3, 3]} intensity={0.4} color="#3b82f6" />
          <pointLight position={[0, 5, -5]} intensity={0.3} color="#ffffff" />

          <CoreSphere />
          <GlassSphere />
          <OrbitalRing radius={2.8} speed={0.2} tilt={0.3} />
          <OrbitalRing radius={3.2} speed={-0.15} tilt={-0.5} />
          <OrbitalRing radius={3.6} speed={0.1} tilt={0.8} />
          <DataNodes />
        </Suspense>
      </Canvas>
    </div>
  )
}
