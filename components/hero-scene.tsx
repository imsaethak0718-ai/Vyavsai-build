"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sphere, Torus, Text } from "@react-three/drei"
import { useRef, Suspense, useMemo } from "react"
import type { Mesh, Group, Points } from "three"
import * as THREE from "three"

const VIOLET = "#a855f7"
const PINK = "#ec4899"
const INDIGO = "#6366f1"

/* ── Wireframe Globe ── */
function Globe() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.08
  })

  return (
    <group>
      <Sphere ref={meshRef} args={[1.6, 32, 32]}>
        <meshStandardMaterial
          color={VIOLET}
          wireframe
          transparent
          opacity={0.12}
          emissive={VIOLET}
          emissiveIntensity={0.4}
        />
      </Sphere>
      {/* Inner glow sphere */}
      <Sphere args={[1.55, 24, 24]}>
        <meshStandardMaterial
          color={INDIGO}
          transparent
          opacity={0.04}
          emissive={INDIGO}
          emissiveIntensity={0.3}
        />
      </Sphere>
    </group>
  )
}

/* ── Trade route arcs around globe ── */
function TradeRoutes() {
  const groupRef = useRef<Group>(null)

  const routes = useMemo(() => {
    const arcs: { points: Float32Array; color: string }[] = []
    const routeDefs = [
      { start: 0, end: 2.2, tilt: 0.3, lift: 0.5, color: PINK },
      { start: 1.5, end: 3.8, tilt: -0.6, lift: 0.4, color: VIOLET },
      { start: 3, end: 5.5, tilt: 0.8, lift: 0.6, color: INDIGO },
      { start: 4.5, end: 6.8, tilt: -0.2, lift: 0.35, color: PINK },
      { start: 0.5, end: 3.0, tilt: 1.2, lift: 0.55, color: VIOLET },
    ]
    routeDefs.forEach(({ start, end, tilt, lift, color }) => {
      const segments = 40
      const verts = new Float32Array(segments * 3)
      for (let i = 0; i < segments; i++) {
        const t = start + (i / (segments - 1)) * (end - start)
        const progress = i / (segments - 1)
        const arcHeight = Math.sin(progress * Math.PI) * lift
        const r = 1.7 + arcHeight
        verts[i * 3] = Math.cos(t) * r
        verts[i * 3 + 1] = Math.sin(t * 0.6 + tilt) * r * 0.4
        verts[i * 3 + 2] = Math.sin(t) * r
      }
      arcs.push({ points: verts, color })
    })
    return arcs
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {routes.map((route, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[route.points, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={route.color} transparent opacity={0.35} />
        </line>
      ))}
    </group>
  )
}

/* ── City nodes on globe surface ── */
function CityNodes() {
  const groupRef = useRef<Group>(null)

  const cities = useMemo(
    () => [
      { lat: 19.07, lng: 72.87, name: "Mumbai", size: 0.045 },
      { lat: 28.61, lng: 77.23, name: "Delhi", size: 0.04 },
      { lat: 12.97, lng: 77.59, name: "Bangalore", size: 0.038 },
      { lat: 13.08, lng: 80.27, name: "Chennai", size: 0.035 },
      { lat: 22.57, lng: 88.36, name: "Kolkata", size: 0.035 },
      { lat: 23.02, lng: 72.57, name: "Ahmedabad", size: 0.032 },
      { lat: 17.38, lng: 78.49, name: "Hyderabad", size: 0.036 },
      { lat: 26.85, lng: 80.95, name: "Lucknow", size: 0.03 },
    ].map((city) => {
      const phi = ((90 - city.lat) * Math.PI) / 180
      const theta = ((city.lng + 180) * Math.PI) / 180
      const r = 1.65
      return {
        ...city,
        position: [
          -r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta),
        ] as [number, number, number],
      }
    }),
    []
  )

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {cities.map((city, i) => (
        <Float key={i} speed={2} floatIntensity={0.05}>
          <Sphere args={[city.size, 12, 12]} position={city.position}>
            <meshStandardMaterial
              color={i % 2 === 0 ? PINK : VIOLET}
              emissive={i % 2 === 0 ? PINK : VIOLET}
              emissiveIntensity={2.5}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  )
}

/* ── Orbiting currency symbols / data packets ── */
function OrbitingPackets() {
  const groupRef = useRef<Group>(null)

  const packets = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        radius: 2.5 + i * 0.25,
        speed: 0.2 + i * 0.08,
        offset: (i * Math.PI * 2) / 8,
        size: 0.03 + (i % 3) * 0.01,
        tiltY: Math.sin(i * 1.2) * 0.5,
        color: [PINK, VIOLET, INDIGO][i % 3],
      })),
    []
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      const p = packets[i]
      if (!p) return
      const angle = t * p.speed + p.offset
      child.position.x = Math.cos(angle) * p.radius
      child.position.y = Math.sin(angle + p.tiltY) * p.radius * 0.25
      child.position.z = Math.sin(angle) * p.radius
    })
  })

  return (
    <group ref={groupRef}>
      {packets.map((p, i) => (
        <mesh key={i}>
          <boxGeometry args={[p.size * 2, p.size * 2, p.size * 2]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={2.5}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Latitude rings ── */
function LatitudeRings() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
  })

  return (
    <group ref={groupRef}>
      {[-0.6, -0.2, 0.2, 0.6].map((y, i) => {
        const r = Math.sqrt(1.62 * 1.62 - y * y) * (i % 2 === 0 ? 1 : 0.98)
        return (
          <Torus key={i} args={[r, 0.003, 8, 80]} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial
              color={VIOLET}
              transparent
              opacity={0.08}
              emissive={VIOLET}
              emissiveIntensity={0.4}
            />
          </Torus>
        )
      })}
    </group>
  )
}

/* ── Ambient star particles ── */
function StarField() {
  const pointsRef = useRef<Points>(null)

  const positions = useMemo(() => {
    const count = 300
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.random() * 5
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (pointsRef.current) pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c4b5fd" size={0.015} transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/* ── Floating "AI" / "Blockchain" labels ── */
function FloatingLabels() {
  const g1 = useRef<Group>(null)
  const g2 = useRef<Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (g1.current) {
      g1.current.position.y = 2.2 + Math.sin(t * 0.5) * 0.15
      g1.current.position.x = -2.5 + Math.sin(t * 0.3) * 0.1
    }
    if (g2.current) {
      g2.current.position.y = -2 + Math.sin(t * 0.4 + 1) * 0.15
      g2.current.position.x = 2.3 + Math.cos(t * 0.35) * 0.1
    }
  })

  return (
    <>
      <group ref={g1} position={[-2.5, 2.2, 0]}>
        <Text fontSize={0.18} color={VIOLET} anchorX="center" anchorY="middle" font="/fonts/Geist-Bold.ttf">
          AI-Powered
          <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.8} transparent opacity={0.5} />
        </Text>
      </group>
      <group ref={g2} position={[2.3, -2, 0]}>
        <Text fontSize={0.16} color={PINK} anchorX="center" anchorY="middle" font="/fonts/Geist-Bold.ttf">
          Blockchain Verified
          <meshStandardMaterial color={PINK} emissive={PINK} emissiveIntensity={0.8} transparent opacity={0.4} />
        </Text>
      </group>
    </>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <pointLight position={[5, 5, 5]} intensity={0.7} color={VIOLET} />
          <pointLight position={[-5, -3, 3]} intensity={0.35} color={PINK} />
          <pointLight position={[0, 4, -5]} intensity={0.2} color="#ffffff" />

          <Globe />
          <TradeRoutes />
          <CityNodes />
          <LatitudeRings />
          <OrbitingPackets />
          <FloatingLabels />
          <StarField />
        </Suspense>
      </Canvas>
    </div>
  )
}
