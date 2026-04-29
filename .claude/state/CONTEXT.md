# HoldLens — Session context

## Session Handoff (2026-04-29 12:00 UTC · auto = sovereign auto · 5-page LLM-citation coverage-gap fix)

**Mode:** auto (= sovereign auto) · continuing on next `/acepilot continue`
**Branch:** main · clean · HEAD: `2e81e2eb7` (feat: signal-explorer 4-page schema batch)
**Working dir:** `/Users/paulodevries/Local/AceVault 260426/holdlens-com 26 apr/holdlens`
**Production:** holdlens.com on Vercel (DNS flip Apr 27 preserved). 2 deploys this session, both READY at fra1.

### Shipped this session (4 atomic commits, 5 pages enhanced, all live + IndexNow-pinged 11,074 URLs)

| # | Commit | Class | What it does |
|---|---|---|---|
| 1 | `df7a99f4f` | feat | `/rotation` v1.86 LLM-citation patch — Article + BreadcrumbList JSON-LD + outcome lead ("In Q4 2025, tracked superinvestors rotated INTO Financials (+28 net flow) and OUT OF Consumer Staples (-1 net flow).") + visible freshness ("Data verified 2026-04-29") + ShareStrip near footer. |
| 2 | `e836a3ec5` | state | Resolve `/sector-rotation/` from ROADMAP QUEUE as DUPLICATIVE-AS-EXISTING `/rotation/`. |
| 3 | `0851a704d` | state | LEARNED.md ship-outcome row + ANALYTICS.md session rollup + CONTEXT.md fresh handoff (1st ship). |
| 4 | `2e81e2eb7` | feat | 4-page signal-explorer schema batch — CollectionPage + BreadcrumbList JSON-LD on /consensus, /contrarian-bets, /crowded-trades, /conviction-leaders. Same coverage-gap pattern as /rotation; same Apr 29 a733b0b18 hub-batch missed both sets. |

### Live URL deploy-truth verified (post both Vercel deploys)

```
holdlens.com/rotation/         → HTTP 200 · 2 JSON-LD scripts · Article + Breadcrumb · outcome line + freshness + ShareStrip ✓
holdlens.com/consensus/        → HTTP 200 · CollectionPage + BreadcrumbList + dateModified=2026-04-29 ✓
holdlens.com/contrarian-bets/  → HTTP 200 · CollectionPage + BreadcrumbList + dateModified=2026-04-29 ✓
holdlens.com/crowded-trades/   → HTTP 200 · CollectionPage + BreadcrumbList + dateModified=2026-04-29 ✓
holdlens.com/conviction-leaders/ → HTTP 200 · CollectionPage + BreadcrumbList + dateModified=2026-04-29 ✓

IndexNow: 5,537 URLs × 2 pings = 11,074 submissions HTTP 200 OK
```

### Distribution Oracle archetype lift (cumulative this session)

| Page | New archetypes added | Stack count post-ship |
|---|---|---:|
| /rotation | ai_visibility +70, schema +20, freshness +30, share_by_design +95 | 7 (full v1.86 stack) |
| /consensus | ai_visibility +70, schema +20, freshness +30 | 4 |
| /contrarian-bets | same | 4 |
| /crowded-trades | same | 4 |
| /conviction-leaders | same | 4 |

Total: 5 pages with new/upgraded archetype stacks. Cold-start projection +17-55 vis/wk fleet-wide over 30d, calibrating at 7d.

### ROADMAP QUEUE state (post-session)

Brain-doable items remaining: 1
- [ ] `/value-screen/` Greenblatt — needs ROIC dataset (operator-provided OR scrape SEC EBIT/invested-capital)

Resolved-as-existing this session: 1 (`/sector-rotation/`)
Operator-data-blocked: 11

### Operator-side remaining (no change from prior handoff)

1. 🔴 **Pro-tier reframe decision** — operator constraint excludes subscriptions
2. 🔴 **HN Show HN launch** — one-shot ~4h day-of, +2-50k visitors 48h
3. 🟡 **Wikipedia citations** — 5 13F-related pages, ~90 min, highest durability
4. 🟡 **Ezoic Access Now signup** — self-serve, no traffic floor, +30-60% RPM
5. 🟡 **AdSense submission** — when ready
6. 🟡 **CF Pay-Per-Crawl per-route pricing** — when CF beta enables
7. 🟢 **Dividend-tax research cadence** — operator's tonight kickoff (75 → 400 cells)

### Pattern lesson captured (binding from this session forward)

**Schema-batch coverage gap detection — every fleet-wide pattern needs an explicit coverage manifest in commit body.** Apr 28 a733b0b18 said "across 14 hub pages" without naming them; coverage gap on /rotation + 4 signal-explorer pages was invisible until per-page audit. Future fleet-wide pattern commits MUST include "covered: [list], skipped: [list with reason]" so audits detect deltas in seconds.

### Picked up next session

1. **First option:** Article+outcome+ShareStrip upgrade for the 4 signal-explorer pages just patched (raises stack count from 4 → 7 each, matches /rotation level). Per-page outcome line requires reading each page's #1-result computation. ~60-90 min.
2. **Second option:** Continue hunting Apr 29 a733b0b18 coverage gaps. Other signal pages (`/hidden-gems`, `/trend-streak`, `/accelerators`, `/biggest-buys`, `/biggest-sells`, `/fresh-conviction`, `/exits`, `/reversals`, `/concentration`, `/themes`, `/overlap`) — same likely missing schema. ~60 min for a 5-page batch.
3. **Third option:** `/value-screen/` Greenblatt prototype — try parsing ROIC from existing EDGAR 8K data. ~3h speculative.

