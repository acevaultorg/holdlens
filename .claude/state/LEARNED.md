# LEARNED.md — HoldLens compounding knowledge (v18.0)

**Invariant:** I-30 (append-only). Row deletions forbidden. Corrections in
`## Corrections` with `corrects: <timestamp>` field.

**Target:** I-28 auto-calibration fires when any archetype accumulates ≥10
ship-outcome rows AND mean (actual / projected) ratio diverges >25%. Bounded
auto-correction ±50% per cycle logs to `## Multiplier Corrections`.

## Project context

- **Product:** HoldLens (holdlens.com) — quarterly 13F-tracking for 30
  superinvestors; static Next.js export on Cloudflare Pages.
- **Domain authority (DA/DR):** 5 estimated (new 2026 launch, pre-indexation maturity).
- **Primary distribution channels:** organic SEO (/learn articles,
  programmatic /signal + /investor + /sector pages, comparison pages),
  social shares (ShareStrip on 240+ pages), email digest (Resend verified,
  awaiting first send), RSS feeds (per-ticker + per-manager).
- **Baseline weekly revenue:** €0 (pre-monetization — Stripe env vars pending).
- **Baseline weekly visitors:** pre-traffic (first Monday METRICS rollup
  will seed once GSC + Plausible accumulate ≥7d of data).
- **Baseline 7d retention:** unknown (Plausible returning-visitor % waits
  for data accumulation).

## Ship outcomes (append-only)

<!-- Format: timestamp | project | archetype | projected | actual_d7 | actual_d30 | ratio | note -->

```
2026-04-17 15:35 | holdlens | SEO_page_addition (comparison_article) | proj:+3 vis/wk, +€3/wk | TBD | TBD | TBD | v1.33 /learn/13f-vs-13d-vs-13g — 2500-word signal-spectrum comparison targeting ~5,200/mo query cluster. FAQ schema + Article + BreadcrumbList + 3 DefinedTerm. @craftsman Love 0.80 PASS · @distributor Fit 0.78 PASS. MOBILE-VERIFY: pass.
2026-04-17 11:48 | holdlens | SEO_page_addition (editorial_long_form) | proj:+3 vis/wk | TBD | TBD | TBD | v1.32 /learn/survivorship-bias-in-hedge-funds — 2500-word editorial targeting ~7,000/mo query cluster. Thick-content HCU-safe; honest selection-effect POV.
2026-04-17 09:15 | holdlens | craftsmanship_polish (semantic_colors) | proj:+0.006 Δ 7d-return, €0/wk | TBD | TBD | TBD | v1.09 MobileNav semantic color system — removed brand-rotation violating tailwind.config.ts reserved-use rule. Semantic-only: buy/sell/info/brand. @craftsman Love 0.78 PASS.
```

## Multiplier Corrections

<!-- I-28 auto-calibration writes append-only rows here.
     Format: timestamp | archetype | old_mult | new_mult | n_samples | mean_ratio | bounded_to_±50% | reason -->

```
(none yet — waiting for 10+ same-archetype ship outcomes with 7d actuals)
```

## LLM-citation learnings (10-characteristic checklist, Aleyda Solis 2026)

Applied by @distributor in grow mode. HoldLens per-characteristic status:

| # | Characteristic | HoldLens status | Evidence |
|---|---|---|---|
| 1 | Accessible | ✓ STRONG | static export, SSR'd HTML, no JS-gated content on /learn or /investor or /signal |
| 2 | Useful | ✓ STRONG | unique data (30 superinvestors × 8 quarters × 94 tickers = dossier depth no competitor ships) |
| 3 | Recognizable | 🟡 MODERATE | HoldLens name consistent; no Wikipedia entry yet, no About-author schema |
| 4 | Extractable | ✓ STRONG | FAQ schema on /learn articles; quote-ready section headings; DefinedTerm about-entities |
| 5 | Consistent | 🟡 MODERATE | brand voice consistent across /learn; brand visual consistent; no third-party profile consistency check done |
| 6 | Corroborated | 🔴 WEAK | no Reddit presence, no LinkedIn presence, no tier-1 media pickup, no Wikipedia citation — major GEO gap |
| 7 | Credible | 🟡 MODERATE | methodology page exists; author identity not yet stamped on every article; E-E-A-T signals thin |
| 8 | Differentiated | ✓ STRONG | "signal spectrum" framing on v1.33, honest survivorship-bias POV on v1.32, composite ConvictionScore |
| 9 | Fresh | ✓ STRONG | 13F data refreshed per filing cycle; last published 2026-04-17 |
| 10 | Transactable | 🟡 MODERATE | /pricing live; Stripe payment link env vars not yet set (operator-gated) |

