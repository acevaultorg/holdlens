#!/usr/bin/env bash
# Cloudflare Pages deploy for holdlens.com (project "holdlens"). Policy: no Vercel.
# holdlens out/ = ~37.8k files > CF's 20k/deploy limit. /insiders (~19.6k files,
# noindex) is EXCLUDED to fit. Chunked (>56MB) via CF_PAGES_TOKEN.
set -euo pipefail
cd "$(dirname "$0")/.."
npm run clean 2>/dev/null || true
npm run build
HOLD="${TMPDIR:-/tmp}/holdlens-insiders-hold"
rm -rf "$HOLD"; [ -d out/insiders ] && mv out/insiders "$HOLD"
trap '[ -d "$HOLD" ] && mv "$HOLD" out/insiders 2>/dev/null || true' EXIT
OUT_DIR="$PWD/out" python3 scripts/cf-pages-chunked-deploy.py
npm run indexnow 2>/dev/null || true
