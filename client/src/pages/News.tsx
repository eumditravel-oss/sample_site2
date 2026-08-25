import { PageHero, SiteFrame } from "@/components/SiteShell";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function News() {
  usePageMeta("뉴스룸", "동성건설의 공식 공지와 프로젝트 소식을 위한 뉴스룸");
  return (
    <SiteFrame>
      <PageHero index="05" eyebrow="NEWSROOM" title="뉴스룸" description="확인된 기업 소식과 프로젝트 정보를 전달합니다." image="/field-01.jpg" />
      <section className="s2-news-page">
        <header><p>NEWS & NOTICE</p><h2>공식 소식</h2><span>게시물 0</span></header>
        <div className="s2-news-page__empty"><b>NO CONTENT</b><h3>현재 등록된 공지사항이 없습니다.</h3><p>확인되지 않은 일정·수상·프로젝트 소식을 임의로 만들지 않습니다.</p></div>
      </section>
    </SiteFrame>
  );
}
