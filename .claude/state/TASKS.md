# HoldLens — TASKS

## Queue (v0.40 — /big-bets size × conviction screen) — SHIPPED [objective:v40-big-bets]

- [x] `P1` BUILD app/big-bets/page.tsx server component — iterates all 30 managers × topHoldings, computes conviction score per ticker, combined bet score = positionPct × max(0, score), sorts top 50 [id:big-bets-server] [score:12.0] ⏱ done v0.40
- [x] `P1` ADD "Lone-wolf big bets" secondary ranking — concentrated positions (≥8%) in low-ownership names (≤3 owners) with positive conviction [id:lone-wolf] [score:9.0] ⏱ done v0.40
- [x] `P1` ADD CSV export + "Why this beats Dataroma" explainer section [id:big-bets-csv] [score:7.0] ⏱ done v0.40
- [x] `P0` WIRE /big-bets into header nav (lg+), mobile nav PRIMARY_LINKS, footer [id:wire-big-bets-nav] [score:8.0] ⏱ done v0.40
- [x] `P0` BUILD + verify static export — /big-bets 4.26 kB, clean compile [id:verify-v40] [score:10.0] ⏱ done
- [x] `P0` COMMIT + push [id:commit-v40] [score:10.0]

## Queue (v0.39 — per-manager RSS feeds) — SHIPPED [objective:v39-per-manager-rss]

- [x] `P1` BUILD app/investor/[slug]/feed.xml/route.ts dynamic RSS generator — 30 managers, last 40 moves each, sorted newest first, full action/delta/impact metadata [id:per-manager-feed] [score:10.0] ⏱ done v0.39
- [x] `P1` ADD RSS alternate metadata + visible chip to investor profile pages (generic + warren-buffett dedicated) so feed readers auto-discover [id:feed-discovery] [score:8.0] ⏱ done v0.39
- [x] `P0` BUILD + verify static export — all 30 per-manager feed.xml files generated [id:verify-v39] [score:10.0] ⏱ done
- [x] `P0` COMMIT + push [id:commit-v39] [score:10.0]

## Queue (v0.38 — /value killer combo page) — SHIPPED [objective:v38-smart-money-value]

- [x] `P0` BUILD app/value/page.tsx server component — top-50 buy candidates server-rendered, hero + explainer + cross-links [id:value-server] [score:13.0] ⏱ done v0.38
- [x] `P0` BUILD app/value/ValueClient.tsx client island — live quotes, threshold control (≤15/25/40/all), 52w range visualizer, blended value score sort [id:value-client] [score:13.0] ⏱ done v0.38
- [x] `P0` WIRE /value into header nav, mobile nav, footer [id:wire-value-nav] [score:10.0] ⏱ done v0.38
- [x] `P0` BUILD + verify static export — 488 HTML pages, /value 6.29 kB, zero errors [id:verify-v38] [score:11.0] ⏱ done
- [x] `P0` COMMIT + push [id:commit-v38] [score:10.0]

## Queue (v0.37 — Dataroma parity sweep) — SHIPPED [objective:v37-dataroma-parity]

- [x] `P1` BUILD components/SectorBreakdown.tsx server component — stacked bar + color-coded legend, groups holdings by sector [id:sector-component] [score:10.0] ⏱ done v0.37 ced5fe47
- [x] `P1` WIRE SectorBreakdown into /investor/[slug] + /investor/warren-buffett above Top holdings [id:wire-sector] [score:9.0] ⏱ done v0.37 ced5fe47
- [x] `P1` ADD "Most-owned by superinvestors" secondary ranking to /grand — raw ownership-count sort alternative to quality-weighted view [id:most-owned] [score:9.0] ⏱ done v0.37 ced5fe47
- [x] `P2` EXPORT SECTOR_MAP from lib/tickers.ts for reuse across components [id:export-sectormap] [score:5.0] ⏱ done v0.37
- [x] `P2` DELETE app/api/subscribe/route.ts dead placeholder (conflicted with CF Pages Function) [id:cleanup-api-route] [score:4.0] ⏱ done v0.37 ced5fe47
- [x] `P1` ADD %-above-52w-low column + "Near 52w low" filter + "Closest to 52w low" sort to /screener — Dataroma's power-user value-hunting view [id:screener-52w] [score:11.0] ⏱ done v0.37.1 bde924f0
- [x] `P0` BUILD + verify static export — 493 pages, zero errors [id:verify-v37] [score:11.0] ⏱ done
- [x] `P0` COMMIT + push [id:commit-v37] [score:10.0] ⏱ done — bde924f0 on acepilot/v0.25-unified-score

