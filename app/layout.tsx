import { Inter } from "next/font/google"
import { ReactNode } from "react"
import "./globals.css"
import { MINIAPP, MINIAPP_DESCRIPTION, MINIAPP_TITLE } from "./lib/constants"

const inter = Inter({
  variable: "--inter",
  weight: "variable",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
        <link rel="icon" type="image/svg+xml" href="/images/global/logo.svg" />
        <meta name="fc:miniapp" content={JSON.stringify(MINIAPP)} />
        <meta name="description" content={MINIAPP_DESCRIPTION} />
        <title>{MINIAPP_TITLE}</title>
      </head>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  )
}
