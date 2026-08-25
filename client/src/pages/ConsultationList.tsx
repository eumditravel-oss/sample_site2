import { LockKeyhole, Paperclip, Search } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageTitle, SiteFrame, SubNavigation } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ConsultationRecord = {
  id: number;
  title: string;
  applicantName: string;
  phone: string;
  location: string;
  workType: string;
  schedule: string;
  message: string;
  password: string;
  attachments: Array<{ fileName: string; fileSize: number }>;
  createdAt: string;
  views: number;
  status: "pending" | "answered";
};

function loadRecords(): ConsultationRecord[] {
  try {
    return JSON.parse(localStorage.getItem("dongseong-consultations") ?? "[]") as ConsultationRecord[];
  } catch {
    return [];
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date(value)).replace(/\. /g, ".").replace(/\.$/, "");
}

export default function ConsultationList() {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [records] = useState(loadRecords);
  const [selectedPost, setSelectedPost] = useState<ConsultationRecord | null>(null);
  const [password, setPassword] = useState("");
  const [detail, setDetail] = useState<ConsultationRecord | null>(null);
  const filtered = useMemo(() => records.filter((record) => record.title.includes(query)), [records, query]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(searchInput.trim());
  };
  const openPasswordDialog = (post: ConsultationRecord) => {
    setSelectedPost(post);
    setPassword("");
    setDetail(null);
  };
  const closeDetailDialog = (open: boolean) => {
    if (!open) {
      setSelectedPost(null);
      setPassword("");
      setDetail(null);
    }
  };
  const submitPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPost) return;
    if (selectedPost.password !== password) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    setDetail({ ...selectedPost, views: selectedPost.views + 1 });
  };

  return (
    <SiteFrame>
      <PageTitle title="상담 리스트" subtitle="CONSULTATION LIST" crumbs="상담 리스트" image="/field-02.jpg" />
      <section className="sub-layout">
        <SubNavigation section="consultation" />
        <article className="sub-content board-content consultation-list-only">
          <div className="board-top">
            <p>이 페이지에서 등록한 상담은 현재 기기에만 비공개로 보관됩니다.</p>
            <form className="board-search" onSubmit={submitSearch}>
              <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="제목을 입력하세요" aria-label="상담 제목 검색" />
              <button type="submit" aria-label="검색"><Search size={17} /></button>
            </form>
          </div>
          {!filtered.length ? <div className="board-empty-state">{query ? "검색 결과가 없습니다." : "등록된 상담 게시글이 없습니다."}</div> : (
            <div className="board-table-wrap">
              <table className="board-table">
                <thead><tr><th>번호</th><th>제목</th><th>등록일</th><th>조회</th></tr></thead>
                <tbody>{filtered.map((item, index) => <tr key={item.id}>
                  <td>{filtered.length - index}</td>
                  <td><button type="button" className="board-title-button" onClick={() => openPasswordDialog(item)}><LockKeyhole size={14} /> {item.title}<span className={`consultation-status consultation-status--${item.status}`}>{item.status === "answered" ? "답변 완료" : "답변 대기"}</span></button></td>
                  <td>{formatDate(item.createdAt)}</td><td>{item.views}</td>
                </tr>)}</tbody>
              </table>
            </div>
          )}
        </article>
      </section>
      <Dialog open={Boolean(selectedPost)} onOpenChange={closeDetailDialog}>
        <DialogContent className="border-[#cfc7d4] bg-white sm:max-w-md">
          {!detail ? (
            <form onSubmit={submitPassword}>
              <DialogHeader><DialogTitle>비공개 상담 확인</DialogTitle><DialogDescription>{selectedPost?.title}</DialogDescription></DialogHeader>
              <label className="mt-5 block text-sm font-semibold text-[#3f3545]" htmlFor="detail-password">비밀번호</label>
              <input id="detail-password" className="mt-2 h-11 w-full border border-[#cfc7d4] px-3 text-sm" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required autoFocus placeholder="등록 시 설정한 비밀번호" />
              <DialogFooter className="mt-5"><Button type="submit" className="bg-[#4d2f78] hover:bg-[#18141d]">상세 내용 확인</Button></DialogFooter>
            </form>
          ) : (
            <>
              <DialogHeader><DialogTitle>{detail.title}</DialogTitle><DialogDescription>{formatDate(detail.createdAt)} · 조회 {detail.views}</DialogDescription></DialogHeader>
              <dl className="grid gap-3 border-y border-[#e1dce4] py-5 text-sm">
                <div className="grid grid-cols-[76px_1fr] gap-3"><dt className="text-[#766f78]">성함</dt><dd>{detail.applicantName}</dd></div>
                <div className="grid grid-cols-[76px_1fr] gap-3"><dt className="text-[#766f78]">연락처</dt><dd>{detail.phone}</dd></div>
                <div className="grid grid-cols-[76px_1fr] gap-3"><dt className="text-[#766f78]">현장 위치</dt><dd>{detail.location}</dd></div>
                <div className="grid grid-cols-[76px_1fr] gap-3"><dt className="text-[#766f78]">공정 유형</dt><dd>{detail.workType}</dd></div>
                <div className="grid grid-cols-[76px_1fr] gap-3"><dt className="text-[#766f78]">희망 시기</dt><dd>{detail.schedule}</dd></div>
              </dl>
              <div className="whitespace-pre-wrap text-sm leading-7 text-[#3f3545]">{detail.message}</div>
              {detail.attachments.length > 0 && <section className="detail-attachments"><h3><Paperclip size={15} /> 첨부파일</h3><ul>{detail.attachments.map((attachment) => <li key={attachment.fileName}>{attachment.fileName}<span>{Math.ceil(attachment.fileSize / 1024)}KB</span></li>)}</ul></section>}
            </>
          )}
        </DialogContent>
      </Dialog>
    </SiteFrame>
  );
}
