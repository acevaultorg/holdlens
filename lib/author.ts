/**
 * lib/author.ts — author + publisher identity for /learn articles
 *
 * Ships Person + Organization schema data for JSON-LD. Closes E-E-A-T
 * "Credible" characteristic gap per LEARNED.md (MODERATE → STRONG) and
 * unlocks the v18 `schema_markup_article_person_org` Distribution Oracle
 * archetype (×+20) on every /learn article.
 *
 * Pen-name "HoldLens Editorial" preserves operator privacy while providing
 * a verifiable, consistent author entity across every article. The entity
 * points back to /about where the editorial philosophy is declared.
 *
 * To upgrade later to a real-name byline, change the AUTHOR const below.
 */

export const AUTHOR_NAME = "HoldLens Editorial";

export const AUTHOR_URL = "https://holdlens.com/about";

export const PUBLISHER_REF = { "@id": "https://holdlens.com/#organization" };

/** Schema.org Person object for use as `author` in Article schema. */
export const AUTHOR_SCHEMA = {
  "@type": "Person",
  name: AUTHOR_NAME,
  url: AUTHOR_URL,
  jobTitle: "Editorial team",
  description:
    "The HoldLens editorial team writes plain-English guides to 13F filings, smart-money signals, and how superinvestors actually think. Every article is reviewed for factual accuracy against primary SEC sources.",
  knowsAbout: [
    "13F filings",
    "Hedge fund tracking",
    "Smart money investing",
    "Superinvestor portfolios",
    "SEC filings",
    "Conviction scoring",
    "Value investing",
    "Long-only equity strategies",
  ],
  worksFor: PUBLISHER_REF,
};
