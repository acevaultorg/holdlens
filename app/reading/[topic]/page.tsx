import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareStrip from "@/components/ShareStrip";
import ReadingFaq from "@/components/ReadingFaq";
import ArrowIcon from "@/components/ArrowIcon";
import { trackedAuthorOf } from "@/lib/book-authors";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import {
  GROUP_META,
  groupMetaBySlug,
  booksInGroup,
  resolveAmazonUrl,
  AUDIBLE_URL,
} from "@/data/books";

// /reading/[topic] — one curated "books about X" shelf per BookGroup. Each is an
// indexable ACQUISITION surface (ranks for "best value investing books", "best
// valuation books", "behavioral finance books for investors", …) that links back
// into the /reading hub, its sibling shelves, and the /investor entity pages.
// Amazon Associates only, editorial framing (YMYL-safe), static export, zero JS.

const LAST_VERIFIED = "2026-07-14";

export function generateStaticParams() {
  return GROUP_META.map((g) => ({ topic: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const meta = groupMetaBySlug(topic);
  if (!meta) return {};
  const canonical = `https://holdlens.com/reading/${meta.slug}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      images: [
        { url: "/og/home.png", width: 1200, height: 630, alt: meta.h1 },
      ],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ShelfPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const meta = groupMetaBySlug(topic);
  if (!meta) notFound();

  const books = booksInGroup(meta.group);
  const canonical = `https://holdlens.com/reading/${meta.slug}`;
  const others = GROUP_META.filter((g) => g.slug !== meta.slug);
  const first = books[0]!;
  const then = books.slice(1, 3).map((b) => b.title);
  const thenText = then.length === 2 ? `${then[0]} and ${then[1]}` : then.join("");
  const faq = [
    {
      q: meta.question,
      text: `Start with ${first.title} by ${first.author}. ${first.why}${
        thenText ? ` Then read ${thenText}.` : ""
      }`,
      answer: (
        <p>
          Start with {first.title} by {first.author}. {first.why}
          {thenText ? ` Then read ${thenText}.` : ""}
        </p>
      ),
    },
    {
      q: `Which books are on this list, and in what order?`,
      text: `${books.length} books, in the order we'd read them: ${books
        .map((b) => `${b.title} (${b.author})`)
        .join("; ")}.`,
      answer: (
        <p>
          {books.length} books, in the order we&apos;d read them — see the table at the top of this
          page. The{" "}
          <Link href="/reading" className="text-brand hover:underline">
            full reading list
          </Link>{" "}
          has {GROUP_META.length - 1} more topics.
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

  const ITEMLIST_JSONLD = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: meta.h1,
    url: canonical,
    description: meta.description,
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    dateModified: LAST_VERIFIED,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: books.map((b, i) => ({
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
      { "@type": "ListItem", position: 2, name: "Reading list", item: "https://holdlens.com/reading" },
      { "@type": "ListItem", position: 3, name: meta.group, item: canonical },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto px-8 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEMLIST_JSONLD) }}
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
        <Link href="/reading" className="hover:text-brand">
          Reading list
        </Link>
        <span className="mx-1.5" aria-hidden>
          /
        </span>
        <span className="text-muted">{meta.group}</span>
      </nav>

      {/* Hero */}
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Reading list · {meta.group} · Updated {LAST_VERIFIED}
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
        {meta.h1}
      </h1>
      <p className="text-base sm:text-lg text-text leading-relaxed mb-6">
        Start with <strong>{first.title}</strong> by {first.author}. {first.why}
      </p>

      <section aria-labelledby="shelf-order" className="mb-8">
        <h2 id="shelf-order" className="text-base font-semibold mb-1">
          The {books.length} books, in reading order
        </h2>
        <p className="text-sm text-dim mb-3">Tap a title to jump to it below.</p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-panel text-left text-dim">
              <tr>
                <th scope="col" className="px-3 py-2.5 font-semibold w-10">#</th>
                <th scope="col" className="px-3 py-2.5 font-semibold">Book</th>
                <th scope="col" className="px-3 py-2.5 font-semibold">Author</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b, i) => (
                <tr key={b.title} className="border-t border-border align-top">
                  <td className="px-3 py-2.5 tabular-nums text-dim">{i + 1}</td>
                  <td className="p-0">
                    <a
                      href={`#book-${i + 1}`}
                      className="block min-h-[44px] px-3 py-2.5 text-text hover:text-brand hover:underline"
                    >
                      {b.title}
                    </a>
                  </td>
                  <td className="px-3 py-2.5 text-muted">{b.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {meta.intro.map((p, i) => (
        <p
          key={i}
          className={`text-base sm:text-lg text-muted leading-relaxed ${
            i === meta.intro.length - 1 ? "mb-8" : "mb-4"
          }`}
        >
          {p}
        </p>
      ))}

      <ShareStrip title={meta.title} url={canonical} via="holdlens" />

      {/* Audible bounty — the highest-$ affiliate action, honest framing */}
      <div className="my-8 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5">
        <div className="text-sm font-semibold text-text mb-1">Prefer to listen?</div>
        <p className="text-[13px] text-muted leading-relaxed mb-3">
          Most of these have strong audiobook editions, and a free Audible trial covers many of them —
          a low-friction way to get through the shelf on a commute.
        </p>
        <a
          href={AUDIBLE_URL}
          target="_blank"
          rel="noopener sponsored nofollow"
          data-event-from={`shelf-${meta.slug}-audible`}
          className={`plausible-event-name=Audible+Click plausible-event-from=shelf-${meta.slug} inline-flex min-h-[44px] w-fit items-center gap-2 rounded-lg border border-amber-500/60 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-text hover:bg-amber-500/20 transition`}
        >
          Start a free 30-day Audible trial
          <ArrowIcon />
        </a>
        <p className="mt-2 text-[11px] text-dim">
          New Audible members only · cancel anytime · many titles included with membership.
        </p>
      </div>

      {/* The shelf */}
      <section className="mb-10">
        <div className="grid gap-3 sm:grid-cols-2">
          {books.map((b, i) => {
            const { url, resolution } = resolveAmazonUrl(b);
            const tracked = trackedAuthorOf(b);
            return (
              <div key={b.title} id={`book-${i + 1}`} className="flex scroll-mt-24 flex-col">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener sponsored nofollow"
                  data-event-from={`shelf-${meta.slug}`}
                  className={`plausible-event-name=Book+Click plausible-event-title=${encodeURIComponent(
                    b.title,
                  )} plausible-event-resolution=${resolution} plausible-event-from=shelf-${meta.slug} block rounded-xl border border-border bg-bg/50 p-4 hover:border-brand/40 transition group`}
                >
                  <div className="text-[10px] uppercase tracking-widest text-dim font-semibold mb-1">
                    {b.author}
                  </div>
                  <div className="font-semibold text-text group-hover:text-brand transition mb-1.5">
                    {b.title}
                  </div>
                  <div className="text-[12px] text-muted leading-relaxed">{b.why}</div>
                  <div className="text-[11px] text-dim mt-2">
                    See price on Amazon <ArrowIcon />
                  </div>
                </a>
                {tracked && (
                  <Link
                    href={`/investor/${tracked.slug}`}
                    className="inline-flex min-h-[44px] w-fit items-center gap-1.5 px-1 text-[13px] text-muted hover:text-brand hover:underline"
                  >
                    See {tracked.name}&apos;s latest 13F holdings <ArrowIcon />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Sibling shelves — internal-link the whole /reading cluster */}
      <section className="mb-10">
        <h2 className="text-lg md:text-xl font-bold mb-2">More reading lists</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          This is one shelf of the full{" "}
          <Link href="/reading" className="text-brand hover:underline">
            value investor&apos;s reading list
          </Link>
          . The others:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {others.map((g) => (
            <Link
              key={g.slug}
              href={`/reading/${g.slug}`}
              className="block rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition group"
            >
              <div className="font-semibold text-text group-hover:text-brand transition">
                {g.group}
              </div>
              <div className="text-[12px] text-dim mt-0.5">
                {g.h1} <ArrowIcon />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ReadingFaq items={faq} />

      {/* FTC disclosure */}
      <p className="text-[11px] text-dim leading-relaxed border-t border-border pt-6">
        Amazon affiliate links — as an Amazon Associate, HoldLens earns from qualifying purchases and
        membership trials at no extra cost to you. These are books we genuinely recommend, chosen on
        merit, never paid placements. Nothing here is investment advice — always do your own research.
      </p>
    </article>
  );
}
