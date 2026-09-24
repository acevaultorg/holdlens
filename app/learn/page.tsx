import type { Metadata } from "next";
import AskAmili from "@/components/AskAmili";

export const metadata: Metadata = {
  title: "Learn — Plain English guides to hedge fund investing",
  description: "Free guides to 13F filings, copy-trading, hedge fund tracking, and how superinvestors think.",
  alternates: { canonical: "https://holdlens.com/learn/" },
};

// v1.42 — removed the `coming?: boolean` field. The render path below no
// longer has a dead-card branch. Teaser cards (greyed-out, non-linked,
// "coming soon" label) are a thin-content anti-pattern flagged by AdSense
// reviewers and eroded trust when we had placeholder Learn entries. Going
// forward: articles are either live (shipped to /learn/[slug]) or absent
// from this index entirely.
type Article = { slug: string; title: string; desc: string };

const ARTICLES: Article[] = [
  { slug: "superinvestor-handbook", title: "The Superinvestor Handbook", desc: "The full 10-section guide — 13F filings, conviction signals, copy-trading myths, and the honest limits of smart-money data. ~15 min read." },
  { slug: "what-is-a-13f", title: "What is a 13F filing?", desc: "Plain English guide to SEC Form 13F. What's in it, when it drops, what it does and doesn't show." },
  { slug: "how-to-read-a-13f", title: "How to read a 13F filing in 5 minutes", desc: "Step-by-step: open any 13F on EDGAR and know what every field means. With real Berkshire examples." },
  { slug: "how-to-interpret-changes-in-positions", title: "How to interpret position changes in a 13F", desc: "New stake, exit, add, trim — the read-the-delta methodology. Compare share counts not dollar values, weigh by portfolio share, and know which moves are mechanical noise." },
  { slug: "how-to-find-hedge-fund-holdings", title: "How to find what hedge funds are buying", desc: "The free, step-by-step way to pull any manager's holdings from SEC EDGAR — and the limits of the data before you act on it." },
  { slug: "who-files-a-13f", title: "Who has to file a 13F?", desc: "The $100 million threshold, who counts as an institutional investment manager, the 45-day deadline, and who is exempt." },
  { slug: "what-is-a-superinvestor", title: "What is a superinvestor?", desc: "The term comes from Buffett's 1984 'Superinvestors of Graham-and-Doddsville' essay. What it meant then, what it means in the 13F-tracking era, and how HoldLens curates its cohort of 30." },
  { slug: "what-is-an-insider", title: "What is a corporate insider?", desc: "Officers, directors, 10%+ owners — the SEC Section 16 definition, the Form 3/4/5 rules, and how legal insider trading differs from illegal." },
  { slug: "why-13f-doesnt-show-shorts", title: "Why doesn't a 13F show short positions?", desc: "13Fs are long-only by design. What that hides — shorts, swaps, hedges — and why a visible long never tells you the whole bet." },
  { slug: "what-is-alpha", title: "What is alpha?", desc: "The hedge fund edge explained without jargon. Why 85% of managers have none — and what the 15% have in common." },
  { slug: "45-day-lag-explained", title: "The 45-day lag in 13F filings", desc: "Why every 13F is six weeks late by design — and how to use lagged data without getting burned." },
  { slug: "warren-buffett-method", title: "The Warren Buffett method", desc: "Which Buffett principles are actually transferable to a retail account, and which depend on structural edges you don't have." },
  { slug: "copy-trading-myth", title: "The copy-trading myth", desc: "Why mechanically copying Buffett's 13F underperforms the underlying portfolio." },
  { slug: "conviction-score-explained", title: "What is a Conviction Score?", desc: "How to tell a real bet from index padding. The −100..+100 scale explained." },
  { slug: "survivorship-bias-in-hedge-funds", title: "Survivorship bias in hedge funds", desc: "Why every hedge fund performance number you read is probably an overestimate — and how missing dead funds distorts 13F signals." },
  { slug: "13f-vs-13d-vs-13g", title: "13F vs 13D vs 13G", desc: "Three SEC filings, three signals. The difference between a quarterly portfolio snapshot, an activist disclosure, and a passive big-stake filing — and how to read each one." },
  { slug: "form-4-vs-13f", title: "Form 4 vs 13F — insider trades vs institutional portfolios", desc: "Two SEC filings, two completely different signals. Form 4 is a 2-day insider receipt; 13F is a 45-day institutional portfolio snapshot. Speed, scope, signal strength, and when to read each one." },
  { slug: "how-do-hedge-funds-disclose-positions", title: "How do hedge funds disclose their positions?", desc: "The complete required-vs-voluntary matrix — 13F quarterly longs, 13D/13G 5% tripwires, Form 4 insider trades — with triggers, deadlines, and what never gets disclosed at all." },
  { slug: "do-hedge-fund-signals-work", title: "Do 13F signals actually predict returns? We ran the backtest", desc: "Original research — April 2026. We backtested our own ConvictionScore over 221 ticker-quarter pairs across 4 quarters. Result: r = −0.12, no predictive signal. Top-decile BUYs underperformed SPY by 5 pts; bottom-decile SELLs beat it by 24 pts. Why, and what to use 13F data for instead." },
  { slug: "buybacks-vs-dividends", title: "Buybacks vs dividends — what's the real difference?", desc: "Both return capital. One is flashier; the other is more tax-efficient. The honest tradeoffs on tax, flexibility, and long-term compounding." },
  { slug: "how-to-read-buyback-disclosures", title: "How to read buyback disclosures", desc: "Where the real buyback numbers live in SEC 10-K, 10-Q, and 8-K filings — plus how to spot debt-funded financial engineering and stock-based-comp distortions." },
  { slug: "13d-vs-13g-activist-filings", title: "13D vs 13G — what the difference actually means", desc: "Plain-English guide: when an investor crosses 5%, which filing they pick reveals their intent. Activist (13D) means board fights. Passive (13G) means index hold." },
  { slug: "short-interest-explained", title: "Short interest, days-to-cover, and squeeze setups", desc: "What short interest actually measures, how days-to-cover is calculated, and why high short interest is BOTH a squeeze setup AND a smart-money signal." },
  { slug: "congressional-stock-trading-stock-act", title: "How the STOCK Act works — Congressional stock trading", desc: "What the STOCK Act of 2012 actually requires, why disclosures show ranges (not exact amounts), how late filings are penalized, and how to read the disclosures." },
  { slug: "etf-overlap-explained", title: "ETF overlap — why owning multiple ETFs doesn't diversify", desc: "What overlap actually means, how to measure it, and why owning VOO + VTI + QQQ + SPY delivers far less diversification than you think." },
  { slug: "insider-score-explained", title: "What is the Insider Score?", desc: "The −100..+100 metric synthesizing Form 4 insider transactions across the tracked-superinvestor universe. Methodology, math, what the score does and doesn't mean." },
  { slug: "event-score-explained", title: "What is the Event Score?", desc: "8-K material events scored on a unified scale. Item taxonomy mapping, weight calibration, and how to read the live feed." },
  { slug: "sec-signals-trilogy", title: "The SEC signals trilogy — 13F + Form 4 + 8-K", desc: "The three SEC filing types HoldLens reads together. Why no single filing tells the whole story, and how the trilogy synthesizes into one ConvictionScore." },
  { slug: "edgar-explained", title: "What is SEC EDGAR?", desc: "The SEC's public filing database — the canonical source for every 10-K, 13F, Form 4, 8-K filed since 1993. How to use it, what to ignore, where it falls short." },
  { slug: "cusip-explained", title: "What is a CUSIP?", desc: "The 9-character identifier that uniquely names every North American security. Structure, math, why tickers aren't enough for 13F reporting." },
  { slug: "proxy-voting-def-14a", title: "Proxy voting and DEF 14A", desc: "The definitive proxy statement — what to read, what to skip, how to vote informed. Read the 1-page summary in 10 minutes." },
  { slug: "13f-securities-list", title: "The 13(f) securities list — what counts as a 13F holding?", desc: "The SEC's quarterly Official List defining what shows up on 13F. ~17,000 securities in scope; shorts, bonds, foreign equities, most derivatives all out of scope." },
  { slug: "rule-144-holding-period", title: "Rule 144 holding period — when insiders can sell", desc: "6 months for reporting issuers; 12 months for non-reporting. Volume limits, manner-of-sale, and three practical reading angles for tracking insider supply." },
  { slug: "superinvestors-q1-2026-moves", title: "What superinvestors bought in Q1 2026", desc: "The cross-fund synthesis — 13 hedge fund 13F filings read together. How the AI trade split four ways (chips, power, Microsoft-out, Microsoft-in), where the value investors added, the most concentrated bet, and the lone net seller. Links every per-investor deep-dive." },
  { slug: "buffett-q1-2026-moves", title: "Warren Buffett's Q1 2026 13F moves", desc: "Berkshire's most active 13F quarter since 2024 — Delta Air Lines re-entry, Alphabet Class C add, Macy's + NYT adds, full exits of Visa + Mastercard + UnitedHealth + Aon, Chevron + Constellation trims. EDGAR-reconstructable." },
  { slug: "ackman-q1-2026-moves", title: "Bill Ackman's Q1 2026 13F moves", desc: "Pershing Square's biggest tech rebalance in years — brand-new Microsoft position at 15.3% of the $13.7B portfolio, near-full Alphabet exit (combined GOOG + GOOGL trimmed ~95%), full Hilton exit, Amazon + Restaurant Brands adds, Brookfield + Howard Hughes trims. Eleven holdings throughout. EDGAR-reconstructable." },
  { slug: "druckenmiller-q1-2026-moves", title: "Stanley Druckenmiller's Q1 2026 13F moves", desc: "Duquesne Family Office diversification pivot — Natera conviction deepened to 18.1% of the $3.38B portfolio (single largest position), new positions in YPF (Argentina oil), Alcoa, ST-Microelectronics, BBB Foods (Mexico discount retail), NewAmsterdam Pharma; AMZN + GOOGL + TEVA + CPNG trimmed out of top 12. AUM contracted 25%; holdings rose to 68. EDGAR-reconstructable." },
  { slug: "tepper-q1-2026-moves", title: "David Tepper's Q1 2026 13F moves", desc: "Appaloosa Management's clean China-to-US-tech rotation — Amazon doubled to #1 holding at 15.2% of the $5.93B portfolio, Alibaba trimmed from #1 to #6, Uber added back at 7.7%, Micron deepened to 9.5%, new SanDisk + Corning positions; JD, KraneShares China ETF, Qualcomm, American Airlines + Whirlpool trimmed out of top 15. Holdings concentrated from 38 to 31. EDGAR-reconstructable." },
  { slug: "hohn-q1-2026-moves", title: "Chris Hohn's Q1 2026 13F moves", desc: "TCI Fund Management's most concentrated stance in years — Microsoft cut from 17.1% to just 2.6% (top-3 holding to residual), GE Aerospace deepened to 34.4% of the $39.2B portfolio, Visa to 23.5%, Moody's to 16.0%, Canadian Pacific to 9.3%; GE + Visa alone now 57.9% of the entire book. Alphabet added (combined GOOG + GOOGL to 8.3%). Just 9 holdings. EDGAR-reconstructable." },
  { slug: "li-lu-q1-2026-moves", title: "Li Lu's Q1 2026 13F moves", desc: "Munger's protégé cuts his 15-year Bank of America anchor 71% by share count (from ~28.6% to 4.6%) and opens four new positions: Moody's, MSCI, Tencent Music, and H&R Block. Crocs added 41%. The book stays concentrated — Alphabet ~45% combined, Pinduoduo, Berkshire, and East West Bancorp (a bank he kept) held unchanged. EDGAR-reconstructable." },
  { slug: "coleman-q1-2026-moves", title: "Chase Coleman's Q1 2026 13F moves", desc: "Tiger Global rotates down the AI stack — Nvidia added to 9.2%, TSMC up 49% to 8.2%, Applied Materials up 85%, Lam Research held — while halving Microsoft (−54% to 4.1%) and trimming Take-Two, Apollo, Block, Reddit, ServiceNow, AppLovin. Meta added; MercadoLibre new. Alphabet stays #1 at 13.4%. 53 holdings. EDGAR-reconstructable." },
  { slug: "halvorsen-q1-2026-moves", title: "Andreas Halvorsen's Q1 2026 13F moves", desc: "Viking Global pushes Visa to the #1 holding (+59%), builds a quality-industrials and healthcare-tools cluster (Danaher, Fortive, Thermo Fisher +110%, new Air Products, Lennox +153%), and adds aggressively to Carvana (+162%) and Tesla (+47%) — while trimming Microsoft (−28%), Alphabet (−10%) and TSMC. New Apple position. A diversified 77-name long-short book. EDGAR-reconstructable." },
  { slug: "mandel-q1-2026-moves", title: "Stephen Mandel's Q1 2026 13F moves", desc: "Lone Pine bets on the physical infrastructure of AI — Vistra (top holding) and Talen Energy (+41%) for datacenter power, plus ASML, Carpenter Technology (+38%), and new Teradyne, Corning and MasTec for equipment and materials — while halving the TSMC foundry (−54%). AppLovin +88%. A concentrated 36-name growth book. EDGAR-reconstructable." },
  { slug: "klarman-q1-2026-moves", title: "Seth Klarman's Q1 2026 13F moves", desc: "The Margin of Safety author makes Amazon his top holding (+47% to 12.7%), adds Alphabet (+9%) and Ferguson (+27%), and opens new positions in Aon, Visa and Teleflex — while trimming Willis Towers Watson and Liberty. A concentrated 22-name value book. EDGAR-reconstructable." },
  { slug: "pabrai-q1-2026-moves", title: "Mohnish Pabrai's Q1 2026 13F moves", desc: "The most concentrated 13F we track — just three positions. Warrior Met Coal (39.9%) and Alpha Metallurgical (28.1%, added) make metallurgical coal 68% of the US book; Transocean (32%) trimmed 25% and Valaris exited. A pure deep-value commodity-cyclical bet. EDGAR-reconstructable." },
  { slug: "terry-smith-q1-2026-moves", title: "Terry Smith's Q1 2026 13F moves", desc: "The 'English Warren Buffett' trims almost every top US position at once — Marriott, Stryker, Waters, Visa, Alphabet, Pfizer, Interactive Brokers and ADP all reduced, with MSCI (−61%) and Rollins (−58%) near-exited. A uniform pullback across a 34-name quality book. EDGAR-reconstructable." },
  { slug: "ainslie-q1-2026-moves", title: "Lee Ainslie's Q1 2026 13F moves", desc: "Maverick trims broadly — Carpenter Technology (−61%), MasTec (−65%), Live Nation (−73%), CRH, Somnigroup, TSMC and the top Amazon holding all reduced — while opening brand-new positions in Meta, Alphabet and bitcoin miner Hut 8. A rotation out of cyclicals into mega-cap tech. EDGAR-reconstructable." },
  { slug: "buffett-coca-cola-trade", title: "Warren Buffett's Coca-Cola trade", desc: "Berkshire's 1988-89 KO purchase — $1.3B invested, today ~$28B position, untouched for 37 years. Trade mechanics + 13F-traceable accumulation timeline." },
  { slug: "buffett-apple-position", title: "Warren Buffett's Apple position", desc: "Berkshire's 2016-onward Apple accumulation — built into the firm's largest-ever equity position. Q1 2016 entry · Q2/Q3 2024 partial trim · still Berkshire's #1 holding. Full 13F-traceable timeline." },
  { slug: "buffett-bank-of-america-2011", title: "Warren Buffett's Bank of America 2011 deal", desc: "August 2011: $5B preferred + warrants for 700M BAC shares at $7.14 strike. The cleanest example of Buffett's 'structured private investment' template, alongside Goldman 2008 + GE 2008. ~$13B paper gain at 2017 warrant exercise; top-3 Berkshire holding through 2024." },
  { slug: "tepper-bank-stocks-2009", title: "David Tepper's 2009 bank trade", desc: "Q1 2009: Appaloosa Management bought ~$2B of Bank of America + Citigroup + AIG common stock at distressed prices (BAC ~$3, C under $1). Returned ~$7B as the implicit TARP+CPP government floor proved Tepper's nationalization-tail-risk thesis right. ~$4B personal payday — second-highest single-year hedge-fund individual payout in modern history at the time, behind only Paulson 2007." },
  { slug: "burry-big-short", title: "Michael Burry's Big Short", desc: "Scion Capital's 2005-2008 subprime CDS trade returned ~489% net. The canonical case study in why 13F-based research has structural blind spots." },
  { slug: "ackman-herbalife-short", title: "Bill Ackman's Herbalife short", desc: "Pershing Square's six-year activist short campaign — entered 2012, closed at a loss in 2018. What the public-record trail reveals." },
  { slug: "soros-druckenmiller-gbp-1992", title: "Black Wednesday — Soros, Druckenmiller, and the pound trade", desc: "September 16, 1992. Quantum Fund's $1B-in-a-day short of the British pound that forced the UK to exit the ERM. The FX/short/derivative gap to 13F." },
  { slug: "munger-costco-lifetime-hold", title: "Charlie Munger's Costco position", desc: "1997 to 2023. Munger's 26-year hold + board seat — the canonical concentrated long-duration value position, fully traceable through SEC Form 4 + 13F + DEF 14A filings." },
  { slug: "icahn-apple-buyback-campaign", title: "Carl Icahn's Apple buyback campaign", desc: "2013-2016 long-side activism — $3.6B position, public open letter to Tim Cook, ~$2B realized gain. The cleanest SEC-filing-trail activist case in modern markets." },
];

