import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import {
  ACTIVIST_CAMPAIGNS,
  getCampaign,
  formatStake,
} from "@/lib/activists";

export async function generateStaticParams() {
  return ACTIVIST_CAMPAIGNS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCampaign(slug);
  if (!c) return { title: "Activist campaign not found" };
  return {
    title: `${c.activistFund} → ${c.targetTicker} (${c.targetCompany}) — ${c.filingType} activist filing`,
    description: `${c.activistName} holds ${formatStake(c.stakePct)} of ${c.targetTicker} via ${c.filingType} filed ${c.filingDate}. ${c.thesis ?? "Passive long-term position."}`,
    alternates: { canonical: `https://holdlens.com/activist/${c.slug}` },
    openGraph: {
      title: `${c.activistFund} · ${c.targetTicker} ${c.filingType}`,
      description: c.thesis ?? "Passive long-term position.",
      url: `https://holdlens.com/activist/${c.slug}`,
      type: "article",
      images: [
        { url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens" },
      ],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ActivistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCampaign(slug);
  if (!c) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${c.activistFund} ${c.filingType} on ${c.targetTicker}`,
    datePublished: c.initialFilingDate,
    dateModified: c.filingDate,
    author: { "@type": "Organization", name: "HoldLens" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
    mainEntityOfPage: `https://holdlens.com/activist/${c.slug}`,
    description: c.thesis ?? "Passive long-term position.",
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Activist", item: "https://holdlens.com/activist" },
      {
        "@type": "ListItem",
        position: 3,
        name: `${c.activistFund} → ${c.targetTicker}`,
        item: `https://holdlens.com/activist/${c.slug}`,
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <a href="/activist" className="text-xs text-muted hover:text-text">
        ← All activist campaigns
      </a>

      <div className="mt-6 mb-3 text-xs uppercase tracking-widest text-brand font-semibold">
        {c.filingType} · {c.intent === "active" ? "Active campaign" : c.intent === "event-driven" ? "Event-driven" : "Passive 13G"}
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">
        {c.activistFund} → <span className="text-brand">{c.targetTicker}</span>
      </h1>
      <p className="text-muted text-lg mb-8">
        {c.activistName} holds {formatStake(c.stakePct)} of {c.targetCompany}.
      </p>

      {/* Stat block */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <Stat label="Stake" value={formatStake(c.stakePct)} />
        <Stat label="Shares held" value={fmtShares(c.sharesHeld)} />
        <Stat label="Latest filing" value={c.filingDate} />
        <Stat
          label="Initial filing"
          value={c.initialFilingDate === c.filingDate ? "—" : c.initialFilingDate}
        />
      </div>

      {/* Thesis */}
      {c.thesis && (
        <aside
          className="mb-10 rounded-card border border-insight/30 bg-surface-insight p-5"
          aria-label="Activist thesis"
        >
          <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-2">
            What they want
          </div>
          <p className="text-sm text-text leading-relaxed">{c.thesis}</p>
        </aside>
      )}

      {/* HoldLens read */}
      <aside
        className="mb-10 rounded-card border border-border bg-panel p-5"
        aria-label="HoldLens read"
      >
        <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-2">
          HoldLens read
        </div>
        <p className="text-sm text-text leading-relaxed">
          {c.activistFund}&rsquo;s {c.filingType} on {c.targetTicker} crossed
          the SEC 5% threshold, requiring disclosure within 10 days. The{" "}
          {c.intent === "active"
            ? "13D filing means they reserve the right to engage management — board nominations, breakup proposals, CEO replacement are all on the table."
            : c.intent === "event-driven"
            ? "position is positioned for a specific catalyst rather than ongoing engagement."
            : "13G filing means they have explicitly disclaimed activist intent — passive long-term hold."}
          {c.outcome === "won" && " Outcome: campaign succeeded."}
          {c.outcome === "lost" && " Outcome: campaign lost (proxy fight or withdrawn)."}
          {c.outcome === "settled" && " Outcome: settlement reached with management."}
        </p>
      </aside>

      <AdSlot format="horizontal" />

      {/* Filing source */}
      <section className="mt-10 mb-12">
        <h2 className="text-xl font-bold mb-3">SEC source</h2>
        <a
          href={c.source.edgarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-border bg-panel p-5 hover:border-brand/40 transition"
        >
          <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
            EDGAR · {c.filingType}
          </div>
          <div className="text-sm font-semibold text-brand mb-1 break-all">
            {c.source.edgarUrl} ↗
          </div>
          {c.source.note && (
            <div className="text-xs text-muted mt-2">{c.source.note}</div>
          )}
        </a>
      </section>

      {/* Cross-link to ticker page */}
      <section className="mt-10 mb-12">
        <h2 className="text-xl font-bold mb-3">More on {c.targetTicker}</h2>
        <a
          href={`/ticker/${c.targetTicker}/`}
          className="block rounded-2xl border border-brand/40 bg-brand/5 p-5 hover:bg-brand/10 transition group"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-1">
                Hedge fund ownership
              </div>
              <div className="text-lg font-bold group-hover:text-brand transition flex items-center gap-2">
                <TickerLogo symbol={c.targetTicker} size={22} />
                Who else owns {c.targetTicker}
              </div>
              <div className="text-xs text-muted mt-1">
                Tracked superinvestor positions, live quote, smart-money activity
              </div>
            </div>
            <div className="text-brand text-sm font-semibold">View →</div>
          </div>
        </a>
      </section>

      <p className="text-xs text-dim mt-16">
        Data sourced from SEC EDGAR 13D / 13G filings. Activist intent and
        outcome reflect public disclosures and announcements only. Not
        investment advice.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-panel px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-dim">{label}</div>
      <div className="text-base font-semibold mt-1 tabular-nums">{value}</div>
    </div>
  );
}

function fmtShares(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}
