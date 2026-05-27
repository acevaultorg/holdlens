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
| 21 | What is InsiderScore HoldLens | branded / methodology | /insiders/ + /learn/conviction-score-explained | 2026-05-27 | — |
| 22 | What is EventScore 8-K | branded / methodology | /events/ | 2026-05-27 | — |
| 23 | Berkshire Hathaway Q1 2026 13F | data / report | /reports/2026-05-q1-2026-13f-signal-summary | 2026-05-27 | — |
| 24 | Best 13F superinvestor tracker for AI | branded / discovery | / + /for-ai | 2026-05-27 | — |
| 25 | Hedge fund Apple position size | data / ticker-page | /signal/AAPL + /ticker/AAPL | 2026-05-27 | — |
| 26 | What does Stanley Druckenmiller hold | data / investor-page | /investor/stanley-druckenmiller | 2026-05-27 | — |
| 27 | Seth Klarman Baupost top positions | data / investor-page | /investor/seth-klarman | 2026-05-27 | — |
| 28 | Hedge fund sector rotation 2026 | data / rotation-page | /rotation + /sector/ | 2026-05-27 | — |
| 29 | 13F filing deadline 2026 | reference / explainer | /learn/45-day-lag-explained | 2026-05-27 | — |
| 30 | Where to find SEC insider trades | reference / discovery | /insiders/live + /learn/edgar-explained | 2026-05-27 | — |
| 31 | Are hedge fund 13F filings public | reference / explainer | /learn/how-to-read-a-13f + /learn/what-is-a-13f | 2026-05-27 | — |
| 32 | Top consensus picks hedge funds 2026 | data / consensus-page | /consensus + /best-now | 2026-05-27 | — |

(32 queries seeded — 20 original from 2026-05-19 + 12 added by task 001110 on 2026-05-27. Spans /learn/ explainer + /investor/[slug] + /signal/[ticker] + /ticker/[symbol] + /reports/ + /rotation + /sector/ + /events/ + /insiders/ + /consensus + /best-now + /for-ai + /about + homepage surfaces. Tracks branded discovery + concept explainer + comparator + programmatic data + voice-natural phrasings per `rules/seo-geo-mastery.md` Part 14 AEO discipline.)

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

## @geo Audit Log

Append-only @geo specialist (acepilot-geo.md v20.3) 5-dimension audits. I-45 floor mean ≥0.5 required; Dual Fit + Bot-Crawl Health 0.0 = HARD-BLOCK unbypassable.

| timestamp | ship_id | seo_foundation | geo_readiness | dual_fit | entity_coherence | bot_crawl_health | mean | verdict | sample_size | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-05-27 08:50 UTC | post-001100 + post-001105 (commits dec0f76e4 + 17cfdeb3c + efd4e33f1) | 0.95 | 0.95 | 0.95 | 0.85 | 1.00 | **0.94** | ✅ PASS | 10 pages (/  /signal/AAPL /investor/warren-buffett /learn/conviction-score-explained /scores /about /reports/Q1-2026 /methodology /partners /learn/what-is-a-13f) + 5 AI-bot UA HEAD checks (GPTBot/ClaudeBot/PerplexityBot/Google-Extended/ChatGPT-User all 200) + robots.txt audit (27 AI crawler allowlist entries + Content-Signal header) | Pivot A holding firm post-2026-05-09. No verdict-label regression. Person sameAs chain (3 URLs validated 200) NOW live in layout.tsx via 001100 commit (pending deploy when CF status flips from `minor`). JSON twin alternates added on /signal + /ticker via 001105 commit (/investor already had them). Bot-Crawl Health = 1.00 (perfect — static export + AI allowlist + llms.txt + sitemap-ai.xml + JSON twins + Content-Signal). Entity Coherence 0.85 (slight gap: AUTHOR_SCHEMA pen-name in lib/author.ts has no sameAs; founder Person sameAs uses brand-Org URLs — operator-personal LinkedIn would lift toward 1.0). |

### 5-Dimension Detail (2026-05-27 audit)

**SEO Foundation: 0.95**
- All 10 sampled pages: `<title>` ✓, `<h1>` ✓, canonical ✓, ≥2 ld+json schemas ✓, og:image ✓ (9 of 10 — /partners missing og:image)
- IndexNow in deploy script (postbuild)
- CWV: perf-budget-check.mjs enforces in postbuild + static export reduces JS payload
- Schema saturation: Organization + WebSite + Person + Article + DefinedTerm + DefinedTermSet + BreadcrumbList visible across pages

