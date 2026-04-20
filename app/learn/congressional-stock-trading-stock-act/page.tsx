import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How the STOCK Act works — Congressional stock trading, plain English",
  description:
    "What the STOCK Act of 2012 actually requires, why members of Congress disclose ranges (not exact amounts), how late filings are penalized, and how to read the disclosures.",
  alternates: {
    canonical:
      "https://holdlens.com/learn/congressional-stock-trading-stock-act",
  },
};

export default function Article() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How the STOCK Act works — Congressional stock trading explained",
    datePublished: "2026-04-20",
    dateModified: "2026-04-20",
    author: { "@type": "Organization", name: "HoldLens" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
    mainEntityOfPage:
      "https://holdlens.com/learn/congressional-stock-trading-stock-act",
    description:
      "What the STOCK Act of 2012 requires from U.S. House and Senate members.",
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
        name: "STOCK Act explained",
        item: "https://holdlens.com/learn/congressional-stock-trading-stock-act",
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
        How the STOCK Act works — Congressional stock trading, plain English
      </h1>
      <p className="text-muted text-lg">
        Every U.S. Senator and Representative must disclose every stock trade
        within 45 days. That's the STOCK Act. Here's what it actually
        requires, what it doesn't, and how to read the disclosures.
      </p>

      <h2>What the law says</h2>
      <p>
        The <strong>Stop Trading on Congressional Knowledge Act</strong>
        (STOCK Act) was signed by President Obama in April 2012 after CBS
        60 Minutes reported on apparent insider trading by Members. Its three
        main pillars:
      </p>
      <ul>
        <li>
          <strong>Insider-trading prohibition.</strong> Affirms that Members
          of Congress and their staff are subject to insider-trading laws —
          they cannot trade on material non-public information learned
          through their official duties.
        </li>
        <li>
          <strong>Periodic Transaction Reports (PTRs).</strong> Every
          security transaction over $1,000 by a Member, spouse, or
          dependent child must be disclosed within 45 days.
        </li>
        <li>
          <strong>Public access.</strong> Disclosures must be filed
          electronically and made publicly searchable on the House Clerk
          and Senate Office of Public Records websites.
        </li>
      </ul>

      <h2>What gets disclosed (and what doesn't)</h2>
      <p>
        <strong>Disclosed:</strong>
      </p>
      <ul>
        <li>Stocks (common, preferred, restricted)</li>
        <li>Bonds (corporate, municipal)</li>
        <li>Options, warrants, derivatives</li>
        <li>Mutual funds bought/sold (held funds aren't reported as transactions)</li>
        <li>ETFs</li>
        <li>Cryptocurrencies (added in 2018 guidance)</li>
        <li>Real estate transactions (separate annual disclosure)</li>
        <li>Trust transactions (with some blind-trust carve-outs)</li>
      </ul>
      <p>
        <strong>Not disclosed (or limited):</strong>
      </p>
      <ul>
        <li>Exact dollar amounts — only ranges (see next section)</li>
        <li>Trades under $1,000</li>
        <li>Money market accounts</li>
        <li>U.S. Treasury bills and notes</li>
        <li>Holdings in qualified blind trusts (transactions still disclosed but not directed by the Member)</li>
      </ul>

      <h2>The dollar ranges (why exact amounts aren't shown)</h2>
      <p>
        Members disclose transaction value in standard brackets, not exact
        amounts:
      </p>
      <ul>
        <li>$1,001 — $15,000</li>
        <li>$15,001 — $50,000</li>
        <li>$50,001 — $100,000</li>
        <li>$100,001 — $250,000</li>
        <li>$250,001 — $500,000</li>
        <li>$500,001 — $1,000,000</li>
        <li>$1,000,001 — $5,000,000</li>
        <li>$5,000,001 — $25,000,000</li>
        <li>$25,000,001 — $50,000,000</li>
        <li>Over $50,000,000</li>
      </ul>
      <p>
        This means a "$1M-$5M trade" could be anything from $1.0M to $5.0M.
        HoldLens reports the <strong>bracket low end</strong> as a
        conservative estimate — actual trade size could be 5× higher.
      </p>

      <h2>The 45-day clock</h2>
      <p>
        Members have 45 days from the transaction settlement date to file
        the PTR. Filings later than 45 days incur a $200 fine for the first
        offense, with the Ethics Committee able to impose larger penalties
        for patterns. In practice:
      </p>
      <ul>
        <li>~75% of trades are filed within 30 days</li>
        <li>~5-10% of trades are filed late (over 45 days)</li>
        <li>Patterns of late filing have triggered Ethics inquiries (Senators Burr 2020, Loeffler 2020, Perdue 2020)</li>
      </ul>

      <h2>How to read a disclosure</h2>
      <p>Each PTR contains:</p>
      <ul>
        <li><strong>Filer</strong> — Member name, chamber, state</li>
        <li><strong>Owner</strong> — self / spouse / dependent child / trust</li>
        <li><strong>Asset</strong> — name + ticker + asset type</li>
        <li><strong>Transaction type</strong> — buy / sell / partial-sell / exchange</li>
        <li><strong>Transaction date</strong> — settlement date</li>
        <li><strong>Notification date</strong> — when the Member was made aware</li>
        <li><strong>Filing date</strong> — when the PTR was filed</li>
        <li><strong>Amount</strong> — bracket from list above</li>
      </ul>
      <p>
        Latency = filing date minus transaction date. &gt;45 days = late.
        Notification-date ≠ transaction-date is common when trades are
        executed by trusts or money managers and reported back to the
        Member.
      </p>

      <h2>Where to read the source data</h2>
      <ul>
        <li>
          <a
            href="https://disclosures-clerk.house.gov/FinancialDisclosure"
            target="_blank"
            rel="noopener noreferrer"
          >
            U.S. House Clerk Financial Disclosures
          </a>
        </li>
        <li>
          <a
            href="https://efdsearch.senate.gov/search/"
            target="_blank"
            rel="noopener noreferrer"
          >
            U.S. Senate Office of Public Records (eFD search)
          </a>
        </li>
      </ul>

      <h2>Does Congressional trading actually outperform the market?</h2>
      <p>
        Studies are mixed. A 2011 paper by Ziobrowski et al. claimed
        Senators outperformed the market by ~12 percentage points annually
        (1993-1998 data). A 2019 Dartmouth working paper using more recent
        data (2012-2020) found <em>no statistically significant excess
        return</em>. Methodological choices about benchmarks and survivor
        bias drive much of the disagreement.
      </p>
      <p>
        Anecdotal cases — Pelosi NVDA call options, Burr February 2020
        sales pre-COVID — get media attention but are not statistical
        evidence of systematic outperformance.
      </p>

      <h2>Adjacent disclosures</h2>
      <ul>
        <li>
          <a href="/insiders">Form 4 corporate insider trades</a> — what
          CEOs / CFOs / 10%+ owners trade in their own stock
        </li>
        <li>
          <a href="/activist">13D / 13G activist filings</a> — who's
          accumulating &gt;5% of public companies
        </li>
        <li>
          <a href="/learn/13f-vs-13d-vs-13g">13F vs 13D vs 13G</a> — the
          three SEC ownership disclosures
        </li>
      </ul>

      <hr />
      <p className="text-xs text-dim">
        This is educational content, not investment advice. Congressional
        trading data is a transparency signal, not a forecast.
      </p>
    </article>
  );
}
