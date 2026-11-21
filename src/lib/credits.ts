import { CREDIT_RULES, SUBJECT_MAP, TRACKS, type Group, type TrackId } from "@/data/subjects";
import { SEMS, type Sem } from "./store";

// 계획 항목 표기: "과목명" 또는 "과목명|학점"
export function parseEntry(e: string) {
  const [name, c] = e.split("|");
  const s = SUBJECT_MAP[name];
  return { name, credits: c ? Number(c) : s?.credits ?? 4, subject: s };
}
export const entry = (name: string, credits?: number) => (credits ? `${name}|${credits}` : name);

export const SEM_LABEL: Record<Sem, string> = {
  "1-1": "1학년 1학기", "1-2": "1학년 2학기", "2-1": "2학년 1학기", "2-2": "2학년 2학기", "3-1": "3학년 1학기", "3-2": "3학년 2학기",
};

// 일반고 1학년 공통과목 예시 편성 (학교마다 다르며, 학교 편제표에 맞게 수정)
export const TEMPLATE_Y1: Record<"1-1" | "1-2", string[]> = {
  "1-1": ["공통국어1", "공통수학1", "공통영어1", "한국사1", "통합사회1", "통합과학1", "과학탐구실험1", entry("체육1", 2), entry("음악", 2)],
  "1-2": ["공통국어2", "공통수학2", "공통영어2", "한국사2", "통합사회2", "통합과학2", "과학탐구실험2", entry("체육1", 2), entry("미술", 2)],
};

const SUNEUNG_REQ = ["화법과 언어", "독서와 작문", "문학", "대수", "미적분Ⅰ", "확률과 통계", "영어Ⅰ", "영어Ⅱ"];

export type Check = { level: "ok" | "warn" | "info"; text: string };

