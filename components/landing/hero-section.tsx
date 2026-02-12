"use client"

import Link from "next/link"
import { useWallet } from "@/context/wallet-context"
import { HeroScene } from "@/components/hero-scene"
import { ArrowRight, Wallet } from "lucide-react"

export function HeroSection() {
  const { connect, isConnected, isConnecting } = useWallet()

  return (
    <section className="relative min-h-screen overflow-hidden gradient-hero">
      <HeroScene />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">Autonomous Retail Intelligence Infrastructure</span>
        </div>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl text-balance">
          Predict. Simulate.{" "}
          <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Optimize.
          </span>{" "}
          Execute.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          VyavsAI combines AI-powered demand forecasting with blockchain-verified
          smart contracts to autonomously optimize your retail operations across India.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-md"
          >
            Launch Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {!isConnected && (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-card/80 hover:border-primary/30"
            >
              <Wallet className="h-4 w-4" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
