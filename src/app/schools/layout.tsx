import type { Metadata } from "next";
import { STATS } from "@/data/stats";

export const metadata: Metadata = { title: "경남 고교 찾기", description: `경상남도 고등학교 ${STATS.schools}곳을 지도에서 찾고 학군·전형·학과별 모집 정원을 비교해요.` };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
