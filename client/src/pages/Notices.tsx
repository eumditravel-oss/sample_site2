/**
 * Design reference: a minimal Korean notice board with title-and-content search for quick information finding.
 */
import { Search } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { PageTitle, SiteFrame, SubNavigation } from "@/components/SiteShell";

const notices = [
  { title: "사이트 이용 및 상담 문의 안내", content: "온라인상담 작성과 비공개 게시글 확인 방법을 안내합니다.", date: "2026.08.18", views: 12 },
  { title: "개인정보 수집 및 이용 동의 안내", content: "상담 접수 시 수집하는 정보와 이용 목적을 안내합니다.", date: "2026.08.17", views: 13 },
  { title: "현장 일정 상담 전 확인 사항", content: "현장 위치, 필요한 공정, 희망 일정과 참고 사진을 준비해 주세요.", date: "2026.08.16", views: 14 },
  { title: "작업 범위 안내 문구 예시", content: "경계 구조와 보행로 정비, 외부 시설 보수의 공정 범위를 안내합니다.", date: "2026.08.15", views: 15 },
  { title: "안전한 시공 진행을 위한 약속", content: "현장 확인부터 완료 확인까지 공유하는 운영 기준입니다.", date: "2026.08.14", views: 16 },
  { title: "홈페이지 구조 재현 안내", content: "사이트 내 공지와 상담 페이지의 이용 흐름을 설명합니다.", date: "2026.08.13", views: 17 },
];

export default function Notices() {
  const [keyword, setKeyword] = useState("");
  const filteredNotices = useMemo(() => {
    const normalized = keyword.trim().toLocaleLowerCase("ko-KR");
    if (!normalized) return notices;
    return notices.filter((notice) => `${notice.title} ${notice.content}`.toLocaleLowerCase("ko-KR").includes(normalized));
  }, [keyword]);
  const handleSearch = (event: FormEvent<HTMLFormElement>) => event.preventDefault();
  return (
    <SiteFrame>
      <PageTitle title="공지사항" subtitle="NOTICE" image="/field-03.jpg" />
      <section className="sub-layout">
        <SubNavigation section="notices" />
        <article className="sub-content board-content">
          <div className="board-top"><p>{keyword.trim() ? "검색 결과" : "총 게시물"} <b>{filteredNotices.length}</b>건</p><form className="board-search" onSubmit={handleSearch}><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="제목 또는 내용을 입력하세요" aria-label="공지사항 제목 또는 내용 검색" /><button type="submit" aria-label="검색"><Search size={17} /></button></form></div>
          <div className="board-table-wrap"><table className="board-table"><thead><tr><th>번호</th><th>제목</th><th>등록일</th><th>조회</th></tr></thead><tbody>{filteredNotices.length ? filteredNotices.map((notice, index) => <tr key={notice.title}><td>{filteredNotices.length - index}</td><td><strong>{notice.title}</strong><small className="notice-table__content">{notice.content}</small></td><td>{notice.date}</td><td>{notice.views}</td></tr>) : <tr><td colSpan={4} className="board-empty">제목 또는 내용과 일치하는 공지사항이 없습니다.</td></tr>}</tbody></table></div>
          <div className="pagination"><button type="button" className="is-active">1</button></div>
        </article>
      </section>
    </SiteFrame>
  );
}
