"use client";
import { useState } from "react";

type LaunchPost = {
  id: string;
  channel: string;
  title: string;
  subtitle: string;
  body: string;
  postUrl: string;
  postUrlLabel: string;
  expectedTraffic: string;
  bestDay: string;
};

const POSTS: LaunchPost[] = [
  {
    id: "show-hn",
    channel: "Hacker News (Show HN)",
    title: "Show HN: HoldLens — A 13F tracker that beats Dataroma with multi-factor scoring (free)",
    subtitle: "The biggest single source of traffic. Post on Tuesday/Wednesday morning Pacific time.",
    expectedTraffic: "10k–100k visitors over 24h if it hits the front page",
    bestDay: "Tue/Wed 9am Pacific",
    postUrl: "https://news.ycombinator.com/submit",
    postUrlLabel: "Open HN submit page",
    body: `Title: Show HN: HoldLens — A 13F tracker that beats Dataroma with multi-factor scoring (free)

URL: https://holdlens.com

Body:
Hi HN — I built HoldLens because Dataroma is the canonical 13F aggregator but its model is "rank by ownership count" which conflates information density with signal strength. A stock owned by 25 mid-tier managers and a stock owned by 5 Tier-1 managers (Buffett, Druckenmiller, Klarman) score the same in Dataroma. They shouldn't.

HoldLens computes a multi-factor ConvictionScore for every tracked stock:
- Smart money signal (consensus × manager quality, time-decayed across 4 quarters)
- Insider activity boost (CEO/CFO open-market buys — the strongest single equity signal)
- Track record weighting (each buyer's realized 10y CAGR × position size)
- Multi-quarter trend streaks (compounding bonus for 3Q+ consecutive buying)
- Position concentration (a 15% position weighted heavier than 1%)
- Anti-crowding penalty (signal value diminishes with ownership count → surfaces under-the-radar gems)
- Dissent penalty (when smart money is split, the score reflects that)

Manager quality is itself derived from real 10-year ROI data, not curation. Buffett's BRK-A 10y CAGR is actually 11.7% — alpha −1.4% vs S&P 13.1%. The hand-curated reputation tier system every other tracker uses gives Buffett a 10/10 forever; HoldLens gives him a 5.9/10 because the data says so. The model tells the truth instead of flattering reputation.

Architecture:
- Next.js 15 static export (479 pre-built pages)
- Cloudflare Pages + Cloudflare Worker proxy for Yahoo Finance (Yahoo blocks egress IPs without a real browser User-Agent — Worker fixes that)
- localStorage for user portfolio + watchlist + saved screener filters
- Zero database, zero auth backend
- Free forever — Pro tier launches Q2 2026 for email alerts + API access

The recommendation page is at https://holdlens.com/best-now — it shows the highest-conviction buys with expected ROI projections (e.g. "META · score 100/100 · expected return +18%/yr · 9 buyers averaging 17% CAGR").

Try /portfolio if you want to add your own holdings — it cross-references them against the model and tells you which of your stocks the world's best PMs are buying or selling.

Feedback wanted on the model. Specifically: should the time-decay be exponential or linear? Should the per-manager-per-sector skill matrix be the next addition? Is the anti-crowding penalty too aggressive?`,
  },
  {
    id: "reddit-value",
    channel: "Reddit · r/SecurityAnalysis",
    title: "I built a free alternative to Dataroma with multi-factor scoring + live data",
    subtitle: "Best for serious value investors who already know Dataroma. Don't post in r/wallstreetbets — wrong audience.",
    expectedTraffic: "2k–20k visitors if upvoted",
    bestDay: "Mon/Tue 8am ET",
    postUrl: "https://www.reddit.com/r/SecurityAnalysis/submit",
    postUrlLabel: "Open r/SecurityAnalysis submit",
    body: `Title: I built a free alternative to Dataroma with multi-factor scoring + live data

Body:
Long-time Dataroma user here. The thing that bothered me is that Dataroma ranks stocks by ownership count — but a stock owned by 25 average funds and a stock owned by 5 Tier-1 funds (Buffett, Druckenmiller, Klarman, TCI, Tepper) scores the same. That's wrong. The Tier-1 stock has way more signal.

So I built HoldLens (https://holdlens.com) — a free 13F tracker with:

1. **Multi-factor ConvictionScore** instead of raw ownership count
2. **Manager quality derived from real 10y ROI** (not hand-curated tiers — Buffett's BRK-A only returned 11.7% over the last decade, alpha -1.4%, so his quality score is 5.9/10 in our model. The data tells the truth.)
3. **Live prices on every page** via Cloudflare Worker proxy (Yahoo Finance blocks direct calls from servers, so I built a proxy)
4. **Multi-quarter trend streaks** — when Klarman + Marks both build the same position for 3 consecutive quarters, that's a much stronger signal than a single Q
5. **Insider activity** (SEC Form 4 — CEO/CFO open-market buys) folded into the score
6. **Anti-crowding penalty** — surfaces under-the-radar gems instead of just confirming what everyone already owns
7. **Free forever** for the core product. Pro tier launches Q2 2026 for email alerts + API access.

The page that's the most useful is https://holdlens.com/best-now — top 10 buys + sells with expected ROI projection (computed from each buyer's realized 10y CAGR × their position weight).

The /leaderboard ranks all 30 tracked managers by their actual alpha vs S&P 500, not reputation. Some of the surprises:
- Dev Kantesaria / Valley Forge: +5.6% alpha, the highest in the dataset
- Buffett: -1.4% alpha (the AAPL run lifted S&P harder than BRK-A)
- David Tepper: +14% alpha (the highest of the well-known names)

Feedback welcome. The model is open in source: signal weights, time decay, crowding penalty are all on the methodology page.`,
  },
  {
    id: "reddit-investing",
    channel: "Reddit · r/investing",
    title: "Free site that tracks what 30 of the world's best portfolio managers are buying — with expected ROI",
    subtitle: "Larger audience, less technical. Lead with the personal-portfolio cross-check angle.",
    expectedTraffic: "5k–50k visitors if upvoted",
    bestDay: "Sat/Sun 10am ET",
    postUrl: "https://www.reddit.com/r/investing/submit",
    postUrlLabel: "Open r/investing submit",
    body: `Title: Free site that tracks what 30 of the world's best portfolio managers are buying — with expected ROI projection

Body:
I built HoldLens (https://holdlens.com) because I wanted a faster way to check if the stocks I own are also being bought by the smartest investors in the world.

The killer feature is /portfolio — you add your stocks (stays on your device, never sent to a server), and it tells you:
- "3 of your 5 stocks have BUY signals from Tier-1 managers (Druckenmiller, Klarman, TCI)"
- "1 of your stocks has a SELL signal — 3 managers exiting"
- Live valuation, today's P&L, unrealized gains/losses

It tracks 30 portfolio managers including Buffett, Ackman, Druckenmiller, Klarman, Burry, Howard Marks, Tepper, Coleman (Tiger), Halvorsen (Viking), Hohn (TCI), Mandel (Lone Pine), Akre, Smith (Fundsmith), Pabrai, Greenblatt, and more.

Other pages worth checking:
- https://holdlens.com/best-now — top buy/sell signals with expected annualized return
- https://holdlens.com/leaderboard — all 30 managers ranked by real 10-year alpha vs S&P (Buffett's only 5.9/10 in this model — alpha is actually NEGATIVE over the last decade)
- https://holdlens.com/this-week — the one-page weekly check
- https://holdlens.com/signal/META — example signal dossier with verdict + multi-quarter trend streaks

Free forever for the core product. No signup, no tracking, localStorage only.

Feedback wanted especially on the model. Is the recommendation score useful? What's missing?`,
  },
  {
    id: "twitter-thread",
    channel: "Twitter · 7-tweet thread",
    title: "Counterintuitive thread — \"Buffett's REAL 10y alpha is -1.4%. The leaderboard isn't who you think.\"",
    subtitle: "Counterintuitive truths get the most engagement. Pin to profile after posting.",
    expectedTraffic: "Variable, can compound. Each follower mentioned in the thread tends to RT.",
    bestDay: "Tue/Wed 11am ET",
    postUrl: "https://twitter.com/intent/tweet",
    postUrlLabel: "Open tweet composer",
    body: `Tweet 1:
Counterintuitive truth from real 13F data:

Warren Buffett's 10-year CAGR (BRK-A): 11.7%
S&P 500 10-year CAGR: 13.1%

His alpha is -1.4%/year. The Oracle has been LAGGING the market for a decade.

Who's actually beating it? 🧵

Tweet 2:
Built a model that ranks 30 of the best portfolio managers by REAL 10-year alpha (not reputation):

🥇 Dev Kantesaria (Valley Forge): +5.6%
🥈 Chris Hohn (TCI Fund): +5.5%
🥉 Prem Watsa (Fairfax): +4.9%

David Tepper (Appaloosa): +14%/yr CAGR — the highest of the household names.

Tweet 3:
The reason Buffett looks worse than he is: AAPL ran the S&P harder than BRK-A's diversified mix could keep up with.

Other surprise rankings (alpha vs S&P, last 10y):
- Druckenmiller: +4.5%
- Klarman: -6% (loaded with cash)
- Burry: -3% (highly volatile)
- Bill Ackman: +1.5%

Tweet 4:
What this means for stock-picking:

When a manager with strong real alpha buys, it should weigh more in your decision than when a manager with weak alpha buys.

I built a recommendation model that does this. It also adds:
- Multi-quarter trend streaks
- Insider activity (CEO buys)
- Anti-crowding penalty

Tweet 5:
Today's #1 BUY signal from the model: $META

9 of the world's best PMs are buying. 7 of them are on a 4+ consecutive quarter streak. Average buyer CAGR: ~17%.

Conviction score: 100/100. Expected return: +14%/yr.

Full dossier: holdlens.com/signal/META

Tweet 6:
Today's strongest SELL: $NVDA

Druckenmiller has been trimming for 3 consecutive quarters. Coleman trimmed in Q4. The Tier-1 macro managers are taking profits as the position grew.

Doesn't mean NVDA goes down — but the smart money is rebalancing.

holdlens.com/signal/NVDA

Tweet 7:
Built it free. No signup. No tracking. localStorage only.

Cross-check your own portfolio: holdlens.com/portfolio

It tells you which of your stocks the smart money is buying vs selling.

Free forever. RT if useful 👇

holdlens.com`,
  },
  {
    id: "product-hunt",
    channel: "Product Hunt",
    title: "HoldLens — Track 30 of the world's best portfolio managers with multi-factor scoring",
    subtitle: "Post on a Tuesday for max exposure. Coordinate with finance Twitter for upvotes in the first hour.",
    expectedTraffic: "10k–50k visitors if top 5 of the day",
    bestDay: "Tue 12:01am Pacific",
    postUrl: "https://www.producthunt.com/posts/new",
    postUrlLabel: "Open PH new post",
    body: `Tagline: Track 30 of the world's best portfolio managers with multi-factor scoring

Description (240 char):
Free 13F tracker with ConvictionScore v3. Multi-factor recommendation model with expected ROI projection. Live prices, multi-quarter trend streaks, insider activity, anti-crowding penalty. The recommendation engine that beats Dataroma.

First Comment (post immediately after going live):
Hey Hunters 👋

I built HoldLens because Dataroma — the canonical 13F aggregator — ranks stocks by raw ownership count. A stock owned by 25 average funds and a stock owned by 5 Tier-1 funds (Buffett, Druckenmiller, Klarman) score the same. That's wrong.

HoldLens computes a multi-factor ConvictionScore for every tracked stock:

🎯 Smart money signal weighted by manager quality + consensus + time decay
👔 Insider activity boost (CEO/CFO open-market buys)
📈 Track record weighting — each buyer's REAL 10y CAGR × their position size
🔁 Multi-quarter trend streaks (3Q+ consecutive buying = compounding signal)
💎 Anti-crowding penalty (surfaces under-the-radar gems)
⚖️ Dissent penalty (when smart money is split, the score reflects it)

The killer page is /portfolio — add your stocks and it cross-references them against the model. "3 of your 5 stocks have BUY signals from Tier-1 managers" with one click. localStorage only, never leaves your device.

The /leaderboard ranks all 30 managers by REAL alpha vs S&P 500. Some surprises: Buffett is only 5.9/10 in this model (alpha -1.4% over the last decade). Dev Kantesaria (Valley Forge) is the actual #1 with +5.6% alpha.

Free forever for the core product. Pro tier launches Q2 2026 for email alerts + API access (lock in $9/mo founders rate now).

Feedback welcome on the model. What signals am I missing?`,
  },
];

