import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  EVENT_ITEMS,
  EVENT_ITEMS_BY_SLUG,
  fmtEventDate,
  getEventsForItemSlug,
} from "@/lib/events";
import TickerLogo from "@/components/TickerLogo";
import AdSlot from "@/components/AdSlot";

// /events/type/[item]/ — per-item-type pages. These are the high-intent
// GEO/SEO surfaces: "what companies had cybersecurity incidents 2025",
// "recent material agreement 8-K filings", "companies with bankruptcy
// filings", "CEO changes this quarter". Each page covers one SEC 8-K item
// number with every tracked company filing it.
//
// PPC tier: per-entity detail ($0.005/req per llms.txt).

type Props = { params: Promise<{ item: string }> };

export async function generateStaticParams() {
  return EVENT_ITEMS.map((i) => ({ item: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { item } = await params;
  const meta = EVENT_ITEMS_BY_SLUG[item];
  if (!meta) return { title: "Not found" };
  const count = getEventsForItemSlug(item).length;
  return {
    title: `${meta.label} — SEC 8-K Item ${meta.code} · HoldLens`,
    description: `${meta.label} (SEC Form 8-K Item ${meta.code}) — ${count} tracked filing${count === 1 ? "" : "s"} across HoldLens-covered companies. ${meta.description.split(".")[0]}.`,
    alternates: { canonical: `https://holdlens.com/events/type/${item}/` },
    openGraph: {
      title: `${meta.label} — SEC 8-K Item ${meta.code}`,
      description: meta.description.split(".")[0] + ".",
      url: `https://holdlens.com/events/type/${item}/`,
      type: "website",
      images: [{ url: "/og/home.png", width: 1200, height: 630, alt: meta.label }],
    },
  };
}

export const dynamic = "force-static";

export default async function EventsTypePage({ params }: Props) {
  const { item } = await params;
  const meta = EVENT_ITEMS_BY_SLUG[item];
  if (!meta) notFound();

  const events = getEventsForItemSlug(item);
  const distinctTickers = new Set(events.map((e) => e.ticker.toUpperCase())).size;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `https://holdlens.com/events/type/${item}/#term`,
        name: meta.label,
        alternateName: [`SEC 8-K Item ${meta.code}`, `Form 8-K ${meta.code}`],
        description: meta.description,
        inDefinedTermSet: "https://holdlens.com/#term-set",
        url: `https://holdlens.com/events/type/${item}/`,
      },
      {
        "@type": "Dataset",
        "@id": `https://holdlens.com/events/type/${item}/#dataset`,
        name: `${meta.label} — tracked SEC 8-K filings`,
        description: `Tracked SEC Form 8-K filings under Item ${meta.code} (${meta.label}) across HoldLens-covered companies. Each filing classified and factored into the per-company EventScore.`,
        url: `https://holdlens.com/events/type/${item}/`,
        creator: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com" },
        license: "https://holdlens.com/api-terms",
        isBasedOn: "https://www.sec.gov/edgar.shtml",
        mentions: [
          { "@id": "https://holdlens.com/#term-event-score" },
          { "@id": `https://holdlens.com/events/type/${item}/#term` },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com/" },
          { "@type": "ListItem", position: 2, name: "Material events", item: "https://holdlens.com/events/" },
          { "@type": "ListItem", position: 3, name: meta.label, item: `https://holdlens.com/events/type/${item}/` },
        ],
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-xs text-dim mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-text">Home</Link>
        <span>/</span>
        <Link href="/events/" className="hover:text-text">Material events</Link>
        <span>/</span>
        <span className="text-muted">{meta.label}</span>
      </nav>

      <div className="flex items-center gap-3 mb-3">
        <span className="inline-block rounded bg-brand/10 border border-brand/30 px-2 py-0.5 text-xs uppercase tracking-wider text-brand font-bold font-mono">
          Item {meta.code}
        </span>
        <span className="text-xs uppercase tracking-widest text-dim font-semibold">
          {meta.group}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        {meta.label}
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-8 max-w-2xl">
        {meta.description}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-10 max-w-md">
        <div className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-1">
            Tracked filings
          </div>
          <div className="text-2xl font-bold text-text tabular-nums">{events.length}</div>
        </div>
        <div className="rounded-xl border border-border bg-panel px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">
            Distinct companies
          </div>
          <div className="text-2xl font-bold text-text tabular-nums">{distinctTickers}</div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center text-muted mb-10">
          <div className="text-sm mb-2">No tracked filings yet for Item {meta.code}.</div>
          <div className="text-xs text-dim">
            Day-2 EDGAR scraper will populate this surface from the full SEC feed.
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-panel overflow-hidden mb-10">
          <table className="w-full text-sm">
            <thead className="text-dim text-[10px] uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold">Ticker</th>
                <th className="text-left px-4 py-3 font-semibold">Event</th>
                <th className="text-right px-4 py-3 font-semibold hidden sm:table-cell">Filed</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr
                  key={`type-${e.ticker}-${e.filedAt}-${i}`}
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
                    <div>{e.headline}</div>
                    {e.summary && (
                      <div className="text-xs text-muted mt-1 line-clamp-2">{e.summary}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[11px] text-dim whitespace-nowrap hidden sm:table-cell">
                    {fmtEventDate(e.filedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdSlot format="horizontal" />

      <section className="border-t border-border pt-10 mt-10">
        <h2 className="text-xl font-bold text-text mb-6">Other 8-K item types</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {EVENT_ITEMS.filter((i) => i.slug !== item).map((i) => (
            <Link
              key={i.slug}
              href={`/events/type/${i.slug}/`}
              className="group rounded border border-border/50 bg-panel px-3 py-2 hover:border-brand/40 transition"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-brand">{i.code}</span>
                <span className="text-sm font-semibold text-text">{i.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
