# HoldLens — CONTEXT

## Orient
**Project:** HoldLens — 13F superinvestor tracker, Next.js 15 static export, Cloudflare Pages.
**State:** v0.77 shipped — public JSON API now 150 endpoints (v0.76 added /api/v1/sector/{slug}.json ×12; v0.77 added alerts/consensus/crowded/contrarian). Signal page cross-links t.sector → /sector/[slug]. Dataroma still has zero API; HoldLens JSON surface: scores, signals, managers, sectors, big-bets, rotation, alerts, consensus, crowded, contrarian, best-now, value, quarters. TASKS.md reconciled 11 entries.
**Goal:** Revenue activation. Three [👤] actions pending: Stripe, AdSense, affiliates.

## Session Handoff

**Mode:** sovereign
**Objective:** sovereign auto — Cloudflare deploy unblock + revenue-path continuity
**Progress:** DEPLOY UNBLOCKED ✓ v0.80+v0.81+v0.82+v0.83 all LIVE on prod. Wrangler succeeded on retry (2134 files / 70.58s) → a9069bf8.holdlens.pages.dev. Deploy-truth verified: (a) prod holdlens.com hero "Spot smart money moves" ✓, (b) direct pricing 14-day-refund trust strip ✓, (c) /learn/superinvestor-handbook Amazon widget ("Intelligent Investor", "Poor Charlie") ✓. Earlier CF API socket flake cleared. v0.82 InvestingBooks + v0.83 ShareStrip shipped by parallel session; v0.82 (my branch) folded contrast-fix (#6b7280→#858d9c WCAG AA) + FoundersNudge wire-ins into parallel commit. BackToTop component wired in layout.tsx. /learn/superinvestor-handbook now has ShareStrip viral-loop + Amazon affiliate funnel.
**Branch:** `main` · HEAD=f6d8e9b1e (pushed to origin). Clean tree except stale local out/ vs HEAD build hashes (cosmetic, next build normalizes).
**Next actions:**
  1. Operator 👤: sign up for Amazon Associates (24h review), then `NEXT_PUBLIC_AMZN_TAG=holdlens-20` in CF Pages env, redeploy — activates the book widget revenue stream (#3 after AdSense + Ko-fi).
  2. Operator: Stripe activation (paywall on /premium) — highest $ unlock, still P0 [👤].
  3. Operator: AdSense apply + NEXT_PUBLIC_ADSENSE_CLIENT env.
  4. Operator: IBKR affiliate signup + NEXT_PUBLIC_AFF_IBKR env.
  5. Chief: P1 /compare/[pair] visual diff (Venn + convergence chart, id:compare-visual, score 8.0)
  6. Chief: P1 /stock/[ticker] redirect alias (id:stock-alias, score 8.0)
  7. Chief: P1 /investor/[slug] concentration pie + YoY holdings trend (id:investor-viz, score 9.0)
  8. Chief: P2 /api/v1/changelog.json (id:api-changelog, score 6.0)
**Human actions pending:** 4 — amazon-associates-signup (NEW), adsense-activate, affiliate-activate, stripe-activate. Deploy-v80-v81 CLEARED.
**Open questions:** none
**Momentum:** high — deploy blocker cleared in one cycle; 4 versions (v0.80→v0.83) now LIVE; Amazon affiliate revenue path armed pending operator signup.
<!-- handoff: 2026-04-15 14:45 -->

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
