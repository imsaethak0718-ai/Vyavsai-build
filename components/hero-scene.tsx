"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sphere, Torus } from "@react-three/drei"
import { useRef, Suspense, useMemo } from "react"
import type { Mesh, Group, Points } from "three"
import * as THREE from "three"

function CoreSphere() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.12
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.1
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <Sphere ref={meshRef} args={[1.6, 128, 128]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#26d9a0"
          roughness={0.12}
          metalness={0.92}
          emissive="#26d9a0"
          emissiveIntensity={0.12}
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
      <Torus args={[radius, 0.006, 16, 128]}>
        <meshStandardMaterial color="#26d9a0" transparent opacity={0.25} emissive="#26d9a0" emissiveIntensity={0.4} />
      </Torus>
    </group>
  )
}

function ParticleField() {
  const pointsRef = useRef<Points>(null)

  const { positions, opacities } = useMemo(() => {
    const count = 200
    const pos = new Float32Array(count * 3)
    const ops = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + Math.random() * 3
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      ops[i] = 0.15 + Math.random() * 0.6
    }
    return { positions: pos, opacities: ops }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#26d9a0"
        size={0.025}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function DataNodes() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.06
    }
  })

  const nodes = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2
        const r = 2.4 + Math.sin(i * 1.7) * 0.6
        return {
          position: [
            Math.cos(angle) * r,
            Math.sin(i * 0.9) * 0.8,
            Math.sin(angle) * r,
          ] as [number, number, number],
          scale: 0.03 + (((i * 7 + 3) % 11) / 11) * 0.04,
        }
      }),
    []
  )

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Float key={i} speed={1.5 + i * 0.2} floatIntensity={0.25}>
          <Sphere args={[node.scale, 16, 16]} position={node.position}>
            <meshStandardMaterial color="#26d9a0" emissive="#26d9a0" emissiveIntensity={2.5} />
          </Sphere>
        </Float>
      ))}
    </group>
  )
}

function GlassSphere() {
  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.2}>
      <Sphere args={[2.2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1a2a3a"
          transparent
          opacity={0.08}
          roughness={0.05}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.15} />
          <pointLight position={[5, 5, 5]} intensity={0.7} color="#26d9a0" />
          <pointLight position={[-5, -3, 3]} intensity={0.35} color="#3b82f6" />
          <pointLight position={[0, 5, -5]} intensity={0.2} color="#ffffff" />

          <CoreSphere />
          <GlassSphere />
          <OrbitalRing radius={2.6} speed={0.18} tilt={0.3} />
          <OrbitalRing radius={3.0} speed={-0.12} tilt={-0.5} />
          <OrbitalRing radius={3.4} speed={0.08} tilt={0.8} />
          <OrbitalRing radius={3.8} speed={-0.06} tilt={-0.2} />
          <DataNodes />
          <ParticleField />
        </Suspense>
      </Canvas>
    </div>
  )
}
