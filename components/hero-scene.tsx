"use client"

import { useEffect, useRef } from "react"

/* ── Canvas-based 3D-looking gradient sphere with orbits and conveyor boxes ── */

interface Particle {
  angle: number
  radius: number
  speed: number
  tiltX: number
  tiltZ: number
  size: number
  hue: number
}

interface Box {
  x: number
  y: number
  speed: number
  size: number
  hue: number
  opacity: number
  lane: number
}

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let width = 0
    let height = 0

    function resize() {
      width = canvas!.parentElement?.clientWidth || window.innerWidth
      height = canvas!.parentElement?.clientHeight || window.innerHeight
      canvas!.width = width * window.devicePixelRatio
      canvas!.height = height * window.devicePixelRatio
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    // Stars
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 2 + 1,
    }))

    // Orbit particles
    const orbitParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      angle: (i / 30) * Math.PI * 2,
      radius: 120 + (i % 4) * 35,
      speed: 0.003 + (i % 3) * 0.002,
      tiltX: [0.6, -0.4, 0.8, -0.6][i % 4],
      tiltZ: [0.3, -0.5, 0.2, -0.3][i % 4],
      size: 2 + (i % 3),
      hue: [270, 320, 250, 290][i % 4],
    }))

    // Conveyor boxes
    const boxes: Box[] = Array.from({ length: 14 }, (_, i) => ({
      x: Math.random() * 2 - 0.5,
      y: 0,
      speed: 0.3 + Math.random() * 0.4,
      size: 10 + Math.random() * 8,
      hue: [270, 310, 250, 280, 300][i % 5],
      opacity: 0.5 + Math.random() * 0.35,
      lane: i % 3,
    }))

    function drawSphere(t: number, cx: number, cy: number, r: number) {
      // Outer glow
      const outerGlow = ctx!.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.6)
      outerGlow.addColorStop(0, "hsla(270, 60%, 55%, 0.08)")
      outerGlow.addColorStop(0.5, "hsla(290, 50%, 45%, 0.04)")
      outerGlow.addColorStop(1, "transparent")
      ctx!.fillStyle = outerGlow
      ctx!.fillRect(cx - r * 2, cy - r * 2, r * 4, r * 4)

      // Main sphere gradient -- vibrant but not blinding
      const grad = ctx!.createRadialGradient(
        cx - r * 0.25, cy - r * 0.3, r * 0.05,
        cx, cy, r
      )
      const hueShift = Math.sin(t * 0.4) * 15
      grad.addColorStop(0, `hsla(${290 + hueShift}, 75%, 72%, 0.95)`)
      grad.addColorStop(0.3, `hsla(${270 + hueShift}, 70%, 58%, 0.9)`)
      grad.addColorStop(0.6, `hsla(${310 + hueShift}, 60%, 50%, 0.85)`)
      grad.addColorStop(0.85, `hsla(${250 + hueShift}, 65%, 40%, 0.8)`)
      grad.addColorStop(1, `hsla(${240 + hueShift}, 55%, 25%, 0.6)`)

      ctx!.beginPath()
      ctx!.arc(cx, cy, r, 0, Math.PI * 2)
      ctx!.fillStyle = grad
      ctx!.fill()

      // Specular highlight
      const specular = ctx!.createRadialGradient(
        cx - r * 0.3, cy - r * 0.35, 0,
        cx - r * 0.3, cy - r * 0.35, r * 0.5
      )
      specular.addColorStop(0, "hsla(300, 80%, 90%, 0.35)")
      specular.addColorStop(0.5, "hsla(280, 60%, 80%, 0.1)")
      specular.addColorStop(1, "transparent")
      ctx!.beginPath()
      ctx!.arc(cx, cy, r, 0, Math.PI * 2)
      ctx!.fillStyle = specular
      ctx!.fill()

      // Subtle surface shimmer
      for (let i = 0; i < 5; i++) {
        const shimAngle = t * 0.3 + i * 1.25
        const shimX = cx + Math.cos(shimAngle) * r * 0.5
        const shimY = cy + Math.sin(shimAngle) * r * 0.4
        const shimGrad = ctx!.createRadialGradient(shimX, shimY, 0, shimX, shimY, r * 0.25)
        shimGrad.addColorStop(0, `hsla(${300 + i * 20}, 70%, 70%, 0.12)`)
        shimGrad.addColorStop(1, "transparent")
        ctx!.fillStyle = shimGrad
        ctx!.fillRect(cx - r, cy - r, r * 2, r * 2)
      }
    }

    function drawOrbit(t: number, cx: number, cy: number, radius: number, tilt: number, speed: number, hue: number) {
      ctx!.save()
      ctx!.translate(cx, cy)

      const points = 100
      ctx!.beginPath()
      for (let i = 0; i <= points; i++) {
        const a = (i / points) * Math.PI * 2
        const x = Math.cos(a) * radius
        const y = Math.sin(a) * radius * Math.cos(tilt) * 0.4
        if (i === 0) ctx!.moveTo(x, y)
        else ctx!.lineTo(x, y)
      }
      ctx!.strokeStyle = `hsla(${hue}, 60%, 65%, 0.2)`
      ctx!.lineWidth = 1
      ctx!.stroke()

      ctx!.restore()
    }

    function drawOrbitParticle(t: number, cx: number, cy: number, p: Particle) {
      const angle = p.angle + t * p.speed * 8
      const x = cx + Math.cos(angle) * p.radius
      const y = cy + Math.sin(angle) * p.radius * Math.cos(p.tiltX) * 0.4

      const glow = ctx!.createRadialGradient(x, y, 0, x, y, p.size * 4)
      glow.addColorStop(0, `hsla(${p.hue}, 80%, 70%, 0.7)`)
      glow.addColorStop(0.5, `hsla(${p.hue}, 70%, 60%, 0.2)`)
      glow.addColorStop(1, "transparent")
      ctx!.fillStyle = glow
      ctx!.fillRect(x - p.size * 4, y - p.size * 4, p.size * 8, p.size * 8)

      ctx!.beginPath()
      ctx!.arc(x, y, p.size, 0, Math.PI * 2)
      ctx!.fillStyle = `hsla(${p.hue}, 85%, 75%, 0.9)`
      ctx!.fill()
    }

    function drawConveyorBelt(t: number) {
      const beltY = height * 0.82
      const laneGap = 28

      // Belt tracks
      for (let lane = 0; lane < 3; lane++) {
        const ly = beltY + lane * laneGap
        ctx!.beginPath()
        ctx!.moveTo(0, ly)
        ctx!.lineTo(width, ly)
        ctx!.strokeStyle = `hsla(270, 40%, 40%, 0.15)`
        ctx!.lineWidth = 1
        ctx!.setLineDash([6, 8])
        ctx!.stroke()
        ctx!.setLineDash([])

        // Moving dash markers
        const dashOffset = (t * 40 * (lane % 2 === 0 ? 1 : -1)) % 20
        for (let dx = dashOffset; dx < width; dx += 60) {
          ctx!.fillStyle = `hsla(270, 50%, 55%, 0.1)`
          ctx!.fillRect(dx, ly - 1, 20, 2)
        }
      }

      // Boxes
      boxes.forEach((box) => {
        const bx = ((box.x + t * box.speed * 0.02) % 1.5) * width - width * 0.15
        const by = beltY + box.lane * laneGap - box.size / 2

        // Box shadow
        ctx!.fillStyle = `hsla(${box.hue}, 50%, 20%, 0.3)`
        ctx!.fillRect(bx + 3, by + 3, box.size, box.size * 0.7)

        // Box face gradient
        const boxGrad = ctx!.createLinearGradient(bx, by, bx + box.size, by + box.size * 0.7)
        boxGrad.addColorStop(0, `hsla(${box.hue}, 55%, 55%, ${box.opacity})`)
        boxGrad.addColorStop(1, `hsla(${box.hue + 20}, 50%, 40%, ${box.opacity * 0.8})`)
        ctx!.fillStyle = boxGrad
        ctx!.fillRect(bx, by, box.size, box.size * 0.7)

        // Box highlight edge
        ctx!.fillStyle = `hsla(${box.hue}, 70%, 75%, ${box.opacity * 0.4})`
        ctx!.fillRect(bx, by, box.size, 2)
        ctx!.fillRect(bx, by, 2, box.size * 0.7)

        // Box inner line
        ctx!.strokeStyle = `hsla(${box.hue}, 60%, 65%, 0.25)`
        ctx!.lineWidth = 0.5
        ctx!.strokeRect(bx + 3, by + 3, box.size - 6, box.size * 0.7 - 6)
      })
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height)

      // Stars
      stars.forEach((s) => {
        const twinkle = Math.sin(t * s.twinkleSpeed + s.x * 10) * 0.3 + 0.7
        ctx!.beginPath()
        ctx!.arc(s.x * width, s.y * height, s.size, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(270, 30%, 80%, ${s.alpha * twinkle})`
        ctx!.fill()
      })

      const cx = width * 0.5
      const cy = height * 0.38
      const sphereR = Math.min(width, height) * 0.14

      // Orbits behind sphere
      drawOrbit(t, cx, cy, sphereR * 1.7, 0.6, 0.2, 270)
      drawOrbit(t, cx, cy, sphereR * 2.1, -0.4, -0.15, 310)
      drawOrbit(t, cx, cy, sphereR * 2.5, 0.8, 0.1, 250)
      drawOrbit(t, cx, cy, sphereR * 2.9, -0.6, -0.18, 290)

      // Orbit particles behind sphere (back half)
      orbitParticles.forEach((p) => {
        const angle = p.angle + t * p.speed * 8
        const yFactor = Math.sin(angle) * Math.cos(p.tiltX) * 0.4
        if (yFactor > 0) drawOrbitParticle(t, cx, cy, p) // behind
      })

      // Sphere
      drawSphere(t, cx, cy, sphereR)

      // Orbit particles in front of sphere
      orbitParticles.forEach((p) => {
        const angle = p.angle + t * p.speed * 8
        const yFactor = Math.sin(angle) * Math.cos(p.tiltX) * 0.4
        if (yFactor <= 0) drawOrbitParticle(t, cx, cy, p) // in front
      })

      // Conveyor belt with moving boxes
      drawConveyorBelt(t)
    }

    function animate() {
      const t = performance.now() / 1000
      draw(t)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
