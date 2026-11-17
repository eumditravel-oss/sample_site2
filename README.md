# (주)동성건설 공식 웹사이트

(주)동성건설의 토목·건축·외부 인프라 통합 엔지니어링 시공 역량을 소개하는 반응형 기업 웹사이트입니다.

## 실행

```bash
pnpm install
pnpm dev
```

## 검증 및 빌드

```bash
pnpm check
pnpm test
pnpm build
pnpm seo:audit
```

## 웹사이트 내 SEO 관리 및 정적 프리렌더링 구조

- **중앙 집중형 SEO 설정 (`client/src/config/seo.ts`)**: 정식 도메인(`siteUrl`), 검색엔진 웹마스터 소유권 인증 코드(`verification.naver`, `verification.google`, `verification.bing`), 기본 키워드, 소셜 미리보기 이미지(`og.png`), 페이지별 제목·설명·키워드·색인 여부(`indexable`)를 이 파일 한 곳에서 일괄 관리합니다.
- **웹사이트 내 실시간 SEO 인스펙터 (`?seo=1`)**: 웹사이트 어느 페이지에서든 URL 뒤에 `?seo=1`을 붙여 접속하면 우측 하단에 **실시간 SEO 진단 인스펙터 패널**이 열립니다(세션 유지, `?seo=0` 또는 닫기 버튼으로 해제). 일반 방문자나 검색 로봇에게는 렌더링되지 않으며, 검색결과(SERP) 미리보기, 제목·설명 글자 수, H1 유일성, 이미지 `alt` 누락 여부, JSON-LD 스키마, `sitemap.xml` / `rss.xml` / `robots.txt` 바로 열기·복사 기능을 제공합니다.
- **자동 생성 산출물 (`scripts/prerender.mjs`)**: 빌드 시 24개 라우트 문서의 정적 HTML, 페이지별 메타데이터, 4종 `@graph` JSON-LD(`GeneralContractor`, `WebSite`, `WebPage`, `BreadcrumbList`), `sitemap.xml`(색인 대상 7개 대표 비즈니스 페이지), `rss.xml`(네이버 서치어드바이저 제출용 RSS 2.0 피드), `robots.txt`, `404.html`을 `dist/public`에 자동 생성합니다. 법적 고지 페이지(`/privacy`, `/terms`, `/email-policy`)는 자동으로 `noindex,follow` 처리되어 핵심 비즈니스 페이지 위주로 검색 노출이 집중됩니다.
- **기업 식별정보 연동 (`client/src/config/company.ts`)**: 검증되지 않은 회사 연락처·주소·실적 정보는 임의로 표기하지 않으며, 의뢰인 자료 확정 시 `company.ts`에 입력하면 UI와 JSON-LD 구조화 데이터에 동시에 자동 반영됩니다.
- **SEO 및 브라우저 자동 검수 (`scripts/verify-seo.mjs`)**: GitHub Pages 경로로 빌드한 뒤 정적 HTML, 로컬 HTTP 응답, 무자바스크립트(No-JS) 본문/내비게이션, 모바일 메뉴, canonical, 404 복구 및 `?seo=1` 인스펙터 동작을 자동 검증합니다. (참고: GitHub Pages 서브경로 배포 환경에서는 루트 도메인 연결 전까지 도메인 루트의 `robots.txt`가 우선 적용되며, 정식 루트 도메인 연결 시 생성된 `robots.txt`가 즉시 작동합니다.)
