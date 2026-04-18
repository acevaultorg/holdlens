import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TICKER_INDEX } from "@/lib/tickers";

// /stock/[ticker] — SEO alias for /signal/[ticker].
//
// People search "AAPL stock", "NVDA stock", etc. This route captures
// that traffic and immediately sends them to the full signal dossier.
// Static export: generateStaticParams pre-renders one HTML page per
// ticker, each with an immediate redirect to /signal/[ticker].

export async function generateStaticParams() {
  return Object.keys(TICKER_INDEX).map((ticker) => ({ ticker }));
}

// v1.42 — noindex the 94 redirect shells. Static export materializes these
// as real HTML files in out/stock/AAPL/index.html; without explicit robots
// directives Google was crawling them and (until a 302 was honored) indexing
// them against the layout default title "30 superinvestors, one Conviction-
// Score — HoldLens". Two problems: (a) duplicate-content signal vs the real
// /signal/TICKER page, (b) wrong per-ticker title. Correct semantics: /stock
// is a client-side redirect alias for organic query capture; the canonical
// ticker page is /signal/TICKER. Tell Google explicitly.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function StockAlias({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  redirect(`/signal/${ticker.toUpperCase()}`);
}
