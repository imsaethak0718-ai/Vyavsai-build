"use client"

import { useEffect, useRef } from "react"

export function CtaScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let w = 0
    let h = 0

    function resize() {
      w = canvas!.parentElement?.clientWidth || window.innerWidth
      h = canvas!.parentElement?.clientHeight || window.innerHeight
      canvas!.width = w * window.devicePixelRatio
      canvas!.height = h * window.devicePixelRatio
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    // Growth bars
    const bars = Array.from({ length: 9 }, (_, i) => ({
      targetH: 0.08 + (i / 8) * 0.28 + Math.sin(i * 0.7) * 0.04,
      hue: i >= 7 ? 310 : i >= 4 ? 280 : 250,
      phase: i * 0.4,
    }))

    // Orbiting tokens
    const tokens = Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      radius: 0.18,
      speed: 0.25,
      hue: [310, 280, 250, 290, 310, 270, 300, 260][i],
    }))

    // Spiral particles
    const spiralParts = Array.from({ length: 100 }, (_, i) => {
      const t = (i / 100) * Math.PI * 6
      const r = 0.02 + (i / 100) * 0.15
      return {
        xBase: Math.cos(t) * r,
        yBase: (i / 100 - 0.5) * 0.4,
        zAngle: t,
        alpha: 0.25 + (i / 100) * 0.35,
      }
    })

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h)

      const cx = w * 0.5
      const cy = h * 0.5

      // Spiral particles
      const spiralRotation = t * 0.15
      spiralParts.forEach((p) => {
        const angle = p.zAngle + spiralRotation
        const r = Math.abs(p.xBase) * Math.min(w, h) * 2
        const px = cx + Math.cos(angle) * r
        const py = cy + p.yBase * h + Math.sin(angle) * r * 0.3

        ctx!.beginPath()
        ctx!.arc(px, py, 1.2, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(280, 55%, 68%, ${p.alpha})`
        ctx!.fill()
      })

      // Growth bar chart (left side)
      const chartBaseX = w * 0.15
      const chartBaseY = h * 0.65
      bars.forEach((bar, i) => {
        const anim = Math.min(1, Math.max(0, (t * 0.4 - i * 0.12)))
        const ease = 1 - Math.pow(1 - anim, 3)
        const breathe = 1 + Math.sin(t * 0.7 + bar.phase) * 0.06
        const bh = bar.targetH * h * ease * breathe
        const bx = chartBaseX + i * 16
        const by = chartBaseY - bh

        const barGrad = ctx!.createLinearGradient(bx, by, bx, chartBaseY)
        barGrad.addColorStop(0, `hsla(${bar.hue}, 60%, 65%, 0.4)`)
        barGrad.addColorStop(1, `hsla(${bar.hue}, 45%, 40%, 0.15)`)
        ctx!.fillStyle = barGrad
        ctx!.fillRect(bx, by, 10, bh)

        ctx!.fillStyle = `hsla(${bar.hue}, 70%, 72%, 0.5)`
        ctx!.fillRect(bx, by, 10, 2)
      })
      // Chart baseline
      ctx!.strokeStyle = "hsla(270, 40%, 55%, 0.15)"
      ctx!.lineWidth = 1
      ctx!.beginPath()
      ctx!.moveTo(chartBaseX - 4, chartBaseY)
      ctx!.lineTo(chartBaseX + 9 * 16 + 6, chartBaseY)
      ctx!.stroke()

      // Trend arrow
      ctx!.beginPath()
      const arrowStartX = w * 0.62
      const arrowStartY = h * 0.6
      ctx!.moveTo(arrowStartX, arrowStartY)
      for (let i = 0; i <= 20; i++) {
        const frac = i / 20
        const ax = arrowStartX + frac * w * 0.22
        const ay = arrowStartY - frac * h * 0.2 + Math.sin(frac * 4) * 4
        ctx!.lineTo(ax, ay)
      }
      ctx!.strokeStyle = "hsla(310, 60%, 65%, 0.35)"
      ctx!.lineWidth = 2
      ctx!.stroke()

      // Arrow head
      const tipX = arrowStartX + w * 0.22
      const tipY = arrowStartY - h * 0.2
      ctx!.beginPath()
      ctx!.moveTo(tipX, tipY)
      ctx!.lineTo(tipX - 8, tipY + 6)
      ctx!.lineTo(tipX - 3, tipY + 10)
      ctx!.closePath()
      ctx!.fillStyle = "hsla(310, 65%, 68%, 0.5)"
      ctx!.fill()

      // Orbiting tokens
      tokens.forEach((tok) => {
        const angle = t * tok.speed + tok.angle
        const r = tok.radius * Math.min(w, h)
        const tx = cx + Math.cos(angle) * r
        const ty = cy + Math.sin(angle) * r * 0.4

        // Glow
        const glow = ctx!.createRadialGradient(tx, ty, 0, tx, ty, 10)
        glow.addColorStop(0, `hsla(${tok.hue}, 65%, 68%, 0.4)`)
        glow.addColorStop(1, "transparent")
        ctx!.fillStyle = glow
        ctx!.fillRect(tx - 10, ty - 10, 20, 20)

        // Token circle
        ctx!.beginPath()
        ctx!.arc(tx, ty, 4, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(${tok.hue}, 70%, 70%, 0.6)`
        ctx!.fill()
        ctx!.strokeStyle = `hsla(${tok.hue}, 60%, 75%, 0.3)`
        ctx!.lineWidth = 1
        ctx!.stroke()
      })
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
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
