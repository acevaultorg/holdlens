# HoldLens v2.0 — Brain-Decides Fix Prompt

**Paste this entire block into a fresh `/acepilot brain` session at vault root. Brain decides everything autonomously. Operator never asked a question. Only PAYMENT GATE (real cash) and `[👤]` operator-only actions (Wikipedia / HN / podcast) surface as Clarity Cards.**

---

## /acepilot brain — HoldLens v2.0 canonical compounding

You are operating on holdlens.com — a LIVE finance reference site at `/Users/paulodevries/Local/VAULT-Fleet/finance/holdlens-com/holdlens/`. Current state: 178 routes, 1,369 sitemap URLs, 194 UV/30d, 10% chatgpt.com inbound, fleet GEO leader. Compliance Pivot A r1/r2/r3 already SHIPPED. AdSense under_re-review. @compliance mean 0.88 PASS.

**Mission:** lift HoldLens from current state (~75% of canonical FleetScore 93.8) to full canonical "improved" target via the 8 pending master-roadmap ships + 3 canonical improvements + continuous compounding ops. Brain decides everything. Brain executes end-to-end (commit → push → MR → merge → deploy → verify live via fingerprint-grep → IndexNow → @compliance + @geo + @craftsman audit log).

### Brain-decides defaults (no operator question)

1. **Pricing decision** → **tiered**: Free / Pro €9/mo (preserved) / Founders €19/mo (new, with priority alerts + API access + early-access to new ships). Wire Stripe Payment Link via Layer 7 REST API. PAYMENT GATE only fires when operator activates Founders tier in Stripe dashboard (operator-action).

2. **Ship sequence** (sequential per master-roadmap, 1 ship/week minimum, 2 ships/week if mission gates pass):
   - Week 1: Ship #4 buybacks (cleanest SEC data, top 500 S&P, fastest-to-ship)
   - Week 2: Ship #3 13D/13G activist (cross-links existing /investor/[slug])
   - Week 3: Ship #7 8-K material events (high-frequency news surface)
   - Week 4: Improvement A earnings-day alerts (retention multiplier)
   - Week 5: Improvement B analyst-rating delta tracker (net-new SEO surface)
   - Week 6: Ship #6 ETF X-Ray + overlap (200 ETFs covered, gated by v19.44 thin-content audit at 200×200 overlap matrix)
   - Week 7: Ship #11 IPO pipeline (SEC S-1)
   - Week 8: Ship #12 Form D private placements
   - Week 9: Ship #10 short interest (FINRA-only at v0; IBKR feed integrated if operator drops creds)
   - Week 10: Ship #13 proxy votes (N-PX, lowest-frequency)

3. **Email infrastructure (Improvement A)** → default to Resend (free 100/day, fastest signup). If operator hasn't dropped `RESEND_API_KEY`, brain ships the email-capture UI + cron task scaffold WITHOUT live send; subscriber rows queue in Supabase or KV (decision: use Cloudflare KV for v0 — zero-config, free 100k reads/day). When operator drops key, brain flips switch in `lib/email/transport.ts`.

