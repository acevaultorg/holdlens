# HoldLens — KNOWLEDGE

## Stack <!-- verified: 2026-04-10 -->
- Next.js 15 App Router, TypeScript, Tailwind CSS
- Static export (`output: 'export'` in `next.config.js`) — NO server runtime
- React 19 RC
- Tailwind custom palette: `bg #0a0a0a`, `panel #141414`, `border #262626`,
  `text #e5e5e5`, `muted #9ca3af`, `dim #6b7280`, `brand #fbbf24` (amber/yellow)

## Deploy target <!-- verified: 2026-04-14 -->
- Primary: Cloudflare Pages at holdlens.com (project name: `holdlens`).
- **CRITICAL**: The CF Pages project is **NOT git-integrated**. Git push to
  main does NOT deploy. Every ship MUST end with a manual wrangler upload:
  ```
  cd holdlens && npm run build && \
    npx wrangler pages deploy out --project-name=holdlens --branch=main --commit-dirty=true
  ```
  Wrangler auth lives at `~/Library/Preferences/.wrangler/config/default.toml`
  (OAuth; refreshes automatically). Account ID `72bfd26c5f3c935393a25e5c0dea6039`.
- **Failure mode seen 2026-04-14**: 4-day deploy gap — v0.36–v0.44 (9 versions)
  were all sat in main + out/ but never pushed to CF because git-push-only was
  assumed to be enough. Curl to holdlens.com returned stale JS chunks from an
  old branch (`acepilot/insiders-page`). Fix: ran the wrangler command above;
  1191 files uploaded in 34.94s; all new routes immediately live.
- **Deploy Truth check**: after every `wrangler pages deploy`, curl the new
  route path and grep for an element that only exists in the new code (e.g.
  the new page's h1). HTTP 200 alone is NOT proof — parking pages and old
  deploys return 200.
- Vercel CLI is also configured as a secondary target, but holdlens.com DNS
  points to Cloudflare — do not use `vercel --prod` as the shipping step.

## Live data architecture <!-- verified: 2026-04-10 -->
- **Primary endpoint:** `https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}?interval=1d&range={range}`
- **Fallback:** `https://corsproxy.io/?url=<urlencoded-yahoo-url>`
- **Cache:** `sessionStorage`, key `hl_quote_{SYMBOL}`, 60s TTL
- **Shared module:** `lib/live.ts` exports `getQuote`, `getQuotes`, `fmtPrice`,
  `fmtPct`, `fmtMarketCap`
- **All price UI** (`LiveQuote`, `LiveChart`, `LiveTicker`, `PortfolioValue`)
  goes through `getQuote` — single cache, dedupe is free.

## Client-side state <!-- verified: 2026-04-10 -->
- Watchlist: `localStorage['holdlens_watchlist_v1']` — array of uppercase symbols
- Cross-component sync: `CustomEvent('holdlens:watchlist:update', {detail: list})`
- Helpers: `lib/watchlist.ts` — `getWatchlist`, `toggleWatchlist`, `subscribeWatchlist`
- SSR safety: every client component checks `typeof window === 'undefined'`
  and renders a skeleton/hidden placeholder until `mounted` state is set.

## Component inventory (v0.13)
- `EmailCapture` — localStorage-backed subscribe form (legacy from v0.1)
- `Backtest` / `ManagerBacktest` — SVG historical return chart (v0.1)
- `ShareButtons` — social share icons (v0.12)
- **NEW v0.13:**
  - `LiveQuote` — price + day-change badge (sizes: sm/md/lg/xl)
  - `LiveChart` — SVG sparkline with range picker (1mo/3mo/6mo/1y) + hover
  - `LiveTicker` — horizontal scrolling marquee, pauses on hover
  - `PortfolioValue` — aggregate $ value from holdings × live prices
  - `StarButton` — watchlist add/remove, SSR-safe
  - `GlobalSearch` — cmd+K fuzzy search over managers + tickers

## Routes (v0.13)
- `/` — landing
- `/top-picks` — most-owned (now with live price column)
- `/investor[/…]` — investor profiles (now with portfolio value + live prices + filing badges)
- `/ticker/[symbol]` — ticker detail (now with live quote + chart + star button)
- `/watchlist` — personal watchlist (NEW)
- `/simulate/[…]` — backtests
- `/learn/[…]`, `/sector/[…]`, `/compare/[…]`, `/quarterly/[…]`, `/faq`, `/about`, `/press`, `/methodology`
- Total static pages: 228

## Important constraints
- **NEVER add server-side code** — `output: 'export'` means no runtime.
  Any dynamic behavior must be client-side JS.
- **NEVER import `next/headers`, `cookies()`, or server-only APIs** — build will fail.
- **`app/api/subscribe/route.ts` is disabled** (`export {}`) — the form posts
  to localStorage and future Cloudflare Worker.
- **All `"use client"` components** must be SSR-safe: guard window access,
  render placeholder on first mount, hydrate after mount.

## Error patterns
- CORS fail on Yahoo: `LiveQuote` / `LiveChart` render "—" or "Chart unavailable"
  gracefully. No error thrown. Log to console only in dev.
- Unknown ticker in watchlist: `/watchlist` shows the symbol with "Not in coverage"
  subtitle — doesn't crash.

## Manager slug list (14 tracked) <!-- verified: 2026-04-10 -->
warren-buffett, bill-ackman, carl-icahn, david-einhorn, seth-klarman,
joel-greenblatt, michael-burry, stanley-druckenmiller, li-lu, monish-pabrai,
howard-marks, prem-watsa, bill-nygren, glenn-greenberg.

`warren-buffett` has a dedicated static page at `/investor/warren-buffett` —
excluded from `generateStaticParams` in `app/investor/[slug]/page.tsx`.
