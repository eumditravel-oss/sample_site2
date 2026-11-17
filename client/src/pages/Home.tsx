import { Reveal, SiteFrame } from "@/components/SiteShell";
import { corporateNews } from "@/data/news";
import { categoryLabel, projectArchive } from "@/data/projects";
import { usePageMeta } from "@/hooks/usePageMeta";
import { assetPath } from "@/lib/assets";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Building2, Compass, Factory, HardHat, Pause, Play, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "wouter";

const heroSlides = [
  {
    image: "/field-01.jpg",
    eyebrow: "CIVIL & INFRASTRUCTURE",
    title: (
      <>
        도시를 움직이는
        <br />
        <strong>기반을 구축합니다.</strong>
      </>
    ),
    description: "광역 도로·교량부터 단지 부지조성까지, 지반과 구조의 조건을 정밀하게 분석해 흔들림 없는 인프라를 완성합니다.",
    href: "/business/civil#civil",
    linkLabel: "토목사업 역량 보기",
  },
  {
    image: "/field-02.jpg",
    eyebrow: "ARCHITECTURAL ENGINEERING",
    title: (
      <>
        공간의 가치를 높이는
        <br />
        <strong>정밀한 엔지니어링.</strong>
      </>
    ),
    description: "업무·연구시설부터 스마트 산업시설까지, 구조·외피·설비 인터페이스를 하나의 실행 체계로 관리합니다.",
    href: "/business/architecture#architecture",
    linkLabel: "건축사업 역량 보기",
  },
  {
    image: "/field-03.jpg",
    eyebrow: "QUALITY & SAFETY GOVERNANCE",
    title: (
      <>
        현장의 마지막까지
        <br />
        <strong>책임으로 완성합니다.</strong>
      </>
    ),
    description: "착공 전 위험성평가와 공정별 입회 검측을 원칙으로 삼아 안전과 품질의 기준을 준공까지 일관되게 지킵니다.",
    href: "/quality",
    linkLabel: "품질·안전 체계 보기",
  },
];

