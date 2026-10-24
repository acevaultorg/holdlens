#!/usr/bin/env bash
# CI upload path for holdlens.com (2026-10-03). The Mac uplink measured ~60 KB/s on 2026-10-02, and a 17,100-file
# upload ran for hours. This job uploads the CI-built out/ from GitLab's runner instead.
# It is the SAME deploy as scripts/deploy-cf-locked.sh after its build, with two steps left out on purpose:
#   - rg-freeze-guard: its register exists only on the Macs. The operator runs it locally (check-only) right before
#     playing this manual job. The job is `when: manual` for exactly that reason.
#   - IndexNow: CI deploys here are kit/template changes; pinging every URL for boilerplate is not wanted.
# Guards kept: predeploy-git-guard (HEAD contains origin/main), predeploy-guard, amazon-tracking-guard, the 19,900-file cap.
set -euo pipefail
cd "$(dirname "$0")/.."
test -d out
node scripts/predeploy-git-guard.mjs
# Same exclusion as deploy-cf-locked.sh: per-insider entity pages + per-officer/company API JSON stay out of the deploy
# (CF Pages caps a deployment at 20,000 files). company/officer/live HTML stays.
if [ -d out/insiders ]; then
  find out/insiders -mindepth 1 -maxdepth 1 -type d ! -name company ! -name officer ! -name live -exec rm -rf {} +
fi
rm -rf out/api/v1/insiders/officer out/api/v1/events/company out/api/v1/insiders/company
# The fourth widening from deploy-cf-locked.sh (2026-10-03), which this script lacked: hold only the overflow of
# least-active single-filing officer pages, down to 19,500 files (functions/_middleware.ts 302s a held URL to its
# company page). Measured 2026-10-24 (kit-rollout card mvmr8twx8q6ct2): without it this script refused at 24,953 files
# while deploy-cf-locked.sh shipped the same site. Fail-closed like there: with no fleet traffic CSVs (CI has no
# FLEET_DASHBOARD_INGEST_TOKEN) it holds nothing and the cap below refuses exactly as before. This out/ is a CI or
# temp-clone build, so the held pages are dropped with the hold dir rather than restored.
HOLD="$(mktemp -d "${TMPDIR:-/tmp}/holdlens-ci-hold.XXXXXX")"
trap 'rm -rf "$HOLD"' EXIT
node scripts/hold-officer-overflow.mjs "$HOLD" --target 19500
node scripts/predeploy-guard.mjs
node scripts/amazon-tracking-guard.mjs
TOTAL_FILES=$(find out -type f | wc -l | tr -d ' ')
CAP=19900
if [ "$TOTAL_FILES" -gt "$CAP" ]; then echo "[x] REFUSING: out/ has $TOTAL_FILES files, over the $CAP cap" >&2; exit 1; fi
echo "[+] deploying $TOTAL_FILES files from CI"
test -n "${CLOUDFLARE_API_TOKEN:-}" && test -n "${CLOUDFLARE_ACCOUNT_ID:-}"
set -o pipefail
npx --yes wrangler@4 pages deploy out --project-name holdlens --branch main --commit-dirty=true 2>&1 | tee /tmp/deploy.log
grep -q "Deployment complete" /tmp/deploy.log
