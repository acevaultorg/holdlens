import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import FoundersNudge from "@/components/FoundersNudge";
import BrokerCta from "@/components/BrokerCta";

// /def-14a/ — keyword-targeted SEO landing page for the SEC filing type
// "DEF 14A". Operator's strategic stack listed "DEF 14A Proxy Season"
// (APS 47) but the live tracker URL is /proxies/ — operators searching
// "DEF 14A 2026" / "what is DEF 14A" / "DEF 14A filing" miss the tracker.
//
// Strategy: this page owns the `def-14a` keyword (definition + regulatory
// context) and links prominently to /proxies/ (the live tracker). Two
// SEO targets, one shared concept. Each page self-canonicalizes so they
// don't compete; the cluster strengthens topical authority on SEC proxy
// filings overall.
//
// LLM-citation design (Aleyda Solis 10-characteristic, per
// rules/concept-finder-methodology.md v2.1 Layer 7): static export +
// quote-ready H2s + DefinedTerm schema for "DEF 14A" + corroborated
// outbound to SEC.gov + freshness signals. Targets ChatGPT/Claude/
// Perplexity citation queries: "what is DEF 14A", "DEF 14A vs 10-K",
// "when are DEF 14A filed", "where to find DEF 14A".

export const metadata: Metadata = {
  title: "DEF 14A — what it is, what's in it, where to read every filing",
  description:
    "DEF 14A is the SEC's definitive proxy statement. Annual-meeting agenda, exec compensation, board nominations, activist proxy contests. Filed Q1-Q2. Read every public-US filing live on HoldLens.",
  alternates: { canonical: "https://holdlens.com/def-14a/" },
  openGraph: {
    title: "DEF 14A — definitive proxy statement explained",
    description:
      "Annual-meeting votes, exec comp packages, activist campaigns. Every public-US DEF 14A from EDGAR.",
    url: "https://holdlens.com/def-14a/",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — DEF 14A explained" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DEF 14A — definitive proxy statement explained",
    description:
      "Annual votes, exec comp, activist proxy contests. Every public-US filing from EDGAR.",
    images: ["/og/home.png"],
  },
  robots: { index: true, follow: true },
};

