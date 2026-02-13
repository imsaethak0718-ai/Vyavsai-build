"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail, Github } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("demo@vyavsai.ai")
  const [password, setPassword] = useState("password123")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate network delay for mock login
    setTimeout(() => {
      setIsLoading(false)
      router.push("/onboarding")
    }, 1500)
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_40%,hsl(270_80%_65%_/_0.15),transparent)]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Link 
          href="/" 
          className="mb-8 flex items-center justify-center gap-2 group transition-opacity hover:opacity-80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <span className="text-lg font-bold text-primary-foreground font-heading">V</span>
          </div>
          <span className="text-2xl font-bold font-heading text-foreground">VyavsAI</span>
        </Link>

        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl">
          <div className="p-8 pb-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold font-heading text-foreground">Welcome Back</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your credentials to access the intelligence platform
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="p-4 bg-muted/20 border-t border-border/30">
            <div className="flex flex-col gap-3">
               <button 
                type="button"
                onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => router.push("/onboarding"), 1500)
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-border/50 bg-background/50 py-2 text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground hover:border-border transition-all"
              >
                  Continue as Guest (Mock Data)
              </button>
               <div className="text-center">
                <span className="text-xs text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Contact Sales
                  </Link>
                </span>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="absolute bottom-6 flex gap-6 text-xs text-muted-foreground/60">
        <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
        <Link href="#" className="hover:text-foreground transition-colors">Help</Link>
      </div>
    </div>
  )
}
