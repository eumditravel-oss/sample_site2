import { PageHero, Reveal, SiteFrame } from "@/components/SiteShell";
import { corporateNews } from "@/data/news";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function News() {
  usePageMeta("뉴스룸", "(주)동성건설의 공식 운영 안내, 품질·안전 방침 및 기업 소식을 전하는 뉴스룸");
  const [openId, setOpenId] = useState<string>(corporateNews[0]?.id ?? "");

  return (
    <SiteFrame>
      <PageHero
        index="05"
        eyebrow="NEWSROOM"
        title="뉴스룸"
        description="(주)동성건설의 공식 운영 기준과 프로젝트 안내 소식을 투명하게 전달합니다."
        image="/field-01.jpg"
      />
      <section className="s2-news-page">
        <header>
          <p>OFFICIAL ANNOUNCEMENTS</p>
          <h2>공식 안내 및 소식</h2>
          <span>총 게시물 {corporateNews.length}건 · 확인된 기업 소식만 게시합니다.</span>
        </header>

        <div className="s2-news-list">
          {corporateNews.map((article, index) => {
            const isOpen = openId === article.id;
            return (
              <Reveal key={article.id} className={`s2-news-article ${isOpen ? "is-open" : ""}`}>
                <div className="s2-news-article__head">
                  <div className="s2-news-article__meta">
                    <span className="s2-news-article__num">0{index + 1}</span>
                    <span className="s2-news-badge">{article.category}</span>
                    <time>{article.date}</time>
                  </div>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`news-panel-${article.id}`}
                      onClick={() => setOpenId((prev) => (prev === article.id ? "" : article.id))}
                    >
                      <span>{article.title}</span>
                      <ChevronDown size={20} aria-hidden="true" />
                    </button>
                  </h3>
                  <p className="s2-news-article__summary">{article.summary}</p>
                </div>
                <div id={`news-panel-${article.id}`} className="s2-news-article__body" hidden={!isOpen}>
                  {article.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </SiteFrame>
  );
}
