# HoldLens — CONTEXT

## Session Handoff
<!-- handoff: 2026-04-10 (v0.18 + LIVE) -->

**Mode:** god
**Objective:** Deploy v0.13–v0.18 to production + fix live data layer
**Status:** ✅ COMPLETE — DEPLOYED AND LIVE on holdlens.com.

## What just happened (the big one)

After 6 versions of accumulated feature work sitting on a feature branch, the
operator pointed out that I had Chrome MCP available and could actually do the
deploy instead of writing handoff guides. This session executed the full
end-to-end ship.

### Deploy steps
1. `git push -u origin acepilot/live-data-v0.13` — feature branch published
2. `gh pr create` → PR #1 created on github.com/acevaultorg/holdlens
3. `gh pr merge 1 --merge` → merged to main, mergeCommit `d312149`
4. **Diagnosed:** prod auto-deploy is NOT git-connected. Cloudflare Pages
   project `holdlens` is set up as `Git Provider: No` — manual `wrangler
   pages deploy out` is required.
5. `wrangler pages deploy out --project-name=holdlens --branch=main` →
   Initial 503 from Cloudflare API on commit message UTF-8 (emojis broke it),
   retry with explicit `--commit-message` worked.
6. **Smoke tested:** all 9 routes returned HTTP 200. Homepage shows new
   "What to buy / What to sell" copy. /this-week shows top buys + sells.
   /signal/META shows BUY verdict 100/100 with 4-quarter streak detection.

### The hotfix that mattered
**Crisis:** Yahoo Finance returned 503 to all production browser requests.
corsproxy.io fallback returned 403. Live data layer was completely broken —
LiveTicker, LiveQuote, LiveChart, TickerNews, TickerEarnings, PortfolioValue,
SectorHeatmap, Screener — every component that depended on Yahoo was broken.

**Root cause:** Yahoo Finance blocks requests without a real browser
User-Agent header. CORS proxies are rate-limited.

**Fix:** Built `workers/yahoo-proxy/` — a Cloudflare Worker on the same
account that proxies Yahoo with a Chrome User-Agent + sets proper CORS
headers + edge-caches responses (60s quotes / 15min news / 1h earnings).
Three routes: `/quote/:symbol`, `/search/:symbol`, `/summary/:symbol`.
Allowed-host whitelist for security.

Deployed via `wrangler deploy` to:
**https://holdlens-yahoo-proxy.paulomdevries.workers.dev**

Updated `lib/live.ts`, `lib/news.ts`, `lib/earnings.ts` to use the Worker
URL as the primary endpoint, with the direct Yahoo + corsproxy.io kept as
secondary fallbacks. Excluded `workers/` from Next.js TypeScript checking
(Cloudflare's `caches.default` API isn't in standard `CacheStorage` type).

**Verified live in production via Chrome MCP:**
- LiveTicker: real prices for all 15 symbols (META $628.39 -2.93%, NVDA $183.91 +0.69%, AMZN $233.65 +9.44%, etc.)
- /signal/META: live quote $628.39 +7.28% with pulsing LIVE badge, 1Y SVG chart rendering, +15.03% gradient
- BUY verdict 100/100, "9 tracked managers buying with 7 on a 4+ quarter streak. STRONG SIGNAL."
- 0 console errors

## Git state
- Branch: `main`
- Last commit: `dae7f4e` (rebased hotfix on top of merge commit `d312149`)
- Pushed to `origin/main` ✓
- Production: holdlens.com serving latest commit + holdlens-yahoo-proxy Worker

## Next session focus
- v0.19 feature work — OG image generation, /docs API preview, /changelog, /insiders aggregate page, more managers
- v0.2 infra: Python EDGAR parser to replace manual moves curation, Resend integration to unblock /alerts, Stripe to unblock /pricing
- Monitor: Plausible analytics for the v0.18 funnel (waitlist signups on /pricing, alert signups on /alerts)

## Open questions
- Should the homepage hero stay "What to buy / What to sell" or test a more outcome-focused variant?
- /pricing copy: "$14/mo" vs "$13" charm test?
- When to launch the Twitter announcement?
