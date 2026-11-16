import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const stage = process.argv[2] || "after";
const output = path.resolve(process.env.OUTPUT_DIR ?? "../outputs/responsive-audit/site2");
const base = process.env.BASE_URL ?? "http://127.0.0.1:4175";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
try {
  for (const scenario of [
    { name: "contact-menu-390", url: "/contact", width: 390, height: 844 },
    { name: "home-scrolled-menu-844", url: "/", width: 844, height: 390, scroll: 500 },
  ]) {
    const page = await browser.newPage({ viewport: { width: scenario.width, height: scenario.height }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    await page.goto(`${base}${scenario.url}`, { waitUntil: "networkidle" });
    if (scenario.scroll) await page.evaluate((y) => window.scrollTo(0, y), scenario.scroll);
    await page.getByRole("button", { name: "전체 메뉴 열기" }).click();
    await page.screenshot({ path: path.join(output, `${stage}-${scenario.name}.png`) });
    console.log(`${stage} ${scenario.name}: ${await page.locator(".s2-mobile-menu").evaluate((el) => JSON.stringify(el.getBoundingClientRect().toJSON()))}`);
    await page.close();
  }
} finally {
  await browser.close();
}
