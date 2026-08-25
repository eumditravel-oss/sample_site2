/**
 * Design reference: a contractor home page with practical work scopes, clear inquiry paths, reversible scroll reveals, and a first-screen construction briefing.
 */
import { ArrowLeft, ArrowRight, Check, ChevronRight, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const heroImages = [
  "/field-01.jpg",
  "/field-02.jpg",
  "/field-03.jpg",
];

const serviceCards = [
  { eyebrow: "동성건설", title: "인사말", href: "/company", image: heroImages[0] },
  { eyebrow: "Service Guide", title: "서비스안내", href: "/services/scope", image: heroImages[1] },
  { eyebrow: "Field Archive", title: "기술 소개", href: "/gallery", image: heroImages[2] },
  { eyebrow: "Location", title: "오시는길", href: "/location", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85" },
];

const notices = [
  "현장 상담 전 확인하면 좋은 안내 사항입니다.",
  "작업 가능 지역과 일정 안내",
  "견적 문의 시 필요한 정보",
  "안전한 현장 진행을 위한 약속",
  "개인정보 처리 기준 안내",
];

const consultationAttachmentRules = {
  maxCount: 3,
  maxBytes: 2 * 1024 * 1024,
  acceptedTypes: ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"] as const,
};

const galleryItems = [
  { title: "보행로 정비", image: heroImages[0] },
  { title: "경계석 시공", image: heroImages[1] },
  { title: "블록 포장", image: heroImages[2] },
  { title: "배수로 정비", image: heroImages[0] },
  { title: "부대시설 보수", image: heroImages[1] },
];

const technologyCards = [
  { category: "보행 동선", title: "보행로 정비", description: "보행 폭과 단차, 배수 방향을 함께 살펴 필요한 정비 범위를 확인합니다.", image: heroImages[0] },
  { category: "경계 마감", title: "경계 구조 시공", description: "기초 높이와 선형, 진입부 연결을 확인해 경계석 마감 기준을 잡습니다.", image: heroImages[1] },
  { category: "포장 공정", title: "블록 포장 공정", description: "포장 상태와 배수 마감을 점검해 작업 구간별 공정을 안내합니다.", image: heroImages[2] },
  { category: "기반 정리", title: "기반 시설 정비", description: "기존 시설물과 작업 동선을 확인해 보수 전 필요한 준비 공정을 정리합니다.", image: heroImages[0] },
  { category: "마감 보수", title: "외부 공간 마감", description: "경계·포장·주변 시설의 연결 상태를 살펴 마감 보수 범위를 안내합니다.", image: heroImages[1] },
  { category: "완료 확인", title: "완료 현장 기록", description: "작업 구간과 마감 상태를 확인해 완료 후 점검해야 할 항목을 남깁니다.", image: heroImages[2] },
];

const siteStandards = [
  { index: "01", title: "현장 조건부터 확인합니다.", description: "작업 위치, 차량 진입, 배수와 기존 시설물을 먼저 살피고 필요한 공정을 정리합니다." },
  { index: "02", title: "범위와 일정을 분명하게 안내합니다.", description: "필요한 작업과 제외 범위를 구분하고, 현장 상황에 맞는 진행 시점을 함께 검토합니다." },
  { index: "03", title: "기초와 마감의 연결을 관리합니다.", description: "보이지 않는 기반부터 보행·배수·경계 마감까지 공정 간의 연결을 놓치지 않습니다." },
  { index: "04", title: "완료 뒤에도 확인할 수 있게 남깁니다.", description: "작업 전후의 상태와 완료 기준을 공유해 현장의 결과를 함께 점검할 수 있도록 합니다." },
];

const processSteps = [
  { index: "01", label: "CONSULT", title: "상담 접수", description: "작업 위치와 필요한 공정, 희망 시점을 남겨주세요.", href: "/consultation" },
  { index: "02", label: "CHECK", title: "현장 확인", description: "접수 내용을 바탕으로 현장 조건과 검토할 항목을 확인합니다.", href: "/consultation" },
  { index: "03", label: "ESTIMATE", title: "견적 안내", description: "작업 범위와 자재·일정을 정리해 진행 기준을 안내합니다.", href: "/consultation" },
  { index: "04", label: "WORK", title: "시공 진행", description: "공정 순서와 현장 동선을 고려해 안전하게 작업을 진행합니다.", href: "/services/scope" },
  { index: "05", label: "REVIEW", title: "완료 확인", description: "마감 상태와 사용 동선을 확인하고 필요한 안내를 마무리합니다.", href: "/consultation" },
];

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!window.IntersectionObserver) {
      element.classList.add("is-revealed");
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-revealed", entry.isIntersecting);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`scroll-reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return (
    <div className="section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [selectedWorkIndex, setSelectedWorkIndex] = useState<number | null>(null);
  const heroWorkAreas = [
    { title: "경계 구조 시공", description: "경계석 · 연석 · 진입부", image: heroImages[1], detail: "도로와 보행 구간의 경계를 정리하는 공정입니다.", checks: ["기초 높이와 선형 확인", "보차도·진입부 연결 검토", "마감 높이와 배수 방향 점검"] },
    { title: "보행로 정비", description: "보도블록 · 배수 · 단차", image: heroImages[0], detail: "통행 동선과 포장 상태를 함께 살펴 필요한 정비 범위를 정리합니다.", checks: ["블록 침하·파손 구간 확인", "보행 폭과 단차 점검", "배수 흐름과 마감선 검토"] },
    { title: "외부 시설 보수", description: "파손 · 마감 · 안전 정비", image: heroImages[2], detail: "외부 공간의 파손·단차·마감 상태를 확인해 보수 방향을 안내합니다.", checks: ["파손 부위와 주변 마감 확인", "사용 안전과 동선 점검", "보수 후 연결부 마감 검토"] },
    { title: "현장 부대 공정", description: "관로 주변 · 정리 · 마감", image: heroImages[1], detail: "주요 공정과 함께 필요한 주변 정리와 마감 공정을 검토합니다.", checks: ["관로 주변 간섭 구간 확인", "작업 전·후 현장 정리 범위", "주요 공정과의 일정 연결 검토"] },
  ];
  const selectedWork = selectedWorkIndex === null ? null : heroWorkAreas[selectedWorkIndex];

  useEffect(() => {
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % heroImages.length), 5200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="hero" aria-label="현장 시공 메인 비주얼">
      {heroImages.map((image, index) => (
        <img key={image} className={index === current ? "hero__image is-current" : "hero__image"} src={image} alt="정돈된 기반 시설 시공 현장" />
      ))}
      <div className="hero__shade" />
      <div className="hero__information" key={current} aria-live="polite">
        <div className="hero__brief">
          <p>DONGSEONG · BUILD THE GROUND</p>
          <h1>도시의 기반을 읽고<br />더 나은 내일을 짓습니다</h1>
          <span>현장을 정확히 이해하는 기술과 끝까지 지키는 책임으로 시공의 새로운 기준을 만듭니다.</span>
        </div>
        <aside className="hero__work-panel" aria-label="주요 시공 범위">
          <ul>{heroWorkAreas.map((area, index) => <li key={area.title}><button type="button" className="hero__work-button" onClick={() => setSelectedWorkIndex(index)} aria-haspopup="dialog"><b>0{index + 1}</b><span><strong>{area.title}</strong><small>{area.description}</small></span><ArrowRight size={16} aria-hidden="true" /></button></li>)}</ul>
        </aside>
      </div>
      <div className="hero__navigation">
        <div className="hero__dots" role="tablist" aria-label="메인 비주얼 선택">
          {heroImages.map((_, index) => (
            <button key={index} type="button" className={index === current ? "is-current" : ""} onClick={() => setCurrent(index)} aria-label={`${index + 1}번 메인 비주얼`} aria-selected={index === current} />
          ))}
        </div>
        <p className="hero__counter"><b>0{current + 1}</b><span>0{heroImages.length}</span></p>
      </div>
      <Dialog open={selectedWorkIndex !== null} onOpenChange={(open) => !open && setSelectedWorkIndex(null)}>
        {selectedWork && <DialogContent className="hero-work-modal border-[#53616b] bg-[#f5f6f6] p-0 sm:max-w-3xl">
          <div className="hero-work-modal__image"><img src={selectedWork.image} alt={`${selectedWork.title} 검토 예시`} /></div>
          <div className="hero-work-modal__content"><DialogHeader><p>WORK CASE GUIDE</p><DialogTitle>{selectedWork.title}</DialogTitle><DialogDescription>{selectedWork.detail}</DialogDescription></DialogHeader><div className="hero-work-modal__checks"><strong>현장 검토 항목</strong><ul>{selectedWork.checks.map((check) => <li key={check}>{check}</li>)}</ul></div><Link href="/consultation" className="hero-work-modal__link" onClick={() => setSelectedWorkIndex(null)}>이 공정 상담하기 <ArrowRight size={15} /></Link></div>
        </DialogContent>}
      </Dialog>
    </section>
  );
}

export function CompanyIntro() {
  return (
    <section className="company-intro company-intro--hansol">
      <Reveal className="company-intro__heading">
        <h2>원칙을 지키는 시공,<br />결과로 증명하는 <em>기술</em></h2>
        <span>안전과 품질을 기본으로, 시작부터 준공까지 책임 있게 완성합니다.</span>
      </Reveal>
      <div className="service-cards service-cards--panels">
        {serviceCards.map((card) => (
          <Link href={card.href} className="service-card" key={card.title}>
            <div className="service-card__image"><img src={card.image} alt="" /></div>
            <div className="service-card__shade" />
            <div className="service-card__body">
              <span className="service-card__eyebrow">{card.eyebrow}</span>
              <strong>{card.title}</strong>
              <span className="service-card__action" aria-hidden="true"><ChevronRight size={22} /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SiteStandards() {
  return (
    <section className="site-standards" aria-labelledby="site-standards-title">
      <Reveal className="site-standards__frame">
        <div className="site-standards__intro">
          <p className="eyebrow">FIELD STANDARD</p>
          <h2 id="site-standards-title">현장 기준을<br /><em>먼저 확인합니다.</em></h2>
          <span>완성도는 눈에 보이는 마감만이 아니라, 시작 전 확인과 공정 사이의 연결에서 만들어집니다.</span>
          <Link href="/services/scope" className="site-standards__link">공정 범위 확인하기 <ArrowRight size={17} /></Link>
        </div>
        <div className="site-standards__grid">
          {siteStandards.map((standard) => (
            <article className="site-standard" key={standard.index}>
              <span className="site-standard__index">{standard.index}</span>
              <h3>{standard.title}</h3>
              <p>{standard.description}</p>
              <ArrowRight className="site-standard__arrow" size={18} aria-hidden="true" />
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function ServiceScope() {
  const serviceScope = [
    { title: "경계 구조", scope: "경계석 · 연석 · 진입부", description: "도로 경계와 보차도 구분이 필요한 구간을 현장 동선에 맞춰 검토합니다." },
    { title: "보행로 정비", scope: "보도블록 · 보행 동선 · 배수", description: "통행 안전과 배수 흐름을 고려해 포장 상태와 필요한 정비 범위를 확인합니다." },
    { title: "외부 시설 보수", scope: "단차 · 파손 · 마감 보수", description: "파손되거나 높이 차가 생긴 시설물을 점검하고 보수 방향을 안내합니다." },
    { title: "현장 부대 공정", scope: "관로 주변 · 정리 · 마감", description: "주요 시공과 함께 필요한 주변 정리와 보조 공정을 함께 검토합니다." },
  ];

  return (
    <section className="home-service-scope" aria-labelledby="home-service-scope-title">
      <Reveal className="home-service-scope__frame">
        <div className="home-service-scope__lead">
          <p className="eyebrow">WORK AREAS</p>
          <h2 id="home-service-scope-title">현장별 <em>업무 영역</em>을<br />빠르게 확인하세요.</h2>
          <span>경계 구조, 보행로 정비, 외부 시설 보수 등 현장에 필요한 작업 범위를 한눈에 안내합니다.</span>
          <div className="home-service-scope__summary"><span>주요 시공 범위</span></div>
          <div className="home-service-scope__checks" aria-label="상담 전 확인 항목">
            <strong>상담 전 확인 항목</strong>
            <ul><li>현장 위치</li><li>작업 구간</li><li>희망 시기</li></ul>
          </div>
          <Link href="/services/scope" className="home-service-scope__link">공정 범위 자세히 보기 <ArrowRight size={17} /></Link>
        </div>
        <div className="home-service-scope__details">
          <ol className="home-service-scope__list">
            {serviceScope.map((service, index) => (
              <li key={service.title}>
                <Link href="/services/scope">
                  <span>0{index + 1}</span>
                  <div><h3>{service.title}</h3><small>{service.scope}</small><p>{service.description}</p></div>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}

export function PromiseBand() {
  const promises = [
    "견적 전 현장 위치·작업 범위·진입 여건을 확인합니다.",
    "포함·제외 공정과 예정 일정을 구분해 안내합니다.",
    "현장 여건에 따른 변경 사항은 작업 전 협의합니다.",
    "작업 완료 후 요청 범위와 마감 상태를 함께 확인합니다.",
  ];

  return (
    <section className="promise-band" aria-labelledby="promise-band-title">
      <Reveal className="promise-band__frame">
        <div className="promise-band__lead">
          <p>OUR PROMISE</p>
          <h2 id="promise-band-title">고객과의 약속</h2>
          <span>상담부터 완료 확인까지, 현장에서 지켜야 할 기본을 분명하게 안내합니다.</span>
        </div>
        <ol className="promise-band__list">
          {promises.map((promise, index) => (
            <li key={promise}><b>0{index + 1}</b><Check size={17} aria-hidden="true" /><span>{promise}</span></li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}

export function ProcessSteps() {
  return (
    <section className="work-process" aria-labelledby="work-process-title">
      <Reveal className="work-process__heading">
        <p className="eyebrow">WORKFLOW</p>
        <div>
          <h2 id="work-process-title">상담부터 완료 확인까지,<br /><em>이렇게 진행됩니다.</em></h2>
          <span>현장 확인부터 견적·시공·완료 확인까지, 각 단계에서 확인할 내용을 안내합니다.</span>
        </div>
      </Reveal>
      <Reveal className="work-process__reveal" delay={80}>
        <ol className="work-process__track">
          {processSteps.map((step, index) => (
            <li className={index === processSteps.length - 1 ? "work-process__item work-process__item--final" : "work-process__item"} key={step.index}>
              <Link href={step.href} className="work-process__step">
                <span className="work-process__index">{step.index}</span>
                <span className="work-process__label">{step.label}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <ArrowRight className="work-process__arrow" size={18} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}

export function PhoneBand() {
  return (
    <section className="phone-band">
      <div className="phone-band__texture" />
      <div className="phone-band__content">
        <p className="eyebrow">CONSULTATION</p>
        <h2>빠른 문의 안내</h2>
        <a href="tel:010-0000-0000">010-0000-0000</a>
        <p className="phone-band__keywords">작업 가능 지역 확인 · 현장 조건 검토 · 경계석 · 블록 포장 · 시설물 보수</p>
        <p className="phone-band__message">현장 조건과 희망 일정을 말씀해 주시면<br />가능한 공정과 확인할 내용을 빠르게 안내합니다.</p>
        <Link href="/consultation" className="primary-button">온라인 상담 남기기</Link>
      </div>
    </section>
  );
}

export function NoticePreview() {
  return (
    <section className="mini-panel mini-panel--notice">
      <div className="mini-panel__heading">
        <div><p className="mini-panel__eyebrow">NOTICE</p><h3>공지사항</h3></div>
        <Link href="/notices" aria-label="공지사항 전체 보기"><span>전체보기</span><ChevronRight size={17} /></Link>
      </div>
      <ul className="notice-list">
        {notices.map((notice, index) => (
          <li key={notice}>
            <Link href="/notices"><span>{notice}</span><time>0{5 - index}.18</time></Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ConsultationForm({ compact = false, desk = false }: { compact?: boolean; desk?: boolean }) {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState<File[]>([]);
  const [, setLocation] = useLocation();
  const prefill = new URLSearchParams(window.location.search);
  const prefilledWorkType = compact ? prefill.get("workType") ?? "" : "";
  const prefilledSchedule = compact ? prefill.get("schedule") ?? "" : "";
  const prefilledNotes = compact ? [prefill.get("locationReady") === "1" ? "현장 위치를 확인했습니다. 주소를 입력하겠습니다." : "", prefill.get("photoReady") === "1" ? "현장 사진·참고사항을 준비했습니다." : ""].filter(Boolean).join("\n") : "";
  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const invalidFile = files.find((file) => !(consultationAttachmentRules.acceptedTypes as readonly string[]).includes(file.type) || file.size > consultationAttachmentRules.maxBytes);
    if (files.length > consultationAttachmentRules.maxCount || invalidFile) {
      toast.error("사진·PDF·Word 파일은 최대 3개, 개당 2MB까지 첨부할 수 있습니다.");
      event.target.value = "";
      setSelectedAttachments([]);
      return;
    }
    setSelectedAttachments(files);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreed) {
      toast.error("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }
    if (!compact) {
      toast.info("상세 상담 페이지에서 제목과 비밀번호를 포함해 접수해 주세요.");
      setLocation("/consultation");
      return;
    }
    const data = new FormData(event.currentTarget);
    try {
      setSubmitting(true);
      const current = JSON.parse(localStorage.getItem("dongseong-consultations") ?? "[]") as unknown[];
      const record = {
        id: Date.now(),
        title: String(data.get("title") ?? ""),
        applicantName: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        location: String(data.get("location") ?? ""),
        workType: String(data.get("workType") ?? ""),
        schedule: String(data.get("schedule") ?? ""),
        message: String(data.get("message") ?? ""),
        password: String(data.get("password") ?? ""),
        attachments: selectedAttachments.map((file) => ({ fileName: file.name, fileSize: file.size })),
        createdAt: new Date().toISOString(),
        views: 0,
        status: "pending" as const,
      };
      localStorage.setItem("dongseong-consultations", JSON.stringify([record, ...current]));
      toast.success("상담 게시글이 이 기기에 비공개로 등록되었습니다.");
      setLocation("/consultation/list");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "상담 내용을 저장하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={`mini-panel mini-panel--form ${compact ? "mini-panel--form-full" : ""} ${desk ? "mini-panel--desk" : ""}`}>
      <div className="mini-panel__heading">
        <div><p className="mini-panel__eyebrow">ONLINE INQUIRY</p><h3>온라인상담</h3></div>
        {!compact && <Link href="/consultation" aria-label="온라인 상담 전체 보기"><span>전체보기</span><ChevronRight size={17} /></Link>}
      </div>
      <p className="form-intro">{compact ? "필수 항목을 남겨주시면 현장 확인과 견적 안내에 필요한 내용을 검토합니다." : "성함, 연락처, 현장 위치를 남겨주시면 확인 후 안내해 드립니다."}</p>
      <form className="consultation-form" onSubmit={handleSubmit}>
        <div className="form-row"><label htmlFor={compact ? "full-name" : "name"}>성함 <em>*</em></label><input id={compact ? "full-name" : "name"} name="name" required autoComplete="name" placeholder="성함을 입력하세요" /></div>
        <div className="form-row"><label htmlFor={compact ? "full-phone" : "phone"}>연락처 <em>*</em></label><input id={compact ? "full-phone" : "phone"} name="phone" required type="tel" inputMode="tel" autoComplete="tel" pattern="01[0-9]-?[0-9]{3,4}-?[0-9]{4}" placeholder="010-0000-0000" /></div>
        <div className="form-row"><label htmlFor={compact ? "full-location" : "location"}>현장 위치 <em>*</em></label><input id={compact ? "full-location" : "location"} name="location" required autoComplete="street-address" placeholder="시·군·구 또는 현장 주소" /></div>
        {compact && <>
          <div className="form-row"><label htmlFor="consultation-title">상담 제목 <em>*</em></label><input id="consultation-title" name="title" required minLength={2} maxLength={160} defaultValue={prefilledWorkType ? `${prefilledWorkType} 상담 문의` : ""} placeholder="예: 보행로 정비 견적 문의" /></div>
          <div className="form-row"><label htmlFor="work-type">공정 유형 <em>*</em></label><select id="work-type" name="workType" required defaultValue={prefilledWorkType}><option value="" disabled>공정 유형을 선택하세요</option><option value="경계 구조 시공">경계 구조 시공</option><option value="보행로·블록 정비">보행로·블록 정비</option><option value="시설물 보수">시설물 보수</option><option value="기타·부대 공정">기타·부대 공정</option></select></div>
          <div className="form-row"><label htmlFor="schedule">희망 시기 <em>*</em></label><select id="schedule" name="schedule" required defaultValue={prefilledSchedule}><option value="" disabled>희망 착수 시기를 선택하세요</option><option value="1주 이내">1주 이내</option><option value="1개월 이내">1개월 이내</option><option value="일정 협의 필요">일정 협의 필요</option></select></div>
          <div className="form-row form-row--textarea"><label htmlFor="message">문의 내용 <em>*</em></label><textarea id="message" name="message" required defaultValue={prefilledNotes} placeholder="작업 범위, 현장 상태, 참고할 내용 등을 입력해 주세요." /></div>
          <div className="form-row form-row--upload"><label htmlFor="consultation-attachments">사진·파일 첨부 <small>선택</small></label><input id="consultation-attachments" name="attachments" type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={handleAttachmentChange} /><p>사진(JPG·PNG), PDF, Word · 최대 3개 / 개당 2MB</p>{selectedAttachments.length > 0 && <ul>{selectedAttachments.map((file) => <li key={`${file.name}-${file.size}`}>{file.name} <span>{Math.ceil(file.size / 1024)}KB</span></li>)}</ul>}</div>
          <div className="form-row"><label htmlFor="consultation-password">비밀번호 <em>*</em></label><input id="consultation-password" name="password" required type="password" minLength={4} maxLength={64} autoComplete="new-password" placeholder="상세 확인에 사용할 비밀번호" /></div>
        </>}
        <label className="agreement"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} /><span><em>*</em> 개인정보 수집 및 이용에 동의합니다.</span></label>
        <button className="form-submit" type="submit" disabled={submitting}><Send size={14} /> {submitting ? "등록 중..." : compact ? "상담 신청하기" : "간편 상담 접수"}</button>
      </form>
    </section>
  );
}

export function LocationPreview() {
  return (
    <section className="mini-panel mini-panel--map">
      <div className="mini-panel__heading">
        <div><p className="mini-panel__eyebrow">LOCATION</p><h3>오시는길</h3></div>
        <Link href="/location" aria-label="오시는길 전체 보기"><span>전체보기</span><ChevronRight size={17} /></Link>
      </div>
      <div className="map-visual" aria-label="위치 안내 지도 예시">
        <div className="map-visual__road map-visual__road--one" />
        <div className="map-visual__road map-visual__road--two" />
        <div className="map-visual__road map-visual__road--three" />
        <div className="map-visual__pin"><MapPin fill="currentColor" size={30} /><span>동성건설</span></div>
      </div>
      <div className="location-preview__copy"><MapPin size={16} /><span>서울특별시 ○○구 현장로 24, 202호</span></div>
    </section>
  );
}

export function InformationGrid() {
  return (
    <section className="client-desk">
      <Reveal className="client-desk__frame">
        <NoticePreview />
        <ConsultationForm desk />
        <LocationPreview />
      </Reveal>
    </section>
  );
}

export function TechnologyShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const track = scrollRef.current;
    if (!track) return;

    const syncPageState = () => {
      if (track.clientWidth <= 0 || track.scrollWidth <= 0) {
        setPageCount(1);
        setActivePage(0);
        return;
      }
      const pages = Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth));
      setPageCount(pages);
      setActivePage(Math.min(pages - 1, Math.round(track.scrollLeft / track.clientWidth)));
    };

    const resizeObserver = new ResizeObserver(syncPageState);
    resizeObserver.observe(track);
    track.addEventListener("scroll", syncPageState, { passive: true });
    syncPageState();

    return () => {
      resizeObserver.disconnect();
      track.removeEventListener("scroll", syncPageState);
    };
  }, []);

  const goToPage = (page: number) => {
    const track = scrollRef.current;
    if (!track) return;
    const nextPage = Math.max(0, Math.min(page, pageCount - 1));
    track.scrollTo({ left: nextPage * track.clientWidth, behavior: "smooth" });
    setActivePage(nextPage);
  };

  return (
    <section className="technology-showcase">
      <Reveal className="technology-showcase__heading">
        <p>FIELD ARCHIVE</p>
        <h2><em>기술 소개</em></h2>
        <span>현장 조건에 맞춘 공정별 기술과 완성 기준을 확인하세요.</span>
      </Reveal>
      <Reveal className="technology-showcase__reveal" delay={80}>
        <div className="technology-showcase__stage">
          <button type="button" className="technology-showcase__edge technology-showcase__edge--prev" onClick={() => goToPage(activePage - 1)} disabled={activePage === 0} aria-label="이전 기술 소개 페이지"><ArrowLeft size={23} /></button>
          <div className="technology-showcase__viewport">
            <div ref={scrollRef} className="technology-showcase__track" role="list" aria-label="동성건설 기술 소개">
              {technologyCards.map((card) => (
                <Link href="/services/scope" className="technology-card" key={card.title} role="listitem">
                  <div className="technology-card__image"><img src={card.image} alt={`${card.title} 현장 예시`} /></div>
                  <div className="technology-card__content">
                    <p><i />{card.category}</p>
                    <h3>{card.title}</h3>
                    <span>{card.description}</span>
                    <b aria-hidden="true"><ArrowRight size={18} /></b>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <button type="button" className="technology-showcase__edge technology-showcase__edge--next" onClick={() => goToPage(activePage + 1)} disabled={activePage === pageCount - 1} aria-label="다음 기술 소개 페이지"><ArrowRight size={23} /></button>
        </div>
        <div className="technology-showcase__controls" aria-label="기술 소개 사진 탐색">
          <span><b>{String(activePage + 1).padStart(2, "0")}</b> — {String(pageCount).padStart(2, "0")} / 현장 기록</span>
          <div className="technology-showcase__dots" aria-label="기술 소개 페이지 선택">
            {Array.from({ length: pageCount }, (_, index) => (
              <button key={index} type="button" onClick={() => goToPage(index)} className={index === activePage ? "is-active" : ""} aria-label={`${index + 1}번째 기술 소개 페이지`} aria-current={index === activePage ? "true" : undefined} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function ContactFinal() {
  return (
    <section className="contact-final">
      <Reveal className="contact-final__inner">
        <div className="contact-final__lead">
          <p>PHONE CONSULTATION</p>
          <h2>빠른 문의 안내</h2>
        </div>
        <p className="contact-final__note"><b>평일 09:00 — 18:00</b><br />작업 범위와 현장 조건을 말씀해 주시면 빠르게 안내해 드립니다.</p>
        <div className="contact-final__action">
          <a href="tel:010-0000-0000"><Phone size={22} />010-0000-0000</a>
          <Link href="/consultation">온라인 상담 남기기 <ArrowRight size={17} /></Link>
        </div>
      </Reveal>
    </section>
  );
}

export function GalleryPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => scrollRef.current?.scrollBy({ left: direction * 330, behavior: "smooth" });

  return (
    <section className="gallery-preview">
      <SectionHeading eyebrow="FIELD ARCHIVE" title="포토갤러리" description="현장 진행과 완료된 작업 모습을 확인하세요." />
      <div className="gallery-preview__track" ref={scrollRef}>
        {galleryItems.map((item, index) => (
          <Link href="/gallery" className="gallery-preview__item" key={`${item.title}-${index}`}>
            <img src={item.image} alt={`${item.title} 예시 현장`} />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
      <div className="gallery-preview__controls">
        <button type="button" onClick={() => scroll(-1)} aria-label="이전 갤러리"><ArrowLeft size={20} /></button>
        <Link href="/gallery">전체보기 <ChevronRight size={16} /></Link>
        <button type="button" onClick={() => scroll(1)} aria-label="다음 갤러리"><ArrowRight size={20} /></button>
      </div>
    </section>
  );
}

export function PromiseList() {
  return (
    <div className="promise-list">
      {["현장 여건을 우선으로 검토합니다.", "작업 범위와 일정은 분명하게 안내합니다.", "기초부터 마감까지 균일하게 관리합니다.", "작은 문의에도 빠르게 답변합니다."].map((promise, index) => (
        <div key={promise}><span>0{index + 1}</span><p><Check size={17} /> {promise}</p></div>
      ))}
    </div>
  );
}
