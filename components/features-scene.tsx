"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, Suspense, useMemo } from "react"
import type { Points, Group, Mesh } from "three"
import * as THREE from "three"

const VIOLET = "#a855f7"
const PINK = "#ec4899"
const INDIGO = "#6366f1"

/* ── Floating 3D bar chart ── */
function BarChart3D() {
  const groupRef = useRef<Group>(null)

  const bars = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        height: 0.4 + Math.random() * 1.2,
        x: (i - 3) * 0.45,
        color: [VIOLET, PINK, INDIGO, VIOLET, PINK, INDIGO, VIOLET][i],
      })),
    []
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.2
    groupRef.current.children.forEach((child, i) => {
      const bar = bars[i]
      if (!bar) return
      const scaleY = 0.5 + (Math.sin(t * 0.5 + i * 0.6) + 1) * 0.5 * bar.height
      child.scale.y = scaleY
      child.position.y = scaleY * 0.5
    })
  })

  return (
    <group ref={groupRef} position={[-4, -0.5, -2]} rotation={[0.2, 0.5, 0]}>
      {bars.map((bar, i) => (
        <mesh key={i} position={[bar.x, bar.height * 0.5, 0]}>
          <boxGeometry args={[0.25, 1, 0.25]} />
          <meshStandardMaterial
            color={bar.color}
            transparent
            opacity={0.25}
            emissive={bar.color}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
      {/* Base line */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3.5, 0.01, 0.3]} />
        <meshStandardMaterial color={VIOLET} transparent opacity={0.1} emissive={VIOLET} emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

/* ── Floating pie chart ── */
function PieChart3D() {
  const groupRef = useRef<Group>(null)

  const segments = useMemo(() => {
    const data = [
      { value: 0.35, color: VIOLET },
      { value: 0.25, color: PINK },
      { value: 0.2, color: INDIGO },
      { value: 0.2, color: "#7c3aed" },
    ]
    let startAngle = 0
    return data.map((d) => {
      const angle = d.value * Math.PI * 2
      const seg = { startAngle, angle, color: d.color }
      startAngle += angle
      return seg
    })
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[4.5, 1, -2]} rotation={[0.3, 0, 0]}>
      {segments.map((seg, i) => {
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        const steps = 20
        for (let s = 0; s <= steps; s++) {
          const a = seg.startAngle + (s / steps) * seg.angle
          shape.lineTo(Math.cos(a) * 0.8, Math.sin(a) * 0.8)
        }
        shape.lineTo(0, 0)

        return (
          <mesh key={i}>
            <extrudeGeometry
              args={[
                shape,
                { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 },
              ]}
            />
            <meshStandardMaterial
              color={seg.color}
              transparent
              opacity={0.2}
              emissive={seg.color}
              emissiveIntensity={0.5}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/* ── Floating supply chain nodes ── */
function SupplyChainFlow() {
  const groupRef = useRef<Group>(null)

  const nodes = useMemo(
    () => [
      { x: -2, y: 2, label: "Supplier", color: PINK },
      { x: -0.5, y: 2.4, label: "Warehouse", color: VIOLET },
      { x: 1, y: 1.8, label: "AI Engine", color: INDIGO },
      { x: 2.5, y: 2.2, label: "Retailer", color: PINK },
    ],
    []
  )

  const linePositions = useMemo(() => {
    const verts: number[] = []
    for (let i = 0; i < nodes.length - 1; i++) {
      verts.push(nodes[i].x, nodes[i].y, -1)
      verts.push(nodes[i + 1].x, nodes[i + 1].y, -1)
    }
    return new Float32Array(verts)
  }, [nodes])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      if (i < nodes.length) {
        child.position.y = nodes[i].y + Math.sin(state.clock.elapsedTime * 0.6 + i * 0.8) * 0.1
      }
    })
  })

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={[node.x, node.y, -1]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={2} />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={VIOLET} transparent opacity={0.15} />
      </lineSegments>
    </group>
  )
}

/* ── Ambient particles ── */
function DriftParticles() {
  const pointsRef = useRef<Points>(null)

  const positions = useMemo(() => {
    const count = 120
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
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
      <pointsMaterial color={PINK} size={0.018} transparent opacity={0.25} sizeAttenuation depthWrite={false} />
    </points>
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

          <BarChart3D />
          <PieChart3D />
          <SupplyChainFlow />
          <DriftParticles />
        </Suspense>
      </Canvas>
    </div>
  )
}