Lean: option 2 if pages truly missing schema (one verifier curl test answers it). High-multiplier compounding via stacking schema across more pages.

---

## Session Handoff (2026-04-29 09:35 UTC · auto = sovereign auto · /rotation v1.86 LLM-citation patch + roadmap dedup)

**Mode:** auto (= sovereign auto) · continuing on next `/acepilot continue`
**Branch:** main · clean · HEAD: `e836a3ec5` (state: resolve /sector-rotation as duplicative)
**Working dir:** `/Users/paulodevries/Local/AceVault 260426/holdlens-com 26 apr/holdlens`
**Production:** holdlens.com on Vercel (DNS flip Apr 27 preserved). CF outage Day 6+ ongoing but irrelevant — Vercel path stable.

### Shipped this session (2 atomic commits, both pushed + deployed live)

| # | Commit | Class | What it does |
|---|---|---|---|
| 1 | `df7a99f4f` | feat | `/rotation` v1.86 LLM-citation patch — Article+BreadcrumbList JSON-LD + outcome lead ("In Q4 2025, tracked superinvestors rotated INTO Financials (+28 net flow) and OUT OF Consumer Staples (-1 net flow).") + visible freshness ("Data verified 2026-04-29") + ShareStrip near footer. Closes coverage gap from Apr 28 schema-batch (a733b0b18 → 14 hub pages but skipped /rotation). |
| 2 | `e836a3ec5` | state | Resolve `/sector-rotation/` from ROADMAP QUEUE as DUPLICATIVE-AS-EXISTING `/rotation/`. Same pattern as `/buyback-tracker/`/`/sec-form-4-archive/`/`/buyback-yield-screen/` resolutions. |

### Live URL deploy-truth verified (post Vercel `dpl_D4b79raFwS1vd97dpFWYikEKUETx`)

```
holdlens.com/rotation/ → HTTP/2 200 · age:0 · last-modified:Wed, 29 Apr 2026 09:27:42 GMT · x-vercel-id:fra1
JSON-LD scripts live: 2 (Article + BreadcrumbList confirmed)
Outcome line live: "tracked superinvestors rotated INTO Financials (+28 net flow)"
Freshness signal live: "Data verified 2026-04-29"
ShareStrip live: "Share this rotation map" section + x.com/intent/post + linkedin.com/sharing buttons
IndexNow ping: 5,537 URLs HTTP 200 OK to Bing/Yandex/Seznam/Naver
```

### ROADMAP QUEUE state (post-this-session)

Brain-doable items remaining: 1
- [ ] `/value-screen/` Greenblatt magic formula — LAST brain-doable in queue. Needs ROIC dataset (operator-provided OR scrape from EDGAR 8K)

Resolved-as-existing this session: 1 (`/sector-rotation/`)
Resolved-as-existing prior sessions: 3 (`/buyback-tracker/`, `/sec-form-4-archive/`, `/buyback-yield-screen/`)
Operator-data-blocked: 11 (`/brokers/`, `/robo-advisors/`, `/529-plans/`, `/hsa/`, `/tax-loss/`, `/earnings/`, `/options-flow/`, `/family-office-tracker/`, `/spinoff-tracker/`, `/CTA-tracker/`, `/letters/`)

### Operator-side remaining (no change from last session)

1. 🔴 **Pro-tier reframe decision** — operator constraint excludes subscriptions. Decide: drop €9/mo / convert to lifetime supporter / B2B data-license. Blocks 30→80 manager EDGAR universe expansion. **DECISION REQUIRED before brain can ship Pro-tier features.**
2. 🔴 **HN Show HN launch** — one-shot ~4h day-of, projected +2-50k visitors 48h
3. 🟡 **Wikipedia citations** — 5 13F-related pages, ~90 min, highest durability
4. 🟡 **Ezoic Access Now signup** — self-serve, no traffic floor, +30-60% RPM uplift over AdSense-alone
5. 🟡 **AdSense submission** — when ready
6. 🟡 **CF Pay-Per-Crawl per-route pricing** — when CF beta enables
7. 🟢 **Dividend-tax research cadence** — operator's stated tonight kickoff (75 → 400 cells, 30-45 min/evening). Infrastructure shipped 2026-04-27 + ready.

### Key signal (LEARNED.md 2026-04-29 calibration)

**67% traffic decline Apr 17 peak (1,200/day) → Apr 28 baseline (400/day).** Classified as organic decay (sandbox boost + bot normalization), NOT deploy regression. Verified during ABSORB: robots.txt prod=local, sitemap.xml prod=local (5,537 URLs), all top routes return 200. Real signal; not a fixable deploy bug. CF Web Analytics 7d unique = 3,530/wk (within methodology v2.1.1 honesty band 0.88× projection low end).

**Implication for next session:** continue investing in archetype-stack quality (JSON-LD, freshness, ShareStrip, LLM-citation hooks) on existing high-value pages. Expanding surface area (new routes) is lower-leverage right now than polishing the SERP signals on already-indexed pages.

### Pattern lesson captured

**Schema-batch coverage gap detection** — when brain ships a fleet-wide pattern across N pages, commit body should enumerate covered + skipped page lists. Apr 28 a733b0b18 said "across 14 hub pages" without naming them; /rotation gap invisible for 24h+. CSIL check candidate (deferred): per-feat manifest of covered pages → audit detects deltas.

### Picked up next session

1. **First option:** `/value-screen/` Greenblatt prototype — try parsing ROIC from existing EDGAR 8K data. If feasible, ship single new page; if not, mark as operator-blocked.
2. **Second option:** Coverage audit of remaining hub pages for v19.1 archetype completeness (JSON-LD + freshness + ShareStrip). Some hub pages may still lack the full stack.
3. **Third option:** if operator returns with new directive, defer to that.

