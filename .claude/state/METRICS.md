# METRICS.md — HoldLens weekly rollup (Layer 1: measurement)

Scaffold for "make the unique-visitors line always go up" compounding engine.
Populated weekly from Plausible + Search Console + internal state. Kept short
on purpose: 10 numbers, 5 minutes to eyeball, leads the Monday status loop.

**Schema: append-only rows; never rewrite history.** One row per ISO week.

---

## Weekly rollup

```
| week_start | visitors | returning_% | sessions | bounce_% | avg_dwell_s | subs_total | subs_delta | top_entry | indexed_pages | notes |
```

Column semantics:

- **week_start** — ISO date of Monday (UTC).
- **visitors** — Plausible "Unique Visitors" for the 7-day window ending Sunday.
- **returning_%** — % of sessions that are return visits (Plausible `visitors` vs `visitors.new`).
- **sessions** — Plausible total sessions.
- **bounce_%** — single-page-session share (Plausible).
- **avg_dwell_s** — median session seconds (Plausible Visit duration).
- **subs_total** — running count of rows in Resend `audience_members`.
- **subs_delta** — new subscribers this week.
- **top_entry** — highest-traffic entry page (truncate to 30 chars).
- **indexed_pages** — Google Search Console "Pages indexed" count.
- **notes** — ≤40 chars, free-form: a new campaign, a big wave, a regression.

### Rollup rows (append below, newest at bottom)

| week_start | visitors | returning_% | sessions | bounce_% | avg_dwell_s | subs_total | subs_delta | top_entry | indexed_pages | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-04-13 | — | — | — | — | — | — | — | — | — | scaffold added (v1.13) |

---

## Funnel snapshot (monthly — 1st of the month)

```
| month | landing_views | signup_views | signup_submits | email_subs_activated | pro_starts | pro_retains_d30 |
```

Populate after operator wires Resend + Stripe envs. Until then, this section is
a placeholder that AcePilot leaves alone to avoid fabricated rows.

---

## Ship impact log (retro)

Format inherited from `GROWTH_ANALYTICS.md ## Ship Impact`. Each shipped
mutation with a measurable hypothesis lands here ≥7 days post-ship. Never
back-filled with guesses — only actuals.

```
| ship_task_id | shipped_at | observed_window | metric | delta | significance |
```

---

## Oracle calibration tick

Each Monday's AcePilot session reconciles projected vs. actual for last
week's ships. Reads `ORACLE.md ## Calibration` + `RETENTION.md ## Calibration`,
appends any rows whose 7-day window just closed.

**Current gap:** no actuals are flowing yet (waiting for campaign traffic to
give the Oracle real numbers to calibrate against). Rollup stays scaffold-only
until the first post-campaign week lands ≥200 sessions.

---

## Data sources

- **Plausible dashboard** — `https://plausible.io/holdlens.com` (operator access).
  Goals: PWA+Install, PWA+Dismiss, Share+Click, FilingBanner+Click,
  Signal+Share+Download / Copy / X / LinkedIn, Email+Subscribe.
- **Search Console** — `https://search.google.com/search-console` (operator).
  Sitemap: `https://holdlens.com/sitemap.xml` (2000+ URLs).
- **Resend dashboard** — email list size, open/click rates.
  Activation gated on `RESEND_API_KEY` env var on Cloudflare Pages.
- **Internal `.claude/state/HEARTBEAT.log`** — session activity as a proxy
  for engineering throughput.

---

## Invariant (v1.13)

Rows are never deleted or rewritten. Corrections live in a dated `## Corrections`
block at the bottom with the row they correct. Append-only keeps the history
honest even when last week's numbers embarrass us.
