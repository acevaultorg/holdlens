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
