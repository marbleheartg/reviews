# Reviews Mini App

A Farcaster Mini App for creating and managing reviews on the Base blockchain. Built with Next.js 15, React 19, Tailwind CSS v4, and smart contract integration. Users can create, view, and manage reviews with Farcaster authentication and blockchain storage.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Web3 Configuration](#web3-configuration)
- [Scripts](#scripts)
- [App Architecture](#app-architecture)
- [Smart Contract Integration](#smart-contract-integration)
- [API Endpoints](#api-endpoints)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- **Next.js 15** with App Router and a SPA shell (`/shell`) via rewrites
- **React 19** with modern hooks and state management
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **Farcaster Mini App SDK** integration (`@farcaster/miniapp-sdk`, `@farcaster/quick-auth`)
- **Base Blockchain Integration** with smart contract for reviews storage
- **Wagmi & Viem** for Ethereum/Base blockchain interactions
- **Reown AppKit** for wallet connections and Web3 features
- **Smart Contract Functions**: Create, read, and delete reviews on-chain
- **Client error reporting hook** and API scaffolding
- **Cloudflare Tunnel** script for quick mobile testing
- **React Router** for client-side navigation within the SPA
- **Zustand** for global state management
- **MongoDB** integration for additional data storage
- **Custom cursor** and haptic feedback support

## Requirements

- Node.js 20+
- pnpm, npm, or bun (repo ships with `bun.lock` but works with npm/pnpm)
- Optional: `cloudflared` for tunneling

## Quick Start

```bash
# install deps
npm install

# set required env (see below), then run dev
NEXT_PUBLIC_HOST=http://localhost:3000 npm run dev

# open another terminal to expose a public URL (optional)
npm run tunnel
```

### Environment Variables

- **NEXT_PUBLIC_HOST** (required): Origin used for dev allowed origins and CSP-like checks.
  - Example for local: `http://localhost:3000`
  - Put this in `.env.local` for convenience:

```bash
# .env.local
NEXT_PUBLIC_HOST=http://localhost:3000
```

Note: The app will throw at boot if `NEXT_PUBLIC_HOST` is missing (see `next.config.ts`).

### Web3 Configuration

The app uses Reown AppKit for wallet connections. You may need to configure:

- **NEXT_PUBLIC_PROJECT_ID**: WalletConnect Cloud Project ID (if using WalletConnect features)
- **Base RPC URL**: Configured for Base mainnet interactions
- **Smart Contract**: Pre-configured with Reviews contract on Base

### Scripts

```json
{
  "dev": "rm -rf ./.next && clear && next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "tunnel": "clear && cloudflared tunnel --url http://localhost:3000"
}
```

- **dev**: Starts Next.js with Turbopack.
- **build**: Builds production output.
- **start**: Serves the production build.
- **lint**: Runs Next.js ESLint.
- **tunnel**: Starts a Cloudflare tunnel pointing to `http://localhost:3000`.

### App Architecture

- The app uses a client-side SPA mounted at `/shell` to simplify in-webview behavior.
- A rewrite sends all non-API and non-`_next` routes to `/shell`:
  - See `next.config.ts` `rewrites` mapping `/(?!api/|_next/) → /shell`.
- The SPA entry (`app/frontend/app.tsx`) uses `react-router` for internal navigation.
- Smart contract integration via Wagmi hooks for blockchain interactions.

Key files:

- `app/shell/page.tsx`: Dynamically imports the SPA client (`app/frontend/app.tsx`) with `ssr: false`.
- `app/layout.tsx`: Global HTML shell, fonts, and meta (`fc:miniapp`, title/description from constants).
- `app/frontend/app.tsx`: SPA root. Initializes Mini App SDK context, quick auth, providers, and routes.
- `app/frontend/pages/Reviews.tsx`: Main reviews page with smart contract integration.
- `app/frontend/pages/Profile.tsx`: User profile page showing personal reviews.
- `app/lib/constants/index.ts`: Smart contract ABI, address, and app configuration.
- `app/lib/providers/index.tsx`: Wagmi and Reown AppKit providers for Web3 functionality.
- `app/lib/api/config/index.ts`: Axios instance attaching `Authorization: Bearer <session>` if present.
- `app/globals.css`: Tailwind v4 setup and base styles.

## Smart Contract Integration

The app integrates with a Reviews smart contract deployed on Base blockchain:

### Contract Details
- **Contract Address**: `0x2A7EC1a948C356c3D5cf0b275B0FAa4Df10701D5`
- **Network**: Base Mainnet
- **Contract Name**: Reviews
- **Solidity Version**: Latest (with OpenZeppelin Ownable)

### Available Functions

#### `createReview(uint256 fid, string text, bool isPositive)`
- **Purpose**: Create a new review
- **Parameters**:
  - `fid`: Farcaster ID of the reviewer
  - `text`: Review content text
  - `isPositive`: Boolean indicating positive (true) or negative (false) review
- **State Mutability**: `payable` (requires gas fee)
- **Events**: Emits `ReviewCreated` event

#### `getReview(uint256 fid)`
- **Purpose**: Retrieve a specific review by FID
- **Parameters**:
  - `fid`: Farcaster ID to look up
- **Returns**: `Review` struct containing:
  - `fid`: Farcaster ID
  - `timestamp`: Block timestamp when created
  - `text`: Review content
  - `isPositive`: Review sentiment
- **State Mutability**: `view` (read-only)

#### `deleteReview(uint256 fid)`
- **Purpose**: Delete a review
- **Parameters**:
  - `fid`: Farcaster ID of the review to delete
- **State Mutability**: `nonpayable`
- **Events**: Emits `ReviewDeleted` event

#### `getRandomNumber()`
- **Purpose**: Generate a random number (demo function)
- **Returns**: `uint256` random number
- **State Mutability**: `pure` (no state changes)

### Review Data Structure

```solidity
struct Review {
    uint256 fid;        // Farcaster ID of the reviewer
    uint256 timestamp;  // Block timestamp when created
    string text;        // Review content
    bool isPositive;    // Review sentiment (true = positive, false = negative)
}
```

### Events

- **`ReviewCreated`**: Emitted when a new review is created
- **`ReviewDeleted`**: Emitted when a review is deleted
- **`OwnershipTransferred`**: Emitted when contract ownership changes

### Routing (Client SPA)

- `react-router` handles client routes inside the SPA.
- Available routes:
  - `/` - Reviews page (main feed)
  - `/profile` - User profile with personal reviews

## API Endpoints

Located under `app/api/*`:

### Authentication
- **`POST /api/login`** - User authentication endpoint
  - Handles Farcaster session token validation
  - Returns user session data

### Error Handling
- **`POST /api/clientError`** - Client-side error reporting
  - Captures and logs client-side errors
  - Integrates with error tracking services

### Notifications
- **`POST /api/notify`** - Push notification endpoint
  - Sends notifications to users
  - Supports various notification types

### Webhooks
- **`POST /api/webhook`** - Webhook handler
  - Processes incoming webhooks from external services
  - Handles Farcaster events and updates

### Open Graph
- **`GET /api/og`** - Dynamic OG image generation
  - Generates social media preview images
  - Supports custom review content in OG images

> **Note**: These endpoints are currently scaffolded and may need implementation based on your specific requirements.

### Styling

- Tailwind v4 via PostCSS plugin (`postcss.config.mjs`).
- Global styles in `app/globals.css` using `@theme` and `@layer base`.

### Farcaster Integration

- `@farcaster/miniapp-sdk` is initialized in `app/frontend/app.tsx`:
  - Reads `sdk.context` to populate `user`, `client`, `capabilities` in a global store.
  - Calls `sdk.actions.ready({ disableNativeGestures: true })`.
  - Fetches a session via `sdk.quickAuth.getToken()` and stores it; axios attaches it to requests.

## Development Guide

### Getting Started

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd reviews
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_HOST=http://localhost:3000" > .env.local
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Optional: Public URL for Testing**
   ```bash
   npm run tunnel
   ```

### Development Tips

- **Mobile Testing**: Use `npm run tunnel` to get a public URL for mobile/webview testing
- **Environment Variables**: Ensure `NEXT_PUBLIC_HOST` matches the origin you use to open the app
- **Adding Pages**: Register new pages in `react-router` inside `app/frontend/app.tsx`
- **API Routes**: Add new API routes under `app/api/<name>/route.ts`
- **Smart Contract**: Update contract address and ABI in `app/lib/constants/index.ts`
- **Styling**: Use Tailwind CSS v4 classes with `clsx` for conditional styling

### Code Structure

- **Frontend**: All client-side code is in `app/frontend/`
- **Components**: Reusable components in `app/frontend/components/`
- **Pages**: Main app pages in `app/frontend/pages/`
- **State**: Global state managed with Zustand in `app/lib/store/`
- **Providers**: Web3 providers in `app/lib/providers/`

### Smart Contract Development

The app integrates with a Reviews smart contract on Base:

- **Contract Address**: `0x2A7EC1a948C356c3D5cf0b275B0FAa4Df10701D5`
- **Network**: Base Mainnet
- **Functions**: `createReview`, `getReview`, `deleteReview`, `getRandomNumber`

To update the contract:
1. Deploy new contract to Base
2. Update `CA` constant in `app/lib/constants/index.ts`
3. Update ABI import path if needed
4. Test all contract interactions

## Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Configuration

For production deployment:

1. **Set Environment Variables**
   ```bash
   NEXT_PUBLIC_HOST=https://your-domain.com
   ```

2. **HTTPS Requirement**
   - Host behind HTTPS in production
   - Farcaster Mini Apps require secure connections

3. **Domain Configuration**
   - Update `NEXT_PUBLIC_HOST` to your production domain
   - Ensure CORS settings allow your domain

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build command
npm run build

# Publish directory
.next
```

#### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Production Checklist

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Smart contract address updated
- [ ] Domain whitelisted in Farcaster
- [ ] Error tracking configured
- [ ] Performance monitoring enabled

## Project Structure

```
reviews/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── clientError/          # Error reporting endpoint
│   │   ├── login/                # Authentication endpoint
│   │   ├── notify/               # Notification endpoint
│   │   ├── og/                   # Open Graph image generation
│   │   └── webhook/              # Webhook handlers
│   ├── frontend/                 # Client-side SPA
│   │   ├── components/           # Reusable React components
│   │   │   ├── Header.tsx        # App header component
│   │   │   ├── Menu.tsx          # Navigation menu
│   │   │   └── CustomCursor.tsx  # Custom cursor component
│   │   ├── pages/                # Main app pages
│   │   │   ├── Reviews.tsx       # Reviews feed page
│   │   │   └── Profile.tsx       # User profile page
│   │   └── app.tsx               # SPA root component
│   ├── lib/                      # Shared utilities
│   │   ├── constants/            # App configuration
│   │   │   └── index.ts          # Smart contract ABI & constants
│   │   ├── providers/            # React context providers
│   │   │   └── index.tsx         # Web3 providers setup
│   │   ├── store/                # Global state management
│   │   │   └── index.ts          # Zustand store
│   │   └── clientErrorsReporting.ts # Error handling
│   ├── shell/                    # SPA shell for Farcaster
│   │   └── page.tsx              # Shell page component
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── artifacts/                    # Smart contract artifacts
│   └── contracts/Reviews.sol/    # Contract ABI and metadata
├── public/                       # Static assets
│   └── images/                   # Images and icons
├── scripts/                      # Build and deployment scripts
├── package.json                  # Dependencies and scripts
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Troubleshooting

### Common Issues

#### Environment Variables
- **Issue**: App throws error at boot about missing `NEXT_PUBLIC_HOST`
- **Solution**: Create `.env.local` file with `NEXT_PUBLIC_HOST=http://localhost:3000`

#### Smart Contract Interactions
- **Issue**: Contract calls failing
- **Solution**: 
  - Ensure you're connected to Base network
  - Check contract address is correct
  - Verify you have sufficient ETH for gas fees

#### Farcaster Integration
- **Issue**: Mini App SDK not initializing
- **Solution**:
  - Ensure app is running on HTTPS in production
  - Check that domain is whitelisted in Farcaster
  - Verify Farcaster SDK versions are compatible

#### Build Issues
- **Issue**: Build failing with TypeScript errors
- **Solution**:
  - Run `npm run lint` to check for issues
  - Ensure all dependencies are installed
  - Check TypeScript configuration

### Getting Help

- Check the [Farcaster Mini App documentation](https://docs.farcaster.xyz/miniapps)
- Review [Wagmi documentation](https://wagmi.sh) for Web3 interactions
- Consult [Next.js App Router docs](https://nextjs.org/docs/app) for routing issues

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add TypeScript types for new functions
- Test smart contract interactions thoroughly
- Update documentation for new features

## License

MIT
