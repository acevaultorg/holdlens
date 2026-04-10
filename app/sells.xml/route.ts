// RSS feed for sell signals. Forced static for output: 'export'.
import { getSellSignals } from "@/lib/signals";
import { formatSignedScore } from "@/lib/conviction";
import { QUARTER_LABELS, LATEST_QUARTER, QUARTER_FILED } from "@/lib/moves";

export const dynamic = "force-static";

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const signals = getSellSignals().slice(0, 20);
  const quarterLabel = QUARTER_LABELS[LATEST_QUARTER];
  const filed = new Date(QUARTER_FILED[LATEST_QUARTER]).toUTCString();
  const now = new Date().toUTCString();

  const items = signals
    .map((s, i) => {
      const url = `https://holdlens.com/signal/${s.ticker}`;
      const scoreStr = formatSignedScore(s.score);
      const sellerLine =
        s.sellers.length > 0
          ? `${s.sellers.map((b) => b.managerName).join(", ")} ${s.sellers.length === 1 ? "is" : "are"} selling ${s.ticker} (${xmlEscape(s.name)}) this quarter.`
          : `${s.ticker} (${xmlEscape(s.name)}) carries a strong historical sell signal even without fresh activity this quarter.`;
      const title = `${s.ticker} SELL signal · score ${scoreStr} on a −100..+100 scale`;
      const desc =
        `${sellerLine} ` +
        `Unified ConvictionScore: ${scoreStr} (negative = sell, positive = buy). ` +
        (s.sellers.length > 0
          ? `Quality-weighted seller list: ${s.sellers.map((b) => `${b.managerName} (Q${b.quality})`).join(", ")}.`
          : `Score reflects historical dissent, crowding, and trend deterioration.`);
      return `    <item>
      <title>${xmlEscape(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}?rank=${i + 1}&sell=1</guid>
      <description>${xmlEscape(desc)}</description>
      <pubDate>${filed}</pubDate>
      <category>${xmlEscape(s.sector || "Stocks")}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>HoldLens — What to sell (${quarterLabel})</title>
    <link>https://holdlens.com/sells</link>
    <atom:link href="https://holdlens.com/sells.xml" rel="self" type="application/rss+xml" />
    <description>Top sell signals from the best portfolio managers in the world — ranked on a single signed −100..+100 ConvictionScore where −100 is the strongest possible sell. Updated every 13F filing deadline.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${filed}</pubDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
