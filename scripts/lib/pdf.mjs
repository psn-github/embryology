// HTML → A4 PDF via headless Chromium (Puppeteer) + Paged.js polyfill (§7).
// Paged.js gives correct A4 page boxes, running headers/footers and the
// "Page X of Y" counter declared in brand.css @page rules.
//
// Graceful degradation: if Puppeteer/Chromium is not installed in the current
// environment, the caller still gets the rendered HTML on disk and a clear
// warning — the Markdown source remains the source of truth.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../../..");
// Prefer the locally-installed Paged.js polyfill (no network dependency,
// faster, works offline). Fall back to the CDN only if the local copy is
// absent (e.g. before `npm install`).
const PAGEDJS_LOCAL = path.join(ROOT, "node_modules", "pagedjs", "dist", "paged.polyfill.js");
const PAGEDJS_CDN = "https://unpkg.com/pagedjs/dist/paged.polyfill.js";

// Large documents (the 86-document bound manual) need a generous budget to
// paginate and print; individual SOPs finish in a couple of seconds.
const NAV_TIMEOUT = 240000;

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
    page.setDefaultTimeout(NAV_TIMEOUT);
    page.setDefaultNavigationTimeout(NAV_TIMEOUT);

    // Disable Paged.js auto-run BEFORE the polyfill loads, so we can await the
    // preview() promise and know pagination has fully completed (critical for
    // the large bound manual — auto-run + a fixed wait prints a half-paginated
    // DOM and drops most pages).
    await page.evaluateOnNewDocument(() => {
      window.PagedConfig = { auto: false };
    });

    // Load the document. 'load' (not networkidle0) avoids waiting on any
    // stray long-poll; the page has no live network of its own.
    await page.goto("file://" + path.resolve(htmlPath), { waitUntil: "load", timeout: NAV_TIMEOUT });

    // Inject + run the Paged.js polyfill. Paged.js produces the running
    // header/footer and "Page X of Y" furniture declared in brand.css; without
    // it the @page margin boxes are not honoured.
    if (fs.existsSync(PAGEDJS_LOCAL)) {
      await page.addScriptTag({ path: PAGEDJS_LOCAL });
    } else {
      await page.addScriptTag({ url: PAGEDJS_CDN }).catch(() => {});
    }
    // Run pagination and AWAIT completion (preview() resolves when every page
    // has been laid out).
    await page.evaluate(async () => {
      if (window.PagedPolyfill) await window.PagedPolyfill.preview();
    });
    await page.waitForSelector(".pagedjs_page", { timeout: NAV_TIMEOUT }).catch(() => {});

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    await page.pdf({
      path: outPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      timeout: NAV_TIMEOUT,
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
