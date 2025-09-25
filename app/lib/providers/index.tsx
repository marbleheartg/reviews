"use client"

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { arbitrum, base, mainnet } from "@reown/appkit/networks"
import { createAppKit } from "@reown/appkit/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cookieStorage, cookieToInitialState, createStorage, http, WagmiProvider, type Config } from "wagmi"
import { MINIAPP_DESCRIPTION, MINIAPP_TITLE } from "../constants"

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
if (!projectId) throw new Error("Project ID is not defined")

const networks = [mainnet, arbitrum]

const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: false,
  projectId,
  networks,
  transports: {
    [base.id]: http("http://127.0.0.1:8545"),
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
  url: `https://${process.env.NEXT_PUBLIC_HOST}`, // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
}

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base],
  defaultNetwork: base,
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
