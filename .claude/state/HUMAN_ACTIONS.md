# HoldLens — Human actions queue

## 👤 DEPLOY v0.13 — live data + watchlist + search

**What:** Push the `acepilot/live-data-v0.13` branch, merge to `main`, deploy.

**Why this is a human action:** Deployments to production hit holdlens.com which is visible to users. Vercel + Cloudflare dashboards also gate auth behind passwords that AcePilot cannot fill in.

**Steps (copy-paste):**

```bash
# 1. Go to the project
cd "/Users/paulodevries/Library/Mobile Documents/com~apple~CloudDocs/AceVault/ CLUSTER01-AceVault/VAULT01-Paulo Projects/Stocks/holdlens"

# 2. Review the diff (optional)
git log --oneline main..acepilot/live-data-v0.13
git diff main...acepilot/live-data-v0.13 -- app components lib

# 3. Push the feature branch
git push -u origin acepilot/live-data-v0.13

# 4a. Option A: merge via CLI
git checkout main
git merge --no-ff acepilot/live-data-v0.13 -m "merge v0.13 — live data + features"
git push origin main

# 4b. Option B: open a PR instead
gh pr create --title "v0.13 — live data + watchlist + search + filing badges" \
  --body "Adds client-side live-data layer (Yahoo Finance v8 + sessionStorage cache + corsproxy fallback) plus watchlist, global search, portfolio-value card, and filing badges. 228 static pages, clean build. See .claude/state/DECISIONS.md for architecture rationale."

# 5. Deploy (if your Cloudflare/Vercel hook doesn't auto-deploy on main)
# Vercel:
vercel --prod
# OR Cloudflare Pages (if your Pages project is git-connected, pushing main is enough)

# 6. Smoke-test live site
open https://holdlens.com/ticker/AAPL     # should show live price + chart + star button
open https://holdlens.com/investor/warren-buffett  # should show portfolio value in $
open https://holdlens.com/watchlist        # empty state; star AAPL then return
```

**Verification checklist (after deploy):**
- [ ] Homepage: LiveTicker bar scrolls with prices at the top
- [ ] `/ticker/AAPL` loads with live price (not "—") + visible chart
- [ ] `/ticker/AAPL` star button toggles + persists on reload
- [ ] `/investor/warren-buffett` shows portfolio value in $B
- [ ] `/top-picks` shows live price column on desktop
- [ ] cmd+K opens search modal, typing "buff" shows Buffett
- [ ] `/watchlist` loads, shows what user starred
- [ ] No JS console errors (`devtools > console`)
- [ ] Mobile 375px: LiveTicker + header nav work, ticker page is readable

**If prices show as "—" in production (CORS):**
Yahoo Finance sometimes blocks browser origins. The code falls back to `corsproxy.io` automatically — if BOTH fail:
1. Open devtools → Network → filter "query1.finance.yahoo.com"
2. Check response status
3. If 403/401: Yahoo has tightened. Next cycle: swap to Finnhub free tier (60 req/min, API key required but free to get).
4. If `corsproxy.io` is also blocked: register for a free Cloudflare Worker proxy instead (see `.claude/state/DECISIONS.md`).

**Rollback if needed:**
```bash
git checkout main
git revert -m 1 HEAD  # if you merged v0.13 as a merge commit
git push origin main
# or hard-reset to c872d30 (prior commit) if nothing else shipped on top
```

Stash `acepilot-pre-god-v0.13` is available via `git stash list` — it holds the TASKS.md delta from before the session (a single edit that was already irrelevant).
