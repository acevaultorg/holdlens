# ORACLE.md — Revenue Oracle v1 (HoldLens)

Revenue model: **Ad-supported + founders-tier subscription (€9/mo)**.
Primary KPI: **founders_paid_conversions_per_week**.
Baseline: **0** paying subscribers (pre-launch, path to first €100 = ~12 subs).

## Archetype multipliers (calibrated to product tier)

```
pricing_page_change       × 1.00   cold
signup_flow_change        × 0.80   cold
new_landing_page          × 0.60   cold
conversion_copy_fix       × 0.30   cold
SEO_page_addition         × 0.15   cold
affiliate_placement       × 0.25   cold   (HoldLens-specific — IBKR $200/funded)
API_endpoint_addition     × 0.08   cold   (developer-audience, indirect)
analytics_wiring          × 0.10   cold
bug_fix_blocking_revenue  × 0.50   cold
infrastructure            × 0.05   cold
cleanup_refactor          × 0.00   always
specialist_review         × 0.00   always
competitive_research_ship × 0.40   cold   (strategic lift when finding new angle)
```

## Calibration

<!-- Append-only. Format: timestamp | task_id | archetype | projected_weekly_$ | actual_7d | actual_30d | note -->

```
2026-04-15 16:00 | seed | system | 0 | n/a | n/a | Oracle stubbed. No prior ship-impact data. All multipliers at cold values.
```

## Current session projections (not yet calibrated)

