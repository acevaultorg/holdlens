import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ETF overlap explained — why owning multiple ETFs doesn't always diversify",
  description:
    "What ETF overlap means, how to measure it, and why owning VOO + VTI + QQQ + SPY together delivers far less diversification than you think.",
  alternates: { canonical: "https://holdlens.com/learn/etf-overlap-explained" },
};

export default function Article() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "ETF overlap explained — why owning multiple ETFs doesn't diversify",
    datePublished: "2026-04-20",
    dateModified: "2026-04-20",
    author: { "@type": "Organization", name: "HoldLens" },
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com" },
    mainEntityOfPage: "https://holdlens.com/learn/etf-overlap-explained",
    description: "What ETF overlap means and how it compromises diversification.",
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://holdlens.com/learn" },
      { "@type": "ListItem", position: 3, name: "ETF overlap", item: "https://holdlens.com/learn/etf-overlap-explained" },
    ],
  };

  return (
    <article className="max-w-2xl mx-auto px-6 py-16 prose prose-invert">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <a href="/learn" className="text-xs text-muted hover:text-text no-underline">
        ← All learn articles
      </a>

      <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-3">
        ETF overlap — why owning multiple ETFs doesn&rsquo;t always diversify
      </h1>
      <p className="text-muted text-lg">
        Buying VOO, VTI, QQQ, and SPY to &ldquo;diversify&rdquo; is a common
        retail pattern. It looks like spreading risk across four different
        products. In reality, more than 80% of the dollars point to the same
        dozen stocks. Here&rsquo;s what overlap actually means.
      </p>

      <h2>What is ETF overlap?</h2>
      <p>
        <strong>Overlap</strong> is the fraction of one ETF&rsquo;s holdings
        that also appear in another. If VOO holds 500 stocks and VTI holds
        3,700, and they share 495 of those stocks, the overlap by count is
        high. But count overlap is the wrong metric.
      </p>
      <p>
        <strong>Weight overlap</strong> is the sum of the minimum weight of
        each shared stock across both funds. If VOO holds AAPL at 7.1% and
        VTI holds AAPL at 6.4%, they overlap on AAPL by{" "}
        <code>min(7.1, 6.4) = 6.4%</code>. Sum that across every shared
        stock and you get the total weight overlap.
      </p>
      <p>
        Because large-cap indexes are market-cap weighted, weight overlap
        is usually dramatically higher than count overlap. Two funds can
        share 95%+ of their dollars even when one has 6× more total
        holdings.
      </p>

      <h2>Common examples</h2>
      <ul>
        <li>
          <strong>VOO + SPY</strong>: ~100% overlap — both track the S&amp;P 500.
          The only difference is fee (0.03% vs 0.09%) and trading liquidity.
        </li>
        <li>
          <strong>VOO + VTI</strong>: ~80% overlap by dollars. VTI adds mid +
          small caps but still most of the dollars go to the same large-caps.
        </li>
        <li>
          <strong>VOO + QQQ</strong>: ~45% overlap. Both heavy in AAPL/MSFT/NVDA/
          AMZN/META/GOOGL, which drives most returns.
        </li>
        <li>
          <strong>SCHD + VYM</strong>: ~35% overlap. Both dividend-focused but
          use different selection methodologies (Dow Jones 100 Dividend Achievers
          vs. FTSE High Dividend Yield).
        </li>
        <li>
          <strong>XLK + QQQ</strong>: ~55% overlap on top-10 holdings despite
          being different strategies (pure-tech sector vs. Nasdaq-100).
        </li>
      </ul>

      <h2>Why this matters</h2>
      <p>
        If you own VOO + VTI + QQQ, you look like you own three different
        products, but effectively you own a single concentrated portfolio:
        the top-20 US technology and consumer stocks. When AAPL falls 8%
        in a day, all three ETFs fall together. You pay three expense ratios
        for one correlated exposure.
      </p>
      <p>
        True diversification requires low overlap. Adding an international
        ETF (VEA, VXUS), small-cap ETF (IWM), or bond ETF (BND) contributes
        real diversification. Adding another large-cap US ETF does not.
      </p>

      <h2>How to measure overlap</h2>
      <ol>
        <li>
          List top-10 holdings for each ETF (available on every issuer&rsquo;s
          fact sheet or HoldLens &apos;s <a href="/etf">/etf/</a> pages).
        </li>
        <li>
          For each stock, record the weight in ETF A and ETF B.
        </li>
        <li>
          For shared stocks, sum <code>min(weightA, weightB)</code> across
          all shared positions.
        </li>
        <li>
          That sum is your weight overlap percentage.
        </li>
      </ol>
      <p>
        For a more precise answer, use the full holdings list (500 for VOO,
        3,700 for VTI) instead of just top-10. Top-10 overlap usually
        understates total overlap by 10-15 percentage points because the
        long tail of holdings also overlaps.
      </p>

      <h2>The broader lesson</h2>
      <p>
        &ldquo;More products&rdquo; is not the same as &ldquo;more
        diversification.&rdquo; Before buying another ETF, check which
        ETFs already in your portfolio overlap with it. If the overlap is
        above 50%, you&rsquo;re mostly doubling up on the same exposure —
        at the cost of additional fees, tax-lot complexity, and a false
        sense of diversification.
      </p>

      <h2>What HoldLens tracks</h2>
      <p>
        <a href="/etf">/etf/</a> lists 12 major US ETFs with daily-disclosed
        top holdings sourced from each issuer&rsquo;s official page. Every
        ticker page on HoldLens shows which tracked ETFs hold the stock
        (where applicable) — so you can see passive-flow exposure alongside
        active-manager 13F positions.
      </p>

      <hr />
      <p className="text-xs text-dim">
        This is educational content, not investment advice. Overlap is one
        diversification consideration; others include sector concentration,
        geographic concentration, factor exposure, and correlation under
        stress.
      </p>
    </article>
  );
}
