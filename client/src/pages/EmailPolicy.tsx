import { LegalSubNav, SiteFrame } from "@/components/SiteShell";
import { company } from "@/config/company";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowUpRight, MailWarning } from "lucide-react";
import { Link } from "wouter";

export default function EmailPolicy() {
  usePageMeta("이메일무단수집거부", "정보통신망법에 따른 (주)동성건설 웹사이트 이메일 주소 무단수집 거부 고지");
  return (
    <SiteFrame>
      <section className="s2-legal-page">
        <p>EMAIL COLLECTION REFUSAL · 법정 고시</p>
        <h1>이메일무단수집거부</h1>
        <p className="s2-legal-page__lead">
          {company.legalName}은 정보통신망 이용촉진 및 정보보호 등에 관한 법률에 의거하여 본 웹사이트 내 이메일 주소의 무단 수집을 엄격히 거부합니다.
        </p>

        <LegalSubNav />

        <div className="s2-legal-summary">
          <div className="s2-legal-summary__head">
            <MailWarning size={20} aria-hidden="true" />
            <strong>공식 고지문</strong>
          </div>
          <p className="s2-legal-refusal-statement">
            본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반 시 <strong>「정보통신망 이용촉진 및 정보보호 등에 관한 법률」</strong>에 의해 형사처벌됨을 유념하시기 바랍니다.
          </p>
        </div>

        <div className="s2-legal-articles">
          <article>
            <h2>제1조 (관련 법령 근거 — 정보통신망법 제50조의2)</h2>
            <ul>
              <li>누구든지 인터넷 홈페이지 운영자 또는 관리자의 사전 동의 없이 인터넷 홈페이지에서 자동으로 전자우편주소를 수집하는 프로그램이나 그 밖의 기술적 장치를 이용하여 전자우편주소를 수집하여서는 아니 됩니다.</li>
              <li>누구든지 제1항을 위반하여 수집된 전자우편주소를 판매·유통하여서는 아니 됩니다.</li>
              <li>누구든지 제1항과 제2항에 따라 수집·판매 및 유통이 금지된 전자우편주소임을 알면서 이를 정보 전송에 이용하여서는 아니 됩니다.</li>
            </ul>
          </article>

          <article>
            <h2>제2조 (위반 시 벌칙 — 정보통신망법 제74조)</h2>
            <p>
              위 규정을 위반하여 기술적 장치를 이용해 전자우편주소를 무단 수집하거나 이를 판매·유통 또는 정보 전송에 이용한 자는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제74조에 따라 <strong>1년 이하의 징역 또는 1천만원 이하의 벌금</strong>에 처해질 수 있습니다.
            </p>
          </article>

          <article>
            <h2>제3조 (공식 프로젝트 문의 안내)</h2>
            <p>
              광고성 영리 목적의 무단 메일 발송을 제외한 정상적인 공사 발주, 설계·시공 기술 협의, 협력사 제안 등의 공식 업무 문의는 본 웹사이트의 [프로젝트 문의] 페이지를 통해 안내받으실 수 있습니다.
            </p>
            <p>게시일자: <strong>{company.policyEffectiveDate}</strong> ({company.name})</p>
          </article>
        </div>

        <Link className="s2-legal-page__contact" href="/contact">
          프로젝트 문의로 이동 <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </SiteFrame>
  );
}
