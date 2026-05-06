# MONETIZATION_STACK.md — holdlens

**Schema:** v19.5 (2026-04-21 canonical 9-layer revenue stack)
**Canonical reference:** `~/.claude/rules/revenue-maximizer.md`
**Append-on-change only** (except Current Stack status cell updates).

## Current Stack

| Layer | Name | Status | Activated | Projected $/mo | Actual $/mo | Notes |
|---|---|---|---|---:|---:|---|
| 1 | AdSense | pending_approval | 2026-04-18 (snippet shipped) | $25-50 | - | Application pending Google review. Site meets readiness gate. |
| 2 | Cloudflare Pay-Per-Crawl | waitlisted | — | $15-80 | - | Beta waitlist. Per-zone toggle blocked on CF Pro beta invitation. PPC.md tracks per-route pricing. |
| 3 | llms.txt + schema + AI allowlist | active | 2026-04-15 | — (indirect) | — | v19.4 autowired. Feeds 4.4× AI-visitor multiplier. |
| 4 | Perplexity Publishers Program | pending_review | 2026-04-21 | $10-30 | - | Email + Google Form submitted from contact@holdlens.com. 80/20 rev share. Expected onboarding 1-2 weeks. |
| 5 | Ezoic Access Now | not_started | — | $30-80 | - | No traffic floor, no beta gate. Operator Clarity Card queued. 15-min signup. |
| 6 | Affiliate (Impact.com, NOT Amazon per I-38) | not_started | — | $150-500/signup | - | Operator Clarity Card queued. **Spec brokers: Interactive Brokers + Charles Schwab** (operator-specified 2026-04-23). Optional secondaries: Tastytrade, Webull, M1, Public. |
| 7 | Mediavine Journey | not_eligible | — | $12-19 RPM × traffic | - | Sessions <1k/mo (~12 humans/30d). `mediavine-promotion-detector` scheduled task auto-fires Clarity Card at 1k threshold. I-37 atomic swap enforced. |
| 8 | TollBit | partially_active | 2026-04-23 | $0.005/scrape | $0.005 (1 PerplexityBot successful scrape, week of 4/16-4/22) | 2 licenses active (Summarization + Full Display). 61 bot attempts, 46 forwarded, 1 successful. BDev pipeline to convert ChatGPT-User (43 forwards, 0 paid) is TollBit-side. CF Snippet deploy Clarity Card pending to close synthetic-test sanity check. |
| 9 | ProRata.ai Gist Answers | not_started | — | $10 CPM floor | - | Defer to Month 6+ per rules/revenue-maximizer.md Part 3. |

### HoldLens-specific extensions (outside canonical 9)

| Tier | Name | Status | Activated | Projected $/mo | Actual $/mo | Notes |
|---|---|---|---|---:|---:|---|
| Pro | HoldLens Pro (€9/mo) | active | 2026-04-16 | 5-25 signups × €9 | $0 | Stripe Payment Links LIVE in .env.production.local. Bottleneck: human traffic to /pricing (AUG acquisition 0.10/10). |
| Enterprise | Enterprise API ($500-10k/mo) | listed_not_sold | — | — | $0 | Listed in llms.txt + api-terms. Trigger: ≥3 inbound inquiries. None yet. |

## Layer Activations (append-only)

