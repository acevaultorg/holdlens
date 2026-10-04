#!/usr/bin/env bash
# Cloudflare Pages deploy for holdlens.com (project "holdlens"). Policy: no Vercel.
# holdlens out/ = ~33.8k files > CF's 20k/deploy limit. Only the ~4,199
# per-insider ENTITY pages (out/insiders/<name>/, ~8.4k html+txt files —
# the actual v19.44 AdSense thin-content offenders) are EXCLUDED to fit.
#
# NARROWED 2026-09-06 (task ms3od37n8jl3ve): the old version moved the
# WHOLE out/insiders tree aside, which ALSO removed company/officer/live —
# contradicting the sitemap's own comment that those "remain live for users
# via internal navigation" (verified false live: 7,031 built pages,
# INCLUDING the homepage, link to /insiders/company/* + /insiders/officer/*,
# which 404'd in production). postbuild's prune-insiders-rsc.mjs drops the
# RSC .txt twins for company/officer/live (both already noindexed; costs
# only client-side soft-nav) to make room under the 20k cap.
set -euo pipefail
cd "$(dirname "$0")/.."

# ── rg-freeze-guard hook v1 (2026-09-12) ────────────────────────────────────────
# Refuse to deploy over an RG-frozen experiment or a local deploy hold. holdlens was
# the ONLY site with an active RG freeze (RG-IMPACT-HOLDLENS-SWS-20260911-R1) whose
# deploy path never read RG_CONTROL_REGISTER.json — 14 sibling sites already hook it
# via scripts/predeploy-git-guard.mjs, which this repo does not have. Overrides are the
# guard's own: RG_FREEZE_ACK / RG_FREEZE_OVERRIDE / DEPLOY_HOLD_OVERRIDE.
# Called twice on purpose: once here to fail fast before a ~30min build (holds +
# acknowledgement only), and once just before upload with the FRESH out/ so the
# built-vs-live page compare is meaningful.
RG_GUARD=""
for _p in "$HOME/.claude/bin/rg-freeze-guard.mjs" "$HOME/Local/VAULT-Fleet/scripts/rg-freeze-guard.mjs"; do
  if [ -f "$_p" ]; then RG_GUARD="$_p"; break; fi
done
if [ -z "$RG_GUARD" ]; then
  echo "⚠️  rg-freeze-guard not found (~/.claude/bin or ~/Local/VAULT-Fleet/scripts) — RG freeze check SKIPPED on this Mac"
else
  python3 scripts/deploy-safety.py guard node "$RG_GUARD" --site holdlens.com || { echo "❌ deploy-cf: DEPLOY BLOCKED by rg-freeze-guard (pre-build)"; exit 1; }
fi
# ── end rg-freeze-guard hook v1 ─────────────────────────────────────────────────
# Stale-checkout guard (2026-09-28): refuse a checkout missing commits on origin/main, which a
# Pages deploy would revert live. Runs again just before upload (origin moves during the build).
node scripts/predeploy-git-guard.mjs
npm run clean 2>/dev/null || true
npm run build
# A build killed with SIGKILL never runs the EXIT trap, so its HOLD dir (1-2 GB of rebuilt pages) stayed in
# $TMPDIR forever (device 1 disk at 99%, card mus4x5h1o36j4v). Prune our own leftovers older than 6 h first.
find "${TMPDIR:-/tmp}" -maxdepth 1 -type d -name 'holdlens-insiders-hold.*' -mmin +360 -exec rm -rf {} + 2>/dev/null || true
HOLD="$(mktemp -d "${TMPDIR:-/tmp}/holdlens-insiders-hold.XXXXXX")"
restore() {
  [ -d "$HOLD" ] || return 0
  if [ -d "$HOLD/__api_insiders_officer/officer" ] && [ ! -e out/api/v1/insiders/officer ]; then
    mkdir -p out/api/v1/insiders && mv "$HOLD/__api_insiders_officer/officer" out/api/v1/insiders/officer
  fi
  rmdir "$HOLD/__api_insiders_officer" 2>/dev/null || true
  if [ -d "$HOLD/__api_events_company/company" ] && [ ! -e out/api/v1/events/company ]; then
    mkdir -p out/api/v1/events && mv "$HOLD/__api_events_company/company" out/api/v1/events/company
  fi
  rmdir "$HOLD/__api_events_company" 2>/dev/null || true
  if [ -d "$HOLD/__api_insiders_company/company" ] && [ ! -e out/api/v1/insiders/company ]; then
    mkdir -p out/api/v1/insiders && mv "$HOLD/__api_insiders_company/company" out/api/v1/insiders/company
  fi
  rmdir "$HOLD/__api_insiders_company" 2>/dev/null || true
  if [ -d "$HOLD/__officer" ]; then
    for d in "$HOLD/__officer"/*/; do
      [ -d "$d" ] || continue
      name="$(basename "$d")"
      [ -e "out/insiders/officer/$name" ] || mv "$d" "out/insiders/officer/$name"
    done
    rmdir "$HOLD/__officer" 2>/dev/null || true
    rm -f "$HOLD/officer-held.txt"
  fi
  for d in "$HOLD"/*/; do
    [ -d "$d" ] || continue
    name="$(basename "$d")"
    [ -e "out/insiders/$name" ] || mv "$d" "out/insiders/$name"
  done
}
# Whatever restore() could not put back (out/ gone, a newer copy already there) is rebuilt by the next build, so
# delete HOLD outright; `rmdir` failed on a non-empty dir and leaked it (card mus4x5h1o36j4v).
cleanup() { restore; rm -rf "$HOLD" 2>/dev/null || true; }
trap cleanup EXIT
trap 'exit 143' TERM
trap 'exit 130' INT
trap 'exit 129' HUP
if [ -d out/insiders ]; then
  find out/insiders -mindepth 1 -maxdepth 1 -type d \
    ! -name company ! -name officer ! -name live \
    -exec mv {} "$HOLD/" \;