export function analyze(plan: Record<Sem, string[]>, track: TrackId | "") {
  const semTotals = {} as Record<Sem, number>;
  const byGroup = {} as Record<Group, number>;
  const placed = new Map<string, number>(); // 과목 → 처음 배치된 학기 index
  let total = 0;
  SEMS.forEach((sem, i) => {
    semTotals[sem] = 0;
    for (const e of plan[sem] ?? []) {
      const { name, credits, subject } = parseEntry(e);
      semTotals[sem] += credits;
      total += credits;
      if (subject) byGroup[subject.group] = (byGroup[subject.group] ?? 0) + credits;
      if (!placed.has(name)) placed.set(name, i);
    }
  });

  const checks: Check[] = [];
  const g = (k: Group) => byGroup[k] ?? 0;

  // 총 학점
  if (total >= CREDIT_RULES.subjectTotal) checks.push({ level: "ok", text: `교과 ${total}학점 + 창체 18학점 = ${total + 18}학점으로 졸업 기준 192학점을 채웠어요.` });
  else checks.push({ level: "warn", text: `교과 학점이 ${CREDIT_RULES.subjectTotal - total}학점 부족해요. (현재 ${total} / ${CREDIT_RULES.subjectTotal})` });

  // 필수 이수 학점
  const areaResults = CREDIT_RULES.requiredByArea.map((a) => {
    const have = a.groups.reduce((s, k) => s + g(k), 0);
    return { ...a, have, ok: have >= a.min };
  });
  const missing = areaResults.filter((a) => !a.ok);
  if (missing.length === 0) checks.push({ level: "ok", text: "교과(군)별 필수 이수 학점(총 84학점)을 모두 채웠어요." });
  else missing.forEach((a) => checks.push({ level: "warn", text: `${a.area} 필수 이수 학점이 부족해요 (${a.have}/${a.min}).` }));

  // 국영수 상한
  const basic = g("국어") + g("수학") + g("영어");
  if (basic > CREDIT_RULES.basicCap) checks.push({ level: "warn", text: `국어·수학·영어 합계가 ${basic}학점으로 상한 81학점을 넘었어요.` });
  else checks.push({ level: "ok", text: `국어·수학·영어 합계 ${basic}학점 (상한 81학점 이내)` });

  // 학기 균형
  SEMS.forEach((sem) => {
    const t = semTotals[sem];
    if (t > 0 && (t < 25 || t > 33)) checks.push({ level: "info", text: `${SEM_LABEL[sem]}은 ${t}학점이에요. 학기당 약 28~30학점이 고르게 편성되는 것이 일반적이에요.` });
  });

  // 선수과목
  for (const [name, idx] of placed) {
    const s = SUBJECT_MAP[name];
    for (const p of s?.prereq ?? []) {
      const pi = placed.get(p);
      if (pi === undefined) checks.push({ level: "info", text: `'${name}'을(를) 듣기 전에 '${p}'을(를) 먼저 배우는 것을 권장해요.` });
      else if (pi > idx) checks.push({ level: "warn", text: `'${p}'이(가) '${name}'보다 늦게 배치되어 있어요. 순서를 바꿔 보세요.` });
      else if (pi === idx) checks.push({ level: "warn", text: `'${p}'와(과) '${name}'이(가) 같은 학기에 있어요. 선수과목은 이전 학기에 배우는 것이 좋아요.` });
    }
  }

  // 같은 학기 중복
  SEMS.forEach((sem) => {
    const names = (plan[sem] ?? []).map((e) => parseEntry(e).name);
    names.filter((n, i) => names.indexOf(n) !== i).forEach((n) => checks.push({ level: "warn", text: `${SEM_LABEL[sem]}에 '${n}'이(가) 두 번 담겨 있어요.` }));
  });

  // 수능 출제 과목
  const noSuneung = SUNEUNG_REQ.filter((s) => !placed.has(s));
  if (noSuneung.length === 0) checks.push({ level: "ok", text: "2028 수능 국어·수학·영어 출제 과목을 모두 담았어요." });
  else checks.push({ level: "info", text: `수능 출제 과목 중 ${noSuneung.join(", ")}이(가) 빠져 있어요. 수능 응시 계획이 있다면 확인하세요.` });

  // 계열 적합도
  let trackFit: { core: string[]; coreHave: string[]; rec: string[]; recHave: string[]; pct: number } | null = null;
  if (track) {
    const t = TRACKS[track];
    const coreHave = t.core.filter((s) => placed.has(s));
    const recHave = t.rec.filter((s) => placed.has(s));
    const pct = Math.round(((coreHave.length * 2 + recHave.length) / (t.core.length * 2 + t.rec.length)) * 100);
    trackFit = { core: t.core, coreHave, rec: t.rec, recHave, pct };
    const lack = t.core.filter((s) => !placed.has(s) && SUBJECT_MAP[s]);
    if (lack.length) checks.push({ level: "warn", text: `${t.name} 계열 핵심 과목 중 ${lack.join(", ")}이(가) 빠져 있어요.` });
    else checks.push({ level: "ok", text: `${t.name} 계열 핵심 과목을 모두 담았어요.` });
  }

  return { total, semTotals, byGroup, areaResults, basic, checks, placed, trackFit };
}

