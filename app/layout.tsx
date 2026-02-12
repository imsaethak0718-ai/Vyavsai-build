import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { WalletProvider } from "@/context/wallet-context"
import { Toaster } from "sonner"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "VyavsAI - Autonomous Retail Intelligence Infrastructure",
  description: "Predict. Simulate. Optimize. Execute. AI + Blockchain powered autonomous commerce platform.",
}

export const viewport: Viewport = {
  themeColor: "#0a0d12",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <WalletProvider>
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "hsl(220 18% 7%)",
                border: "1px solid hsl(220 14% 16%)",
                color: "hsl(210 20% 96%)",
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  )
}
