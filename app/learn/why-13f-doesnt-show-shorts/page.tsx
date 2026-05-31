import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import InvestingBooks from "@/components/InvestingBooks";
import AuthorByline from "@/components/AuthorByline";
import ShareStrip from "@/components/ShareStrip";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";
import TldrCard from "@/components/learn/TldrCard";
import OurView from "@/components/learn/OurView";
import CiteThisPage from "@/components/learn/CiteThisPage";

export const metadata: Metadata = {
  title: "Why doesn't a 13F show short positions?",
  description:
    "Form 13F discloses only long US-equity positions — short sales, swaps, and the hedge structure are invisible. Here's exactly why, what does show up (including puts), and why it breaks naive copy-trading.",
  alternates: { canonical: "https://holdlens.com/learn/why-13f-doesnt-show-shorts" },
  openGraph: {
    title: "Why doesn't a 13F show short positions?",
    description:
      "13Fs are long-only by design. What that hides — shorts, swaps, hedges — and why a long position alone never tells you the full bet.",
    url: "https://holdlens.com/learn/why-13f-doesnt-show-shorts",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why doesn't a 13F show short positions?",
    description: "13Fs are long-only — shorts, swaps, and hedges are invisible.",
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
      { "@type": "ListItem", position: 3, name: "Why doesn't a 13F show short positions?", item: "https://holdlens.com/learn/why-13f-doesnt-show-shorts" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Why doesn't a 13F show short positions?",
    description:
      "Plain-English explanation of why Form 13F discloses only long US-equity positions, what it omits (short sales, swaps, hedge structure), and what does appear.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/why-13f-doesnt-show-shorts",
    datePublished: "2026-05-29",
    dateModified: "2026-05-29",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "13F short positions",
      "does 13F show shorts",
      "13F long only",
      "13F limitations",
      "13F puts calls",
      "hedge fund shorts disclosure",
    ],
    citation: [
      "https://www.sec.gov/divisions/investment/13ffaq",
      "https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.13f-1",
    ],
    about: [
      {
        "@type": "DefinedTerm",
        name: "Long position",
        description:
          "Owning a security outright, profiting if its price rises. Form 13F reports an institutional manager's long positions in Section 13(f) securities.",
      },
      {
        "@type": "DefinedTerm",
        name: "Short position",
        description:
          "A bet that a security's price will fall, typically by borrowing and selling shares. Short positions in equities are NOT disclosed on Form 13F.",
      },
      {
        "@type": "DefinedTerm",
        name: "Total return swap",
        description:
          "A derivative that gives a manager economic exposure to a stock without owning it directly. Swap exposure generally does not appear on Form 13F, so a manager's true economic position can differ from its disclosed holdings.",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://holdlens.com/learn/why-13f-doesnt-show-shorts#faq",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does a 13F show short positions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Form 13F discloses only long positions in Section 13(f) securities. Short sales of equities are not reported, so a manager that is hedged or net-short can look purely long on its 13F.",
        },
      },
      {
        "@type": "Question",
        name: "Do put options show up on a 13F?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — puts and calls that are Section 13(f) securities are reported as separate line items with a Put/Call designation. So a bearish options bet can appear, but a plain short sale of the underlying stock does not.",
        },
      },
      {
        "@type": "Question",
        name: "Why is a 13F long-only?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Form 13F is a disclosure of holdings of Section 13(f) securities over which a manager exercises investment discretion. A short sale is a borrowed-share obligation rather than a holding, so the SEC's reporting requirement has never extended to short positions.",
        },
      },
    ],
  },
];

