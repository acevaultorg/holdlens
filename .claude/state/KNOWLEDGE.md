# HoldLens — KNOWLEDGE

## ConvictionScore v5 (2026-04-24) <!-- verified: 2026-04-24 -->

The ConvictionScore model is at **v5** as of 2026-04-24. v5 adds Layer 7 (`eventSignal`) — completing the SEC Signals trilogy by integrating 8-K material events alongside the existing 13F + Form 4 data layers.

**Model lives at:** `lib/conviction.ts`. Two compute paths:
- `getConviction(ticker)` — live scoring with full eventSignal integration
- `getConvictionAtQuarter(ticker, asOfQuarter)` — historical/backtest scoring with `eventSignal: 0` (no look-ahead bias)

**The 9 layers (7 positive + 2 penalty):**
1. smartMoney (0–30) — manager quality × consensus, time-decayed
2. insiderBoost (-15 to +20) — Form 4 net buy/sell value
3. trackRecord (-10 to +20) — buyer 10y CAGR × concentration
4. trendStreak (0–10) — multi-quarter compounding
5. concentration (0–10) — biggest position size as conviction proof
6. contrarian (0–10) — under-the-radar with tier-1 buyers
7. **eventSignal (-15 to +5) — NEW v5** — 8-K events last 90d
8. dissentPenalty (0–60) — sells subtract, ×1.6 weighted
9. crowdingPenalty (0–10) — too many owners = priced in

**Event item-code weights:** 1.03 = -15 · 2.06 = -10 · 4.02 = -12 · 3.01 = -10 · 5.02 (departure, keyword-gated) = -5 · 5.02 (appointment, keyword-gated) = +3 · 7.01 (note-tagged) = +2 · 8.01 (note-tagged) = +1.

**Scale:** symmetric -100 to +100, sign determines BUY/SELL classification (DEAD_ZONE = 0). Typical top picks score 25-50 in absolute magnitude — NOT 80-100. The display label `"Signed −100…+100 · top picks 25–50"` (homepage panels) communicates this.

**Display:** homepage panels show per-row `Driven by:` subline (top 2 contributing components from `ConvictionBreakdown`). Source: `components/BuySellSignals.tsx`.

**Validation:** read-only diff at `scripts/diff-conviction-v5.ts`.

**Why v5 had 0 ranking changes vs v4 on 2026-04-24:** the 4 Item 1.03 bankruptcies (CMLSQ, MARIZYME, QVCC, QVCGB) hit untracked tickers; AAPL/NFLX 5.02 events have generic headlines so correctly stay neutral. Infra is in place; signal activates organically when a tracked ticker files material 1.03/2.06/4.02. Full audit: DECISIONS.md 2026-04-24 entry.

**Public-facing explainer:** `/learn/conviction-score-explained/` documents v5 + the trilogy positioning + the 7 layers.

**Deploy state at v5 commit time (2026-04-24):** 4 commits stacked on origin/main (b2afd5848 divergence + b326c19fc v5 model+display + 8dd80ed49 tasks doc + d29f6de0b explainer doc). All blocked on Cloudflare Pages EPIPE — manual dashboard upload OR next auto-deploy chain windows will land them. See TASKS.md Clarity Card.

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

## Analytics stack <!-- verified: 2026-04-16 -->

### Google Analytics 4 (primary product analytics)

- **Account:** `HoldLens` (account ID `391571004`) under `paulomdevries@gmail.com`
- **Property:** `holdlens.com` (property ID `533294495`), Netherlands timezone, USD currency
- **Measurement ID:** `G-HDK5CHBQEY`
- **Stream:** `HoldLens Web`, stream ID `14382101557`, URL `https://holdlens.com`
- **Env var:** `NEXT_PUBLIC_GA4_ID=G-HDK5CHBQEY` in `.env.production.local` (gitignored).
  Next.js inlines `NEXT_PUBLIC_*` at build time → GA snippet appears in every
  static HTML page from `app/layout.tsx` lines 110-127 (no-op until env var set).
- **Direct link:** `https://analytics.google.com/analytics/web/?authuser=2#/a391571004p533294495/reports/intelligenthome`

### Property configuration

- **Data retention:** 14 months (both event and user data). Default is 2 months — was extended 2026-04-16.
- **Google signals:** ON (enables cross-device + aggregated demographics/interests, gated by Consent Mode).
- **Enhanced Measurement:** ON (auto-captures scrolls, outbound clicks, file downloads, video, form interactions).
- **Industry:** Finance. Business size: Small (1-10). Objectives: Drive sales + Understand web traffic.

### Product links

- **Google Search Console:** `holdlens.com` (Domain property) linked — organic search queries flow into GA Search Console report. GSC verification meta in `app/layout.tsx` verification block (v1.18).
- **Google AdSense:** `pub-7449214764048186` (AdSense for Content) linked with Revenue Data Reporting ON — ad revenue per-page surfaces in GA. Activation pending Google AdSense approval (submitted 2026-04-14).
- **Google Ads:** not linked (no paid ad spend yet).

### Consent Mode v2 (EU/GDPR)

- Defaults in `app/layout.tsx` lines 81-93: `ad_storage`, `ad_user_data`,
  `ad_personalization`, `analytics_storage` all DENIED on page load with
  `wait_for_update: 500`.
- Promotion to GRANTED happens on read of `localStorage['holdlens_cookie_consent_v1'] === 'granted'`,
  set by the `CookieConsent` banner component.
- Effect: EU visitors see NO GA data collection until they click grant.
  Google signals/demographics only activate for consented users.

### Key events (conversions)

- `purchase` — auto-marked key event (selected when picking "Drive sales" at property creation).
  Requires code instrumentation on Stripe thank-you page to fire
  `gtag('event', 'purchase', { currency, value, transaction_id })`.
- `begin_checkout` — NOT yet marked. To enable, either:
  (a) wait for GA to observe ≥1 outbound `click` event on `buy.stripe.com`, then
  create a custom event filter via Admin → Events → Create, OR
  (b) explicit `gtag('event', 'begin_checkout', { currency: 'USD', value })`
  call in `StripeCheckoutButton.tsx` `onClick` handler.

### Secondary analytics (already shipped)

- **Plausible:** `script.outbound-links.tagged-events.js`, `data-domain=holdlens.com`.
  Outbound links auto-tracked. Tagged events via `className="plausible-event-name=NAME"` —
  used on `StripeCheckoutButton` (`Pro Checkout Click`), `InvestingBooks` book cards (`Book Click`),
  `AffiliateCTA` broker cards (`Broker Click`).
- **Microsoft Clarity:** activates when `NEXT_PUBLIC_CLARITY_ID` env var is set.
- **Cloudflare Web Analytics:** activates when `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` is set.
- **AdSense loader:** `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7449214764048186`,
  `lazyOnload` strategy. Auto-ads serve after Google approval.

### Tag firing verification

Chrome MCP probe on 2026-04-16: `region1.google-analytics.com/g/collect?v=2&tid=G-HDK5CHBQEY&en=page_view&ep.anonymize_ip=true` — firing. Initial hits returned 503 during GA4 property provisioning (first ~30 min post-creation, known GA4 backend behavior); realtime panel confirmed events landed despite edge 503s.
