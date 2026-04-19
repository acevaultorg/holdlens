import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  computeInsiderSummaries,
  getInsiderSummary,
} from "@/lib/insider-conviction";
import { fmtInsiderValue, fmtInsiderDate } from "@/lib/insiders";

// Ship #2 v1 — /insiders/[insider]/ per-corporate-insider programmatic
// pages. Each page answers "What has [CEO name] been buying or selling?"
// with a conviction score synthesized from their Form 4 history.
//
// Pages generated statically at build time from the unique insider
// set in lib/insiders.ts.

export async function generateStaticParams() {
  const all = computeInsiderSummaries();
  return [...all.keys()].map((insider) => ({ insider }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ insider: string }> },
): Promise<Metadata> {
  const { insider } = await params;
  const s = getInsiderSummary(insider);
  if (!s) return { title: "Insider not found" };
  const title = `${s.name} (${s.title}) — Form 4 insider trading history`;
  const description = `${s.name}'s corporate insider transactions: ${s.buy_count} buy${s.buy_count !== 1 ? "s" : ""} totalling ${fmtInsiderValue(s.buy_value)} and ${s.sell_count} sell${s.sell_count !== 1 ? "s" : ""} totalling ${fmtInsiderValue(s.sell_value)}. Conviction score synthesized from SEC Form 4 filings.`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://holdlens.com/insiders/${s.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://holdlens.com/insiders/${s.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${s.name} — insider trading history`,
    },
  };
}

function scoreColorClass(score: number): string {
  if (score >= 40) return "text-emerald-400";
  if (score >= 10) return "text-emerald-400/80";
  if (score <= -40) return "text-rose-400";
  if (score <= -10) return "text-rose-400/80";
  return "text-muted";
}

function scoreLabel(score: number): string {
  if (score >= 60) return "Strong buy signal";
  if (score >= 20) return "Buy signal";
  if (score >= -10) return "Neutral";
  if (score >= -40) return "Sell signal";
  return "Strong sell signal";
}

export default async function InsiderPage(
  { params }: { params: Promise<{ insider: string }> },
) {
  const { insider } = await params;
  const s = getInsiderSummary(insider);
  if (!s) notFound();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Insider activity", item: "https://holdlens.com/insiders" },
      { "@type": "ListItem", position: 3, name: s.name, item: `https://holdlens.com/insiders/${s.slug}` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${s.name} — SEC Form 4 insider transactions + conviction score`,
    description: `Corporate insider trading history for ${s.name}, synthesized from SEC Form 4 filings into a single conviction score.`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://holdlens.com/insiders/${s.slug}`,
    },
    datePublished: "2026-04-19",
    publisher: { "@id": "https://holdlens.com/#organization" },
  };

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: s.name,
    jobTitle: s.title,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      <a href="/insiders" className="text-xs text-muted hover:text-text">← All insider activity</a>

      <header className="mt-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          Corporate insider · Form 4
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          {s.name}
        </h1>
        <p className="text-muted text-lg mt-2">{s.title}</p>
      </header>

      <section className="mt-10 grid sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-panel px-5 py-4">
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">Conviction score</div>
          <div className={`text-3xl font-bold tabular-nums mt-1 ${scoreColorClass(s.conviction_score)}`}>
            {s.conviction_score > 0 ? "+" : ""}{s.conviction_score}
          </div>
          <div className="text-[11px] text-dim mt-0.5">{scoreLabel(s.conviction_score)}</div>
        </div>
        <div className="rounded-2xl border border-border bg-panel px-5 py-4">
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">Buys</div>
          <div className="text-xl font-semibold text-emerald-400 tabular-nums mt-1">{fmtInsiderValue(s.buy_value)}</div>
          <div className="text-[11px] text-dim mt-0.5">{s.buy_count} transaction{s.buy_count !== 1 ? "s" : ""}</div>
        </div>
        <div className="rounded-2xl border border-border bg-panel px-5 py-4">
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">Sells</div>
          <div className="text-xl font-semibold text-rose-400 tabular-nums mt-1">{fmtInsiderValue(s.sell_value)}</div>
          <div className="text-[11px] text-dim mt-0.5">
            {s.sell_count} transaction{s.sell_count !== 1 ? "s" : ""}
            {s.discretionary_sell_value > 0 && (
              <> · {fmtInsiderValue(s.discretionary_sell_value)} discretionary</>
            )}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-3">All tracked transactions</h2>
        <p className="text-muted text-sm mb-5">
          Curated subset of {s.name}&apos;s SEC Form 4 filings. Routine 10b5-1 schedule sales are flagged inline and weighted less in the conviction score.
        </p>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Ticker</th>
                <th className="text-left px-4 py-3">Action</th>
                <th className="text-right px-4 py-3">Value</th>
              </tr>
            </thead>
            <tbody>
              {s.transactions.map((tx, i) => (
                <tr key={i} className="border-b border-border last:border-0 align-top">
                  <td className="px-4 py-3 text-xs text-dim tabular-nums whitespace-nowrap">
                    {fmtInsiderDate(tx.date)}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`/ticker/${tx.ticker}`} className="font-semibold text-brand hover:underline">
                      {tx.ticker}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className={tx.action === "buy"
                      ? "inline-flex items-center text-[10px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded px-2 py-0.5"
                      : "inline-flex items-center text-[10px] font-bold uppercase tracking-wide text-rose-400 bg-rose-400/10 border border-rose-400/30 rounded px-2 py-0.5"
                    }>
                      {tx.action}
                    </span>
                    {tx.note && (
                      <div className="text-[11px] text-dim mt-1">{tx.note}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <div className={tx.action === "buy" ? "font-semibold text-emerald-400" : "font-semibold text-rose-400/90"}>
                      {fmtInsiderValue(tx.value)}
                    </div>
                    <div className="text-[11px] text-dim mt-0.5">
                      {tx.shares.toLocaleString()} × ${tx.pricePerShare}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Method</h2>
        <div className="rounded-xl border border-border bg-panel p-5 text-sm text-muted leading-relaxed space-y-2">
          <p>
            <strong className="text-text">Conviction score</strong> = logistic(role_weight × (buy_value − 0.2 × discretionary_sell_value)) mapped to −100..+100. CEOs and founders carry role_weight 0.95-1.0; directors 0.5; former executives 0.3. Routine 10b5-1 schedule sales are weighted down sharply — insiders file pre-arranged selling plans that trigger independent of their view of the stock, so they carry minimal signal. Open-market discretionary buys are rare and carry the heaviest weight.
          </p>
          <p>
            <strong className="text-text">Role weight:</strong> {s.role_weight.toFixed(2)} ({s.title}).
          </p>
          <p>
            Data sourced from SEC Form 4 filings via EDGAR. Curated subset (not every filing) — we prioritize CEO/CFO/Chair/10%-owner transactions and material $ amounts over noise.
          </p>
        </div>
      </section>

      {s.tickers.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-3">Tickers {s.name.split(" ")[0]} has traded</h2>
          <div className="flex flex-wrap gap-2">
            {s.tickers.map((t) => (
              <a
                key={t}
                href={`/ticker/${t}`}
                className="inline-flex items-center rounded-lg bg-panel border border-border hover:border-brand hover:text-brand text-text px-3 py-2 text-sm font-semibold transition"
              >
                {t}
              </a>
            ))}
          </div>
        </section>
      )}

      <p className="mt-16 text-xs text-dim">
        SEC Form 4 filings disclose trades by corporate insiders within 2 business days. Conviction scoring is a synthesis — not investment advice.
      </p>
    </div>
  );
}
