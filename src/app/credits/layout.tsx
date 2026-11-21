import type { Metadata } from "next";

export const metadata: Metadata = { title: "192학점 과목 설계", description: "고교 3개년 과목을 담고 졸업 기준·필수 학점·선수과목·계열 적합도를 실시간 진단해요." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
