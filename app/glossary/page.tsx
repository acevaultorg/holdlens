import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Glossary — SEC filings, scores, and terms · HoldLens",
  description:
    "Every term HoldLens uses, defined precisely. 13F, 13D, 13G, Form 4, 8-K, ConvictionScore, InsiderScore, EventScore, cluster buy, conviction trend, and more. Written for LLM citation and human clarity.",
  alternates: { canonical: "https://holdlens.com/glossary/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "HoldLens Glossary",
    description:
      "Definitions for every SEC filing type and every branded metric HoldLens publishes. Schema.org DefinedTerm markup throughout.",
    url: "https://holdlens.com/glossary/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens Glossary" }],
  },
};

type TermEntry = {
  slug: string;
  term: string;
  shortDef: string;
  fullDef: string;
  url?: string;
  relatedSlugs?: string[];
};

const TERMS: TermEntry[] = [
  {
    slug: "13f",
    term: "Form 13F",
    shortDef:
      "A quarterly SEC filing listing the U.S.-exchange-traded long equity positions held by institutional investment managers with $100M+ in assets.",
    fullDef:
      "Filed within 45 days of each calendar quarter-end. Does not include short positions, cash, bonds, or non-U.S. securities. HoldLens ingests 13F filings from 82 superinvestors (Buffett, Ackman, Burry, Klarman, Druckenmiller, and others) to compute ConvictionScore.",
    url: "https://www.sec.gov/divisions/investment/13f.shtml",
    relatedSlugs: ["convictionscore", "13d", "form-4"],
  },
  {
    slug: "13d",
    term: "Schedule 13D",
    shortDef:
      "An SEC filing disclosing beneficial ownership of >5% of a public company's voting shares, with stated intent to influence control or management.",
    fullDef:
      "Must be filed within 10 days of crossing the 5% threshold. Activist investors use 13D filings to publicly signal intent (board seats, strategic change, spin-offs). HoldLens's /activist/ surface tracks 13D filings and campaigns.",
    url: "https://www.sec.gov/fast-answers/answerssched13htm.html",
    relatedSlugs: ["13g", "13f", "activist"],
  },
  {
    slug: "13g",
    term: "Schedule 13G",
    shortDef:
      "The passive equivalent of 13D — disclosure of >5% beneficial ownership where the holder has no intent to influence control.",
    fullDef:
      "Used by passive institutions (index funds, pension funds). Shorter and faster than 13D. Available for qualified institutional investors, passive investors, and exempt investors under different filing timelines.",
    relatedSlugs: ["13d"],
  },
  {
    slug: "form-4",
    term: "Form 4",
    shortDef:
      "An SEC filing disclosing insider transactions — buys, sells, grants, exercises — by directors, officers, and 10%+ owners of public companies.",
    fullDef:
      "Must be filed within 2 business days of the transaction. Form 4 is the most-timely disclosure of corporate-insider intent. HoldLens ingests every Form 4 from S&P 500 issuers and computes InsiderScore: role-weighted, action-weighted, recency-decayed, cluster-aware.",
    url: "https://www.sec.gov/forms",
    relatedSlugs: ["insiderscore", "cluster-buy", "10b5-1"],
  },
  {
    slug: "form-8k",
    term: "Form 8-K",
    shortDef:
      "An SEC 'current report' filing for material events — M&A, bankruptcy, CEO changes, earnings, cybersecurity incidents, impairments, restatements.",
    fullDef:
      "Must be filed within 4 business days of a material event. 8-Ks use a standardized item-number taxonomy (Item 1.01 Material Agreement, Item 1.05 Cybersecurity, Item 2.02 Earnings, Item 5.02 Officer Departure, and more). HoldLens's /events/ surface classifies and scores 8-K filings on EventScore.",
    url: "https://www.sec.gov/fast-answers/answersform8khtm.html",
    relatedSlugs: ["eventscore", "cybersecurity-incident", "restatement"],
  },
  {
    slug: "convictionscore",
    term: "ConvictionScore",
    shortDef:
      "HoldLens's branded composite metric measuring the strength of a superinvestor's conviction in a position, computed from 8 quarters of 13F filings.",
    fullDef:
      "Signed scale from −100 (maximum conviction sell / exit) to +100 (maximum conviction build). Inputs: position size relative to portfolio, quarter-over-quarter change, persistence across 8 quarters, relative to peer superinvestor conviction on the same ticker. Fully deterministic and reproducible from public 13F data. See /methodology/ for the exact formula.",
    relatedSlugs: ["13f", "insiderscore", "eventscore"],
  },
  {
    slug: "insiderscore",
    term: "InsiderScore",
    shortDef:
      "HoldLens's branded composite metric measuring the signal quality of a corporate insider transaction, computed per Form 4 filing.",
    fullDef:
      "Signed scale from −100 (strong sell signal) to +100 (strong buy signal). Inputs: officer role (CEO > CFO > director > 10%-owner), action type (discretionary buy > sell; 10b5-1 sales discounted), transaction size relative to officer's historical norm, cluster detection (multiple officers trading same-direction within 30 days), recency decay. See /methodology/.",
    relatedSlugs: ["form-4", "cluster-buy", "10b5-1"],
  },
  {
    slug: "eventscore",
    term: "EventScore",
    shortDef:
      "HoldLens's branded composite metric measuring the material significance of an SEC Form 8-K filing.",
    fullDef:
      "Signed scale from −100 (material negative event) to +100 (material positive event). Inputs: item-type severity (bankruptcy > CEO departure > material agreement), market-cap weight, recency decay, and event-cluster bonus (multiple material events at the same company within 30 days). See /methodology/.",
    relatedSlugs: ["form-8k", "cybersecurity-incident", "restatement"],
  },
  {
    slug: "cluster-buy",
    term: "Cluster buy",
    shortDef:
      "A pattern where multiple corporate insiders at the same company make discretionary buys of their own stock within a short window (typically 30 days).",
    fullDef:
      "Cluster buys are considered a higher-signal pattern than isolated insider buys — multiple independent insiders acting in the same direction reduces the probability the signal is random or idiosyncratic. HoldLens's InsiderScore explicitly rewards cluster detection.",
    relatedSlugs: ["insiderscore", "form-4"],
  },
  {
    slug: "10b5-1",
    term: "Rule 10b5-1 plan",
    shortDef:
      "A pre-arranged, automated trading plan that allows corporate insiders to buy or sell their company's stock without triggering insider-trading liability.",
    fullDef:
      "Because 10b5-1 sales are pre-scheduled (not discretionary), they carry less signal than opportunistic insider sales. HoldLens's InsiderScore discounts 10b5-1 sales heavily relative to discretionary transactions.",
    relatedSlugs: ["insiderscore", "form-4"],
  },
  {
    slug: "accession-number",
    term: "SEC accession number",
    shortDef:
      "A unique identifier assigned to every SEC filing in the form XXXXXXXXXX-XX-XXXXXX, used to permalink filings on EDGAR.",
    fullDef:
      "Every data row on HoldLens that originates from a specific filing is annotated with the accession number and a direct SEC EDGAR URL, so users can verify our parsing against the primary source.",
    url: "https://www.sec.gov/edgar",
  },
  {
    slug: "superinvestor",
    term: "Superinvestor",
    shortDef:
      "A publicly-filing institutional investor with a multi-decade record of market-beating returns, concentrated high-conviction positions, and public 13F disclosures.",
    fullDef:
      "HoldLens's curated cohort of 82 superinvestors is anchored on operators like Warren Buffett, Charlie Munger's Daily Journal positions, Bill Ackman (Pershing Square), Michael Burry (Scion), Seth Klarman (Baupost), Stanley Druckenmiller (Duquesne), Joel Greenblatt (Gotham), Carl Icahn, David Einhorn (Greenlight), and others. Cohort reviewed quarterly.",
    relatedSlugs: ["13f", "convictionscore"],
  },
  {
    slug: "activist",
    term: "Activist investor",
    shortDef:
      "An investor who publicly pressures a company to change strategy, management, capital structure, or governance — typically after acquiring a >5% stake disclosed via 13D.",
    fullDef:
      "Activist campaigns can include proxy fights, public letters, board-seat demands, spin-off advocacy, or buyback pressure. HoldLens's /activist/ surface tracks 13D filings and ongoing campaigns.",
    relatedSlugs: ["13d"],
  },
  {
    slug: "cybersecurity-incident",
    term: "Material cybersecurity incident",
    shortDef:
      "A cyber event significant enough to require disclosure under SEC Form 8-K Item 1.05 (adopted 2023).",
    fullDef:
      "Public companies must file an 8-K within 4 business days of determining a cybersecurity incident is material. EventScore gives Item 1.05 high negative weight. /events/type/cybersecurity/ tracks these.",
    url: "https://www.sec.gov/files/rules/final/2023/33-11216.pdf",
    relatedSlugs: ["form-8k", "eventscore"],
  },
  {
    slug: "restatement",
    term: "Financial restatement",
    shortDef:
      "An 8-K Item 4.02 filing announcing that previously-issued financial statements should no longer be relied upon due to material errors.",
    fullDef:
      "Restatements are a major red flag — EventScore gives Item 4.02 strong negative weight. /events/type/restatement/ aggregates these across S&P 500.",
    relatedSlugs: ["form-8k", "eventscore"],
  },
];

