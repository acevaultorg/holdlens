import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import InvestingBooks from "@/components/InvestingBooks";
import AuthorByline from "@/components/AuthorByline";
import ShareStrip from "@/components/ShareStrip";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";
import FamousTradesBlock from "@/components/FamousTradesBlock";
import TldrCard from "@/components/learn/TldrCard";
import OurView from "@/components/learn/OurView";
import CiteThisPage from "@/components/learn/CiteThisPage";

export const metadata: Metadata = {
  title: "David Tepper's 2009 bank trade — Appaloosa's $7B distressed-bank bet at the March bottom",
  description:
    "In Q1 2009 — with US banks trading at 20-30 cents on the dollar amid genuine fear of nationalization — Appaloosa Management bought roughly $2 billion of Bank of America, Citigroup, and AIG common stock. The trade returned approximately $7 billion to investors over 2009-2010 and reportedly delivered Tepper a personal $4 billion payday, the second-highest single-year hedge-fund payout in modern history.",
  alternates: { canonical: "https://holdlens.com/learn/tepper-bank-stocks-2009" },
  openGraph: {
    title: "David Tepper's 2009 bank trade",
    description:
      "Appaloosa's March 2009 distressed-bank bet. $2B in, $7B+ out, $4B Tepper personal payday.",
    url: "https://holdlens.com/learn/tepper-bank-stocks-2009",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "David Tepper's 2009 bank trade",
    description: "The March 2009 distressed-bank bet that made Tepper $4B personally.",
    images: ["/og/home.png"],
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://holdlens.com/learn" },
      { "@type": "ListItem", position: 3, name: "Tepper bank trade 2009", item: "https://holdlens.com/learn/tepper-bank-stocks-2009" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "David Tepper's 2009 bank trade — Appaloosa's $7B distressed-bank bet at the March bottom",
    description: "Historical analysis of Appaloosa Management's Q1 2009 distressed-bank position.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/tepper-bank-stocks-2009",
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "David Tepper",
      "Appaloosa Management",
      "2009 banking crisis",
      "Bank of America 2009",
      "Citigroup 2009",
      "AIG 2009",
      "distressed investing",
      "Fed bailout trade",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens famous trades — public-record case studies",
      url: "https://holdlens.com/collections/famous-trades",
    },
    citation: [
      "https://en.wikipedia.org/wiki/David_Tepper",
      "https://en.wikipedia.org/wiki/Appaloosa_Management",
      "https://en.wikipedia.org/wiki/2008_financial_crisis",
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001006438&type=13F-HR",
    ],
    about: [
      {
        "@type": "Person",
        name: "David Tepper",
      },
      {
        "@type": "Organization",
        name: "Appaloosa Management",
      },
      {
        "@type": "Corporation",
        name: "Bank of America",
      },
      {
        "@type": "Corporation",
        name: "Citigroup",
      },
      {
        "@type": "Corporation",
        name: "American International Group (AIG)",
      },
      {
        "@type": "DefinedTerm",
        name: "Distressed-bank common stock at fractional book value",
        description:
          "Q1 2009 saw US bank common stocks trade at 20-30 cents on the dollar of tangible book value as the market priced in significant probability of forced government takeover (nationalization). BAC traded as low as ~$3, C as low as ~$1, AIG well under $1 after splits. Tepper's thesis: the US government's Capital Purchase Program + emergency liquidity facilities made full nationalization politically unlikely; survival probability was structurally underpriced.",
      },
      {
        "@type": "DefinedTerm",
        name: "TARP + Capital Purchase Program",
        description:
          "Troubled Asset Relief Program signed 2008-10-03; Treasury's Capital Purchase Program injected $250B of preferred-equity capital into hundreds of US banks (largest tranches: $25B each to BAC + C + JPM + Wells Fargo; $10B each to Goldman + Morgan Stanley). The structural floor under bank equity that Tepper recognized: with TARP capital injected, common-stock dilution was the most-likely path to recovery, NOT zero.",
      },
      {
        "@type": "DefinedTerm",
        name: "$4 billion personal payout",
        description:
          "Appaloosa's gross 2009 fund return was reportedly ~120-130%. Tepper's combined performance-fee + GP capital share from the year was widely reported at approximately $4 billion — at the time, the second-highest single-year individual hedge-fund payout in modern history, behind only John Paulson's 2007 subprime trade.",
      },
    ],
  },
];

