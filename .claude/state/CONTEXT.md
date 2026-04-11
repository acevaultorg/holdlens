# HoldLens — CONTEXT

## Orient
**Project:** HoldLens — 13F superinvestor tracker, Next.js 15 static export, Cloudflare Pages + Worker proxy.
**State:** v0.28 shipped SignalShareCard — per-ticker viral PNG share card on /signal/[ticker], 94 signal dossiers now have one-click download + pre-filled tweet. Built on v0.27 foundation (490 page baseline now 483 HTML + 94 signal + 94 ticker + xml/sitemap/feeds).
**Goal:** Revenue activation. Stripe handoff is the single biggest unlock — one operator session → live subscription revenue.

## Session Handoff

**Mode:** god
**Objective:** revenue-first — viral share card on /signal/[ticker] + Stripe activation handoff
**Progress:** 7/7 tasks done (1 pending commit), 0 blocked, 1 [👤] (stripe-activate)
**Branch:** `acepilot/v0.25-unified-score` · 8 commits on top of v0.25 (post-commit)
**Deployed:** Cloudflare Pages — previous deploy https://f419fbb0.holdlens.pages.dev → holdlens.com. v0.28 needs push + CF auto-deploy.
**Next actions:**
  1. Operator: run /acepilot guide to see the Stripe activation walk-through (10-min revenue unlock)
  2. Chief: once deployed, verify /signal/META shows the share card, click Download to confirm PNG renders
  3. Chief: consider merge `acepilot/v0.25-unified-score` → main (8 versions ahead, safe to merge)
  4. Next candidate: og-images at build time via satori (pairs with SignalShareCard for SEO amplification)
**Human actions pending:** 1 — stripe-activate (see HUMAN_ACTIONS.md "ACTIVATE Stripe Payment Link")
**Open questions:** none
**Momentum:** high
<!-- handoff: 2026-04-11 22:55 -->

## What shipped in v0.28

**SignalShareCard** — the missing viral wedge. Every /signal/[ticker] page now has a branded, downloadable 1200x630 PNG card with:
- Big ticker symbol + company name + sector
- Verdict word (BUY / SELL / NEUTRAL) in verdict color
- Signed ConvictionScore +XX / −XX on a −100..+100 scale
- Bottom row: buyers / sellers / top streak (Q) / held-by
- HoldLens branding + direct URL back to /signal/[ticker]
- Pre-composed tweet with the URL inline (copy-safe anywhere)
- Download PNG / Copy tweet / Share to Twitter / Share to LinkedIn
- Plausible custom events on every click ("Signal Share Download", etc)
- SSR-safe skeleton with aspect-ratio placeholder (no layout shift)
- Pure client-side canvas — zero new deps, zero infra cost, works under `output: 'export'`

Wired into app/signal/[ticker]/page.tsx right after the unified score breakdown, before the live chart — high enough to be seen while the verdict is fresh, low enough not to push the chart below the fold.

**Stripe activation handoff** — copy-paste guide in HUMAN_ACTIONS.md walks the operator through:
1. Create HoldLens Pro product in Stripe dashboard
2. Generate Payment Links ($9/mo founders + $14/mo standard)
3. Paste into Cloudflare Pages env vars (NEXT_PUBLIC_STRIPE_PAYMENT_LINK + NEXT_PUBLIC_STRIPE_PAYMENT_LINK_FOUNDERS)
4. Trigger rebuild
5. Verify live

The wire already exists — `components/StripeCheckoutButton.tsx` is on /pricing and gracefully falls back to /alerts if env vars are missing. This is a 10-minute operator task.

## What shipped in v0.27

Three drafts that had been sitting on the shelf for v0.25 to land:

1. **`/insiders`** — promoted from `.claude/state/insiders-page-draft/page.tsx` (now deleted). Theme-ported (`text-green`/`border-subtle`/`bg-card` → current palette). Added a 4-card summary row: buy count / sell count / NET insider flow (buys − discretionary sells, signed and colored) / unique tickers with buys. Sells table distinguishes 10b5-1 scheduled sells (dim) from discretionary sells (rose + bold). All ticker links go to `/signal/[ticker]` so visitors land on the full dossier. Dataset JSON-LD for search indexing. Live stats: 6 buys, 16 sells, 6 unique tickers, 58 deep links to signal dossiers.

2. **`/changelog`** — brand-new page on this branch. Full 26-release history from v0.1 through v0.26 with Article JSON-LD, timeline layout, brand-color milestone dots, RSS link. The top two entries (v0.26 "Copy parity" and v0.25 "Unified signed score") are the key SEO landing content for anyone searching "HoldLens update". Obsoletes the parallel `acepilot/god-loop-changelog` PR #2.

3. **TrendBadge in the signal verdict box** — last open v0.19 backlog item. The big BUY/SELL/NEUTRAL verdict on `/signal/[ticker]` now has a "3Q BUY" / "2Q SELL" streak badge next to it. Closes the visual loop between the verdict and the multi-quarter streak section below.

Plus a significant **sitemap backfill** — 18 already-live routes that had never been in `sitemap.ts` are now indexed, including all the conversion surfaces (`/best-now`, `/buys`, `/sells`, `/this-week`, `/what-to-buy`, `/what-to-sell`) at priority 0.95-0.98 so Google crawls them harder. Previously only `/top-picks` from the conversion surfaces was in the sitemap.

## Verified live on production

- `/insiders` — 6 buys, 16 sells, 6 unique tickers, net flow signed and colored, Dataset JSON-LD present, 58 deep links to `/signal/[ticker]`
- `/changelog` — 26 versions rendered, v0.25 + v0.26 entries visible, Article JSON-LD
- `/sitemap.xml` — /insiders, /changelog, /best-now, /buys, /sells, /this-week all indexed
- `/signal/META` — verdict box now shows BUY +20 with trend badge inline
- Nav — /insiders + /changelog present in footer + MobileNav

## What shipped in v0.26 (for history)

Copy parity after v0.25. Every surface that still described the pre-v0.25 multi-factor 0-100 model was rewritten:
- `/learn/conviction-score-explained` (was "coming in v0.4")
- `/pricing` both tiers (was selling the score as a Pro feature — it's Free)
- Homepage hero + feature card
- Meta descriptions on /best-now, /what-to-buy, /what-to-sell
- /signal dossier footer
- /thank-you + /alerts Pro upsell copy
- /press-kit launch posts
- Root `layout.tsx` meta tags (was "Track 10+ superinvestors")

## Next session suggestions

- **v0.28 og-images** — pre-generated OG images per `/signal/[ticker]` via `@vercel/og` or `satori`. Single highest-impact viral unlock. Every social share of a signal page renders the ticker + score + verdict + top buyers in a branded card.
- **v0.28 backtest-share** — shareable backtest result cards (canvas/svg → image download). Pairs with the existing `PortfolioShareCard` viral wedge.
- **v0.28 pricing A/B** — charm pricing test variants ($13 / $14 / $15). Cookie-based segmentation works fine for a static export.
- **Merge branch to main** — `acepilot/v0.25-unified-score` has now been the live branch for 8 versions (v0.25 → v0.27). Consider merging to main and starting a fresh feature branch for v0.28.
- **Close PR #2** — the `acepilot/god-loop-changelog` branch is obsoleted by v0.27's fresher `/changelog` page. Close it without merging.
