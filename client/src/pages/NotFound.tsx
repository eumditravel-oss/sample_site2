import { SiteFrame } from "@/components/SiteShell";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  usePageMeta("페이지를 찾을 수 없습니다", "요청한 페이지가 존재하지 않습니다.");
  return <SiteFrame><section className="s2-not-found"><span>404</span><p>PAGE NOT FOUND</p><h1>요청한 페이지를<br />찾을 수 없습니다.</h1><Link href="/"><ArrowLeft /> 메인으로 돌아가기</Link></section></SiteFrame>;
}