## Queue (v0.36 — Resend email capture wire) — SHIPPED [objective:v36-email-funnel]

- [x] `P1` BUILD functions/api/subscribe.ts — CF Pages Function replacing dead Next.js API route; honeypot + regex validation; graceful pre-activation (200 w/ pending:true if RESEND_API_KEY missing); Resend audiences contact add + welcome email in parallel [id:cf-function] [score:10.0] ⏱ done v0.36
- [x] `P1` UPDATE EmailCapture.tsx to POST /api/subscribe with honeypot field + localStorage fallback (signups NEVER lost on network error) [id:wire-form] [score:9.0] ⏱ done v0.36
- [x] `P1` APPEND Resend activation guide to HUMAN_ACTIONS.md — domain verify, audience, API key, Cloudflare env vars, e2e verification [id:resend-guide] [score:8.0] ⏱ done v0.36
- [x] `P0` BUILD + verify static export + CF Function bundling [id:verify-v36] [score:11.0] ⏱ done — 491 pages, zero errors
- [x] `P0` COMMIT + push [id:commit-v36] [score:10.0] ⏱ done — 32e14c6b on acepilot/v0.25-unified-score
- [👤] `P0` DEPLOY wrangler + verify live POST /api/subscribe — Cloudflare Pages auto-deploys from git; verify at https://holdlens.com/api/subscribe after CF build completes [id:deploy-v36] [score:11.0]
- [👤] `P1` ACTIVATE Resend — signup + DNS verify + audience + API key + 3 env vars in CF Pages + rebuild. Guide in HUMAN_ACTIONS.md. Flip one env var = real emails start sending [id:resend-activate] [score:12.0] 👤 guide generated

## Queue (v0.29 — OG images + pricing AB + backtest share) [objective:v29-viral-seo-conversion]

- [x] `P0` BUILD per-ticker OG images for 94 /signal pages via satori+sharp prebuild script [id:og-images] [score:12.0] ⏱ done — scripts/generate-og-images.ts, 94 PNGs in public/og/signal/
- [x] `P0` WIRE OG images into signal page metadata (openGraph + twitter) [id:wire-og] [score:11.0] ⏱ done — per-ticker /og/signal/TICKER.png references
- [x] `P1` ADD pricing AB test variants ($13/$14/$15) with cookie segmentation + Plausible tracking [id:price-ab] [score:10.0] ⏱ done — PricingAB.tsx, 90-day cookie, 3 variants
- [x] `P1` BUILD BacktestShareCard — canvas PNG download + tweet for every backtest result [id:backtest-share] [score:9.0] ⏱ done — wired into Backtest + ManagerBacktest
- [x] `P0` BUILD + verify static export (490 pages) [id:verify-v29] [score:11.0] ⏱ done
- [x] `P0` COMMIT + push [id:commit-v29] [score:10.0] ⏱ done — 2 commits (8ad99a9b + 094df7c5), pushed

## Queue (v0.28 — viral share cards + revenue activation) — SHIPPED [objective:v28-viral-and-revenue]

- [x] `P0` BUILD components/SignalShareCard.tsx — canvas PNG render of ticker + verdict + score + HoldLens branding, download + copy-tweet + share-to-Twitter/LinkedIn. Pattern-matches PortfolioShareCard. Highest-leverage viral unlock per /signal/[ticker] — every share = brand impression × follower count [id:signal-share-card] [score:12.0] ⏱ done — canvas 1200x630, SSR-safe, Plausible events wired
- [x] `P0` WIRE SignalShareCard into /signal/[ticker]/page.tsx — place after verdict + score breakdown, before LiveQuote [id:wire-signal-share] [score:11.0] ⏱ done — passes ticker/name/sector/verdict/score/convictionLabel/buyerCount/sellerCount/topStreak/ownerCount
- [x] `P0` BUILD + verify static export — 483 HTML pages, 94 signal dossiers, zero errors [id:verify-v28] [score:13.0] ⏱ done — next build clean after sector?:string fix
- [x] `P0` COMMIT + push [id:commit-v28] [score:12.0] ⏱ done — 2 commits (code cd8d51e7 + rebuild cc016f75), pushed to origin/acepilot/v0.25-unified-score
- [👤] `P1` ACTIVATE Stripe Payment Link — create HoldLens Pro product ($9/mo founders + $14/mo standard), generate payment link, paste NEXT_PUBLIC_STRIPE_PAYMENT_LINK + NEXT_PUBLIC_STRIPE_PAYMENT_LINK_FOUNDERS into Cloudflare Pages env vars, redeploy. Guide in HUMAN_ACTIONS.md. Wire already exists in components/StripeCheckoutButton.tsx — ONE env var = live revenue [id:stripe-activate] [score:13.0] 👤 guide generated

