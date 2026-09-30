# Growth sweep, second pass: more visitors from search and AI assistants

Branch: `cloud/growth-holdlens-2026-09-30`. Nothing is merged or deployed.

## The three changes, and why these three

HoldLens earns from Amazon book clicks. Nearly all of those clicks happen on the
`/reading` hub, its six topic pages, and the book widget (`InvestingBooks`) that
appears on about 170 page templates. The topic pages were the weakest link. They
had good editorial copy, but:

- they didn't answer the question people actually type, like "what is the best
  value investing book to start with?"
- they had no FAQ or FAQPage markup
- only the hub and the homepage linked to them
- `/llms.txt` never mentioned them, so AI assistants had no summary of the reading list

### 1. The reading pages now answer the question directly (hub + 6 topic pages)

- **A direct answer in the first paragraph.** The hub opens with "If you read one
  investing book, make it The Intelligent Investor by Benjamin Graham…", then says
  what to read next and how big the list is. Each topic page opens with "Start with X by Y"
  plus that book's one-line reason.
- **Comparison tables.**
  - Hub: "The list at a glance", with each topic, its book count and where to start.
  - Topic pages: "The N books, in reading order", with each book and its author.
- **Visible "Common questions" plus matching FAQPage JSON-LD.**
  - Hub: best beginner book; which books were written by investors HoldLens tracks
    (each links to that investor's profile); what to read to understand Buffett; best
    valuation book; whether HoldLens earns from the links.
  - Each topic page: that topic's "where to start" question, the list in order, and the
    affiliate question.
- **Better hub title and meta description.**
  - Old title: "The Value Investor's Reading List — the books behind every 13F"
  - New title: "Best Value Investing Books: 42 Classics by Topic"
  - The new description names the start-here books.
- **Book JSON-LD now carries `isbn`** for the 6 books whose ISBN is already verified in
  `data/books.ts`. Books without a verified ISBN get nothing.

**Every answer is computed from `data/books.ts`.** It uses titles, authors, the existing
one-line "why" text, shelf order, `booksForInvestor`, and `MANAGERS` names. The
"written by an investor we track" list matches each manager's first and last name
against the book's author field, so it cannot claim authorship the data doesn't show.
No new books, facts, ratings, reviews or prices were added.

### 2. Internal links from the strong pages into the topic pages

`InvestingBooks` is on investor, ticker, signal, learn and other high-traffic
templates. It now adds a "More by topic:" row that links to the `/reading/[topic]`
pages of the books it shows. On Buffett's profile, for example, it links Foundations,
In their own words, and Macro & memoirs.

Before this, the six topic pages were linked only from `/reading` and the homepage.
Now thousands of crawlable pages point at them. Each link is a 44px tap target.

### 3. `/llms.txt` now covers the reading list

There is a new "Investing reading list (books)" section. It gives the hub, and for each
of the six topics its URL, book count and first book. It also lists the books on the
list that tracked managers wrote. It states plainly that book links go to Amazon and
that HoldLens is an Amazon Associate. Every count and title was checked against the
built pages.

### Also changed, per the session rules

In the book cards on these pages and in the widget, the button now reads
**"See price on Amazon"** instead of "View on Amazon", because these cards never show
a live price. The Amili kit top card on the homepage has its own label logic and was
not touched.

## Files touched

- `data/books.ts`: new `question` field on each topic (`GROUP_META`)
- `components/ReadingFaq.tsx` (new): visible FAQ plus FAQPage JSON-LD from the same items
- `app/reading/page.tsx`: direct answer, topic table, FAQ, title and description, `isbn` in JSON-LD, button label
- `app/reading/[topic]/page.tsx`: direct answer, reading-order table, FAQ, `isbn` in JSON-LD, button label
- `components/InvestingBooks.tsx`: "More by topic" links, button label
- `public/llms.txt`: reading-list section
- `review/*.png`: screenshots
- `SUMMARY.md`

## Not changed (checked in the built output)

- **Affiliate links:** the `/go/` links are identical before and after on `/reading`,
  `/reading/valuation`, `/investor/warren-buffett`, `/learn/what-is-alpha` and `/`.
  No tags, disclosures or analytics snippets were changed.
- **Canonicals:** identical.
- **robots.txt:** byte-identical. AI crawlers were already allowed.
- **sitemap.xml and sitemap-ai.xml:** the same URL sets. Only the build timestamps in
  `lastmod` differ, which happens on every build.
- **Build scripts and sitemap logic:** untouched. `data/page-lastmod.json`, which the
  build rewrites, was reverted and not committed.

## Build and page counts

| | before (main) | after (this branch) |
|---|---|---|
| `.html` pages in `out/` | 22,291 | 22,291 |
| `npm run build` exit code | 1 | 1 (see below) |

No pages were added or removed, and the list of page paths is identical.

**Why the exit code is 1 on both:** `next build` and every postbuild check pass,
including broken links, inline-script parsing, and the perf budget for all 22,291
pages. The last step, `scripts/predeploy-guard.mjs`, then refuses with "GA4 ID
unresolvable". That happens because this fresh clone has no `.env.production.local` /
`.env.local`; those untracked files hold the analytics IDs. It fails the same way on
main. I did not fake the IDs to force a 0.

`npx tsc --noEmit` shows no errors in the touched files. The only errors are
pre-existing ones in `lib/kit/amazon-ad.ts`, which I did not touch.

## Screenshots

These are in `review/`, full page, at 375px and 390px wide. Playwright ran against the
pre-installed Chromium, with the built `out/` served locally. None of these pages
scroll sideways at either width.

- `/reading/`
- all six `/reading/<topic>/` pages
- `/investor/warren-buffett/` and `/learn/what-is-alpha/`: examples of the book widget
- `/`: homepage, which also carries the widget

The widget appears on thousands of pages, so these are examples, not every page. The
cookie banner and the sticky header appear in the full-page shots because the
screenshots start from a fresh visit.

## Skipped, and why

- **Adding `/reading` to `sitemap-ai.xml`.** This would help AI crawlers find it first,
  but the session rules say to keep sitemap logic exactly as it is. It is a one-line
  pattern in `scripts/generate-sitemap-ai.mjs` if you want it.
- **Price-aware "View on Amazon" in the book cards.** The book data holds no prices, and
  I didn't wire live prices from the kit into these cards.
- **Product JSON-LD.** Without real prices or ratings in the repo, Product markup would
  be empty or invented. The pages use `Book` inside an `ItemList`.

## What a human should check before this goes live

1. **Build with the real env file** (`.env.production.local`) and confirm the predeploy
   guard passes.
2. **Read the new visible copy on `/reading` and one topic page:**
   - "The list at a glance" table
   - the "Common questions" block
   - on "Macro & memoirs", the first answer to "What is the best book on market
     history and financial crashes?" is "Start with The Big Short", because it is first
     in reading order. Reorder the shelf in `data/books.ts` if you'd rather lead with
     another book.
3. **The Buffett answer** lists what `INVESTOR_BOOKS["warren-buffett"]` holds:
   - The Essays of Warren Buffett
   - The Snowball
   - The Intelligent Investor
   - Common Stocks and Uncommon Profits
4. **The label change to "See price on Amazon"** affects every book card sitewide.
   Confirm that is what you want.
5. **Run the Rich Results Test** on `/reading` for FAQPage and ItemList once it is deployed.
