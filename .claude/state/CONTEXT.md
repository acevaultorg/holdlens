# HoldLens — CONTEXT

## Orient
**Project:** HoldLens — 13F superinvestor tracker, Next.js 15 static export, Cloudflare Pages + Worker proxy.
**State:** v0.26 copy parity shipped on top of v0.25 unified signed score. 488 static pages live.
**Goal:** Keep the site honest — no stale claims, no "coming soon" lies about already-shipped features.

## Session Handoff

**Mode:** god
**Objective:** copy parity after the v0.25 unified signed score ship
**Progress:** 12/12 tasks done, 0 blocked, 0 human handoffs
**Branch:** `acepilot/v0.25-unified-score` · 4 commits on top of v0.25 (71b7678, cc344b7, ffdc6f4, 4a8d596, eae8754)
**Deployed:** Cloudflare Pages — https://70250990.holdlens.pages.dev → holdlens.com
**Next actions:** none blocking. Merge `acepilot/v0.25-unified-score` to main when ready. The insiders-page-draft in `.claude/state/insiders-page-draft/` can now be promoted since v0.25 work is live.
**Human actions pending:** 0 (deploy is automated via wrangler; branch is pushed)
**Open questions:** none
**Momentum:** high — copy is now truthful across every surface
<!-- handoff: 2026-04-11 07:45 -->

## What shipped in v0.26

Copy parity after v0.25 unified scale. Nine files rewritten so nothing on the site still describes the old multi-factor 0-100 model:

1. `/learn/conviction-score-explained` — was telling users the model is "coming in v0.4" (it's been live for hours). Now fully describes the shipped unified signed −100..+100 model with all eight signal layers + label mapping table.
2. `/pricing` — was selling "Conviction Score v2 — 0-100 algorithmic score" as a Pro feature. Both tiers rewritten: Free lists the actual shipped product (unified score, dossier pages, leaderboard, portfolio, screener, etc), Pro is repositioned around email alerts, EDGAR expansion, custom watchlist triggers, thesis generation, and API.
3. Homepage hero copy — "ranked by a multi-factor recommendation model" → signed-scale framing with +100/−100 anchors.
4. Homepage "Conviction-scored" feature card → "One signed score" with the META-problem framing.
5. `/best-now` meta description — updated from "ConvictionScore v3" to the unified signed scale copy.
6. `/what-to-sell` meta description — dropped "exit-share weighting, dump severity" (these are no longer in the score).
7. `/what-to-buy` meta description — updated.
8. `/signal/[ticker]` footer — no longer says "multi-factor recommendation scoring".
9. `/thank-you` + `/alerts` Pro upsell copy — stopped pretending the ConvictionScore is a future Pro feature.
10. `/press-kit` launch posts (Show HN, r/SecurityAnalysis, r/investing, Twitter thread, ProductHunt) — rewritten with the much sharper "Dataroma has META #1 on both buy AND sell lists simultaneously because they rank by raw ownership count — HoldLens fixes that with one signed score" hook.
11. Root `app/layout.tsx` meta — "Track 10+ superinvestors. Conviction scores, backtests, weekly moves" → "Track 30 of the world's best portfolio managers on a single signed −100..+100 ConvictionScore". Every page that didn't override inherits the new copy now.

## Verified on production

- `/buys` — 58 tickers, GE +42 → POOL +2
- `/sells` — 10 tickers, AAPL −11 → HPQ −1
- `/signal/META` — BUY verdict, score +20, appears ONLY on buys
- Zero overlap between the two rankings
- `/learn/conviction-score-explained` — 8/8 signal layers described
- `/pricing` — unified scale copy live, no "Conviction Score v2" language
- Homepage hero — "strongest possible buy" copy live
- Root meta tags — 30 managers, signed scale

## Next session suggestions

- v0.27: promote `.claude/state/insiders-page-draft/page.tsx` to `app/insiders/page.tsx` + add to nav + sitemap. The parallel agent that built it correctly aborted ship because v0.25 was active on the branch.
- v0.27: merge `acepilot/god-loop-changelog` PR #2 (23-version changelog with Article JSON-LD + footer link + sitemap entry).
- v0.28: add v0.25 + v0.26 entries to `app/changelog/page.tsx` once that branch merges.
- v0.28: pre-generated OG images per `/signal/[ticker]` via `@vercel/og` or satori at build time.
