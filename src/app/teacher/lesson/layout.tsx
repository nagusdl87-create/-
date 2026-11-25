import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "진로 시간 수업 꾸러미",
  description: "진로 시간에 바로 쓰는 45분 수업 3차시(나 알기·과목 찾기·192학점 설계)의 수업 흐름, 학생 활동지, 학교 편제표 준비 안내.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
