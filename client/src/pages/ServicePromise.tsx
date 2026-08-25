/**
 * Design reference: a focused service promise detail page that separates operating standards from construction scope.
 */
import { PageTitle, SiteFrame, SubNavigation } from "@/components/SiteShell";
import { PromiseList } from "@/components/HomeSections";

export default function ServicePromise() {
  return (
    <SiteFrame>
      <PageTitle title="고객과의 약속" subtitle="OUR PROMISE" crumbs="고객과의 약속" image="/field-03.jpg" />
      <section className="sub-layout">
        <SubNavigation section="services" />
        <article className="sub-content promise-detail-content">
          <div className="promise-area"><p className="content-kicker">OUR PROMISE</p><h3>현장 기준을 명확히<br />안내하겠습니다.</h3><p className="promise-area__intro">상담부터 완료 확인까지, 현장에서 확인한 내용과 다음 진행 기준을 분명하게 공유합니다.</p><PromiseList /></div>
        </article>
      </section>
    </SiteFrame>
  );
}