export default function TepperBank2009Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Famous trades</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">David Tepper&apos;s 2009 bank trade</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          In <strong className="text-text">Q1 2009</strong>, with US bank common stocks trading at
          20-30 cents on the dollar of tangible book value, <strong className="text-text">Appaloosa
          Management</strong> bought roughly <strong className="text-text">$2 billion</strong>{" "}
          of Bank of America, Citigroup, and AIG common stock. Bank of America bottomed at ~$3.14
          on March 6, 2009; Citigroup bottomed at ~$0.97 on March 5, 2009. The trade returned
          approximately <strong className="text-text">$7+ billion</strong> to Appaloosa investors
          over the subsequent 12-18 months and reportedly delivered Tepper a personal payday of
          ~<strong className="text-text">$4 billion</strong> — the second-largest single-year
          hedge-fund individual payout in modern history at the time, behind only John Paulson&apos;s
          2007 subprime trade. The position was disclosed across the 2009 Q1, Q2, and Q3 13F filings.
        </TldrCard>

        <p className="text-lg text-muted">
          The Tepper 2009 trade is the canonical &quot;buy when the government will not let it fail&quot;
          case study. Distinct from Buffett&apos;s 2008 Goldman Sachs and General Electric structured
          preferreds (see{" "}
          <a href="/learn/buffett-bank-of-america-2011" className="text-brand underline">the 2011 Berkshire-BAC deal essay</a>
          {" "}for the same template), Tepper&apos;s trade was a straightforward open-market common-stock
          purchase at distressed prices. No warrants, no preferred dividends, no negotiated terms —
          just buying the same shares any retail investor could have bought, at prices that priced
          in significant probability of zero.
        </p>

        <AuthorByline date="2026-05-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The thesis (in Tepper&apos;s own words)</h2>
        <p className="text-muted">
          From Tepper&apos;s 2009-2010 interviews + Appaloosa&apos;s subsequent investor letters:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">TARP changed the math</strong> — Tepper argued the Troubled Asset Relief Program plus the Treasury&apos;s explicit Capital Purchase Program made full nationalization politically untenable. Once the US government had injected ~$250B of preferred capital into the banking system, allowing major banks to be wiped to zero would have crystallized losses on the government&apos;s own preferred stock + caused systemic damage Treasury was trying to prevent.</li>
          <li><strong className="text-text">The dilution path was preferable to the wipe path</strong> — Tepper&apos;s expected outcome: the government would force significant common-equity dilution (preferred conversions, additional secondary offerings) but stop short of common-stock cancellation. Heavy dilution + survival = common stock worth fraction of pre-crisis price BUT non-zero. The market was pricing closer to zero.</li>
          <li><strong className="text-text">Position-size when conviction is correct</strong> — Tepper&apos;s public commentary repeatedly emphasized that when the macro/structural setup is clear, position sizing should be aggressive. Appaloosa&apos;s 2009 bank stack reportedly approached 30%+ of fund AUM at peak — an extraordinary concentration for a single-thesis trade.</li>
          <li><strong className="text-text">Sleep-at-night test</strong> — Tepper has cited the asymmetry: at distressed-price entry, downside was ~50% (full nationalization), upside was 5-10× (recovery to pre-crisis valuations). Asymmetric payoff justified the concentration even with elevated downside-probability.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">The 13F trail (publicly verifiable)</h2>
        <p className="text-muted">
          Appaloosa Management LP (SEC EDGAR CIK 0001006438) filed 13F-HR disclosing the bank
          stack across Q1-Q3 2009:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Q1 2009 (filed mid-May 2009)</strong> — Initial disclosure of substantial BAC + C + AIG positions accumulated during the January-March 2009 lows</li>
          <li><strong className="text-text">Q2 2009 (filed mid-August 2009)</strong> — Position sizes broadly maintained as bank stocks rallied 40-60% from March lows</li>
          <li><strong className="text-text">Q3 2009 (filed mid-November 2009)</strong> — Position begin to be trimmed as banks crossed prior-quarter conviction targets</li>
          <li><strong className="text-text">2010-2011</strong> — Gradual liquidation of remaining positions as bank stocks compounded back toward pre-crisis levels</li>
        </ul>
        <p className="text-muted mt-3">
          Note: Q1 2009 was Appaloosa&apos;s first 13F filing window AFTER the position
          establishment. The accumulation itself happened during January-March 2009 — visible AT
          the time only to Appaloosa, the trading desks fielding the orders, and any contemporaneous
          public commentary Tepper chose to share. The 13F system disclosed it 45 days post-quarter-close.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The 13F-visibility caveat</h2>
        <p className="text-muted">
          One important distinction. Tepper&apos;s 2009 bank trade was substantially executed in{" "}
          <strong className="text-text">distressed bank DEBT</strong> in addition to the common-stock
          positions disclosed via 13F. Appaloosa is fundamentally a distressed-debt fund; the
          public 13F filings show the equity sleeve of the trade, but a large portion of the
          original $2B exposure was in subordinated debt, preferred stock, and trust-preferred
          securities that are NOT 13F-disclosable. The full position was thus larger than what
          13F filings reveal — see{" "}
          <a href="/learn/13f-securities-list" className="text-brand underline">our 13(f) securities list explainer</a>
          {" "}for the structural limits.
        </p>
        <p className="text-muted mt-3">
          This is a different invisibility-mode than Burry&apos;s 2008 CDS trade (see{" "}
          <a href="/learn/burry-big-short" className="text-brand underline">Burry&apos;s Big Short essay</a>
          {" "}— derivatives outside 13F) and different from Soros-Druckenmiller&apos;s 1992 FX
          trade (see{" "}
          <a href="/learn/soros-druckenmiller-gbp-1992" className="text-brand underline">Black Wednesday essay</a>
          {" "}— FX outside 13F): Tepper&apos;s case is the equity sleeve being visible while the
          debt sleeve was not. Different filings (Schedule 13D where applicable on debt-convertible
          positions; SC 13D/A amendments; corporate action filings for trust-preferred conversions)
          partly fill the gap.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Return profile</h2>
        <p className="text-muted">
          Approximate trade economics from public reporting:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Entry capital (equity sleeve)</strong>: ~$2 billion at Q1 2009 cost basis</li>
          <li><strong className="text-text">Appaloosa 2009 fund return</strong>: ~120-130% gross (full fund, multiple positions including the bank stack)</li>
          <li><strong className="text-text">Gross trade gain</strong>: ~$7 billion across the bank stack equity + debt positions over 2009-2010</li>
          <li><strong className="text-text">Tepper personal compensation 2009</strong>: ~$4 billion (combined GP capital appreciation + performance fee — public reporting from Bloomberg/Forbes/Institutional Investor 2009-2010 estimates)</li>
        </ul>
        <p className="text-muted mt-3">
          For context: a 5-10× return on a $2B position in 12-18 months is among the highest
          absolute single-trade returns in hedge-fund history. The trade was made possible by the
          structural mispricing during the panic + the implicit government floor under bank common
          stock — two conditions Tepper recognized before most others quantified them similarly.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Comparison to Berkshire 2008-2011 bank deals</h2>
        <p className="text-muted">
          Buffett deployed capital into financials during the same window via a different template:{" "}
          <a href="/learn/buffett-bank-of-america-2011" className="text-brand underline">structured preferred-plus-warrants deals</a>
          {" "}(Goldman 2008, GE 2008, BAC 2011). The differences:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Buffett structured</strong>: senior preferred + warrants — protected downside (preferred dividend guaranteed by issuer), capped non-equity upside, asymmetric warrant payoff</li>
          <li><strong className="text-text">Tepper common-equity</strong>: bought the same shares anyone could have bought, at distressed market prices, no negotiated structure</li>
          <li><strong className="text-text">Why structure matters</strong>: Berkshire&apos;s scale + brand allowed it to negotiate proprietary terms. Tepper&apos;s scale (~$10B AUM at the time vs Berkshire&apos;s ~$120B) meant common-stock open-market was the only practical path</li>
          <li><strong className="text-text">Outcome</strong>: Both compounded ~5-10× on the dollars deployed. Tepper&apos;s came faster (12-18 months); Berkshire&apos;s extended longer (BAC warrants took 6 years to maturity)</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">What the trade does NOT teach</h2>
        <p className="text-muted">
          The Tepper 2009 trade is canonical-but-non-replicable for retail investors for three
          reasons that get less attention than the headline 5-10× return:
        </p>
        <ol className="text-muted space-y-2 list-decimal list-inside">
          <li><strong className="text-text">The structural floor matters more than the price</strong> — Tepper&apos;s thesis required reading TARP + Capital Purchase Program + the political math. Without that policy floor, the trade would have been a pure distressed bet with materially different probabilities</li>
          <li><strong className="text-text">Position-size discipline + concentration tolerance</strong> — 30%+ of AUM in a single thesis is not a retail-appropriate risk level. Tepper had structural permission from his investors and a multi-year track record of distressed-debt expertise</li>
          <li><strong className="text-text">Mark-to-market endurance</strong> — From peak position to trough, BAC and C both took further dips in 2009 H2 and 2010 H1 as European-debt-crisis spillover hit financials. Tepper held through the additional drawdowns. Most retail investors, without permanent capital, would have stopped out</li>
        </ol>

        <OurView>
          <p>
            The 2009 Tepper bank trade is the cleanest single example of &quot;structural macro mispricing
            + open-market common-stock entry + position-size discipline&quot; in modern hedge-fund history.
            Unlike{" "}
            <a href="/learn/buffett-bank-of-america-2011" className="text-brand underline">Berkshire&apos;s 2011 BAC deal</a>
            {" "}(structured private investment), this was a trade any retail investor with sufficient
            capital + conviction + concentration tolerance could have made. What separated Tepper from
            those who could have was the framework: reading the policy floor instead of the price chart.
          </p>
          <p>
            For HoldLens tracking purposes, Appaloosa Management remains one of the 30 tracked
            superinvestors — see{" "}
            <a href="/investor" className="text-brand underline">/investor</a>
            {" "}for current Appaloosa dossier with present-day holdings.
          </p>
        </OurView>

        <p className="text-muted text-sm border-l-2 border-border pl-4 mt-6">
          The 13F + Form 4 + 8-K filings for Appaloosa Management are catalogued via{" "}
          <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001006438&type=13F-HR" className="text-brand underline" rel="noopener">
            SEC EDGAR (CIK 0001006438)
          </a>
          . Sister-property reference for every SEC form ever filed:{" "}
          <a href="https://secfilingdex.com/learn/13f/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/13f
          </a>
          .
        </p>

        <InvestingBooks
          heading="Foundational reading on distressed value + crisis investing"
          sub="Tepper himself rarely publishes; the canon for understanding his playbook spans Howard Marks, Seth Klarman, and Walter Mischel-era behavioral economics."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Historical analysis from publicly reported sources + SEC Form 13F-HR
          filings (Appaloosa Management LP CIK 0001006438). Trade economics figures are
          approximations from contemporaneous Bloomberg / Forbes / Institutional Investor
          reporting 2009-2010.{" "}
          <a href="/methodology" className="underline">Methodology</a>.
        </p>

        <CiteThisPage />
        <FamousTradesBlock currentSlug="tepper-bank-stocks-2009" />
        <LearnReadNext currentSlug="tepper-bank-stocks-2009" />

        <ShareStrip url="https://holdlens.com/learn/tepper-bank-stocks-2009" title="David Tepper's 2009 bank trade" />

        <AdSlot format="horizontal" priority="secondary" />
      </div>
    </div>
  );
}
