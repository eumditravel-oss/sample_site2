import { company } from "@/config/company";
import { assetPath } from "@/lib/assets";
import { ArrowUp, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "wouter";

const navigation = [
  {
    label: "COMPANY",
    title: "기업정보",
    href: "/company",
    links: [
      { label: "회사소개 · 기업개요", href: "/company" },
      { label: "경영철학 · 수행원칙", href: "/company/philosophy#philosophy" },
    ],
  },
  {
    label: "BUSINESS",
    title: "사업영역",
    href: "/business",
    links: [
      { label: "토목사업", href: "/business/civil#civil" },
      { label: "건축사업", href: "/business/architecture#architecture" },
      { label: "외부인프라", href: "/business/field#field" },
    ],
  },
  {
    label: "PROJECT",
    title: "프로젝트",
    href: "/projects",
    links: [{ label: "수행역량 아카이브", href: "/projects" }],
  },
  {
    label: "QUALITY",
    title: "품질·안전",
    href: "/quality",
    links: [
      { label: "품질관리 체계", href: "/quality" },
      { label: "안전보건 경영", href: "/quality/safety#safety" },
    ],
  },
  {
    label: "NEWS",
    title: "뉴스룸",
    href: "/news",
    links: [{ label: "공식 소식 · 운영안내", href: "/news" }],
  },
  {
    label: "CONTACT",
    title: "프로젝트 문의",
    href: "/contact",
    links: [{ label: "프로젝트 문의 접수", href: "/contact" }],
  },
] as const;

const sectionTargets: Record<string, string> = {
  "/company/philosophy": "philosophy",
  "/business/civil": "civil",
  "/business/architecture": "architecture",
  "/business/field": "field",
  "/quality/safety": "safety",
};
const normalizeRoute = (path: string) => path.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";

function scrollToRouteSection(path: string) {
  const id = sectionTargets[normalizeRoute(path)];
  const target = id ? document.getElementById(id) : null;
  if (!target) return false;
  target.scrollIntoView({ behavior: "instant", block: "start" });
  target.focus({ preventScroll: true });
  return true;
}

export function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="s2-brand" aria-label={`${company.name} 홈`}>
      <img src={assetPath(inverse ? "dongseong-logo-white.svg" : "dongseong-logo.svg")} alt={`${company.name} 로고`} />
    </Link>
  );
}

