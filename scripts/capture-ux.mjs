import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const phase = process.argv[2] ?? "after";
const base = process.env.BASE_URL ?? "http://127.0.0.1:4175";
const output = path.resolve(process.env.OUTPUT_DIR ?? "../outputs/ui-ux/site2");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await context.addInitScript(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Clipboard permission denied in test"); } } }));
  const page = await context.newPage();
  await page.goto(`${base}/business/architecture`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  const target = await page.locator("#architecture").boundingBox();
  console.log(`${phase}: architecture target top=${target?.y.toFixed(0)}, scrollY=${await page.evaluate(() => window.scrollY)}`);
  await page.screenshot({ path: path.join(output, `${phase}-business-architecture.png`) });

  await page.goto(`${base}/contact`, { waitUntil: "domcontentloaded" });
  await page.locator("#organization").fill("예시 회사");
  const privacy = page.getByRole("link", { name: /개인정보 처리 안내/ }).first();
  await privacy.scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(output, `${phase}-contact-privacy.png`) });
  if (await privacy.getAttribute("target") === "_blank") {
    const popupPromise = context.waitForEvent("page");
    await privacy.click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    console.log(`${phase}: privacy opened separately; draft=${await page.locator("#organization").inputValue()}`);
    await popup.close();
  } else {
    await privacy.click();
    await page.waitForURL("**/privacy");
    await page.goBack();
    console.log(`${phase}: returned from privacy; draft=${await page.locator("#organization").inputValue()}`);
  }
  await page.goto(`${base}/contact`, { waitUntil: "domcontentloaded" });
  for (const [id, value] of Object.entries({ organization: "예시 회사", manager: "홍길동", phone: "01000000000", region: "서울", timing: "협의", details: "테스트 문의" })) {
    await page.locator(`#${id}`).fill(value);
  }
  await page.locator("#projectType").selectOption({ label: "토목" });
  await page.locator('.s2-inquiry-form input[type="checkbox"]').check();
  const copyButton = page.getByRole("button", { name: "문의 내용 복사" });
  if (await copyButton.count()) await copyButton.click();
  else await page.getByRole("button", { name: "이메일 문의 작성" }).click();
  const result = page.locator(".s2-inquiry-form output");
  await result.waitFor();
  await result.scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(output, `${phase}-clipboard-denied.png`) });
  console.log(`${phase}: clipboard-denied message=${await result.innerText()}`);
  await context.close();
} finally { await browser.close(); }
