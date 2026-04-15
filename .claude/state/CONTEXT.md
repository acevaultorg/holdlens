# HoldLens — CONTEXT

## Orient
**Project:** HoldLens — 13F superinvestor tracker, Next.js 15 static export, Cloudflare Pages.
**State:** v0.77 shipped — public JSON API now 150 endpoints (v0.76 added /api/v1/sector/{slug}.json ×12; v0.77 added alerts/consensus/crowded/contrarian). Signal page cross-links t.sector → /sector/[slug]. Dataroma still has zero API; HoldLens JSON surface: scores, signals, managers, sectors, big-bets, rotation, alerts, consensus, crowded, contrarian, best-now, value, quarters. TASKS.md reconciled 11 entries.
**Goal:** Revenue activation. Three [👤] actions pending: Stripe, AdSense, affiliates.

## Session Handoff

**Mode:** sovereign auto
**Objective:** Continuous revenue-adjacent shipping — SOVEREIGN AUTO
**Progress:** 3 tasks SHIPPED + DEPLOYED this session window: (1) v0.84 TickerLogo + FundLogo (Parqet CDN + DuckDuckGo ip3) sitewide + /support page + a11y focus-ring baseline → deploy e2b3c2de; (2) v0.85 InvestorConcentration server component (Top-1/5/10 % + verdict + stacked bar) on 14 manager slugs + warren-buffett dedicated page → deploy 4d460911; (3) TASKS.md bookkeeping — closed stock-alias, investor-viz, vs-dataroma, learn-handbook, quarterly-pages (all were shipped but marked open). Parallel sessions contributed heavily and attribution folded via absorption; all work preserved in origin/main. HEAD=62dba7445 + 4 further heartbeat commits.
**Branch:** `main` · pushed to origin. Local build artifacts in sync after v0.85 final build.
**Next actions:**
  1. Operator 👤: **P0 revenue unlock #1** — Stripe founders-tier activation (/pricing has full trust strip + CTA + €9 founders rate UI; just needs Stripe keys in CF env).
  2. Operator 👤: **P0 revenue unlock #2** — Amazon Associates signup (~24h review), then `NEXT_PUBLIC_AMZN_TAG=holdlens-20` in CF Pages env. Widget LIVE on /learn/superinvestor-handbook.
  3. Operator 👤: AdSense apply + NEXT_PUBLIC_ADSENSE_CLIENT env. Ad slots LIVE on 32 pages.
  4. Operator 👤: IBKR affiliate signup + NEXT_PUBLIC_AFF_IBKR env.
  5. Operator 👤: Google Search Console property + sitemap submit (blocks organic traffic unlock).
  6. Chief: P1 /compare/[pair] visual diff — Venn + convergence chart (id:compare-visual, score 8.0).
  7. Chief: P2 /api/v1/changelog.json feed (id:api-changelog, score 6.0).
  8. Chief: P2 Plausible custom events on /signal/[ticker] searches + /value filters + /big-bets clicks (id:plausible-events, score 7.0).
  9. Chief: P2 CSV exports on best-now/value/rotation/compare/consensus/contrarian (id:csv-exports, score 6.0).
  10. Chief: P2 /premium Stripe paywall UI build — [👤-after-build] (id:stripe-premium, score 15.0 — highest remaining Oracle score).
**Human actions pending:** 5 — stripe-activate, amazon-associates-signup, adsense-activate, affiliate-activate, gsc-setup.
**Open questions:** none — all revenue-activation paths have code shipped; revenue flow = operator env-var + platform signup.
**Momentum:** very high — 5 versions LIVE on prod in single session window (v0.80→v0.85), 3 P1 tasks closed, concentration + logo + a11y improvements compound across all tracked pages (94 signal + 14 investor + 100+ derived).
<!-- handoff: 2026-04-15 18:00 -->

## Ad placement map (v0.31)

| Page type | Count | Ad format | Component |
|---|---|---|---|
| Learn articles | 3 | in-article | AdSlot |
| Browse (activity, faq, about, etc.) | 8 | horizontal/in-article | AdSlot |
| Detail (investor, ticker, sector, quarterly, compare) | 9 | horizontal | AdSlot |
| Ticker detail | 1 | — | + AffiliateCTA |
| Remaining (simulate, proof, grand, docs, press, portfolio) | 6 | horizontal/in-article | AdSlot |
| Already had ads (signal, buys, sells, best-now, this-week, leaderboard) | 6 | various | AdSlot |
| **Total pages with ad slots** | **32** | | |