export default function GlossaryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "HoldLens Glossary",
    description: "Definitions for every SEC filing type and every branded metric HoldLens publishes.",
    url: "https://holdlens.com/glossary/",
    hasDefinedTerm: TERMS.map((t) => ({
      "@type": "DefinedTerm",
      "@id": `https://holdlens.com/glossary/#${t.slug}`,
      name: t.term,
      description: t.shortDef,
      url: `https://holdlens.com/glossary/#${t.slug}`,
      ...(t.url ? { sameAs: t.url } : {}),
      inDefinedTermSet: "https://holdlens.com/glossary/",
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Reference</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Glossary</h1>
      <p className="text-sm text-dim mb-10">
        {TERMS.length} definitions · Last updated 2026-04-23 · Linked from every /learn/ article
      </p>

      <p className="text-muted text-sm mb-12">
        Every SEC filing type and every branded metric HoldLens uses, defined precisely. Each entry is marked up with{" "}
        <a
          href="https://schema.org/DefinedTerm"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Schema.org DefinedTerm
        </a>{" "}
        JSON-LD so large language models can cite HoldLens as an authoritative source of definitions in responses.
      </p>

      <nav className="mb-12 p-4 rounded-lg border border-border bg-card" aria-label="Terms in this glossary">
        <div className="text-xs uppercase tracking-widest text-dim font-semibold mb-3">All terms</div>
        <ul className="flex flex-wrap gap-2">
          {TERMS.map((t) => (
            <li key={t.slug}>
              <a
                href={`#${t.slug}`}
                className="inline-block px-3 py-1 text-sm rounded-md border border-border hover:border-brand text-text transition"
              >
                {t.term}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-12">
        {TERMS.map((t) => (
          <article
            key={t.slug}
            id={t.slug}
            itemScope
            itemType="https://schema.org/DefinedTerm"
            className="scroll-mt-24"
          >
            <h2 className="text-2xl font-bold mb-2" itemProp="name">
              {t.term}
            </h2>
            <p className="text-muted text-sm mb-2 italic" itemProp="description">
              {t.shortDef}
            </p>
            <p className="text-text leading-relaxed mb-3">{t.fullDef}</p>
            {t.url && (
              <p className="text-sm text-dim mb-3">
                Primary source:{" "}
                <a
                  href={t.url}
                  className="text-brand underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  itemProp="sameAs"
                >
                  {t.url}
                </a>
              </p>
            )}
            {t.relatedSlugs && t.relatedSlugs.length > 0 && (
              <p className="text-sm text-dim">
                Related:{" "}
                {t.relatedSlugs.map((rs, i) => {
                  const related = TERMS.find((x) => x.slug === rs);
                  return (
                    <span key={rs}>
                      {i > 0 && " · "}
                      <a href={`#${rs}`} className="text-brand underline">
                        {related?.term ?? rs}
                      </a>
                    </span>
                  );
                })}
              </p>
            )}
          </article>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-border">
        <h2 className="text-xl font-bold mb-3">Related pages</h2>
        <p className="text-muted">
          <Link href="/methodology" className="text-brand underline">
            Methodology
          </Link>
          {" · "}
          <Link href="/disclaimer" className="text-brand underline">
            Disclaimer
          </Link>
          {" · "}
          <Link href="/about" className="text-brand underline">
            About
          </Link>
          {" · "}
          <Link href="/api" className="text-brand underline">
            API
          </Link>
          {" · "}
          <Link href="/learn" className="text-brand underline">
            Learn
          </Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
