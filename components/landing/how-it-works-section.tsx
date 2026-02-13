"use client"

import { Upload, FlaskConical, Zap, FileCheck2 } from "lucide-react"
import { ProcessScene } from "@/components/process-scene"
import { motion } from "framer-motion"

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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export function HowItWorksSection() {
  return (
    <section className="relative py-32 px-6">
      <ProcessScene />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_20%_80%,hsl(250_70%_65%_/_0.04),transparent)]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Process</p>
          <h2 className="mt-3 font-heading text-4xl font-bold text-foreground md:text-5xl text-balance">
            How it works
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Connecting line */}
          <div className="absolute top-12 left-[12.5%] right-[12.5%] hidden h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent lg:block" />

          {steps.map((step) => (
            <motion.div key={step.step} variants={itemVariants} className="group relative" data-hover>
              <div className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/60 hover:-translate-y-1 hover:shadow-[0_8px_30px_-10px_hsl(270_80%_65%_/_0.15)]">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-heading text-3xl font-bold text-border/60">{step.step}</span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
