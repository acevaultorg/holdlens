import type { Metadata } from "next";
import { MANAGERS } from "@/lib/managers";

// /launch-kit — operator-only page (noindex) with copy-paste templates
// for Reddit, HackerNews, Twitter, and ProductHunt. The €100 ask is
// gated by distribution, not code. One successful Reddit front-page
// post in r/SecurityAnalysis or r/ValueInvesting typically drives
// 2,000–10,000 targeted visitors — at a 1% conversion, that's enough
// to cross €100 in founders subscriptions.
//
// This page is deliberately noindex + robots:false so it never shows
// in search results. Pure internal launch aid.

export const metadata: Metadata = {
  title: "Launch kit — operator only",
  description: "Pre-written templates for launching HoldLens on Reddit, HackerNews, Twitter, and ProductHunt.",
  robots: { index: false, follow: false },
};

const MANAGER_COUNT = MANAGERS.length;

const REDDIT_POSTS = [
  {
    subreddit: "r/SecurityAnalysis",
    title: "I built a free signed −100..+100 ConvictionScore for every stock held by 30 of the best portfolio managers",
    body: `I got tired of Dataroma being my only option for 13F tracking. It's great for listing who owns what, but it doesn't answer the question I actually care about: **is smart money agreeing on this stock or arguing about it?**

So I built HoldLens — https://holdlens.com — and shipped it last month.

**What makes it different from Dataroma:**

- Every stock gets ONE signed score (−100 = strongest sell, +100 = strongest buy). A ticker shows up on exactly one list, not both.
- The score combines: consensus, track record weighting, position concentration, multi-quarter trend, contrarian bonus, dissent penalty.
- 16 distinct pages answer different questions: /best-now, /big-bets (size × conviction), /consensus, /contrarian-bets (where smart money disagrees), /crowded-trades, /first-movers, /trend-streak, /rotation (sector flow heatmap).
- Free public JSON API with 150+ endpoints. Dataroma has no API.
- Fast. It's Next.js static export on Cloudflare — sub-100ms TTFB.
- **Zero signup required for any feature.** Pro tier only for email alerts, weekly digest, custom watchlist triggers, no-ads.

Tracked managers include Buffett, Ackman, Druckenmiller, Klarman, Howard Marks, Tepper, Burry, Chris Hohn, Chase Coleman, Li Lu, Bill Nygren, Seth Klarman, and ${MANAGER_COUNT - 12} others.

I'm a solo dev. Would love feedback on the scoring model — the methodology is here: https://holdlens.com/methodology

Specifically looking for:
- Bugs / edge cases in the score breakdown
- Features you'd pay for
- Managers you wish were tracked

Happy to answer questions on the stack, the parser, anything.`,
  },
  {
    subreddit: "r/ValueInvesting",
    title: "A modern Dataroma alternative — built on signed conviction scoring, not raw holdings lists",
    body: `Sharing HoldLens (https://holdlens.com) — a 13F tracker I built to answer a single question Dataroma doesn't: where does smart money actually agree?

Dataroma gives you a list. HoldLens scores every ticker on a signed −100..+100 scale that combines:
- How many tracked managers own it (consensus)
- Weighted by each manager's historical 10y CAGR vs. S&P
- Position size as % of portfolio (conviction proof)
- Multi-quarter streaks (compounding signal)
- Dissent penalty when top managers are selling

30 tracked managers right now, including Buffett, Ackman, Druckenmiller, Klarman, Burry, Tepper, Li Lu, Monish Pabrai, Howard Marks. Expanding to 80+ this quarter.

**Pages worth checking:**
- /consensus — tickers where ≥5 managers own AND flow is net-buying
- /contrarian-bets — where ≥2 are buying AND ≥2 are selling the SAME quarter
- /crowded-trades — highest ownership + unwind-risk tag
- /rotation — 8Q × 12-sector net-flow heatmap
- /big-bets — every position >10% of a manager's book

Free. No signup. All 150 JSON endpoints are public.

Feedback welcome — especially on the methodology. I want to make the scoring model more defensible.`,
  },
  {
    subreddit: "r/stocks",
    title: "Free tool: see what 30 of the world's best portfolio managers are buying and selling — with a signed conviction score",
    body: `Built this because I wanted one number that said "how strongly is smart money leaning on this stock" instead of scrolling through 30 manager lists on Dataroma.

HoldLens — https://holdlens.com — free, no signup.

Every stock gets a −100..+100 ConvictionScore. Positive = buy signal, negative = sell. One clean list.

Tracks Buffett, Ackman, Druckenmiller, Klarman, Tepper, Burry, Chris Hohn, and 23 others. Data straight from SEC 13F filings.

Fast answers to "what should I look at?" questions:
- /best-now → top 50 conviction buys across all managers
- /big-bets → positions >10% of someone's portfolio
- /crowded-trades → where smart money is piled in (and starting to leave)
- /rotation → sector flow heatmap over 8 quarters

Pure tool. No newsletter spam, no clickbait, no "8 stocks Warren Buffett is buying" articles. Just the data + a score.`,
  },
];

