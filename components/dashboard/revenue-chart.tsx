"use client"

import { revenueData } from "@/lib/mock-data"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="mt-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-muted-foreground">{entry.name}:</span>
          <span className="text-xs font-semibold text-foreground">
            ${(entry.value / 1000).toFixed(0)}K
          </span>
        </div>
      ))}
    </div>
  )
}

export function RevenueChart() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Revenue Forecast</h3>
          <p className="text-xs text-muted-foreground">Actual vs projected revenue</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#a855f7" }} />
            <span className="text-xs text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#ec4899" }} />
            <span className="text-xs text-muted-foreground">Forecast</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={revenueData}>
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(270 18% 14%)" />
          <XAxis dataKey="month" stroke="hsl(270 12% 40%)" tick={{ fontSize: 11 }} />
          <YAxis
            stroke="hsl(270 12% 40%)"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `$${v / 1000}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#a855f7"
            strokeWidth={2}
            fill="url(#actualGradient)"
            dot={{ r: 3, fill: "#a855f7" }}
            connectNulls={false}
            name="Actual"
          />
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="#ec4899"
            strokeWidth={2}
            strokeDasharray="6 3"
            fill="url(#forecastGradient)"
            dot={{ r: 3, fill: "#ec4899" }}
            name="Forecast"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
