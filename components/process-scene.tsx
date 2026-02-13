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

/* ── Pipeline conveyor belt with moving packages ── */
function ConveyorBelt() {
  const groupRef = useRef<Group>(null)
  const packagesRef = useRef<Group>(null)

  const beltSegments = useMemo(() => {
    const segments: number[] = []
    for (let i = 0; i < 30; i++) {
      const x = (i - 15) * 0.4
      segments.push(x, -0.5, 0, x + 0.35, -0.5, 0)
    }
    return new Float32Array(segments)
  }, [])

  useFrame((state) => {
    if (!packagesRef.current) return
    const t = state.clock.elapsedTime
    packagesRef.current.children.forEach((child, i) => {
      const speed = 0.4
      const offset = i * 2.5
      child.position.x = ((t * speed + offset) % 12) - 6
      child.position.y = -0.3 + Math.abs(Math.sin(t * 2 + i)) * 0.03
    })
  })

  return (
    <group ref={groupRef} position={[0, -1.5, -1]}>
      {/* Belt track */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[beltSegments, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={BRIGHT_VIOLET} transparent opacity={0.35} />
      </lineSegments>
      {/* Rails */}
      <mesh position={[0, -0.5, -0.15]}>
        <boxGeometry args={[12, 0.015, 0.015]} />
        <meshStandardMaterial color={VIOLET} transparent opacity={0.45} emissive={VIOLET} emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, -0.5, 0.15]}>
        <boxGeometry args={[12, 0.015, 0.015]} />
        <meshStandardMaterial color={VIOLET} transparent opacity={0.45} emissive={VIOLET} emissiveIntensity={1} />
      </mesh>
      {/* Moving packages */}
      <group ref={packagesRef}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} position={[-4 + i * 2.5, -0.3, 0]}>
            <boxGeometry args={[0.22, 0.22, 0.22]} />
            <meshStandardMaterial
              color={[BRIGHT_PINK, BRIGHT_VIOLET, INDIGO, BRIGHT_PINK, BRIGHT_VIOLET][i]}
              emissive={[BRIGHT_PINK, BRIGHT_VIOLET, INDIGO, BRIGHT_PINK, BRIGHT_VIOLET][i]}
              emissiveIntensity={3}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ── Processing nodes with data flow ── */
function ProcessingNodes() {
  const groupRef = useRef<Group>(null)

  const nodes = useMemo(
    () => [
      { x: -4, y: 0, size: 0.22, color: BRIGHT_PINK },
      { x: -1.5, y: 0.3, size: 0.28, color: BRIGHT_VIOLET },
      { x: 1.5, y: -0.2, size: 0.25, color: INDIGO },
      { x: 4, y: 0.1, size: 0.22, color: BRIGHT_PINK },
    ],
    []
  )

  const connectionLines = useMemo(() => {
    const verts: number[] = []
    for (let i = 0; i < nodes.length - 1; i++) {
      verts.push(nodes[i].x, nodes[i].y, 0)
      const midX = (nodes[i].x + nodes[i + 1].x) / 2
      const midY = (nodes[i].y + nodes[i + 1].y) / 2 + 0.3
      verts.push(midX, midY, 0)
      verts.push(midX, midY, 0)
      verts.push(nodes[i + 1].x, nodes[i + 1].y, 0)
    }
    return new Float32Array(verts)
  }, [nodes])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      if (i < nodes.length) {
        const mesh = child as Mesh
        const pulse = 1 + Math.sin(t * 1.5 + i * 1.2) * 0.15
        mesh.scale.setScalar(pulse)
      }
    })
  })

  return (
    <group ref={groupRef} position={[0, 1, -1]}>
      {nodes.map((node, i) => (
        <mesh key={i} position={[node.x, node.y, 0]}>
          <octahedronGeometry args={[node.size, 0]} />
          <meshStandardMaterial
            color={node.color}
            transparent
            opacity={0.5}
            emissive={node.color}
            emissiveIntensity={2}
            wireframe
          />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connectionLines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={BRIGHT_VIOLET} transparent opacity={0.45} />
      </lineSegments>
    </group>
  )
}

/* ── Scanning beam effect ── */
function ScanBeam() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.position.x = Math.sin(t * 0.3) * 5
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.08 + Math.sin(t * 0.6) * 0.05
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <planeGeometry args={[0.06, 6]} />
      <meshStandardMaterial color={BRIGHT_PINK} transparent opacity={0.1} emissive={BRIGHT_PINK} emissiveIntensity={3} side={THREE.DoubleSide} />
    </mesh>
  )
}

/* ── Ambient dust ── */
function AmbientDust() {
  const pointsRef = useRef<Points>(null)

  const positions = useMemo(() => {
    const count = 120
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return pos
  }, [])

  useFrame((state) => {
    if (pointsRef.current) pointsRef.current.rotation.y = state.clock.elapsedTime * 0.006
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={BRIGHT_VIOLET} size={0.02} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export function ProcessScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 3, 4]} intensity={1} color={VIOLET} />
          <pointLight position={[-4, -2, 3]} intensity={0.6} color={PINK} />
          <pointLight position={[0, 3, -3]} intensity={0.3} color={INDIGO} />

          <ConveyorBelt />
          <ProcessingNodes />
          <ScanBeam />
          <AmbientDust />
        </Suspense>
      </Canvas>
    </div>
  )
}
