import type { Metadata } from "next";
import Link from "next/link";
import ShareStrip from "@/components/ShareStrip";
import ReadingFaq, { type FaqItem } from "@/components/ReadingFaq";
import { MANAGERS } from "@/lib/managers";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import {
  BOOKS,
  BOOK_GROUPS,
  GROUP_META,
  resolveAmazonUrl,
  AUDIBLE_URL,
  booksInGroup,
  booksForInvestor,
  type Book,
} from "@/data/books";

// /reading — the curated value-investing reading list. The site's canonical
// book hub: an ACQUISITION page (ranks for "best value investing books",
// "books Warren Buffett recommends", "how to read 13F filings books") AND the
// CONVERSION target every /learn essay + /investor page links to. Amazon
// Associates only. Editorial framing (YMYL-safe). Static export, zero external
// images (text cards keep CWV perfect), zero JS.

const CANONICAL = "https://holdlens.com/reading";
const LAST_VERIFIED = "2026-07-03";

// Everything the page says about "where to start" comes from the canon order in
// data/books.ts: the first book of a shelf is the one we'd hand a new reader.
const FIRST = booksInGroup("Foundations")[0]!;
const NEXT = booksInGroup("Foundations").slice(1, 3);
const VALUATION_FIRST = booksInGroup("Valuation")[0]!;
const BUFFETT_BOOKS = booksForInvestor("warren-buffett");

// Books on the list written by a manager whose 13F we track — matched on the
// author field (first + last name as whole words), so it can't claim authorship
// the data doesn't show. Whole words matter for short names: "Li Lu" must not
// match an author who merely contains the letters "li" and "lu".
const words = (s: string) => new Set(s.split(/[^\p{L}]+/u).filter(Boolean));
const BY_TRACKED_MANAGER: { slug: string; name: string; books: Book[] }[] = MANAGERS.map((m) => {
  const parts = m.name.split(" ");
  const first = parts[0]!;
  const last = parts[parts.length - 1]!;
  return {
    slug: m.slug,
    name: m.name,
    books: BOOKS.filter((b) => {
      const w = words(b.author);
      return w.has(first) && w.has(last);
    }),
  };
}).filter((x) => x.books.length > 0);

const joinTitles = (bs: Book[]) => {
  const t = bs.map((b) => b.title);
  return t.length <= 1 ? t.join("") : `${t.slice(0, -1).join(", ")} and ${t[t.length - 1]}`;
};

export const metadata: Metadata = {
  title: `Best Value Investing Books: ${BOOKS.length} Classics by Topic`,
  description: `Where to start with value investing books: ${FIRST.title} first, then ${joinTitles(
    NEXT,
  )}. ${BOOKS.length} books in ${GROUP_META.length} topics, from Buffett's letters and Howard Marks to Damodaran on valuation.`,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "The Value Investor's Reading List",
    description:
      "The value-investing canon + the books the superinvestors on this site wrote or live by. Curated, no fluff.",
    type: "website",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "HoldLens — the value investor's reading list",
      },
    ],
  },
  robots: { index: true, follow: true },
};

const COLLECTION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "The Value Investor's Reading List",
  url: CANONICAL,
  description:
    "A curated reading list of value-investing and mental-model classics for readers who track 13F filings and superinvestors.",
  author: AUTHOR_SCHEMA,
  publisher: PUBLISHER_REF,
  dateModified: LAST_VERIFIED,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: BOOKS.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Book",
        name: b.title,
        author: { "@type": "Person", name: b.author },
        ...(b.isbn13 ? { isbn: b.isbn13 } : {}),
      },
    })),
  },
};

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com/" },
    { "@type": "ListItem", position: 2, name: "Reading list", item: CANONICAL },
  ],
};

// Managers on this site whose own/defining book is on the list — cross-links the
// hub back into the /investor entity pages (acquisition → conversion loop).
const FEATURED_INVESTORS: { slug: string; name: string; book: string }[] = [
  { slug: "warren-buffett", name: "Warren Buffett", book: "The Essays of Warren Buffett" },
  { slug: "seth-klarman", name: "Seth Klarman", book: "Margin of Safety" },
  { slug: "howard-marks", name: "Howard Marks", book: "The Most Important Thing" },
  { slug: "joel-greenblatt", name: "Joel Greenblatt", book: "The Little Book That Beats the Market" },
  { slug: "michael-burry", name: "Michael Burry", book: "The Big Short" },
  { slug: "monish-pabrai", name: "Mohnish Pabrai", book: "The Dhandho Investor" },
];

