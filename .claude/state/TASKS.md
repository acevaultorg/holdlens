# HoldLens — TASKS

## Queue (v0.1 shipped)
- [x] `P0` SCAFFOLD · landing · Buffett backtest + profile · sitemap · JSON-LD

## Queue (v0.13 — Live data + watchlist + search) — SHIPPED
- [x] `P0` lib/live.ts + LiveQuote + LiveChart + StarButton + Watchlist + GlobalSearch
- [x] `P0` Wiring into ticker/investor/top-picks/layout
- [x] `P1` lib/filings.ts + "since last filing" badges

## Queue (v0.14 — Buy/Sell recommendation model + Dataroma beat) — SHIPPED [objective:beat-dataroma]

- [x] `P0` BUILD lib/moves.ts — rich schema: action, deltaPct, shareChange, portfolioImpactPct, Q3+Q4 2025 [id:moves-lib] [score:13.0] ⏱ done
- [x] `P0` EXPAND lib/managers.ts — +8 Tier-1 managers (Viking/Halvorsen, TCI/Hohn, ValueAct/Ubben, Lone Pine/Mandel, Maverick/Ainslie, Akre, Fundsmith/Smith, Polen) [id:managers-expand] [score:12.0] ⏱ done
- [x] `P0` BUILD lib/signals.ts — multi-factor buy/sell recommendation model (quality × consensus × conviction × freshness) [id:signals-lib] [score:13.0] ⏱ done
- [x] `P0` BUILD components/TickerActivity.tsx — Dataroma-beat activity feed w/ tabs, quarter groups, manager quality badges [id:ticker-activity] [score:13.0] ⏱ done
- [x] `P0` WIRE TickerActivity into /ticker/[symbol] page [id:wire-activity] [score:12.0] ⏱ done
- [x] `P0` BUILD /buys page — ranked buy signals with score, buyer badges, live prices [id:buys-page] [score:13.0] ⏱ done
- [x] `P0` BUILD /sells page — ranked sell signals with score, seller badges, live prices [id:sells-page] [score:12.0] ⏱ done
- [x] `P1` BUILD /activity page — global chronological moves feed [id:activity-page] [score:10.0] ⏱ done
- [x] `P1` BUILD /grand page — quality-weighted consensus portfolio [id:grand-page] [score:9.0] ⏱ done
- [x] `P0` BUILD InvestorMoves component + wire into /investor/[slug] + warren-buffett [id:investor-moves] [score:11.0] ⏱ done
- [x] `P0` BUILD BuySellSignals homepage card + wire into homepage with new copy [id:homepage-signals] [score:12.0] ⏱ done
- [x] `P0` WIRE new pages into header + footer nav [id:wire-nav] [score:10.0] ⏱ done
- [x] `P0` BUILD + verify static export (253 pages, 0 errors) [id:verify] [score:12.0] ⏱ done

## Queue (v0.15 — next session)

- [ ] `P1` RECOMPUTE homepage stats from live data (currently hardcoded $1.5T removed, live stats partial) [id:live-stats] [score:7.0]
- [ ] `P1` ADD sector heatmap on /top-picks and /grand pages (day change color grid) [id:heatmap] [score:6.0]
- [ ] `P1` ADD /ticker TickerNews via Yahoo Finance search API [id:news] [score:7.0]
- [ ] `P1` ADD /buys and /sells RSS feed endpoints [id:rss-signals] [score:6.0]
- [ ] `P1` ADD more managers (target 30+ — need Druckenmiller's Duquesne, TIGER/Coleman, Appaloosa/Tepper, Baupost separate entity, Viking is separate from Coleman) [id:more-managers] [score:7.0]
- [ ] `P1` ADD Q1 2025 + Q2 2025 historical moves data (multi-quarter trending) [id:historical-moves] [score:8.0]
- [ ] `P2` ADD "since last filing" price change column to investor holdings (delta % since filing date) [id:since-filing] [score:6.0]
- [ ] `P2` ADD /signal/[ticker] dedicated page — full buy/sell dossier per stock [id:signal-page] [score:6.0]
- [ ] `P2` ADD compare-managers page (2 managers side-by-side moves) [id:compare-mgrs] [score:5.0]
- [ ] `P2` ADD download-CSV button on /grand, /buys, /sells [id:csv-export] [score:5.0]

## Queue (v0.2 larger infra)

- [👤] `P0` DEPLOY v0.14 build to Vercel/Cloudflare [id:deploy-v014] [score:13.0] platform:vercel
- [ ] `P0` BUILD Python EDGAR 13F parser (replaces lib/moves.ts manual curation) [id:edgar] [score:11.0]
- [ ] `P0` ADD Postgres + 82-manager coverage [id:postgres-scale] [score:11.0]
- [ ] `P1` INTEGRATE Resend for email alerts on buy/sell signals [id:resend] [score:9.0]
- [ ] `P1` BUILD Claude Haiku thesis generator for each ticker/investor [id:ai-thesis] [score:8.0]
- [ ] `P2` BUILD Twitter bot posting top buy/sell signals after each filing [id:twitter-bot] [score:7.0]
- [ ] `P2` BUILD public API + embeds [id:api] [score:7.0]

## Queue (v0.5 — monetization)

- [ ] `P0` LAUNCH Pro tier ($14/mo) — AB-tested pricing, Stripe wired [id:pro-tier] [score:12.0]
- [ ] `P0` BUILD Conviction Score — per-ticker per-manager algorithmic score, live-updating [id:conviction-score] [score:12.0]
- [ ] `P0` BUILD Manager Alpha Attribution — per-manager running alpha vs S&P based on tracked moves + live prices [id:alpha-attribution] [score:11.0]
