# HoldLens — CONTEXT

## Orient
**Project:** HoldLens — 13F superinvestor tracker, Next.js 15 static export, Cloudflare Pages + Worker proxy.
**State:** v0.29 shipped — per-ticker OG images (94 signal pages), pricing AB test ($13/$14/$15), BacktestShareCard viral wedge on all simulator pages.
**Goal:** Revenue activation. Stripe handoff is the single biggest unlock — one operator session = live subscription revenue.

## Session Handoff

**Mode:** god
**Objective:** viral SEO + conversion optimization (OG images, pricing AB, backtest shares)
**Progress:** 6/6 tasks done, 0 blocked, 1 [👤] carried (stripe-activate)
**Branch:** `acepilot/v0.25-unified-score` · 10 commits on top of v0.25 (2 new this session)
**Deployed:** needs CF Pages auto-deploy from push — previous deploy https://f419fbb0.holdlens.pages.dev → holdlens.com
**Next actions:**
  1. Operator: run /acepilot guide to see the Stripe activation walk-through (10-min revenue unlock)
  2. Chief: verify OG images render on social shares (share /signal/AAPL on Twitter, check card preview)
  3. Chief: monitor Plausible for pricing AB variant distribution after deploy
  4. Chief: consider merge `acepilot/v0.25-unified-score` → main (10 versions ahead)
  5. Next candidates: testimonials placeholder, /docs API documentation, EDGAR parser
**Human actions pending:** 1 — stripe-activate (see HUMAN_ACTIONS.md)
**Open questions:** none
**Momentum:** high
<!-- handoff: 2026-04-12 10:30 -->

## What shipped in v0.29

1. **Per-ticker OG images** — 94 branded 1200x630 PNG cards generated at build time via satori+sharp. Each shows ticker, company, sector, verdict (BUY/SELL/NEUTRAL in color), signed ConvictionScore, buyer/seller counts, and holdlens.com branding. Referenced in openGraph + twitter metadata per signal page. Every social share of a signal page now renders a rich preview instead of a generic fallback.

2. **Pricing AB test** — 3 cookie-sticky variants ($13/$14/$15 standard price). 90-day cookie ensures repeat visitors see consistent pricing. Plausible custom event "Pricing View" fires with variant + price on every load. Client component (`PricingAB.tsx`) with `ProPriceDisplay` and `HeroPriceTag` drop-ins. Founders rate ($9/mo) unchanged across variants.

3. **BacktestShareCard** — canvas-rendered 1200x630 PNG with manager name, investment scenario, final value, multiple, CAGR, vs S&P comparison, and HoldLens branding. Download PNG + Copy tweet + Share to Twitter buttons. Plausible events on every action. Wired into both `Backtest` (Buffett) and `ManagerBacktest` (all other managers).

## What shipped in v0.28 (for history)

SignalShareCard — per-ticker viral PNG share card on /signal/[ticker]. Stripe activation handoff guide.

## What shipped in v0.27 (for history)

/insiders page, /changelog page, TrendBadge in verdict box, sitemap backfill.