// v1.20 — CollectionPage + ItemList schema. Google prefers CollectionPage
// for "index of guides" style pages (vs Article) because it's a hub, not a
// single piece of content. ItemList exposes each guide to Google as a
// clickable entity, boosting sitelink eligibility under the guide category.
const LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Learn — Plain English guides to hedge fund investing",
  description:
    "Free guides to 13F filings, copy-trading, hedge fund tracking, and how superinvestors think.",
  url: "https://holdlens.com/learn",
  publisher: { "@id": "https://holdlens.com/#organization" },
  inLanguage: "en-US",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      { "@type": "ListItem", position: 1, url: "https://holdlens.com/learn/superinvestor-handbook", name: "The Superinvestor Handbook" },
      { "@type": "ListItem", position: 2, url: "https://holdlens.com/learn/what-is-a-13f", name: "What is a 13F filing?" },
      { "@type": "ListItem", position: 3, url: "https://holdlens.com/learn/how-to-read-a-13f", name: "How to read a 13F filing in 5 minutes" },
      { "@type": "ListItem", position: 4, url: "https://holdlens.com/learn/what-is-alpha", name: "What is alpha?" },
      { "@type": "ListItem", position: 5, url: "https://holdlens.com/learn/45-day-lag-explained", name: "The 45-day lag in 13F filings" },
      { "@type": "ListItem", position: 6, url: "https://holdlens.com/learn/warren-buffett-method", name: "The Warren Buffett method" },
      { "@type": "ListItem", position: 7, url: "https://holdlens.com/learn/copy-trading-myth", name: "The copy-trading myth" },
      { "@type": "ListItem", position: 8, url: "https://holdlens.com/learn/conviction-score-explained", name: "What is a Conviction Score?" },
      { "@type": "ListItem", position: 9, url: "https://holdlens.com/learn/survivorship-bias-in-hedge-funds", name: "Survivorship bias in hedge funds" },
      { "@type": "ListItem", position: 10, url: "https://holdlens.com/learn/13f-vs-13d-vs-13g", name: "13F vs 13D vs 13G" },
      { "@type": "ListItem", position: 11, url: "https://holdlens.com/learn/do-hedge-fund-signals-work", name: "Do 13F signals actually predict returns? We ran the backtest" },
      { "@type": "ListItem", position: 12, url: "https://holdlens.com/learn/buybacks-vs-dividends", name: "Buybacks vs dividends — what's the real difference?" },
      { "@type": "ListItem", position: 13, url: "https://holdlens.com/learn/how-to-read-buyback-disclosures", name: "How to read buyback disclosures" },
      { "@type": "ListItem", position: 14, url: "https://holdlens.com/learn/13d-vs-13g-activist-filings", name: "13D vs 13G — what the difference actually means" },
      { "@type": "ListItem", position: 15, url: "https://holdlens.com/learn/short-interest-explained", name: "Short interest, days-to-cover, and squeeze setups" },
      { "@type": "ListItem", position: 16, url: "https://holdlens.com/learn/congressional-stock-trading-stock-act", name: "How the STOCK Act works — Congressional stock trading" },
    ],
  },
};

