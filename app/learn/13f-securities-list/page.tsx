import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import InvestingBooks from "@/components/InvestingBooks";
import AuthorByline from "@/components/AuthorByline";
import ShareStrip from "@/components/ShareStrip";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";
import TldrCard from "@/components/learn/TldrCard";
import OurView from "@/components/learn/OurView";
import CiteThisPage from "@/components/learn/CiteThisPage";
import FilingGuidesBlock from "@/components/FilingGuidesBlock";
import { getTicker } from "@/lib/tickers";

// Read from the SEC's own file on 2026-09-28: the Q2 2026 Official List (TXT), 25,333 rows.
// Counts are that file's rows; the sample is the 25 stocks held by the most tracked superinvestors
// in HoldLens's 2026-Q2 13F data (26 managers), each matched to the list by CUSIP. Issuer and class
// text is the SEC's, verbatim. Refresh when the SEC publishes the next quarter's list.
const LIST_PAGE = "https://www.sec.gov/rules-regulations/staff-guidance/official-list-section-13f-securities";
const LIST_TXT = "https://www.sec.gov/files/investment/13flist2026q2-txt.txt";
const LIST_PDF = "https://www.sec.gov/files/investment/13flist2026q2.pdf";
const LIST_STATS = { quarter: "Q2 2026", rows: 25333, securities: 13113, optionRows: 12220, added: 1351, deleted: 844 };
const LIST_SAMPLE: { t: string; issuer: string; cusip: string; cls: string; added?: boolean; holders: number }[] = [
  { t: "GOOGL", issuer: "ALPHABET INC", cusip: "02079K305", cls: "CAP STK CL A", holders: 16 },
  { t: "V", issuer: "VISA INC", cusip: "92826C839", cls: "COM CL A", holders: 15 },
  { t: "TSM", issuer: "TAIWAN SEMICONDUCTOR MANUFAC", cusip: "874039100", cls: "SPONSORED ADS", holders: 14 },
  { t: "GOOG", issuer: "ALPHABET INC", cusip: "02079K107", cls: "CAP STK CL C", holders: 12 },
  { t: "AMZN", issuer: "AMAZON COM INC", cusip: "023135106", cls: "COM", holders: 12 },
  { t: "META", issuer: "META PLATFORMS INC", cusip: "30303M102", cls: "CL A", holders: 12 },
  { t: "MSFT", issuer: "MICROSOFT CORP", cusip: "594918104", cls: "COM", holders: 11 },
  { t: "AAPL", issuer: "APPLE INC", cusip: "037833100", cls: "COM", holders: 9 },
  { t: "MCO", issuer: "MOODYS CORP", cusip: "615369105", cls: "COM", holders: 9 },
  { t: "SE", issuer: "SEA LTD", cusip: "81141R100", cls: "SPONSORD ADS", holders: 9 },
  { t: "UBER", issuer: "UBER TECHNOLOGIES INC", cusip: "90353T100", cls: "COM", holders: 8 },
  { t: "AVGO", issuer: "BROADCOM INC", cusip: "11135F101", cls: "COM", holders: 7 },
  { t: "AMD", issuer: "ADVANCED MICRO DEVICES INC", cusip: "007903107", cls: "COM", holders: 7 },
  { t: "SPY", issuer: "STATE STR SPDR S&P 500 ETF T", cusip: "78462F103", cls: "TR UNIT", holders: 7 },
  { t: "AMAT", issuer: "APPLIED MATLS INC", cusip: "038222105", cls: "COM", holders: 7 },
  { t: "MA", issuer: "MASTERCARD INCORPORATED", cusip: "57636Q104", cls: "CL A", holders: 7 },
  { t: "COF", issuer: "CAPITAL ONE FINL CORP", cusip: "14040H105", cls: "COM", holders: 6 },
  { t: "NVDA", issuer: "NVIDIA CORPORATION", cusip: "67066G104", cls: "COM", holders: 6 },
  { t: "LRCX", issuer: "LAM RESEARCH CORP", cusip: "512807306", cls: "COM NEW", holders: 6 },
  { t: "DHR", issuer: "DANAHER CORP DEL", cusip: "235851102", cls: "COM", holders: 6 },
  { t: "ASML", issuer: "ASML HLDG NV", cusip: "N07059210", cls: "N Y REGISTRY SHS", holders: 6 },
  { t: "SPOT", issuer: "SPOTIFY TECHNOLOGY S A", cusip: "L8681T102", cls: "SHS", holders: 6 },
  { t: "NU", issuer: "NU HLDGS LTD", cusip: "G6683N103", cls: "ORD SHS CL A", holders: 6 },
  { t: "BRK.B", issuer: "BERKSHIRE HATHAWAY INC DEL", cusip: "084670702", cls: "CL B NEW", holders: 6 },
  { t: "SPCX", issuer: "SPACE EXPLORATION TECHN CORP", cusip: "84615Q103", cls: "CLASS A COM STK", added: true, holders: 6 },
];

