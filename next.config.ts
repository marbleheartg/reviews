import type { NextConfig } from "next"

const { NEXT_PUBLIC_HOST, NEXT_PUBLIC_NODE } = process.env
if (!NEXT_PUBLIC_HOST || !NEXT_PUBLIC_NODE) throw new Error("NextConfigCredentialsNotConfigured")

const nextConfig: NextConfig = {
  allowedDevOrigins: [NEXT_PUBLIC_HOST, NEXT_PUBLIC_NODE],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
    ],
  },

  rewrites: async () => {
    return [
      {
        source: "/((?!api/|_next/).*)",
        destination: "/shell",
      },
    ]
  },
}

export default nextConfig
