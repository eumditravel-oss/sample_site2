/**
 * Design reference: spacious visual archive displaying replaceable project images in an orderly card grid.
 */
import { PageTitle, SiteFrame, SubNavigation } from "@/components/SiteShell";
import { assetPath } from "@/lib/assets";

const workItems = [
  ["보행로 정비", "/field-01.jpg"],
  ["경계 구조 시공", "/field-02.jpg"],
  ["블록 포장 공정", "/field-03.jpg"],
  ["기반 시설 정비", "/field-01.jpg"],
  ["외부 공간 마감", "/field-02.jpg"],
  ["완료 현장 기록", "/field-03.jpg"],
];

export default function Gallery() {
  return (
    <SiteFrame>
      <PageTitle title="기술 소개" subtitle="TECHNICAL ARCHIVE" image="/field-03.jpg" />
      <section className="sub-layout">
        <SubNavigation section="gallery" />
        <article className="sub-content gallery-content">
          <p className="gallery-content__intro">동성건설의 시공 결과와 현장 기록을 모은 기술 아카이브입니다. 공정과 마감의 디테일을 투명하게 공유합니다.</p>
          <div className="gallery-grid">{workItems.map(([title, image], index) => <article className="gallery-grid__item" key={`${title}-${index}`}><div><img src={assetPath(image)} alt={`${title} 예시 사진`} /></div><h2>{title}</h2><p>2026.08.{String(18 - index).padStart(2, "0")}</p></article>)}</div>
          <div className="pagination"><button type="button" className="is-active">1</button><button type="button">2</button></div>
        </article>
      </section>
    </SiteFrame>
  );
}
