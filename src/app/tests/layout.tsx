import type { Metadata } from "next";

export const metadata: Metadata = { title: "진로검사·상담", description: "커리어넷·고용24 공식 진로심리검사와 상담 창구, 공식 검사 결과 비교." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
