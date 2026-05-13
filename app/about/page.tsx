import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: { absolute: "About HoldLens" },
  description: "HoldLens helps retail investors follow the smartest minds in the market — for free, with conviction analysis.",
  alternates: { canonical: "https://holdlens.com/about/" },
};

// LLM-citation infrastructure (per rules/concept-finder-methodology.md v2.1
// Layer 7 — characteristics #3 Recognizable + #7 Credible + #8 Differentiated).
// AboutPage + Organization + Person founder schema satisfies E-E-A-T for
// LLM crawlers (GPTBot, ClaudeBot, PerplexityBot) and Google's Page Experience
// signal. Without this block, /about returned schema=0 in v0.1.36 audit
// (2026-04-29) — the page existed but couldn't establish brand identity
// for LLM citation pickup.
const ABOUT_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: "https://holdlens.com/about/",
  name: "About HoldLens",
  description:
    "HoldLens parses SEC 13F + Form 4 filings from 30 of the world's best portfolio managers and computes a signed −100..+100 ConvictionScore per ticker. Free, ad-supported, structured for LLM citation.",
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", url: "https://holdlens.com/", name: "HoldLens" },
  about: {
    "@type": "Thing",
    name: "Hedge fund 13F holdings tracking + conviction scoring",
  },
};

const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://holdlens.com/#organization",
  name: "HoldLens",
  url: "https://holdlens.com",
  logo: "https://holdlens.com/icon.png",
  description:
    "Quarterly 13F-tracking + daily Form 4 insider tracking for 30 superinvestors. Original ConvictionScore + InsiderScore methodology. Free + ad-supported.",
  foundingDate: "2026-04",
  sameAs: ["https://github.com/acevaultorg/holdlens"],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@holdlens.com",
    contactType: "Customer support",
    availableLanguage: ["English"],
  },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://holdlens.com/about/" },
  ],
};

