import { chromium } from "playwright-core";

const baseUrl = process.env.WEBDEV_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, 1000));
if ((await page.evaluate(() => window.scrollY)) < 900) throw new Error("Home page could not be scrolled for route reset verification.");
await page.locator(".home-service-scope__link").click();
await page.waitForURL("**/services/scope");
if ((await page.evaluate(() => window.scrollY)) > 2) throw new Error("Route change did not restore the top scroll position.");

await page.goto(`${baseUrl}/gallery`, { waitUntil: "networkidle" });
if (await page.getByText("작업 현장", { exact: true }).count()) throw new Error("Gallery work-site category is still visible on desktop.");

const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
const mobilePage = await mobileContext.newPage();
await mobilePage.goto(`${baseUrl}/gallery`, { waitUntil: "networkidle" });
await mobilePage.getByRole("button", { name: "메뉴 열기" }).click();
if (await mobilePage.getByText("작업 현장", { exact: true }).count()) throw new Error("Gallery work-site category is still visible on mobile.");
await mobileContext.close();
await browser.close();
console.log("Scroll reset and gallery menu verification passed.");
