## Reviews Mini App (Next.js + Farcaster + Base)

A Farcaster Mini App for creating and managing reviews on the Base blockchain. Built with Next.js 15, React 19, Tailwind CSS v4, and smart contract integration. Users can create, view, and manage reviews with Farcaster authentication and blockchain storage.

### Features

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

### Requirements

- Node.js 20+
- pnpm, npm, or bun (repo ships with `bun.lock` but works with npm/pnpm)
- Optional: `cloudflared` for tunneling

### Quick Start

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

### Smart Contract Integration

The app integrates with a Reviews smart contract deployed on Base blockchain:

- **Contract Address**: `0x2A7EC1a948C356c3D5cf0b275B0FAa4Df10701D5`
- **Network**: Base Mainnet
- **Available Functions**:
  - `createReview(fid, text, isPositive)`: Create a new review (payable)
  - `getReview(fid)`: Retrieve a specific review by FID
  - `deleteReview(fid)`: Delete a review
  - `getRandomNumber()`: Get a random number (used for demo purposes)

The contract stores reviews with the following structure:

- `fid`: Farcaster ID of the reviewer
- `timestamp`: When the review was created
- `text`: Review content
- `isPositive`: Boolean indicating if it's a positive or negative review

### Routing (Client SPA)

- `react-router` handles client routes inside the SPA.
- Available routes:
  - `/` - Reviews page (main feed)
  - `/profile` - User profile with personal reviews

### API Endpoints (App Router)

Located under `app/api/*`:

- `app/api/login/route.ts`
- `app/api/clientError/route.ts`
- `app/api/notify/route.ts`
- `app/api/webhook/route.ts`
- `app/api/og/route.tsx`

These are stubs/scaffolding for auth, error reporting, notifications, webhooks, and OG image generation. Review and adapt to your needs.

### Styling

- Tailwind v4 via PostCSS plugin (`postcss.config.mjs`).
- Global styles in `app/globals.css` using `@theme` and `@layer base`.

### Farcaster Integration

- `@farcaster/miniapp-sdk` is initialized in `app/frontend/app.tsx`:
  - Reads `sdk.context` to populate `user`, `client`, `capabilities` in a global store.
  - Calls `sdk.actions.ready({ disableNativeGestures: true })`.
  - Fetches a session via `sdk.quickAuth.getToken()` and stores it; axios attaches it to requests.

### Development Tips

- If you need a public URL for mobile/webview testing, run `npm run tunnel`.
- Ensure `NEXT_PUBLIC_HOST` matches the origin you use to open the app.
- When adding new pages to the SPA, register them in `react-router` inside `app/frontend/app.tsx`.
- When adding new API routes, put them under `app/api/<name>/route.ts`.

### Build & Deploy

```bash
npm run build
npm run start
```

- Host behind HTTPS in production.
- Set `NEXT_PUBLIC_HOST` to your public origin/domain in the runtime environment.

### Project Structure (excerpt)

```
app/
  api/                    # API routes for backend functionality
  frontend/
    components/           # React components (Header, Menu, etc.)
    pages/               # Main app pages (Reviews, Profile)
  lib/
    constants/           # Smart contract ABI and configuration
    providers/          # Web3 providers (Wagmi, Reown AppKit)
    store/              # Global state management
  shell/                # SPA shell for Farcaster webview
artifacts/              # Smart contract artifacts and ABIs
public/                 # Static assets and images
```

### License

MIT
