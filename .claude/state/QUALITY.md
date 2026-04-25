# QUALITY.md — @craftsman Love Score log (v17.2)

State file for the `@craftsman` specialist per AcePilot invariant I-23.
Every public-facing ship in Pro modes gets a Love Score across 5 dimensions
(Useful · Delightful · Reliable · Clear · Unique). Mean ≥ 0.5 required
unless operator tags `[experimental]` or `[thin-content-acceptable]`.

Append-only. Corrections go in `## Corrections` at the bottom.

## Love Log

```
ts                 | target                              | U   D   R   C   Un  | mean | verdict | fix
2026-04-17 15:35   | /learn/13f-vs-13d-vs-13g v1.33      | .82 .68 .85 .88 .78 | 0.80 | PASS    | add filing-speed timeline infographic (+0.10 Delightful, deferred)
2026-04-17 09:15   | MobileNav.tsx v1.09 color system    | .80 .70 .90 .90 .60 | 0.78 | PASS    | optional 2px left-edge accent per group (deferred)
2026-04-16 19:55   | welcome email (subscribe.ts)        | .75 .50 .55 .75 .55 | 0.62 | PASS    | List-Unsubscribe header
```

Legend: U=Useful, D=Delightful, R=Reliable, C=Clear, Un=Unique. Verdict:
PASS (≥0.5) · SLOP (<0.5) · EXPERIMENTAL-OK (operator-tagged).

## Highest-leverage fix queue (shipped inline as part of the ship)

- **v1.25** — welcome email: List-Unsubscribe header + 1-click unsubscribe
  (mailto + https variants), per Gmail/Yahoo 2024 bulk-sender requirements.
  Projected reliability lift: +0.30 → mean 0.68 post-fix.

## Calibration notes

First-ever Love Score entry. No archetype calibration yet — need ≥5 entries
in the same category (email / landing-page / component / article) before the
per-archetype multiplier adjustments kick in.

## Love Log (v1.34)
2026-04-17 16:50 | homepage-LatestMoves | USEFUL:0.7 DELIGHT:0.5 RELIABLE:0.9 CLEAR:0.8 UNIQUE:0.6 | mean:0.70 | PASS | Fix: empty-ticker phantom rows eliminated from homepage top-8 moves. Before: 6/8 rows were broken (ticker missing, implausible 50-64% weights). After: all 8 rows show real tickers with realistic 22-49% weights. Useful+Reliable lifted materially; Delight flat (no new ornamentation); Unique unchanged (feature existed).

