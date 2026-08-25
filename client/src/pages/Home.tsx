import { ArrowDown, ArrowLeft, ArrowRight, Building2, Factory, HardHat, MoveUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "wouter";
import { SiteFrame } from "@/components/SiteShell";
import { assetPath } from "@/lib/assets";

const projects = [
  { category: "CIVIL WORKS", title: "도시 기반 정비 공사", image: "/field-01.jpg" },
  { category: "ARCHITECTURAL WORKS", title: "건축 구조 시공", image: "/field-02.jpg" },
  { category: "FIELD ENGINEERING", title: "정밀 공정 관리", image: "/field-03.jpg" },
];

const news = [
  { title: "현장 상담 전 확인하면 좋은 안내 사항입니다.", date: "2026.08.18" },
  { title: "작업 가능 지역과 공정별 일정 안내", date: "2026.08.12" },
  { title: "안전한 현장 진행을 위한 동성건설의 약속", date: "2026.08.04" },
];

export default function Home() {
  return (
    <SiteFrame>
      <section className="gg-hero">
        <img src={assetPath("field-01.jpg")} alt="동성건설 토목 기반 공사 현장" />
        <div className="gg-hero__veil" />
        <div className="gg-hero__copy">
          <p>BUILDING A BETTER GROUND</p>
          <h1>사람과 도시를 잇는<br /><strong>단단한 기반</strong></h1>
          <span>현장을 이해하는 기술과 끝까지 지키는 책임으로<br />더 나은 생활의 토대를 만듭니다.</span>
          <Link href="/company">More View <ArrowRight size={18} /></Link>
        </div>
        <div className="gg-hero__pager"><button type="button" aria-label="이전 이미지"><ArrowLeft /></button><b>01</b><i /><span>03</span><button type="button" aria-label="다음 이미지"><ArrowRight /></button></div>
        <div className="gg-hero__scroll"><ArrowDown size={18} /><span>SCROLL DOWN</span></div>
      </section>

      <section className="gg-projects">
        <header className="gg-section-title"><h2>PROJECT</h2><p>현장에서 쌓은 기술과 책임으로 완성한 동성건설의 주요 공정입니다.</p></header>
        <div className="gg-projects__rail">
          {projects.map((project, index) => (
            <Link href="/gallery" className="gg-project-card" key={project.title}>
              <figure><img src={assetPath(project.image)} alt={`${project.title} 현장`} /></figure>
              <div><span>{project.category}</span><h3>{project.title}</h3><b>0{index + 1}</b><MoveUpRight size={20} /></div>
            </Link>
          ))}
        </div>
        <div className="gg-projects__controls"><button type="button" aria-label="이전 프로젝트"><ArrowLeft /></button><span>01</span><i /><b>03</b><button type="button" aria-label="다음 프로젝트"><ArrowRight /></button></div>
      </section>

      <section className="gg-business">
        <header className="gg-section-title gg-section-title--light"><h2>Business Area</h2><p>도시의 기반에서 생활의 공간까지, 동성건설이 책임 있게 수행합니다.</p></header>
        <div className="gg-business__grid">
          <Link href="/services/scope" className="gg-business-card" style={{ "--business-image": `url(${assetPath("field-01.jpg")})` } as CSSProperties}><HardHat size={35} /><span>01</span><h3>토목</h3><p>대한민국의 생활과 도시의 흐름을<br />더 안전하고 풍요롭게</p><strong>CIVIL WORKS</strong><b>자세히 보기 <ArrowRight size={17} /></b></Link>
          <Link href="/services/scope" className="gg-business-card" style={{ "--business-image": `url(${assetPath("field-02.jpg")})` } as CSSProperties}><Building2 size={35} /><span>02</span><h3>건축</h3><p>사람이 머무는 공간을<br />더 편리하고 쾌적하게</p><strong>ARCHITECTURAL WORKS</strong><b>자세히 보기 <ArrowRight size={17} /></b></Link>
          <Link href="/services/scope" className="gg-business-card" style={{ "--business-image": `url(${assetPath("field-03.jpg")})` } as CSSProperties}><Factory size={35} /><span>03</span><h3>외부 시설</h3><p>도로와 건축을 연결하는 환경을<br />더 정교하고 오래도록</p><strong>FIELD WORKS</strong><b>자세히 보기 <ArrowRight size={17} /></b></Link>
        </div>
      </section>

      <section className="gg-news">
        <div className="gg-news__lead"><header className="gg-section-title"><h2>News</h2><p>동성건설의 새로운 소식과 현장 안내를 전합니다.</p></header><Link href="/notices">전체 소식 보기 <ArrowRight size={17} /></Link></div>
        <div className="gg-news__list">
          {news.map((item, index) => <Link href="/notices" key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><time>{item.date}</time><MoveUpRight size={18} /></Link>)}
        </div>
      </section>

      <section className="gg-quick">
        <Link href="/consultation"><small>ONLINE</small><h3>온라인 상담</h3><p>현장 위치와 필요한 공정을 남겨주세요.</p><ArrowRight /></Link>
        <Link href="/services/promise"><small>STANDARD</small><h3>고객과의 약속</h3><p>과정을 투명하게, 마무리를 책임 있게.</p><ArrowRight /></Link>
        <Link href="/location"><small>CONTACT</small><h3>오시는 길</h3><p>동성건설의 위치와 연락처를 안내합니다.</p><ArrowRight /></Link>
      </section>
    </SiteFrame>
  );
}
