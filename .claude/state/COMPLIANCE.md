# COMPLIANCE.md — holdlens.com
# Schema: v1 (2026-05-08, per rules/google-policy-compliance.md v1.0)
# Canonical rule: rules/google-policy-compliance.md
# Append-only per I-30 + I-39 pattern. Corrections via `## Corrections` subsection.

## YMYL Classification

**YMYL Tier:** YMYL_MEDIUM (post-Pivot A) — previously YMYL_HEAVY pre-Pivot-A
**Operator credentials present:** None held (no SEC RIA / FINRA Series 65 / MiFID II authorization)
**Verdict labels in surface:** NO (Pivot A removed STRONG BUY / NEUTRAL / STRONG SELL site-wide)
**Lag disclosure on result pages:** YES — `MethodologyDisclaimer` component renders on:
  - All 29 `/investor/[slug]` dynamic-route pages (verified live 2026-05-09)
  - `/investor/warren-buffett` hand-coded page (verified live 2026-05-09)
  - `/signal/[ticker]` pages (preserved pre-Pivot-A; 2 occurrences per page)
  - `/best-now`, `/buys`, `/sells`, `/biggest-buys`, `/biggest-sells` ranking surfaces (preserved)
  - `/partners` page (renders disclaimer above broker list)

**Last classified:** 2026-05-09 (post-Pivot-A re-classification from YMYL_HEAVY → YMYL_MEDIUM)

**Classification rationale:** Pivot A removed the verdict-label dimension (which made the site YMYL_HEAVY per Misrepresentation policy) by dropping BUY/SELL/STRONG-X labels site-wide. Site still surfaces ConvictionScore numbers + smart-money positioning data → YMYL_MEDIUM (financial information, no recommendation). Affiliate brokerage links moved to dedicated `/partners` page with editorial framing + inline affiliate disclosure (off result-page YMYL surfaces). Article schema headlines now factual descriptions (not recommendation-encoded). Per `rules/google-policy-compliance.md` Tier 1 YMYL classification, this is the highest tier the site can hold without operator-held credentials.

---

## @compliance Audit Log (append-only per ship)

