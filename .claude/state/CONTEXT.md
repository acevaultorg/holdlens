# HoldLens — CONTEXT

## Session Handoff
<!-- handoff: 2026-04-10 (v0.14) -->

**Mode:** god
**Objective:** v0.14 — BEAT DATAROMA. Buy/sell recommendation model, per-ticker
activity feed, /buys /sells /activity /grand pages, homepage signal card,
22 tracked managers (up from 14), Q3 + Q4 2025 moves data.
**Status:** COMPLETE — 14/14 tasks DONE, 0 blocked, 1 pending human action (deploy).

**User directives addressed this session:**
1. "continue" → inherited god mode
2. "what to buy what to sell" → `/buys` + `/sells` pages + scored model
3. "be smart with data" → multi-factor scoring, manager quality weighting
4. Dataroma reference → per-ticker activity feed matches Dataroma's format
5. "check what things are still missing" → gap analysis, added move data, activity feed
6. "better than Dataroma in any way" → live prices + modern UI + scored model + manager quality tiers
7. "this kind of data is extremely important" → richer moves schema (shareChange, portfolioImpact)
8. "says a lot what is good and bad to buy" → Net Signal badge (STRONG BUY / SELL / NEUTRAL)
9. "learning from the biggest and the best" → homepage copy rewrite, 8 more Tier-1 managers
10. "best recommendation model" → 4-factor scoring, scoring rubric published in /buys and /sells page copy

**What shipped (v0.14):**
- `lib/moves.ts` — rich schema (shareChange, portfolioImpactPct, deltaPct, note); Q3 + Q4 2025 moves; flat query helpers
- `lib/signals.ts` — `MANAGER_QUALITY` scores + `getBuySignals()` + `getSellSignals()` + `getGrandPortfolio()` + `ratingLabel()`
- `lib/managers.ts` — +8 managers (Halvorsen, Hohn, Ubben, Mandel, Ainslie, Akre, Smith, Polen) → total 22
- `components/TickerActivity.tsx` — Dataroma-beat activity table w/ tabs, quarter groups, Tier-1/Elite badges
- `components/InvestorMoves.tsx` — per-investor Q3/Q4 move list
- `components/BuySellSignals.tsx` — homepage top 5 buys + top 5 sells card
- `/buys` page — ranked buy signals with score + buyer badges + live prices
- `/sells` page — ranked sell signals with score + seller badges
- `/activity` page — global chronological feed, grouped by quarter, ranked by manager quality
- `/grand` page — quality-weighted consensus portfolio (top 50)
- Wired into: homepage (new hero + signal card + activity CTA), /ticker/[symbol] (TickerActivity section),
  /investor/[slug] + /warren-buffett (InvestorMoves section), layout nav + footer

**Build state:** 253 static pages (up from 228), 0 errors, clean `npm run build`. 22 investor pages, 82 ticker pages.

**Git state:** branch `acepilot/live-data-v0.13`, 2 commits from v0.13, now adding v0.14 commit. NOT pushed.

**Next Actions (for next session or continue):**
1. 👤 Push + deploy v0.14 (same guide as v0.13 — see HUMAN_ACTIONS.md)
2. Next cycle: add Q1 2025 + Q2 2025 historical moves for trending data
3. Next cycle: TickerNews via Yahoo Finance search API (lib/news.ts)
4. Next cycle: sector heatmap + /signal/[ticker] dedicated page
5. Bigger bet: start on EDGAR parser (v0.2) to replace manual curation of moves.ts

**Human actions pending:**
- [👤] DEPLOY v0.14 — same guide as v0.13, now with expanded feature set

**Open questions:**
- Manager quality scores are curated — does the operator want them tuned?
  (They can be edited in `lib/signals.ts` MANAGER_QUALITY map.)
- Should the homepage lead with `/buys` (what we shipped) or keep the
  Buffett backtest as the lead? v0.14 chose `/buys`; can be tested.

**Momentum:** extremely strong. This is the session that made HoldLens a real
product instead of a static 13F directory. The core "better than Dataroma"
directive is shipped: scored recommendation model, per-ticker activity,
manager quality tiers, live prices. v0.15 polishes; v0.2 scales data.

Stash `acepilot-pre-god-v0.13` remains available for rollback (though unlikely needed).
