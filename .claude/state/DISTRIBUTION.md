# DISTRIBUTION.md — Distribution Oracle v1 (HoldLens)

Distribution model: **Organic SEO + social shares + cross-linking + viral
content loops**. Primary distribution window: **7-day organic traffic delta**
(Plausible `visitors` + GSC `clicks`). Secondary: 30-day compounding.

Baseline: **pre-traffic** (first Monday METRICS rollup once Plausible +
GSC data accumulates will seed the baseline). First calibration rows land
after traffic arrives.

## Archetype multipliers (v18.0 research-calibrated, 2026-04-17)

Upgraded from v17.3 cold-seeds. Sources: Aleyda Solis 10-characteristic
LLM-citation research, Semrush 2026 GEO study, Ahrefs E-E-A-T 2026 update.

```
# High-impact (×+65 to +90) — original-research / community-native
original_research_with_dataset        × +90   (unique dataset → backlinks + LLM citations; HoldLens 13F composite fits)
open_source_release_brand_prefixed    × +90   (GitHub repo named with brand; strong E-E-A-T)
annual_report_state_of_x              × +85   (reusable compounding asset; "State of X 2026")
embeddable_widget                     × +80   (iframe/script-embed tool; compounds on every embed)
wikipedia_sourced_edit                × +75   (cited-in-Wikipedia stays indexed indefinitely)
reddit_organic_helpful_comment        × +70   (substantive answer in community, cites own data naturally)
ai_visibility_optimized_page          × +70   (10-characteristic checklist pass; schema + extractable + corroborated)
hacker_news_show_hn                   × +70   (one-shot spike; quality-dependent)

# Mid-impact (×+40 to +65)
comparison_vs_competitor_page         × +60   (comparison-intent query + FAQ schema)  <!-- UPGRADED from +0.07 to +60 per v18 research -->
shareable_tool_calculator             × +65   (recurring distribution; calculator as link magnet)
linkedin_zero_click_framework_post    × +65   (operator-published framework; brand recall)
programmatic_page_with_unique_data    × +55   (ONLY with unique data — not template pages, see HEAVY PENALTIES)
indie_hackers_build_in_public         × +50
podcast_guest                         × +50
substack_guest_essay                  × +45
haro_qwoted_featured_pitch            × +35

# Low-impact (×+10 to +25) — infrastructure that enables compounding
schema_markup_article_person_org      × +20   (Article + Person + Organization → E-E-A-T lift)
internal_linking_hub_spoke            × +15   (graph density; PageRank redistribution)
sitemap_addition                      × +12   (unblocks missing-URL crawl)
distribution_loop_closure             × +30   (ShareStrip + article-end CTA back to core product)
og_image_generation                   × +25   (social-CTR lift on referral traffic)
core_web_vitals_improvement           × +18
canonical_fix                         × +5
robots_txt_fix                        × +3

# Legacy archetypes (v17.3 compat — kept for queue-row backward-compat)
SEO_page_addition                     × +50   (well-executed /learn article, thick content)
comparison_article_seo                × +60   (alias for comparison_vs_competitor_page)
data_backed_insight                   × +60
dossier_depth_page                    × +40
share_button_addition                 × +10
schema_addition                       × +20

# HARD REJECTS (×-1000 — filtered before ranking; I-26 immutable)
cloaking_or_doorway                   × -1000  IMMUTABLE
keyword_stuffing                      × -1000  IMMUTABLE

# HEAVY PENALTIES (negative, not filtered — logged for transparency)
ai_generated_filler_no_unique_data    × -50    (HCU risk; thin content)
template_programmatic_pages           × -100   (pages generated from same template with no unique data per-URL)
faq_schema_spam                       × -10    (v18 finding: per Semrush, FAQ schema on every page HURTS LLM citation when overused; use sparingly)
thin_content_or_spam                  × -500   (aggressive HCU penalty risk)

# Neutral
pricing_page_change                   × 0      (conversion, not distribution)
signup_flow_change                    × 0
cleanup_refactor                      × 0
dark_pattern_anything                 × -1.000 (I-23 + I-26 reject; different axis but logged here too)
```

