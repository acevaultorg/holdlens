# HoldLens — CONTEXT

## Session Handoff
<!-- handoff: 2026-04-10 (v0.16) -->

**Mode:** god
**Objective:** v0.16 — Growth surface (share buttons, rich OG) + data depth (30 managers) + screener + compare-managers
**Status:** COMPLETE — 9/9 tasks DONE, 0 blocked, 1 pending human action (deploy).

**What shipped (v0.16):**
- `lib/managers.ts` — expanded **22 → 30 managers**. New Tier-1/Tier-2: David Tepper
  (Appaloosa), Chase Coleman (Tiger Global), John Armitage (Egerton), David Rolfe
  (Wedgewood), François Rochon (Giverny), Dev Kantesaria (Valley Forge), William
  von Mueffling (Cantillon), Tom Slater (Baillie Gifford LTGG).
- `lib/moves.ts` — Q3 + Q4 2025 moves for all 8 new managers.
- `lib/signals.ts` — MANAGER_QUALITY scores for new managers (most 8-9).
- `components/SocialShare.tsx` — Twitter/LinkedIn/Reddit/Facebook/copy-link, real
  SVG brand icons (no text-as-icons), preformatted tweet text per signal.
- `/signal/[ticker]` — rich OG metadata (verdict-aware meta description, canonical
  URL, twitter:summary_large_image card), SocialShare section at the bottom.
- **`/compare/managers/[pair]` page (NEW ROUTE)** — 105 top-tier manager pairs,
  side-by-side manager cards + live portfolio values + shared-holdings table +
  Q4 moves columns for each.
- **`/screener` page (NEW ROUTE)** — interactive client-side filter: sector
  dropdown, min-owners slider, min-score slider, day-change direction toggle,
  sort by score / owners / day change / ticker. Filters live quotes and renders
  top 100 matches.
- Layout nav — added Screener to header (sm+) and footer.

**Build state:** clean, 0 errors. Total static pages ~460+ (up from 335 in v0.15).
New routes: 105 `/compare/managers/[pair]`, 1 `/screener`, +8 `/investor/[slug]`,
+12 `/ticker/[symbol]`, +12 `/signal/[ticker]`.

**Git state:** branch `acepilot/live-data-v0.13`. v0.16 commit pending in this
step. v0.13/v0.14/v0.15/v0.16 all on branch, NOT pushed.

**Next Actions (for next session or continue):**
1. 👤 Deploy the v0.13+v0.14+v0.15+v0.16 bundle — same guide as before
2. v0.17: OG image generation (satori/@vercel/og), earnings calendar, insider tx,
   RSS feeds, trend badges on top-picks
3. v0.2: Python EDGAR parser (path to 80+ managers)

**Human actions pending:**
- [👤] DEPLOY combined v0.13+v0.14+v0.15+v0.16 — all in one push

**Open questions:** none — direction is clear.

**Momentum:** Extremely strong. HoldLens now has:
- 30 Tier-1/Tier-2 managers tracked (up from 14 at start of chain)
- 4 quarters of move history with trend streaks
- Full /signal/[ticker] dossier with verdict + share cards
- Interactive screener
- Compare-managers feature (Dataroma doesn't have this)
- One-click CSV export on signal pages
- Sector heatmap
- Live news per ticker

This is ~5 v-points of shipped feature work in one session chain
(v0.13 → v0.14 → v0.15 → v0.16). Time for the operator to deploy.

Stash `acepilot-pre-god-v0.13` still available for rollback if something
catastrophic surfaces in production.
