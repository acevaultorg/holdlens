# HoldLens — TASKS

## Queue (v0.1 shipped) · (v0.13 shipped) · (v0.14 shipped) · (v0.15 shipped)
- [x] Prior v0.1–v0.15 work — see git log `acepilot: v0.X` commits

## Queue (v0.16 — Growth surface + data depth + screener + compare) — SHIPPED [objective:growth-depth]

- [x] `P0` EXPAND lib/managers.ts — 8 more Tier-1/Tier-2 managers (Tepper, Coleman, Armitage, Rolfe, Rochon, Kantesaria, von Mueffling, Slater). Total: 30 [id:managers-30] [score:12.0] ⏱ done
- [x] `P0` ADD Q3/Q4 moves for the 8 new managers + manager quality scores [id:new-moves] [score:11.0] ⏱ done
- [x] `P0` ADD rich OpenGraph metadata per /signal/[ticker] (twitter card, canonical, verdict-aware description) [id:signal-og] [score:11.0] ⏱ done
- [x] `P0` BUILD components/SocialShare.tsx (Twitter/LinkedIn/Reddit/Facebook/copy-link) + wire into /signal/[ticker] with verdict-aware tweet text [id:social-share] [score:12.0] ⏱ done
- [x] `P0` BUILD /compare/managers/[pair] page — side-by-side portfolio comparison with live prices + shared holdings + per-quarter moves columns [id:compare-mgrs] [score:11.0] ⏱ done
- [x] `P0` BUILD /screener page — interactive client-side filter by sector + min owners + min score + live direction [id:screener] [score:12.0] ⏱ done
- [x] `P0` WIRE Screener + Compare nav links [id:nav-wire] [score:9.0] ⏱ done
- [x] `P0` BUILD + verify static export [id:verify] [score:12.0] ⏱ done

## Queue (v0.17 — next session)

- [ ] `P1` ADD /og/signal/[ticker] pre-generated OG images via @vercel/og or satori at build time [id:og-images] [score:7.0]
- [ ] `P1` ADD earnings calendar per ticker (Yahoo /calendar endpoint) [id:earnings-cal] [score:7.0]
- [ ] `P1` ADD insider transactions per ticker (SEC Form 4 approximation) [id:insider-tx] [score:6.0]
- [ ] `P1` ADD /buys.xml + /sells.xml RSS feed endpoints [id:rss-signals] [score:6.0]
- [ ] `P2` ADD /compare/managers index page listing all pairs [id:compare-index] [score:5.0]
- [ ] `P2` BUILD /what-to-buy + /what-to-sell SEO alias routes → canonical to /buys + /sells [id:seo-aliases] [score:5.0]
- [ ] `P2` ADD screener: "save filter" feature (localStorage) [id:screener-save] [score:5.0]
- [ ] `P2` ADD trend badge to /top-picks and /grand (multi-quarter conviction indicator) [id:trend-badge] [score:6.0]

## Queue (v0.2 larger infra)

- [👤] `P0` DEPLOY v0.13+v0.14+v0.15+v0.16 to Vercel/Cloudflare [id:deploy] [score:13.0] platform:vercel
- [ ] `P0` BUILD Python EDGAR 13F parser (replaces manual moves curation — path to 80+ managers) [id:edgar] [score:11.0]
- [ ] `P1` INTEGRATE Resend for email alerts on buy/sell signals [id:resend] [score:9.0]
- [ ] `P1` BUILD Claude Haiku thesis generator per ticker/manager [id:ai-thesis] [score:8.0]
- [ ] `P2` BUILD Twitter bot posting top buy/sell signals [id:twitter-bot] [score:7.0]
- [ ] `P2` BUILD public API + embeds [id:api] [score:7.0]

## Queue (v0.5 — monetization)

- [ ] `P0` LAUNCH Pro tier ($14/mo) — Stripe, pricing AB test [id:pro-tier] [score:12.0]
- [ ] `P0` BUILD Manager Alpha Attribution — realized alpha vs S&P per manager [id:alpha-attribution] [score:11.0]
