import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EmailCapture from "@/components/EmailCapture";
import LiveQuote from "@/components/LiveQuote";
import LiveChart from "@/components/LiveChart";
import StarButton from "@/components/StarButton";
import TickerLogo from "@/components/TickerLogo";
import FundLogo from "@/components/FundLogo";
import TickerActivity from "@/components/TickerActivity";
import TickerNews from "@/components/TickerNews";
import TickerEarnings from "@/components/TickerEarnings";
import InsiderActivity from "@/components/InsiderActivity";
import BuybackSummary from "@/components/BuybackSummary";
import ShortInterestSummary from "@/components/ShortInterestSummary";
import ActivistSummary from "@/components/ActivistSummary";
import CongressSummary from "@/components/CongressSummary";
import AdSlot from "@/components/AdSlot";
import AffiliateCTA from "@/components/AffiliateCTA";
import RelatedSignals from "@/components/RelatedSignals";
import DividendTaxCalc from "@/components/DividendTaxCalc";
import { TICKER_INDEX, getTicker } from "@/lib/tickers";

export async function generateStaticParams() {
  return Object.keys(TICKER_INDEX).map((symbol) => ({ symbol }));
}

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
  const { symbol } = await params;
  const t = getTicker(symbol);
  if (!t) return { title: "Ticker not found" };
  return {
    title: `Who owns ${t.symbol}? ${t.ownerCount} hedge funds hold ${t.name}`,
    description: `${t.ownerCount} tracked superinvestors hold ${t.symbol}. See exact positions, % of portfolio, and conviction scores.`,
    openGraph: {
      title: `${t.symbol} · Hedge fund ownership`,
      description: `${t.ownerCount} superinvestors hold ${t.name}. See full ownership.`,
      images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
    },
    // v1.15 — per-ticker RSS discovery. Feed readers (NetNewsWire, Feedly,
    // Inoreader) auto-discover via <link rel="alternate" type="application/rss+xml">.
    // See app/ticker/[symbol]/feed.xml/route.ts.
    alternates: {
      canonical: `https://holdlens.com/ticker/${t.symbol}`,
      types: {
        "application/rss+xml": `https://holdlens.com/ticker/${t.symbol}/feed.xml`,
      },
    },
  };
}

