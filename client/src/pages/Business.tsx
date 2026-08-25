import { PageHero, Reveal, SectionNav, SiteFrame } from "@/components/SiteShell";
import { usePageMeta } from "@/hooks/usePageMeta";
import { assetPath } from "@/lib/assets";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

const areas = [
  { index: "01", slug: "civil", label: "CIVIL", title: "토목", image: "/field-01.jpg", copy: "도시의 이동과 생활을 지지하는 기반시설을 프로젝트의 목적과 현장 조건에 맞춰 검토합니다." },
  { index: "02", slug: "architecture", label: "ARCHITECTURE", title: "건축", image: "/field-02.jpg", copy: "구조와 공간, 공정과 마감의 연결을 통해 건축 프로젝트의 완성도를 관리합니다." },
  { index: "03", slug: "field", label: "FIELD", title: "외부시설", image: "/field-03.jpg", copy: "토목과 건축 사이의 외부 환경을 정밀하게 연결하고 현장의 마지막 인상을 완성합니다." },
];

export default function Business() {
  usePageMeta("사업영역", "토목·건축·외부시설을 프로젝트 단위로 연결하는 동성건설의 사업영역");
  return (
    <SiteFrame>
      <PageHero index="02" eyebrow="BUSINESS" title="사업영역" description="분리된 공정이 아닌 하나의 프로젝트로 현장을 바라봅니다." image="/field-02.jpg" />
      <SectionNav items={areas.map((area) => ({ label: area.title, href: `/business/${area.slug}` }))} />
      <section className="s2-business-page">
        <header><p>CORE BUSINESS</p><h2>공간과 도시를 이루는<br />세 가지 실행 영역</h2><span>실제 프로젝트와 수행실적은 확인된 정보가 등록되는 시점에 공개합니다.</span></header>
        {areas.map((area) => (
          <article className="s2-business-landing" id={area.slug} key={area.slug}>
            <figure><img src={assetPath(area.image)} alt="" /><span>{area.index}</span></figure>
            <Reveal><p>{area.label}</p><h3>{area.title}</h3><strong>{area.copy}</strong><ul><li>프로젝트 조건 분석</li><li>공정 간 연결 검토</li><li>품질·안전 기준 관리</li></ul><Link href="/contact">프로젝트 문의 준비 <ArrowUpRight /></Link></Reveal>
          </article>
        ))}
      </section>
    </SiteFrame>
  );
}
