import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import {
  CONGRESS_MEMBERS,
  getMember,
  formatRange,
  formatAmount,
} from "@/lib/congress";
import { getTicker } from "@/lib/tickers";

export async function generateStaticParams() {
  return CONGRESS_MEMBERS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getMember(slug);
  if (!m) return { title: "Member not tracked" };
  return {
    title: `${m.name} stock trades — ${m.chamber} ${m.party}-${m.state} STOCK Act disclosures`,
    description: `${m.name} (${m.chamber} ${m.party}-${m.state}) disclosed stock trades under the STOCK Act. Recent transactions, top sectors, committee positions. ${m.recentTrades.length} trades on file.`,
    alternates: { canonical: `https://holdlens.com/congress/${m.slug}` },
    openGraph: {
      title: `${m.name} · ${m.chamber} stock trades`,
      description: `STOCK Act disclosures from ${m.name} — ${m.recentTrades.length} recent trades.`,
      url: `https://holdlens.com/congress/${m.slug}`,
      type: "article",
      images: [
        { url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens" },
      ],
    },
    robots: { index: true, follow: true },
  };
}

export default async function CongressDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = getMember(slug);
  if (!m) notFound();

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.name,
    jobTitle: m.chamber === "Senate" ? "U.S. Senator" : "U.S. Representative",
    affiliation: {
      "@type": "GovernmentOrganization",
      name: m.chamber === "Senate" ? "United States Senate" : "United States House of Representatives",
    },
    homeLocation: { "@type": "Place", name: m.state },
    url: `https://holdlens.com/congress/${m.slug}`,
  };
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${m.name} STOCK Act trade disclosures`,
    datePublished: m.recentTrades[0]?.reportedDate ?? "2026-04-20",
    dateModified: m.recentTrades[0]?.reportedDate ?? "2026-04-20",
    author: { "@type": "Organization", name: "HoldLens" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
    mainEntityOfPage: `https://holdlens.com/congress/${m.slug}`,
    description: m.notableTrade ?? `Disclosed stock trades by ${m.name}.`,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Congress", item: "https://holdlens.com/congress" },
      {
        "@type": "ListItem",
        position: 3,
        name: m.name,
        item: `https://holdlens.com/congress/${m.slug}`,
      },
    ],
  };

  const netBuys = m.estimatedNetBuysUsdLow - m.estimatedNetSellsUsdLow;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <a href="/congress" className="text-xs text-muted hover:text-text">
        ← All congressional traders
      </a>

      <div className="mt-6 mb-3 text-xs uppercase tracking-widest text-brand font-semibold">
        {m.chamber} · {m.party}-{m.state} · STOCK Act disclosure
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">
        {m.name}
      </h1>
      <p className="text-muted text-lg mb-8">
        {m.committees.join(" · ")}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <Stat
          label="Net buys"
          value={formatAmount(Math.max(0, netBuys))}
          tone={netBuys > 0 ? "emerald" : undefined}
        />
        <Stat
          label="Total activity"
          value={formatAmount(
            m.estimatedNetBuysUsdLow + m.estimatedNetSellsUsdLow,
          )}
        />
        <Stat label="Trades on file" value={`${m.recentTrades.length}`} />
        <Stat label="Top sector" value={m.topSectors[0]} />
      </div>

      {m.notableTrade && (
        <aside
          className="mb-10 rounded-card border border-insight/30 bg-surface-insight p-5"
          aria-label="Notable trade"
        >
          <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-2">
            Notable
          </div>
          <p className="text-sm text-text leading-relaxed">{m.notableTrade}</p>
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
          {m.name} ({m.chamber} {m.party}-{m.state}) has disclosed roughly{" "}
          <span className="font-bold tabular-nums">
            {formatAmount(
              m.estimatedNetBuysUsdLow + m.estimatedNetSellsUsdLow,
            )}
          </span>{" "}
          in stock trading activity over {m.netActivityWindow}, with net
          buying of <span className="font-bold tabular-nums">{formatAmount(Math.max(0, netBuys))}</span> on the low end of disclosed brackets.
          Top sector concentration:{" "}
          <span className="font-bold">{m.topSectors.join(", ")}</span>.
          STOCK Act discloses dollar ranges, not exact amounts; figures
          shown are conservative low-end estimates.
        </p>
      </aside>

      {m.controversies && (
        <aside
          className="mb-10 rounded-card border border-amber-500/30 bg-amber-500/5 p-5"
          aria-label="Public scrutiny"
        >
          <div className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-2">
            Public scrutiny
          </div>
          <p className="text-sm text-text leading-relaxed">
            {m.controversies}
          </p>
        </aside>
      )}

      <AdSlot format="horizontal" />

      {/* Recent trades */}
      <section className="mt-12 mb-12">
        <h2 className="text-xl font-bold mb-3">Recent disclosed trades</h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-right">Range</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Trade date</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Latency</th>
              </tr>
            </thead>
            <tbody>
              {m.recentTrades.map((t, i) => (
                <tr
                  key={`${t.ticker}-${t.transactionDate}-${i}`}
                  className="border-b border-border last:border-0 hover:bg-bg/30 transition"
                >
                  <td className="px-4 py-3">
                    {getTicker(t.ticker) ? (
                      <a
                        href={`/ticker/${t.ticker}/`}
                        className="inline-flex items-center gap-2 font-mono font-bold text-brand hover:underline"
                      >
                        <TickerLogo symbol={t.ticker} size={20} />
                        {t.ticker}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 font-mono font-bold text-text">
                        <TickerLogo symbol={t.ticker} size={20} />
                        {t.ticker}
                      </span>
                    )}
                    <div className="text-[11px] text-dim">{t.companyName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        t.action === "buy"
                          ? "text-emerald-400 font-semibold"
                          : "text-rose-400 font-semibold"
                      }
                    >
                      {t.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {formatRange(t.amountRangeMin, t.amountRangeMax)}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted tabular-nums hidden sm:table-cell">
                    {t.transactionDate}
                  </td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums hidden md:table-cell text-xs ${
                      t.reportLatencyDays > 45
                        ? "text-rose-400 font-semibold"
                        : "text-muted"
                    }`}
                  >
                    {t.reportLatencyDays}d
                    {t.reportLatencyDays > 45 ? " (late)" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Source */}
      <section className="mt-10 mb-12">
        <h2 className="text-xl font-bold mb-3">Disclosure source</h2>
        <a
          href={m.source.disclosureHubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-border bg-panel p-5 hover:border-brand/40 transition"
        >
          <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
            {m.source.chamber === "Senate"
              ? "Senate Office of Public Records"
              : "U.S. House Clerk financial disclosures"}
          </div>
          <div className="text-sm font-semibold text-brand mb-1 break-all">
            {m.source.disclosureHubUrl} ↗
          </div>
          {m.source.note && (
            <div className="text-xs text-muted mt-2">{m.source.note}</div>
          )}
        </a>
      </section>

      <p className="text-xs text-dim mt-16">
        Data sourced from official U.S. House Clerk financial disclosures and
        the U.S. Senate Office of Public Records (eFD). STOCK Act discloses
        transaction dollar ranges, not exact amounts. Trade values shown are
        the bracket low end. Reporting latency &gt;45 days is a STOCK Act
        violation subject to fines. Not investment advice.
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
  tone?: "emerald" | "rose";
}) {
  const toneClass =
    tone === "emerald"
      ? "text-emerald-400"
      : tone === "rose"
      ? "text-rose-400"
      : "";
  return (
    <div className="rounded-xl border border-border bg-panel px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-dim">
        {label}
      </div>
      <div className={`text-base font-semibold mt-1 tabular-nums ${toneClass}`}>
        {value}
      </div>
    </div>
  );
}
