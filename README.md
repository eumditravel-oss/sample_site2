# 동성건설 웹사이트

동성건설의 토목·건축·외부 시설 시공 정보를 소개하는 반응형 웹사이트입니다.

## 실행

```bash
pnpm install
pnpm dev
```

## 검증

```bash
pnpm check
pnpm test
pnpm build
```

## 검색과 정적 페이지

빌드 시 `scripts/prerender.mjs`가 각 경로의 HTML 본문과 메타데이터, `sitemap.xml`, 별도의 404 페이지를 `dist/public`에 생성합니다. 자바스크립트가 없어도 주요 본문과 메뉴를 읽을 수 있습니다. 문의 양식은 자바스크립트가 실행되어야 사용할 수 있습니다.

- 경로를 추가하거나 페이지 내용을 분리하면 `client/src/App.tsx`와 `client/src/config/seo.ts`의 페이지·별칭·제목을 함께 갱신합니다. 같은 내용을 표시하는 별칭은 대표 페이지를 canonical로 사용합니다.
- 실제 도메인이 바뀌면 `siteUrl`, `client/index.html`의 소셜 이미지 주소와 Vite의 배포 기본 경로를 함께 변경해야 합니다. 검증되지 않은 회사 연락처·주소·실적 정보는 추가하지 않습니다.
- 사이트맵 주소는 `https://eumditravel-oss.github.io/sample_site2/sitemap.xml`입니다. 배포 후 소유권이 확인된 Search Console에서 제출할 수 있습니다. GitHub Pages 프로젝트 경로 아래의 `robots.txt`는 도메인 루트의 robots.txt를 대체하지 않으므로 이 프로젝트에서 크롤링 정책을 설정했다고 가정하지 않습니다.
- GitHub Pages 경로로 빌드한 뒤 `node scripts/verify-seo.mjs`로 정적 HTML, 로컬 HTTP 응답 및 브라우저 동작을 검사합니다. Windows Chrome 외의 환경에서는 `CHROME_BIN`으로 브라우저 실행 파일을 지정합니다. 테스트 결과는 검색 색인이나 실제 기기 동작을 보장하지 않습니다.
