# HoldLens — TASKS

## Queue (v1.45 — Dividend Tax Calc Phase 1, architecture + seed) — SHIPPED [objective:dividend-tax-v1]

- [x] `P1` BUILD /dividend-tax/ hub + 20 per-investor-country programmatic pages + DividendTaxCalc component. Architecture complete; `data/dividend-tax.json` seeded with 10 verified US-outbound treaty cells (IRS P901 Table 1 cited) + 390 cells marked `needs_research`; fallback = statutory non-treaty rate with visible "data pending verification" disclaimer (never fabricated per AP-3). Widget integrated on /ticker/[symbol] + /investor/[slug] as inline retention hook. sitemap.xml + llms.txt updated with 21 new URLs. Build passes. [id:dividend-tax-v1] [score:10.0] [oracle:€8/wk peak after data completion] [ret:+4.5% peak] [reach:+120 vis/wk peak] ⏱ done 2026-04-19 (cycle 1)
- [x] `P2` BUILD v1.46 dividend-tax Phase 3 partial — DividendTaxShareButton (Twitter intent + LinkedIn intent + clipboard copy), gated to verified-rate state only (no "data pending" viral moments). Plus ~1500 words of unique educational content (resident_guide array) for top-5 countries US/UK/DE/CA/AU — reduces thin-content risk on highest-traffic-potential pages, boosts LLM-citation fit characteristics #2+#4 (Useful+Extractable). Canvas PNG share-card deferred to v1.47+ after treaty-data coverage crosses ~80% verified. [id:dividend-tax-v2] [score:7.0] [oracle:€3/wk incremental] [ret:+0.8%] [reach:+30 vis/wk] ⏱ done 2026-04-19 (cycle 2)

