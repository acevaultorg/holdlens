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
