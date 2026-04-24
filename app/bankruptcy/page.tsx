import type { Metadata } from "next";
import Link from "next/link";
import { ALL_EVENTS, fmtEventDate } from "@/lib/events";

export const metadata: Metadata = {
  title: "Chapter 11 Bankruptcy Tracker — every public-US Form 8-K Item 1.03 · HoldLens",
  description:
    "Every public US company that has filed for bankruptcy or receivership, surfaced from SEC Form 8-K Item 1.03 within 4 business days. Live EDGAR feed + cross-link to insider patterns + 8-K material events.",
  alternates: { canonical: "https://holdlens.com/bankruptcy/" },
  openGraph: {
    title: "HoldLens Chapter 11 Tracker",
    description:
      "Every public US company in bankruptcy. Live SEC Form 8-K Item 1.03 feed + cross-links.",
    url: "https://holdlens.com/bankruptcy/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens Bankruptcy" }],
  },
  robots: { index: true, follow: true },
};

export default function BankruptcyHub() {
  // Filter the combined ALL_EVENTS for Item 1.03 (Bankruptcy or Receivership)
  const bankruptcyEvents = ALL_EVENTS.filter((e) => e.itemCode === "1.03").sort(
    (a, b) => (a.filedAt < b.filedAt ? 1 : -1)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HoldLens Chapter 11 Bankruptcy Tracker",
    description:
      "Live tracker of every public-US bankruptcy or receivership filing sourced from SEC Form 8-K Item 1.03.",
    url: "https://holdlens.com/bankruptcy/",
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: bankruptcyEvents.length,
      itemListElement: bankruptcyEvents.slice(0, 20).map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Article",
          name: `${e.companyName} — bankruptcy filing`,
          datePublished: e.filedAt,
        },
      })),
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Distress
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Bankruptcy Tracker
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Every public US company that files for bankruptcy or receivership, surfaced from
        SEC Form 8-K Item 1.03 within 4 business days. Currently tracking{" "}
        <strong className="text-text">{bankruptcyEvents.length}</strong> filing
        {bankruptcyEvents.length === 1 ? "" : "s"} from EDGAR.
      </p>

      {bankruptcyEvents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mt-2 mb-4">Recent filings</h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-card text-text">
                <tr>
                  <th className="text-left p-3 font-semibold">Filed</th>
                  <th className="text-left p-3 font-semibold">Ticker</th>
                  <th className="text-left p-3 font-semibold">Company</th>
                  <th className="text-left p-3 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                {bankruptcyEvents.slice(0, 30).map((e, i) => {
                  const tickerDisplay = e.ticker.startsWith("_CIK_")
                    ? <span className="text-dim italic">CIK {e.issuerCik}</span>
                    : <span className="font-mono text-text">{e.ticker}</span>;
                  return (
                    <tr key={i} className="border-t border-border">
                      <td className="p-3 whitespace-nowrap">{fmtEventDate(e.filedAt)}</td>
                      <td className="p-3">{tickerDisplay}</td>
                      <td className="p-3">{e.companyName}</td>
                      <td className="p-3">
                        {e.form8kAccessionNumber ? (
                          <a
                            href={`https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${e.issuerCik}&type=8-K&dateb=&owner=include&count=40`}
                            className="text-brand underline text-xs"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            EDGAR
                          </a>
                        ) : (
                          <span className="text-xs text-dim">curated</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {bankruptcyEvents.length > 30 && (
            <p className="text-sm text-dim mt-3">
              Showing 30 most-recent of {bankruptcyEvents.length}. Full feed at{" "}
              <Link href="/api/v1/events/type/bankruptcy.json" className="text-brand underline">
                /api/v1/events/type/bankruptcy.json
              </Link>
              .
            </p>
          )}
        </section>
      )}

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-10 mb-3">Why the bankruptcy lens matters</h2>
        <p className="text-muted">
          Chapter 11 filings are among the highest-impact disclosures a public company can
          make — equity is typically wiped out, debt restructured, the cap table reset.
          For investors, the question is rarely "did they file" (the 8-K is reactive; the
          stock has already moved). The real question is "was there a signal BEFORE
          the filing?"
        </p>
        <p className="text-muted">
          HoldLens answers that by linking each Chapter 11 to the issuer's prior{" "}
          <Link href="/insiders/" className="text-brand underline">insider trades</Link>{" "}
          (cluster sells often precede), prior{" "}
          <Link href="/events/type/material-impairment/" className="text-brand underline">
            8-K impairments
          </Link>{" "}
          (Item 2.06), and prior{" "}
          <Link href="/enforcement/" className="text-brand underline">SEC enforcement</Link>{" "}
          history.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Data flow</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li><strong className="text-text">Primary signal:</strong> SEC 8-K Item 1.03 (filed within 4 business days of bankruptcy petition)</li>
          <li><strong className="text-text">Update cadence:</strong> ingested via daily Form 8-K scraper (<code className="bg-card px-1 rounded">scripts/fetch-edgar-8k.ts</code>); typically appears here within 24h of EDGAR publication</li>
          <li><strong className="text-text">Cross-reference (manual):</strong> PACER court docket for chapter type (7 vs 11), debtor name, lead law firm — Day-3 integration</li>
          <li><strong className="text-text">Pre-filing context:</strong> per-issuer pages cross-link 90 days of insider trades + material 8-Ks</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Honest framing</h2>
        <p className="text-muted">
          Not every Chapter 11 is the headline-grabbing equity-wipeout case. Many are
          pre-packaged restructurings where existing equity retains some value, or
          Chapter 7 liquidations of microcap shells. We surface ALL of them with the
          source filing intact so you can read the petition document yourself before
          drawing conclusions.
        </p>
        <p className="text-muted">
          Chapter type detection (7 vs 11 vs 15) requires reading the actual petition,
          which lives on PACER (federal court system). The 8-K Item 1.03 only confirms
          THAT a filing was made, not WHICH chapter.
        </p>
        <p className="text-muted">
          See <Link href="/disclaimer/" className="text-brand underline">disclaimer</Link>{" "}
          for full not-investment-advice + 4-business-day filing-lag framing.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Related</h2>
        <p className="text-muted">
          <Link href="/events/type/bankruptcy/" className="text-brand underline">
            All 8-K Item 1.03 events
          </Link>
          {" · "}
          <Link href="/events/type/material-impairment/" className="text-brand underline">
            Material impairments (Item 2.06)
          </Link>
          {" · "}
          <Link href="/insiders/" className="text-brand underline">
            Insider trades
          </Link>
          {" · "}
          <Link href="/enforcement/" className="text-brand underline">
            SEC enforcement
          </Link>
          {" · "}
          <Link href="/api/v1/events/type/bankruptcy.json" className="text-brand underline">
            JSON API
          </Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
