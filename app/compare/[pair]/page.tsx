import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import { TICKER_INDEX, getTicker, topTickers } from "@/lib/tickers";

// Generate top-N × top-N comparisons. Limit to 15 × 15 = 225 pages to keep build sane.
const TOP_N = 15;

export async function generateStaticParams() {
  const top = topTickers(TOP_N).map((t) => t.symbol);
  const params: { pair: string }[] = [];
  // Generate BOTH orderings — users type either direction and Google may index
  // either; both must return 200. Previously only a<b was generated, which 404'd
  // on the reverse. Page count doubles to ~420 which is still tiny.
  for (const a of top) {
    for (const b of top) {
      if (a !== b) params.push({ pair: `${a.toLowerCase()}-vs-${b.toLowerCase()}` });
    }
  }
  return params;
}

function parsePair(pair: string): [string, string] | null {
  const m = pair.match(/^(.+)-vs-(.+)$/);
  if (!m) return null;
  return [m[1].toUpperCase(), m[2].toUpperCase()];
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return { title: "Comparison not found" };
  const [a, b] = parsed;
  const ta = getTicker(a);
  const tb = getTicker(b);
  if (!ta || !tb) return { title: "Comparison not found" };
  return {
    title: `${a} vs ${b} — Hedge fund ownership compared`,
    description: `Compare ${a} (${ta.name}) vs ${b} (${tb.name}) by superinvestor ownership. Conviction, owner counts, and key holders.`,
    twitter: { card: "summary_large_image", title: `${a} vs ${b}` },
    openGraph: { title: `${a} vs ${b}`, description: `Hedge fund ownership of ${a} compared to ${b}.` },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();
  const [a, b] = parsed;
  const ta = getTicker(a);
  const tb = getTicker(b);
  if (!ta || !tb) notFound();

  // Find managers holding both
  const aOwners = new Set(ta.owners.map((o) => o.slug));
  const both = tb.owners.filter((o) => aOwners.has(o.slug));

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <a href="/ticker" className="text-xs text-muted hover:text-text">← All stocks</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Comparison</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2">
        <span className="text-brand">{a}</span> vs <span className="text-brand">{b}</span>
      </h1>
      <p className="text-muted text-lg">Hedge fund ownership compared</p>

      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <CompareCard t={ta} />
        <CompareCard t={tb} />
      </div>

      <AdSlot format="horizontal" />

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Managers holding BOTH</h2>
        {both.length === 0 ? (
          <p className="text-muted text-sm">No tracked manager holds both {a} and {b} as a top position.</p>
        ) : (
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-dim text-xs uppercase tracking-wider">
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-4">Manager</th>
                  <th className="text-right px-5 py-4">{a} %</th>
                  <th className="text-right px-5 py-4">{b} %</th>
                </tr>
              </thead>
              <tbody>
                {both.map((o) => {
                  const aPct = ta.owners.find((x) => x.slug === o.slug)?.pct || 0;
                  return (
                    <tr key={o.slug} className="border-b border-border last:border-0">
                      <td className="px-5 py-4">
                        <a href={`/investor/${o.slug}`} className="text-text hover:text-brand transition font-semibold">
                          {o.manager}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums">{aPct.toFixed(1)}%</td>
                      <td className="px-5 py-4 text-right tabular-nums">{o.pct.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-xs text-dim mt-16">
        Comparison sourced from SEC 13F filings. Not investment advice.
      </p>
    </div>
  );
}

function CompareCard({ t }: { t: ReturnType<typeof getTicker> }) {
  if (!t) return null;
  return (
    <div className="rounded-2xl border border-border bg-panel p-6">
      <a href={`/ticker/${t.symbol}`} className="block">
        <div className="font-mono text-2xl font-bold text-brand">{t.symbol}</div>
        <div className="text-sm text-text mt-1">{t.name}</div>
        <div className="text-xs text-dim mt-1">{t.sector}</div>
      </a>
      <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Tracked owners</span>
          <span className="tabular-nums font-semibold">{t.ownerCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Σ Conviction</span>
          <span className="tabular-nums font-semibold">{t.totalConviction.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
