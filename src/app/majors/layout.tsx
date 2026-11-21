import type { Metadata } from "next";

export const metadata: Metadata = { title: "학과 백과", description: "56개 대학 학과의 배우는 내용, 고교 핵심·권장 과목, 진출 분야." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
