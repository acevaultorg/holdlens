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
npm run clean 2>/dev/null || true
npm run build
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
  for d in "$HOLD"/*/; do
    [ -d "$d" ] || continue
    name="$(basename "$d")"
    [ -e "out/insiders/$name" ] || mv "$d" "out/insiders/$name"
  done
}
cleanup() { restore; rmdir "$HOLD" 2>/dev/null || true; }
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
# Analytics-tag guard (2026-09-10): refuse to ship an out/ built without GA4/Clarity
# (a worktree or fresh clone drops the gitignored env file; the build then exits 0 untagged).
node scripts/predeploy-guard.mjs
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
OUT_DIR="$PWD/out" python3 scripts/cf-pages-chunked-deploy.py
npm run indexnow 2>/dev/null || true