**Scale note (v18):** multipliers are now in units of **visitors/week** per
task at steady-state (month 3+ post-ship), not percentage points. A task
with archetype `comparison_vs_competitor_page` × channel_weight × DA_factor
projects a raw visitors/week number. The ranking formula still caps
distribution_weight at +1.0 — multiplier × channel × DA yields a
visitor-count projection which is then divided by
`current_baseline_weekly_visitors` and capped.

## Calibration

<!-- Append-only. Format: timestamp | task_id | archetype | projected_delta_visitors_per_wk | actual_7d_delta | actual_30d_delta | note -->

```
2026-04-17 seed | system | 0 | n/a | n/a | Oracle stubbed. Baseline pre-traffic. All multipliers at v17.3 cold seeds. First actuals once Plausible+GSC has 7+ days of visitor+click data.
```

## Current session projections (not yet calibrated)

```
2026-04-17 | v1.33 /learn/13f-vs-13d-vs-13g            | comparison_article_seo  | +3 visitors/wk  | TBD | TBD | ~5,200 monthly-search target keyword cluster × 0.5% CTR × 12 months maturity curve → ~3 visitors/wk steady-state once ranked (mo 3+); zero in first 7d window
2026-04-17 | v1.33 sitemap backfill (2 articles)       | sitemap_addition        | +1 visitors/wk  | TBD | TBD | unblocks Google crawl of two previously-missing URLs; impact compounds once indexed
2026-04-17 | v1.33 FAQPage schema on /learn article    | schema_addition         | +0.5 visitors/wk| TBD | TBD | 4 FAQ entities enable rich-result eligibility on FAQ SERPs
```

## Top blocker (honest)

**Distribution cannot be measured until GSC + Plausible start returning
real visitor data.** All projections above are Oracle heuristic estimates
with cold confidence (0.3). First calibration row lands after:

1. GSC ≥7 days of indexed-click data per URL, AND
2. Plausible ≥7 days of unique-visitor data per entry path, AND
3. Monday METRICS.md rollup captures `visitors` + `entry_page` weekly

Until then, distribution rows log as projections only. I-24 only enforces
the floor *post-ship* via a distribution cliff detector. Pre-traffic,
there's no baseline to drop from.

## Corrections

<!-- Append-only. Format: corrects: <timestamp> | reason | new_value -->

## Calibration (v1.45 — Dividend Tax Calc, architecture + seed ship)
2026-04-19 | v1.45-dividend-tax-architecture | programmatic_page_with_unique_data (stacking ×1.4) | +120 vis/wk peak | TBD | TBD | Adds 21 new indexed URLs (1 hub + 20 country pages) × archetype multiplier +55 × stacking bonus ×1.4 (three archetypes per page: comparison_vs_competitor + SEO_page_addition + ai_visibility_optimized × schema_markup) × confidence 0.3 cold. Note: cold-start projection. v1 data coverage is 10 cells verified out of 400 target — Google (+ LLMs for citation) prefer to surface pages with unique-data-per-URL. Distribution WILL drop if cells stay needs_research long-term (thin-content signal). Operator handoff queues a data-completion task to reach ≥80% verified coverage within 30 days — that's when this projection calibrates upward.

## Distribution Fit Log (v1.45)
2026-04-19 | dividend-tax-calc-architecture | SEO:0.70 SHARE:0.40 CHANNEL:0.70 LOOP:0.60 MOAT:0.55 | mean:0.59 | PASS | SEO: real searchable queries ("dividend tax [country]", "[country] withholding treaty"). SHARE: lower — per-result PNG share-cards are explicitly Phase 3 of mission and NOT shipped in v1. CHANNEL: finance/SaaS fit strong. LOOP: cross-links wire /ticker ↔ /dividend-tax ↔ /investor (internal compounding). MOAT: citation-first + original synthesis (treaty-rate → effective yield → after-tax net) is a quality moat vs generic calculator sites.

