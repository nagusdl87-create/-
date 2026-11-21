import type { Metadata } from "next";

export const metadata: Metadata = { title: "내 진로 리포트", description: "진로·학업 설계를 한 장으로 정리하고 인쇄·공유해요." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
