import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DividendTaxCalc from "@/components/DividendTaxCalc";
import {
  COUNTRIES,
  getCountry,
  getTreatyCell,
  META,
  type CountryCode,
} from "@/lib/dividend-tax";

// Programmatic per-investor-country page for the dividend-tax section.
// Each page shows that investor's withholding matrix across all supported
// payer countries, with verified rates cited and needs_research cells
// flagged clearly. No fabricated data (AP-3).

export async function generateStaticParams() {
  return COUNTRIES.map((c) => ({ investor: c.code.toLowerCase() }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ investor: string }> },
): Promise<Metadata> {
  const { investor } = await params;
  const country = getCountry(investor.toUpperCase());
  if (!country) return { title: "Country not found" };
  const title = `Dividend tax for ${country.name} investors — what you keep per $100`;
  const description = `Withholding tax you'd pay as a ${country.name} resident on dividends from companies in 20 payer countries. Treaty rates cited from primary sources. No signup.`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://holdlens.com/dividend-tax/${country.code.toLowerCase()}`,
    },
    openGraph: {
      title,
      description,
      url: `https://holdlens.com/dividend-tax/${country.code.toLowerCase()}`,
      type: "article",
      images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: ["/og/home.png"],
    },
  };
}

export default async function InvestorCountryPage(
  { params }: { params: Promise<{ investor: string }> },
) {
  const { investor } = await params;
  const investorCode = investor.toUpperCase() as CountryCode;
  const country = getCountry(investorCode);
  if (!country) notFound();

  const rows = COUNTRIES.map((payer) => {
    const cell = getTreatyCell(investorCode, payer.code);
    return {
      payer,
      cell,
    };
  });

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Dividend tax", item: "https://holdlens.com/dividend-tax" },
      { "@type": "ListItem", position: 3, name: country.name, item: `https://holdlens.com/dividend-tax/${country.code.toLowerCase()}` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Dividend tax for ${country.name} investors`,
    description: `Cross-border withholding tax rules as they apply to a resident of ${country.name}, with bilateral treaty references for each payer country.`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://holdlens.com/dividend-tax/${country.code.toLowerCase()}`,
    },
    datePublished: "2026-04-19",
    dateModified: META.last_verified,
    publisher: { "@id": "https://holdlens.com/#organization" },
  };

  const verifiedCount = rows.filter(
    (r) => r.cell && (r.cell.state === "verified" || r.cell.state === "derived"),
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />

      <a href="/dividend-tax/" className="text-xs text-muted hover:text-text">← All countries</a>

      <header className="mt-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          Dividend tax · {country.name}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight flex items-center gap-3 flex-wrap">
          <span className="text-3xl" aria-hidden>{country.flag}</span>
          <span>Dividend tax for {country.name} investors</span>
        </h1>
        <p className="text-muted text-lg mt-4 leading-relaxed">
          If you're a {country.name} resident receiving dividends from a company domiciled abroad, the payer country typically withholds tax at source. A bilateral tax treaty usually lowers that rate below the statutory ceiling. Below, we show what's cited from a primary source — and flag every cell where a rate is still pending verification.
        </p>
      </header>

      <section className="mt-10">
        <DividendTaxCalc mode="full" defaultInvestorCountry={investorCode} />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Resident tax treatment</h2>
        <div className="rounded-xl border border-border bg-panel p-5 text-sm text-muted leading-relaxed">
          {country.resident_note}
        </div>
        {country.resident_guide && country.resident_guide.length > 0 && (
          <div className="mt-6 space-y-4 text-sm text-muted leading-relaxed">
            {country.resident_guide.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="text-xs text-dim pt-2 border-t border-border">
              Educational summary only — not legal or tax advice. Tax rules change and interact with personal circumstances (account type, residency, domicile, double-tax treaty provisions). For your specific situation, consult a qualified tax professional in your country of residence.
            </p>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-2">
          Treaty rates for {country.name} investors
        </h2>
        <p className="text-muted text-sm mb-5">
          {verifiedCount} of {rows.length} payer countries have a verified treaty rate cited below. The rest ship as &ldquo;data pending verification&rdquo; — never fabricated.
        </p>
        {/* Treaty matrix table. Mobile fits 3 columns at 375px; the
            Status signal is folded into the country column as a small
            badge next to the country name so the whole row stays
            readable without horizontal overflow. The "Verified" /
            "Data pending" title attribute + aria-label preserves the
            information for screen readers and keyboard focus. */}
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3">Company domiciled in</th>
                <th className="text-right px-4 py-3">Treaty WHT</th>
                <th className="text-right px-4 py-3">Statutory</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ payer, cell }) => {
                const verified =
                  cell && (cell.state === "verified" || cell.state === "derived");
                return (
                  <tr
                    key={payer.code}
                    className="border-b border-border last:border-0 align-top"
                  >
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 flex-wrap">
                        <span aria-hidden>{payer.flag}</span>
                        <span className="font-semibold text-text">{payer.name}</span>
                        {verified ? (
                          <span
                            className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wide text-brand bg-brand/10 rounded px-1.5 py-0.5"
                            title="Rate verified from primary source"
                            aria-label="Verified from primary source"
                          >
                            <span aria-hidden>✓</span>
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wide text-dim bg-border/50 rounded px-1.5 py-0.5"
                            title="Data pending verification — fallback to statutory rate"
                            aria-label="Data pending verification"
                          >
                            pending
                          </span>
                        )}
                      </span>
                      {verified && cell?.treaty_reference && (
                        <div className="text-xs text-dim mt-1">
                          {cell.treaty_reference}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {verified ? (
                        <span className="text-brand font-semibold">
                          {cell!.withholding_rate_pct}%
                        </span>
                      ) : (
                        <span className="text-dim text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted">
                      {payer.statutory_dividend_wht_pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Citation block — show every verified row's source so the whole
            page is defensible at a glance. */}
        {verifiedCount > 0 && (
          <details className="mt-4 rounded-xl border border-border bg-panel p-4 text-sm">
            <summary className="cursor-pointer font-semibold text-text">
              Show citations for verified rates
            </summary>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              {rows.filter((r) => r.cell && (r.cell.state === "verified" || r.cell.state === "derived")).map(({ payer, cell }) => (
                <li key={payer.code}>
                  <strong className="text-text">{payer.name}:</strong>{" "}
                  {cell!.source_citation}
                  {cell!.notes && (
                    <span className="block text-dim mt-0.5">{cell!.notes}</span>
                  )}
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Next steps</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted text-sm">
          <li>
            For the exact rate in your case, consult a qualified tax professional — published treaty rates assume proper documentation and standard portfolio ownership.
          </li>
          <li>
            If you invest through a broker, ask whether they apply treaty relief at source or require you to reclaim later via tax refund.
          </li>
          <li>
            Your residence country may offer a Foreign Tax Credit that offsets the withheld amount against your domestic tax bill, up to the treaty rate.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Related</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <a href="/dividend-tax/" className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block">
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">All countries</div>
            <div className="font-semibold text-text">Compare rules across 20 investor countries</div>
          </a>
          <a href="/investor/" className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block">
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">Superinvestors</div>
            <div className="font-semibold text-text">Which superinvestors hold tax-efficient dividend stocks</div>
          </a>
        </div>
      </section>

      <p className="mt-16 text-xs text-dim">
        Estimates for educational purposes only. Tax rules change; consult a qualified tax professional for your specific situation. Sources cited above were current as of {META.last_verified}. Not investment advice.
      </p>
    </div>
  );
}
