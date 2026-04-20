# PPC.md — Pay-Per-Crawl revenue + crawler tracking (v0.1)

**Created:** 2026-04-20. Append-only.

## Schema

Per-month rollup row format:

```
YYYY-MM | total_requests | total_revenue_usd | top_crawler | top_route | notes
```

Per-route detail (rolled up monthly into Cloudflare PPC dashboard export):

```
YYYY-MM | route_pattern | tier | requests | revenue_usd
```

## Tier definitions (from public/llms.txt + app/api/page.tsx)

| Tier | Per-request | Routes |
|---|---:|---|
| Free | $0.000 | /, /about/, /methodology/, /contact/, /privacy/, /terms/, /learn/*, /api/, /pricing/ |
| Standard | $0.002 | /best-now, /buys, /sells, /value, /sector/*, /quarterly/*, /leaderboard, /manager-rankings, /by-philosophy, /overlap, /proof, /vs/* |
| Per-entity detail | $0.005 | /ticker/[X], /signal/[X], /investor/[X], /insiders/[X], /buybacks/[X], /short-interest/[X], /activist/[X], /congress/[X], /dividend-tax/[X], /similar-to/[X] |
| Time-sensitive feeds | $0.010 | /activity, /this-week, /biggest-buys, /biggest-sells, /new-positions, /exits, /first-movers, /reversals |
| Enterprise endpoints | $0.050 | /api/v1/* |

## Operator action required (one-time, ~30 min)

To activate Pay-Per-Crawl revenue collection on holdlens.com:

1. Cloudflare dashboard → Pages → holdlens project → Pay-Per-Crawl tab
2. Enable Pay-Per-Crawl
3. Configure default rate: $0.002/request
4. Add per-route overrides matching the table above (CF supports glob patterns)
5. Connect Stripe payout account (CF disburses monthly)
6. Confirm `/llms.txt` is being served (CF crawls it for declared tiers)

Reference: https://blog.cloudflare.com/introducing-pay-per-crawl/

## Calibration

Once enabled, Cloudflare PPC dashboard exports monthly CSV. Append per-month rollup here to track revenue trajectory + recalibrate per-route pricing if certain tiers under/over-perform.

After 3 months of data:
- If avg per-route revenue >$50/month → consider raising tier
- If avg per-route revenue <$2/month → consider lowering tier or merging into free tier
- If a single crawler dominates >70% of revenue → outreach for enterprise contract (Tier 3 API)

## Monthly revenue rollup

| Month | Total requests | Revenue (USD) | Top crawler | Top route | Notes |
|---|---:|---:|---|---|---|
| 2026-04 | TBD | TBD | TBD | TBD | PPC enable pending operator action (see above) |

## Per-route detail (latest month)

| Route pattern | Tier | Requests | Revenue (USD) |
|---|---|---:|---:|
| (pending PPC activation) | — | — | — |

## Notes

- Pricing schedule reviewed quarterly
- Subscribers (active CF PPC contracts) get 30-day notice of price changes
- Free-tier routes serve LLM discovery — purposefully not monetized; loss-leader for enterprise tier conversion
- Enterprise tier (api.holdlens.com $500-10k/mo) launches when ≥3 inbound inquiries arrive (per spec)

## Inbound enterprise inquiries (Year-2 launch trigger)

Per spec: launch enterprise tier when ≥3 inbound inquiries arrive.

| Date | Company | Volume estimate | Tier interest | Status |
|---|---|---|---|---|
| (none yet) | — | — | — | — |