// Person schema — operator identity for E-E-A-T (Google Page Experience signal)
// + LLM-citation 10-characteristic #7 (Credible) per concept-finder-methodology
// v2.1 Layer 7. Without Person@id linkage from Article schema (already shipped
// across /investor/[slug] + /learn/* pages), LLM crawlers can't tie content
// authorship to a real human operator → citation gravity stays anonymous-tool
// instead of named-expert. The Person@id is referenceable from any future
// authored content via { author: { "@id": "https://holdlens.com/about/#person-founder" } }.
const PERSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://holdlens.com/about/#person-founder",
  name: "Paulo de Vries",
  url: "https://holdlens.com/about/",
  jobTitle: "Founder",
  worksFor: { "@id": "https://holdlens.com/#organization" },
  knowsAbout: [
    "SEC 13F filings",
    "SEC Form 4 insider transactions",
    "Portfolio analysis",
    "Hedge fund tracking",
    "Conviction-weighted scoring methodology",
    "Value investing",
  ],
  email: "hello@holdlens.com",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 prose-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_LD) }} />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">About</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Smart money, out loud.</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <p>
          HoldLens exists for one reason: <strong>to help retail investors follow the smartest minds in the
          market</strong> — without paying for a Bloomberg terminal, without sifting raw SEC filings, and
          without buying overpriced &quot;stock pick&quot; newsletters.
        </p>
        <p>
          Every quarter, the world&apos;s best investors — Warren Buffett, Bill Ackman, David Einhorn, Seth Klarman,
          Joel Greenblatt, Carl Icahn — file Form 13F disclosures with the SEC. Inside those filings is the
          single most-credentialed dataset in retail-accessible finance: what professional money managers
          with at least $100M assets under management bought, sold, increased, or trimmed in the prior quarter.
          HoldLens parses every filing, scores conviction signal versus mechanical rebalancing, and surfaces
          the synthesis as a single signed −100 to +100 ConvictionScore per ticker.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">What HoldLens does (and what it does not)</h2>
        <p>
          <strong>What it does:</strong> aggregate quarterly Form 13F holdings from 30 tracked superinvestors
          plus daily Form 4 insider transactions from corporate officers and directors, normalize the raw SEC
          data into a uniform schema, compute composite ConvictionScore + InsiderScore signals across multiple
          factors (consensus across managers, multi-quarter persistence, position-size weighting, rare-buy
          rarity, insider cluster patterns), and present the synthesis as searchable per-ticker, per-investor,
          and per-insider dossiers — all derived from public SEC filings, all free, all ad-supported.
        </p>
        <p>
          <strong>What it does NOT do:</strong> recommend buying or selling any security. HoldLens is not a
          registered investment advisor. We do not provide personalized financial advice, do not endorse any
          ticker, and do not tell you what to do with your money. Our 2026 backtest over 221 ticker-quarter
          pairs found the ConvictionScore has no statistically significant predictive signal for forward
          returns (Pearson r = −0.117) — meaning the score is useful as <em>market intelligence</em> about
          where conviction money is positioned, not as a predictor of future price. We disclose this
          openly because it&apos;s the truth.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">Methodology in one paragraph</h2>
        <p>
          The ConvictionScore (signed −100 to +100) combines six factors per ticker: (1) net buyer-vs-seller
          count across the tracked manager set, (2) buy-action concentration weighted by position size relative
          to portfolio, (3) multi-quarter persistence (a 4-quarter accumulation pattern scores higher than a
          one-quarter spike), (4) rarity of the action (a Buffett initiation in a previously-untouched ticker
          carries more signal than incremental sizing), (5) cross-manager confluence (multiple independent
          tracked managers acting in the same direction), and (6) insider-action overlay (Form 4 buying or
          selling by corporate officers within the same window). The full computation is documented at
          <a href="/methodology" className="text-brand hover:underline"> /methodology</a> with worked examples
          and a published backtest. All inputs are public-domain SEC filings; the synthesis is original
          editorial work.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">Why we built it this way</h2>
        <p>
          The Bloomberg terminal costs $24,000 a year. Stock-pick newsletters charge $200–500 a year and
          their median 5-year track record is no better than a passive index. Raw EDGAR is free but practically
          unusable for retail investors — every 13F filing is a 200-page XML document with manually-entered
          ticker symbols and no aggregation across managers. The gap between the credentialed dataset (13Fs)
          and the retail investor is mostly a UX problem and a synthesis problem, not a data problem. HoldLens
          closes the gap by doing the work once, computationally, and surfacing the result as a free public
          tool — supported by ads, with no paywall on the core data, ever.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">Editorial principles</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li><strong className="text-text">Free is non-negotiable</strong> for the core product. Always will be. Pro tier removes ads + adds heavier features; the underlying ConvictionScore + per-ticker dossier stays free forever.</li>
          <li><strong className="text-text">Honest about limits</strong> — 13Fs are filed 45 days after quarter-end (mandated by SEC), so the data is not real-time. No copy-trading hype, no &quot;follow the whales&quot; promises. Every page that surfaces a 13F-derived signal also surfaces the lag disclosure.</li>
          <li><strong className="text-text">Original signal &gt; data dump</strong> — anyone can republish raw 13F filings. We add a proprietary scoring layer on top of the public data, document the methodology, and publish the backtest. The synthesis is what differentiates HoldLens from a thousand &quot;13F tracker&quot; sites.</li>
          <li><strong className="text-text">No dark patterns</strong> — no countdown timers, no fake urgency, no signup walls, no email-required-to-view-the-data, no confirmshame opt-outs, no auto-charge gotchas. The site renders fully on first paint without an account.</li>
          <li><strong className="text-text">Plain-English descriptive labels</strong> — we describe observed accumulation or selling patterns in factual language (Heavy accumulation, Net selling, Mixed) rather than recommendation labels (BUY, SELL, STRONG BUY). HoldLens is not a registered investment advisor; verdict-style recommendations would misrepresent what the data is.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">Operator + contact</h2>
        <p>
          HoldLens is built and maintained by Paulo de Vries (founder). Identity, methodology, and contact info
          are visible on every page; we don&apos;t hide behind a brand. Reach the operator at
          {" "}<a href="mailto:hello@holdlens.com" className="text-brand hover:underline">hello@holdlens.com</a>
          {" "}for press inquiries, data corrections, citation requests, partnership questions, or anything else.
          Source code for the conviction-scoring methodology is open: see the <a href="/methodology" className="text-brand hover:underline">methodology page</a> for
          the full computation and the <a href="/learn/conviction-score-explained" className="text-brand hover:underline">explainer</a> for plain-English walkthrough.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">Sister property</h2>
        <p>
          HoldLens is the applied analytical layer on a curated universe of 30 tracked superinvestors. The same
          operator runs a complementary site for the encyclopedic SEC reference — every form type, every filer,
          regulatory citations, programmatic JSON twin:
          {" "}<a href="https://secfilingdex.com/" className="text-brand hover:underline" rel="noopener">SecFilingDex</a>.
          When you want the catalog (what is a 10-K, what is a DEF 14A, the universe of all filings) start there;
          when you want applied analysis on tracked superinvestor positions, you&apos;re already here. The two sites
          do not duplicate content — they complement.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">Not investment advice</h2>
        <p className="text-muted">
          <strong>This site is informational only and is not investment advice.</strong> HoldLens shows you what
          tracked superinvestors and corporate insiders are doing in their public SEC filings. It does not tell you
          what you should do with your money. We are not a registered investment advisor. Always do your own
          research and consult a licensed financial advisor before making investment decisions. 13F holdings are
          reported with a 45-day SEC filing lag and represent point-in-time snapshots, not real-time positions.
          Past behavior of any tracked manager or insider does not predict future results.
        </p>
      </div>

      <AdSlot format="in-article" />
    </div>
  );
}
