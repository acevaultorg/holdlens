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
  title: "Warren Buffett's Apple position — Berkshire's largest equity holding",
  description:
    "Berkshire Hathaway began accumulating Apple in Q1 2016 and built it into the firm's largest-ever equity position — peaking at ~5.5% of Apple's outstanding shares and ~50% of Berkshire's public equity portfolio. A partial trim in 2024 reduced exposure; Apple remains Berkshire's #1 holding. Full 13F-traceable accumulation timeline.",
  alternates: { canonical: "https://holdlens.com/learn/buffett-apple-position" },
  openGraph: {
    title: "Warren Buffett's Apple position",
    description:
      "Berkshire's 2016-onward Apple accumulation — largest equity position in firm history. Full 13F trail.",
    url: "https://holdlens.com/learn/buffett-apple-position",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Warren Buffett's Apple position",
    description: "Berkshire's largest equity position. 2016 entry, 13F-traceable.",
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
      { "@type": "ListItem", position: 3, name: "Buffett Apple position", item: "https://holdlens.com/learn/buffett-apple-position" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Warren Buffett's Apple position — Berkshire's largest equity holding",
    description: "Historical analysis of Berkshire Hathaway's 2016-onward Apple accumulation.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/buffett-apple-position",
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Warren Buffett",
      "Berkshire Hathaway",
      "Apple Inc.",
      "AAPL 13F",
      "concentrated value investing",
      "Buffett technology position",
      "capital return program",
      "$150 billion position",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens famous trades — public-record case studies",
      url: "https://holdlens.com/collections/famous-trades",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001067983&type=13F-HR",
      "https://en.wikipedia.org/wiki/Berkshire_Hathaway",
      "https://en.wikipedia.org/wiki/Apple_Inc.",
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
        name: "Apple Inc.",
      },
      {
        "@type": "DefinedTerm",
        name: "Largest 13F equity position in Berkshire history",
        description:
          "At peak holding (~Q3 2023), Berkshire's Apple stake was approximately 905 million shares — roughly 5.5% of Apple's outstanding stock and ~$170B market value, representing ~50% of Berkshire's disclosed public-equity portfolio. Larger in dollar terms than any prior Berkshire equity position including Coca-Cola, Wells Fargo, IBM, or American Express at their respective peaks.",
      },
      {
        "@type": "DefinedTerm",
        name: "Capital return program leverage",
        description:
          "Apple's aggressive buyback program (2013-onward) mechanically increased Berkshire's percentage ownership of Apple each year without Berkshire purchasing additional shares. Buffett has cited this as a structural reason for the position: 'each year our ownership goes up, and we haven't bought a single share.' A passive-accretion long.",
      },
      {
        "@type": "DefinedTerm",
        name: "13F-traceable accumulation",
        description:
          "Berkshire's Q1 2016 13F first disclosed Apple (~9.8 million shares). Every subsequent quarter through Q4 2018 added shares — reconstructable in detail from sequential 13F-HR filings on EDGAR. Post-2018 the position was largely stable until the 2024 trim. Public-record visibility throughout.",
      },
    ],
  },
];

