import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { STELLAR_CONFIG } from '../config/stellar'
import { useNetworkMismatch, type NetworkMismatchState } from '../hooks/useNetworkMismatch'

export type Network = 'testnet' | 'mainnet'

const STORAGE_KEY = 'stellarforge_network'

function getInitialNetwork(): Network {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'mainnet' || stored === 'testnet') return stored
  } catch { /* ignore */ }
  return (STELLAR_CONFIG.network as Network) ?? 'testnet'
}

interface NetworkContextValue {
  network: Network
  switchNetwork: (n: Network) => void
  rpcUrl: string
  horizonUrl: string
  networkPassphrase: string
  mismatch: NetworkMismatchState
}

const NetworkContext = createContext<NetworkContextValue | null>(null)

function NetworkProviderInner({ children, network, switchNetwork }: {
  children: ReactNode
  network: Network
  switchNetwork: (n: Network) => void
}) {
  const mismatch = useNetworkMismatch()
  const cfg = STELLAR_CONFIG[network]

  return (
    <NetworkContext.Provider value={{
      network,
      switchNetwork,
      rpcUrl: cfg.sorobanRpcUrl,
      horizonUrl: cfg.horizonUrl,
      networkPassphrase: cfg.networkPassphrase,
      mismatch,
    }}>
      {children}
    </NetworkContext.Provider>
  )
}

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<Network>(getInitialNetwork)

  const switchNetwork = useCallback((n: Network) => {
    setNetwork(n)
    try { localStorage.setItem(STORAGE_KEY, n) } catch { /* ignore */ }
  }, [])

  return (
    <NetworkProviderInner network={network} switchNetwork={switchNetwork}>
      {children}
    </NetworkProviderInner>
  )
}

export function useNetwork(): NetworkContextValue {
  const ctx = useContext(NetworkContext)
  if (!ctx) throw new Error('useNetwork must be used within a NetworkProvider')
  return ctx
}
