import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "About HoldLens",
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

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 prose-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }} />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">About</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Smart money, out loud.</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <p>
          HoldLens exists for one reason: <strong>to help retail investors follow the smartest minds in the
          market</strong> — without paying for a Bloomberg terminal, without sifting raw SEC filings,
          and without buying overpriced "stock pick" newsletters.
        </p>
        <p>
          Every quarter, the world's best investors — Warren Buffett, Bill Ackman, David Einhorn, Seth Klarman,
          Joel Greenblatt, Carl Icahn — file disclosures with the SEC. We parse them, score them, and surface
          what actually matters: who's buying, who's selling, and which positions reflect real conviction
          versus mechanical rebalancing.
        </p>
        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">What we believe</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li><strong className="text-text">Free is non-negotiable</strong> for the core product. Always will be.</li>
          <li><strong className="text-text">Honest about limits</strong> — 13Fs are 45 days late. No copy-trading hype.</li>
          <li><strong className="text-text">Original signal {">"}  data dump</strong> — we add proprietary scoring on top of public data.</li>
          <li><strong className="text-text">No dark patterns</strong> — no countdown timers, no fake urgency, no signup walls.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">Not investment advice</h2>
        <p className="text-muted">
          HoldLens shows you what others are doing. It does not tell you what you should do. Always do your own
          research and consult a licensed financial advisor before making investment decisions.
        </p>
      </div>

      <AdSlot format="in-article" />
    </div>
  );
}
