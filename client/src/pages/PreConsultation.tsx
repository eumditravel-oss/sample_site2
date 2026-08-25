/**
 * Design reference: a concise pre-consultation selector that passes prepared project details into the private inquiry form.
 */
import { useState } from "react";
import { Link } from "wouter";
import { PageTitle, SiteFrame, SubNavigation } from "@/components/SiteShell";

const checks = [
  { number: "01", title: "현장 위치", description: "시·군·구 또는 현장 주소를 확인했다면 선택해 주세요.", type: "location" },
  { number: "02", title: "필요 공정", description: "상담 폼에 반영할 공정 유형을 선택해 주세요.", type: "work" },
  { number: "03", title: "희망 시기", description: "현장 일정에 맞는 희망 착수 시기를 선택해 주세요.", type: "schedule" },
  { number: "04", title: "현장 사진·참고사항", description: "사진이나 참고사항을 준비했다면 선택해 주세요.", type: "photo" },
];

export default function PreConsultation() {
  const [locationReady, setLocationReady] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);
  const [workType, setWorkType] = useState("");
  const [schedule, setSchedule] = useState("");
  const params = new URLSearchParams();
  if (locationReady) params.set("locationReady", "1");
  if (photoReady) params.set("photoReady", "1");
  if (workType) params.set("workType", workType);
  if (schedule) params.set("schedule", schedule);
  const consultationHref = `/consultation${params.size ? `?${params.toString()}` : ""}`;
  return (
    <SiteFrame>
      <PageTitle title="상담 전 확인사항" subtitle="CONSULTATION GUIDE" crumbs="상담 전 확인사항" image="/field-03.jpg" />
      <section className="sub-layout">
        <SubNavigation section="notices" />
        <article className="sub-content precheck-content">
          <div className="precheck-content__lead"><p className="content-kicker">BEFORE CONSULTATION</p><h2>상담 전 아래 내용을 <em>준비해 주세요.</em></h2><p>정확한 안내를 위해 현장 조건과 필요한 공정, 일정 정보를 미리 확인하면 상담이 더 수월합니다.</p></div>
          <ol className="precheck-content__list">{checks.map(({ number, title, description, type }) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p>{type === "location" && <button type="button" className={locationReady ? "is-selected" : ""} onClick={() => setLocationReady((value) => !value)}>{locationReady ? "현장 위치 확인됨" : "현장 위치 확인"}</button>}{type === "photo" && <button type="button" className={photoReady ? "is-selected" : ""} onClick={() => setPhotoReady((value) => !value)}>{photoReady ? "사진·참고사항 준비됨" : "사진·참고사항 준비"}</button>}{type === "work" && <div className="precheck-options">{["경계 구조 시공", "보행로·블록 정비", "시설물 보수", "기타·부대 공정"].map((option) => <button type="button" key={option} className={workType === option ? "is-selected" : ""} onClick={() => setWorkType(option)}>{option}</button>)}</div>}{type === "schedule" && <div className="precheck-options">{["1주 이내", "1개월 이내", "일정 협의 필요"].map((option) => <button type="button" key={option} className={schedule === option ? "is-selected" : ""} onClick={() => setSchedule(option)}>{option}</button>)}</div>}</div></li>)}</ol>
          <div className="precheck-content__cta"><p>선택한 내용은 온라인상담 폼에 자동으로 반영됩니다.</p><Link href={consultationHref}>온라인상담 신청하기</Link></div>
        </article>
      </section>
    </SiteFrame>
  );
}