| timestamp | layer | event | details |
|---|---|---|---|
| 2026-04-15 | 3 | activated | llms.txt + schema + robots.txt AI allowlist live (v19.4 autowired) |
| 2026-04-16 | Pro | activated | Stripe Payment Links live in .env.production.local |
| 2026-04-18 | 1 | submitted | AdSense application submitted; verification snippet live |
| 2026-04-21 20:10 UTC | 4 | contacted | Perplexity Publishers email sent contact@holdlens.com → publishers@perplexity.ai |
| 2026-05-06 | 6 | scaffolded_untagged_bookshop | InvestingBooks component refactored from Amazon-only to Bookshop-primary per I-38. Component reads `NEXT_PUBLIC_BOOKSHOP_AFFILIATE_ID` env var (shared with readinglist.school + readminute.com — single Bookshop shop signup activates 3 fleet sites). 6 books with verified ISBN-13s map to canonical /a/{AFFID}/{ISBN} URLs when env set; plain bookshop.org/search fallback otherwise. Cluster-root operator Activation Card (`AceVault 260426/.claude/state/TASKS.md` lines 19-71) auto-fires on Bookshop approval — same env-var paste extends commission flow from 2 sites to 3. Component code: `components/InvestingBooks.tsx` (env-conditional, FTC-compliant `rel="sponsored nofollow"`, Plausible event tracking per book click). Live deploy verified `dpl_<id>` 2026-05-06. |
| 2026-04-21 20:25 UTC | 4 | submitted | Perplexity Publisher Program Google Form submitted |
| 2026-04-21 | 2 | waitlisted | CF Pay-Per-Crawl beta waitlist joined; pending Pro beta invitation |
| 2026-04-23 | 8 | partial_activation | TollBit property created (org=acevault, id=an434uon3o4hanz02cliq90q); 2 licenses active at $0.005; bot forwarding observed in analytics (46 weekly forwards) but onboarding synthetic Test still failing without canonical CF Snippet |
| 2026-04-23 | 8 | first_revenue | PerplexityBot 1 successful paid scrape × $0.005 = $0.005 (week of 4/16-4/22) |

## Swap History (atomic, I-37 enforced)

| timestamp | removed_layers | added_layer | reason |
|---|---|---|---|
| — | — | — | No swaps yet. First swap triggers at 1k sessions/mo → Mediavine Journey promotion per I-37. |

## Pending Operator Clarity Cards (drives activation of remaining layers)

1. 🟡 Ship CF Snippet `redirect_to_tollbit` (5 min) — fixes TollBit synthetic Test + flips onboarding to verified. Full steps in TASKS.md.
2. 🔴 Ezoic Access Now signup (15 min) — fastest time-to-first-dollar. Email-tag forward to brain for code install.
3. 🔴 Impact.com + 5 broker applications (30 min) — first broker signup = $150-500.
4. 🟡 ProRata.ai signup (10 min) — parallel AI-citation network.
5. 🔴 Bingbot WAF Skip rule (2 min) — restores Bing/DDG/Copilot organic traffic.

## Corrections

(timestamp-anchored per I-39 append-only pattern)

### 2026-04-24 — TollBit Layer 8 license count overstated

**corrects:** `2026-04-23 | 8 | partial_activation` row above (the phrase *"2 licenses active at $0.005"*).

**Reality per TollBit dashboard (verified via Chrome MCP 2026-04-24):**

- `agent-site/bot-paywall` panel → License rates section shows literal text: **"No licenses found."**
- `transactions` panel → "Recent transactions" empty; chart empty (no data plotted).
- `analytics?tab=bots` top-card reads: **61 Attempted · 0 Successful · 46 Forwarded · 46 Blocked · 47:1 ratio · 1 AI referral**.
- Per-bot table shows 3 "successful scrapes" rows (PerplexityBot 1, FacebookBot 2) that do NOT appear in Transactions → they are $0 free-preview scrapes, not revenue events.

**What's really happening:** TollBit property exists, subdomain `tollbit.holdlens.com` is live, 19-UA forwarding at CF edge is verified (all bots 302 to tollbit.holdlens.com, curl-confirmed 2026-04-23 + 2026-04-24). But with **zero configured license rates**, TollBit serves every forwarded bot an empty-license JSON preview (`rate.price.priceMicros: 0`, `license.licenseType: ""`) containing the full page content. Bots extract content for free. No revenue can flow until the operator creates at least one license rate.

**Layer 8 status corrected:** `partially_active` → `forwarding_live_but_no_rates_configured`. Projected $/mo held (still $0.005/scrape × ChatGPT-User 43 forwards/wk = ~$40/mo ceiling IF licenses configured AND TollBit BDev closes platform deal). Actual $/mo corrected to **$0** (was incorrectly stated as $0.005).

**Next action:** operator creates ≥1 license rate in TollBit → forwarded bots pay per-scrape. See new 🔴 REQUIRED Clarity Card in TASKS.md `[id:tollbit-create-license-rates]` (shipped 2026-04-24).

