import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allOfficerEntries,
  fmtInsiderValue,
  fmtInsiderDate,
  type InsiderTx,
} from "@/lib/insiders";
import {
  computeInsiderScore,
  insiderScoreLabel,
} from "@/lib/insider-score";
import { TICKER_INDEX } from "@/lib/tickers";
import TickerLogo from "@/components/TickerLogo";
import AdSlot from "@/components/AdSlot";

// /insiders/officer/[slug]/ — per-officer Form 4 detail page. Slug pattern
// is `[normalized-name]-[ticker]` (see lib/insider-score.ts → officerSlug)
// so same-named officers at different companies stay distinct. Example:
// `tim-cook-aapl` vs `john-smith-orcl`.
//
// Complements the legacy /insiders/[insider]/ path (v0.1 slug without
// ticker suffix) — the legacy pages keep serving for link inertia; new
// content uses this canonical pattern.
//
// PPC tier: per-entity-detail ($0.005/req per llms.txt).

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allOfficerEntries().map((e) => ({ slug: e.slug }));
}

function entryForSlug(slug: string) {
  return allOfficerEntries().find((e) => e.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = entryForSlug(slug);
  if (!entry) return { title: "Not found" };

  const score = computeInsiderScore(entry.transactions);
  const { label } = insiderScoreLabel(score.score);
  const info = TICKER_INDEX[entry.ticker];
  const companyName = info?.name ?? entry.ticker;

  const title = `${entry.name} (${entry.title}, ${entry.ticker}) insider activity · InsiderScore ${score.score > 0 ? "+" : ""}${score.score} ${label} — HoldLens`;
  const description = `${entry.name}, ${entry.title} at ${companyName} (${entry.ticker}) — ${entry.transactions.length} tracked SEC Form 4 transactions. HoldLens InsiderScore: ${score.score > 0 ? "+" : ""}${score.score} (${label}).`;

  return {
    title,
    description,
    alternates: { canonical: `https://holdlens.com/insiders/officer/${slug}/` },
    openGraph: {
      title,
      description,
      url: `https://holdlens.com/insiders/officer/${slug}/`,
      type: "profile",
      images: [{ url: "/og/home.png", width: 1200, height: 630, alt: `${entry.name} insider activity` }],
    },
  };
}

export const dynamic = "force-static";

function isDiscretionary(tx: InsiderTx): boolean {
  return !(tx.note || "").toLowerCase().includes("10b5-1");
}

export default async function InsidersOfficerPage({ params }: Props) {
  const { slug } = await params;
  const entry = entryForSlug(slug);
  if (!entry) notFound();

  const score = computeInsiderScore(entry.transactions);
  const { label, tone } = insiderScoreLabel(score.score);
  const info = TICKER_INDEX[entry.ticker];
  const companyName = info?.name ?? entry.ticker;

  const buys = entry.transactions.filter((t) => t.action === "buy");
  const sells = entry.transactions.filter((t) => t.action === "sell");
  const totalBuyValue = buys.reduce((s, t) => s + t.value, 0);
  const totalSellValue = sells.reduce((s, t) => s + t.value, 0);

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
        "@type": "Person",
        "@id": `https://holdlens.com/insiders/officer/${slug}/#person`,
        name: entry.name,
        jobTitle: entry.title,
        worksFor: {
          "@type": "Organization",
          name: companyName,
          tickerSymbol: entry.ticker,
        },
        url: `https://holdlens.com/insiders/officer/${slug}/`,
      },
      {
        "@type": "Article",
        "@id": `https://holdlens.com/insiders/officer/${slug}/#article`,
        headline: `${entry.name} (${entry.title}) — insider activity`,
        description: `Tracked SEC Form 4 insider transactions for ${entry.name}, ${entry.title} at ${companyName}. HoldLens InsiderScore: ${score.score > 0 ? "+" : ""}${score.score}.`,
        url: `https://holdlens.com/insiders/officer/${slug}/`,
        author: { "@type": "Organization", name: "HoldLens" },
        mentions: { "@id": "https://holdlens.com/#term-insider-score" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com/" },
          { "@type": "ListItem", position: 2, name: "Insiders", item: "https://holdlens.com/insiders/" },
          {
            "@type": "ListItem",
            position: 3,
            name: `${companyName} (${entry.ticker})`,
            item: `https://holdlens.com/insiders/company/${entry.ticker.toLowerCase()}/`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: entry.name,
            item: `https://holdlens.com/insiders/officer/${slug}/`,
          },
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
        <Link href="/insiders/" className="hover:text-text">Insiders</Link>
        <span>/</span>
        <Link href={`/insiders/company/${entry.ticker.toLowerCase()}/`} className="hover:text-text">
          {entry.ticker}
        </Link>
        <span>/</span>
        <span className="text-muted">{entry.name}</span>
      </nav>

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Corporate insider
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3">
        {entry.name}
      </h1>
      <div className="flex items-center gap-3 text-muted mb-8 flex-wrap">
        <span className="text-sm">{entry.title}</span>
        <span className="text-dim">·</span>
        <Link
          href={`/insiders/company/${entry.ticker.toLowerCase()}/`}
          className="inline-flex items-center gap-1.5 font-mono text-brand hover:underline"
        >
          <TickerLogo symbol={entry.ticker} size={16} />
          {entry.ticker}
        </Link>
        <span className="text-dim">·</span>
        <span className="text-sm">{companyName}</span>
      </div>

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
            <div className="text-[10px] uppercase tracking-widest text-dim">Dominant</div>
            <div className="text-xl font-bold text-text capitalize">{score.dominantAction}</div>
          </div>
          <div className="rounded-lg border border-border bg-bg/50 px-4 py-2">
            <div className="text-[10px] uppercase tracking-widest text-dim">Confidence</div>
            <div className="text-xl font-bold text-text tabular-nums">
              {Math.round(score.confidence * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <h2 className="text-2xl font-bold text-text mb-4">Transaction history</h2>
      <div className="rounded-2xl border border-border bg-panel overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-dim text-[10px] uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-center px-4 py-3 font-semibold">Action</th>
                <th className="text-right px-4 py-3 font-semibold">Shares</th>
                <th className="text-right px-4 py-3 font-semibold">Price</th>
                <th className="text-right px-4 py-3 font-semibold">Value</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Note</th>
              </tr>
            </thead>
            <tbody>
              {entry.transactions.map((tx, i) => {
                const disc = isDiscretionary(tx);
                const isBuy = tx.action === "buy";
                return (
                  <tr
                    key={`${tx.date}-${i}`}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 font-mono text-[11px] text-dim whitespace-nowrap">
                      {fmtInsiderDate(tx.date)}
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
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-text">
                      {tx.shares.toLocaleString("en-US")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted tabular-nums">
                      ${tx.pricePerShare}
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
                    <td className="px-4 py-3 text-xs text-muted hidden lg:table-cell">
                      {tx.note || ""}
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
        <h2 className="text-xl font-bold text-text mb-6">Related</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href={`/insiders/company/${entry.ticker.toLowerCase()}/`}
            className="rounded-xl border border-border bg-panel p-5 hover:border-emerald-400/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">
              All {entry.ticker} insiders
            </div>
            <div className="text-xs text-muted">
              Every tracked officer at {companyName} — aggregate InsiderScore + all Form 4s.
            </div>
          </Link>
          <Link
            href={`/signal/${entry.ticker}/`}
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">
              {entry.ticker} ConvictionScore
            </div>
            <div className="text-xs text-muted">
              Full 13F + InsiderScore unified signal for {companyName}.
            </div>
          </Link>
          <Link
            href="/insiders/live/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Live insider feed</div>
            <div className="text-xs text-muted">
              Every tracked Form 4 across all companies, chronological.
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
