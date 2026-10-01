// Round-2 review screenshots: serve the built `out/` locally, then capture each
// changed page full-length at 375px and 390px, cookie banner dismissed. Also
// measures horizontal overflow and reports any link/button under 44px tall in
// the parts this round changed. Run: node review/r2-shoot.mjs <port> <outdir>
// (expects playwright-core resolvable and Chromium at /opt/pw-browsers).
import { chromium } from "playwright-core";

const port = process.argv[2] || "4173";
const outDir = process.argv[3] || "review/r2";
const base = `http://127.0.0.1:${port}`;
const pages = [
  "/reading/",
  "/reading/in-their-own-words/",
  "/reading/mental-models/",
  "/reading/valuation/",
  "/reading/foundations/",
  "/investor/warren-buffett/",
  "/investor/joel-greenblatt/",
  "/learn/what-is-alpha/",
];
const widths = [375, 390];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("holdlens_cookie_consent_v1", "denied");
    } catch {}
  });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: "networkidle" }).catch(() => {});
    const report = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      const small = [];
      const sel = "article a, section a, section button";
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        // inline links inside running text are exempt (WCAG 2.5.8 inline exception)
        if (getComputedStyle(el).display === "inline") continue;
        if (r.height < 44 && el.closest("[data-r2]") === null) {
          const t = (el.textContent || "").trim().slice(0, 50);
          if (/See price on Amazon|Audible|reading list|See all|holdings|More by topic/.test(t) || el.getAttribute("href")?.startsWith("#book-"))
            small.push(`${Math.round(r.height)}px ${t}`);
        }
      }
      return { overflow, small };
    });
    console.log(w, p, "overflow:", report.overflow, report.small.length ? report.small : "");
    const name = p.replace(/^\/|\/$/g, "").replace(/\//g, "_") || "home";
    await page.screenshot({ path: `${outDir}/${name}-${w}.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
