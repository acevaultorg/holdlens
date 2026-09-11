# Affiliate activation — HoldLens

**Going live with an approved program is an environment-only site change, but the value must be present during the local production build and the resulting artifact must pass the normal guarded Cloudflare deploy.**

Every affiliate surface on the site is already built and already instrumented. It renders **nothing** — no heading, no empty container, no whitespace, no layout shift — until the matching env var is set. Simply Wall St was approved on 2026-09-08 but is not active; as of 2026-09-11 **zero affiliate links render anywhere on the site.**

---

## 1. Capture the provider URL, then set the local build variable

Create the approved program's tracking URL inside its provider dashboard. Never hand-build an affiliate URL and never commit it. Store the exact URL and display name in the canonical main checkout's gitignored `.env.production.local` file.

HoldLens is a static export built locally. Cloudflare Pages dashboard variables do **not** reach that build, and a push to `main` runs GitLab build validation but does **not** deploy production. From the canonical main checkout, run the guarded production path:

```bash
npm run deploy
```

That command cleans and rebuilds the site, validates the newly built/pruned artifact, uploads it through `scripts/deploy-cf.sh`, and then pings IndexNow. Do not call the Python uploader or bare Wrangler command directly.

### Brokerage partners — render on `/partners` only

Brokerage links are YMYL-gated: they appear **only** on `/partners`, never next to a ConvictionScore, signal, or verdict. Setting any one of these also switches on the small "See our partner brokers →" text cross-link that sits at the bottom of result pages.

| Env var | Partner |
|---|---|
| `NEXT_PUBLIC_AFF_IBKR` | Interactive Brokers |
| `NEXT_PUBLIC_AFF_SCHWAB` | Charles Schwab |
| `NEXT_PUBLIC_AFF_PUBLIC` | Public.com |
| `NEXT_PUBLIC_AFF_ROBINHOOD` | Robinhood |
| `NEXT_PUBLIC_AFF_ETORO` | eToro |
| `NEXT_PUBLIC_AFF_MOOMOO` | moomoo |
| `NEXT_PUBLIC_AFF_TRADEREPUBLIC` | Trade Republic |

Legacy aliases still honoured on `/partners`: `NEXT_PUBLIC_IBKR_REF`, `NEXT_PUBLIC_SCHWAB_REF`, `NEXT_PUBLIC_ETORO_REF`, `NEXT_PUBLIC_TRADEREPUBLIC_REF`. Prefer the `_AFF_` names.

The value is the raw affiliate URL, e.g. `https://www.interactivebrokers.com/mkt/?src=holdlens&url=/en/index.php`.

### Research / data tools — render inline, below data tables

A research tool is not a brokerage (no funded financial account), so it is allowed to render inline on ticker and signal pages — placed **below** the data table, never beside a score.

| Env var | Purpose |
|---|---|
| `NEXT_PUBLIC_AFF_RESEARCH` | The affiliate URL. **Setting this alone activates the slot.** |
| `NEXT_PUBLIC_AFF_RESEARCH_NAME` | Display name, e.g. `Simply Wall St`. Optional — defaults to "our research partner". |

Before upload, inspect representative built `/ticker/*` and `/signal/*` HTML and prove that the provider-generated destination, display name, `rel="sponsored nofollow noopener"`, and adjacent disclosure are present only on the intended below-table surface. Do not follow the affiliate destination during QA.

---

## 2. What renders when you set it

- The link, with `rel="sponsored nofollow noopener"` and `target="_blank"` — hard-coded in `components/AffiliateLink.tsx`, not passable as a prop, so a call-site cannot accidentally ship a followed affiliate link.
- An FTC disclosure sentence **immediately adjacent** to the link, linking to `/disclaimer#affiliate-disclosure`.
- No price is ever displayed (Amazon Associates rule, applied site-wide as policy).

---

## 3. Measurement — already wired

Every affiliate click fires into the analytics stacks the site already loads. **No new vendor is introduced.**

| Event | Fires on | Properties |
|---|---|---|
| `affiliate_click` | Outbound paid link | `partner`, `surface` |
| `partners_link_click` | Internal result-page → `/partners` cross-link | `partner` (= source), `surface` |

Destinations, all from `components/AffiliateLink.tsx`:

- **Microsoft Clarity** — `clarity('event', 'affiliate_click')` plus filterable dimensions `affiliate_partner` and `affiliate_surface`. Filter any Clarity session list or heatmap by these.
- **Google Analytics 4** — `gtag('event', 'affiliate_click', { partner, surface, event_category: 'affiliate' })`. Mark as a key event in GA4 → Admin → Events once the first clicks land.
- **Plausible** — the existing `plausible-event-name=` className convention is preserved verbatim, so nothing regresses while Plausible is still billed.

Tracking both steps means the funnel — result page → `/partners` → broker — is measurable from day one, instead of only the final hop.

**Why this mattered:** before 2026-08-11 all affiliate surfaces were tagged for Plausible *only*. With Plausible being retired fleet-wide, an approved program would have produced links with no conversion data attached.

---

## 4. Turning a partner off

Delete both partner variables from the canonical main checkout's `.env.production.local`, run `npm run deploy`, and verify representative live ticker and signal pages no longer contain the card. The render-nothing path is the default, not a special case.

---

## 5. Compliance invariants (do not regress)

- Brokerage links: `/partners` only. Never adjacent to a score, signal, or verdict.
- Every paid link: `rel="sponsored nofollow noopener"`, new tab, adjacent FTC disclosure.
- No price display on any affiliate link.
- No fake scarcity, no countdowns, no "click the links to support us".
- `/partners` and `/disclaimer#affiliate-disclosure` must stay reachable from the footer on every page.