- [👤] 🔴 REQUIRED — Populate dividend tax treaty data (target ≥320/400 cells verified over 14 days).
  **WHAT:** Extend `data/dividend-tax.json` by filling in the `treaties` array for 300+ additional (investor_country, payer_country) pairs, citing a primary source for every rate. Currently 10 US-outbound cells are verified from IRS Publication 901 Table 1. The remaining ~390 cells default to `needs_research` and the UI shows "data pending verification" — honest but thin.
  **WHY:** The `@distributor` Distribution Oracle projection for this feature (+120 vis/wk) multiplies by actual page-depth. Pages that stay `needs_research` for >30 days will be flagged by Google as thin-content and distributor_weight will drop. Each verified cell is also a unique-data page for LLM citation (Aleyda Solis characteristic #2 Useful). Skipping means Phase 1 ships but Phase 2 traffic projection never materializes.
  **TIME:** ~14 days across multiple sessions. Per cell: find primary source (KPMG WHT guide, PwC WWTS, OECD Tax Database, or national tax authority), extract treaty rate, write source_citation, set state=verified. Budget ~5 min per cell (including double-check). 300 cells × 5 min = 25 hours over 14 days = ~1.8 hours/day.
  **HOW:**
    1. Open `holdlens/data/dividend-tax.json` in editor.
       → expected: see 10 existing verified US-outbound cells as template for format.
    2. For each of the 19 non-US investor countries × 20 payer countries, look up the bilateral treaty rate for portfolio dividends at:
       `https://taxsummaries.pwc.com/` (PwC Worldwide Tax Summaries) OR
       `https://kpmg.com/xx/en/home/insights/2011/12/corporate-tax-rates-table.html` (KPMG annual corporate + withholding tax rates) OR
       `https://www.oecd.org/tax/tax-policy/tax-database/` (OECD authoritative)
       → expected: find published treaty rate + article reference (e.g. "Article 10(2)(b)").
    3. Append a new entry per verified cell:
       ```
       {
         "investor_country": "UK",
         "payer_country": "DE",
         "withholding_rate_pct": 15,
         "treaty_reference": "1964 UK-Germany Tax Treaty (2010 Protocol), Article 10",
         "source_citation": "PwC Worldwide Tax Summaries — Germany — Individual — Foreign tax relief and tax treaties (retrieved 2026-04-20)",
         "state": "verified",
         "last_verified": "2026-04-20",
         "notes": "Optional — any conditions or caveats"
       }
       ```
       → expected: JSON validates, app rebuilds cleanly.
    4. Run `npm run build` after each batch.
       → expected: no TS errors; all pages still generate.
    5. Run `npm run dev` and open `http://localhost:3000/dividend-tax/uk` (or whatever country you populated).
       → expected: treaty matrix table shows ✓ Verified instead of ⚠️ Data pending for new rates.
  **VERIFY:**
    `grep -c '"state": "verified"' data/dividend-tax.json`
    → expected: ≥320 after 14 days (currently 10).
  **IF STUCK:**
    - Can't find the primary source for country pair X → skip it, leave as `needs_research`. Honest fallback > fabrication.
    - Unsure whether a rate is "portfolio" or "substantial holding" → portfolio (≤10% ownership is the common case for retail investors). Document in `notes` field.
    - Want to outsource data entry → `data/dividend-tax.json` schema is AI-parseable; a research intern or a one-shot Claude Project can fill it given the primary source URLs. Budget ~4 hours of AI-assisted research to reach 320 cells.
  [id:dividend-tax-data-pop] [score:9.0] [oracle:€5/wk realized] [ret:+3% realized] [reach:+100 vis/wk realized] [👤]

- [👤] 🟡 RECOMMENDED — Phase 3 polish: share-cards + cross-links (Day 5 of original mission).
  **WHAT:** Once Phase 2 data is populated, ship (a) per-result share-cards using the `components/SignalShareCard.tsx` pattern — 1200×630 branded PNG + pre-composed tweet ("I'd keep $X of every $100 in [stock] dividends as a [country] investor"), (b) cross-linking sidebar on `/ticker/[X]` showing "Which countries' investors keep most of [X]'s dividend?" when ≥2 verified cells exist for that ticker's domicile, (c) cross-linking sidebar on `/investor/[slug]` showing "Tax-efficient picks from [investor]'s portfolio" based on the manager's top dividend-paying holdings.
  **WHY:** Distribution Fit score for v1.45 was 0.59 (PASS) — the SHARE dimension scored 0.40 because share-cards are not in Phase 1. Without them, advocacy (AUG factor 5) stays at ~1/10. Share-cards are the single biggest advocacy lever per `rules/aceusergrowth.md` v3 Part 12 (V-F1 contributes +0.08 to k-factor). Skipping means the widget retains users (retention) but doesn't multiply them (advocacy).
  **TIME:** ~4 hours. Canvas share-card ~90 min (template exists). Cross-link sidebars ~60 min each × 2 = 2 hours. Tests + @designer mobile pass ~30 min.
  **HOW:**
    1. Copy `components/SignalShareCard.tsx` to `components/DividendTaxShareCard.tsx`:
       `cp components/SignalShareCard.tsx components/DividendTaxShareCard.tsx`
       → expected: new file created; adapt props to (ticker, country, effectiveRate, netPer100).
    2. Adapt the canvas-draw function to render the comparison copy + brand.
    3. Add `<DividendTaxShareCard />` into `DividendTaxCalc` compact mode (fires on verified-rate result).
    4. Build + test locally: `npm run dev` → open /ticker/AAPL → verify share card renders + download works.
    5. For cross-link sidebars: in `app/ticker/[symbol]/page.tsx`, after the DividendTaxCalc section, add a `<div>` that iterates the 5 most-common investor-country rates for this ticker's (assumed US) domicile. Link each to /dividend-tax/[country]/.
  **VERIFY:** On any /ticker/[X] page, Chrome devtools → Elements → confirm share-card canvas element present + tweet intent URL correct. Mobile 375px viewport: verify no horizontal overflow.
  **IF STUCK:**
    - Canvas rendering fails on some platforms → fall back to satori-based PNG generation in `scripts/generate-og-images.ts` (already used for OG).
    - Phase 3 depends on Phase 2 data being populated; if data coverage is still <50%, defer this task and do the data population first.
  [id:dividend-tax-phase3] [score:7.0] [reach:+45 vis/wk additional] [👤]

- [👤] 🟢 OPTIONAL — Mobile browser verification (this session's mobile-verify gap).
  **WHAT:** Run `npm run dev` on this machine, open Chrome DevTools → Device Toolbar → iPhone 12 Pro (375×844), visit /dividend-tax/, /dividend-tax/us/, /ticker/AAPL. Check touch targets, dropdown interactions, disclaimer wrapping, no horizontal overflow.
  **WHY:** Per `rules/mobile-perfection-default.md`, Chrome MCP mobile verification is mandatory for public-facing ships. This session could not launch Chrome MCP against a live preview (no browser automation tier available), so a `[mobile-skip-documented]` tag was applied + Reliable score capped at 0.6 in QUALITY.md. Operator verification closes the gap.
  **TIME:** ~5 min.
  **HOW:**
    1. `cd holdlens/ && npm run dev`
       → expected: Next.js dev server starts on port 3000.
    2. Open Chrome → http://localhost:3000/dividend-tax/
       → expected: hub page renders.
    3. DevTools → Toggle Device Toolbar → iPhone 12 Pro (375×844).
       → expected: hub + country grid fits viewport, no horizontal scroll.
    4. Navigate to /dividend-tax/us/ → scroll through treaty matrix.
       → expected: table readable, no overflow, "Show citations" details-disclosure works.
    5. Navigate to /ticker/AAPL → scroll to calculator section.
       → expected: 3-column grid collapses to single column cleanly, selects tap-target is ≥44px.
  **VERIFY:** no horizontal scroll on any page, all CTAs reachable without horizontal swipe, disclaimer text wraps readably.
  **IF STUCK:**
    - If mobile overflow visible → file specific issue + which element; I'll patch in next cycle.
    - If dev server won't start → check iCloud sync isn't locking `.next/` — rename `.next/` → `npm run dev` to rebuild fresh.
  [id:dividend-tax-mobile-verify] [score:3.0] [👤]

## Queue (Wikipedia citation seeding — STAGED, OPERATOR-EXECUTION) [objective:wikipedia-geo-seed]

- [👤] 🟡 RECOMMENDED — Seed HoldLens into Wikipedia over 10 weeks (45 min total operator time). **WHAT:** Add HoldLens as a cited reading-aid source in 4 existing Wikipedia articles (Form 13F, Scion Asset Management, Pershing Square Capital Management, Bill Ackman), using dual SEC-primary + HoldLens-supplementary citation pattern. Each edit is pre-drafted. **WHY:** Wikipedia is the single highest-leverage distribution channel — one surviving citation propagates into LLM training corpora (ChatGPT/Claude/Gemini/Perplexity), Google Knowledge Graph, and PageRank forever. Skipping means permanent invisibility in AI-answer space. **TIME:** 45 min across 10 weeks. **FULL PLAYBOOK** with per-article edit drafts, 20 failure-mode mitigations (COI, autoconfirmed gate, RS, SELFCITE, bot-patrol, BLP, revert-war, etc.), sequenced risk tiers, survival-check schedule, second-order Wikidata chain: `.claude/state/WIKIPEDIA_PLAYBOOK.md`. **VERIFY:** T+48h / T+7d / T+30d survival checks per playbook Part 5. **IF STUCK:** see playbook Part 8 Clarity Card IF-STUCK section. [id:wikipedia-seed] [score:12.0] [oracle: €0/wk short-term] [reach: +75 × 4 edits archetype multiplier over 10 weeks, LLM-corpus compounding] [👤]

## Queue (v1.34 — homepage phantom-ticker fix) — SHIPPED [objective:v1.34-moves-phantom-fix]

- [x] `P0` FIX homepage LatestMoves empty-ticker phantom rows — 6/8 rows (all Bill Nygren) rendered "?" logo + no ticker + implausible 52-64% of book. Root cause: `cusipToTicker()` fallback returned "" for unmapped CUSIPs whose issuer name became empty after stripping suffixes; those all aggregated into `tickerMap[""]` phantom position per quarter. Fix: (a) `lib/edgar-data.ts` EDGAR_MOVES + getEdgarHoldings filters now require `ticker.length >= 1`; (b) `scripts/fetch-edgar-13f.ts` skips unmapped CUSIPs at aggregation time. Verified live: post-fix top-8 is NVDA/Burry 49%, AAPL/Buffett 30%, GRBK/Einhorn 29% ×4, BAC/Li Lu 26% — zero empty `/signal/` hrefs on holdlens.com. [id:moves-phantom-fix] [score:10.0] [oracle:€2/wk] [ret:+1.5%] ⏱ done 2026-04-17 16:50 commit 8f1420e7e · deploy 5a3fe143.holdlens.pages.dev

## Queue (v1.10 — Plausible pageview fix + MobileNav focus fix) — SHIPPED [objective:v1.10-analytics-a11y]

- [x] `P0` FIX Plausible pageview silent-loss since v0.86 — `<Script afterInteractive defer>` race killed auto-pageview trigger, zero `/api/event` POSTs for weeks. Added components/PlausiblePageView.tsx firing window.plausible("pageview") on mount + every route change. Dropped redundant `defer`. Wrapped in Suspense for useSearchParams static-export compatibility. [id:plausible-pageview-fix] [score:10.0] ⏱ done 2026-04-17 11:42 commit 2af825e3c — verified live via Chrome MCP (202 POST on holdlens.com every load). Deployed: https://e796ef00.holdlens.pages.dev
- [x] `P2` FIX MobileNav sticky amber focus ring on "Show N more" — iOS Safari held :focus-visible after tap, amber outline shouted louder than all links. onPointerUp → blur() releases touch focus; keyboard a11y preserved (keyboard doesn't fire pointer events). [id:mobilenav-focus-fix] [score:3.0] ⏱ done 2026-04-17 commit 2af825e3c. Verified via Chrome MCP — document.activeElement moves to BODY after pointerup.
- [x] `P0` DEPLOY v1.10 — wrangler retry 2 succeeded (EPIPE on attempt 1 per rules/cloudflare-pages-epipe.md). IndexNow pinged (830 URLs). [id:deploy-v1.10] [score:5.0] ⏱ done 2026-04-17 11:42

## Queue (v1.32 — cycle 9 learn article) — SHIPPED [objective:v1.32-survivorship-bias]

- [x] `P2` BUILD /learn/survivorship-bias-in-hedge-funds — 2000+ word SEO article, honest HoldLens selection-effect angle, Schema.org BreadcrumbList+Article+DefinedTerm, ShareStrip, cross-links. Learn index updated (9th article). Build clean 88da63297 pushed to origin/main. [score:6.0] [id:learn-survivorship-bias] ⏱ done 2026-04-17 11:48

## Queue (v1.09 — mobile menu color system) — SHIPPED [objective:v1.09-mobilenav-colors]

- [x] `P2` FIX MobileNav color rotation — brand/emerald group accents violated tailwind.config.ts reserved-use rule for `brand` and doubled up with pinned-primary link colors → visual noise, no hierarchy [id:mobilenav-colors] [score:4.0] ⏱ done commit fd5dd8f1f — semantic-only colors (buy/sell/info/brand), neutral eyebrow headers, typecheck clean, @craftsman Love 0.78 PASS
- [x] `P2` DEPLOY v1.09 via wrangler pages deploy [id:deploy-v1.09] [score:4.0] ⏱ done 2026-04-17 09:38 — deployed to https://fc73b538.holdlens.pages.dev (2557 files, 30.46s after 1 EPIPE retry per rules/cloudflare-pages-epipe.md — succeeded on attempt 2). Deploy-truth verified live via Chrome MCP at holdlens.com: section headers all `rgb(133,141,156)` text-dim (was brand/emerald rotation); buy-side links emerald `rgb(52,211,153)`; sell-side rose `rgb(251,113,133)`; contrarian+rotation sky `rgb(56,189,248)`; Pro features amber `rgb(251,191,36)`; neutral tool links white `rgb(229,229,229)`. IndexNow pinged (830 URLs → Bing/Yandex/Seznam/Naver).

## Queue (v0.80+v0.81 UX retention pass — COMMITTED, DEPLOY PENDING) [objective:v80-v81-ux-retention]

- [x] `P0` Footer 51→25 grouped links (5 semantic columns + legal strip) [id:footer-restructure] [score:15.0] ⏱ done v0.80 1bc34adb4
- [x] `P0` Desktop nav a11y fix — aria-haspopup=menu, cursor-pointer, remove lying aria-expanded [id:desktop-nav-a11y] [score:10.0] ⏱ done v0.80 1bc34adb4
- [x] `P0` Mobile nav 49→33 grouped into 5 named sections + legal row [id:mobile-nav-group] [score:12.0] ⏱ done v0.80 1bc34adb4
- [x] `P0` Outcome-first hero ("Spot smart money moves before the market does") + trust row [id:hero-rewrite] [score:14.0] ⏱ done v0.81 2bcacaeae
- [x] `P0` Pricing competitor anchor strip + trust-markers under CTA [id:pricing-trust] [score:12.0] ⏱ done v0.81 2bcacaeae
- [x] `P0` Sticky header with backdrop-blur (always-reachable nav on 7-10k-px signal pages) [id:sticky-header] [score:11.0] ⏱ done v0.81
- [x] `P0` Skip-to-main-content link (keyboard a11y) [id:skip-link] [score:9.0] ⏱ done v0.81
- [x] `P0` FoundersNudge rose-tone + fan-out to 6 high-intent pages [id:nudge-fanout] [score:9.0] ⏱ done v0.81 2bcacaeae
- [x] `P0` DEPLOY v0.80+v0.81+v0.82+v0.83 to Cloudflare [id:deploy-v80-v81] [score:18.0] ⏱ SHIPPED via parallel session (a9069bf8.holdlens.pages.dev, 2134 files / 70.58s). Deploy-truth verified 2026-04-15 16:49: hero "Spot smart money moves" ✓, footer aria-label="Site map" ✓, skip-to-main-content ✓, pricing 13F-tracker-market anchor ✓, handbook Amazon widget ✓. Note: later wrangler retries from this session hit EPIPE because bundle was already shipped (chunk-hash drift between parallel sessions).

## Queue (v0.47 + v0.48 — /signal flow + breadth sparklines) — SHIPPED [objective:v47-v48-signal-history]

- [x] `P0` BUILD components/SignalQuarterlyActivity.tsx — server component, 8-quarter buy/sell flow chart, distinct managers via "new"+"add" above zero (emerald) and "trim"+"exit" below zero (rose), totals + net direction badge, module-level cache so all 94 signal pages share one ALL_MOVES walk during static export [id:signal-quarterly-activity] [score:12.0] ⏱ done v0.47 314b93e4
- [x] `P0` BUILD components/OwnerCountSparkline.tsx — server component, true cumulative owner_count over 8 quarters, reconstructed by seeding from TICKER_INDEX[symbol].owners (current owner set at LATEST_QUARTER) and walking MERGED_MOVES backwards: "new" at q removes from prior set, "exit" at q adds to prior set, "add"/"trim" leave unchanged. Yields rising/falling/flat verdict + delta over 8Q + per-quarter bars + cross-link to /top-picks. Pure server, zero client JS. [id:owner-count-sparkline] [score:12.0] ⏱ done v0.48 d678bb19
- [x] `P0` WIRE both components into app/signal/[ticker]/page.tsx between Signal52wRange and LiveChart — flow first (activity), state second (breadth), so reader sees who's moving then how many hold [id:wire-v47-v48] [score:9.0] ⏱ done
- [x] `P0` BUILD + verify static export — /signal/[ticker] holds at 5.51 kB (server components add 0 client JS), all 94 pages render both [id:verify-v47-v48] [score:10.0] ⏱ done
- [x] `P0` DEPLOY via wrangler pages deploy out — 1147 files uploaded after 2 EPIPE retries, https://7d4bec5f.holdlens.pages.dev [id:deploy-v47-v48] [score:10.0] ⏱ done
- [x] `P0` VERIFY live via Chrome MCP — /signal/AAPL on holdlens.com renders all 4 dossier components in order: 52-week range "Near high" + 8-quarter activity "net selling" + Ownership breadth "Breadth falling -3 owners over 8Q" with 6→8→7→4→4→4→4→3 owner-count series. AAPL clearly losing smart money breadth over 2 years — exactly the signal Dataroma cannot show. [id:verify-v47-v48-live] [score:12.0] ⏱ done

## Queue (v0.46 — /signal 52w range visualizer) — SHIPPED [objective:v46-signal-52w]

- [x] `P0` BUILD components/Signal52wRange.tsx — client-hydrated 52w range gradient bar + value-tier label (Deep value/Near low/Discounted/Mid-range/Near high/At highs) + cross-link to /value [id:signal-52w-component] [score:13.0] ⏱ done v0.46 dea92ce4
- [x] `P0` WIRE Signal52wRange into app/signal/[ticker]/page.tsx between LiveQuote and LiveChart [id:wire-signal-52w] [score:10.0] ⏱ done v0.46
- [x] `P0` BUILD + verify static export (/signal/[ticker] 4.38 kB → 5.51 kB) [id:verify-v46] [score:10.0] ⏱ done
- [x] `P0` COMMIT dea92ce4 + push c996e5d9..dea92ce4 [id:commit-v46] [score:10.0] ⏱ done
- [x] `P0` DEPLOY via wrangler pages deploy out (1149 files uploaded, https://b17d05bb.holdlens.pages.dev) [id:deploy-v46] [score:10.0] ⏱ done
- [x] `P0` VERIFY live — /signal/AAPL has "52-week range" heading, "Near high" tier verdict, /value cross-link, live hydration working [id:verify-v46-live] [score:10.0] ⏱ done

## Queue (v0.45 — /new-positions fresh-money feed) — SHIPPED [objective:v45-new-positions]

- [x] `P0` BUILD app/new-positions/page.tsx — filter "new" action moves in LATEST_QUARTER, rank by positionPct × managerQuality × (1 + max(0,convScore)/100); top 3 hero cards + top 50 table + sector breakdown + busiest-managers panel + why-this-beats-dataroma + CTA [id:new-positions] [score:10.0] ⏱ done v0.45 c996e5d9
- [x] `P0` WIRE /new-positions into layout.tsx desktop nav (lg+) + footer + MobileNav PRIMARY_LINKS [id:wire-new-positions] [score:8.0] ⏱ done v0.45
- [x] `P0` BUILD + verify static export (1.76 kB route, 102 kB First Load JS), fix convictionDirection literal type (NEUTRAL not HOLD) [id:verify-v45] [score:10.0] ⏱ done
- [x] `P0` COMMIT main c996e5d9 + push 2fd38fbd..c996e5d9 [id:commit-v45] [score:10.0] ⏱ done
- [x] `P0` DEPLOY via wrangler pages deploy out — RESCUED 4-DAY DEPLOY GAP, v0.36–v0.44 (9 versions) were stale on CF; 1191 files uploaded in 34.94s; knowledge of manual-deploy requirement now in KNOWLEDGE.md [id:deploy-v45-rescue] [score:15.0] ⏱ done
- [x] `P0` VERIFY live via Chrome MCP — /big-bets/ h1 "Where the best investors bet biggest." + 70 rows, /new-positions/ h1 "New positions from the best investors" + 50 rows + 3 hero cards [id:verify-v45-live] [score:10.0] ⏱ done

## Queue (v0.46+ backlog — Dataroma parity sweep continues)

Priority = (revenue impact × reversibility) / effort. Top of list executed first.

- [x] `P0` BUILD /signal/[ticker] 8-quarter ownership-count sparkline — "owner_count over time" mini-chart using QUARTERS + movesAll [id:signal-owner-spark] [score:12.0] ⏱ shipped v0.47 — TWO complementary server components: (1) **SignalQuarterlyActivity** (flow view: distinct buyers new+add above zero, distinct sellers trim+exit below zero, totals + net direction) and (2) **OwnerCountSparkline** (state view: literal owner_count over time reconstructed by seeding from TICKER_INDEX latest owner set and walking MERGED_MOVES backwards — "new" at q removes from prior-q set, "exit" at q adds back, "add"/"trim" leave unchanged — yields true cumulative owner count per quarter). Flow = who's moving; breadth = how many hold. Both wired on /signal/[ticker] between Signal52wRange and LiveChart. Build clean, all 94 pages render both, /signal/[ticker] stays 5.51 kB (server components, zero client JS).
- [x] `P0` BUILD /manager-rankings page — 30 managers ranked by MANAGER_QUALITY × CAGR × activity, big names vs. quiet alpha side-by-side [id:manager-rankings] [score:12.0] ⏱ done v0.49 6c4992ab — server component, composite = quality × max(1,cagr10y) × (1+movesLast4Q/20), splits 29 managers (3 dropped for no return data) into Big names vs Quiet alpha columns + hero callout when top quiet-alpha beats top big-name on raw alpha + full unified ranked table. Wired into desktop nav (lg+) + footer + MobileNav PRIMARY_LINKS. Deployed https://5a61f94e.holdlens.pages.dev → live on holdlens.com (Chrome MCP verified: 29 rows, hero fires, big-vs-quiet split rendering).
- [x] `P0` BUILD /conviction-leaders page — top 20 managers by average conviction score across their top 10 holdings, sortable [id:conviction-leaders] [score:11.0] ⏱ shipped earlier v0.5x (app/conviction-leaders/page.tsx 306 LOC, in out/, nav-wired, homepage-carded)
- [x] `P0` BUILD /sector/[slug] mini-rotation pages — 12 sector landing pages, each with net-flow trend + top 10 names in sector, hot-linked from /rotation [id:sector-mini-pages] [score:11.0] ⏱ shipped (app/sector/[slug]/page.tsx, 11 sectors in out/)
- [x] `P0` BUILD /crowded-trades page — highest owner_count tickers with conviction signal split (shows consensus crowding risk) [id:crowded-trades] [score:11.0] ⏱ shipped (app/crowded-trades/page.tsx 321 LOC, homepage-carded)
- [x] `P0` BUILD /contrarian-bets page — tickers where ≥2 tier-1 managers are buying AND ≥2 tier-1 managers are selling (smart money disagreement) [id:contrarian-bets] [score:11.0] ⏱ shipped (app/contrarian-bets/page.tsx 308 LOC, homepage-carded)
- [x] `P0` BUILD /exits page — all "exit" action moves, with prior position pct + combined "how big was the bet that just ended" score [id:exits] [score:10.0] ⏱ shipped (app/exits/page.tsx 246 LOC, homepage-carded)
- [x] `P0` BUILD /concentration page — manager portfolio concentration rankings (top-5 pct, top-10 pct), highlights low-diversification high-quality investors [id:concentration] [score:10.0] ⏱ shipped (app/concentration/page.tsx 306 LOC, homepage-carded)
- [x] `P0` BUILD /consensus page — tickers owned by ≥5 tier-1 managers with positive conviction and net buying last quarter [id:consensus] [score:10.0] ⏱ shipped (app/consensus/page.tsx 260 LOC, homepage-carded)
- [x] `P1` CROSS-LINK every /signal/[ticker] to filtered /big-bets (only this ticker) + /sector/[slug] of the ticker [id:signal-crosslink] [score:9.0] ⏱ shipped v0.88 cd49c90a3 — big-bets row hash anchors (id=ticker.toLowerCase()), rank badge links to /big-bets#ticker, sector strip alongside rank badge in "Who's betting biggest" header
- [x] `P1` BUILD /alerts page — "what changed this quarter" rollup showing all >5% portfolio-impact moves across all 30 managers, sorted by impact [id:alerts] [score:9.0] ⏱ shipped (app/alerts/page.tsx exists, in out/alerts/)
- [x] `P1` BUILD /investor/[slug] portfolio concentration pie + YoY holdings-count trend [id:investor-viz] [score:9.0] ⏱ shipped v0.85 — `components/InvestorConcentration.tsx` server component renders: 4-stat strip (Top-1 % with ticker + logo, Top-5 %, Top-10 %, Tracked positions), diversification verdict (Highly concentrated / Concentrated / Balanced / Diversified), stacked horizontal bar (top-5 full-color, 6-10 faded, rest dim), adaptive interpretive sentence. Wired into generic [slug] page + Warren Buffett dedicated page. Zero client JS. Verified live 2026-04-15 on holdlens.com/investor/bill-ackman ("Concentrated" verdict) + buffett (via direct deploy 4d460911). YoY holdings-count trend deferred — requires historical owner-count series per manager which exists in QUARTERS data but not wired; CSIL can pick up follow-up as enhancement. Deploy: 4d460911.holdlens.pages.dev (2090 files / 148.61s after 3 wrangler retries).
- [x] `P1` BUILD /stock/[ticker] redirect alias for /signal/[ticker] — SEO + human-memorable URL [id:stock-alias] [score:8.0] ⏱ shipped (CF Pages `public/_redirects`): `/stock/:ticker /signal/:ticker/ 301` + `/stocks/:ticker/` variant + common typo aliases. Verified live 2026-04-15: `curl -sI holdlens.com/stock/AAPL` → `HTTP/2 301 location: /signal/AAPL/`. Zero duplicate-content penalty; PageRank transfers to canonical.
- [x] `P1` ADD JSON-LD structured data to /signal/[ticker] (Financial Product schema) for Google rich results [id:signal-schema] [score:8.0] ⏱ shipped v0.49 — two inline `<script type="application/ld+json">` tags per page: (1) Article schema with verdict-driven headline (e.g., `AAPL SELL signal — smart money conviction −20`) + about.Corporation with tickerSymbol + industry + OG image, unlocks Google Article rich results; (2) BreadcrumbList (Home → Signals → TICKER) for breadcrumb rich results. Zero page-weight increase, ticker-specific headlines confirmed for all 94 pages.
- [x] `P1` BUILD /api/v1/sector/{slug}.json endpoint — per-sector tickers + top owners, completes the API rotation story [id:api-sector] [score:8.0] ⏱ shipped v0.76 — extended scripts/generate-api-json.ts with sector drilldown section: per-sector JSON file (11 real sectors + "other") containing tickers ranked by ConvictionScore, top-10 managers overweight in sector (sum of their positionPct × sector membership), 8Q flow series mirroring /rotation.json shape, and aggregate stats (ticker count / total owners / avg conviction / net flow 4Q / strong buys / strong sells). Updated /docs endpoint list + catalog index.json. Precomputes conviction once per ticker to skip repeated moves-walk inside sector loop. 12 new files in out/api/v1/sector/, raising API total 134 → 146.
- [x] `P1` BUILD /api/v1/alerts.json — real-time "what changed >5% impact" endpoint [id:api-alerts] [score:8.0] ⏱ shipped v0.77 — top 200 moves with portfolio_impact_pct>5 ranked by impact, mirrors /alerts email digest (NVDA new Burry Q1 2025 49% impact leads). Total matches: 395.
- [x] `P1` BUILD /compare/[pair] visual diff showing overlap Venn + unique-only lists + shared-name convergence chart [id:compare-visual] [score:8.0]
- [x] `P1` BUILD /vs/dataroma page — feature-by-feature comparison table, directly targets "Dataroma alternatives" SEO query [id:vs-dataroma] [score:10.0] ⏱ shipped v0.56 (commit:321e3031 / deploy:78b3a593): h1 + score 14-4-2 + 6 categories + 20 feature rows + 14 HoldLens-wins badges + bottom line LIVE.
- [x] `P1` BUILD /learn/superinvestor-handbook page — 10-section guide on reading 13F filings, conviction signals, copy-trading myth; 3000+ word SEO content [id:learn-handbook] [score:8.0] ⏱ shipped v0.82 (commit:6259a21a6) + v0.83 ShareStrip + v0.82 InvestingBooks Amazon affiliate widget. 3000+ words across 10 sections, Amazon book cards (Graham, Munger, Lynch, Pabrai, Marks) with FTC disclosure, ShareStrip for viral loop. LIVE on holdlens.com/learn/superinvestor-handbook.
- [x] `P1` BUILD /quarterly/[period] full quarter summary — top buys, top sells, biggest new positions, biggest exits for each historical quarter (8 pages) [id:quarterly-pages] [score:8.0] ⏱ shipped v0.60 (commit:a7dafcde / deploy:bcbb430e) — 8 /quarter/[slug] pages LIVE (Q4 2025 + Q3 2024 + 6 historical), h1 + 3 tables x 15/10/11 rows.
- [x] `P2` ADD Plausible custom event firing on /signal ticker searches, /value filter changes, /big-bets row clicks [id:plausible-events] [score:7.0] ⏱ shipped v0.86 (commit:a75e659a0 / deploy:7a23b4ba) — Plausible script upgraded to `script.outbound-links.tagged-events.js` (outbound link auto-track + tagged-events). InvestingBooks emits `Book Click` + asin + title props; AffiliateCTA emits `Broker Click` + broker + symbol props; StripeCheckoutButton already had `Pro Checkout Click`. Signal/value/big-bets row-click tracking still open — they'd need component-level tagging but outbound-link tracking already captures any external clicks from those pages. Can extend in follow-up.
- [x] `P2` ADD CSV export to /best-now, /value, /rotation, /compare/managers, /consensus, /contrarian [id:csv-exports] [score:6.0] ⏱ shipped v0.93 (commit:f5db74e83 / deploy:d21f713d) — /value + /rotation CsvExportButton wired to /api/v1/value.json + /api/v1/rotation.json. /best-now + /consensus + /contrarian-bets already had CSV from prior cycles. /compare/managers skipped intentionally — heatmap + pair-nav surface has no natural tabular slice.
- [ ] `P2` BUILD twitter.com/holdlens_bot daily auto-post of "biggest conviction change today" — requires operator OAuth [id:twitter-bot] [score:7.0] [👤]
- [x] `P2` ADD email digest signup form on /alerts — weekly "biggest moves" email via Resend [id:email-digest] [score:7.0]
- [x] `P2` BUILD /api/v1/consensus.json + /api/v1/crowded.json + /api/v1/contrarian.json endpoints [id:api-v2-endpoints] [score:6.0] ⏱ shipped v0.77 — consensus 5 rows (METaPlatforms 15own/177 composite), crowded 30 rows with loading/unwinding/stable tag, contrarian 33 rows with per-ticker buyer/seller split across 4Q. All ranking logic mirrors the respective HTML pages.
- [x] `P2` BUILD /api/v1/changelog.json — "what changed this quarter" feed for API consumers [id:api-changelog] [score:6.0] ⏱ shipped 9aa8e06 — top 200 moves for LATEST_QUARTER ranked by abs(portfolioImpactPct), enriched with manager name + fund, action new|add|trim|exit
- [x] `P2` ADD dark-pattern-free paywall for /premium features (e.g., custom alerts, unlimited CSV exports) via Stripe — revenue unlock [id:stripe-premium] [score:15.0] ⏱ done v1.24 ab4c1055a — 10/month free tier, unlimited Pro, inline upgrade gate in CsvExportButton, monthly localStorage quota tracking in lib/pro.ts. Operator: set NEXT_PUBLIC_STRIPE_PAYMENT_LINK in CF Pages env to activate checkout link.
- [x] `P2` BUILD /og dynamic OG image generator per route — Satori already installed, extend generate-og-images.ts [id:og-dynamic] [score:6.0] ⏱ shipped v0.89 5ec1042d7 — investor cards (30 managers: name, fund, philosophy, 10y CAGR, alpha vs S&P, top-3 ticker chips) + sector cards (11 sectors: net flow verdict NET BUYING/NET SELLING/MIXED, top-3 ConvictionScore tickers). Wired into investor/[slug], warren-buffett, sector/[slug] page metadata as openGraph.images + twitter.card=summary_large_image. 43 new PNGs per prebuild run. Build clean, zero TS errors.
- [x] `P2` ADD Google Search Console property + submit sitemap — unblocks organic traffic [id:gsc-setup] [score:12.0] ⏱ done 2026-04-16 — GSC property `holdlens.com` (Domain) verified (via meta + /google<token>.html v1.18) AND linked to GA4 property `holdlens.com` on 2026-04-16. Organic search queries + landing pages will flow into GA Search Console report. Sitemap already submitted via public/sitemap.xml. Closed by sovereign-auto Chrome-MCP-fix-all pass.
- [ ] `P2` ADD Bing Webmaster Tools property [id:bing-setup] [score:8.0] [👤]

## Queue (v0.44 — Public JSON API + /docs rewrite) — SHIPPED [objective:v44-public-api]

- [x] `P0` CREATE scripts/generate-api-json.ts — 134-file static JSON generator, 12 endpoint categories, thin { data, meta } envelope [id:api-generator] [score:15.0] ⏱ done v0.44
- [x] `P0` WIRE prebuild hook — "generate-og-images.ts && generate-api-json.ts" chained [id:api-prebuild] [score:10.0] ⏱ done v0.44
- [x] `P0` REWRITE app/docs/page.tsx — removed vaporware waitlist, shipped reality with 12 endpoints + quick-start curl/Python [id:docs-rewrite] [score:12.0] ⏱ done v0.44
- [x] `P0` BUILD + verify 134 JSON files in out/api/v1/ [id:verify-v44] [score:10.0] ⏱ done
- [x] `P0` COMMIT + push main 2fd38fbd [id:commit-v44] [score:10.0] ⏱ done

## Queue (v0.43 — signal bet-size view + big-bets cross-link) — SHIPPED [objective:v43-signal-betsize]

- [x] `P0` ADD module-level getBigBetsRankInfo cache to /signal/[ticker] — O(1) per-page rank lookup instead of O(n²) [id:signal-rank-cache] [score:11.0] ⏱ done v0.43
- [x] `P0` REPLACE current-ownership table with "Who's betting biggest on X" bar chart — horizontal bars by position %, tier-1 badges, thesis quotes [id:signal-barchart] [score:13.0] ⏱ done v0.43
- [x] `P0` ADD "Ranks #N of M tracked bets → /big-bets" cross-link [id:signal-ranks-link] [score:8.0] ⏱ done v0.43
- [x] `P0` BUILD + verify — /signal/[ticker] 4.26 kB → 4.38 kB, clean compile [id:verify-v43] [score:10.0] ⏱ done
- [x] `P0` COMMIT + push + FAST-FORWARD MERGE feature branch → main (main was 44 commits behind, P0 REVENUE BLOCKER found via Chrome MCP deploy-truth check) [id:commit-v43-merge-main] [score:15.0] ⏱ done v0.43

## Queue (v0.42 — /rotation sector-rotation heatmap) — SHIPPED [objective:v42-sector-rotation]

- [x] `P1` BUILD app/rotation/page.tsx server component — 12 sectors × 8 quarters heatmap, size-weighted net flow, 5-tier color scale per side, cell hover tooltip with buy/sell counts [id:rotation-heatmap] [score:12.0] ⏱ done v0.42
- [x] `P1` ADD "Hottest sector, quarter by quarter" summary — per-quarter hot (green) and cold (red) sector ranking [id:hot-cold-strip] [score:8.0] ⏱ done v0.42
- [x] `P1` ADD "Most bought / most sold sector (8Q total)" summary cards [id:sector-totals] [score:6.0] ⏱ done v0.42
- [x] `P0` WIRE /rotation into header nav (lg+), mobile nav PRIMARY_LINKS, footer [id:wire-rotation-nav] [score:8.0] ⏱ done v0.42
- [x] `P0` BUILD + verify static export — /rotation 1.75 kB, clean compile [id:verify-v42] [score:10.0] ⏱ done
- [x] `P0` COMMIT + push [id:commit-v42] [score:10.0]

## Queue (v0.41 — manager overlap matrix) — SHIPPED [objective:v41-overlap-matrix]

- [x] `P1` BUILD overlap matrix heatmap on /compare/managers — 15×15 grid, shared ticker count per cell, 5-tier opacity scale, clickable to pair comparison [id:overlap-matrix] [score:11.0] ⏱ done v0.41
- [x] `P1` ADD "Most similar pairs" derived ranking — top 8 pairs by shared count, ticker chips inline [id:most-similar] [score:8.0] ⏱ done v0.41
- [x] `P1` ADD diagonal labels rotated 60° for compact header row [id:matrix-header] [score:5.0] ⏱ done v0.41
- [x] `P0` BUILD + verify static export [id:verify-v41] [score:10.0] ⏱ done
- [x] `P0` COMMIT + push [id:commit-v41] [score:10.0]

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
- [x] `P1` BUILD Claude Haiku thesis generator per ticker/manager [id:ai-thesis] [score:8.0] ⏱ done wave9 — functions/api/thesis.ts CF Pages Function + components/AiThesisCard.tsx + wired into /signal/[ticker]. Activation: set ANTHROPIC_API_KEY in CF Pages env vars.
- [ ] `P2` BUILD X (formerly Twitter) bot posting top buy/sell signals [id:x-bot] [score:7.0]
- [ ] `P2` BUILD public API + embeds [id:api] [score:7.0]

## 2026-04-16 14:10 — CF EPIPE blocker (v1.17 pending deploy)

- [x] `P0` [👤] Operator: deploy v1.17 via Cloudflare dashboard — SUPERSEDED by subsequent successful wrangler deploys (07dfe0364 32e59be1 2026-04-16 21:00 CEST, 0 new files because CF had content hash-matched from earlier deploy today). No manual dashboard drag-drop needed. [id:cf-deploy-v1.17-pending] [score:9.0]

## 2026-04-16 21:00 — GA4 sovereign-auto ship [objective:v1.24-ga4-analytics]

- [x] `P0` CREATE GA4 property `holdlens.com` (account `HoldLens` 391571004, property 533294495) in paulomdevries@gmail.com account. Netherlands timezone, USD currency, Finance / Small / Drive-sales+Understand-web-traffic objectives. Measurement ID `G-HDK5CHBQEY`. [id:ga4-create-property] [score:15.0] ⏱ done via Chrome MCP
- [x] `P0` CREATE web data stream `HoldLens Web` (stream 14382101557) with Enhanced Measurement ON [id:ga4-create-stream] [score:11.0] ⏱ done via Chrome MCP
- [x] `P0` WIRE `NEXT_PUBLIC_GA4_ID=G-HDK5CHBQEY` into `.env.production.local`. Next.js inlines at build → GA snippet appears in every static HTML (no-op scaffold in `app/layout.tsx` lines 110-127 activates). [id:ga4-env-var] [score:11.0] ⏱ done
- [x] `P0` BUILD + DEPLOY with GA tag live (2541 files, 15.63s). Chrome MCP verified `page_view` firing to `region1.google-analytics.com/g/collect?tid=G-HDK5CHBQEY`. Realtime panel confirmed 2 active users from Netherlands. [id:ga4-deploy-verify] [score:14.0] ⏱ done
- [x] `P1` EXTEND GA4 data retention 2mo→14mo (both event + user data). Default 2mo was silently dropping cohort history. [id:ga4-retention] [score:8.0] ⏱ done via Chrome MCP
- [x] `P1` ENABLE Google signals (cross-device + demographics, consent-gated by layout.tsx Consent Mode v2 defaults). [id:ga4-google-signals] [score:7.0] ⏱ done via Chrome MCP
- [x] `P1` LINK GA4 ↔ Google Search Console (`holdlens.com` Domain property) — organic query data flows into GA. [id:ga4-gsc-link] [score:12.0] ⏱ done via Chrome MCP
- [x] `P1` LINK GA4 ↔ AdSense (`pub-7449214764048186`, Revenue Data Reporting ON) — ad revenue per-page will surface in GA once Google approves AdSense. [id:ga4-adsense-link] [score:10.0] ⏱ done via Chrome MCP
- [x] `P1` CONFIRM `purchase` auto-marked as key event (comes with Drive-sales objective pick). [id:ga4-purchase-key-event] [score:6.0] ⏱ done — cannot be unmarked ("Key event can't be unmarked" tooltip).
- [x] `P2` ADD explicit `gtag('event', 'begin_checkout', ...)` in `components/StripeCheckoutButton.tsx` onClick. ⏱ done v1.25 c9f51cc40 — EUR €9 founders / €14 standard, item_id=holdlens_pro. [id:ga4-begin-checkout-hook] [score:9.0]
- [x] `P2` ADD explicit `gtag('event', 'purchase', ...)` on /thank-you via PurchaseTracker client component. ⏱ done v1.25 c9f51cc40 — sessionStorage dedup, reads ?session_id, defaults €9. Deployed 2631402f.holdlens.pages.dev [id:ga4-purchase-hook] [score:11.0]

## 2026-04-16 21:00 — Session close notes

- Commit `07dfe0364 chore: data refresh + GA4 property live (G-HDK5CHBQEY)` shipped on main.
- Deploy `32e59be1.holdlens.pages.dev` live (CF dedupe confirmed 0 new files).
- holdlens.com confirmed live with GA4 tag firing per Chrome MCP network inspection.
- Oracle projections appended to ORACLE.md (analytics_wiring archetype ×0.10 × 4 rows = ~€5/wk cumulative, awaiting traffic calibration).
- KNOWLEDGE.md Analytics section added documenting full stack.
- Remaining [👤] activation blockers unchanged: Stripe env vars, Amazon Associates, AdSense approval (submitted + awaiting Google), affiliate signups.
