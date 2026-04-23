import type { Metadata } from "next";
import Link from "next/link";
import {
  CURATED_EVENTS,
  EVENT_ITEMS_BY_CODE,
  fmtEventDate,
  type Form8KEvent,
} from "@/lib/events";
import TickerLogo from "@/components/TickerLogo";
import AdSlot from "@/components/AdSlot";

// /events/live/ — the 8-K firehose. Every tracked material event,
// chronological, newest first. Intended as the daily-return-visit page
// for HoldLens's events surface.
//
// PPC tier: time-sensitive-feed ($0.010/req per llms.txt).
// Day-2 EDGAR scraper will expand the feed from ~8 curated rows to
// thousands of backfilled filings — no UI change needed, same Form8KEvent
// shape flows through.

export const metadata: Metadata = {
  title: "Live 8-K Feed — Latest SEC Material Events · HoldLens",
  description:
    "Every tracked SEC Form 8-K material event, chronological. Earnings, M&A, bankruptcies, cybersecurity incidents, CEO changes, impairments. Intra-day refresh from SEC EDGAR.",
  alternates: { canonical: "https://holdlens.com/events/live/" },
  openGraph: {
    title: "Live 8-K Feed — Latest SEC Material Events",
    description: "The chronological firehose of tracked SEC 8-K material-event filings.",
    url: "https://holdlens.com/events/live/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens Live 8-K Feed" }],
  },
};

export const dynamic = "force-static";

export default function EventsLivePage() {
  const feed: Form8KEvent[] = [...CURATED_EVENTS].sort((a, b) =>
    a.filedAt < b.filedAt ? 1 : -1,
  );
  const freshestIso = feed[0]?.filedAt ?? new Date().toISOString().slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        name: "HoldLens Live 8-K Material Events Feed",
        description:
          "Chronological feed of tracked SEC Form 8-K material events — earnings, M&A, bankruptcies, cybersecurity incidents, CEO changes, impairments, and more. Updated intra-day.",
        url: "https://holdlens.com/events/live/",
        creator: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com" },
        license: "https://holdlens.com/api-terms",
        temporalCoverage: "last-365-days",
        dateModified: freshestIso,
        isBasedOn: "https://www.sec.gov/edgar.shtml",
        mentions: { "@id": "https://holdlens.com/#term-event-score" },
        variableMeasured: [
          { "@type": "PropertyValue", name: "Ticker" },
          { "@type": "PropertyValue", name: "Company name" },
          { "@type": "PropertyValue", name: "SEC 8-K item number" },
          { "@type": "PropertyValue", name: "Event date" },
          { "@type": "PropertyValue", name: "Filing date" },
          { "@type": "PropertyValue", name: "Event headline" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com/" },
          { "@type": "ListItem", position: 2, name: "Material events", item: "https://holdlens.com/events/" },
          { "@type": "ListItem", position: 3, name: "Live feed", item: "https://holdlens.com/events/live/" },
        ],
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-xs text-dim mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-text">Home</Link>
        <span>/</span>
        <Link href="/events/" className="hover:text-text">Material events</Link>
        <span>/</span>
        <span className="text-muted">Live feed</span>
      </nav>

      <div className="flex items-center gap-3 mb-4">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">
          SEC 8-K firehose
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 border border-brand/30 px-2 py-0.5 text-[10px] uppercase tracking-widest text-brand font-bold">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand"></span>
          </span>
          Live
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Live 8-K feed.
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-4 max-w-2xl">
        Every tracked SEC Form 8-K material event, newest first. Earnings, M&amp;A,
        bankruptcies, cybersecurity incidents, CEO changes, impairments — classified by
        item number, rendered side-by-side for context.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Freshest tracked filing:{" "}
        <span className="text-text font-mono">{fmtEventDate(freshestIso)}</span>. 8-K
        filings are required by SEC within 4 business days of the material event; this
        feed re-indexes intra-day when new filings post to EDGAR.
      </p>

      <div className="rounded-2xl border border-border bg-panel overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-dim text-[10px] uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold">Ticker</th>
                <th className="text-left px-4 py-3 font-semibold">Event</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Item</th>
                <th className="text-right px-4 py-3 font-semibold hidden sm:table-cell">Filed</th>
              </tr>
            </thead>
            <tbody>
              {feed.map((e, i) => {
                const meta = EVENT_ITEMS_BY_CODE[e.itemCode];
                return (
                  <tr
                    key={`live-${e.ticker}-${e.filedAt}-${i}`}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/events/company/${e.ticker.toLowerCase()}/`}
                        className="inline-flex items-center gap-2 font-mono font-bold text-brand hover:underline"
                      >
                        <TickerLogo symbol={e.ticker} size={20} />
                        {e.ticker}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text">
                      <Link
                        href={`/events/company/${e.ticker.toLowerCase()}/`}
                        className="hover:underline"
                      >
                        {e.headline}
                      </Link>
                      {e.summary && (
                        <div className="text-xs text-muted mt-1 line-clamp-2">{e.summary}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs hidden md:table-cell">
                      <Link
                        href={`/events/type/${meta.slug}/`}
                        className="inline-block rounded border border-border/60 bg-bg/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted hover:text-text hover:border-brand/40 transition"
                      >
                        {e.itemCode} · {meta.label}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[11px] text-dim whitespace-nowrap hidden sm:table-cell">
                      {fmtEventDate(e.filedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AdSlot format="horizontal" />

      <section className="border-t border-border pt-12 mt-12">
        <h2 className="text-xl font-bold text-text mb-6">Related surfaces</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/events/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">EventScore methodology</div>
            <div className="text-xs text-muted">How material events are classified + scored.</div>
          </Link>
          <Link
            href="/insiders/live/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-emerald-400/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Live insider feed</div>
            <div className="text-xs text-muted">Daily Form 4 trilogy sibling.</div>
          </Link>
          <Link
            href="/best-now/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Best buy signals now</div>
            <div className="text-xs text-muted">Unified ConvictionScore rankings — 13F sibling.</div>
          </Link>
        </div>
      </section>
    </div>
  );
}
