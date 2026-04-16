# HoldLens — CONTEXT

## Orient
**Project:** HoldLens — 13F superinvestor tracker, Next.js 15 static export, Cloudflare Pages.
**State:** v1.24 shipped — GA4 property LIVE (G-HDK5CHBQEY). Public JSON API at 150 endpoints. All conversion measurement infrastructure now in place: GA4 + GSC link + AdSense link + retention 14mo + Google signals. Consent Mode v2 gates EU traffic per `app/layout.tsx:81-93`. Deploy pipeline: wrangler pages deploy out (NOT git-integrated — CRITICAL per KNOWLEDGE.md).
**Goal:** Revenue activation. 4 [👤] actions pending: Stripe, AdSense approval, Amazon Associates, broker affiliates. **GSC setup CLOSED 2026-04-16.**

## Session Handoff (2026-04-15 18:00 and 2026-04-16 00:15 — superseded by block below)

_Previous handoffs retained for context, replaced by the v1.24 sovereign-auto block._

## Session Handoff

**Mode:** sovereign auto
**Objective:** GA4 conversion instrumentation + state sync — sovereign auto continuation
**Progress:** v1.24 GA4 analytics stack COMPLETE. (1) Created GA4 property `holdlens.com` (account HoldLens 391571004, property 533294495, measurement ID `G-HDK5CHBQEY`) in paulomdevries@gmail.com. (2) Wired `NEXT_PUBLIC_GA4_ID` env var; built + deployed holdlens.com with GA tag firing (verified `page_view` hits via Chrome MCP network inspection + realtime panel showing 2 active users). (3) Post-setup via Chrome MCP: data retention 2mo→14mo, Google signals ON, GSC Domain property linked, AdSense `pub-7449214764048186` linked with Revenue Data Reporting ON, `purchase` key event auto-marked. (4) Commit `07dfe0364` on main — 2696 files (API JSON regen + OG regen + TASKS.md sync) pushed to acevaultorg/holdlens. (5) Deploy `32e59be1.holdlens.pages.dev` (CF dedupe → 0 new files, 0.70s). (6) KNOWLEDGE.md Analytics section added; ORACLE.md 4 new projection rows; TASKS.md closed stale gsc-setup + cf-deploy-v1.17-pending.
**Branch:** `main` · HEAD=07dfe0364 pushed to acevaultorg/holdlens.
**Next actions (operator — all [👤]):**
  1. **[P0 revenue]** Stripe env vars in CF Pages env → /pricing + /premium checkout activates.
  2. **[P0 revenue]** Amazon Associates signup (~24h review) + `NEXT_PUBLIC_AMZN_TAG` env → InvestingBooks affiliate funnel activates on /learn/*.
  3. **[P0 revenue]** AdSense approval (submitted 2026-04-14, status "Getting ready" in dashboard). Set `NEXT_PUBLIC_ADSENSE_CLIENT` post-approval → 32 ad slots activate.
  4. **[P1 distribution]** IBKR / Public / Robinhood affiliate signups → broker-referral revenue.
  5. **[P2]** Bing Webmaster Tools property (lower-impact organic channel).
**Next actions (pilot / Chief — P2 code hooks that need source edits):**
  6. **[P2]** Add explicit `gtag('event', 'begin_checkout', ...)` in `components/StripeCheckoutButton.tsx` onClick.
  7. **[P2]** Add explicit `gtag('event', 'purchase', ...)` on Stripe thank-you page.
  8. **[P2]** /compare/[pair] visual diff (Venn + convergence).
  9. **[P2]** Plausible custom events on /signal search / /value filter / /big-bets row-click.
**Human actions pending:** 4 — stripe-activate, amazon-associates-signup, adsense-approval-wait, affiliate-activate. (gsc-setup CLOSED in this session.)
**Open questions:** none. All conversion measurement infra in place; remaining revenue unlocks are platform-side.
**Momentum:** very high — GA4 stack landed, chrome-mcp-fix-all pass complete, 4 product-link integrations on the new property. Next traffic spike (organic/social) will produce the first Oracle calibration row per-archetype.
<!-- handoff: 2026-04-16 21:00 -->
**Objective:** Continuous revenue-adjacent shipping — SOVEREIGN AUTO
**Progress:** 3 tasks SHIPPED + DEPLOYED this session window: (1) v0.84 TickerLogo + FundLogo (Parqet CDN + DuckDuckGo ip3) sitewide + /support page + a11y focus-ring baseline → deploy e2b3c2de; (2) v0.85 InvestorConcentration server component (Top-1/5/10 % + verdict + stacked bar) on 14 manager slugs + warren-buffett dedicated page → deploy 4d460911; (3) TASKS.md bookkeeping — closed stock-alias, investor-viz, vs-dataroma, learn-handbook, quarterly-pages (all were shipped but marked open). Parallel sessions contributed heavily and attribution folded via absorption; all work preserved in origin/main. HEAD=62dba7445 + 4 further heartbeat commits.
**Branch:** `main` · pushed to origin. Local build artifacts in sync after v0.85 final build.
**Next actions:**
  1. Operator 👤: **P0 revenue unlock #1** — Stripe founders-tier activation (/pricing has full trust strip + CTA + €9 founders rate UI; just needs Stripe keys in CF env).
  2. Operator 👤: **P0 revenue unlock #2** — Amazon Associates signup (~24h review), then `NEXT_PUBLIC_AMZN_TAG=holdlens-20` in CF Pages env. Widget LIVE on /learn/superinvestor-handbook.
  3. Operator 👤: AdSense apply + NEXT_PUBLIC_ADSENSE_CLIENT env. Ad slots LIVE on 32 pages.
  4. Operator 👤: IBKR affiliate signup + NEXT_PUBLIC_AFF_IBKR env.
  5. Operator 👤: Google Search Console property + sitemap submit (blocks organic traffic unlock).
  6. Chief: P1 /compare/[pair] visual diff — Venn + convergence chart (id:compare-visual, score 8.0).
  7. Chief: P2 /api/v1/changelog.json feed (id:api-changelog, score 6.0).
  8. Chief: P2 Plausible custom events on /signal/[ticker] searches + /value filters + /big-bets clicks (id:plausible-events, score 7.0).
  9. Chief: P2 CSV exports on best-now/value/rotation/compare/consensus/contrarian (id:csv-exports, score 6.0).
  10. Chief: P2 /premium Stripe paywall UI build — [👤-after-build] (id:stripe-premium, score 15.0 — highest remaining Oracle score).
**Human actions pending:** 5 — stripe-activate, amazon-associates-signup, adsense-activate, affiliate-activate, gsc-setup.
**Open questions:** none — all revenue-activation paths have code shipped; revenue flow = operator env-var + platform signup.
**Momentum:** very high — 5 versions LIVE on prod in single session window (v0.80→v0.85), 3 P1 tasks closed, concentration + logo + a11y improvements compound across all tracked pages (94 signal + 14 investor + 100+ derived).
<!-- handoff: 2026-04-15 18:00 -->

## Ad placement map (v0.31)

| Page type | Count | Ad format | Component |
|---|---|---|---|
| Learn articles | 3 | in-article | AdSlot |
| Browse (activity, faq, about, etc.) | 8 | horizontal/in-article | AdSlot |
| Detail (investor, ticker, sector, quarterly, compare) | 9 | horizontal | AdSlot |
| Ticker detail | 1 | — | + AffiliateCTA |
| Remaining (simulate, proof, grand, docs, press, portfolio) | 6 | horizontal/in-article | AdSlot |
| Already had ads (signal, buys, sells, best-now, this-week, leaderboard) | 6 | various | AdSlot |
| **Total pages with ad slots** | **32** | | |
