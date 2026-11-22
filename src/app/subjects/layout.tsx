import type { Metadata } from "next";
import { STATS } from "@/data/stats";

export const metadata: Metadata = { title: "과목 백과", description: `2022 개정 교육과정 고교 ${STATS.subjects}과목의 학점, 평가 방식, 선수과목 위계도, 2028 수능 출제 여부.` };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