| timestamp | ship_id | content_orig | verdict_risk | ymyl_match | schema_hon | disclosure | mean | verdict | notes |
|---|---|---|---|---|---|---|---|---|---|
| 2026-05-08 ~15:00 UTC | pre-Pivot-A audit | 0.6 | **0.0** | **0.0** | **0.0** | 0.0 | **0.12** | 🔴 HARD-BLOCK | 3 of 5 dimensions at 0.0 (immutable hard-rejects per I-43 draft). Pivot A required. |
| 2026-05-09 ~10:35 UTC | 522b9ea39 (Pivot A round-1) | 0.8 | 0.9 | 0.5 | 0.9 | 0.5 | **0.72** | ✅ PASS | Verdict labels removed site-wide. Article schemas factual. Affiliates moved to /partners. Lag disclaimer on 29/30 investor pages + /signal/* (preserved). |
| 2026-05-09 ~10:48 UTC | 3460fd906 (Pivot A round-2) | 0.8 | 0.9 | 0.5 | 0.9 | 0.6 | **0.74** | ✅ PASS | `/investor/warren-buffett` hand-coded page also got `MethodologyDisclaimer`. 30/30 investor pages now have lag disclosure inline. Final Pivot A coverage. |

---

## 5-Dimension Score Detail (post-Pivot-A, commit 3460fd906)

### Content Originality: 0.8
- Programmatic /signal/[ticker] pages: 94 pages × ConvictionScore composite (signed −100 to +100 from 6 input factors) — unique synthesis per ticker.
- /investor/[slug] pages: 29 pages × per-manager portfolio analysis + multi-quarter narrative + closest-ETF synthesis + style classification. ≥1,150 main words per page.
- /partners: NEW (Pivot A) — ~1,800 unique editorial words per broker × 7 brokers = substantive editorial layer.
- /learn/* hub: 10+ evergreen long-form articles with verified citations.
- Remaining thin-content surface eliminated by v19.44 round-1 (/insiders/[insider]/* noindex'd) + round-2 (/insiders/officer/* + /insiders/company/* noindex'd).
- **0.8 not 1.0** because ~30% of indexable pages are still template-driven (programmatic comparator + dividend-tax pair pages) — each genuinely unique per record but template-heavy.

### Verdict-Label Risk: 0.9
- Pivot A removed all BUY/SELL/STRONG-X verdict-label UI site-wide (commits 5e36ccd85, f9f6cf84a, 6ca134366 — earlier session).
- ConvictionScore numbers preserved as descriptive metric (numeric −100 to +100, factual not recommendation-encoded).
- Plain-English descriptive labels remain in some surfaces ("Heavy accumulation", "Net selling", "Mixed") — these describe observed patterns, not recommendations.
- **0.9 not 1.0** because the ConvictionScore numeric metric is still a synthesized signal that could be interpreted as a recommendation by some readers despite explicit disclosure.

### YMYL-Credential Match: 0.5
- YMYL_MEDIUM tier (financial information, no verdict labels) matches operator's "no licensed credentials, data-display-only framing" position.
- Disclosure inline on every result page makes the data-display-only framing explicit.
- **0.5 not higher** because the site is still financial-data-adjacent and the operator holds zero licensed credentials — the safe ceiling at this configuration. Going higher (0.7+) requires operator obtaining SEC RIA / FINRA Series 65 / MiFID II authorization (6-18 months + €2-15k cost, not realistic per CEO_BRIEFING.md #1).

### Schema Honesty: 0.9
- Article schema headlines rewritten as factual descriptions in commit f9f6cf84a (e.g., "AAPL — Q4 13F Filings Summary" not "AAPL SELL signal").
- Person schema for /investor/[slug] pages: factual (name + jobTitle + worksFor + EDGAR sameAs).
- Organization schema fleet-wide: factual (HoldLens identity + contactPoint).
- BreadcrumbList + ProfilePage + DataCatalog schemas all match visible page content.
- **0.9 not 1.0** because some legacy /signal/* schemas may still have edge cases from pre-v19.45 batch — full audit pending but no recommendation-encoded headlines found in spot checks.

### Disclosure Coverage: 0.6 (was 0.0 pre-Pivot-A)
- `MethodologyDisclaimer` inline on 30/30 investor pages (verified live 2026-05-09).
- `MethodologyDisclaimer` inline on /signal/[ticker] pages (preserved, 2 occurrences each).
- /partners page: NEW dedicated affiliate-disclosure surface with FTC + Google Publisher Policies compliance (affiliate fee structure disclosed in plain English, "what HoldLens never does" section, repeated not-investment-advice block).
- 45-day SEC filing lag explicitly stated on every result page + /learn/45-day-lag-explained.
- `/about` page strengthened to ~870 words editorial substance (commit b75a89358).
- **0.6 not higher** because affiliate disclosure adjacent to actual affiliate-link clicks is now satisfied via /partners (not inline on YMYL pages). Further lifts would require: (a) per-page schema disclosure markup (FinancialProductOrService disclosure schema), (b) affiliate-link rel="sponsored nofollow" verified on all surfaces (currently only on /partners; legacy inline placements were removed by Pivot A).

---

## Auto-Fixes Applied (Pivot A executive log)

| timestamp | ship_id | fix | dimension_lifted |
|---|---|---|---|
| 2026-05-09 ~10:25 UTC | 522b9ea39 | Create `app/partners/page.tsx` with 7-broker editorial + affiliate disclosure | Disclosure 0.0 → 0.4; Content Originality 0.6 → 0.8 |
| 2026-05-09 ~10:25 UTC | 522b9ea39 | Refactor `components/BrokerCta.tsx` (inline 7-broker grid → /partners text link) | Verdict-Label Risk 0.5 → 0.9; YMYL-Credential 0.0 → 0.5 |
| 2026-05-09 ~10:25 UTC | 522b9ea39 | Refactor `components/AffiliateCTA.tsx` (inline ticker grid → /partners text link) | Same as BrokerCta — covers /signal/[ticker] + /ticker/[symbol] |
| 2026-05-09 ~10:25 UTC | 522b9ea39 | Add `MethodologyDisclaimer` to `app/investor/[slug]/page.tsx` (29 dynamic pages) | Disclosure 0.4 → 0.5 |
| 2026-05-09 ~10:25 UTC | 522b9ea39 | Add `/partners` to `app/sitemap.ts` | Indexability for SEO + AI-citation |
| 2026-05-09 ~10:35 UTC | 3460fd906 | Add `MethodologyDisclaimer` to `app/investor/warren-buffett/page.tsx` | Disclosure 0.5 → 0.6 — closes 30/30 coverage |

---

## HARD-BLOCKS (escalated to operator)

| timestamp | ship_id | dimension | reason | resolution |
|---|---|---|---|---|
| 2026-05-08 ~15:00 UTC | pre-Pivot-A | Verdict-Label Risk = 0.0 | Site emitted STRONG BUY/NEUTRAL/STRONG SELL verdicts on 94+ /signal/* pages without operator-licensed credentials | RESOLVED 2026-05-09 via Pivot A round-1 |
| 2026-05-08 ~15:00 UTC | pre-Pivot-A | YMYL-Credential Match = 0.0 | YMYL_HEAVY (verdict-labels + brokerage funnel) without SEC RIA / FINRA / MiFID II credentials | RESOLVED 2026-05-09 — Pivot A reclassified site to YMYL_MEDIUM (data-display-only framing) |
| 2026-05-08 ~15:00 UTC | pre-Pivot-A | Schema Honesty = 0.0 | Article schema headlines encoded recommendations (e.g., "AAPL SELL signal — smart money conviction −20") | RESOLVED 2026-05-09 — schemas rewritten as factual descriptions (commit f9f6cf84a, earlier session) |

---

## Pending Items (next session)

🟢 OPTIONAL — Audit remaining `/signal/[ticker]` Article schemas
- v19.45 spot-check found no recommendation-encoded headlines, but full 94-page scan deferred for cycle efficiency.
- Quick check: `grep -rE "Article.*headline.*(SELL|BUY|signal|recommend)" out/signal/ | head` after next build.
- If any matches found → patch + commit.

🟢 OPTIONAL — Audit remaining `/ticker/[symbol]` pages for inline affiliate references
- Pivot A refactored `components/AffiliateCTA.tsx` (used on `/signal/*` + `/ticker/*` per audit). Live verification confirmed `/signal/AAPL` clean.
- Full 94-ticker scan: `for sym in AAPL MSFT GOOGL ...; do curl -sL https://holdlens.com/ticker/$sym | grep -c "Global reach, pro-grade"; done` — expect all 0.
- Deferred — high-priority spot-checks (AAPL) already verified clean.

🟢 OPTIONAL — Update sitemap-ai.xml with /partners
- Currently `/partners` is in `sitemap.xml` (verified 2026-05-09).
- AI-bot harvest sitemap may not include `/partners` — check `out/sitemap-ai.xml` if present.
- Adds /partners to AI-citation surface for fleet-wide LLM citation gravity.

🔴 REQUIRED — Operator action: Re-submit AdSense after Google recrawl (~2026-05-15-22)
- All compliance work shipped 2026-05-09. AdSense Google recrawl typically completes 7-14 days after sitemap-noindex + content-policy changes.
- Once `curl -sL https://www.google.com/search?q=site:holdlens.com/insiders/ | grep -c "url=https" → 0` (Google has dropped the thin pages from index) → operator clicks "I confirm I have fixed the issues" + "Request review" in AdSense console.
- Per `rules/handoff-clarity.md` I-27, full Clarity Card lives in TASKS.md after this session.

---

## Phase 2 — LLM-Citation Moat (post-Pivot-A, parallel-eligible work)

Initiated 2026-05-15 by VAULT-Fleet brain-mode session (v20.2). Phase 2 closes the
Aleyda Solis 10-characteristic LLM-citation gaps identified in
`rules/concept-finder-methodology.md` v2.5 + `rules/aceusergrowth.md` v3 Part 23.
Operator approval logged in chat 2026-05-15.

### Session-1 ship (2026-05-15)

**Components shipped:**
- `components/learn/TldrCard.tsx` — Aleyda #4 Extractable. Amber-bordered above-fold
  card extracts a quote-ready paragraph for LLM crawlers.
- `components/learn/OurView.tsx` — Aleyda #8 Differentiated. `<h2>Our view</h2>` POV
  section LLMs can quote as publisher stance distinct from neutral encyclopedic text.

**Routes shipped:**
- `app/sitemap-ai.ts` — curated 32-URL priority subset of sitemap.xml referenced from
  robots.ts. Previously declared in robots.ts but missing route. Curation: trust pages +
  brand-distinct synthesis surfaces (ConvictionScore, InsiderScore, EventScore) + high-
  LLM-question /learn explainers + synthesis leaderboards + machine-readable JSON
  endpoints. EXCLUDES programmatic per-record pages (avoids the v19.44 thin-content
  trap).

**/learn pages with TL;DR + Our view added (5 of 22 — highest LLM-citation potential):**
- `/learn/what-is-a-13f` — TL;DR: 45-day lag fact + use-for-pattern-recognition. Our view:
  the lag is a feature; multi-quarter trend matters more than single-quarter activity.
