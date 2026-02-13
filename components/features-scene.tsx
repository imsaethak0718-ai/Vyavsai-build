"use client"

import { useEffect, useRef } from "react"

export function FeaturesScene() {
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

    // Network nodes
    const nodes = Array.from({ length: 25 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
      size: 1.5 + Math.random() * 2,
      hue: 250 + Math.random() * 70,
    }))

    // Floating mini bar chart data
    const bars = Array.from({ length: 7 }, (_, i) => ({
      baseH: 0.12 + Math.random() * 0.18,
      hue: [270, 300, 250, 310, 280, 260, 290][i],
      phase: i * 0.6,
    }))

    // Pie chart segments
    const pieSegments = [
      { value: 0.35, hue: 270 },
      { value: 0.25, hue: 320 },
      { value: 0.2, hue: 250 },
      { value: 0.2, hue: 290 },
    ]

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h)

      // Connection lines
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return
          const dx = (a.x - b.x) * w
          const dy = (a.y - b.y) * h
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 140) {
            ctx!.beginPath()
            ctx!.moveTo(a.x * w, a.y * h)
            ctx!.lineTo(b.x * w, b.y * h)
            ctx!.strokeStyle = `hsla(270, 40%, 60%, ${0.08 * (1 - dist / 140)})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        })
      })

      // Animate nodes
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > 1) n.vx *= -1
        if (n.y < 0 || n.y > 1) n.vy *= -1

        const glow = ctx!.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, n.size * 3)
        glow.addColorStop(0, `hsla(${n.hue}, 60%, 65%, 0.35)`)
        glow.addColorStop(1, "transparent")
        ctx!.fillStyle = glow
        ctx!.fillRect(n.x * w - n.size * 3, n.y * h - n.size * 3, n.size * 6, n.size * 6)

        ctx!.beginPath()
        ctx!.arc(n.x * w, n.y * h, n.size, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(${n.hue}, 60%, 65%, 0.4)`
        ctx!.fill()
      })

      // Floating bar chart (bottom-right)
      const chartX = w * 0.75
      const chartY = h * 0.72
      bars.forEach((bar, i) => {
        const animH = bar.baseH + Math.sin(t * 0.7 + bar.phase) * 0.05
        const bh = animH * h * 0.22
        const bx = chartX + i * 14
        const by = chartY - bh

        const barGrad = ctx!.createLinearGradient(bx, by, bx, chartY)
        barGrad.addColorStop(0, `hsla(${bar.hue}, 60%, 65%, 0.3)`)
        barGrad.addColorStop(1, `hsla(${bar.hue}, 50%, 45%, 0.1)`)
        ctx!.fillStyle = barGrad
        ctx!.fillRect(bx, by, 9, bh)

        // Top highlight
        ctx!.fillStyle = `hsla(${bar.hue}, 70%, 72%, 0.4)`
        ctx!.fillRect(bx, by, 9, 2)
      })
      // Chart base line
      ctx!.strokeStyle = "hsla(270, 40%, 55%, 0.15)"
      ctx!.lineWidth = 1
      ctx!.beginPath()
      ctx!.moveTo(chartX - 4, chartY)
      ctx!.lineTo(chartX + 7 * 14 + 10, chartY)
      ctx!.stroke()

      // Floating pie chart (top-left)
      const pieX = w * 0.15
      const pieY = h * 0.25
      const pieR = Math.min(w, h) * 0.05
      let startAngle = t * 0.15
      pieSegments.forEach((seg) => {
        const endAngle = startAngle + seg.value * Math.PI * 2
        ctx!.beginPath()
        ctx!.moveTo(pieX, pieY)
        ctx!.arc(pieX, pieY, pieR, startAngle, endAngle)
        ctx!.closePath()
        ctx!.fillStyle = `hsla(${seg.hue}, 55%, 58%, 0.2)`
        ctx!.fill()
        ctx!.strokeStyle = `hsla(${seg.hue}, 60%, 65%, 0.3)`
        ctx!.lineWidth = 1
        ctx!.stroke()
        startAngle = endAngle
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
