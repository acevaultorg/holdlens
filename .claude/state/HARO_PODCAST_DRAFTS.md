# HoldLens HARO + Podcast Outreach Drafts

**Status:** brain-drafted 2026-05-08. Closes the brain-doable half of the
HoldLens reach-fix sprint per top-30 ranking #3.

**Companion files** (already shipped today):
- [HUMAN_ACTIONS.md](.claude/state/HUMAN_ACTIONS.md) — HN Show HN draft, Reddit organic seed list, LinkedIn 3-draft framework deck
- [WIKIPEDIA_CITATION_EXTENSIONS.md](.claude/state/WIKIPEDIA_CITATION_EXTENSIONS.md) — Howard Marks Tier 2 + 5 Tier 3 candidates
- This file — HARO query-response template + 5 podcast cold-email drafts

**Operator owns:** HARO daily monitoring + adapting template per query;
podcast outreach (one per week sustainable, not all 5 the same week).

---

## Part 1 — HARO pitch template

### What HARO is

Help A Reporter Out (`helpareporter.com`) — journalists post queries, sources
respond. 3 emails per day at 5:35am, 12:35pm, 5:35pm Eastern. Each email has
~50 queries across all categories. Operator filters for finance/investing/
business queries where HoldLens data is THE answer.

**Distribution Oracle archetype:** `haro_quoted_response × +60` per
`rules/aceusergrowth.md` v1 Part 2 § D2.

**Canonical template:** `~/.claude/acepilot-19.8/templates/haro-pitch-response.md`
(120 lines, full procedure + anti-patterns).

### Brain-drafted HoldLens HARO response template

Use as scaffold; adapt to the SPECIFIC query each time.

```
Subject: Re: [paste exact HARO query subject line — DO NOT change]

Hi [reporter first name if visible in query],

[ONE SENTENCE answering the specific question, with a number or specific name.
 No preamble. No "great question". Get to the answer in 12 seconds of read time.]

[2-4 SENTENCES expanding with specifics: the data backing the claim, the time
 period, the source. Reference SEC EDGAR filings + HoldLens analysis.]

For example: [pull 1-2 specific tickers + their composite ConvictionScore +
the smart-money-concentration signal that drove the score. Real numbers
from holdlens.com beat hypothetical examples 10:1.]

[1-2 SENTENCES on what makes this conclusion non-obvious — the framing
 the reporter can use as a quote-able "lens".]

I'm happy to dig deeper on any specific manager, holding, or quarter — full
data at holdlens.com/investor/[relevant-slug] (free, no signup, sourced to
SEC EDGAR).

— Paulo de Vries
Operator, HoldLens (sourcescore.org sister-site for AI-citation quality)
LinkedIn: linkedin.com/in/[your-handle]
holdlens.com
```

### HARO response anti-patterns (from canonical template)

- ❌ Generic "great question, here's some thoughts" intro
- ❌ Marketing fluff before substance
- ❌ Sending the same response to multiple queries (HARO blacklists)
- ❌ Pitching irrelevant queries (reporter ignores; reputation tarnishes)
- ❌ Not citing the SEC EDGAR primary source
- ❌ Adding HoldLens link without it being central to the answer
- ❌ Sending after 2 hours of query post (reporter usually filed by then)

### HARO target query types (where HoldLens IS the answer)

Check daily emails for queries containing:

- "hedge fund holdings"
- "13F filing" / "13F filings"
- "what is [investor] buying" / "what is [investor] selling"
- "smart money positions" / "smart money signals"
- "concentrated portfolio" / "concentration ratio"
- "value investor positions"
- "Berkshire Hathaway" + "earnings" / "filings" / "portfolio"
- "Pershing Square" + same
- "Scion Asset Management" + same
- "13D" / "activist investor"
- Specific superinvestor names HoldLens tracks (Buffett, Ackman, Burry,
  Klarman, Druckenmiller, Marks, Einhorn, Watsa, Pabrai, Greenberg, Hohn,
  Akre, Smith, Tepper, Coleman, Halvorsen, Ainslie, Mandel, Ubben, Icahn,
  etc. — full list in `lib/managers.ts`)

### Cadence

- 3-5 substantive responses per week sustainable
- Set HARO digest filter (paid feature) for finance/business if responding daily
- Track wins: `.claude/state/DISTRIBUTION.md ## HARO Activity` — log
  every response, every accepted-quote in print, with publication name
  and link

### Expected outcome

