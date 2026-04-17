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
