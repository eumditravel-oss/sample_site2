import { company } from "@/config/company";
import { assetPath } from "@/lib/assets";
import { ArrowUp, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";

const navigation = [
  { label: "COMPANY", title: "기업정보", href: "/company", links: [{ label: "회사소개", href: "/company" }, { label: "경영철학", href: "/company/philosophy" }] },
  { label: "BUSINESS", title: "사업영역", href: "/business", links: [{ label: "토목", href: "/business/civil" }, { label: "건축", href: "/business/architecture" }, { label: "외부시설", href: "/business/field" }] },
  { label: "PROJECT", title: "프로젝트", href: "/projects", links: [{ label: "프로젝트 아카이브", href: "/projects" }] },
  { label: "QUALITY", title: "품질·안전", href: "/quality", links: [{ label: "품질관리", href: "/quality" }, { label: "안전관리", href: "/quality/safety" }] },
  { label: "NEWS", title: "소식", href: "/news", links: [{ label: "공지사항", href: "/news" }] },
  { label: "CONTACT", title: "프로젝트 문의", href: "/contact", links: [{ label: "프로젝트 문의", href: "/contact" }] },
] as const;

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
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const active = (href: string) => href === "/" ? location === "/" : location === href || location.startsWith(`${href}/`);
  const inverse = isHome && !scrolled;

  return (
    <header className={`s2-header ${inverse ? "is-overlay" : "is-solid"}`}>
      <a className="s2-skip" href="#main-content">본문 바로가기</a>
      <div className="s2-header__inner">
        <BrandMark inverse={inverse} />
        <nav className="s2-desktop-nav" aria-label="주요 메뉴">
          {navigation.map((item) => (
            <div className="s2-nav-item" key={item.label}>
              <Link href={item.href} className={active(item.href) ? "is-active" : ""} aria-current={active(item.href) ? "page" : undefined}>
                <span>{item.label}</span><small>{item.title}</small><ChevronDown size={13} aria-hidden="true" />
              </Link>
              <div className="s2-nav-item__panel">
                {item.links.map((link) => <Link key={link.href} href={link.href}>{link.label}<ArrowUpRight size={13} /></Link>)}
              </div>
            </div>
          ))}
        </nav>
        <button className="s2-menu-button" type="button" onClick={() => setMobileOpen(true)} aria-label="전체 메뉴 열기"><Menu /></button>
      </div>

      <div className={`s2-mobile-menu ${mobileOpen ? "is-open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="s2-mobile-menu__top"><BrandMark inverse /><button type="button" onClick={() => setMobileOpen(false)} aria-label="전체 메뉴 닫기"><X /></button></div>
        <p>PROJECT-DRIVEN CONSTRUCTION</p>
        <nav aria-label="모바일 주요 메뉴">
          {navigation.map((item, index) => (
            <div key={item.label}>
              <span>0{index + 1}</span>
              <Link href={item.href}>{item.label}<small>{item.title}</small></Link>
              <div>{item.links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</div>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="s2-footer">
      <div className="s2-footer__cta">
        <figure><img src={assetPath("field-01.jpg")} alt="" /></figure>
        <div>
          <p>PROJECT INQUIRY</p>
          <h2>조건을 이해하는 것부터<br />프로젝트는 시작됩니다.</h2>
          <span>현장 지역과 일정, 공사 범위를 정리해 주시면 검토를 위한 문의 초안을 만들 수 있습니다.</span>
          <Link href="/contact">프로젝트 문의 <ArrowUpRight /></Link>
        </div>
      </div>
      <div className="s2-footer__body">
        <div><BrandMark inverse /><p>{company.nameEn}</p></div>
        <dl>
          <div><dt>CONTACT</dt><dd>{company.phone ?? "대표번호 등록 준비 중"}</dd></div>
          <div><dt>E-MAIL</dt><dd>{company.email ?? "대표 이메일 등록 준비 중"}</dd></div>
          <div><dt>OFFICE</dt><dd>{company.address ?? "사업장 정보 등록 준비 중"}</dd></div>
        </dl>
        <nav aria-label="하단 메뉴"><Link href="/company">Company</Link><Link href="/business">Business</Link><Link href="/projects">Project</Link><Link href="/privacy">Privacy</Link></nav>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="맨 위로 이동"><ArrowUp /><span>TOP</span></button>
      </div>
      <div className="s2-footer__legal"><small>{company.copyright}</small><span>등록되지 않은 회사 정보는 임의로 표시하지 않습니다.</span></div>
    </footer>
  );
}

export function SiteFrame({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); }, [location]);
  return <div className="s2-site"><SiteHeader /><main id="main-content">{children}</main><SiteFooter /></div>;
}

export function PageHero({ index, eyebrow, title, description, image }: { index: string; eyebrow: string; title: string; description: string; image: string }) {
  return (
    <section className="s2-page-hero">
      <img src={assetPath(image)} alt="" />
      <div className="s2-page-hero__veil" />
      <div className="s2-page-hero__copy"><span>{index}</span><p>{eyebrow}</p><h1>{title}</h1><strong>{description}</strong></div>
      <div className="s2-page-hero__mark">DONGSEONG<br />CONSTRUCTION</div>
    </section>
  );
}

export function SectionNav({ items }: { items: Array<{ label: string; href: string }> }) {
  const [location] = useLocation();
  return <nav className="s2-section-nav" aria-label="페이지 섹션">{items.map((item, index) => <Link key={item.href} href={item.href} className={location === item.href ? "is-active" : ""}><span>0{index + 1}</span>{item.label}</Link>)}</nav>;
}

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { element.classList.add("is-visible"); observer.disconnect(); } }, { threshold: .15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`s2-reveal ${className}`}>{children}</div>;
}
