import type { Metadata } from "next";

export const metadata: Metadata = { title: "미래 신산업 진로 탐색", description: "8대 신산업 퀴즈와 미래 트렌드 친화도 검사, 분야별 직업·학과·고교 과목 로드맵." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
