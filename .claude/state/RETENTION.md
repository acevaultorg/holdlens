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

## Calibration (v1.34 — data-integrity fix on homepage)
2026-04-17 16:50 | v1.34-moves-phantom-fix | bug_fix_blocking_core | +0.015 | TBD | TBD | Hypothesis: returning visitor who saw broken Bill Nygren rows last visit now sees real data. Trust-repair on entry page = +1.5% projected 7d return rate. Confidence 0.3.

## Calibration (v1.35 + v1.36)
2026-04-17 17:20 | v1.35-cusip-expansion | bug_fix_blocking_core | +0.030 | TBD | TBD | +3,340 previously-hidden position rows visible across homepage, biggest-buys/sells, big-bets, investor pages. Hypothesis: users who doubted data integrity (saw "?" tickers) now see real tickers → +3% 7d return. Confidence 0.3.
2026-04-17 17:35 | v1.36-investor-edgar-preference | bug_fix_blocking_core | +0.045 | TBD | TBD | Investor pages no longer show 1-2yr-stale portfolios. Returning visitor who last saw 2023 data now sees current quarter. Hypothesis: accurate portfolios are the core product value proposition — trust restored. Confidence 0.4.

## Calibration (v1.45 — Dividend Tax Calc, architecture + seed ship)
2026-04-19 | v1.45-dividend-tax-architecture | core_loop_improvement | +0.045 | TBD | TBD | Primary thesis of this ship is retention. Hypothesis: HoldLens users who reach /ticker/[X] or /investor/[slug] today are mostly driven by a 13F-filing-drop news moment (quarterly cycle, ~45-day cadence). The dividend tax widget extends their reasons to return outside those moments: tax-season planning (Jan-Apr), dividend-payment checkpoints (quarterly earnings windows), and rebalancing research (rolling). Projected +4.5% Δ 7d return rate when the widget reaches full data coverage (400 verified cells). v1 (10 US-outbound cells verified) is expected to deliver +0.01 to +0.02 actual Δ until operator completes data population per handoff. Confidence 0.3 (cold archetype; no retention baseline yet for this project).

## Calibration (v1.46)
2026-04-19 | v1.46-tax-share-button-and-guides | delight_detail + core_loop_improvement | +0.008 | TBD | TBD | Hypothesis: enriched resident guides on top-5 country pages give returning visitors a reason to re-open (tax-season reference use-case) beyond the one-shot calculator. Share button adds an "explicit moment" users can act on without leaving — small delight. Confidence 0.25 cold.

## Calibration (v1.47 — data +65 cells, US→UK correction)
2026-04-19 | v1.47-data-expansion-and-uk-fix | bug_fix_blocking_core + core_loop_improvement | +0.018 | TBD | TBD | Hypothesis: 7.5x more verified cells = 7.5x more widget interactions produce real (not "data pending") results = genuinely useful tool. Especially UK/SG-payer coverage which matters because many HoldLens-tracked tickers are held via UK ADRs or Singapore-listed. US→UK correction also materially affects every US investor who queried that cell in cycle 1-2 and may have been misled. Confidence 0.3.

## Calibration (v1.48 — 4 mobile-verified bug fixes)
2026-04-19 | v1.48-mobile-verify-bug-fixes | bug_fix_blocking_core | +0.012 | TBD | TBD | Chrome MCP 375px verification surfaced 4 bugs. Fixes: domestic cells (investor=payer) no longer mislabel "0% Treaty rate" (now "Domestic"), hide misleading "Statutory non-treaty rate" paragraph, hide share button (prevented misleading "I'd keep $100/$100" viral moment), and treaty matrix mobile layout collapsed 4→3 cols with inline verified/pending badge. Hypothesis: cleaner domestic UX + no misleading share copy = marginally higher trust + small retention lift. Confidence 0.35.

## Calibration (v1.49 — Ship #8 v1)
2026-04-19 | v1.49-portfolio-similarity-scorer | new_feature_usefulness | +0.025 | TBD | TBD | Ship #8 v1. Hypothesis: every /investor/[X] page now has a compelling "see 29 peers ranked" exit path that keeps users inside HoldLens instead of bouncing to Dataroma/competitors. Core retention lever: exploration loop. Confidence 0.3.
