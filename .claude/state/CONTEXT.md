# HoldLens — CONTEXT

## Orient
**Project:** HoldLens — 13F superinvestor tracker, Next.js 15 static export, Cloudflare Pages.
**State:** v0.77 shipped — public JSON API now 150 endpoints (v0.76 added /api/v1/sector/{slug}.json ×12; v0.77 added alerts/consensus/crowded/contrarian). Signal page cross-links t.sector → /sector/[slug]. Dataroma still has zero API; HoldLens JSON surface: scores, signals, managers, sectors, big-bets, rotation, alerts, consensus, crowded, contrarian, best-now, value, quarters. TASKS.md reconciled 11 entries.
**Goal:** Revenue activation. Three [👤] actions pending: Stripe, AdSense, affiliates.

## Session Handoff

**Mode:** god --loop
**Objective:** v0.77 public API completion — alerts/consensus/crowded/contrarian
**Progress:** COMPLETE — 4 JSON endpoints live, /docs updated with 4 example payloads, 2 stale tasks reconciled, committed 2f18df098, deployed bd71a312, verified prod + direct after 30s CDN catchup
**Branch:** `main` · 3 commits on top of v0.75 (v0.76 + state + v0.77)
**Next actions:**
  1. Chief: P1 /compare/[pair] visual diff — overlap Venn diagram + shared-name convergence chart for pair comparisons
  2. Chief: P1 /stock/[ticker] redirect alias — SEO + human-memorable URL (maps to /signal/[ticker])
  3. Chief: P2 /api/v1/changelog.json — "what changed this quarter" feed (sibling to alerts.json but grouped by quarter)
  4. Chief: P2 /learn/superinvestor-handbook — 3000+ word SEO content piece
  5. Operator: apply for AdSense, set NEXT_PUBLIC_ADSENSE_CLIENT (HUMAN_ACTIONS.md)
  6. Operator: IBKR affiliate, set NEXT_PUBLIC_AFF_IBKR
  7. Operator: activate Stripe payment links
**Human actions pending:** 3 — adsense-activate, affiliate-activate, stripe-activate
**Open questions:** none
**Momentum:** high — 2 cycles this session, 16 JSON endpoints added across v0.76+v0.77
<!-- handoff: 2026-04-15 12:59 -->

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
