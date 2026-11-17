import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

const output = path.resolve("dist/public");
const template = await readFile(path.join(output, "index.html"), "utf8");
const server = await createServer({ server: { middlewareMode: true }, appType: "custom", mode: "production" });
const escape = (value) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

try {
  const [
    { default: App },
    { seoConfig, seoPages, seoAliases, seoForPath, indexableRoutes, structuredData, siteUrl },
    { corporateNews },
  ] = await Promise.all([
    server.ssrLoadModule("/src/App.tsx"),
    server.ssrLoadModule("/src/config/seo.ts"),
    server.ssrLoadModule("/src/data/news.ts"),
  ]);

  const base = server.config.base.replace(/\/$/, "");
  const routes = [...Object.keys(seoPages), ...Object.keys(seoAliases)];

  function verificationTags() {
    const tags = [];
    if (seoConfig.verification.naver) {
      tags.push(`<meta name="naver-site-verification" content="${escape(seoConfig.verification.naver)}" />`);
    }
    if (seoConfig.verification.google) {
      tags.push(`<meta name="google-site-verification" content="${escape(seoConfig.verification.google)}" />`);
    }
    if (seoConfig.verification.bing) {
      tags.push(`<meta name="msvalidate.01" content="${escape(seoConfig.verification.bing)}" />`);
    }
    return tags.join("\n    ");
  }

  function htmlFor(route, page) {
    const fullPath = route === "/" ? `${base}/` : `${base}${route}/`;
    const body = renderToString(React.createElement(App, { ssrPath: fullPath }));
    if (!body.includes("<h1") || !body.includes("<main")) throw new Error(`Missing main content for ${route}`);
    const h1 = body
      .match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]
      ?.replace(/<[^>]*>/g, "")
      .replace(/\s/g, "");
    const expectedHeading = (page?.heading ?? "요청한 페이지를 찾을 수 없습니다.").replace(/\s/g, "");
    if (h1 !== expectedHeading) throw new Error(`Wrong page content for ${route}: ${h1} != ${expectedHeading}`);

    const title = page?.pageTitle ?? `페이지를 찾을 수 없습니다 | ${seoConfig.siteName}`;
    const description = page?.description ?? "요청한 페이지가 존재하지 않습니다.";
    const keywords = page?.keywordString ?? seoConfig.defaultKeywords.join(", ");
    const ogImageUrl = page?.ogImageUrl ?? `${siteUrl}${seoConfig.ogImage}`;
    const tag = (selector, value, html) =>
      html.replace(new RegExp(`(<meta ${selector} content=")[^"]*("\\s*/>)`), `$1${escape(value)}$2`);

    let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`);
    html = tag('name="description"', description, html);
    html = tag('name="keywords"', keywords, html);
    html = tag('property="og:title"', title, html);
    html = tag('property="og:description"', description, html);
    html = tag('property="og:url"', page?.url ?? "", html);
    html = tag('property="og:image"', ogImageUrl, html);
    html = tag('name="twitter:title"', title, html);
    html = tag('name="twitter:description"', description, html);
    html = tag('name="twitter:image"', ogImageUrl, html);
    html = html.replace(
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      page ? `<link rel="canonical" href="${escape(page.url)}" />` : "",
    );
    html = html.replace(
      /<link rel="alternate" hreflang="ko" href="[^"]*"\s*\/>/,
      page ? `<link rel="alternate" hreflang="ko" href="${escape(page.url)}" />` : "",
    );

    const robotsValue = page ? page.robots : "noindex,follow";
    const jsonLd = page
      ? `<script id="seo-structured-data" type="application/ld+json">${JSON.stringify(structuredData(page)).replaceAll("<", "\\u003c")}</script>`
      : "";
    const verifyMeta = verificationTags();

    html = html.replace(
      "</head>",
      `${verifyMeta ? `${verifyMeta}\n    ` : ""}<meta name="robots" content="${robotsValue}" />\n    ${jsonLd}\n  </head>`,
    );
    if (!html.includes('<div id="root"></div>')) throw new Error("Root placeholder is missing from the Vite build");
    return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  }

  for (const route of routes) {
    if (!/^\/(?:[a-z0-9-]+\/?)*$/.test(route)) throw new Error(`Unsafe route: ${route}`);
    const directory = route === "/" ? output : path.join(output, route.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), htmlFor(route, seoForPath(route)));
  }

  await writeFile(path.join(output, "404.html"), htmlFor("/404", null));
  await writeFile(path.join(output, ".nojekyll"), "", "utf8");

  // 1. Sitemap XML (canonical & indexable business pages only, with lastmod/changefreq/priority)
  const sitemapEntries = indexableRoutes()
    .map((route) => {
      const p = seoForPath(route);
      return [
        "  <url>",
        `    <loc>${escape(p.url)}</loc>`,
        `    <lastmod>${seoConfig.lastModified}</lastmod>`,
        `    <changefreq>${p.changefreq}</changefreq>`,
        `    <priority>${p.priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");
  await writeFile(
    path.join(output, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`,
  );

  // 2. RSS 2.0 Feed (for Naver Search Advisor & Feed readers)
  const pubDate = new Date(`${seoConfig.lastModified}T09:00:00+09:00`).toUTCString();
  const pageRssItems = indexableRoutes().map((route) => {
    const p = seoForPath(route);
    return [
      "    <item>",
      `      <title>${escape(p.pageTitle)}</title>`,
      `      <link>${escape(p.url)}</link>`,
      `      <guid isPermaLink="true">${escape(p.url)}</guid>`,
      `      <description>${escape(p.description)}</description>`,
      `      <pubDate>${pubDate}</pubDate>`,
      "    </item>",
    ].join("\n");
  });
  const newsRssItems = corporateNews.map((item) => {
    const newsUrl = `${siteUrl}news/#${item.id}`;
    return [
      "    <item>",
      `      <title>${escape(`[${item.category}] ${item.title} | ${seoConfig.siteName}`)}</title>`,
      `      <link>${escape(newsUrl)}</link>`,
      `      <guid isPermaLink="false">${escape(`dongseong-news-${item.id}`)}</guid>`,
      `      <description>${escape(item.summary)}</description>`,
      `      <pubDate>${pubDate}</pubDate>`,
      "    </item>",
    ].join("\n");
  });
  const rssXml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    `  <channel>`,
    `    <title>${escape(seoConfig.siteName)} 공식 웹사이트</title>`,
    `    <link>${escape(siteUrl)}</link>`,
    `    <description>${escape(seoForPath("/").description)}</description>`,
    `    <language>ko</language>`,
    `    <lastBuildDate>${pubDate}</lastBuildDate>`,
    `    <atom:link href="${escape(`${siteUrl}rss.xml`)}" rel="self" type="application/rss+xml" />`,
    ...pageRssItems,
    ...newsRssItems,
    `  </channel>`,
    `</rss>\n`,
  ].join("\n");
  await writeFile(path.join(output, "rss.xml"), rssXml);

  // 3. robots.txt (Ready for root domain connection; explicitly welcomes Naver Yeti & Googlebot)
  const robotsTxt = [
    "# robots.txt for (주)동성건설",
    "# Note: Active when deployed at a verified root domain.",
    "User-agent: *",
    "Allow: /",
    "Disallow: /404.html",
    "",
    "User-agent: Yeti",
    "Allow: /",
    "",
    "User-agent: Googlebot",
    "Allow: /",
    "",
    `Sitemap: ${siteUrl}sitemap.xml`,
    "",
  ].join("\n");
  await writeFile(path.join(output, "robots.txt"), robotsTxt);

  console.log(
    `Generated ${routes.length} route pages, a noindex 404 page, ${indexableRoutes().length} sitemap URLs, rss.xml, and robots.txt.`,
  );
} finally {
  await server.close();
}
