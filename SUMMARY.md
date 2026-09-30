# Book product blocks: wrong book and empty cover box

Branch: `cloud/holdlens-kit-2026-09-30`, cut from `main` at `8d01912`. Nothing merged or deployed. No DNS or hosting changes.

## What was wrong

1. **Wrong book ("Diocese of Atlanta" instead of Poor Charlie's Almanack).**
   - Book blocks get their Amazon product from the ISBN in `data/books.ts` (ISBN-13 → ISBN-10 = ASIN).
   - Poor Charlie's Almanack had an ISBN that is a real, but different, book.
   - On the homepage top card, the kit script (`lib/kit/amazon-ad.ts`, `AD_JS`) then **replaced our own title with whatever title the live product data returned**, with no check. A wrong ASIN therefore showed the wrong book's title, cover and price.
   - `main` already swapped in a new Poor Charlie's ISBN, but nothing stopped the same fault from happening again.
   - The same fault class was still live for **The Most Important Thing** (Howard Marks). Its ISBN `9780470181751` carries the 978-0-470 prefix, which belongs to John Wiley & Sons. Marks's book is published by Columbia Business School Publishing, so that `/dp/` link could not point at the right book. It was used on about 100 pages via the reading lists.
2. **Empty grey box where a cover failed to load.**
   - The kit marked a card as "has image" the moment it *created* the `<img>`, before the image had loaded.
   - A cover that 404'd or was blocked therefore left an empty, bordered box with a broken-image icon (reproduced on `main`, see `review/before/before-home-simulated-wrong-book-375.png`).
   - With no live data at all, the cards were mostly empty white boxes holding only a title (`review/before/before-home-375.png`).

## What changed

### Matching: the intended title and author are always shown
- **Build-time guard** (`data/books.ts`, `bookIntegrityErrors`, run when the module loads). The build now fails on:
  - an ISBN-13 with a bad checksum or no 978 prefix;
  - two titles resolving to the same ASIN;
  - an ASIN known to be a different book. The Diocese of Atlanta ASIN `1578643643` is on that list, so it can never come back.
- **The Most Important Thing**: ISBN set to `null`. It now uses the existing department-pinned title + author search link, which always lands on the right book. Nothing was fetched and no new ISBN was invented.
- **Browser guard** (`lib/kit/amazon-ad.ts`). Each homepage card carries the title it must show (`data-expect`):
  - live data whose title does not contain that title is **refused entirely**: no cover, no price, no title swap;
  - when the data does match, the card keeps **our own title and author** and only adds the cover and the live price.
  - The match ignores case, accents and apostrophes, and a leading "The/A/An". "Poor Charlie's Almanack: The Essential Wit…" passes; "Diocese of Atlanta…", an empty title, and "The Intelligent Investor's Workbook" are refused.
- One `amazonAsin()` helper in `data/books.ts` replaces the duplicate ISBN converter that `AmazonTopBar.tsx` had.

### No empty boxes: every card is a complete title card
- The cover area only appears after the image has **actually loaded** (`load` event with a real width). On error the image is removed and the area stays hidden.
- Each homepage card is a complete title card on its own: author, full title, one line on why it's worth reading, and a 44px button. When a cover loads it sits above the text. Card heights are fixed for both states, so nothing shifts on load.
- The homepage card now uses the site's dark palette instead of the kit's bright white slab.
- The heading changed from "Books the investors on this page swear by" to "Two classic books on investing" (calmer, and it makes no claim).
- The "Price as of <date, time>" line no longer gets cut off at phone width.

### Button wording
- Homepage card: **"See price on Amazon"**. It switches to **"View on Amazon"** only on a card that is showing a live, dated price.
- The text-only book cards (`InvestingBooks`, `/reading`, `/reading/[topic]`) never show a price, so they now say **"See price on Amazon"** instead of "View on Amazon →". The label has an inline SVG arrow in `currentColor` and a 44px tall row. It lives in one shared component, `components/SeePriceOnAmazon.tsx`.

### Unchanged on purpose
- Affiliate tag, `/go/` routes and `functions/go/[[path]].ts`, every disclosure text, analytics snippets, `robots.txt`, sitemap logic and canonicals are untouched.
- No price is hardcoded. No Amazon page was fetched.
- `npm run guard:amazon` passes: 29,159 affiliate links on 14,258 pages, all gated and tracked.

## Every product block checked (task 3)

| Block | Where | Wrong-book risk | Empty-box risk | Fixed |
|---|---|---|---|---|
| Homepage top card (`AmazonTopBar`, kit) | `/` | Yes: live title overwrote ours | Yes: box before image loaded | Browser title guard; own title and author kept; image area only after load; full title card |
| `InvestingBooks` (text-only) | ~170 page templates (learn, investor, filings, ETF, dividend-tax, lists) | Yes, through ISBNs in `data/books.ts` | No (no images) | Build guard; The Most Important Thing ISBN removed; "See price on Amazon" |
| Reading hub | `/reading/` | Same as above | No (no images) | Same as above |
| Reading shelves | `/reading/[topic]/` (6 pages) | Same as above | No (no images) | Same as above |

No other product links exist: every `/go/dp` and `/go/s` link on the site is built by `resolveAmazonUrl` in `data/books.ts`. No other component renders a product image.

## Files touched
- `data/books.ts`: build-time guard, `amazonAsin()`, The Most Important Thing ISBN → `null`
- `lib/kit/amazon-ad.ts` (vendored kit): title guard (`p.expect` / `data-expect`), `p.by` byline, `labels.ctaLive`, image area only after the image loads. A header note lists these local patches.
- `components/AmazonTopBar.tsx`: uses the guard, title-card layout, price-aware button label, heading
- `components/SeePriceOnAmazon.tsx` (new component, not a page)
- `components/InvestingBooks.tsx`, `app/reading/page.tsx`, `app/reading/[topic]/page.tsx`: button label
- `review/`: screenshots and the script that took them (`review/shoot.mjs`)

## Build and page counts
| | `main` (before) | this branch (after) |
|---|---|---|
| `.html` pages in `out/` | **22,291** | **22,291** (no new pages) |
| `npm run build` exit code | 1 | 1 |
| Step where it stops | `predeploy-guard`: GA4 ID env missing | same step, same message |
| All other steps (Next build, strip-broken-links, sitemaps, amili-index, homepage dedupe audit, inline-script guard, perf budget) | pass | pass, identical output |
| `npm run guard:amazon` | n/a | exit 0: 29,159 links on 14,258 pages, all gated and tracked |

The exit code is **1 on both**, and only because of the missing env file (see "Skipped, and why"). With the production env file present, the build should exit 0. Please confirm that with the real env file.

The repo's typecheck (`tsc --noEmit`) shows the same 52 errors before and after. All of them are in the untyped vendored kit file, which `next build` does not typecheck.

## Screenshots (`review/`)
- Taken with Playwright and the pre-installed Chromium, served from the built `out/` folder, at **375px and 390px** wide.
- Pages: `/`, `/reading/`, `/reading/mental-models/`, `/learn/what-is-a-13f/`, `/investor/warren-buffett/`, `/etf/`.
- The homepage has two extra **simulated** states. `/amz/items` and the cover URLs were answered locally by the test; nothing reached Amazon. The prices in those shots are test values.
  - `home-simulated-wrong-book-*`: the Poor Charlie's slot returns "Diocese of Atlanta Centennial Celebration" and the Intelligent Investor cover 404s. Result: the wrong product is refused, and no empty box appears.
  - `home-simulated-covers-*`: both titles match and both covers load (placeholder covers). Result: cover, full title, author, price and "View on Amazon" all fit.
- `review/before/` holds the same shots taken from unmodified `main`. They show the Diocese title, the broken-image boxes and the empty cards.
- On every shot the script checked: 0 visible empty image slots, no "Diocese" anywhere on the page, and 0px horizontal overflow.

## Skipped, and why
- **Build exit code 0 was not reachable in this environment.** The final post-build step, `predeploy-guard`, needs `NEXT_PUBLIC_GA4_ID` from an untracked `.env.production.local` / `.env.local`, and a fresh clone has neither.
  - Unmodified `main` fails in exactly the same way and at the same step.
  - Every other step passes on both, with identical results.
  - I did not add a placeholder ID, since that would mean building an untagged or wrongly tagged site.
- `data/page-lastmod.json` was rewritten by the build's sitemap-lastmod step. That script says to commit it only after a deploy, so I reverted it.
- The shared kit's copy upstream (VAULT-Fleet `tooling/fleet-kit/amazon-ad`) is outside this repo and was not changed.

## What a human must check before this goes live
1. **Port the kit patch upstream.** The `lib/kit/amazon-ad.ts` changes must go into the canonical kit before anyone re-syncs it, or the title guard and image fix will be overwritten.
2. **Confirm the Poor Charlie's ISBN.** `9781953953575` (ASIN `1953953573`) comes from `main`. In a normal browser, open that product page and confirm it is Poor Charlie's Almanack. The browser guard protects the homepage card either way, but the text-only cards link straight to that ASIN.
3. **Optionally restore a direct link for The Most Important Thing** once its ISBN is verified (Columbia Business School Publishing edition). Until then it uses the title + author search.
4. **Build with the real env file** (`.env.production.local` holding the GA4/Clarity IDs) and confirm `npm run build` exits 0.
5. **Check with live data.** Once `/amz/items` answers for holdlens.com, load `/` and confirm that real covers and prices appear and that a price shows "View on Amazon" plus the "Price as of" time.

## Review follow-up (same day)
A review pass on this branch fixed two layout issues on the homepage book card and retook every screenshot. See `REVIEW.md`.
- Descriptions are no longer cut mid-sentence at phone and tablet widths.
- The button stays inside the card when a live price shows without a cover.
- New screenshot: `review/home-simulated-price-no-cover-{375,390}.png`.
- Page count is still 22,291. The build still exits 1, only at `predeploy-guard` (no env file in a fresh clone).