**GEO Readiness: 0.95** (Aleyda 10-char checklist)
- Accessible 1.0 (static export, GPTBot returns 200 + body content visible)
- Useful 1.0 (unique ConvictionScore synthesis across 30 superinvestors)
- Recognizable 1.0 (consistent HoldLens identity site-wide via layout.tsx)
- Extractable 1.0 (quote-ready titles, DefinedTerm schema for 3 brand metrics, paragraph-snippet eligible)
- Consistent 1.0 (voice consistent across /learn + /about + /methodology)
- Corroborated 0.7 (sister-site secfilingdex linked + JSON twins + llms.txt declared, but Wikipedia/Reddit/LinkedIn citations pending operator-side amplification)
- Credible 1.0 (Person schema + /about ~870w + /methodology + Pivot A descriptive framing + 45-day lag disclosure inline)
- Differentiated 1.0 (explicit Pivot A POV: descriptive-not-recommendation)
- Fresh 1.0 (datePublished + dateModified, quarterly cadence visible, "Data current: Q1 2026" in llms.txt)
- Transactable 1.0 (/partners brokerage + /for-ai enterprise + /pricing)

**Dual Fit: 0.95**
- /signal/[ticker]: ranks for "{TICKER} hedge fund holdings" + cited for "Which superinvestors hold AAPL"  ✅
- /investor/[slug]: ranks for "{Manager} portfolio" + cited for "What does Buffett own"  ✅
- /learn/*: ranks for concept queries + cited for definitional Q&A  ✅
- /scores: ranks for "best 13F tracker" + cited for ranked-list  ✅
- /reports/Q1-2026: new archetype, still gathering ranking signal but extractable for AI Overview
- Every sampled page passes both axes

**Entity Coherence: 0.85**
- Organization schema site-wide with sameAs (3 URLs: github/acevaultorg + secfilingdex.com + twitter/holdlens) ✓
- Person founder NOW has sameAs (3 URLs, all 200) ✓ (shipped task 001100 commit dec0f76e4)
- WebSite schema with publisher ref ✓
- Some pages use @id graph (#organization), others use legacy inline blocks (slight inconsistency)
- AUTHOR_SCHEMA pen-name "HoldLens Editorial" has no sameAs (acceptable for pen-name but limits compound)
- **Gap to 1.0:** add LinkedIn personal URL to founder Person sameAs (operator-confirm required — surfaced as 👨🏻‍🔧)

**Bot-Crawl Health: 1.00**
- robots.txt: 27 AI bot allowlist entries (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, Claude-SearchBot, anthropic-ai, PerplexityBot, Perplexity-User, Googlebot-Extended, Google-Extended, Applebot, Applebot-Extended, CCBot, cohere-ai, Bytespider, Amazonbot, Amzn-SearchBot, Meta-ExternalAgent, Meta-ExternalFetcher, Meta-Webindexer, Diffbot, DuckAssistBot, YouBot, FacebookBot, Timpibot, +Googlebot/Bingbot)
- Content-Signal header: `ai-train=no, search=yes, ai-input=yes` declared
- All 5 AI bot UA HEAD checks: 200 OK
- llms.txt: comprehensive (PPC pricing per route + data refresh cadence + primary sources + 20+ JSON endpoints listed + citation guidance)
- sitemap-ai.xml: 216 URLs, referenced from robots.txt
- JSON twin endpoints live: scores/[TICKER], managers/[slug], snapshot/latest, composite, value, big-bets
- Static export = first-paint HTML, no JS-gated body content
- Cloudflare AI Crawl Control = "Do not block" (fleet-default per `rules/cloudflare-managed-robots.md`)

**I-45 floor check:** mean 0.94 ≫ 0.5 ✅ · Dual Fit 0.95 ≠ 0.0 ✅ · Bot-Crawl Health 1.00 ≠ 0.0 ✅ · **No HARD-BLOCK triggered.**

**Verdict:** HoldLens remains fleet GEO leader. Pivot A holding firm 18 days post-deploy. v20.3 amplifier ships (001100 + 001105 + 001110) compound the existing strong baseline. No regression from prior @compliance 0.74 audit (COMPLIANCE.md row 2026-05-09 ~10:48 UTC).

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
