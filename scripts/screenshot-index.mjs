// Dev-only: screenshot dist/index.html for review. Not part of the build.
import puppeteer from "puppeteer";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const file = "file://" + path.join(ROOT, "dist", "index.html");
const browser = await puppeteer.launch({ args: ["--no-sandbox", "--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 2 });
await page.goto(file, { waitUntil: "load" });
await page.screenshot({ path: path.join(ROOT, "dist", "index-full.png"), fullPage: true });
await page.screenshot({ path: path.join(ROOT, "dist", "index-top.png"), fullPage: false });
await browser.close();
console.log("✓ screenshots written: dist/index-full.png, dist/index-top.png");
