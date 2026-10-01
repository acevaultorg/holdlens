# Round 2 (2026-10-01): clearer path from a book to the investor, honest shelf copy, cleaner links

Branch: `claude/r2-holdlens-2026-10-01-1k444u`. This session was assigned that branch name, so it was used instead of `cloud/r2-holdlens-2026-10-01`. It starts from the round-1 branch `cloud/growth-holdlens-2026-09-30`, which already contains all of `main`. Nothing was pushed to the round-1 branches, and nothing is merged or deployed.

Round 1 left two branches. This one builds on `cloud/growth-holdlens-2026-09-30` (reading-list answers and FAQ). The other one, `cloud/holdlens-kit-2026-09-30` (homepage kit card), was not touched.

## What changed, and why

### 1. Reading topic pages: a shorter path to the book, and from the book to the investor

On a phone, the "books in reading order" table sits at the top of each `/reading/<topic>` page, but the book cards are several screens further down. The table also linked nowhere.

- **Table titles now jump to their book card** (`#book-1`, `#book-2`, …), so a reader goes straight from the list to the "See price on Amazon" card. Each title is a full-height tap target of at least 44px. A short line under the heading says "Tap a title to jump to it below."
- **Books written by an investor HoldLens tracks** now have a link under the card: "See Joel Greenblatt's latest 13F holdings", which goes to that investor's profile.
  - The match is the same whole-word author match round 1 used on the hub, so the link only appears when the book data shows that person as author.
  - The matching code moved from `app/reading/page.tsx` to the shared `lib/book-authors.ts`. The hub's output is unchanged.
  - The links appear on these pages:
    - **In their own words:** Buffett, Greenblatt, Einhorn
    - **Mental models:** Marks, Pabrai, Klarman
- Before this, the "In their own words" intro promised that "each pairs directly with a live profile on HoldLens", but the page had no such links.

### 2. Fixed copy that round 1 flagged as "a human must check" (`data/books.ts`)

**"In their own words" page:**

- **Heading.** The h1 was "Books by the superinvestors we track", but Peter Lynch, John Bogle and Gautam Baid are not tracked. It is now "Books by great investors, in their own words".
- **Meta description.** It said the books were by "the superinvestors tracked on HoldLens". It now names the authors and says that Buffett, Greenblatt and Einhorn are the tracked ones.
- **Intro.** The last sentence now says the same thing, so the page no longer claims a profile for every author.

**Valuation page:**

- **Meta description.** It ended "…behind any conviction score", which is internal jargon. It now ends "…for when you want to go deeper".
- **Intro.** Three fixes:
  - It ended "the analytical machinery behind every ConvictionScore on the site". That is replaced with a plain sentence.
  - It told readers to start with *The Little Book of Valuation*, but the page's own lead answer and FAQ say to start with *Damodaran on Valuation*. The intro now agrees with them.
  - It sent readers on to *Investment Valuation*, which is not on the list. That reference is removed.

### 3. Book widget and reading pages: SVG icons and real tap targets

The `InvestingBooks` widget appears on about 170 templates: investor, ticker, signal and learn pages, among others.

- **Arrows.** Text "→" arrows are replaced with a small inline SVG arrow that uses `currentColor` (`components/ArrowIcon.tsx`, marked `aria-hidden`). This covers the widget, the `/reading` hub and the topic pages.
- **44px tap targets.** These links are now at least 44px tall:
  - the Audible button (widget, hub, topic pages)
  - "See the full investing reading list"
  - the hub's "See all" shelf links
- **Spacing.** There is now a small gap between the widget's affiliate disclosure and the book cards. The disclosure text is unchanged.

## Files touched

- `lib/book-authors.ts` (new): shared author-to-tracked-investor match
- `components/ArrowIcon.tsx` (new): inline SVG arrow
- `app/reading/[topic]/page.tsx`: jump links, investor links, icons, tap targets
- `app/reading/page.tsx`: uses the shared match, icons, tap targets
- `components/InvestingBooks.tsx`: icons, tap targets, disclosure spacing
- `data/books.ts`: copy for the "In their own words" and Valuation shelves
- `review/r2-shoot.mjs`, `review/r2/*.png`, `review/r2/sections/*.png`: screenshots
- `SUMMARY-R2.md`

