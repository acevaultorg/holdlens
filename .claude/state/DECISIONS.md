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

## 2026-04-10 — v0.15 Multi-quarter historical moves

**Decision:** Added Q1 and Q2 2025 moves to lib/moves.ts so every manager now
has up to 4 quarters of trackable activity. Total movements shipped: ~150
across 22 managers × 4 quarters.

**Why:** A single-quarter snapshot is noisy — one Buffett trim doesn't tell
you much. Three consecutive quarters of Klarman + Marks + Druckenmiller
building VST is a wedge-shaped signal. Dataroma shows Q-over-Q data but
doesn't surface streaks. HoldLens now does, via
`getManagerTickerTrend()` and `getTickerTrend()` in `lib/signals.ts`.

The trend helpers return consecutive-quarter streak count per manager per
ticker, which feeds the `/signal/[ticker]` dossier page's "Multi-quarter
conviction" column. This is the first visible HoldLens feature that
Dataroma structurally cannot replicate without rewriting their backend.

## 2026-04-10 — v0.15 Signal dossier is the new conversion surface

**Decision:** `/signal/[ticker]` is a dedicated per-ticker dossier page
that combines: BUY/SELL/NEUTRAL verdict badge, multi-quarter trend column,
activity feed, live news, interactive chart, current ownership table. All
linked from /buys and /sells ranking pages.

**Why:** The v0.14 homepage signals + /buys /sells pages surface WHAT to
act on but the user still has to open /ticker/[symbol] to see the detail.
The signal dossier is the single-page "should I or shouldn't I" experience.
This is the page we'll send traffic to via email alerts in v0.4.

**Verdict logic:** the direction with the higher score wins, unless the
scores are within 10 points of each other (then NEUTRAL). The 10-point
buffer prevents flip-flopping between BUY and SELL when the signals are
nearly balanced.

## 2026-04-10 — v0.15 Yahoo Finance news API chosen for TickerNews

**Decision:** Used Yahoo Finance v1 search API
(`/v1/finance/search?q=SYMBOL&newsCount=N`) for per-ticker news, falling
back to corsproxy.io on CORS failure. 15-minute sessionStorage cache.

**Why:**
- Same origin we already use for quotes (v0.13 decision) — keeps the
  external-dependency surface minimal
- No API key needed
- Returns title + publisher + link + publishedAt in one call
- News is lower-value than price (15min cache is fine, vs 60s for quotes)

**Fallback behavior:** on complete failure, the component renders "No news
available" without breaking the page. News is additive, not load-bearing.

## 2026-04-10 — v0.15 Homepage stats are now computed from live data

**Decision:** Replaced the hardcoded "$1.5T assets under watch" homepage
stat with `<LiveStats>`, a client component that fetches live prices for
every tracked position and sums `price × sharesMn × 1e6` to produce a real
"Tracked long positions · live" figure.

**Why:** "$1.5T" was a credibility drag the moment v0.13 added live prices
everywhere else on the site. Either the stat is live or the "always current"
tagline is a lie. We chose live.

**Edge case:** on CORS failure or first load, `LiveStats` renders "—" rather
than a placeholder number. Honest, not misleading.

**Trade-off:** computing the aggregate requires fetching ~80 quotes on home
page load. Mitigated by the 60s sessionStorage cache in `lib/live.ts` — a
second homepage view hits the cache. Cold-load adds ~2-3 seconds to stat
population but the rest of the page renders immediately.

## 2026-04-19 — HN first launch outcome + mod email

**Event:** Show HN submission (item 47826167) for HoldLens was killed by HN's auto-filter within ~10 minutes of posting. Diagnosed via Chrome MCP — item page empty for logged-out viewers, submissions list empty too. Classic new-account first-submission shadowban pattern.

**Operator action taken:** emailed hn@ycombinator.com requesting review with standard polite template.

**Next check:** 24-48h from now, visit news.ycombinator.com/submitted?id=paulodevries from an incognito window. If HoldLens appears, mods un-killed it. If not, the kill stands — not a product quality issue, just HN's opaque filter.

**Re-submission policy:** do NOT resubmit the holdlens.com URL to HN in the next 7 days — duplicate filter applies. If mod email doesn't un-kill, plan a fresh submission ≥ 7 days later with a tweaked title.

**Distribution pivot:** LinkedIn + Reddit + Wikipedia remain open. Operator deferred LinkedIn push to "later" (2026-04-19). No urgency on brain side — channels stay open whenever operator is ready.

## 2026-04-19 — Wikipedia distribution seeding (session 1 of ~5)

**Status:** foundation complete · edit count = 2 of 10 required for autoconfirmed gate

**Account:** `PmdVries` (personal handle, not brand-resembling per WP:ROLE)
**Email:** contact@acevault.org
**User page:** https://en.wikipedia.org/wiki/User:PmdVries — COI disclosure published per WP:COI.

**Edits so far:**
1. User page creation with COI disclosure
2. Correction: `[[SEC EDGAR]]` → `[[EDGAR|SEC EDGAR]]` (fixed red wikilink)

**Playbook reference:** `.claude/state/WIKIPEDIA_PLAYBOOK.md` (staged 2026-04-17)

**Autoconfirmed gate remaining:** 8 more edits + ~4 more calendar days.
Recommended schedule: 2 warmup edits/day on Mon 04-20, Tue 04-21, Wed 04-22, Thu 04-23.

**First HoldLens-adjacent edit (unlocks ~Fri 04-24):** Target 2A per playbook —
add External Links section to `Form 13F` article with SEC FAQ + Harvard Dataverse +
HoldLens. Predicted 75-85% survival rate. Distribution Oracle archetype:
`wikipedia_sourced_edit × +75` (highest-leverage durable citation).

**Pickup instruction for next session:** operator types any /acepilot variant
and "Wikipedia" or "warmup" — brain will surface the 2-edit-per-day warmup
checklist.
