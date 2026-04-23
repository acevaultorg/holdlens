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

## Corrections

(timestamp-anchored per append-only convention)

None yet.