## Build and page counts

| | before (round-1 branch, clean worktree) | after (this branch) |
|---|---|---|
| `.html` pages in `out/` | 22,291 | 22,291 |
| `npm run build` exit code | 1 | 1 |

- The list of page paths is identical. No pages were added or removed.
- **Why the exit code is 1:** the reason is the same as in round 1, and the same on `main`.
  - `next build` and every postbuild check pass, including broken links, the inline-script parse guard (22,291 pages) and the perf budget.
  - The last step, `predeploy-guard`, then stops with "GA4 ID unresolvable", because this fresh clone has no `.env.production.local` or `.env.local`.
  - I did not fake the IDs to force a 0.
- `tsc --noEmit` shows no errors in the touched files. The only errors are pre-existing ones in `lib/kit/amazon-ad.ts`.
- `data/page-lastmod.json`, which the build rewrites, was reverted and not committed.

**Checked unchanged in the built output (before vs after):**

- Every Amazon, `/go/` and Audible href, every affiliate tag, and the canonical tag on:
  - `/`
  - `/reading`
  - `/reading/in-their-own-words`
  - `/reading/valuation`
  - `/reading/mental-models`
  - `/investor/warren-buffett`
  - `/learn/what-is-alpha`
  - `/ticker/AAPL`
- `robots.txt`: byte-identical.
- Sitemap URL set: identical.
- Disclosures and analytics snippets: not edited.
- No prices were added. The book cards still have no live price, so they keep "See price on Amazon".

## Screenshots

Playwright (`playwright-core`, installed in a scratch folder, not in `package.json`) drove the pre-installed Chromium against the built `out/`, served locally. The cookie banner was dismissed.

- **Full-page shots** at 375px and 390px are in `review/r2/`. They cover:
  - `/reading/`
  - `/reading/in-their-own-words/`
  - `/reading/mental-models/`
  - `/reading/valuation/`
  - `/reading/foundations/`
  - `/investor/warren-buffett/`
  - `/investor/joel-greenblatt/`
  - `/learn/what-is-alpha/`
- **Close crops of the changed parts** are in `review/r2/sections/`:
  - the reading-order table
  - the cards with investor links
  - the book widget on Buffett's profile
  - In the crops, the site's sticky header sits over the top of the element. That comes from how element screenshots scroll, not from the layout.
- **Horizontal scroll:** none on any of these pages at either width.
- **Small links:** the checker found two links under 44px on `/investor/joel-greenblatt/` ("See all 29 investors ranked by portfolio similarity" at 40px and "See all embed widgets" at 32px). Both are older than this round and outside its scope.

## Skipped, and why

- **Moving the book cards above the Audible box on topic pages.** That would put the books closer to the top, but the Audible block was placed there on purpose. The jump links solve the distance problem without moving an affiliate block.
- **Linking table titles straight to Amazon.** That would add new affiliate links and change click attribution. In-page jumps keep every affiliate link exactly as it was.
- **Links for books *about* an investor** (for example *The Snowball* → Buffett, or *The Big Short* → Burry). Only authorship is matched, because the data states it. Associations by subject are an editorial call.
- **The two small links on the investor page** noted above.

## What a human must check before this goes live

1. **Build with the real env file** and confirm `npm run build` exits 0 (`predeploy-guard`).
2. **Read the new copy** on `/reading/in-their-own-words` (h1, description, intro) and `/reading/valuation` (description, intro).
3. **The investor links** on the "In their own words" and "Mental models" shelves. Confirm you are happy linking these books to the six profiles: Buffett, Greenblatt, Einhorn, Marks, Pabrai, Klarman.
4. **The widget change is sitewide** (about 170 templates): SVG arrows, a taller Audible button and reading-list link, and a small gap under the disclosure. Spot-check one ticker or signal page on a phone.
5. **Merge order.** This branch includes round 1's growth branch. If `cloud/growth-holdlens-2026-09-30` is merged separately first, this branch's diff shrinks to the round-2 commits only.
