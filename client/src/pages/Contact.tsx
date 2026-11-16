import { PageHero, SiteFrame } from "@/components/SiteShell";
import { company } from "@/config/company";
import { useInquiryDraft, type InquiryDraft } from "@/context/InquiryDraft";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowUpRight, Copy, Mail } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "wouter";

export default function Contact() {
  usePageMeta("프로젝트 문의", "프로젝트 조건을 정리해 이메일 문의 초안을 만드는 동성건설 문의 페이지");
  const [message, setMessage] = useState("");
  const [formReady, setFormReady] = useState(false);
  const { draft, setDraft, scrollPosition } = useInquiryDraft();
  useEffect(() => setFormReady(true), []);
  useEffect(() => {
    const saved = scrollPosition.current;
    scrollPosition.current = null;
    const frame = saved === null ? null : window.requestAnimationFrame(() => window.scrollTo({ top: saved, behavior: "instant" }));
    return () => { if (frame !== null) window.cancelAnimationFrame(frame); };
  }, [scrollPosition]);
  const updateText = (key: Exclude<keyof InquiryDraft, "agreement">) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = event.currentTarget.value;
    setDraft((previous) => ({ ...previous, [key]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
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

    const recipient = company.email ? "" : "대표 이메일이 등록되지 않아 받는 사람은 직접 지정해야 합니다. ";
    setMessage(`${recipient}이메일 프로그램이 열렸는지 확인하고 직접 보내 주세요. 입력 내용은 이 화면에 남아 있습니다.`);
    window.location.href = `mailto:${company.email ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyDraft = async () => {
    const fields: Array<[string, string]> = [
      ["회사명", draft.organization], ["담당자", draft.manager], ["연락처", draft.phone], ["프로젝트 종류", draft.projectType],
      ["현장 지역", draft.region], ["예상 시기", draft.timing], ["문의 내용", draft.details],
    ];
    const lines = fields.filter(([, value]) => value.trim()).map(([label, value]) => `${label}: ${value.trim()}`);
    if (!lines.length) { setMessage("복사할 내용이 없습니다. 문의 항목을 하나 이상 입력해 주세요."); return; }
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(`프로젝트 문의\n${lines.join("\n")}`);
      setMessage("입력한 문의 내용을 클립보드에 복사했습니다.");
    } catch {
      setMessage("클립보드 복사에 실패했습니다. 입력 내용은 이 화면에 남아 있습니다.");
    }
  };

  return (
    <SiteFrame>
      <PageHero index="06" eyebrow="CONTACT" title="프로젝트 문의" description="현장의 핵심 조건을 먼저 정리해 프로젝트 검토를 준비합니다." image="/field-02.jpg" />
      <section className="s2-contact-page">
        <div className="s2-contact-page__intro"><p>PROJECT INQUIRY</p><h2>프로젝트의 시작에 필요한<br />정보를 정리해 주세요.</h2><span>입력 내용은 서버나 브라우저 저장소에 보관되지 않으며, 새로고침하거나 탭을 닫으면 사라집니다. 제출 시 사용자의 이메일 프로그램으로 문의 초안을 엽니다.</span></div>
        <noscript><p className="s2-inquiry-disabled">문의 내용 작성 기능은 자바스크립트가 필요합니다. 브라우저에서 자바스크립트를 켠 후 다시 이용해 주세요.</p></noscript>
        <form className="s2-inquiry-form" onSubmit={submit}>
          <div><label htmlFor="organization">회사명</label><input id="organization" name="organization" autoComplete="organization" disabled={!formReady} required value={draft.organization} onChange={updateText("organization")} /></div>
          <div><label htmlFor="manager">담당자</label><input id="manager" name="manager" autoComplete="name" disabled={!formReady} required value={draft.manager} onChange={updateText("manager")} /></div>
          <div><label htmlFor="phone">연락처</label><input id="phone" name="phone" type="tel" autoComplete="tel" disabled={!formReady} required value={draft.phone} onChange={updateText("phone")} /></div>
          <div><label htmlFor="projectType">프로젝트 종류</label><select id="projectType" name="projectType" disabled={!formReady} required value={draft.projectType} onChange={updateText("projectType")}><option value="" disabled>선택</option><option>토목</option><option>건축</option><option>외부시설</option><option>기타</option></select></div>
          <div><label htmlFor="region">현장 지역</label><input id="region" name="region" disabled={!formReady} required value={draft.region} onChange={updateText("region")} /></div>
          <div><label htmlFor="timing">예상 시기</label><input id="timing" name="timing" placeholder="예: 협의 예정" disabled={!formReady} required value={draft.timing} onChange={updateText("timing")} /></div>
          <div className="is-wide"><label htmlFor="details">문의 내용</label><textarea id="details" name="details" rows={7} disabled={!formReady} required value={draft.details} onChange={updateText("details")} /></div>
          <div className="s2-inquiry-form__agreement"><input id="inquiry-agreement" type="checkbox" disabled={!formReady} required checked={draft.agreement} onChange={(event) => { const agreement = event.currentTarget.checked; setDraft((previous) => ({ ...previous, agreement })); }} /><div><label htmlFor="inquiry-agreement">개인정보 처리 안내를 확인했습니다. 입력 내용은 사이트에 저장되지 않으며 이메일 프로그램으로 전달됩니다.</label><Link href="/privacy" onClick={() => { scrollPosition.current = window.scrollY; }}>개인정보 처리 안내 보기 <ArrowUpRight aria-hidden="true" /></Link></div></div>
          {!company.email && <p className="s2-inquiry-form__notice"><Mail /> 대표 이메일 미등록 상태입니다. 이메일 작성 화면에서 받는 사람을 직접 지정해야 합니다.</p>}
          <button type="submit" disabled={!formReady}>이메일 문의 작성 <ArrowUpRight /></button>
          <button className="s2-inquiry-form__copy" type="button" onClick={copyDraft} disabled={!formReady}>문의 내용 복사 <Copy /></button>
          <p className="s2-inquiry-form__copy-note">입력한 항목만 복사합니다. 동의 여부는 복사하지 않으며, 빈 양식은 복사할 수 없습니다.</p>
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