## Calibration (v1.46 — share button + resident-guide content)
2026-04-19 | v1.46-share-button-and-guides | share_by_design_result (partial — intent URLs only, no canvas) + unique-per-page editorial | +30 vis/wk peak | TBD | TBD | Archetype: share_by_design_result baseline +95 but downgraded to ~+30 peak this cycle because v1 is intent-URL-only (no canvas PNG). Canvas is deferred until treaty-data coverage crosses ~80% verified so the share moment isn't contaminated by "data pending" output. Resident-guide content adds ~1500 words of unique-per-page editorial on top-5 pages — reduces thin-content flag risk and strengthens LLM-citation fit characteristic #2 (Useful) + #4 (Extractable).

## Distribution Fit Log (v1.46)
2026-04-19 | v1.46-share-and-guides | SEO:0.70 SHARE:0.60 CHANNEL:0.70 LOOP:0.60 MOAT:0.60 | mean:0.64 | PASS | Up from cycle-1 mean 0.59. SHARE dim: 0.40 → 0.60 (share button ships; canvas PNG still deferred). MOAT dim: 0.55 → 0.60 (citation-backed pre-composed share text is a small moat vs generic calculators).

## Calibration (v1.47 — data +65 cells)
2026-04-19 | v1.47-data-expansion | programmatic_page_with_unique_data (stacking ×1.4) | +45 vis/wk incremental | TBD | TBD | 20 country pages now have real data to back the treaty matrix instead of mostly-pending. Thin-content risk materially reduced. Solis characteristic #2 (Useful) +0.2, #4 (Extractable) +0.15 across the surface.

## Distribution Fit Log (v1.47)
2026-04-19 | v1.47-data-expansion | SEO:0.75 SHARE:0.65 CHANNEL:0.70 LOOP:0.60 MOAT:0.65 | mean:0.67 | PASS | Up from cycle-2 mean 0.64. SEO: 0.70→0.75 (less thin content). SHARE: 0.60→0.65 (share button fires on more cells). MOAT: 0.60→0.65 (correction audit trail + citation-first discipline is defensible moat).

## Calibration (v1.49 — Ship #8 v1)
2026-04-19 | v1.49-similar-to-programmatic | programmatic_page_with_unique_data + internal_linking_hub_spoke | +50 vis/wk peak | TBD | TBD | 30 new indexed URLs with unique Jaccard data per page × programmatic_unique_data archetype +55 × cold confidence 0.3. Targets queries "investors like Buffett / Ackman / Burry / Klarman / etc." Internal-linking hub-spoke from /investor/[X] ↔ /similar-to/[X].

## Distribution Fit Log (v1.49)
2026-04-19 | v1.49-similar-to-scorer | SEO:0.75 SHARE:0.40 CHANNEL:0.70 LOOP:0.80 MOAT:0.60 | mean:0.65 | PASS | SEO: real query pattern "investors who trade like X". SHARE: no share card v1 (follow-up). CHANNEL: finance audience fit strong. LOOP: high — bidirectional cross-link /investor/[X] ↔ /similar-to/[X]. MOAT: Jaccard on HoldLens-curated 30-manager set is distinctive.

