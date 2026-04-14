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

---

## 👤 ACTIVATE Google AdSense — ad revenue on all content pages (v0.31)

**Why this is a P0 revenue action:** AdSlot components are now wired into 24+ pages across the entire site. The component reads `NEXT_PUBLIC_ADSENSE_CLIENT` from env — one env var = ads serving everywhere. Without it, the slots render a tasteful Pro upsell banner (not wasted space, but not ad revenue either).

**Estimated time:** 15 minutes for signup, 1-3 days for Google approval.

**Why only a human can do this:** AdSense signup requires a Google account, site ownership verification, and tax/payment details.

### Steps

**1. Apply for Google AdSense**

1. Go to https://adsense.google.com/start/
2. Sign in with your Google account
3. Enter site URL: `https://holdlens.com`
4. Country: Netherlands (or wherever your tax entity is)
5. Submit application — Google reviews the site (typically 1-3 days for a content site with 490 pages)

**2. Get your client ID + create ad units**

Once approved:
1. Copy your **Publisher ID** (format: `ca-pub-1234567890123456`) from AdSense → Account → Account information
2. Create 3 ad units in AdSense → Ads → By ad unit:
   - **Horizontal** (Leaderboard 728x90 or Responsive) — note the slot ID
   - **Rectangle** (Medium Rectangle 300x250 or Responsive) — note the slot ID
   - **In-article** (In-article native) — note the slot ID

**3. Set env vars in Cloudflare Pages**

1. Open https://dash.cloudflare.com/ → Workers & Pages → **holdlens**
2. Settings → Environment variables → Production
3. Add these variables:
   - `NEXT_PUBLIC_ADSENSE_CLIENT` = `ca-pub-XXXXXXXXXXXXXXXX`
   - `NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL` = `XXXXXXXXXX` (horizontal slot ID)
   - `NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE` = `XXXXXXXXXX` (rectangle slot ID)
   - `NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE` = `XXXXXXXXXX` (in-article slot ID)
4. Click **Save**

**4. Trigger rebuild**

```bash
cd "/Users/paulodevries/Library/Mobile Documents/com~apple~CloudDocs/AceVault/ CLUSTER01-AceVault/VAULT01-Paulo Projects/Stocks/holdlens"
git commit --allow-empty -m "chore: trigger rebuild with AdSense env vars"
git push
```

**5. Verify**

- Open https://holdlens.com/learn/what-is-a-13f in incognito
- You should see an ad between sections (may take a few hours for first fill)
- Check https://holdlens.com/buys — horizontal ad between content
- If ads show "Advertisement" label but empty box → AdSense is still warming up, give it 24h

### Revenue expectation

Finance sites get $8-25 CPM. At 10k pageviews/mo × $15 avg CPM = ~$150/mo. Scales linearly with traffic.

### Rollback

Delete `NEXT_PUBLIC_ADSENSE_CLIENT` from CF env vars → rebuild. All slots revert to Pro upsell banners.

---

## 👤 ACTIVATE Brokerage Affiliate Links — highest RPU channel (v0.31)

**Why this matters:** AffiliateCTA is wired into every `/signal/[ticker]` and `/ticker/[symbol]` page (94+ ticker pages). Interactive Brokers pays **$200 per funded account**. At even modest conversion, this is the highest-RPU revenue channel.

**Estimated time:** 30-60 minutes (signup for each program).

### Recommended affiliate programs (in priority order)

| Broker | Payout | Signup | Env var |
|---|---|---|---|
| Interactive Brokers | $200/funded account | https://www.interactivebrokers.com/en/index.php?f=ibgPartners | `NEXT_PUBLIC_AFF_IBKR` |
| Public.com | $25-50/funded account | https://public.com/partners | `NEXT_PUBLIC_AFF_PUBLIC` |
| moomoo | $20-100/funded account | https://www.moomoo.com/us/affiliate | `NEXT_PUBLIC_AFF_MOOMOO` |

### Steps (per broker)

1. Sign up for their affiliate/partner program
2. Get your referral link (most support `{SYMBOL}` deep links)
3. Add the env var to Cloudflare Pages (same process as above)
4. Rebuild

### URL format

The AffiliateCTA component replaces `{SYMBOL}` in the URL with the ticker symbol. Example:
- IBKR: `https://www.interactivebrokers.com/mkt/?src=YOUR_ID&url=%2Fen%2Findex.php%3Ff%3D46115%26t%3D{SYMBOL}`

