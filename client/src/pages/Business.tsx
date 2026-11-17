import { PageHero, Reveal, SectionNav, SiteFrame } from "@/components/SiteShell";
import { usePageMeta } from "@/hooks/usePageMeta";
import { assetPath } from "@/lib/assets";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

const areas = [
  {
    index: "01",
    slug: "civil",
    label: "CIVIL ENGINEERING",
    title: "토목",
    image: "/field-01.jpg",
    copy: "도시의 이동과 산업 활동을 지탱하는 도로·교량 기반시설부터 대규모 단지 부지조성, 우수·상하수도 관망 및 구조물 공사를 지반공학적 안정성 기준으로 수행합니다.",
    scopes: [
      "도로 개설·확포장 및 교량·암거 하부 구조물 시공",
      "산업단지 · 물류단지 · 택지 개발 부지조성 및 정밀 토공",
      "보강토 옹벽 · 철근콘크리트 옹벽 및 대규모 사면 안정화",
      "우수·오수 관거 부설, 저류시설 및 지하 매설물 기반 구축",
    ],
    standards: "원지반 지지력·다짐도 단계 시험 / 우기·해빙기 배수 및 사면 계측 관리",
  },
  {
    index: "02",
    slug: "architecture",
    label: "ARCHITECTURAL WORKS",
    title: "건축",
    image: "/field-02.jpg",
    copy: "업무·연구시설, 스마트 물류·제조공장, 근린생활 복합건축물까지 구조적 안전성과 공간의 기능성, 외피 완성도를 하나의 공정 체계로 구현합니다.",
    scopes: [
      "기업 사옥 · 연구소(R&D) · 업무 및 상업용 복합건축물 신축",
      "스마트 물류센터 · 첨단 제조공장 (철골 · PC · RC 복합구조)",
      "근린생활시설 · 교육·복지 및 공공 업무시설 시공",
      "기존 건축물 대수선 · 구조 보강 및 내·외장 리모델링",
    ],
    standards: "골조·외피·기계설비 인터페이스 통합 관리 / 단열·방수·방화 기밀 검측",
  },
  {
    index: "03",
    slug: "field",
    label: "INFRA & EXTERIOR",
    title: "외부시설",
    image: "/field-05.jpg",
    copy: "토목 기반과 건축물을 유기적으로 연결하는 단지 내 도로·진입광장, 조경·경계 구조물 및 노후 외부 인프라의 성능 개선 공정을 정교하게 완성합니다.",
    scopes: [
      "단지 내 진입도로 · 하역장 · 주차장 고내구성 포장 공정",
      "사옥·캠퍼스 외부 석재 광장, 투수포장 및 무장애(BF) 보행 동선",
      "외곽 경계 구조물, 배수 트렌치·집수정 및 조경 기반 시설물",
      "운영 중 시설물 외부 단차·침하 복구 및 안전 시설 정비",
    ],
    standards: "건축 1층 마감 레벨·외부 우수 구배 일치 / 대형 차량 윤하중 내구성 확보",
  },
];

export default function Business() {
  usePageMeta("사업영역", "토목·건축·외부 인프라를 하나의 실행 체계로 연결하는 (주)동성건설의 핵심 사업영역");
  return (
    <SiteFrame>
      <PageHero
        index="02"
        eyebrow="BUSINESS"
        title="사업영역"
        description="분리된 공정이 아닌 하나의 통합 프로젝트로 현장의 시작과 완성을 책임집니다."
        image="/field-02.jpg"
      />
      <SectionNav items={areas.map((area) => ({ label: area.title, href: `/business/${area.slug}#${area.slug}` }))} />
      <section className="s2-business-page">
        <header>
          <p>CORE BUSINESS DIVISIONS</p>
          <h2>
            공간과 도시를 이루는
            <br />세 가지 핵심 실행 부문
          </h2>
          <span>발주 목적과 대지 여건에 맞춰 단독 공종 수행부터 토목·건축·외구 통합 도급까지 유연하게 대응합니다.</span>
        </header>
        {areas.map((area) => (
          <article className="s2-business-landing" key={area.slug}>
            <figure>
              <img src={assetPath(area.image)} alt={`${area.title} 사업부문 대표 현장 이미지`} loading="lazy" decoding="async" />
              <span>{area.index}</span>
            </figure>
            <Reveal>
              <p>{area.label}</p>
              <h3 id={area.slug} className="s2-section-target" tabIndex={-1}>
                {area.title}
              </h3>
              <strong>{area.copy}</strong>
              <ul>
                {area.scopes.map((scope) => (
                  <li key={scope}>{scope}</li>
                ))}
              </ul>
              <div className="s2-business-landing__standard">
                <span>중점 관리 기준</span>
                <p>{area.standards}</p>
              </div>
              <Link href="/contact">
                해당 부문 프로젝트 문의 <ArrowUpRight />
              </Link>
            </Reveal>
          </article>
        ))}
      </section>
    </SiteFrame>
  );
}
