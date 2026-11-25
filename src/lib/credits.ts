import { CREDIT_RULES, SUBJECT_MAP, TRACKS, type Group, type TrackId } from "@/data/subjects";
import { SEMS, type Sem } from "./store";
import type { SchoolCurriculum } from "@/data/curriculum";

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

// 진단 문구: 화면에서 번역할 수 있게 한국어 문구 틀(key)과 변수(vars)를 함께 돌려준다.
// text는 한국어로 채운 완성 문구(기존과 같음). 화면은 formatCheck(c, { t, … })로 영어/한국어를 그린다.
export type CheckVar = string | number | { sem: Sem } | { sems: Sem[] } | { subj: string } | { subjs: string[] } | { area: string } | { track: TrackId };
export type Check = { level: "ok" | "warn" | "info"; text: string; key: string; vars?: Record<string, CheckVar> };
export type CheckFmt = {
  /** 문구 번역 (useT의 t). 없으면 한국어 그대로 */
  t?: (ko: string, vars?: Record<string, string | number>) => string;
  /** 과목명 표기 */
  subject?: (name: string) => string;
  /** 계열 이름 표기 */
  track?: (id: TrackId) => string;
};

const fillVars = (s: string, vars?: Record<string, string | number>) => {
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
};

export function formatCheck(c: Pick<Check, "key" | "vars">, f: CheckFmt = {}): string {
  const t = f.t ?? fillVars;
  const subj = f.subject ?? ((n: string) => n);
  const track = f.track ?? ((id: TrackId) => t(TRACKS[id].name));
  const sem = (s: Sem) => t(SEM_LABEL[s]);
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(c.vars ?? {})) {
    if (typeof v === "string" || typeof v === "number") out[k] = v;
    else if ("sem" in v) out[k] = sem(v.sem);
    else if ("sems" in v) out[k] = v.sems.map(sem).join(", ");
    else if ("subj" in v) out[k] = subj(v.subj);
    else if ("subjs" in v) out[k] = v.subjs.map(subj).join(", ");
    else if ("area" in v) out[k] = t(v.area);
    else if ("track" in v) out[k] = track(v.track);
  }
  return t(c.key, out);
}

