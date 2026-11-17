import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const dist = path.resolve("dist/public");
if (!existsSync(path.join(dist, "index.html"))) {
  console.error("dist/public 이 없습니다. 먼저 pnpm build 를 실행해 주세요.");
  process.exit(1);
}

const checkFiles = ["sitemap.xml", "rss.xml", "robots.txt", "404.html", "og.png", "favicon.png"];
for (const f of checkFiles) {
  if (!existsSync(path.join(dist, f))) {
    throw new Error(`필수 SEO 산출물 누락: dist/public/${f}`);
  }
}

const sitemap = readFileSync(path.join(dist, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
console.log(`=== (주)동성건설 SEO 산출물 감사 결과 ===`);
console.log(`- sitemap.xml 수록 URL: ${urls.length}개`);
console.log(`- rss.xml 생성 완료: O`);
console.log(`- robots.txt 생성 완료: O`);

const routes = ["", "company", "business", "projects", "quality", "news", "contact", "privacy", "terms", "email-policy"];
for (const r of routes) {
  const htmlPath = r ? path.join(dist, r, "index.html") : path.join(dist, "index.html");
  const html = readFileSync(htmlPath, "utf8");
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
  const h1Count = [...html.matchAll(/<h1[\s>]/g)].length;
  console.log(`  [/${r}] H1=${h1Count} | Title(${title.length}자) | Desc(${desc.length}자) | Robots=${robots}`);
}
