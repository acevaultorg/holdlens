# HoldLens — TASKS

## Queue (v0.1 → v0.16 shipped)
- [x] Prior v0.1–v0.16 work — see git log `acepilot: v0.X` commits

## Queue (v0.17 — Earnings + trend badges + SEO + RSS + retention) — SHIPPED [objective:v17-retention]

- [x] `P1` BUILD lib/earnings.ts — Yahoo quoteSummary API (calendarEvents.earnings) with corsproxy fallback, 1h sessionStorage cache [id:earnings-lib] [score:11.0] ⏱ done
- [x] `P1` BUILD components/TickerEarnings.tsx — next earnings date + EPS estimate/actual + beat/miss color coding [id:earnings-component] [score:10.0] ⏱ done
- [x] `P1` WIRE TickerEarnings into /ticker/[symbol] and /signal/[ticker] [id:wire-earnings] [score:10.0] ⏱ done
- [x] `P1` BUILD components/TrendBadge.tsx — multi-quarter conviction badge ("3Q BUY", "2Q SELL") server component [id:trend-badge] [score:10.0] ⏱ done
- [x] `P1` WIRE TrendBadge into /top-picks, /grand, /buys, /sells, /this-week [id:wire-trend] [score:9.0] ⏱ done
- [x] `P0` BUILD /what-to-buy SEO alias route — top 10 buys, canonical to /buys, high-intent SEO copy [id:seo-buy] [score:11.0] ⏱ done
- [x] `P0` BUILD /what-to-sell SEO alias route — top 10 sells, canonical to /sells [id:seo-sell] [score:11.0] ⏱ done
- [x] `P1` BUILD /buys.xml RSS feed — force-static route handler, 20 top buy signals with quality-weighted buyer lists [id:rss-buys] [score:9.0] ⏱ done
- [x] `P1` BUILD /sells.xml RSS feed — same for sell signals [id:rss-sells] [score:9.0] ⏱ done
- [x] `P1` BUILD /compare/managers index page — 105 head-to-head pairs grouped by first manager [id:compare-index] [score:8.0] ⏱ done
- [x] `P0` BUILD /this-week page — top buys + top sells + quarter info + quick links (retention surface) [id:this-week] [score:11.0] ⏱ done
- [x] `P0` WIRE /this-week + /screener + /compare links to layout nav (header + footer) [id:nav-v17] [score:9.0] ⏱ done
- [x] `P0` BUILD + verify static export — 479 pages [id:verify] [score:12.0] ⏱ done

## Queue (v0.18 — next session)

- [ ] `P1` ADD pre-generated OG images per /signal/[ticker] via @vercel/og or satori [id:og-images] [score:8.0]
- [ ] `P1` ADD insider transactions per ticker (SEC Form 4 light approximation) [id:insider-tx] [score:6.0]
- [ ] `P1` ADD /alerts page (email signup for buy/sell signals — depends on Resend in v0.2) [id:alerts] [score:7.0]
- [ ] `P2` ADD screener: "save filter" feature (localStorage) [id:screener-save] [score:5.0]
- [ ] `P2` ADD news component to /signal/[ticker] sidebar instead of full-width section [id:news-sidebar] [score:5.0]
- [ ] `P2` ADD /pricing page (preview of Pro tier — non-functional CTA, email capture) [id:pricing-preview] [score:7.0]
- [ ] `P2` ADD CSV export to /this-week and /screener [id:csv-everywhere] [score:5.0]
- [ ] `P2` ADD homepage testimonials section (placeholder until first real users) [id:testimonials] [score:4.0]

## Queue (v0.2 larger infra)

- [👤] `P0` DEPLOY v0.13+v0.14+v0.15+v0.16+v0.17 to Vercel/Cloudflare [id:deploy] [score:13.0] platform:vercel
- [ ] `P0` BUILD Python EDGAR 13F parser (path to 80+ managers) [id:edgar] [score:11.0]
- [ ] `P1` INTEGRATE Resend for email alerts on buy/sell signals [id:resend] [score:9.0]
- [ ] `P1` BUILD Claude Haiku thesis generator per ticker/manager [id:ai-thesis] [score:8.0]
- [ ] `P2` BUILD Twitter bot posting top buy/sell signals [id:twitter-bot] [score:7.0]
- [ ] `P2` BUILD public API + embeds [id:api] [score:7.0]

## Queue (v0.5 — monetization)

- [ ] `P0` LAUNCH Pro tier ($14/mo) — Stripe, pricing AB test [id:pro-tier] [score:12.0]
- [ ] `P0` BUILD Manager Alpha Attribution — realized alpha vs S&P per manager [id:alpha-attribution] [score:11.0]