export default function Why13FNoShortsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/learn" className="text-xs text-muted hover:text-text">← Learn</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Why doesn&rsquo;t a 13F show short positions?</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          A 13F is a <strong className="text-text">long-only</strong> disclosure: it lists the long US-equity positions a
          manager holds, and nothing else. <strong className="text-text">Short sales are invisible</strong> — so a fund that is
          fully hedged, or even net-short, can look purely bullish on paper. Put and call options
          <em> do</em> appear (with a Put/Call tag), but plain short stock, swaps, and the overall hedge
          structure do not. That is the single biggest reason a 13F long position never tells you the
          whole bet.
        </TldrCard>

        <p className="text-lg text-muted">
          Form 13F discloses only <strong className="text-text">long positions</strong> in{" "}
          <a href="/learn/what-is-a-13f" className="text-brand underline">Section 13(f) securities</a>. Short positions in
          stock are not reported at all — by design.
        </p>

        <AuthorByline date="2026-05-29" />

        <h2 className="text-2xl font-bold mt-10 mb-3">What a 13F actually reports</h2>
        <p className="text-muted">
          A 13F is a list of <strong className="text-text">holdings</strong> of 13(f) securities a manager owns long, with
          shares, market value, and voting authority for each. It also reports <strong className="text-text">put and call
          options</strong> that qualify as 13(f) securities, flagged in a Put/Call column. So a bearish
          <em> options</em> bet (Michael Burry&rsquo;s famous puts, for example) can show up.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">What it hides</h2>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Short sales of stock</strong> — completely absent. Borrowing and selling shares is an obligation, not a holding, so it is never reported.</li>
          <li><strong className="text-text">Swaps and total-return swaps</strong> — synthetic exposure that generally does not appear, so a manager&rsquo;s real economic position can differ from its filing.</li>
          <li><strong className="text-text">The hedge structure</strong> — you cannot tell whether a long is a standalone conviction bet or one leg of a paired/market-neutral trade.</li>
          <li><strong className="text-text">Non-US equities, bonds, cash, crypto, private holdings</strong> — none are 13(f) securities.</li>
        </ul>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Why this breaks naive copy-trading</h2>
        <p className="text-muted">
          Imagine a market-neutral fund that is long $1B of consumer stocks and short $1B of the same
          sector. Its 13F shows a confident-looking $1B long book — and zero of the offsetting short. A
          reader copying the longs would be taking a directional bet the fund itself deliberately
          <em> isn&rsquo;t</em> taking. The same trap applies to convertible-arbitrage, merger-arb, and pairs
          desks: the long leg is visible, the structure that makes it a hedge is not.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">So how should you read a long-only filing?</h2>
        <p className="text-muted">
          Treat a 13F as evidence of what a manager is <em>willing to own</em>, not proof of a clean
          directional view. The signal is strongest where the structure is simplest — concentrated,
          long-biased managers (value funds, family offices) whose 13F genuinely <em>is</em> close to their
          whole book. It is weakest for multi-strategy and market-neutral shops, where the visible longs
          are a fraction of the real positioning. More on the broader caveats:{" "}
          <a href="/learn/do-hedge-fund-signals-work" className="text-brand underline">do 13F signals actually work?</a>
        </p>

        <OurView>
          <p>
            This is the limitation we are most honest about. HoldLens&rsquo;s ConvictionScore is built
            entirely on the disclosed long book — it structurally cannot see shorts, swaps, or hedges. We
            do not pretend otherwise.
          </p>
          <p>
            That is exactly why we curate toward <em>long-biased, concentrated</em> managers, where the
            13F is close to the full picture, and why we weight by portfolio concentration and
            multi-quarter persistence rather than treating every filer&rsquo;s longs as a directional call. A
            big long position from a market-neutral fund and the same position from a value investor who
            owns 12 stocks are not the same evidence — and a long-only filing can&rsquo;t tell them apart, so
            the curation has to.
          </p>
        </OurView>

        <InvestingBooks
          heading="Foundational reading on securities analysis"
          sub="Understanding what the data omits is half of analysis. The books below taught the disciplined managers how to weigh incomplete evidence — Graham, Lynch, Munger."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Summarized from SEC Form 13F guidance; verify against the primary sources
          linked above. See <a href="/methodology" className="underline">methodology</a> for how we parse and score every filing.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="why-13f-doesnt-show-shorts" />

        <ShareStrip url="https://holdlens.com/learn/why-13f-doesnt-show-shorts" title="Why doesn't a 13F show short positions?" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See the disclosed long book on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/" className="text-brand hover:underline">Live 13F tracker</a>
            {" — every long position from 30+ tracked managers, scored on the −100..+100 ConvictionScore. "}
            {"Related explainers: "}
            <a href="/learn/what-is-a-13f" className="text-brand hover:underline">what is a 13F</a>
            {", "}
            <a href="/learn/45-day-lag-explained" className="text-brand hover:underline">the 45-day lag</a>
            {", "}
            <a href="/learn/do-hedge-fund-signals-work" className="text-brand hover:underline">do the signals work</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