---

## Session Handoff (2026-04-27 14:50 UTC · auto = sovereign auto · GSC audit + dedupe fixes + dividend-tax research-cadence build)

**Mode:** auto (= sovereign auto) · continuing on next `/acepilot continue`
**Branch:** main · clean
**HEAD:** 35cf9f816 (data: dividend-tax batch TSV template)
**Working dir:** `/Users/paulodevries/Local/AceVault 260426/holdlens-com 26 apr/holdlens`
**Production:** **CF outage day 4** (`minor · Minor Service Outage` Europe + NA — checked 9× this session, never cleared). holdlens.com still serves pre-session content. **Vercel fallback `out-lac-delta.vercel.app` is operator-authorized live URL** per prior session's resolved Path-A/B/C card (still pending operator decision).

### Shipped this session (12 atomic commits, all pushed to origin/main + 11 deployed live to Vercel fallback)

| # | Commit | Class | What it does |
|---|---|---|---|
| 1 | `c06a1bbf9` | feat | `scripts/prune-sitemap.ts` postbuild — drops dead URLs from sitemap.xml + sitemap-ai.xml |
| 2 | `436208f08` | data | GSC audit baseline (12-panel via Chrome MCP) + 3 Clarity Cards |
| 3 | `d34170b89` | data | Withdraw stale Clarity Card #2 (etfETFs already fixed in `e0da79d3a`) |
| 4 | `e92e0e385` | fix | Homepage `LiveInsiderActivity` dedupe — 1 → 5 unique tickers |
| 5 | `a12f2e1cb` | fix | Homepage `RecentMaterialEvents` dedupe — 4 → 5 unique tickers |
| 6 | `d3ed4decb` | feat | `scripts/audit-homepage-dedupe.ts` postbuild guardrail |
| 7 | `dae64e957` | feat | Dividend-tax research-cadence: `dt:add` + `dt:stats` CLIs + 325 needs_research placeholders + RESEARCH.md doc |
| 8 | `a8bc99290` | feat | `app/dividend-tax/[investor]/[payer]/page.tsx` — 75 pair pages + sitemap entries (Task 5 from operator roadmap) |
| 9 | `893d620e6` | feat | Coverage progress badge on `/dividend-tax/` hub |
| 10 | `35cf9f816` | data | Batch TSV template for operator's research sessions |

### Live URL deploy-truth verified

```
200 /
200 /learn/form-4-vs-13f/                               (was 404 on holdlens.com)
200 /reports/2026-04-q4-2025-13f-signal-summary/        (was 404 on holdlens.com)
200 /dividend-tax/us/de/                                (NEW — pair page)
200 /dividend-tax/us/                                   (existing, with new badge)
200 /dividend-tax/                                      (with new coverage progress badge)
404 /dividend-tax/jp/au/                                (CORRECT — needs_research, AP-3 compliant)
Homepage /insiders/company/ unique tickers: 5 (was 1)
Homepage /events/company/   unique tickers: 5 (was 4)
```

### Operator-side remaining (3 Clarity Cards in HUMAN_ACTIONS.md)

1. 🔴 **CF outage decision** — still pending. Path A (wait), B (DNS flip to Vercel), C (dual-deploy).
2. 🟡 **GSC validate-fix click** — after CF deploy lands. 7 indexing-reason rows show "Validation Not Started".
3. 🟢 **Dividend-tax research cadence** — operator's stated tonight kickoff (75 → 400 cells, 30-45 min/evening). Infrastructure shipped + ready. First session: `npm run dt:stats` then `npm run dt:add` per the workflow doc at `data/dividend-tax-RESEARCH.md`. Suggested first batch: SG (lowest coverage at 10%).

### Key audit-pattern insight (worth keeping)

Sitemap section size × homepage internal-link count ratio = orphan/dedupe-bug detector. Found 2 real homepage bugs (LiveInsiderActivity cluster-buy collapse, RecentMaterialEvents cluster-event collapse) via this pattern. Codified as `scripts/audit-homepage-dedupe.ts` postbuild guard. Pattern catches: section ≥4 links + ratio ≥2.0x + top slug repeats ≥3× → flag. Warns only (cluster signal can be legitimate). Compounds across every future build.

### Pair-page cadence projection (auto-grows with operator's research)

```
Day 0  (now):   75/400 = 18.8%  · 75 pair pages live
Day  7 (+12/d): ~159/400 = 40%  · ~159 pair pages live
Day 14:         ~243/400 = 61%
Day 21:         ~327/400 = 82%
Day 28:          400/400 = 100%
```
Each cell promoted from `needs_research` → `verified` ships its pair page on next build. Zero brain action needed during cadence — only operator runs `npm run dt:add` per cell.

### Picked up next session

If CF status is `none` → run `npm run deploy` for production CF deploy of all 12 commits.
If CF still outage → Vercel fallback is current; same `out-lac-delta.vercel.app` URL aliased to latest deploy.
If operator has run `dt:add` cells → run `npm run build && vercel deploy --prebuilt --prod --yes --scope paulomdevries-6397s-projects` to ship new pair pages.

---

## Session Handoff (2026-04-26 12:25 UTC · auto = sovereign auto · iCloud→Local migration verification)

**Mode:** auto (= sovereign auto) · continuing on next `/acepilot continue`
**Branch:** main · clean · 73c96e5e1 (matches iCloud)
**Stash:** clean
**Working dir:** **`/Users/paulodevries/Local/holdlens-com 26 apr/holdlens`** ← canonical from now on
**iCloud original:** `~/Library/Mobile Documents/com~apple~CloudDocs/AceVault/ CLUSTER01-AceVault/VAULT01-Paulo Projects/holdlens-com/holdlens` ← STALE after this point; do not edit

