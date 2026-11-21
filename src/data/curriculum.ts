// 학교 교육과정 편제표 형식과 도우미
// 학교마다 학기별 '학교 지정 과목'과 '선택군(택N)'이 다릅니다. 학생·교사가 자기 학교 편제표를 입력하거나
// 공유 코드/파일로 받아 192학점 설계에 사용합니다.
import type { Sem } from "@/lib/store";

export type CurrItem = { name: string; credits: number };
export type CurrGroup = { id: string; label: string; pick: number; options: CurrItem[] };
export type SemCurr = { fixed: CurrItem[]; groups: CurrGroup[] };
export type SchoolCurriculum = { school: string; year: string; note?: string; sems: Record<Sem, SemCurr> };

export const SEM_KEYS: Sem[] = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2"];

const it = (name: string, credits = 4): CurrItem => ({ name, credits });
const g = (id: string, label: string, pick: number, names: string[], credits = 4): CurrGroup => ({ id, label, pick, options: names.map((n) => it(n, credits)) });

// 실제 학교가 아닌 '예시' 편제표 (일반고 표준형을 바탕으로 구성)
export const SAMPLE_CURRICULUM: SchoolCurriculum = {
  school: "예시 일반고 (가상의 학교)",
  year: "2027학년도 입학생",
  note: "실제 학교 편제표가 아닌 연습용 예시예요. 내 학교 편제표는 학교 누리집에서 확인해 직접 입력하세요.",
  sems: {
    "1-1": { fixed: [it("공통국어1"), it("공통수학1"), it("공통영어1"), it("한국사1", 3), it("통합사회1"), it("통합과학1"), it("과학탐구실험1", 1), it("체육1", 2), it("음악", 2)], groups: [] },
    "1-2": { fixed: [it("공통국어2"), it("공통수학2"), it("공통영어2"), it("한국사2", 3), it("통합사회2"), it("통합과학2"), it("과학탐구실험2", 1), it("체육1", 2), it("미술", 2)], groups: [] },
    "2-1": {
      fixed: [it("영어Ⅰ"), it("대수"), it("체육2", 2)],
      groups: [
        g("2-1a", "국어 선택", 1, ["화법과 언어", "독서와 작문"]),
        g("2-1b", "사회·과학 선택", 3, ["세계시민과 지리", "사회와 문화", "세계사", "현대사회와 윤리", "물리학", "화학", "생명과학", "지구과학"]),
        g("2-1c", "생활·교양 선택", 1, ["정보", "기술·가정", "중국어", "일본어"]),
      ],
    },
    "2-2": {
      fixed: [it("영어Ⅱ"), it("미적분Ⅰ"), it("운동과 건강", 2)],
      groups: [
        g("2-2a", "국어 선택", 1, ["문학", "독서와 작문", "화법과 언어"]),
        g("2-2b", "탐구 심화 선택", 2, ["정치", "경제", "윤리와 사상", "한국지리 탐구", "역학과 에너지", "물질과 에너지", "세포와 물질대사", "지구시스템과학"]),
        g("2-2c", "예술 선택", 1, ["미술 창작", "음악 연주와 창작"]),
        g("2-2d", "정보·외국어 선택", 1, ["인공지능 기초", "데이터 과학", "중국어 회화", "일본어 회화", "한문"]),
      ],
    },
    "3-1": {
      fixed: [it("확률과 통계"), it("스포츠 생활1", 2)],
      groups: [
        g("3-1a", "영어 선택", 1, ["영어 독해와 작문", "심화 영어", "실생활 영어 회화"]),
        g("3-1b", "수학 선택", 1, ["미적분Ⅱ", "기하", "경제 수학", "실용 통계"]),
        g("3-1c", "탐구 선택", 3, ["법과 사회", "사회문제 탐구", "국제 관계의 이해", "금융과 경제생활", "전자기와 양자", "화학 반응의 세계", "생물의 유전", "행성우주과학"]),
        g("3-1d", "교양 선택", 1, ["진로와 직업", "인간과 심리", "교육의 이해"]),
      ],
    },
    "3-2": {
      fixed: [it("스포츠 생활2", 2)],
      groups: [
        g("3-2a", "국어 선택", 1, ["주제 탐구 독서", "문학과 영상", "독서 토론과 글쓰기"]),
        g("3-2b", "수학 선택", 1, ["미적분Ⅱ", "기하", "인공지능 수학", "수학과제 탐구"]),
        g("3-2c", "탐구·융합 선택", 3, ["사회와 문화", "윤리문제 탐구", "기후변화와 지속가능한 세계", "과학의 역사와 문화", "기후변화와 환경생태", "융합과학 탐구", "물리학", "생명과학"]),
        g("3-2d", "예술 선택", 1, ["미술과 매체", "음악과 미디어"]),
        g("3-2e", "교양 선택", 1, ["생태와 환경", "논리와 사고", "보건"]),
      ],
    },
  },
};

