"use client"

import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import type { RegionData } from "@/lib/mock-data"
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function getDemandColor(demand: number): string {
  if (demand >= 85) return "#a855f7"
  if (demand >= 70) return "#8b5cf6"
  if (demand >= 55) return "#6366f1"
  return "#64748b"
}

function getDemandRadius(demand: number): number {
  return 8 + (demand / 100) * 18
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-emerald-400" />
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-red-400" />
  return <Minus className="h-3 w-3 text-muted-foreground" />
}

export function DemandMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null)
  const [mapReady, setMapReady] = useState(false)

  const { data: regions, isLoading, mutate } = useSWR<RegionData[]>("/api/demand", fetcher, {
    refreshInterval: 15000,
    revalidateOnFocus: true,
  })

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let cancelled = false

    async function initMap() {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      if (cancelled || !mapRef.current) return

      const map = L.map(mapRef.current, {
        center: [22.5, 80],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
        maxBounds: [[6, 65], [38, 100]],
        minZoom: 4,
        maxZoom: 8,
      })

      // Dark tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
      }).addTo(map)

      L.control.zoom({ position: "topright" }).addTo(map)

      mapInstanceRef.current = map
      setMapReady(true)
    }

    initMap()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update markers when data changes
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !regions) return

    async function updateMarkers() {
      const L = (await import("leaflet")).default
      const map = mapInstanceRef.current

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []

      regions.forEach((region) => {
        const radius = getDemandRadius(region.demand)
        const color = getDemandColor(region.demand)

        const marker = L.circleMarker([region.lat, region.lng], {
          radius,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.35,
        })
          .addTo(map)
          .on("click", () => setSelectedRegion(region))
          .on("mouseover", function (this: any) {
            this.setStyle({ fillOpacity: 0.6, weight: 3 })
            this.setRadius(radius + 4)
          })
          .on("mouseout", function (this: any) {
            this.setStyle({ fillOpacity: 0.35, weight: 2 })
            this.setRadius(radius)
          })

        // Pulsing outline
        const pulse = L.circleMarker([region.lat, region.lng], {
          radius: radius + 6,
          fillColor: "transparent",
          color: color,
          weight: 1,
          opacity: 0.2,
          fillOpacity: 0,
        }).addTo(map)

        markersRef.current.push(marker, pulse)
      })
    }

    updateMarkers()
  }, [regions, mapReady])

  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between p-4 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Live Demand Map</h3>
          <p className="text-xs text-muted-foreground">
            Real-time demand intelligence across India {regions && `(${regions.length} regions)`}
          </p>
        </div>
        <button
          onClick={() => mutate()}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-secondary/50 px-2.5 py-1.5 text-xs text-muted-foreground transition-all hover:text-foreground hover:border-primary/30"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Map container */}
      <div className="relative flex-1 min-h-[320px]">
        <div ref={mapRef} className="absolute inset-0" style={{ cursor: "crosshair" }} />

        {/* Loading overlay */}
        {isLoading && !regions && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-[1000]">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading demand data...
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-border/50 bg-card/90 backdrop-blur-sm p-2.5">
          <p className="text-[10px] font-medium text-muted-foreground mb-1.5">Demand Index</p>
          <div className="flex flex-col gap-1">
            {[
              { color: "#a855f7", label: "85-100 (High)" },
              { color: "#8b5cf6", label: "70-84 (Medium)" },
              { color: "#6366f1", label: "55-69 (Moderate)" },
              { color: "#64748b", label: "< 55 (Low)" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected region detail */}
      <div className="border-t border-border/50 p-4 transition-all">
        {selectedRegion ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{selectedRegion.name}</p>
                <span className="text-[10px] rounded-full border border-border/50 bg-secondary/50 px-2 py-0.5 text-muted-foreground">
                  {selectedRegion.category}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TrendIcon trend={selectedRegion.trend} />
                <span className="text-[10px] text-muted-foreground capitalize">{selectedRegion.trend}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground">Demand</p>
                <p className="text-lg font-bold text-primary">{selectedRegion.demand}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Risk</p>
                <p className="text-lg font-bold text-chart-3">{selectedRegion.risk}%</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Volume</p>
                <p className="text-lg font-bold text-foreground">{(selectedRegion.monthlyVolume / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Population</p>
                <p className="text-sm font-semibold text-foreground">{selectedRegion.population}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-[10px] text-muted-foreground mb-1">Top Products</p>
              <div className="flex flex-wrap gap-1">
                {selectedRegion.topProducts.map((p) => (
                  <span key={p} className="text-[10px] rounded-md border border-primary/20 bg-primary/5 px-1.5 py-0.5 text-primary">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center">Click on a region marker to see demand details</p>
        )}
      </div>
    </div>
  )
}
