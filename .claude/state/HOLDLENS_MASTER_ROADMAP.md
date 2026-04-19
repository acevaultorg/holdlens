# HoldLens Master Expansion Roadmap

**Started:** 2026-04-19
**Thesis:** track all institutional positioning + smart-money signals + retention-driving calculators on one mega-site.
**Target completion:** ~12 months (~1 ship per month avg, faster for algorithmic/existing-data layers).
**Projected site-level AUG v3 at completion:** 45-60 (current ~14 pre-audit baseline).
**Mission spec:** operator directive 2026-04-19 "HoldLens master expansion — ship next section per roadmap" (13 sections tiered).

---

## Ship Status

| # | Tier | Section | Route base | Status | Shipped | 7d audit | 30d audit | Notes |
|---:|---|---|---|---|---|---|---|---|
| 1 | 1 | Dividend Tax Calc by Country | `/dividend-tax/` | **shipped (git), deploy pending** | 2026-04-19 (commits 310d3094b, 29f8c89bc, 1d2e79ce2, a8d085e5f) | 2026-04-26 | 2026-05-19 | Cycle 1-4: architecture + data 10→75 cells + share-button + 4 bug-fixes. v1.48 not yet on live (wrangler 3-strike EPIPE — operator handoff to CF dashboard in TASKS.md). |
| 5 | 1 | 13F Delta Tracker | `/delta/` | **substantively shipped via existing routes** | pre-2026-04-19 (inherited) | — | — | Existing `/activity/`, `/biggest-buys/`, `/biggest-sells/`, `/new-positions/`, `/exits/`, `/reversals/` already cover the 13F Delta surface. Remaining gap = unified `/delta/` hub + `/delta/[quarter]/` + per-ticker/per-investor delta pages. Scope = low-effort aggregation, defer to cycle after Ship #8. |
| 8 | 2 | Portfolio Similarity Scorer | `/similar-to/` | **shipped v1 (git)** | 2026-04-19 (v1.49) | 2026-04-26 | 2026-05-19 | v1 Jaccard on ticker-set union, 30 per-investor programmatic pages + cross-link on /investor/[X]. v2 will add position-weighted similarity once calibration arrives. |
| 9 | 2 | Sector Rotation Analyzer | `/sectors/` | **alternative next candidate** | — | — | — | Algorithmic layer on existing 13F + sector data. Quarterly-headline-bait. Projected APS 34-40. |
| 2 | 1 | SEC Form 4 insider-trading tracker | `/insiders/` | pending (partial — `/insiders/` route exists) | — | — | — | `/insiders/` already in app/ (v1.10+). Remaining: per-insider-slug deep pages, conviction scoring, cross-links. Scope = medium; existing infra reusable. Projected APS 42-50. |
| 3 | 1 | 13D/13G activist-investor tracker | `/activist/` | pending | — | — | — | SEC EDGAR 13D/13G XML pipeline — new data ingestion. 5-7 days. Projected APS 40-44. |
| 4 | 1 | Corporate buyback tracker | `/buybacks/` | pending | — | — | — | SEC 10-Q Item 2 + 8-K parsing. Medium effort. Projected APS 40-46. |
| 6 | 2 | ETF X-Ray + overlap analyzer | `/etf/` | pending | — | — | — | 13F for ETFs (existing) + prospectus parsing (new). 5-7 days. Projected APS 42-48. |
| 7 | 2 | 8-K material events tracker | `/events/` | pending | — | — | — | SEC 8-K item-number categorization. New pipeline. Projected APS 36-42. |
| 10 | 3 | Short interest + borrow rate | `/short/` | pending | — | — | — | FINRA Reg SHO — new data pipeline. 5-7 days. Projected APS 40-44. |
| 11 | 3 | SEC S-1 / IPO pipeline tracker | `/ipo/` | pending | — | — | — | SEC S-1 pipeline. New ingestion. Projected APS 40-46. |
| 12 | 3 | Form D private placement tracker | `/form-d/` | pending | — | — | — | SEC Form D. Niche professional audience. Projected APS 32-38. |
| 13 | 3 | Proxy vote tracker | `/proxy-votes/` | pending | — | — | — | SEC N-PX filings. Annual cadence. Projected APS 34-40. |

## Mission Gates

Before starting any new ship, verify (per mission spec):

