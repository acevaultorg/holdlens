import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import FoundersNudge from "@/components/FoundersNudge";
import BrokerCta from "@/components/BrokerCta";
import {
  COUNTRIES,
  getCountry,
  getTreatyCell,
  resolveEffectiveRate,
  computeNetAfterWithholding,
  META,
  type CountryCode,
} from "@/lib/dividend-tax";

// Programmatic per-pair page: how dividends paid from PAYER to a resident
// of INVESTOR are taxed at source. Generated only for cells that are
// state: 'verified' or 'derived' — never for state: 'needs_research'
// (AP-3: no fabricated data-site content).
//
// As the operator's research cadence (75 → 400 cells) populates more
// cells from primary sources (PwC / KPMG / IRS Pub 901 / country tax
// authorities), the static-params list grows automatically — every
// cell that gets promoted from needs_research to verified ships its
// own pair page on the next build.
//
// Page-template archetype stack (Layer 5 stacking-bonus):
//   programmatic_page_with_unique_data       (treaty rate + citation)
//   comparison_vs_competitor_page            (other payers for same investor)
//   ai_visibility_optimized_page             (quote-ready single-fact answer)
//   schema_markup_article_person_org         (Article + BreadcrumbList JSON-LD)
//   internal_linking_hub_spoke               (cross-pair + back-to-hub links)
//   finite_public_dataset_programmatic       (treaty data is finite + public)

type PairParams = { investor: string; payer: string };

