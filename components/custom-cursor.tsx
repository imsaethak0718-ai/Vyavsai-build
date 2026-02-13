"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  const trailConfig = { damping: 30, stiffness: 150, mass: 0.8 }
  const trailX = useSpring(cursorX, trailConfig)
  const trailY = useSpring(cursorY, trailConfig)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    },
    [cursorX, cursorY, isVisible]
  )

  useEffect(() => {
    const handleEnter = () => setIsHovering(true)
    const handleLeave = () => setIsHovering(false)
    const handleDown = () => setIsClicking(true)
    const handleUp = () => setIsClicking(false)
    const handleOut = () => setIsVisible(false)
    const handleOver = () => setIsVisible(true)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleDown)
    window.addEventListener("mouseup", handleUp)
    document.addEventListener("mouseout", handleOut)
    document.addEventListener("mouseover", handleOver)

    const hoverTargets = document.querySelectorAll(
      'a, button, [role="button"], input, select, textarea, label, [data-hover]'
    )
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter)
      el.addEventListener("mouseleave", handleLeave)
    })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleDown)
      window.removeEventListener("mouseup", handleUp)
      document.removeEventListener("mouseout", handleOut)
      document.removeEventListener("mouseover", handleOver)
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter)
        el.removeEventListener("mouseleave", handleLeave)
      })
    }
  }, [handleMouseMove])

  // Re-attach hover listeners when DOM changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const handleEnter = () => setIsHovering(true)
      const handleLeave = () => setIsHovering(false)
      const targets = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, label, [data-hover]'
      )
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter)
        el.removeEventListener("mouseleave", handleLeave)
        el.addEventListener("mouseenter", handleEnter)
        el.addEventListener("mouseleave", handleLeave)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  // Hide on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) return null

  return (
    <>
      {/* Main dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.6 : isHovering ? 0.5 : 1,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
          className="h-3 w-3 rounded-full"
          style={{
            background: "hsl(270 80% 65%)",
            boxShadow: "0 0 12px 2px hsl(270 80% 65% / 0.6)",
          }}
        />
      </motion.div>

      {/* Trailing ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 56 : 36,
            height: isHovering ? 56 : 36,
            opacity: isVisible ? (isHovering ? 0.8 : 0.4) : 0,
            borderColor: isHovering
              ? "hsl(320 70% 60% / 0.7)"
              : "hsl(270 80% 65% / 0.3)",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-full border-2"
          style={{
            boxShadow: isHovering
              ? "0 0 20px 4px hsl(320 70% 60% / 0.2), inset 0 0 10px hsl(320 70% 60% / 0.05)"
              : "none",
          }}
        />
      </motion.div>

      {/* Glow trail on hover */}
      {isHovering && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 z-[9997]"
          style={{
            x: trailX,
            y: trailY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-20 w-20 rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(270 80% 65% / 0.3) 0%, hsl(320 70% 60% / 0.1) 50%, transparent 70%)",
            }}
          />
        </motion.div>
      )}
    </>
  )
}
