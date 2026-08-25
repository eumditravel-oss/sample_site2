import { chromium } from "playwright-core";

const baseUrl = process.env.WEBDEV_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

await page.goto(`${baseUrl}/notices`, { waitUntil: "networkidle" });
await page.getByRole("textbox", { name: "공지사항 제목 또는 내용 검색" }).fill("현장 위치");
await page.getByRole("button", { name: "검색" }).click();
const noticeBody = await page.locator(".board-content").innerText();
if (!noticeBody.includes("현장 일정 상담 전 확인 사항") || !noticeBody.includes("검색 결과 1건")) {
  throw new Error("Notice title-and-content search verification failed.");
}

await page.goto(`${baseUrl}/notices/pre-check`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "현장 위치 확인" }).click();
await page.getByRole("button", { name: "경계 구조 시공" }).click();
await page.getByRole("button", { name: "1주 이내" }).click();
await page.getByRole("button", { name: "사진·참고사항 준비" }).click();
const consultationLink = page.getByRole("link", { name: "온라인상담 신청하기" });
const consultationHref = await consultationLink.getAttribute("href");
if (!consultationHref?.includes("workType=%EA%B2%BD%EA%B3%84+") || !consultationHref.includes("schedule=1%EC%A3%BC+") || !consultationHref.includes("photoReady=1")) {
  throw new Error("Pre-consultation values were not encoded in the consultation link.");
}
await consultationLink.click();
await page.waitForURL("**/consultation?*");
if (await page.locator("select[name=workType]").inputValue() !== "경계 구조 시공") throw new Error("Work type was not prefilled.");
if (await page.locator("select[name=schedule]").inputValue() !== "1주 이내") throw new Error("Schedule was not prefilled.");
if (!(await page.locator("textarea[name=message]").inputValue()).includes("현장 사진·참고사항을 준비했습니다.")) throw new Error("Photo readiness note was not prefilled.");

for (const route of ["/company", "/consultation", "/consultation/list", "/notices", "/notices/pre-check", "/gallery", "/location"]) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  if (await page.locator(".page-title--image").count() !== 1) throw new Error(`Missing detail banner: ${route}`);
}

const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
const mobilePage = await mobileContext.newPage();
await mobilePage.goto(`${baseUrl}/notices/pre-check`, { waitUntil: "networkidle" });
if (await mobilePage.locator(".precheck-content__list svg").count() !== 0) throw new Error("Pre-consultation icons were not removed.");
await mobileContext.close();
await browser.close();
console.log("Notice search, consultation prefill, detail banners, and pre-check layout verification passed.");
