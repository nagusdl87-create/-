import type { Metadata } from "next";
import { STATS } from "@/data/stats";

export const metadata: Metadata = { title: "직업 백과", description: `${STATS.jobsAll}개 직업(마이로드 심화 ${STATS.jobs}개 + 커리어넷 공식 정보)의 하는 일, 관련 학과, 고교 선택과목, 연봉·전망.` };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
