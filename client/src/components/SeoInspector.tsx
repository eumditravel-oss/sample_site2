import { seoConfig, seoForPath } from "@/config/seo";
import { CheckCircle2, Copy, ExternalLink, SearchCheck, TriangleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";

type AuditState = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogImage: string;
  h1Count: number;
  h2Count: number;
  missingAltCount: number;
  schemaTypes: string[];
};

const STORAGE_KEY = "agy-seo-inspector-s2";

export function SeoInspector() {
  const [location] = useLocation();
  const [enabled, setEnabled] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState("");
  const [audit, setAudit] = useState<AuditState | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const param = params.get("seo");
    if (param === "1" || param === "check" || param === "manage") {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
      setEnabled(true);
    } else if (param === "0" || param === "off") {
      window.sessionStorage.removeItem(STORAGE_KEY);
      setEnabled(false);
    } else if (window.sessionStorage.getItem(STORAGE_KEY) === "1") {
      setEnabled(true);
    }
  }, [location]);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;
    const timer = window.setTimeout(() => {
      const title = document.title;
      const description = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
      const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "";
      const h1Count = document.querySelectorAll("main h1").length;
      const h2Count = document.querySelectorAll("main h2").length;
      const missingAltCount = Array.from(document.querySelectorAll("main img")).filter(
        (img) => !img.hasAttribute("alt"),
      ).length;

      let schemaTypes: string[] = [];
      const rawJson = document.getElementById("seo-structured-data")?.textContent;
      if (rawJson) {
        try {
          const parsed = JSON.parse(rawJson);
          const graph = Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed];
          schemaTypes = graph.map((node: { "@type"?: string }) => String(node?.["@type"] ?? "")).filter(Boolean);
        } catch {
          schemaTypes = [];
        }
      }
      setAudit({ title, description, canonical, robots, ogImage, h1Count, h2Count, missingAltCount, schemaTypes });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [enabled, location]);

  if (!enabled || typeof document === "undefined") return null;

  const pageMeta = seoForPath(location);
  const closePanel = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    const url = new URL(window.location.href);
    url.searchParams.delete("seo");
    window.history.replaceState({}, "", url.toString());
    setEnabled(false);
  };

  const copyUrl = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLabel(label);
      window.setTimeout(() => setCopiedLabel(""), 1600);
    } catch {
      setCopiedLabel("");
    }
  };

  const titleLen = audit?.title.length ?? 0;
  const descLen = audit?.description.length ?? 0;
  const checks = [
    { label: `문서 제목 (${titleLen}자)`, ok: titleLen >= 12 && titleLen <= 60 },
    { label: `메타 설명 (${descLen}자)`, ok: descLen >= 45 && descLen <= 165 },
    { label: `본문 H1 유일성 (${audit?.h1Count ?? 0}개)`, ok: audit?.h1Count === 1 },
    { label: `이미지 alt 속성 누락 (${audit?.missingAltCount ?? 0}건)`, ok: (audit?.missingAltCount ?? 0) === 0 },
    { label: `표준 Canonical URL 지정`, ok: Boolean(audit?.canonical) },
    { label: `구조화 데이터 (${audit?.schemaTypes.length ?? 0}종)`, ok: (audit?.schemaTypes.length ?? 0) >= 3 },
  ];

  const baseFeed = seoConfig.siteUrl;

  return createPortal(
    <aside
      aria-label="SEO 실시간 관리 및 진단 패널"
      style={{
        position: "fixed",
        right: "18px",
        bottom: "18px",
        zIndex: 9999,
        width: "min(410px, calc(100vw - 28px))",
        maxHeight: "min(82vh, 720px)",
        overflowY: "auto",
        background: "#111526",
        color: "#f8fafc",
        border: "1px solid rgba(198,156,93,0.5)",
        borderRadius: "10px",
        boxShadow: "0 24px 54px rgba(0,0,0,0.45)",
        fontFamily: '"IBM Plex Sans KR", "Noto Sans KR", sans-serif',
        fontSize: "13px",
        lineHeight: 1.55,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          background: "#191f38",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: "#e6cfa8" }}>
          <SearchCheck size={17} />
          <span>SEO 관리 진단 인스펙터 (?seo=1)</span>
        </div>
        <button
          type="button"
          onClick={closePanel}
          aria-label="SEO 진단 패널 닫기"
          style={{ background: "transparent", border: 0, color: "#cbd5e1", padding: "4px", cursor: "pointer" }}
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: "16px", display: "grid", gap: "14px" }}>
        {/* 검색결과(SERP) 미리보기 */}
        <div style={{ background: "#fff", color: "#1e293b", padding: "12px 14px", borderRadius: "6px" }}>
          <div style={{ fontSize: "11px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {audit?.canonical || window.location.href}
          </div>
          <div style={{ fontSize: "15px", fontWeight: 800, color: "#1a0dab", marginTop: "3px" }}>
            {audit?.title || "제목 로딩 중"}
          </div>
          <div style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>
            {audit?.description || "설명 없음"}
          </div>
        </div>

        {/* 실시간 진단 항목 */}
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px 14px", borderRadius: "6px" }}>
          <strong style={{ display: "block", marginBottom: "8px", color: "#e6cfa8", fontSize: "12px" }}>
            현재 페이지 온페이지 SEO 자동 검수 ({pageMeta?.routePath ?? location})
          </strong>
          <div style={{ display: "grid", gap: "6px" }}>
            {checks.map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  {item.ok ? <CheckCircle2 size={14} color="#34d399" /> : <TriangleAlert size={14} color="#fbbf24" />}
                  {item.label}
                </span>
                <b style={{ color: item.ok ? "#34d399" : "#fbbf24" }}>{item.ok ? "양호" : "점검"}</b>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: "11px", color: "#cbd5e1" }}>
            <div>· Robots 정책: <code>{audit?.robots}</code></div>
            <div>· H2 섹션 수: {audit?.h2Count ?? 0}개</div>
            <div>· JSON-LD 스키마: {audit?.schemaTypes.join(", ") || "없음"}</div>
          </div>
        </div>

        {/* 검색엔진 제출용 피드 관리 */}
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px 14px", borderRadius: "6px" }}>
          <strong style={{ display: "block", marginBottom: "8px", color: "#e6cfa8", fontSize: "12px" }}>
            검색엔진(네이버·구글) 제출 파일 관리
          </strong>
          <div style={{ display: "grid", gap: "6px" }}>
            {[
              { name: "sitemap.xml (사이트맵)", file: "sitemap.xml" },
              { name: "rss.xml (네이버 RSS 피드)", file: "rss.xml" },
              { name: "robots.txt (크롤러 규칙)", file: "robots.txt" },
            ].map((feed) => {
              const fullUrl = `${baseFeed}${feed.file}`;
              return (
                <div key={feed.file} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", fontSize: "12px" }}>
                  <span>{feed.name}</span>
                  <div style={{ display: "inline-flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => void copyUrl(fullUrl, feed.file)}
                      style={{ padding: "3px 8px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "#fff", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
                    >
                      <Copy size={11} /> {copiedLabel === feed.file ? "복사됨" : "주소복사"}
                    </button>
                    <a
                      href={`${import.meta.env.BASE_URL}${feed.file}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: "3px 8px", borderRadius: "4px", background: "#3d468a", color: "#fff", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none" }}
                    >
                      열기 <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 소유권 인증 코드 현황 */}
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px 14px", borderRadius: "6px", fontSize: "12px" }}>
          <strong style={{ display: "block", marginBottom: "6px", color: "#e6cfa8" }}>
            웹마스터 소유권 인증 태그 현황
          </strong>
          <div style={{ color: "#cbd5e1", display: "grid", gap: "3px" }}>
            <div>· 네이버 서치어드바이저: {seoConfig.verification.naver ? "등록됨" : "미등록 (도메인 확정 시 입력)"}</div>
            <div>· Google Search Console: {seoConfig.verification.google ? "등록됨" : "미등록 (도메인 확정 시 입력)"}</div>
            <div style={{ marginTop: "6px", fontSize: "11px", color: "#94a3b8" }}>
              ※ 설정 수정 위치: <code>client/src/config/seo.ts</code>
            </div>
          </div>
        </div>
      </div>
    </aside>,
    document.body,
  );
}
