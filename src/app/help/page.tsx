import type { Metadata } from "next";
import { HelpBody } from "./HelpBody";

export const metadata: Metadata = { title: "이용 안내", description: "마이로드 경남을 처음 쓰는 학생을 위한 쉬운 안내. 단계별 사용법, 192학점 설계 따라 하기, 어려운 말 풀이, 자주 묻는 질문." };

export default function HelpPage() {
  return <HelpBody />;
}
