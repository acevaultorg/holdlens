# HoldLens — CONTEXT

## Session Handoff
<!-- handoff: 2026-04-10 (v0.17) -->

**Mode:** god
**Objective:** v0.17 — Earnings calendar, trend badges, SEO aliases, RSS feeds, retention surface (/this-week)
**Status:** COMPLETE — 13/13 tasks DONE, 0 blocked, 1 pending human action (deploy).

**What shipped (v0.17):**
- `lib/earnings.ts` — Yahoo Finance quoteSummary API client (calendarEvents.earnings, defaultKeyStatistics, earnings.earningsChart). corsproxy.io fallback. 1-hour sessionStorage cache.
- `components/TickerEarnings.tsx` — next earnings date + EPS estimate/actual + beat/miss color coding. Brand-highlighted card when earnings are within 14 days.
- Wired into `/ticker/[symbol]` and `/signal/[ticker]`.
- `components/TrendBadge.tsx` — server component (no client JS) showing the strongest multi-quarter streak per ticker. "3Q BUY" / "2Q SELL" badges with title tooltips.
- Wired TrendBadge into `/top-picks`, `/grand`, `/buys`, `/sells`, `/this-week`.
- **`/what-to-buy` (NEW)** — SEO-targeted alias for `/buys`, top 10 ranked, canonical → `/buys`.
- **`/what-to-sell` (NEW)** — same pattern for sells.
- **`/buys.xml` + `/sells.xml` (NEW)** — RSS 2.0 feeds via Next.js Route Handlers with `dynamic = 'force-static'`. 20 items each with quality-weighted buyer/seller lists in description. Atom self-link.
- **`/compare/managers` index page (NEW)** — 105 head-to-head pairs grouped by first manager.
- **`/this-week` page (NEW)** — retention surface. Top 5 buys + top 5 sells side-by-side, current quarter info, quick links to /activity /screener /grand. Built for repeat visitors.
- Layout nav: added `This week`, `Screener`, `Compare` to header + footer.

**Build state:** clean. **479 static pages** (up from ~460 in v0.16). RSS files (`out/buys.xml`, `out/sells.xml`) verified — META top buy at 100/100 with 9 tracked managers buying. 0 errors.

**Git state:** branch `acepilot/live-data-v0.13`. v0.17 commit pending. v0.13–v0.17 all on branch, NOT pushed.

**Next Actions:**
1. 👤 Deploy v0.13+v0.14+v0.15+v0.16+v0.17 — same guide as before
2. v0.18: pre-generated OG images, insider transactions, /alerts page, screener save filter, /pricing preview
3. v0.2: Python EDGAR parser (the path to 80+ managers + automated moves)

**Human actions pending:**
- [👤] DEPLOY combined v0.13+v0.14+v0.15+v0.16+v0.17

**Open questions:** none.

**Momentum:** HoldLens is now feature-complete for the "smart 13F tracker" category. Five sessions of compounded work in this chain (v0.13→v0.17): live data → scoring model → signal dossier → 30 managers + screener + compare → earnings + trend + RSS + retention. The biggest blocker to user visibility is the deploy.

Stash `acepilot-pre-god-v0.13` still available for rollback.
