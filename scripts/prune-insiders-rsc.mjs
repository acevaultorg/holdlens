#!/usr/bin/env node
// prune-insiders-rsc.mjs — drop RSC soft-nav `.txt` twins under the NOINDEXED
// /insiders/company/*, /insiders/officer/*, /insiders/live/* pages.
//
// WHY (task ms3od37n8jl3ve, 2026-09-06): deploy-cf.sh moves the ENTIRE
// out/insiders tree aside before upload because CF Pages hard-caps a
// deployment at 20,000 files (out/ is ~33.8k; /insiders alone is ~19.6k).
// That blunt exclusion also removes company/officer/live — which the
// sitemap comments + AdSense thin-content remediation (v19.44) explicitly
// say "remain live for users via internal navigation". They don't: verified
// live 2026-09-06, /insiders/company/noma/ and /insiders/officer/* all 404,
// and 7,031 built pages (INCLUDING out/index.html, the homepage) still link
// to them — a real, live dead-link defect on the site's most important page.
//
// The fix: narrow deploy-cf.sh's exclusion to ONLY the actual thin
// per-insider entity pages (out/insiders/<name>/, ~4,199 dirs / 8,398 files
// — html+txt pairs), and restore company+officer+live to the upload. That
// alone still overshoots the 20k cap (25,442 files). company (1,281 pages)
// and officer (4,323 pages) are BOTH already noindexed (v19.44) and ship as
// html+txt pairs — the .txt is the RSC soft-nav payload Next.js emits per
// route; dropping it only costs client-side soft navigation (falls back to
// a normal page load), never content or SEO. Pruning those 5,604 RSC twins
// brings the upload to 19,838 files — under the cap.
//
// SAFETY (per rules/cloudflare-pages-epipe.md "prune by CONTENT SIGNATURE,
// never by filename" — this tree also holds llms.txt/ads.txt/robots.txt/an
// IndexNow key file elsewhere in out/, none of which this script can reach
// since it only walks company/officer/live, but the signature check is kept
// anyway as a hard guard against ever deleting a non-RSC .txt by accident).
import { readdirSync, statSync, readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "out";
// 2026-09-23: events/company + events/live added. Restarting the EDGAR ingest
// after a 93-business-day gap took the 8-K corpus from 1,442 tracked tickers to
// 2,158, and out/ went from ~17.7k deployable files to 24,095 — back over the
// 20,000 CF Pages cap this script exists to stay under. Note the difference
// from the insiders targets above: /events/company/* is NOT noindexed. That
// does not change the trade, because the .txt twin is never the indexed
// artifact — it is the RSC soft-nav payload, the .html beside it still ships,
// and a crawler only ever reads the .html. Cost is the same as above: client
// -side soft navigation falls back to a normal page load.
const TARGETS = [
  "insiders/company",
  "insiders/officer",
  "insiders/live",
  "events/company",
  "events/live",
];
// RSC flight payloads start with a numbered stream chunk: "1:...", "2:I[...", etc.
const RSC_SIGNATURE = /^\d+:(I\[|\[|"\$S|HL\[|\{)/;

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith(".txt")) out.push(p);
  }
}

let pruned = 0, skippedNotRsc = 0, totalTxt = 0;
for (const rel of TARGETS) {
  const dir = join(OUT_DIR, rel);
  try {
    statSync(dir);
  } catch {
    console.log(`[prune-insiders-rsc] ${dir} does not exist — skip`);
    continue;
  }
  const txts = [];
  walk(dir, txts);
  totalTxt += txts.length;
  for (const f of txts) {
    const head = readFileSync(f, { encoding: "utf8", flag: "r" }).slice(0, 40);
    if (RSC_SIGNATURE.test(head)) {
      unlinkSync(f);
      pruned++;
    } else {
      skippedNotRsc++;
      console.warn(`[prune-insiders-rsc] REFUSED (not RSC signature): ${f}`);
    }
  }
}

if (skippedNotRsc > 0) {
  console.error(
    `[prune-insiders-rsc] REFUSED to prune ${skippedNotRsc} .txt file(s) that did not match the RSC ` +
    `signature — deploy would exceed the 20k CF Pages file cap. Investigate before deploying.`
  );
  process.exit(1);
}

console.log(`[prune-insiders-rsc] pruned ${pruned} RSC .txt twin(s) under ${TARGETS.join(", ")} (of ${totalTxt} scanned)`);
