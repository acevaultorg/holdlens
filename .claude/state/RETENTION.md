# RETENTION.md — Retention Oracle v1 (HoldLens)

Retention model: **Ad-supported + founders-tier subscription, SEO-funnel
acquisition**. Primary retention window: **7-day return** (returning_session_d7
from Plausible/GA4). Secondary: 30-day return.

Baseline: **unknown** (pre-traffic). First calibration rows land once
Plausible returning-visitor % can be pulled (target: Monday METRICS.md
rollups once traffic ≥200 visitors/week).

## Archetype multipliers (v17.2 cold seeds, calibrated to ad+sub funnel)

```
onboarding_polish         × +0.040   cold   (first-session activation lift)
core_loop_improvement     × +0.060   cold   (the reason they come back — signal dossiers)
empty_state_design        × +0.030   cold   (first-run delight — rare on HoldLens, no login)
notification_quality      × +0.025   cold   (email digest quality, once live)
bug_fix_blocking_core     × +0.050   cold   (broken /signal or /investor = hard churn)
performance_tighten       × +0.020   cold   (cold-start latency → retention)
delight_detail            × +0.015   cold   (micro-copy, loading shimmers, hover states)
craftsmanship_polish      × +0.010   cold
new_feature_usefulness    × +0.035   cold   (if it extends core dossier loop)
copy_clarity              × +0.012   cold
pricing_page_change       × -0.005   cold   (can hurt if aggressive)
signup_flow_change        × +0.005   cold
new_landing_page          × +0.000   cold   (acquisition, not retention directly)
SEO_page_addition         × -0.002   cold   (thin content can hurt brand; HoldLens /learn is thick)
analytics_wiring          × +0.000   cold
cleanup_refactor          × +0.000   always
dark_pattern_anything     × -1.000   IMMUTABLE (I-23, hard reject)
```

## Calibration

<!-- Append-only. Format: timestamp | task_id | archetype | projected_delta_pct | actual_7d_delta | actual_30d_delta | note -->

```
2026-04-17 seed | system | 0 | n/a | n/a | Oracle stubbed. Baseline retention unknown (pre-traffic). All multipliers at v17.2 cold seeds. First actuals once Plausible returning-visitor % can be pulled weekly.
```

## Current session projections (not yet calibrated)

```
2026-04-17 | v1.09 MobileNav semantic color system        | craftsmanship_polish     | +0.006 Δ 7d-return | TBD | TBD | mobile menu color discipline; user_reach ~0.6 mobile traffic × 0.010 base × confidence 0.3
2026-04-17 | v1.10 Plausible pageview race fix            | bug_fix_blocking_core    | +0.015 Δ 7d-return | TBD | TBD | unblocks retention MEASUREMENT (data compound), not retention itself; reach ~1.0
2026-04-17 | v1.12 Mobile WCAG AA tap targets             | bug_fix_blocking_core    | +0.010 Δ 7d-return | TBD | TBD | reduced rage-taps on dismiss buttons; reach ~0.6 mobile
2026-04-17 | v1.32 /learn/survivorship-bias              | SEO_page_addition        | -0.001 Δ 7d-return | TBD | TBD | thick editorial content — expect near-zero retention hit; marginally negative because SEO landing pages don't typically bring retention signal
2026-04-17 | v1.33 /learn/13f-vs-13d-vs-13g              | SEO_page_addition        | -0.001 Δ 7d-return | TBD | TBD | comparison article; cross-links 5 existing /learn articles + /investor CTA = strong loop-closure which partially offsets baseline SEO-page retention penalty
```

## Top blocker (honest)

**Retention cannot be measured until returning-visitor data starts
compounding.** All projections above are Oracle heuristic estimates with
cold confidence (0.3). First calibration row lands after:

1. Plausible has ≥7 days of returning-visitor data, AND
2. Monday METRICS.md rollup captures `returning %` weekly

Until then, retention rows log as projections only. Do not let low
confidence delay shipping — I-22 only enforces the floor *post-ship*
via the retention cliff detector (>10% drop in baseline → rollback
candidate). Pre-traffic, there's no baseline to drop from.

## Corrections

<!-- Append-only. Format: corrects: <timestamp> | reason | new_value -->
