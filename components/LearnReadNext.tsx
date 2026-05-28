import Link from "next/link";
import {
  deepDiveBySlug,
  deepDivesForPeriod,
  PERIOD_LABELS,
} from "@/lib/quarterDeepDives";

// v1.43 LearnReadNext — the single highest-leverage bounce fix per the
// strategist exit audit. Previously, a user who finished reading any /learn
// article hit a dead end: footer nav + "See pricing" CTA. The most-engaged
// users on the site had no path to a second article.
//
// This component ships a "Read next" bridge at the bottom of every article:
//   - ONE recommended next article (the "adjacent" article by topic order)
//   - ONE "Your next signal" link to /best-now for session-to-session continuity
//
// No tracking, no gates, no dark patterns — just honest navigation that
// treats the /learn hub as a learning path instead of a random grid of
// standalone pages. Reduces single-session bounce on the most-engaged
// audience (article completers).

type Article = { slug: string; title: string; desc: string };

// Authoritative order — matches app/learn/page.tsx ARTICLES array. Kept
// in sync manually: when a new article ships, add it here too. (No runtime
// import because we avoid bundling the full /learn page metadata into every
// article route.)
const LEARN_SEQUENCE: Article[] = [
  { slug: "superinvestor-handbook", title: "The Superinvestor Handbook", desc: "The full 10-section guide — 13F filings, conviction signals, copy-trading myths." },
  { slug: "what-is-a-13f", title: "What is a 13F filing?", desc: "Plain English guide to SEC Form 13F." },
  { slug: "how-to-read-a-13f", title: "How to read a 13F in 5 minutes", desc: "Step-by-step with real Berkshire examples." },
  { slug: "what-is-alpha", title: "What is alpha?", desc: "The hedge fund edge explained without jargon." },
  { slug: "45-day-lag-explained", title: "The 45-day lag in 13F filings", desc: "Why every 13F is six weeks late by design." },
  { slug: "warren-buffett-method", title: "The Warren Buffett method", desc: "Which Buffett principles are actually transferable." },
  { slug: "copy-trading-myth", title: "The copy-trading myth", desc: "Why mechanically copying Buffett underperforms the underlying portfolio." },
  { slug: "conviction-score-explained", title: "What is a Conviction Score?", desc: "How to tell a real bet from index padding." },
  { slug: "survivorship-bias-in-hedge-funds", title: "Survivorship bias in hedge funds", desc: "Why every hedge fund performance number you read is probably an overestimate." },
  { slug: "13f-vs-13d-vs-13g", title: "13F vs 13D vs 13G", desc: "Three SEC filings, three signals." },
  { slug: "form-4-vs-13f", title: "Form 4 vs 13F", desc: "Insider trades vs institutional portfolios — two SEC filings, two different signals." },
  { slug: "do-hedge-fund-signals-work", title: "Do 13F signals actually predict returns?", desc: "Original backtest — 221 ticker-quarter pairs, r = −0.12, no predictive signal." },
  { slug: "buybacks-vs-dividends", title: "Buybacks vs dividends", desc: "Both return capital. Tax + flexibility + long-term compounding tradeoffs." },
  { slug: "how-to-read-buyback-disclosures", title: "How to read buyback disclosures", desc: "Where the real numbers live in 10-K, 10-Q, and 8-K filings." },
  { slug: "13d-vs-13g-activist-filings", title: "13D vs 13G — activist vs passive", desc: "When an investor crosses 5%, which filing they pick reveals intent." },
  { slug: "short-interest-explained", title: "Short interest + squeeze setups", desc: "What short interest measures, days-to-cover math, smart-money signal layer." },
  { slug: "congressional-stock-trading-stock-act", title: "Congressional stock trading and the STOCK Act", desc: "What the STOCK Act requires, how disclosures show ranges, how to read them." },
  { slug: "etf-overlap-explained", title: "ETF overlap explained", desc: "Why owning VOO + VTI + QQQ + SPY delivers far less diversification than you think." },
  { slug: "insider-score-explained", title: "What is the Insider Score?", desc: "The Form 4 insider-transaction metric synthesizing the tracked-superinvestor universe." },
  { slug: "event-score-explained", title: "What is the Event Score?", desc: "8-K material events on a unified scale; item taxonomy + weight calibration." },
  { slug: "sec-signals-trilogy", title: "The SEC signals trilogy", desc: "13F + Form 4 + 8-K read together; why no single filing tells the whole story." },
  { slug: "edgar-explained", title: "What is SEC EDGAR?", desc: "The SEC's public filing database — every 10-K, 13F, Form 4 since 1993, free." },
  { slug: "cusip-explained", title: "What is a CUSIP?", desc: "The 9-character identifier behind every 13F line item." },
  { slug: "proxy-voting-def-14a", title: "Proxy voting and DEF 14A", desc: "The definitive proxy statement — read the 1-page summary in 10 minutes." },
  { slug: "13f-securities-list", title: "The 13(f) securities list", desc: "What counts as a 13F holding — and what doesn't." },
  { slug: "rule-144-holding-period", title: "Rule 144 holding period", desc: "When corporate insiders can sell — 6-month vs 12-month rules." },
  { slug: "buffett-q1-2026-moves", title: "Warren Buffett's Q1 2026 13F moves", desc: "Berkshire's most active quarter in years — Delta re-entry + Alphabet add + V/MA/UNH/AON exits." },
  { slug: "ackman-q1-2026-moves", title: "Bill Ackman's Q1 2026 13F moves", desc: "Microsoft new at 15% of book, Alphabet near-exit — Pershing Square's most assertive entry in years." },
  { slug: "tepper-q1-2026-moves", title: "David Tepper's Q1 2026 13F moves", desc: "Amazon to #1, China unwind, memory + semis adds across Appaloosa's book." },
  { slug: "druckenmiller-q1-2026-moves", title: "Stanley Druckenmiller's Q1 2026 13F moves", desc: "Natera at 18%, YPF + Alcoa + STMicro adds — diversification pivot, AUM down 25%." },
  { slug: "hohn-q1-2026-moves", title: "Chris Hohn's Q1 2026 13F moves", desc: "TCI guts Microsoft, deepens GE + Visa to 58% of a famously concentrated book." },
  { slug: "li-lu-q1-2026-moves", title: "Li Lu's Q1 2026 13F moves", desc: "Himalaya cuts its 15-year Bank of America anchor 71% (28.6%→4.6%); opens Moody's, MSCI, Tencent Music, H&R Block." },
  { slug: "coleman-q1-2026-moves", title: "Chase Coleman's Q1 2026 13F moves", desc: "Tiger Global piles into AI hardware (Nvidia, TSMC +49%, Applied Materials +85%) and halves Microsoft to 4.1%; trims software + fintech." },
  { slug: "halvorsen-q1-2026-moves", title: "Andreas Halvorsen's Q1 2026 13F moves", desc: "Viking pushes Visa to #1 (+59%), builds quality industrials (Danaher, Fortive, Thermo Fisher +110%, Air Products new); trims Microsoft + Alphabet. New Apple." },
  { slug: "mandel-q1-2026-moves", title: "Stephen Mandel's Q1 2026 13F moves", desc: "Lone Pine bets on AI's infrastructure — Vistra + Talen (power), ASML + new Teradyne/Corning/MasTec — while halving TSMC." },
  { slug: "klarman-q1-2026-moves", title: "Seth Klarman's Q1 2026 13F moves", desc: "Baupost makes Amazon its top holding (+47%), adds Alphabet + Ferguson, opens new Aon / Visa / Teleflex." },
  { slug: "pabrai-q1-2026-moves", title: "Mohnish Pabrai's Q1 2026 13F moves", desc: "A three-stock US book — 68% met coal (Warrior + Alpha), Transocean trimmed, Valaris exited. The most concentrated 13F we track." },
  { slug: "terry-smith-q1-2026-moves", title: "Terry Smith's Q1 2026 13F moves", desc: "Fundsmith trims almost its entire US book — Marriott, Stryker, Visa, Alphabet, Pfizer all reduced. A uniform pullback." },
  { slug: "ainslie-q1-2026-moves", title: "Lee Ainslie's Q1 2026 13F moves", desc: "Maverick trims broadly (Carpenter −61%, MasTec −65%, Live Nation −73%) and opens new Meta + Alphabet + Hut 8." },
  { slug: "buffett-coca-cola-trade", title: "Warren Buffett's Coca-Cola trade", desc: "Berkshire's 1988-89 KO purchase — $1.3B → $28B+ position, untouched for 37 years." },
  { slug: "buffett-apple-position", title: "Warren Buffett's Apple position", desc: "Berkshire's 2016-onward AAPL accumulation — largest equity position in firm history. Q1 2016 entry · 2024 partial trim · ongoing." },
  { slug: "buffett-bank-of-america-2011", title: "Warren Buffett's Bank of America 2011 deal", desc: "The $5B preferred + 700M-share warrants at $7.14 strike. ~$13B paper gain at 2017 warrant exercise. Top-3 Berkshire holding ever since." },
  { slug: "tepper-bank-stocks-2009", title: "David Tepper's 2009 bank trade", desc: "Appaloosa Management's March 2009 distressed-bank bet on BAC + Citigroup + AIG common stock. ~$7B returned. $4B personal payday — second-highest single-year hedge-fund payout in modern history." },
  { slug: "burry-big-short", title: "Michael Burry's Big Short", desc: "Scion Capital's 2005-2008 subprime CDS trade — ~489% net return." },
  { slug: "ackman-herbalife-short", title: "Bill Ackman's Herbalife short", desc: "Pershing Square's 2012-2018 multi-year activist short campaign." },
  { slug: "soros-druckenmiller-gbp-1992", title: "Black Wednesday — Soros, Druckenmiller, and the pound trade", desc: "The single-day macro trade that broke the Bank of England." },
  { slug: "munger-costco-lifetime-hold", title: "Charlie Munger's Costco position", desc: "1997-2023 hold + board seat — the canonical concentrated long-duration value position." },
  { slug: "icahn-apple-buyback-campaign", title: "Carl Icahn's Apple buyback campaign", desc: "2013-2016 long-side activism — public letter to Tim Cook, ~$2B realized gain." },
];

