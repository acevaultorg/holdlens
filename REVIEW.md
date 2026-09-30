# Review: `cloud/holdlens-kit-2026-09-30`

Reviewed 2026-09-30. Branch found as named, cut from current `main` (`8d01912`); it had 7 commits (wrong-book guard, empty-cover fix, button wording, screenshots, SUMMARY.md). I reviewed on the same branch and pushed fixes there. Nothing merged, nothing deployed.

## What I checked

| Check | Result |
|---|---|
| `npm run build` | Next build and every post-build step pass. Exit code **1**, only at the final `predeploy-guard` step: this fresh clone has no `.env.production.local` / `.env.local`, so the GA4 ID can't be found. `main` stops at the same step with the same message. I did not add a placeholder ID. |
| `.html` page count in `out/` | **22,291** before and after. The branch adds no routes (the only new file is a component, `components/SeePriceOnAmazon.tsx`). |
| `npm run guard:amazon` | OK: 29,159 affiliate links on 14,258 pages, all gated and tracked. |
| Affiliate tag, `/go/` routes, disclosures, analytics, robots.txt, sitemap logic, canonicals | Unchanged. The diff against `main` touches nothing in `functions/`, `public/`, `app/layout.tsx`, `scripts/`, `next.config.js` or the tracking-guard config. The disclosure line ("Sponsored · affiliate link") and the `/go/dp` gate are as before. |
| Link changes | One intended change: *The Most Important Thing* now uses the existing `/go/s` title + author search instead of `/go/dp` with an ISBN from Wiley's publisher range (Marks's book is from Columbia). This avoids linking the wrong product and still goes through the gate. I agree with it. |
| Prices | None hardcoded. A price appears only from live `/amz/items` data, with its "Price as of" time. The button reads "View on Amazon" only on a card with a live price and "See price on Amazon" everywhere else. |
| HTML | The markup built by the kit and the React components is well formed; the inline-script parse guard passes on all 22,291 pages. The browser title match (`data-expect`) is escaped correctly in the built JS. |
| Wording seen by visitors | Plain and calm: "Two classic books on investing", "See price on Amazon", "View on Amazon". No internal labels, no card ids, no "Amili kit" wording on any page. |
| Icons and tap targets | New arrow is inline SVG in `currentColor`. Buttons and labels are at least 44px tall; each text card is itself the link. |
| 375px / 390px layout | Measured in Chromium for every card state: no cover, cover, price with cover, price with no cover, wrong product refused. No horizontal page scroll on any changed page. |

## What I fixed (on this branch)

1. **`ec0eea8a1`: description cut off mid-sentence on the homepage card.** At 375px and 390px the one-line description was cut to 3 lines ("Buffett calls it 'by far the…"), with about 50px of empty card below it. At 768px the Poor Charlie's line was also cut. The cards are now slightly taller at phone width (300px instead of 264px; reserved height changed to match, so nothing shifts). They show up to 7 lines on phones and 3 on wider screens, so the full sentence shows at 375, 390, 768 and 1280px.
2. **`c70f72ec8`: button pushed out of the card.** Fix 1 introduced this: a card with a live price but no cover needs more room, and at 375px the button ran 17px into the card's bottom padding. On phones the description is now capped at 5 lines when a price is shown, so the button stays inside the card (checked at 320, 375 and 390px).
3. **Review script** (`review/shoot.mjs`) now also captures the "price, no cover" state, the tallest card state.

## Screenshots (`review/`, retaken from this build)

At 375px and 390px: `/`, `/reading/`, `/reading/mental-models/`, `/learn/what-is-a-13f/`, `/investor/warren-buffett/`, `/etf/`, plus three simulated homepage states:
- `home-simulated-wrong-book-*`: the wrong product is refused and a failed cover leaves no box.
- `home-simulated-covers-*`: both covers load.
- `home-simulated-price-no-cover-*`: price shown, no cover.

The simulated states answer `/amz/items` and cover URLs locally, and their prices are test values. No request reached Amazon. `review/before/` is the earlier session's shots of unmodified `main`.

## Not changed (outside this branch's scope)

- A few older links elsewhere on these pages use a text "→" rather than an SVG icon, for example "Prefer to listen? Start a free Audible trial →" and "See the full investing reading list →". They are on `main` already and this branch doesn't touch them.
- `lib/kit/amazon-ad.ts` is a vendored file. Its local patches must be ported to the canonical kit before the next re-sync (noted in the file header and in SUMMARY.md).

## Ready to go live?

**Yes for the code; not yet for release.** The changes are correct, calm and safe. Page count is the same, affiliate tracking is intact, no price is hardcoded, and it works at 375px and 390px. Before it goes live, a human must:

1. Build with the real env file, where `npm run build` must exit 0. Exit 0 could not be shown here.
2. Open ASIN `1953953573` in a normal browser and confirm it is *Poor Charlie's Almanack*. The ISBN comes from `main`; the text cards link to it directly.
3. Port the kit patch upstream before anyone re-syncs `lib/kit/amazon-ad.ts`.
4. Optionally, verify the Columbia edition ISBN for *The Most Important Thing* and restore a direct link. Until then it uses the title + author search.