### 2026-04-24 — Scrape-success diagnosis note

Operator flagged 2026-04-24: *"i think scrape success is a big problem. check"*. Investigation confirms the concern is real but the proximate cause is "no license rates" (above), not "paywall broken." Every bot forwarded to TollBit succeeds at content extraction because no paywall is enforced on the bot → content never costs them anything → zero dollar conversion. Fix is operator-only (TollBit dashboard; ~2 min per license rate creation).

## v1.87 monetization-funnel patch (2026-04-29) — homepage coverage gap closed

**Operator directive trace:** *"i want you to make revenue asap, but not theoretical. make the complete funnel perfect for it"*.

**Audit finding:** homepage `/` was serving 66.7% of all traffic (28 of 42 weekly UV per Plausible 2026-04-29 scrape) but had ZERO monetization surfaces — no AdSlot, no FoundersNudge, no BrokerCta. Single highest-leverage code-level gap on the entire site.

**Patch shipped (commit `3637a77ba`, deploy `dpl_kmjqz0fzd` Vercel fra1):**

- **2 AdSlots** added: 1× horizontal `priority="primary"` after RecentMaterialEvents + 1× rectangle `priority="secondary"` before FAQ. Spaced ~800px+ per AdSense policy. Lazy-load via IntersectionObserver (CLS-protected). Self-disable for Pro users. Will serve real ads the moment AdSense application approves (currently pending Google review since 2026-04-18 = 11 days).
- **FoundersNudge** added before email capture. Per its design fires only on high-intent ranked pages; homepage qualifies (visitor has consumed BuySellSignals + LatestMoves + InsiderActivity + Material Events + 21-card Signal Explorer + Trust Pillars + Methodology before reaching it).
- **BrokerCta** added immediately after FoundersNudge with context "Acting on a smart-money signal? Open a brokerage account." Self-disables until operator drops affiliate URLs into NEXT_PUBLIC_AFF_IBKR / _SCHWAB / _PUBLIC / _ETORO env vars.

**Live verified (Chrome MCP DOM check, 2026-04-29 ~13:00 UTC):**
- 2 `<ins class="adsbygoogle">` slots present on holdlens.com homepage
- adsbygoogle script loaded
- ca-pub-7449214764048186 client ID present
- Components render at runtime (client-side, no SSR text)

**Layer activation matrix (post-v1.87):**

| Layer | Pre-v1.87 status | v1.87 status | Activation $/mo (cold-start) |
|---|---|---|---:|
| AdSense (L1) | wired site-wide; 0 ad slots on homepage | wired + 2 ad slots on homepage | $5-15/mo when L1 approves |
| Founders Pass €9 (custom Pro) | only on /pricing + /signal/* | now also on / | +€0-90/mo (1-10 conversions/mo) |
| Affiliate IBKR/Schwab (L6) | wired on 3 pages (/changelog, /ticker, /signal) | now also on / | $200-400/mo when activated |

**Operator-side activation queue** (full Clarity Cards: `.claude/state/REVENUE_ACTIVATION.md`):

1. 🔴 Impact.com + IBKR signup (~30 min) → $200/funded account
2. 🔴 Ezoic Access Now signup (~15 min) → $30-80/mo immediate
3. 🔴 Check AdSense email + drop slot IDs (~5 min if approved) → $5-15/mo
4. 🟡 ProRata.ai signup (~10 min) → $2-15/mo
5. 🟡 Wikipedia citations × 5 (~90 min) → durability LLM-citation amplifier

**Total operator effort: ~50 min for #1-3 = ~$240-540/mo activated. Currently $0 active revenue.**

**Pattern lesson logged:** highest-leverage monetization gap is rarely a missing revenue-stack LAYER; it's component-PLACEMENT coverage. Apr 2026 audit revealed AdSense/Founders/Affiliate all "active" at site level but homepage (66.7% of traffic) had zero placements. Coverage audits > layer audits. Filed to PATTERNS.md as `monetization_layer_active_but_unplaced`.