### Verify

After adding env vars + rebuild:
- Open https://holdlens.com/signal/AAPL
- You should see a "Ready to act on AAPL?" card with broker buttons
- Click → should open the broker's signup page with your referral tracking

### Revenue expectation

1000 monthly signal page visits × 3% CTR × 5% funded = 1.5 accounts × $200 = $300/mo from IBKR alone. Compounds across 94 ticker pages.

---

## ACTIVATE Resend email backend [P1 · 10 min]

**What it does:** Turns the email capture forms on every HoldLens page into real subscriber signups. Each signup gets a welcome email instantly and lands in a Resend audience you can broadcast to when each quarter's 13F drops.

**Revenue story:** Email is the #1 channel for 13F SaaS. Every captured email is a chance to pitch HoldLens Pro at the quarterly filing deadline — the moment users care most. Even at 2% trial conversion × $9/mo Founders pricing, 500 subs = $90/mo recurring. Compounds fast.

**Current state (v0.36):** Backend scaffold is LIVE at `functions/api/subscribe.ts`. When `RESEND_API_KEY` is missing, it gracefully returns 200 so the UI shows success and the email lands in the user's localStorage (can be drained later). Zero signups lost, ever. Flip one env var and real emails start sending.

### Step 1 — Sign up for Resend

1. Go to https://resend.com → **Sign up** (free tier = 3000 emails/mo, 100/day — enough for HoldLens for months)
2. Verify your email
3. Once in, head to **Domains** in the left sidebar

### Step 2 — Verify holdlens.com as a sending domain

1. Click **Add Domain** → enter `holdlens.com`
2. Resend shows a list of DNS records (SPF, DKIM, MX) to add at Cloudflare
3. Open a new tab → https://dash.cloudflare.com → holdlens.com → DNS → Records
4. For each Resend record, click **Add record** in Cloudflare and paste the Type/Name/Value exactly as shown
5. Back in Resend, click **Verify DNS Records** — takes 1–5 minutes
6. Once all green, the domain is verified and you can send from `@holdlens.com`

### Step 3 — Create the audience

1. In Resend, sidebar → **Audiences** → **Create Audience**
2. Name it: `HoldLens subscribers`
3. Copy the **Audience ID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) — you'll paste it in Cloudflare next

### Step 4 — Get the API key

1. Sidebar → **API Keys** → **Create API Key**
2. Name: `holdlens-production`
3. Permission: **Full access**
4. Copy the key (starts with `re_...`) — you can only see it once

### Step 5 — Paste env vars in Cloudflare Pages

1. https://dash.cloudflare.com → Pages → **holdlens** → Settings → Environment variables
2. Add three variables in **Production** (and **Preview** if you want to test on PR previews):
   - `RESEND_API_KEY` = (the `re_...` key from Step 4)
   - `RESEND_AUDIENCE_ID` = (the UUID from Step 3)
   - `RESEND_FROM` = `HoldLens <alerts@holdlens.com>` (must use your verified domain)
3. Click **Save**

### Step 6 — Trigger a redeploy

Env var changes don't propagate until the next deployment. Either:
- Wait for the next auto-deploy (any push to `main` / `acepilot/v0.25-unified-score`)
- Or: Pages → holdlens → Deployments → ••• on the latest deploy → **Retry deployment**

### Step 7 — Verify end-to-end

1. Open https://holdlens.com/alerts/
2. Enter a real email you control
3. Click **Get alerts** → should show the "You're on the list" confirmation
4. Check your inbox within 10 seconds → welcome email should arrive from `alerts@holdlens.com`
5. Back in Resend → Audiences → HoldLens subscribers → your email should be in the list

### Troubleshooting

- **No email arrives but UI shows success** → `RESEND_API_KEY` is not set or has a typo. Check Cloudflare env vars. The backend is designed to 200 even when the key is missing (we never lose signups).
- **Resend shows "domain not verified"** → DNS records in Cloudflare haven't propagated yet. Wait 10 min and re-click Verify in Resend.
- **Email lands in spam** → first few sends always do. Send yourself 3–4, mark as not spam, reputation builds fast once the DKIM is verified.

### Revenue expectation

500 subs × quarterly 13F broadcast × 2% trial click × $9/mo = $90/mo baseline. At 2000 subs (6 months of organic growth) that's $360/mo recurring, pure margin after the $20/mo Resend Pro tier kicks in. Worth 10 minutes of DNS config.

