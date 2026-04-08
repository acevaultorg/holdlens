import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TICKER_INDEX } from "@/lib/tickers";

const SECTORS = [
  "Technology", "Financials", "Energy", "Healthcare",
  "Consumer Discretionary", "Consumer Staples", "Industrials",
  "Materials", "Real Estate", "Communication", "Utilities",
];

function slugify(s: string) { return s.toLowerCase().replace(/\s+/g, "-"); }
function unslug(s: string) {
  return SECTORS.find((sec) => slugify(sec) === s);
}

export async function generateStaticParams() {
  return SECTORS.map((sec) => ({ slug: slugify(sec) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sector = unslug(slug);
  if (!sector) return { title: "Sector not found" };
  return {
    title: `${sector} stocks held by superinvestors`,
    description: `Hedge fund holdings in the ${sector} sector. Conviction, owner count, and key managers.`,
  };
}

export default async function SectorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = unslug(slug);
  if (!sector) notFound();

  const tickers = Object.values(TICKER_INDEX)
    .filter((t) => t.sector === sector)
    .sort((a, b) => b.ownerCount - a.ownerCount || b.totalConviction - a.totalConviction);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <a href="/ticker" className="text-xs text-muted hover:text-text">← All stocks</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Sector</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{sector}</h1>
      <p className="text-muted text-lg max-w-2xl mb-12">
        {tickers.length} {sector.toLowerCase()} stocks held by tracked superinvestors.
      </p>

      <div className="rounded-2xl border border-border bg-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-dim text-xs uppercase tracking-wider">
            <tr className="border-b border-border">
              <th className="text-left px-5 py-4">Ticker</th>
              <th className="text-left px-5 py-4">Company</th>
              <th className="text-right px-5 py-4">Owners</th>
              <th className="text-right px-5 py-4 hidden md:table-cell">Σ %</th>
            </tr>
          </thead>
          <tbody>
            {tickers.map((t) => (
              <tr key={t.symbol} className="border-b border-border last:border-0 hover:bg-bg/50 transition">
                <td className="px-5 py-3 font-mono font-semibold">
                  <a href={`/ticker/${t.symbol}`} className="text-brand hover:underline">{t.symbol}</a>
                </td>
                <td className="px-5 py-3 text-text">{t.name}</td>
                <td className="px-5 py-3 text-right tabular-nums">{t.ownerCount}</td>
                <td className="px-5 py-3 text-right tabular-nums text-muted hidden md:table-cell">{t.totalConviction.toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
