import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import {
  ACTIVIST_CAMPAIGNS,
  ongoingCampaigns,
  recentCampaigns,
  byIntent,
  formatStake,
} from "@/lib/activists";
import { getTicker } from "@/lib/tickers";

// /activist/ — landing for the 13D/13G activist tracker. The retail-investor
// question this answers: "which companies are about to get shaken up?"
// Activist 13D filings are the highest-signal "smart money is engaging"
// disclosure on EDGAR — Elliott, Icahn, Ackman, Trian, Starboard.

export const metadata: Metadata = {
  title:
    "Activist Investor Tracker — every 13D/13G filing on the major US activists",
  description:
    "Real-time 13D/13G filings: Elliott, Icahn, Ackman, Trian, Starboard, ValueAct. Every active campaign, who's pushing what, current stake, latest filing date. SEC-sourced.",
  alternates: { canonical: "https://holdlens.com/activist" },
  openGraph: {
    title: "HoldLens Activist Tracker — 13D/13G campaigns",
    description:
      "Active 13D/13G filings from the major US activists. SEC-sourced.",
    url: "https://holdlens.com/activist",
    type: "article",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" },
    ],
  },
  robots: { index: true, follow: true },
};

export default function ActivistLanding() {
  const ongoing = ongoingCampaigns();
  const recent = recentCampaigns(8);
  const active = byIntent("active");
  const passive = byIntent("passive");
  const eventDriven = byIntent("event-driven");

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Activist Investor Tracker",
    description:
      "SEC-sourced 13D/13G activist filings tracking ongoing and recent campaigns.",
    url: "https://holdlens.com/activist",
    numberOfItems: ACTIVIST_CAMPAIGNS.length,
    isPartOf: {
      "@type": "WebSite",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Activist", item: "https://holdlens.com/activist" },
    ],
  };
  const definedTermLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: "Schedule 13D",
    alternateName: ["Schedule 13G", "Form 13D", "Form 13G", "13D filing", "13G filing", "Beneficial Ownership Report"],
    description:
      "Schedule 13D and 13G are SEC beneficial ownership reports required when an investor crosses 5% of a public company's outstanding shares. Schedule 13D signals intent to influence (10-day filing window); Schedule 13G is for passive long-term holders. Amendments (13D/A, 13G/A) follow 1%+ position changes or intent shifts.",
    inDefinedTermSet: "https://www.sec.gov/cgi-bin/browse-edgar",
    url: "https://holdlens.com/activist/",
  };
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Activist Investor Tracker — Schedule 13D and 13G filings across the SEC universe",
    description:
      "Live tracker of every SEC Schedule 13D and 13G beneficial ownership filing. When investors cross 5% ownership and signal active or passive intent. EDGAR-sourced.",
    url: "https://holdlens.com/activist/",
    datePublished: "2026-04-29",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com/",
      logo: { "@type": "ImageObject", url: "https://holdlens.com/og/home.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://holdlens.com/activist/" },
    inLanguage: "en-US",
    isBasedOn: "https://www.sec.gov/cgi-bin/browse-edgar",
  };

  return (
    <div className="max-w-5xl mx-auto px-8 sm:px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Activist filings · SEC 13D/13G
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Every activist campaign, in one place.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-8">
        When an investor crosses 5% of a public company they file 13D (active)
        or 13G (passive). 13D means they will push for change — board seats,
        breakup, sale, CEO replacement. This page tracks every major ongoing
        and recent 13D/13G campaign.
      </p>

      <aside
        className="mt-2 mb-12 rounded-card border border-insight/30 bg-surface-insight p-4"
        aria-label="HoldLens read on activist filings"
      >
        <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-1.5">
          HoldLens read
        </div>
        <p className="text-sm text-text leading-relaxed">
          {ACTIVIST_CAMPAIGNS.length} tracked campaigns —{" "}
          <span className="font-bold">{ongoing.length} ongoing</span>,{" "}
          <span className="font-bold">{active.length} active</span> (pushing for
          change), <span className="font-bold">{eventDriven.length} event-driven</span>,{" "}
          <span className="font-bold">{passive.length} passive 13G</span>.
          Largest active stake on file: Elliott&rsquo;s {formatStake(active[0].stakePct)} of{" "}
          {active[0].targetTicker}.
        </p>
      </aside>

      {/* Ongoing campaigns — the high-signal section */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-emerald-400 mb-1">
              Live · unresolved
            </div>
            <h2 className="text-2xl font-bold">Ongoing campaigns</h2>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">Activist</th>
                <th className="px-4 py-3 text-left">Target</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Stake</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Intent</th>
                <th className="px-4 py-3 text-right">Latest filing</th>
              </tr>
            </thead>
            <tbody>
              {ongoing.map((c) => (
                <tr
                  key={c.slug}
                  className="border-b border-border last:border-0 hover:bg-bg/30 transition"
                >
                  <td className="px-4 py-3">
                    <a href={`/activist/${c.slug}/`} className="font-semibold text-text hover:text-brand">
                      {c.activistFund}
                    </a>
                    <div className="text-[11px] text-dim">{c.activistName}</div>
                  </td>
                  <td className="px-4 py-3">
                    {getTicker(c.targetTicker) ? (
                      <a
                        href={`/ticker/${c.targetTicker}/`}
                        className="inline-flex items-center gap-2 font-mono font-bold text-brand hover:underline"
                      >
                        <TickerLogo symbol={c.targetTicker} size={20} />
                        {c.targetTicker}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 font-mono font-bold text-text">
                        <TickerLogo symbol={c.targetTicker} size={20} />
                        {c.targetTicker}
                      </span>
                    )}
                    <div className="text-[11px] text-dim">{c.targetCompany}</div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold hidden sm:table-cell">
                    {formatStake(c.stakePct)}
                    <div className="text-[10px] text-dim font-normal">{c.filingType}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <IntentPill intent={c.intent} />
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted tabular-nums">
                    {c.filingDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot format="horizontal" />

      {/* Recent filings — chronological */}
      <section className="my-14">
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-widest font-bold text-brand mb-1">
            Latest disclosures
          </div>
          <h2 className="text-2xl font-bold">Recent filings (all outcomes)</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {recent.map((c) => (
            <a
              key={c.slug}
              href={`/activist/${c.slug}/`}
              className="block rounded-2xl border border-border bg-panel p-5 hover:border-brand/40 transition"
            >
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="font-mono font-bold text-brand text-lg flex items-center gap-2">
                  <TickerLogo symbol={c.targetTicker} size={22} />
                  {c.targetTicker}
                </div>
                <OutcomePill outcome={c.outcome} />
              </div>
              <div className="text-sm font-semibold text-text mb-1">
                {c.activistFund}
              </div>
              <div className="text-[11px] text-dim mb-2">
                {c.filingType} · {c.filingDate} · {formatStake(c.stakePct)} stake
              </div>
              {c.thesis && (
                <p className="text-xs text-muted leading-relaxed line-clamp-3">
                  {c.thesis}
                </p>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* By intent breakdown */}
      <section className="my-14">
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-widest font-bold text-brand mb-1">
            Intent rollup
          </div>
          <h2 className="text-2xl font-bold">By campaign type</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <IntentSummary
            label="Active (13D)"
            description="Pushing for change — board seats, breakup, CEO replacement"
            campaigns={active}
            colorClass="text-emerald-400"
          />
          <IntentSummary
            label="Event-driven"
            description="Positioned for a specific catalyst, not pushing for change"
            campaigns={eventDriven}
            colorClass="text-amber-400"
          />
          <IntentSummary
            label="Passive (13G)"
            description="Crossed 5% threshold but explicitly no engagement intent"
            campaigns={passive}
            colorClass="text-sky-400"
          />
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <h2 className="text-lg font-bold mb-3">How to read this data</h2>
        <p className="text-sm text-muted leading-relaxed mb-3">
          Any investor crossing 5% of a public company&rsquo;s outstanding
          shares must file <strong>13D</strong> (with intent to influence) or{" "}
          <strong>13G</strong> (passive long-term hold) within 10 days.
          Amendments (<strong>13D/A</strong>, <strong>13G/A</strong>) follow
          when the position changes by 1%+ or intent shifts. Every row here
          links to the underlying EDGAR filing.
        </p>
        <p className="text-sm text-muted leading-relaxed mb-4">
          Crossing 10% triggers Section 16 reporting (faster, more granular).
          See <a href="/insiders/" className="text-brand hover:underline">Form 4 insider activity</a>{" "}
          for executive-level filings.
        </p>
        <div className="flex gap-3 flex-wrap text-sm">
          <a href="/learn/13d-vs-13g-activist-filings" className="text-brand hover:underline">
            → 13D vs 13G — what the difference means
          </a>
          <a href="/learn/13f-vs-13d-vs-13g" className="text-brand hover:underline">
            → 13F vs 13D vs 13G
          </a>
        </div>
      </section>

      <section className="mt-10 border-t border-border pt-8">
        <h2 className="text-base font-bold text-text mb-3">Related SEC filings on HoldLens</h2>
        <p className="text-sm text-muted leading-relaxed">
          <a href="/def-14a/" className="text-brand hover:underline">DEF 14A explainer</a>
          {" · "}
          <a href="/proxies/" className="text-brand hover:underline">Proxy tracker (DEF 14A)</a>
          {" · "}
          <a href="/insiders/" className="text-brand hover:underline">Insider trades (Form 4)</a>
          {" · "}
          <a href="/events/" className="text-brand hover:underline">Material events (8-K)</a>
          {" · "}
          <a href="/bankruptcy/" className="text-brand hover:underline">Chapter 11 (8-K Item 1.03)</a>
          {" · "}
          <a href="/enforcement/" className="text-brand hover:underline">SEC enforcement</a>
        </p>
      </section>
    </div>
  );
}

function IntentPill({ intent }: { intent: "active" | "passive" | "event-driven" }) {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    "event-driven": "bg-amber-500/10 text-amber-400 border-amber-500/30",
    passive: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  };
  return (
    <span className={`inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${styles[intent]}`}>
      {intent}
    </span>
  );
}

function OutcomePill({ outcome }: { outcome?: "ongoing" | "won" | "lost" | "settled" | "exited" }) {
  if (!outcome) return null;
  const styles = {
    ongoing: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    won: "bg-brand/10 text-brand border-brand/30",
    settled: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    lost: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    exited: "bg-dim/10 text-dim border-dim/30",
  };
  return (
    <span className={`inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${styles[outcome]}`}>
      {outcome}
    </span>
  );
}

function IntentSummary({
  label,
  description,
  campaigns,
  colorClass,
}: {
  label: string;
  description: string;
  campaigns: ReturnType<typeof byIntent>;
  colorClass: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-5">
      <div className={`text-sm font-bold mb-2 ${colorClass}`}>{label}</div>
      <p className="text-xs text-muted leading-relaxed mb-3">{description}</p>
      <div className="text-2xl font-bold tabular-nums mb-2">{campaigns.length}</div>
      <div className="text-[11px] text-dim">
        {campaigns.slice(0, 4).map((c) => c.targetTicker).join(" · ")}
        {campaigns.length > 4 ? " · …" : ""}
      </div>
    </div>
  );
}
