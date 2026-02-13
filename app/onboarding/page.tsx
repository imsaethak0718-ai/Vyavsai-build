"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  X,
  ShoppingCart,
  Package,
  DollarSign,
  Megaphone,
  MapPin,
  SlidersHorizontal,
  Eye,
} from "lucide-react"

interface UploadCategory {
  id: string
  label: string
  description: string
  icon: React.ElementType
  expectedColumns: string[]
  sampleRow: string
}

const categories: UploadCategory[] = [
  {
    id: "sales",
    label: "Sales Data",
    description: "Historical transaction records with dates, amounts, products, and customer segments",
    icon: ShoppingCart,
    expectedColumns: ["date", "product_id", "product_name", "quantity", "revenue", "region"],
    sampleRow: "2026-01-15, SKU001, Wireless Earbuds, 120, 4800, Maharashtra",
  },
  {
    id: "inventory",
    label: "Inventory Data",
    description: "Current stock levels, warehouse locations, reorder points, and lead times",
    icon: Package,
    expectedColumns: ["product_id", "product_name", "stock_qty", "warehouse", "reorder_point", "lead_time_days"],
    sampleRow: "SKU001, Wireless Earbuds, 2400, Mumbai-W1, 500, 7",
  },
  {
    id: "pricing",
    label: "Pricing Data",
    description: "Product pricing, cost basis, margins, competitor prices, and discount tiers",
    icon: DollarSign,
    expectedColumns: ["product_id", "product_name", "cost_price", "selling_price", "competitor_price", "discount_pct"],
    sampleRow: "SKU001, Wireless Earbuds, 28.00, 40.00, 42.00, 10",
  },
  {
    id: "marketing",
    label: "Marketing Data",
    description: "Campaign performance, ad spend, impressions, conversions, and channel breakdowns",
    icon: Megaphone,
    expectedColumns: ["campaign_id", "channel", "spend", "impressions", "clicks", "conversions"],
    sampleRow: "CMP-2026-01, Instagram, 5000, 250000, 12000, 840",
  },
  {
    id: "regional",
    label: "Regional Market Data",
    description: "Demand indices, risk scores, population data, and market category affinity by region",
    icon: MapPin,
    expectedColumns: ["region", "state", "demand_index", "risk_score", "population", "top_category"],
    sampleRow: "MH, Maharashtra, 92, 18, 12400000, Electronics",
  },
  {
    id: "simulation",
    label: "User Simulation Inputs",
    description: "Custom scenario parameters for price elasticity, inventory buffers, and marketing coefficients",
    icon: SlidersHorizontal,
    expectedColumns: ["parameter", "min_value", "max_value", "default_value", "unit", "description"],
    sampleRow: "price_elasticity, -2.0, 0, -0.8, coefficient, Price sensitivity factor",
  },
]

interface UploadResult {
  fileName: string
  rowCount: number
  headers: string[]
  preview: Record<string, string>[]
  status: "success" | "error"
  error?: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [uploads, setUploads] = useState<Record<string, UploadResult>>({})
  const [activeUpload, setActiveUpload] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [previewCategory, setPreviewCategory] = useState<string | null>(null)

  const completedCount = Object.values(uploads).filter((u) => u.status === "success").length
  const allDone = completedCount === categories.length
  const progress = (completedCount / categories.length) * 100

