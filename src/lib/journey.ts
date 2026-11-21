import type { Stage } from "@/data/plan";

export type Step = { href: string; key: string; n: number; label: string; emoji: string; desc: string };

export const JOURNEY: Record<Stage, Step[]> = {
  ms: [
    { href: "/discover", key: "discover", n: 1, label: "나 알기", emoji: "🧭", desc: "흥미 탐색 + 가치관·강점" },
    { href: "/jobs", key: "jobs", n: 2, label: "직업 찾기", emoji: "💡", desc: "나와 맞는 직업 찜하기" },
    { href: "/path", key: "path", n: 3, label: "길 잇기", emoji: "🛤️", desc: "직업 → 학과 → 고교 과목" },
    { href: "/highschool", key: "highschool", n: 4, label: "고교 고르기", emoji: "🏫", desc: "유형 비교 + 경남 고교 찾기" },
    { href: "/plan", key: "plan", n: 5, label: "계획·기록", emoji: "✅", desc: "학기별 할 일과 활동 기록" },
  ],
  hs: [
    { href: "/discover", key: "discover", n: 1, label: "나 알기", emoji: "🧭", desc: "흥미 탐색 + 가치관·강점" },
    { href: "/majors", key: "jobs", n: 2, label: "학과·직업", emoji: "🎓", desc: "관심 학과와 직업 찜하기" },
    { href: "/path", key: "path", n: 3, label: "길 잇기", emoji: "🛤️", desc: "학과 → 핵심·권장 과목" },
    { href: "/credits", key: "credits", n: 4, label: "과목 설계", emoji: "🧮", desc: "192학점 3개년 설계" },
    { href: "/plan", key: "plan", n: 5, label: "계획·기록", emoji: "✅", desc: "할 일·성적·활동 기록" },
  ],
};

export const EXPLORE = [
  { href: "/jobs", label: "직업 백과", emoji: "💼", desc: "51개 직업 · 경남 주력산업 직업 포함" },
  { href: "/majors", label: "학과 백과", emoji: "🎓", desc: "56개 학과 · 고교 핵심·권장 과목" },
  { href: "/subjects", label: "과목 백과", emoji: "📚", desc: "2022 개정 137과목 · 위계도 · 평가" },
  { href: "/schools", label: "경남 고교 찾기", emoji: "🗺️", desc: "경남 203개 고교 지도 · 거리 · 비교" },
  { href: "/highschool", label: "고교 유형·경남 고입", emoji: "🏫", desc: "유형 비교 · 학군 · 2027 전형 일정" },
  { href: "/admission", label: "2028 대입", emoji: "🎯", desc: "수능 개편 · 5등급 내신 · 전형" },
  { href: "/industry", label: "경남 산업 진로 지도", emoji: "🏭", desc: "지역 산업 ↔ 직업 ↔ 학교" },
];

export const TOOLS = [
  { href: "/credits", label: "192학점 설계", emoji: "🧮", desc: "3개년 과목 설계 · 실시간 진단" },
  { href: "/admission#calc", label: "내신 계산기", emoji: "🧾", desc: "5등급제 학점 가중 평균" },
  { href: "/portfolio", label: "포트폴리오", emoji: "🗂️", desc: "진로활동 · 학업설계서 · 독서" },
  { href: "/tests", label: "진로검사·상담", emoji: "🩺", desc: "공식 심리검사 · 상담 창구" },
  { href: "/resources", label: "진로체험·자료", emoji: "🎒", desc: "꿈길 체험 · 자료 모음" },
  { href: "/guide", label: "진로·학업설계 가이드", emoji: "📘", desc: "5장 가이드북 (학생·학부모·교사)" },
];
