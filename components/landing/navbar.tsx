"use client"

import Link from "next/link"
import { useWallet } from "@/context/wallet-context"
import { Wallet, Circle } from "lucide-react"

export function Navbar() {
  const { connect, isConnected, address, isConnecting, networkName } = useWallet()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">V</span>
          </div>
          <span className="text-lg font-bold text-foreground">VyavsAI</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How it Works</Link>
          <Link href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
        </div>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-2 backdrop-blur-sm">
              <Circle className="h-2 w-2 fill-primary text-primary" />
              <span className="text-xs text-muted-foreground">{networkName}</span>
              <span className="font-mono text-xs text-foreground">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Wallet className="h-4 w-4" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
