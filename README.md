# Reviews Mini App

A Farcaster Mini App for creating and managing reviews on the Base blockchain. Built with Next.js 15, React 19, Tailwind CSS v4, and smart contract integration.

## Quick Start

```bash
# Install dependencies
npm install

# Set environment variable
echo "NEXT_PUBLIC_HOST=http://localhost:3000" > .env.local

# Start development server
npm run dev

# Optional: Expose public URL for mobile testing
npm run tunnel
```

## Features

- **Next.js 15** with App Router and SPA shell
- **React 19** with modern hooks and state management
- **Tailwind CSS v4** for styling
- **Farcaster Mini App SDK** integration
- **Base Blockchain Integration** with smart contract
- **Wagmi & Viem** for Web3 interactions
- **Reown AppKit** for wallet connections
- **Smart Contract Functions**: Create, read, and delete reviews on-chain

## Smart Contract

**Contract Address**: `0x2A7EC1a948C356c3D5cf0b275B0FAa4Df10701D5`
**Network**: Base Mainnet

### Available Functions

- `createReview(uint256 fid, string text, bool isPositive)` - Create a new review
- `getReview(uint256 fid)` - Retrieve a review by FID
- `deleteReview(uint256 fid)` - Delete a review
- `getRandomNumber()` - Generate random number (demo)

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Serve production build
- `npm run lint` - Run ESLint
- `npm run tunnel` - Start Cloudflare tunnel for mobile testing

## Environment Variables

- `NEXT_PUBLIC_HOST` (required) - Origin for dev allowed origins and CSP checks
- `NEXT_PUBLIC_PROJECT_ID` (optional) - WalletConnect Cloud Project ID

## Project Structure

```
app/
├── api/                    # API routes
├── frontend/              # Client-side SPA
│   ├── components/        # React components
│   └── pages/            # App pages
├── lib/                   # Shared utilities
│   ├── constants/        # Smart contract ABI & config
│   ├── providers/        # Web3 providers
│   └── store/           # Global state
└── shell/               # SPA shell for Farcaster
```

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Setup

```bash
NEXT_PUBLIC_HOST=https://your-domain.com
```

**Requirements:**

- HTTPS enabled (required for Farcaster Mini Apps)
- Domain whitelisted in Farcaster

## Contributing

See [CONTRIBUTE.md](./CONTRIBUTE.md) for contribution guidelines.

## License

MIT
