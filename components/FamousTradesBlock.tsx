// FamousTradesBlock — renders an inline "more famous-trade essays" grid for
// any of the 6 famous-trade /learn pages. Excludes the current page so the
// cluster forms a clean 5-card cross-link from any entry point.

type Trade = { slug: string; title: string; blurb: string };

const TRADES: Trade[] = [
  {
    slug: "buffett-coca-cola-trade",
    title: "Warren Buffett's Coca-Cola trade",
    blurb: "Berkshire's 1988-89 KO purchase — $1.3B → ~$28B, untouched 37 years.",
  },
  {
    slug: "buffett-apple-position",
    title: "Warren Buffett's Apple position",
    blurb: "Berkshire's 2016-onward AAPL accumulation — largest equity position in firm history.",
  },
  {
    slug: "buffett-bank-of-america-2011",
    title: "Warren Buffett's Bank of America 2011 deal",
    blurb: "The $5B preferred + 700M-share warrants at $7.14 strike. ~$13B paper gain at 2017 exercise.",
  },
  {
    slug: "tepper-bank-stocks-2009",
    title: "David Tepper's 2009 bank trade",
    blurb: "Appaloosa's $2B March 2009 distressed-bank bet (BAC + C + AIG). ~$7B returned. $4B Tepper payday.",
  },
  {
    slug: "burry-big-short",
    title: "Michael Burry's Big Short",
    blurb: "Scion Capital's 2005-2008 subprime CDS trade — ~489% net return.",
  },
  {
    slug: "ackman-herbalife-short",
    title: "Bill Ackman's Herbalife short",
    blurb: "Pershing Square's 2012-2018 multi-year activist campaign.",
  },
  {
    slug: "soros-druckenmiller-gbp-1992",
    title: "Black Wednesday — the Quantum Fund pound trade",
    blurb: "September 16, 1992. The single-day macro trade that broke the Bank of England.",
  },
  {
    slug: "munger-costco-lifetime-hold",
    title: "Charlie Munger's Costco position",
    blurb: "1997-2023 hold + board seat — the canonical long-duration value position.",
  },
  {
    slug: "icahn-apple-buyback-campaign",
    title: "Carl Icahn's Apple buyback campaign",
    blurb: "2013-2016 long-side activism — public letter to Tim Cook, ~$2B realized gain.",
  },
];

export default function FamousTradesBlock({ currentSlug }: { currentSlug: string }) {
  const others = TRADES.filter((t) => t.slug !== currentSlug);
  return (
    <section
      aria-label="More famous-trade essays"
      className="mt-16 pt-8 border-t border-border"
    >
      <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-1">
        Famous trades — the public-record case studies
      </div>
      <p className="text-sm text-muted mb-5">
        Six historical trades reconstructable from SEC EDGAR alone. Each essay traces
        the trade through 13F + Form 4 + DEF 14A filings.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {others.map((t) => (
          <a
            key={t.slug}
            href={`/learn/${t.slug}`}
            className="block rounded-card border border-border bg-surface p-4 hover:border-brand/60 hover:bg-brand/5 transition-all duration-base ease-swift group"
          >
            <div className="text-sm font-bold text-text group-hover:text-brand transition-colors leading-snug">
              {t.title}
            </div>
            <p className="text-xs text-muted mt-1 leading-relaxed">{t.blurb}</p>
          </a>
        ))}
      </div>
      <a
        href="/collections/famous-trades"
        className="inline-block mt-5 text-sm text-brand font-semibold hover:underline"
      >
        See all 6 essays in the Famous Trades collection →
      </a>
    </section>
  );
}
