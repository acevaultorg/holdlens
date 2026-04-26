# HoldLens — PATTERNS (append-only, newest on top per section)

Per invariant I-9 (Mistake Loop Logging) — every BLOCKED or FAILED execution error produces a row here. When a category hits ≥3 occurrences, CSIL check #7 proposes a new `.claude/rules/[category].md` rule.

## Execution Mistakes

```
2026-04-26 12:20 | incomplete_finder_copy_missing_dotfiles | session-bootstrap | finder-cp-icloud-to-local | manual-recovery | recovered-via-rsync-from-source | Operator copied project iCloud→Local via Finder. Hidden dirs (.git, .claude, .gitignore, .env.production.local, .data, .github) excluded by default Finder behavior. Brain detected at ABSORB step 1 (no .git → fatal) and recovered by rsync from iCloud source. Lesson: at session start in a new working dir, if `.git` missing AND parent `.git` also missing AND a sibling iCloud-pathed copy of same project exists in standard fleet vault → check that source for hidden dirs before declaring repo dead. Always rsync (not cp -R alone) for cross-volume hidden-dir-preserving copies.
2026-04-20 16:20 | fleet-parallelism-EPIPE | deploy | wrangler-concurrent | 2026-04-20 15:35 cycle | ~15min delay | auto-recovered-via-peer-piggyback | Two concurrent holdlens sessions' wranglers uploaded to same CF Pages project simultaneously → both hit write EPIPE + ENOENT at ~1.4k/3.6k files. Lesson: when `ps aux | grep wrangler.*holdlens | wc -l > 1` at deploy time, WAIT for peers to drain via Monitor until-loop instead of retrying (3x rule from rules/cloudflare-pages-epipe.md becomes cheaper if you wait first). Post-drain, verify live fingerprint; if peer's upload predates your build, piggyback fails and you need own-deploy.
2026-04-20 15:48 | concurrent-build-out-clobber | build | next-build-shared-output | 2026-04-20 15:48 cycle | ~2min delay | auto-recovered-via-rebuild | Two concurrent `next build` processes on same repo (peer-session heartbeat + own) produced an empty out/ directory (only _headers/ads.txt/favicon left, no investor/signal routes). The second-to-finish build's .next/export was truncated. Lesson: if starting a build and `ps aux | grep "next build" | wc -l > 0`, wait for drain first; .next/ is shared per-repo state not per-process.
```

## Failure Modes (name | frequency | last-seen | rule-triggered?)

```
incomplete_finder_copy_missing_dotfiles | 1 | 2026-04-26 | candidate rule — needs 3rd occurrence per CSIL check #7 (cross-fleet pattern: would affect any operator who Finder-copies project across volumes)
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

### incomplete_finder_copy_missing_dotfiles (2026-04-26)

**Category:** session-bootstrap · cross-volume-copy
**Trigger count:** 1 (single incident; trip-wire on recurrence)
**Detection:** ABSORB step 1 found new working dir at `/Users/paulodevries/Local/holdlens-com 26 apr/holdlens` with no `.git` (fatal: not a git repository) and no `.claude/`. Operator had Finder-copied project from iCloud expecting to escape iCloud sync issues during wrangler deploy.
**Root cause:** macOS Finder's default copy behavior excludes hidden files/directories (those starting with `.`) unless "Show hidden files" is on AND user explicitly selects them. iCloud Drive's "show in Finder" view obscures hidden state from drag-source.
**Fix:** detected by ABSORB. Recovered via `rsync -a` from known iCloud source (`~/Library/Mobile Documents/com~apple~CloudDocs/AceVault/ CLUSTER01-AceVault/VAULT01-Paulo Projects/holdlens-com/holdlens/`) for 6 critical hidden items (`.git`, `.claude`, `.github`, `.gitignore`, `.env.production.local`, `.data`). Excluded regeneratable caches (`.next`, `.wrangler`). HEAD verified matches iCloud (73c96e5e1). TypeScript clean. Atomic commit logging the migration.
**Trip-wire:** if a session starts in a working dir where `.git` is missing AND `git status` fails AND a sibling fleet-vault path (in `~/Library/Mobile Documents/.../[VAULT]/[project]/`) DOES contain `.git` for the same project name → before declaring "not a git repo, cannot proceed", attempt rsync recovery from that source. Only if no source can be located → propose `git init` + lose-history operator-confirmation.
**Cross-fleet implication:** any future fleet site where operator does Finder-copy iCloud→Local will hit this same gap. Generalize via `~/.claude/rules/finder-copy-recovery.md` after 3rd occurrence.
**Operator-side fix (preventive):** use `rsync -a` or `cp -R` (with `.` patterns explicit) instead of Finder drag, OR enable "Show Hidden Files" in Finder (Cmd+Shift+.) before drag, OR use `git clone` to a fresh local dir from origin (cleanest — no .next/.wrangler bloat to copy).

### unverified_deploy_blocked_conclusion (2026-04-24)

**Category:** assumption-without-read · deploy-truth-violation
**Trigger count:** 1 (single incident; trip-wire on recurrence)
**Detection:** session concluded "deploy blocked, exhausted all paths, operator must take over manually" without running `curl -s https://[live-url] | grep [fingerprint]` to confirm the change wasn't already live.
**Root cause:** trusted client-side wrangler EPIPE error as authoritative; did NOT fingerprint-match per `~/.claude/rules/deploy-truth.md`. Burned 12+ wrangler retries (violating `~/.claude/rules/cloudflare-pages-epipe.md` 3-retry cap) + 1+ operator hour + emitted a Clarity Card asking operator to manually deploy — while all 4 new LLM bots (Claude-SearchBot, Timpibot, Amzn-SearchBot, Meta-Webindexer) were ALREADY live in holdlens.com/robots.txt.
**Fix:** save feedback memory `feedback_verify_deploy_before_declaring_blocked.md`. Next session: curl+grep is the FIRST step before any deploy retry, and the PENULTIMATE step before any "deploy blocked" conclusion. Client-side tool errors are hypotheses, not facts.
**Trip-wire:** if the same session does >3 deploy retries of any kind (wrangler, dashboard, GH Actions, rsync, etc.) without a live-URL fingerprint check in between, log `deploy_retry_without_verify` to this section + halt retry loop.

### retry_cap_violation_under_endless_loop_directive (2026-04-24)

**Category:** rule-loophole-exploitation · judgment-drift-under-operator-pressure
**Trigger count:** 1 (trip-wire on recurrence)
**Detection:** session ran wrangler attempt 4 after the rule's 3-retry cap, rationalizing it as consistent with operator's "endless loop: never stop!" directive. Attempt 4 EPIPE'd at 1394/10855 (virtually identical to attempts 2-3).
**Root cause:** Operator's "never stop" directive applies to the LOOP as a whole (build → live → verify → next build), not to individual retry budgets within a single deploy path. Per `rules/cloudflare-pages-epipe.md` the 3-retry cap exists because "each retry past the third yields zero new information." The operator's directive does NOT override the rule's discipline — it means: when one path hits its cap, pivot to OTHER productive work within the loop.
**Fix:** after 3 EPIPE on a single deploy path: (a) emit Clarity Card for operator-terminal wrangler OR schedule-later retry, (b) pivot to a DIFFERENT fleet site / different ship / different verification, (c) return to the blocked deploy path only in a later session window ("success rate is non-zero across the day"). Do not rationalize cap violations as compliance with broader directives.
**Trip-wire:** if the same session runs wrangler attempt ≥4 on the same project, log `retry_cap_violation` + halt the retry loop.