export const emptyCurriculum = (school = ""): SchoolCurriculum => ({
  school,
  year: "",
  sems: Object.fromEntries(SEM_KEYS.map((s) => [s, { fixed: [], groups: [] }])) as unknown as Record<Sem, SemCurr>,
});

// 편제표 + 학생 선택 → 학기별 계획 항목("과목|학점")
export function curriculumToPlan(c: SchoolCurriculum, picks: Record<string, string[]>, extra: Record<Sem, string[]>): Record<Sem, string[]> {
  const out = {} as Record<Sem, string[]>;
  for (const s of SEM_KEYS) {
    const sem = c.sems[s] ?? { fixed: [], groups: [] };
    const fixed = sem.fixed.map((i) => `${i.name}|${i.credits}`);
    const chosen = sem.groups.flatMap((gr) =>
      (picks[gr.id] ?? []).map((n) => gr.options.find((o) => o.name === n)).filter(Boolean).map((o) => `${o!.name}|${o!.credits}`)
    );
    out[s] = [...fixed, ...chosen, ...(extra[s] ?? [])];
  }
  return out;
}

// 형식 검사 (파일·공유 코드로 받은 데이터)
export function parseCurriculum(raw: unknown): SchoolCurriculum | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<SchoolCurriculum>;
  if (typeof r.school !== "string" || !r.sems || typeof r.sems !== "object") return null;
  const num = (v: unknown, d: number) => (typeof v === "number" && v > 0 && v <= 10 ? Math.round(v) : d);
  const item = (x: unknown): CurrItem | null => {
    const o = x as CurrItem;
    return o && typeof o.name === "string" && o.name.trim() ? { name: o.name.trim().slice(0, 40), credits: num(o.credits, 4) } : null;
  };
  const sems = {} as Record<Sem, SemCurr>;
  for (const s of SEM_KEYS) {
    const src = (r.sems as Record<string, Partial<SemCurr>>)[s] ?? {};
    sems[s] = {
      fixed: (Array.isArray(src.fixed) ? src.fixed : []).map(item).filter(Boolean).slice(0, 30) as CurrItem[],
      groups: (Array.isArray(src.groups) ? src.groups : [])
        .map((gr, i) => {
          const o = gr as CurrGroup;
          const options = (Array.isArray(o?.options) ? o.options : []).map(item).filter(Boolean).slice(0, 40) as CurrItem[];
          if (!options.length) return null;
          return { id: typeof o.id === "string" && o.id ? o.id.slice(0, 20) : `${s}-${i}`, label: String(o.label ?? `선택군 ${i + 1}`).slice(0, 30), pick: Math.min(options.length, num(o.pick, 1)), options };
        })
        .filter(Boolean)
        .slice(0, 12) as CurrGroup[],
    };
  }
  return { school: r.school.slice(0, 40), year: String(r.year ?? "").slice(0, 30), note: r.note ? String(r.note).slice(0, 200) : undefined, sems };
}

export function encodeCurriculum(c: SchoolCurriculum): string {
  const bytes = new TextEncoder().encode(JSON.stringify(c));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeCurriculum(code: string): SchoolCurriculum | null {
  try {
    const bin = atob(code.replace(/-/g, "+").replace(/_/g, "/"));
    return parseCurriculum(JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))));
  } catch {
    return null;
  }
}

export function curriculumCredits(c: SchoolCurriculum, s: Sem) {
  const sem = c.sems[s];
  const fixed = sem.fixed.reduce((a, i) => a + i.credits, 0);
  const groups = sem.groups.reduce((a, gr) => a + gr.pick * (gr.options[0]?.credits ?? 0), 0);
  return { fixed, groups, total: fixed + groups };
}
