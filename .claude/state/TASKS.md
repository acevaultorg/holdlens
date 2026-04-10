# HoldLens — TASKS

## Queue (v0.1 → v0.17 shipped)
- [x] Prior v0.1–v0.17 work — see git log `acepilot: v0.X` commits

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
- [ ] `P2` BUILD /changelog page from git log [id:changelog] [score:5.0]
- [ ] `P2` ADD shareable backtest result cards (canvas/svg → image download) [id:backtest-share] [score:6.0]
- [ ] `P2` BUILD insider activity page /insiders showing all recent buys [id:insider-page] [score:6.0]
- [ ] `P2` ADD trend badge to /signal verdict box [id:verdict-trend] [score:5.0]

## Queue (v0.2 larger infra)

- [👤] `P0` DEPLOY v0.13+v0.14+v0.15+v0.16+v0.17+v0.18 to Vercel/Cloudflare [id:deploy] [score:13.0] platform:vercel
- [ ] `P0` BUILD Python EDGAR 13F parser (path to 80+ managers) [id:edgar] [score:11.0]
- [ ] `P1` INTEGRATE Resend for email alerts (the /alerts page is waiting on this) [id:resend] [score:9.0]
- [ ] `P1` BUILD Stripe Pro tier checkout (the /pricing page is waiting on this) [id:stripe] [score:11.0]
- [ ] `P1` BUILD Claude Haiku thesis generator per ticker/manager [id:ai-thesis] [score:8.0]
- [ ] `P2` BUILD Twitter bot posting top buy/sell signals [id:twitter-bot] [score:7.0]
- [ ] `P2` BUILD public API + embeds [id:api] [score:7.0]

## Queue (v0.5 — monetization launch)

- [ ] `P0` LAUNCH Pro tier ($14/mo) — Stripe + waitlist conversion [id:pro-launch] [score:12.0]
- [ ] `P0` BUILD Manager Alpha Attribution — realized alpha vs S&P per manager [id:alpha-attribution] [score:11.0]
- [ ] `P0` BUILD Conviction Score v2 — per-ticker per-manager 0-100 with trend weighting [id:conviction-v2] [score:11.0]
