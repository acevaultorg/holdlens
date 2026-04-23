# REVENUE_CALIBRATION.md — holdlens

**Schema:** v1 (2026-04-23, seeded with v19.5 canonical 9-layer stack)
**Canonical reference:** `~/.claude/rules/revenue-maximizer.md` Part 6
**Append-only per Invariant I-39.** Monthly rows cannot be deleted or retroactively edited. Corrections go to the dedicated `## Corrections` subsection with `corrects: <original-timestamp>` field.

## Monthly Revenue (append-only)

Tracks per-layer actuals in USD (or EUR for HoldLens Pro, noted).

| month | adsense | ezoic | mediavine | cf_ppc | tollbit | prorata | affiliate | perplexity | pro_tier | enterprise | total_usd | sessions_human | rpm_blended |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 2026-04 (MTD through 4/23) | $0 | $0 | $0 | $0 | $0.005 | $0 | $0 | $0 | €0 | $0 | $0.005 | ~12 humans (MTD per Plausible) | n/a |

## Projection vs Actual

Per-ship or per-layer expected vs observed revenue deltas. Feeds Revenue Oracle self-calibration per I-28.

| month | layer | projected | actual | ratio | notes |
|---|---|---|---|---:|---|
| 2026-04 | 8 (TollBit) | $5-20 projected for first active week | $0.005 (1 scrape) | ~0.01 | PerplexityBot single successful scrape. OpenAI ChatGPT-User forwarded 43× but zero paid — TollBit BDev conversion pending. Ratio expected to rise as TollBit signs more AI-partner licenses over 2-4 weeks. |
| 2026-04 | Pro | €50-200 projected at 5-25 signups | €0 (no live conversions) | 0.0 | Stripe Payment Links ready. Bottleneck: human traffic to /pricing (acquisition 0.10/10 per AUG audit). |
| 2026-04 | 3 (llms.txt indirect) | n/a (multiplier, not direct $) | n/a | n/a | 4.4× AI-visitor multiplier feeds AdSense when approved + human traffic quality. |

## Acquisition Cost Baseline

For LTV/CAC math once revenue flows. Currently: acquisition is 100% organic (SEO/GEO/direct) — CAC ≈ $0 for human side. Infrastructure cost: Cloudflare Pages free tier (no bandwidth cost yet).

## Corrections

(timestamp-anchored; per I-39 append-only pattern and `rules/learn-from-data.md`)

None yet.
