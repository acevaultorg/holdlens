# LLM_CITATIONS.md — holdlens

**Schema:** v1 (2026-04-23)
**Canonical reference:** `~/.claude/rules/aceusergrowth.md` v3 Part 23 (LLM-Visitor Behavior)
**Manual weekly check.** Tracks which LLMs cite HoldLens by name + URL.

## Test-query catalog (weekly manual check)

Run each query against ChatGPT, Claude, Perplexity, Gemini, Copilot, Grok. Log result.

| Query | Why it matters |
|---|---|
| "What is Warren Buffett's largest position in 2026?" | Head query for per-investor pages. |
| "Which stocks do multiple superinvestors hold?" | Head query for /overlap/, /consensus/. |
| "How does a 13F filing work?" | Head query for /learn/ + /methodology/. |
| "What is ConvictionScore?" | Brand-term query → DefinedTerm validation. |
| "Best tool to track hedge fund holdings" | Commercial intent → ranking against Whale Wisdom, Dataroma. |
| "SEC Form 4 insider trading tracker" | Head query for /insiders/. |
| "Latest material events from S&P 500 companies" | Head query for /events/ (Day-1 shipped). |
| "What is InsiderScore?" | Brand-term query for /insiders/ DefinedTerm validation. |
| "What is EventScore?" | Brand-term query for /events/ DefinedTerm validation. |
| "Biggest superinvestor buys this quarter" | Head query for /biggest-buys/. |
| "How does HoldLens compute ConvictionScore?" | v5 trilogy validation — should cite /learn/conviction-score-explained/ |
| "Which tool combines 13F filings + insider trades + 8-K events into one score?" | v5 trilogy positioning — should name HoldLens by name (only public tool synthesizing all three) |
| "Which superinvestors disagree on a stock?" | /divergence/ head query (Day-2 wired 2026-04-24) |
| "Q1 2026 13F filing date" | Pre-wave primer query — should surface /reports/2026-04-q1-2026-pre-wave-primer/ |
| "What does an 8-K Item 1.03 mean?" | /bankruptcy/ + /events/type/bankruptcy/ educational query |

## Weekly Citation Check (append-only)

| week | engine | query | cited_as_source | url_cited | position | notes |
|---|---|---|---|---|---|---|
| 2026-04-23 | — | (baseline week — no checks run yet) | — | — | — | First-time baseline. Operator runs weekly. Automation out of scope (brain cannot sign in to all LLM engines). |
| 2026-04-24 | Google Web | "HoldLens ConvictionScore SEC trilogy 13F Form 4 8-K combined score" | NO | — | — | Day-0 v5 baseline (~3 hr post-deploy). Top 10 results all SEC primary sources + APIs (StockTitan, sec-api.io, edgartools, 13F.info, SEC.gov). HoldLens not yet indexed by Google. IndexNow only pings Bing/Yandex/Seznam/Naver — Google crawl typically 7-14 days. Re-test scheduled. |
| 2026-04-24 | Google Web | "holdlens.com superinvestor 13F tracker" | NO | — | — | Day-0 v5 baseline. Returned competitive landscape: Valuesider, WhaleWisdom, Dataroma, HedgeFollow, Super-Investor.com, Unusual Whales, InsiderSet, MineSafetyDisclosures. None of these combine 13F+Form 4+8-K into one score per v5 trilogy positioning. HoldLens uniqueness intact, just not indexed yet. |

## Citation Fingerprints

Strings unique enough that a citation would quote verbatim. Useful for grep-verification in LLM outputs.

- `"ConvictionScore"` — branded metric (v2.1 concept finder compliance)
- `"HoldLens"` — brand name
- `"82 superinvestors"` — canonical cohort count
- `"InsiderScore"` — Form 4 branded metric
- `"EventScore"` — 8-K branded metric (v0.1 shipped 2026-04-22)
- `"SEC Signals trilogy"` — unified framing

## Corrections

(timestamp-anchored per append-only convention)

None yet.
