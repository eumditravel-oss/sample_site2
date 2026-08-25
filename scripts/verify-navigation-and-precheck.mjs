import { chromium } from "playwright-core";

const baseUrl = process.env.WEBDEV_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

const routes = [
  ["/company", "회사소개"],
  ["/services", "공정 범위"],
  ["/services/scope", "공정 범위"],
  ["/services/promise", "고객과의 약속"],
  ["/consultation", "온라인상담"],
  ["/notices", "공지사항"],
  ["/notices/pre-check", "상담 전 확인사항"],
  ["/gallery", "기술 소개"],
  ["/location", "오시는길"],
];

for (const [route, expectedText] of routes) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  const pageText = await page.locator("body").innerText();
  if (pageText.includes("404") || !pageText.includes(expectedText)) {
    throw new Error(`Route verification failed: ${route}`);
  }
}

await page.goto(`${baseUrl}/company`, { waitUntil: "networkidle" });
const companyMenu = page.locator(".desktop-nav button", { hasText: "회사소개" });
await companyMenu.hover();
const hoverOpacity = await companyMenu.evaluate((element) => Number.parseFloat(getComputedStyle(element, "::after").opacity));
if (hoverOpacity < 0.9) throw new Error("Header hover feedback was not applied.");

await page.goto(`${baseUrl}/services/scope`, { waitUntil: "networkidle" });
await page.getByRole("link", { name: "고객과의 약속" }).click();
await page.waitForURL("**/services/promise");
const serviceMain = page.locator("main.site-frame__main--service");
if ((await serviceMain.count()) !== 1) throw new Error("Service page transition class was not applied.");

const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
const mobilePage = await mobileContext.newPage();
await mobilePage.goto(`${baseUrl}/services/scope`, { waitUntil: "networkidle" });
await mobilePage.getByRole("link", { name: "고객과의 약속" }).click();
await mobilePage.waitForURL("**/services/promise");
const mobileAnimation = await mobilePage.locator("main.site-frame__main--service").evaluate((element) => getComputedStyle(element).animationName);
if (mobileAnimation !== "service-page-enter") throw new Error("Mobile service transition animation was not applied.");
await mobileContext.close();

await browser.close();
console.log("Navigation, hover, service transition, and consultation pre-check verification passed.");
