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

---

## Weekly Score · 2026-04-20 (first real audit)

```
2026-04-20 | 0.10 | 0.15 | 0.20 | 0.10 | 0.10 | 0.10 | 0.80 | 1.58 | n/a | acquisition | First scored row. Baseline starts I-35 clock (I-35 breach requires 2 consecutive <5.0 weeks; this row is week 1).
```

### Per-dimension evidence

| Dim | Score | Evidence | Confidence |
|---|---:|---|---|
| **Acquisition (0.10)** | 1/10 | CF 7d: 6,315 unique IPs, 23,850 pageviews. Plausible (human-only JS beacon): ~12 humans/30d ≈ 3-20 humans/week. CF:human ratio ≈ 300:1 (the 6,315 "uniques" is 99%+ bots). Rubric: <500 humans/mo = tier 1. | High — Plausible sample small but CF/Plausible ratio consistent |
| **Activation (0.15)** | 1.5/10 | No explicit activation event defined in Plausible goals or GA4 events. Proxy via pages/session (~1.2 per earlier session) suggests most visitors bounce before any meaningful action. | Low — no direct instrumentation; placeholder |
| **Engagement (0.20)** | 2/10 | CF 7d avg: 3.78 pageviews per unique (but includes bots fetching N pages). Human-filtered: likely <1.5 pages/session + bounce >65%. Scroll depth + time-on-page not instrumented yet. Rubric composite = bounce 0.75 + pages 0.75 + time 0 + scroll 0 = 2/10. | Low — composite approximated from partial data |
| **Retention (0.10)** | 1/10 | D7 return rate is statistically undefined with 3-20 humans/week. No returning-session event fires yet. | Cold — insufficient data |
| **Advocacy (0.10)** | 1/10 | Zero shares, zero embeds, zero k-factor. Share cards shipped per-result but no share events logged. | High — verified absence |
| **Monetization (0.10)** | 1/10 | €0/wk. AdSense application pending. Pro tier €9/mo live on page but no Stripe env vars in production (operator-gated). Pay-Per-Crawl waitlist pending. | High — verified |
| **Performance (0.80)** | 8/10 | Lab estimates after v1.60-1.64 perf ships: LCP ~1.5s, INP <200ms, CLS ~0, TTFB ~100ms (CF edge). Composite 4×2.5 ≈ 8. Field data (CrUX) insufficient — needs more human traffic to populate. | Medium — lab-clean, field-unverified |

### Computation

```
AUG_v3 = 10 × (0.10 × 0.15 × 0.20 × 0.10 × 0.10 × 0.10 × 0.80)^(1/7)
       = 10 × (2.4e-6)^(1/7)
       = 10 × 0.158
       = 1.58
```

### Top weakness — acquisition (0.10)

**Why it matters most:** acquisition is multiplicative with every other stage. Moving from 20 humans/wk → 500 humans/wk would:
- Move acq score 1 → 3 (×3 on AUG)
- Produce enough sample for honest activation/engagement/retention scoring (ending cold-start confidence floor)
- Enable CrUX to populate field-data (currently "insufficient data")
- Give monetization a chance (AdSense RPM needs ~10k monthly views to be meaningful)

All other dimensions are downstream of having humans to measure.

### Why technical fixes alone won't move acquisition

The technical acquisition infrastructure is already in place:
- ✅ Sitemap + sitemap-ai + robots.txt + llms.txt (v1.56-59)
- ✅ Schema.org saturation (v1.57 Article/Person/ProfilePage)
- ✅ freshness signals (v1.57 datePublished/dateModified)
- ✅ IndexNow ping in every deploy (auto-scheduled)
- ✅ Canonical set, duplicate-content clean
- ✅ OG images on every page (v1.5x OG fleet-wide fix)
- ✅ WP scanner noise silenced (v1.65)
- ✅ Agent-ready score 100/100 (v1.60)

Remaining levers are **operator-time** per `rules/aceusergrowth.md` Part 2:
- HN Show HN (one-shot launch, 48h spike)
- LinkedIn zero-click framework posts (×+65 archetype, weekly cadence)
- Reddit organic comments in r/SecurityAnalysis, r/ValueInvesting (×+70)
- HARO/Qwoted journalist pitches (×+35, 3/week)
- Wikipedia citations on 13F-related pages (×+75, highest durability)
- One podcast guest slot per quarter (×+50)

See Clarity Cards queued in TASKS.md for operator sequencing.

