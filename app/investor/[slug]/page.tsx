import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EmailCapture from "@/components/EmailCapture";
import { MANAGERS, getManager } from "@/lib/managers";

export async function generateStaticParams() {
  // warren-buffett has its own dedicated static page; exclude here to avoid route conflict.
  return MANAGERS.filter((m) => m.slug !== "warren-buffett").map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getManager(slug);
  if (!m) return { title: "Investor not found" };
  return {
    title: `${m.name} portfolio — ${m.fund} holdings`,
    description: `Track ${m.name}'s ${m.fund} portfolio. Top holdings, conviction analysis, and quarterly moves.`,
    openGraph: {
      title: `${m.name} · ${m.fund}`,
      description: `${m.name}'s top holdings, updated each quarter.`,
    },
  };
}

export default async function InvestorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getManager(slug);
  if (!m) notFound();

  const total = m.topHoldings.reduce((s, h) => s + h.pct, 0);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.name,
    jobTitle: m.role,
    worksFor: { "@type": "Organization", name: m.fund },
    description: m.bio,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Investors", item: "https://holdlens.com/investor" },
      { "@type": "ListItem", position: 3, name: m.name, item: `https://holdlens.com/investor/${m.slug}` },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <a href="/investor" className="text-xs text-muted hover:text-text">← All investors</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Investor profile</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2">{m.name}</h1>
      <p className="text-muted text-lg">{m.fund} · {m.role} · Net worth: {m.netWorth}</p>
      <p className="mt-4 text-text leading-relaxed max-w-2xl">{m.bio}</p>
      <div className="mt-3 text-sm text-muted italic">"{m.philosophy}"</div>

      <div className="mt-12 grid md:grid-cols-3 gap-4">
        <Stat label="Tracked positions" value={m.topHoldings.length.toString()} />
        <Stat label="Top concentration" value={`${total.toFixed(0)}%`} />
        <Stat label="Longest holding" value={m.longestHolding} />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Top holdings</h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-4">Ticker</th>
                <th className="text-left px-5 py-4">Company</th>
                <th className="text-right px-5 py-4">% Portfolio</th>
                <th className="text-right px-5 py-4 hidden md:table-cell">Shares (M)</th>
              </tr>
            </thead>
            <tbody>
              {m.topHoldings.map((h) => (
                <tr key={h.ticker} className="border-b border-border last:border-0 align-top">
                  <td className="px-5 py-4 font-mono font-semibold">
                    <a href={`/ticker/${h.ticker}`} className="text-brand hover:underline">{h.ticker}</a>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-text">{h.name}</div>
                    <div className="text-dim text-xs mt-1 max-w-md">{h.thesis}</div>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums">{h.pct.toFixed(1)}%</td>
                  <td className="px-5 py-4 text-right tabular-nums hidden md:table-cell text-muted">
                    {h.sharesMn.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-panel p-8">
        <h2 className="text-2xl font-bold mb-3">Want {m.name.split(" ")[0]} move-alerts?</h2>
        <p className="text-muted mb-6">
          One email per 13F filing. Summarizes every new position, exit, and trim.
        </p>
        <EmailCapture />
      </section>

      {m.slug === "warren-buffett" && (
        <section className="mt-16">
          <h3 className="text-lg font-semibold mb-3">Try the Buffett backtest</h3>
          <p className="text-muted mb-4">How much would you have made if you'd copied Buffett 15 years ago?</p>
          <a
            href="/simulate/buffett"
            className="inline-block bg-brand text-black font-semibold rounded-xl px-6 py-3 hover:opacity-90 transition"
          >
            Run the backtest →
          </a>
        </section>
      )}

      <p className="text-xs text-dim mt-16">
        Data sourced from {m.fund} 13F filings with the SEC. Approximate snapshot. Not investment advice.
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
