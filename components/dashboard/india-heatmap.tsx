"use client"

import { useState } from "react"
import { indiaRegions } from "@/lib/mock-data"

function getDemandColor(demand: number): string {
  if (demand >= 85) return "hsl(165 80% 48%)"
  if (demand >= 75) return "hsl(165 60% 40%)"
  if (demand >= 65) return "hsl(200 70% 50%)"
  return "hsl(215 14% 35%)"
}

function getDemandOpacity(demand: number): number {
  return 0.4 + (demand / 100) * 0.6
}

export function IndiaHeatmap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const hovered = indiaRegions.find((r) => r.id === hoveredRegion)

  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm">
      <h3 className="mb-1 text-sm font-semibold text-foreground">Regional Demand DNA</h3>
      <p className="mb-4 text-xs text-muted-foreground">India demand heatmap by state</p>

      <div className="relative mx-auto" style={{ width: 400, height: 520 }}>
        {/* Simplified India outline */}
        <svg viewBox="0 0 400 560" className="absolute inset-0 h-full w-full">
          <path
            d="M200 30 L260 60 L290 100 L320 130 L340 170 L350 220 L340 270 L330 300 L320 340 L300 380 L280 410 L260 440 L240 470 L220 500 L200 530 L180 510 L170 480 L155 450 L140 420 L120 380 L100 340 L90 300 L80 260 L85 220 L100 180 L120 140 L150 100 L170 70 Z"
            fill="none"
            stroke="hsl(220 14% 20%)"
            strokeWidth="1.5"
            opacity={0.5}
          />
        </svg>

        {/* Region dots */}
        {indiaRegions.map((region) => (
          <div
            key={region.id}
            className="absolute cursor-pointer transition-all duration-300"
            style={{
              left: region.x,
              top: region.y,
              transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width: hoveredRegion === region.id ? region.size * 1.3 : region.size,
                height: hoveredRegion === region.id ? region.size * 1.3 : region.size,
                backgroundColor: getDemandColor(region.demand),
                opacity: getDemandOpacity(region.demand),
                boxShadow: hoveredRegion === region.id
                  ? `0 0 20px ${getDemandColor(region.demand)}60`
                  : "none",
              }}
            />
            {hoveredRegion === region.id && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full">
                <span className="whitespace-nowrap rounded bg-card border border-border px-2 py-0.5 text-[10px] font-medium text-foreground shadow-lg">
                  {region.name}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tooltip panel */}
      {hovered && (
        <div className="mt-4 rounded-xl border border-border/50 bg-secondary/40 p-4">
          <p className="text-sm font-semibold text-foreground">{hovered.name}</p>
          <div className="mt-2 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Demand Index</p>
              <p className="text-lg font-bold text-primary">{hovered.demand}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Risk Score</p>
              <p className="text-lg font-bold text-chart-3">{hovered.risk}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-sm font-medium text-foreground">{hovered.category}</p>
            </div>
          </div>
        </div>
      )}

      {!hovered && (
        <div className="mt-4 rounded-xl border border-border/50 bg-secondary/40 p-4">
          <p className="text-xs text-muted-foreground text-center">Hover over a region to see demand details</p>
        </div>
      )}
    </div>
  )
}
