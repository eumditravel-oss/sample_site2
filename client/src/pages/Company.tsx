import { PageHero, Reveal, SectionNav, SiteFrame } from "@/components/SiteShell";
import { usePageMeta } from "@/hooks/usePageMeta";
import { assetPath } from "@/lib/assets";

export default function Company() {
  usePageMeta("기업정보", "프로젝트의 목적을 시공의 기준으로 전환하는 동성건설의 기업 방향");
  return (
    <SiteFrame>
      <PageHero index="01" eyebrow="COMPANY" title="기업정보" description="프로젝트의 목적을 이해하고 현장의 완성도를 높입니다." image="/field-01.jpg" />
      <SectionNav items={[{ label: "회사소개", href: "/company" }, { label: "경영철학", href: "/company/philosophy" }]} />
      <section className="s2-company-intro">
        <Reveal className="s2-company-intro__statement"><p>DONGSEONG CONSTRUCTION</p><h2>도시의 기반을 구축하고,<br /><em>프로젝트의 완성도</em>를 높입니다.</h2></Reveal>
        <Reveal className="s2-company-intro__body"><span>ABOUT US</span><div><p>동성건설은 토목·건축·외부시설 영역을 프로젝트 관점에서 바라봅니다. 계획과 시공, 품질과 안전이 분리되지 않도록 현장의 조건과 실행 기준을 연결합니다.</p><p>보여주기 위한 수식보다 확인 가능한 과정, 임의의 실적보다 실제로 공개할 수 있는 정보만을 기준으로 기업의 신뢰를 쌓아갑니다.</p></div></Reveal>
      </section>
      <section className="s2-company-editorial">
        <figure><img src={assetPath("field-02.jpg")} alt="건축 도면을 검토하는 현장 이미지" /></figure>
        <Reveal><span>01 / PRECISION</span><h3>정확한 판단이<br />현장의 차이를 만듭니다.</h3><p>프로젝트의 조건과 공정 간 연결을 먼저 확인하고, 실행 가능한 기준으로 정리합니다.</p></Reveal>
      </section>
      <section className="s2-philosophy" id="philosophy">
        <header><p>MANAGEMENT PHILOSOPHY</p><h2>책임은 결과가 아니라<br />전 과정의 태도입니다.</h2></header>
        <div>
          <Reveal><span>01</span><h3>PROJECT FIRST</h3><p>프로젝트의 목적과 사용 환경을 판단의 출발점으로 삼습니다.</p></Reveal>
          <Reveal><span>02</span><h3>FIELD PRECISION</h3><p>현장의 변수와 공정의 연결을 세밀하게 관리합니다.</p></Reveal>
          <Reveal><span>03</span><h3>RESPONSIBLE DELIVERY</h3><p>품질과 안전, 마감에 대한 책임을 프로젝트 종료까지 이어갑니다.</p></Reveal>
        </div>
      </section>
    </SiteFrame>
  );
}
