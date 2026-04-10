# HoldLens — DECISIONS (append-only)

## 2026-04-10 — v0.13 Live data architecture

**Decision:** Client-side live data via Yahoo Finance v8 chart endpoint with
corsproxy.io fallback. No server, no API key, no CORS backend.

**Why:**
- `next.config.js` has `output: 'export'` (static export, no server runtime).
- Yahoo v8 `/finance/chart/` is widely used in OSS projects, supports CORS,
  returns price + history + meta in one call.
- sessionStorage cache (60s TTL) caps the request rate at ~1/min per unique
  symbol per tab.

## 2026-04-10 — v0.13 Watchlist as localStorage

**Decision:** Watchlist is stored in `localStorage` under key
`holdlens_watchlist_v1`. No user accounts.

## 2026-04-10 — v0.13 LiveChart is SVG, not TradingView

Rolled our own `<LiveChart>` using SVG paths. Matches HoldLens dark theme
exactly, zero external script dependency.

## 2026-04-10 — v0.13 Hardcoded 13F filing dates

`lib/filings.ts` hardcodes the Q3 2025 deadline. Real EDGAR parsing is v0.2.
`nextFilingDeadline()` is computed client-side from the 45-day rule.

## 2026-04-10 — v0.14 Multi-factor buy/sell recommendation model

**Decision:** Buy and sell signals are scored by a 4-factor composite:
- **Manager quality** (70% buy / 65% sell): curated 6-10 score per manager based
  on track record, longevity, and signal reliability
- **Consensus** (20% / 15%): how many managers agree on the direction
- **Fresh money** (10% buy): % of buyers whose move is a NEW position vs an add
- **Exit share** (10% sell): % of sellers who fully exited vs trimmed
- **Concentration bonus** (buy only, 10pt flat): fires when any buyer commits
  >10% of their portfolio to the ticker
- **Dump severity** (sell only): sum of absolute delta% across sellers

Score is normalized 0-100 so the badge reads like a rating.

**Why multi-factor not raw count:**
- Dataroma ranks by ownership count (count = signal). But 3 Tier-1 managers
  buying is a stronger signal than 5 Tier-3 managers.
- New positions > adding to existing (founder conviction > maintenance).
- Concentration matters: a 15% Burry position on BABA is a different bet than
  a 0.5% Burry position.

**Scoring is deterministic + auditable:**
- All source factors live in `lib/moves.ts` (data) and `lib/signals.ts` (math).
- No ML black box. No opaque weights. The formula is in the page copy on /buys
  and /sells.

## 2026-04-10 — v0.14 Manager quality scores are curated

**Decision:** `MANAGER_QUALITY` in `lib/signals.ts` is a hand-curated 6-10
score per manager, not derived from performance data.

**Why:**
- We don't have clean historical returns for all managers. Computing real
  alpha would require quarterly NAVs, which aren't in the current dataset.
- Reputation + track record + style maturity are reasonable proxies.
- Scores are explicit and easy to edit. Transparent.

**Scoring rubric:**
- 10: Buffett — 60+ yrs, lifetime ~20% CAGR, the apex
- 9: Druckenmiller, Klarman, Marks, TCI/Hohn, Akre, Fundsmith/Smith, Lone Pine/Mandel
  — 25+ yrs, category-defining, rare to be wrong at scale
- 8: Ackman, Icahn, Li Lu, Greenblatt, Viking, ValueAct, Maverick, Polen
  — proven alpha, specific edge, 20+ yrs
- 7: Watsa, Nygren, Greenberg, Einhorn, Burry — strong but narrower edge
- 6: Pabrai — clone-investor, smaller AUM

**When to revisit:** When Manager Alpha Attribution (v0.5) ships, quality scores
can be derived from realized alpha vs S&P over rolling windows.

## 2026-04-10 — v0.14 Moves data is curated, multi-quarter, rich schema

**Decision:** `lib/moves.ts` stores every tracked 13F move as:
```ts
{ managerSlug, quarter, filedAt, ticker, action, deltaPct?, shareChange?, portfolioImpactPct?, note? }
```
Two quarters: `2025-Q3` (filed 2025-11-14) and `2025-Q4` (filed 2026-02-14).

**Why rich schema:**
- `shareChange` matches Dataroma's column (raw share count delta)
- `portfolioImpactPct` matches Dataroma's "% change to portfolio"
- Allows TickerActivity component to show the same data Dataroma shows, but
  with live prices + manager-quality tier badges

**Why curated not scraped:**
- Static export can't run a backend scraper
- EDGAR parsing will replace this in v0.2 (`task-id: edgar`)
- Curated data is faster to iterate on UI design against
- Public press coverage of Q3/Q4 2025 13Fs gives enough signal for a v0.14 ship

## 2026-04-10 — v0.14 /buys and /sells are the product's new front door

**Decision:** The homepage now leads with `/buys` and `/sells` CTAs instead
of "Try the Buffett backtest". Signal cards appear above the fold.

**Why:** User's core value prop as articulated: "what to buy / what to sell
/ learning from the best / better than Dataroma in any way". The backtest
is interesting but is a lead magnet, not the product. The buy/sell signals
ARE the product.

**Trade-off:** We reduce the prominence of the Buffett backtest (the old
viral wedge). This is deliberate — the signals carry more repeat-visit
value than the backtest.

## 2026-04-10 — v0.14 Expanded manager roster to 22

**Decision:** Added 8 new managers beyond the original 14. All Tier-1 to
Tier-2 quality. New managers and why:
- Andreas Halvorsen / Viking — largest Tiger Cub, proven long-short
- Chris Hohn / TCI — concentrated activist, category-defining returns
- Jeffrey Ubben / ValueAct — constructive activist
- Stephen Mandel / Lone Pine — 12x over 27 years, under-the-radar legend
- Lee Ainslie / Maverick — Tiger Cub long-short
- Chuck Akre / Akre Capital — 3-legged stool quality compounder
- Terry Smith / Fundsmith — UK superstar, "do nothing" discipline
- Polen Capital — concentrated quality growth, 25+ yrs

**Why stop at 22:** Diminishing returns beyond Tier-1. To expand to 80+
(Dataroma's roster) we need EDGAR automation (v0.2). 22 handpicked Tier-1
managers produce stronger signals than 80 including mediocrities.
