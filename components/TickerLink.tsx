import { hasTickerPage } from "@/lib/tickers";

// Shared conditional ticker-link helper. Renders <a> linking to /ticker/X/
// ONLY when the ticker has a static page in TICKER_INDEX; otherwise renders
// the content as plain text (no href). Replaces scattered inline conditional
// patterns across /activist, /short-interest, /congress, /buybacks, /insiders,
// /investor, and shared components (InvestorMoves, SectorHeatmap, LiveTicker).
//
// Eliminates 404 emission at the source — the 30,920 anchors being stripped
// by scripts/strip-broken-links.ts post-build came largely from components
// linking to tickers that MANAGERS.topHoldings doesn't include.

type TickerLinkProps = {
  symbol: string;
  children: React.ReactNode;
  className?: string;
  // When set, render the link with trailing slash (matches static export conventions).
  trailingSlash?: boolean;
};

export default function TickerLink({
  symbol,
  children,
  className,
  trailingSlash = true,
}: TickerLinkProps) {
  if (!hasTickerPage(symbol)) {
    return <span className={className}>{children}</span>;
  }
  const href = trailingSlash ? `/ticker/${symbol}/` : `/ticker/${symbol}`;
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