export function SiteHeader() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isHome = location === "/";

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 28);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1101px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useLayoutEffect(() => {
    if (!mobileOpen) return;
    const menu = menuRef.current;
    const app = document.getElementById("root");
    if (!menu) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const previousInert = app?.inert ?? false;
    if (app) app.inert = true;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });

    const focusable = () =>
      Array.from(
        menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        menu.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !menu.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !menu.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!menu.contains(event.target as Node)) closeButtonRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      if (app) app.inert = previousInert;
      document.body.style.overflow = previousOverflow;
      const returnFocus = menuButtonRef.current?.isConnected ? menuButtonRef.current : previouslyFocused;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [mobileOpen]);

  const active = (href: string) => (href === "/" ? location === "/" : location === href || location.startsWith(`${href}/`));
  const inverse = isHome && !scrolled;

  return (
    <>
      <header className={`s2-header ${inverse ? "is-overlay" : "is-solid"}`}>
        <a className="s2-skip" href="#main-content">
          본문 바로가기
        </a>
        <div className="s2-header__inner">
          <BrandMark inverse={inverse} />
          <nav className="s2-desktop-nav" aria-label="주요 메뉴">
            {navigation.map((item) => (
              <div className="s2-nav-item" key={item.label}>
                <Link
                  href={item.href}
                  className={active(item.href) ? "is-active" : ""}
                  aria-current={active(item.href) ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  <small>{item.title}</small>
                  <ChevronDown size={13} aria-hidden="true" />
                </Link>
                <div className="s2-nav-item__panel">
                  {item.links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                      <ArrowUpRight size={13} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <button
            ref={menuButtonRef}
            className="s2-menu-button"
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="전체 메뉴 열기"
            aria-expanded={mobileOpen}
            aria-controls="s2-mobile-menu"
          >
            <Menu />
          </button>
        </div>
      </header>

      {typeof document !== "undefined" &&
        createPortal(
          <div
            id="s2-mobile-menu"
            ref={menuRef}
            className="s2-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="전체 메뉴"
            tabIndex={-1}
            hidden={!mobileOpen}
          >
            <div
              className="s2-mobile-menu__top"
              onClick={(event) => {
                if ((event.target as HTMLElement).closest("a")) setMobileOpen(false);
              }}
            >
              <BrandMark inverse />
              <button ref={closeButtonRef} type="button" onClick={() => setMobileOpen(false)} aria-label="전체 메뉴 닫기">
                <X />
              </button>
            </div>
            <p>INTEGRATED CIVIL &amp; ARCHITECTURAL ENGINEERING</p>
            <nav
              aria-label="모바일 주요 메뉴"
              onClick={(event) => {
                if ((event.target as HTMLElement).closest("a")) setMobileOpen(false);
              }}
            >
              {navigation.map((item, index) => (
                <div key={item.label}>
                  <span>0{index + 1}</span>
                  <Link href={item.href}>
                    {item.label}
                    <small>{item.title}</small>
                  </Link>
                  <div>
                    {item.links.map((link) => (
                      <Link key={link.href} href={link.href}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="s2-footer">
      <div className="s2-footer__cta">
        <figure>
          <img src={assetPath("field-01.jpg")} alt="" />
        </figure>
        <div>
          <p>PROJECT CONSULTATION</p>
          <h2>
            <span>정확한 엔지니어링과</span>
            <span>책임 준공으로 답합니다.</span>
          </h2>
          <span>
            토목·건축·외부 인프라 프로젝트의 초기 여건 검토부터 시공·품질 관리까지, 현장의 기준을 끝까지 지키는 파트너가 되겠습니다.
          </span>
          <Link href="/contact">
            프로젝트 문의 <ArrowUpRight />
          </Link>
        </div>
      </div>

      <div className="s2-footer__body">
        <div>
          <BrandMark inverse />
          <p>{company.nameEn}</p>
          <span className="s2-footer__tagline">토목 · 건축 · 외부시설 통합 수행 기업</span>
        </div>

        <dl aria-label="기업 기본 정보">
          <div>
            <dt>COMPANY</dt>
            <dd>{company.legalName} ({company.name})</dd>
          </div>
          <div>
            <dt>CEO / REG.</dt>
            <dd>
              대표자: {company.ceo ?? "업체 확인 후 고시"} · 사업자등록번호: {company.businessNumber ?? "확인 후 고시"}
            </dd>
          </div>
          <div>
            <dt>LICENSE</dt>
            <dd>{company.licenseInfo ?? "보유 건설업 면허·등록번호 확인 후 고시"}</dd>
          </div>
          <div>
            <dt>CONTACT</dt>
            <dd>
              전화: {company.phone ?? "대표번호 등록 준비 중"} · 이메일: {company.email ?? "대표 이메일 등록 준비 중"}
            </dd>
          </div>
          <div>
            <dt>OFFICE</dt>
            <dd>{company.address ?? "본사 도로명 주소 확인 후 고시"}</dd>
          </div>
        </dl>

        <nav aria-label="하단 바로가기">
          <Link href="/company">기업정보</Link>
          <Link href="/business">사업영역</Link>
          <Link href="/projects">프로젝트</Link>
          <Link href="/quality">품질·안전</Link>
          <Link href="/contact">프로젝트 문의</Link>
        </nav>

        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="맨 위로 이동">
          <ArrowUp />
          <span>TOP</span>
        </button>
      </div>

      <div className="s2-footer__legal">
        <div className="s2-footer__policy-links" aria-label="법적 고지 메뉴">
          <Link href="/privacy" className="is-privacy">
            개인정보처리방침
          </Link>
          <Link href="/terms">이용약관</Link>
          <Link href="/email-policy">이메일무단수집거부</Link>
        </div>
        <div className="s2-footer__copyright">
          <small>{company.copyright}</small>
          <span>확인되지 않은 사업자 식별정보·수행실적은 임의로 기재하지 않으며, 공식 서류 확인 후 고시합니다.</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteFrame({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  useEffect(() => {
    if (!scrollToRouteSection(location)) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return (
    <div
      className="s2-site"
      onClickCapture={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = (event.target as Element).closest("a[href]");
        if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== "_self") || link.origin !== window.location.origin) return;
        const base = import.meta.env.BASE_URL.replace(/\/$/, "");
        if (base && link.pathname !== base && !link.pathname.startsWith(`${base}/`)) return;
        const next = normalizeRoute(link.pathname.slice(base.length));
        if (next === normalizeRoute(location) && sectionTargets[next]) window.requestAnimationFrame(() => scrollToRouteSection(next));
      }}
    >
      <SiteHeader />
      <noscript>
        <nav className="s2-no-js-nav" aria-label="주요 메뉴">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.title}
            </Link>
          ))}
        </nav>
      </noscript>
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  index,
  eyebrow,
  title,
  description,
  image,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
}) {
  return (
    <section className="s2-page-hero">
      <img src={assetPath(image)} alt="" />
      <div className="s2-page-hero__veil" />
      <div className="s2-page-hero__copy">
        <span>{index}</span>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <strong>{description}</strong>
      </div>
      <div className="s2-page-hero__mark">
        DONGSEONG
        <br />
        CONSTRUCTION
      </div>
    </section>
  );
}

export function SectionNav({ items }: { items: Array<{ label: string; href: string }> }) {
  const [location] = useLocation();
  return (
    <>
      <nav className="s2-section-nav s2-section-nav--script" aria-label="페이지 섹션">
        {items.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={normalizeRoute(location) === normalizeRoute(item.href) ? "is-active" : ""}
            aria-current={normalizeRoute(location) === normalizeRoute(item.href) ? "page" : undefined}
          >
            <span>0{index + 1}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <noscript>
        <nav className="s2-section-nav" aria-label="페이지 섹션">
          {items.map((item, index) => (
            <a key={item.href} href={item.href.includes("#") ? `#${item.href.split("#")[1]}` : item.href}>
              <span>0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </noscript>
    </>
  );
}

export function LegalSubNav() {
  const [location] = useLocation();
  const normalized = normalizeRoute(location);
  const links = [
    { href: "/privacy", label: "개인정보처리방침" },
    { href: "/terms", label: "이용약관" },
    { href: "/email-policy", label: "이메일무단수집거부" },
  ];
  return (
    <nav className="s2-legal-tabs" aria-label="법적 고지 문서 선택">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={normalized === item.href ? "is-active" : ""}
          aria-current={normalized === item.href ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`s2-reveal ${className}`}>
      {children}
    </div>
  );
}
