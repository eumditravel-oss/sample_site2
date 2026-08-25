import { useEffect } from "react";
import { company } from "@/config/company";

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const pageTitle = `${title} | ${company.name}`;
    document.title = pageTitle;

    const setMeta = (selector: string, content: string) => {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', pageTitle);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="twitter:title"]', pageTitle);
    setMeta('meta[name="twitter:description"]', description);
  }, [description, title]);
}