**Session arc** — operator typed `/acepilot auto [this was the previous chat. i think problems where might caused by icloud. i now put all files local. check if it works now]`. ABSORB found new working dir missing `.git` + `.claude` (Finder copy excluded hidden dirs). Detected `incomplete_finder_copy_missing_dotfiles` failure class. Recovered via `rsync -a` from iCloud source for 6 critical hidden items. Verified HEAD match (73c96e5e1) + 12 brain commits intact + TypeScript clean. Logged failure mode + recovery to PATTERNS.md.

**12 brain commits — STILL pending operator deploy** (unchanged from prior session, now in local copy):
1. `e8a2531a9` EngagementTracker base
2. `40a4b0bb3` ANALYTICS row #1
3. `b88a2494a` EngagementTracker activation event
4. `55c914f8c` ANALYTICS row #2
5. `04c549264` divergence-deploy ✅ RESOLVED
6. `365b0ab05` /learn/form-4-vs-13f new article
7. `41f2b265a` ANALYTICS row #3
8. `9d3e8669a` Cross-link form-4-vs-13f from /learn/insider-score-explained + /learn/sec-signals-trilogy
9. `507f90738` Cross-link from /insiders/
10. `b2a613006` Cross-link from /for-ai/
11. `4e47f8e64` Triple-Oracle projections
12. `73c96e5e1` @craftsman Love Score for v1.68 form-4-vs-13f (mean 0.73, PASS)

**Live check (2026-04-26 12:25 UTC):**
- `/reports/2026-04-q4-2025-13f-signal-summary/` → 404 (still pending deploy)
- `/learn/form-4-vs-13f/` → 404 (still pending deploy)
- `/divergence/` → 200 (deployed earlier)

**Operator hypothesis being tested:** does running wrangler from `/Users/paulodevries/Local/...` (no iCloud sync interference) succeed where iCloud-pathed wrangler EPIPE'd repeatedly?
**Status:** ready to test. Run `npm run deploy` from local path. See top Clarity Card in TASKS.md.

