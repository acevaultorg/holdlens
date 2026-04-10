# HoldLens — TASKS

## Queue (v0.1 shipped) · (v0.13 shipped) · (v0.14 shipped)
- [x] Prior v0.1–v0.14 work — see git log `acepilot: v0.X` commits

## Queue (v0.15 — Signal dossier + news + trend + heatmap + CSV) — SHIPPED [objective:signal-dossier]

- [x] `P0` EXTEND lib/moves.ts — Q1 + Q2 2025 historical moves (4 quarters total) [id:historical-moves] [score:12.0] ⏱ done
- [x] `P0` EXTEND lib/signals.ts — consecutive-quarter trend detection + getTickerTrend() [id:trend-detection] [score:11.0] ⏱ done
- [x] `P1` BUILD lib/news.ts — Yahoo Finance search API client with corsproxy fallback + sessionStorage cache [id:news-lib] [score:10.0] ⏱ done
- [x] `P1` BUILD components/TickerNews.tsx — live news feed, skeleton loading, external link icons [id:ticker-news] [score:9.0] ⏱ done
- [x] `P0` BUILD /signal/[ticker] dedicated dossier page — BUY/SELL/NEUTRAL verdict, multi-quarter trend column, activity feed, news, chart, ownership [id:signal-dossier] [score:13.0] ⏱ done
- [x] `P0` WIRE /buys and /sells signal cards to link /signal/[ticker] instead of /ticker/[ticker] [id:wire-signal-links] [score:10.0] ⏱ done
- [x] `P0` WIRE TickerNews + "Open dossier" CTA into /ticker/[symbol] page [id:wire-news-ticker] [score:11.0] ⏱ done
- [x] `P1` BUILD components/LiveStats.tsx — real homepage stats (totalValue, positions, Tier-1 count) computed client-side [id:live-stats] [score:9.0] ⏱ done
- [x] `P1` WIRE LiveStats into homepage (kills the hardcoded $1.5T) [id:wire-live-stats] [score:9.0] ⏱ done
- [x] `P1` BUILD components/SectorHeatmap.tsx — day-change color grid, grouped by sector [id:sector-heatmap] [score:10.0] ⏱ done
- [x] `P1` WIRE SectorHeatmap into /top-picks and /grand [id:wire-heatmap] [score:8.0] ⏱ done
- [x] `P2` BUILD components/CsvExportButton.tsx — generic one-click CSV download [id:csv-export] [score:7.0] ⏱ done
- [x] `P2` WIRE CSV export into /buys, /sells, /grand [id:wire-csv] [score:7.0] ⏱ done
- [x] `P0` BUILD + verify static export (335 pages) [id:verify] [score:12.0] ⏱ done

## Queue (v0.16 — next session)

- [ ] `P1` ADD more tracked managers (target 30+) — Tepper/Appaloosa, Coleman/Tiger Global, Lampert/ESL, Bailey/Baillie Gifford, Duquesne separation, Rob Arnott/Research Affiliates [id:more-managers] [score:8.0]
- [ ] `P1` BUILD compare-managers page `/compare/managers/[pair]` — two-manager side-by-side with live portfolio values + moves [id:compare-mgrs] [score:7.0]
- [ ] `P1` ADD earnings calendar per ticker (Yahoo /calendar endpoint) [id:earnings-cal] [score:7.0]
- [ ] `P1` ADD insider transactions per ticker (SEC Form 4 approximation) [id:insider-tx] [score:6.0]
- [ ] `P2` BUILD /screener page — filter grand portfolio by sector + min conviction + live day change [id:screener] [score:7.0]
- [ ] `P2` ADD social share buttons on /signal/[ticker] with preformatted tweet [id:signal-share] [score:6.0]
- [ ] `P2` ADD /buys and /sells RSS feed endpoints [id:rss-signals] [score:6.0]
- [ ] `P2` ADD OpenGraph image per /signal/[ticker] page [id:signal-og] [score:5.0]

## Queue (v0.2 larger infra)

- [👤] `P0` DEPLOY v0.13+v0.14+v0.15 to Vercel/Cloudflare [id:deploy] [score:13.0] platform:vercel
- [ ] `P0` BUILD Python EDGAR 13F parser (replaces manual moves curation) [id:edgar] [score:11.0]
- [ ] `P0` ADD Postgres + 82-manager coverage [id:postgres-scale] [score:11.0]
- [ ] `P1` INTEGRATE Resend for email alerts on buy/sell signals [id:resend] [score:9.0]
- [ ] `P1` BUILD Claude Haiku thesis generator per ticker/manager [id:ai-thesis] [score:8.0]
- [ ] `P2` BUILD Twitter bot posting top buy/sell signals [id:twitter-bot] [score:7.0]
- [ ] `P2` BUILD public API + embeds [id:api] [score:7.0]

## Queue (v0.5 — monetization)

- [ ] `P0` LAUNCH Pro tier ($14/mo) — Stripe, pricing AB test [id:pro-tier] [score:12.0]
- [ ] `P0` BUILD Conviction Score v2 — adds trend history weighting to the current model [id:conviction-v2] [score:11.0]
- [ ] `P0` BUILD Manager Alpha Attribution — realized alpha vs S&P per manager based on tracked moves [id:alpha-attribution] [score:11.0]
