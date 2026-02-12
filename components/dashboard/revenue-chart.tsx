"use client"

import { revenueData } from "@/lib/mock-data"
import {
  LineChart,
  Line,
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
    <div className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Revenue Forecast</h3>
          <p className="text-xs text-muted-foreground">Actual vs projected revenue</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-chart-2" />
            <span className="text-xs text-muted-foreground">Forecast</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={revenueData}>
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(165 80% 48%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(165 80% 48%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(200 70% 50%)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="hsl(200 70% 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 14%)" />
          <XAxis dataKey="month" stroke="hsl(215 14% 40%)" tick={{ fontSize: 11 }} />
          <YAxis
            stroke="hsl(215 14% 40%)"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `$${v / 1000}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="hsl(165 80% 48%)"
            strokeWidth={2}
            fill="url(#actualGradient)"
            dot={{ r: 3, fill: "hsl(165 80% 48%)" }}
            connectNulls={false}
            name="Actual"
          />
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="hsl(200 70% 50%)"
            strokeWidth={2}
            strokeDasharray="6 3"
            fill="url(#forecastGradient)"
            dot={{ r: 3, fill: "hsl(200 70% 50%)" }}
            name="Forecast"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
