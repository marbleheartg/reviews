## Mini App Template (Next.js + Farcaster)

A minimal, production-ready template for building Farcaster Mini Apps with Next.js 15, React 19, Tailwind CSS v4, and a client-side SPA mounted inside a Next.js shell. Includes basic API routes, auth/session wiring via `@farcaster/miniapp-sdk`, and sensible DX defaults (Turbopack, Cloudflare tunnel).

### Features
- **Next.js 15** with App Router and a SPA shell (`/shell`) via rewrites
- **React 19** with modern hooks
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **Farcaster Mini App SDK** integration (`@farcaster/miniapp-sdk`, `@farcaster/quick-auth`)
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

Key files:
- `app/shell/page.tsx`: Dynamically imports the SPA client (`app/frontend/app.tsx`) with `ssr: false`.
- `app/layout.tsx`: Global HTML shell, fonts, and meta (`fc:miniapp`, title/description from constants).
- `app/frontend/app.tsx`: SPA root. Initializes Mini App SDK context, quick auth, providers, and routes.
- `app/lib/api/config/index.ts`: Axios instance attaching `Authorization: Bearer <session>` if present.
- `app/globals.css`: Tailwind v4 setup and base styles.

### Routing (Client SPA)
- `react-router` handles client routes inside the SPA.
- Example defined route: `/` renders `Header` + `Home` and a global `Menu`.

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
  api/
  frontend/
    components/
    pages/
  lib/
  shell/
public/
```

### License
MIT
