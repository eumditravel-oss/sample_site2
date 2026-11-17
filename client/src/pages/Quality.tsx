import { PageHero, Reveal, SectionNav, SiteFrame } from "@/components/SiteShell";
import { usePageMeta } from "@/hooks/usePageMeta";
import { CheckCircle2, ShieldAlert } from "lucide-react";

const qualityGates = [
  {
    index: "GATE 01",
    label: "PRE-CONSTRUCTION",
    title: "착공 전 도서·지반 정합성 검토",
    copy: "설계도면, 시방서, 지반조사서 및 인접 매설물 현황을 교차 검토하여 시공 중 발생 가능한 오차와 간섭을 선제적으로 차단합니다.",
  },
  {
    index: "GATE 02",
    label: "MATERIAL VERIFICATION",
    title: "반입 자재 KS·품질시험 검수",
    copy: "레미콘, 철근, 강재, 방수·단열재 및 관로 자재 반입 시 시험성적서와 규격을 대조 확인하고 부적합 자재의 현장 투입을 금지합니다.",
  },
  {
    index: "GATE 03",
    label: "HOLD-POINT INSPECTION",
    title: "공정별 필수 입회 검측(Hold Point)",
    copy: "매몰되거나 마감에 가려지는 기초·배근·배관·방수 공정은 검측 합격 및 기록 완료 후에만 후속 공정으로 이행합니다.",
  },
];

const safetyRules = [
  {
    code: "RULE 01",
    title: "사전 위험성평가 의무화",
    detail: "신규 공정 투입 전 작업 환경의 유해·위험 요인을 도출하고 추락·협착·낙하 방지 대책을 먼저 설치합니다.",
  },
  {
    code: "RULE 02",
    title: "일일 TBM(작업 전 안전점검회의)",
    detail: "매일 작업 개시 전 당일 공정 위험 구간, 장비 동선 및 근로자 건강 상태를 공유하고 안전수칙을 숙지합니다.",
  },
  {
    code: "RULE 03",
    title: "개인보호구 및 안전시설 무관용 원칙",
    detail: "안전모·안전대·안전화 착용과 개구부 방호울, 비계·작업발판 안전 기준을 예외 없이 준수합니다.",
  },
  {
    code: "RULE 04",
    title: "건설기계·중장비 작업 구역 통제",
    detail: "굴착기·크레인·덤프 작업 반경 내 유도자 배치 및 보행 동선 분리를 통해 장비 접촉 사고를 예방합니다.",
  },
  {
    code: "RULE 05",
    title: "기상 악화 시 작업 중지 및 비상 대응",
    detail: "집중호우·강풍·폭염·한파 등 기상 특보 시 즉시 위험 작업을 중지하고 배수·보양 및 비상 연락 체계를 가동합니다.",
  },
];

export default function Quality() {
  usePageMeta("품질·안전 경영", "전 과정 검측 시스템과 현장 중심 안전보건 원칙을 실천하는 (주)동성건설 품질·안전 체계");
  return (
    <SiteFrame>
      <PageHero
        index="04"
        eyebrow="QUALITY & SAFETY"
        title="품질·안전"
        description="현장의 기준은 문서에 머물지 않고 매 공정의 검측과 안전 실천으로 증명됩니다."
        image="/field-03.jpg"
      />
      <SectionNav
        items={[
          { label: "품질관리 체계", href: "/quality" },
          { label: "안전보건 경영", href: "/quality/safety#safety" },
        ]}
      />

      <section className="s2-quality-page">
        <header>
          <p>QUALITY ASSURANCE SYSTEM</p>
          <h2>
            품질과 안전을
            <br />
            하나의 실행 체계로.
          </h2>
          <span>
            보이지 않는 기초와 구조체 내부일수록 더욱 엄격한 검측 기준을 적용합니다. ISO 등 대외 인증 현황은 공식 증빙 확인 후 고시합니다.
          </span>
        </header>
        <div>
          {qualityGates.map((item) => (
            <Reveal key={item.index}>
              <span>{item.index}</span>
              <p>{item.label}</p>
              <h3>{item.title}</h3>
              <strong>{item.copy}</strong>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="s2-safety-charter" aria-labelledby="safety">
        <div className="s2-safety-charter__inner">
          <Reveal className="s2-safety-charter__head">
            <p>
              <ShieldAlert size={15} aria-hidden="true" /> SAFETY FIRST GOVERNANCE
            </p>
            <h2 id="safety" className="s2-section-target" tabIndex={-1}>
              현장 안전보건 5대 핵심 원칙
            </h2>
            <span>안전은 공기 단축이나 비용 절감과 타협할 수 없는 (주)동성건설의 제1원칙입니다.</span>
          </Reveal>
          <div className="s2-safety-grid">
            {safetyRules.map((rule) => (
              <Reveal key={rule.code} className="s2-safety-card">
                <div>
                  <span>{rule.code}</span>
                  <CheckCircle2 size={18} aria-hidden="true" />
                </div>
                <h3>{rule.title}</h3>
                <p>{rule.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="s2-quality-principle">
        <p>ZERO COMPROMISE</p>
        <h2>
          완성도를 만드는 것은
          <br />
          보이지 않는 기준의 반복입니다.
        </h2>
      </section>
    </SiteFrame>
  );
}