const HN_POST = {
  title: "Show HN: HoldLens – signed conviction scoring for 13F smart money",
  body: `I built a superinvestor 13F tracker with a twist: every stock gets a single signed score from −100 to +100 that combines consensus, track-record weighting, position concentration, multi-quarter trend, and a dissent penalty.

Dataroma (the dominant free 13F site) shows you lists. HoldLens answers "is smart money actually agreeing on this?" on one scale.

Stack: Next.js 15 static export, Cloudflare Pages + Worker proxy for Yahoo, Python EDGAR parser. 484 pages, 153 public JSON endpoints, no auth, no backend runtime. Tracks 30 managers (Buffett, Ackman, Druckenmiller, Klarman, Burry, Tepper, Hohn, Coleman, Li Lu, Pabrai, Marks, etc.) — expanding to 80+.

Pages: /best-now, /big-bets (size × conviction), /consensus, /contrarian-bets, /crowded-trades, /rotation (sector heatmap), /first-movers, /trend-streak, /reversals, /overlap (manager pair Jaccard), /concentration, /exits — each answers a different question.

Public API: https://holdlens.com/api/v1/index.json

Free, zero signup for any feature. Pro tier (€9/mo founders, limited to 100) adds email alerts on filings, weekly digest, watchlist triggers, and no ads.

I'm a solo dev. Biggest open questions: would a Python SDK around the JSON API help, and which managers would you add first?`,
};

const TWITTER_THREADS = [
  `Solo-built a 13F tracker that scores every stock on a signed -100 to +100 conviction scale.

Dataroma lists holdings. HoldLens scores them.

30 managers tracked. Free. No signup.

🧵 1/6`,

  `What makes it different vs Dataroma:

→ One signed score per ticker — no more reading two columns to figure out net sentiment
→ 16 distinct signal pages, each answering a different question
→ 153 public JSON endpoints (Dataroma has 0)
→ Sub-100ms TTFB, mobile-first

2/6`,

  `The score combines 6 layers:

• Consensus (buyer count × each buyer's 10y CAGR)
• Concentration (position size as % of portfolio)
• Trend (multi-quarter streaks)
• Contrarian bonus (anti-crowding)
• Dissent penalty (sellers subtract)
• Crowding penalty (everyone owns = priced in)

3/6`,

  `Pages worth a bookmark:

/best-now — top 50 buys ranked
/big-bets — positions >10% of a manager's book
/consensus — where ≥5 managers agree AND are net-buying
/contrarian-bets — where ≥2 buy AND ≥2 sell
/rotation — 8Q × 12-sector net-flow heatmap

4/6`,

  `Everything's free. No signup for any feature.

Pro tier (€9/mo, first 100 subscribers) adds:
→ Email alerts the moment any tracked manager files a new 13F
→ Weekly "top 10 buys + top 10 sells" digest
→ Custom watchlist triggers
→ 80+ EDGAR-parsed universe (not just 30)
→ No ads ever

5/6`,

  `Link: https://holdlens.com

Built on Next.js + Cloudflare + a Python EDGAR parser. Static export, zero backend runtime, everything on the edge.

Would love feedback on the scoring model. Especially bugs, edge cases, or managers I should add.

6/6`,
];

const PH_POST = {
  tagline: "See what 30 of the world's best portfolio managers are buying — with one signed conviction score.",
  description: `HoldLens tracks 30 tracked superinvestors (Buffett, Ackman, Druckenmiller, Klarman, Burry, Tepper, Hohn, Coleman, Li Lu, and 21 others) and gives every stock a single signed score from −100 (strongest sell) to +100 (strongest buy).

• 16 distinct signal pages — best-now, big-bets, consensus, contrarian-bets, crowded-trades, rotation, first-movers, trend-streak, and more
• Fast free public JSON API with 150+ endpoints
• Mobile-optimized, zero signup, free forever
• Pro tier (€9/mo, first 100 subscribers) adds email alerts, weekly digest, 80+ EDGAR-parsed manager universe, no ads

Built by a solo dev on Next.js + Cloudflare Pages. The "Dataroma meets modern UX" nobody else built.`,
};

