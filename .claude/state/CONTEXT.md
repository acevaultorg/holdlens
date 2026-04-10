# HoldLens — CONTEXT

## Session Handoff
<!-- handoff: 2026-04-10 (v0.18) -->

**Mode:** god
**Objective:** v0.18 — Monetization prep + insider activity + screener save filter
**Status:** COMPLETE — 9/9 tasks DONE, 0 blocked, 1 pending human action (deploy).

**What shipped (v0.18):**
- **`/pricing` (NEW)** — 2-tier pricing page (Free $0 forever + Pro $14/mo launching Q2 2026). Early-access waitlist email capture with founders-pricing pitch. 6-question pricing FAQ.
- **`/alerts` (NEW)** — Buy/sell signal email signup. Shows next filing deadline + last filing date. 3 feature cards (Real-time fires, Top signals, Multi-quarter trends). Pro upsell at the bottom.
- `lib/insiders.ts` — Curated SEC Form 4 data for 21 high-interest tickers. CEO/CFO/Director buys + sells with shares, $ value, date, editorial notes. Helpers: `getInsiderTx`, `getRecentInsiderBuys`, `fmtInsiderValue`, `fmtInsiderDate`.
- `components/InsiderActivity.tsx` — Server component. Net Signal badge (INSIDER BUYING / INSIDER SELLING / MIXED), color-coded rows, value formatting.
- Wired into `/ticker/[symbol]` and `/signal/[ticker]` between earnings and news.
- `app/screener/ScreenerClient.tsx` — Save Filter feature: localStorage `holdlens_screener_filter_v1` with sector + minOwners + minScore + direction + sortKey. Save / Loaded / Clear states. Auto-loads on mount.
- CSV export added to `/screener` (filtered results with live day-change %) and `/this-week` (top 10 buys + top 10 sells combined).
- Layout nav: header now has `Alerts` + `Pro` (brand-colored), footer has all the new links.

**Build state:** clean. **481 static pages** (up from 479 in v0.17). 0 errors. New routes: `/pricing` (904 B), `/alerts` (904 B). `/screener` grew to 122 kB first-load (added CsvExportButton + save filter state).

**Git state:** branch `acepilot/live-data-v0.13`. v0.18 commit pending. v0.13–v0.18 all on branch, NOT pushed.

**Next Actions:**
1. 👤 Deploy v0.13+v0.14+v0.15+v0.16+v0.17+v0.18 — same guide as before (now 6 versions on branch)
2. v0.19: OG images, /pricing AB test, /docs API preview, /changelog, /insiders aggregate page
3. v0.2: Resend integration (unlocks /alerts), Stripe checkout (unlocks /pricing)

**Human actions pending:**
- [👤] DEPLOY combined v0.13+v0.14+v0.15+v0.16+v0.17+v0.18

**Open questions:** none.

**Momentum:** 6-version chain on the branch. HoldLens now has the full pre-launch product surface: free tier (everything works), Pro tier preview with pricing FAQ, /alerts email capture, signal dossiers with insider activity. The /pricing and /alerts pages capture intent BEFORE Stripe + Resend ship in v0.2 — that's the standard playbook. Deploy is the only thing keeping all this from being live.

Stash `acepilot-pre-god-v0.13` still available for rollback (though increasingly unnecessary as the branch becomes a permanent fixture).
