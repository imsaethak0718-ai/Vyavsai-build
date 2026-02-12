"use client"

import { TrendingUp, TrendingDown, DollarSign, ShieldAlert, Activity, BarChart3 } from "lucide-react"
import { AnimatedCounter } from "@/components/animated-counter"

const metrics = [
  {
    label: "Projected Revenue",
    value: 98000,
    prefix: "$",
    suffix: "",
    change: "+14.2%",
    positive: true,
    icon: DollarSign,
  },
  {
    label: "Profit Projection",
    value: 34200,
    prefix: "$",
    suffix: "",
    change: "+8.7%",
    positive: true,
    icon: TrendingUp,
  },
  {
    label: "Risk Score",
    value: 22,
    prefix: "",
    suffix: "%",
    change: "-3.1%",
    positive: true,
    icon: ShieldAlert,
  },
  {
    label: "Price Elasticity",
    value: 1.42,
    prefix: "",
    suffix: "",
    change: "+0.08",
    positive: true,
    icon: Activity,
    decimals: 2,
  },
  {
    label: "Return Risk",
    value: 4.8,
    prefix: "",
    suffix: "%",
    change: "-0.5%",
    positive: true,
    icon: BarChart3,
    decimals: 1,
  },
]

export function MetricCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-sm transition-all hover:border-primary/20"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3 text-2xl font-bold text-foreground">
            <AnimatedCounter
              end={metric.value}
              prefix={metric.prefix}
              suffix={metric.suffix}
              decimals={metric.decimals ?? 0}
            />
          </div>
          <div className="mt-1 flex items-center gap-1">
            {metric.positive ? (
              <TrendingUp className="h-3 w-3 text-primary" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )}
            <span className={`text-xs font-medium ${metric.positive ? "text-primary" : "text-destructive"}`}>
              {metric.change}
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  )
}
