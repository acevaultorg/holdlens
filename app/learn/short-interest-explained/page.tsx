import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Short interest, days-to-cover, and squeeze setups — plain English",
  description:
    "What short interest actually measures, how days-to-cover is calculated, why high short interest is BOTH a squeeze setup AND a smart-money signal — without the jargon.",
  alternates: {
    canonical: "https://holdlens.com/learn/short-interest-explained",
  },
};

export default function Article() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Short interest, days-to-cover, and squeeze setups — plain English",
    datePublished: "2026-04-20",
    dateModified: "2026-04-20",
    author: { "@type": "Organization", name: "HoldLens" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
    mainEntityOfPage: "https://holdlens.com/learn/short-interest-explained",
    description:
      "What short interest measures and how days-to-cover is calculated.",
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://holdlens.com/learn" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Short interest explained",
        item: "https://holdlens.com/learn/short-interest-explained",
      },
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
        Short interest, days-to-cover, and squeeze setups — plain English
      </h1>
      <p className="text-muted text-lg">
        Twice a month, every brokerage in the U.S. tells FINRA how many
        shares of every stock are sold short. The aggregated report is the
        cleanest signal of where smart-money skepticism is concentrated — and
        also where the next short squeeze might erupt.
      </p>

      <h2>What &ldquo;short&rdquo; actually means</h2>
      <p>
        To short a stock you borrow shares from another investor (via your
        broker), sell them at the current price, and hope to buy them back
        cheaper later before returning them. Profit = sell price − buy-back
        price (minus borrow fees + dividends owed). Loss is theoretically
        unlimited because the price can keep rising.
      </p>

      <h2>Short interest = total shares sold but not yet returned</h2>
      <p>
        FINRA Rule 4560 requires every member firm to report customer and
        proprietary short positions twice a month — at the 15th of the month
        and the last business day. The data publishes 8 business days later
        on FINRA&rsquo;s website + each exchange&rsquo;s feeds.
      </p>
      <p>
        Aggregated across firms, the total is the &ldquo;short
        interest&rdquo; — every share currently borrowed and short-sold,
        outstanding.
      </p>

      <h2>% of float — the concentration metric</h2>
      <p>
        Raw share count is hard to compare across companies. Beyond Meat
        having 28M shares short doesn&rsquo;t tell you much without knowing
        how many shares trade publicly. <strong>% of float</strong> divides
        short interest by the public float (shares not held by insiders or
        large strategic holders):
      </p>
      <pre>{`pct_float = shorted_shares / public_float`}</pre>
      <ul>
        <li><strong>Under 5%</strong>: lightly shorted (most stocks)</li>
        <li><strong>5-10%</strong>: meaningful skepticism present</li>
        <li><strong>10-20%</strong>: heavily shorted; thesis-driven</li>
        <li><strong>20%+</strong>: extremely shorted; squeeze setup</li>
        <li><strong>40%+</strong>: extraordinary; rare even in the most-hated names</li>
      </ul>

      <h2>Days-to-cover — the liquidity-adjusted squeeze metric</h2>
      <p>
        Two stocks can both have 20% short interest, but if one trades
        millions of shares per day and the other trades thousands, the
        squeeze risk is wildly different.
      </p>
      <p>
        <strong>Days-to-cover (DTC)</strong> divides short interest by
        average daily trading volume (typically 30 days):
      </p>
      <pre>{`dtc = shorted_shares / avg_daily_volume_30d`}</pre>
      <ul>
        <li><strong>Under 1 day</strong>: easy to cover; squeeze risk low</li>
        <li><strong>1-3 days</strong>: moderate</li>
        <li><strong>3-5 days</strong>: high</li>
        <li><strong>5+ days</strong>: extreme — covering will move the price</li>
      </ul>
      <p>
        DTC is the single best squeeze-risk metric because it captures both
        position size AND market depth.
      </p>

      <h2>Why high short interest is dual-signal</h2>
      <p>
        Retail traders see &ldquo;30% short interest&rdquo; and think
        &ldquo;squeeze coming.&rdquo; That&rsquo;s sometimes true. But high
        short interest also means the smartest, best-resourced bearish
        analysts have looked at this name and decided to put real capital
        behind a downside thesis.
      </p>
      <ul>
        <li>
          <strong>GameStop 2021</strong>: a real squeeze — short interest
          briefly exceeded 100% of float (impossible mathematically without
          re-borrowing shares already on loan), and shorts were forced to
          cover into a thin float, sending the stock from $20 to $480.
        </li>
        <li>
          <strong>Beyond Meat 2021-2026</strong>: short interest persistently
          above 40%, no squeeze. Why? Because the bearish thesis (revenue
          decline, secular brand fade) keeps being right. The shorts are
          paid to be patient.
        </li>
      </ul>
      <p>
        High short interest = high disagreement. The squeeze-vs-rightness
        outcome depends on whether new positive news arrives faster than the
        bearish thesis plays out.
      </p>

      <h2>Borrow fees — the hidden cost</h2>
      <p>
        When a stock is heavily shorted, the supply of borrowable shares
        shrinks and the cost to borrow rises. Borrow fees on the
        most-shorted names can reach 50-100% annualized — meaning a 10%
        downside in 12 months still loses money for the short. This is why
        squeeze candidates have aggressive cost-of-carry against them.
      </p>

      <h2>Bi-monthly limitations</h2>
      <p>
        Short-interest data lags real positioning by 1-3 weeks. By the time
        you read it, sophisticated funds have already updated their
        positions. Pair short-interest data with:
      </p>
      <ul>
        <li>
          <a href="/learn/13f-vs-13d-vs-13g">13F filings</a> — quarterly
          long-position snapshots
        </li>
        <li>
          <a href="/insiders">Form 4 insider activity</a> — real-time
          executive buy/sell
        </li>
        <li>
          <a href="/buybacks">Corporate buybacks</a> — companies buying
          their own shares
        </li>
      </ul>

      <h2>Where to read the source data</h2>
      <ul>
        <li>
          <a href="https://www.finra.org/finra-data/browse-catalog/equity-short-interest"
            target="_blank" rel="noopener noreferrer">
            FINRA Short Interest Reports
          </a>
        </li>
        <li>
          <a href="https://www.nyse.com/markets/nyse/short-interest"
            target="_blank" rel="noopener noreferrer">
            NYSE Short Interest
          </a>
        </li>
        <li>
          <a href="https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch"
            target="_blank" rel="noopener noreferrer">
            Nasdaq Short Interest Schedule
          </a>
        </li>
      </ul>

      <hr />
      <p className="text-xs text-dim">
        This is educational content, not investment advice. Short interest
        signals carry risk on both sides — long and short.
      </p>
    </article>
  );
}