export default function BuffettApplePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Famous trades</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Warren Buffett&apos;s Apple position</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Berkshire Hathaway first disclosed <strong className="text-text">Apple Inc.</strong> (NASDAQ: AAPL) in its Q1 2016 13F filing — a small ~9.8 million share initial stake. By the end of 2018, Berkshire had accumulated approximately <strong className="text-text">252 million shares</strong> at a cost basis of roughly <strong className="text-text">$36 billion</strong>. The position grew through Apple&apos;s own buyback program over the following years to a peak of ~5.5% of Apple&apos;s outstanding stock. A partial trim in 2024 reduced exposure, but Apple remains Berkshire&apos;s single largest equity holding — the largest individual stock position in Berkshire&apos;s history.
        </TldrCard>

        <p className="text-lg text-muted">
          Buffett spent his career publicly skeptical of technology. He famously sat out the 1990s tech boom, declined Microsoft despite his friendship with Bill Gates, and called himself unable to evaluate the durability of tech moats. Then in 2016, at age 85, Berkshire began accumulating Apple. The position became the largest single equity bet in Berkshire&apos;s history — measured in dollars, share count, and percentage of the firm&apos;s public-equity portfolio. The trade is a case study in (a) what changed about Apple specifically that broke Buffett&apos;s usual filter, and (b) how SEC 13F filings document the accumulation quarter-by-quarter.
        </p>

        <AuthorByline date="2026-05-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The accumulation timeline (Q1 2016 — Q4 2018)</h2>
        <p className="text-muted">
          Reconstructable from sequential 13F-HR filings on{" "}
          <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001067983&type=13F-HR" className="text-brand underline" rel="noopener">SEC EDGAR (Berkshire CIK 1067983)</a>:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Q1 2016</strong> — Initial position disclosed: ~9.8 million shares (~$1.1B at quarter-end)</li>
          <li><strong className="text-text">Q2 2016 — Q4 2016</strong> — Increased to ~57 million shares by year-end (~$6.6B)</li>
          <li><strong className="text-text">2017</strong> — Steady accumulation throughout the year; ~166 million shares by Q4 2017 (~$28B)</li>
          <li><strong className="text-text">2018</strong> — Aggressive buying, particularly in the second half; ~252 million shares by Q4 2018 (~$40B at year-end)</li>
          <li><strong className="text-text">2019-2023</strong> — Position largely flat in share count, but percentage ownership of Apple rose due to Apple&apos;s own buybacks reducing share count from ~22B to ~16B</li>
          <li><strong className="text-text">2024</strong> — Partial trim disclosed in Q2/Q3 2024 13Fs — approximately half the position sold over two quarters</li>
        </ul>

        <p className="text-muted mt-3">
          The Q1 2016 13F is particularly notable because it was filed by Ted Weschler or Todd Combs (Berkshire&apos;s two newer investment lieutenants) — Buffett later acknowledged that the initial purchases were made by his deputies and he subsequently became the conviction holder. From 2017 onward the additional buying was Buffett&apos;s personal decision.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">The thesis (in Buffett&apos;s own words)</h2>
        <p className="text-muted">
          Across Berkshire annual letters, CNBC interviews, and the 2018-2024 Berkshire annual meetings, Buffett articulated his Apple thesis in remarkably consistent terms:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Consumer brand, not tech</strong> — Buffett repeatedly framed Apple as &quot;the consumer brand of the world&quot; rather than a technology company. iPhone customers&apos; switching cost is psychological, not technical. This reclassification let Apple pass Buffett&apos;s usual consumer-staples filter.</li>
          <li><strong className="text-text">Ecosystem lock-in</strong> — Buffett called the iPhone &quot;probably the best business I know in the world.&quot; The ecosystem (App Store, iMessage, iCloud, Apple Pay, AirPods, Watch) functions as switching-cost reinforcement on top of the device itself.</li>
          <li><strong className="text-text">Capital return at scale</strong> — Apple has returned roughly $700B+ to shareholders via buybacks since 2013. For a long-duration holder, the buyback program mechanically increases ownership each year. Buffett: &quot;Each year our ownership of Apple goes up.&quot;</li>
          <li><strong className="text-text">Management quality</strong> — Buffett has consistently praised Tim Cook&apos;s operational execution + capital allocation, particularly the disciplined buyback program (vs M&A or excessive dividends).</li>
          <li><strong className="text-text">Per-customer economics</strong> — Apple&apos;s revenue per customer + repeat-purchase rate are structurally closer to Coca-Cola&apos;s consumer-product economics than to a typical hardware company.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">The capital-return mechanic (why the position grew without buying)</h2>
        <p className="text-muted">
          One of the cleanest case studies in Buffett&apos;s long-duration playbook is what happened to Berkshire&apos;s Apple ownership between 2019 and 2023:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>Berkshire&apos;s share count: roughly flat at ~895 million shares</li>
          <li>Apple&apos;s total share count: declined from ~22 billion to ~15.5 billion (Apple bought back ~30% of itself)</li>
          <li>Berkshire&apos;s percentage ownership of Apple: rose from ~4.0% to ~5.8%</li>
          <li>Effective &quot;buy without buying&quot; — Apple&apos;s aggressive buyback program functioned as a continuous concentration mechanism for any long-term holder</li>
        </ul>

        <p className="text-muted mt-3">
          Buffett has cited this dynamic as one of the structural reasons concentrated long-duration positions in businesses with strong capital-return programs compound at rates that pure dividend payers can&apos;t match.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The 2024 trim — context + magnitude</h2>
        <p className="text-muted">
          Berkshire disclosed in its Q2 2024 and Q3 2024 13F filings that it had reduced its Apple position by approximately half over those two quarters. The trim was notable for its scale (~$70-100B in proceeds at then-market prices) and timing (post-significant Apple appreciation but before AI-driven multiple expansion in late 2024 / early 2025). Apple still remained Berkshire&apos;s largest single equity position post-trim.
        </p>
        <p className="text-muted mt-3">
          Buffett offered no specific public explanation for the trim beyond general comments about tax planning (Berkshire historically harvests gains at favorable tax rates when possible) and portfolio sizing (the position had grown to ~50% of Berkshire&apos;s disclosed equity portfolio at peak — uncomfortably concentrated even for a concentrated-value investor).
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Return profile + comparison to Coca-Cola</h2>
        <p className="text-muted">
          Cost basis: ~$36B accumulated 2016-2018. Peak market value: ~$170B (Q3 2023). Approximate net gain at peak: ~$130B, or ~4.7× cost basis over ~7 years.{" "}
        </p>
        <p className="text-muted mt-3">
          Comparison to{" "}
          <a href="/learn/buffett-coca-cola-trade" className="text-brand underline">the 1988-89 Coca-Cola trade</a>
          {" "}— which compounded $1.3B → ~$28B over 37 years for ~21× cost basis. Apple compounded faster (per-year terms) but Coca-Cola compounded longer (absolute multiple). Apple may eventually surpass Coca-Cola&apos;s multiple if Berkshire holds the remaining position for additional decades.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Reading the position post-2024</h2>
        <p className="text-muted">
          Each quarter going forward, Berkshire&apos;s 13F-HR filing on EDGAR will disclose any further changes to the Apple holding. The post-trim position is approximately 300 million shares — still Berkshire&apos;s largest individual stock holding but no longer at the ~50% concentration peak.
        </p>
        <p className="text-muted mt-3">
          The disposition pattern post-2024 (whether Berkshire continues to trim, holds flat, or re-accumulates) will reveal whether the 2024 trim was a one-time portfolio-sizing decision or part of a longer-duration exit. The 45-day 13F lag means each quarter&apos;s evidence arrives ~6 weeks after the fact — see{" "}
          <a href="/learn/45-day-lag-explained" className="text-brand underline">our explainer on the 45-day lag</a>.
        </p>

        <OurView>
          <p>
            The Buffett-Apple position is a study in two intersecting principles: (1) classification matters — by re-framing Apple as a consumer brand rather than a tech company, Buffett let himself buy something he previously would have skipped; (2) capital-return programs compound silently — between 2019 and 2023 Berkshire&apos;s effective ownership of Apple grew by ~45% without Berkshire buying a single additional share, purely through Apple&apos;s own buyback program reducing the denominator.
          </p>
          <p>
            For HoldLens tracking purposes, Berkshire&apos;s 13F is one of the most-watched quarterly filings in the market and the Apple position remains its largest line item. Any further trim or re-accumulation will show up in our{" "}
            <a href="/investor/warren-buffett" className="text-brand underline">Buffett dossier</a>
            {" "}within ~6 weeks of the underlying quarter close.
          </p>
        </OurView>

        <p className="text-muted text-sm border-l-2 border-border pl-4 mt-6">
          The 13F filings + Form 4 trail for this position are catalogued on our sister site:{" "}
          <a href="https://secfilingdex.com/learn/13f/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/13f
          </a>
          {" "}+ {" "}
          <a href="https://secfilingdex.com/learn/form-4/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/form-4
          </a>
          .
        </p>

        <InvestingBooks
          heading="Foundational reading on concentrated value investing"
          sub="The Buffett canon plus the deeper texts on long-duration positioning. Graham, Lynch, Buffett, Munger — the foundations."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Historical analysis from SEC Form 13F-HR + DEF 14A proxy disclosures + Berkshire Hathaway annual reports.{" "}
          <a href="/methodology" className="underline">Methodology</a>.
        </p>

        <CiteThisPage />
        <FamousTradesBlock currentSlug="buffett-apple-position" />
        <LearnReadNext currentSlug="buffett-apple-position" />

        <ShareStrip url="https://holdlens.com/learn/buffett-apple-position" title="Warren Buffett's Apple position" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See live tracked-manager holdings on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/investor/warren-buffett" className="text-brand hover:underline">Warren Buffett dossier</a>
            {" — full Berkshire 13F holdings + ConvictionScore breakdown + every change since Q1 2016. Sister property cataloging every SEC form: "}
            <a href="https://secfilingdex.com/" className="text-brand hover:underline">SecFilingDex</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
