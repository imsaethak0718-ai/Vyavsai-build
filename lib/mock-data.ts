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

// India regional data
export const indiaRegions = [
  { id: "MH", name: "Maharashtra", demand: 92, risk: 18, category: "Electronics", x: 180, y: 340, size: 42 },
  { id: "DL", name: "Delhi NCR", demand: 88, risk: 22, category: "Fashion", x: 215, y: 170, size: 35 },
  { id: "KA", name: "Karnataka", demand: 85, risk: 15, category: "FMCG", x: 175, y: 430, size: 38 },
  { id: "TN", name: "Tamil Nadu", demand: 80, risk: 20, category: "Automotive", x: 200, y: 490, size: 36 },
  { id: "GJ", name: "Gujarat", demand: 78, risk: 25, category: "Textiles", x: 135, y: 280, size: 34 },
  { id: "UP", name: "Uttar Pradesh", demand: 75, risk: 30, category: "Agriculture", x: 240, y: 200, size: 40 },
  { id: "WB", name: "West Bengal", demand: 72, risk: 28, category: "Electronics", x: 320, y: 260, size: 32 },
  { id: "RJ", name: "Rajasthan", demand: 68, risk: 35, category: "Textiles", x: 155, y: 220, size: 38 },
  { id: "AP", name: "Andhra Pradesh", demand: 65, risk: 22, category: "FMCG", x: 215, y: 410, size: 34 },
  { id: "KL", name: "Kerala", demand: 70, risk: 18, category: "Tourism", x: 170, y: 510, size: 28 },
  { id: "TS", name: "Telangana", demand: 82, risk: 19, category: "IT Services", x: 200, y: 380, size: 30 },
  { id: "MP", name: "Madhya Pradesh", demand: 60, risk: 32, category: "Agriculture", x: 210, y: 280, size: 42 },
  { id: "PB", name: "Punjab", demand: 64, risk: 27, category: "Agriculture", x: 190, y: 150, size: 28 },
  { id: "HR", name: "Haryana", demand: 70, risk: 24, category: "Automotive", x: 205, y: 175, size: 24 },
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