```
2026-04-15 | v0.78 competitor research + BRK.B fix  | competitive_research_ship | est €20/wk | TBD | TBD
2026-04-15 | v0.78 Pro ad-free + GA4/Clarity stack  | analytics_wiring          | est €2/wk  | TBD | TBD
2026-04-15 | v0.79 FoundersNudge + launch-kit       | conversion_copy_fix       | est €15/wk | TBD | TBD
2026-04-15 | v0.80 UX retention pass (nav+footer)   | conversion_copy_fix       | est €8/wk  | TBD | TBD
2026-04-15 | v0.81 hero rewrite + FoundersNudge fan | conversion_copy_fix       | est €12/wk | TBD | TBD
2026-04-15 | v0.81 sticky header + BackToTop on 10k pages | conversion_copy_fix  | est €6/wk  | TBD | TBD | deep retention signal, affects every page beyond fold
2026-04-15 | v0.81 text-dim contrast WCAG fix          | bug_fix_blocking_revenue  | est €3/wk  | TBD | TBD | a11y: previously-unreadable caption text now passes AA
2026-04-15 | v0.81 plural bug on /best-now             | bug_fix_blocking_revenue  | est €0.5/wk| TBD | TBD | trivial copy polish, trust signal
2026-04-25 | v1.67 EngagementTracker scroll+time+returning  | analytics_wiring          | est €0.05/wk | TBD | TBD | direct revenue ~zero; real value = unblocks Oracle calibration loop per learn-from-data.md. Every retention/distribution Oracle row past v1.67 deploy carries actual data instead of cold-start estimates.
2026-04-25 | v1.67 EngagementTracker activation event   | analytics_wiring          | est €0.05/wk | TBD | TBD | same compound; closes 4th and final AAERA measurement gap (activation 0.15 cold-start)
2026-04-25 | v1.68 /learn/form-4-vs-13f                 | SEO_page_addition         | est €3-5/wk  | TBD | TBD | comparison article ~2000 words; targets "form 4 vs 13f" + "insider buying vs institutional" cluster ~3,000-5,000 monthly searches. Steady-state revenue from organic + LLM-citation by Week 8-16. Cold-start (confidence 0.4) until Week 4 first data lands. Calibrates 2026-05-25 + 2026-06-25.
2026-04-25 | v1.68 cross-links 6 surfaces              | internal_linking_hub_spoke| est €0.50/wk | TBD | TBD | /insiders/ inline + Related card · /for-ai/ · /learn/insider-score-explained · /learn/sec-signals-trilogy · LearnReadNext · /learn/ hub. Indirect revenue via lower bounce on existing high-traffic pages.
2026-04-15 | v0.84 global focus ring + reduced-motion  | bug_fix_blocking_revenue  | est €2/wk  | TBD | TBD | keyboard users + vestibular users were effectively blocked
2026-04-15 | v0.84 buffett page parity (InvestorConcentration + FoundersNudge) | conversion_copy_fix | est €4/wk | TBD | TBD | most-visited manager page (Buffett) previously lacked concentration visual + Pro nudge that all 29 other managers had; closes UX parity gap on tier-1 traffic page
2026-04-15 | v0.87 custom 404 (retention, POPULAR_ROUTES x6)   | new_landing_page          | est €4/wk  | TBD | TBD | prior default Next.js 404 was a close-tab trap; now branded with outcome-voice CTA to /best-now
2026-04-15 | v0.87 /compare index (was 404)                   | new_landing_page          | est €3/wk  | TBD | TBD | users bookmarking /compare or trimming URLs landed on 404; now routes to both stock + manager pair modes
2026-04-15 | v0.91 RelatedSignals on /ticker/[symbol]         | SEO_page_addition         | est €1.5/wk| TBD | TBD | 94 ticker pages get same-sector + co-owned cross-link strip; proven on /signal, expected bounce-rate reduction on top-tier landing surface
2026-04-16 | v0.93 /sector/[slug] "More sectors" strip         | SEO_page_addition         | est €1.5/wk| TBD | TBD | 11 sector dossier pages get 10-link sibling grid + /rotation CTA, closes SEO-landing dead end
2026-04-16 | v0.94 homepage OG image (silent distribution leak) | SEO_page_addition         | est €3/wk  | TBD | TBD | every prior social/chat share of holdlens.com rendered as text-only card; compounds with every unsolicited referral going forward
2026-04-16 | v1.00 sitemap /premium + /compare registration    | SEO_page_addition         | est €0.5/wk| TBD | TBD | /premium (Pro marketing) + /compare (landing) were shipped but never added to sitemap — Google had no crawl path to either
2026-04-16 | GA4 property live (G-HDK5CHBQEY) + env var wired   | analytics_wiring          | est €2/wk  | TBD | TBD | NEXT_PUBLIC_GA4_ID set, layout.tsx no-op scaffold activated, page_view firing verified via Chrome MCP — unblocks conversion attribution for all downstream revenue instrumentation
2026-04-16 | GA4 post-setup: retention 14mo + Google signals    | analytics_wiring          | est €0.5/wk| TBD | TBD | 12-month additional cohort visibility + cross-device/demographics (consent-gated) — enables 14mo trend reports that default 2mo would have silently dropped
2026-04-16 | GA4 ↔ GSC link (holdlens.com Domain property)      | analytics_wiring          | est €1.5/wk| TBD | TBD | organic search queries + landing pages now flow into GA Search Console report — closes the attribution gap between GSC indexed-click data and GA session/conversion data
2026-04-16 | GA4 ↔ AdSense link (pub-7449214764048186, rev ON)  | analytics_wiring          | est €1/wk  | TBD | TBD | ad revenue per-page surfaces in GA once AdSense approves and auto-ads serve; pairs with on-page AdSlot components already shipped
2026-04-17 | v1.09 MobileNav semantic color system             | craftsmanship_polish      | est €0/wk  | TBD | TBD | mobile menu color rotation removed; emerald=buy, rose=sell, sky=info, amber=Pro-reserved; Retention Oracle paired projection +0.006 Δ 7d-return (craftsmanship_polish × user_reach~0.6 × confidence 0.3) — revenue is near-zero short-term, compounding bet through retention
2026-04-17 | v1.33 /learn/13f-vs-13d-vs-13g comparison article | SEO_page_addition         | est €3/wk  | TBD | TBD | targets ~5,200/mo searches across 13d-vs-13g / 13f-vs-13d / 13f-vs-13g / "difference between" — full schema stack (Article+BreadcrumbList+FAQPage+3 DefinedTerm), thick editorial (2500 words) avoids thin-content penalty, HoldLens-native "signal spectrum" angle = moat vs generic SEC-jargon guides
```