## Distribution Fit Log (v1.48 palette discipline, 2026-04-19)
2026-04-19 | v1.48-hero-widow-orphan          | SEO:0.50 SHARE:0.40 CHANNEL:0.70 LOOP:0.50 MOAT:0.40 | mean:0.50 | PASS  | Homepage polish. Does not directly move distribution Oracle archetypes but reduces first-paint bounce risk on referral traffic. SEO/LOOP neutral. MOAT 0.4 — small quality signal.
2026-04-19 | v1.48-signals-magnitude-tier     | SEO:0.55 SHARE:0.55 CHANNEL:0.75 LOOP:0.50 MOAT:0.70 | mean:0.61 | PASS  | Visible-at-glance data encoding is share-worthy (someone might screenshot a "strong buy" signal). MOAT 0.70 — magnitude-tiered palette is a specific HoldLens visual idiom, hard-to-copy without the underlying ConvictionScore dataset.
2026-04-19 | v1.48.1-wcag-weak-tier-fix       | SEO:0.60 SHARE:0.45 CHANNEL:0.70 LOOP:0.50 MOAT:0.55 | mean:0.56 | PASS  | Accessibility compliance weakly lifts LLM-citation fit (Aleyda Solis characteristic #1 "Accessible") + reduces risk of ADA/WCAG complaint.
2026-04-19 | v1.48.3-latest-moves-palette     | SEO:0.55 SHARE:0.55 CHANNEL:0.75 LOOP:0.55 MOAT:0.75 | mean:0.63 | PASS  | Palette consistency across data surfaces compounds brand recognition. MOAT 0.75 — one visual grammar across BuySellSignals + LatestMoves is a compound identity asset.

## Calibration (v1.50 — Ship #9 v1)
2026-04-19 | v1.50-sectors-hub | internal_linking_hub_spoke + schema_markup_article_person_org | +20 vis/wk | TBD | TBD | 1 new indexed URL + CollectionPage schema + 11 internal links to existing /sector/[slug] pages. Boosts the /sector/* cluster's rank via hub-spoke internal linking archetype +15.

## Distribution Fit Log (v1.50)
2026-04-19 | v1.50-sectors-hub | SEO:0.60 SHARE:0.30 CHANNEL:0.70 LOOP:0.80 MOAT:0.50 | mean:0.58 | PASS | SEO: "sector rotation" / "where hedge funds are buying" queries. SHARE: no share card on hub. CHANNEL: finance audience. LOOP: strong — hub → /rotation → /sector/[X] → /investor → cycle. MOAT: modest — method is standard GICS.

## Distribution Fit Log (v1.49 palette rebalance)
2026-04-19 | v1.49-signal-explorer-palette-rebalance | SEO:0.55 SHARE:0.60 CHANNEL:0.75 LOOP:0.60 MOAT:0.80 | mean:0.66 | PASS | MOAT 0.80 — explicit 4-tone palette discipline (amber scarce / emerald bullish / rose bearish / neutral research) is a specific HoldLens visual grammar. Copying requires matching the semantic categorization, not just the colors. SHARE 0.60 — screenshots of the clean grid are more share-worthy than the prior amber-flood.

## Distribution Fit Log (v1.50 nav palette)
2026-04-19 | v1.50-nav-palette-rebalance | SEO:0.55 SHARE:0.65 CHANNEL:0.75 LOOP:0.65 MOAT:0.85 | mean:0.69 | PASS | MOAT 0.85 — consistent 4-tone palette across homepage Signal Explorer + fleet-wide nav is a distinctive brand identity asset. Generic finance sites use color decoratively; HoldLens uses it semantically. Hard-to-copy without understanding the underlying signal classification.

## Calibration (v1.51 — Ship #2 v1)
2026-04-19 | v1.51-insider-programmatic | programmatic_page_with_unique_data + schema_markup_article_person_org | +60 vis/wk | TBD | TBD | ~25-30 new indexed URLs (one per unique insider) with Person schema + Article schema + conviction score unique per page. Targets branded queries like "tim cook insider trading" "warren buffett form 4" etc. Unique-data-per-page clears thin-content bar.

## Distribution Fit Log (v1.51)
2026-04-19 | v1.51-insider-deepening | SEO:0.75 SHARE:0.40 CHANNEL:0.70 LOOP:0.70 MOAT:0.60 | mean:0.63 | PASS | SEO: branded-person queries real. SHARE: no card v1. LOOP: insider → ticker → investor → insider via cross-links. MOAT: conviction-score synthesis (role × 10b5-1 × logistic) is non-trivial to replicate.

## Calibration
2026-04-20 12:39 | v1.54-monetization-layer | ai_visibility_optimized_page+programmatic_page_with_unique_data+schema_markup_article_person_org+internal_linking_hub_spoke+comparison_vs_competitor_page | archetypes_stacked:5 stacking_bonus:×1.40 | projected_weekly_vis_delta: +90 (Y1 peak from /for-ai ranking for "13F API" "hedge fund API" queries + LLM citations crediting /api-terms as license source) | actual_7d: TBD | actual_28d: TBD | confidence: 0.3 (cold) | hypothesis: +70 base (ai_visibility_optimized_page × +70) × domain_authority_5 × stacking_bonus_1.40 + 20 vis/wk from inbound email tail after /for-ai lands in AI-buyer searches
