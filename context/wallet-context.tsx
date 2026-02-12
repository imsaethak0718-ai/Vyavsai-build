"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

interface WalletState {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: string | null
  networkName: string
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletState | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState<string | null>(null)

  const networkName = chainId === "0x89" ? "Polygon Mainnet" : chainId === "0x13882" ? "Polygon Amoy" : chainId ? "Unknown Network" : "Not Connected"

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      alert("Please install MetaMask to connect your wallet.")
      return
    }
    setIsConnecting(true)
    try {
      const ethereum = (window as any).ethereum
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      const chain = await ethereum.request({ method: "eth_chainId" })
      setAddress(accounts[0])
      setChainId(chain)
    } catch {
      console.error("Wallet connection failed")
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setChainId(null)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).ethereum) return
    const ethereum = (window as any).ethereum

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect()
      } else {
        setAddress(accounts[0])
      }
    }

    const handleChainChanged = (chain: string) => {
      setChainId(chain)
    }

    ethereum.on("accountsChanged", handleAccountsChanged)
    ethereum.on("chainChanged", handleChainChanged)

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged)
      ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }, [disconnect])

  return (
    <WalletContext.Provider value={{ address, isConnected: !!address, isConnecting, chainId, networkName, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) throw new Error("useWallet must be used within WalletProvider")
  return context
}