export default function LearnReadNext({ currentSlug }: { currentSlug: string }) {
  const idx = LEARN_SEQUENCE.findIndex((a) => a.slug === currentSlug);
  // Next article = next in sequence, wrapping back to 0 if at the end.
  // If the current slug isn't found (defensive), fall back to the first
  // article. Always returns something; never renders as empty.
  const next =
    idx === -1
      ? LEARN_SEQUENCE[0]
      : LEARN_SEQUENCE[(idx + 1) % LEARN_SEQUENCE.length];

  // If this article is a per-investor quarterly deep-dive, surface its parent
  // recap + sibling deep-dives + the investor's live profile. Connects the
  // GEO-winning analyses to the /quarterly hub and to the long-tail investor
  // pages (per rules/aceusergrowth.md Part 22 — Retention→Advocacy loop).
  const dive = deepDiveBySlug(currentSlug);
  const siblings = dive
    ? deepDivesForPeriod(dive.period).filter((d) => d.slug !== dive.slug)
    : [];
  const periodLabel = dive ? PERIOD_LABELS[dive.period] ?? dive.period : "";

  return (
    <>
      {dive && (
        <section
          aria-label={`Part of the ${periodLabel} superinvestor recap`}
          className="mt-16 pt-8 border-t border-border"
        >
          <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-4">
            Part of the {periodLabel} recap
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href={`/quarterly/${dive.period}/`}
              className="group block rounded-card border border-brand/30 bg-surface-brand p-5 hover:border-brand/60 hover:bg-brand/10 transition-all duration-base ease-swift"
            >
              <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-1.5">
                Full recap →
              </div>
              <div className="text-lg font-bold text-text group-hover:text-brand transition-colors">
                {periodLabel} superinvestor recap
              </div>
              <p className="text-sm text-muted mt-1.5 leading-relaxed">
                Every tracked manager&apos;s {periodLabel} moves + top consensus positions, in one place.
              </p>
            </Link>
            <Link
              href={`/investor/${dive.investorSlug}`}
              className="group block rounded-card border border-border bg-panel p-5 hover:border-brand/60 transition-all duration-base ease-swift"
            >
              <div className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-1.5">
                Live portfolio →
              </div>
              <div className="text-lg font-bold text-text group-hover:text-brand transition-colors">
                {dive.investor}&apos;s full {dive.fund} portfolio
              </div>
              <p className="text-sm text-muted mt-1.5 leading-relaxed">
                Every position, ConvictionScore, and quarter-over-quarter change — live, SEC-sourced.
              </p>
            </Link>
          </div>
          {siblings.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-dim mb-2">
                Other {periodLabel} deep dives:
              </div>
              <div className="flex flex-wrap gap-2">
                {siblings.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/learn/${s.slug}`}
                    className="text-sm rounded-full border border-border bg-panel px-3 py-1.5 text-muted hover:border-brand hover:text-brand transition"
                  >
                    {s.investor} →
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    <section
      aria-label="What to read next"
      className="mt-16 pt-8 border-t border-border"
    >
      <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-4">
        Keep reading
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Primary — next article in the series */}
        <Link
          href={`/learn/${next.slug}`}
          className="group block rounded-card border border-insight/30 bg-surface-insight p-5 hover:border-insight/60 hover:bg-insight/10 transition-all duration-base ease-swift"
        >
          <div className="text-[10px] uppercase tracking-widest text-insight font-semibold mb-1.5">
            Read next →
          </div>
          <div className="text-lg font-bold text-text group-hover:text-insight transition-colors">
            {next.title}
          </div>
          <p className="text-sm text-muted mt-1.5 leading-relaxed">{next.desc}</p>
        </Link>

        {/* Secondary — apply what you just learned to live data */}
        <Link
          href="/best-now"
          className="group block rounded-card border border-brand/30 bg-surface-brand p-5 hover:border-brand/60 hover:bg-brand/10 transition-all duration-base ease-swift"
        >
          <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-1.5">
            Apply it now →
          </div>
          <div className="text-lg font-bold text-text group-hover:text-brand transition-colors">
            Today's top accumulating tickers
          </div>
          <p className="text-sm text-muted mt-1.5 leading-relaxed">
            See the ConvictionScore in action across every tracked stock. Live, SEC-sourced, free.
          </p>
        </Link>
      </div>
    </section>
    </>
  );
}
