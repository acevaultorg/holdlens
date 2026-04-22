import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  INSIDER_TX,
  allInsiderTickers,
  getInsiderTx,
  fmtInsiderValue,
  fmtInsiderDate,
  type InsiderTx,
} from "@/lib/insiders";
import {
  computeInsiderScore,
  insiderScoreLabel,
  officerSlug,
} from "@/lib/insider-score";
import { TICKER_INDEX } from "@/lib/tickers";
import TickerLogo from "@/components/TickerLogo";
import AdSlot from "@/components/AdSlot";

// /insiders/company/[ticker]/ — per-company insider roll-up. Every tracked
// Form 4 transaction for one company, grouped by officer, with an aggregate
// InsiderScore for the company as a whole.
//
// PPC tier: per-entity-detail ($0.005/req per llms.txt).
// Static-exported — generateStaticParams returns one page per ticker that
// has at least one tracked transaction. Day-2 EDGAR scraper swap expands
// this from ~20 tickers to however-many-have-recent-Form 4 activity.

type Props = { params: Promise<{ ticker: string }> };

export async function generateStaticParams() {
  return allInsiderTickers().map((t) => ({ ticker: t.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params;
  const sym = ticker.toUpperCase();
  const info = TICKER_INDEX[sym];
  const companyName = info?.name ?? sym;
  const transactions = getInsiderTx(sym);
  if (transactions.length === 0) {
    return { title: "Not found" };
  }
  const score = computeInsiderScore(transactions);
  const label = insiderScoreLabel(score.score).label;

  const title = `${sym} insider activity · InsiderScore ${score.score > 0 ? "+" : ""}${score.score} ${label} — HoldLens`;
  const description = `${companyName} (${sym}) Form 4 insider trading activity — ${transactions.length} tracked transactions from CEOs, CFOs, and directors. Current HoldLens InsiderScore: ${score.score > 0 ? "+" : ""}${score.score} (${label}).`;

  return {
    title,
    description,
    alternates: { canonical: `https://holdlens.com/insiders/company/${sym.toLowerCase()}/` },
    openGraph: {
      title,
      description,
      url: `https://holdlens.com/insiders/company/${sym.toLowerCase()}/`,
      type: "website",
      images: [
        { url: "/og/home.png", width: 1200, height: 630, alt: `${sym} insider activity` },
      ],
    },
  };
}

export const dynamic = "force-static";

function isDiscretionary(tx: InsiderTx): boolean {
  return !(tx.note || "").toLowerCase().includes("10b5-1");
}

export default async function InsidersCompanyPage({ params }: Props) {
  const { ticker } = await params;
  const sym = ticker.toUpperCase();
  const transactions = getInsiderTx(sym);
  if (transactions.length === 0) notFound();

  const info = TICKER_INDEX[sym];
  const companyName = info?.name ?? sym;
  const score = computeInsiderScore(transactions);
  const { label, tone } = insiderScoreLabel(score.score);

  const buys = transactions.filter((t) => t.action === "buy");
  const sells = transactions.filter((t) => t.action === "sell");
  const discretionarySells = sells.filter(isDiscretionary);
  const scheduledSells = sells.filter((t) => !isDiscretionary(t));
  const totalBuyValue = buys.reduce((s, t) => s + t.value, 0);
  const totalSellValue = sells.reduce((s, t) => s + t.value, 0);

  const officerNames = Array.from(new Set(transactions.map((t) => t.insiderName)));

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
        "@id": `https://holdlens.com/insiders/company/${sym.toLowerCase()}/#dataset`,
        name: `${companyName} (${sym}) insider activity`,
        description: `SEC Form 4 insider trading activity for ${companyName} — every tracked CEO, CFO, Chair, Director, and 10%+ owner transaction, scored on the HoldLens InsiderScore.`,
        url: `https://holdlens.com/insiders/company/${sym.toLowerCase()}/`,
        creator: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com" },
        license: "https://holdlens.com/api-terms",
        isBasedOn: "https://www.sec.gov/edgar.shtml",
        variableMeasured: [
          { "@type": "PropertyValue", name: "Ticker" },
          { "@type": "PropertyValue", name: "Insider name" },
          { "@type": "PropertyValue", name: "Insider title" },
          { "@type": "PropertyValue", name: "Action (buy/sell)" },
          { "@type": "PropertyValue", name: "Transaction date" },
          { "@type": "PropertyValue", name: "Share count" },
          { "@type": "PropertyValue", name: "Price per share (USD)" },
          { "@type": "PropertyValue", name: "InsiderScore contribution" },
        ],
        mentions: { "@id": "https://holdlens.com/#term-insider-score" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com/" },
          { "@type": "ListItem", position: 2, name: "Insiders", item: "https://holdlens.com/insiders/" },
          { "@type": "ListItem", position: 3, name: "Companies", item: "https://holdlens.com/insiders/live/" },
          {
            "@type": "ListItem",
            position: 4,
            name: `${companyName} (${sym})`,
            item: `https://holdlens.com/insiders/company/${sym.toLowerCase()}/`,
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
        <Link href="/insiders/" className="hover:text-text">Insiders</Link>
        <span>/</span>
        <Link href="/insiders/live/" className="hover:text-text">Live feed</Link>
        <span>/</span>
        <span className="text-muted font-mono">{sym}</span>
      </nav>

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Company insider activity
      </div>

      <div className="flex items-center gap-4 mb-4">
        <TickerLogo symbol={sym} size={40} />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          <span className="font-mono text-brand">{sym}</span>
          <span className="text-text/70"> — </span>
          <span className="text-text">insider activity</span>
        </h1>
      </div>
      <p className="text-muted text-lg leading-relaxed mb-8 max-w-2xl">
        {companyName} — {transactions.length} tracked Form 4 transaction
        {transactions.length === 1 ? "" : "s"} across{" "}
        {officerNames.length} distinct insider
        {officerNames.length === 1 ? "" : "s"}. Scored on HoldLens&apos;s signed
        −100..+100{" "}
        <Link href="/insiders/" className="underline hover:text-text">
          InsiderScore
        </Link>
        .
      </p>

      {/* Score hero card */}
      <div
        className={`rounded-2xl border ${toneClasses.split(" ")[0]} ${toneClasses.split(" ")[1]} p-6 mb-10 flex items-center justify-between flex-wrap gap-4`}
      >
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold mb-2 text-dim">
            HoldLens InsiderScore
          </div>
          <div
            className={`text-5xl sm:text-6xl font-bold tabular-nums ${toneClasses.split(" ")[2]}`}
          >
            {score.score > 0 ? "+" : ""}
            {score.score}
          </div>
          <div className={`text-sm font-bold uppercase tracking-widest mt-2 ${toneClasses.split(" ")[2]}`}>
            {label}
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="rounded-lg border border-border bg-bg/50 px-4 py-2">
            <div className="text-[10px] uppercase tracking-widest text-dim">Buys</div>
            <div className="text-xl font-bold text-emerald-400 tabular-nums">{buys.length}</div>
            <div className="text-[10px] text-dim">{fmtInsiderValue(totalBuyValue)}</div>
          </div>
          <div className="rounded-lg border border-border bg-bg/50 px-4 py-2">
            <div className="text-[10px] uppercase tracking-widest text-dim">Sells</div>
            <div className="text-xl font-bold text-rose-400 tabular-nums">{sells.length}</div>
            <div className="text-[10px] text-dim">{fmtInsiderValue(totalSellValue)}</div>
          </div>
          <div className="rounded-lg border border-border bg-bg/50 px-4 py-2">
            <div className="text-[10px] uppercase tracking-widest text-dim">Cluster</div>
            <div className="text-xl font-bold text-text tabular-nums">
              {score.isCluster ? "Yes" : "No"}
            </div>
            <div className="text-[10px] text-dim">3+ officers · 30d</div>
          </div>
          <div className="rounded-lg border border-border bg-bg/50 px-4 py-2">
            <div className="text-[10px] uppercase tracking-widest text-dim">Confidence</div>
            <div className="text-xl font-bold text-text tabular-nums">
              {Math.round(score.confidence * 100)}%
            </div>
            <div className="text-[10px] text-dim">sample × size</div>
          </div>
        </div>
      </div>

      {/* All transactions */}
      <h2 className="text-2xl font-bold text-text mb-4">All tracked transactions</h2>
      <div className="rounded-2xl border border-border bg-panel overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-dim text-[10px] uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold">Insider</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Title</th>
                <th className="text-center px-4 py-3 font-semibold">Action</th>
                <th className="text-right px-4 py-3 font-semibold">Value</th>
                <th className="text-right px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => {
                const disc = isDiscretionary(tx);
                const isBuy = tx.action === "buy";
                return (
                  <tr
                    key={`${tx.insiderName}-${tx.date}-${i}`}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 text-text">
                      <Link
                        href={`/insiders/officer/${officerSlug(tx.insiderName, tx.ticker)}/`}
                        className="hover:underline"
                      >
                        {tx.insiderName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs hidden md:table-cell">
                      {tx.insiderTitle}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold ${
                          isBuy
                            ? "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30"
                            : disc
                            ? "bg-rose-400/15 text-rose-400 border border-rose-400/30"
                            : "bg-dim/10 text-dim border border-border"
                        }`}
                      >
                        {isBuy ? "BUY" : disc ? "SELL" : "10b5-1"}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono tabular-nums ${
                        isBuy
                          ? "text-emerald-400 font-semibold"
                          : disc
                          ? "text-rose-400 font-semibold"
                          : "text-dim"
                      }`}
                    >
                      {fmtInsiderValue(tx.value)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[11px] text-dim whitespace-nowrap hidden sm:table-cell">
                      {fmtInsiderDate(tx.date)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AdSlot format="horizontal" />

      {/* Related */}
      <section className="border-t border-border pt-12 mt-12">
        <h2 className="text-xl font-bold text-text mb-6">Related</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href={`/signal/${sym}/`}
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">
              {sym} ConvictionScore
            </div>
            <div className="text-xs text-muted">
              Full 13F + InsiderScore unified signal for {companyName}.
            </div>
          </Link>
          <Link
            href="/insiders/live/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-emerald-400/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Live insider feed</div>
            <div className="text-xs text-muted">
              Every tracked Form 4 across all companies, chronological.
            </div>
          </Link>
          <Link
            href="/insiders/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Insider methodology</div>
            <div className="text-xs text-muted">
              How InsiderScore is computed — role, action, recency, cluster bonus.
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