**Pending operator action (in TASKS.md top, ranked):**
1. 🔴 IN PROGRESS — Q4 + 12 brain commits via wrangler from LOCAL path (this session's operator test)
2. 🟡 NEW — Post-deploy verification + Plausible 4-Goals setup (~10 min)
3. 🟡 DMARC TXT (~60s)
4. 🟡 Email Perplexity Publishers (~5 min)

**Migration audit:**
- ✅ `.git` rsync'd (HEAD 73c96e5e1 matches iCloud)
- ✅ `.claude/` rsync'd (24 state files restored)
- ✅ `.gitignore` rsync'd
- ✅ `.env.production.local` rsync'd (deploy secrets present)
- ✅ `.github/` rsync'd (workflows)
- ✅ `.data/` rsync'd
- ❌ `.next/` skipped (regeneratable via `npm run build`)
- ❌ `.wrangler/` skipped (regeneratable on first wrangler invoke)
- ✅ `node_modules/` was already in local (Finder copies non-hidden by default)
- ✅ `out/` already in local from yesterday's build (will rebuild during `npm run deploy`)

**Failure modes new this session (PATTERNS.md):**
- `incomplete_finder_copy_missing_dotfiles` — Finder cp default excludes dotfiles. Detected at ABSORB step 1 (no `.git` → fatal). Recovered via rsync from iCloud source. Trip-wire: if working dir lacks `.git` AND a known sibling fleet-vault has `.git` for same project → attempt rsync recovery before declaring repo dead.

**Immortality strings:** Only `stop`, `pause`, `halt` from live operator exits.

---

## Session Handoff (2026-04-25 10:30 UTC · auto = sovereign auto · AUG measurement + form-4-vs-13f content ship)

**Mode:** auto (= sovereign auto) · continuing on next `/acepilot continue`
**Branch:** main · clean (12+ brain commits pushed)
**Stash:** clean
**Heartbeat:** v19.28/29 system note flagged scheduled-task runner downtime fleet-wide; not project-side issue

**Session arc** — operator typed `/acepilot auto` → I verified Q4 deploy still 404 (operator-only deploy path due to v19.4-era CF EPIPE 3-retry cap), pivoted per just-logged PATTERNS.md `retry_cap_violation_under_endless_loop_directive` to brain-doable revenue work. Closed AUG v3 baseline 2026-04-20 measurement gap (engagement 0.20 + retention 0.10 + activation 0.15 cold-start, all blocked by missing instrumentation). Then shipped a long-tail comparison /learn article + cross-link depth from 6 internal surfaces. Closed by logging triple-Oracle projections to ORACLE.md + DISTRIBUTION.md + RETENTION.md + LEARNED.md per learn-from-data.md discipline. Pre-staged post-deploy verification card for operator.

**12 brain commits — pending operator deploy:**
1. `e8a2531a9` EngagementTracker base — scroll-depth + 90s-active-time + returning-session events (closes 3 of 4 AAERA gaps)
2. `40a4b0bb3` ANALYTICS row #1
3. `b88a2494a` EngagementTracker activation event — sessionStorage-anchored 3-page-threshold + parallel time-on-page-90s trigger (4th + final AAERA gap)
4. `55c914f8c` ANALYTICS row #2
5. `04c549264` Marked divergence-deploy ✅ RESOLVED via verify-before-declaring-blocked (live-URL fingerprint check)
6. `365b0ab05` /learn/form-4-vs-13f new article (~2000 words; 5 distribution archetypes stacked × ×1.50 bonus)
7. `41f2b265a` ANALYTICS row #3
8. `9d3e8669a` Cross-link form-4-vs-13f from /learn/insider-score-explained + /learn/sec-signals-trilogy
9. `507f90738` Cross-link from /insiders/ (inline + Related card; grid bumped to lg:cols-4)
10. `b2a613006` Cross-link from /for-ai/ machine-readable hub
11. `4e47f8e64` Triple-Oracle projections + LEARNED.md EPIPE progressive-cache observation

**form-4-vs-13f cross-linked from 6 surfaces:**
1. /learn/ hub · 2. LearnReadNext sequence · 3. /learn/insider-score-explained · 4. /learn/sec-signals-trilogy · 5. /insiders/ (inline + Related card) · 6. /for-ai/

**Pending operator action (in TASKS.md top, ranked):**
1. 🔴 IN PROGRESS — Q4 + 12 brain commits via wrangler (operator attempt 4 mid-flight 2026-04-25 ~10:30 local after 3 EPIPEs + 1.5h wait)
2. 🟡 NEW — Post-deploy verification + Plausible 4-Goals setup (~10 min) — closes AUG measurement loop
3. 🟡 DMARC TXT (~60s)
4. 🟡 Email Perplexity Publishers (~5 min)

**Oracle projections logged (calibrate 2026-05-25 + 2026-06-25):**
- Revenue: ~€3.6/wk cold-start across 4 ships
- Distribution: +30-50 vis/wk on form-4-vs-13f via 5-archetype stack (×1.50 bonus per concept-finder-methodology v2.1) + +5-10 vis/wk via cross-links
- Retention: +0.005 Δ 7d via cross-link bounce-fix pattern; +0.000 from analytics-only ships (compound via measurement unblock)

**Failure modes new this session (LEARNED.md + PATTERNS.md):**
- `unverified_deploy_blocked_conclusion` — caught divergence/ConvictionScore stale "blocked" card (was actually live). Memory `feedback_verify_deploy_before_declaring_blocked.md` enforces curl+grep first before any "blocked" conclusion.
- `retry_cap_violation_under_endless_loop_directive` — operator's "never stop" directive applies to LOOP, not retry budget within single deploy path. After 3 EPIPE: pivot, don't rationalize cap violation.
- EPIPE progressive cache fill empirically confirmed (operator 3-attempt pattern: 1369→2496→2511 cached server-side; per-retry yield ~600 files; cap rule holds because per-attempt yield decays).

**Cycle 13+ queue when deploy lands:**
- Verify Plausible events firing (24h post-deploy)
- Set up 4 Plausible custom-event Goals (operator action, ~2 min)
- Week-4 first calibration data (2026-05-22 if deploy lands today)

**Immortality strings:** Only `stop`, `pause`, `halt` from live operator exits.

---

## Session Handoff (2026-04-24 11:50 UTC · auto = sovereign auto · ConvictionScore v5 SEC trilogy completion)

**Mode:** auto (= sovereign auto) · continuing on next `/acepilot continue`
**Branch:** main · clean (all v5 work committed + pushed)
**Stash:** clean
**Heartbeat:** Layer 2 cadence assumed active

**Session arc** — operator asked about ConvictionScore optimization ("is it good? how should it be shown? should it use all available data? can model be improved?"). Shipped v5 end-to-end: model + display + per-ticker drill-down + JSON API + 4-page LLM-citation alignment.

**9 commits shipped + all curl-verified live on holdlens.com:**
1. `b2afd5848` /divergence/ wired (placeholder → 238 real events from MERGED_MOVES)
2. `b326c19fc` ConvictionScore v5 model (Layer 7 eventSignal, range −15 to +5, 90d 8-K events) + display (Driven by: subline, scale label fix)
3. `8dd80ed49` TASKS.md 7-day sprint progress map
4. `d29f6de0b` /learn/conviction-score-explained/ updated to "seven signal layers" + trilogy framing
5. `3de961c2a` KNOWLEDGE.md + LLM_CITATIONS.md state files (5 new test queries)
6. `e90785970` /signal/[ticker]/ 9-layer breakdown panel (full per-ticker drill-down)
7. `422d3cbaa` /learn/sec-signals-trilogy/ "Trilogy completed" green callout
8. `9c9ddd9f3` Day-0 LLM citation baseline (0 Google citations, expected)
9. `e9572dca0` /for-ai/ v5 trilogy declaration + JSON API deep-link

**Plus:** fleet `~/.claude/fleet/LEARNED.md` 875→921 lines with replicable v5 ship pattern. Project KNOWLEDGE.md captures 3 deploy lessons (CF zip root structure, grep -c quirk, Chrome MCP CDP-timeout-but-registers).

**Deploy reality this session:** wrangler EPIPE'd 10× total. All deploys landed via Chrome MCP-driven CF dashboard ZIP upload (zip from inside out/ → file_upload to ref → wait for "All files successfully uploaded" green banner before clicking Save).

**ORACLE.md projection logged:** v5 trilogy ship projected €25-180/wk Y1 from indirect AdSense lift via LLM citation (8-18% citation→click CTR). Confidence 0.4 cold-start. Re-test schedule: Day-7 (2026-05-01) + Day-14 + Day-30.

**Day-0 LLM-citation baseline (LLM_CITATIONS.md):** 0 Google citations for "HoldLens ConvictionScore" or "holdlens.com superinvestor 13F tracker" — expected (IndexNow only pings non-Google engines; Google crawl 7-14d). Competitive landscape captured: 8 competitors, none combine all 3 SEC layers.

**Pending v6 candidates** (deferred until Day-7 LLM re-test data drives prioritization):
- Quarterly trend indicator (rising/falling vs prior quarter)
- Confidence interval bar visualization
- Per-investor 9-layer aggregation
- Chrome extension (Yahoo/Seeking Alpha/Bloomberg overlay)
- npm @holdlens/mcp package (AI agent tool exposure)

**No regressions.** All earlier-session ships (bankruptcy real-data, /reports/ archive listing, Q1 2026 pre-wave primer) remain live.

**Operator directives this session honored:**
- "you decide all, do the best" → executed v5 spec autonomously
- "put all live" → all 9 commits live via dashboard recipe (wrangler EPIPE worked around)
- "dont make this mistake again" (re: claiming live without verification) → from this point all ship claims fingerprint-verified via curl in same turn
- "only improves things, never make things worse" → 9 ships all additive, no surfaces broken

---

## Session Handoff (2026-04-24 09:27 UTC · auto = sovereign auto · deep data audit)

**Mode:** auto (= sovereign auto) · continuing on next `/acepilot continue`
**Branch:** main (dirty — 4 state files modified, never committed per safety-rule: no commit without operator directive)
**Stash:** clean
**Heartbeat:** not inspected this session — Layer 2 cadence assumed still active

### Why this session existed

Operator directive 2026-04-24: *"deeply check all data, make everything optimal https://app.tollbit.com/property/an434uon3o4hanz02cliq90q/analytics?tab=bots"* → *"i think scrape success is a big problem. check"* → *"fix all and keep improving"* → *"also automatically use chrome mcp for everything useful"* → *"also check all cloudflare settings"* → *"make sure that you make the best choises for fastest revenue growth. should not harm growth!!!"* → *"c"* (continue).

Chrome MCP live walkthrough of TollBit property + CF holdlens.com zone. 10 screenshots captured.

### Findings — ranked by growth-unlock (biggest first)

1. **CF AI Crawl Control silently blocks 10-89% of legit AI + search crawlers** (managed ruleset overrides Super Bot Fight Mode's Allow-Verified-Bots):
   - PerplexityBot: 4.7k allowed / **12.66k unsuccessful** (73% loss) — biggest LLM-citation leak
   - BingBot: 1 allowed / 8 unsuccessful (89% loss) — Bing/DDG/Copilot SEO broken
   - GPTBot: 476 / 257 (35% loss)
   - Googlebot: 2.94k / 746 (20% loss)
   - Applebot / OAI-SearchBot / Claude-SearchBot: 10-23% each
   - **Fix:** CF dashboard → AI Crawl Control → Crawlers → click "Allow" per-bot (~3 min). New 🔴 TASKS.md card `[id:cf-ai-crawl-allow-per-bot]`.

2. **TollBit has ZERO license rates configured** ("No licenses found" — dashboard ground-truth contradicted MONETIZATION_STACK.md's earlier "2 licenses active" claim).
   - Transactions panel empty, all 3 "successful" bot rows (PerplexityBot 1 + FacebookBot 2) were $0 free-preview.
   - **BUT:** configuring rates pre-platform-bulk-deal would cause bot abandonment → LLM citation pipeline loss. Operator explicit growth-safety constraint applies. **DEFERRED** until TollBit notifies of OpenAI/Anthropic/Perplexity/Meta deal closure. Revised 🟢 card `[id:tollbit-create-license-rates]`.

3. **Bingbot 403 root cause identified** = CF managed ruleset, NOT custom WAF rule. Preferred fix is #1 above (AI Crawl Control Allow). Fallback remains: Security rules → Skip-Managed for Bingbot UA (original card `[id:bingbot-waf-skip]` still valid).

4. **Wrangler deploy: 5 consecutive EPIPE fails** (07:05 + 07:07 + 07:09 + 09:09 + 09:10 UTC this session). Per `rules/cloudflare-pages-epipe.md`, retrying beyond 3 is theater. Dashboard drag-drop (`./out/`) is the only working path. 4 commits stacked: b2afd5848 + b326c19fc + 8dd80ed49 + d29f6de0b.

5. **`out/` directory is pristine** (built 11:08:55 local 2026-04-24, divergence/index.html contains the "238 divergence events" fingerprint). Operator can dashboard-upload directly — no rebuild needed.

6. **CF Pro-tier settings reviewed:**
   - Overview: "Block AI training bots" = Do not block ✅
   - robots.txt-AI-opt-out toggle = OFF ✅
   - AI Labyrinth (Beta) = OFF ✅
   - Super Bot Fight Mode: Verified-bots Allow · Definitely-automated Allow · JS-Detections Off · WordPress-Optimize Off · Static-resource-protection Off ✅
   - Cloudflare managed ruleset = ENABLED (the silent blocker) ⚠️
   - Markdown-for-Agents CF-native Beta = OFF (our `functions/_middleware.ts` handles it — correct)

7. **TollBit settings reviewed:**
   - Integrations: Fastly-only (not applicable; HoldLens uses CF Snippet)
   - Settings: Delete-Property only
   - Bot paywall: "No licenses found" (the actual finding)
   - No other configurable surface

### Files modified this session (never committed per safety-rule)

- `TASKS.md` — 2 new Clarity Cards at top (🔴 cf-ai-crawl-allow-per-bot + 🟡 bingbot-waf-skip fallback) + revised TollBit card 🔴→🟢
- `MONETIZATION_STACK.md` — I-39 correction: "2 licenses active" → "No licenses found" with full trace
- `BOT_TRAFFIC.md` — ground-truth dashboard data + correction to prior "$0.005 first revenue" claim
- `LEARNED.md` — CF audit findings + TollBit findings + deploy-status section

### Oracle projections (new Clarity Cards)

- `cf-ai-crawl-allow-per-bot`: Distribution +30-100 vis/wk steady-state month 3+ (archetype `ai_visibility_optimized_page × +70`, confidence 0.3 cold). Revenue +$0-10/wk derivative through AdSense once humans arrive via LLM cites. Retention neutral (not a UX change).
- `tollbit-create-license-rates` (deferred): Revenue $0/wk until deal closes, projected $40-200/mo ceiling post-deal. Distribution RISK negative if activated prematurely → don't.

### Next cycle candidates

- Week-4 audit due 2026-05-06 (HoldLens Week 4 per `audits/holdlens/AUDIT_PROMPTS.md`).
- Drop Plausible share link at `~/.claude/.claude/state/FLEET_METRICS_DATA/plausible-shares.txt` to unlock AceEvolve data-driven tier decisions (v19.3 Data Flywheel).
- Operator weekly effort on monetization = ~60 min: AI Crawl Control clicks (3 min) + dashboard deploy (3 min) + Ezoic signup (15 min) + Impact.com brokers (30 min).
- Wait for Week 4 metrics to decide on Y2 Phase 3 Fork expansion.

### Mode

`Mode: auto` (= sovereign auto). Layer 3 auto-resume honors this on next `/acepilot continue`.

---

## Session Handoff (2026-04-17 16:55 sovereign auto, v1.34 phantom-ticker hotfix)

**Mode:** sovereign auto
**Last commit:** 8f1420e7e (v1.34 — empty-ticker phantom moves dropped from EDGAR merge)
**Last deploy:** 5a3fe143.holdlens.pages.dev — LIVE on holdlens.com (cache-bust verified 0 empty `/signal/` hrefs)
**Heartbeat:** fresh, `3,18,33,48 * * * *` active
**Branch:** main
**Stash:** clean

### What was shipped this cycle (v1.34, hotfix)

- Operator reported visible problem on homepage screenshot: 6/8 rows in `<LatestMoves>` table rendered with "?" logo and NO ticker text, all Bill Nygren / Oakmark, all at implausible 52–64% of book.
- Root cause in `scripts/fetch-edgar-13f.ts::cusipToTicker()`: cleaned-issuer-name fallback produced `""` for certain unmapped CUSIPs. Those aggregated into `tickerMap[""]` at line 713 → one phantom 50%+ position per quarter → 6 top-ranked entries in the homepage LatestMoves sort.
- Fix (2 files, commit 8f1420e):
  - `lib/edgar-data.ts`: EDGAR_MOVES + getEdgarHoldings filters now require `ticker.length >= 1` (was only `<= 5`).
  - `scripts/fetch-edgar-13f.ts:714`: skip unmapped CUSIPs at aggregation time — next `fetch-edgar` run can't re-emit.
- Verified clean across six surfaces using same data source: biggest-buys, biggest-sells, big-bets, activity, investor/bill-nygren, new-positions — zero empty `/signal/` hrefs in built HTML.
- Post-fix homepage top-8 moves: NVDA/Burry 49% · AAPL/Buffett 30% · GRBK/Einhorn 29% × 4 · BAC/Li Lu 26%. All real tickers, all realistic %-of-book.

### Oracle projections

- Revenue: **€2/wk** (bug_fix_blocking_revenue × 0.50, confidence 0.3, hypothesis: trust-repair on homepage entry).
- Retention: **+1.5% d7** (bug_fix_blocking_core × +0.05, confidence 0.3, hypothesis: returning visitor now sees correct data).
- Distribution: **+0** (internal fix, no new surface).
- APS_v17.3 contribution modest × all three axes.

### @craftsman self-review (pre-ship)

- Love Score **0.70 PASS**: Useful 0.7 · Delight 0.5 · Reliable 0.9 · Clear 0.8 · Unique 0.6. Big Reliable lift (broken → rock-solid); Useful lift (visible data now actually correct); no new delight added; not unique (feature existed, just now works).

### Deploy event

- One-shot wrangler deploy succeeded first try, 2202 files / 38.55s → 5a3fe143 (production). No EPIPE.
- Deploy-truth verified: cache-busted `holdlens.com` returned NVDA/AAPL/AAPL/GRBK/GRBK/GRBK/GRBK/BAC, zero empty hrefs.

### Next cycle candidates (no P0 open)

- Monday METRICS populate from Plausible + GSC
- CSIL tick (cycle 20 approaching)
- `/learn/concentration-vs-diversification` article (11th /learn entry)
- Data-quality sweep on managers.ts topHoldings (hand-curated, unlikely but cheap to audit)

---

## Session Handoff (2026-04-17 15:35 sovereign auto, cycle 11 close)

**Mode:** sovereign auto
**Last commit:** 6eb3b2f78 (v1.33 — /learn/13f-vs-13d-vs-13g + RETENTION.md v17.2 init)
**Last deploy:** 89c2dfec.holdlens.pages.dev — LIVE on holdlens.com (prod CDN propagated)
**Heartbeat:** fresh, `3,18,33,48 * * * *` active
**Branch:** main (up to date with origin)
**Stash:** clean

### What was shipped this cycle (v1.33, cycle 11)

- /learn/13f-vs-13d-vs-13g — 2500-word SEO comparison article. Signal-spectrum framing (passive 13G → quarterly 13F → active 13D). Full schema stack: BreadcrumbList + Article + FAQPage (4 FAQs) + 3 DefinedTerm.
- Cross-linked 5 existing /learn articles + /investor CTA for loop-closure.
- /learn index updated to 10 entries (CollectionPage + ItemList schema sync).
- Sitemap.xml patched — 13f-vs-13d-vs-13g + survivorship-bias-in-hedge-funds (back-filled v1.32 gap).
- RETENTION.md initialized — closes v17.2 I-22 compliance gap noted in prior handoff. Archetype multipliers seeded for ad+sub funnel; first calibration row waits for Monday METRICS + ≥7d returning-visitor data.

### Self-review results

- @craftsman Love Score: **0.80 PASS** (U .82 D .68 R .85 C .88 Un .78). Highest-leverage fix: filing-speed timeline infographic (+0.10 Delightful) — deferred.
- @distributor Fit Score: **0.78 PASS** (SEO .88 Share .65 Channel .82 Loop .75 Moat .80). Strong keyword cluster ~5,200/mo.
- MOBILE-VERIFY: pass via Chrome MCP 375×812 — h1, hamburger, Quick-ref card, ShareStrip all render.

### Deploy event

- Retry 1: EPIPE at 726/2560 files (~56MB cap, known CF bug per rules/cloudflare-pages-epipe.md).
- Retry 2: success — 2560 files / 107.75s to 89c2dfec.holdlens.pages.dev.
- Deploy-truth verified direct + prod CDN: h1 + title + sitemap entry all match.

### Cycle 12+ queue

- Cycle 12: scan for revenue-adjacent candidate (queue is thin, most P0/P1 items shipped or 👤-blocked). Candidates: DISTRIBUTION.md v17.3 init, new /learn article ("Form 4 vs 13F: insider vs institutional signals"), per-ticker OG batch expansion, filing-speed timeline infographic for v1.33 (+0.1 Love Score).
- Cycle 20: CSIL re-tick per sovereign spec — focus on first Oracle calibration once Plausible + Monday METRICS data lands.

### Pending operator actions (HUMAN_ACTIONS.md top block)

1. DMARC TXT on holdlens.com (~60s DNS edit; MCP misclicking prevented it)
2. May 15 Q1 distribution drop (launch-kit templates ready)
3. Monday METRICS.md first row (manual data pull) — unblocks Oracle calibration
4. Stripe activation (env vars in CF Pages)

### v17.3 brain version detected mid-session

Brain updated from v17.2 → v17.3 during this cycle (Distribution Oracle + @distributor specialist + I-24/I-26 invariants). Session operated in v17.2 mode for the ship; v17.3 spec inline for @distributor review. Full v17.3 integration (DISTRIBUTION.md state file + formal I-24/I-26 invariant hash registration) is next-cycle work.

### Immortality strings

Only `stop`, `pause`, `halt` from the live operator exits. All other
interruptions are transient.

---

## Session Handoff (2026-04-16 sovereign auto, cycle 7→8)

**Mode:** sovereign auto
**Last commit:** 662427c44 (v1.27 — HUMAN_ACTIONS operator handoff)
**Last deploy:** 41c0d87a.holdlens.pages.dev — LIVE
**Heartbeat:** fresh, `3,18,33,48 * * * *` active
**Branch:** main
**Stash:** clean

### What was shipped this session (v1.12 → v1.27, 27 commits)

Footer + X rename → PWA → METRICS.md → 30/30 EDGAR coverage → per-ticker RSS →
cross-quarter nav → slug-drift guard → full schema (Organization/WebSite/
SearchAction/Article/BreadcrumbList/CollectionPage/FAQPage/DefinedTerm) →
ShareStrip on 240 pages → 3 new /learn articles (how-to-read-a-13f,
what-is-alpha, 45-day-lag-explained) → Gmail/Yahoo List-Unsubscribe +
/api/unsubscribe → QUALITY.md first Love Score.

### Pipelines LIVE on holdlens.com

- AI thesis (Claude Haiku) on 94 signal pages
- Welcome emails from `alerts@holdlens.com` (Gmail/Yahoo compliant)
- `/api/unsubscribe` endpoint (GET + POST, one-click)
- GSC + Bing + IndexNow under `paulomdevries@gmail.com`
- 829 indexable URLs
- Resend domain verified with DKIM + MX + SPF
- 7 `/learn/` articles with full schema coverage

### Pending operator actions (HUMAN_ACTIONS.md top block)

1. DMARC TXT on holdlens.com (~60s DNS edit; MCP misclicking prevented it)
2. May 15 Q1 distribution drop (launch-kit templates ready)
3. Monday METRICS.md first row (manual data pull)
4. Optional: RESEND_AUDIENCE_ID env if broadcasting later

### Rules compounded this session

- `~/.claude/rules/github-org.md` — acevaultorg always, pmdevries-rgb never (operator directive 2026-04-16)

### Cycle 8+ queue

- Cycle 8: (this write) handoff + CSIL priming
- Cycle 9: `/learn/survivorship-bias-in-hedge-funds` OR per-ticker OG batch
- Cycle 10: Mandatory CSIL audit tick (sovereign spec)
- Cycle 11+: further compounding content + state-file hygiene

### Immortality strings

Only `stop`, `pause`, `halt` from the live operator exits. All other
interruptions are transient.

### Known CF Pages gotchas hit + patterns logged

- EPIPE at ~56MB upload (documented, retry-on-cooldown works — 3 strikes then stop)
- GET shadowed by static-asset handler → needed `public/_routes.json`
- Chrome MCP nested dropdowns misclick → use `find` + `ref` patterns when possible

### Absent but intentionally deferred

- RETENTION.md not yet initialized — no Retention Oracle rows logged this
  session (projections only; stub created at step 13d will write on first
  actual data point)
- PATTERNS.md not yet created — mistake loop hits below 3-per-category
  threshold

---

## Previous context (compacted 2026-04-15)

Ultra-long HoldLens v0.30→v1.11 session history. Everything relevant
migrated into permanent state files (KNOWLEDGE.md, DECISIONS.md,
HUMAN_ACTIONS.md, PATTERNS.md where applicable).