- [x] Prior ship reached 7d-post-ship measurement → **N/A for this session** (Ship #1 just shipped today; per spec "or skip if <7d elapsed, resume elsewhere")
- [ ] Prior ship did not breach I-22 Retention Floor (requires 7d data)
- [ ] Prior ship did not breach I-25 Distribution Floor (requires 7d data)
- [x] Prior ship @craftsman Love Score ≥0.5 → **Ship #1 Love 0.76 PASS** (I-23)
- [x] Prior ship @distributor Distribution Fit ≥0.5 → **Ship #1 Fit 0.67 PASS** (I-26)
- [ ] Current AUG v3 Score ≥5 → **AUG.md at 0.0 pre-audit baseline** (I-35 not a breach yet; first scored row starts the clock)

**Conclusion:** Ship #1 passed quality gates but 7d calibration gates haven't elapsed. Per spec, this session should "resume elsewhere" — selecting Ship #8 or Ship #9 (both algorithmic-only, no new data pipeline) as the next candidate when a subsequent session picks up.

## Next-Session Plan

1. Verify Ship #1 v1.48 is live on holdlens.com (operator runs `curl -sL https://holdlens.com/dividend-tax/us/ | grep -c "qualified dividends at the preferential"` — should return ≥1 after deploy).
2. If v1.48 NOT live → operator uses CF dashboard drag-drop per TASKS.md Clarity Card.
3. Start Ship #8 (Portfolio Similarity) OR Ship #9 (Sector Rotation). Both are algorithmic-only (no new data pipeline) — fastest concrete surface additions.
4. Recommend Ship #8: retention multiplier higher (drives exploration → repeat visits), simpler data model (pairwise Jaccard on existing holdings), cleanest cross-link story ("Investors who trade like X" on every /investor/[X] page).

## Per-Ship Discipline (applies to every ship)

Per mission spec "Shared Build Requirements":
- Primary-source citations per data row (AP-3 tri-state: verified|derived|needs_research)
- Full programmatic routes + hub + cross-links
- Share-card per result (Canvas 1200×630 + pre-composed tweet, follow SignalShareCard pattern)
- Schema.org (Article + Person + Organization + Dataset + BreadcrumbList + DefinedTerm)
- llms.txt + sitemap.xml + IndexNow
- Mobile 375px verified via Chrome MCP
- LCP <1.5s, CLS <0.05, INP <200ms
- @craftsman ≥0.5 (I-23)
- @distributor ≥0.5 (I-26)
- @designer mobile + a11y pass
- @security no XSS
- @reviewer no invariant violations
- AdSense compliance (no ads on /privacy /terms /contact /about /404)

Per-ship logging:
- ORACLE.md (revenue delta)
- RETENTION.md (D7 return rate delta)
- DISTRIBUTION.md (visitors/wk delta)
- QUALITY.md (Love Score)
- Fleet LEARNED.md (ship outcome + lessons)
- Acquisition log row to `~/.claude/fleet/ACQUISITION_LOG.md` if new archetype activated (I-33)
- AUG v3 recompute (weekly)

## Progress Summary

- **Shipped (in git):** Ship #1 (dividend-tax) + Ship #5 (substantive via existing routes)
- **In progress:** none (Ship #1 awaits 7d calibration + operator-side deploy verification of v1.48)
- **Pending:** 11 ships (Ships #2, #3, #4, #6, #7, #8, #9, #10, #11, #12, #13)
- **Estimated full completion:** 2027-04-19 (assuming ~1 ship/month avg, conservative for medium/hard tier)

## Append-only log

<!-- Each roadmap update appends a dated entry below. Never retroactively edit. -->

### 2026-04-19 — initial roadmap creation

Ship #1 (dividend-tax) cycles 1-4 landed in git (commits 310d3094b, 29f8c89bc, 1d2e79ce2, a8d085e5f). Chrome MCP mobile 375px verification surfaced 4 bugs — all fixed in v1.48. Specialist PASS: Love 0.76, Fit 0.67. CF Pages auto-deploy via whatever mechanism landed cycle 1-3 at the tasks: v1.47 commit; v1.48 bug-fixes pending operator deploy (dashboard drag-drop per TASKS.md after 3-strike wrangler EPIPE). Ship #5 marked "substantively shipped via existing routes" after audit of app/ revealed `/activity/`, `/biggest-buys/`, `/biggest-sells/`, `/new-positions/`, `/exits/`, `/reversals/` already cover 13F-delta surface.

Next session: resume at Ship #8 (Portfolio Similarity Scorer — algorithmic-only, no new data pipeline) after operator deploys v1.48 and 7d calibration window elapses on Ship #1.
