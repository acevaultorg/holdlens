import { getCampaignsByTicker, formatStake } from "@/lib/activists";

// Server component — conditionally renders an activist-campaign card on a
// ticker page when the ticker is the target of any tracked 13D/13G campaign.
// Returns null when no campaign exists. Mirrors BuybackSummary +
// ShortInterestSummary cross-link pattern.

export default function ActivistSummary({ symbol }: { symbol: string }) {
  const campaigns = getCampaignsByTicker(symbol);
  if (campaigns.length === 0) return null;

  const primary = campaigns[0];

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-2">Activist filings</h2>
      <p className="text-muted text-sm mb-6">
        Tracked SEC 13D/13G disclosures targeting {primary.targetCompany}.
      </p>
      <div className="space-y-3">
        {campaigns.map((c) => (
          <a
            key={c.slug}
            href={`/activist/${c.slug}/`}
            className="block rounded-2xl border border-border bg-panel p-6 hover:border-brand/40 transition"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
                  {c.filingType} ·{" "}
                  {c.intent === "active"
                    ? "Active campaign"
                    : c.intent === "event-driven"
                    ? "Event-driven"
                    : "Passive 13G"}
                </div>
                <div className="text-lg font-bold mb-1">{c.activistFund}</div>
                <div className="text-[11px] text-dim mb-2">
                  {c.activistName} · filed {c.filingDate}
                </div>
                {c.thesis && (
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    {c.thesis}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
                  Stake
                </div>
                <div className="text-xl font-bold tabular-nums text-brand">
                  {formatStake(c.stakePct)}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