## Queue (v0.26 — copy parity with the unified score) — SHIPPED [objective:v26-copy-parity]

- [x] `P0` REWRITE /learn/conviction-score-explained — describe the SHIPPED v4 unified signed −100..+100 score [id:learn-page] [score:13.0] ⏱ done v0.26 71b76788
- [x] `P0` REWRITE /pricing Pro tier — email alerts + EDGAR + API + custom watchlists [id:pricing-pro] [score:13.0] ⏱ done v0.26 71b76788
- [x] `P0` REWRITE /pricing Free tier — unified signed score, dossiers, screener, portfolio, leaderboard [id:pricing-free] [score:12.0] ⏱ done v0.26 71b76788
- [x] `P0` UPDATE homepage hero copy — "single signed −100..+100 conviction scale" [id:home-hero] [score:11.0] ⏱ done v0.26 71b76788
- [x] `P0` UPDATE homepage "Conviction-scored" feature card [id:home-feature] [score:9.0] ⏱ done v0.26 71b76788
- [x] `P1` UPDATE /best-now meta description — v3 → v4 [id:bestnow-meta] [score:6.0] ⏱ done v0.26 cc344b70
- [x] `P1` UPDATE /what-to-sell meta description [id:wts-meta] [score:6.0] ⏱ done v0.26 cc344b70
- [x] `P1` UPDATE /press-kit launch posts [id:press-kit] [score:8.0] ⏱ done v0.26 cc344b70
- [x] `P1` SCAN /faq + /this-week + /signal/[ticker] for stale refs [id:scan-rest] [score:5.0] ⏱ done v0.26 cc344b70 + eae87545
- [x] `P0` BUILD + verify static export (490 pages) [id:verify] [score:11.0] ⏱ done v0.27 fd6e3f61
- [x] `P0` DEPLOY to Cloudflare Pages + verify live [id:deploy] [score:12.0] ⏱ done v0.27 — f419fbb0.holdlens.pages.dev
- [x] `P0` COMMIT + push [id:commit] [score:11.0] ⏱ done v0.27 f3ae1d7c

## Queue (v0.18 — Pricing + alerts + insiders + screener save) — SHIPPED [objective:v18-monetize-prep]

- [x] `P0` BUILD /pricing page — 2-tier (Free + Pro $14/mo), early-access waitlist email capture, FAQ [id:pricing-page] [score:13.0] ⏱ done
- [x] `P0` BUILD /alerts page — buy/sell signal email signup, next filing deadline display, Pro upsell [id:alerts-page] [score:12.0] ⏱ done
- [x] `P1` BUILD lib/insiders.ts — curated SEC Form 4 data for 21+ tickers (CEO/CFO buys + sells with values, dates, notes) [id:insiders-lib] [score:10.0] ⏱ done
- [x] `P1` BUILD components/InsiderActivity.tsx — server component, Net Signal badge, color-coded buy/sell rows [id:insider-component] [score:10.0] ⏱ done
- [x] `P1` WIRE InsiderActivity into /ticker/[symbol] and /signal/[ticker] [id:wire-insider] [score:9.0] ⏱ done
- [x] `P2` ADD screener save filter — localStorage SavedFilter type, save/load/clear buttons, auto-load on mount [id:screener-save] [score:8.0] ⏱ done
- [x] `P2` ADD CSV export to /screener and /this-week [id:csv-everywhere] [score:7.0] ⏱ done
- [x] `P0` ADD /pricing + /alerts to layout nav (header w/ 'Pro' brand-colored, footer) [id:nav-v18] [score:9.0] ⏱ done
- [x] `P0` BUILD + verify static export — 481 pages [id:verify] [score:12.0] ⏱ done

## Queue (v0.31 — AdSense + affiliate ad placements) [objective:v31-ad-revenue]