fi
# WIDENED 2026-09-10 (card mtpiejkpiimrnv): b60e5884a restored /insiders/company/* +
# /insiders/officer/* HTML (5,604 files, noindexed, linked from 7,031 pages incl. the
# homepage) and the upload overshot the cap at 23,917. Measured on that build, the
# cheapest class with ZERO shipped references is out/api/v1/insiders/officer/ —
# 6,248 per-officer JSON twins of the noindexed officer pages: referenced by 0 built
# HTML files, absent from sitemap-ai.xml and llms.txt, only listed in the API
# catalog (whose desc now says so). Holding it takes the upload to ~17.7k. Restored
# on exit like the entity dirs, so a local out/ is never left mutilated.
if [ -d out/api/v1/insiders/officer ]; then
  mkdir -p "$HOLD/__api_insiders_officer"
  mv out/api/v1/insiders/officer "$HOLD/__api_insiders_officer/officer"
fi
# WIDENED AGAIN 2026-09-23 (card mudk7borsf8hwq): restarting the EDGAR ingest after
# a 93-business-day gap grew the 8-K corpus 1,442 -> 2,158 tracked tickers and the
# Form 4 corpus 1,270 -> 2,111, taking the upload from ~17.7k to 24,095 files.
# prune-insiders-rsc.mjs now also drops the events/company RSC .txt twins (-2,165),
# which leaves it still over. out/api/v1/events/company/ is the same class as the
# officer JSON above and was verified the same way on this build: referenced by 0 of
# the 260 built HTML files that mention api/v1, absent from sitemap.xml,
# sitemap-ai.xml and llms.txt, listed only in the API catalog — whose desc now says
# it is not deployed, exactly as the officer entry does. Holding it takes the upload
# to ~18.9k. Restored on exit like the rest, so a local out/ is never left mutilated.
if [ -d out/api/v1/events/company ]; then
  mkdir -p "$HOLD/__api_events_company"
  mv out/api/v1/events/company "$HOLD/__api_events_company/company"
fi
# WIDENED A THIRD TIME 2026-09-28 (card mukttjkwwauk79): daily EDGAR ingests took the
# upload to 20,092 files and every deploy since has refused at the cap below.
# out/api/v1/insiders/company/ (2,598 per-ticker Form 4 JSON twins) is the same class as
# the two holds above and was verified the same way on that build: referenced by 0 built
# HTML files, absent from sitemap.xml, sitemap-ai.xml and llms.txt, listed only in the API
# catalog, whose desc now says it is not deployed. Holding it takes the upload to ~17.5k,
# which buys headroom for the ingest to keep growing. Restored on exit like the rest.
if [ -d out/api/v1/insiders/company ]; then
  mkdir -p "$HOLD/__api_insiders_company"
  mv out/api/v1/insiders/company "$HOLD/__api_insiders_company/company"
fi
# WIDENED A FOURTH TIME 2026-10-03: the 10-02 EDGAR ingest took the upload to 20,579 files. What is
# left is HTML that shipped pages link to (10,179 of 10,255 officer pages), so instead of another fixed
# class this holds only the overflow: single-filing officer pages with no GA4/GSC traffic whose company
# page ships, smallest first, down to 19,500 files. functions/_middleware.ts 302s a held officer URL to
# its company page. Fails closed (holds nothing) when the traffic data cannot be read. Restored on exit.
node scripts/hold-officer-overflow.mjs "$HOLD" --target 19500
# Analytics-tag guard (2026-09-10): refuse to ship an out/ built without GA4/Clarity
# (a worktree or fresh clone drops the gitignored env file; the build then exits 0 untagged).
node scripts/predeploy-guard.mjs
# Amazon click-tracking guard (2026-09-28 · card muksgphls3y3tw): every /go/ Amazon link on every built page
# carries data-event-from, sits on a page that loads public/click-track.js, and that tracker sends p= and f=.
# set -e stops the upload when it refuses.
node scripts/amazon-tracking-guard.mjs
TOTAL_FILES=$(find out -type f | wc -l | tr -d ' ')
CAP=19900
if [ "$TOTAL_FILES" -gt "$CAP" ]; then
  echo "[x] REFUSING TO DEPLOY: out/ has $TOTAL_FILES files, over the $CAP safety cap" \
       "(CF Pages hard-limits a deployment at 20,000). Prune further or widen the exclusion." >&2
  exit 1
fi
echo "[+] deploying $TOTAL_FILES files (company/officer/live HTML restored; per-insider entity pages + per-officer API JSON excluded)"
if [ -n "$RG_GUARD" ]; then
  python3 scripts/deploy-safety.py guard node "$RG_GUARD" --site holdlens.com --out "$PWD/out" \
    || { echo "❌ deploy-cf: DEPLOY BLOCKED by rg-freeze-guard (built-vs-live)"; exit 1; }
fi
node scripts/predeploy-git-guard.mjs
OUT_DIR="$PWD/out" python3 scripts/cf-pages-chunked-deploy.py
npm run indexnow 2>/dev/null || true
