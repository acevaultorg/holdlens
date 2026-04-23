import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allEventTickers,
  EVENT_ITEMS_BY_CODE,
  fmtEventDate,
  getEventsForTicker,
  type Form8KEvent,
} from "@/lib/events";
import {
  computeEventScore,
  eventScoreLabel,
} from "@/lib/event-score";
import { TICKER_INDEX } from "@/lib/tickers";
import TickerLogo from "@/components/TickerLogo";
import AdSlot from "@/components/AdSlot";

// /events/company/[ticker]/ — per-company 8-K material-events roll-up.
// Every tracked event for one company, grouped by item type, with an
// aggregate EventScore.
//
// PPC tier: per-entity detail ($0.005/req per llms.txt).

type Props = { params: Promise<{ ticker: string }> };

export async function generateStaticParams() {
  return allEventTickers().map((t) => ({ ticker: t.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params;
  const sym = ticker.toUpperCase();
  const events = getEventsForTicker(sym);
  if (events.length === 0) return { title: "Not found" };
  const info = TICKER_INDEX[sym];
  const companyName = info?.name ?? sym;
  const score = computeEventScore(events);
  const { label } = eventScoreLabel(score.score);

  const title = `${sym} material events · EventScore ${score.score > 0 ? "+" : ""}${score.score} ${label} — HoldLens`;
  const description = `${companyName} (${sym}) SEC Form 8-K material events — ${events.length} tracked filings. EventScore: ${score.score > 0 ? "+" : ""}${score.score} (${label}).`;

  return {
    title,
    description,
    alternates: { canonical: `https://holdlens.com/events/company/${sym.toLowerCase()}/` },
    openGraph: {
      title,
      description,
      url: `https://holdlens.com/events/company/${sym.toLowerCase()}/`,
      type: "website",
      images: [{ url: "/og/home.png", width: 1200, height: 630, alt: `${sym} material events` }],
    },
  };
}

export const dynamic = "force-static";

export default async function EventsCompanyPage({ params }: Props) {
  const { ticker } = await params;
  const sym = ticker.toUpperCase();
  const events = getEventsForTicker(sym);
  if (events.length === 0) notFound();

  const info = TICKER_INDEX[sym];
  const companyName = info?.name ?? sym;
  const score = computeEventScore(events);
  const { label, tone } = eventScoreLabel(score.score);

  // Group events by item code for the per-type breakdown.
  const byItem: Record<string, Form8KEvent[]> = {};
  for (const e of events) {
    byItem[e.itemCode] = byItem[e.itemCode] || [];
    byItem[e.itemCode].push(e);
  }

  const toneClasses =
    tone === "emerald"
      ? "border-emerald-400/40 bg-emerald-400/5 text-emerald-400"
      : tone === "rose"
      ? "border-rose-400/40 bg-rose-400/5 text-rose-400"
      : "border-border bg-panel text-muted";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        "@id": `https://holdlens.com/events/company/${sym.toLowerCase()}/#dataset`,
        name: `${companyName} (${sym}) material events`,
        description: `SEC Form 8-K material events tracked for ${companyName} — classified by item number and scored on the HoldLens EventScore.`,
        url: `https://holdlens.com/events/company/${sym.toLowerCase()}/`,
        creator: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com" },
        license: "https://holdlens.com/api-terms",
        isBasedOn: "https://www.sec.gov/edgar.shtml",
        mentions: { "@id": "https://holdlens.com/#term-event-score" },
        variableMeasured: [
          { "@type": "PropertyValue", name: "Ticker" },
          { "@type": "PropertyValue", name: "SEC 8-K item number" },
          { "@type": "PropertyValue", name: "Event date" },
          { "@type": "PropertyValue", name: "Filing date" },
          { "@type": "PropertyValue", name: "Event headline" },
          { "@type": "PropertyValue", name: "EventScore aggregate" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com/" },
          { "@type": "ListItem", position: 2, name: "Material events", item: "https://holdlens.com/events/" },
          { "@type": "ListItem", position: 3, name: "Companies", item: "https://holdlens.com/events/live/" },
          {
            "@type": "ListItem",
            position: 4,
            name: `${companyName} (${sym})`,
            item: `https://holdlens.com/events/company/${sym.toLowerCase()}/`,
          },
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

      <nav className="text-xs text-dim mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-text">Home</Link>
        <span>/</span>
        <Link href="/events/" className="hover:text-text">Material events</Link>
        <span>/</span>
        <Link href="/events/live/" className="hover:text-text">Live feed</Link>
        <span>/</span>
        <span className="text-muted font-mono">{sym}</span>
      </nav>

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Company material events
      </div>

      <div className="flex items-center gap-4 mb-4">
        <TickerLogo symbol={sym} size={40} />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          <span className="font-mono text-brand">{sym}</span>
          <span className="text-text/70"> — </span>
          <span className="text-text">material events</span>
        </h1>
      </div>
      <p className="text-muted text-lg leading-relaxed mb-8 max-w-2xl">
        {companyName} — {events.length} tracked SEC Form 8-K material event
        {events.length === 1 ? "" : "s"} across {Object.keys(byItem).length} item{" "}
        {Object.keys(byItem).length === 1 ? "type" : "types"}. Scored on HoldLens&apos;s
        signed −100..+100{" "}
        <Link href="/events/" className="underline hover:text-text">
          EventScore
        </Link>
        .
      </p>

      {/* Score hero card */}
      <div
        className={`rounded-2xl border ${toneClasses.split(" ")[0]} ${toneClasses.split(" ")[1]} p-6 mb-10 flex items-center justify-between flex-wrap gap-4`}
      >
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold mb-2 text-dim">
            HoldLens EventScore
          </div>
          <div className={`text-5xl sm:text-6xl font-bold tabular-nums ${toneClasses.split(" ")[2]}`}>
            {score.score > 0 ? "+" : ""}
            {score.score}
          </div>
          <div className={`text-sm font-bold uppercase tracking-widest mt-2 ${toneClasses.split(" ")[2]}`}>
            {label}
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="rounded-lg border border-border bg-bg/50 px-4 py-2">
            <div className="text-[10px] uppercase tracking-widest text-dim">Events</div>
            <div className="text-xl font-bold text-text tabular-nums">{events.length}</div>
          </div>
          <div className="rounded-lg border border-border bg-bg/50 px-4 py-2">
            <div className="text-[10px] uppercase tracking-widest text-dim">Item types</div>
            <div className="text-xl font-bold text-text tabular-nums">
              {Object.keys(byItem).length}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-bg/50 px-4 py-2">
            <div className="text-[10px] uppercase tracking-widest text-dim">Cluster</div>
            <div className="text-xl font-bold text-text">
              {score.isCluster ? "Yes" : "No"}
            </div>
            <div className="text-[10px] text-dim">3+ events · 30d</div>
          </div>
          <div className="rounded-lg border border-border bg-bg/50 px-4 py-2">
            <div className="text-[10px] uppercase tracking-widest text-dim">Confidence</div>
            <div className="text-xl font-bold text-text tabular-nums">
              {Math.round(score.confidence * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* All events timeline */}
      <h2 className="text-2xl font-bold text-text mb-4">All tracked events</h2>
      <div className="rounded-2xl border border-border bg-panel overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-dim text-[10px] uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold">Filed</th>
                <th className="text-left px-4 py-3 font-semibold">Event</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Item</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => {
                const meta = EVENT_ITEMS_BY_CODE[e.itemCode];
                return (
                  <tr
                    key={`${e.filedAt}-${i}`}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 font-mono text-[11px] text-dim whitespace-nowrap">
                      {fmtEventDate(e.filedAt)}
                    </td>
                    <td className="px-4 py-3 text-text">
                      <div className="font-medium">{e.headline}</div>
                      {e.summary && (
                        <div className="text-xs text-muted mt-1">{e.summary}</div>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AdSlot format="horizontal" />

      {/* Related — trilogy siblings for this ticker */}
      <section className="border-t border-border pt-12 mt-12">
        <h2 className="text-xl font-bold text-text mb-6">Related for {sym}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href={`/signal/${sym}/`}
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">
              {sym} ConvictionScore
            </div>
            <div className="text-xs text-muted">
              13F superinvestor positioning for {companyName}.
            </div>
          </Link>
          <Link
            href={`/insiders/company/${sym.toLowerCase()}/`}
            className="rounded-xl border border-border bg-panel p-5 hover:border-emerald-400/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">
              {sym} InsiderScore
            </div>
            <div className="text-xs text-muted">
              Form 4 corporate-insider trades for {companyName}.
            </div>
          </Link>
          <Link
            href="/events/live/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Live 8-K feed</div>
            <div className="text-xs text-muted">
              Every tracked material event across all companies.
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
