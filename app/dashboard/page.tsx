"use client"

import { MetricCards } from "@/components/dashboard/metric-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { DemandMap } from "@/components/dashboard/demand-map"
import { motion } from "framer-motion"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Autonomous retail intelligence overview</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <MetricCards />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-6 lg:grid-cols-5"
      >
        <div className="lg:col-span-3">
          <DemandMap />
        </div>
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
      </motion.div>
    </div>
  )
}
