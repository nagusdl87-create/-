import type { Metadata } from "next";

export const metadata: Metadata = { title: "고교 유형·경남 고입", description: "고교 유형 비교와 퀴즈, 2027학년도 경남 고입 학군·전형 규칙·일정." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
