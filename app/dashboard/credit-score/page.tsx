"use client"

import { useState } from "react"
import { creditScoreData } from "@/lib/mock-data"
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
  AreaChart,
  Area,
} from "recharts"
import { Shield, CheckCircle2, TrendingUp, Loader2, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function getCategoryColor(score: number) {
  if (score >= 800) return "text-primary"
  if (score >= 600) return "text-chart-2"
  if (score >= 400) return "text-chart-3"
  return "text-destructive"
}

function getCategoryBg(score: number) {
  if (score >= 800) return "bg-primary/10 text-primary border-primary/20"
  if (score >= 600) return "bg-chart-2/10 text-chart-2 border-chart-2/20"
  if (score >= 400) return "bg-chart-3/10 text-chart-3 border-chart-3/20"
  return "bg-destructive/10 text-destructive border-destructive/20"
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="mt-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs font-semibold text-foreground">{entry.value}%</span>
        </div>
      ))}
    </div>
  )
}

export default function CreditScorePage() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [verifyHash, setVerifyHash] = useState<string | null>(null)

  const { score, maxScore, category, fulfillmentReliability, revenueGrowth, factors } = creditScoreData

  const scoreRadialData = [{ name: "Score", value: (score / maxScore) * 100, fill: "hsl(165 80% 48%)" }]

  const handleVerifyOnChain = () => {
    setIsVerifying(true)
    setTimeout(() => {
      const hash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
      setVerifyHash(hash)
      setIsVerifying(false)
      setVerified(true)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Commerce Credit Score</h1>
          <p className="text-sm text-muted-foreground">Blockchain-verified commerce creditworthiness rating</p>
        </div>
        <button
          onClick={handleVerifyOnChain}
          disabled={isVerifying || verified}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 w-fit"
        >
          {isVerifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : verified ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Verified On-Chain
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Verify On-Chain
            </>
          )}
        </button>
      </motion.div>

      {/* Score Hero */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-border/50 bg-card/40 p-8 backdrop-blur-sm lg:col-span-1"
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <ResponsiveContainer width={200} height={200}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="75%"
                  outerRadius="100%"
                  barSize={12}
                  data={scoreRadialData}
                  startAngle={270}
                  endAngle={-90}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={6}
                    background={{ fill: "hsl(220 14% 14%)" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold tabular-nums ${getCategoryColor(score)}`}>
                  <AnimatedCounter end={score} />
                </span>
                <span className="text-xs text-muted-foreground">/ {maxScore}</span>
              </div>
            </div>

            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getCategoryBg(score)}`}>
              {category}
            </span>

            <div className="mt-6 w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Fulfillment Reliability</span>
                <span className="text-sm font-bold text-foreground">{fulfillmentReliability}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fulfillmentReliability}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Growth Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm lg:col-span-2"
        >
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Revenue Growth Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueGrowth}>
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(165 80% 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(165 80% 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 14%)" />
              <XAxis dataKey="month" stroke="hsl(215 14% 40%)" tick={{ fontSize: 11 }} />
              <YAxis stroke="hsl(215 14% 40%)" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="growth"
                stroke="hsl(165 80% 48%)"
                strokeWidth={2}
                fill="url(#growthGradient)"
                dot={{ r: 4, fill: "hsl(165 80% 48%)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Score Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm"
      >
        <h3 className="mb-4 text-sm font-semibold text-foreground">Score Breakdown by Factor</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={factors} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 14%)" horizontal={false} />
            <XAxis type="number" stroke="hsl(215 14% 40%)" tick={{ fontSize: 11 }} domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="hsl(215 14% 40%)"
              tick={{ fontSize: 11 }}
              width={130}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
                    <p className="text-xs font-medium text-foreground">{data.name}</p>
                    <p className="text-xs text-muted-foreground">Score: {data.score}/100</p>
                    <p className="text-xs text-muted-foreground">Weight: {data.weight}%</p>
                  </div>
                )
              }}
            />
            <Bar dataKey="score" fill="hsl(165 80% 48%)" radius={[0, 6, 6, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Verification Result */}
      <AnimatePresence>
        {verified && verifyHash && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="rounded-2xl border border-primary/30 bg-primary/5 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20"
              >
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-foreground">On-Chain Verification Successful</p>
                <p className="text-xs text-muted-foreground">Credit score hash matches the on-chain record</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground mb-1">Verification Hash</p>
              <p className="font-mono text-xs text-foreground break-all">{verifyHash}</p>
            </div>

            <a
              href={`https://polygonscan.com/tx/${verifyHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
            >
              View on Polygon Explorer
              <ExternalLink className="h-3 w-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