## Love Log (v1.35 + v1.36)
2026-04-17 17:20 | edgar-cusip-coverage | USEFUL:0.85 DELIGHT:0.5 RELIABLE:0.90 CLEAR:0.8 UNIQUE:0.75 | mean:0.76 | PASS | Fix: 175 additional CUSIP mappings rescue 3,340 hidden 13F position rows. Before: users saw ~21% of actual 13F data. After: ~32%. Useful lift substantial (actual 13F-tracker function now works). Unique bump (HoldLens showing current positions where competitors don't).
2026-04-17 17:35 | investor-edgar-preference | USEFUL:0.90 DELIGHT:0.6 RELIABLE:0.95 CLEAR:0.85 UNIQUE:0.85 | mean:0.83 | PASS | Fix: all 27 investor pages now show current 2025-Q4 filings instead of stale 2023 hand-curated data. Burry page: BABA/JD/BIDU → PLTR/NVDA/HAL. This is the core product working correctly for the first time.

## Love Log (v1.45)
2026-04-19 | dividend-tax-calc-architecture | USEFUL:0.70 DELIGHT:0.60 RELIABLE:0.60 CLEAR:0.80 UNIQUE:0.50 | mean:0.64 | PASS | New DividendTaxCalc component + /dividend-tax/ hub + 20 programmatic per-investor-country pages. USEFUL: genuine real-user question ("what will I actually keep"). DELIGHT: clean, tight, instant feedback; could be richer. RELIABLE: defensive architecture with needs_research honest fallback; mobile browser-verify deferred this session (flagged [mobile-skip-documented] to operator per rules/mobile-perfection-default.md since session could not launch Chrome MCP on live preview — architecture review substituted). CLEAR: calculator hero + citation block + disclaimer. UNIQUE: citation-first approach + moat via primary-source discipline (IRS P901 + OECD + KPMG/PwC) is uncommon vs generic "dividend tax calculator" sites.

## Love Log (v1.46)
2026-04-19 | dividend-tax-share-and-guides | USEFUL:0.70 DELIGHT:0.65 RELIABLE:0.60 CLEAR:0.80 UNIQUE:0.55 | mean:0.66 | PASS | Cycle-2 follow-up to v1.45 architecture ship. Share button + resident_guide content. Reliable still capped at 0.6 due to un-verified-in-browser session (same mobile-verify gap from cycle 1). Delight +0.05 from tighter UX (3-button share row, preview text, verified-rate gating so users never share "data pending" results). Useful +0 (core feature unchanged; content is thickening).

## Love Log (v1.47)
2026-04-19 | dividend-tax-data-expansion-and-uk-fix | USEFUL:0.75 DELIGHT:0.65 RELIABLE:0.70 CLEAR:0.80 UNIQUE:0.60 | mean:0.70 | PASS | Cycle-3 data expansion. Reliable +0.10 (BIG: caught + fixed US→UK directional bug from cycle 1; added corrections audit trail; 75 cells of real verified data instead of 10; practical accuracy materially improved). Useful +0.05 (more queries return real data). Unique +0.05 (correction discipline is distinctive). Mobile-verify still un-resolved this session — Reliable capped at 0.7 until operator verifies live.

## Love Log (v1.48 — Chrome MCP mobile verify + 4 bug fixes)
2026-04-19 | dividend-tax-mobile-verify-and-fixes | USEFUL:0.80 DELIGHT:0.70 RELIABLE:0.85 CLEAR:0.85 UNIQUE:0.60 | mean:0.76 | PASS | Cycle-4 follow-up: Chrome MCP mobile-375px verification across /dividend-tax/ hub + /dividend-tax/us/ + /ticker/AAPL inline surfaced 4 bugs, all fixed same-session. Reliable +0.15 (mobile-verify gap from cycles 1-3 closed; architecture matches rendered reality on 375×844 iPhone 12; 4 bugs caught before ship). Useful +0.05 (domestic cases no longer mislead). Delight +0.05 (tighter badge design on treaty matrix). Clear +0.05 (verified/pending signal visually obvious).

## Love Log (v1.49 — Ship #8 v1)
2026-04-19 | similar-to-portfolio-scorer | USEFUL:0.80 DELIGHT:0.60 RELIABLE:0.60 CLEAR:0.80 UNIQUE:0.65 | mean:0.69 | PASS | Ship #8 v1 from roadmap. Useful: real query pattern, no existing HoldLens surface answered "ranked similarity across all tracked investors". Reliable capped at 0.6 (mobile untested in this cycle; follows existing list patterns). Unique: Jaccard on 30-manager curated set is a specific synthesis.

## Love Log (v1.48 hero + signals palette discipline, 2026-04-19 parallel cycle)
2026-04-19 | hero-widow-orphan-fix         | USEFUL:0.60 DELIGHT:0.70 RELIABLE:0.85 CLEAR:0.80 UNIQUE:0.40 | mean:0.67 | PASS  | `text-balance` on h1 + `text-pretty` on subhead + `whitespace-nowrap` bonded `+100 buy` / `−100 sell` pairs. Removed hard `<br />` so balancer picks natural break per viewport. Leading line softened to `text-text/90` so amber gradient punchline earns attention hierarchy. Verified live + Chrome MCP computed-style pass. Unique capped at 0.4 (text-balance is broadly available, not a HoldLens differentiator).
2026-04-19 | signals-magnitude-tier-v1     | USEFUL:0.75 DELIGHT:0.70 RELIABLE:0.30 CLEAR:0.80 UNIQUE:0.70 | mean:0.65 | PASS  | Initial v1.48 magnitude-tier ship on BuySellSignals. Score + verdict chip graded by |score|: ≥40 full, ≥25 /85, <25 /65. Buyer/seller counts split emerald/rose. Reliable 0.30 ← SELF-CAUGHT WCAG FAIL on /65 opacity (3.5:1 vs bg; fails AA 4.5:1 for 16px bold). Flagged craftsman-retry, shipped corrective v1.48.1 same-session.
2026-04-19 | signals-wcag-weak-tier-fix    | USEFUL:0.75 DELIGHT:0.70 RELIABLE:0.90 CLEAR:0.85 UNIQUE:0.70 | mean:0.78 | PASS  | v1.48.1 corrective — weak tier /65 → `text-muted` (neutral dim #9ca3af). Three wins: (1) WCAG 7.36:1 / 7.80:1 contrast verified live via Chrome MCP computed-style; (2) semantic match — score near dead-zone reads as "below meaningful threshold, don't over-read"; (3) 3-tier gradient preserved as strong-color → mid-color → neutral-dim. Reliable +0.60 from corrective action.
2026-04-19 | signals-palette-shared-lib    | USEFUL:0.70 DELIGHT:0.55 RELIABLE:0.90 CLEAR:0.80 UNIQUE:0.55 | mean:0.70 | PASS  | v1.48.2 refactor — magnitude-tier helpers extracted to `lib/signal-colors.ts` so LatestMoves can share palette. Added `scoreColor(signed)` helper for mixed-direction tables. Zero user-visible change; sets up v1.48.3 LatestMoves palette ship.
2026-04-19 | latest-moves-palette-fix      | USEFUL:0.75 DELIGHT:0.70 RELIABLE:0.85 CLEAR:0.85 UNIQUE:0.70 | mean:0.77 | PASS  | v1.48.3 — TRIM badge migrated amber → rose-soft (amber reserved for brand/Pro/CTA per v1.05 discipline). Score column uses shared `scoreColor()` — magnitude-tier matches BuySellSignals. 4-tier bull/bear grammar now consistent: NEW (bright emerald) → ADD (soft emerald) → TRIM (soft rose) → EXIT (bright rose). Verified live via Chrome MCP: TRIM rose-400 confirmed, score weak-tier text-muted confirmed. Unique 0.70 — consistent palette across data surfaces is a genuine quality moat vs generic finance sites.

## Love Log (v1.50 — Ship #9 v1)
2026-04-19 | sectors-hub | USEFUL:0.65 DELIGHT:0.65 RELIABLE:0.75 CLEAR:0.80 UNIQUE:0.45 | mean:0.66 | PASS | Ship #9 v1. Reliable 0.75 (static page, no runtime data, pure links — strongest reliability of any ship this session). Unique 0.45 — GICS sector surface is standard across finance sites; HoldLens-specific moat is the underlying /sector/[slug] data (which existed pre-Ship-#9). Hub adds navigation polish, not new synthesis.

## Love Log (v1.49 — Signal Explorer palette rebalance)
2026-04-19 | signal-explorer-palette-rebalance | USEFUL:0.70 DELIGHT:0.80 RELIABLE:0.90 CLEAR:0.90 UNIQUE:0.75 | mean:0.81 | PASS | Rebalanced 19-card homepage signal-explorer from 10-amber/6-emerald/3-rose to 1-amber/8-emerald/3-rose/7-neutral. Added `neutral` tone to SignalCard. DELIGHT 0.80 — the single amber CTA now punches visibly where before amber was cheap. CLEAR 0.90 — "one primary → bullish group → bearish group → research group" hierarchy is readable at a glance. UNIQUE 0.75 — most finance sites throw brand color everywhere; disciplined palette is a real quality signal. RELIABLE 0.90 — verified live on preview URL (1A/8E/3R/7N exact match); prod alias propagating.

## Love Log (v1.50 — DesktopNav palette discipline)
2026-04-19 | desktop-nav-palette-rebalance | USEFUL:0.70 DELIGHT:0.80 RELIABLE:0.90 CLEAR:0.90 UNIQUE:0.80 | mean:0.82 | PASS | Extended v1.49 discipline site-wide. Every page (not just homepage) now has scarce amber in nav. Brand-amber count dropped 10→2 (/best-now + /portfolio only). UNIQUE 0.80 — palette discipline applied across surfaces is a compound brand asset. DELIGHT 0.80 — hovering a link reveals color that MEANS something. CLEAR 0.90 — 4-tone nav hierarchy is legible across every page. RELIABLE 0.90 — verified live 2 amber / 15 emerald / 4 rose / 23 neutral on preview URL.

## Love Log (v1.51 — Ship #2 v1)
2026-04-19 | insider-conviction-pages | USEFUL:0.75 DELIGHT:0.65 RELIABLE:0.70 CLEAR:0.80 UNIQUE:0.70 | mean:0.72 | PASS | Ship #2 v1 from roadmap. Strongest Unique of this session's ships (0.70) — conviction scoring synthesis with role × 10b5-1 × logistic is original. Useful high: answers "is CEO X buying lately" in one number. Delight modest — table-heavy UI could be more visually distinctive.

## Love Log (v1.68 — /learn/form-4-vs-13f comparison article)
2026-04-25 | learn-form-4-vs-13f | USEFUL:0.75 DELIGHT:0.65 RELIABLE:0.65 CLEAR:0.85 UNIQUE:0.75 | mean:0.73 | PASS | New ~2000-word comparison article filling long-tail gap between sec-signals-trilogy (system view) and 13f-vs-13d-vs-13g (institutional filings). USEFUL 0.75 — target queries have real volume + thin competition; HoldLens uniquely has data for BOTH layers (/insiders/ Form 4 + /investor/ 13F) so the comparison maps to a real data product. DELIGHT 0.65 — quick-reference card + 5-Q FAQ structure are clean but no exceptional micro-delight beyond standard /learn template. RELIABLE 0.65 capped — static export + schema validates + tsc-clean, BUT mobile-not-yet-verified-at-375px (deploy pending; per rules/mobile-perfection-default.md will lift to 0.85 once Chrome MCP verified post-deploy). CLEAR 0.85 — hero opens with concrete "CEO bought $2M yesterday vs hedge fund held it 45 days ago"; quick-ref card immediately under hero; section H2s are quote-ready. UNIQUE 0.75 — most write-ups cover Form 4 OR 13F in isolation; comparison-with-academic-citations (Lakonishok+Lee 2001, Cohen+Malloy+Pomorski 2012) + HoldLens-data-product framing is genuinely differentiated. Highest-leverage fix: mobile-verify post-deploy → RELIABLE 0.65 → 0.85 → mean lift to 0.77. Honest limitation: cross-links to 6 surfaces compound discoverability but don't lift Love Score directly (different metric).