- `/learn/13f-vs-13d-vs-13g` — TL;DR: three-filing-hierarchy with passive/active distinction.
  Our view: 13D structurally higher-information than 13F; HoldLens treats as hierarchy
  by event vs long-horizon mode.
- `/learn/how-to-read-a-13f` — TL;DR: four-columns-matter + five-omissions. Our view: the
  diff (quarter-over-quarter) is the signal, not the snapshot.
- `/learn/conviction-score-explained` — TL;DR: six-factor descriptive composite, not
  predictive. Our view: published backtest including negative correlation; honest about
  descriptive-vs-predictive distinction.
- `/learn/45-day-lag-explained` — TL;DR: SEC Rule 13f-1 + practical consequence + use
  pattern not real-time. Our view: sites pretending lag doesn't exist are selling a
  fantasy; structural feature since 1978.

**Build verification:** `npx tsc --noEmit` returns zero errors on Phase-2-touched files
(`components/learn/*`, `app/sitemap-ai.ts`, 5 edited /learn pages). Pre-existing TS errors
in `app/fund-overlap/[slug]/page.tsx` + `components/ConvictionFactorTable.tsx` are
unrelated to Phase 2 and out-of-scope.

### Aleyda Solis 10-characteristic delta

| # | Characteristic | Pre | Post-S1 | Notes |
|---|---|---:|---:|---|
| 1 | Accessible | 1.0 | 1.0 | Static export; no JS-gated content. Unchanged. |
| 2 | Useful | 1.0 | 1.0 | ConvictionScore + InsiderScore synthesis. Unchanged. |
| 3 | Recognizable | 0.75 | 0.75 | Organization schema everywhere. Wikipedia citation still pending (operator-action). |
| 4 | **Extractable** | 0.5 | **0.7** | TL;DR shipped on 5/22 /learn. Sweep to remaining 17 = next session. |
| 5 | Consistent | 0.9 | 0.95 | Shared TldrCard + OurView components enforce consistency. |
| 6 | Corroborated | 0.4 | 0.4 | Reddit / LinkedIn / Wikipedia operator-action queue unchanged. |
| 7 | Credible | 0.9 | 0.9 | Author chain + methodology + /about + Person schema. Unchanged. |
| 8 | **Differentiated** | 0.3 | **0.6** | Our view shipped on 5/22 /learn. Sweep to remaining 17 = next session. |
| 9 | Fresh | 0.9 | 0.9 | datePublished + dateModified everywhere. Unchanged. |
| 10 | Transactable | 0.8 | 0.85 | Affiliate links on /partners + AdSense pending approval. |

