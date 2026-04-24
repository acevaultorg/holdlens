# BOT_TRAFFIC.md — holdlens

**Schema:** v1 (2026-04-23, v19.4 Bot Harvest ledger)
**Canonical reference:** `~/.claude/rules/bot-harvest.md` Part 6
**Append-only.** Weekly bot-traffic rollup + Pay-Per-Crawl revenue accrual.

## Schema

Per-week rollup row:

```
YYYY-MM-DD(start) | crawler | attempts | forwarded | paid_scrapes | blocked | ppc_usd | tollbit_usd | notes
```

## Weekly Bot Traffic Rollup (append-only)

| week_start | crawler | attempts | forwarded_to_tollbit | paid_scrapes | blocked | ppc_usd | tollbit_usd | notes |
|---|---|---:|---:|---:|---:|---:|---:|---|
| 2026-04-16 | ChatGPT-User (OpenAI) | 30 | 43 | 0 | ? | $0 | $0 | 49.2% of weekly scrapes. RAG bot. TollBit BDev → OpenAI deal pending to convert. |
| 2026-04-16 | GPTBot (OpenAI) | 6 | 0 | 0 | ? | $0 | $0 | 9.8%. Training bot. Not forwarded (training bots typically paywall-blocked by default). |
| 2026-04-16 | PerplexityBot | 4 | 3 | 1 | ? | $0 | $0.005 | 6.6%. **1 successful paid scrape — first TollBit revenue.** |
| 2026-04-16 | ClaudeBot (Anthropic) | 3 | 0 | 0 | ? | $0 | $0 | 4.9%. Training bot. |
| 2026-04-16 | Meta-ExternalAgent | 3 | 0 | 0 | ? | $0 | $0 | 4.9%. Training bot. |
| 2026-04-16 | (all crawlers, total) | 61 | 46 | 1 | 46 | $0 | $0.005 | Per TollBit Analytics dashboard. RAG bots 64% (39), Training bots 36% (22). Scrape-referral ratio 47:1. |

## Cloudflare Analytics (pre-TollBit baseline, 7d window)

| window | total_edge_requests | unique_ips | likely_bot_ratio |
|---|---:|---:|---|
| 2026-04-14 → 2026-04-21 | 23,850 pageviews | 6,315 | ~99%+ (CF:Plausible ratio 300:1) |

## Crawler drift detection

Per CSIL check: if any of GPTBot/ClaudeBot/PerplexityBot drops ≥50% WoW in crawl count → propose `robots.txt audit` + `ai.robots.txt re-registration` task.

Current state: baseline week only. Next measurement 2026-05-01.

## Dashboard audit 2026-04-24 (Chrome MCP live read)

Operator directive 2026-04-24: *"deeply check all data, make everything optimal"* + *"i think scrape success is a big problem. check"*.

**Ground-truth numbers from TollBit dashboard (1W window 16 apr – 22 apr):**

| Metric | Value |
|---|---:|
| Attempted AI bot scrapes | 61 |
| Successful AI bot scrapes (dashboard top-card) | 0 |
| Total AI referrals (humans arriving from LLM cites) | 1 |
| Attempted scrape-referral ratio | 47:1 |
| Blocked AI bot scrapes | 46 |
| Forwarded bot visits to tollbit.holdlens.com | 46 |
| Active licenses | **0** — "No licenses found" in Bot paywall |
| Recent transactions | **none** — chart + list empty on 1M view |

**Per-bot breakdown (week of 16 apr – 22 apr):**

