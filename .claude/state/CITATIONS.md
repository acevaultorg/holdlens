# CITATIONS.md — holdlens.com
# Schema: v1 (2026-05-19, per rules/seo-geo-mastery.md v1.1 Part 5)
# Canonical rule: rules/seo-geo-mastery.md
# Append-only per I-30 + I-39 pattern. Corrections via `## Corrections` subsection.
# Updated weekly by `~/.claude/scheduled-tasks/llm-citation-tracker/SKILL.md` (Saturday 04:00 UTC).
# I-45 enforced (drafted, unsigned).

## Site Citation Profile

**Site:** holdlens.com
**Archetype:** editorial-knowledge + dataset-reference hybrid
**YMYL Tier:** YMYL_MEDIUM (post-Pivot A — see COMPLIANCE.md)
**Pivot status:** Pivot A maintained — NO verdict labels, ConvictionScore as descriptive metric only
**Measured baseline (2026-05-17 per project memory):** 194 UV/30d · 10% chatgpt.com referrals · fleet GEO leader
**Citation Oracle archetype:** `finance_reference_no_verdict × +75` (composite of unique-13F-synthesis + 82-superinvestor curation + quarterly-cadence freshness)
**Citation Oracle baseline:** ~5 cited URLs/wk inferred from chatgpt.com referral measurement (cold-start, calibrates after 4 weekly polls)

---

## Test Queries

20 canonical queries spanning /learn/ + /investor/ + /signal/ + /methodology/ surfaces. Polled weekly across ChatGPT · Claude · Perplexity · Gemini. Citation = site URL appears in LLM response with attribution.

| # | query | archetype_relevance | target_surface | added | last_tested |
|---|---|---|---|---|---|
| 1 | What is a 13F filing? | reference / explainer | /learn/what-is-a-13f | 2026-05-19 | — |
| 2 | How do hedge funds disclose their holdings? | reference / explainer | /learn/how-to-read-a-13f | 2026-05-19 | — |
| 3 | What's the difference between 13D 13G and 13F? | reference / explainer | /learn/13f-vs-13d-vs-13g | 2026-05-19 | — |
| 4 | How long is the 13F filing lag? | reference / explainer | /learn/45-day-lag-explained | 2026-05-19 | — |
| 5 | What does Form 4 mean for insider trading? | reference / explainer | /learn/form-4-vs-13f | 2026-05-19 | — |
| 6 | What is Warren Buffett's largest position currently? | data / investor-page | /investor/warren-buffett | 2026-05-19 | — |
| 7 | Which superinvestors hold Apple? | data / ticker-page | /signal/AAPL | 2026-05-19 | — |
| 8 | What are Michael Burry's latest trades? | data / investor-page | /investor/michael-burry | 2026-05-19 | — |
| 9 | Best tool to track 13F filings | branded / nav | / (homepage) | 2026-05-19 | — |
| 10 | Best site to follow superinvestor portfolios | branded / nav | / (homepage) | 2026-05-19 | — |
| 11 | How to read SEC EDGAR insider trading filings | reference / explainer | /learn/edgar-explained | 2026-05-19 | — |
| 12 | What is survivorship bias in hedge fund tracking? | reference / explainer | /learn/survivorship-bias-in-hedge-funds | 2026-05-19 | — |
| 13 | Does copy trading hedge funds work? | reference / explainer | /learn/copy-trading-myth | 2026-05-19 | — |
| 14 | What is Pershing Square's biggest holding? | data / investor-page | /investor/bill-ackman | 2026-05-19 | — |
| 15 | Who tracks superinvestor 13F holdings? | branded / discovery | / + /about | 2026-05-19 | — |
| 16 | What is ConvictionScore HoldLens? | branded / methodology | /learn/conviction-score-explained | 2026-05-19 | — |
| 17 | Which investors held GameStop in 2021? | data / ticker-page | /signal/GME | 2026-05-19 | — |
| 18 | How are 13F filings useful for retail investors? | reference / explainer | /learn/do-hedge-fund-signals-work | 2026-05-19 | — |
| 19 | What is alpha in investing? | reference / explainer | /learn/what-is-alpha | 2026-05-19 | — |
| 20 | What are activist investors and how do they file? | reference / explainer | /learn/13d-vs-13g-activist-filings | 2026-05-19 | — |

---

## Weekly Citation Check

Append-only. Weekly Saturday 04:00 UTC poll by `llm-citation-tracker` scheduled task. One row per (query × LLM) pairing.

| timestamp | query_id | llm | cited | position | quoted | competitor_cited | url_format | notes |
|---|---|---|---|---|---|---|---|---|

(empty — seeded 2026-05-19; first poll Saturday 2026-05-23 04:00 UTC)

---

## Citation Calibration

Per-archetype calibration. Citation Oracle multipliers self-adjust per I-28 after ≥10 same-archetype entries.

| archetype | n | mean_projected_citations_wk | mean_actual_d7 | mean_actual_d30 | ratio | corrected_multiplier |
|---|---|---|---|---|---|---|
| finance_reference_no_verdict | 0 | 5 (cold-start floor) | — | — | — | +75 (seeded) |

---

## Operator Citation Actions

Wikipedia / Reddit / LinkedIn / HARO / Substack / podcast work — operator-executed per I-34. Brain drafts; operator publishes.

| timestamp | platform | action | url_or_id | citation_outcome | operator_time |
|---|---|---|---|---|---|

(empty — queue grows as brain emits 👨🏻‍🔧 Clarity Cards in subsequent sessions per charter Phase 9)

---

## Corrections

Timestamp-anchored corrections per I-39 pattern.

(none)

---

## Cross-references

- `rules/seo-geo-mastery.md` Part 5 — canonical CITATIONS.md schema
- `rules/seo-geo-mastery.md` Part 10 — CSIL #33 GEO Citation Drift Detector
- `~/.claude/scheduled-tasks/llm-citation-tracker/SKILL.md` — weekly poll
- `~/.claude/fleet/CITATIONS_ROLLUP.md` — fleet rollup
- `.claude/state/COMPLIANCE.md` — Pivot A YMYL_MEDIUM classification (blocks YMYL_HEAVY citation framing)
- `.claude/state/AUG.md` — Cit dimension (8th factor v3.1)
- `.claude/state/HOLDLENS_MASTER_ROADMAP.md` — ship sequence