## Top blocker (honest)

**Distribution is the gate, not code.** All in-session projections are "assuming the user-facing Reddit / HN / Twitter launch ships." The Oracle cannot project real `actual_7d` values until **traffic** arrives. First calibration row will land after the first operator-posted campaign that actually delivers ≥200 visitors to the site.
2026-04-17 16:50 | v1.34-moves-phantom-fix | bug_fix_blocking_revenue | 2.0 | TBD | TBD | Hypothesis: 6 broken rows on homepage LatestMoves eroded trust on entry-page. Fix removes phantom "52-64% of book" + missing-ticker visual. Projects 2/wk via reduced bounce + restored hero-section credibility. Confidence 0.4 (cold archetype, pre-revenue baseline).
2026-04-17 17:20 | v1.35-cusip-expansion | bug_fix_blocking_revenue | 5.0 | TBD | TBD | +175 CUSIP mappings (rounds 1-3) + case-insensitive lookup + IEP self-buy filter. Holdings coverage 21.2% → 31.7% (rescued 3,340 rows). Direct trust win: Burry's 66% PLTR bet now visible. Confidence 0.5 — repeat archetype has ship history.
2026-04-17 17:35 | v1.36-investor-edgar-preference | bug_fix_blocking_revenue | 8.0 | TBD | TBD | Investor pages now prefer EDGAR latest filing over stale hand-curated topHoldings. Affects 27 pages. Fixes >1-year data staleness across entire manager roster (Burry BABA/JD/BIDU → PLTR/NVDA/HAL). Confidence 0.4.

