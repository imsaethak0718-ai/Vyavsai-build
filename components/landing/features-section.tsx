"use client"

import { Box, MapPin, Cpu, Shield, FileCheck, BarChart3 } from "lucide-react"
import { AnimatedCounter } from "@/components/animated-counter"
import { FeaturesScene } from "@/components/features-scene"
import { motion } from "framer-motion"

const features = [
  {
    icon: Box,
    title: "Digital Twin Simulation",
    description: "Create virtual replicas of your supply chain to test pricing, inventory, and marketing strategies risk-free.",
  },
  {
    icon: MapPin,
    title: "Regional Demand DNA",
    description: "AI-mapped demand intelligence across Indian states with real-time heatmaps and category affinity scoring.",
  },
  {
    icon: Cpu,
    title: "Autonomous Optimization",
    description: "Self-driving commerce engine that adjusts pricing, budgets, and supplier orders in real time.",
  },
  {
    icon: Shield,
    title: "Blockchain Trust Layer",
    description: "Every decision, simulation, and transaction is immutably logged on Polygon for complete auditability.",
  },
  {
    icon: FileCheck,
    title: "Smart Contract Escrow",
    description: "Automated escrow contracts handle supplier payments with delivery verification and quality scoring.",
  },
  {
    icon: BarChart3,
    title: "AI Credit Score",
    description: "On-chain commerce credit scoring from 0-1000 based on fulfillment, revenue, and payment reliability.",
  },
]

const stats = [
  { value: 98, suffix: "%", label: "Forecast Accuracy" },
  { value: 45, suffix: "K+", label: "Simulations Run" },
  { value: 340, suffix: "M", prefix: "$", label: "Volume Processed" },
  { value: 12, suffix: "ms", label: "Avg Response Time" },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export function FeaturesSection() {
  return (
    <section className="relative py-32 px-6">
      <FeaturesScene />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_50%,hsl(270_80%_65%_/_0.04),transparent)]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Core Capabilities</p>
          <h2 className="mt-3 font-heading text-4xl font-bold text-foreground md:text-5xl text-balance">
            Infrastructure for autonomous commerce
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              data-hover
              className="group rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/60 hover:-translate-y-1 hover:shadow-[0_8px_30px_-10px_hsl(270_80%_65%_/_0.15)]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