const FAQ: FaqItem[] = [
  {
    q: "What is the best book on value investing for a beginner?",
    text: `Start with ${FIRST.title} by ${FIRST.author}. ${FIRST.why} After it, read ${joinTitles(NEXT)}.`,
    answer: (
      <p>
        Start with {FIRST.title} by {FIRST.author}. {FIRST.why} After it, read {joinTitles(NEXT)}{" "}
        — the rest of the{" "}
        <Link href="/reading/foundations" className="text-brand hover:underline">
          foundations shelf
        </Link>{" "}
        is in the order we&apos;d read it.
      </p>
    ),
  },
  {
    q: "Which of these books were written by investors HoldLens tracks?",
    text: `${BY_TRACKED_MANAGER.map((x) => `${x.name} wrote ${joinTitles(x.books)}`).join("; ")}. Each has a profile on HoldLens with their latest 13F holdings.`,
    answer: (
      <>
        <ul className="divide-y divide-border">
          {BY_TRACKED_MANAGER.map((x) => (
            <li key={x.slug}>
              <Link
                href={`/investor/${x.slug}`}
                className="flex min-h-[44px] flex-col justify-center py-2 group"
              >
                <span className="text-brand group-hover:underline">{x.name}</span>
                <span className="text-dim">{joinTitles(x.books)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-2">Each profile shows that investor&apos;s latest 13F holdings.</p>
      </>
    ),
  },
  {
    q: "What should I read to understand Warren Buffett?",
    text: `On this list: ${joinTitles(BUFFETT_BOOKS)}. The complete Berkshire Hathaway shareholder letters are on the list too.`,
    answer: (
      <p>
        On this list: {joinTitles(BUFFETT_BOOKS)}. The complete Berkshire Hathaway shareholder
        letters are on the list too, and{" "}
        <Link href="/investor/warren-buffett" className="text-brand hover:underline">
          Berkshire&apos;s latest 13F holdings
        </Link>{" "}
        are on HoldLens.
      </p>
    ),
  },
  {
    q: "What is the best book on how to value a stock?",
    text: `Start with ${VALUATION_FIRST.title} by ${VALUATION_FIRST.author}. ${VALUATION_FIRST.why}`,
    answer: (
      <p>
        Start with {VALUATION_FIRST.title} by {VALUATION_FIRST.author}. {VALUATION_FIRST.why} The{" "}
        <Link href="/reading/valuation" className="text-brand hover:underline">
          valuation shelf
        </Link>{" "}
        has the rest, from plain-language guides to the professional texts.
      </p>
    ),
  },
  {
    q: "Does HoldLens earn money from these book links?",
    text: "Yes. The book links go to Amazon, and as an Amazon Associate HoldLens earns from qualifying purchases at no extra cost to you. Books are chosen on merit, never paid placements.",
    answer: (
      <p>
        Yes. The book links go to Amazon, and as an Amazon Associate HoldLens earns from qualifying
        purchases at no extra cost to you. Books are chosen on merit, never paid placements.
      </p>
    ),
  },
];

export default function ReadingListPage() {
  return (
    <article className="max-w-3xl mx-auto px-8 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-dim mb-6">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-1.5" aria-hidden>
          /
        </span>
        <span className="text-muted">Reading list</span>
      </nav>

      {/* Hero */}
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Reading list · Updated {LAST_VERIFIED}
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
        The value investor&apos;s reading list.
      </h1>
      <p className="text-base sm:text-lg text-text leading-relaxed mb-4">
        If you read one investing book, make it <strong>{FIRST.title}</strong> by {FIRST.author}.{" "}
        {FIRST.why} After it, read {joinTitles(NEXT)}. The full list below holds {BOOKS.length}{" "}
        books in {GROUP_META.length} topics, each in the order we&apos;d read them.
      </p>
      <p className="text-base sm:text-lg text-muted leading-relaxed mb-4">
        Every 13F on this site is downstream of a way of thinking. These are the books that map it —
        the value-investing canon, the mental-model classics, and the books the managers we track
        actually wrote or live by. It&apos;s the reading behind the{" "}
        <Link href="/learn/superinvestor-handbook" className="text-brand hover:underline">
          Superinvestor Handbook
        </Link>{" "}
        and the{" "}
        <Link href="/methodology" className="text-brand hover:underline">
          ConvictionScore methodology
        </Link>
        .
      </p>
      <p className="text-sm text-dim leading-relaxed mb-8">
        Curated, not exhaustive — the shortlist we&apos;d hand a serious investor, not a padded
        top-100. Start at the top of Foundations and work down.
      </p>

      <ShareStrip
        title="The Value Investor's Reading List — the books behind every 13F"
        url={CANONICAL}
        via="holdlens"
      />

      {/* Browse by topic — the shelf cluster (each is its own indexable page) */}
      <nav aria-label="Reading list topics" className="my-8">
        <div className="text-xs uppercase tracking-widest text-dim font-semibold mb-3">
          Browse by topic
        </div>
        <div className="flex flex-wrap gap-2">
          {GROUP_META.map((g) => (
            <Link
              key={g.slug}
              href={`/reading/${g.slug}`}
              className="inline-flex items-center rounded-lg border border-border bg-panel px-3 py-1.5 text-sm text-muted hover:border-brand/40 hover:text-brand transition"
            >
              {g.group}
            </Link>
          ))}
        </div>
      </nav>

      {/* At a glance — one row per shelf, answering "where do I start?" */}
      <section aria-labelledby="reading-glance" className="my-8">
        <h2 id="reading-glance" className="text-lg md:text-xl font-bold mb-3">
          The list at a glance
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-panel text-left text-dim">
              <tr>
                <th scope="col" className="px-3 py-2.5 font-semibold">Topic</th>
                <th scope="col" className="px-3 py-2.5 font-semibold text-right">Books</th>
                <th scope="col" className="px-3 py-2.5 font-semibold">Start with</th>
              </tr>
            </thead>
            <tbody>
              {GROUP_META.map((g) => {
                const shelf = booksInGroup(g.group);
                return (
                  <tr key={g.slug} className="border-t border-border align-top">
                    <td className="px-3 py-1">
                      <Link
                        href={`/reading/${g.slug}`}
                        className="inline-flex min-h-[44px] items-center text-brand hover:underline"
                      >
                        {g.group}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">{shelf.length}</td>
                    <td className="px-3 py-3 text-muted">
                      {shelf[0]?.title}
                      <span className="block text-[12px] text-dim">{shelf[0]?.author}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Audible bounty — prominent, honest. The highest-$ affiliate action, so
          it earns its place near the top; framed as an option, not a demand. */}
      <div className="my-8 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5">
        <div className="text-sm font-semibold text-text mb-1">Prefer to listen?</div>
        <p className="text-[13px] text-muted leading-relaxed mb-3">
          Most of these have strong audiobook editions. A free Audible trial covers many of them —
          a low-friction way to start (Poor Charlie&apos;s Almanack, The Snowball, and The Big Short
          all read especially well).
        </p>
        <a
          href={AUDIBLE_URL}
          target="_blank"
          rel="noopener sponsored nofollow"
          data-event-from="reading-hub-audible"
          className="plausible-event-name=Audible+Click plausible-event-from=reading-hub inline-flex w-fit items-center gap-2 rounded-lg border border-amber-500/60 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-text hover:bg-amber-500/20 transition"
        >
          Start a free 30-day Audible trial
          <span aria-hidden>→</span>
        </a>
        <p className="mt-2 text-[11px] text-dim">
          New Audible members only · cancel anytime · many assigned titles included with membership.
        </p>
      </div>

      {/* Grouped book list */}
      {BOOK_GROUPS.map((group) => {
        const groupBooks = BOOKS.filter((b) => b.group === group);
        if (groupBooks.length === 0) return null;
        const shelf = GROUP_META.find((g) => g.group === group);
        return (
          <section key={group} className="mb-10">
            <div className="flex items-baseline justify-between gap-3 mb-4 pb-2 border-b border-border">
              <h2 className="text-lg md:text-xl font-bold">
                {shelf ? (
                  <Link href={`/reading/${shelf.slug}`} className="hover:text-brand transition">
                    {group}
                  </Link>
                ) : (
                  group
                )}
              </h2>
              {shelf && (
                <Link
                  href={`/reading/${shelf.slug}`}
                  className="shrink-0 text-xs text-dim hover:text-brand transition"
                >
                  See all →
                </Link>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {groupBooks.map((b) => {
                const { url, resolution } = resolveAmazonUrl(b);
                return (
                  <a
                    key={b.title}
                    href={url}
                    target="_blank"
                    rel="noopener sponsored nofollow"
                    data-event-from="reading-hub"
                    className={`plausible-event-name=Book+Click plausible-event-title=${encodeURIComponent(
                      b.title,
                    )} plausible-event-resolution=${resolution} plausible-event-from=reading-hub block rounded-xl border border-border bg-bg/50 p-4 hover:border-brand/40 transition group`}
                  >
                    <div className="text-[10px] uppercase tracking-widest text-dim font-semibold mb-1">
                      {b.author}
                    </div>
                    <div className="font-semibold text-text group-hover:text-brand transition mb-1.5">
                      {b.title}
                    </div>
                    <div className="text-[12px] text-muted leading-relaxed">{b.why}</div>
                    <div className="text-[11px] text-dim mt-2">See price on Amazon →</div>
                  </a>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Cross-link into the investor entity pages */}
      <section className="mb-10">
        <h2 className="text-lg md:text-xl font-bold mb-2">Whose books?</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          Several of these were written by — or are about — managers we track. Each profile shows
          their live 13F holdings alongside the reading behind their thinking.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {FEATURED_INVESTORS.map((inv) => (
            <Link
              key={inv.slug}
              href={`/investor/${inv.slug}`}
              className="block rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition group"
            >
              <div className="font-semibold text-text group-hover:text-brand transition">
                {inv.name}
              </div>
              <div className="text-[12px] text-dim mt-0.5">{inv.book} →</div>
            </Link>
          ))}
        </div>
      </section>

      <ReadingFaq items={FAQ} />

      {/* FTC disclosure */}
      <p className="text-[11px] text-dim leading-relaxed border-t border-border pt-6">
        Amazon affiliate links — as an Amazon Associate, HoldLens earns from qualifying purchases and
        membership trials at no extra cost to you. These are books we genuinely recommend, chosen on
        merit, never paid placements. Nothing here is investment advice — always do your own research.
      </p>
    </article>
  );
}
