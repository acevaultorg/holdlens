# HoldLens — DECISIONS (append-only)

## 2026-04-10 — v0.13 Live data architecture

**Decision:** Client-side live data via Yahoo Finance v8 chart endpoint with
corsproxy.io fallback. No server, no API key, no CORS backend.

**Why:**
- `next.config.js` has `output: 'export'` (static export, no server runtime).
  Adding a backend would require Workers/Functions and re-architecture.
- Yahoo v8 `/finance/chart/` is widely used in OSS projects, supports CORS for
  most clients, returns price + history + meta in one call.
- `corsproxy.io` is a known public CORS relay — acceptable fallback since the
  data is public anyway (no auth, no PII).
- sessionStorage cache (60s TTL) caps the request rate at ~1/min per unique
  symbol per tab. Sufficient for a free hobby product.

**Trade-offs:**
- Yahoo could disable CORS at any time. Fallback proxy may also rate-limit.
  Graceful degradation: components show "—" if both endpoints fail.
- Users without JS see no live data — but all ownership info is still server-
  rendered in the HTML. The live layer is additive, never load-bearing.

**When to revisit:** When we hit >1k DAU, move to Finnhub free tier (API key
in env, 60 req/min) or a self-hosted Cloudflare Worker proxy.

## 2026-04-10 — Watchlist as localStorage, not account

**Decision:** Watchlist is stored in `localStorage` under key
`holdlens_watchlist_v1`. No user accounts, no server persistence.

**Why:** Zero-friction signup (user just stars a ticker). No auth infra
required. Private by default. Upgrade path later: if user creates an account,
sync localStorage → server on first login.

**Cross-component sync:** Custom event `holdlens:watchlist:update` dispatched
on every mutation. `StarButton` instances on the same page stay in sync.
`storage` event handles cross-tab sync.

## 2026-04-10 — LiveChart is SVG, not TradingView

**Decision:** Rolled our own `<LiveChart>` component using SVG paths instead
of embedding TradingView's widget.

**Why:**
- Matches the HoldLens dark theme exactly (no iframe styling mismatch)
- Zero external script dependency (TradingView adds ~200kb)
- Gets data for free from the already-fetched `LiveQuote` chart array
- Custom hover crosshair + tooltip without iframe postMessage glue

**What it covers:** 1mo / 3mo / 6mo / 1y ranges. Line + gradient fill. Hover
crosshair with date + price tooltip. Baseline dashed line at period start.

**What it doesn't:** Intraday (1d), volume bars, technical indicators. Out of
scope for v0.13.

## 2026-04-10 — Approximate 13F filing dates, not scraped

**Decision:** `lib/filings.ts` hardcodes Q3 2025 deadline (2025-11-14) for all
14 tracked managers. EDGAR URLs are real.

**Why:** Scraping EDGAR from a static site is impossible. Hardcoding the
quarter-end deadline is accurate to within a few days (filings cluster near
the deadline). Good enough for UI badges until the Python parser in v0.2
replaces it.

**Next filing deadline** is computed client-side from the current date using
the 45-day-post-quarter rule — `nextFilingDeadline()` in `lib/filings.ts`.
