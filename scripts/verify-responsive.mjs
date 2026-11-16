import assert from "node:assert/strict";
import { chromium } from "playwright-core";

// Start the local Vite server first. Set BASE_URL or CHROME_BIN if needed.
const base = process.env.BASE_URL ?? "http://127.0.0.1:4175";
const quick = process.argv.includes("--quick");
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN ?? "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const allSizes = [
  ...[320, 344, 360, 375, 390, 412, 430, 690, 720, 721, 760, 761, 768, 884, 1099, 1100].map(width => ({ width, height: 844 })),
  { width: 844, height: 390 }, { width: 932, height: 430 },
];
const sizes = quick ? [{ width: 390, height: 844 }, { width: 844, height: 390 }] : allSizes;
const routes = quick ? ["/", "/contact"] : ["/", "/company", "/business", "/projects", "/quality", "/news", "/contact", "/privacy"];

async function noPageOverflow(page, label) {
  const overflow = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, available: document.documentElement.clientWidth }));
  assert.ok(overflow.width <= overflow.available + 1, `${label}: page overflow ${JSON.stringify(overflow)}`);
}
async function checkTarget(locator, label) {
  const box = await locator.boundingBox();
  assert.ok(box && box.width >= 44 && box.height >= 44, `${label}: target ${JSON.stringify(box)}`);
}
async function openAndCheck(page, label) {
  const button = page.getByRole("button", { name: "전체 메뉴 열기" });
  await checkTarget(button, `${label} open`);
  assert.equal(await button.getAttribute("aria-controls"), "s2-mobile-menu", `${label}: dialog relationship`);
  const beforeScroll = await page.evaluate(() => window.scrollY);
  await button.click();
  const menu = page.getByRole("dialog", { name: "전체 메뉴" });
  const menuBox = await menu.boundingBox();
  const viewport = page.viewportSize();
  assert.ok(menuBox && Math.abs(menuBox.width - viewport.width) <= 1 && Math.abs(menuBox.height - viewport.height) <= 1, `${label}: menu bounds ${JSON.stringify(menuBox)}`);
  assert.equal(await page.locator("#root").evaluate(el => el.inert), true, `${label}: background inert`);
  assert.equal(await page.locator(".s2-menu-button").getAttribute("aria-expanded"), "true", `${label}: aria-expanded`);
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "전체 메뉴 닫기", `${label}: initial focus`);
  await checkTarget(page.getByRole("button", { name: "전체 메뉴 닫기" }), `${label} close`);
  const sublinks = await page.locator(".s2-mobile-menu nav > div > div a").evaluateAll(elements => elements.map(el => ({
    text: el.textContent, width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height, font: parseFloat(getComputedStyle(el).fontSize),
  })));
  assert.ok(sublinks.every(link => link.width >= 44 && link.height >= 44 && link.font >= 14), `${label}: menu link targets ${JSON.stringify(sublinks)}`);
  const last = page.locator(".s2-mobile-menu nav > div:last-child > div a");
  await last.scrollIntoViewIfNeeded();
  await checkTarget(last, `${label} last link`);
  const withinNav = await last.evaluate(el => {
    const link = el.getBoundingClientRect(), nav = el.closest("nav").getBoundingClientRect();
    return link.top >= nav.top - 1 && link.bottom <= nav.bottom + 1;
  });
  assert.ok(withinNav, `${label}: CONTACT link is reachable in menu`);
  await page.keyboard.press("Escape");
  assert.equal(await menu.count(), 0, `${label}: Escape closes`);
  assert.equal(await page.locator("#root").evaluate(el => el.inert), false, `${label}: background restored`);
  assert.equal(await page.locator(".s2-menu-button").getAttribute("aria-expanded"), "false", `${label}: aria-expanded restored`);
  assert.equal(await page.evaluate(() => document.activeElement?.className), "s2-menu-button", `${label}: focus restored`);
  assert.ok(Math.abs((await page.evaluate(() => window.scrollY)) - beforeScroll) <= 1, `${label}: page scroll restored`);
}

