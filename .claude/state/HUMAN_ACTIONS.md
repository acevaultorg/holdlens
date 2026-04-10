# HoldLens — Human actions queue

## 👤 DEPLOY v0.13 + v0.14 + v0.15 — buy/sell model + signal dossier + news + heatmap

**What:** Push the `acepilot/live-data-v0.13` branch with the v0.13 and v0.14
commits. Merge to `main`. Deploy.

**Why this is a human action:** Production deploys to holdlens.com gate on
Vercel/Cloudflare credentials.

**Steps (copy-paste):**

```bash
cd "/Users/paulodevries/Library/Mobile Documents/com~apple~CloudDocs/AceVault/ CLUSTER01-AceVault/VAULT01-Paulo Projects/Stocks/holdlens"

# 1. Review the diff
git log --oneline main..HEAD
git diff main...HEAD -- app components lib | less

# 2. Push the feature branch
git push -u origin acepilot/live-data-v0.13

# 3a. Option A — merge via CLI
git checkout main
git merge --no-ff acepilot/live-data-v0.13 -m "merge v0.13+v0.14 — live data + buy/sell model + Dataroma beat"
git push origin main

# 3b. Option B — open a PR instead
gh pr create --title "v0.13+v0.14 — live data + buy/sell recommendation model" \
  --body "$(cat <<'EOF'
## Summary
- v0.13: client-side live data (Yahoo v8 + sessionStorage cache + corsproxy fallback), LiveQuote, LiveChart, watchlist, global cmd+K search, filing badges
- v0.14: multi-factor buy/sell recommendation model, per-ticker activity feed, 8 new Tier-1 managers (22 total), Q3+Q4 2025 moves data, /buys /sells /activity /grand pages, homepage signal card
- 253 static pages, 0 build errors

## Test plan
- [ ] /buys ranked by score, top signal >=60
- [ ] /sells ranked by score
- [ ] /activity shows Q4 first, then Q3
- [ ] /grand top 50 weighted-consensus tickers
- [ ] /ticker/AAPL activity feed shows Buffett's trims
- [ ] /investor/chris-hohn shows TCI's META add (biggest Q3 move)
- [ ] cmd+K search finds new managers (Halvorsen, Hohn, etc.)
- [ ] Mobile 375px: hero CTA + signal card responsive
EOF
)"

# 4. Deploy
vercel --prod      # if Vercel
# OR wait for Cloudflare Pages auto-deploy on main push

# 5. Smoke test
open https://holdlens.com/                     # hero: "What to buy / What to sell"
open https://holdlens.com/buys                  # top of ranking
open https://holdlens.com/sells                 # top of ranking
open https://holdlens.com/activity              # Q4 first
open https://holdlens.com/grand                 # weighted consensus
open https://holdlens.com/ticker/META           # biggest Q3 action (TCI, Viking, Lone Pine, Maverick all buying)
open https://holdlens.com/investor/chris-hohn   # new manager page
```

**Verification checklist:**
- [ ] Homepage hero reads "What to buy / What to sell"
- [ ] Homepage "Buy signals" card shows top 5 tickers with scores
- [ ] /buys page loads, ranks by score, shows buyer badges (NEW highlighted)
- [ ] /sells page loads, ranks by score, shows seller badges (EXIT highlighted)
- [ ] /activity page shows Q4 2025 section first
- [ ] /grand shows top 50 weighted-consensus stocks
- [ ] /ticker/AAPL shows: live quote + chart + TickerActivity feed + ownership table + star button
- [ ] /investor/warren-buffett shows: filing badges + portfolio value + live prices + InvestorMoves (Q3+Q4)
- [ ] /investor/chris-hohn (new) loads cleanly with his Q3 META add visible
- [ ] Net Signal badge on ticker activity reads STRONG BUY / NEUTRAL / STRONG SELL correctly
- [ ] cmd+K search returns new managers + tickers (META, NVDA, etc.)
- [ ] LiveTicker bar still scrolls at the top
- [ ] No JS console errors

**If prices show "—" in production (CORS):**
Same fallback as v0.13: corsproxy.io path. If that also fails, next cycle
swaps to Finnhub free tier.

**Rollback if needed:**
```bash
git checkout main
git revert -m 1 HEAD
git push origin main
```
Or restore to pre-v0.13 state: `git reset --hard c872d30` (before any of the
Apr 10 work).