const executionPillars = [
  {
    code: "STEP 01",
    title: "사전 기술·여건 분석",
    en: "PRE-CONSTRUCTION REVIEW",
    description: "지반·인접 환경·설계도서의 정합성을 착공 전 선제적으로 검토하여 시공 리스크와 공정 간섭을 예방합니다.",
  },
  {
    code: "STEP 02",
    title: "통합 공정 엔지니어링",
    en: "INTEGRATED COORDINATION",
    description: "토목·골조·외장·부대시설 간 연결 구간을 통합 관리해 공기 지연을 줄이고 구조적 일체성을 확보합니다.",
  },
  {
    code: "STEP 03",
    title: "단계별 품질·안전 검측",
    en: "HOLD-POINT INSPECTION",
    description: "자재 반입 검수부터 주요 공정 완료 시점마다 필수 검측 기준(Hold Point)과 일일 안전점검을 이행합니다.",
  },
  {
    code: "STEP 04",
    title: "책임 준공 및 사후 인계",
    en: "RESPONSIBLE HANDOVER",
    description: "최종 마감 정밀도 점검과 시운전·유지관리 안내까지 발주처가 신뢰할 수 있는 준공 품질을 인계합니다.",
  },
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
  usePageMeta("도시의 기반과 건축의 가치를 완성하는 종합건설 파트너", "토목·건축·외부 인프라를 통합 엔지니어링 체계로 수행하는 (주)동성건설 공식 웹사이트");
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
    const closest = cards.reduce(
      (best, card, index) => {
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    );
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
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeroFocused(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") moveHero(-1);
          if (event.key === "ArrowRight") moveHero(1);
        }}
        onPointerDown={(event) => {
          pointerStart.current = event.clientX;
        }}
        onPointerUp={(event) => finishSwipe(event.clientX)}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
      >
        <div className="s2-home-hero__media">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.image}
              className={index === heroIndex ? "is-active" : ""}
              src={assetPath(slide.image)}
              alt=""
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              aria-hidden={index !== heroIndex}
            />
          ))}
        </div>
        <div className="s2-home-hero__veil" />
        <div className="s2-home-hero__copy" key={heroIndex} aria-live="polite">
          <p>{heroSlides[heroIndex].eyebrow}</p>
          <h1>{heroSlides[heroIndex].title}</h1>
          <span>{heroSlides[heroIndex].description}</span>
          <Link href={heroSlides[heroIndex].href}>
            {heroSlides[heroIndex].linkLabel} <ArrowUpRight />
          </Link>
        </div>
        <div className="s2-home-hero__controls">
          <button type="button" onClick={() => moveHero(-1)} aria-label="이전 슬라이드">
            <ArrowLeft />
          </button>
          <b aria-label={`현재 ${heroIndex + 1}번째 슬라이드`}>{String(heroIndex + 1).padStart(2, "0")}</b>
          <div className="s2-home-hero__progress" aria-hidden="true">
            <i style={{ width: `${((heroIndex + 1) / heroSlides.length) * 100}%` }} />
          </div>
          <span>{String(heroSlides.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => moveHero(1)} aria-label="다음 슬라이드">
            <ArrowRight />
          </button>
          <button
            type="button"
            className="s2-home-hero__pause"
            onClick={() => setHeroPaused((paused) => !paused)}
            aria-label={heroPaused ? "슬라이드 자동 재생" : "슬라이드 자동 재생 일시정지"}
            aria-pressed={heroPaused}
          >
            {heroPaused ? <Play /> : <Pause />}
          </button>
        </div>
        <div className="s2-home-hero__scroll">
          <ArrowDown />
          <span>SCROLL</span>
        </div>
      </section>

      <section className="s2-system-home" aria-label="통합 프로젝트 수행 체계">
        <div className="s2-system-home__inner">
          <Reveal className="s2-system-home__intro">
            <div>
              <p>EXECUTION SYSTEM</p>
              <h2>
                설계 검토부터 준공까지,
                <br />
                <em>하나의 엔지니어링 기준</em>으로 움직입니다.
              </h2>
            </div>
            <div>
              <span>
                (주)동성건설은 개별 공정의 단순 시공을 넘어, 토목 기반·건축 구조·외부 인프라가 맞물리는 전 과정을 체계적인 기술 거버넌스로 관리합니다.
              </span>
              <Link href="/company">
                기업정보 및 경영철학 <ArrowUpRight />
              </Link>
            </div>
          </Reveal>
          <div className="s2-system-home__grid">
            {executionPillars.map((pillar) => (
              <Reveal key={pillar.code} className="s2-system-card">
                <span>{pillar.code}</span>
                <small>{pillar.en}</small>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="s2-business-home">
        <Reveal className="s2-business-home__title">
          <p>CORE CAPABILITY</p>
          <h2>Business Divisions</h2>
          <span>프로젝트의 목적과 대지·구조 조건에 맞춰 세 가지 핵심 사업부문을 유기적으로 연결합니다.</span>
        </Reveal>
        <div className="s2-business-home__grid">
          <Link href="/business/civil#civil" style={{ "--area-image": `url(${assetPath("field-01.jpg")})` } as CSSProperties}>
            <span>01 / DIVISION</span>
            <HardHat />
            <h3>CIVIL</h3>
            <strong>토목사업</strong>
            <p>도로·교량 기반시설 · 산업·택지 부지조성 · 우수·관로 및 옹벽 구조물</p>
            <b>
              사업 상세 보기 <ArrowUpRight />
            </b>
          </Link>
          <Link href="/business/architecture#architecture" style={{ "--area-image": `url(${assetPath("field-02.jpg")})` } as CSSProperties}>
            <span>02 / DIVISION</span>
            <Building2 />
            <h3>ARCHITECTURE</h3>
            <strong>건축사업</strong>
            <p>업무·연구 복합시설 · 스마트 물류·제조공장 · 근린생활 및 리모델링</p>
            <b>
              사업 상세 보기 <ArrowUpRight />
            </b>
          </Link>
          <Link href="/business/field#field" style={{ "--area-image": `url(${assetPath("field-05.jpg")})` } as CSSProperties}>
            <span>03 / DIVISION</span>
            <Factory />
            <h3>INFRA &amp; EXTERIOR</h3>
            <strong>외부인프라</strong>
            <p>단지 내 도로·진입광장 · 석재·블록 포장 · 부대토목 및 시설물 성능개선</p>
            <b>
              사업 상세 보기 <ArrowUpRight />
            </b>
          </Link>
        </div>
      </section>

      <section className="s2-projects-home">
        <Reveal className="s2-projects-home__header">
          <div>
            <p>ENGINEERING PORTFOLIO</p>
            <h2>CAPABILITY ARCHIVE</h2>
          </div>
          <div>
            <span>공종별 핵심 수행 범위와 중점 품질 검측 기준을 소개합니다. 발주처 협의를 마친 준공 실적은 순차 등재됩니다.</span>
            <Link href="/projects">
              전체 수행역량 보기 <ArrowUpRight />
            </Link>
          </div>
        </Reveal>
        <div className="s2-projects-home__rail" ref={projectRail} onScroll={syncProjectScroll}>
          {projectArchive.slice(0, 3).map((project, index) => (
            <Link
              href="/projects"
              key={project.id}
              className={`s2-project-card ${index === projectIndex % 3 ? "is-current" : ""}`}
              aria-current={index === projectIndex % 3 ? "true" : undefined}
            >
              <figure>
                <img src={assetPath(project.thumbnail)} alt={`${project.title} 현장 이미지`} loading="lazy" decoding="async" />
                <span>{project.code}</span>
              </figure>
              <div>
                <p>
                  0{index + 1} / {categoryLabel[project.category]}
                </p>
                <h3>{project.title}</h3>
                <small>{project.summary}</small>
                <ArrowUpRight />
              </div>
            </Link>
          ))}
        </div>
        <div className="s2-projects-home__controls">
          <button type="button" onClick={() => moveProject(projectIndex - 1)} aria-label="이전 프로젝트">
            <ArrowLeft />
          </button>
          <b>{String((projectIndex % 3) + 1).padStart(2, "0")}</b>
          <i />
          <span>03</span>
          <button type="button" onClick={() => moveProject(projectIndex + 1)} aria-label="다음 프로젝트">
            <ArrowRight />
          </button>
        </div>
      </section>

      <section className="s2-news-home">
        <Reveal>
          <p>CORPORATE NEWSROOM</p>
          <h2>공식 안내 및 소식</h2>
          <span>(주)동성건설의 프로젝트 검토 안내, 안전보건 경영방침 및 법령 고지 소식을 투명하게 전달합니다.</span>
          <Link href="/news">
            뉴스룸 전체보기 <ArrowUpRight />
          </Link>
        </Reveal>
        <div className="s2-news-home__board">
          {corporateNews.map((item) => (
            <Link href="/news" key={item.id} className="s2-news-home__item">
              <div>
                <span className="s2-news-badge">{item.category}</span>
                <time>{item.date}</time>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="s2-transition-links">
        <header>
          <p>NEXT STEP</p>
          <h2>
            <span>프로젝트의</span>
            <span>다음 단계를</span>
            <span>확인하세요</span>
          </h2>
        </header>
        <div>
          <Link href="/quality">
            <figure>
              <img src={assetPath("field-03.jpg")} alt="현장 구조물 도면 대조 및 품질·안전 검측 장면" loading="lazy" decoding="async" />
            </figure>
            <small>
              <ShieldCheck size={14} aria-hidden="true" /> 01 / QHSE STANDARD
            </small>
            <h3>품질·안전 경영 시스템</h3>
            <p>단계별 입회 검측(Hold Point)과 현장 중심 안전보건 5대 실행 원칙을 확인합니다.</p>
            <span>
              View standard <ArrowUpRight />
            </span>
          </Link>
          <Link href="/contact">
            <figure>
              <img src={assetPath("field-04.jpg")} alt="스마트 물류 및 산업시설 신축 건축물 전경" loading="lazy" decoding="async" />
            </figure>
            <small>
              <Compass size={14} aria-hidden="true" /> 02 / PROJECT INQUIRY
            </small>
            <h3>프로젝트 사전 기술 문의</h3>
            <p>대지 위치, 공종 범위, 희망 착공 시기 등 검토에 필요한 핵심 정보를 간편하게 정리합니다.</p>
            <span>
              Start inquiry <ArrowUpRight />
            </span>
          </Link>
        </div>
      </section>
    </SiteFrame>
  );
}
