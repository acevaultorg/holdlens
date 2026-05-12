# ADSENSE_REMEDIATION.md — holdlens.com

**Status:** Pivot A complete + live-verified · awaiting Google recrawl · operator Request Review pending recrawl confirmation.
**Schema:** v1 (2026-05-12)
**Canonical rules:** `rules/adsense-thin-content-prevention.md` + `rules/google-policy-compliance.md` + `rules/adsense-compliance.md`

---

## Rejection history

| date | reason | root-cause class |
|---|---|---|
| 2026-04-28 / 29 (~21d into "Getting ready") | "Low value content. Your site does not yet meet the criteria of use in the Google publisher network." | (a) thin programmatic content (4,436 /insiders/[insider]/* pages = 80% of pre-Pivot-A sitemap) + (b) YMYL verdict labels without operator credentials + (c) recommendation-encoded Article schema headlines + (d) brokerage affiliate stack on YMYL pages without inline disclosure |

## Remediation shipped

### v19.44 thin-content fix (2026-05-08)
Commit `5e36ccd85`. `app/insiders/[insider]/page.tsx` → `metadata.robots = { index: false, follow: true }`. `app/sitemap.ts` → removed `/insiders/[insider]/*` URLs. Sitemap 5,550 → 1,114 indexable. Programmatic /insiders pages stay live to users via internal nav (company hubs, officer hubs, search); only Googlebot indexing suppressed.

### v19.45 + Pivot A (2026-05-09)
5 commits to gitlab/main:
- `522b9ea39` — Pivot A round-1: /partners page + BrokerCta/AffiliateCTA refactor + MethodologyDisclaimer on 29 /investor/[slug] + sitemap
- `3460fd906` — Pivot A round-2: MethodologyDisclaimer on hand-coded /investor/warren-buffett — closes 30/30 investor coverage
- `0a1adaa58` — state-file hygiene: COMPLIANCE.md created + ADSENSE_REMEDIATION (this file) + MONETIZATION_STACK updated
- `fa4048413` — /partners in sitemap-ai.xml
- `a78caa7ef` — /partners in footer site-wide

**@compliance audit pre-Pivot-A:** mean 0.12 🔴 HARD-BLOCK (3× 0.0 hard-rejects: Verdict-Label Risk, YMYL-Credential Match, Schema Honesty).
**@compliance audit post-Pivot-A:** mean 0.74 ✅ PASS. All 3 previously-immutable 0.0 hard-rejects lifted.

---

## Live verification 2026-05-12 ~17:55 UTC (by `/acepilot brain` session AV-2026-05-12-17h-brain)

Probed live production surface end-to-end. Results:

| Check | Surface | Result |
|---|---|---|
| Verdict labels | / | 0 matches (STRONG BUY/SELL/RECOMMEND patterns) ✓ |
| Verdict labels | /signal/AAPL | 0 matches ✓ |
| Verdict labels | /signal/TSLA | 0 matches ✓ |
| Verdict labels | /signal/MSFT | 0 matches ✓ |
| Verdict labels | /signal/GOOG | 0 matches ✓ |
| Verdict labels | /signal/NVDA | 0 matches ✓ |
| Verdict labels | /investor/warren-buffett | 0 matches ✓ |
| Verdict labels | /investor/peter-lynch | 0 matches ✓ |
| /partners page | HTTP status (after 308 → /partners/) | 200 ✓ |
| /partners in sitemap.xml | grep count | 1 ✓ |
| /partners in sitemap-ai.xml | grep count | 1 ✓ |
| /partners in footer | site-wide grep | present ✓ |
| MethodologyDisclaimer | /investor/warren-buffett (hand-coded) | rendered ✓ |
| MethodologyDisclaimer | /investor/peter-lynch (programmatic) | rendered ✓ |
| Article schema headline | /signal/AAPL | `"AAPL ConvictionScore −29 — superinvestor selling pattern"` — factual descriptive (no BUY/SELL/RECOMMEND), borderline-but-accepted per prior @compliance PASS 0.74 |

**Verdict:** Pivot A holding live. Compliance posture solid.

---

## Google recrawl window

| Milestone | Date | Status |
|---|---|---|
| Pivot A deployed | 2026-05-09 | ✅ done |
| Live verified | 2026-05-12 | ✅ done |
| Recrawl window opens | ~2026-05-15 (T+6d) | pending |
| Recrawl window closes | ~2026-05-22 (T+13d) | pending |
| Operator Request Review action | 2026-05-15-22 | 🟡 OPERATOR ACTION (Clarity Card #5 below) |

**Why these dates:** Google's "Helpful content + content policy" recrawl typically completes 7-14 days after `noindex` + content-policy changes propagate. Pivot A shipped 2026-05-09. Earliest detectable recrawl: 2026-05-15. Conservative window: 2026-05-22.

**How to detect recrawl progress:** `site:holdlens.com/insiders/` count should drop to 0 (Google dropped the thin programmatic pages from index). Use:

```bash
# Direct Google search check (no auth needed)
curl -sL "https://www.google.com/search?q=site%3Aholdlens.com%2Finsiders%2F" \
  | grep -oE "About [0-9,]+ results" | head -1
```

When result count → 0 (or near-0), recrawl complete. AdSense reviewer's content-policy check will then see the cleaned site.

---

## 👨🏻‍🔧 Operator Clarity Card — Request Review when recrawl confirms

🟡 RECOMMENDED — Click "Request Review" in AdSense after Google recrawl completes (5 min, fires 2026-05-15+)

WHAT: When `site:holdlens.com/insiders/` Google search returns ~0 results (Google dropped the thin pages from index), click "Request Review" in AdSense to re-trigger the content-policy review with the cleaned site. Pivot A compliance fixes are already live; this is the formal re-submission.

WHY: AdSense application has been stuck "Getting ready" since 2026-04-18 (24+ days). The thin-content + verdict-label issues that triggered rejection are now fixed. Without a fresh Request Review click, the review queue won't re-evaluate. Once approved, fleet leader monetization unlocks (~92 UV/30d × $20 RPM ≈ €1.84/mo at current traffic, compounds with growth — likely 10-50× over 6-12 months as silent-SEO matures).

TIME: 5 min including verification.

HOW:
  1. Verify Google has dropped the /insiders/ pages from index:
     ```bash
     curl -sL "https://www.google.com/search?q=site%3Aholdlens.com%2Finsiders%2F" | grep -oE "About [0-9,]+ results"
     ```
     → expected: 0 results OR `About 0 results` (= Pivot A noindex visible to Googlebot).
  2. If still showing >100 results, wait 2-3 more days. Check daily.
  3. When ~0 results visible, open https://www.google.com/adsense/new/u/0/pub-XXXXX/home (your AdSense console).
  4. Navigate: Sites → holdlens.com → site card status should still be "Getting ready" OR "Needs attention".
  5. Click "I have fixed the policy issues" (or equivalent button — UI varies).
  6. Click "Request review."
  7. AdSense status transitions to "Review in progress" within 1 hour.

VERIFY: AdSense dashboard site card status changes from "Getting ready" / "Needs attention" → "Review in progress" within 1 hour. Review typically completes within 7-14 days.

IF STUCK:
  - Review takes >14 days: this is normal for the second-cycle re-submission. Don't re-submit again; that resets the queue.
  - Rejected again with same reason: pull the rejection email + open issue. Likely cause would be schema headline borderline status; pre-emptive fix would be to harden /signal/[ticker] Article schema headlines to pure factual format (e.g., `"AAPL — 13F Filings Summary"` instead of `"AAPL ConvictionScore −29 — superinvestor selling pattern"`). See `app/signal/[ticker]/page.tsx` line ~167-172 for the headline construction logic.
  - Rejected with NEW reason: read the rejection email, queue a new remediation cycle.
  - Approval delayed but no rejection: be patient. AdSense backlog can run 30-60 days for compliance re-reviews.

---

## Post-approval action queue (when AdSense approves)

🟢 OPTIONAL — Re-enable brokerage affiliate stack on /signal/[ticker] (post-approval)
  Currently moved to /partners only. After AdSense approves, gradual re-introduction of inline brokerage CTAs on /signal/[ticker] possible WITH proper inline disclosure proximity (FTC + Google Publisher Policies). Stagger 5-10 pages/week to monitor for ad-serving variance.

🟢 OPTIONAL — Submit AdSense for HoldLens at higher RPM tier when traffic ≥1,000 UV/mo
  Finance vertical RPM tier $15-30 at AdSense Layer 1. Mediavine Journey threshold (1,000 sessions/mo) unlocks Layer 7 atomic-swap → 2-5× RPM uplift. Track Plausible monthly; auto-flag in CSIL when crossed.

---

## Corrections

(timestamp-anchored — append only)

---

**Generated:** 2026-05-12 by `/acepilot brain` session AV-2026-05-12-17h-brain.
**File schema version:** 1.
**Last @compliance pass:** 2026-05-09 ~10:48 UTC, mean 0.74 ✅ PASS.
**Last live verification:** 2026-05-12 ~17:55 UTC (this audit).
**Next operator action:** Request Review click at AdSense console after 2026-05-15 recrawl confirmation.
