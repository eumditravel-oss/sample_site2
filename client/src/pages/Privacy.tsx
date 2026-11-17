import { LegalSubNav, SiteFrame } from "@/components/SiteShell";
import { company } from "@/config/company";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
  usePageMeta("개인정보처리방침", "개인정보 보호법 제30조에 따른 (주)동성건설 웹사이트 개인정보처리방침 고시");
  return (
    <SiteFrame>
      <section className="s2-legal-page">
        <p>PRIVACY POLICY · 법정 고시</p>
        <h1>개인정보처리방침</h1>
        <p className="s2-legal-page__lead">
          {company.legalName}(이하 &ldquo;회사&rdquo;)은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.
        </p>

        <LegalSubNav />

        <div className="s2-legal-summary" aria-label="주요 개인정보 처리 표시 요약">
          <div className="s2-legal-summary__head">
            <ShieldCheck size={20} aria-hidden="true" />
            <strong>주요 개인정보 처리 현황 요약</strong>
          </div>
          <div className="s2-legal-summary__grid">
            <article>
              <span>처리 목적</span>
              <strong>프로젝트 문의 검토 및 회신 연락</strong>
              <p>토목·건축·외부시설 공사 문의 확인, 사전 여건 검토, 담당자 회신</p>
            </article>
            <article>
              <span>웹사이트 저장 여부</span>
              <strong>서버·DB 미저장 (Zero-Storage)</strong>
              <p>웹사이트 서버 및 브라우저 저장소에 개인정보를 보관하지 않으며 이용자 이메일 초안으로만 전달</p>
            </article>
            <article>
              <span>보유 및 이용기간</span>
              <strong>문의 검토 완료 시 또는 법정 보존기간</strong>
              <p>발송된 이메일에 한해 상담 종결 후 지체 없이 파기 (관계 법령 보존 대상 예외)</p>
            </article>
          </div>
        </div>

        <div className="s2-legal-articles">
          <article>
            <h2>제1조 (개인정보의 처리 목적)</h2>
            <p>
              회사는 다음의 목적을 위하여 최소한의 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul>
              <li>온라인 프로젝트 문의 접수 확인 및 발주 여건(공종·지역·일정) 사전 기술 검토</li>
              <li>문의 사항에 대한 사실관계 확인을 위한 연락·통지 및 검토 결과 회신</li>
              <li>향후 현장 실측 또는 대면 미팅 요청 시 담당 부서 배정 및 일정 협의</li>
            </ul>
          </article>

          <article>
            <h2>제2조 (개인정보의 처리 및 보유 기간)</h2>
            <p>
              ① 본 웹사이트는 정적 웹 호스팅 방식으로 운영되며, [프로젝트 문의] 화면에 입력한 내용은 웹사이트 서버 데이터베이스(DB)나 브라우저 영구저장소(localStorage, 쿠키 등)에 자동 저장되지 않습니다.
            </p>
            <p>
              ② 이용자가 이메일 프로그램을 통해 회사 공식 수신처로 직접 발송한 문의 메일에 포함된 개인정보는 <strong>문의 검토 및 회신 목적 달성 시(또는 발송일로부터 최대 1년 이내 상담 종결 시)까지 보유·이용 후 지체 없이 파기</strong>합니다. 다만, 다음의 사유에 해당하는 경우에는 해당 기간 종료 시까지 보존합니다.
            </p>
            <ul>
              <li>계약 또는 견적·협의에 관한 중요 기록(도급계약 체결로 이어진 경우): 관련 법령 및 상법상 상사시효 기준에 따름</li>
              <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률 준용 시)</li>
            </ul>
          </article>

          <article>
            <h2>제3조 (처리하는 개인정보의 항목 및 수집 방법)</h2>
            <div className="s2-legal-table-wrap">
              <table className="s2-legal-table">
                <caption>수집·처리하는 개인정보 항목 안내</caption>
                <thead>
                  <tr>
                    <th scope="col">구분</th>
                    <th scope="col">처리 항목</th>
                    <th scope="col">수집·전달 방식</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>프로젝트 문의</td>
                    <td>회사/기관명, 담당자 성명, 연락처(전화번호), 발신 이메일 주소, 프로젝트 종류, 현장 지역, 예상 시기, 문의 내용</td>
                    <td>이용자가 문의 양식 작성 후 본인의 이메일 프로그램을 통해 직접 전송</td>
                  </tr>
                  <tr>
                    <td>자동 생성 정보</td>
                    <td>접속 IP 주소, 브라우저 종류 및 OS 정보, 방문 일시 (웹 호스팅 보안 로그)</td>
                    <td>정적 웹사이트 접속 시 호스팅 인프라 보안 정책에 의해 자동 생성</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <article>
            <h2>제4조 (개인정보의 제3자 제공에 관한 사항)</h2>
            <p>
              회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 정보주체의 사전 동의나 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다. 현재 회사는 웹사이트를 통해 수집된 개인정보를 외부 제3자에게 제공하고 있지 않습니다.
            </p>
          </article>

          <article>
            <h2>제5조 (개인정보 처리의 위탁에 관한 사항)</h2>
            <p>
              회사는 원활한 웹사이트 접속 제공을 위해 정적 웹페이지 호스팅 인프라(GitHub Pages)를 이용하고 있으나, 웹사이트 자체에서 이용자 DB를 수집·보관하지 않으므로 별도의 개인정보 처리 위탁 계약을 통한 회원·상담 DB 외부 위탁을 운영하지 않습니다. 향후 온라인 접수 서버 도입 등으로 위탁 업무가 발생할 경우 지체 없이 본 방침을 통해 수탁자와 위탁 업무 내용을 공개하겠습니다.
            </p>
          </article>

          <article>
            <h2>제6조 (개인정보의 파기 절차 및 방법)</h2>
            <ul>
              <li>
                <strong>파기 절차:</strong> 이용자가 이메일로 발송한 문의 내역 중 보유기간이 경과하거나 처리 목적이 달성된 정보는 내부 검토 종료 후 지체 없이 파기 대상 메일로 분류하여 삭제합니다.
              </li>
              <li>
                <strong>파기 방법:</strong> 전자적 파일(이메일 본문 및 첨부 도서 등) 형태로 기록된 개인정보는 기록을 재생할 수 없도록 영구 삭제하며, 종이 문서로 출력된 자료는 분쇄기로 분쇄하거나 소각하여 파기합니다.
              </li>
            </ul>
          </article>

          <article>
            <h2>제7조 (정보주체와 법정대리인의 권리·의무 및 행사방법)</h2>
            <p>
              ① 정보주체는 회사에 대해 언제든지 기 발송한 문의 메일 내 개인정보의 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
            </p>
            <p>
              ② 권리 행사는 「개인정보 보호법」 시행령 제41조 제1항에 따라 서면, 전자우편, 유선 등을 통하여 하실 수 있으며 회사는 본인 여부를 확인한 후 지체 없이 조치하겠습니다.
            </p>
          </article>

          <article>
            <h2>제8조 (개인정보의 안전성 확보조치)</h2>
            <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 기술적·관리적 보호조치를 취하고 있습니다.</p>
            <ul>
              <li><strong>무서버(Zero-Storage) 아키텍처 적용:</strong> 웹사이트 내 데이터베이스 미운영으로 웹 해킹을 통한 상담 DB 유출 위험 원천 차단</li>
              <li><strong>전송 구간 암호화:</strong> 웹사이트 전 구간 HTTPS(SSL/TLS) 보안 프로토콜 적용</li>
              <li><strong>관리적 조치:</strong> 문의 수신 이메일 계정에 대한 접근 권한 최소화, 2단계 인증 권장 및 정기 비밀번호 관리</li>
            </ul>
          </article>

          <article>
            <h2>제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</h2>
            <p>
              회사는 이용자의 맞춤형 광고나 행태정보 추적을 위한 쿠키(Cookie)를 설치·운영하지 않습니다. 이용자는 웹 브라우저 옵션 설정을 통해 모든 쿠키를 허용하거나, 쿠키 저장 시 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.
            </p>
          </article>

          <article>
            <h2>제10조 (개인정보 보호책임자 및 담당부서)</h2>
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자 및 담당부서를 지정·운영합니다.
            </p>
            <div className="s2-legal-table-wrap">
              <table className="s2-legal-table">
                <caption>개인정보 보호책임자 및 담당부서 안내</caption>
                <tbody>
                  <tr>
                    <th scope="row">개인정보 보호책임자</th>
                    <td>{company.privacyOfficer ?? "업체 지정 확인 중 (대표자 또는 관리책임자 확정 즉시 고시)"}</td>
                  </tr>
                  <tr>
                    <th scope="row">담당부서</th>
                    <td>{company.privacyDepartment}</td>
                  </tr>
                  <tr>
                    <th scope="row">연락처 / 이메일</th>
                    <td>
                      전화: {company.phone ?? "대표번호 등록 준비 중"} / 이메일: {company.email ?? "대표 이메일 등록 준비 중"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <article>
            <h2>제11조 (권익침해 구제방법)</h2>
            <p>
              정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.
            </p>
            <ul>
              <li>개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
              <li>개인정보침해신고센터 (한국인터넷진흥원): (국번없이) 118 (privacy.kisa.or.kr)</li>
              <li>대검찰청 사이버수사과: (국번없이) 1301 (www.spo.go.kr)</li>
              <li>경찰청 사이버수사국: (국번없이) 182 (ecrm.police.go.kr)</li>
            </ul>
          </article>

          <article>
            <h2>제12조 (개인정보처리방침의 시행 및 변경)</h2>
            <p>본 개인정보처리방침은 <strong>{company.policyEffectiveDate}</strong>부터 적용됩니다. 법령 및 회사 운영 정책 변경에 따라 내용의 추가·삭제 및 수정이 있을 경우 웹사이트 공지사항을 통하여 사전 고지합니다.</p>
          </article>
        </div>

        <Link className="s2-legal-page__contact" href="/contact">
          프로젝트 문의로 이동 <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </SiteFrame>
  );
}
