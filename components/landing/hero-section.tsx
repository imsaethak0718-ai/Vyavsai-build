"use client"

import Link from "next/link"
import { useWallet } from "@/context/wallet-context"
import { HeroScene } from "@/components/hero-scene"
import { ArrowRight, Wallet } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  const { connect, isConnected, isConnecting } = useWallet()

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Multi-layered dark gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(165_80%_48%_/_0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,hsl(200_70%_50%_/_0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_10%_70%,hsl(280_65%_60%_/_0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-background" style={{ opacity: 0.85 }} />
      </div>

      {/* 3D Scene */}
      <HeroScene />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">Autonomous Retail Intelligence Infrastructure</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-4xl text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl text-balance"
        >
          Predict. Simulate.{" "}
          <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-shift_4s_ease-in-out_infinite]">
            Optimize.
          </span>{" "}
          Execute.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty"
        >
          VyavsAI combines AI-powered demand forecasting with blockchain-verified
          smart contracts to autonomously optimize your retail operations across India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-md"
          >
            Launch Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {!isConnected && (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-card/80 hover:border-primary/30"
            >
              <Wallet className="h-4 w-4" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-6 items-start justify-center rounded-full border border-border/50 p-1.5"
          >
            <div className="h-2 w-1 rounded-full bg-primary/60" />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
