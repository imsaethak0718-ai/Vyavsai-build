"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, Suspense, useMemo } from "react"
import type { Points, Group, Mesh } from "three"
import * as THREE from "three"

const VIOLET = "#c084fc"
const PINK = "#f472b6"
const INDIGO = "#818cf8"
const BRIGHT_VIOLET = "#d8b4fe"
const BRIGHT_PINK = "#f9a8d4"

/* ── Rising bar chart showing growth ── */
function GrowthChart() {
  const groupRef = useRef<Group>(null)

  const bars = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        targetHeight: 0.3 + (i / 8) * 1.5 + Math.sin(i * 0.8) * 0.2,
        x: (i - 4) * 0.35,
        color: i >= 7 ? BRIGHT_PINK : i >= 4 ? BRIGHT_VIOLET : INDIGO,
      })),
    []
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.15
    groupRef.current.children.forEach((child, i) => {
      if (i >= bars.length) return
      const bar = bars[i]
      const anim = Math.min(1, Math.max(0, (t - i * 0.15) * 0.5))
      const ease = 1 - Math.pow(1 - anim, 3)
      const breathe = 1 + Math.sin(t * 0.8 + i * 0.5) * 0.05
      child.scale.y = ease * bar.targetHeight * breathe
      child.position.y = (ease * bar.targetHeight * breathe) * 0.5
    })
  })

  return (
    <group ref={groupRef} position={[-3, -1.2, -1.5]} rotation={[0.15, 0.4, 0]}>
      {bars.map((bar, i) => (
        <mesh key={i} position={[bar.x, 0, 0]}>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial
            color={bar.color}
            transparent
            opacity={0.7}
            emissive={bar.color}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Orbiting coin / token rings ── */
function TokenRing() {
  const groupRef = useRef<Group>(null)

  const tokens = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        angle: (i / 8) * Math.PI * 2,
        radius: 2.2,
        speed: 0.15,
        color: [BRIGHT_PINK, BRIGHT_VIOLET, INDIGO, BRIGHT_PINK, BRIGHT_VIOLET, INDIGO, BRIGHT_PINK, BRIGHT_VIOLET][i],
      })),
    []
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      const token = tokens[i]
      if (!token) return
      const angle = t * token.speed + token.angle
      child.position.x = Math.cos(angle) * token.radius
      child.position.y = Math.sin(angle * 0.6) * 0.6
      child.position.z = Math.sin(angle) * token.radius
      child.rotation.y = t * 0.5
    })
  })

  return (
    <group ref={groupRef}>
      {tokens.map((token, i) => (
        <mesh key={i}>
          <cylinderGeometry args={[0.1, 0.1, 0.025, 16]} />
          <meshStandardMaterial
            color={token.color}
            emissive={token.color}
            emissiveIntensity={4}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Upward trending arrow ── */
function TrendArrow() {
  const groupRef = useRef<Group>(null)

  const arrowLine = useMemo(() => {
    const points: number[] = []
    for (let i = 0; i <= 20; i++) {
      const t = i / 20
      const x = 2 + t * 3
      const y = -0.5 + t * 2 + Math.sin(t * 4) * 0.15
      points.push(x, y, -1)
    }
    return new Float32Array(points)
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[arrowLine, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={BRIGHT_PINK} transparent opacity={0.75} />
      </line>
      <mesh position={[5, 1.5, -1]} rotation={[0, 0, 0.9]}>
        <coneGeometry args={[0.08, 0.24, 8]} />
        <meshStandardMaterial color={BRIGHT_PINK} emissive={BRIGHT_PINK} emissiveIntensity={4} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

/* ── Spiral particles ── */
function SpiralParticles() {
  const pointsRef = useRef<Points>(null)

  const positions = useMemo(() => {
    const count = 250
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 6
      const r = 0.5 + (i / count) * 3
      pos[i * 3] = Math.cos(t) * r
      pos[i * 3 + 1] = (i / count - 0.5) * 4
      pos[i * 3 + 2] = Math.sin(t) * r
    }
    return pos
  }, [])

  useFrame((state) => {
    if (pointsRef.current) pointsRef.current.rotation.y = state.clock.elapsedTime * 0.08
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={BRIGHT_VIOLET} size={0.03} transparent opacity={0.7} sizeAttenuation depthWrite={false} />
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
          <ambientLight intensity={0.4} />
          <pointLight position={[4, 4, 4]} intensity={1.5} color={VIOLET} />
          <pointLight position={[-4, -2, 2]} intensity={0.8} color={PINK} />
          <pointLight position={[0, 3, -3]} intensity={0.5} color={INDIGO} />

          <GrowthChart />
          <TokenRing />
          <TrendArrow />
          <SpiralParticles />
        </Suspense>
      </Canvas>
    </div>
  )
}