const mk = (level: Check["level"], key: string, vars?: Record<string, CheckVar>): Check => ({ level, key, vars, text: formatCheck({ key, vars }) });

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
  if (total >= CREDIT_RULES.subjectTotal) checks.push(mk("ok", "교과 {total}학점 + 창체 18학점 = {sum}학점으로 졸업 기준 192학점을 채웠어요.", { total, sum: total + 18 }));
  else checks.push(mk("warn", "교과 학점이 {lack}학점 부족해요. (현재 {total} / {goal})", { lack: CREDIT_RULES.subjectTotal - total, total, goal: CREDIT_RULES.subjectTotal }));

  // 필수 이수 학점
  const areaResults = CREDIT_RULES.requiredByArea.map((a) => {
    const have = a.groups.reduce((s, k) => s + g(k), 0);
    return { ...a, have, ok: have >= a.min };
  });
  const missing = areaResults.filter((a) => !a.ok);
  if (missing.length === 0) checks.push(mk("ok", "교과(군)별 필수 이수 학점(총 84학점)을 모두 채웠어요."));
  else missing.forEach((a) => checks.push(mk("warn", "{area} 필수 이수 학점이 부족해요 ({have}/{min}).", { area: { area: a.area }, have: a.have, min: a.min })));

  // 국영수 상한
  const basic = g("국어") + g("수학") + g("영어");
  if (basic > CREDIT_RULES.basicCap) checks.push(mk("warn", "국어·수학·영어 합계가 {basic}학점(국어 {ko}·수학 {ma}·영어 {en})으로 상한 81학점을 넘었어요. 총 {over}학점을 줄여야 해요.", { basic, ko: g("국어"), ma: g("수학"), en: g("영어"), over: basic - CREDIT_RULES.basicCap }));
  else checks.push(mk("ok", "국어·수학·영어 합계 {basic}학점 (상한 81학점 이내)", { basic }));

  // 체육 매 학기 편성
  const filledSems = SEMS.filter((s) => (plan[s] ?? []).length > 0);
  const noPE = filledSems.filter((s) => !(plan[s] ?? []).some((e) => parseEntry(e).subject?.group === "체육"));
  if (filledSems.length === 6 && noPE.length) checks.push(mk("warn", "체육은 매 학기 편성하는 것이 원칙이에요. {sems}에 체육 과목이 없어요.", { sems: { sems: noPE } }));

  // 학기 균형
  SEMS.forEach((sem) => {
    const t = semTotals[sem];
    if (t > 0 && (t < 25 || t > 33)) checks.push(mk("info", "{sem}은 {n}학점이에요. 학기당 약 28~30학점이 고르게 편성되는 것이 일반적이에요.", { sem: { sem }, n: t }));
  });

  // 선수과목
  for (const [name, idx] of placed) {
    const s = SUBJECT_MAP[name];
    for (const p of s?.prereq ?? []) {
      const pi = placed.get(p);
      if (pi === undefined) checks.push(mk("info", "'{name}'을(를) 듣기 전에 '{pre}'을(를) 먼저 배우는 것을 권장해요.", { name: { subj: name }, pre: { subj: p } }));
      else if (pi > idx) checks.push(mk("warn", "'{pre}'이(가) '{name}'보다 늦게 배치되어 있어요. 순서를 바꿔 보세요.", { name: { subj: name }, pre: { subj: p } }));
      else if (pi === idx) checks.push(mk("warn", "'{pre}'와(과) '{name}'이(가) 같은 학기에 있어요. 선수과목은 이전 학기에 배우는 것이 좋아요.", { name: { subj: name }, pre: { subj: p } }));
    }
  }

  // 같은 학기 중복
  SEMS.forEach((sem) => {
    const names = (plan[sem] ?? []).map((e) => parseEntry(e).name);
    names.filter((n, i) => names.indexOf(n) !== i).forEach((n) => checks.push(mk("warn", "{sem}에 '{name}'이(가) 두 번 담겨 있어요.", { sem: { sem }, name: { subj: n } })));
  });

  // 수능 출제 과목
  const noSuneung = SUNEUNG_REQ.filter((s) => !placed.has(s));
  if (noSuneung.length === 0) checks.push(mk("ok", "2028 수능 국어·수학·영어 출제 과목을 모두 담았어요."));
  else checks.push(mk("info", "수능 출제 과목 중 {list}이(가) 빠져 있어요. 수능 응시 계획이 있다면 확인하세요.", { list: { subjs: noSuneung } }));

  // 계열 적합도
  let trackFit: { core: string[]; coreHave: string[]; rec: string[]; recHave: string[]; pct: number } | null = null;
  if (track) {
    const t = TRACKS[track];
    const coreHave = t.core.filter((s) => placed.has(s));
    const recHave = t.rec.filter((s) => placed.has(s));
    const pct = Math.round(((coreHave.length * 2 + recHave.length) / (t.core.length * 2 + t.rec.length)) * 100);
    trackFit = { core: t.core, coreHave, rec: t.rec, recHave, pct };
    const lack = t.core.filter((s) => !placed.has(s) && SUBJECT_MAP[s]);
    if (lack.length) checks.push(mk("warn", "{track} 계열 핵심 과목 중 {list}이(가) 빠져 있어요.", { track: { track }, list: { subjs: lack } }));
    else checks.push(mk("ok", "{track} 계열 핵심 과목을 모두 담았어요.", { track: { track } }));
  }

  return { total, semTotals, byGroup, areaResults, basic, checks, placed, trackFit };
}

