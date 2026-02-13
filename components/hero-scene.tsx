"use client"

import { Canvas, useFrame, extend } from "@react-three/fiber"
import { useRef, Suspense, useMemo } from "react"
import type { Mesh, Group, Points, ShaderMaterial } from "three"
import * as THREE from "three"

/* ── Gradient Sphere with custom shader ── */
const gradientVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    // Subtle vertex displacement for organic feel
    vec3 pos = position;
    float displacement = sin(pos.x * 3.0 + uTime) * sin(pos.y * 3.0 + uTime * 0.7) * sin(pos.z * 3.0 + uTime * 0.5) * 0.06;
    pos += normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const gradientFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    // Vibrant violet-to-pink-to-indigo gradient based on normals + position
    vec3 violet = vec3(0.75, 0.52, 0.99);   // #bf84fd
    vec3 pink = vec3(0.96, 0.47, 0.73);     // #f578ba
    vec3 indigo = vec3(0.51, 0.40, 0.98);   // #8266fa
    vec3 cyan = vec3(0.40, 0.84, 0.98);     // #66d6fa

    float t1 = vNormal.y * 0.5 + 0.5;
    float t2 = sin(vPosition.x * 2.0 + uTime * 0.5) * 0.5 + 0.5;
    float t3 = cos(vPosition.z * 2.0 + uTime * 0.3) * 0.5 + 0.5;

    vec3 color = mix(violet, pink, t1);
    color = mix(color, indigo, t2 * 0.5);
    color = mix(color, cyan, t3 * 0.25);

    // Fresnel glow at edges
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
    color += vec3(0.6, 0.3, 0.9) * fresnel * 0.8;

    // Pulsing brightness
    float pulse = 0.85 + sin(uTime * 0.8) * 0.15;
    color *= pulse;

    gl_FragColor = vec4(color, 0.92);
  }
`

function GradientSphere() {
  const meshRef = useRef<Mesh>(null)
  const matRef = useRef<ShaderMaterial>(null)

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.12
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.1
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={gradientVertexShader}
        fragmentShader={gradientFragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
      />
    </mesh>
  )
}

/* ── Inner glow core ── */
function InnerCore() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const s = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.08
    meshRef.current.scale.setScalar(s)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial
        color="#e879f9"
        emissive="#e879f9"
        emissiveIntensity={4}
        transparent
        opacity={0.35}
      />
    </mesh>
  )
}

/* ── Orbital rings ── */
function OrbitalRing({ radius, tiltX, tiltZ, speed, color, thickness }: {
  radius: number; tiltX: number; tiltZ: number; speed: number; color: string; thickness: number
}) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.z = state.clock.elapsedTime * speed
  })

  return (
    <mesh ref={meshRef} rotation={[tiltX, 0, tiltZ]}>
      <torusGeometry args={[radius, thickness, 16, 120]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.5}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

function Orbits() {
  return (
    <group>
      <OrbitalRing radius={2.2} tiltX={1.2} tiltZ={0.3} speed={0.18} color="#c084fc" thickness={0.012} />
      <OrbitalRing radius={2.6} tiltX={0.5} tiltZ={-0.8} speed={-0.12} color="#f472b6" thickness={0.01} />
      <OrbitalRing radius={3.0} tiltX={-0.3} tiltZ={1.5} speed={0.08} color="#818cf8" thickness={0.008} />
      <OrbitalRing radius={3.4} tiltX={0.9} tiltZ={-0.4} speed={-0.15} color="#e879f9" thickness={0.009} />
      <OrbitalRing radius={1.9} tiltX={-0.8} tiltZ={0.6} speed={0.22} color="#f9a8d4" thickness={0.011} />
    </group>
  )
}

/* ── Orbiting particles along rings ── */
function OrbitParticles() {
  const groupRef = useRef<Group>(null)

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        radius: 2.0 + (i % 5) * 0.4,
        speed: 0.15 + (i % 3) * 0.1,
        offset: (i / 20) * Math.PI * 2,
        tiltX: [1.2, 0.5, -0.3, 0.9, -0.8][i % 5],
        tiltZ: [0.3, -0.8, 1.5, -0.4, 0.6][i % 5],
        size: 0.035 + (i % 4) * 0.012,
        color: ["#c084fc", "#f472b6", "#818cf8", "#e879f9", "#f9a8d4"][i % 5],
      })),
    []
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i]
      if (!p) return
      const angle = t * p.speed * (i % 2 === 0 ? 1 : -1) + p.offset
      // Rotate the point by tilt angles
      const x = Math.cos(angle) * p.radius
      const y = Math.sin(angle) * p.radius * Math.sin(p.tiltX)
      const z = Math.sin(angle) * p.radius * Math.cos(p.tiltX)
      child.position.set(x, y, z)
    })
  })

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[p.size, 10, 10]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={5}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Star field background ── */
function StarField() {
  const pointsRef = useRef<Points>(null)

  const positions = useMemo(() => {
    const count = 500
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.random() * 6
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (pointsRef.current) pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d8b4fe" size={0.03} transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/* ── Energy pulses radiating from sphere ── */
function EnergyPulses() {
  const rings = useRef<(Mesh | null)[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    rings.current.forEach((ring, i) => {
      if (!ring) return
      const phase = (t * 0.4 + i * 1.2) % 3
      const scale = 1.5 + phase * 1.2
      ring.scale.setScalar(scale)
      const mat = ring.material as THREE.MeshStandardMaterial
      mat.opacity = Math.max(0, 0.5 - phase * 0.17)
    })
  })

  return (
    <group>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => { rings.current[i] = el }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[1, 0.008, 8, 80]} />
          <meshStandardMaterial
            color="#e879f9"
            emissive="#e879f9"
            emissiveIntensity={3}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#c084fc" />
          <pointLight position={[-5, -3, 3]} intensity={1.2} color="#f472b6" />
          <pointLight position={[0, 4, -5]} intensity={0.8} color="#ffffff" />
          <pointLight position={[0, -4, 4]} intensity={0.6} color="#818cf8" />
          <pointLight position={[3, 0, 3]} intensity={0.8} color="#e879f9" />

          <GradientSphere />
          <InnerCore />
          <Orbits />
          <OrbitParticles />
          <EnergyPulses />
          <StarField />
        </Suspense>
      </Canvas>
    </div>
  )
}
