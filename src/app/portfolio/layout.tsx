import type { Metadata } from "next";

export const metadata: Metadata = { title: "진로 포트폴리오", description: "진로활동 포트폴리오, 3개년 학업설계서, 진로 연계 독서 기록을 작성하고 인쇄해요." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
