import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";
import { createServer as createViteServer } from "vite";

// Run after a GitHub Pages build (GITHUB_ACTIONS=true). CHROME_BIN is optional.
const vite = await createViteServer({ server: { middlewareMode: true }, appType: "custom", mode: "production" });
const { seoPages, seoAliases, seoForPath, siteUrl } = await vite.ssrLoadModule("/src/config/seo.ts");
await vite.close();
const routes = [...Object.keys(seoPages), ...Object.keys(seoAliases)];
const source = await readFile("client/src/App.tsx", "utf8");
const appRoutes = [...source.matchAll(/<Route path="([^"]+)"/g)].map(match => match[1]).filter(route => route !== "/404");
assert.deepEqual([...routes].sort(), appRoutes.sort(), "every app route has a generated page and SEO mapping");

const root = path.resolve("dist/public");
const http = createHttpServer(async (req, res) => {
  try {
    const requestPath = new URL(req.url, "http://localhost").pathname;
    if (!requestPath.startsWith("/sample_site2/")) throw new Error("outside site");
    const relative = decodeURIComponent(requestPath.slice("/sample_site2/".length));
    let target = path.resolve(root, relative);
    if (target !== root && !target.startsWith(`${root}${path.sep}`)) throw new Error("outside site");
    const info = await stat(target);
    if (info.isDirectory()) {
      if (!requestPath.endsWith("/")) { res.writeHead(301, { Location: `${requestPath}/` }); res.end(); return; }
      target = path.join(target, "index.html");
    }
    const body = await readFile(target);
    const ext = path.extname(target);
    const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".xml": "application/xml" };
    res.writeHead(200, { "Content-Type": types[ext] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(await readFile(path.join(root, "404.html")));
  }
});
await new Promise(resolve => http.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${http.address().port}/sample_site2/`;
const localUrl = route => route === "/" ? base : `${base}${route.slice(1)}/`;
let browser;
try {
  for (const route of routes) {
    const response = await fetch(localUrl(route));
    assert.equal(response.status, 200, `${route} should return HTTP 200`);
    const html = await response.text();
    const seo = seoForPath(route);
    const head = html.slice(0, html.indexOf("</head>"));
    assert.ok(html.includes("<main") && /<h1[\s>]/.test(html), `${route} has readable pre-rendered body`);
    const staticHeading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]*>/g, "").replace(/\s/g, "");
    assert.equal(staticHeading, seo.heading.replace(/\s/g, ""), `${route} pre-rendered heading matches expected page`);
    assert.ok(html.includes("/sample_site2/assets/"), `${route} uses Pages base path`);
    assert.ok(head.includes(`<title>${seo.pageTitle}</title>`), `${route} has page title`);
    assert.ok(head.includes(`<meta name="description" content="${seo.description}"`), `${route} has page description`);
    assert.deepEqual([...head.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(match => match[1]), [seo.url], `${route} has one correct canonical`);
    assert.ok(head.includes(`<meta property="og:url" content="${seo.url}"`), `${route} has correct social URL`);
    assert.ok(head.includes('rel="icon" href="/sample_site2/favicon.png" type="image/png" sizes="192x192"'), `${route} uses the square favicon under the Pages base path`);
    const json = head.match(/<script id="seo-structured-data" type="application\/ld\+json">(.*?)<\/script>/)?.[1];
    assert.ok(json, `${route} has JSON-LD`);
    const graph = JSON.parse(json)["@graph"];
    assert.equal(graph.find(item => item["@type"] === "WebPage")?.url, seo.url, `${route} structured data agrees with canonical`);
  }
  const sitemap = await (await fetch(`${base}sitemap.xml`)).text();
  const faviconResponse = await fetch(`${base}favicon.png`);
  assert.equal(faviconResponse.status, 200, "favicon returns HTTP 200");
  assert.equal(faviconResponse.headers.get("content-type"), "image/png");
  const png = Buffer.from(await faviconResponse.arrayBuffer());
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "favicon is PNG");
  assert.equal(png.readUInt32BE(16), 192, "favicon width");
  assert.equal(png.readUInt32BE(20), 192, "favicon height");
  const symbolPaths = text => [...text.matchAll(/<path\b[^>]*fill="url\(#dongseong-symbol-gradient\)"[^>]*>/g)].map(([tag]) => ({
    d: tag.match(/\bd="([^"]*)"/)?.[1], transform: tag.match(/\btransform="([^"]*)"/)?.[1],
  }));
  const originalLogo = await readFile("client/public/dongseong-logo.svg", "utf8");
  const iconSource = await readFile("client/public/favicon-symbol.svg", "utf8");
  assert.equal(symbolPaths(iconSource).length, 3, "symbol has three original paths");
  assert.deepEqual(symbolPaths(iconSource), symbolPaths(originalLogo), "symbol paths and transforms match the original logo");
  const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(sitemapUrls, Object.keys(seoPages).map(route => seoForPath(route).url), "sitemap contains canonical routes only");
  for (const url of sitemapUrls) {
    assert.ok(url.startsWith(siteUrl));
    const response = await fetch(`${base}${url.slice(siteUrl.length)}`);
    assert.equal(response.status, 200, `sitemap URL ${url} must exist`);
  }
  const missing = await fetch(`${base}this-page-does-not-exist/`);
  assert.equal(missing.status, 404);
  const errorHtml = await missing.text();
  assert.ok(errorHtml.includes('name="robots" content="noindex,follow"') && errorHtml.includes("요청한 페이지를"));
  assert.ok(!errorHtml.includes('rel="canonical"'), "404 does not claim a canonical URL");
  console.log(`PASS ${routes.length} route documents, ${sitemapUrls.length} sitemap URLs, JSON-LD, and 404 response`);

  browser = await chromium.launch({ executablePath: process.env.CHROME_BIN ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noScript.newPage();
  const staticResponse = await staticPage.goto(`${base}company/`, { waitUntil: "domcontentloaded" });
  assert.equal(staticResponse.status(), 200);
  assert.ok((await staticPage.locator("main").innerText()).includes("동성건설은 토목"), "company body is readable without JavaScript");
  assert.equal(await staticPage.locator(".s2-company-intro__body").evaluate(el => getComputedStyle(el).opacity), "1", "pre-rendered content is visible without JavaScript");
  assert.equal(await staticPage.getByRole("navigation", { name: "주요 메뉴" }).getByRole("link", { name: "프로젝트 문의" }).count(), 1, "mobile navigation works without JavaScript");
  for (const size of [{ width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await staticPage.setViewportSize(size);
    await staticPage.goto(`${base}business/`, { waitUntil: "load" });
    await staticPage.getByRole("navigation", { name: "페이지 섹션" }).getByRole("link", { name: /건축/ }).click();
    await staticPage.waitForURL("**/business/#architecture");
    await staticPage.waitForTimeout(1200);
    const visible = await staticPage.evaluate(() => { const rect = document.getElementById("architecture").getBoundingClientRect(); return rect.top >= document.querySelector(".s2-header").getBoundingClientRect().bottom && rect.bottom < innerHeight; });
    assert.equal(visible, true, `${size.width}x${size.height}: no-JS section target is visible below header`);
  }
  await staticPage.setViewportSize({ width: 390, height: 844 });
  await staticPage.goto(`${base}contact/`, { waitUntil: "domcontentloaded" });
  assert.equal(await staticPage.locator(".s2-inquiry-form").isHidden(), true, "contact form is hidden without JavaScript");
  assert.equal(await staticPage.locator(".s2-inquiry-disabled").isVisible(), true, "contact explains that JavaScript is required");
  assert.equal(await staticPage.locator(".s2-inquiry-form input, .s2-inquiry-form textarea, .s2-inquiry-form select, .s2-inquiry-form button").evaluateAll(elements => elements.every(el => el.disabled)), true, "static form controls are disabled even before JavaScript runs");
  await assert.rejects(() => staticPage.locator("#organization").fill("private-test-data", { timeout: 500 }), "a visitor cannot enter data without JavaScript");
  assert.equal(staticPage.url(), `${base}contact/`, "no personal data appears in the URL");
  await staticPage.goto(base, { waitUntil: "domcontentloaded" });
  for (const selector of [".s2-home-hero__controls", ".s2-projects-home__controls", ".s2-footer__body > button"]) {
    assert.equal(await staticPage.locator(selector).isHidden(), true, `JavaScript-only control ${selector} is hidden`);
  }
  await noScript.close();

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const route of routes) {
    const response = await page.goto(localUrl(route), { waitUntil: "domcontentloaded" });
    assert.equal(response.status(), 200);
    await page.locator("#s2-mobile-menu").waitFor({ state: "attached" });
    const heading = (await page.locator("main h1").innerText()).replace(/\s/g, "");
    assert.equal(heading, seoForPath(route).heading.replace(/\s/g, ""), `${route} matches expected page after JavaScript renders`);
  }
  await page.goto(`${base}company/`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "전체 메뉴 열기" }).click();
  await page.locator(".s2-mobile-menu nav > div:nth-child(2) > a").click();
  await page.waitForURL("**/sample_site2/business");
  await page.waitForFunction(() => document.title.startsWith("사업영역"));
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), seoForPath("/business").url, "client navigation updates canonical");
  assert.equal(await page.locator('meta[property="og:url"]').getAttribute("content"), seoForPath("/business").url, "client navigation updates social URL");
  await page.goto(`${base}business/civil/`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.title.startsWith("사업영역"));
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), seoForPath("/business").url, "duplicate route keeps parent canonical");
  await page.goto(`${base}this-page-does-not-exist/`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex,follow");
  await page.getByRole("link", { name: "메인으로 돌아가기" }).click();
  await page.waitForFunction(() => document.title.startsWith("도시의 기반"));
  assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "index,follow", "client navigation restores indexing after 404");
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), siteUrl);
  await context.close();
  console.log("PASS no-JavaScript content/navigation and JavaScript menu, navigation, canonical and 404 recovery");
} finally {
  await browser?.close();
  await new Promise(resolve => http.close(resolve));
}
