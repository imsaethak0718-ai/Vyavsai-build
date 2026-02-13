"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Text } from "@react-three/drei"
import { useRef, Suspense, useMemo } from "react"
import type { Points, Group, Mesh } from "three"
import * as THREE from "three"

const VIOLET = "#a855f7"
const PINK = "#ec4899"
const INDIGO = "#6366f1"

/* ── Rising bar chart showing growth ── */
function GrowthChart() {
  const groupRef = useRef<Group>(null)

  const bars = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        targetHeight: 0.3 + (i / 8) * 1.5 + Math.sin(i * 0.8) * 0.2,
        x: (i - 4) * 0.35,
        color: i >= 7 ? PINK : i >= 4 ? VIOLET : INDIGO,
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
            opacity={0.3}
            emissive={bar.color}
            emissiveIntensity={0.6}
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
      Array.from({ length: 6 }, (_, i) => ({
        angle: (i / 6) * Math.PI * 2,
        radius: 2.2,
        speed: 0.15,
        color: [PINK, VIOLET, INDIGO, PINK, VIOLET, INDIGO][i],
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
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial
            color={token.color}
            emissive={token.color}
            emissiveIntensity={1.5}
            transparent
            opacity={0.5}
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
        <lineBasicMaterial color={PINK} transparent opacity={0.3} />
      </line>
      {/* Arrowhead */}
      <mesh position={[5, 1.5, -1]} rotation={[0, 0, 0.9]}>
        <coneGeometry args={[0.06, 0.2, 8]} />
        <meshStandardMaterial color={PINK} emissive={PINK} emissiveIntensity={1.5} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

/* ── Floating metric badges ── */
function MetricBadges() {
  const g1 = useRef<Group>(null)
  const g2 = useRef<Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (g1.current) {
      g1.current.position.y = 1.8 + Math.sin(t * 0.4) * 0.12
      g1.current.position.x = -3 + Math.sin(t * 0.25) * 0.08
    }
    if (g2.current) {
      g2.current.position.y = -1.5 + Math.sin(t * 0.35 + 1) * 0.12
      g2.current.position.x = 3.5 + Math.cos(t * 0.28) * 0.08
    }
  })

  return (
    <>
      <group ref={g1} position={[-3, 1.8, 0]}>
        <Text fontSize={0.2} color={VIOLET} anchorX="center" anchorY="middle" font="/fonts/Geist-Bold.ttf">
          +340M
          <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.6} transparent opacity={0.4} />
        </Text>
      </group>
      <group ref={g2} position={[3.5, -1.5, 0]}>
        <Text fontSize={0.18} color={PINK} anchorX="center" anchorY="middle" font="/fonts/Geist-Bold.ttf">
          98% Accuracy
          <meshStandardMaterial color={PINK} emissive={PINK} emissiveIntensity={0.6} transparent opacity={0.35} />
        </Text>
      </group>
    </>
  )
}

/* ── Spiral particles ── */
function SpiralParticles() {
  const pointsRef = useRef<Points>(null)

  const positions = useMemo(() => {
    const count = 150
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
      <pointsMaterial color={INDIGO} size={0.018} transparent opacity={0.3} sizeAttenuation depthWrite={false} />
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
          <pointLight position={[4, 4, 4]} intensity={0.4} color={VIOLET} />
          <pointLight position={[-4, -2, 2]} intensity={0.2} color={PINK} />

          <GrowthChart />
          <TokenRing />
          <TrendArrow />
          <MetricBadges />
          <SpiralParticles />
        </Suspense>
      </Canvas>
    </div>
  )
}