export default async function TickerPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const t = getTicker(symbol);
  if (!t) notFound();

  const ld = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: t.name,
    tickerSymbol: t.symbol,
    description: `${t.name} (${t.symbol}) is held by ${t.ownerCount} tracked superinvestors.`,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Stocks", item: "https://holdlens.com/ticker" },
      { "@type": "ListItem", position: 3, name: t.symbol, item: `https://holdlens.com/ticker/${t.symbol}` },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <a href="/ticker" className="text-xs text-muted hover:text-text">← All tickers</a>

      <div className="mt-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Stock ownership · Live</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight flex items-center gap-3 flex-wrap">
            <TickerLogo symbol={t.symbol} size={48} />
            <span className="text-brand">{t.symbol}</span>
          </h1>
          <p className="text-muted text-lg mt-2">{t.name} · {t.sector}</p>
        </div>
        <StarButton symbol={t.symbol} />
      </div>

      {/* Live quote block */}
      <section className="mt-8">
        <LiveQuote symbol={t.symbol} size="xl" />
      </section>

      {/* Live price chart */}
      <section className="mt-8">
        <LiveChart symbol={t.symbol} defaultRange="1y" />
      </section>

      {/* Earnings calendar */}
      <section className="mt-8">
        <TickerEarnings symbol={t.symbol} />
      </section>

      <div className="mt-12 grid md:grid-cols-3 gap-4">
        <Stat label="Tracked owners" value={t.ownerCount.toString()} />
        <Stat label="Sum of conviction" value={`${t.totalConviction.toFixed(0)}%`} />
        <Stat label="Sector" value={t.sector || "Other"} />
      </div>

      {/* Signal dossier CTA */}
      <section className="mt-8">
        <a
          href={`/signal/${t.symbol}`}
          className="block rounded-2xl border border-brand/40 bg-brand/5 p-5 hover:bg-brand/10 transition group"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-1">
                HoldLens Signal
              </div>
              <div className="text-lg font-bold group-hover:text-brand transition">
                Full buy/sell dossier for {t.symbol}
              </div>
              <div className="text-xs text-muted mt-1">
                Verdict · Multi-quarter trend · Activity · News · Ownership
              </div>
            </div>
            <div className="text-brand text-sm font-semibold">Open dossier →</div>
          </div>
        </a>
      </section>

      <AdSlot format="horizontal" />

      {/* Smart-money activity feed — all quarters */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-2">Smart money activity</h2>
        <p className="text-muted text-sm mb-6">
          Every tracked buy, add, trim, and exit on {t.symbol} by the best portfolio managers in the world. Ranked by manager quality inside each quarter.
        </p>
        <TickerActivity symbol={t.symbol} />
      </section>

      {/* Insider activity (Form 4) */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-2">Insider activity</h2>
        <p className="text-muted text-sm mb-6">
          SEC Form 4 filings — when CEOs, CFOs, and 10%+ owners buy or sell their own stock.
        </p>
        <InsiderActivity symbol={t.symbol} />
      </section>

      {/* Buyback program (when tracked) — the company-itself-as-buyer signal,
          alongside 13F (institutional) + Form 4 (insider). Renders nothing
          for tickers without a tracked program. */}
      <BuybackSummary symbol={t.symbol} />

      {/* Activist 13D/13G campaigns targeting this company (when tracked).
          Renders nothing for tickers not on the activist target list. */}
      <ActivistSummary symbol={t.symbol} />

      {/* Short interest disclosure (when tracked). FINRA bi-monthly data —
          the bear-side conviction signal. Renders nothing for tickers not
          in the most-shorted seed. */}
      <ShortInterestSummary symbol={t.symbol} />

      {/* Congressional disclosed trades in this ticker (when present).
          Closes the smart-money loop with the political-disclosure layer
          alongside 13F (institutional) + Form 4 (insider) + 13D/G (activist)
          + buybacks (company-as-buyer) + short interest (bear conviction). */}
      <CongressSummary symbol={t.symbol} />

      {/* Latest news */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-2">Latest news</h2>
        <p className="text-muted text-sm mb-6">
          Recent headlines for {t.symbol}.
        </p>
        <TickerNews symbol={t.symbol} count={6} />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-2">Hedge funds holding {t.symbol}</h2>
        <p className="text-muted text-sm mb-6">
          {t.ownerCount} superinvestor{t.ownerCount > 1 ? "s" : ""} hold {t.name} as a top position. Sorted by % of portfolio.
        </p>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-4">Manager</th>
                <th className="text-right px-5 py-4">% Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {[...t.owners].sort((a, b) => b.pct - a.pct).map((o) => (
                <tr key={o.slug} className="border-b border-border last:border-0 align-top">
                  <td className="px-5 py-4">
                    <a href={`/investor/${o.slug}`} className="inline-flex items-center gap-2 text-text hover:text-brand transition font-semibold">
                      <FundLogo slug={o.slug} name={o.manager} size={22} />
                      {o.manager}
                    </a>
                    <div className="text-dim text-xs mt-1 max-w-md ml-8">{o.thesis}</div>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-brand font-semibold">{o.pct.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Dividend tax calculator — retention hook.
          After the user has seen who holds {symbol}, the natural next
          question is "what would I actually keep of the dividend if I
          bought this?" Most HoldLens-tracked tickers are US-listed so
          payer defaults to US; non-US tickers (ASML, NVO, NESN, etc.)
          can be switched via the dropdown. Widget falls back to the
          statutory non-treaty rate for country pairs not yet verified
          in data/dividend-tax.json — never fabricates (AP-3). */}
      <section className="mt-12">
        <DividendTaxCalc mode="inline" tickerContext={t.symbol} />
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-panel p-8">
        <h2 className="text-2xl font-bold mb-3">Get alerts when they buy or sell {t.symbol}</h2>
        <p className="text-muted mb-6">
          One email per 13F filing — you'll know within hours if any tracked manager moves on {t.symbol}.
        </p>
        <EmailCapture />
      </section>

      <AffiliateCTA symbol={t.symbol} />

      {/* Retention cross-link (v0.91) — same-sector + co-owned tickers.
          Proven on /signal/[ticker]; here it converts bounce from /ticker
          into a second page-view without any new client JS. */}
      <section className="mt-16 pt-10 border-t border-border">
        <RelatedSignals symbol={t.symbol} />
      </section>

      <p className="text-xs text-dim mt-16">
        Data sourced from SEC 13F filings. {t.symbol} ownership reflects publicly disclosed long positions only.
        Not investment advice.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-panel px-5 py-4">
      <div className="text-xs uppercase tracking-wider text-dim">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}
