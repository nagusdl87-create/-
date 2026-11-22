import type { LucideIcon } from "lucide-react";
import { STATS } from "@/data/stats";
import {
  BookMarked, BookOpen, Briefcase, Calculator, ClipboardCheck, Compass, Factory, FolderOpen, GraduationCap,
  Lightbulb, ListChecks, MapPinned, Percent, Route, School, Target, Backpack, Rocket, HardDriveDownload, Users } from "lucide-react";
import type { Stage } from "@/data/plan";

export type NavItem = { href: string; label: string; desc: string; icon: LucideIcon };
export type Step = NavItem & { key: string; n: number };

export const JOURNEY: Record<Stage, Step[]> = {
  ms: [
    { href: "/discover", key: "discover", n: 1, label: "나 알기", icon: Compass, desc: "흥미 탐색 + 가치관·강점" },
    { href: "/jobs", key: "jobs", n: 2, label: "직업 찾기", icon: Lightbulb, desc: "나와 맞는 직업 찜하기" },
    { href: "/path", key: "path", n: 3, label: "길 잇기", icon: Route, desc: "직업 → 학과 → 고교 과목" },
    { href: "/highschool", key: "highschool", n: 4, label: "고교 고르기", icon: School, desc: "유형 비교 + 경남 고교 찾기" },
    { href: "/plan", key: "plan", n: 5, label: "계획·기록", icon: ListChecks, desc: "학기별 할 일과 활동 기록" },
  ],
  hs: [
    { href: "/discover", key: "discover", n: 1, label: "나 알기", icon: Compass, desc: "흥미 탐색 + 가치관·강점" },
    { href: "/majors", key: "jobs", n: 2, label: "학과·직업", icon: GraduationCap, desc: "관심 학과와 직업 찜하기" },
    { href: "/path", key: "path", n: 3, label: "길 잇기", icon: Route, desc: "학과 → 핵심·권장 과목" },
    { href: "/credits", key: "credits", n: 4, label: "과목 설계", icon: Calculator, desc: "192학점 3개년 설계" },
    { href: "/plan", key: "plan", n: 5, label: "계획·기록", icon: ListChecks, desc: "할 일·성적·활동 기록" },
  ],
};

export const EXPLORE: NavItem[] = [
  { href: "/jobs", label: "직업 백과", icon: Briefcase, desc: `${STATS.jobs}개 직업 · 경남 주력산업 직업 포함` },
  { href: "/majors", label: "학과 백과", icon: GraduationCap, desc: `학과 가이드 ${STATS.majors}개 · 전국 학과·개설 대학 탐색` },
  { href: "/subjects", label: "과목 백과", icon: BookOpen, desc: `2022 개정 ${STATS.subjects}과목 · 위계도 · 평가` },
  { href: "/schools", label: "경남 고교 찾기", icon: MapPinned, desc: `경남 ${STATS.schools}개 고교 지도 · 거리 · 학과` },
  { href: "/highschool", label: "고교 유형·경남 고입", icon: School, desc: "유형 비교 · 학군 · 2027 전형 일정" },
  { href: "/admission", label: "2028 대입", icon: Target, desc: "수능 개편 · 5등급 내신 · 전형" },
  { href: "/industry", label: "경남 산업 진로 지도", icon: Factory, desc: "지역 산업 · 직업 · 학교 연결" },
];

export const TOOLS: NavItem[] = [
  { href: "/credits", label: "192학점 설계", icon: Calculator, desc: "3개년 과목 설계 · 학교 편제표 · 진단" },
  { href: "/admission#calc", label: "내신 계산기", icon: Percent, desc: "5등급제 학점 가중 평균" },
  { href: "/portfolio", label: "포트폴리오", icon: FolderOpen, desc: "진로활동 · 학업설계서 · 독서" },
  { href: "/tests", label: "진로검사·상담", icon: ClipboardCheck, desc: "공식 심리검사 · 상담 창구" },
  { href: "/resources", label: "진로체험·자료", icon: Backpack, desc: "꿈길 체험 · 공식 자료 모음" },
  { href: "/future", label: "미래 신산업 탐색", icon: Rocket, desc: "신산업 퀴즈 · 트렌드 친화도 · 로드맵" },
  { href: "/transition", label: "고3 진로 전환기", icon: GraduationCap, desc: "수능 이후 10차시 수업 자료" },
  { href: "/guide", label: "진로·학업설계 가이드", icon: BookMarked, desc: "5장 가이드북 (학생·보호자·교사)" },
  { href: "/account", label: "내 기록 백업", icon: HardDriveDownload, desc: "백업 파일 저장 · 불러오기로 이어 쓰기" },
  { href: "/teacher", label: "선생님 모아 보기", icon: Users, desc: "학생 공유 링크·백업 파일로 학급 현황 보기" },
];