export default function PressKitClient() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copyPost(post: LaunchPost) {
    navigator.clipboard.writeText(post.body).then(
      () => {
        setCopiedId(post.id);
        setTimeout(() => setCopiedId(null), 2000);
      },
      () => {}
    );
  }

  return (
    <div className="space-y-6">
      {POSTS.map((post) => (
        <div key={post.id} className="rounded-2xl border border-border bg-panel overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-1">
                  {post.channel}
                </div>
                <h2 className="text-lg font-bold text-text">{post.title}</h2>
                <p className="text-xs text-muted mt-1">{post.subtitle}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                  Expected
                </div>
                <div className="text-xs text-text font-semibold">{post.expectedTraffic}</div>
                <div className="text-[10px] text-dim mt-1">{post.bestDay}</div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <pre className="bg-bg/60 border border-border rounded-lg p-4 text-xs text-text font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {post.body}
            </pre>
          </div>

          <div className="px-6 py-4 border-t border-border flex items-center gap-2 flex-wrap">
            <button
              onClick={() => copyPost(post)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-text border border-border hover:border-brand/40 rounded-lg px-3 py-2 bg-bg/40 transition"
            >
              {copiedId === post.id ? "Copied ✓" : "Copy post"}
            </button>
            <a
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand border border-brand/30 hover:bg-brand/10 rounded-lg px-3 py-2 bg-bg/40 transition"
            >
              {post.postUrlLabel} →
            </a>
          </div>
        </div>
      ))}

      {/* Quick guide */}
      <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Launch sequencing
        </div>
        <h3 className="text-xl font-bold mb-3">The 7-day launch plan</h3>
        <ol className="space-y-2 text-sm text-text">
          <li><span className="text-brand font-bold">Day 1 (Tue):</span> Show HN + Twitter thread same morning. HN drives the spike, Twitter compounds.</li>
          <li><span className="text-brand font-bold">Day 2 (Wed):</span> r/SecurityAnalysis (small but high-quality audience). Quote tweets from finance follows.</li>
          <li><span className="text-brand font-bold">Day 3 (Thu):</span> Reply to finance Twitter discussing any of the top 10 buy signals — drop the HoldLens dossier link.</li>
          <li><span className="text-brand font-bold">Day 4 (Fri):</span> ProductHunt at 12:01am Pacific. Coordinate upvote support.</li>
          <li><span className="text-brand font-bold">Day 5 (Sat):</span> r/investing post (larger audience, weekend traffic).</li>
          <li><span className="text-brand font-bold">Day 6 (Sun):</span> Email outreach to 3 finance YouTubers (Joseph Carlson, Patrick Boyle, Plain Bagel) with custom data.</li>
          <li><span className="text-brand font-bold">Day 7 (Mon):</span> Recap thread of week 1 metrics on Twitter. Build in public.</li>
        </ol>
      </div>

      <div className="text-xs text-dim text-center mt-8">
        This page is internal. <code className="text-text">robots: noindex</code> set in metadata.
      </div>
    </div>
  );
}
