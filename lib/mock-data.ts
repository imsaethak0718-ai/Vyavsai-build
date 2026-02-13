// Revenue forecast data
export const revenueData = [
  { month: "Jan", actual: 42000, forecast: 45000 },
  { month: "Feb", actual: 48000, forecast: 47000 },
  { month: "Mar", actual: 51000, forecast: 52000 },
  { month: "Apr", actual: 55000, forecast: 56000 },
  { month: "May", actual: 62000, forecast: 60000 },
  { month: "Jun", actual: 67000, forecast: 68000 },
  { month: "Jul", actual: null, forecast: 73000 },
  { month: "Aug", actual: null, forecast: 78000 },
  { month: "Sep", actual: null, forecast: 82000 },
  { month: "Oct", actual: null, forecast: 88000 },
  { month: "Nov", actual: null, forecast: 92000 },
  { month: "Dec", actual: null, forecast: 98000 },
]

// India regional data with real lat/lng
export interface RegionData {
  id: string
  name: string
  demand: number
  risk: number
  category: string
  lat: number
  lng: number
  population: string
  topProducts: string[]
  monthlyVolume: number
  trend: "up" | "down" | "stable"
}

export const indiaRegions: RegionData[] = [
  { id: "MH", name: "Maharashtra", demand: 92, risk: 18, category: "Electronics", lat: 19.076, lng: 72.8777, population: "12.4M urban", topProducts: ["Smartphones", "Laptops", "Wearables"], monthlyVolume: 245000, trend: "up" },
  { id: "DL", name: "Delhi NCR", demand: 88, risk: 22, category: "Fashion", lat: 28.6139, lng: 77.209, population: "16.8M urban", topProducts: ["Apparel", "Footwear", "Accessories"], monthlyVolume: 198000, trend: "up" },
  { id: "KA", name: "Karnataka", demand: 85, risk: 15, category: "FMCG", lat: 12.9716, lng: 77.5946, population: "8.4M urban", topProducts: ["Personal Care", "Beverages", "Snacks"], monthlyVolume: 178000, trend: "up" },
  { id: "TN", name: "Tamil Nadu", demand: 80, risk: 20, category: "Automotive", lat: 13.0827, lng: 80.2707, population: "7.1M urban", topProducts: ["Two-Wheelers", "Spare Parts", "Accessories"], monthlyVolume: 156000, trend: "stable" },
  { id: "GJ", name: "Gujarat", demand: 78, risk: 25, category: "Textiles", lat: 23.0225, lng: 72.5714, population: "5.6M urban", topProducts: ["Cotton Fabric", "Sarees", "Industrial Textile"], monthlyVolume: 134000, trend: "up" },
  { id: "UP", name: "Uttar Pradesh", demand: 75, risk: 30, category: "Agriculture", lat: 26.8467, lng: 80.9462, population: "11.0M urban", topProducts: ["Fertilizers", "Seeds", "Farm Equipment"], monthlyVolume: 167000, trend: "stable" },
  { id: "WB", name: "West Bengal", demand: 72, risk: 28, category: "Electronics", lat: 22.5726, lng: 88.3639, population: "4.5M urban", topProducts: ["Mobile Phones", "Home Appliances", "LED Lights"], monthlyVolume: 112000, trend: "down" },
  { id: "RJ", name: "Rajasthan", demand: 68, risk: 35, category: "Textiles", lat: 26.9124, lng: 75.7873, population: "3.5M urban", topProducts: ["Handicrafts", "Gems", "Textiles"], monthlyVolume: 98000, trend: "stable" },
  { id: "AP", name: "Andhra Pradesh", demand: 65, risk: 22, category: "FMCG", lat: 15.9129, lng: 79.74, population: "3.5M urban", topProducts: ["Rice", "Spices", "Personal Care"], monthlyVolume: 89000, trend: "up" },
  { id: "KL", name: "Kerala", demand: 70, risk: 18, category: "Tourism", lat: 10.8505, lng: 76.2711, population: "3.3M urban", topProducts: ["Ayurveda", "Spices", "Cashew"], monthlyVolume: 76000, trend: "up" },
  { id: "TS", name: "Telangana", demand: 82, risk: 19, category: "IT Services", lat: 17.385, lng: 78.4867, population: "6.8M urban", topProducts: ["Software", "IT Hardware", "Cloud Services"], monthlyVolume: 145000, trend: "up" },
  { id: "MP", name: "Madhya Pradesh", demand: 60, risk: 32, category: "Agriculture", lat: 23.2599, lng: 77.4126, population: "2.8M urban", topProducts: ["Soybean", "Wheat", "Cotton"], monthlyVolume: 72000, trend: "stable" },
  { id: "PB", name: "Punjab", demand: 64, risk: 27, category: "Agriculture", lat: 31.1471, lng: 75.3412, population: "2.7M urban", topProducts: ["Wheat", "Rice", "Dairy"], monthlyVolume: 68000, trend: "down" },
  { id: "HR", name: "Haryana", demand: 70, risk: 24, category: "Automotive", lat: 29.0588, lng: 76.0856, population: "3.5M urban", topProducts: ["Cars", "Tractors", "Auto Parts"], monthlyVolume: 94000, trend: "up" },
  { id: "OR", name: "Odisha", demand: 55, risk: 38, category: "Mining", lat: 20.9517, lng: 85.0985, population: "1.8M urban", topProducts: ["Iron Ore", "Steel", "Aluminium"], monthlyVolume: 54000, trend: "stable" },
  { id: "AS", name: "Assam", demand: 48, risk: 42, category: "Tea & Agriculture", lat: 26.2006, lng: 92.9376, population: "1.0M urban", topProducts: ["Tea", "Silk", "Bamboo"], monthlyVolume: 38000, trend: "stable" },
  { id: "BR", name: "Bihar", demand: 52, risk: 40, category: "Agriculture", lat: 25.0961, lng: 85.3131, population: "2.0M urban", topProducts: ["Litchi", "Rice", "Maize"], monthlyVolume: 45000, trend: "up" },
  { id: "JH", name: "Jharkhand", demand: 50, risk: 36, category: "Mining", lat: 23.6102, lng: 85.2799, population: "1.5M urban", topProducts: ["Coal", "Iron", "Steel"], monthlyVolume: 42000, trend: "stable" },
  { id: "CG", name: "Chhattisgarh", demand: 45, risk: 35, category: "Mining", lat: 21.2787, lng: 81.8661, population: "1.1M urban", topProducts: ["Rice", "Steel", "Power"], monthlyVolume: 35000, trend: "down" },
  { id: "GA", name: "Goa", demand: 62, risk: 15, category: "Tourism", lat: 15.2993, lng: 74.124, population: "0.6M urban", topProducts: ["Hospitality", "Cashew", "Seafood"], monthlyVolume: 28000, trend: "up" },
]

