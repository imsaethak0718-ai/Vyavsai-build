"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sphere, Torus } from "@react-three/drei"
import { useRef, Suspense, useMemo } from "react"
import type { Mesh, Group, Points, LineSegments as TLineSegments } from "three"
import * as THREE from "three"

const VIOLET = "#a855f7"
const PINK = "#ec4899"
const INDIGO = "#6366f1"

/* ── Central glowing sphere ── */
function CoreSphere() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.y = t * 0.15
    meshRef.current.rotation.x = Math.sin(t * 0.08) * 0.12
    const s = 1 + Math.sin(t * 1.2) * 0.03
    meshRef.current.scale.setScalar(s)
  })

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
      <Sphere ref={meshRef} args={[1.4, 128, 128]}>
        <meshStandardMaterial
          color={VIOLET}
          roughness={0.1}
          metalness={0.95}
          emissive={VIOLET}
          emissiveIntensity={0.2}
        />
      </Sphere>
    </Float>
  )
}

/* ── Transparent outer shell ── */
function GlassSphere() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.03
  })

  return (
    <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.15}>
      <Sphere ref={meshRef} args={[2.4, 64, 64]}>
        <meshStandardMaterial
          color="#2a1540"
          transparent
          opacity={0.06}
          roughness={0.05}
          metalness={0.9}
          side={THREE.DoubleSide}
        />
      </Sphere>
    </Float>
  )
}

/* ── Wireframe icosahedron ── */
function WireframeIcosahedron() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = t * 0.06
    meshRef.current.rotation.y = t * 0.09
    meshRef.current.rotation.z = t * 0.03
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[3.2, 1]} />
      <meshStandardMaterial
        color={VIOLET}
        wireframe
        transparent
        opacity={0.08}
        emissive={VIOLET}
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

/* ── Orbital rings ── */
function OrbitalRing({ radius, speed, tilt, opacity = 0.2, color = VIOLET }: { radius: number; speed: number; tilt: number; opacity?: number; color?: string }) {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z = tilt
    groupRef.current.rotation.y = state.clock.elapsedTime * speed
  })

  return (
    <group ref={groupRef}>
      <Torus args={[radius, 0.005, 16, 200]}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Torus>
    </group>
  )
}

/* ── Pulsing energy ring ── */
function EnergyRing({ radius, speed, axis, color = PINK }: { radius: number; speed: number; axis: "x" | "y" | "z"; color?: string }) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const pulse = 1 + Math.sin(t * speed) * 0.15
    meshRef.current.scale.setScalar(pulse)
    meshRef.current.rotation[axis] = t * speed * 0.3
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.06 + Math.sin(t * speed) * 0.04
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, 0.015, 8, 100]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.08}
        emissive={color}
        emissiveIntensity={0.6}
      />
    </mesh>
  )
}

/* ── Floating data nodes with connection lines ── */
function DataNetwork() {
  const groupRef = useRef<Group>(null)
  const linesRef = useRef<TLineSegments>(null)

  const { nodes, linePositions } = useMemo(() => {
    const nodeList = Array.from({ length: 24 }, (_, i) => {
      const golden = (1 + Math.sqrt(5)) / 2
      const theta = (2 * Math.PI * i) / golden
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 24)
      const r = 2.2 + Math.sin(i * 1.3) * 0.5
      return {
        position: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ] as [number, number, number],
        scale: 0.025 + ((i * 7 + 3) % 11) / 11 * 0.04,
        color: i % 3 === 0 ? PINK : i % 3 === 1 ? VIOLET : INDIGO,
      }
    })

    const lineVerts: number[] = []
    const threshold = 2.0
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = i + 1; j < nodeList.length; j++) {
        const dx = nodeList[i].position[0] - nodeList[j].position[0]
        const dy = nodeList[i].position[1] - nodeList[j].position[1]
        const dz = nodeList[i].position[2] - nodeList[j].position[2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < threshold) {
          lineVerts.push(...nodeList[i].position, ...nodeList[j].position)
        }
      }
    }
    return { nodes: nodeList, linePositions: new Float32Array(lineVerts) }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.04
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.05
    }
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Float key={i} speed={1.2 + i * 0.15} floatIntensity={0.2}>
          <Sphere args={[node.scale, 12, 12]} position={node.position}>
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={2.0}
            />
          </Sphere>
        </Float>
      ))}
      {linePositions.length > 0 && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={VIOLET} transparent opacity={0.1} />
        </lineSegments>
      )}
    </group>
  )
}

/* ── Particle field ── */
function ParticleField() {
  const pointsRef = useRef<Points>(null)

  const positions = useMemo(() => {
    const count = 350
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3.5 + Math.random() * 4
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.03
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={VIOLET}
        size={0.018}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ── Pink accent particles ── */
function PinkParticles() {
  const pointsRef = useRef<Points>(null)

  const positions = useMemo(() => {
    const count = 120
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.random() * 3
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = -state.clock.elapsedTime * 0.01
    pointsRef.current.rotation.z = state.clock.elapsedTime * 0.005
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={PINK}
        size={0.015}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ── Orbiting satellite spheres ── */
function OrbitingSatellites() {
  const groupRef = useRef<Group>(null)

  const satellites = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        radius: 2.8 + i * 0.4,
        speed: 0.3 + i * 0.1,
        offset: (i * Math.PI * 2) / 6,
        size: 0.04 + (i % 3) * 0.015,
        tiltX: Math.sin(i * 1.2) * 0.5,
        tiltZ: Math.cos(i * 0.8) * 0.4,
        color: i % 3 === 0 ? PINK : i % 3 === 1 ? VIOLET : INDIGO,
      })),
    []
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      const sat = satellites[i]
      if (!sat) return
      const angle = t * sat.speed + sat.offset
      child.position.x = Math.cos(angle) * sat.radius
      child.position.y = Math.sin(angle + sat.tiltX) * sat.radius * 0.3
      child.position.z = Math.sin(angle) * sat.radius
    })
  })

  return (
    <group ref={groupRef}>
      {satellites.map((sat, i) => (
        <Sphere key={i} args={[sat.size, 12, 12]}>
          <meshStandardMaterial
            color={sat.color}
            emissive={sat.color}
            emissiveIntensity={3}
          />
        </Sphere>
      ))}
    </group>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.12} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color={VIOLET} />
          <pointLight position={[-5, -3, 3]} intensity={0.4} color={PINK} />
          <pointLight position={[0, 5, -5]} intensity={0.25} color="#ffffff" />
          <pointLight position={[-3, 4, -3]} intensity={0.2} color={INDIGO} />

          <CoreSphere />
          <GlassSphere />
          <WireframeIcosahedron />

          <OrbitalRing radius={2.6} speed={0.2} tilt={0.35} opacity={0.2} color={VIOLET} />
          <OrbitalRing radius={3.0} speed={-0.14} tilt={-0.55} opacity={0.15} color={PINK} />
          <OrbitalRing radius={3.4} speed={0.09} tilt={0.85} opacity={0.12} color={INDIGO} />
          <OrbitalRing radius={3.8} speed={-0.06} tilt={-0.2} opacity={0.08} color={VIOLET} />
          <OrbitalRing radius={4.2} speed={0.04} tilt={1.1} opacity={0.06} color={PINK} />

          <EnergyRing radius={1.9} speed={1.5} axis="x" color={PINK} />
          <EnergyRing radius={2.1} speed={1.2} axis="z" color={INDIGO} />

          <DataNetwork />
          <OrbitingSatellites />
          <ParticleField />
          <PinkParticles />
        </Suspense>
      </Canvas>
    </div>
  )
}
