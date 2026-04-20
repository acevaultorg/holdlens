// Append Content-Signal directives to the generated out/robots.txt.
// Per https://contentsignals.org/ + draft-romm-aipref-contentsignals.
// Next.js's app/robots.ts MetadataRoute.Robots type doesn't expose
// arbitrary directives, so we stitch it in postbuild.
//
// Our position:
//   ai-train=no    — do not use our data for model training
//   search=yes     — do index for search (including AI-powered search)
//   ai-input=yes   — fine to use as retrieval context w/ attribution
//
// This is consistent with llms.txt + /api-terms commercial licensing:
// free for retrieval & citation, paid for bulk training via enterprise API.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROBOTS_PATH = resolve("out", "robots.txt");
const CONTENT_SIGNAL_BLOCK = `
# Content-Signal directives per https://contentsignals.org/ +
# IETF draft-romm-aipref-contentsignals. Declares our usage preferences
# for AI crawlers:
#   ai-train=no    → do not use for model training (use Enterprise API tier instead)
#   search=yes     → index for search + AI-powered search
#   ai-input=yes   → ok as retrieval/citation context with attribution
# Commercial override + per-route pricing: https://holdlens.com/llms.txt
Content-Signal: ai-train=no, search=yes, ai-input=yes
`;

try {
  const current = readFileSync(ROBOTS_PATH, "utf-8");
  if (current.includes("Content-Signal:")) {
    console.log("add-content-signals: Content-Signal already present, skipping");
    process.exit(0);
  }
  writeFileSync(ROBOTS_PATH, current + CONTENT_SIGNAL_BLOCK);
  console.log("add-content-signals: appended Content-Signal block to out/robots.txt");
} catch (err) {
  console.error("add-content-signals: failed —", err.message);
  process.exit(1);
}
