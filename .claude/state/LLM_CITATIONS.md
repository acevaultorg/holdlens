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

## Weekly Citation Check (append-only)

| week | engine | query | cited_as_source | url_cited | position | notes |
|---|---|---|---|---|---|---|
| 2026-04-23 | — | (baseline week — no checks run yet) | — | — | — | First-time baseline. Operator runs weekly. Automation out of scope (brain cannot sign in to all LLM engines). |

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
