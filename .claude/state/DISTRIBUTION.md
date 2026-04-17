# DISTRIBUTION.md — Distribution Oracle v1 (HoldLens)

Distribution model: **Organic SEO + social shares + cross-linking + viral
content loops**. Primary distribution window: **7-day organic traffic delta**
(Plausible `visitors` + GSC `clicks`). Secondary: 30-day compounding.

Baseline: **pre-traffic** (first Monday METRICS rollup once Plausible +
GSC data accumulates will seed the baseline). First calibration rows land
after traffic arrives.

## Archetype multipliers (v17.3 cold seeds, calibrated to SEO+social funnel)

```
SEO_page_addition             × +0.050   cold   (well-executed /learn article → 20-50 organic visitors/wk at maturity)
comparison_article_seo        × +0.070   cold   (comparison-intent queries have higher CTR + rich-result eligibility via FAQPage)
data_backed_insight           × +0.060   cold   (unique data angle = Google E-E-A-T lift + share-worthy)
dossier_depth_page            × +0.040   cold   (thick per-entity pages: /investor/[slug], /signal/[ticker], /sector/[slug])
schema_addition               × +0.015   cold   (JSON-LD → rich results → CTR lift)
internal_linking              × +0.020   cold   (graph density lifts PageRank distribution)
og_image_generation           × +0.025   cold   (social-share CTR lift on referral traffic)
share_button_addition         × +0.010   cold   (enables but doesn't drive shares)
sitemap_addition              × +0.012   cold   (unblocks crawl for missing URLs)
canonical_fix                 × +0.005   cold
robots_txt_fix                × +0.003   cold
core_web_vitals_improvement   × +0.018   cold   (CWV is a ranking signal)
distribution_loop_closure     × +0.030   cold   (ShareStrip + end-of-article CTA back to product)
thin_content_or_spam          × -0.500   HARD-NEG (penalty risk; scraped/AI-fluff content)
cleanup_refactor              × +0.000   always
pricing_page_change           × +0.000   cold   (conversion, not distribution)
signup_flow_change            × +0.000   cold
dark_pattern_anything         × -1.000   IMMUTABLE (I-23 + I-26 reject)
```

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
