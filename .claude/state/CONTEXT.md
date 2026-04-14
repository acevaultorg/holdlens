# HoldLens — CONTEXT

## Orient
**Project:** HoldLens — 13F superinvestor tracker, Next.js 15 static export, Cloudflare Pages + Worker proxy.
**State:** v0.31 shipped. AdSense + affiliate ad placements wired across 26 pages. Build verified (484 pages).
**Goal:** Revenue activation. Three [👤] actions pending: Stripe, AdSense, affiliates.

## Session Handoff

**Mode:** god
**Objective:** wire AdSense + affiliate ad placements across all pages
**Progress:** COMPLETE — 26 pages wired, build verified, committed + pushed
**Branch:** `acepilot/v0.25-unified-score` · 14 commits on top of v0.25
**Next actions:**
  1. Operator: apply for AdSense at adsense.google.com, set NEXT_PUBLIC_ADSENSE_CLIENT env var (see HUMAN_ACTIONS.md)
  2. Operator: sign up for IBKR affiliate ($200/funded account), set NEXT_PUBLIC_AFF_IBKR env var
  3. Operator: activate Stripe payment links (existing [👤] task from v0.28)
  4. Chief: deploy latest build to CF Pages
  5. Next dev: EDGAR 13F parser, Resend email integration, AI thesis generator
**Human actions pending:** 3 — adsense-activate, affiliate-activate, stripe-activate
**Open questions:** none
**Momentum:** high
<!-- handoff: 2026-04-14 10:30 -->

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
