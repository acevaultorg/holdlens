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
npm run clean 2>/dev/null || true
npm run build
HOLD="${TMPDIR:-/tmp}/holdlens-insiders-hold"
rm -rf "$HOLD"; mkdir -p "$HOLD"
restore() {
  [ -d "$HOLD" ] || return 0
  if [ -d "$HOLD/__api_insiders_officer/officer" ] && [ ! -e out/api/v1/insiders/officer ]; then
    mkdir -p out/api/v1/insiders && mv "$HOLD/__api_insiders_officer/officer" out/api/v1/insiders/officer
  fi
  rmdir "$HOLD/__api_insiders_officer" 2>/dev/null || true
  for d in "$HOLD"/*/; do
    [ -d "$d" ] || continue
    name="$(basename "$d")"
    [ -e "out/insiders/$name" ] || mv "$d" "out/insiders/$name"
  done
}
trap restore EXIT
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
OUT_DIR="$PWD/out" python3 scripts/cf-pages-chunked-deploy.py
npm run indexnow 2>/dev/null || true
