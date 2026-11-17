import { PageHero, SiteFrame } from "@/components/SiteShell";
import { company } from "@/config/company";
import { useInquiryDraft, type InquiryDraft } from "@/context/InquiryDraft";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowUpRight, CheckCircle2, Copy, Mail } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "wouter";

export default function Contact() {
  usePageMeta("프로젝트 문의", "토목·건축·외부시설 프로젝트 검토를 위한 사전 조건 정리 및 문의 안내 페이지");
  const [message, setMessage] = useState("");
  const [formReady, setFormReady] = useState(false);
  const { draft, setDraft, scrollPosition } = useInquiryDraft();

  useEffect(() => setFormReady(true), []);
  useEffect(() => {
    const saved = scrollPosition.current;
    scrollPosition.current = null;
    const frame = saved === null ? null : window.requestAnimationFrame(() => window.scrollTo({ top: saved, behavior: "instant" }));
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [scrollPosition]);

  const updateText =
    (key: Exclude<keyof InquiryDraft, "agreement">) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = event.currentTarget.value;
      setDraft((previous) => ({ ...previous, [key]: value }));
    };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `[프로젝트 문의] ${String(data.get("projectType") ?? "일반 문의")} - ${String(data.get("organization") ?? "")}`;
    const body = [
      `[${company.name} 온라인 프로젝트 문의]`,
      `회사/기관명: ${data.get("organization")}`,
      `담당자 성명: ${data.get("manager")}`,
      `연락처: ${data.get("phone")}`,
      `프로젝트 부문: ${data.get("projectType")}`,
      `현장 지역(대지 위치): ${data.get("region")}`,
      `희망 착공/검토 시기: ${data.get("timing")}`,
      "",
      "[상세 문의 및 검토 요청 사항]",
      String(data.get("details") ?? ""),
      "",
      "※ 설계도면·현장사진·개요서 등 참고 자료는 이메일에 첨부해 주시면 더욱 정확한 검토가 가능합니다.",
    ].join("\n");

    const recipient = company.email ? "" : "현재 공식 수신 이메일이 등록 준비 중이므로 이메일 창에서 받는 사람 주소를 직접 지정해 주세요. ";
    setMessage(`${recipient}이메일 프로그램이 열렸는지 확인하시고 검토 후 직접 발송해 주세요. 입력 내용은 이 화면에 유지됩니다.`);
    window.location.href = `mailto:${company.email ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyDraft = async () => {
    const fields: Array<[string, string]> = [
      ["회사/기관명", draft.organization],
      ["담당자", draft.manager],
      ["연락처", draft.phone],
      ["프로젝트 부문", draft.projectType],
      ["현장 지역", draft.region],
      ["예상 시기", draft.timing],
      ["문의 내용", draft.details],
    ];
    const lines = fields.filter(([, value]) => value.trim()).map(([label, value]) => `${label}: ${value.trim()}`);
    if (!lines.length) {
      setMessage("복사할 내용이 없습니다. 문의 항목을 하나 이상 입력해 주세요.");
      return;
    }
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(`[${company.name} 프로젝트 문의]\n${lines.join("\n")}`);
      setMessage("입력한 문의 내용을 클립보드에 복사했습니다. 사내 메일이나 메신저에 붙여넣어 전달하실 수 있습니다.");
    } catch {
      setMessage("클립보드 복사에 실패했습니다. 입력 내용은 화면에 그대로 유지되어 있습니다.");
    }
  };

  return (
    <SiteFrame>
      <PageHero
        index="06"
        eyebrow="CONTACT"
        title="프로젝트 문의"
        description="사업지 위치와 예정 공종 등 핵심 여건을 정리해 신속하고 정확한 기술 검토를 준비합니다."
        image="/field-02.jpg"
      />
      <section className="s2-contact-page">
        <div className="s2-contact-page__intro">
          <p>PROJECT INQUIRY GUIDE</p>
          <h2>
            프로젝트 검토에 필요한
            <br />
            기초 정보를 남겨 주세요.
          </h2>
          <span>
            본 양식에 입력하신 정보는 웹사이트 서버나 브라우저 저장소에 저장되지 않으며, 새로고침하거나 창을 닫으면 즉시 소멸됩니다. 제출 시 이용자 기기의 이메일 프로그램으로 문의 초안이 생성됩니다.
          </span>

          <div className="s2-contact-prep">
            <strong>함께 알려주시면 좋은 내용</strong>
            <ul>
              <li>
                <CheckCircle2 size={15} aria-hidden="true" /> 사업지 개략 위치(시·군·구 또는 지번) 및 대지 여건
              </li>
              <li>
                <CheckCircle2 size={15} aria-hidden="true" /> 예정 공종 (토목 부지조성 / 건축 신축·보수 / 외부 포장·인프라)
              </li>
              <li>
                <CheckCircle2 size={15} aria-hidden="true" /> 설계도서·물량내역서 보유 여부 및 희망 착공 시기
              </li>
            </ul>
          </div>
        </div>

        <noscript>
          <p className="s2-inquiry-disabled">
            문의 내용 작성 기능은 자바스크립트가 필요합니다. 브라우저에서 자바스크립트를 켠 후 다시 이용해 주세요.
          </p>
        </noscript>

        <form className="s2-inquiry-form" onSubmit={submit}>
          <div>
            <label htmlFor="organization">회사 / 기관명 *</label>
            <input
              id="organization"
              name="organization"
              autoComplete="organization"
              placeholder="발주처 또는 소속 회사명"
              disabled={!formReady}
              required
              value={draft.organization}
              onChange={updateText("organization")}
            />
          </div>
          <div>
            <label htmlFor="manager">담당자 성명 / 직함 *</label>
            <input
              id="manager"
              name="manager"
              autoComplete="name"
              placeholder="예: 홍길동 과장"
              disabled={!formReady}
              required
              value={draft.manager}
              onChange={updateText("manager")}
            />
          </div>
          <div>
            <label htmlFor="phone">회신 연락처 *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="전화번호 또는 휴대전화"
              disabled={!formReady}
              required
              value={draft.phone}
              onChange={updateText("phone")}
            />
          </div>
          <div>
            <label htmlFor="projectType">프로젝트 부문 *</label>
            <select
              id="projectType"
              name="projectType"
              disabled={!formReady}
              required
              value={draft.projectType}
              onChange={updateText("projectType")}
            >
              <option value="" disabled>
                부문 선택
              </option>
              <option value="토목사업 (도로·교량·부지조성·관로)">토목사업 (도로·교량·부지조성·관로)</option>
              <option value="건축사업 (업무·산업·근린·리모델링)">건축사업 (업무·산업·근린·리모델링)</option>
              <option value="외부인프라 (단지포장·외구·구조물보강)">외부인프라 (단지포장·외구·구조물보강)</option>
              <option value="토목·건축 통합 도급 협의">토목·건축 통합 도급 협의</option>
            </select>
          </div>
          <div>
            <label htmlFor="region">현장 지역 (사업지 위치) *</label>
            <input
              id="region"
              name="region"
              placeholder="예: 경기도 화성시 / 충북 청주시"
              disabled={!formReady}
              required
              value={draft.region}
              onChange={updateText("region")}
            />
          </div>
          <div>
            <label htmlFor="timing">희망 착공 / 검토 시기 *</label>
            <input
              id="timing"
              name="timing"
              placeholder="예: 2027년 상반기 / 일정 협의"
              disabled={!formReady}
              required
              value={draft.timing}
              onChange={updateText("timing")}
            />
          </div>
          <div className="is-wide">
            <label htmlFor="details">상세 문의 내용 *</label>
            <textarea
              id="details"
              name="details"
              rows={6}
              placeholder="대지 면적·연면적, 주요 공사 범위, 도면 보유 여부 등 검토에 참고할 내용을 자유롭게 기재해 주세요."
              disabled={!formReady}
              required
              value={draft.details}
              onChange={updateText("details")}
            />
          </div>

          <div className="s2-consent-box is-wide" aria-label="개인정보 수집 및 이용 동의 안내">
            <strong>개인정보 수집·이용 안내 (개인정보 보호법 제15조 제2항 고지)</strong>
            <dl>
              <div>
                <dt>1. 수집·이용 목적</dt>
                <dd>프로젝트 문의 검토, 사실관계 확인을 위한 연락 및 검토 결과 회신</dd>
              </div>
              <div>
                <dt>2. 수집 항목</dt>
                <dd>회사/기관명, 담당자 성명, 연락처, 발신 이메일 주소 및 프로젝트 문의 기재 항목</dd>
              </div>
              <div>
                <dt>3. 보유·이용 기간</dt>
                <dd>웹사이트 서버 미저장 / 이메일 발송 시 문의 처리 완료 후 지체 없이 파기 (법령 보존기간 예외)</dd>
              </div>
              <div>
                <dt>4. 동의 거부 권리</dt>
                <dd>귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있으며, 미동의 시 온라인 문의 초안 생성이 제한됩니다.</dd>
              </div>
            </dl>
          </div>

          <div className="s2-inquiry-form__agreement">
            <input
              id="inquiry-agreement"
              type="checkbox"
              disabled={!formReady}
              required
              checked={draft.agreement}
              onChange={(event) => {
                const agreement = event.currentTarget.checked;
                setDraft((previous) => ({ ...previous, agreement }));
              }}
            />
            <div>
              <label htmlFor="inquiry-agreement">
                [필수] 위 개인정보 수집·이용 고지 내용을 확인하였으며 이에 동의합니다. (입력 정보는 서버에 저장되지 않고 이메일 초안으로만 전달됩니다.)
              </label>
              <Link
                href="/privacy"
                onClick={() => {
                  scrollPosition.current = window.scrollY;
                }}
              >
                개인정보처리방침 전문 보기 <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>

          {!company.email && (
            <p className="s2-inquiry-form__notice">
              <Mail /> 현재 공식 대표 이메일이 등록 준비 중입니다. 이메일 작성 창이 열리면 수신자 주소를 직접 입력하거나 아래 [문의 내용 복사] 기능을 이용해 주세요.
            </p>
          )}
          <button type="submit" disabled={!formReady}>
            이메일 문의 초안 열기 <ArrowUpRight />
          </button>
          <button className="s2-inquiry-form__copy" type="button" onClick={copyDraft} disabled={!formReady}>
            문의 내용 클립보드 복사 <Copy />
          </button>
          <p className="s2-inquiry-form__copy-note">
            이메일 프로그램이 연결되지 않은 PC·모바일 환경에서는 [문의 내용 클립보드 복사]를 눌러 웹메일 등에 바로 붙여넣으실 수 있습니다.
          </p>
          {message && (
            <output aria-live="polite">
              <Copy /> {message}
            </output>
          )}
        </form>
      </section>

      <section className="s2-contact-info">
        <header>
          <p>CORPORATE CONTACT</p>
          <h2>기업 연락처 및 운영 안내</h2>
        </header>
        <dl>
          <div>
            <dt>COMPANY</dt>
            <dd>{company.legalName} ({company.name})</dd>
          </div>
          <div>
            <dt>PHONE</dt>
            <dd>{company.phone ?? "대표 전화번호 확인 후 고시 예정"}</dd>
          </div>
          <div>
            <dt>E-MAIL</dt>
            <dd>{company.email ?? "공식 수신 이메일 확인 후 고시 예정"}</dd>
          </div>
          <div>
            <dt>OFFICE</dt>
            <dd>{company.address ?? "본사 사업장 도로명 주소 확인 후 고시 예정"}</dd>
          </div>
          <div>
            <dt>HOURS</dt>
            <dd>{company.hours}</dd>
          </div>
        </dl>
      </section>
    </SiteFrame>
  );
}
