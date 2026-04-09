import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MANAGERS } from "@/lib/managers";
import { topTickers } from "@/lib/tickers";

type Period = { slug: string; label: string; title: string; intro: string };

const PERIODS: Period[] = [
  {
    slug: "2026-q1",
    label: "Q1 2026",
    title: "Q1 2026 superinvestor recap",
    intro: "What the 10 tracked superinvestors bought, sold, and held in Q1 2026. 13F filings are due 45 days after quarter-end, so this recap reflects filings through May 15, 2026.",
  },
  {
    slug: "2025-q4",
    label: "Q4 2025",
    title: "Q4 2025 superinvestor recap",
    intro: "Year-end 2025 positions across tracked superinvestors. Filed between January and mid-February 2026.",
  },
];

export async function generateStaticParams() {
  return PERIODS.map((p) => ({ period: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ period: string }> }): Promise<Metadata> {
  const { period } = await params;
  const p = PERIODS.find((x) => x.slug === period);
  if (!p) return { title: "Period not found" };
  return {
    title: `${p.title} — Hedge fund holdings recap`,
    description: p.intro,
    twitter: { card: "summary_large_image", title: p.title },
    openGraph: { title: p.title, description: p.intro },
  };
}

export default async function QuarterlyPage({ params }: { params: Promise<{ period: string }> }) {
  const { period } = await params;
  const p = PERIODS.find((x) => x.slug === period);
  if (!p) notFound();

  const top = topTickers(10);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <a href="/quarterly" className="text-xs text-muted hover:text-text">← All quarterly recaps</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Quarterly recap</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">{p.title}</h1>
      <p className="text-lg text-muted mb-12">{p.intro}</p>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Top consensus positions</h2>
        <p className="text-muted text-sm mb-6">
          Ranked by number of tracked superinvestors holding the position. Higher = stronger consensus.
        </p>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-4 w-12">#</th>
                <th className="text-left px-5 py-4">Ticker</th>
                <th className="text-left px-5 py-4">Company</th>
                <th className="text-right px-5 py-4">Owners</th>
              </tr>
            </thead>
            <tbody>
              {top.map((t, i) => (
                <tr key={t.symbol} className="border-b border-border last:border-0 hover:bg-bg/50 transition">
                  <td className="px-5 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-5 py-3 font-mono font-semibold">
                    <a href={`/ticker/${t.symbol}`} className="text-brand hover:underline">{t.symbol}</a>
                  </td>
                  <td className="px-5 py-3 text-text">{t.name}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{t.ownerCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">All tracked managers this period</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {MANAGERS.map((m) => (
            <a key={m.slug} href={`/investor/${m.slug}`}
               className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition">
              <div className="font-semibold">{m.name}</div>
              <div className="text-xs text-muted mt-1">{m.fund}</div>
              <div className="text-xs text-dim mt-2">Top: <span className="font-mono text-brand">{m.topHoldings[0]?.ticker}</span> ({m.topHoldings[0]?.pct.toFixed(1)}%)</div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-panel p-8">
        <h2 className="text-2xl font-bold mb-3">Get next quarter's recap in your inbox</h2>
        <p className="text-muted mb-6">
          One email per quarter. Summarizes every move across all tracked managers.
        </p>
        <a href="/#subscribe" className="inline-block bg-brand text-black font-semibold rounded-xl px-5 py-3 hover:opacity-90 transition">
          Subscribe →
        </a>
      </section>

      <p className="text-xs text-dim mt-16">
        Based on public SEC 13F filings. <a href="/methodology" className="underline">Methodology</a>. Not investment advice.
      </p>
    </div>
  );
}