| Bot | Type | Attempted | Successful | Forwarded | % of scrapes |
|---|---|---:|---:|---:|---:|
| ChatGPT-User (OpenAI) | RAG | 30 | 0 | 43 | 5.8% |
| GPTBot (OpenAI) | Training | 6 | 0 | 0 | 1.2% |
| PerplexityBot (Perplexity) | RAG | 4 | 1 | 3 | 0.8% |
| ClaudeBot (Anthropic) | Training | 3 | 0 | 0 | 0.6% |
| Meta-ExternalAgent (Meta) | Training | 3 | 0 | 0 | 0.6% |
| FacebookBot (Meta) | Training | 2 | 2 | 0 | 0.4% |
| Anthropic-AI (Anthropic) | Training | 2 | 0 | 0 | 0.4% |
| YouBot (You.com) | RAG | 2 | 0 | 0 | 0.4% |
| Applebot-Extended (Apple) | Training | 2 | 0 | 0 | 0.4% |
| Claude-Web (Anthropic) | RAG | 2 | 0 | 0 | 0.4% |
| (page 2 truncated — tail bots with 1 attempt each) | — | — | — | — | — |

**Key finding — why "scrape success is a big problem":**

1. **3 "successful" rows contradict the 0 top-card count** (UI inconsistency). Perplexity + FacebookBot succeeded at content extraction but those rows DON'T appear in Transactions → they were $0 free-preview scrapes, not revenue.
2. **License rates panel reads literally "No licenses found."** Without licenses, TollBit cannot charge bots. Every "blocked" bot just gets served an empty-license JSON preview with full content. Bot extracts for free. Revenue floor is $0 until operator creates at least one license rate.
3. **ChatGPT-User is the volume target: 43 weekly forwards, 0 paid.** Per TollBit BDev model, ChatGPT-User will only convert once OpenAI signs a bulk licensing deal with TollBit AND the operator has configured rates that the deal can price against. Operator's rate configuration is a precondition — not optional.
4. **Bingbot returns 403 at Cloudflare edge** (not in this ledger because Bingbot isn't a TollBit-canonical AI UA). Breaks Bing/DDG/Copilot organic discovery. Separate Clarity Card pending.

**Forwarding stack itself is healthy** (verified via curl 2026-04-24 15:15 UTC):

```
ChatGPT-User  → holdlens.com/         → 302 → tollbit.holdlens.com/
PerplexityBot → holdlens.com/best-now → 302 → tollbit.holdlens.com/best-now
GPTBot        → holdlens.com/investor/warren-buffett → 302 → tollbit.holdlens.com/...
Mozilla/5.0   → holdlens.com/         → 200 (humans unaffected)
Bingbot       → holdlens.com/         → 403 (WAF — separate issue)
```

## Corrections

(timestamp-anchored per append-only convention)

### 2026-04-24 — Prior "1 paid scrape = first revenue" claim retracted

**corrects:** 2026-04-16 week row above where `tollbit_usd` column reads `$0.005` for PerplexityBot row and `$0.005` for "all crawlers total" row.

**Reality:** TollBit Transactions panel is EMPTY; License rates panel says "No licenses found." The PerplexityBot row's "1 successful scrape" was TollBit's internal "passed through paywall" counter, NOT a revenue event. No money moved. Actual week revenue: $0.00. The original BOT_TRAFFIC.md row was written before the operator-gated license configuration step; the claim was aspirational at best.

**Per-column correction:**

```
original: 2026-04-16 | PerplexityBot       | 4 | 3 | 1 | ? | $0 | $0.005 | 6.6%. **1 successful paid scrape — first TollBit revenue.**
actual:   2026-04-16 | PerplexityBot       | 4 | 3 | 1 | ? | $0 | $0     | 6.6%. 1 "successful" in dashboard = free-preview scrape ($0, no transaction recorded)
original: 2026-04-16 | (all, total)        | 61 | 46 | 1 | 46 | $0 | $0.005 | ...
actual:   2026-04-16 | (all, total)        | 61 | 46 | 3 | 46 | $0 | $0     | "Successful" per-bot-table = 3 (Perplexity 1 + FacebookBot 2). Dashboard top-card reads 0. Transactions empty. All were $0 free-preview.
```

First actual paid revenue row will be written once operator creates TollBit license rates AND a forwarded bot (with presented license) goes through the per-scrape billing flow. ETA ≥1 week after operator action.
