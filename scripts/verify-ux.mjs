import assert from "node:assert/strict";
import { chromium } from "playwright-core";

// Start the Vite server first. Override BASE_URL or CHROME_BIN if needed.
const base = process.env.BASE_URL ?? "http://127.0.0.1:4175";
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const targets = [
  ["/company/philosophy", "philosophy"], ["/business/civil", "civil"], ["/business/architecture", "architecture"],
  ["/business/field", "field"], ["/quality/safety", "safety"],
];
async function checkTarget(page, id, label) {
  await page.waitForFunction((targetId) => {
    const heading = document.getElementById(targetId);
    const header = document.querySelector(".s2-header");
    if (!heading || !header) return false;
    const box = heading.getBoundingClientRect();
    return box.top >= header.getBoundingClientRect().bottom && box.bottom <= innerHeight;
  }, id);
  assert.equal(await page.evaluate((targetId) => document.activeElement?.id === targetId, id), true, `${label}: target receives focus`);
}

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  for (const size of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1365, height: 900 }]) {
    await page.setViewportSize(size);
    for (const [route, id] of targets) {
      await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
      await checkTarget(page, id, `${size.width}x${size.height} ${route}`);
    }
    console.log(`PASS ${size.width}x${size.height}: five direct section routes and focused headings`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator(".s2-home-hero__copy a").innerText(), "토목 사업 보기");
  await page.locator(".s2-home-hero__copy a").click();
  await page.waitForURL("**/business/civil#civil");
  await checkTarget(page, "civil", "home CTA");
  await page.goto(`${base}/business/architecture`, { waitUntil: "domcontentloaded" });
  await checkTarget(page, "architecture", "initial section");
  await page.locator('.s2-section-nav a[href*="/business/architecture"]').click();
  await checkTarget(page, "architecture", "same section link");
  await page.getByRole("button", { name: "전체 메뉴 열기" }).click();
  await page.locator('.s2-mobile-menu a[href*="/business/field"]').click();
  await page.waitForURL("**/business/field#field");
  await checkTarget(page, "field", "mobile submenu");

  const draft = { organization: "UX_DRAFT_123", manager: "담당자", phone: "01000000000", region: "서울", timing: "협의", details: "테스트 내용" };
  const requestUrls = [];
  page.on("request", request => requestUrls.push(request.url()));
  await page.goto(`${base}/contact`, { waitUntil: "domcontentloaded" });
  for (const [key, value] of Object.entries(draft)) await page.locator(`#${key}`).fill(value);
  await page.locator("#projectType").selectOption({ label: "건축" });
  await page.getByLabel("개인정보 처리 안내를 확인했습니다.", { exact: false }).check();
  await page.getByRole("link", { name: "개인정보 처리 안내 보기" }).scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  await page.getByRole("link", { name: "개인정보 처리 안내 보기" }).click();
  await page.waitForURL("**/privacy");
  assert.ok(!page.url().includes(draft.organization), "draft must not appear in privacy URL");
  await page.goBack();
  await page.waitForURL("**/contact");
  for (const [key, value] of Object.entries(draft)) assert.equal(await page.locator(`#${key}`).inputValue(), value, `${key} survives navigation`);
  assert.equal(await page.locator("#projectType").inputValue(), "건축");
  assert.equal(await page.locator("#inquiry-agreement").isChecked(), true, "unchanged consent survives navigation");
  await page.waitForTimeout(150);
  assert.ok(Math.abs((await page.evaluate(() => window.scrollY)) - before) < 100, "return preserves form scroll position");
  assert.equal(await page.evaluate((sentinel) => [localStorage, sessionStorage].some(store => Object.values(store).some(value => value.includes(sentinel))), draft.organization), false, "draft is not persisted in browser storage");
  assert.ok(requestUrls.every(url => !url.includes(draft.organization)), "draft does not appear in network request URLs");
  await page.getByRole("link", { name: "개인정보 처리 안내 보기" }).click();
  await page.getByRole("link", { name: "프로젝트 문의로 이동" }).click();
  assert.equal(await page.locator("#organization").inputValue(), draft.organization, "privacy return link restores draft");
  await page.getByRole("link", { name: "개인정보 처리 안내 보기" }).click();
  await page.locator('.s2-footer__body nav a[href="/company"]').click();
  await page.waitForURL("**/company");
  await page.getByRole("button", { name: "전체 메뉴 열기" }).click();
  await page.locator(".s2-mobile-menu nav > div:last-child > a").click();
  await page.waitForURL("**/contact");
  await page.waitForFunction(() => window.scrollY < 5);
  assert.equal(await page.locator("#organization").inputValue(), draft.organization, "draft survives other SPA navigation without restoring privacy scroll");
  await page.reload({ waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("#organization").inputValue(), "", "refresh clears the draft");
  assert.equal(await page.locator("#inquiry-agreement").isChecked(), false, "refresh clears consent");
  await page.close();

  for (const rejectCopy of [true, false]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await context.addInitScript((reject) => {
      window.testClipboardCalls = [];
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text) => { window.testClipboardCalls.push(text); if (reject) throw new Error("test denial"); } } });
    }, rejectCopy);
    const form = await context.newPage();
    await form.goto(`${base}/contact`, { waitUntil: "domcontentloaded" });
    await form.getByRole("button", { name: "문의 내용 복사" }).click();
    assert.ok((await form.locator(".s2-inquiry-form output").innerText()).includes("복사할 내용이 없습니다"), "empty draft is not copied");
    assert.equal(await form.evaluate(() => window.testClipboardCalls.length), 0);
    await form.locator("#organization").fill(draft.organization);
    await form.getByRole("button", { name: "문의 내용 복사" }).click();
    const message = await form.locator(".s2-inquiry-form output").innerText();
    assert.ok(message.includes(rejectCopy ? "클립보드 복사에 실패" : "클립보드에 복사"), `correct copy result: ${message}`);
    const copies = await form.evaluate(() => window.testClipboardCalls);
    assert.equal(copies.length, 1, "copy occurs only on explicit action");
    assert.ok(copies[0].includes(`회사명: ${draft.organization}`) && !copies[0].includes("담당자:"), "partial copy contains entered fields only");
    for (const [key, value] of Object.entries(draft)) await form.locator(`#${key}`).fill(value);
    await form.locator("#projectType").selectOption({ label: "토목" });
    await form.locator("#inquiry-agreement").check();
    await form.getByRole("button", { name: "이메일 문의 작성" }).click();
    const submitMessage = await form.locator(".s2-inquiry-form output").innerText();
    assert.equal(await form.evaluate(() => window.testClipboardCalls.length), 1, "opening email does not copy automatically");
    assert.ok(submitMessage.includes("직접 보내"), "does not claim the email was sent");
    assert.equal(await form.locator("#organization").inputValue(), draft.organization, "draft remains after submitting");
    await context.close();
  }
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  for (const width of [320, 344, 390, 430, 760]) {
    await mobile.setViewportSize({ width, height: 844 });
    await mobile.goto(`${base}/contact`, { waitUntil: "domcontentloaded" });
    const breaks = await mobile.locator(".s2-contact-page__intro h2").evaluate(el => {
      const result = [];
      for (const node of el.childNodes) {
        if (node.nodeType !== Node.TEXT_NODE) continue;
        const text = node.textContent ?? "";
        for (const match of text.matchAll(/\S+/g)) {
          const range = document.createRange();
          range.setStart(node, match.index); range.setEnd(node, match.index + match[0].length);
          result.push({ word: match[0], rects: range.getClientRects().length });
        }
      }
      return result;
    });
    assert.ok(breaks.every(item => item.rects === 1), `${width}px: Korean words remain intact: ${JSON.stringify(breaks)}`);
    assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), `${width}px no document overflow`);
  }
  await mobile.close();
  console.log("PASS CTA, submenu navigation, draft/consent privacy, accurate clipboard messages and Korean heading wrapping");
} finally { await browser.close(); }
