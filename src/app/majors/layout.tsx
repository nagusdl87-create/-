import type { Metadata } from "next";
import { STATS } from "@/data/stats";

export const metadata: Metadata = { title: "학과 백과", description: `${STATS.majorsAll}개 대학 학과(마이로드 심화 ${STATS.majors}개 + 커리어넷 공식 정보)의 배우는 내용, 고교 관련 과목, 취업률, 진출 분야.` };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