// Blockchain events
export const blockchainEvents = [
  {
    type: "Data Upload Logged",
    timestamp: "2026-02-13T10:24:00Z",
    hash: "0x7a3b...f91e",
    fullHash: "0x7a3b8c2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f91e",
    contract: "0x1234...5678",
    status: "Confirmed",
    metadata: { dataType: "sales_records", records: 15420, region: "Maharashtra", uploadedBy: "0xA1B2...C3D4" },
  },
  {
    type: "Simulation Hash Stored",
    timestamp: "2026-02-13T10:30:00Z",
    hash: "0x8b4c...a02f",
    fullHash: "0x8b4c9d3e2f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8a02f",
    contract: "0x1234...5678",
    status: "Confirmed",
    metadata: { simulationType: "price_optimization", confidence: 0.94, scenarios: 1200, duration: "34s" },
  },
  {
    type: "Credit Score Updated",
    timestamp: "2026-02-13T10:45:00Z",
    hash: "0x9c5d...b13g",
    fullHash: "0x9c5d0e4f3a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8b13g0",
    contract: "0x5678...9ABC",
    status: "Confirmed",
    metadata: { previousScore: 812, newScore: 847, factors: ["fulfillment_rate", "revenue_trend", "payment_history"] },
  },
  {
    type: "Escrow Contract Created",
    timestamp: "2026-02-13T11:00:00Z",
    hash: "0xad6e...c24h",
    fullHash: "0xad6e1f5a4b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8c24h1",
    contract: "0x9ABC...DEF0",
    status: "Pending",
    metadata: { supplier: "0xE5F6...7890", amount: "45,000 USDC", terms: "30-day delivery", collateral: "5,000 USDC" },
  },
  {
    type: "Escrow Released",
    timestamp: "2026-02-12T16:30:00Z",
    hash: "0xbe7f...d35i",
    fullHash: "0xbe7f2a6b5c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8d35i2",
    contract: "0x9ABC...DEF0",
    status: "Confirmed",
    metadata: { supplier: "0xC3D4...5678", amount: "32,000 USDC", deliveryVerified: true, qualityScore: 96 },
  },
  {
    type: "Data Upload Logged",
    timestamp: "2026-02-12T14:15:00Z",
    hash: "0xcf8a...e46j",
    fullHash: "0xcf8a3b7c6d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8e46j3",
    contract: "0x1234...5678",
    status: "Confirmed",
    metadata: { dataType: "inventory_snapshot", records: 8750, region: "Karnataka", uploadedBy: "0xA1B2...C3D4" },
  },
]

// Credit score data
export const creditScoreData = {
  score: 847,
  maxScore: 1000,
  category: "Excellent",
  fulfillmentReliability: 94.7,
  revenueGrowth: [
    { month: "Sep", growth: 12 },
    { month: "Oct", growth: 15 },
    { month: "Nov", growth: 18 },
    { month: "Dec", growth: 14 },
    { month: "Jan", growth: 22 },
    { month: "Feb", growth: 28 },
  ],
  factors: [
    { name: "Payment History", score: 92, weight: 30 },
    { name: "Fulfillment Rate", score: 95, weight: 25 },
    { name: "Revenue Stability", score: 88, weight: 20 },
    { name: "Growth Trajectory", score: 78, weight: 15 },
    { name: "Market Diversity", score: 72, weight: 10 },
  ],
}
