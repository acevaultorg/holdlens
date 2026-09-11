# HoldLens

See what the smartest investors are buying. Track 82+ superinvestors with conviction scores, backtests, and move-alerts.

**Live:** https://holdlens.com

## Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS (dark mode default)
- Cloudflare Pages static deployment via the guarded local build path
- Zero DB in v0 (hardcoded BRK data); EDGAR parser + Postgres in v0.2

## Quickstart
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy

Production does not auto-deploy from GitLab or Vercel. Use the canonical main checkout with its gitignored production environment and Cloudflare credentials:

```bash
npm ci
npm run deploy
```

`npm run deploy` delegates to `scripts/deploy-cf.sh`: clean → build → post-build guard → pruned/capped Cloudflare upload → IndexNow. Do not upload `out/` with bare Wrangler or the Python uploader, and do not expect Cloudflare dashboard variables to be injected into this locally built static export.

## Roadmap
- v0.1 (now) — landing + Buffett backtest + Buffett profile + email capture
- v0.2 — Real EDGAR 13F parser (Python) + Postgres + 82 managers + 500 tickers
- v0.3 — AI thesis layer (Claude Haiku) on every ticker/manager page
- v0.4 — Email alerts (Resend), weekly newsletter
- v0.5 — Pro tier ($14/mo), Conviction Score, Manager Alpha Attribution
- v0.6 — Public API, embeds, X bot
- v1.0 — Full Morningstar-of-copy-investing product

## Not investment advice
HoldLens surfaces public SEC 13F filings. Nothing here is a recommendation.
