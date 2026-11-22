import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "상담용 한 장 요약",
  description: "학부모·선생님 상담에 쓰는 진로·학업 기록 A4 한 장 요약이에요.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
