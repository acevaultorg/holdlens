# METRICS.md — HoldLens live traffic (Plausible)

**Last updated:** 2026-04-19 via Chrome MCP inspection of logged-in dashboard.
**Source:** https://plausible.io/holdlens.com (operator's account).
**Lookback window:** Last 28 days (Plausible default on dashboard load).

## Current state (2026-04-19, rolling 28d)

```
unique_visitors:    5
total_visits:       10
total_pageviews:    51
views_per_visit:    5.1
bounce_rate:        0%
visit_duration:     4m 27s
current_visitors:   0
```

## Calibration implication

At 5 unique/28d (~1.25/week), HoldLens is **genuinely pre-traffic**. Every
Oracle projection this session — Revenue, Retention, Distribution — must
stay confidence=0.3 (cold) until sessions cross ~100/week (Growing tier
per v19.3 data-driven tiering model). The per-session 5.1 pages/visit and
4m 27s visit duration are promising engagement signals, but 5 uniques is
almost certainly operator-dogfooding + indexing crawlers, not organic
users yet.

## What calibrates when

- `sessions/wk ≥ 20` → v19.3 "Maintenance Mon only" tier kicks in (trigger
  first Monday METRICS rollup)
- `sessions/wk ≥ 100` → v19.3 "Growing" tier (daily AceEvolve cycles)
- `sessions/wk ≥ 500` → v19.3 "Champion" tier (4x/day cycles)
- `D7 return rate` measurable → I-22 Retention Floor starts enforcing
- `organic SEO clicks from GSC` measurable → I-25 Distribution Floor starts
  enforcing

All three are blocked on the same gate: **real organic visitors arriving**.
Polish alone doesn't solve this — distribution work does.

## Real next-lever (honest)

Given this metrics read, the highest-leverage next action is **NOT more
code**, it's one of:

1. **Wikipedia seeding** (distribution archetype ×+75, operator-time 1-2h
   per page, playbook staged at `.claude/state/WIKIPEDIA_PLAYBOOK.md`)
2. **HN Show HN launch** (one-shot ×+70 distribution spike, operator-time
   ~6h including the day-of engagement window)
3. **LinkedIn zero-click framework posts** (operator thought-leadership,
   ×+65 sustained)
4. **Reddit organic participation** (r/SecurityAnalysis, r/ValueInvesting —
   ×+70 with 1-3h/week ongoing)

Every one of those requires operator hands. Polish is NOT the bottleneck
right now.

## Historical rollups

<!-- Append-only weekly rollup rows. First row = today's inspection. -->

| date       | uniques_28d | visits_28d | pageviews_28d | views/visit | bounce_rate | duration |
|------------|-------------|------------|---------------|-------------|-------------|----------|
| 2026-04-19 | 5           | 10         | 51            | 5.1         | 0%          | 4m 27s   |
