"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main
        className={cn(
          "flex-1 transition-all duration-300 p-6 lg:p-8",
          collapsed ? "ml-16" : "ml-16 lg:ml-64"
        )}
      >
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