**LLM-visibility gap priorities** (cycle 12+ candidates):
1. Reddit-organic-helpful-comment archetype (×+70 per v18 calibrated multipliers) — post substantive answers in r/SecurityAnalysis, r/ValueInvesting, r/investing citing HoldLens data naturally
2. LinkedIn zero-click framework posts (×+65) — operator-published short essays linking back
3. Per-article author byline + Person schema (schema_markup_article_person_org ×+20 — closes E-E-A-T gap)
4. Wikipedia-sourced edit (×+75) — create or edit hedge-fund / 13F Wikipedia entries citing HoldLens as reference
5. Shareable tool / calculator (×+65) — e.g., "what would $10K in Buffett's 1990 portfolio be worth today?"

## Fleet-level observations

<!-- Fleet rollup rows from ~/.claude/fleet/LEARNED.md are read at ABSORB
     step 13f. Per-project ship outcomes flow upward via CSIL cycles. -->

```
(waiting for fleet-rollup seed — HoldLens is first project in VAULT01 to
initialize LEARNED.md under v18.0 spec)
```

## Cloudflare audit findings (2026-04-24, Chrome MCP live read)

**Source:** `/ai/bots` + `/security/settings?tabs=bot-traffic` + `/agent-site/bot-paywall` (TollBit) walkthrough.

### Silent crawler block rates (CF AI Crawl Control, last 7 days)

| Crawler | Allowed | Unsuccessful | Block % |
|---|---:|---:|---:|
| PerplexityBot | 4,700 | 12,660 | **73%** |
| BingBot | 1 | 8 | **89%** |
| GPTBot | 476 | 257 | 35% |
| Claude-SearchBot | 10 | 3 | 23% |
| Googlebot | 2,940 | 746 | 20% |
| OAI-SearchBot | 368 | 55 | 13% |
| Applebot | 1,640 | 178 | 10% |
| ChatGPT-User | 384 | 0 | 0% ✅ |
| ClaudeBot | 397 | 13 | 3% ✅ |
| CCBot | 3 | 0 | 0% ✅ |

**Learning:** even though Super Bot Fight Mode → Verified bots = **Allow** and Block AI bots = **Do not block**, the Cloudflare managed ruleset (enabled, covers Bot traffic + Web app exploits + DDoS) silently rejects 10-89% of the listed AI/search crawlers. Super Bot Fight's Allow-Verified-Bots doesn't override managed-ruleset patterns that classify a request as "bot-like + suspicious shape." 

**Fix pattern:** use AI Crawl Control → Crawlers → per-bot **Allow** button (explicit override). Do NOT try to fix via Super Bot Fight Mode tuning (already correctly permissive). Do NOT use managed_ruleset-disable (breaks legitimate threat defense).

**Growth risk quantified:** 12.66k weekly PerplexityBot misses is the biggest LLM-citation-pipeline leak the fleet has ever had data for. Recovery takes ~30 days after Allow (LLMs re-crawl + re-index on their own schedules). Expected Distribution Oracle lift: +30-100 vis/wk steady-state month 3+ per the `ai_visibility_optimized_page × +70` archetype.

### Bingbot 403 — post-audit correction

On revisit of ANALYTICS.md, the operator deployed a `Skip managed rules for verified search bots` WAF custom rule on 2026-04-21 19:55 UTC, expression `(cf.verified_bot_category in {"Search Engine Crawler" "Search Engine Optimization"})` + action Skip (managed rules + custom rules + rate limiting).

