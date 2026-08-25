/**
 * Design reference: a precise Korean contractor website reconstruction.
 * This file keeps a calm white header, construction-blue hierarchy, direct phone and email contact actions, a restrained Samsung C&T-inspired dropdown navigation, and optional image-led page banners.
 */
import { Link, useLocation } from "wouter";
import { ArrowUp, ArrowUpRight, ChevronDown, ChevronRight, Mail, Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
      <span className="brand-mark__crop" aria-hidden="true"><img src="/dongseong-logo-source.jpg" alt="" /></span>
      <span className="brand-mark__name"><b>동성건설</b><small>DONGSEONG CONSTRUCTION</small></span>
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
        <BrandMark />
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
            <BrandMark />
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
    <section className={`page-title ${image ? "page-title--image" : ""}`} style={image ? { backgroundImage: `url(${image})` } : undefined}>
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
      <div className="footer-main">
        <BrandMark inverse />
        <div className="footer-info">
          <p>동성건설(주) · 서울특별시 ○○구 현장로 24, 202호</p>
          <small>Copyright © DONGSEONG CONSTRUCTION. All rights reserved.</small>
        </div>
        <div className="footer-call"><span>CONTACT</span><a href="tel:010-0000-0000">010-0000-0000</a><a className="footer-call__email" href="mailto:contact@dongseong-con.co.kr">contact@dongseong-con.co.kr</a></div>
        <button className="footer-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="맨 위로 이동"><ArrowUp size={25} /></button>
      </div>
      <div className="footer-bottom">
        <div>
          <a href="#privacy">개인정보처리방침</a>
          <a href="#terms">이용약관</a>
          <a href="#email">이메일무단수집거부</a>
        </div>
        <p>동성건설은 안전과 품질을 최우선으로 현장을 완성합니다.</p>
      </div>
    </footer>
  );
}

export function FloatingContactCard() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"phone" | "email" | null>(null);
  const phone = "010-0000-0000";
  const email = "contact@dongseong-con.co.kr";

  const copyToClipboard = async (value: string, type: "phone" | "email") => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const input = document.createElement("textarea");
        input.value = value;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      setCopied(type);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  const handlePhoneClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(min-width: 721px)").matches) {
      event.preventDefault();
      void copyToClipboard(phone, "phone");
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <aside className={`floating-contact ${open ? "is-open" : ""}`} aria-label="상담 문의">
      <div id="floating-contact-panel" className="floating-contact__panel" role="dialog" aria-label="대표 연락처" aria-hidden={!open}>
        <p>CONTACT</p>
        <strong>상담 문의</strong>
        <a href={`tel:${phone}`} className="floating-contact__copy-target" tabIndex={open ? 0 : -1} onClick={handlePhoneClick} aria-label="대표번호: 모바일에서는 전화 연결, PC에서는 번호 복사"><Phone size={18} aria-hidden="true" /><span><small>대표번호</small><b>{phone}</b></span><em>{copied === "phone" ? "복사됨" : "복사"}</em></a>
        <button type="button" className="floating-contact__detail floating-contact__copy-target" tabIndex={open ? 0 : -1} onClick={() => void copyToClipboard(email, "email")} aria-label="대표 이메일 복사"><Mail size={18} aria-hidden="true" /><span><small>대표 이메일</small><b>{email}</b></span><em>{copied === "email" ? "복사됨" : "복사"}</em></button>
      </div>
      <div className="floating-contact__actions">
        <button type="button" className="floating-contact__trigger" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="floating-contact-panel">
          <span className="floating-contact__icon"><Phone size={27} aria-hidden="true" /></span>
          <span className="floating-contact__copy"><small>CONSULTATION</small><strong>상담 문의</strong></span>
          <ChevronDown size={17} aria-hidden="true" />
        </button>
        <Link href="/consultation" className="floating-contact__consult-link" onClick={() => setOpen(false)} aria-label="온라인 상담 신청 페이지로 이동"><span>온라인<br />상담</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </aside>
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
      <FloatingContactCard />
    </div>
  );
}