export const metadata: Metadata = {
  title: "The 13(f) securities list — what counts as a 13F holding?",
  description:
    "Not every stock or asset shows up on a 13F. The SEC publishes a quarterly list — the 13(f) securities list — that defines exactly which securities institutional managers must report. Here's how it works.",
  alternates: { canonical: "https://holdlens.com/learn/13f-securities-list" },
  openGraph: {
    title: "The 13(f) securities list",
    description:
      "The SEC's quarterly list of securities institutional managers must report on Form 13F.",
    url: "https://holdlens.com/learn/13f-securities-list",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The 13(f) securities list",
    description:
      "The quarterly SEC list defining which securities show up on a 13F filing.",
    images: ["/og/home.png"],
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://holdlens.com/learn" },
      { "@type": "ListItem", position: 3, name: "13(f) securities list", item: "https://holdlens.com/learn/13f-securities-list" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "The 13(f) securities list — what counts as a 13F holding?",
    description: "Plain English explainer of the SEC's quarterly 13(f) securities list.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/13f-securities-list",
    datePublished: "2026-05-16",
    dateModified: "2026-09-28",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "13(f) Official List",
      "13F securities",
      "Form 13F scope",
      "shorts excluded",
      "derivatives excluded",
    ],
    citation: [
      "https://www.sec.gov/divisions/investment/13ffaq",
      "https://en.wikipedia.org/wiki/Form_13F",
    ],
    about: [
      {
        "@type": "DefinedTerm",
        name: "13(f) Security",
        description:
          "Any security on the SEC's quarterly Official List of Section 13(f) Securities. Institutional managers with ≥$100M in 13(f) securities must report their long positions in these securities on Form 13F within 45 days of quarter-end.",
      },
      {
        "@type": "DefinedTerm",
        name: "Official List",
        description:
          "The SEC's quarterly publication identifying every security subject to Form 13F reporting, as a PDF and a fixed-width text file on sec.gov (Official List of Section 13(f) Securities page). The Q2 2026 list has 25,333 rows: 13,113 securities plus 12,220 listed call and put option entries. Categories: equity securities, fund shares, ADRs, convertible debt, and select options.",
      },
      {
        "@type": "DefinedTerm",
        name: "Section 13(f) of the Exchange Act",
        description:
          "The 1975-enacted Securities Exchange Act provision requiring institutional investment managers with ≥$100M in equity assets under management to report holdings of 13(f) securities quarterly. Implemented via Rule 13f-1.",
      },
      {
        "@type": "DefinedTerm",
        name: "Excluded Securities",
        description:
          "Asset classes NOT on the 13(f) list: short positions, options (most), non-U.S. equities, U.S. Treasury securities, agency debt, corporate bonds, ETF shares of non-registered funds, municipal bonds, real estate, cryptocurrency, derivatives outside the named categories.",
      },
    ],
  },
];