export async function generateStaticParams(): Promise<PairParams[]> {
  // Enumerate every (investor, payer) where the treaty cell is verified
  // or derived. Pairs in needs_research return 404 — we don't ship empty
  // pages or pages that imply rates we haven't sourced.
  const params: PairParams[] = [];
  for (const inv of COUNTRIES) {
    for (const pay of COUNTRIES) {
      const cell = getTreatyCell(inv.code, pay.code);
      if (cell && (cell.state === "verified" || cell.state === "derived")) {
        params.push({
          investor: inv.code.toLowerCase(),
          payer: pay.code.toLowerCase(),
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PairParams>;
}): Promise<Metadata> {
  const { investor, payer } = await params;
  const inv = getCountry(investor.toUpperCase());
  const pay = getCountry(payer.toUpperCase());
  if (!inv || !pay) return { title: "Pair not found" };

  const cell = getTreatyCell(inv.code, pay.code);
  if (!cell || cell.state === "needs_research") return { title: "Pair not yet verified" };

  const titleRate = cell.withholding_rate_pct === 0 ? "0% — no withholding" : `${cell.withholding_rate_pct}%`;
  const title = `${inv.name} investor → ${pay.name} dividends: ${titleRate} withholding`;
  const description = `Bilateral withholding tax on dividends paid from ${pay.name} companies to ${inv.name} residents — ${titleRate} per ${cell.treaty_reference}. Sourced from primary tax authority. Last verified ${cell.last_verified}.`;
  const canonical = `https://holdlens.com/dividend-tax/${inv.code.toLowerCase()}/${pay.code.toLowerCase()}/`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — dividend tax pair" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: ["/og/home.png"],
    },
  };
}

export default async function PairPage({ params }: { params: Promise<PairParams> }) {
  const { investor, payer } = await params;
  const investorCode = investor.toUpperCase() as CountryCode;
  const payerCode = payer.toUpperCase() as CountryCode;
  const inv = getCountry(investorCode);
  const pay = getCountry(payerCode);
  if (!inv || !pay) notFound();

  const cell = getTreatyCell(investorCode, payerCode);
  if (!cell || cell.state === "needs_research") notFound();

  const effective = resolveEffectiveRate(investorCode, payerCode);
  // resolveEffectiveRate returns kind === 'verified' | 'derived' | 'needs_research' | 'no_payer'.
  // The first two carry the rate; the latter two trip the notFound above. Re-narrow defensively.
  if (effective.kind !== "verified" && effective.kind !== "derived") notFound();

  const per100 = computeNetAfterWithholding(100, effective.rate_pct);
  const reductionVsStatutory = effective.statutory_rate_pct - effective.rate_pct;

  // Compound internal links — same investor, other payers (and vice versa).
  const otherPayersForInvestor = COUNTRIES.filter((c) => c.code !== payerCode)
    .map((c) => ({
      country: c,
      cell: getTreatyCell(investorCode, c.code),
    }))
    .filter((r) => r.cell && (r.cell.state === "verified" || r.cell.state === "derived"))
    .slice(0, 8);

  const otherInvestorsForPayer = COUNTRIES.filter((c) => c.code !== investorCode)
    .map((c) => ({
      country: c,
      cell: getTreatyCell(c.code, payerCode),
    }))
    .filter((r) => r.cell && (r.cell.state === "verified" || r.cell.state === "derived"))
    .slice(0, 8);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Dividend tax", item: "https://holdlens.com/dividend-tax/" },
      { "@type": "ListItem", position: 3, name: inv.name, item: `https://holdlens.com/dividend-tax/${inv.code.toLowerCase()}/` },
      { "@type": "ListItem", position: 4, name: `${inv.name} → ${pay.name}`, item: `https://holdlens.com/dividend-tax/${inv.code.toLowerCase()}/${pay.code.toLowerCase()}/` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${inv.name} investor receiving dividends from ${pay.name}: ${effective.rate_pct}% withholding`,
    description: `Bilateral withholding rate of ${effective.rate_pct}% applies under ${cell.treaty_reference}; statutory ceiling is ${effective.statutory_rate_pct}%.`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://holdlens.com/dividend-tax/${inv.code.toLowerCase()}/${pay.code.toLowerCase()}/`,
    },
    datePublished: cell.last_verified,
    dateModified: cell.last_verified,
    publisher: { "@id": "https://holdlens.com/#organization" },
    citation: cell.source_citation,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />

      <nav className="text-xs text-muted">
        <Link href="/dividend-tax/" className="hover:text-text">Dividend tax</Link>
        <span className="mx-2">→</span>
        <Link href={`/dividend-tax/${inv.code.toLowerCase()}/`} className="hover:text-text">
          {inv.flag} {inv.name}
        </Link>
        <span className="mx-2">→</span>
        <span className="text-text">{pay.flag} {pay.name}</span>
      </nav>

      <header className="mt-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          Dividend tax · {inv.name} investor → {pay.name} dividends
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          <span className="mr-2" aria-hidden>{inv.flag} → {pay.flag}</span>
          {inv.name} investor receiving {pay.name} dividends: {effective.rate_pct}% withholding
        </h1>
        <p className="text-muted text-lg mt-4 leading-relaxed">
          If you're a {inv.name} resident receiving dividends from a {pay.name}-domiciled company, the {pay.name} tax authority withholds {effective.rate_pct}% at source under {cell.treaty_reference}. The statutory non-treaty ceiling is {effective.statutory_rate_pct}% — the bilateral treaty saves you {reductionVsStatutory} percentage points. Verified {cell.last_verified}.
        </p>
      </header>

      <section className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-5 py-5">
            <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-2">
              Per $100 gross dividend
            </div>
            <div className="text-3xl font-bold text-text tabular-nums">
              ${per100.net.toFixed(2)} <span className="text-lg text-muted font-normal">net</span>
            </div>
            <div className="text-xs text-dim mt-1">
              ${per100.withheld.toFixed(2)} withheld at source
            </div>
          </div>
          <div className="rounded-xl border border-border bg-panel px-5 py-5">
            <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-2">
              Treaty rate
            </div>
            <div className="text-3xl font-bold text-text tabular-nums">{effective.rate_pct}%</div>
            <div className="text-xs text-dim mt-1">
              vs {effective.statutory_rate_pct}% statutory (saves {reductionVsStatutory}pp)
            </div>
          </div>
          <div className="rounded-xl border border-border bg-panel px-5 py-5">
            <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2">
              Verification state
            </div>
            <div className="text-2xl font-bold text-text capitalize">{cell.state}</div>
            <div className="text-xs text-dim mt-1">last verified {cell.last_verified}</div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Treaty reference</h2>
        <div className="rounded-xl border border-border bg-panel p-5 text-sm text-muted leading-relaxed">
          <strong className="text-text">{cell.treaty_reference}</strong>
          {cell.notes && <p className="mt-3">{cell.notes}</p>}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Source citation</h2>
        <div className="rounded-xl border border-border bg-panel p-5 text-sm text-muted leading-relaxed">
          {cell.source_citation}
        </div>
        <p className="text-xs text-dim mt-3">
          {META.disclaimer}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">{inv.name} resident tax treatment</h2>
        <div className="rounded-xl border border-border bg-panel p-5 text-sm text-muted leading-relaxed">
          {inv.resident_note}
        </div>
      </section>

      {otherPayersForInvestor.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-3">Other payer countries for {inv.name} investors</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherPayersForInvestor.map(({ country, cell: c }) => (
              <li key={country.code}>
                <Link
                  href={`/dividend-tax/${inv.code.toLowerCase()}/${country.code.toLowerCase()}/`}
                  className="flex items-center justify-between rounded-xl border border-border bg-panel p-4 hover:border-border-bright transition"
                >
                  <span className="flex items-center gap-2 text-text">
                    <span aria-hidden>{country.flag}</span>
                    <span>{country.name}</span>
                  </span>
                  <span className="font-mono text-sm text-emerald-400 tabular-nums">{c!.withholding_rate_pct}%</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/dividend-tax/${inv.code.toLowerCase()}/`}
            className="inline-block mt-4 text-sm text-brand hover:underline"
          >
            See all payer countries for {inv.name} investors →
          </Link>
        </section>
      )}

      {otherInvestorsForPayer.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-3">Other investor countries receiving {pay.name} dividends</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherInvestorsForPayer.map(({ country, cell: c }) => (
              <li key={country.code}>
                <Link
                  href={`/dividend-tax/${country.code.toLowerCase()}/${pay.code.toLowerCase()}/`}
                  className="flex items-center justify-between rounded-xl border border-border bg-panel p-4 hover:border-border-bright transition"
                >
                  <span className="flex items-center gap-2 text-text">
                    <span aria-hidden>{country.flag}</span>
                    <span>{country.name}</span>
                  </span>
                  <span className="font-mono text-sm text-emerald-400 tabular-nums">{c!.withholding_rate_pct}%</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <FoundersNudge tone="brand" context={`You're computing real after-tax dividend yield for ${inv.name} → ${pay.name}.`} />
      <BrokerCta context="Need a broker for tax-efficient cross-border dividend investing? Compare options." />
      <AdSlot format="horizontal" />

      <footer className="mt-16 pt-8 border-t border-border text-xs text-dim">
        <p>
          Educational summary. NOT tax advice. Tax rules change and interact with personal circumstances (account
          type, residency, domicile, double-tax treaty provisions). For your specific situation, consult a qualified
          tax professional in your country of residence.
        </p>
      </footer>
    </div>
  );
}
