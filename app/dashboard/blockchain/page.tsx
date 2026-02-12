"use client"

import { useState } from "react"
import { blockchainEvents } from "@/lib/mock-data"
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Upload,
  FlaskConical,
  CreditCard,
  FileCheck2,
  CheckCircle,
  Clock,
  Link2,
} from "lucide-react"

function getEventIcon(type: string) {
  switch (type) {
    case "Data Upload Logged": return Upload
    case "Simulation Hash Stored": return FlaskConical
    case "Credit Score Updated": return CreditCard
    case "Escrow Contract Created": return FileCheck2
    case "Escrow Released": return CheckCircle
    default: return Link2
  }
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

export default function BlockchainPage() {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const toggle = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Blockchain Activity Log</h1>
        <p className="text-sm text-muted-foreground">Immutable audit trail of all platform operations on Polygon</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground">Total Events</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{blockchainEvents.length}</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground">Confirmed</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {blockchainEvents.filter((e) => e.status === "Confirmed").length}
          </p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="mt-1 text-2xl font-bold text-chart-3">
            {blockchainEvents.filter((e) => e.status === "Pending").length}
          </p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground">Network</p>
          <p className="mt-1 text-lg font-bold text-chart-2">Polygon</p>
        </div>
      </div>

      {/* Event Table */}
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-border/50 px-6 py-3 text-xs font-medium text-muted-foreground">
          <div className="col-span-1" />
          <div className="col-span-3">Event Type</div>
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-2">Hash</div>
          <div className="col-span-2">Contract</div>
          <div className="col-span-2">Status</div>
        </div>

        {/* Table Rows */}
        {blockchainEvents.map((event, index) => {
          const isExpanded = expanded.has(index)
          const Icon = getEventIcon(event.type)

          return (
            <div key={index} className="border-b border-border/30 last:border-0">
              <button
                onClick={() => toggle(index)}
                className="grid w-full grid-cols-12 gap-4 px-6 py-4 text-left transition-colors hover:bg-secondary/30"
              >
                <div className="col-span-1 flex items-center">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">{event.type}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(event.timestamp)}
                </div>
                <div className="col-span-2">
                  <span className="font-mono text-xs text-foreground">{event.hash}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-mono text-xs text-muted-foreground">{event.contract}</span>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    event.status === "Confirmed"
                      ? "bg-primary/10 text-primary"
                      : "bg-chart-3/10 text-chart-3"
                  }`}>
                    {event.status}
                  </span>
                </div>
              </button>

              {/* Expanded Metadata */}
              {isExpanded && (
                <div className="border-t border-border/30 bg-secondary/10 px-6 py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">Transaction Metadata</p>
                    <a
                      href={`https://polygonscan.com/tx/${event.fullHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      View on Explorer
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-background/50 p-3">
                    <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
                      {JSON.stringify(event.metadata, null, 2)}
                    </pre>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Full Hash: </span>
                      <span className="font-mono">{event.fullHash}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