// 계열 추천으로 2·3학년 자동 채우기 (선수과목 순서를 지켜 배치)
export function autoFill(plan: Record<Sem, string[]>, track: TrackId): Record<Sem, string[]> {
  const next: Record<Sem, string[]> = { ...plan, "1-1": plan["1-1"].length ? plan["1-1"] : TEMPLATE_Y1["1-1"], "1-2": plan["1-2"].length ? plan["1-2"] : TEMPLATE_Y1["1-2"] };
  const later: Sem[] = ["2-1", "2-2", "3-1", "3-2"];
  later.forEach((s) => (next[s] = [...(plan[s] ?? [])]));
  const has = (n: string) => SEMS.some((s) => next[s].some((e) => parseEntry(e).name === n));
  const semOf = (n: string) => SEMS.findIndex((s) => next[s].some((e) => parseEntry(e).name === n));
  const t = TRACKS[track];
  const base = ["화법과 언어", "독서와 작문", "문학", "대수", "미적분Ⅰ", "확률과 통계", "영어Ⅰ", "영어Ⅱ"];
  const support = ["체육2", "운동과 건강", "진로와 직업", "정보", "기술·가정", "스포츠 생활1"];
  const wanted = [...base, ...t.core, ...t.rec.slice(0, 4), ...support].filter((n, i, a) => SUBJECT_MAP[n] && a.indexOf(n) === i);
  const load = (s: Sem) => next[s].reduce((sum, e) => sum + parseEntry(e).credits, 0);

  const place = (name: string, credits?: number, cap = 31) => {
    if (has(name) || !SUBJECT_MAP[name]) return false;
    const pre = SUBJECT_MAP[name].prereq ?? [];
    const minIdx = Math.max(2, ...pre.map((p) => (has(p) ? semOf(p) + 1 : 2)));
    const target = later
      .map((s) => ({ s, i: SEMS.indexOf(s) }))
      .filter(({ i }) => i >= minIdx)
      .sort((a, b) => load(a.s) - load(b.s))[0];
    if (target && load(target.s) + (credits ?? SUBJECT_MAP[name].credits) <= cap) {
      next[target.s].push(entry(name, credits));
      return true;
    }
    return false;
  };
  const two = new Set(["체육2", "운동과 건강", "스포츠 생활1", "스포츠 생활2", "스포츠 문화", "미술 창작", "음악 연주와 창작", "미술과 매체", "음악과 미디어", "음악 감상과 비평", "미술 감상과 비평", "진로와 직업"]);
  for (const name of wanted) place(name, two.has(name) ? 2 : undefined);

  // 필수 이수 학점이 부족한 교과(군) 채우기
  const fillers: Record<string, string[]> = {
    체육: ["체육2", "운동과 건강", "스포츠 생활1", "스포츠 생활2", "스포츠 문화"],
    예술: ["미술 창작", "음악 연주와 창작", "미술과 매체", "음악과 미디어", "음악 감상과 비평"],
    사회: ["사회와 문화", "세계시민과 지리", "현대사회와 윤리", "경제", "사회문제 탐구"],
    과학: ["물리학", "화학", "생명과학", "지구과학"],
    "기술·가정/정보": ["진로와 직업", "정보", "기술·가정", "생태와 환경", "인간과 심리", "논리와 사고"],
  };
  for (let guard = 0; guard < 30; guard++) {
    const a = analyze(next, track);
    const lack = a.areaResults.find((r) => !r.ok);
    if (!lack) break;
    const key = lack.groups.includes("기술·가정/정보") ? "기술·가정/정보" : lack.groups[0];
    const cand = (fillers[key] ?? []).find((n) => !has(n));
    if (!cand || !place(cand, two.has(cand) ? 2 : undefined, 33)) break;
  }

  // 남은 학점을 계열 권장·일반 선택으로 채워 174학점에 맞추기
  const extra = [...t.rec, "영어 독해와 작문", "주제 탐구 독서", "사회와 문화", "생명과학", "화학", "물리학", "지구과학", "세계사", "독서 토론과 글쓰기", "실용 통계", "데이터 과학", "인간과 심리", "금융과 경제생활", "매체 의사소통", "언어생활 탐구", "수학과 문화", "세계 문화와 영어", "기후변화와 환경생태", "여행지리", "생애 설계와 자립", "논술"];
  for (const cap of [32, 33]) {
    for (const name of extra) {
      const total = analyze(next, track).total;
      if (total >= 174) break;
      place(name, 174 - total < 4 ? Math.max(1, 174 - total) : undefined, cap);
    }
  }
  return next;
}
