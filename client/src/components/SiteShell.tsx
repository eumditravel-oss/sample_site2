/**
 * Design reference: a precise Korean contractor website reconstruction.
 * This file keeps a calm white header, construction-blue hierarchy, direct phone and email contact actions, a restrained Samsung C&T-inspired dropdown navigation, and optional image-led page banners.
 */
import { Link, useLocation } from "wouter";
import { ArrowUp, ArrowUpRight, ChevronDown, ChevronRight, Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/assets";

const navItems = [
  {
    label: "회사소개", href: "/company",
    links: [{ label: "인사말", href: "/company" }, { label: "오시는길", href: "/location" }],
  },
  {
    label: "서비스안내", href: "/services/scope",
    links: [{ label: "공정 범위", href: "/services/scope" }, { label: "고객과의 약속", href: "/services/promise" }],
  },
  {
    label: "온라인상담", href: "/consultation",
    links: [{ label: "온라인상담", href: "/consultation" }, { label: "상담 리스트", href: "/consultation/list" }],
  },
  {
    label: "공지사항", href: "/notices",
    links: [{ label: "공지사항", href: "/notices" }, { label: "상담 전 확인사항", href: "/notices/pre-check" }],
  },
  {
    label: "기술 소개", href: "/gallery",
    links: [{ label: "기술 소개", href: "/gallery" }],
  },
];

const subNavigation = {
  company: { label: "회사소개", items: navItems[0].links },
  services: { label: "서비스안내", items: navItems[1].links },
  consultation: { label: "온라인상담", items: navItems[2].links },
  notices: { label: "공지사항", items: navItems[3].links },
  gallery: { label: "기술 소개", items: navItems[4].links },
} as const;

export function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className={`brand-mark ${inverse ? "brand-mark--inverse" : ""}`} aria-label="동성건설 홈으로 이동">
      <img src={assetPath(inverse ? "dongseong-logo-white.svg" : "dongseong-logo.svg")} alt="동성건설 주식회사" />
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<number | null>(null);
  const [location, setLocation] = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  const closeMega = () => setActiveMega(null);
  const toggleMega = (index: number) => setActiveMega((current) => current === index ? null : index);
  const isPrimaryActive = (index: number) => {
    if (index === 0) return location === "/company" || location === "/location";
    if (index === 1) return location === "/services" || location.startsWith("/services/");
    if (index === 2) return location === "/consultation" || location.startsWith("/consultation/");
    if (index === 3) return location === "/notices" || location.startsWith("/notices/");
    return location === "/gallery";
  };
  const navigateToPrimaryItem = (index: number) => {
    closeMega();
    setLocation(navItems[index].links[0].href);
  };
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMega();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  const handleHeaderBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (!headerRef.current?.contains(event.relatedTarget as Node | null)) closeMega();
  };

  return (
    <header
      className={location === "/" ? "site-header site-header--home" : "site-header"}
      ref={headerRef}
      onMouseLeave={closeMega}
      onBlur={handleHeaderBlur}
      onKeyDown={(event) => { if (event.key === "Escape") closeMega(); }}
    >
      <div className="site-header__inner">
        <BrandMark inverse={location === "/"} />
        <nav className="desktop-nav" aria-label="주요 메뉴">
          {navItems.map((item, index) => (
            <div className={`desktop-nav__item ${activeMega === index ? "is-open" : ""}`} key={item.label} onMouseEnter={() => setActiveMega(index)}>
              <button
                type="button"
                className={isPrimaryActive(index) || activeMega === index ? "is-active" : ""}
                aria-expanded={activeMega === index}
                aria-controls={`submenu-${index}`}
                onFocus={() => setActiveMega(index)}
                aria-haspopup="menu"
                onClick={() => navigateToPrimaryItem(index)}
              >
                {item.label}<ChevronDown size={12} aria-hidden="true" />
              </button>
              <div id={`submenu-${index}`} className="desktop-nav__submenu" aria-hidden={activeMega !== index}>
                {item.links.map((link) => <Link key={link.label} href={link.href} onClick={closeMega} role="menuitem">{link.label}</Link>)}
              </div>
            </div>
          ))}
        </nav>
        <button className="menu-button" type="button" onClick={() => setOpen(true)} aria-label="메뉴 열기">
          <Menu size={25} />
        </button>
      </div>

      {open && (
        <div className="mobile-nav-panel" role="dialog" aria-modal="true" aria-label="모바일 메뉴">
          <div className="mobile-nav-panel__top">
            <BrandMark inverse />
            <button className="menu-button" type="button" onClick={() => setOpen(false)} aria-label="메뉴 닫기">
              <X size={26} />
            </button>
          </div>
          <p className="mobile-nav-panel__label">MENU</p>
          <nav aria-label="모바일 주요 메뉴">
            {navItems.map((item, index) => (
              <div className="mobile-nav-group" key={item.label}>
                <button type="button" onClick={() => toggleMega(index)} aria-expanded={activeMega === index}>
                  {item.label}<ChevronDown size={20} />
                </button>
                <div className={activeMega === index ? "mobile-nav-sub is-open" : "mobile-nav-sub"}>
                  {item.links.map((link) => <Link key={link.label} href={link.href} onClick={() => setOpen(false)}>{link.label}<ChevronRight size={14} /></Link>)}
                </div>
              </div>
            ))}
          </nav>
          <a className="mobile-nav-panel__contact" href="tel:010-0000-0000"><Phone size={17} /> 빠른 전화 문의 <b>010-0000-0000</b></a>
        </div>
      )}
    </header>
  );
}

