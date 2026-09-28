#!/usr/bin/env node
/**
 * predeploy-git-guard — refuse to deploy a checkout that is missing commits on origin/main.
 *
 * WHY (2026-09-28, queue-i): a Pages deploy REPLACES production, so rebuilding a stale checkout
 * does not "skip" the commits it lacks, it reverts them live. Measured that morning: a holdlens
 * worktree was building at 50b2c4d4a while origin/main was 9 commits ahead (the 20k-file cap fix,
 * two /dividend-tax accuracy fixes, the apple-icon 404, HSTS). Nothing in this deploy path would
 * have noticed. 14 sibling sites already run this check; holdlens did not have it.
 *
 * Unlike the sibling copies this one does NOT require being on branch main: lanes deploy holdlens
 * from worktrees on side branches (tracking-guard-20260928, cc-deploy-*). What matters is that
 * HEAD CONTAINS every commit of origin/main — then the deploy can only add, never revert.
 *
 * Called twice by deploy-cf-locked.sh: before the ~30-55 min build, and again just before upload,
 * because origin can move while a build waits in the heavy-build queue.
 *
 * Override for a genuine offline deploy: SKIP_GIT_GUARD=1
 */
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

if (process.env.SKIP_GIT_GUARD === '1') {
  console.log('⚠️  predeploy-git-guard: SKIPPED via SKIP_GIT_GUARD=1');
  process.exit(0);
}

const REF = 'origin/main';
const sh = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
const die = (...lines) => { for (const l of lines) console.error(l); process.exit(1); };

try { sh('git rev-parse --is-inside-work-tree'); }
catch { console.log('✓ predeploy-git-guard: not a git repo, skipping'); process.exit(0); }

// An unfetched origin/main is a local cache; it reports "0 behind" while you are not.
try { execSync('git fetch --quiet origin main', { stdio: 'ignore', timeout: 60_000 }); }
catch {
  die('❌ predeploy-git-guard: DEPLOY BLOCKED — `git fetch origin main` failed, so this checkout cannot be proven current.',
      '   A deploy replaces production. Fix the network, or re-run with SKIP_GIT_GUARD=1 if you are certain.');
}

const missing = Number(sh(`git rev-list --count HEAD..${REF}`));
if (missing > 0) {
  const lost = sh(`git log --oneline --no-decorate HEAD..${REF} | head -20`);
  die(`❌ predeploy-git-guard: DEPLOY BLOCKED — HEAD is missing ${missing} commit(s) from ${REF}.`,
      '',
      `   Shipping this build would REVERT these on holdlens.com:`,
      '',
      lost.split('\n').map((l) => '     ' + l).join('\n'),
      '',
      `   Fix:  commit your work  →  git rebase ${REF}  →  rebuild  →  redeploy`);
}

const ahead = Number(sh(`git rev-list --count ${REF}..HEAD`));
const dirty = sh('git status --porcelain --untracked-files=no').split('\n').filter(Boolean).length;
console.log(`✓ predeploy-git-guard: HEAD contains ${REF} (ahead ${ahead}, missing 0${dirty ? `, ${dirty} uncommitted tracked file(s) ship unrecorded` : ''})`);
