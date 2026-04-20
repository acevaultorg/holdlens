# HoldLens — PATTERNS (append-only, newest on top per section)

Per invariant I-9 (Mistake Loop Logging) — every BLOCKED or FAILED execution error produces a row here. When a category hits ≥3 occurrences, CSIL check #7 proposes a new `.claude/rules/[category].md` rule.

## Execution Mistakes

```
2026-04-20 16:20 | fleet-parallelism-EPIPE | deploy | wrangler-concurrent | 2026-04-20 15:35 cycle | ~15min delay | auto-recovered-via-peer-piggyback | Two concurrent holdlens sessions' wranglers uploaded to same CF Pages project simultaneously → both hit write EPIPE + ENOENT at ~1.4k/3.6k files. Lesson: when `ps aux | grep wrangler.*holdlens | wc -l > 1` at deploy time, WAIT for peers to drain via Monitor until-loop instead of retrying (3x rule from rules/cloudflare-pages-epipe.md becomes cheaper if you wait first). Post-drain, verify live fingerprint; if peer's upload predates your build, piggyback fails and you need own-deploy.
2026-04-20 15:48 | concurrent-build-out-clobber | build | next-build-shared-output | 2026-04-20 15:48 cycle | ~2min delay | auto-recovered-via-rebuild | Two concurrent `next build` processes on same repo (peer-session heartbeat + own) produced an empty out/ directory (only _headers/ads.txt/favicon left, no investor/signal routes). The second-to-finish build's .next/export was truncated. Lesson: if starting a build and `ps aux | grep "next build" | wc -l > 0`, wait for drain first; .next/ is shared per-repo state not per-process.
```

## Failure Modes (name | frequency | last-seen | rule-triggered?)

```
fleet-parallelism-EPIPE | 2 | 2026-04-20 | rules/cloudflare-pages-epipe.md (covers the deploy side; wait-don't-retry addendum candidate)
concurrent-build-out-clobber | 1 | 2026-04-20 | candidate rule — needs 3rd occurrence per CSIL check #7
version-identity-drift | 0 (fleet rule only) | — | rules/version-identity-sync.md
deploy-truth-void | 0 (pre-ship-verified) | — | rules/deploy-truth.md
```

## Last 10 Ships (cross-reference from ANALYTICS.md ## Behavior Log)

See `.claude/state/ANALYTICS.md ## Behavior Log` — keep PATTERNS.md focused on mistakes + failure modes, not success flow.

## 2026-04-20 wrangler EPIPE pattern — third occurrence today
- Session cycle 1: 4 EPIPEs, succeeded on retry 5 (v1.59 earlier)
- Session cycle 2: 1 EPIPE, succeeded on retry 2 (agent-ready-v1)
- Session cycle 3: 3 EPIPEs, BLOCKED on retry 3 (agent-ready-v2 OAuth stubs)

Observation: retry 1 and retry 2 fail at near-identical file counts (~949-1322/3687), suggesting persistent state in CF's upload API. Retrying further today unlikely to help; better to resume session 60+ min later.
