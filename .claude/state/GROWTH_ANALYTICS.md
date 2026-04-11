# GROWTH_ANALYTICS.md — holdlens
# Model: subscription (planned Pro tier $14/mo per README) + free lead capture
# Primary KPI: email_capture_rate (pre-monetization), later paid_convert_rate
# Currency: USD
# Created: 2026-04-10
# Model detected from: README.md v0.5 line

## Monetization Events

```
(no events yet — Stripe not wired, subscription tier not launched)
```

## Funnel Metrics

```
(no baseline yet — Plausible is wired but data not logged to this file)
```

## Experiments

```
(none yet)
```

## Ship Impact

```
2026-04-11 | v0.28-signal-share-card | shipped-today | observed_window:7d | metric:organic_referrals_to_signal | hypothesis:+15-40% lift post-viral loop | significance:tbd

Hypothesis:
SignalShareCard (per-ticker canvas PNG + pre-filled tweet + one-click
share to Twitter/LinkedIn) turns every /signal/[ticker] visitor into a
potential amplifier. Before v0.28, the only way to share a signal was a
generic SocialShare link at the bottom of the page. After v0.28:
  - Card is 1200x630 Twitter/OG-spec, branded with HoldLens palette
  - Shows ticker + verdict + signed score + top metrics + brand URL
  - Pre-composed tweet with score, buyer count, top streak, direct link
  - Placed above the chart (high visibility), not buried at page bottom
  - Plausible events fire on Download / Copy / Twitter / LinkedIn

Measurement plan:
  1. Plausible custom events: "Signal Share Download", "Signal Share
     Twitter", "Signal Share LinkedIn" — count per week
  2. Compare /signal/[ticker] referrer breakdown week-over-week
  3. Target: ≥2% of /signal visits trigger a share event (1 in 50)
  4. Target: first inbound referrer from t.co (Twitter) within 7 days
     of a Share Twitter click spike

Risks to hypothesis:
  - Low organic traffic to /signal/[ticker] pages = low share count
    (mitigated by also ranking /signal pages via sitemap priority 0.9+)
  - Canvas rendering may fail on older iOS Safari — falls through silently
    (SSR skeleton visible, no error; Plausible would show lower click rate)
  - Copy-tweet is editable before posting → user may strip the URL

Reject hypothesis if:
  - <0.3% of /signal visits trigger any share event after 14 days
  - No detectable inbound referrals from twitter.com / linkedin.com
    in the Plausible referrer report
  - Bundle size regression >10% on /signal/[ticker] route
    (current: 6.05 kB + 139 kB first load — baseline captured)

Pair with: stripe-activate (operator handoff in HUMAN_ACTIONS.md).
Viral loop needs a monetization endpoint to convert amplified traffic.

---

2026-04-10 | v0.13-live-data | shipped-today | observed_window:pending | metric:email_capture_rate | hypothesis:+30-50% lift | significance:tbd

Hypothesis:
Adding live stock prices + charts + watchlist to HoldLens will raise the
email capture rate on ticker + investor pages. The existing "Always current"
value prop is currently unbacked — users see a list of hedge fund holdings
with no real-time signal, which makes the site feel like a static blog
rather than a stock tracker. After v0.13:
  - Ticker pages have live price + 1y chart + star-to-watchlist
  - Investor pages have a live portfolio-value card in $
  - Homepage has a live ticker bar across the top
  - cmd+K global search reduces nav friction
  - /watchlist gives users a reason to return

Measurement plan (once Plausible events are wired):
  1. Event `livequote:render` — fires on any page with LiveQuote mounted
  2. Event `watchlist:add` — every star click
  3. Event `subscribe:submit` — email capture form POST
  4. Compare pre/post v0.13 email capture rate on ticker + investor pages
  5. Target: +30% conversion lift on ticker pages, +50% return-visit rate
     (measured via watchlist having ≥1 ticker in localStorage on session 2)

Risks to hypothesis:
  - Yahoo Finance CORS may block in production, degrading to "—" prices
    (fallback proxy may also rate-limit)
  - Homepage $1.5T stat remains hardcoded — contradicts "Always current"
    claim on close inspection. Next cycle should compute this from live data.
  - Plausible analytics code is in layout.tsx but not deployed yet (from
    prior session). Both hypothesis measurement AND v0.13 impact
    measurement depend on deploy + Plausible production push.

Reject hypothesis if:
  - Email capture rate on ticker pages is flat or lower 7 days post-deploy
  - >30% of ticker page loads show "—" prices (CORS failure)
  - Watchlist adoption <5% of ticker page sessions
```

## Corrections

```
(none)
```
