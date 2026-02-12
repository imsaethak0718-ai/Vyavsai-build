"use client"

import { MetricCards } from "@/components/dashboard/metric-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { IndiaHeatmap } from "@/components/dashboard/india-heatmap"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Autonomous retail intelligence overview</p>
      </div>

      <MetricCards />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <IndiaHeatmap />
        </div>
      </div>
    </div>
  )
}
