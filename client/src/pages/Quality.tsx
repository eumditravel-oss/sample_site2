import { PageHero, Reveal, SectionNav, SiteFrame } from "@/components/SiteShell";
import { usePageMeta } from "@/hooks/usePageMeta";

const standards = [
  { index: "01", label: "QUALITY CONTROL", title: "품질 기준의 일관성", copy: "계획·시공·마감 단계의 확인 항목을 연결해 프로젝트 전 과정에서 동일한 품질 기준을 유지합니다." },
  { index: "02", label: "SAFETY MANAGEMENT", title: "현장 중심의 안전 판단", copy: "작업 환경과 공정 변화에 맞춰 위험요인을 확인하고, 안전을 일정과 품질보다 앞선 기준으로 둡니다." },
  { index: "03", label: "PROCESS REVIEW", title: "공정 간 연결 검토", copy: "개별 공정의 완료보다 다음 공정과의 연결, 사용 환경과의 적합성을 함께 확인합니다." },
];

export default function Quality() {
  usePageMeta("품질·안전", "품질과 안전을 프로젝트 전 과정의 실행 기준으로 삼는 동성건설");
  return (
    <SiteFrame>
      <PageHero index="04" eyebrow="QUALITY" title="품질·안전" description="현장의 기준은 문서가 아니라 매 순간의 판단으로 완성됩니다." image="/field-03.jpg" />
      <SectionNav items={[{ label: "품질관리", href: "/quality" }, { label: "안전관리", href: "/quality/safety" }]} />
      <section className="s2-quality-page">
        <header><p>OUR STANDARD</p><h2>품질과 안전을<br />하나의 실행 체계로.</h2><span>보유 인증이나 수상 내역은 실제 자료가 확인된 후 공개합니다.</span></header>
        <div>{standards.map((item) => <Reveal key={item.index}><span>{item.index}</span><p>{item.label}</p><h3>{item.title}</h3><strong>{item.copy}</strong></Reveal>)}</div>
      </section>
      <section className="s2-quality-principle"><p>RESPONSIBILITY</p><h2>완성도를 만드는 것은<br />보이지 않는 기준의 반복입니다.</h2></section>
    </SiteFrame>
  );
}
