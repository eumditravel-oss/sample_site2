import { PageHero, Reveal, SectionNav, SiteFrame } from "@/components/SiteShell";
import { company } from "@/config/company";
import { usePageMeta } from "@/hooks/usePageMeta";
import { assetPath } from "@/lib/assets";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

const executionGovernance = [
  {
    step: "PHASE 01",
    title: "타당성 및 도서 정합성 검토",
    detail: "지반 여건, 인허가·대지 경계, 구조·설비 도면 간 간섭 요소를 착공 전 면밀히 검토하여 설계 변경 리스크를 줄입니다.",
  },
  {
    step: "PHASE 02",
    title: "표준 공정표 및 안전계획 수립",
    detail: "공종별 선후행 작업과 자재 수급 일정, 중장비 동선 및 위험성평가를 반영한 실행 공정표를 수립합니다.",
  },
  {
    step: "PHASE 03",
    title: "정밀 시공 및 단계별 입회 검측",
    detail: "기초·골조·관로·외장 등 핵심 공정마다 시방 기준 충족 여부를 검측하고 품질 기록을 체계적으로 보존합니다.",
  },
  {
    step: "PHASE 04",
    title: "준공 검사 및 유지관리 인계",
    detail: "마감 품질 최종 점검, 대관 준공 절차 지원 및 시설물 유지관리 지침 인계를 통해 안정적인 운영을 지원합니다.",
  },
];

export default function Company() {
  usePageMeta("기업정보", "프로젝트의 목적을 정교한 시공 기준으로 전환하는 (주)동성건설의 기업 개요와 경영철학");
  return (
    <SiteFrame>
      <PageHero
        index="01"
        eyebrow="COMPANY"
        title="기업정보"
        description="도시 인프라와 건축 공간을 통합 엔지니어링 관점으로 완성하는 종합건설 파트너입니다."
        image="/field-01.jpg"
      />
      <SectionNav
        items={[
          { label: "회사소개 · 기업개요", href: "/company" },
          { label: "경영철학 · 수행원칙", href: "/company/philosophy#philosophy" },
        ]}
      />

      <section className="s2-company-intro">
        <Reveal className="s2-company-intro__statement">
          <p>DONGSEONG CONSTRUCTION CO., LTD.</p>
          <h2>
            도시의 기반을 구축하고,
            <br />
            <em>프로젝트의 완성도</em>를 높입니다.
          </h2>
        </Reveal>
        <Reveal className="s2-company-intro__body">
          <span>ABOUT US</span>
          <div>
            <p>
              동성건설은 토목·건축·외부시설 영역을 개별 공정이 아닌 하나의 통합 프로젝트 관점에서 바라봅니다. 기초 지반과 지하 매설물부터 지상 구조체, 외부 광장 마감에 이르기까지 계획과 시공, 품질과 안전이 단절되지 않도록 현장의 실행 기준을 정립합니다.
            </p>
            <p>
              화려한 수식어나 확인되지 않은 외형 지표보다, 설계도서의 정확한 해석과 현장 기술자의 철저한 검측, 그리고 발주처와의 투명한 공정 소통으로 장기적인 신뢰를 구축합니다.
            </p>
          </div>
        </Reveal>

        <Reveal className="s2-corporate-profile">
          <header>
            <p>CORPORATE PROFILE</p>
            <h3>기업 개요</h3>
          </header>
          <dl>
            <div>
              <dt>국문 상호</dt>
              <dd>{company.legalName} ({company.name})</dd>
            </div>
            <div>
              <dt>영문 상호</dt>
              <dd>{company.nameEn}</dd>
            </div>
            <div>
              <dt>핵심 사업부문</dt>
              <dd>토목사업 (도로·교량·부지조성) / 건축사업 (업무·산업·근린시설) / 외부인프라 (부대토목·외구·보강)</dd>
            </div>
            <div>
              <dt>수행 거버넌스</dt>
              <dd>사전 도서 검토 · 공정 인터페이스 통합관리 · Hold-Point 품질검측 · 현장 안전보건 최우선 원칙</dd>
            </div>
            <div>
              <dt>대표자 / 등록번호</dt>
              <dd>대표자: {company.ceo ?? "공식 서류 확인 후 고시"} · 사업자등록번호: {company.businessNumber ?? "확인 후 고시"}</dd>
            </div>
            <div>
              <dt>본사 소재지</dt>
              <dd>{company.address ?? "본사 도로명 주소 확인 후 고시 예정"}</dd>
            </div>
          </dl>
        </Reveal>
      </section>

      <section className="s2-company-editorial">
        <figure>
          <img src={assetPath("field-03.jpg")} alt="구조물 시공 현장에서 설계도면과 태블릿을 대조 검측하는 엔지니어" />
        </figure>
        <Reveal>
          <span>01 / ENGINEERING PRECISION</span>
          <h3>
            도면 위의 계획을
            <br />
            현장의 오차 없는 기준으로.
          </h3>
          <p>
            모든 건설 현장은 토질, 기후, 인접 시설물이라는 고유한 변수를 안고 있습니다. (주)동성건설은 착공 초기 현장 실측과 공정 간 연결부 검토에 역량을 집중하여 재시공 없는 정밀 시공을 실현합니다.
          </p>
        </Reveal>
      </section>

      <section className="s2-philosophy">
        <header>
          <p>MANAGEMENT PHILOSOPHY</p>
          <h2 id="philosophy" className="s2-section-target" tabIndex={-1}>
            책임은 결과가 아니라
            <br />전 과정의 태도입니다.
          </h2>
        </header>
        <div>
          <Reveal>
            <span>01</span>
            <h3>PROJECT INTEGRITY</h3>
            <p>발주 목적과 건물의 생애주기 운영 환경을 모든 엔지니어링 판단의 출발점으로 삼습니다.</p>
          </Reveal>
          <Reveal>
            <span>02</span>
            <h3>FIELD PRECISION</h3>
            <p>보이지 않는 지하 기초·배수관망부터 외장 마감선까지 공정 간 인터페이스를 세밀하게 통제합니다.</p>
          </Reveal>
          <Reveal>
            <span>03</span>
            <h3>SAFETY &amp; TRUST</h3>
            <p>현장 근로자와 시민의 안전을 최우선 가치로 두며, 검증된 자재와 투명한 보고로 신뢰에 답합니다.</p>
          </Reveal>
        </div>
      </section>

      <section className="s2-governance-section">
        <div className="s2-governance-section__inner">
          <Reveal className="s2-governance-section__head">
            <div>
              <p>EXECUTION PROCESS</p>
              <h2>4단계 프로젝트 수행 절차</h2>
            </div>
            <Link href="/contact">
              사전 기술 문의하기 <ArrowUpRight />
            </Link>
          </Reveal>
          <div className="s2-governance-grid">
            {executionGovernance.map((item) => (
              <Reveal key={item.step} className="s2-governance-card">
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
