import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { WalletProvider } from "@/context/wallet-context"
import { CustomCursor } from "@/components/custom-cursor"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "VyavsAI - Autonomous Retail Intelligence Infrastructure",
  description: "Predict. Simulate. Optimize. Execute. AI + Blockchain powered autonomous commerce platform.",
}

export const viewport: Viewport = {
  themeColor: "#09060f",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <WalletProvider>
          <CustomCursor />
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "hsl(270 30% 6%)",
                border: "1px solid hsl(270 20% 16%)",
                color: "hsl(270 20% 96%)",
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  )
}
