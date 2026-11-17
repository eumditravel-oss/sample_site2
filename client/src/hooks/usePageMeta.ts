import { useEffect } from "react";
import { useLocation } from "wouter";
import { company } from "@/config/company";
import { seoConfig, seoForPath, structuredData } from "@/config/seo";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function usePageMeta(title: string, description: string) {
  const [location] = useLocation();
  useEffect(() => {
    const page = seoForPath(location);
    const pageTitle = page?.pageTitle ?? `${title} | ${company.name}`;
    const pageDescription = page?.description ?? description;
    document.title = pageTitle;

    upsertMeta("name", "description", pageDescription);
    if (page?.keywordString) upsertMeta("name", "keywords", page.keywordString);
    upsertMeta("property", "og:locale", seoConfig.locale);
    upsertMeta("property", "og:site_name", seoConfig.siteName);
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", pageDescription);
    upsertMeta("property", "og:url", page?.url ?? "");
    upsertMeta("property", "og:image", page?.ogImageUrl ?? `${seoConfig.siteUrl}${seoConfig.ogImage}`);
    upsertMeta("property", "og:image:alt", seoConfig.ogImageAlt);
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", pageDescription);
    upsertMeta("name", "twitter:image", page?.ogImageUrl ?? `${seoConfig.siteUrl}${seoConfig.ogImage}`);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (page) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = page.url;
    } else canonical?.remove();

    upsertMeta("name", "robots", page ? page.robots : "noindex,follow");

    let jsonLd = document.getElementById("seo-structured-data") as HTMLScriptElement | null;
    if (page) {
      if (!jsonLd) {
        jsonLd = document.createElement("script");
        jsonLd.id = "seo-structured-data";
        jsonLd.type = "application/ld+json";
        document.head.appendChild(jsonLd);
      }
      jsonLd.textContent = JSON.stringify(structuredData(page));
    } else jsonLd?.remove();
  }, [description, location, title]);
}
