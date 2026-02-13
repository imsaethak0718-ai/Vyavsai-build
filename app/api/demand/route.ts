import { NextResponse } from "next/server"
import { indiaRegions } from "@/lib/mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const regionId = searchParams.get("region")

  // Simulate slight randomness for live feel (demand +/- 3%)
  const regionsWithLiveData = indiaRegions.map((region) => {
    const jitter = (Math.random() - 0.5) * 6
    return {
      ...region,
      demand: Math.round(Math.min(100, Math.max(0, region.demand + jitter))),
      monthlyVolume: Math.round(region.monthlyVolume * (1 + (Math.random() - 0.5) * 0.06)),
    }
  })

  if (regionId) {
    const region = regionsWithLiveData.find((r) => r.id === regionId)
    if (!region) {
      return NextResponse.json({ error: "Region not found" }, { status: 404 })
    }
    return NextResponse.json(region)
  }

  return NextResponse.json(regionsWithLiveData)
}
