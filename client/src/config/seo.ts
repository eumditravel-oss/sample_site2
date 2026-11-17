import { company } from "./company";

/**
 * ============================================================================
 * [중앙 집중형 SEO 관리 설정 파일 — (주)동성건설]
 * 정식 도메인 연결, 검색엔진(네이버·구글·Bing) 소유권 인증 코드 등록,
 * 페이지별 검색 제목·설명·키워드·색인 여부 수정은 모두 이 파일 한 곳에서 관리합니다.
 * 웹사이트 접속 주소 뒤에 `?seo=1`을 붙이면 화면 내 [SEO 진단 패널]이 열립니다.
 * ============================================================================
 */
export const seoConfig = {
  // 정식 도메인 연결 시 아래 주소만 변경하면 전체 canonical, sitemap.xml, rss.xml, robots.txt가 일괄 갱신됩니다.
  siteUrl: "https://eumditravel-oss.github.io/sample_site2/",
  siteName: company.name,
  locale: "ko_KR",
  language: "ko",
  lastModified: "2026-11-17",
  ogImage: "og.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "(주)동성건설 — 토목·건축·외부인프라 통합 엔지니어링 파트너",
  defaultKeywords: [
    "동성건설",
    "(주)동성건설",
    "종합건설",
    "토목공사",
    "건축시공",
    "도로교량시공",
    "부지조성공사",
    "산업시설건축",
    "물류센터시공",
    "외부인프라",
  ],
  // 검색엔진 웹마스터 도구 소유권 확인 메타태그 코드 (발급받은 content 값만 입력하면 전 페이지 <head>에 자동 삽입)
  verification: {
    naver: null as string | null, // 예: "a1b2c3d4e5f6..." (네이버 서치어드바이저)
    google: null as string | null, // 예: "xyz123..." (Google Search Console)
    bing: null as string | null, // 예: "123ABC..." (Bing Webmaster Tools)
  },
} as const;

export const siteUrl = seoConfig.siteUrl;

export type SeoPageEntry = {
  title: string;
  description: string;
  keywords: string[];
  heading: string;
  breadcrumb: string;
  indexable: boolean;
  priority: string;
  changefreq: "weekly" | "monthly" | "yearly";
};

