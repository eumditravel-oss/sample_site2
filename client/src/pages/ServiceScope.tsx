/**
 * Design reference: a focused contractor service-scope detail page with field imagery and practical work definitions.
 */
import { ChevronRight } from "lucide-react";
import { PageTitle, SiteFrame, SubNavigation } from "@/components/SiteShell";

const services = [
  ["경계 구조 시공", "도로 경계, 보차도 구분, 녹지 경계 등 현장 조건에 맞춰 시공 범위와 동선을 검토합니다."],
  ["보행로·블록 정비", "통행 안전과 배수 흐름을 고려해 포장 상태를 점검하고 필요한 보수 공정을 안내합니다."],
  ["시설물 보수", "파손되거나 단차가 생긴 외부 시설물을 확인하고, 안전한 사용 환경을 위한 정비 방향을 제안합니다."],
  ["부대 공정", "관로 주변 정리, 마감 보수, 현장 여건에 따른 보조 공정을 함께 검토합니다."],
];

export default function ServiceScope() {
  return (
    <SiteFrame>
      <PageTitle title="공정 범위" subtitle="SERVICE SCOPE" crumbs="공정 범위" image="/field-02.jpg" />
      <section className="sub-layout">
        <SubNavigation section="services" />
        <article className="sub-content service-content">
          <div className="service-lead"><p className="content-kicker">SERVICE SCOPE</p><h2>공정별 필요한 내용을<br /><em>한눈에 안내합니다.</em></h2><p>현장 조건과 작업 동선을 함께 검토해 필요한 시공 범위와 진행 기준을 정리합니다.</p></div>
          <div className="service-list">{services.map(([name, description], index) => <section key={name} className="service-list__item"><span>0{index + 1}</span><div><h3>{name}</h3><p>{description}</p></div><ChevronRight size={20} /></section>)}</div>
        </article>
      </section>
    </SiteFrame>
  );
}
