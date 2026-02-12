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

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/simulation", label: "Simulation", icon: FlaskConical },
  { href: "/dashboard/autopilot", label: "Autopilot", icon: Bot },
  { href: "/dashboard/blockchain", label: "Blockchain Log", icon: Link2 },
  { href: "/dashboard/credit-score", label: "Credit Score", icon: CreditCard },
]

interface DashboardSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { address, isConnected, networkName, connect, isConnecting } = useWallet()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card/80 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-16" : "w-16 lg:w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-3 lg:px-4">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">V</span>
          </div>
          {!collapsed && <span className="hidden text-lg font-bold text-foreground lg:block">VyavsAI</span>}
        </Link>
        <button
          onClick={onToggle}
          className="hidden rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:block"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 lg:p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                collapsed && "justify-center lg:justify-center",
                !collapsed && "lg:justify-start justify-center"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="hidden lg:block">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Wallet Status */}
      <div className="border-t border-border p-2 lg:p-3">
        {isConnected ? (
          <div className={cn("rounded-lg bg-secondary/50 p-2 lg:p-3")}>
            {!collapsed ? (
              <div className="hidden lg:block">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Circle className="h-2 w-2 fill-primary text-primary" />
                  {networkName}
                </div>
                <p className="mt-1 font-mono text-xs text-foreground">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            ) : null}
            <div className={cn("flex justify-center", !collapsed && "lg:hidden")}>
              <Circle className="h-2.5 w-2.5 fill-primary text-primary" />
            </div>
          </div>
        ) : (
          <button
            onClick={connect}
            disabled={isConnecting}
            title="Connect Wallet"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-2 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 lg:px-3"
          >
            <Wallet className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span className="hidden lg:block">{isConnecting ? "Connecting..." : "Connect Wallet"}</span>}
          </button>
        )}
      </div>
    </aside>
  )
}