export default function LaunchKitPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-4 inline-block text-[10px] font-bold uppercase tracking-widest bg-rose-400/15 text-rose-400 border border-rose-400/30 rounded px-2 py-1">
        Operator only · noindex
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4">
        Launch kit — copy, paste, ship.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-10">
        Every template below is ready to post. Pick one channel, paste, ship. One Reddit
        front-page + one HN front-page = ~5,000–15,000 targeted visitors → ~50–150 signups
        → 5–20 Pro subs → first €100 crossed.
      </p>

      {/* First action */}
      <section className="mb-12 rounded-2xl border border-brand/40 bg-brand/5 p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          The one thing that actually moves the number
        </div>
        <h2 className="text-xl font-bold mb-2">Post to r/SecurityAnalysis first.</h2>
        <p className="text-sm text-muted leading-relaxed">
          Why this order: r/SecurityAnalysis (350k) skews fundamentals-serious. One good post
          there builds a defensible credential for the HackerNews post. Reddit allows you to
          link directly; HackerNews doesn&rsquo;t penalize the reddit backlink.
        </p>
        <ol className="text-sm text-text mt-4 space-y-2 list-decimal list-inside">
          <li>Open <a href="https://www.reddit.com/r/SecurityAnalysis/submit" target="_blank" rel="noopener noreferrer" className="text-brand underline">r/SecurityAnalysis/submit</a></li>
          <li>Copy title + body from the first card below</li>
          <li>Post between 9–11am ET Tuesday–Thursday for max reach</li>
          <li>Reply to every comment within 30 minutes for 3 hours</li>
          <li>4 hours later, post the HN card</li>
        </ol>
      </section>

      {/* Reddit templates */}
      {REDDIT_POSTS.map((p) => (
        <section key={p.subreddit} className="mb-10 rounded-2xl border border-border bg-panel p-6">
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-1">
                {p.subreddit}
              </div>
              <h2 className="text-lg font-bold">{p.title}</h2>
            </div>
            <a
              href={`https://www.reddit.com/${p.subreddit.replace("r/", "r/")}/submit`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-brand hover:text-text"
            >
              Open submit page →
            </a>
          </div>
          <pre className="text-xs text-muted bg-bg/60 border border-border rounded-lg p-4 whitespace-pre-wrap overflow-auto font-mono leading-relaxed">
{p.body}
          </pre>
        </section>
      ))}

      {/* HN */}
      <section className="mb-10 rounded-2xl border border-border bg-panel p-6">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-1">
              HackerNews · Show HN
            </div>
            <h2 className="text-lg font-bold">{HN_POST.title}</h2>
          </div>
          <a
            href="https://news.ycombinator.com/submit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-brand hover:text-text"
          >
            Open submit page →
          </a>
        </div>
        <pre className="text-xs text-muted bg-bg/60 border border-border rounded-lg p-4 whitespace-pre-wrap overflow-auto font-mono leading-relaxed">
{HN_POST.body}
        </pre>
        <p className="text-xs text-dim mt-3">
          Timing: submit 7–9am ET Tuesday or Wednesday. Retweet from a warm account in the
          first 30 minutes. Reply to every top comment — HN rewards author engagement.
        </p>
      </section>

      {/* Twitter */}
      <section className="mb-10 rounded-2xl border border-border bg-panel p-6">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-1">
              Twitter / X · 6-tweet thread
            </div>
            <h2 className="text-lg font-bold">Launch thread</h2>
          </div>
          <a
            href="https://twitter.com/compose/tweet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-brand hover:text-text"
          >
            Open composer →
          </a>
        </div>
        <div className="space-y-3">
          {TWITTER_THREADS.map((t, i) => (
            <div key={i} className="rounded-lg border border-border bg-bg/60 p-3">
              <div className="text-[9px] uppercase tracking-wider text-dim font-semibold mb-1.5">
                Tweet {i + 1} / 6
              </div>
              <pre className="text-xs text-text font-mono whitespace-pre-wrap leading-relaxed">
{t}
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* ProductHunt */}
      <section className="mb-10 rounded-2xl border border-border bg-panel p-6">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-1">
              ProductHunt
            </div>
            <h2 className="text-lg font-bold">Launch copy</h2>
          </div>
          <a
            href="https://www.producthunt.com/posts/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-brand hover:text-text"
          >
            Open submit page →
          </a>
        </div>
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-1">Tagline</div>
          <div className="rounded-lg border border-border bg-bg/60 p-3 text-sm text-text font-mono">
            {PH_POST.tagline}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-1">Description</div>
          <pre className="text-xs text-muted bg-bg/60 border border-border rounded-lg p-4 whitespace-pre-wrap font-mono leading-relaxed">
{PH_POST.description}
          </pre>
        </div>
      </section>

      {/* Funnel math */}
      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Funnel math → €100
        </div>
        <h2 className="text-xl font-bold mb-3">How the first €100 arrives</h2>
        <div className="text-sm text-muted leading-relaxed space-y-3">
          <p>
            €100 ÷ €9/mo founders rate = <span className="text-text font-bold">~12 subscribers</span>.
          </p>
          <p>
            Assuming finance-SaaS typical conversion (0.5%–2% visitor → paid):
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>At 2% → 600 targeted visitors</li>
            <li>At 1% → 1,200 targeted visitors</li>
            <li>At 0.5% → 2,400 targeted visitors</li>
          </ul>
          <p>
            A single r/SecurityAnalysis post that clears 50 upvotes typically delivers 500–2,000
            visitors. Two channels (Reddit + HN) stacked = ~3,000–8,000 visitors. Math works on the
            first clean campaign.
          </p>
          <p className="text-text font-semibold">
            The gate is distribution, not code. Everything the user needs to convert already ships today.
          </p>
        </div>
      </section>
    </div>
  );
}
