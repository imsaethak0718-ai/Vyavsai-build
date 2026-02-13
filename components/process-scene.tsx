"use client"

import { useEffect, useRef } from "react"

export function ProcessScene() {
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

    // Pipeline nodes
    const pipeNodes = [
      { xRatio: 0.12, yRatio: 0.45, label: "Ingest", hue: 310 },
      { xRatio: 0.35, yRatio: 0.38, label: "Process", hue: 270 },
      { xRatio: 0.58, yRatio: 0.50, label: "Analyze", hue: 250 },
      { xRatio: 0.82, yRatio: 0.42, label: "Deploy", hue: 290 },
    ]

    // Conveyor packages
    const packages = Array.from({ length: 8 }, (_, i) => ({
      offset: i * 0.125,
      speed: 0.06 + (i % 3) * 0.015,
      size: 8 + (i % 3) * 3,
      hue: [270, 310, 250, 290, 280, 300, 260, 310][i],
      yJitter: (i % 2 === 0 ? 1 : -1) * (2 + (i % 3)),
    }))

    // Dust particles
    const dust = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0002,
      vy: (Math.random() - 0.5) * 0.0002,
      size: 0.8 + Math.random() * 1.2,
      alpha: 0.15 + Math.random() * 0.2,
    }))

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h)

      // Dust
      dust.forEach((d) => {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0 || d.x > 1) d.vx *= -1
        if (d.y < 0 || d.y > 1) d.vy *= -1
        ctx!.beginPath()
        ctx!.arc(d.x * w, d.y * h, d.size, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(270, 40%, 70%, ${d.alpha})`
        ctx!.fill()
      })

      // Connection lines between pipeline nodes
      ctx!.beginPath()
      pipeNodes.forEach((node, i) => {
        const nx = node.xRatio * w
        const ny = node.yRatio * h
        if (i === 0) ctx!.moveTo(nx, ny)
        else ctx!.lineTo(nx, ny)
      })
      ctx!.strokeStyle = "hsla(270, 45%, 55%, 0.15)"
      ctx!.lineWidth = 1.5
      ctx!.setLineDash([8, 6])
      ctx!.stroke()
      ctx!.setLineDash([])

      // Travelling data dot along pipeline
      const pipeFraction = (t * 0.08) % 1
      const totalNodes = pipeNodes.length - 1
      const segIndex = Math.min(Math.floor(pipeFraction * totalNodes), totalNodes - 1)
      const segT = (pipeFraction * totalNodes) - segIndex
      const fromNode = pipeNodes[segIndex]
      const toNode = pipeNodes[segIndex + 1]
      if (fromNode && toNode) {
        const dotX = fromNode.xRatio * w + (toNode.xRatio * w - fromNode.xRatio * w) * segT
        const dotY = fromNode.yRatio * h + (toNode.yRatio * h - fromNode.yRatio * h) * segT
        const glow = ctx!.createRadialGradient(dotX, dotY, 0, dotX, dotY, 14)
        glow.addColorStop(0, "hsla(310, 70%, 70%, 0.6)")
        glow.addColorStop(1, "transparent")
        ctx!.fillStyle = glow
        ctx!.fillRect(dotX - 14, dotY - 14, 28, 28)
        ctx!.beginPath()
        ctx!.arc(dotX, dotY, 3, 0, Math.PI * 2)
        ctx!.fillStyle = "hsla(310, 80%, 75%, 0.9)"
        ctx!.fill()
      }

      // Pipeline nodes
      pipeNodes.forEach((node, i) => {
        const nx = node.xRatio * w
        const ny = node.yRatio * h
        const pulse = 1 + Math.sin(t * 1.5 + i * 1.2) * 0.15
        const r = 10 * pulse

        // Node glow
        const glow = ctx!.createRadialGradient(nx, ny, 0, nx, ny, r * 3)
        glow.addColorStop(0, `hsla(${node.hue}, 65%, 65%, 0.3)`)
        glow.addColorStop(1, "transparent")
        ctx!.fillStyle = glow
        ctx!.fillRect(nx - r * 3, ny - r * 3, r * 6, r * 6)

        // Diamond shape
        ctx!.save()
        ctx!.translate(nx, ny)
        ctx!.rotate(Math.PI / 4)
        ctx!.strokeStyle = `hsla(${node.hue}, 60%, 65%, 0.5)`
        ctx!.lineWidth = 1.5
        ctx!.strokeRect(-r / 2, -r / 2, r, r)
        ctx!.restore()

        // Node center dot
        ctx!.beginPath()
        ctx!.arc(nx, ny, 3, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(${node.hue}, 70%, 72%, 0.7)`
        ctx!.fill()
      })

      // Conveyor belt at bottom
      const beltY = h * 0.78
      // Belt tracks
      for (let lane = 0; lane < 2; lane++) {
        const ly = beltY + lane * 24
        ctx!.beginPath()
        ctx!.moveTo(0, ly)
        ctx!.lineTo(w, ly)
        ctx!.strokeStyle = "hsla(270, 35%, 45%, 0.12)"
        ctx!.lineWidth = 1
        ctx!.setLineDash([5, 7])
        ctx!.stroke()
        ctx!.setLineDash([])
      }

      // Moving packages on conveyor
      packages.forEach((pkg) => {
        const bx = ((pkg.offset + t * pkg.speed) % 1.2) * w - w * 0.1
        const by = beltY + pkg.yJitter

        // Shadow
        ctx!.fillStyle = `hsla(${pkg.hue}, 40%, 20%, 0.2)`
        ctx!.fillRect(bx + 2, by + 2, pkg.size, pkg.size * 0.65)

        // Box face
        const boxGrad = ctx!.createLinearGradient(bx, by, bx + pkg.size, by + pkg.size * 0.65)
        boxGrad.addColorStop(0, `hsla(${pkg.hue}, 55%, 55%, 0.4)`)
        boxGrad.addColorStop(1, `hsla(${pkg.hue + 15}, 45%, 42%, 0.3)`)
        ctx!.fillStyle = boxGrad
        ctx!.fillRect(bx, by, pkg.size, pkg.size * 0.65)

        // Top/left highlight
        ctx!.fillStyle = `hsla(${pkg.hue}, 65%, 72%, 0.3)`
        ctx!.fillRect(bx, by, pkg.size, 1.5)
        ctx!.fillRect(bx, by, 1.5, pkg.size * 0.65)
      })

      // Scan beam
      const beamX = w * 0.5 + Math.sin(t * 0.3) * w * 0.35
      ctx!.fillStyle = "hsla(310, 60%, 60%, 0.04)"
      ctx!.fillRect(beamX - 1.5, 0, 3, h)
      const beamGlow = ctx!.createRadialGradient(beamX, h * 0.5, 0, beamX, h * 0.5, 40)
      beamGlow.addColorStop(0, "hsla(310, 65%, 65%, 0.08)")
      beamGlow.addColorStop(1, "transparent")
      ctx!.fillStyle = beamGlow
      ctx!.fillRect(beamX - 40, 0, 80, h)
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
