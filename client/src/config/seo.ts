import { company } from "./company";

// Public GitHub Pages project URL. Change this when the site gets a verified domain.
export const siteUrl = "https://eumditravel-oss.github.io/sample_site2/";

export const seoPages: Record<string, { title: string; description: string; heading: string }> = {
  "/": {
    title: "도시의 기반과 건축의 가치를 완성하는 종합건설 파트너",
    description: "토목·건축·외부 인프라를 통합 엔지니어링 체계로 수행하는 (주)동성건설 공식 웹사이트",
    heading: "도시를 움직이는 기반을 구축합니다.",
  },
  "/company": {
    title: "기업정보",
    description: "프로젝트의 목적을 정교한 시공 기준으로 전환하는 (주)동성건설의 기업 개요와 경영철학",
    heading: "기업정보",
  },
  "/business": {
    title: "사업영역",
    description: "토목·건축·외부 인프라를 하나의 실행 체계로 연결하는 (주)동성건설의 핵심 사업영역",
    heading: "사업영역",
  },
  "/projects": {
    title: "프로젝트 및 수행역량",
    description: "공종별 핵심 기술 기준과 수행 체계를 소개하는 (주)동성건설 프로젝트 아카이브",
    heading: "프로젝트",
  },
  "/quality": {
    title: "품질·안전 경영",
    description: "전 과정 검측 시스템과 현장 중심 안전보건 원칙을 실천하는 (주)동성건설 품질·안전 체계",
    heading: "품질·안전",
  },
  "/news": {
    title: "뉴스룸",
    description: "(주)동성건설의 공식 운영 안내, 품질·안전 방침 및 기업 소식을 전하는 뉴스룸",
    heading: "뉴스룸",
  },
  "/contact": {
    title: "프로젝트 문의",
    description: "토목·건축·외부시설 프로젝트 검토를 위한 사전 조건 정리 및 문의 안내 페이지",
    heading: "프로젝트 문의",
  },
  "/privacy": {
    title: "개인정보처리방침",
    description: "개인정보 보호법 제30조에 따른 (주)동성건설 웹사이트 개인정보처리방침 고시",
    heading: "개인정보처리방침",
  },
  "/terms": {
    title: "이용약관",
    description: "(주)동성건설 웹사이트 서비스 이용 조건 및 권리·책임에 관한 이용약관",
    heading: "이용약관",
  },
  "/email-policy": {
    title: "이메일무단수집거부",
    description: "정보통신망법에 따른 (주)동성건설 웹사이트 이메일 주소 무단수집 거부 고지",
    heading: "이메일무단수집거부",
  },
};

// Consolidate duplicate/legacy paths to canonical pages for clean SEO indexing.
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
      {
        "@type": "WebPage",
        "@id": `${page.url}#webpage`,
        url: page.url,
        name: page.pageTitle,
        description: page.description,
        isPartOf: { "@id": `${siteUrl}#website` },
        inLanguage: "ko",
      },
    ],
  };
}
