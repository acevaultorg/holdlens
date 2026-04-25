# HoldLens — Session context

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