4. **Short-interest data feed (Ship #10)** → default to FINRA Reg SHO (free, bi-monthly cadence). IBKR borrow-rate API requires operator credentials; brain ships FINRA v0 and queues IBKR integration as deferred enhancement (no Clarity Card unless operator surfaces interest).

5. **Per-ship discipline** (binding every ship):
   - Primary-source citations per data row (AP-3 tri-state: verified | derived | needs_research)
   - Full programmatic routes + hub + cross-links (hub-spoke compound)
   - Share-card per result (Canvas 1200×630 + pre-composed tweet, follow SignalShareCard pattern)
   - Schema.org: Article + Person + Organization + Dataset + BreadcrumbList + DefinedTerm minimum
   - llms.txt + sitemap.xml updated + IndexNow dispatch on every deploy
   - Mobile 375px verified via Chrome MCP before declaring done (`rules/mobile-perfection-default.md`)
   - CWV targets: LCP <1.5s, CLS <0.05, INP <200ms
   - @craftsman ≥0.5 (I-23 Love Score Floor)
   - @distributor ≥0.5 (I-26 Distribution Fit Floor)
   - @compliance ≥0.5 with hard-rejects on Verdict-Label / YMYL-Credential / Schema-Honesty all > 0.0 (I-43)
   - @geo ≥0.5 (5-dim: SEO Foundation · GEO Readiness · Dual Fit · Entity Coherence · Bot-Crawl Health) per v20.3 I-45 drafted

6. **Mission gates between ships** (per `HOLDLENS_MASTER_ROADMAP.md`):
   - Prior ship reached 7d-post-ship measurement
   - Prior ship did not breach I-22 Retention Floor (>10% drop in baseline 7d retention)
   - Prior ship did not breach I-25 Distribution Floor (>15% drop in baseline 7d organic traffic)
   - Current AUG v3.1 Score ≥5
   - If 7d gate not yet elapsed → brain picks parallel ship (different data source, no dependency)

7. **Deploy mechanism** → verify current hosting (`.vercel/project.json` check first; if Vercel, use Layer 7 REST API per `rules/vercel-acevaultorg-deploy-workaround.md`; if Cloudflare Pages, use wrangler). Brain auto-detects + dispatches via canonical brain-autonomous path. No operator click required for deploy.

8. **Git host** → GitLab `acevault-lab/holdlens` (per `rules/accounts-prefer-acevaultorg.md`). All branches push to GitLab origin. PRs auto-merge via Layer 7 REST when CI green + @craftsman/@distributor/@compliance/@geo all pass per `rules/sovereign-auto.md` I-42.

9. **State-file discipline**:
   - Every ship appends row to `.claude/state/COMPLIANCE.md ## Ships log` with @compliance scores
   - Every ship appends row to `.claude/state/DISTRIBUTION.md ## Calibration` with @distributor scores + projection
   - Every ship appends row to `.claude/state/CITATIONS.md ## Weekly Citation Check` after weekly tracker fires
   - Every ship appends row to `.claude/state/REVENUE_CALIBRATION.md` monthly with actuals vs projection
   - `.claude/state/HOLDLENS_MASTER_ROADMAP.md` updated with ship status transitions (pending → in_progress → shipped → audited)
   - `.claude/state/DECISIONS.md` appended for any architecture choice (data feed, schema design, pricing tier)

10. **Continuous compounding (Phase 3, runs in parallel to Phase 1+2)**:
    - Weekly `llm-citation-tracker` Saturday 04:00 UTC (already wired per v20.3) — track chatgpt/claude/perplexity/gemini citations
    - Wikipedia citation execution: surface `[👤]` Clarity Card weekly with next target article from `WIKIPEDIA_PLAYBOOK.md` queue
    - Podcast pitching: surface `[👤]` Clarity Card with 3 pre-drafted pitches per week from operator's HARO_PODCAST_DRAFTS.md
    - LinkedIn zero-click framework posts: surface `[👤]` Clarity Card with 1 ready-to-post draft per week
    - HARO/Qwoted pitches: surface `[👤]` Clarity Card with 5 pre-drafted weekly responses

11. **AdSense recrawl window discipline** (until Google approves or rejects):
    - DO NOT reintroduce STRONG BUY / STRONG SELL / verdict-label UI anywhere (I-43 hard-reject)
    - DO NOT reintroduce brokerage affiliate links on /signal/[ticker] or /investor/[slug] (must stay on /partners only)
    - DO NOT reintroduce ConvictionScore as recommendation-encoded in Article schema headlines
    - Every new ship runs @compliance sweep on existing routes for verdict-language regression
    - If Google approves AdSense: brain announces + initiates Layer 5 Ezoic Access Now signup Clarity Card
    - If Google rejects AdSense again: brain runs full @compliance audit on every new route shipped since Request Review, diagnoses regression, executes Pivot A r4 if needed

12. **Hard constraints (binding, no override)**:
    - ❌ NO TollBit (deprecated 2026-05-15 per operator directive)
    - ❌ NO Amazon Associates affiliate (I-38; Bookshop primary)
    - ❌ NO pay-per-crawl re-introduction (CF PPC / TollBit / ProRata all excluded until operator re-enables — per fleet memory `feedback_ppc_exclusion_until_operator_reenables.md`)
    - ❌ NO programmatic-page expansion without ≥30% unique data per page (v19.44 thin-content rule)
    - ❌ NO sunset/kill recommendations on HoldLens ("no kill only fix" — per fleet memory `feedback_no_kill_only_fix.md`)
    - ❌ NO Mediahuis-scoped data (HARD-EXCLUDED per fleet memory)
    - ✅ Mobile-perfect at 375px verified via Chrome MCP every ship
    - ✅ Static export preserved (`output: 'export'`)
    - ✅ AI-citation flywheel maintained (every new page satisfies Aleyda Solis 10-characteristic)

### Execution model

- **Session-start ABSORB**: read CLAUDE.md (cluster) + `.claude/state/*` for holdlens + `~/.claude/fleet/*` canonical files + active scope claims from `~/.claude/fleet/SESSION_SCOPE_CLAIMS.md` per `rules/cross-session-scope-claim.md`
- **Write scope claim**: brain writes `cluster:finance-reference` claim row at start, heartbeats every 30min
- **Cluster narrowing**: brain ABSORB narrows to C1 Finance cluster members only (holdlens, secfilingdex) per `rules/cluster-scope-routing.md`
- **No-ask discipline**: brain decides + executes + emits action log + Clarity Cards only (brain mode default per `rules/acepilot-brain-mode.md`)
- **No-narrative discipline**: action lines only, no background paragraphs unless operator types "why X" / "explain X"
- **Stop strings**: only `stop` / `pause` / `halt` from live operator exits

### Acceptance criteria (full canonical lift complete)

- 8 pending master-roadmap ships shipped, audited, calibrated
- 3 canonical improvements (earnings alerts + analyst-rating tracker + tiered pricing) live
- AUG v3.1 Score ≥ 30 (current ~14 pre-audit baseline)
- AdSense approved + active OR ≥3 alternative revenue layers active (Ezoic + Affiliate + Pro/Founders)
- AI-citation count ≥ 20/30d across ChatGPT + Claude + Perplexity + Gemini
- Wikipedia citations ≥ 5 active
- Pro + Founders combined subscriber count ≥ 25 paid

### Continuation contract

Brain continues working sovereign-auto every session that picks up this prompt. State files are the source of truth between sessions. Operator can interrupt anytime with "actually X" → brain pivots + continues. Operator overrides any default with explicit directive ("ship #6 first" / "use Postmark not Resend" / "Pro stays €9 flat") — brain logs override + executes.

**Brain version: v20.3 (or any version ≥ v20.0 inherits same discipline via I-44 ship moratorium).**

**Mode: `brain` (execute-only). Aliases also accepted: `auto`, `god`, `infinite`, `sovereign auto`.**

---

## To execute

Paste this entire prompt above the line into a fresh `/acepilot brain` session. Brain absorbs state, picks Ship #4 (buybacks) as Week-1 target, writes scope claim, executes end-to-end, surfaces only `[👤]` Clarity Cards for operator-only actions (Wikipedia, HN, podcast, HARO, Stripe Founders activation, optional credential drops). Loops until acceptance criteria met or operator types stop.
