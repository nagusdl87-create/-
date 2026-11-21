import type { Metadata } from "next";

export const metadata: Metadata = { title: "길 잇기", description: "찜한 직업·학과에서 대학 학과, 고교 과목, 지금 할 일까지 한 줄로 이어요." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
