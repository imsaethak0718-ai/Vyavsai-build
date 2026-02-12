"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useWallet } from "@/context/wallet-context"
import {
  LayoutDashboard,
  FlaskConical,
  Bot,
  Link2,
  CreditCard,
  ChevronLeft,
  Wallet,
  Circle,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/simulation", label: "Simulation", icon: FlaskConical },
  { href: "/dashboard/autopilot", label: "Autopilot", icon: Bot },
  { href: "/dashboard/blockchain", label: "Blockchain Log", icon: Link2 },
  { href: "/dashboard/credit-score", label: "Credit Score", icon: CreditCard },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { address, isConnected, networkName, connect, isConnecting } = useWallet()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card/80 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">V</span>
            </div>
            <span className="text-lg font-bold text-foreground">VyavsAI</span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">V</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
            collapsed && "mx-auto mt-2"
          )}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary glow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        {isConnected ? (
          <div className={cn("rounded-lg bg-secondary/50 p-3", collapsed && "p-2")}>
            {!collapsed ? (
              <>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Circle className="h-2 w-2 fill-primary text-primary" />
                  {networkName}
                </div>
                <p className="mt-1 font-mono text-xs text-foreground">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </>
            ) : (
              <div className="flex justify-center">
                <Circle className="h-2.5 w-2.5 fill-primary text-primary" />
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={connect}
            disabled={isConnecting}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
              collapsed && "px-2"
            )}
          >
            <Wallet className="h-4 w-4 flex-shrink-0" />
            {!collapsed && (isConnecting ? "Connecting..." : "Connect Wallet")}
          </button>
        )}
      </div>
    </aside>
  )
}
