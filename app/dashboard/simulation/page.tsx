"use client"

import { useState, useCallback } from "react"
import { Slider } from "@/components/ui/slider"
import { AnimatedCounter } from "@/components/animated-counter"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { FlaskConical, Play, RotateCcw } from "lucide-react"

const regions = ["Maharashtra", "Delhi NCR", "Karnataka", "Tamil Nadu", "Gujarat", "Uttar Pradesh"]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="mt-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-muted-foreground">{entry.name}:</span>
          <span className="text-xs font-semibold text-foreground">${(entry.value / 1000).toFixed(1)}K</span>
        </div>
      ))}
    </div>
  )
}

export default function SimulationPage() {
  const [priceChange, setPriceChange] = useState([0])
  const [marketingBudget, setMarketingBudget] = useState([50])
  const [inventoryShift, setInventoryShift] = useState([0])
  const [selectedRegion, setSelectedRegion] = useState("Maharashtra")
  const [isRunning, setIsRunning] = useState(false)
  const [hasResults, setHasResults] = useState(false)

  const projectedRevenue = 98000 + priceChange[0] * 500 + marketingBudget[0] * 200
  const projectedProfit = projectedRevenue * 0.35 - marketingBudget[0] * 80
  const riskVariance = Math.abs(priceChange[0]) * 0.8 + Math.abs(inventoryShift[0]) * 0.3
  const confidence = Math.max(60, 96 - Math.abs(priceChange[0]) * 1.5 - Math.abs(inventoryShift[0]) * 0.5)

  const scenarioData = [
    { scenario: "Conservative", revenue: projectedRevenue * 0.85, profit: projectedProfit * 0.8 },
    { scenario: "Base", revenue: projectedRevenue, profit: projectedProfit },
    { scenario: "Optimistic", revenue: projectedRevenue * 1.15, profit: projectedProfit * 1.25 },
  ]

  const confidenceData = [{ name: "Confidence", value: confidence, fill: "hsl(165 80% 48%)" }]

  const runSimulation = useCallback(() => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      setHasResults(true)
    }, 1500)
  }, [])

  const reset = () => {
    setPriceChange([0])
    setMarketingBudget([50])
    setInventoryShift([0])
    setHasResults(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Digital Twin Simulation</h1>
        <p className="text-sm text-muted-foreground">Test pricing, marketing, and inventory strategies risk-free</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Input Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm">
            <h3 className="mb-6 text-sm font-semibold text-foreground">Simulation Parameters</h3>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">Price Change</label>
                  <span className="font-mono text-xs text-foreground">{priceChange[0] > 0 ? "+" : ""}{priceChange[0]}%</span>
                </div>
                <Slider
                  value={priceChange}
                  onValueChange={setPriceChange}
                  min={-30}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">Marketing Budget</label>
                  <span className="font-mono text-xs text-foreground">${marketingBudget[0]}K</span>
                </div>
                <Slider
                  value={marketingBudget}
                  onValueChange={setMarketingBudget}
                  min={0}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">Inventory Shift</label>
                  <span className="font-mono text-xs text-foreground">{inventoryShift[0] > 0 ? "+" : ""}{inventoryShift[0]}%</span>
                </div>
                <Slider
                  value={inventoryShift}
                  onValueChange={setInventoryShift}
                  min={-50}
                  max={50}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  {regions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={runSimulation}
                  disabled={isRunning}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Simulation
                    </>
                  )}
                </button>
                <button
                  onClick={reset}
                  className="rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Result metric cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">Projected Revenue</p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                ${hasResults ? (projectedRevenue / 1000).toFixed(1) : "0"}K
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">Projected Profit</p>
              <p className="mt-2 text-2xl font-bold text-primary">
                ${hasResults ? (projectedProfit / 1000).toFixed(1) : "0"}K
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">Risk Variance</p>
              <p className="mt-2 text-2xl font-bold text-chart-3">
                {hasResults ? riskVariance.toFixed(1) : "0"}%
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="mt-2 text-2xl font-bold text-chart-2">
                {hasResults ? confidence.toFixed(1) : "0"}%
              </p>
            </div>
          </div>

          {/* Scenario Chart */}
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Scenario Analysis - {selectedRegion}</h3>
            {hasResults ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={scenarioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 14%)" />
                  <XAxis dataKey="scenario" stroke="hsl(215 14% 40%)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="hsl(215 14% 40%)" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="hsl(165 80% 48%)" radius={[6, 6, 0, 0]} name="Revenue" />
                  <Bar dataKey="profit" fill="hsl(200 70% 50%)" radius={[6, 6, 0, 0]} name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-60 items-center justify-center text-sm text-muted-foreground">
                <div className="text-center">
                  <FlaskConical className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
                  <p>Run a simulation to see results</p>
                </div>
              </div>
            )}
          </div>

          {/* Confidence gauge */}
          {hasResults && (
            <div className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm">
              <h3 className="mb-2 text-sm font-semibold text-foreground">Simulation Confidence Gauge</h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={140} height={140}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={10}
                    data={confidenceData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={5}
                      background={{ fill: "hsl(220 14% 14%)" }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div>
                  <p className="text-3xl font-bold text-foreground">{confidence.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">
                    {confidence >= 85 ? "High confidence - safe to execute" :
                     confidence >= 70 ? "Moderate confidence - review before executing" :
                     "Low confidence - adjust parameters"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
