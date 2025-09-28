"use client"

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { AppKitNetwork } from "@reown/appkit-common"
import { createAppKit } from "@reown/appkit/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { defineChain } from "viem"
import { cookieToInitialState, http, WagmiProvider, type Config } from "wagmi"
import { MINIAPP_DESCRIPTION, MINIAPP_TITLE } from "../constants"

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
if (!projectId) throw new Error("Project ID is not defined")

const localNetwork = defineChain({
  id: 31337,
  name: "Local Network",
  network: "local",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [`https://${process.env.NEXT_PUBLIC_NODE}`],
    },
    public: {
      http: [`https://${process.env.NEXT_PUBLIC_NODE}`],
    },
  },
  blockExplorers: {
    default: { name: "Local Explorer", url: `https://${process.env.NEXT_PUBLIC_NODE}` },
  },
})

const wagmiAdapter = new WagmiAdapter({
  ssr: false,
  projectId,
  networks: [localNetwork as AppKitNetwork],
  transports: {
    [localNetwork.id]: http(`https://${process.env.NEXT_PUBLIC_NODE}`),
  },
})

// const wagmiConfig = createConfig({
//   chains: [base],
//   transports: {
//     [base.id]: http(),
//   },
//   // @ts-ignore
//   connectors: [miniAppConnector()],
// })

const metadata = {
  name: MINIAPP_TITLE,
  description: MINIAPP_DESCRIPTION,
  url: `https://${process.env.NEXT_PUBLIC_HOST}`,
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [localNetwork as AppKitNetwork],
  defaultNetwork: localNetwork as AppKitNetwork,
  metadata,
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
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={tanstackQueryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