export default function SecuritiesListPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">The 13(f) securities list — what counts as a 13F holding?</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Not every asset a hedge fund owns shows up on a 13F filing. The SEC publishes a quarterly{" "}
          <strong className="text-text">Official List of Section 13(f) Securities</strong> defining
          which securities trigger reporting:{" "}
          <a href={LIST_PAGE} className="text-brand underline" rel="noopener">
            the Official List page on sec.gov
          </a>. The {LIST_STATS.quarter} list has {LIST_STATS.securities.toLocaleString("en-US")} securities
          (U.S.-listed stocks, ADRs, certain convertibles, ETFs and closed-end funds) plus{" "}
          {LIST_STATS.optionRows.toLocaleString("en-US")} entries for their listed calls and puts. Everything
          off this list is off-13F and invisible to readers tracking smart money.
        </TldrCard>

        <p className="text-lg text-muted">
          Section 13(f) of the Securities Exchange Act of 1934 — enacted in 1975 — applies only to
          a defined universe of securities. The SEC publishes that universe quarterly as the{" "}
          <strong className="text-text">Official List of Section 13(f) Securities</strong>, and
          managers&apos; reporting obligations are precisely scoped to that list.
        </p>

        <AuthorByline date="2026-05-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The list itself: {LIST_STATS.quarter} in numbers</h2>
        <p className="text-muted">
          The SEC publishes each quarter&apos;s list as a PDF and as a fixed-width text file. Counted from
          the {LIST_STATS.quarter} text file:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">{LIST_STATS.rows.toLocaleString("en-US")} rows</strong> in total</li>
          <li><strong className="text-text">{LIST_STATS.securities.toLocaleString("en-US")} securities</strong>, each identified by its 9-character CUSIP</li>
          <li><strong className="text-text">{LIST_STATS.optionRows.toLocaleString("en-US")} option entries</strong>, one CALL and one PUT row for every security with listed options</li>
          <li><strong className="text-text">{LIST_STATS.added.toLocaleString("en-US")} additions</strong> and <strong className="text-text">{LIST_STATS.deleted.toLocaleString("en-US")} deletions</strong> versus the previous quarter (flagged *A* and *D* in the file)</li>
        </ul>
        <p className="text-muted">
          Download the official file:{" "}
          <a href={LIST_TXT} className="text-brand underline" rel="noopener">{LIST_STATS.quarter} TXT</a>
          {" · "}
          <a href={LIST_PDF} className="text-brand underline" rel="noopener">{LIST_STATS.quarter} PDF</a>
          {" · "}
          <a href={LIST_PAGE} className="text-brand underline" rel="noopener">all quarters since 1996</a>.
        </p>

        <h3 className="text-xl font-bold mt-8 mb-2">The 25 most-held stocks, checked against the list</h3>
        <p className="text-muted text-sm">
          The 25 stocks owned by the most superinvestors HoldLens tracks (2026-Q2 filings), each matched to
          the {LIST_STATS.quarter} list by CUSIP. All 25 are on it, and every one also has listed options on
          the list. Issuer and class are the SEC&apos;s own text.
        </p>
        <div className="rounded-lg border border-border overflow-x-auto my-4">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-3 py-3">Ticker</th>
                <th className="text-left px-3 py-3">Issuer (SEC list)</th>
                <th className="text-left px-3 py-3">CUSIP</th>
                <th className="text-left px-3 py-3">Class</th>
                <th className="text-left px-3 py-3">On list</th>
              </tr>
            </thead>
            <tbody>
              {LIST_SAMPLE.map((r) => (
                <tr key={r.cusip} className="border-b border-border">
                  <td className="px-3 py-2 font-semibold whitespace-nowrap">
                    {getTicker(r.t) ? (
                      <a href={`/ticker/${r.t}`} className="text-brand hover:underline">{r.t}</a>
                    ) : (
                      r.t
                    )}
                  </td>
                  <td className="px-3 py-2 text-muted">{r.issuer}</td>
                  <td className="px-3 py-2 font-mono text-xs tabular-nums whitespace-nowrap">{r.cusip}</td>
                  <td className="px-3 py-2 text-muted text-xs">{r.cls}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.added ? "Yes, added this quarter" : "Yes"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted text-sm">
          To check any other security, search the TXT file for its CUSIP. A security that is not on the list
          does not have to be reported on Form 13F, however large the position.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">What&apos;s on the list</h2>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">U.S. exchange-listed common stocks</strong> (NYSE, Nasdaq, Cboe Equities) — the largest category</li>
          <li><strong className="text-text">American Depositary Receipts (ADRs)</strong> — foreign stocks held via U.S. depository banks</li>
          <li><strong className="text-text">Certain convertible debt</strong> — corporate bonds convertible into 13(f)-listed equity</li>
          <li><strong className="text-text">Closed-end fund shares</strong> — equity-traded RICs (not the underlying fund holdings)</li>
          <li><strong className="text-text">Certain ETFs</strong> — exchange-listed shares of registered investment companies (NOT the underlying fund positions; the ETF share itself)</li>
          <li><strong className="text-text">Equity options</strong> — listed equity options on exchange-traded options markets; reported notionally as the underlying equity exposure</li>
          <li><strong className="text-text">Equity warrants and rights</strong> — when traded on registered exchanges</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">What&apos;s NOT on the list</h2>
        <p className="text-muted">
          Excluded categories are large, and they shape what 13Fs can and cannot tell you:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Short positions</strong> — invisible. A fund could be net-short Apple and show it as a long position on 13F.</li>
          <li><strong className="text-text">Non-U.S.-listed equities</strong> — foreign stocks bought directly on London or Tokyo exchanges are excluded.</li>
          <li><strong className="text-text">Bonds (corporate, treasury, agency, municipal)</strong> — bond positions don&apos;t show up. A fixed-income hedge fund could be invisible.</li>
          <li><strong className="text-text">Most derivatives</strong> — futures contracts, total-return swaps, OTC swaps, and most options are excluded. A fund with synthetic exposure to AAPL via a TRS shows nothing on 13F.</li>
          <li><strong className="text-text">Cash and cash equivalents</strong> — not on the list.</li>
          <li><strong className="text-text">Private placements, private equity, real estate</strong> — entirely outside the regime.</li>
          <li><strong className="text-text">Cryptocurrency</strong> — bitcoin, ether, etc. are not 13(f) securities (BTC futures on CME are; BTC spot ETFs registered as ICs are on the list).</li>
        </ul>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Why this matters for reading 13Fs</h2>
        <p className="text-muted">
          Three consequences for the practical reader:
        </p>
        <ol className="text-muted space-y-2 list-decimal list-inside">
          <li>
            <strong className="text-text">The 13F you&apos;re reading is incomplete by design.</strong>{" "}
            A fund with 60% gross exposure to U.S. equities + 40% to bonds shows 60%-of-portfolio
            on 13F. Don&apos;t mistake the 13F view for the full book.
          </li>
          <li>
            <strong className="text-text">Short-biased funds look long-only on 13F.</strong>{" "}
            A market-neutral fund with $10B long + $10B short shows the $10B long as if the fund
            were directionally long-only. The hedge invisible.
          </li>
          <li>
            <strong className="text-text">Cross-asset funds look smaller than they are.</strong>{" "}
            A multi-strategy fund with $50B AUM might show $15B on 13F because the rest is bonds,
            commodities, currencies, alternatives. The 13F filing is not the AUM.
          </li>
        </ol>

        <OurView>
          <p>
            The 13(f) securities list is one of the structural facts that makes 13F-based research
            work the way it does. Every position you read on HoldLens is necessarily in 13(f)-list
            scope — that&apos;s why we can compare across managers consistently. The flip side is
            that positions OUT of scope (shorts, bonds, derivatives, non-U.S.) are invisible to
            this analysis entirely.
          </p>
          <p>
            For tracked-superinvestor reading, this means: 13F is the right tool for value-style
            long-only U.S. equity exposure (Buffett, Klarman, Burry on the long side, Greenblatt,
            Pabrai). It is NOT the right tool for fixed-income arbitrage, global-macro, derivatives-
            heavy strategies, or short books. Pick the right manager for the right reading.
          </p>
        </OurView>

        <p className="text-muted text-sm border-l-2 border-border pl-4 mt-6">
          Pure-reference encyclopedic entry for Form 13F (including the variants HR / NT / HR/A) on
          our sister site:{" "}
          <a href="https://secfilingdex.com/learn/13f/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/13f
          </a>
          {" "}— SEC regulatory citation + every form variant.
        </p>

        <InvestingBooks
          heading="Foundational reading on securities analysis"
          sub="13(f) scope shapes what 13F-based research can see. These books — Graham, Lynch, Munger — frame the broader picture beyond what one filing type reveals."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. See <a href="/methodology" className="underline">methodology</a> for
          how we treat 13F-list scope across the tracked-superinvestor universe.
        </p>

        <CiteThisPage />
        <FilingGuidesBlock currentSlug="13f-securities-list" />
        <LearnReadNext currentSlug="13f-securities-list" />

        <ShareStrip url="https://holdlens.com/learn/13f-securities-list" title="The 13(f) securities list" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See live 13F filings on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            Every <a href="/" className="text-brand hover:underline">live position</a> on HoldLens
            traces back to a 13(f)-list security reported on Form 13F. Sister property cataloging
            every form variant + regulatory citation:{" "}
            <a href="https://secfilingdex.com/" className="text-brand hover:underline">SecFilingDex</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
