import type { Metadata } from "next";
import Link from "next/link";
import {
  CURATED_EVENTS,
  EVENT_ITEMS,
  EVENT_ITEMS_BY_CODE,
  fmtEventDate,
  getRecentEvents,
} from "@/lib/events";
import TickerLogo from "@/components/TickerLogo";
import AdSlot from "@/components/AdSlot";

// /events/ — the hub for SEC Form 8-K material events on HoldLens.
// Companion to /insiders/ (Form 4) and the 13F-based /best-now/, /signal/,
// /investor/ surfaces. Completes the HoldLens "SEC Signals" trilogy:
//
//   13F      → ConvictionScore (quarterly positioning)
//   Form 4   → InsiderScore    (daily insider activity)
//   Form 8-K → EventScore      (intra-day material events)
//
// This page:
//   1. Explains EventScore methodology
//   2. Surfaces the full 8-K item-number taxonomy with per-type links
//   3. Previews the most recent material events
//   4. Cross-links to the other trilogy surfaces
//
// PPC tier: per-entity detail ($0.005/req per llms.txt).

export const metadata: Metadata = {
  title: "Material Events — SEC 8-K Filings · HoldLens",
  description:
    "Every material SEC Form 8-K event — earnings, M&A, bankruptcies, cybersecurity incidents, CEO changes, impairments. Classified by item number and scored on the HoldLens EventScore (−100 to +100). Intra-day refresh.",
  alternates: { canonical: "https://holdlens.com/events/" },
  openGraph: {
    title: "Material Events — SEC 8-K Filings · HoldLens",
    description:
      "Classified and scored SEC 8-K material-event filings. Earnings, M&A, bankruptcies, cybersecurity, CEO changes. EventScore −100..+100.",
    url: "https://holdlens.com/events/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens Material Events" }],
  },
};

export const dynamic = "force-static";

