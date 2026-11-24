import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "선생님 모아 보기",
  description: "학생에게 받은 공유 코드·링크·파일을 이 기기에서만 모아 학급 진로 현황을 한눈에 봐요.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
