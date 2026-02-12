"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Bot, TrendingUp, DollarSign, Package, ExternalLink, CheckCircle2, Loader2, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const aiActions = [
  {
    id: "price",
    label: "Dynamic Pricing Adjustment",
    description: "Increase base price by 4.2% for electronics in Maharashtra",
    icon: DollarSign,
    impact: "+$4,200/mo",
    confidence: 94,
  },
  {
    id: "budget",
    label: "Marketing Budget Reallocation",
    description: "Shift 15% of budget from print to digital channels in Delhi NCR",
    icon: TrendingUp,
    impact: "+$2,800/mo",
    confidence: 91,
  },
  {
    id: "supplier",
    label: "Supplier Order Optimization",
    description: "Increase order by 1,200 units for Q2 from verified supplier #A41",
    icon: Package,
    impact: "-$1,500 risk",
    confidence: 88,
  },
]

function BlockchainAnimation() {
  const [blocks, setBlocks] = useState<number[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks((prev) => [...prev.slice(-7), Date.now()])
    }, 600)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-1 overflow-hidden">
      {blocks.map((block, i) => (
        <motion.div
          key={block}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3 + (i / blocks.length) * 0.7, scale: 1 }}
          className="h-2 w-2 rounded-sm bg-primary"
        />
      ))}
    </div>
  )
}

export default function AutopilotPage() {
  const [autopilotEnabled, setAutopilotEnabled] = useState(false)
  const [executingAction, setExecutingAction] = useState<string | null>(null)
  const [executedActions, setExecutedActions] = useState<Set<string>>(new Set())
  const [txHash, setTxHash] = useState<string | null>(null)
  const [showTxSuccess, setShowTxSuccess] = useState(false)

  const handleAutopilotToggle = (enabled: boolean) => {
    setAutopilotEnabled(enabled)
    if (enabled) {
      executeSequentially(0)
    } else {
      setExecutingAction(null)
      setExecutedActions(new Set())
      setTxHash(null)
      setShowTxSuccess(false)
    }
  }

  const executeSequentially = (index: number) => {
    if (index >= aiActions.length) {
      const hash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
      setTxHash(hash)
      setShowTxSuccess(true)
      return
    }

    setExecutingAction(aiActions[index].id)
    setTimeout(() => {
      setExecutedActions((prev) => new Set(prev).add(aiActions[index].id))
      setExecutingAction(null)
      executeSequentially(index + 1)
    }, 1800)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Autopilot Mode</h1>
          <p className="text-sm text-muted-foreground">AI-driven autonomous execution of optimal strategies</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{autopilotEnabled ? "Active" : "Inactive"}</span>
          <Switch checked={autopilotEnabled} onCheckedChange={handleAutopilotToggle} />
        </div>
      </motion.div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`rounded-2xl border p-4 transition-all ${
          autopilotEnabled
            ? "border-primary/30 bg-primary/5"
            : "border-border/50 bg-card/40"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
            autopilotEnabled ? "bg-primary/20" : "bg-secondary"
          }`}>
            <Bot className={`h-5 w-5 ${autopilotEnabled ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {autopilotEnabled ? "Autopilot is active" : "Autopilot is inactive"}
            </p>
            <p className="text-xs text-muted-foreground">
              {autopilotEnabled
                ? "AI is analyzing data and executing optimal strategies via smart contracts"
                : "Enable autopilot to let AI autonomously optimize your retail operations"}
            </p>
          </div>
          {autopilotEnabled && <BlockchainAnimation />}
        </div>
      </motion.div>

      {/* AI Suggested Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="mb-4 text-sm font-semibold text-foreground">AI Suggested Actions</h2>
        <div className="space-y-3">
          {aiActions.map((action, i) => {
            const isExecuting = executingAction === action.id
            const isExecuted = executedActions.has(action.id)

            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className={`rounded-2xl border p-5 transition-all ${
                  isExecuted
                    ? "border-primary/30 bg-primary/5"
                    : isExecuting
                    ? "border-chart-2/30 bg-chart-2/5"
                    : "border-border/50 bg-card/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                    isExecuted ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    <action.icon className={`h-5 w-5 ${isExecuted ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{action.label}</h3>
                      {isExecuting && <Loader2 className="h-3.5 w-3.5 animate-spin text-chart-2" />}
                      {isExecuted && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{action.description}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-primary">
                        {action.impact}
                      </span>
                      <span className="text-xs text-muted-foreground">Confidence: {action.confidence}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Transaction Result */}
      <AnimatePresence>
        {showTxSuccess && txHash && (
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
                <Zap className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-foreground">Smart Contract Executed</p>
                <p className="text-xs text-muted-foreground">All actions successfully logged on-chain</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
              <p className="font-mono text-xs text-foreground break-all">{txHash}</p>
            </div>

            <a
              href={`https://polygonscan.com/tx/${txHash}`}
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
