import type { Metadata } from "next";

export const metadata: Metadata = { title: "경남 산업 진로 지도", description: "조선·항공우주·기계·나노 등 경남 산업과 연결된 직업·학과·고등학교." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
