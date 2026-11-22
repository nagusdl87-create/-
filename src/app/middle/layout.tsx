import type { Metadata } from "next";

export const metadata: Metadata = { title: "경남 중학교 정보", description: "경상남도 중학교의 주소·연락처, 급식, 학사일정, 가까운 고등학교와 진로체험지원센터를 한곳에서 봐요." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