// 같이 배울 때 앞서 배우는 편이 좋은 과목(필수 선수과목은 아니지만 흐름상 권장)
const SOFT_AFTER: Record<string, string[]> = { "미적분Ⅰ": ["대수"], "기하": ["대수"], "확률과 통계": [], "문학": ["독서와 작문"] };
// 자동 배치 때 선호하는 학기 번호(0=1학년 1학기 … 2=2학년 1학기 … 5=3학년 2학기)
const PREF_SEM: Record<string, number> = { "화법과 언어": 2, "대수": 2, "영어Ⅰ": 2, "독서와 작문": 3, "미적분Ⅰ": 3, "영어Ⅱ": 3, "문학": 4, "확률과 통계": 4, "미적분Ⅱ": 4, "기하": 4 };

// 계열 추천으로 2·3학년 자동 채우기 (선수과목 순서를 지켜 배치)
/** 목표(학과·직업)에서 나온 핵심·권장 과목. 계열 추천보다 먼저 배치한다 */
export type FillHints = { core: string[]; rec: string[] };
// stage: all=전체, required=체육·필수 교과 부족분만, core=핵심 과목만
export function autoFill(plan: Record<Sem, string[]>, track: TrackId | "", hints: FillHints = { core: [], rec: [] }, stage: "all" | "required" | "core" = "all"): Record<Sem, string[]> {
  const next: Record<Sem, string[]> = { ...plan, "1-1": plan["1-1"].length ? plan["1-1"] : TEMPLATE_Y1["1-1"], "1-2": plan["1-2"].length ? plan["1-2"] : TEMPLATE_Y1["1-2"] };
  const later: Sem[] = ["2-1", "2-2", "3-1", "3-2"];
  later.forEach((s) => (next[s] = [...(plan[s] ?? [])]));
  const has = (n: string) => SEMS.some((s) => next[s].some((e) => parseEntry(e).name === n));
  const semOf = (n: string) => SEMS.findIndex((s) => next[s].some((e) => parseEntry(e).name === n));
  const t = track ? TRACKS[track] : { core: [] as string[], rec: [] as string[] };
  const base = ["화법과 언어", "독서와 작문", "문학", "대수", "미적분Ⅰ", "확률과 통계", "영어Ⅰ", "영어Ⅱ"];
  const support = ["체육2", "운동과 건강", "진로와 직업", "정보", "기술·가정", "스포츠 생활1"];
  const wanted = (stage === "core" ? [...hints.core, ...t.core] : [...base, ...hints.core, ...t.core, ...hints.rec, ...t.rec.slice(0, 4), ...support]).filter((n, i, a) => SUBJECT_MAP[n] && a.indexOf(n) === i);
  const load = (s: Sem) => next[s].reduce((sum, e) => sum + parseEntry(e).credits, 0);

  const place = (name: string, credits?: number, cap = 31, early = false): boolean => {
    if (has(name) || !SUBJECT_MAP[name]) return false;
    const pre = [...(SUBJECT_MAP[name].prereq ?? []), ...(SOFT_AFTER[name] ?? [])];
    // 선수과목이 아직 없으면(공통과목 제외) 먼저 담는다
    for (const p of pre) if (SUBJECT_MAP[p] && SUBJECT_MAP[p].cat !== "공통" && !has(p)) place(p, undefined, cap, true);
    const minIdx = Math.max(2, ...pre.map((p) => (has(p) ? semOf(p) + 1 : 2)));
    // 학기 배치: 자연스러운 흐름(PREF_SEM)이 있으면 그 학기부터, 아니면 학점이 가장 적은 학기
    const want = PREF_SEM[name];
    const target = later
      .map((s) => ({ s, i: SEMS.indexOf(s) }))
      .filter(({ i }) => i >= minIdx)
      .sort((a, b) => early ? a.i - b.i : (want !== undefined ? Math.abs(a.i - want) - Math.abs(b.i - want) || load(a.s) - load(b.s) : load(a.s) - load(b.s)))[0];
    // 국어·수학·영어 합계 상한(81학점)을 넘기지 않는다
    const g0 = SUBJECT_MAP[name].group;
    const basicNow = SEMS.reduce((sum, sm) => sum + next[sm].reduce((x, e) => { const o = parseEntry(e); return x + (o.subject && ["국어", "수학", "영어"].includes(o.subject.group) ? o.credits : 0); }, 0), 0);
    if (["국어", "수학", "영어"].includes(g0) && basicNow + (credits ?? SUBJECT_MAP[name].credits) > CREDIT_RULES.basicCap) return false;
    if (target && load(target.s) + (credits ?? SUBJECT_MAP[name].credits) <= cap) {
      next[target.s].push(entry(name, credits));
      return true;
    }
    return false;
  };
  const two = new Set(["체육2", "운동과 건강", "스포츠 생활1", "스포츠 생활2", "스포츠 문화", "미술 창작", "음악 연주와 창작", "미술과 매체", "음악과 미디어", "음악 감상과 비평", "미술 감상과 비평", "진로와 직업"]);
  // 체육은 매 학기: 2·3학년 각 학기에 체육 과목 하나씩 먼저 배치
  if (stage !== "core") {
  const pe = ["체육2", "운동과 건강", "스포츠 생활1", "스포츠 생활2", "스포츠 문화"].filter((n) => !has(n));
  for (const s of later) {
    if (!next[s].some((e) => parseEntry(e).subject?.group === "체육") && pe.length) next[s].push(entry(pe.shift()!, 2));
  }
  }
  // 다른 과목의 선수과목이 되는 과목은 앞 학기에 둔다(이어지는 과목이 들어갈 자리를 남김)
  const needEarly = new Set(wanted.flatMap((n) => SUBJECT_MAP[n]?.prereq ?? []));
  if (stage !== "required") for (const name of wanted) place(name, two.has(name) ? 2 : undefined, 31, needEarly.has(name));

  // 학기가 가득 차서 못 담은 핵심 과목은 학기당 상한을 조금 넓혀 다시 시도
  if (stage !== "required") for (const cap of [32, 33]) for (const name of [...hints.core, ...t.core]) place(name, two.has(name) ? 2 : undefined, cap);
  if (stage === "core") return next;

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

  if (stage === "required") return next;

  // 남은 학점을 계열 권장·일반 선택으로 채워 174학점에 맞추기
  const extra = [...hints.rec, ...t.rec, "영어 독해와 작문", "주제 탐구 독서", "사회와 문화", "생명과학", "화학", "물리학", "지구과학", "세계사", "독서 토론과 글쓰기", "실용 통계", "데이터 과학", "인간과 심리", "금융과 경제생활", "매체 의사소통", "언어생활 탐구", "수학과 문화", "세계 문화와 영어", "기후변화와 환경생태", "여행지리", "생애 설계와 자립", "논술"];
  for (const cap of [32, 33]) {
    for (const name of extra) {
      const total = analyze(next, track).total;
      if (total >= 174) break;
      place(name, 174 - total < 4 ? Math.max(1, 174 - total) : undefined, cap);
    }
  }
  return next;
}

// 편제표 선택군에서 추천 순서대로 자동 선택 (이미 고른 것은 유지, 다른 학기와 중복 방지)
export function autoPick(c: SchoolCurriculum, picks: Record<string, string[]>, rank: (name: string) => number): Record<string, string[]> {
  const next: Record<string, string[]> = { ...picks };
  const taken = new Set<string>();
  for (const s of SEMS) {
    c.sems[s].fixed.forEach((i) => taken.add(i.name));
    c.sems[s].groups.forEach((g) => (next[g.id] ?? []).forEach((n) => taken.add(n)));
  }
  for (const s of SEMS) {
    for (const g of c.sems[s].groups) {
      const cur = [...(next[g.id] ?? [])];
      const cands = g.options
        .map((o, i) => ({ n: o.name, r: rank(o.name), i }))
        .filter((o) => !taken.has(o.n))
        .sort((a, b) => b.r - a.r || a.i - b.i);
      for (const o of cands) {
        if (cur.length >= g.pick) break;
        cur.push(o.n);
        taken.add(o.n);
      }
      next[g.id] = cur;
    }
  }
  return next;
}
