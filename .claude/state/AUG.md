# AUG.md — AUG v3 Score weekly log (HoldLens)

AUG (AceUserGrowth) v3 Score — 7-factor composite fleet-site health metric.
Formula (geometric mean × 10, zero in any stage near-zeros the whole):

```
AUG_v3 = 10 × ( acq × act × eng × ret × adv × mon × perf ) ^ (1/7)
```

Where each factor is 0.0-1.0. Full rubric + per-stage scoring guide:
`rules/aceusergrowth.md` v3 Part 25.

**Invariant:** I-35. If AUG_v3 <5 for **two consecutive weekly measurements**
→ 90-day kill-criteria candidate. Auto-queues `[rollback-candidate]` to
TASKS.md with Oracle tag `aug_floor`. Dispatches @reviewer + @craftsman +
@distributor + @strategist for diagnostic pass.

**Append-only.** Corrections go through `## Corrections` section at bottom
with `corrects: <timestamp>` field (same pattern as ORACLE/RETENTION/
DISTRIBUTION).

---

## Project context

- **Product:** HoldLens (holdlens.com) — quarterly 13F-tracking for 30
  superinvestors; static Next.js export on Cloudflare Pages.
- **Domain authority (DR):** ~5 estimated (new 2026 launch).
- **Monetization:** ad-supported (AdSense approval pending) + founders
  tier €9/mo (Stripe env-var operator-gated).
- **Current baseline revenue:** €0/wk (pre-monetization).
- **Current baseline traffic:** pre-analytics-data (GA4 live from
  2026-04-16; Plausible pageview fix v1.10 verified).
- **First measurable AUG score expected:** once GA4 + Plausible + GSC
  accumulate ≥7d of data AND operator runs first Monday METRICS rollup.

---

## Weekly Score

<!-- Format: YYYY-MM-DD | acq | act | eng | ret | adv | mon | perf | AUG_v3 | WoW delta | top_weakness | note -->

```
2026-04-18 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.00 |  n/a  | pre-audit | v19.2 I-35 infrastructure stub initialized. 7 dimensions seeded at 0.0 pending first `/acepilot aug` deep-audit run. Confidence 0.0 (cold). Not an I-35 floor breach — pre-audit scores don't count toward the 2-consecutive-weeks threshold; first scored row starts the clock.
```

---

## Status

**Current phase:** pre-audit. Infrastructure stub only.

**Next action** (brain or operator): run `/acepilot aug` once the site has
accumulated enough live analytics data to score all 7 dimensions
honestly. Doing it earlier would produce noise, not signal.

**Soft target timeline:**

- Week of 2026-04-21 → first Plausible week-over-week + GSC 7d rollup
  available → first real `/acepilot aug` deep-audit run viable
- Weekly cadence after that; logs append to `## Weekly Score` above
- I-35 floor monitoring begins on the second scored row (need 2 consecutive
  weekly measurements <5 to trigger kill-criteria flag)

---

## 7-factor rubric (quick reference)

Per `rules/aceusergrowth.md` v3 Part 25:

| Factor | Scale 0.0 - 1.0 | What it measures |
|---|---|---|
| **Acquisition** | 1=<500 unique/mo → 10=300k+ unique/mo (normalize /10) | Top-of-funnel traffic volume |
| **Activation** | 1=<10% activation → 10=≥75% | % users taking first meaningful action in first session |
| **Engagement** | Composite of bounce + pages/session + time + scroll (max 10 from 4 sub-dims × 2.5) | Session depth |
| **Retention** | 1=<3% D7 return → 10=≥55% D7 return | Durable return-rate |
| **Advocacy** | 1=k-factor 0 → 10=k-factor ≥0.80 | Share/referral coefficient |
| **Monetization** | 1=$0/week → 10=$2,000+/week | Revenue per week |
| **Performance** | Composite of LCP + INP + CLS + TTFB (max 10 from 4 sub-dims × 2.5) | CWV health |

## Fleet-level scoring calibration

Once HoldLens has its first real AUG row, the score becomes part of the
fleet-wide rollup at `~/.claude/fleet/AUG_ROLLUP.md` (to be created by the
first session that has cross-site AUG data).

## Corrections

<!-- Append-only. Format: corrects: <timestamp> | reason | new_value -->