  const handleUpload = useCallback(
    async (categoryId: string, file: File) => {
      if (!file.name.endsWith(".csv")) {
        setUploads((prev) => ({
          ...prev,
          [categoryId]: {
            fileName: file.name,
            rowCount: 0,
            headers: [],
            preview: [],
            status: "error",
            error: "Only .csv files are accepted",
          },
        }))
        return
      }

      setActiveUpload(categoryId)

      try {
        const formData = new FormData()
        formData.append("category", categoryId)
        formData.append("file", file)

        const res = await fetch("/api/upload", { method: "POST", body: formData })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "Upload failed")
        }

        setUploads((prev) => ({
          ...prev,
          [categoryId]: {
            fileName: data.fileName,
            rowCount: data.rowCount,
            headers: data.headers,
            preview: data.preview,
            status: "success",
          },
        }))
      } catch (err) {
        setUploads((prev) => ({
          ...prev,
          [categoryId]: {
            fileName: file.name,
            rowCount: 0,
            headers: [],
            preview: [],
            status: "error",
            error: err instanceof Error ? err.message : "Upload failed",
          },
        }))
      } finally {
        setActiveUpload(null)
      }
    },
    []
  )

  const handleDrop = useCallback(
    (categoryId: string, e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(null)
      const file = e.dataTransfer.files[0]
      if (file) handleUpload(categoryId, file)
    },
    [handleUpload]
  )

  const handleFileSelect = useCallback(
    (categoryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleUpload(categoryId, file)
    },
    [handleUpload]
  )

  const removeUpload = (categoryId: string) => {
    setUploads((prev) => {
      const next = { ...prev }
      delete next[categoryId]
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group" data-hover>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-110">
              <span className="text-sm font-bold text-primary-foreground font-heading">V</span>
            </div>
            <span className="text-lg font-bold text-foreground font-heading">VyavsAI</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {completedCount}/{categories.length} uploaded
            </span>
            <div className="hidden h-2 w-32 overflow-hidden rounded-full bg-secondary sm:block">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <Link
            href="/"
            data-hover
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground font-heading text-balance">
            Upload Your Business Data
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            Upload CSV files for each data category below. Our AI engine will parse, validate, and
            use this data to power your dashboard analytics, simulations, and autonomous decisions.
          </p>
        </motion.div>

        {/* Upload Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const upload = uploads[cat.id]
            const isUploading = activeUpload === cat.id
            const isDragOver = dragOver === cat.id
            const isSuccess = upload?.status === "success"
            const isError = upload?.status === "error"

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`group relative flex flex-col rounded-2xl border bg-card/60 backdrop-blur-sm transition-all duration-300 ${
                  isDragOver
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : isSuccess
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : isError
                        ? "border-red-500/40 bg-red-500/5"
                        : "border-border/50 hover:border-border"
                }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(cat.id)
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => handleDrop(cat.id, e)}
              >
                {/* Card Header */}
                <div className="flex items-start gap-3 p-5 pb-3">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isSuccess
                        ? "bg-emerald-500/15 text-emerald-400"
                        : isError
                          ? "bg-red-500/15 text-red-400"
                          : "bg-primary/10 text-primary"
                    }`}
                  >
                    {isSuccess ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isError ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <cat.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-foreground font-heading">{cat.label}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Upload Area or Result */}
                <div className="flex-1 px-5 pb-5">
                  {isSuccess && upload ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2">
                        <FileSpreadsheet className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                        <span className="truncate text-xs font-medium text-emerald-300">
                          {upload.fileName}
                        </span>
                        <button
                          onClick={() => removeUpload(cat.id)}
                          data-hover
                          className="ml-auto flex-shrink-0 rounded p-0.5 text-emerald-400/60 transition-colors hover:text-red-400"
                          aria-label="Remove file"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{upload.rowCount.toLocaleString()} rows</span>
                        <span>{upload.headers.length} columns</span>
                      </div>
                      <button
                        onClick={() =>
                          setPreviewCategory(previewCategory === cat.id ? null : cat.id)
                        }
                        data-hover
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/50 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                      >
                        <Eye className="h-3 w-3" />
                        {previewCategory === cat.id ? "Hide Preview" : "Preview Data"}
                      </button>

                      <AnimatePresence>
                        {previewCategory === cat.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="overflow-x-auto rounded-lg border border-border/40 bg-background/50">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-border/30">
                                    {upload.headers.slice(0, 4).map((h) => (
                                      <th
                                        key={h}
                                        className="px-2 py-1.5 text-left font-medium text-primary/80"
                                      >
                                        {h}
                                      </th>
                                    ))}
                                    {upload.headers.length > 4 && (
                                      <th className="px-2 py-1.5 text-left text-muted-foreground">
                                        +{upload.headers.length - 4}
                                      </th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {upload.preview.map((row, ri) => (
                                    <tr key={ri} className="border-b border-border/20 last:border-0">
                                      {upload.headers.slice(0, 4).map((h) => (
                                        <td
                                          key={h}
                                          className="max-w-[100px] truncate px-2 py-1 text-muted-foreground"
                                        >
                                          {row[h]}
                                        </td>
                                      ))}
                                      {upload.headers.length > 4 && (
                                        <td className="px-2 py-1 text-muted-foreground/50">...</td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label
                        data-hover
                        className={`flex cursor-none flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all ${
                          isDragOver
                            ? "border-primary bg-primary/5"
                            : "border-border/40 hover:border-primary/30 hover:bg-primary/[0.02]"
                        }`}
                      >
                        {isUploading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        ) : (
                          <Upload
                            className={`h-6 w-6 transition-colors ${isDragOver ? "text-primary" : "text-muted-foreground"}`}
                          />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {isUploading ? "Processing..." : "Drop CSV here or click to browse"}
                        </span>
                        <input
                          type="file"
                          accept=".csv"
                          className="hidden"
                          onChange={(e) => handleFileSelect(cat.id, e)}
                          disabled={isUploading}
                        />
                      </label>

                      {isError && upload && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-400" />
                          <span className="text-xs text-red-300">{upload.error}</span>
                          <button
                            onClick={() => removeUpload(cat.id)}
                            data-hover
                            className="ml-auto text-red-400/60 hover:text-red-300"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Expected columns hint */}
                      <div className="space-y-1">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                          Expected columns
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {cat.expectedColumns.slice(0, 4).map((col) => (
                            <span
                              key={col}
                              className="rounded-md bg-secondary/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                            >
                              {col}
                            </span>
                          ))}
                          {cat.expectedColumns.length > 4 && (
                            <span className="rounded-md bg-secondary/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              +{cat.expectedColumns.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
        >
          <p className="text-sm text-muted-foreground">
            {allDone
              ? "All data uploaded. You are ready to launch the dashboard."
              : `Upload all ${categories.length} categories to unlock the full dashboard, or skip to use sample data.`}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              data-hover
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
            >
              Skip with Sample Data
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              data-hover
              disabled={completedCount === 0}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
                completedCount > 0
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              Enter Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
