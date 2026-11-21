import type { Metadata } from "next";

export const metadata: Metadata = { title: "진로·학업설계 가이드북", description: "학생·보호자·교사가 함께 읽는 5장짜리 진로·학업설계 안내서." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
