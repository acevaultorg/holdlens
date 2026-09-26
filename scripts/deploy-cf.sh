#!/usr/bin/env bash
# All deploys enter through this wrapper; the lock covers guards, build and upload.
set -euo pipefail
cd "$(dirname "$0")/.."
exec python3 scripts/deploy-safety.py lock bash scripts/deploy-cf-locked.sh "$@"
