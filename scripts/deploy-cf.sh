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
TOTAL_FILES=$(find out -type f | wc -l | tr -d ' ')
CAP=19900
if [ "$TOTAL_FILES" -gt "$CAP" ]; then
  echo "[x] REFUSING TO DEPLOY: out/ has $TOTAL_FILES files, over the $CAP safety cap" \
       "(CF Pages hard-limits a deployment at 20,000). Prune further or widen the exclusion." >&2
  exit 1
fi
echo "[+] deploying $TOTAL_FILES files (company/officer/live restored, per-insider entity pages excluded)"
OUT_DIR="$PWD/out" python3 scripts/cf-pages-chunked-deploy.py
npm run indexnow 2>/dev/null || true
