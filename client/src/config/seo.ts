import { company } from "./company";

// Public GitHub Pages project URL. Change this when the site gets a verified domain.
export const siteUrl = "https://eumditravel-oss.github.io/sample_site2/";

export const seoPages: Record<string, { title: string; description: string; heading: string }> = {
  "/": { title: "도시의 기반을 구축하는 건설사", description: "프로젝트·엔지니어링·현장관리 중심의 동성건설 기업 웹사이트", heading: "도시를 움직이는 기반을 구축합니다." },
  "/company": { title: "기업정보", description: "프로젝트의 목적을 시공의 기준으로 전환하는 동성건설의 기업 방향", heading: "기업정보" },
  "/business": { title: "사업영역", description: "토목·건축·외부시설을 프로젝트 단위로 연결하는 동성건설의 사업영역", heading: "사업영역" },
  "/projects": { title: "프로젝트", description: "실제 프로젝트 정보 등록을 준비 중인 동성건설 프로젝트 아카이브", heading: "프로젝트" },
  "/quality": { title: "품질·안전", description: "품질과 안전을 프로젝트 전 과정의 실행 기준으로 삼는 동성건설", heading: "품질·안전" },
  "/news": { title: "뉴스룸", description: "동성건설의 확인된 공지와 프로젝트 소식을 위한 뉴스룸", heading: "뉴스룸" },
  "/contact": { title: "프로젝트 문의", description: "프로젝트 조건을 정리해 이메일 문의 초안을 만드는 동성건설 문의 페이지", heading: "프로젝트 문의" },
  "/privacy": { title: "개인정보 처리 안내", description: "동성건설 프로젝트 문의 페이지의 개인정보 처리 방식 안내", heading: "개인정보 처리 안내" },
};

// These routes currently render the same content as the parent. Keep them
// available to visitors but consolidate indexing until they have unique content.
export const seoAliases: Record<string, string> = {
  "/company/philosophy": "/company",
  "/business/civil": "/business",
  "/business/architecture": "/business",
  "/business/field": "/business",
  "/quality/safety": "/quality",
  "/services": "/business",
  "/services/scope": "/business",
  "/services/promise": "/quality",
  "/gallery": "/projects",
  "/consultation": "/contact",
  "/consultation/list": "/contact",
  "/notices": "/news",
  "/notices/pre-check": "/quality",
  "/location": "/contact",
};

export function seoForPath(path: string) {
  const normalized = path.replace(/\/+$/, "") || "/";
  const canonicalPath = seoAliases[normalized] ?? normalized;
  const page = seoPages[canonicalPath];
  if (!page) return null;
  const url = canonicalPath === "/" ? siteUrl : `${siteUrl}${canonicalPath.slice(1)}/`;
  return { ...page, canonicalPath, url, pageTitle: `${page.title} | ${company.name}` };
}

export function structuredData(page: NonNullable<ReturnType<typeof seoForPath>>) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${siteUrl}#website`, name: company.name, url: siteUrl, inLanguage: "ko" },
      { "@type": "WebPage", "@id": `${page.url}#webpage`, url: page.url, name: page.pageTitle, description: page.description, isPartOf: { "@id": `${siteUrl}#website` }, inLanguage: "ko" },
    ],
  };
}