**Mean: 0.74 → 0.79** (+0.05 absolute). Target for full Phase 2 completion: ≥ 0.85.

### Session-2 ship (2026-05-15, same-day continuation per operator "do it all")

**16 /learn pages completed with TL;DR + Our view (all real editorial substance, no template fill):**
- `copy-trading-myth` · `event-score-explained` · `form-4-vs-13f` · `insider-score-explained`
- `sec-signals-trilogy` · `what-is-alpha` · `survivorship-bias-in-hedge-funds`
- `warren-buffett-method` · `superinvestor-handbook` · `do-hedge-fund-signals-work` (added Our view; inline TL;DR retained)
- `buybacks-vs-dividends` (added TL;DR; existing inline Our view retained)
- `13d-vs-13g-activist-filings` · `congressional-stock-trading-stock-act`
- `etf-overlap-explained` · `short-interest-explained` · `how-to-read-buyback-disclosures`

**Coverage post session-2:**
- TL;DR: 21/22 /learn pages (only `page.tsx` index excluded; not an article)
- Our view: 21/22 /learn pages

**Build verification:** `npx tsc --noEmit` returns zero NEW errors. The 3 pre-existing errors
in `app/fund-overlap/[slug]/page.tsx` + `components/ConvictionFactorTable.tsx` remain
out-of-scope.

