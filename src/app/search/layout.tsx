import type { Metadata } from "next";

export const metadata: Metadata = { title: "통합 검색", description: "직업·학과·과목·경남 고교 통합 검색." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
