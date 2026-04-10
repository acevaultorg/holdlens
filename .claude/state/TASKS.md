# HoldLens — TASKS

## Queue (v0.1 shipped)

- [x] `P0` SCAFFOLD Next.js 15 + Tailwind + TypeScript [id:scaffold] [score:12.0] ⏱ done
- [x] `P0` BUILD landing page w/ hero + email capture [id:landing] [score:12.0] ⏱ done
- [x] `P0` BUILD Buffett backtest interactive (sliders + SVG chart) [id:backtest] [score:13.0] ⏱ done
- [x] `P0` BUILD Warren Buffett profile page w/ top 10 holdings [id:buffett-page] [score:11.0] ⏱ done
- [x] `P1` BUILD /api/subscribe endpoint (JSONL stub) [id:subscribe] [score:8.0] ⏱ done
- [x] `P1` ADD sitemap.ts + robots.ts [id:seo-basics] [score:7.0] ⏱ done

## Queue (v0.13 — Live data + missing features) [objective:live-data] — SHIPPED

- [x] `P0` BUILD lib/live.ts — client-side Yahoo Finance quote + chart fetcher with 60s sessionStorage cache [id:live-lib] [score:13.0] ⏱ done
- [x] `P0` BUILD components/LiveQuote.tsx — live price badge, day change, green/red, pulse indicator [id:live-quote] [score:12.0] ⏱ done
- [x] `P0` BUILD components/LiveChart.tsx — SVG sparkline from 1y history with range picker + hover tooltip [id:live-chart] [score:11.0] ⏱ done
- [x] `P0` WIRE LiveQuote + LiveChart + StarButton into ticker pages [id:wire-ticker] [score:13.0] ⏱ done
- [x] `P0` WIRE LiveQuote + PortfolioValue into investor pages (live portfolio total in $) [id:wire-investor] [score:12.0] ⏱ done
- [x] `P1` WIRE live price column into top-picks [id:wire-toppicks] [score:9.0] ⏱ done
- [x] `P0` BUILD components/LiveTicker.tsx — horizontal scrolling bar on every page [id:live-ticker] [score:10.0] ⏱ done
- [x] `P1` BUILD lib/watchlist.ts + components/StarButton.tsx — localStorage, cross-component sync via custom event [id:watchlist] [score:9.0] ⏱ done
- [x] `P1` BUILD /watchlist page — personal watchlist with live prices, SSR-safe [id:watchlist-page] [score:8.0] ⏱ done
- [x] `P1` BUILD components/GlobalSearch.tsx — cmd+K fuzzy search across managers + tickers [id:search] [score:10.0] ⏱ done
- [x] `P0` WIRE LiveTicker + GlobalSearch + Watchlist nav into layout [id:wire-layout] [score:11.0] ⏱ done
- [x] `P1` BUILD lib/filings.ts + 'since last filing' badges + EDGAR links on investor pages [id:filings] [score:7.0] ⏱ done
- [x] `P0` BUILD + verify static export (228 pages) [id:verify] [score:12.0] ⏱ done

## Queue (v0.14 next session)

- [ ] `P1` RECOMPUTE homepage "Assets under watch" stat from live prices client-side (currently hardcoded $1.5T) [id:live-stats] [score:6.0]
- [ ] `P1` ADD sector heatmap on top-picks (color by day change) [id:heatmap] [score:5.0]
- [ ] `P2` ADD compare investors side-by-side with live portfolio values [id:compare-live] [score:5.0]
- [ ] `P2` ADD client-side news feed per ticker (Finnhub or Google News RSS via cors proxy) [id:news] [score:5.0]

## Queue (v0.2 larger)

- [👤] `P0` DEPLOY v0.13 build to Vercel — `cd holdlens && vercel --prod` [id:deploy-v013] [score:13.0] platform:vercel
- [ ] `P1` BUILD Python EDGAR 13F parser → Postgres [id:edgar] [score:10.0]
- [ ] `P1` ADD 81 more manager pages (Ackman, Icahn, etc.) [id:managers] [score:9.0]
- [ ] `P1` ADD top 500 ticker pages with owner tables [id:tickers] [score:9.0]
- [ ] `P2` INTEGRATE Resend for real email alerts [id:resend] [score:7.0]
- [ ] `P2` BUILD Twitter OG image generator [id:og-images] [score:6.0]