- Acceptance rate: 5-15% on substantive responses (most journalists move on
  to first quotable reply within 2 hours)
- Each accepted quote = 1 high-authority publication backlink + author
  byline citation
- Compounds over months; 5 accepted quotes/year = real authority signal
  for both LLM citation + Google E-E-A-T

---

## Part 2 — 5 Podcast Cold-Email Drafts

### Why podcasts (and why these 5)

Per `rules/aceusergrowth.md` v1 Part 2 § I1: `podcast_guesting × +60`. Long-
form podcasts deliver 30-90 min of operator voice + 1 permanent show-notes
backlink + ongoing replays. Highest authority-per-hour for finance reach.

The 5 below are matched to HoldLens's positioning (13F + ConvictionScore +
superinvestor signal):

| # | Podcast | Host(s) | Why HoldLens fits |
|---|---|---|---|
| 1 | Invest Like the Best | Patrick O'Shaughnessy | Founder + builder positioning; loves data-driven investing tools |
| 2 | Excess Returns | Jack Forehand + Justin Carbonneau | Quant + value methodology focus; ConvictionScore = direct topical fit |
| 3 | Animal Spirits | Michael Batnick + Ben Carlson | Retail-investor audience; Q4 13F coverage seasonal hook |
| 4 | We Study Billionaires | TIP Network hosts | Buffett-Munger-style audience; Berkshire 13F + ConvictionScore = direct hook |
| 5 | Capital Allocators | Ted Seides | Institutional asset-manager audience; B2B-style positioning |

