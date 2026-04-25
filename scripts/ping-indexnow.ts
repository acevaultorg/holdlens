// IndexNow notifier — submits all holdlens.com URLs to participating
// search engines (Bing, Yandex, Seznam, Naver) with zero authentication.
// Google does NOT participate in IndexNow as of 2026; for Google use
// Search Console + the sitemap reference in robots.txt instead.
//
// Protocol: https://www.indexnow.org/documentation
//
// Run AFTER a successful build + deploy:
//   npx tsx scripts/ping-indexnow.ts
//
// The script:
//   1. Reads the active IndexNow key from scripts/.indexnow-key (gitignored).
//   2. Verifies the key file is reachable at https://holdlens.com/{key}.txt
//      (IndexNow rejects with 422 if the key file is missing — proves
//      site ownership without auth).
//   3. Extracts every URL from out/sitemap.xml (built by next build).
//   4. POSTs the URL list to api.indexnow.org/indexnow in chunks of 10000
//      (the protocol's per-request maximum).
//   5. Reports per-engine status. 200/202 = accepted; 422 = key file
//      not reachable; 429 = rate limited (back off and retry).
//
// Why this exists: it bypasses the Bing Webmaster Tools / GSC manual
// flow entirely. Every fleet pilot deploy can re-ping new + changed
// URLs in seconds, so newly-shipped pages (e.g. v0.55..v0.60 SEO
// surface) get into Bing's index in hours instead of days.

import { readFileSync, existsSync, appendFileSync, mkdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { homedir } from "node:os";

const HOST = "holdlens.com";
const KEY_FILE = resolve(__dirname, ".indexnow-key");
const SITEMAP_PATH = resolve(__dirname, "..", "out", "sitemap.xml");
const ENDPOINT = "https://api.indexnow.org/indexnow";
const CHUNK_SIZE = 10000;
const FLEET_LOG = join(homedir(), ".claude", "fleet", "ACQUISITION_LOG.md");

// Fleet acquisition logger per Invariant I-33 (autonomous acquisition actions
// MUST log to ~/.claude/fleet/ACQUISITION_LOG.md). Best-effort — never fail
// the deploy because of a log write.
function logFleet(action: string, urls: number, outcome: string): void {
  const ts = new Date().toISOString();
  const row = `${ts} | holdlens | indexnow_ping | ${action} | ${outcome} | urls=${urls}\n`;
  try {
    mkdirSync(dirname(FLEET_LOG), { recursive: true });
    appendFileSync(FLEET_LOG, row, "utf8");
  } catch {
    // ignore — fleet log is best-effort
  }
}

function loadKey(): string {
  if (!existsSync(KEY_FILE)) {
    throw new Error(
      `IndexNow key file missing at ${KEY_FILE}. Generate one with: openssl rand -hex 16 > scripts/.indexnow-key`
    );
  }
  return readFileSync(KEY_FILE, "utf8").trim();
}

function readSitemapUrls(): string[] {
  if (!existsSync(SITEMAP_PATH)) {
    throw new Error(
      `out/sitemap.xml not found. Run \`npm run build\` first so Next.js generates it.`
    );
  }
  const xml = readFileSync(SITEMAP_PATH, "utf8");
  const matches = xml.match(/<loc>([^<]+)<\/loc>/g) ?? [];
  return matches
    .map((m) => m.replace(/<\/?loc>/g, ""))
    .filter((url) => url.startsWith(`https://${HOST}/`));
}

async function verifyKeyFileLive(key: string): Promise<boolean> {
  const url = `https://${HOST}/${key}.txt`;
  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      console.error(`Key file unreachable at ${url} — got HTTP ${res.status}`);
      return false;
    }
    const body = (await res.text()).trim();
    if (body !== key) {
      console.error(
        `Key file content mismatch at ${url}. Expected "${key}", got "${body.slice(0, 60)}..."`
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Failed to reach ${url}:`, err);
    return false;
  }
}

async function pingChunk(key: string, urls: string[]): Promise<void> {
  const body = {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList: urls,
  };
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(
    `IndexNow chunk (${urls.length} urls): HTTP ${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 200)}` : ""}`
  );
  if (res.status === 422) {
    console.error(
      "422 = key file not reachable or key/host mismatch. Check that out/{key}.txt was deployed."
    );
  }
  if (res.status === 429) {
    console.error("429 = rate limited. Wait an hour and re-run.");
  }
}

async function main() {
  const key = loadKey();
  console.log(`Using IndexNow key: ${key.slice(0, 8)}...${key.slice(-4)}`);

  console.log(`Verifying key file is live at https://${HOST}/${key}.txt ...`);
  const ok = await verifyKeyFileLive(key);
  if (!ok) {
    console.error(
      `\nABORT: Key file not reachable. Run \`npm run build && wrangler pages deploy out\` first so the key file ships to production.`
    );
    process.exit(1);
  }
  console.log("Key file live ✓");

  const urls = readSitemapUrls();
  console.log(`Found ${urls.length} URLs in out/sitemap.xml`);
  if (urls.length === 0) {
    console.error("No URLs to submit. Exiting.");
    logFleet("skip", 0, "empty_sitemap");
    process.exit(0);
  }

  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const chunk = urls.slice(i, i + CHUNK_SIZE);
    await pingChunk(key, chunk);
  }

  console.log(`\nDone. Submitted ${urls.length} URLs to IndexNow.`);
  console.log(
    "Bing, Yandex, Seznam, and Naver will pick these up within hours. Google does not participate in IndexNow."
  );
  logFleet("ping", urls.length, "ok");
}

main().catch((err) => {
  console.error("ping-indexnow failed:", err);
  logFleet("error", 0, "fatal");
  process.exit(1);
});
