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
    title: "Show HN: HoldLens — A 13F tracker where every stock gets one signed score (free)",
    subtitle: "The biggest single source of traffic. Post on Tuesday/Wednesday morning Pacific time.",
    expectedTraffic: "10k–100k visitors over 24h if it hits the front page",
    bestDay: "Tue/Wed 9am Pacific",
    postUrl: "https://news.ycombinator.com/submit",
    postUrlLabel: "Open HN submit page",
    body: `Title: Show HN: HoldLens — A 13F tracker where every stock gets one signed score (free)

URL: https://holdlens.com

Body:
I started this because I opened Dataroma (the canonical 13F aggregator) and noticed META was #1 on both the "what to buy" list AND the "what to sell" list — because their model ranks by raw ownership count and the same contested stock shows up on both sides. That's not a signal, that's trading volume.

HoldLens fixes it by collapsing every stock to ONE signed score on a single −100..+100 scale. +100 is the strongest possible buy. −100 is the strongest possible sell. Zero is no signal. A ticker appears on exactly one list — never both — because both lists are filtered views of the same single number.

The score (ConvictionScore v4) is built from six positive layers minus two penalty layers:

- Smart money: manager quality × consensus, time-decayed across 8 quarters of 13F data
- Insider activity: CEO/CFO open-market buys (the strongest single equity signal)
- Track record: buyer 10y CAGR × position size — each buyer's real alpha, not reputation
- Trend streak: multi-quarter compounding (3 quarters in a row ≠ single quarter)
- Concentration: a 15% position is a real bet, a 1% position is filler — weighted accordingly
- Contrarian bonus: under-the-radar stocks with tier-1 buyers get extra credit
- − Dissent penalty: every seller subtracts (×1.6 because exits require more conviction than trims)
- − Crowding penalty: when 15+ managers already own it, the signal is already priced in

Manager quality is itself derived from real 10-year ROI data, not curation. Buffett's BRK-A 10y CAGR is 11.7%, alpha −1.4% vs S&P 13.1%, so his computed quality score is 5.9/10. The hand-curated reputation system every other tracker uses gives him 10/10 forever. HoldLens tells the truth.

Architecture:
- Next.js 15 static export (488 pre-built pages)
- Cloudflare Pages + Cloudflare Worker proxy for Yahoo Finance (Yahoo blocks egress IPs without a real browser User-Agent — the Worker fixes that)
- localStorage for user portfolio + watchlist + saved screener filters
- Zero database, zero auth backend
- Free forever — Pro tier launches Q2 2026 for email alerts + API access

The top buys live at https://holdlens.com/buys (e.g. GE +42, BABA +40, OXY +32, SCHW +32). Top sells at https://holdlens.com/sells (AAPL −11, TSLA −9, SIRI −4). META is in the buy list at +20 — its 9 buyers slightly outweigh its 5 sellers. It is NOT in the sell list.

Try /portfolio if you want to add your own holdings — it cross-references them against the model and tells you which of your stocks the world's best PMs are buying or selling.

Feedback wanted on the model. Specifically: is the dead zone too tight at zero? Should the crowding penalty ramp harder above 20 owners? Is the 1.6× dissent multiplier correct for a long-only manager set?`,
  },
  {
    id: "reddit-value",
    channel: "Reddit · r/SecurityAnalysis",
    title: "I fixed the Dataroma META problem — every stock gets one signed score (free)",
    subtitle: "Best for serious value investors who already know Dataroma. Don't post in r/wallstreetbets — wrong audience.",
    expectedTraffic: "2k–20k visitors if upvoted",
    bestDay: "Mon/Tue 8am ET",
    postUrl: "https://www.reddit.com/r/SecurityAnalysis/submit",
    postUrlLabel: "Open r/SecurityAnalysis submit",
    body: `Title: I fixed the Dataroma META problem — every stock gets one signed score (free)

Body:
Long-time Dataroma user. The thing that finally broke for me: META was #1 on both the "top buys" list AND the "top sells" list simultaneously. Same ticker, both sides. Because Dataroma ranks by raw ownership count, contested stocks dominate both lists at once. That's not a signal — that's trading volume dressed up as one.

So I built HoldLens (https://holdlens.com) — a free 13F tracker where every stock gets ONE signed score on a single −100..+100 scale. +100 = strongest possible buy. −100 = strongest possible sell. A ticker appears in exactly one list based on the sign of its score.

The score combines:

1. **Smart money signal** — manager quality × consensus, time-decayed across 8 quarters
2. **Insider activity** — CEO/CFO open-market buys folded directly into the score
3. **Track record weighting** — each buyer's realized 10y CAGR × their position size (not reputation)
4. **Multi-quarter trend streaks** — 3Q+ of consecutive buying = compounding bonus
5. **Concentration** — a 15% position counts much more than a 1% position
6. **Contrarian bonus** — under-the-radar stocks with tier-1 buyers get extra credit
7. **Dissent penalty** — sellers subtract from the score at 1.6× weight (exits > trims)
8. **Crowding penalty** — already-owned-by-everyone stocks get discounted

Manager quality is derived from REAL 10-year ROI data, not hand-curation:
- Dev Kantesaria (Valley Forge): +5.6% alpha, the highest in the dataset
- Chris Hohn (TCI Fund): +5.5% alpha
- David Tepper (Appaloosa): +14% CAGR, highest of the household names
- Warren Buffett: −1.4% alpha (BRK-A trailed S&P over the last decade — the AAPL run did it). Quality score: 5.9/10.

The data tells the truth instead of flattering reputation.

Key pages:
- /buys — top buy signals (GE +42, BABA +40, OXY +32, SCHW +32, MSCI +30)
- /sells — top sell signals (AAPL −11, TSLA −9, SIRI −4)
- /signal/META — dossier for any ticker with the score breakdown
- /leaderboard — 30 managers ranked by real alpha
- /portfolio — localStorage-only personal portfolio cross-checked against the model

Free forever for the core product. Pro tier (Q2 2026) adds email alerts + EDGAR automation. Feedback welcome on the model itself — weights, time decay, crowding penalty all on /methodology.`,
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
    body: `Title: Free site that tracks what 30 of the world's best portfolio managers are buying — on one signed score

Body:
I built HoldLens (https://holdlens.com) because I wanted a faster way to check if the stocks I own are also being bought by the smartest investors in the world — AND because every other 13F tracker has a bug where the same stock appears on both the "top buys" and "top sells" lists at the same time (Dataroma does this with META right now).

HoldLens collapses every stock to ONE signed score on a single −100..+100 scale. +100 is the strongest possible buy. −100 is the strongest possible sell. A ticker appears in exactly one list. No more "is this a buy or a sell?" confusion.

The killer feature is /portfolio — you add your stocks (stays on your device, never sent to a server), and it tells you:
- "3 of your 5 stocks have BUY signals from Tier-1 managers (Druckenmiller, Klarman, TCI)"
- "1 of your stocks has a SELL signal — 3 managers exiting"
- Live valuation, today's P&L, unrealized gains/losses

It tracks 30 portfolio managers including Buffett, Ackman, Druckenmiller, Klarman, Burry, Howard Marks, Tepper, Coleman (Tiger), Halvorsen (Viking), Hohn (TCI), Mandel (Lone Pine), Akre, Smith (Fundsmith), Pabrai, Greenblatt, and more.

Other pages worth checking:
- https://holdlens.com/buys — top buys (currently GE +42, BABA +40, OXY +32, SCHW +32)
- https://holdlens.com/sells — top sells (currently AAPL −11, TSLA −9, SIRI −4)
- https://holdlens.com/leaderboard — all 30 managers ranked by real 10-year alpha vs S&P (Buffett's only 5.9/10 — his actual alpha is NEGATIVE over the last decade. The data tells the truth.)
- https://holdlens.com/this-week — the one-page weekly check
- https://holdlens.com/signal/META — example signal dossier with verdict + multi-quarter trend streaks

Free forever for the core product. No signup, no tracking, localStorage only.

Feedback wanted especially on the model. Is the signed-score framing useful? What's missing?`,
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
Today's #1 BUY signal from the model: $GE (+42)

Unified ConvictionScore on a single −100..+100 scale. Multi-quarter trend support, tier-1 buyers, no crowding penalty triggered.

Full dossier: holdlens.com/signal/GE

Tweet 6:
Today's #1 SELL signal: $AAPL (−11)

2 tier-1 managers trimming, Buffett's BRK took profits on the AAPL position, and the stock is already in 15+ tracked portfolios (crowding penalty fires).

Doesn't mean AAPL goes down — but the smart money is rebalancing.

holdlens.com/signal/AAPL

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
    title: "HoldLens — 13F tracker where every stock gets one signed −100..+100 score",
    subtitle: "Post on a Tuesday for max exposure. Coordinate with finance Twitter for upvotes in the first hour.",
    expectedTraffic: "10k–50k visitors if top 5 of the day",
    bestDay: "Tue 12:01am Pacific",
    postUrl: "https://www.producthunt.com/posts/new",
    postUrlLabel: "Open PH new post",
    body: `Tagline: 13F tracker where every stock gets one signed −100..+100 ConvictionScore

Description (240 char):
Free 13F tracker. One signed ConvictionScore per stock on a −100..+100 scale where +100 is the strongest possible buy. Fixes the Dataroma bug where the same stock appears on both buy AND sell lists. Live prices, multi-quarter trend detection, insider activity.

First Comment (post immediately after going live):
Hey Hunters 👋

I built HoldLens because I opened Dataroma and noticed META was #1 on both the "what to buy" list AND the "what to sell" list — because Dataroma ranks by raw ownership count and contested stocks dominate both sides. That's not a signal, that's trading volume.

HoldLens collapses every stock to ONE signed score on a single −100..+100 scale. A ticker appears in exactly one list. Every 13F aggregator I've seen has this bug. HoldLens doesn't.

The ConvictionScore combines:

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
