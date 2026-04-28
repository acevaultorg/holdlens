import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MANAGERS, getManager, type Manager } from "@/lib/managers";
import { LATEST_FILINGS } from "@/lib/filings";
import { topReplicatingETFs } from "@/lib/etf-overlap";
import { styleOf, STYLES_BY_SLUG } from "@/lib/manager-styles";
import { getEdgarHoldings } from "@/lib/edgar-data";

// Investor portfolio embed — iframe-friendly card showing manager identity +
// top-3 holdings + closest replicating ETF + ConvictionScore-style signal.
//
// Designed for: 600px max-width drop-in iframe on finance blogs, Substack
// posts, Wikipedia talk pages, niche investing communities. Each embed =
// permanent backlink + recurring discovery channel. Per audit's 🔴 fix
// (Embeddability score 2 → 9), this closes the structural gap.
//
// Visual goals: dark theme matching the canonical /investor/[slug]/ page,
// no chrome (covered by app/embed/layout.tsx fixed-position wrap), 1
// "Powered by HoldLens →" footer link as the attribution.
//
// noindex: meta robots set to noindex,follow so embeds don't compete with
// the canonical /investor/[slug]/ for SERP rankings.

export async function generateStaticParams() {
  return MANAGERS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getManager(slug);
  if (!m) return { title: "Not found" };
  return {
    title: `${m.name} portfolio embed — HoldLens`,
    description: `${m.name}'s ${m.fund} portfolio: top holdings, closest replicating ETF, investing style. Iframe-embeddable.`,
    robots: { index: false, follow: true },
    alternates: { canonical: `https://holdlens.com/investor/${m.slug}/` },
  };
}

function getTopHoldings(m: Manager, n = 3): Array<{ ticker: string; name: string; pct: number }> {
  const edgar = getEdgarHoldings(m.slug);
  if (edgar && edgar.holdings.length > 0) {
    return edgar.holdings.slice(0, n).map((h) => ({ ticker: h.ticker, name: h.name, pct: h.pct }));
  }
  return m.topHoldings.slice(0, n).map((h) => ({ ticker: h.ticker, name: h.name, pct: h.pct }));
}

export default async function InvestorEmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = getManager(slug);
  if (!m) notFound();

  const top3 = getTopHoldings(m, 3);
  const filing = LATEST_FILINGS[m.slug];
  const topETF = topReplicatingETFs(m, 1)[0];
  const style = styleOf(m.slug);
  const styleMeta = style ? STYLES_BY_SLUG[style] : undefined;
  const totalConcentration = m.topHoldings.reduce((s, h) => s + h.pct, 0);

  return (
    // Override parent /embed/layout.tsx flex-center — investor embed is a
    // tall card that needs natural top-aligned flow + scroll if iframe is
    // narrower than 600px on mobile. absolute inset-0 + overflow-y-auto
    // restores normal-flow positioning inside the fixed-position parent.
    <div
      className="absolute inset-0 overflow-y-auto p-5"
      style={{
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        color: "#f5f5f5",
      }}
    >
    <div className="w-full max-w-[600px] mx-auto text-left">
      {/* Header — manager identity + filing tag */}
      <div className="mb-4 flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <div
            className="text-[10px] uppercase tracking-widest font-bold mb-1"
            style={{ color: "#34d399" }}
          >
            13F Portfolio · {filing?.quarter ?? "latest"}
          </div>
          <div className="text-xl font-bold leading-tight">{m.name}</div>
          <div className="text-xs" style={{ color: "#9ca3af" }}>
            {m.fund} · {totalConcentration.toFixed(0)}% top-10 concentration
          </div>
        </div>
        {styleMeta && (
          <div
            className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded"
            style={{
              color: "#fbbf24",
              background: "rgba(251,191,36,0.10)",
              border: "1px solid rgba(251,191,36,0.25)",
            }}
          >
            {styleMeta.name}
          </div>
        )}
      </div>

      {/* Top 3 holdings */}
      <div
        className="rounded-lg overflow-hidden mb-3"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div
          className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold"
          style={{ color: "#9ca3af", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          Top 3 holdings
        </div>
        <table className="w-full text-sm">
          <tbody>
            {top3.map((h, i) => (
              <tr
                key={h.ticker}
                style={{
                  borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <td
                  className="px-4 py-2.5 font-mono font-semibold"
                  style={{ color: "#34d399" }}
                >
                  {h.ticker}
                </td>
                <td className="px-4 py-2.5" style={{ color: "#e5e5e5" }}>
                  {h.name}
                </td>
                <td
                  className="px-4 py-2.5 text-right font-mono font-semibold tabular-nums"
                  style={{ color: "#f5f5f5" }}
                >
                  {h.pct.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Closest replicating ETF — single-line widget */}
      {topETF && (
        <div
          className="rounded-lg px-4 py-3 mb-3 text-xs flex items-center justify-between gap-3 flex-wrap"
          style={{
            background: "rgba(52,211,153,0.06)",
            border: "1px solid rgba(52,211,153,0.20)",
          }}
        >
          <span style={{ color: "#9ca3af" }}>Closest replicating ETF:</span>
          <span>
            <span className="font-mono font-bold" style={{ color: "#34d399" }}>
              {topETF.etf.ticker}
            </span>
            <span style={{ color: "#9ca3af" }}>
              {" "}
              · overlap {topETF.score.toFixed(1)} · {topETF.sharedTickers.length} shared
            </span>
          </span>
        </div>
      )}

      {/* Powered-by attribution + canonical deeplink — the embed's compounding mechanism */}
      <div
        className="mt-4 pt-3 flex items-center justify-between text-[11px]"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <a
          href={`https://holdlens.com/investor/${m.slug}/`}
          target="_blank"
          rel="noopener"
          className="font-semibold hover:underline"
          style={{ color: "#34d399" }}
        >
          See full portfolio →
        </a>
        <a
          href="https://holdlens.com/"
          target="_blank"
          rel="noopener"
          style={{ color: "#9ca3af" }}
        >
          Powered by <span style={{ color: "#f5f5f5", fontWeight: 600 }}>HoldLens</span>
        </a>
      </div>
    </div>
    </div>
  );
}
