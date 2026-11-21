import type { Metadata } from "next";

export const metadata: Metadata = { title: "고3 진로 전환기 10차시", description: "수능 이후 대학 생활·근로·금융·안전을 준비하는 10차시 수업 자료와 체크리스트." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
