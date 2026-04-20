import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "13D vs 13G — what the difference actually means",
  description:
    "Plain-English guide: when an investor crosses 5% of a public company they file 13D or 13G. Here's what each means, why activists pick one over the other, and how to read the filings.",
  alternates: {
    canonical: "https://holdlens.com/learn/13d-vs-13g-activist-filings",
  },
};

export default function Article() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "13D vs 13G — what the difference actually means",
    datePublished: "2026-04-20",
    dateModified: "2026-04-20",
    author: { "@type": "Organization", name: "HoldLens" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
    mainEntityOfPage:
      "https://holdlens.com/learn/13d-vs-13g-activist-filings",
    description:
      "When an investor crosses 5% of a public company they file 13D or 13G. The difference reveals intent.",
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
        name: "13D vs 13G",
        item: "https://holdlens.com/learn/13d-vs-13g-activist-filings",
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
        13D vs 13G — what the difference actually means
      </h1>
      <p className="text-muted text-lg">
        When any investor crosses 5% of a public company&rsquo;s outstanding
        shares, the SEC requires a filing within 10 calendar days. Which
        filing — 13D or 13G — tells you everything about why they bought.
      </p>

      <h2>The 5% threshold</h2>
      <p>
        Section 13(d) of the Securities Exchange Act (1934) requires anyone
        beneficially owning more than 5% of a public company&rsquo;s voting
        shares to disclose their position. The point is to give the market —
        and the company&rsquo;s management — early warning of large
        accumulations that could change control.
      </p>

      <h2>13D — the activist filing</h2>
      <p>
        <strong>Schedule 13D</strong> is filed when the investor reserves the
        right to influence the company. The filing must include:
      </p>
      <ul>
        <li>Identity of the filer</li>
        <li>Source and amount of funds used to acquire the stake</li>
        <li>Purpose of the transaction</li>
        <li>Plans for the company (board changes, breakup, sale, etc.)</li>
        <li>Any contracts, arrangements, or understandings with other holders</li>
      </ul>
      <p>
        That fourth item — <em>plans for the company</em> — is where every
        activist thesis lives. When Elliott files 13D on Southwest Airlines
        and writes &ldquo;intends to engage with management regarding board
        composition, capital allocation, and operational strategy&rdquo;, the
        market knows a proxy fight may be coming.
      </p>

      <h2>13G — the passive filing</h2>
      <p>
        <strong>Schedule 13G</strong> is the short-form version. The filer
        certifies they have <em>no intent</em> to influence the company.
        Three categories of filers can use 13G instead of 13D:
      </p>
      <ul>
        <li>
          <strong>Qualified institutional investors</strong> (banks, broker-dealers,
          investment companies, insurance companies, registered pension funds) —
          can file 13G if they hold in the ordinary course of business.
        </li>
        <li>
          <strong>Passive investors</strong> who own less than 20% and have no
          intent to influence — file an annual short-form 13G.
        </li>
        <li>
          <strong>Exempt investors</strong> who acquired their stake before the
          company went public.
        </li>
      </ul>
      <p>
        Most index funds (Vanguard, BlackRock, State Street) file 13G on
        thousands of holdings. Berkshire Hathaway&rsquo;s Occidental Petroleum
        position is an unusual large 13D — Buffett crossed 10% but explicitly
        disclaimed activist intent in the filing narrative.
      </p>

      <h2>13D/A and 13G/A — the amendments</h2>
      <p>
        The <strong>/A</strong> suffix means &ldquo;amendment.&rdquo; Filers
        must amend within 1 business day (13D) or 10 days (13G) when:
      </p>
      <ul>
        <li>Position changes by 1% or more of outstanding shares</li>
        <li>Intent shifts (e.g., a 13G holder decides to engage and switches to 13D)</li>
        <li>Plans materially change</li>
      </ul>
      <p>
        Amendment cadence is the highest-signal data on EDGAR. A series of
        13D/A filings from a known activist usually precedes a board fight by
        weeks.
      </p>

      <h2>How to read the actual filing</h2>
      <p>
        The most-read sections of any 13D are:
      </p>
      <ul>
        <li>
          <strong>Item 4 (Purpose of Transaction)</strong> — the activist
          thesis in their own words
        </li>
        <li>
          <strong>Item 5 (Beneficial Ownership)</strong> — exact share count
          and percentage
        </li>
        <li>
          <strong>Item 6 (Contracts, Arrangements)</strong> — group filings,
          coordination with other shareholders
        </li>
        <li>
          <strong>Exhibits</strong> — copies of letters sent to the board,
          investor presentations, press releases
        </li>
      </ul>
      <p>
        Item 4 is where you learn that Engine Capital wants Etsy to spin off
        Depop and Reverb, or that Trian wants Disney to refresh its board.
      </p>

      <h2>Why this matters more than 13F</h2>
      <p>
        13F (the quarterly hedge-fund position report) is a 45-day-lagged
        snapshot of a portfolio. 13D/13G filings drop within 10 days of
        crossing 5% — and 13D/A amendments file within 1 business day of
        material changes. They are the closest thing to real-time
        smart-money disclosure in the U.S. market.
      </p>
      <p>
        See <a href="/learn/13f-vs-13d-vs-13g">13F vs 13D vs 13G</a> for a
        full comparison of all three filings, or browse the{" "}
        <a href="/activist">live activist tracker</a>.
      </p>

      <hr />
      <p className="text-xs text-dim">
        This is educational content, not investment advice. Activist
        outcomes vary widely and historical performance does not predict
        future results.
      </p>
    </article>
  );
}
