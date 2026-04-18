# LEARNED.md — HoldLens compounding knowledge (v18.0)

**Invariant:** I-30 (append-only). Row deletions forbidden. Corrections in
`## Corrections` with `corrects: <timestamp>` field.

**Target:** I-28 auto-calibration fires when any archetype accumulates ≥10
ship-outcome rows AND mean (actual / projected) ratio diverges >25%. Bounded
auto-correction ±50% per cycle logs to `## Multiplier Corrections`.

## Project context

- **Product:** HoldLens (holdlens.com) — quarterly 13F-tracking for 30
  superinvestors; static Next.js export on Cloudflare Pages.
- **Domain authority (DA/DR):** 5 estimated (new 2026 launch, pre-indexation maturity).
- **Primary distribution channels:** organic SEO (/learn articles,
  programmatic /signal + /investor + /sector pages, comparison pages),
  social shares (ShareStrip on 240+ pages), email digest (Resend verified,
  awaiting first send), RSS feeds (per-ticker + per-manager).
- **Baseline weekly revenue:** €0 (pre-monetization — Stripe env vars pending).
- **Baseline weekly visitors:** pre-traffic (first Monday METRICS rollup
  will seed once GSC + Plausible accumulate ≥7d of data).
- **Baseline 7d retention:** unknown (Plausible returning-visitor % waits
  for data accumulation).

## Ship outcomes (append-only)

<!-- Format: timestamp | project | archetype | projected | actual_d7 | actual_d30 | ratio | note -->

```
2026-04-17 15:35 | holdlens | SEO_page_addition (comparison_article) | proj:+3 vis/wk, +€3/wk | TBD | TBD | TBD | v1.33 /learn/13f-vs-13d-vs-13g — 2500-word signal-spectrum comparison targeting ~5,200/mo query cluster. FAQ schema + Article + BreadcrumbList + 3 DefinedTerm. @craftsman Love 0.80 PASS · @distributor Fit 0.78 PASS. MOBILE-VERIFY: pass.
2026-04-17 11:48 | holdlens | SEO_page_addition (editorial_long_form) | proj:+3 vis/wk | TBD | TBD | TBD | v1.32 /learn/survivorship-bias-in-hedge-funds — 2500-word editorial targeting ~7,000/mo query cluster. Thick-content HCU-safe; honest selection-effect POV.
2026-04-17 09:15 | holdlens | craftsmanship_polish (semantic_colors) | proj:+0.006 Δ 7d-return, €0/wk | TBD | TBD | TBD | v1.09 MobileNav semantic color system — removed brand-rotation violating tailwind.config.ts reserved-use rule. Semantic-only: buy/sell/info/brand. @craftsman Love 0.78 PASS.
```

## Multiplier Corrections

<!-- I-28 auto-calibration writes append-only rows here.
     Format: timestamp | archetype | old_mult | new_mult | n_samples | mean_ratio | bounded_to_±50% | reason -->

```
(none yet — waiting for 10+ same-archetype ship outcomes with 7d actuals)
```

## LLM-citation learnings (10-characteristic checklist, Aleyda Solis 2026)

Applied by @distributor in grow mode. HoldLens per-characteristic status:

| # | Characteristic | HoldLens status | Evidence |
|---|---|---|---|
| 1 | Accessible | ✓ STRONG | static export, SSR'd HTML, no JS-gated content on /learn or /investor or /signal |
| 2 | Useful | ✓ STRONG | unique data (30 superinvestors × 8 quarters × 94 tickers = dossier depth no competitor ships) |
| 3 | Recognizable | 🟡 MODERATE | HoldLens name consistent; no Wikipedia entry yet, no About-author schema |
| 4 | Extractable | ✓ STRONG | FAQ schema on /learn articles; quote-ready section headings; DefinedTerm about-entities |
| 5 | Consistent | 🟡 MODERATE | brand voice consistent across /learn; brand visual consistent; no third-party profile consistency check done |
| 6 | Corroborated | 🔴 WEAK | no Reddit presence, no LinkedIn presence, no tier-1 media pickup, no Wikipedia citation — major GEO gap |
| 7 | Credible | 🟡 MODERATE | methodology page exists; author identity not yet stamped on every article; E-E-A-T signals thin |
| 8 | Differentiated | ✓ STRONG | "signal spectrum" framing on v1.33, honest survivorship-bias POV on v1.32, composite ConvictionScore |
| 9 | Fresh | ✓ STRONG | 13F data refreshed per filing cycle; last published 2026-04-17 |
| 10 | Transactable | 🟡 MODERATE | /pricing live; Stripe payment link env vars not yet set (operator-gated) |

**LLM-visibility gap priorities** (cycle 12+ candidates):
1. Reddit-organic-helpful-comment archetype (×+70 per v18 calibrated multipliers) — post substantive answers in r/SecurityAnalysis, r/ValueInvesting, r/investing citing HoldLens data naturally
2. LinkedIn zero-click framework posts (×+65) — operator-published short essays linking back
3. Per-article author byline + Person schema (schema_markup_article_person_org ×+20 — closes E-E-A-T gap)
4. Wikipedia-sourced edit (×+75) — create or edit hedge-fund / 13F Wikipedia entries citing HoldLens as reference
5. Shareable tool / calculator (×+65) — e.g., "what would $10K in Buffett's 1990 portfolio be worth today?"

## Fleet-level observations

<!-- Fleet rollup rows from ~/.claude/fleet/LEARNED.md are read at ABSORB
     step 13f. Per-project ship outcomes flow upward via CSIL cycles. -->

```
(waiting for fleet-rollup seed — HoldLens is first project in VAULT01 to
initialize LEARNED.md under v18.0 spec)
```

## Failure modes logged (append-only)

<!-- Pattern repeats 3+ → CSIL proposal for rules/[pattern].md -->

```
2026-04-17 | CF Pages EPIPE at ~56MB upload — retry 1-2 succeeds (known class). Rule: rules/cloudflare-pages-epipe.md (max 3 retries then [👤]).
2026-04-15 | 4-day deploy gap — CF Pages project NOT git-integrated. Rule: always manual wrangler deploy post-build. Documented in KNOWLEDGE.md.
```

## Corrections

<!-- Append-only. Format: corrects: <timestamp> | reason | new_value -->
