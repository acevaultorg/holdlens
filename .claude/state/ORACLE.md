# ORACLE.md — Revenue Oracle v1 (HoldLens)

Revenue model: **Ad-supported + founders-tier subscription (€9/mo)**.
Primary KPI: **founders_paid_conversions_per_week**.
Baseline: **0** paying subscribers (pre-launch, path to first €100 = ~12 subs).

## Archetype multipliers (calibrated to product tier)

```
pricing_page_change       × 1.00   cold
signup_flow_change        × 0.80   cold
new_landing_page          × 0.60   cold
conversion_copy_fix       × 0.30   cold
SEO_page_addition         × 0.15   cold
affiliate_placement       × 0.25   cold   (HoldLens-specific — IBKR $200/funded)
API_endpoint_addition     × 0.08   cold   (developer-audience, indirect)
analytics_wiring          × 0.10   cold
bug_fix_blocking_revenue  × 0.50   cold
infrastructure            × 0.05   cold
cleanup_refactor          × 0.00   always
specialist_review         × 0.00   always
competitive_research_ship × 0.40   cold   (strategic lift when finding new angle)
```

## Calibration

<!-- Append-only. Format: timestamp | task_id | archetype | projected_weekly_$ | actual_7d | actual_30d | note -->

```
2026-04-15 16:00 | seed | system | 0 | n/a | n/a | Oracle stubbed. No prior ship-impact data. All multipliers at cold values.
```

## Current session projections (not yet calibrated)

```
2026-04-15 | v0.78 competitor research + BRK.B fix  | competitive_research_ship | est €20/wk | TBD | TBD
2026-04-15 | v0.78 Pro ad-free + GA4/Clarity stack  | analytics_wiring          | est €2/wk  | TBD | TBD
2026-04-15 | v0.79 FoundersNudge + launch-kit       | conversion_copy_fix       | est €15/wk | TBD | TBD
2026-04-15 | v0.80 UX retention pass (nav+footer)   | conversion_copy_fix       | est €8/wk  | TBD | TBD
2026-04-15 | v0.81 hero rewrite + FoundersNudge fan | conversion_copy_fix       | est €12/wk | TBD | TBD
```

## Top blocker (honest)

**Distribution is the gate, not code.** All in-session projections are "assuming the user-facing Reddit / HN / Twitter launch ships." The Oracle cannot project real `actual_7d` values until **traffic** arrives. First calibration row will land after the first operator-posted campaign that actually delivers ≥200 visitors to the site.