export default function EventsHubPage() {
  const recent = getRecentEvents(10);
  const totalEvents = CURATED_EVENTS.length;
  const distinctTickers = new Set(CURATED_EVENTS.map((e) => e.ticker.toUpperCase())).size;

  // Group items by section for the taxonomy table.
  const sections: Array<{ title: string; codes: Array<typeof EVENT_ITEMS[number]> }> = [
    { title: "Business & operations", codes: EVENT_ITEMS.filter((i) => i.code.startsWith("1.")) },
    { title: "Financial information", codes: EVENT_ITEMS.filter((i) => i.code.startsWith("2.")) },
    { title: "Securities & listings", codes: EVENT_ITEMS.filter((i) => i.code.startsWith("3.")) },
    { title: "Accounting", codes: EVENT_ITEMS.filter((i) => i.code.startsWith("4.")) },
    { title: "Governance & management", codes: EVENT_ITEMS.filter((i) => i.code.startsWith("5.")) },
    { title: "Disclosures & other", codes: EVENT_ITEMS.filter((i) => i.code.startsWith("7.") || i.code.startsWith("8.")) },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        "@id": "https://holdlens.com/events/#dataset",
        name: "HoldLens Material Events (SEC 8-K) tracker",
        description:
          "Classified and scored SEC Form 8-K material-event filings — earnings, M&A, bankruptcies, cybersecurity incidents, impairments, CEO changes, and more. Each event tagged with its SEC item number and factored into the HoldLens EventScore (−100..+100).",
        url: "https://holdlens.com/events/",
        creator: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com" },
        license: "https://holdlens.com/api-terms",
        isBasedOn: "https://www.sec.gov/edgar.shtml",
        variableMeasured: [
          { "@type": "PropertyValue", name: "Ticker" },
          { "@type": "PropertyValue", name: "Company name" },
          { "@type": "PropertyValue", name: "SEC 8-K item number" },
          { "@type": "PropertyValue", name: "Event date" },
          { "@type": "PropertyValue", name: "Filing date" },
          { "@type": "PropertyValue", name: "Event headline" },
          { "@type": "PropertyValue", name: "EventScore contribution" },
        ],
        mentions: { "@id": "https://holdlens.com/#term-event-score" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com/" },
          { "@type": "ListItem", position: 2, name: "Material events", item: "https://holdlens.com/events/" },
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
        <span className="text-muted">Material events</span>
      </nav>

      <div className="flex items-center gap-3 mb-4">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">
          SEC 8-K signals
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
        Every material event, from the filing.
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-4 max-w-2xl">
        Every public company must disclose material events on <strong className="text-text">
        SEC Form 8-K</strong> within 4 business days — earnings, M&amp;A, bankruptcies,
        cybersecurity incidents, CEO changes, impairments, restatements, and more.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-12">
        HoldLens classifies each filing by its SEC item number and scores it on the branded{" "}
        <strong className="text-text">EventScore</strong> — a signed −100..+100 signal
        combining item-type severity, recency, and event-cluster density. Tracking{" "}
        {totalEvents} recent events across {distinctTickers} companies while the Day-2 EDGAR
        scraper expands the dataset.
      </p>

      {/* 2-button CTA — trilogy connection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
        <Link
          href="/events/live/"
          className="group inline-flex items-center justify-between rounded-xl border border-brand/40 bg-brand/5 px-5 py-4 hover:bg-brand/10 hover:border-brand/60 transition"
        >
          <div>
            <div className="font-semibold text-text">Live events firehose</div>
            <div className="text-xs text-muted mt-0.5">Every tracked 8-K, newest first</div>
          </div>
          <span aria-hidden className="text-brand transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
        <Link
          href="/insiders/"
          className="group inline-flex items-center justify-between rounded-xl border border-border bg-panel px-5 py-4 hover:border-border-bright transition"
        >
          <div>
            <div className="font-semibold text-text">Insider activity (Form 4)</div>
            <div className="text-xs text-muted mt-0.5">The daily trilogy sibling surface</div>
          </div>
          <span aria-hidden className="text-muted transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>

      {/* EventScore methodology */}
      <section className="border-t border-border pt-10 mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">How EventScore works</h2>
        <p className="text-muted leading-relaxed max-w-2xl mb-4">
          EventScore compresses a company&apos;s recent 8-K activity into a single signed
          number on the same −100..+100 scale used by ConvictionScore (13F) and InsiderScore
          (Form 4). Same grammar, different lens.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-panel p-5">
            <div className="text-xs uppercase tracking-wider text-brand font-semibold mb-2">
              Four factors
            </div>
            <ul className="text-sm text-muted space-y-2">
              <li><strong className="text-text">Item-type severity</strong> — bankruptcy ×−2.0, restatement ×−1.8, delisting ×−1.5, cybersecurity ×−1.3, impairment ×−1.2, completed M&amp;A ×+1.1, material agreement ×+1.0</li>
              <li><strong className="text-text">Recency decay</strong> — last 7 days full weight; 7-30 days half; 30-90 days quarter; older is context only</li>
              <li><strong className="text-text">Event cluster</strong> — ×1.3 bonus when a company files 3+ material events within 30 days</li>
              <li><strong className="text-text">Logistic compression</strong> — caps at ±100 so no single filing pegs the scale</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-panel p-5">
            <div className="text-xs uppercase tracking-wider text-brand font-semibold mb-2">
              What it&apos;s not
            </div>
            <ul className="text-sm text-muted space-y-2">
              <li>Not ML — deterministic and reproducible from public SEC data</li>
              <li>Not a price predictor — directional signal, not a forecast</li>
              <li>Not investment advice — read every filing for yourself before acting</li>
              <li>Not quarterly — refreshes intra-day as 8-Ks publish on EDGAR</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8-K Item taxonomy table */}
      <section className="border-t border-border pt-10 mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">The SEC 8-K item taxonomy</h2>
        <p className="text-muted leading-relaxed max-w-2xl mb-6">
          Form 8-K is divided into 9 sections. HoldLens tracks the highest-signal items in
          each. Click any item to see every tracked event of that type across all companies.
        </p>
        <div className="space-y-4">
          {sections.map((s) => (
            <div key={s.title} className="rounded-xl border border-border bg-panel p-5">
              <div className="text-xs uppercase tracking-wider text-dim font-semibold mb-3">
                {s.title}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {s.codes.map((i) => (
                  <Link
                    key={i.code}
                    href={`/events/type/${i.slug}/`}
                    className="group inline-flex items-start justify-between gap-2 rounded border border-border/50 bg-bg/30 px-3 py-2 hover:border-brand/40 hover:bg-brand/5 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-brand">
                          {i.code}
                        </span>
                        <span className="text-sm font-semibold text-text">{i.label}</span>
                      </div>
                      <div className="text-xs text-muted mt-0.5 line-clamp-2">
                        {i.description.split(".")[0]}.
                      </div>
                    </div>
                    <span aria-hidden className="text-dim group-hover:text-brand transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <AdSlot format="horizontal" />

      {/* Recent events preview */}
      <section className="border-t border-border pt-10 mb-12">
        <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-text">Recent tracked events</h2>
          <Link href="/events/live/" className="text-sm text-muted hover:text-text">
            Full live feed →
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
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
              {recent.map((e, i) => {
                const meta = EVENT_ITEMS_BY_CODE[e.itemCode];
                return (
                  <tr
                    key={`hub-${e.ticker}-${e.filedAt}-${i}`}
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
                    <td className="px-4 py-3 text-text">{e.headline}</td>
                    <td className="px-4 py-3 text-xs hidden md:table-cell">
                      <Link
                        href={`/events/type/${meta.slug}/`}
                        className="inline-block rounded border border-border/60 bg-bg/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted hover:text-text hover:border-brand/40 transition"
                      >
                        {e.itemCode}
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
      </section>

      {/* Related — the trilogy */}
      <section className="border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text mb-6">The SEC Signals trilogy</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/best-now/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-xs uppercase tracking-wider text-brand font-semibold mb-1">
              13F · Quarterly
            </div>
            <div className="text-sm font-semibold text-text mb-1">ConvictionScore rankings</div>
            <div className="text-xs text-muted">
              What 30 tracked superinvestors bought and sold last quarter.
            </div>
          </Link>
          <Link
            href="/insiders/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-emerald-400/40 transition block"
          >
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">
              Form 4 · Daily
            </div>
            <div className="text-sm font-semibold text-text mb-1">InsiderScore activity</div>
            <div className="text-xs text-muted">
              CEO, CFO, Chair, Director Form 4 insider trades.
            </div>
          </Link>
          <div className="rounded-xl border border-brand/40 bg-brand/5 p-5">
            <div className="text-xs uppercase tracking-wider text-brand font-semibold mb-1">
              Form 8-K · Intra-day
            </div>
            <div className="text-sm font-semibold text-text mb-1">EventScore (you are here)</div>
            <div className="text-xs text-muted">
              Material events from every public company.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
