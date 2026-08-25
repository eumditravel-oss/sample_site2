/**
 * Design reference: practical location page with a large map-like field, contact details, and immediate call action.
 */
import { MapPin, Navigation, Phone } from "lucide-react";
import { PageTitle, SiteFrame, SubNavigation } from "@/components/SiteShell";

export default function Location() {
  return (
    <SiteFrame>
      <PageTitle title="오시는길" subtitle="LOCATION" crumbs="회사소개 / 오시는길" image="/field-01.jpg" />
      <section className="sub-layout">
        <SubNavigation section="company" />
        <article className="sub-content location-content">
          <div className="large-map" aria-label="위치 안내 지도 예시"><div className="large-map__ring" /><div className="large-map__road large-map__road--a" /><div className="large-map__road large-map__road--b" /><div className="large-map__road large-map__road--c" /><div className="large-map__pin"><MapPin size={38} fill="currentColor" /><span>동성건설</span></div></div>
          <div className="location-details"><div><MapPin size={22} /><span><b>주소</b> 서울특별시 ○○구 현장로 24, 202호</span></div><div><Phone size={21} /><span><b>연락처</b> 010-0000-0000</span></div><div><Navigation size={21} /><span><b>안내</b> 방문 전 대표번호로 연락 주시면 빠르게 안내해 드립니다.</span></div></div>
        </article>
      </section>
    </SiteFrame>
  );
}
