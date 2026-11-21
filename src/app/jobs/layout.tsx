import type { Metadata } from "next";

export const metadata: Metadata = { title: "직업 백과", description: "경남 주력산업 직업을 포함한 51개 직업의 하는 일, 관련 학과, 고교 선택과목, 중학생 때 할 일." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
