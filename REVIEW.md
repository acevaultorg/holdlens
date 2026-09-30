# Review: `cloud/growth-holdlens-2026-09-30`

Reviewed 2026-09-30 as a strict human reviewer. This branch had 6 commits on top of
current `main` (reading-list answers, tables, FAQ, widget topic links, llms.txt).
Fixes were made on the same branch in small commits. Nothing was merged or deployed.

## What I checked

- **Build.** Ran `npm ci` and `npm run build` twice: once on the branch as I found it,
  once after my fixes.
  - `next build` passed, and so did every postbuild check (broken links, inline-script
    parse guard, perf budget).
  - The last step, `predeploy-guard`, exits 1 with "GA4 ID unresolvable". This clone
    has no `.env.production.local` or `.env.local`, which hold the analytics IDs. It
    fails the same way on `main`. I did not fake the IDs to force a 0.
  - Page count: **22,291 `.html` pages** before and after. No new pages.
- **TypeScript.** `tsc --noEmit` shows 52 errors, all in `lib/kit/amazon-ad.ts`. They
  are older than this branch and that file is untouched. There are none in the files
  this branch changes.
- **Affiliate links, canonicals, robots.txt.** I pulled every Amazon, `/go/` and Audible
  href and the canonical tag from the built `/reading`, `/reading/valuation`,
  `/reading/macro-and-memoirs`, `/investor/warren-buffett`, `/learn/what-is-alpha` and `/`.
  They are identical before and after my fixes. The branch does not change
  `resolveAmazonUrl`, `AUDIBLE_URL`, the tag, or the disclosures. `robots.txt` is
  byte-identical, and `scripts/`, `next.config.js`, `app/layout.tsx` and `functions/`
  have no diff against `main`.
- **Prices.** No prices are hardcoded. The book cards show no price, so their label
  "See price on Amazon" is correct. The homepage kit card (live Creators API prices)
  is untouched.
- **HTML and structured data.** There is exactly one FAQPage block per page. The JSON-LD
  answers say the same thing as the visible answers. `isbn` appears only for books that
  already have a verified ISBN in `data/books.ts`.
- **Layout at 375px and 390px.** None of the 10 pages scroll sideways. The new table rows,
  the manager list and the "More by topic" links are at least 44px tall. The only
  smaller links are inline links inside sentences and the existing "See all →" shelf
  headers, which this branch did not add.
- **Copy.** I read every new sentence as a visitor would, looking for hype, internal labels,
  and claims the data can't support.

## What I found and fixed

1. **Product jargon in the new lead answers.** The branch quotes each shelf's first book's
   one-line "why" in the opening paragraph, the FAQ and the JSON-LD. Two of those lines
   used internal wording: "the discipline behind any conviction score" (Damodaran) and
   "the temperament every 13F-copier lacks" (The Psychology of Money). A third,
   "every ConvictionScore input", was on a book card. All three are rewritten in plain
   language. (`data/books.ts`)
2. **The macro shelf's question didn't fit its answer.** "What is the best book on market
   history and financial crashes?" was answered with "Start with The Big Short".
   The question is now "Where should I start with investing history and memoirs?",
   which the shelf's reading order does answer. (`data/books.ts`)
3. **An inaccurate llms.txt claim.** It said "no prices are shown on the site", but
   the homepage kit card shows live Amazon prices. It now says "the reading-list pages
   show no prices". (`public/llms.txt`)
4. **Fragile author matching.** The "written by investors HoldLens tracks" list matched
   first and last names as substrings. For a tracked manager named "Li Lu", that could
   match any author whose name merely contains "Li" and "Lu" (say, "Lucas Lindqvist"), and credit them with a book they didn't
   write. It now matches whole words. The output is the same six managers as before.
   (`app/reading/page.tsx`)
5. **Small copy fixes.**
   - "six topics" was hardcoded. It now comes from the data.
   - "The Berkshire Hathaway shareholder letters are also here" now reads "The complete
     Berkshire Hathaway shareholder letters are on the list too".
   (`app/reading/page.tsx`)

## Left as is (worth a human look)

- **The valuation topic's meta description** (older than this branch) still ends "…behind
  any conviction score". It shows in search results, not on the page.
- **"Books by the superinvestors we track"** is the h1 of the "In their own words" topic,
  but that topic includes Peter Lynch and John Bogle, whom the site does not track. This
  is older than this branch, but the branch now links to the topic from thousands of pages.
- **The site-wide label change** from "View on Amazon" to "See price on Amazon" on every
  book card is correct under the price rule. It is still a visible change on about 170
  templates.

## Screenshots

- `review/*.png`: full page, 375px and 390px wide, cookie banner dismissed. They cover
  `/reading`, all six `/reading/<topic>` pages, `/investor/warren-buffett`,
  `/learn/what-is-alpha` and `/`.
- `review/sections/*.png`: close crops of only the new parts (topic table, reading-order
  table, FAQ, "More by topic" row) at both widths, easier to read than the tall full pages.

## Ready to go live?

**Yes for the code and content, with one condition.** Build it with the real
`.env.production.local` and confirm `predeploy-guard` passes (analytics tags present)
before deploying. This environment could not do that, so the build exited 1 here, for
the same reason it does on `main`. Otherwise the branch builds, adds no pages, leaves
every affiliate link, tag, disclosure, canonical and robots rule unchanged, and works
at 375px.
