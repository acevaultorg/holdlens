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
  title: "Warren Buffett's Bank of America 2011 deal — the $5B preferred + warrants",
  description:
    "In August 2011 Berkshire Hathaway invested $5 billion in Bank of America preferred stock + warrants for 700 million common shares at $7.14. Six years later Berkshire exercised the warrants and BAC became one of its top holdings. The mechanics, the timing, and what 13F filings reveal.",
  alternates: { canonical: "https://holdlens.com/learn/buffett-bank-of-america-2011" },
  openGraph: {
    title: "Warren Buffett's Bank of America 2011 deal",
    description:
      "Berkshire's $5B BAC preferred + warrants deal at the bottom of the post-Crisis bank cycle. Trade mechanics + 13F trail.",
    url: "https://holdlens.com/learn/buffett-bank-of-america-2011",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Warren Buffett's Bank of America 2011 deal",
    description: "The $5B preferred + warrants trade that became a top-3 Berkshire position.",
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
      { "@type": "ListItem", position: 3, name: "Buffett BAC 2011", item: "https://holdlens.com/learn/buffett-bank-of-america-2011" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Warren Buffett's Bank of America 2011 deal — the $5B preferred + warrants",
    description: "Historical analysis of Berkshire Hathaway's August 2011 Bank of America investment.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/buffett-bank-of-america-2011",
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Warren Buffett",
      "Berkshire Hathaway",
      "Bank of America",
      "BAC warrants",
      "preferred stock deal",
      "2011 financial crisis recovery",
      "structured private investment",
      "13F filings",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens famous trades — public-record case studies",
      url: "https://holdlens.com/collections/famous-trades",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001067983&type=13F-HR",
      "https://en.wikipedia.org/wiki/Berkshire_Hathaway",
      "https://en.wikipedia.org/wiki/Bank_of_America",
    ],
    about: [
      {
        "@type": "Person",
        name: "Warren Buffett",
        url: "https://holdlens.com/investor/warren-buffett",
      },
      {
        "@type": "Corporation",
        name: "Berkshire Hathaway",
      },
      {
        "@type": "Corporation",
        name: "Bank of America",
      },
      {
        "@type": "DefinedTerm",
        name: "Cumulative preferred stock at 6% yield",
        description:
          "Berkshire's August 2011 BAC investment included $5B of cumulative preferred stock paying 6% annual dividend ($300M/year). Cumulative means missed dividends accumulate as senior obligations; cannot be cancelled without triggering common-stock dividend suspension. A structurally senior, contractually protected income stream — Berkshire's preferred-instrument template (used previously with Goldman Sachs 2008 and General Electric 2008).",
      },
      {
        "@type": "DefinedTerm",
        name: "Warrant strike price $7.14",
        description:
          "The 2011 deal included 700 million common-stock warrants at a $7.14 strike, exercisable for 10 years. BAC stock was trading around $7-8 at the time. The warrants gave Berkshire optionality on a recovery: if BAC stock rose, the warrants converted to common stock for free; if BAC stayed flat or fell, the preferred dividends still paid $300M/year. Asymmetric upside.",
      },
      {
        "@type": "DefinedTerm",
        name: "Warrant exercise 2017",
        description:
          "In August 2017 Berkshire exercised all 700 million warrants by surrendering $5B of preferred shares as payment (instead of cash). BAC stock was then ~$24-25, making the warrants worth approximately $13B in instant gain. The conversion moved BAC from a preferred-income holding to a top-3 Berkshire common-stock position, fully 13F-disclosed thereafter.",
      },
    ],
  },
];

export default function BuffettBankOfAmericaPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Famous trades</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Warren Buffett&apos;s Bank of America 2011 deal</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          On August 25, 2011 — with Bank of America&apos;s stock at multi-year lows amid lingering post-Crisis litigation and capital concerns — Berkshire Hathaway invested <strong className="text-text">$5 billion</strong> in BAC preferred stock paying a <strong className="text-text">6% annual dividend</strong> plus warrants to purchase <strong className="text-text">700 million common shares at $7.14</strong> exercisable for 10 years. The deal was negotiated privately, announced before market open, and BAC stock immediately rose ~25% that day. Six years later (August 2017) Berkshire exercised the warrants at a paper gain of ~$13B and BAC became a top-3 common-stock holding. The deal is one of the cleanest examples of Buffett&apos;s &quot;structured private investment&quot; template, joining Goldman Sachs (2008), General Electric (2008), Dow Chemical (2009), and Heinz (2013).
        </TldrCard>

        <p className="text-lg text-muted">
          The August 2011 BAC deal sits in the same lineage as Berkshire&apos;s 2008 Goldman Sachs and General Electric crisis-era preferred-plus-warrants packages. All three were structured the same way: a senior preferred dividend (protected, contractual, 6-10% yield) paired with long-dated warrants on the common (optionality on the recovery, free if structured into the preferred conversion). The pattern lets Berkshire deploy capital at crisis-period valuations while structurally limiting downside via the senior preferred. The BAC deal is the cleanest single example because the BAC warrants were the largest in absolute share count (700M) and held for the longest before exercise (~6 years).
        </p>

        <AuthorByline date="2026-05-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The structure (August 25, 2011)</h2>
        <p className="text-muted">The deal had three components:</p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">$5 billion cumulative perpetual preferred stock</strong> — 6% annual dividend ($300M/year), cumulative, callable at $5B + 5% premium</li>
          <li><strong className="text-text">Warrants for 700 million BAC common shares at $7.14 strike</strong> — exercisable for 10 years (through August 2021); Berkshire could exercise by paying $5B cash OR by surrendering $5B of the preferred stock</li>
          <li><strong className="text-text">Announcement timing</strong> — pre-market on Aug 25, 2011; BAC opened up ~25% on the news</li>
        </ul>

        <p className="text-muted mt-3">
          BAC stock was trading at approximately $6.30-$7.00 at the time of the deal. Book value per share was approximately $20. The warrants struck near at-the-money on a stock priced at ~35% of book value — the structural asymmetry is what made the deal work for Berkshire.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">The thesis (in Buffett&apos;s own words)</h2>
        <p className="text-muted">
          From Berkshire&apos;s 2011 annual letter + Buffett&apos;s 2011-2012 CNBC interviews:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Cleanup mostly done</strong> — Buffett argued the bulk of BAC&apos;s post-Crisis legal liability (mortgage-related litigation, Countrywide acquisition baggage) was either provisioned for or already settled. The market was over-pricing residual tail-risk.</li>
          <li><strong className="text-text">Earnings power preserved</strong> — BAC&apos;s underlying franchise (consumer banking + wealth management + investment banking) would generate $20B+/year normalized earnings once the cleanup completed</li>
          <li><strong className="text-text">Capital ratios sufficient</strong> — BAC had sufficient Tier 1 capital to absorb remaining losses without dilutive secondary offering, despite market fear of one</li>
          <li><strong className="text-text">Brian Moynihan&apos;s management</strong> — Buffett publicly praised Moynihan&apos;s execution on cost reduction + non-core divestments + legal settlements</li>
          <li><strong className="text-text">Patient capital advantage</strong> — Berkshire could hold for 10 years if needed; that&apos;s longer than the warrant exercise window. No forced sale risk.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">The 2017 exercise + 13F debut</h2>
        <p className="text-muted">
          By mid-2017 BAC stock had risen to approximately $24-25. The warrants&apos; intrinsic value was ~($25 − $7.14) × 700M = ~$12.5B (excluding time value). On August 2, 2017 Berkshire announced it would exercise all warrants by surrendering the $5B preferred stock as payment.
        </p>
        <p className="text-muted mt-3">
          Berkshire&apos;s Q3 2017 13F filing was the first 13F to disclose the BAC common-stock position (~679 million shares — slightly under the 700M warrants because Berkshire had been receiving BAC dividends in additional preferred shares which translated to slightly different total share count post-conversion). BAC immediately became Berkshire&apos;s second-largest equity position behind only Wells Fargo at that time.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Position evolution 2017-2024 (full 13F trail)</h2>
        <p className="text-muted">
          Reconstructable from sequential 13F-HR filings on{" "}
          <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001067983&type=13F-HR" className="text-brand underline" rel="noopener">SEC EDGAR (Berkshire CIK 1067983)</a>:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Q3 2017</strong> — Initial common-stock disclosure: ~679M shares (~$16B at quarter-end)</li>
          <li><strong className="text-text">Q3 2018</strong> — Berkshire added an additional ~250M shares during 2018 → ~877M total</li>
          <li><strong className="text-text">2019-2020 (Q3)</strong> — Continued modest accumulation to peak ~1.03B shares by Q3 2020</li>
          <li><strong className="text-text">2020 (Q4)</strong> — First trim — sold ~50M shares as part of broader Berkshire bank-sector rebalancing (also exited Wells Fargo, Goldman Sachs, JPMorgan during this window)</li>
          <li><strong className="text-text">2021-2023</strong> — Position relatively stable at ~1.03B shares</li>
          <li><strong className="text-text">2024</strong> — Significant trim across Q2/Q3/Q4 — reduced from ~1.03B to ~~700M shares (back to roughly the original warrant-derived position)</li>
        </ul>

        <p className="text-muted mt-3">
          Despite the 2024 trim, BAC remained one of Berkshire&apos;s top-3 equity holdings into 2025. Cumulative cash distributions back to Berkshire from the BAC position (preferred dividends 2011-2017 + common dividends 2017-2024 + 2020 + 2024 sale proceeds) substantially exceed the original $5B investment.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Return profile</h2>
        <p className="text-muted">
          Original investment: $5B (August 2011).
          Preferred dividends 2011-2017: ~$1.8B cumulative ($300M/year × ~6 years).
          Warrant intrinsic value at exercise (Aug 2017): ~$12.5B.
          Subsequent common-stock appreciation + dividends 2017-2024: ~$10-15B incremental on the unsold portion + dividends.
        </p>
        <p className="text-muted mt-3">
          Total cumulative return on the $5B 2011 investment over ~13 years: approximately 5-7×. The trade ranks among the highest-IRR Berkshire investments of the past two decades, on par with the 2008 Goldman Sachs deal and significantly above most pure common-stock positions over the same period.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Comparison to the 2008 Goldman + GE preferreds</h2>
        <p className="text-muted">
          Berkshire&apos;s 2008 Goldman Sachs deal ($5B preferred + warrants at $115 strike, redeemed 2011) and 2008 General Electric deal ($3B preferred + warrants at $22.25 strike, redeemed 2011) used the same template but resolved differently:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">GS warrants</strong> — exercised by Berkshire 2013, ~$2B paper gain</li>
          <li><strong className="text-text">GE warrants</strong> — exercised by Berkshire 2013, modest gain — GE recovered slower than GS</li>
          <li><strong className="text-text">BAC warrants</strong> — exercised 2017, ~$12.5B paper gain — the largest of the three by a wide margin because BAC held the warrants for longer and converted at a higher percentage gain over strike</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Reading the position today</h2>
        <p className="text-muted">
          BAC remains a top-3 Berkshire common-stock holding as of late 2025, though substantially smaller than at peak (700M shares vs 1.03B at peak). Each quarter going forward, Berkshire&apos;s 13F-HR on EDGAR will disclose any further changes — whether the trim continues toward zero, holds at ~700M, or re-accumulates.
        </p>
        <p className="text-muted mt-3">
          See also{" "}
          <a href="/learn/buffett-coca-cola-trade" className="text-brand underline">Buffett&apos;s Coca-Cola trade</a>
          {" and "}
          <a href="/learn/buffett-apple-position" className="text-brand underline">Buffett&apos;s Apple position</a>
          {" — three trades that together represent the foundation of modern Berkshire equity-portfolio history."}
        </p>

        <OurView>
          <p>
            The BAC 2011 deal is the cleanest single example of Buffett&apos;s &quot;structured private investment&quot; template, refined across Goldman 2008, GE 2008, Dow 2009, BAC 2011, and Heinz 2013. The pattern: a senior preferred dividend (contractual, protected, mid-single-digit yield) paired with long-dated common-stock warrants (asymmetric upside, free if you held the preferred). For an investor at Berkshire&apos;s scale with permanent capital, the template works during financial-crisis windows when the issuer has emergency capital needs and structurally limited counterparty options.
          </p>
          <p>
            For HoldLens tracking purposes, BAC remains one of the most-watched lines in Berkshire&apos;s quarterly 13F. Any further trim or re-accumulation will show up in our{" "}
            <a href="/investor/warren-buffett" className="text-brand underline">Buffett dossier</a>
            {" "}within ~6 weeks of the underlying quarter close.
          </p>
        </OurView>

        <p className="text-muted text-sm border-l-2 border-border pl-4 mt-6">
          The 13F filings + Form 4 trail for this position are catalogued on our sister site:{" "}
          <a href="https://secfilingdex.com/learn/13f/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/13f
          </a>
          .
        </p>

        <InvestingBooks
          heading="Foundational reading on concentrated value investing"
          sub="The Buffett canon plus the deeper texts on long-duration positioning."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Historical analysis from SEC Form 13F-HR + DEF 14A proxy disclosures + Berkshire Hathaway 2011-2024 annual reports + Bank of America 2011-2017 8-K filings disclosing the original deal terms + 2017 warrant exercise.{" "}
          <a href="/methodology" className="underline">Methodology</a>.
        </p>

        <CiteThisPage />
        <FamousTradesBlock currentSlug="buffett-bank-of-america-2011" />
        <LearnReadNext currentSlug="buffett-bank-of-america-2011" />

        <ShareStrip url="https://holdlens.com/learn/buffett-bank-of-america-2011" title="Warren Buffett's Bank of America 2011 deal" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See live tracked-manager holdings on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/investor/warren-buffett" className="text-brand hover:underline">Warren Buffett dossier</a>
            {" — full Berkshire 13F holdings + every change since the Q3 2017 BAC common-stock disclosure. Sister property cataloging every SEC form: "}
            <a href="https://secfilingdex.com/" className="text-brand hover:underline">SecFilingDex</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