export default function Def14APage() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "DEF 14A — what it is, what's in it, where to read every filing",
    description:
      "DEF 14A is the SEC's definitive proxy statement. Filed annually before shareholder meetings. Discloses exec comp, board nominations, activist proxy contests, related-party transactions.",
    url: "https://holdlens.com/def-14a/",
    datePublished: "2026-04-30",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com/",
      logo: { "@type": "ImageObject", url: "https://holdlens.com/og/home.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://holdlens.com/def-14a/" },
    inLanguage: "en-US",
  };
  const definedTermLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: "DEF 14A",
    alternateName: ["Definitive Proxy Statement", "Form DEF 14A", "Proxy Statement"],
    description:
      "DEF 14A is the SEC form code for a definitive proxy statement. Public US companies must file Form DEF 14A under Section 14(a) of the Securities Exchange Act of 1934 before each annual shareholder meeting. The filing discloses every matter on which shareholders will vote — director elections, executive compensation ratification (Say-on-Pay), auditor approval, M&A authorizations — plus full executive compensation tables, board composition, related-party transactions, and audit/comp committee structure.",
    inDefinedTermSet: "https://www.sec.gov/cgi-bin/browse-edgar",
    url: "https://holdlens.com/def-14a/",
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "DEF 14A", item: "https://holdlens.com/def-14a/" },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a DEF 14A?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DEF 14A is the SEC form code for a definitive proxy statement. Public US companies file it before each annual shareholder meeting to disclose voting matters, executive compensation, board composition, and related-party transactions.",
        },
      },
      {
        "@type": "Question",
        name: "When are DEF 14A filed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most DEF 14A filings cluster between February and May (Q1-Q2), 30-60 days before each issuer's annual meeting. The SEC requires filing at least 10 calendar days before the meeting unless soliciting via earlier preliminary proxy.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between DEF 14A and PRE 14A?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PRE 14A is the preliminary proxy statement filed first when SEC review is required (e.g., for non-routine matters like mergers). DEF 14A is the definitive version that is mailed to shareholders and binds the vote.",
        },
      },
      {
        "@type": "Question",
        name: "Where can I read every DEF 14A?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every DEF 14A is on the SEC EDGAR system at sec.gov free. HoldLens aggregates DEF 14A filings across the public-US universe and surfaces voting outcomes, exec comp, and activist proxy contests on holdlens.com/proxies/ — free.",
        },
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-8 sm:px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        SEC filing type
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        <span className="text-brand">DEF 14A</span> — the SEC's definitive proxy statement
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-3">
        DEF 14A is the form code for a <strong className="text-text">definitive proxy statement</strong>.
        Every public US company must file it under Section 14(a) of the Securities Exchange Act of 1934
        before each annual shareholder meeting.
      </p>
      <p className="text-dim text-sm mb-10">
        Want every filing live across the universe? →{" "}
        <Link href="/proxies/" className="text-brand underline font-semibold">
          DEF 14A Proxy Tracker
        </Link>
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">What's inside a DEF 14A</h2>
        <ul className="space-y-3 list-disc list-inside text-muted leading-relaxed">
          <li>
            <strong className="text-text">Annual-meeting agenda</strong> — every matter on which
            shareholders will vote: director elections, Say-on-Pay ratification, auditor approval,
            M&A authorizations, equity-plan amendments
          </li>
          <li>
            <strong className="text-text">Executive compensation tables</strong> — full breakdown
            of named-executive pay including base salary, cash bonus, stock awards, option awards,
            non-equity incentive comp, pension changes, and "all other" comp
          </li>
          <li>
            <strong className="text-text">Board composition</strong> — directors up for election,
            committee membership (audit, compensation, nominating), independence status
          </li>
          <li>
            <strong className="text-text">Activist proxy contests</strong> — disclosed only when
            an activist files competing slate (cross-references the{" "}
            <Link href="/activist/" className="text-brand underline">
              13D/13G activist tracker
            </Link>
            )
          </li>
          <li>
            <strong className="text-text">Related-party transactions</strong> — disclosures of
            insider deals between officers/directors and the company
          </li>
          <li>
            <strong className="text-text">Audit + compensation committee reports</strong>
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">When DEF 14A are filed</h2>
        <p className="text-muted leading-relaxed mb-3">
          Most DEF 14A filings cluster between <strong className="text-text">February and May</strong>{" "}
          — about 30-60 days before each issuer's annual meeting. The SEC requires filing at least
          10 calendar days before the meeting unless solicitation is via earlier preliminary proxy.
        </p>
        <p className="text-muted leading-relaxed">
          Q1-Q2 is therefore peak proxy season for the public-US universe. HoldLens's tracker
          surfaces the densest filing weeks each year.
        </p>
      </section>

      <FoundersNudge tone="brand" context="You're researching SEC governance disclosures (DEF 14A proxy statements)." />
      <BrokerCta context="Want to vote your shares on the proxy? Most discount brokers handle proxy voting in-app." />
      <AdSlot format="horizontal" />

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">DEF 14A vs PRE 14A — which one binds?</h2>
        <p className="text-muted leading-relaxed mb-3">
          <strong className="text-text">PRE 14A</strong> is the preliminary proxy statement, filed
          first when SEC review is required (typically for non-routine matters like mergers,
          authorized-share increases, or contested votes). The SEC reviews + comments;
          the issuer responds.
        </p>
        <p className="text-muted leading-relaxed">
          <strong className="text-text">DEF 14A</strong> is the final binding version that is mailed
          to shareholders. It supersedes the preliminary draft. When tracking proxy season, DEF 14A
          is the document that matters — the one shareholders actually vote on.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Where to read every DEF 14A</h2>
        <ul className="space-y-3 list-disc list-inside text-muted leading-relaxed">
          <li>
            <strong className="text-text">SEC EDGAR (free, primary source)</strong> —{" "}
            <a
              href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=DEF+14A&dateb=&owner=include&count=40"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline"
            >
              sec.gov DEF 14A index
            </a>{" "}
            — every filing within hours of submission
          </li>
          <li>
            <strong className="text-text">HoldLens DEF 14A Proxy Tracker</strong> —{" "}
            <Link href="/proxies/" className="text-brand underline">
              holdlens.com/proxies/
            </Link>{" "}
            — every DEF 14A across the public-US universe with vote results, exec comp summaries,
            and activist-contest flags. Free.
          </li>
        </ul>
      </section>

      <section className="border-t border-border pt-10 mt-12">
        <h2 className="text-xl font-bold text-text mb-4">Related on HoldLens</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/proxies/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Proxy Tracker</div>
            <div className="text-xs text-muted">
              Every DEF 14A live across the universe — votes, exec comp, activist campaigns.
            </div>
          </Link>
          <Link
            href="/activist/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Activist tracker</div>
            <div className="text-xs text-muted">
              13D/13G filings — when investors cross 5% ownership and signal intent.
            </div>
          </Link>
          <Link
            href="/events/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Material events</div>
            <div className="text-xs text-muted">
              SEC Form 8-K — earnings, M&A, bankruptcy, CEO change, cybersecurity.
            </div>
          </Link>
        </div>
      </section>

      <p className="text-xs text-dim mt-12">
        DEF 14A is a public SEC filing under Section 14(a) of the Securities Exchange Act of 1934.
        Source: SEC EDGAR. Not investment advice.{" "}
        <Link href="/methodology" className="underline">
          Methodology
        </Link>
        .
      </p>
    </div>
  );
}
