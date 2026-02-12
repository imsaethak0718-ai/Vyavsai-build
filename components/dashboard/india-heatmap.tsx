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
    <div className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm h-full">
      <h3 className="mb-1 text-sm font-semibold text-foreground">Regional Demand DNA</h3>
      <p className="mb-4 text-xs text-muted-foreground">India demand heatmap by state</p>

      <div className="relative mx-auto" style={{ maxWidth: 360, aspectRatio: "360/460" }}>
        {/* Simplified India outline */}
        <svg viewBox="0 0 400 520" className="absolute inset-0 h-full w-full">
          <path
            d="M190 20 L220 25 L250 35 L270 55 L290 70 L310 95 L330 120 L345 150 L355 185 L360 220 L355 255 L345 290 L330 320 L315 350 L295 380 L275 405 L255 430 L240 455 L225 475 L210 490 L200 500 L190 490 L180 475 L170 455 L158 430 L145 400 L130 370 L115 340 L100 305 L90 270 L82 235 L80 200 L85 165 L95 135 L110 108 L130 82 L150 58 L170 38 Z"
            fill="none"
            stroke="hsl(220 14% 18%)"
            strokeWidth="1.5"
            opacity={0.6}
          />
          {/* Subtle inner glow */}
          <path
            d="M190 20 L220 25 L250 35 L270 55 L290 70 L310 95 L330 120 L345 150 L355 185 L360 220 L355 255 L345 290 L330 320 L315 350 L295 380 L275 405 L255 430 L240 455 L225 475 L210 490 L200 500 L190 490 L180 475 L170 455 L158 430 L145 400 L130 370 L115 340 L100 305 L90 270 L82 235 L80 200 L85 165 L95 135 L110 108 L130 82 L150 58 L170 38 Z"
            fill="url(#indiaGlow)"
            opacity={0.15}
          />
          <defs>
            <radialGradient id="indiaGlow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="hsl(165 80% 48%)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>

        {/* Region dots */}
        {indiaRegions.map((region) => (
          <div
            key={region.id}
            className="absolute cursor-pointer transition-all duration-300"
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width: hoveredRegion === region.id ? region.size * 1.4 : region.size,
                height: hoveredRegion === region.id ? region.size * 1.4 : region.size,
                backgroundColor: getDemandColor(region.demand),
                opacity: getDemandOpacity(region.demand),
                boxShadow: hoveredRegion === region.id
                  ? `0 0 24px ${getDemandColor(region.demand)}60`
                  : `0 0 8px ${getDemandColor(region.demand)}20`,
              }}
            />
            {hoveredRegion === region.id && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full z-10">
                <span className="whitespace-nowrap rounded-md bg-card border border-border px-2 py-0.5 text-[10px] font-medium text-foreground shadow-lg">
                  {region.name}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tooltip panel */}
      <div className="mt-4 rounded-xl border border-border/50 bg-secondary/40 p-4 transition-all">
        {hovered ? (
          <>
            <p className="text-sm font-semibold text-foreground">{hovered.name}</p>
            <div className="mt-2 grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Demand</p>
                <p className="text-lg font-bold text-primary">{hovered.demand}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Risk</p>
                <p className="text-lg font-bold text-chart-3">{hovered.risk}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-sm font-medium text-foreground">{hovered.category}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground text-center">Hover over a region to see demand details</p>
        )}
      </div>
    </div>
  )
}
