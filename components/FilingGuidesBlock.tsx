// FilingGuidesBlock — the filing-explainer sibling of FamousTradesBlock.
// The explainers (13F, EDGAR, CUSIP, Rule 144 ...) linked only /learn/ and
// one "read next" article, while the famous-trade essays cross-linked eight
// siblings (measured live 2026-09-28). Shows the 6 guides after the current
// one, wrapping, so every guide gets 6 links in from its siblings instead of
// all pages pointing at the same first six.

type Guide = { slug: string; title: string; blurb: string };

// Titles and blurbs from LearnReadNext's LEARN_SEQUENCE.
const GUIDES: Guide[] = [
  { slug: "what-is-a-13f", title: "What is a 13F filing?", blurb: "Plain English guide to SEC Form 13F." },
  { slug: "how-to-read-a-13f", title: "How to read a 13F in 5 minutes", blurb: "Step-by-step with real Berkshire examples." },
  { slug: "who-files-a-13f", title: "Who has to file a 13F?", blurb: "The $100M threshold, who qualifies as an institutional manager, and who is exempt." },
  { slug: "45-day-lag-explained", title: "The 45-day lag in 13F filings", blurb: "Why every 13F is six weeks late by design." },
  { slug: "13f-securities-list", title: "The 13(f) securities list", blurb: "What counts as a 13F holding — and what doesn't." },
  { slug: "cusip-explained", title: "What is a CUSIP?", blurb: "The 9-character identifier behind every 13F line item." },
  { slug: "edgar-explained", title: "What is SEC EDGAR?", blurb: "The SEC's public filing database — every 10-K, 13F, Form 4 since 1993, free." },
  { slug: "13f-vs-13d-vs-13g", title: "13F vs 13D vs 13G", blurb: "Three SEC filings, three signals." },
  { slug: "13d-vs-13g-activist-filings", title: "13D vs 13G — activist vs passive", blurb: "When an investor crosses 5%, which filing they pick reveals intent." },
  { slug: "form-4-vs-13f", title: "Form 4 vs 13F", blurb: "Insider trades vs institutional portfolios — two SEC filings, two different signals." },
  { slug: "rule-144-holding-period", title: "Rule 144 holding period", blurb: "When corporate insiders can sell — 6-month vs 12-month rules." },
  { slug: "proxy-voting-def-14a", title: "Proxy voting and DEF 14A", blurb: "The definitive proxy statement — read the 1-page summary in 10 minutes." },
];

export default function FilingGuidesBlock({ currentSlug }: { currentSlug: string }) {
  const i = GUIDES.findIndex((g) => g.slug === currentSlug);
  const others = GUIDES.map((_, k) => GUIDES[(i + 1 + k) % GUIDES.length])
    .filter((g) => g.slug !== currentSlug)
    .slice(0, 6);
  return (
    <section
      aria-label="More SEC filing guides"
      className="mt-16 pt-8 border-t border-border"
    >
      <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-1">
        SEC filing guides
      </div>
      <p className="text-sm text-muted mb-5">
        The filings behind every holding on HoldLens, one plain-English guide each.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {others.map((g) => (
          <a
            key={g.slug}
            href={`/learn/${g.slug}`}
            className="block rounded-card border border-border bg-surface p-4 hover:border-brand/60 hover:bg-brand/5 transition-all duration-base ease-swift group"
          >
            <div className="text-sm font-bold text-text group-hover:text-brand transition-colors leading-snug">
              {g.title}
            </div>
            <p className="text-xs text-muted mt-1 leading-relaxed">{g.blurb}</p>
          </a>
        ))}
      </div>
      <a href="/learn" className="inline-block mt-5 text-sm text-brand font-semibold hover:underline">
        All guides →
      </a>
    </section>
  );
}