export default function LearnIndex() {
  return (
    <div className="max-w-3xl mx-auto px-8 sm:px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Plain English guides</h1>
      <AskAmili />
      <p className="text-muted text-lg max-w-2xl mb-10">
        Everything you need to know about following smart money. No jargon, no fluff.
      </p>

      {/* Featured collection — Famous Trades */}
      <a
        href="/collections/famous-trades"
        className="block rounded-2xl border border-brand/40 bg-surface-brand p-6 hover:border-brand hover:bg-brand/10 transition-all duration-base ease-swift group mb-6"
      >
        <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-2">
          Featured collection · 9 essays
        </div>
        <div className="text-2xl font-bold text-text group-hover:text-brand transition-colors mb-2">
          Famous trades — public-record case studies
        </div>
        <p className="text-sm text-muted leading-relaxed">
          Berkshire/Coca-Cola · Berkshire/Apple · Berkshire/BAC 2011 · Tepper/2009 banks · Burry/Big Short · Ackman/Herbalife · Soros-Druckenmiller/GBP · Munger/Costco · Icahn/Apple. Each trade reconstructable from SEC EDGAR alone.
        </p>
        <div className="text-xs text-brand font-semibold mt-3">
          Browse the collection →
        </div>
      </a>

      {/* Browse by topic — 4 collection hubs */}
      <div className="mb-12">
        <div className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-3">
          Browse by topic
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          <a href="/learn/superinvestors-q1-2026-moves" className="block rounded-card border border-brand/40 bg-surface-brand p-3 hover:border-brand hover:bg-brand/10 transition-all duration-base ease-swift group sm:col-span-2">
            <div className="text-sm font-bold text-text group-hover:text-brand transition-colors">Q1 2026 superinvestor moves →</div>
            <div className="text-xs text-muted mt-0.5">13 deep dives · what every tracked fund bought + sold this quarter</div>
          </a>
          <a href="/collections/sec-filing-mechanics" className="block rounded-card border border-border bg-surface p-3 hover:border-brand/60 hover:bg-brand/5 transition-all duration-base ease-swift group">
            <div className="text-sm font-bold text-text group-hover:text-brand transition-colors">SEC filing mechanics</div>
            <div className="text-xs text-muted mt-0.5">11 essays · 13F, Form 4, DEF 14A, EDGAR</div>
          </a>
          <a href="/collections/signals-and-methodology" className="block rounded-card border border-border bg-surface p-3 hover:border-brand/60 hover:bg-brand/5 transition-all duration-base ease-swift group">
            <div className="text-sm font-bold text-text group-hover:text-brand transition-colors">Signals + methodology</div>
            <div className="text-xs text-muted mt-0.5">10 essays · ConvictionScore, InsiderScore, alpha</div>
          </a>
          <a href="/collections/famous-trades" className="block rounded-card border border-border bg-surface p-3 hover:border-brand/60 hover:bg-brand/5 transition-all duration-base ease-swift group">
            <div className="text-sm font-bold text-text group-hover:text-brand transition-colors">Famous trades</div>
            <div className="text-xs text-muted mt-0.5">9 essays · historical case studies</div>
          </a>
          <a href="/collections/capital-allocation" className="block rounded-card border border-border bg-surface p-3 hover:border-brand/60 hover:bg-brand/5 transition-all duration-base ease-swift group">
            <div className="text-sm font-bold text-text group-hover:text-brand transition-colors">Capital allocation</div>
            <div className="text-xs text-muted mt-0.5">5 essays · buybacks, short interest, STOCK Act</div>
          </a>
        </div>
      </div>

      <div className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-3">
        All essays (36)
      </div>
      <div className="space-y-4">
        {ARTICLES.map((a) => (
          <a key={a.slug} href={`/learn/${a.slug}`}
             className="block rounded-2xl border border-border bg-panel p-6 hover:border-brand transition group">
            <div className="text-xl font-bold group-hover:text-brand transition">{a.title}</div>
            <p className="text-sm text-muted mt-2">{a.desc}</p>
            <div className="text-brand text-sm mt-3">Read →</div>
          </a>
        ))}
      </div>
    </div>
  );
}
