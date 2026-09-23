#!/usr/bin/env node
/**
 * Refuse the build when any inline <script> in out/ will not PARSE in a browser.
 *
 * WHY THIS EXISTS (measured on sculptclub.nl 2026-09-22/23): a postbuild HTML
 * string-replace whose character class ate the backslash of an escaped quote
 * inside Next's RSC flight payload (`self.__next_f.push([1,"…\"…"])`) emitted an
 * unescaped quote. The inline script then failed to parse, the flight stream
 * ended mid-way, and React swapped the whole page — the homepage included — for
 * its error boundary, for about a day. curl returned 200 with a correct <title>
 * and <h1> the entire time, so sitemap parity, deploy fingerprints and title
 * greps all passed on a page that was blank in a real browser.
 *
 * holdlens is the fleet site most exposed to this class: scripts/strip-broken-links.ts
 * rewrites INSIDE the flight payload (anchor -> span, dropping href, then a
 * trailing-comma cleanup). Its regexes are escape-aware today; this guard is what
 * keeps that true after the next edit. Prefer a mechanical check over a comment —
 * a comment does not stop the person who has already read it.
 *
 * Two self-checks, because a clean sweep from a blind detector is worth nothing:
 *   (a) a positive control — a deliberately broken script MUST be caught;
 *   (b) a floor on scripts seen — so "0 broken" cannot come from looking at nothing.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

// GUARD_OUT exists so this guard can be MUTATION-TESTED against a temp copy
// (break one page, confirm it fails) without touching the real build output.
const OUT = process.env.GUARD_OUT || join(process.cwd(), "out");
const SCRIPT_FLOOR = 500;

async function* walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (p.endsWith(".html")) yield p;
  }
}

// Only these types are EXECUTED as JavaScript by a browser. Everything else —
// ld+json, importmap, speculationrules, a `text/markdown` twin, an HTML template —
// is a data block by spec and must never be parsed here. A deny-list version of
// this guard flagged 4,122 readinglist.school pages purely for carrying
// <script type="text/markdown">; a guard that refuses a valid build gets deleted.
const JS_TYPES = ["text/javascript", "application/javascript", "module", "text/ecmascript"];
const SCRIPT_RE = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;

let control = false;
try { new Function('self.__next_f.push([1,"a"}])'); } catch { control = true; }
if (!control) {
  console.error("[inline-script-guard] REFUSING: the detector cannot catch a broken script.");
  process.exit(1);
}

let files = 0, scripts = 0;
const broken = [];
for await (const file of walk(OUT)) {
  files++;
  const html = await readFile(file, "utf8");
  SCRIPT_RE.lastIndex = 0;
  let m;
  while ((m = SCRIPT_RE.exec(html))) {
    const type = (/\btype\s*=\s*["']?([^"'\s>]+)/.exec(m[1]) || [, ""])[1].toLowerCase();
    if (type && !JS_TYPES.includes(type)) continue;
    if (!m[2].trim()) continue;
    scripts++;
    try { new Function(m[2]); }
    catch (err) { broken.push(`${relative(OUT, file)} — ${err.message}`); break; }
  }
}

if (scripts < SCRIPT_FLOOR) {
  console.error(`[inline-script-guard] REFUSING: only ${scripts} inline scripts in ${files} files — below the ${SCRIPT_FLOOR} floor, so this guard is looking at the wrong thing (empty or unbuilt out/).`);
  process.exit(1);
}
if (broken.length) {
  console.error(`[inline-script-guard] FAILED: ${broken.length} page(s) carry an inline script a browser cannot parse.`);
  console.error("  These pages return 200 with correct HTML and are BLANK in a real browser.");
  for (const b of broken.slice(0, 5)) console.error(`  ${b}`);
  process.exit(1);
}
console.log(`[inline-script-guard] OK — ${scripts} inline scripts in ${files} pages parse; control caught.`);