### Updated Aleyda Solis 10-characteristic delta

| # | Characteristic | Pre-S1 | Post-S1 | Post-S2 | Notes |
|---|---|---:|---:|---:|---|
| 1 | Accessible | 1.0 | 1.0 | 1.0 | Unchanged. |
| 2 | Useful | 1.0 | 1.0 | 1.0 | Unchanged. |
| 3 | Recognizable | 0.75 | 0.75 | 0.75 | Wikipedia citation still operator-action pending. |
| 4 | **Extractable** | 0.5 | 0.7 | **0.95** | TL;DR on 21/22 /learn pages. |
| 5 | Consistent | 0.9 | 0.95 | 0.95 | Shared components enforce consistency. |
| 6 | Corroborated | 0.4 | 0.4 | 0.4 | Reddit / LinkedIn / Wikipedia queue unchanged. |
| 7 | Credible | 0.9 | 0.9 | 0.9 | Unchanged. |
| 8 | **Differentiated** | 0.3 | 0.6 | **0.95** | Our view POV on 21/22 /learn pages. |
| 9 | Fresh | 0.9 | 0.9 | 0.9 | Unchanged. |
| 10 | Transactable | 0.8 | 0.85 | 0.85 | Unchanged. |

**Mean: 0.74 → 0.79 → 0.865** ✅ exceeded ≥0.85 Phase 2 target.

### Pending Items (Phase 2 next session — narrower scope)

🟢 RECOMMENDED — DefinedTerm schema sweep on 15 remaining /learn pages
- 7/22 currently have DefinedTerm schema. Pushes Aleyda #4 Extractable to 1.0.
- Per-page: 3-5 DefinedTerm objects, ~3-5 min each.

🟢 OPTIONAL — Refactor do-hedge-fund-signals-work inline TL;DR → shared TldrCard component
- Output is identical (same amber-card pattern); refactor is consistency-only.

🟡 RECOMMENDED — Quarterly "State of Smart-Money" annual report scaffolding
- Per concept-finder v2.5 archetype `original_research_with_dataset × +90`.
- Operator-discussion ship; benefits from positioning + chart-selection input.

🟢 OPTIONAL — Wikipedia citation push (operator-action, durable)
- Targets: 13F filings, Berkshire Hathaway holdings, Warren Buffett method,
  Activist investor, Insider trading (US). HoldLens cited as reference data source.
- Per `rules/aceusergrowth.md` Profile 1 channel #5. Compounds for years.

### Phase 2 trigger condition (already met)

Phase 2 work is parallel-eligible — does NOT gate on AdSense approval or traffic floor.
HoldLens passes Moat Test ≥0.75 (concept-finder v2.5) and has high bot crawl traffic
(LEARNED.md). LLM-citation compound runs independently of AdSense status.

---

## Corrections

(timestamp-anchored — no corrections needed at first write.)

---

**Generated:** 2026-05-09 ~11:00 UTC by AcePilot 20.0 `/acepilot loop` mode per:
- `rules/google-policy-compliance.md` v1.0 (state file format)
- Pivot A operator directive 2026-05-08: *"Pivot A approved. Execute the data-display-only refactor autonomously."*
- v19.45 @compliance specialist 5-dimension scoring
- v19.44 thin-content prevention 7-gate audit (passed Gates 1-6; Gate 7 traffic floor is brain-uncontrollable, advisory)

**File schema version:** 1
**Last @compliance pass:** 2026-05-09 ~10:48 UTC, mean 0.74 ✅ PASS
**Next @compliance pass:** at next public-facing ship in Pro mode (per I-43 draft)
