import { PageHero, SiteFrame } from "@/components/SiteShell";
import { company } from "@/config/company";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowUpRight, Copy, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "wouter";

export default function Contact() {
  usePageMeta("프로젝트 문의", "프로젝트 조건을 정리해 이메일 문의 초안을 만드는 동성건설 문의 페이지");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `[PROJECT INQUIRY] ${String(data.get("projectType") ?? "프로젝트 문의")}`;
    const body = [
      `회사/담당자: ${data.get("organization")} / ${data.get("manager")}`,
      `연락처: ${data.get("phone")}`,
      `프로젝트 종류: ${data.get("projectType")}`,
      `현장 지역: ${data.get("region")}`,
      `예상 시기: ${data.get("timing")}`,
      "",
      String(data.get("details") ?? ""),
    ].join("\n");

    try { await navigator.clipboard.writeText(`${subject}\n\n${body}`); } catch { /* mail client still opens */ }
    setMessage(company.email ? "이메일 작성 화면을 열었습니다." : "대표 이메일이 아직 등록되지 않아 받는 사람은 직접 지정해야 합니다. 문의 내용은 클립보드에 복사했습니다.");
    window.location.href = `mailto:${company.email ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <SiteFrame>
      <PageHero index="06" eyebrow="CONTACT" title="프로젝트 문의" description="현장의 핵심 조건을 먼저 정리해 프로젝트 검토를 준비합니다." image="/field-02.jpg" />
      <section className="s2-contact-page">
        <div className="s2-contact-page__intro"><p>PROJECT INQUIRY</p><h2>프로젝트의 시작에 필요한<br />정보를 정리해 주세요.</h2><span>이 페이지는 입력 내용을 서버나 브라우저 저장소에 보관하지 않습니다. 제출 시 사용자의 이메일 프로그램으로 문의 초안을 엽니다.</span></div>
        <form className="s2-inquiry-form" onSubmit={submit}>
          <div><label htmlFor="organization">회사명</label><input id="organization" name="organization" autoComplete="organization" required /></div>
          <div><label htmlFor="manager">담당자</label><input id="manager" name="manager" autoComplete="name" required /></div>
          <div><label htmlFor="phone">연락처</label><input id="phone" name="phone" type="tel" autoComplete="tel" required /></div>
          <div><label htmlFor="projectType">프로젝트 종류</label><select id="projectType" name="projectType" required defaultValue=""><option value="" disabled>선택</option><option>토목</option><option>건축</option><option>외부시설</option><option>기타</option></select></div>
          <div><label htmlFor="region">현장 지역</label><input id="region" name="region" required /></div>
          <div><label htmlFor="timing">예상 시기</label><input id="timing" name="timing" placeholder="예: 협의 예정" required /></div>
          <div className="is-wide"><label htmlFor="details">문의 내용</label><textarea id="details" name="details" rows={7} required /></div>
          <label className="s2-inquiry-form__agreement"><input type="checkbox" required /> <span><Link href="/privacy">개인정보 처리 안내</Link>를 확인했습니다. 입력 내용은 사이트에 저장되지 않으며 이메일 프로그램으로 전달됩니다.</span></label>
          {!company.email && <p className="s2-inquiry-form__notice"><Mail /> 대표 이메일 미등록 상태입니다. 이메일 작성 화면에서 받는 사람을 직접 지정해야 합니다.</p>}
          <button type="submit">이메일 문의 작성 <ArrowUpRight /></button>
          {message && <output aria-live="polite"><Copy /> {message}</output>}
        </form>
      </section>
      <section className="s2-contact-info">
        <header><p>CONTACT INFORMATION</p><h2>기업 연락처</h2></header>
        <dl><div><dt>PHONE</dt><dd>{company.phone ?? "등록 준비 중"}</dd></div><div><dt>E-MAIL</dt><dd>{company.email ?? "등록 준비 중"}</dd></div><div><dt>OFFICE</dt><dd>{company.address ?? "등록 준비 중"}</dd></div><div><dt>HOURS</dt><dd>{company.hours ?? "등록 준비 중"}</dd></div></dl>
      </section>
    </SiteFrame>
  );
}
