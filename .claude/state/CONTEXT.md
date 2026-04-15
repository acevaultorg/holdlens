# HoldLens — CONTEXT

## Orient
**Project:** HoldLens — 13F superinvestor tracker, Next.js 15 static export, Cloudflare Pages.
**State:** v0.77 shipped — public JSON API now 150 endpoints (v0.76 added /api/v1/sector/{slug}.json ×12; v0.77 added alerts/consensus/crowded/contrarian). Signal page cross-links t.sector → /sector/[slug]. Dataroma still has zero API; HoldLens JSON surface: scores, signals, managers, sectors, big-bets, rotation, alerts, consensus, crowded, contrarian, best-now, value, quarters. TASKS.md reconciled 11 entries.
**Goal:** Revenue activation. Three [👤] actions pending: Stripe, AdSense, affiliates.

## Session Handoff

**Mode:** god --loop
**Objective:** UX retention pass — operator directive "don't make bad UX choices; top priority growth + returning users + satisfaction"
**Progress:** SHIPPED TO GIT, DEPLOY PENDING — v0.80 (footer 51→25 grouped in 5 columns, desktop nav a11y, mobile nav 49→33 grouped) + v0.81 parallel session (sticky header, skip-to-main-content link, outcome-first hero "Spot smart money moves before the market does", pricing competitor anchor, FoundersNudge rose-tone + fan-out). Build clean, 484 static routes, pushed to origin/main. Cloudflare deploy BLOCKED by CF API socket instability — 4× wrangler retries all failed with UND_ERR_SOCKET at 159-1671/2293 files. Operator must retry wrangler when CF recovers.
**Branch:** `main` · 5 commits on top of v0.79 (1bc34adb4, 2bcacaeae, f3763d263, 58d458fc1, 818092a06)
**Next actions:**
  1. Operator 👤: retry wrangler deploy (see TASKS.md id:deploy-v80-v81). First action on next operator session.
  2. After deploy: Chrome MCP deploy-truth verify — `curl -sL https://holdlens.com | grep -c "Spot smart money moves"` returns 1
  3. After deploy: log v0.80+v0.81 Ship Impact row to GROWTH_ANALYTICS.md (hypothesis: footer simplification + outcome-voice hero + sticky nav → lower bounce rate + higher returning-user rate)
  4. Chief: P1 /compare/[pair] visual diff (still open)
  5. Chief: P1 /stock/[ticker] redirect alias (still open)
  6. Operator: AdSense + IBKR affiliate + Stripe activation (HUMAN_ACTIONS.md, unchanged from prior session)
**Human actions pending:** 4 — deploy-v80-v81 (NEW, P0), adsense-activate, affiliate-activate, stripe-activate
**Open questions:** none
**Momentum:** high — UX retention pass shipped to git in one cycle; operator's directive fully addressed on source; deploy is the only remaining step
<!-- handoff: 2026-04-15 14:19 -->

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
