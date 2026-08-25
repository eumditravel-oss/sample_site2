import { SiteFrame } from "@/components/SiteShell";
import { company } from "@/config/company";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Privacy() {
  usePageMeta("개인정보 처리 안내", "동성건설 프로젝트 문의 페이지의 개인정보 처리 방식 안내");
  return (
    <SiteFrame>
      <section className="s2-legal-page">
        <p>PRIVACY</p><h1>개인정보 처리 안내</h1>
        <div>
          <h2>현재 문의 방식</h2><p>본 웹사이트는 정적 GitHub Pages로 운영되며, 프로젝트 문의 폼에 입력한 정보를 서버 또는 localStorage에 저장하지 않습니다.</p>
          <h2>이메일 프로그램으로의 전달</h2><p>문의 버튼을 누르면 사용자의 기기에 설정된 이메일 프로그램이 열리며, 입력 내용이 이메일 본문 초안으로 전달됩니다. 이후 전송·보관은 사용자가 이용하는 이메일 서비스의 정책을 따릅니다.</p>
          <h2>공개되지 않은 연락처</h2><p>{company.name}의 공식 대표 이메일과 주소는 현재 등록되지 않았습니다. 확인되지 않은 연락처를 임의로 표시하지 않습니다.</p>
          <h2>문의</h2><p>공식 개인정보 담당 연락처가 제공되면 이 페이지에 반영합니다.</p>
        </div>
      </section>
    </SiteFrame>
  );
}
