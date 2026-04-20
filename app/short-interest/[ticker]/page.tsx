import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import {
  SHORT_POSITIONS,
  getShortPosition,
  formatShares,
  formatPct,
} from "@/lib/short-interest";

export async function generateStaticParams() {
  return SHORT_POSITIONS.map((p) => ({ ticker: p.ticker }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}): Promise<Metadata> {
  const { ticker } = await params;
  const p = getShortPosition(ticker);
  if (!p) return { title: "Short interest not tracked for this ticker" };
  return {
    title: `${p.ticker} short interest — ${p.shortInterestPctFloat.toFixed(1)}% of float, ${p.daysToCover.toFixed(1)} days to cover`,
    description: `${p.companyName} (${p.ticker}) has ${formatShares(p.shortInterestShares)} shares shorted (${p.shortInterestPctFloat.toFixed(1)}% of float). Days to cover: ${p.daysToCover.toFixed(1)}. Settlement ${p.settlementDate}.`,
    alternates: { canonical: `https://holdlens.com/short-interest/${p.ticker}` },
    openGraph: {
      title: `${p.ticker} short interest`,
      description: `${formatShares(p.shortInterestShares)} shares short — ${p.shortInterestPctFloat.toFixed(1)}% of float`,
      url: `https://holdlens.com/short-interest/${p.ticker}`,
      type: "article",
      images: [
        { url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens" },
      ],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ShortInterestDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const p = getShortPosition(ticker);
  if (!p) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${p.ticker} short interest — ${p.shortInterestPctFloat.toFixed(1)}% of float`,
    datePublished: p.reportDate,
    dateModified: p.reportDate,
    author: { "@type": "Organization", name: "HoldLens" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
    mainEntityOfPage: `https://holdlens.com/short-interest/${p.ticker}`,
    description: p.thesisShort ?? "Short interest tracking page.",
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Short Interest", item: "https://holdlens.com/short-interest" },
      {
        "@type": "ListItem",
        position: 3,
        name: p.ticker,
        item: `https://holdlens.com/short-interest/${p.ticker}`,
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <a href="/short-interest" className="text-xs text-muted hover:text-text">
        ← All short positions
      </a>

      <div className="mt-6 mb-3 text-xs uppercase tracking-widest text-brand font-semibold">
        Short interest · Settled {p.settlementDate}
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3 flex items-center gap-3 flex-wrap">
        <TickerLogo symbol={p.ticker} size={40} />
        <span className="text-brand">{p.ticker}</span>
        <span className="text-text">short interest</span>
      </h1>
      <p className="text-muted text-lg mb-8">{p.companyName} · {p.sector}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <Stat
          label="% of float"
          value={`${p.shortInterestPctFloat.toFixed(1)}%`}
          tone="rose"
        />
        <Stat
          label="Shares short"
          value={formatShares(p.shortInterestShares)}
        />
        <Stat
          label="Days to cover"
          value={p.daysToCover.toFixed(1)}
          tone="amber"
        />
        <Stat
          label="Δ vs prior"
          value={formatPct(p.changeVsPriorPct)}
          tone={p.changeVsPriorPct >= 0 ? "rose" : "emerald"}
        />
      </div>

      {p.thesisShort && (
        <aside
          className="mb-10 rounded-card border border-insight/30 bg-surface-insight p-5"
          aria-label="Short thesis"
        >
          <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-2">
            Short thesis
          </div>
          <p className="text-sm text-text leading-relaxed">{p.thesisShort}</p>
        </aside>
      )}

      <aside
        className="mb-10 rounded-card border border-border bg-panel p-5"
        aria-label="HoldLens read"
      >
        <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-2">
          HoldLens read
        </div>
        <p className="text-sm text-text leading-relaxed">
          {p.ticker} carries{" "}
          <span className="font-bold tabular-nums">
            {formatShares(p.shortInterestShares)}
          </span>{" "}
          shares sold short — about{" "}
          <span className="font-bold">
            {p.shortInterestPctFloat.toFixed(1)}% of the public float
          </span>
          . At average trading volume, it would take{" "}
          <span className="font-bold">
            {p.daysToCover.toFixed(1)} days
          </span>{" "}
          to repurchase every shorted share. Short interest{" "}
          {p.changeVsPriorPct >= 0 ? "grew" : "fell"} by{" "}
          <span className="font-bold">
            {Math.abs(p.changeVsPriorPct).toFixed(1)}%
          </span>{" "}
          versus the prior bi-monthly settlement, signaling{" "}
          {p.changeVsPriorPct >= 0
            ? "fresh shorting pressure."
            : "shorts covering."}
        </p>
      </aside>

      <AdSlot format="horizontal" />

      <section className="mt-10 mb-12">
        <h2 className="text-xl font-bold mb-3">Source disclosure</h2>
        <a
          href={p.source.reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-border bg-panel p-5 hover:border-brand/40 transition"
        >
          <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
            {p.source.exchange} · bi-monthly short-interest report
          </div>
          <div className="text-sm font-semibold text-brand mb-1 break-all">
            {p.source.reportUrl} ↗
          </div>
          <div className="text-xs text-muted mt-2">
            Settlement: {p.settlementDate} · Published: {p.reportDate}
          </div>
          {p.source.note && (
            <div className="text-xs text-muted mt-2">{p.source.note}</div>
          )}
        </a>
      </section>

      <section className="mt-10 mb-12">
        <h2 className="text-xl font-bold mb-3">More on {p.ticker}</h2>
        <a
          href={`/ticker/${p.ticker}/`}
          className="block rounded-2xl border border-brand/40 bg-brand/5 p-5 hover:bg-brand/10 transition group"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-1">
                Hedge fund ownership
              </div>
              <div className="text-lg font-bold group-hover:text-brand transition flex items-center gap-2">
                <TickerLogo symbol={p.ticker} size={22} />
                Who else owns {p.ticker}
              </div>
              <div className="text-xs text-muted mt-1">
                Tracked superinvestor positions, live quote, smart-money activity
              </div>
            </div>
            <div className="text-brand text-sm font-semibold">View →</div>
          </div>
        </a>
      </section>

      <p className="text-xs text-dim mt-16">
        Data sourced from FINRA / NYSE / Nasdaq bi-monthly short-interest
        disclosure. Reports lag the settlement date by 8 business days.
        Not investment advice.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "rose" | "amber" | "emerald";
}) {
  const toneClass =
    tone === "rose"
      ? "text-rose-400"
      : tone === "amber"
      ? "text-amber-400"
      : tone === "emerald"
      ? "text-emerald-400"
      : "";
  return (
    <div className="rounded-xl border border-border bg-panel px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-dim">{label}</div>
      <div className={`text-base font-semibold mt-1 tabular-nums ${toneClass}`}>
        {value}
      </div>
    </div>
  );
}
