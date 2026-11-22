// 우리 학교 개설 과목(나이스 고등학교 시간표) ↔ 과목 백과(SUBJECT_MAP) 이름 맞추기
// 데이터: public/data/neis/subjects.json (scripts/fetch-neis.mjs가 매일 생성, 출처: 나이스 교육정보 개방 포털)
// 번들에 넣지 않고 실행 중에 /data/neis/subjects.json을 불러온다.
import { SUBJECTS } from "@/data/subjects";

export type NeisSubjects = {
  asOf: string;
  source?: string;
  schools: Record<string, { ay: string; sem: string; grades: Record<string, string[]> }>;
};

/** 이름 비교용: 공백 제거, 로마 숫자 Ⅰ·Ⅱ·Ⅲ → I·II·III, 가운뎃점 통일 */
export function normSubject(s: string): string {
  return s
    .normalize("NFKC") // Ⅰ→I, Ⅱ→II 등 호환 문자를 표준 문자로
    .replace(/\s+/g, "")
    .replace(/[·ㆍ•‧・]/g, "·")
    .toUpperCase();
}

let catalog: Map<string, string> | null = null;
function catalogIndex() {
  if (!catalog) catalog = new Map(SUBJECTS.map((s) => [normSubject(s.name), s.name]));
  return catalog;
}

/** 나이스 과목명 → 과목 백과 이름 (없으면 null) */
export function matchSubject(neisName: string): string | null {
  return catalogIndex().get(normSubject(neisName)) ?? null;
}

export type SchoolOffer = {
  code: string;
  ay: string;
  sem: string;
  asOf: string;
  /** 과목 백과와 일치한 과목 이름(백과 표기) */
  offered: Set<string>;
  /** 시간표에 나온 모든 과목(정규화한 이름) — 직접 입력 과목 비교용 */
  seen: Set<string>;
  /** 과목 백과에 없는 과목(학교 고유·전문·이전 교육과정 과목) */
  unknown: string[];
};

export function schoolOffer(data: NeisSubjects | null | undefined, code: string): SchoolOffer | null {
  const s = code ? data?.schools?.[code] : undefined;
  if (!s || !data) return null;
  const offered = new Set<string>();
  const seen = new Set<string>();
  const unknown = new Set<string>();
  for (const list of Object.values(s.grades ?? {})) {
    for (const n of list ?? []) {
      if (typeof n !== "string" || !n.trim()) continue;
      seen.add(normSubject(n));
      const m = matchSubject(n);
      if (m) offered.add(m);
      else unknown.add(n.trim());
    }
  }
  return {
    code, ay: s.ay, sem: s.sem, asOf: data.asOf, offered, seen,
    unknown: [...unknown].sort((a, b) => a.localeCompare(b, "ko")),
  };
}

export const fmtAsOf = (d: string) => (d ? d.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3") : "");
