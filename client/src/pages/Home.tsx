import { Reveal, SiteFrame } from "@/components/SiteShell";
import { categoryLabel, projectArchive } from "@/data/projects";
import { usePageMeta } from "@/hooks/usePageMeta";
import { assetPath } from "@/lib/assets";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Building2, Factory, HardHat, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "wouter";

const heroSlides = [
  { image: "/field-01.jpg", eyebrow: "INFRASTRUCTURE", title: <>도시를 움직이는<br /><strong>기반을 구축합니다.</strong></>, description: "프로젝트의 조건을 읽고, 시공 전 과정의 완성도를 관리합니다.", href: "/business/civil" },
  { image: "/field-02.jpg", eyebrow: "ENGINEERING", title: <>공간의 가치를 높이는<br /><strong>정밀한 엔지니어링.</strong></>, description: "구조와 공정, 품질 기준을 하나의 실행 체계로 연결합니다.", href: "/business/architecture" },
  { image: "/field-03.jpg", eyebrow: "FIELD CONTROL", title: <>현장의 마지막까지<br /><strong>책임으로 완성합니다.</strong></>, description: "안전과 품질을 우선에 두고 프로젝트의 마감 기준을 지킵니다.", href: "/quality" },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

export default function Home() {
  usePageMeta("도시의 기반을 구축하는 건설사", "프로젝트·엔지니어링·현장관리 중심의 동성건설 기업 웹사이트");
  const reducedMotion = useReducedMotion();
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [heroHovered, setHeroHovered] = useState(false);
  const [heroFocused, setHeroFocused] = useState(false);
  const [projectIndex, setProjectIndex] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const projectRail = useRef<HTMLDivElement>(null);

  const moveHero = (direction: number) => setHeroIndex((current) => (current + direction + heroSlides.length) % heroSlides.length);
  const moveProject = (next: number) => {
    const index = (next + projectArchive.length) % projectArchive.length;
    setProjectIndex(index);
    const card = projectRail.current?.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
  };

  useEffect(() => {
    if (reducedMotion || heroPaused || heroHovered || heroFocused) return;
    const timer = window.setInterval(() => moveHero(1), 6200);
    return () => window.clearInterval(timer);
  }, [heroFocused, heroHovered, heroPaused, reducedMotion]);

  const finishSwipe = (clientX: number) => {
    if (pointerStart.current === null) return;
    const distance = clientX - pointerStart.current;
    if (Math.abs(distance) > 45) moveHero(distance > 0 ? -1 : 1);
    pointerStart.current = null;
  };

  const syncProjectScroll = () => {
    const rail = projectRail.current;
    if (!rail || window.innerWidth > 760) return;
    const cards = Array.from(rail.children) as HTMLElement[];
    const center = rail.scrollLeft + rail.clientWidth / 2;
    const closest = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });
    setProjectIndex(closest.index);
  };

  return (
    <SiteFrame>
      <section
        className="s2-home-hero"
        tabIndex={0}
        aria-label="주요 사업 소개 슬라이드"
        onMouseEnter={() => setHeroHovered(true)}
        onMouseLeave={() => setHeroHovered(false)}
        onFocusCapture={() => setHeroFocused(true)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeroFocused(false); }}
        onKeyDown={(event) => { if (event.key === "ArrowLeft") moveHero(-1); if (event.key === "ArrowRight") moveHero(1); }}
        onPointerDown={(event) => { pointerStart.current = event.clientX; }}
        onPointerUp={(event) => finishSwipe(event.clientX)}
        onPointerCancel={() => { pointerStart.current = null; }}
      >
        <div className="s2-home-hero__media">
          {heroSlides.map((slide, index) => <img key={slide.image} className={index === heroIndex ? "is-active" : ""} src={assetPath(slide.image)} alt="" aria-hidden={index !== heroIndex} />)}
        </div>
        <div className="s2-home-hero__veil" />
        <div className="s2-home-hero__copy" key={heroIndex} aria-live="polite">
          <p>{heroSlides[heroIndex].eyebrow}</p>
          <h1>{heroSlides[heroIndex].title}</h1>
          <span>{heroSlides[heroIndex].description}</span>
          <Link href={heroSlides[heroIndex].href}>View capability <ArrowUpRight /></Link>
        </div>
        <div className="s2-home-hero__controls">
          <button type="button" onClick={() => moveHero(-1)} aria-label="이전 슬라이드"><ArrowLeft /></button>
          <b aria-label={`현재 ${heroIndex + 1}번째 슬라이드`}>{String(heroIndex + 1).padStart(2, "0")}</b>
          <div className="s2-home-hero__progress" aria-hidden="true"><i style={{ width: `${((heroIndex + 1) / heroSlides.length) * 100}%` }} /></div>
          <span>{String(heroSlides.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => moveHero(1)} aria-label="다음 슬라이드"><ArrowRight /></button>
          <button type="button" className="s2-home-hero__pause" onClick={() => setHeroPaused((paused) => !paused)} aria-label={heroPaused ? "슬라이드 자동 재생" : "슬라이드 자동 재생 일시정지"} aria-pressed={heroPaused}>
            {heroPaused ? <Play /> : <Pause />}
          </button>
        </div>
        <div className="s2-home-hero__scroll"><ArrowDown /><span>SCROLL</span></div>
      </section>

      <section className="s2-projects-home">
        <Reveal className="s2-projects-home__header">
          <div><p>PROJECT ARCHIVE</p><h2>PROJECT</h2></div>
          <div><span>실제 프로젝트 정보가 등록되면 이 아카이브에 공개됩니다.</span><Link href="/projects">프로젝트 보기 <ArrowUpRight /></Link></div>
        </Reveal>
        <div className="s2-projects-home__rail" ref={projectRail} onScroll={syncProjectScroll}>
          {projectArchive.map((project, index) => (
            <Link href="/projects" key={project.id} className={`s2-project-card ${index === projectIndex ? "is-current" : ""}`} aria-current={index === projectIndex ? "true" : undefined}>
              <figure><img src={assetPath(project.thumbnail)} alt="" /><span>자료 준비 중</span></figure>
              <div><p>0{index + 1} / {categoryLabel[project.category]}</p><h3>{project.title}</h3><small>{project.summary}</small><ArrowUpRight /></div>
            </Link>
          ))}
        </div>
        <div className="s2-projects-home__controls">
          <button type="button" onClick={() => moveProject(projectIndex - 1)} aria-label="이전 프로젝트"><ArrowLeft /></button>
          <b>{String(projectIndex + 1).padStart(2, "0")}</b><i /><span>{String(projectArchive.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => moveProject(projectIndex + 1)} aria-label="다음 프로젝트"><ArrowRight /></button>
        </div>
      </section>

      <section className="s2-business-home">
        <Reveal className="s2-business-home__title"><p>CORE CAPABILITY</p><h2>Business Area</h2><span>프로젝트의 목적과 현장 조건에 맞춰 핵심 사업영역을 연결합니다.</span></Reveal>
        <div className="s2-business-home__grid">
          <Link href="/business/civil" style={{ "--area-image": `url(${assetPath("field-01.jpg")})` } as CSSProperties}><span>01</span><HardHat /><h3>CIVIL</h3><p>도시 기반과 이동 환경을 구축하는 토목 영역</p><b>Explore <ArrowUpRight /></b></Link>
          <Link href="/business/architecture" style={{ "--area-image": `url(${assetPath("field-02.jpg")})` } as CSSProperties}><span>02</span><Building2 /><h3>ARCHITECTURE</h3><p>구조와 공간의 완성도를 높이는 건축 영역</p><b>Explore <ArrowUpRight /></b></Link>
          <Link href="/business/field" style={{ "--area-image": `url(${assetPath("field-03.jpg")})` } as CSSProperties}><span>03</span><Factory /><h3>FIELD</h3><p>현장의 연결과 마감을 책임지는 외부시설 영역</p><b>Explore <ArrowUpRight /></b></Link>
        </div>
      </section>

      <section className="s2-news-home">
        <Reveal><p>NEWSROOM</p><h2>새로운 소식</h2><span>현재 등록된 공지사항이 없습니다.</span><Link href="/news">Newsroom <ArrowUpRight /></Link></Reveal>
        <div className="s2-news-home__empty"><b>NO POST</b><p>확인되지 않은 소식을 임의로 게시하지 않습니다.</p></div>
      </section>

      <section className="s2-transition-links">
        <header>
          <p>NEXT STEP</p>
          <h2>프로젝트의 다음 단계를<br />확인하세요.</h2>
        </header>
        <div>
          <Link href="/quality">
            <figure><img src={assetPath("field-03.jpg")} alt="" /></figure>
            <small>01 / STANDARD</small>
            <h3>품질과 안전의 기준</h3>
            <p>현장을 완성하는 관리 원칙과 실행 기준을 확인합니다.</p>
            <span>View standard <ArrowUpRight /></span>
          </Link>
          <Link href="/contact">
            <figure><img src={assetPath("field-02.jpg")} alt="" /></figure>
            <small>02 / INQUIRY</small>
            <h3>프로젝트 문의</h3>
            <p>검토에 필요한 현장 조건과 프로젝트 정보를 정리합니다.</p>
            <span>Start inquiry <ArrowUpRight /></span>
          </Link>
        </div>
      </section>
    </SiteFrame>
  );
}