export function PhoneAside() {
  return (
    <aside className="phone-aside">
      <span className="eyebrow">PHONE CONSULTATION</span>
      <strong>빠른 문의 안내</strong>
      <a href="tel:010-0000-0000">010-0000-0000</a>
      <p>현장 조건과 일정에 맞춰<br />빠르게 안내해 드립니다.</p>
    </aside>
  );
}

export function SubNavigation({ section }: { section: keyof typeof subNavigation }) {
  const [location] = useLocation();
  const menu = subNavigation[section];
  return (
    <aside className="sub-navigation" aria-label={`${menu.label} 내부 메뉴`}>
      <div className="sub-navigation__header">
        <span>SECTION</span>
        <strong>{menu.label}</strong>
      </div>
      <nav>
        {menu.items.map((item) => {
          const isActive = item.href === location;
          return <Link key={item.label} href={item.href} className={isActive ? "is-active" : ""}>{item.label}<ChevronRight size={15} /></Link>;
        })}
      </nav>
    </aside>
  );
}

export function PageTitle({ title, subtitle, crumbs, image }: { title: string; subtitle: string; crumbs?: string; image?: string }) {
  return (
    <section className={`page-title ${image ? "page-title--image" : ""}`} style={image ? { backgroundImage: `url(${assetPath(image)})` } : undefined}>
      <div className="page-title__inner">
        <p className="eyebrow">{subtitle}</p>
        <h1>{title}</h1>
        <p className="breadcrumbs">홈 <span>/</span> {crumbs ?? title}</p>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inquiry">
        <div className="footer-inquiry__copy">
          <span>START A PROJECT</span>
          <h2>새로운 현장의 시작,<br />동성건설과 상의하세요.</h2>
        </div>
        <Link href="/consultation" className="footer-inquiry__link">
          <span>프로젝트 문의하기</span><ArrowUpRight size={30} aria-hidden="true" />
        </Link>
      </div>
      <div className="footer-main">
        <div className="footer-main__identity">
          <BrandMark />
          <p>기준을 지키는 시공,<br />현장에 남는 신뢰.</p>
        </div>
        <div className="footer-main__contact">
          <span>OFFICE</span>
          <address>서울특별시 ○○구 현장로 24, 202호</address>
          <a href="tel:010-0000-0000">010-0000-0000</a>
          <a href="mailto:contact@dongseong-con.co.kr">contact@dongseong-con.co.kr</a>
        </div>
        <nav className="footer-main__nav" aria-label="하단 메뉴">
          <Link href="/company">회사소개</Link>
          <Link href="/services/scope">사업영역</Link>
          <Link href="/gallery">기술소개</Link>
          <Link href="/notices">공지사항</Link>
        </nav>
        <button className="footer-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="맨 위로 이동">
          <ArrowUp size={22} /><span>BACK TO TOP</span>
        </button>
      </div>
      <div className="footer-bottom">
        <small>© DONGSEONG CONSTRUCTION CO., LTD.</small>
        <div>
          <a href="#privacy">개인정보처리방침</a>
          <a href="#terms">이용약관</a>
          <a href="#email">이메일무단수집거부</a>
        </div>
      </div>
    </footer>
  );
}

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isServiceRoute = location === "/services" || location.startsWith("/services/");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location]);

  return (
    <div className="site-frame">
      <SiteHeader />
      <main key={isServiceRoute ? location : undefined} className={isServiceRoute ? "site-frame__main site-frame__main--service" : "site-frame__main"}>{children}</main>
      <SiteFooter />
    </div>
  );
}
