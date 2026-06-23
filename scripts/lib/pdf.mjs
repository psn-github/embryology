// HTML → A4 PDF via headless Chromium (Puppeteer) + Paged.js polyfill (§7).
// Paged.js gives correct A4 page boxes, running headers/footers and the
// "Page X of Y" counter declared in brand.css @page rules.
//
// Graceful degradation: if Puppeteer/Chromium is not installed in the current
// environment, the caller still gets the rendered HTML on disk and a clear
// warning — the Markdown source remains the source of truth.

import fs from "node:fs";
import path from "node:path";

const PAGEDJS_CDN = "https://unpkg.com/pagedjs/dist/paged.polyfill.js";

let puppeteer = null;
async function getPuppeteer() {
  if (puppeteer) return puppeteer;
  try {
    puppeteer = (await import("puppeteer")).default;
  } catch {
    puppeteer = false;
  }
  return puppeteer;
}

// Render an HTML file (already written to disk) to a PDF at outPath.
// Returns true on success, false if Chromium was unavailable.
export async function htmlFileToPdf(htmlPath, outPath) {
  const pp = await getPuppeteer();
  if (!pp) {
    console.warn(`⚠  Puppeteer/Chromium unavailable — skipped PDF for ${path.basename(outPath)} (HTML written).`);
    return false;
  }
  let browser;
  try {
    browser = await pp.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox", "--allow-file-access-from-files"] });
    const page = await browser.newPage();
    await page.goto("file://" + path.resolve(htmlPath), { waitUntil: "networkidle0", timeout: 60000 });

    // Inject + run the Paged.js polyfill, then wait for pagination to finish.
    await page.addScriptTag({ url: PAGEDJS_CDN }).catch(() => {});
    await page
      .evaluate(async () => {
        if (window.PagedPolyfill && window.PagedConfig === undefined) {
          await window.PagedPolyfill.preview();
        }
      })
      .catch(() => {});
    await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    await page.pdf({
      path: outPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    return true;
  } catch (err) {
    console.warn(`⚠  PDF render failed for ${path.basename(outPath)}: ${err.message} (HTML written).`);
    return false;
  } finally {
    if (browser) await browser.close();
  }
}