try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  for (const size of sizes) {
    await page.setViewportSize(size);
    for (const route of routes) {
      await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
      await page.locator(".s2-header").waitFor();
      await noPageOverflow(page, `${size.width}x${size.height} ${route}`);
    }
    for (const scenario of ["home-top", "home-scrolled", "contact"]) {
      await page.goto(`${base}${scenario === "contact" ? "/contact" : "/"}`, { waitUntil: "domcontentloaded" });
      if (scenario === "home-scrolled") await page.evaluate(() => window.scrollTo(0, 500));
      await openAndCheck(page, `${size.width}x${size.height} ${scenario}`);
    }
    console.log(`PASS ${size.width}x${size.height}: ${routes.length} pages and three menu states`);
  }

  const subroutes = ["/company/philosophy", "/business/civil", "/business/architecture", "/business/field", "/quality/safety"];
  for (const size of quick ? [] : [{ width: 344, height: 844 }, { width: 768, height: 1024 }, { width: 884, height: 1024 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(size);
    for (const route of subroutes) {
      await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
      await noPageOverflow(page, `${size.width}x${size.height} ${route}`);
      await openAndCheck(page, `${size.width}x${size.height} ${route}`);
    }
    console.log(`PASS ${size.width}x${size.height}: five additional subroutes, page width and menu`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  // Mobile taps need not focus buttons before click; focus must still return to the trigger.
  await page.evaluate(() => {
    document.activeElement?.blur();
    document.querySelector(".s2-menu-button").click();
  });
  await page.getByRole("dialog", { name: "전체 메뉴" }).waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(() => document.activeElement === document.querySelector(".s2-menu-button")), true, "focus returns to trigger even when opening did not focus it");
  await page.goto(`${base}/contact`, { waitUntil: "domcontentloaded" });
  await page.locator("#organization").fill("테스트 회사");
  for (const width of [768, 344, 390]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(await page.locator("#organization").inputValue(), "테스트 회사", `form value retained at ${width}`);
    const controls = await page.locator(".s2-inquiry-form input:not([type=checkbox]), .s2-inquiry-form select, .s2-inquiry-form textarea").evaluateAll(elements => elements.map(el => ({ id: el.id, font: parseFloat(getComputedStyle(el).fontSize) })));
    assert.ok(controls.every(control => control.font >= 16), `input font sizes at ${width}: ${JSON.stringify(controls)}`);
  }
  await page.getByRole("button", { name: "전체 메뉴 열기" }).click();
  for (const size of [{ width: 844, height: 390 }, { width: 768, height: 1024 }, { width: 344, height: 844 }]) {
    await page.setViewportSize(size);
    const box = await page.locator(".s2-mobile-menu").boundingBox();
    assert.ok(box && Math.abs(box.width - size.width) <= 1 && Math.abs(box.height - size.height) <= 1, `open menu after rotation: ${JSON.stringify(box)}`);
    assert.equal(await page.locator("#root").evaluate(el => el.inert), true, "background stays inert after rotation");
  }
  for (const key of ["Tab", "Shift+Tab"]) {
    for (let i = 0; i < 35; i++) {
      await page.keyboard.press(key);
      assert.equal(await page.evaluate(() => document.querySelector(".s2-mobile-menu").contains(document.activeElement)), true, "focus stays in menu");
    }
  }
  await page.locator(".s2-mobile-menu nav > div:last-child > div a").click();
  assert.equal(await page.locator(".s2-mobile-menu").isHidden(), true, "selecting the current page closes menu");
  assert.equal(await page.locator("#root").evaluate(el => el.inert), false, "navigation restores background");
  assert.equal(await page.locator("#organization").inputValue(), "테스트 회사", "same-page navigation retains the form");

  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  for (const locator of [".s2-home-hero__controls button", ".s2-projects-home__controls button", ".s2-footer__body nav a"]) {
    for (const item of await page.locator(locator).all()) await checkTarget(item, locator);
  }
  const previousSlide = await page.locator(".s2-home-hero__controls b").textContent();
  await page.getByRole("button", { name: "다음 슬라이드" }).click();
  assert.notEqual(await page.locator(".s2-home-hero__controls b").textContent(), previousSlide, "next slide works");
  await page.getByRole("button", { name: "슬라이드 자동 재생 일시정지" }).click();
  assert.equal(await page.getByRole("button", { name: "슬라이드 자동 재생" }).getAttribute("aria-pressed"), "true", "pause works");
  const previousProject = await page.locator(".s2-projects-home__controls b").textContent();
  await page.getByRole("button", { name: "다음 프로젝트" }).click();
  assert.notEqual(await page.locator(".s2-projects-home__controls b").textContent(), previousProject, "next project works");
  await page.setViewportSize({ width: 768, height: 844 });
  const titles = await page.locator(".s2-project-card h3").evaluateAll(elements => elements.map(el => ({ text: el.textContent, scroll: el.scrollWidth, width: el.clientWidth })));
  assert.ok(titles.every(title => title.scroll <= title.width + 1), `card headings wrap: ${JSON.stringify(titles)}`);
  await page.getByRole("button", { name: "전체 메뉴 열기" }).click();
  await page.locator(".s2-mobile-menu nav > div:first-child > a").click();
  await page.waitForURL("**/company");
  assert.equal(await page.locator("#root").evaluate(el => el.inert), false, "different-page navigation restores background");
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "전체 메뉴 열기" }).click();
  await page.setViewportSize({ width: 1101, height: 844 });
  await page.waitForFunction(() => document.querySelector(".s2-mobile-menu").hidden);
  assert.equal(await page.locator("#root").evaluate(el => el.inert), false, "desktop resize restores background");
  await noPageOverflow(page, "1101px desktop breakpoint");
  console.log("PASS focus trapping, menu navigation, 1101px transition, touch targets, card wrapping, carousel, form fonts and resize retention");
  await page.close();
} finally {
  await browser.close();
}
