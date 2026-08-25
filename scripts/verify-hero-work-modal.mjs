import { chromium } from "playwright-core";

const baseUrl = "http://127.0.0.1:3000";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function verifyDesktop() {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const firstWorkButton = page.locator(".hero__work-button").first();
  await firstWorkButton.hover();
  await page.waitForTimeout(260);
  const hoverTransform = await firstWorkButton.evaluate((element) => getComputedStyle(element).transform);
  if (hoverTransform === "none") throw new Error("데스크톱 공정 버튼의 hover 확대 상태를 확인하지 못했습니다.");
  await firstWorkButton.click();
  const modal = page.locator(".hero-work-modal");
  await modal.waitFor({ state: "visible" });
  const modalText = await modal.textContent();
  if (!modalText?.includes("경계 구조 시공") || !modalText.includes("현장 검토 항목")) throw new Error("데스크톱 공정 사례 모달 콘텐츠가 올바르지 않습니다.");
  const consultationHref = await modal.locator(".hero-work-modal__link").getAttribute("href");
  if (consultationHref !== "/consultation") throw new Error("공정 사례 모달의 상담 링크가 올바르지 않습니다.");
  await page.keyboard.press("Escape");
  await modal.waitFor({ state: "hidden" });
  await page.screenshot({ path: "/home/ubuntu/hero-work-modal-desktop.png" });
  await page.close();
}

async function verifyMobile() {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const secondWorkButton = page.locator(".hero__work-button").nth(1);
  await secondWorkButton.tap();
  const modal = page.locator(".hero-work-modal");
  await modal.waitFor({ state: "visible" });
  const modalText = await modal.textContent();
  if (!modalText?.includes("보행로 정비") || !modalText.includes("현장 검토 항목")) throw new Error("모바일 공정 사례 모달 콘텐츠가 올바르지 않습니다.");
  await page.screenshot({ path: "/home/ubuntu/hero-work-modal-mobile.png" });
  await page.keyboard.press("Escape");
  await modal.waitFor({ state: "hidden" });
  await page.close();
  await context.close();
}

try {
  await verifyDesktop();
  await verifyMobile();
  console.log("Hero work-panel interactions verified on desktop and mobile.");
} finally {
  await browser.close();
}