## Calibration (v1.45 — Dividend Tax Calc, architecture + seed ship)
2026-04-19 | v1.45 dividend-tax feature + hub + 20 country pages | core_loop_improvement | est €8/wk (peak) | TBD | TBD | New retention-focused feature on /ticker/* + /investor/* + 21 new programmatic pages (/dividend-tax/ hub + 20 investor-country). Feature: interactive calculator that answers "what tax will I actually pay on these dividends" — the most-common next-question for HoldLens users deep in /ticker or /investor. Widget ships with 10 verified US-outbound treaty cells (IRS P901 Table 1 cited) + 390 cells marked needs_research with honest fallback to statutory rate (never fabricated per AP-3). Confidence 0.3 (cold archetype for this project; no retention data yet to validate). Revenue projection = peak-of-feature AFTER data completion; v1 alone won't hit the full €8/wk until operator populates the 300+ remaining treaty cells from KPMG/PwC annual guides. Cold projection assumes +30% visit depth when users reach /ticker or /investor (a hint from the Aleyda Solis LLM-citation playbook: adding a transactable quantified-outcome tool doubles perceived usefulness of the parent page).

## Calibration (v1.46 — dividend-tax Phase 3 partial: share button + resident-guide content)
2026-04-19 | v1.46 dividend-tax share button + top-5 resident-guide | core_loop_improvement | est €3/wk additional | TBD | TBD | Follow-up to v1.45. Adds (a) DividendTaxShareButton component with Twitter intent + LinkedIn intent + clipboard copy, gated to verified-rate state only (no viral moments on "data pending"); (b) expanded resident_guide content for the top-5 investor countries US/UK/DE/CA/AU adding ~200-300 words of genuine educational content per page (process-level tax guidance — NOT treaty-rate data, no fabrication). Combined with cycle 1: full feature stack now lightly hits Solis characteristic #4 (Extractable) + #2 (Useful) + #10 (Transactable via share). Revenue projection cold at €3/wk incremental (mostly indirect via advocacy k-factor bump from 0 to ~+0.02).

## Calibration (v1.47 — dividend-tax data expansion 10→75 verified + US→UK bug fix)
2026-04-19 | v1.47 dividend-tax data +65 cells + correction | core_loop_improvement + data-integrity-fix | est €4/wk incremental | TBD | TBD | 7.5x data coverage leap (10→75 verified). 20 domestic (investor=payer 0% cross-border) + 18 UK-as-payer (0% ordinary portfolio, REIT-PID caveated) + 19 SG-as-payer (0% one-tier corp tax) + 9 remaining US-outbound (15% standard treaty). Plus a bug fix: cycle-1 US→UK shipped 15% (the treaty ceiling) when practical UK rate is 0% on ordinary portfolio dividends. Correction logged to data/dividend-tax.json 'corrections' array. Every new cell cites a verifiable primary source (HMRC, IRAS, IRS P901, national tax codes). Confidence 0.4 (up from 0.3 — real verified data now).

## Calibration (v1.49 — Ship #8 Portfolio Similarity Scorer v1)
2026-04-19 | v1.49 /similar-to/[investor]/ × 30 pages + cross-link | new_feature_usefulness + core_loop_improvement | est €4/wk | TBD | TBD | Ship #8 v1 from HOLDLENS_MASTER_ROADMAP. Pure algorithmic layer on existing 13F data (Jaccard on ticker-set union, 30 × 30 = 900 pairs at build time). Creates discovery loop /investor/[X] → /similar-to/[X] → /investor/[Y] → repeat. No new data pipeline. Confidence 0.3 cold.

## v1.48 palette discipline (2026-04-19)
2026-04-19 | v1.48-hero-widow-orphan              | craftsmanship_polish          | est €0.5/wk  | TBD | TBD | Hero polish. Revenue-neutral short-term, compounding bet through retention delight.
2026-04-19 | v1.48-signals-magnitude-tier         | delight_detail                | est €1/wk    | TBD | TBD | Above-the-fold signals encoding rank visually; modest bounce reduction projection.
2026-04-19 | v1.48.1-wcag-weak-tier-fix           | bug_fix_blocking_revenue      | est €0.5/wk  | TBD | TBD | WCAG compliance restored on 4 weak-tier cells. Minor revenue projection but compliance floor matters.
2026-04-19 | v1.48.3-latest-moves-palette-fix    | craftsmanship_polish          | est €1.5/wk  | TBD | TBD | TRIM amber→rose semantic fix + score column magnitude-tiered. Brand-amber preserved for Pro/CTA. Palette discipline ship across 2 homepage components.

## Calibration (v1.50 — Ship #9 Sector Rotation Analyzer v1)
2026-04-19 | v1.50 /sectors/ unified hub | core_loop_improvement + internal_linking_hub_spoke | est €2/wk | TBD | TBD | Ship #9 v1 from roadmap. /sectors/ unifies existing /rotation + /sector/[slug] under one navigable landing. No new data pipeline. 11 sector cards + color-coded tint + cross-links to heatmap + biggest-buys/sells. Confidence 0.3 cold.

## v1.49 palette rebalance (2026-04-19)
2026-04-19 | v1.49-signal-explorer-palette-rebalance | craftsmanship_polish | est €2/wk | TBD | TBD | 19-card signal-explorer palette: 10 amber → 1 amber + 8 emerald + 3 rose + 7 neutral. Amber scarcity restored; /best-now primary-CTA now visually dominant. Compounding bet through retention delight + brand moat.

## v1.50 nav palette (2026-04-19)
2026-04-19 | v1.50-desktop-nav-palette-rebalance | craftsmanship_polish | est €2.5/wk | TBD | TBD | Nav palette discipline extended fleet-wide. Scarcity-preserved amber across every page compounds brand recognition + hover-semantic model. Compounding bet through retention × brand.

## Calibration (v1.51 — Ship #2 SEC Form 4 insider deepening v1)
2026-04-19 | v1.51 /insiders/[insider]/ + lib/insider-conviction.ts | new_feature_usefulness + core_loop_improvement | est €5/wk | TBD | TBD | Ship #2 v1 from roadmap. Per-corporate-insider pages with logistic-scored conviction (role-weighted, 10b5-1-penalized). No new data pipeline (uses existing curated INSIDER_TX). Confidence 0.3 cold.

## Calibration
2026-04-20 12:39 | v1.54-monetization-layer | ai_visibility_optimized_page+programmatic_page_with_unique_data | projected: €500-3000/mo peak Y1 (1-3 enterprise API licenses from /for-ai inbound + /api-terms commercial tier discovery) | actual_7d: TBD | actual_30d: TBD | confidence: 0.4 | hypothesis: bot traffic (3.16k/wk) × commercial-routing headers × AI-buyer landing page converts ≥1 enterprise conversation in Q2 2026

## Calibration (v5 — ConvictionScore SEC trilogy completion + 4-page LLM-citation alignment)
2026-04-24 11:50 | v5-trilogy | original_research_with_dataset+ai_visibility_optimized_page+llm_citation_quote_ready+programmatic_page_with_unique_data+schema_markup_article_person_org+wikipedia_sourced_edit (Wikipedia not yet attempted) | projected_weekly_$: €25-180/wk Y1 from indirect AdSense lift via LLM citation (8-18% citation→click CTR per Semrush 2025; €15-30 finance RPM × est 50-200 LLM-referred sessions/wk by Day 60) + €0-12/mo Cloudflare PPC on /api/v1/scores/[ticker].json bot crawls | actual_7d: TBD (re-test 2026-05-01) | actual_30d: TBD (re-test 2026-05-24) | confidence: 0.4 (cold-start; ratchets up after first measurable LLM citation surfaces in /referral analytics) | hypothesis: 4-page LLM-citation alignment (/learn/sec-signals-trilogy/ + /learn/conviction-score-explained/ + /for-ai/ + /api/v1/scores/[ticker].json) all naming "ConvictionScore v5" + "trilogy completed" + "9-layer breakdown" with consistent terminology produces a Wikipedia-style canonical entity that LLMs prefer when answering "tool combining 13F + Form 4 + 8-K". Day-0 baseline = 0 Google citations (LLM_CITATIONS.md). Re-test schedule: Day-7 + Day-14 + Day-30. Calibration target: ≥1 named-citation in any LLM by Day-30 OR adjust archetype multipliers down per I-28 ±50% bound.

## Calibration (2026-04-24 — Q4 2025 13F signal summary report)
2026-04-24 15:55 | q4-2025-signal-summary | annual_report_state_of_x+finite_public_dataset_programmatic+schema_markup_article_person_org+internal_linking_hub_spoke (stack-count 4 → Archetype-Stacking Bonus ×1.40) | projected_weekly_$: €8-30/wk Y1 on publish (2,100-word quarterly analysis drawing on existing Q4 2025 moves + holdings data, zero new pipeline). Revenue path: (1) indirect AdSense lift via LLM citation of 9 named patterns ("AMZN split the room 6-to-7", "Buffett cut AMZN 77%", "Ackman opened META", "MEDLINE three-manager consensus IPO", "INTU quietest consensus sell") — each pattern a quotable sentence that maps 1:1 to a future LLM answer when asked "what did superinvestors do in Q4 2025"; (2) SEO long-tail on quarter-specific queries ("q4 2025 13f", "amzn superinvestor moves", "medline ipo hedge funds"); (3) internal linking hub-spoke compounds with existing /investor/ + /stock/ + /signal/ + /divergence/ surfaces (report linked to 15+ internal surfaces) | actual_7d: TBD (re-test 2026-05-01) | actual_30d: TBD (re-test 2026-05-24) | confidence: 0.3 (cold-start; below v5-trilogy because annual_report archetype still uncalibrated on holdlens) | hypothesis: quarterly report archetype (×+85 per LEARNED.md) stacked with finite-public-dataset-programmatic (×+75) compounds multiplicatively. Stack count 4 hits the ×1.40 Archetype-Stacking Bonus per concept-finder-methodology v2.1.1 Layer 5. This is the calibration target — does the annual_report archetype actually compound to ≥projected, or does the lack of pre-existing audience (holdlens has ~20 humans/wk per AUG baseline) suppress it below the multiplier curve. Re-test schedule: Day-7 + Day-30 actual sessions on /reports/2026-04-q4-2025-13f-signal-summary/ via Plausible.
