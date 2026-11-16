import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

const output = path.resolve("dist/public");
const template = await readFile(path.join(output, "index.html"), "utf8");
const server = await createServer({ server: { middlewareMode: true }, appType: "custom", mode: "production" });
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

try {
  const [{ default: App }, { seoPages, seoAliases, seoForPath, structuredData }] = await Promise.all([
    server.ssrLoadModule("/src/App.tsx"), server.ssrLoadModule("/src/config/seo.ts"),
  ]);
  const base = server.config.base.replace(/\/$/, "");
  const routes = [...Object.keys(seoPages), ...Object.keys(seoAliases)];

  function htmlFor(route, page) {
    const fullPath = route === "/" ? `${base}/` : `${base}${route}/`;
    const body = renderToString(React.createElement(App, { ssrPath: fullPath }));
    if (!body.includes("<h1") || !body.includes("<main")) throw new Error(`Missing main content for ${route}`);
    const h1 = body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]*>/g, "").replace(/\s/g, "");
    const expectedHeading = (page?.heading ?? "요청한 페이지를 찾을 수 없습니다.").replace(/\s/g, "");
    if (h1 !== expectedHeading) throw new Error(`Wrong page content for ${route}: ${h1} != ${expectedHeading}`);
    const title = page?.pageTitle ?? "페이지를 찾을 수 없습니다 | 동성건설(주)";
    const description = page?.description ?? "요청한 페이지가 존재하지 않습니다.";
    const tag = (selector, value, html) => html.replace(new RegExp(`(<meta ${selector} content=")[^"]*("\\s*/>)`), `$1${escape(value)}$2`);
    let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`);
    html = tag('name="description"', description, html);
    html = tag('property="og:title"', title, html);
    html = tag('property="og:description"', description, html);
    html = tag('property="og:url"', page?.url ?? "", html);
    html = tag('name="twitter:title"', title, html);
    html = tag('name="twitter:description"', description, html);
    html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, page ? `<link rel="canonical" href="${escape(page.url)}" />` : "");
    const jsonLd = page ? `<script id="seo-structured-data" type="application/ld+json">${JSON.stringify(structuredData(page)).replaceAll("<", "\\u003c")}</script>` : "";
    html = html.replace("</head>", `<meta name="robots" content="${page ? "index,follow" : "noindex,follow"}" />\n    ${jsonLd}\n  </head>`);
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
  const urls = Object.keys(seoPages).map((route) => `  <url><loc>${escape(seoForPath(route).url)}</loc></url>`).join("\n");
  await writeFile(path.join(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  console.log(`Generated ${routes.length} route pages, a noindex 404 page, and ${Object.keys(seoPages).length} sitemap URLs.`);
} finally {
  await server.close();
}
