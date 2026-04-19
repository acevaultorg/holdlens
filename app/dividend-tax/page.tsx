import type { Metadata } from "next";
import DividendTaxCalc from "@/components/DividendTaxCalc";
import { COUNTRIES, getCoverageStats, META } from "@/lib/dividend-tax";

export const metadata: Metadata = {
  title: "Dividend tax by country — what you actually keep per $100",
  description:
    "Estimate withholding tax on cross-border dividends from 20 investor countries. Treaty rates cited from IRS Publication 901 and OECD primary sources. Free calculator, no signup.",
  alternates: { canonical: "https://holdlens.com/dividend-tax" },
  openGraph: {
    title: "Dividend tax by country — cross-border withholding calculator",
    description:
      "Free calculator. Pick your country, pick the company's domicile, see what you keep per $100. Treaty-cited.",
    url: "https://holdlens.com/dividend-tax",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dividend tax by country",
    description: "Cross-border withholding on dividends, cited from primary sources. Free.",
    images: ["/og/home.png"],
  },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
    { "@type": "ListItem", position: 2, name: "Dividend tax", item: "https://holdlens.com/dividend-tax" },
  ],
};

const COLLECTION_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Dividend tax by country",
  description:
    "Cross-border dividend withholding tax calculator — 20 investor countries, cited from IRS Publication 901 and OECD sources.",
  url: "https://holdlens.com/dividend-tax",
  inLanguage: "en-US",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: COUNTRIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://holdlens.com/dividend-tax/${c.code.toLowerCase()}`,
      name: `Dividend tax rules for ${c.name} investors`,
    })),
  },
};

const DEFINED_TERMS_LD = [
  {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: "Withholding tax",
    description:
      "Tax deducted at source by the paying country before the dividend reaches the foreign investor.",
    inDefinedTermSet: "https://holdlens.com/dividend-tax",
  },
  {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: "Tax treaty",
    description:
      "A bilateral agreement between two countries that typically reduces the withholding tax rate on cross-border dividends below the statutory rate.",
    inDefinedTermSet: "https://holdlens.com/dividend-tax",
  },
  {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: "Foreign tax credit",
    description:
      "A credit most residence countries grant against domestic income tax for tax already withheld in the payer country, up to the treaty-reduced rate.",
    inDefinedTermSet: "https://holdlens.com/dividend-tax",
  },
];

export default function DividendTaxHub() {
  const coverage = getCoverageStats();
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_LD) }} />
      {DEFINED_TERMS_LD.map((term, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(term) }} />
      ))}

      <a href="/" className="text-xs text-muted hover:text-text">← HoldLens</a>

      <header className="mt-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          Dividend tax by country
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          What will you actually keep of a cross-border dividend?
        </h1>
        <p className="text-muted text-lg mt-4 leading-relaxed">
          If you're a resident of one country and you own shares in a company domiciled in another, the paying country typically withholds tax at source before the dividend reaches you. A tax treaty between the two countries usually reduces that rate. This tool shows what remains — with the treaty reference and primary-source citation for every published rate.
        </p>
      </header>

      <section className="mt-10">
        <DividendTaxCalc mode="full" />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Pick your country of residence</h2>
        <p className="text-muted mb-6 text-sm">
          Every supported country has a dedicated rules page with an example, the bilateral-treaty-reduced rate for each major payer country, and source citations.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {COUNTRIES.map((c) => (
            <a
              key={c.code}
              href={`/dividend-tax/${c.code.toLowerCase()}/`}
              className="rounded-xl border border-border bg-panel px-4 py-3 hover:border-brand hover:bg-panel-hi transition flex items-center gap-3 group"
            >
              <span className="text-2xl" aria-hidden>{c.flag}</span>
              <span>
                <span className="block font-semibold text-text group-hover:text-brand">{c.name}</span>
                <span className="block text-xs text-dim">
                  Statutory WHT: {c.statutory_dividend_wht_pct}%
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-3">Methodology &amp; coverage</h2>
        <div className="rounded-xl border border-border bg-panel p-5 text-sm text-muted leading-relaxed space-y-3">
          <p>
            <strong className="text-text">Scope:</strong> {coverage.investor_countries} investor countries × {coverage.payer_countries} payer countries.{" "}
            <span className="tabular-nums">{coverage.verified_pairs}</span> treaty cells verified against primary sources; the rest ship as &ldquo;data pending verification&rdquo; and fall back to the statutory non-treaty rate with a visible disclaimer. We never fabricate a rate to fill a table.
          </p>
          <p>
            <strong className="text-text">Primary sources used when populated:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {Object.entries(META.primary_sources).map(([key, label]) => (
              <li key={key} className="text-muted">{label}</li>
            ))}
          </ul>
          <p>
            <strong className="text-text">Last schema verification:</strong>{" "}
            <span className="tabular-nums">{META.last_verified}</span>
          </p>
          <p className="text-dim text-xs mt-2">
            {META.disclaimer}
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-3">Related</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href="/investor/"
            className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block"
          >
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">Superinvestors</div>
            <div className="font-semibold text-text">See who holds what — and which positions pay dividends</div>
            <div className="text-xs text-muted mt-1">30 tracked managers, full 13F portfolios.</div>
          </a>
          <a
            href="/learn/"
            className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block"
          >
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">Learn</div>
            <div className="font-semibold text-text">Plain-English guides to 13F, conviction scoring, and superinvestor method</div>
            <div className="text-xs text-muted mt-1">10+ articles, free to read.</div>
          </a>
        </div>
      </section>

      <p className="mt-16 text-xs text-dim">
        Estimates for educational purposes only. Tax rules change; consult a qualified tax professional for your specific situation. Not investment advice.
      </p>
    </div>
  );
}