**Implication for curl-based diagnostics:** `cf.verified_bot_category` evaluates via Cloudflare's reverse-DNS + IP-ASN verification of the live crawler session. A `curl -A "Bingbot"` request from a residential IP will NEVER be classified as verified → will always hit the managed ruleset → will always 403. This is a FALSE NEGATIVE in my earlier curl test; the WAF rule is functioning correctly for real Bingbot sessions from Microsoft ASN IPs.

**But:** the CF AI Crawl Control panel showed **BingBot: 1 allowed / 8 unsuccessful (89% block)** real-request telemetry over the last 7 days. Since CF's verified_bot_category check happens on real Bingbot sessions, the 8 unsuccessful requests mean either:
- The WAF rule hasn't fully propagated yet (24-72h window noted in the Apr 21 entry; we're now at T+60h, should have propagated).
- The rule's expression doesn't match the specific pattern those 8 requests hit (maybe they came in before Microsoft's DNS verification chain completed).
- The managed-ruleset block path is not the SAME blocker category as the rule's Skip targets.

**Updated diagnosis:** the `cf-ai-crawl-allow-per-bot` fix (click Allow per-crawler in AI Crawl Control → Crawlers) remains correct — it targets a DIFFERENT rule layer (AI Crawl Control's own enforcement) than the custom WAF rule. The two operate in parallel. Doing both is safer than doing either alone.

### TollBit audit findings

- **License rates panel: "No licenses found"** — zero license rates configured. Forwarding + analytics both confirm bots reach tollbit.holdlens.com (46 forwards/wk), but with no rates, TollBit serves empty-license JSON preview with full content for free.
- **Transactions: empty** (no paid rows, ever).
- **Integrations: Fastly-only** (not applicable; HoldLens uses CF Snippet for forwarding).
- **Settings: Delete-Property only** (no knobs other than licenses).
- **3 "successful" scrapes this week** per per-bot table (PerplexityBot 1 + FacebookBot 2) were $0 free-preview scrapes — TollBit's internal "passed paywall" counter, not revenue events.
- **Growth decision:** DO NOT create license rates pre-BDev-deal — would trigger 402 Payment Required for bots without TollBit tokens → abandonment → LLM citation pipeline loss. Wait for TollBit to notify of OpenAI / Anthropic / Perplexity bulk deal closure. Full rationale in TASKS.md `[id:tollbit-create-license-rates]` revised card.

### 🎯 WAF Skip rule extended to include AI bot categories (2026-04-24, Chrome MCP executed)

Operator directive *"chrome mcp fix it all"* authorized brain-executed remediation. Took the growth-restoration action directly via Chrome MCP driving CF dashboard:

**Rule edited:** Custom Rule ID `246239907b594109ba3833b11e7688d6` — was "Skip managed rules for verified search bots" (2 categories) → renamed "Skip managed rules for verified search + AI bots" (5 categories).

**Expression change:**
```
BEFORE: (cf.verified_bot_category in {"Search Engine Crawler" "Search Engine Optimization"})
AFTER:  (cf.verified_bot_category in {"Search Engine Crawler" "Search Engine Optimization" "AI Crawler" "AI Assistant" "AI Search"})
```

**Action + WAF components skipped:** Skip · All remaining custom rules · All rate limiting rules · All managed rules. Log matching requests ON. Placed First. Super Bot Fight Mode Rules checkbox left unchecked (matches pre-existing operator choice; SBFM already Allows verified bots).

**What this fixes in one move:**
- PerplexityBot (AI Search) — was 73% blocked (4.7k allowed / 12.66k unsuccessful)
- GPTBot (AI Crawler) — was 35% blocked (476/257)
- ClaudeBot + Claude-SearchBot (AI Crawler) — were 3-23% blocked
- Applebot (AI Search) — was 10% blocked (1.64k/178)
- OAI-SearchBot (AI Search) — was 13% blocked (368/55)
- ChatGPT-User (AI Assistant) — covered for future defenses
- CCBot (AI Crawler) — covered for future defenses

**Why this is cleaner than the per-bot Allow clicks:**
- Single rule covers every current + future bot in the 5 categories (as CF adds new AI bots, they inherit the Skip)
- Persists in Security rules list (visible + auditable)
- Uses `cf.verified_bot_category` — reliable reverse-DNS + ASN verification, not UA-spoof-able
- Same mechanism as the Apr 21 rule the operator trusted for search engines

**Propagation window:** 24-72 hours per CF Bot Management docs. Expected: CF AI Crawl Control "Unsuccessful" counts drop dramatically for the 5 affected categories. Measure on 2026-04-27 Crawlers page.

**Risk/reversibility:** zero. Bot-category-based skip; humans unaffected (not in verified_bot_category). Revert = remove 3 chips from the Value field. Can tighten per-bot-category if any category shows abuse pattern post-enablement. Custom rules budget: 1/20 used (still 19 remaining).

**Supersedes earlier session cards:**
- `[id:cf-ai-crawl-allow-per-bot]` — per-bot AI Crawl Control Allow clicks (persistence was unclear; this rule is more robust)
- `[id:bingbot-waf-skip]` — operator-time Bingbot WAF Skip card (this rule already covered Bingbot + goes further)

### robots.txt — 4 newer bot UAs added (2026-04-24 11:38 local rebuild)

`app/robots.ts` LLM_BOTS list extended from 22 → 26 bots. Newly added: **Claude-SearchBot** (Anthropic's newer search crawler, observed in CF AI Crawl Control this session), **Amzn-SearchBot** (Amazon AI-search variant — TollBit canonical list), **Meta-Webindexer** (TollBit canonical), **Timpibot** (TollBit canonical). Each gets explicit Allow: / + Disallow: /_next/ (saves ~16.75k wasted /_next/ crawler 404s/wk per prior measurement). Total `User-Agent:` rules in rebuilt robots.txt: 27 (26 specific + 1 wildcard). `out/` rebuilt at 11:38:01 local — operator's dashboard drag-drop will ship these + the 4 stacked commits (b2afd5848 + b326c19fc + 8dd80ed49 + d29f6de0b) in one upload. Archetype: `robots_txt_fix × +3` growth-safe.

### Wrangler deploy status

- 5 consecutive EPIPE failures across 2 sessions (2026-04-24 07:05, 07:07, 07:09, and 09:09-09:10 this session).
- Per `~/.claude/rules/cloudflare-pages-epipe.md`: 3+ fails in a row = external stable CF API behavior, not local fixable.
- Only working path: operator drag-drop of `./out/` directory into CF Pages dashboard.
- 4 commits stacked on origin/main waiting: b2afd5848 (divergence wire-up) + b326c19fc (ConvictionScore v5) + 8dd80ed49 (tasks doc) + d29f6de0b (v5 explainer).

## Failure modes logged (append-only)

<!-- Pattern repeats 3+ → CSIL proposal for rules/[pattern].md -->

```
2026-04-17 | CF Pages EPIPE at ~56MB upload — retry 1-2 succeeds (known class). Rule: rules/cloudflare-pages-epipe.md (max 3 retries then [👤]).
2026-04-15 | 4-day deploy gap — CF Pages project NOT git-integrated. Rule: always manual wrangler deploy post-build. Documented in KNOWLEDGE.md.
2026-04-25 | CF Pages EPIPE — progressive cache fill confirmed empirically. Operator ran 3 attempts: (1) 1369/10858 EPIPE, (2) 2192→2496/10858 EPIPE, (3) 2511/10858 EPIPE. Each retry's "already-uploaded" baseline grew (~600 files/attempt) AND the connection still hit ~56MB cap and disconnected. Per-attempt yield decays. New finding: at ~600 files/retry × 10,858 total = ~14 retries to land all files. Rule's 3-cap holds — would violate retry_cap_violation_under_endless_loop_directive. Empirical fix per cloudflare-pages-epipe.md: WAIT 1-2h, retry once. CF API stuck-state self-resolves across the day. Pattern: progressive cache fill is REAL but per-retry yield insufficient to overcome cap; only time-window change unblocks.
```

## Corrections

<!-- Append-only. Format: corrects: <timestamp> | reason | new_value -->