Operator picks one per week (NOT all 5 at once — that's PR-spam pattern).

### Cold-email pre-flight checklist

Before sending ANY pitch:
- [ ] Listen to ≥3 recent episodes of the target podcast (last 60 days)
- [ ] Verify HoldLens.com is live + clean (no broken pages, mobile-perfect)
- [ ] Confirm /about page has clear founder identity + LinkedIn
- [ ] Pre-fill the `[host]` and `[recent-episode]` placeholders with what
      you actually heard
- [ ] Send from a domain-matched email (paulo@holdlens.com or similar —
      not contact@editnative.com which signals other-fleet ownership)

---

### Draft 1 — Invest Like the Best (Patrick O'Shaughnessy)

**Email subject:** `HoldLens — composite signal across 82 superinvestor 13F filings`

**Body:**

```
Hi Patrick,

I'm Paulo, founder of HoldLens — a free tool that synthesizes a single
signed −100…+100 ConvictionScore per ticker from quarterly 13F filings
of 82 superinvestors (Buffett, Ackman, Burry, Klarman, Druckenmiller,
Marks, Einhorn, etc.).

Loved your conversation with [recent guest, e.g. Bill Gurley on attribution].
The angle of "what data tells us about how money actually moves" resonates
with what HoldLens surfaces.

Three things I'd be happy to dig into on Invest Like the Best:

1. Why most retail 13F trackers miss the most important signal — the rate
   of change. Tracking position-size in isolation is a snapshot; tracking
   trajectory across 8+ quarters is where the alpha shows up.

2. Concentration alone isn't a skill signal. Top-quartile concentrated
   funds and bottom-quartile concentrated funds compound at the same rate
   over 8 years. Concentration is a STYLE, not a SKILL.

3. The unfamous compounders matter most. The famous names are over-
   indexed; the alpha is in following dissent moves by managers whose
   conviction streak is visible only when you watch trajectory.

Built solo over 4 weeks. Operator-built, no VC, no API gates, no signup
wall. Just SEC EDGAR data + composite scoring.

If you'd like a guest who can talk methodology rather than narrative, I
think there's a 60-min episode here. Happy to send a 5-min Loom walking
through ConvictionScore math first.

Best,
Paulo de Vries
Operator, HoldLens.com
```

---

### Draft 2 — Excess Returns (Jack Forehand + Justin Carbonneau)

**Email subject:** `Quant + value: a composite ConvictionScore across 82 superinvestor 13Fs`

**Body:**

```
Hi Jack + Justin,

I built HoldLens — a free quant-meets-value tool that composites a single
signed −100…+100 ConvictionScore per ticker from 82 superinvestor 13F
filings, weighted by 8-quarter trajectory.

Two of your recent themes seem to overlap directly:

→ Concentrated portfolios — the data is mixed on whether concentration is
  a skill signal. HoldLens reads concentrations on the trajectory axis
  (growing vs. trimming) which inverts a lot of "famous-investor-bought-X"
  retail panic stories.

→ Quant momentum vs. value — the ConvictionScore decomposes into 6
  archetype components (Smart Money concentration · Insider buys · Track
  record · Trend streak · Concentration penalty · Crowding penalty) so
  listeners can see WHICH factor is driving any given signal.

I'd be excited to walk through:

1. The methodology: what each of the 6 components measures, why we picked
   the weighting, what it gets wrong.
2. A live walk-through of 3 tickers where the composite signal flips
   convention (e.g., Buffett trim that wasn't actually a sell signal —
   share-count moved but portfolio-% rose because Apple appreciated).
3. What I learned shipping a methodology-transparent tool vs. a black-box
   stock-picker.

No funding ask, no API to push, no client product. Free + open-data + the
methodology page is public. Goal of the conversation is methodology
critique + giving Excess Returns listeners a free tool that respects their
time.

Best,
Paulo de Vries
Operator, HoldLens.com
```

---

### Draft 3 — Animal Spirits (Michael Batnick + Ben Carlson)

**Email subject:** `Q4 13F season: ConvictionScore + the unfamous compounders signal`

**Body:**

```
Hi Michael + Ben,

I'm Paulo, founder of HoldLens — quarterly 13F-based ConvictionScore for
82 superinvestors. 4 weeks in production, built solo, free + no signup.

Q4 13F filings drop in mid-Feb (45-day filing deadline post-quarter-end).
That's seasonal-content gold for Animal Spirits — and most retail
coverage misses the most interesting signal: the unfamous compounders.

Three angles I think Animal Spirits listeners would enjoy:

1. The 4-column matrix that ends most "is X still bullish on Y" panic
   stories. Position size + dollar value + portfolio % + Q-over-Q
   share change. Read all 4 together and Buffett-trimmed-Apple becomes
   "Buffett didn't change his mind; Apple just stopped outpacing the
   rest of the book."

2. Why following famous superinvestors is the LOSING half of the alpha.
   The unfamous compounders (50+ tracked managers most retail readers
   have never heard of) outperform when you weight by trajectory, not
   reputation.

3. What I shipped solo in 4 weeks and what's still missing. Honest
   limitations — 13Fs are quarterly, lag 45 days, only show long US
   equities, miss shorts/options/foreign holdings.

I'd love to come on Animal Spirits — 30-45 min works for the format.
Send me an episode you'd like me to riff on for our intro and I'll
prep specific numbers from the most recent filings season.

Best,
Paulo de Vries
HoldLens.com
```

---

### Draft 4 — We Study Billionaires (TIP Network)

**Email subject:** `Berkshire's Q4 13F + ConvictionScore: the compounder lens`

**Body:**

```
Hi [host name — TIP rotates between Stig Brodersen, Trey Lockerbie, Clay
Finck, etc. — verify CURRENT main host before sending],

I'm Paulo, founder of HoldLens — a free tool that computes
ConvictionScore (signed −100…+100) per ticker across 82 superinvestor
13Fs, with Berkshire Hathaway as the longest-running tracked portfolio.

Two episode angles tailored to We Study Billionaires:

→ The 13F as compounder-detection tool: not "what did Buffett buy
  this quarter" (everyone covers this) but "which Berkshire positions
  show 8+ quarter conviction streaks where multiple operating-quality
  signals stack up." Apple, AmEx, KO, Moody's all carry conviction
  streaks; OXY is climbing the streak ladder. The methodology is
  transparent at /methodology.

→ Munger's lessons + the data: "concentration is wisdom" + "circle of
  competence" both have data signatures in 13F trajectory data. I can
  show 3 superinvestors who walk Munger's principles vs. 3 who claim
  to but their 13F shape says otherwise.

I'd love to come on We Study Billionaires for 45-60 min. The
ConvictionScore page is data-rich enough that show-notes can include
specific tickers + scores listeners can verify in the SEC EDGAR
filings cited.

Founder, no co-host needed, no marketing ask. Just methodology + data.

Best,
Paulo de Vries
HoldLens.com
LinkedIn: linkedin.com/in/[handle]
```

---

### Draft 5 — Capital Allocators (Ted Seides)

**Email subject:** `Composite signal across 82 superinvestor 13Fs — methodology angle for Capital Allocators`

**Body:**

```
Hi Ted,

I'm Paulo, founder of HoldLens — a tool that composites quarterly 13F
filings of 82 superinvestors into a single signed −100…+100
ConvictionScore per ticker. Solo-built, methodology-transparent, free.

I know Capital Allocators leans institutional-LP audience so this isn't
a typical-retail-investor pitch. But two methodology angles I think
your audience would care about:

→ Tracking dispersion across managers in a position. Most LP-due-
  diligence shops track manager-level position size. HoldLens shows
  position dispersion across 82 managers' Q4 filings — i.e., a position
  where concentration grows in 5 managers but exits in 7 reads
  differently than the same dollar size in one manager. The dispersion
  signal is invisible at single-manager level.

→ Trajectory vs. snapshot in 13F analysis. Most LPs use 13F at
  quarter-end as a snapshot. The 8-quarter-rolling trajectory is where
  position conviction actually shows up. We can walk through 3
  superinvestors where the trajectory disagrees with the snapshot in
  ways that matter for LP allocation decisions.

If Capital Allocators wants a methodology-focused 45-min episode (no
investment recommendation; pure how-to-think-about-13Fs angle), I'd
be excited to come on. Episode would target your end-quarter listener
peak.

Best,
Paulo de Vries
HoldLens.com
```

---

### Podcast outreach cadence

| Week | Podcast | Why this order |
|---|---|---|
| 1 | Invest Like the Best | Largest reach + matches HoldLens "founder + methodology" angle best |
| 3 | Excess Returns | Methodology-deep audience + lower follower-bar than IIB |
| 5 | Animal Spirits | Higher-volume retail audience; pre-Q1-13F-season hook (mid-Feb) |
| 7 | We Study Billionaires | Buffett-style audience overlap; longest-running compounder hook |
| 9 | Capital Allocators | Institutional angle if 1-4 land traction |

**2-week gaps** between cold-emails to different podcasts (NOT aggressive
spam). If host responds with "interested but too booked", thank them and
keep them on a 6-month follow-up list.

---

## Part 3 — Tracking + survival check

For each pitch sent (HARO or podcast):

```
.claude/state/DISTRIBUTION.md ## Reach Activity

| YYYY-MM-DD | type | target | sent_to | status | days_since | notes |
| 2026-05-XX | HARO | [reporter@pub.com] | finance query #N | sent | 0 | re: Buffett Q4 trim |
| 2026-05-XX | podcast | invest-like-the-best | patrick@... | sent | 0 | first contact |
```

**Status states:** `sent` → `replied` → `accepted` → `aired` (with link).

After 30 days, append a row to per-quarter Reach Activity Summary in
`DISTRIBUTION.md` with hit rate.

**Hit rate benchmarks (per `rules/aceusergrowth.md` v3 Part 5):**
- HARO: 5-15% accepted-in-print rate is normal
- Podcast cold-email: 5-10% reply rate, 2-5% booking rate is normal
- Don't despair below those benchmarks the first 60 days

---

## Part 4 — Operator next-step queue

1. **Today (10 min)** — operator skims this file + decides which podcast to pitch FIRST. Recommended: Invest Like the Best (largest single-episode reach + methodology fit).

2. **Today (5 min)** — operator subscribes to HARO digest at `helpareporter.com` (free tier OK).

3. **Week 1** — listen to 3 recent ILTB episodes; adapt Draft 1 with specific reference to a recent guest's framing; send.

4. **Daily** — operator reads HARO emails (3/day), filters for relevant queries, adapts the template (Part 1) per query. Target 3-5 substantive responses per week.

5. **Weekly** — log every pitch + outcome to `DISTRIBUTION.md ## Reach Activity`.

6. **Bi-weekly** — send next podcast pitch (Excess Returns, Animal Spirits, etc.) per Part 2 cadence.

---

## Related rules

- `~/.claude/rules/aceusergrowth.md` v1 Part 2 §§ D2 (HARO), I1 (podcasts)
- `~/.claude/acepilot-19.8/templates/haro-pitch-response.md` — canonical HARO procedure
- `~/.claude/rules/operator-templates.md` — cite-don't-restate principle (this file extends + specializes the canonical templates)
- `~/.claude/rules/handoff-clarity.md` (I-27) — every pitch includes specific WHAT/WHY/HOW/VERIFY structure inside the email body
- `WIKIPEDIA_CITATION_EXTENSIONS.md` (companion file) — Wikipedia citation drafts for compounding authority
- `HUMAN_ACTIONS.md` — HN + Reddit + LinkedIn drafts for direct-channel reach
