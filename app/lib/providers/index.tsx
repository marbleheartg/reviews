"use client"

import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { http } from "viem"
import { base } from "viem/chains"
import { createConfig, WagmiProvider } from "wagmi"

const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  // @ts-ignore
  connectors: [miniAppConnector()],
})

const tanstackQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={tanstackQueryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
