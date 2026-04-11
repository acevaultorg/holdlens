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

---

## 👤 ACTIVATE Stripe Payment Link — THE revenue unlock (v0.28)

**Why this is the #1 revenue action:** `components/StripeCheckoutButton.tsx`
is already wired into `/pricing`. The only thing missing is ONE (or two)
environment variables at the hosting layer. Setting them flips the CTA
from "Get notified" → live Stripe Checkout. First real subscription dollar
is one operator session away.

**Estimated time:** 10 minutes end-to-end.

**Why only a human can do this:** Stripe's dashboard requires a logged-in
account with a verified business entity; product + Payment Link creation
cannot be automated from this sandbox.

### Steps (copy-paste)

**1. Create the Pro product in Stripe**

1. Open https://dashboard.stripe.com/products/create
2. Name: `HoldLens Pro`
3. Description: `Email alerts + EDGAR automation + API access + custom watchlist signals.`
4. Pricing model: **Standard pricing**
5. Add TWO prices to the same product (or two products if you prefer cleaner analytics):
   - **Founders (100 spots · $9/mo)** — Recurring, $9.00 USD / monthly, no free trial
   - **Standard ($14/mo)** — Recurring, $14.00 USD / monthly, no free trial
6. Click **Save product**

**2. Generate Payment Links**

For EACH price (founders + standard):
1. Click the price row → **Create payment link**
2. Allow promo codes: off (or on, your call)
3. Collect: email (required — already default)
4. After payment: redirect to `https://holdlens.com/thank-you`
5. Confirmation message: `Welcome to HoldLens Pro. You'll get the first alert digest on Monday.`
6. Click **Create link**
7. Copy the URL (format: `https://buy.stripe.com/...`)

You now have:
- `FOUNDERS_LINK` = the $9/mo founders URL
- `STANDARD_LINK` = the $14/mo standard URL

**3. Paste into Cloudflare Pages env vars**

1. Open https://dash.cloudflare.com/ → Workers & Pages → select the **holdlens** project
2. **Settings** → **Environment variables** → **Production**
3. Add two variables (both must be `Plaintext` and `NEXT_PUBLIC_` prefixed so they're exposed at build time):
   - Name: `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_FOUNDERS` · Value: `FOUNDERS_LINK`
   - Name: `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` · Value: `STANDARD_LINK`
4. Click **Save**

**4. Trigger a fresh deploy so the env vars are compiled in**

Option A — push any commit to the connected branch (easiest):
```bash
cd "/Users/paulodevries/Library/Mobile Documents/com~apple~CloudDocs/AceVault/ CLUSTER01-AceVault/VAULT01-Paulo Projects/Stocks/holdlens"
git commit --allow-empty -m "chore: trigger rebuild with Stripe env vars"
git push
```

Option B — Cloudflare dashboard → holdlens project → **Deployments** → **Retry deployment** on the most recent build.

**5. Verify live**

- Open https://holdlens.com/pricing in an incognito window
- The Pro card should show a yellow **"Subscribe — $9/mo founders rate →"** button
- Click it — you should land on Stripe Checkout, not /alerts
- (Optional) Start a test purchase with your own card, then refund yourself from the Stripe dashboard

### If you want to stage one link instead of two

Drop only `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_FOUNDERS` first and leave the standard one empty. The component gracefully falls back to founders for both variants when the standard is missing.

### Rollback

If anything looks wrong (wrong price, wrong description), delete the env var in Cloudflare Pages. The button reverts to `/alerts` email capture within one deploy — zero data loss.

### After activation — what Chief will do next session

- Add an `[x]` mark to `TASKS.md#stripe-activate` on the first `[👤] RESUMED` scan
- Append a `Ship Impact` row to `GROWTH_ANALYTICS.md` recording the hypothesis ("Stripe activation expected to convert N% of /pricing visitors at $9–14 ARPU")
- Wire a Plausible goal on the `buy.stripe.com` outbound click (already instrumented via `Pro Checkout Click` custom event in the component)
- Consider adding a Stripe webhook → Resend welcome email once SEND traffic makes it worth the 20 min wire

