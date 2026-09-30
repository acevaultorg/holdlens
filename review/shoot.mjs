// Screenshots of every page whose product blocks changed, at 375px and 390px wide.
// Usage: node review/shoot.mjs <baseUrl> <outDir> <prefix>
// /amz/items is intercepted locally (never reaches the network); "mock" shots simulate
// a live response: "wrong-book" = one product has the WRONG title and one cover fails to load;
// "covers" = both titles match and both covers load (placeholder test covers, served locally).
// Prices in simulated shots are test values, not real prices.
// Playwright is resolved from the global install when it is not a project dependency.
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
const req = createRequire(import.meta.url);
let pw;
try { pw = req("playwright"); } catch { pw = req(execSync("npm root -g").toString().trim() + "/playwright"); }
const { chromium } = pw;
const [base, dir, prefix] = process.argv.slice(2);
const PAGES = [
  ["home", "/"],
  ["reading", "/reading/"],
  ["reading-mental-models", "/reading/mental-models/"],
  ["learn-what-is-a-13f", "/learn/what-is-a-13f/"],
  ["investor-warren-buffett", "/investor/warren-buffett/"],
  ["etf", "/etf/"],
];
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const COVER = (t) => `<svg xmlns="http://www.w3.org/2000/svg" width="330" height="500" viewBox="0 0 330 500"><rect width="330" height="500" fill="#2b3a55"/><rect x="24" y="24" width="282" height="452" fill="none" stroke="#c9a227" stroke-width="4"/><text x="165" y="240" fill="#f4efe1" font-family="Georgia,serif" font-size="30" text-anchor="middle">${t}</text><text x="165" y="290" fill="#c9a227" font-family="Georgia,serif" font-size="18" text-anchor="middle">test cover</text></svg>`;
async function shoot(name, path, width, mock) {
  const page = await browser.newPage({ viewport: { width, height: 844 }, deviceScaleFactor: 2 });
  // Registered first = lowest priority (Playwright tries the newest route first): block every other outside request.
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort());
  await page.route("**/amz/items*", (r) =>
    mock
      ? r.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, asOf: new Date().toISOString(), items: mock === "covers" ? {
          "0060555661": { title: "The Intelligent Investor Rev Ed.", brand: "", img: { url: "https://m.media-amazon.com/images/I/test-cover-a.svg", w: 330, h: 500 }, price: "$12.34" },
          "1953953573": { title: "Poor Charlie's Almanack: The Essential Wit and Wisdom of Charles T. Munger", brand: "", img: { url: "https://m.media-amazon.com/images/I/test-cover-b.svg", w: 330, h: 500 }, price: null },
        } : {
          // Right book, but the cover URL 404s -> must NOT leave an empty box.
          "0060555661": { title: "The Intelligent Investor Rev Ed.: The Definitive Book on Value Investing", brand: "", img: { url: "https://m.media-amazon.com/images/I/test-missing.jpg", w: 331, h: 500 }, price: "$12.34" },
          // Wrong book on this ASIN -> guard must refuse it (no image, title, or price).
          "1953953573": { title: "Diocese of Atlanta Centennial Celebration", brand: "", img: { url: "https://m.media-amazon.com/images/I/test-ok.png", w: 1, h: 1 }, price: "$99.99" },
        } }) })
      : r.fulfill({ status: 404, body: "" }),
  );
  await page.route("https://m.media-amazon.com/**", (r) =>
    r.request().url().includes("test-ok") ? r.fulfill({ contentType: "image/png", body: PNG })
      : r.request().url().includes("test-cover") ? r.fulfill({ contentType: "image/svg+xml", body: COVER(r.request().url().includes("-a.") ? "Book A" : "Book B") })
      : r.fulfill({ status: 404, body: "" }),
  );
  await page.goto(base + path, { waitUntil: "load" });
  await page.waitForTimeout(600);
  // Review-only: decline the cookie banner and unstick the site header so they don't cover the block.
  const decline = page.getByRole("button", { name: "Decline" });
  if (await decline.count()) await decline.first().click().catch(() => {});
  await page.addStyleTag({ content: "header{position:static!important}" });
  const block = page.locator("section.hl-books, section:has(a[data-event-from='investing-books']), a[href^='/go/dp'], a[href^='/go/s']").first();
  if (await block.count()) await block.scrollIntoViewIfNeeded();
  const el = page.locator("section.hl-books").first();
  const target = (await el.count()) ? el : page.locator("section:has(a[href^='/go/'])").first();
  const file = `${dir}/${prefix}${name}${mock === "covers" ? "-simulated-covers" : mock ? "-simulated-wrong-book" : ""}-${width}.png`;
  if (await target.count()) await target.screenshot({ path: file });
  else await page.screenshot({ path: file });
  const text = (await target.count()) ? (await target.innerText()).replace(/\s+/g, " ").slice(0, 400) : "";
  const hasDiocese = (await page.content()).includes("Diocese");
  const emptyImg = await page.evaluate(() => [...document.querySelectorAll(".ak-ad-img")].filter((e) => getComputedStyle(e).display !== "none" && !e.querySelector("img")).length);
  // page-level overflow check at this width
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(JSON.stringify({ file, visibleEmptyImageSlots: emptyImg, dioceseInDom: hasDiocese, horizontalOverflowPx: overflow, text }));
  await page.close();
}
for (const w of [375, 390]) {
  for (const [n, p] of PAGES) await shoot(n, p, w, false);
  await shoot("home", "/", w, "wrong");
  await shoot("home", "/", w, "covers");
}
await browser.close();
