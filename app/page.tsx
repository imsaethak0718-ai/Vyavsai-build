"use client"

import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* CTA Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,hsl(165_80%_48%_/_0.06),transparent)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <h2 className="text-4xl font-bold text-foreground md:text-5xl text-balance">
            Ready to automate your commerce?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Join forward-thinking retailers using AI and blockchain to make smarter decisions, faster.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-md"
          >
            Launch Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-bold text-primary-foreground">V</span>
            </div>
            <span className="text-sm font-semibold text-foreground">VyavsAI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built on Polygon. Powered by AI. Secured by blockchain.
          </p>
        </div>
      </footer>
    </div>
  )
}
