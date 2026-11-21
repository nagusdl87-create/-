import type { Metadata } from "next";

export const metadata: Metadata = { title: "학교 편제표 등록", description: "학교의 지정 과목과 선택군(택N)을 입력하고 공유해 192학점 설계에 사용해요." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
