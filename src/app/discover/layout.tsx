import type { Metadata } from "next";

export const metadata: Metadata = { title: "나 알기", description: "흥미·가치관·강점을 5분 만에 탐색하고 나와 맞는 직업을 추천받아요." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
