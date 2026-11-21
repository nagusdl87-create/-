import type { Metadata } from "next";

export const metadata: Metadata = { title: "계획·기록", description: "학기별 할 일, 과목별 공부 목표, 4단계 성찰 활동 기록." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
