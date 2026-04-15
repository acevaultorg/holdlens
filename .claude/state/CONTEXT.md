# HoldLens — CONTEXT

## Orient
**Project:** HoldLens — 13F superinvestor tracker, Next.js 15 static export, Cloudflare Pages.
**State:** v0.76 shipped — public JSON API now 146 endpoints (added /api/v1/sector/{slug}.json, 12 drilldown files). Signal page cross-links t.sector → /sector/[slug]. TASKS.md reconciled: 7 stale P0s + /alerts + api-sector marked done after deploy-truth check.
**Goal:** Revenue activation. Three [👤] actions pending: Stripe, AdSense, affiliates.

## Session Handoff

**Mode:** god --loop
**Objective:** v0.76 public API completeness + task-queue reality check
**Progress:** COMPLETE — 12 sector JSON endpoints live, signal sector crosslink live, /docs updated with example, 8 stale tasks reconciled, committed 57e699ce0, deployed ecc81625, verified prod + direct
**Branch:** `main` · 1 commit on top of v0.75
**Next actions:**
  1. Chief: next P1 — /stock/[ticker] redirect alias (app/stock/[symbol]/page.tsx) for SEO — human-memorable URL
  2. Chief: next P1 — /api/v1/alerts.json + /api/v1/consensus.json + /api/v1/crowded.json + /api/v1/contrarian.json (round out public API)
  3. Chief: next P1 — /compare/[pair] visual diff (overlap Venn + shared-name convergence chart)
  4. Operator: apply for AdSense, set NEXT_PUBLIC_ADSENSE_CLIENT (HUMAN_ACTIONS.md)
  5. Operator: IBKR affiliate, set NEXT_PUBLIC_AFF_IBKR
  6. Operator: activate Stripe payment links
**Human actions pending:** 3 — adsense-activate, affiliate-activate, stripe-activate
**Open questions:** none
**Momentum:** high
<!-- handoff: 2026-04-15 12:43 -->

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
