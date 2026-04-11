# HoldLens — TASKS

## Queue (v0.26 — copy parity with the unified score)

[objective:v26-copy-parity]

- [ ] `P0` REWRITE /learn/conviction-score-explained — describe the SHIPPED v4 unified signed −100..+100 score, kill the "coming in v0.4" lie [id:learn-page] [score:13.0]
- [ ] `P0` REWRITE /pricing Pro tier — stop selling "Conviction Score v2 — 0-100 algorithmic score" because the unified ConvictionScore v4 is in Free. Position Pro as email alerts + EDGAR + API + alpha attribution + custom watchlists [id:pricing-pro] [score:13.0]
- [ ] `P0` REWRITE /pricing Free tier — list the actual shipped features (unified signed score, dossier pages, screener, portfolio, leaderboard, /best-now, etc) [id:pricing-free] [score:12.0]
- [ ] `P0` UPDATE homepage hero copy — "ranked by a multi-factor recommendation model" → "ranked on a single signed −100..+100 conviction scale" [id:home-hero] [score:11.0]
- [ ] `P0` UPDATE homepage "Conviction-scored" feature card — body should describe the unified scale, not vague "filters rebalances" [id:home-feature] [score:9.0]
- [ ] `P1` UPDATE /best-now meta description — "ConvictionScore v3" → "ConvictionScore v4" [id:bestnow-meta] [score:6.0]
- [ ] `P1` UPDATE /what-to-sell meta description — drop "exit-share weighting, dump severity" (no longer in the score), describe the unified signed scale [id:wts-meta] [score:6.0]
- [ ] `P1` UPDATE /press-kit launch posts — Show HN + Reddit + Twitter copy must mention the unified score, not the old multi-factor model [id:press-kit] [score:8.0]
- [ ] `P1` SCAN /faq + /this-week + /signal/[ticker] for any remaining stale references [id:scan-rest] [score:5.0]
- [ ] `P0` BUILD + verify static export [id:verify] [score:11.0]
- [ ] `P0` DEPLOY to Cloudflare Pages + verify live [id:deploy] [score:12.0]
- [ ] `P0` COMMIT + push [id:commit] [score:11.0]

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

## Queue (v0.19 — next session)

- [ ] `P1` ADD pre-generated OG images per /signal/[ticker] via @vercel/og or satori at build time [id:og-images] [score:8.0]
- [ ] `P1` ADD homepage testimonials/social-proof block (placeholder until first real users) [id:testimonials] [score:5.0]
- [ ] `P1` ADD /pricing AB test variants (charm pricing $13, $14, $15) [id:price-ab] [score:6.0]
- [ ] `P2` BUILD /docs API documentation page (Pro feature preview) [id:docs] [score:5.0]
- [x] `P2` BUILD /changelog page from git log [id:changelog] [score:5.0] ⏱ done — v0.27, 26 releases, Article JSON-LD, footer + MobileNav + sitemap wired
- [ ] `P2` ADD shareable backtest result cards (canvas/svg → image download) [id:backtest-share] [score:6.0]
- [x] `P2` BUILD insider activity page /insiders showing all recent buys [id:insider-page] [score:6.0] ⏱ done — v0.27, promoted from draft, ported theme, added net-flow summary card, deep-linked to /signal dossiers, Dataset JSON-LD
- [x] `P2` ADD trend badge to /signal verdict box [id:verdict-trend] [score:5.0] ⏱ done — v0.27, TrendBadge now inline with the big BUY/SELL/NEUTRAL verdict

## Queue (v0.2 larger infra)

- [x] `P0` DEPLOY v0.13+v0.14+v0.15+v0.16+v0.17+v0.18 to Cloudflare Pages [id:deploy] [score:13.0] ⏱ done
- [x] `P0` HOTFIX: Cloudflare Worker yahoo-proxy unblocks live data in production [id:worker-proxy] [score:13.0] ⏱ done
- [ ] `P0` BUILD Python EDGAR 13F parser (path to 80+ managers) [id:edgar] [score:11.0]
- [ ] `P1` INTEGRATE Resend for email alerts [id:resend] [score:9.0]
- [ ] `P1` BUILD Stripe Pro tier checkout [id:stripe] [score:11.0]
- [ ] `P1` BUILD Claude Haiku thesis generator per ticker/manager [id:ai-thesis] [score:8.0]
- [ ] `P2` BUILD Twitter bot posting top buy/sell signals [id:twitter-bot] [score:7.0]
- [ ] `P2` BUILD public API + embeds [id:api] [score:7.0]
