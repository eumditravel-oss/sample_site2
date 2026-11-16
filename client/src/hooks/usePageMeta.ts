import { useEffect } from "react";
import { useLocation } from "wouter";
import { company } from "@/config/company";
import { seoForPath, structuredData } from "@/config/seo";

export function usePageMeta(title: string, description: string) {
  const [location] = useLocation();
  useEffect(() => {
    const page = seoForPath(location);
    const pageTitle = page?.pageTitle ?? `${title} | ${company.name}`;
    const pageDescription = page?.description ?? description;
    document.title = pageTitle;

    const setMeta = (selector: string, content: string) => {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
    };
    setMeta('meta[name="description"]', pageDescription);
    setMeta('meta[property="og:title"]', pageTitle);
    setMeta('meta[property="og:description"]', pageDescription);
    setMeta('meta[property="og:url"]', page?.url ?? "");
    setMeta('meta[name="twitter:title"]', pageTitle);
    setMeta('meta[name="twitter:description"]', pageDescription);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (page) {
      if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
      canonical.href = page.url;
    } else canonical?.remove();

    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
    robots.content = page ? "index,follow" : "noindex,follow";

    let jsonLd = document.getElementById("seo-structured-data") as HTMLScriptElement | null;
    if (page) {
      if (!jsonLd) { jsonLd = document.createElement("script"); jsonLd.id = "seo-structured-data"; jsonLd.type = "application/ld+json"; document.head.appendChild(jsonLd); }
      jsonLd.textContent = JSON.stringify(structuredData(page));
    } else jsonLd?.remove();
  }, [description, location, title]);
}