- [x] `P0` WIRE AdSlot into 3 learn pages (what-is-a-13f, copy-trading-myth, conviction-score-explained) [id:ads-learn] [score:11.0] ⏱ done
- [x] `P0` WIRE AdSlot into 8 browse pages (activity, faq, about, top-picks, insiders, methodology, screener, compare/managers) [id:ads-browse] [score:11.0] ⏱ done
- [x] `P0` WIRE AdSlot + AffiliateCTA into 9 detail pages (investor, ticker, sector, quarterly, compare) [id:ads-detail] [score:12.0] ⏱ done
- [x] `P0` WIRE AdSlot into 6 remaining pages (simulate, proof, grand, docs, press, portfolio) [id:ads-remaining] [score:10.0] ⏱ done
- [x] `P0` BUILD + verify static export [id:verify-v31] [score:13.0] ⏱ done v0.35/v0.35.1 — 42/42 tier matrix pass (build) + 35/35 live
- [x] `P0` COMMIT + push [id:commit-v31] [score:12.0] ⏱ done v0.35.1 bfc0bb45 — warren-buffett Tier B AdSlot added
- [~] `P0` ACTIVATE Google AdSense — account + pub ID already active (ca-pub-7449214764048186). Verification script + ads.txt deployed to holdlens.com. Site ownership verified via ads.txt method. Submitted for Google review 2026-04-14 (status: "Getting ready"). Awaiting Google approval (1-14 days). After approval, need to create ad units in AdSense dashboard and set NEXT_PUBLIC_ADSENSE_SLOT_* env vars to activate rendering in AdSlot components [id:adsense-activate] [score:14.0]
- [👤] `P1` ACTIVATE brokerage affiliate links — IBKR ($200/account), Public ($25-50), moomoo ($20-100). Set NEXT_PUBLIC_AFF_* env vars. Guide in HUMAN_ACTIONS.md [id:affiliate-activate] [score:13.0]

## Queue (v0.19 — next session)

- [x] `P1` ADD pre-generated OG images per /signal/[ticker] via satori at build time [id:og-images] [score:8.0] ⏱ done v0.29
- [x] `P1` ADD /pricing AB test variants (charm pricing $13, $14, $15) [id:price-ab] [score:6.0] ⏱ done v0.29
- [x] `P2` ADD shareable backtest result cards (canvas → image download) [id:backtest-share] [score:6.0] ⏱ done v0.29
- [x] `P2` BUILD /changelog page from git log [id:changelog] [score:5.0] ⏱ done v0.27
- [x] `P2` BUILD insider activity page /insiders [id:insider-page] [score:6.0] ⏱ done v0.27
- [x] `P2` ADD trend badge to /signal verdict box [id:verdict-trend] [score:5.0] ⏱ done v0.27
- [x] `P1` ADD homepage testimonials/social-proof block (placeholder until first real users) [id:testimonials] [score:5.0] ⏱ done v0.30 aa50f2d5
- [x] `P2` BUILD /docs API documentation page (Pro feature preview) [id:docs] [score:5.0] ⏱ done v0.30 aa50f2d5

## Queue (v0.2 larger infra)

- [x] `P0` DEPLOY v0.13+v0.14+v0.15+v0.16+v0.17+v0.18 to Cloudflare Pages [id:deploy] [score:13.0] ⏱ done
- [x] `P0` HOTFIX: Cloudflare Worker yahoo-proxy unblocks live data in production [id:worker-proxy] [score:13.0] ⏱ done
- [x] `P0` BUILD EDGAR 13F parser (21 managers, 168 filings, 22K moves from SEC EDGAR API) [id:edgar] [score:11.0] ⏱ done v0.31 b98c28f4+20e5b9e4
- [x] `P1` INTEGRATE Resend for email alerts [id:resend] [score:9.0] ⏱ done v0.36 — functions/api/subscribe.ts CF Pages Function, graceful pre-activation, EmailCapture POSTs w/ honeypot + localStorage fallback, HUMAN_ACTIONS.md guide
- [x] `P1` BUILD Stripe Pro tier checkout [id:stripe] [score:11.0] ⏱ done (StripeCheckoutButton.tsx Payment Link integration shipped, activation is [👤] stripe-activate)
- [ ] `P1` BUILD Claude Haiku thesis generator per ticker/manager [id:ai-thesis] [score:8.0]
- [ ] `P2` BUILD X (formerly Twitter) bot posting top buy/sell signals [id:x-bot] [score:7.0]
- [ ] `P2` BUILD public API + embeds [id:api] [score:7.0]
