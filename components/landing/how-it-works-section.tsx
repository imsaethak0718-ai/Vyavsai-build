"use client"

import { Upload, FlaskConical, Zap, FileCheck2 } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Data",
    description: "Connect your sales, inventory, and supplier data. All uploads are hashed and logged on-chain.",
  },
  {
    icon: FlaskConical,
    step: "02",
    title: "Run Simulation",
    description: "The Digital Twin engine runs thousands of scenarios to find optimal pricing and inventory strategies.",
  },
  {
    icon: Zap,
    step: "03",
    title: "Enable Autopilot",
    description: "Let the AI autonomously execute optimal strategies with real-time adjustments and monitoring.",
  },
  {
    icon: FileCheck2,
    step: "04",
    title: "Smart Contract Executes",
    description: "Escrow contracts auto-execute supplier payments upon verified delivery with quality scoring.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Process</p>
          <h2 className="mt-3 text-4xl font-bold text-foreground md:text-5xl text-balance">
            How it works
          </h2>
        </div>

        <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.step} className="group relative">
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-px w-8 bg-border/50 lg:block translate-x-full" />
              )}
              <div className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-card/60">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-mono text-3xl font-bold text-border/60">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
