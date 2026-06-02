# HoldLens v2.0 — Canonical Compounding Phase

**Status as of 2026-05-19:** LIVE at holdlens.com. 178 routes. 1,369 sitemap URLs. 194 UV/30d. 10% chatgpt.com inbound (fleet GEO leader). 2.1× growth in 14d. Compliance Pivot A r1+r2+r3 SHIPPED. AdSense under_re-review. @compliance mean 0.88 PASS.

**This is NOT a greenfield build prompt. HoldLens is ~75% of canonical "improved" target (FleetScore 93.8 per Best Concepts canonical rank #8). This prompt covers the remaining 25% — the canonical compounding phase that lifts HoldLens from "Foundation built" to "FleetScore 93.8 improved."**

---

## What's already built (DO NOT REBUILD)

✅ **Foundation (v0.1 → v1.51):**
- 82 superinvestor manager roster (`/investor/[slug]` × 82)
- ConvictionScore methodology + 8-quarter compound history
- `/signal/[ticker]` per-ticker per-quarter signal pages
- `/insiders/[insider]/` Form 4 firehose (4,436 pages, noindexed per v19.44 thin-content fix)
- `/insiders/company/[ticker]`, `/insiders/officer/[slug]` indexable aggregator pages
- `/biggest-buys/`, `/biggest-sells/`, `/new-positions/`, `/exits/`, `/reversals/` 13F delta routes
- `/sectors/` rotation hub + 11 GICS sector deep-dives (Ship #9)
- `/similar-to/[investor]/` portfolio similarity scorer (Ship #8)
- `/dividend-tax/[country1]/[country2]/` 75-cell programmatic calculator (Ship #1)
- `/learn/` hub-and-spoke 32-essay knowledge graph + 6 famous-trade essays
- `/composite`, `/scores`, `/buys`, `/sells`, `/proof`, `/consensus`, `/methodology`, `/about`, `/learn/superinvestor-handbook`, `/learn/sec-signals-trilogy`
- `/compare/[pair]/`, `/fund-overlap/[slug]/` AEO FAQPage components
- Static export Next.js (`output: 'export'`), Cloudflare Pages or Vercel hosting (verify .vercel/project.json)
- Stripe Pro €9/mo Payment Links LIVE in .env.production.local
- Cloudflare Pay-Per-Crawl waitlisted (operator beta application pending)
- Perplexity Publishers Program submitted

✅ **Compliance (Pivot A complete):**
- Verdict-Label Risk: 0.0 → 1.0 (STRONG BUY/SELL labels removed site-wide via VERDICT_DISPLAY map)
- YMYL-Credential Match: data-display-only framing (no investment recommendations)
- Schema-Honesty: Article schema headlines rewritten as factual descriptions (no recommendation-encoded)
- Disclosure: MethodologyDisclaimer site-wide, /partners page for affiliate links, 45-day 13F lag disclosure inline
- @compliance mean 0.88 PASS (no I-43 violations)

✅ **AI-citation flywheel (validated):**
- llms.txt at root
- robots.txt 9-AI-bot allowlist (GPTBot, ClaudeBot, PerplexityBot, etc.)
- Person + Organization + Article + Dataset + DefinedTerm + BreadcrumbList schema
- Speakable + FAQPage on dynamic templates
- 10% of 30d traffic from chatgpt.com (validates citation graph + corroboration path)

✅ **Distribution:**
- HN Show HN submitted 2026-04-19 (outcome logged)
- Wikipedia citation seeding 5-session compound (in progress per WIKIPEDIA_PLAYBOOK.md)
- Bookshop affiliate scaffolded (env-conditional, FTC-compliant)
- IBKR/Public/moomoo affiliates relocated to /partners (post-Pivot A)

---

## What's pending (THIS PROMPT BUILDS)

### Phase 1 — Roadmap expansion (5-7 days each, ship sequentially per master-roadmap discipline)

**Ship #3 — 13D/13G activist-investor tracker** at `/activist/`
- SEC EDGAR 13D/13G XML pipeline (new data ingestion)
- Per-filer programmatic pages: `/activist/[slug]/`
- Per-target programmatic pages: `/activist/target/[ticker]/`
- Activist hub with date-sorted recent campaigns
- Schema: Article + Person + Dataset
- Distribution: share card per campaign, cross-link from /investor/[slug] for managers who also file 13D
- Acceptance: ≥50 active campaigns indexed, @compliance ≥0.5, @craftsman ≥0.5

**Ship #4 — Corporate buyback tracker** at `/buybacks/`
- SEC 10-Q Item 2 + 8-K parsing (new pipeline)
- Per-ticker: `/buybacks/[ticker]/` with quarterly authorized vs executed table
- Hub: largest buybacks YTD, largest as % of float
- Cross-link from /signal/[ticker] for tickers with active buyback authorization
- Acceptance: top 500 S&P tracked, fresh-data weekly

**Ship #6 — ETF X-Ray + overlap analyzer** at `/etf/`
- 13F for ETF filers (existing) + prospectus parsing for top 200 ETFs (new)
- Per-ETF: `/etf/[ticker]/` showing top holdings + sector breakdown + similar ETFs
- Overlap analyzer: `/etf/overlap/[etf1]-[etf2]/` programmatic
- Hub: largest ETFs, fastest-growing ETFs by AUM
- Acceptance: 200 ETFs covered, overlap matrix 200×200 = 40k pages (gate: unique data per page ≥30% per v19.44 thin-content rule)

**Ship #7 — 8-K material events tracker** at `/events/`
- SEC 8-K item-number categorization (new pipeline)
- Per-ticker timeline: `/events/[ticker]/`
- Per-item-type hub: `/events/item/[type]/` (e.g., /events/item/5-02/ for executive changes)
- Cross-link from /signal/[ticker] for tickers with recent material events
- Filter UI by item code, date range
- Acceptance: top 1000 actively-traded US tickers covered, real-time webhook from SEC EDGAR

**Ship #10 — Short interest + borrow rate** at `/short/`
- FINRA Reg SHO + IBKR borrow API (new data pipeline; operator credentials needed for IBKR feed)
- Per-ticker: `/short/[ticker]/` showing short interest, days-to-cover, borrow rate trend
- Hub: highest short interest tickers, fastest-rising short interest
- Acceptance: bi-monthly FINRA refresh wired, real-time borrow when IBKR creds dropped

**Ship #11 — SEC S-1 / IPO pipeline tracker** at `/ipo/`
- SEC S-1 / S-1/A filings (new ingestion)
- Per-company: `/ipo/[slug]/` with offering details, lockup expiry, comparable analysis
- Hub: upcoming IPOs by sector + size, recently priced
- Acceptance: all S-1 filings <12 months old indexed

**Ship #12 — Form D private placement tracker** at `/form-d/`
- SEC Form D filings (new ingestion)
- Per-issuer: `/form-d/[slug]/`
- Hub: largest Form D raises by sector, by total offering amount
- Niche professional audience; lower volume but high RPM (finance/PE)
- Acceptance: rolling 24-month coverage

**Ship #13 — Proxy vote tracker** at `/proxy-votes/`
- SEC N-PX filings (annual cadence)
- Per-investor: `/proxy-votes/[slug]/` showing how superinvestors voted on shareholder proposals
- Per-proposal: `/proxy-votes/proposal/[id]/` showing institutional vote distribution
- Cross-link from /investor/[slug] for managers who file N-PX
- Acceptance: top 100 N-PX filers covered (typically 1+ year lag from filing season)

### Phase 2 — Canonical improvement layer (the FleetScore 93.8 lift)

Per Best Concepts canonical (rank #8, FleetScore 93.8 improved):

**Improvement A — Earnings-day alerts**
- New route: `/earnings/[ticker]/` per-ticker earnings calendar + reaction analysis
- Email opt-in: "Alert me 24h before next earnings for tickers in my watchlist"
- Watchlist via localStorage (no auth required at v0)
- Cron task `earnings-alert-dispatcher` fires daily 13:00 UTC; reads watchlist + earnings calendar API
- Email via Resend or Postmark (operator credential drop required)
- Acceptance: ≥500 tracked tickers, ≥5 active subscribers Week-2 post-launch
- Multiplier impact: feeds retention (R7-T return-trigger), advocacy (V-F3 bookmarkable URLs)

**Improvement B — Analyst-rating delta tracker**
- New route: `/ratings/[ticker]/` per-ticker analyst rating history + recent changes
- Data: free tier from Yahoo Finance API or Benzinga/Tipranks scrape (operator-decision: paid feed vs scrape)
- Per-analyst page: `/ratings/analyst/[firm]/` showing track record + accuracy
- Cross-link from /signal/[ticker]: "Analyst consensus vs superinvestor consensus"
- Acceptance: top 200 tickers covered, daily refresh
- Multiplier impact: net-new SEO surface (analyst-rating queries), unique synthesis vs Yahoo

**Improvement C — Pro tier €19/mo upgrade decision**
- Canonical pricing is €19/mo (current is €9/mo)
- DECISION REQUIRED (operator-action): either (a) keep €9 to grow paid signups faster, or (b) upgrade to €19 to match canonical FleetScore, or (c) tier the offering — Free / Pro €9 / Founders €19 with extra features (live alerts, API access, priority support)
- If (c) — extend Stripe Payment Links + .env to add NEXT_PUBLIC_STRIPE_FOUNDERS_LINK
- Multiplier impact: revenue per paid user × subscriber count = ARPU lift

### Phase 3 — Continuous compounding (no Phase 1/2 dependency)

**Wikipedia citation seeding** — continue per WIKIPEDIA_PLAYBOOK.md sessions 2-5
- Target: 10 Wikipedia pages cited by 2026-Q3
- Operator-action templates already drafted per `~/.claude/acepilot-20.3/templates/wikipedia-citation-template.md`

**Newsletter** — opt-in via /signal/[ticker] result pages
- Weekly "Smart money signals" digest with top 5 ConvictionScore deltas
- ConvertKit or Buttondown (operator-decision)
- Cross-channel asset: feeds AceUserGrowth retention loop + advocacy via "forward to a friend"

**Podcast pitching** — 30 podcasts per quarter (operator-action, ~30 min each)
- Target verticals: value investing, hedge fund pod, 13F-tracking, retail-quant
- Operator personality + ConvictionScore methodology = pitch-worthy POV
- Templates: `~/.claude/acepilot-20.3/templates/podcast-pitch-template.md`

**HARO + Qwoted pitching** — 5 pitches per week
- Finance journalist queries
- Templates: `~/.claude/acepilot-20.3/templates/haro-qwoted-pitch-template.md`

**LinkedIn zero-click framework posts** — 1 per week, operator-authored
- "How I built ConvictionScore: 8 quarters of weighted superinvestor consensus"
- "Why 13F filings are 45 days stale and that's still the best signal we have"
- Templates: `~/.claude/acepilot-20.3/templates/linkedin-zero-click-framework-template.md`

---

## Build sequence + ship discipline

Per HOLDLENS_MASTER_ROADMAP.md "Per-Ship Discipline":

1. **Primary-source citations per data row** (AP-3 tri-state: verified | derived | needs_research)
2. **Full programmatic routes + hub + cross-links** (hub-spoke compound)
3. **Share-card per result** (Canvas 1200×630 + pre-composed tweet, follow SignalShareCard pattern)
4. **Schema.org** (Article + Person + Organization + Dataset + BreadcrumbList + DefinedTerm minimum)
5. **llms.txt + sitemap.xml + IndexNow** on every ship
6. **Mobile 375px verified via Chrome MCP** before declaring done
7. **CWV targets** — LCP <1.5s, CLS <0.05, INP <200ms
8. **@craftsman ≥0.5** (I-23 Love Score Floor)
9. **@distributor ≥0.5** (I-26 Distribution Fit Floor)
10. **@compliance ≥0.5** with hard-rejects on Verdict-Label / YMYL-Credential / Schema-Honesty all > 0.0 (I-43)
11. **@geo ≥0.5** for SEO Foundation · GEO Readiness · Dual Fit · Entity Coherence · Bot-Crawl Health (v20.3 I-45 drafted)

Mission gates (per master-roadmap):
- Prior ship reached 7d-post-ship measurement
- Prior ship did not breach I-22 Retention Floor
- Prior ship did not breach I-25 Distribution Floor
- Current AUG v3.1 Score ≥5

If 7d gate not yet elapsed, "resume elsewhere" (pick a different ship) per spec.

---

## Operator-action queue (gates between Phase 1 ships)

🟡 RECOMMENDED 👨🏻‍🔧 — **Drop credentials for Phase 1 + Phase 2 ships:**
1. **IBKR client portal / TWS API key** (needed for Ship #10 borrow rate) — operator generates at https://www.interactivebrokers.com/sso/Login → API Settings
2. **Resend OR Postmark API key** (needed for Improvement A email) — operator signs up + drops in `.env` as `RESEND_API_KEY=...` or `POSTMARK_API_KEY=...`
3. **Pricing decision** (Pro €9 vs €19 vs tiered) — operator confirms in chat → brain updates Stripe Payment Link + .env

🟢 OPTIONAL 👨🏻‍🔧 — **Cloudflare Pay-Per-Crawl beta acceptance** — when invitation arrives, operator clicks Accept in dashboard → brain wires per-route pricing per PPC.md.

🟢 OPTIONAL 👨🏻‍🔧 — **Wikipedia citation execution** — operator picks 1 article per week from WIKIPEDIA_PLAYBOOK.md queue, adds HoldLens as cited source. ~30 min per citation.

🟢 OPTIONAL 👨🏻‍🔧 — **Podcast pitching** — operator picks 3 podcasts per week from pitch template, sends. ~10 min per pitch.

---

## Estimated execution

- **Phase 1 (8 roadmap ships):** 5-7 days each per ship = ~10-14 weeks total at 1 ship/week cadence, or 4-5 weeks at 2 ships/week (high-velocity sovereign auto)
- **Phase 2 (3 improvements):** ~7-10 days total brain-time once credentials drop
- **Phase 3 (continuous):** ongoing operator-time (~3-4 hrs/wk per AceUserGrowth Part 15)

Total to canonical FleetScore 93.8: ~12-16 weeks at sustainable cadence.

---

## Constraints (binding)

- ❌ Do NOT reintroduce STRONG BUY / STRONG SELL / verdict-label UI anywhere (I-43 hard-reject)
- ❌ Do NOT reintroduce brokerage affiliate links on /signal/[ticker] or /investor/[slug] (must stay on /partners only, post-Pivot A)
- ❌ Do NOT reintroduce ConvictionScore as recommendation-encoded in Article schema headlines (schema-honesty hard-reject)
- ❌ Do NOT use TollBit (deprecated 2026-05-15 per operator directive)
- ❌ Do NOT use Amazon Associates affiliate (I-38 binding; Bookshop primary)
- ❌ Do NOT propose adding pages without unique data per page (v19.44 thin-content rule; ≥30% unique data per page, ≥250 words editorial)
- ❌ Do NOT scale programmatic pages past current 1,369 sitemap count without per-page substance audit
- ✅ "no kill only fix" — never propose sunsetting HoldLens
- ✅ AdSense recrawl window active — preserve all Pivot A discipline until approval lands
- ✅ Citation flywheel validated — every new ship must satisfy LLM-citation 10-characteristic checklist (Aleyda Solis)
- ✅ Mobile-perfect at 375px verified via Chrome MCP every ship (`rules/mobile-perfection-default.md`)
- ✅ Static export preserved (`output: 'export'`)
- ✅ All deploys via canonical path (Cloudflare Pages wrangler OR Vercel Layer 7 REST per `rules/vercel-acevaultorg-deploy-workaround.md`)

---

## Reference state files (read at session start)

- `.claude/state/HOLDLENS_MASTER_ROADMAP.md` — 13-ship master plan + status
- `.claude/state/COMPLIANCE.md` — @compliance audit log + Pivot A history
- `.claude/state/CONVICTION_AUDIT.md` + `CONVICTION_BACKTEST.md` — methodology audit
- `.claude/state/MONETIZATION_STACK.md` — 9-layer revenue stack status
- `.claude/state/HUMAN_ACTIONS.md` — operator-action queue (canonical per-project)
- `.claude/state/WIKIPEDIA_PLAYBOOK.md` — Wikipedia citation campaign
- `.claude/state/LLM_CITATIONS.md` — chatgpt/claude/perplexity citation tracking
- `.claude/state/AUG.md` — weekly AUG v3.1 score
- `.claude/state/DECISIONS.md` — append-only decision log

---

## To invoke this prompt

`/acepilot brain [holdlens v2.0 canonical compounding — ship next roadmap item per HOLDLENS_MASTER_ROADMAP.md mission gates + per-ship discipline]`

Brain inherits all constraints above + reads state files + picks next ship that passes mission gates + executes end-to-end (commit → push → MR → merge → deploy → IndexNow → @compliance/@geo audit log).
