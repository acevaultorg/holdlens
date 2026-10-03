// InvestingBooks — affiliate book-recommendation widget (Amazon Associates).
//
// Renders on high-intent editorial surfaces (/learn/* essays, /methodology, and
// the per-investor "books behind this manager" block). Data + link resolution +
// the Audible bounty live in the shared source `@/data/books` so this component
// and app/reading/page.tsx stay in sync (one canon, one resolver).
//
// Placement is EDITORIAL, YMYL-safe (Pivot A): books are framed as "recommended
// reading," never as transact-now CTAs adjacent to a ConvictionScore.
//
// Compliance: rel="noopener sponsored nofollow" on every link · inline FTC
// disclosure below · no price display · Amazon tag via NEXT_PUBLIC_AMAZON_
// AFFILIATE_TAG (default holdlens-20, this site's own registered tracking ID).
// Search links are department-pinned (i=stripbooks) in resolveAmazonUrl.
// Server component — zero JS, no CLS.
//
// Props:
//   slug        — a manager slug → renders THAT manager's curated books
//                 (booksForInvestor). Overrides the default set.
//   books       — an explicit Book[] (wins over slug).
//   showAudible — render the Audible free-trial bounty CTA (default true).
//   moreHref    — "see the full reading list" link target (default /reading).

import {
  type Book,
  coreCanonBooks,
  booksForInvestor,
  resolveAmazonUrl,
  AUDIBLE_URL,
  GROUP_META,
} from "@/data/books";
import ArrowIcon from "@/components/ArrowIcon";

export default function InvestingBooks({
  heading = "Recommended reading",
  sub = "The books that map the mental model behind every 13F on this site.",
  slug,
  books,
  showAudible = true,
  moreHref = "/reading",
  limit,
}: {
  heading?: string;
  sub?: string;
  slug?: string;
  books?: Book[];
  showAudible?: boolean;
  moreHref?: string | null;
  limit?: number;
}) {
  const set: Book[] = (books ?? (slug ? booksForInvestor(slug) : coreCanonBooks())).slice(0, limit);
  if (set.length === 0) return null;
  // The topic shelves the shown books belong to — gives every page carrying this
  // widget a crawlable path into the matching /reading/[slug] shelf.
  const shelves = GROUP_META.filter((g) => set.some((b) => b.group === g.group));

  return (
    <section className="my-12 rounded-2xl border border-border bg-panel p-6 md:p-8">
      <div className="text-[11px] uppercase tracking-widest text-brand font-semibold mb-2">
        Deep dive
      </div>
      <h2 className="text-xl md:text-2xl font-bold mb-2">{heading}</h2>
      <p className="text-sm text-muted mb-6">{sub}</p>

      <p className="text-[11px] text-dim mt-5 mb-4 leading-relaxed">
        Amazon affiliate links — as an Amazon Associate, HoldLens earns from qualifying purchases and
        membership trials at no extra cost to you. These are books we genuinely recommend. Not investment
        advice; always do your own research.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {set.map((b) => {
          const { url, resolution } = resolveAmazonUrl(b);
          return (
            <a
              key={b.title}
              href={url}
              target="_blank"
              rel="noopener sponsored nofollow"
              data-event-from="investing-books"
              // Plausible tagged-event: Book Click with title + resolution props.
              // Outbound-links script also fires "Outbound Link: Click".
              className={`plausible-event-name=Book+Click plausible-event-title=${encodeURIComponent(
                b.title,
              )} plausible-event-resolution=${resolution} block rounded-xl border border-border bg-bg/50 p-4 hover:border-brand/40 transition group`}
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
          );
        })}
      </div>

      {showAudible && (
        <div className="mt-5 flex flex-col gap-1.5">
          <a
            href={AUDIBLE_URL}
            target="_blank"
            rel="noopener sponsored nofollow"
            data-event-from="investing-books-audible"
            className="plausible-event-name=Audible+Click plausible-event-from=investing-books inline-flex min-h-[44px] w-fit items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/5 px-4 py-2 text-sm font-semibold text-text hover:bg-amber-500/10 hover:border-amber-500/70 transition"
          >
            Prefer to listen? Start a free Audible trial
            <ArrowIcon className="text-dim" />
          </a>
          <p className="text-[11px] text-dim">
            Eligible new members may be offered a free trial; current terms are on the Audible page · many of these titles are included with membership.
          </p>
        </div>
      )}

      {moreHref && (
        <div className="mt-5">
          <a
            href={moreHref}
            className="plausible-event-name=Reading+Hub+Link inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            See the full investing reading list <ArrowIcon />
          </a>
          {shelves.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center gap-x-4 text-sm text-dim">
              <span className="basis-full">More by topic:</span>
              {shelves.map((g) => (
                <a
                  key={g.slug}
                  href={`/reading/${g.slug}`}
                  className="inline-flex min-h-[44px] items-center text-muted hover:text-brand hover:underline"
                >
                  {g.group}
                </a>
              ))}
            </div>
          )}
        </div>
      )}


    </section>
  );
}