export const seoPages: Record<string, SeoPageEntry> = {
  "/": {
    title: "도시의 기반과 건축의 가치를 완성하는 종합건설 파트너",
    description:
      "(주)동성건설 공식 웹사이트입니다. 도로·교량·부지조성 토목사업부터 업무·스마트 물류 건축, 외부 인프라까지 통합 엔지니어링 체계로 책임 시공합니다.",
    keywords: ["동성건설", "(주)동성건설", "토목건축", "종합건설사", "인프라시공", "건축시공"],
    heading: "도시를 움직이는 기반을 구축합니다.",
    breadcrumb: "홈",
    indexable: true,
    priority: "1.0",
    changefreq: "weekly",
  },
  "/company": {
    title: "기업정보 및 경영철학",
    description:
      "토목·건축·외부시설을 하나의 통합 프로젝트 관점으로 수행하는 (주)동성건설의 기업 개요, 3대 경영철학 및 4단계 프로젝트 수행 절차를 소개합니다.",
    keywords: ["동성건설 기업정보", "동성건설 회사소개", "건설사 경영철학", "프로젝트 수행체계"],
    heading: "기업정보",
    breadcrumb: "기업정보",
    indexable: true,
    priority: "0.9",
    changefreq: "monthly",
  },
  "/business": {
    title: "사업영역 — 토목 · 건축 · 외부인프라",
    description:
      "광역 도로·부지조성 토목공사, 사옥·연구시설·스마트 물류센터 건축공사, 단지 외부광장·부대토목까지 (주)동성건설의 3대 핵심 사업영역을 확인하세요.",
    keywords: ["토목사업", "건축사업", "부지조성", "물류센터건축", "공장신축", "부대토목"],
    heading: "사업영역",
    breadcrumb: "사업영역",
    indexable: true,
    priority: "0.9",
    changefreq: "monthly",
  },
  "/projects": {
    title: "프로젝트 및 공종별 수행역량 아카이브",
    description:
      "(주)동성건설의 도로·교량 인프라, 산업·택지 부지조성, 업무복합시설, 스마트 물류시설 등 주요 공종별 기술 범위와 품질 검측 기준을 안내합니다.",
    keywords: ["동성건설 프로젝트", "토목시공역량", "건축포트폴리오", "산업시설시공", "구조물검측"],
    heading: "프로젝트",
    breadcrumb: "프로젝트",
    indexable: true,
    priority: "0.8",
    changefreq: "monthly",
  },
  "/quality": {
    title: "품질·안전 경영 시스템 (QHSE)",
    description:
      "착공 전 도서 정합성 검토, 반입 자재 검수, 공정별 필수 입회 검측(Hold Point) 및 현장 안전보건 5대 원칙을 실천하는 (주)동성건설의 품질·안전 기준입니다.",
    keywords: ["건설품질관리", "안전보건경영", "위험성평가", "현장안전원칙", "동성건설 품질안전"],
    heading: "품질·안전",
    breadcrumb: "품질·안전",
    indexable: true,
    priority: "0.8",
    changefreq: "monthly",
  },
  "/news": {
    title: "뉴스룸 · 공식 안내 및 소식",
    description:
      "(주)동성건설의 공식 웹사이트 운영 기준, 프로젝트 사전 검토 안내 및 안전보건 경영방침 등 확인된 기업 소식을 전달합니다.",
    keywords: ["동성건설 소식", "동성건설 공지사항", "프로젝트 검토 안내"],
    heading: "뉴스룸",
    breadcrumb: "뉴스룸",
    indexable: true,
    priority: "0.7",
    changefreq: "weekly",
  },
  "/contact": {
    title: "프로젝트 문의 및 사전 기술 검토 신청",
    description:
      "토목·건축·외부인프라 프로젝트의 사업지 위치, 예정 공종, 희망 착공 시기를 정리해 안전하게 문의 초안을 작성할 수 있는 (주)동성건설 문의 창구입니다.",
    keywords: ["동성건설 문의", "공사견적문의", "토목건축상담", "프로젝트 기술검토"],
    heading: "프로젝트 문의",
    breadcrumb: "프로젝트 문의",
    indexable: true,
    priority: "0.8",
    changefreq: "monthly",
  },
  "/privacy": {
    title: "개인정보처리방침",
    description: "개인정보 보호법 제30조에 따른 (주)동성건설 공식 웹사이트 개인정보처리방침 법정 고시 안내입니다.",
    keywords: ["동성건설 개인정보처리방침"],
    heading: "개인정보처리방침",
    breadcrumb: "개인정보처리방침",
    indexable: false,
    priority: "0.3",
    changefreq: "yearly",
  },
  "/terms": {
    title: "이용약관",
    description: "(주)동성건설 공식 웹사이트 서비스 이용 조건 및 권리·책임에 관한 이용약관 고시입니다.",
    keywords: ["동성건설 이용약관"],
    heading: "이용약관",
    breadcrumb: "이용약관",
    indexable: false,
    priority: "0.3",
    changefreq: "yearly",
  },
  "/email-policy": {
    title: "이메일무단수집거부",
    description: "정보통신망법에 따른 (주)동성건설 웹사이트 이메일 주소 무단수집 거부 공식 고지입니다.",
    keywords: ["이메일무단수집거부"],
    heading: "이메일무단수집거부",
    breadcrumb: "이메일무단수집거부",
    indexable: false,
    priority: "0.3",
    changefreq: "yearly",
  },
};

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
  const isAlias = normalized !== canonicalPath;
  const url = canonicalPath === "/" ? siteUrl : `${siteUrl}${canonicalPath.slice(1)}/`;
  const ogImageUrl = `${siteUrl}${seoConfig.ogImage}`;
  const robots = page.indexable && !isAlias ? "index,follow,max-image-preview:large,max-snippet:-1" : page.indexable ? "index,follow" : "noindex,follow";
  return {
    ...page,
    routePath: normalized,
    canonicalPath,
    url,
    ogImageUrl,
    robots,
    keywordString: Array.from(new Set([...page.keywords, ...seoConfig.defaultKeywords])).join(", "),
    pageTitle: `${page.title} | ${company.name}`,
  };
}

export function indexableRoutes() {
  return Object.entries(seoPages)
    .filter(([, entry]) => entry.indexable)
    .map(([route]) => route);
}

export function structuredData(page: NonNullable<ReturnType<typeof seoForPath>>) {
  const orgId = `${siteUrl}#organization`;
  const siteId = `${siteUrl}#website`;

  const orgNode: Record<string, unknown> = {
    "@type": "GeneralContractor",
    "@id": orgId,
    name: company.name,
    legalName: company.legalName,
    alternateName: company.nameEn,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}dongseong-logo.svg`,
    },
    image: page.ogImageUrl,
    knowsAbout: [
      "토목공사 (도로·교량·부지조성·옹벽·관로)",
      "건축공사 (업무·연구시설·스마트 물류센터·제조공장)",
      "외부인프라 및 시설물 성능개선 시공",
    ],
  };

  if (company.phone) orgNode.telephone = company.phone;
  if (company.email) orgNode.email = company.email;
  if (company.ceo) orgNode.founder = company.ceo;
  if (company.businessNumber) orgNode.taxID = company.businessNumber;
  if (company.address) {
    orgNode.address = {
      "@type": "PostalAddress",
      streetAddress: company.address,
      addressCountry: "KR",
    };
  }

  const breadcrumbItems: Array<{ "@type": string; position: number; name: string; item: string }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "홈",
      item: siteUrl,
    },
  ];
  if (page.canonicalPath !== "/") {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: page.breadcrumb,
      item: page.url,
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      orgNode,
      {
        "@type": "WebSite",
        "@id": siteId,
        name: company.name,
        alternateName: company.nameEn,
        url: siteUrl,
        publisher: { "@id": orgId },
        inLanguage: "ko-KR",
      },
      {
        "@type": "WebPage",
        "@id": `${page.url}#webpage`,
        url: page.url,
        name: page.pageTitle,
        description: page.description,
        isPartOf: { "@id": siteId },
        about: { "@id": orgId },
        breadcrumb: { "@id": `${page.url}#breadcrumb` },
        inLanguage: "ko-KR",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${page.url}#breadcrumb`,
        itemListElement: breadcrumbItems,
      },
    ],
  };
}
