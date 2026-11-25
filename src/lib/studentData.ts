// 바깥에서 들어온 학생 기록(백업 파일·공유 링크·교사용 공개 사본)을 엄격하게 다듬는다.
// store.tsx의 sanitize보다 엄격하게: 이상한 값이 와도 화면이 멈추지 않도록.
import { initialState, SEMS, type AppState, type Book, type Goal, type Log, type Task } from "@/lib/store";
import { TRACKS, type TrackId } from "@/data/subjects";
import type { Term } from "@/data/plan";

const portfolioMap = (x: unknown) => {
  const out: Record<string, string> = {};
  if (isObj(x)) for (const [k, v] of Object.entries(x)) if (typeof v === "string" && k.length < 80) out[k] = v.slice(0, 8000);
  return out;
};
type Obj = Record<string, unknown>;
const isObj = (x: unknown): x is Obj => !!x && typeof x === "object" && !Array.isArray(x);
const str = (x: unknown) => (typeof x === "string" ? x : typeof x === "number" ? String(x) : "");
const strArr = (x: unknown) => (Array.isArray(x) ? x.filter((v): v is string => typeof v === "string") : []);
const numMap = (x: unknown) => {
  const out: Record<number, number> = {};
  if (isObj(x)) for (const [k, v] of Object.entries(x)) if (typeof v === "number" && Number.isFinite(v)) out[Number(k)] = v;
  return out;
};
function pick<T>(x: unknown, keys: string[], extra?: (o: Obj) => Partial<T>): T[] {
  if (!Array.isArray(x)) return [];
  return x.filter(isObj).map((o) => ({ ...Object.fromEntries(keys.map((k) => [k, str(o[k])])), ...(extra?.(o) ?? {}) }) as T);
}

export function normalizeFull(raw: unknown): AppState | null {
  if (!isObj(raw)) return null;
  const base = initialState();
  const p = isObj(raw.profile) ? raw.profile : {};
  const c = isObj(raw.credits) ? raw.credits : {};
  const plan = isObj(c.plan) ? c.plan : {};
  const extra = isObj(c.extra) ? c.extra : {};
  const tasks = { ...base.tasks };
  if (isObj(raw.tasks))
    for (const [k, v] of Object.entries(raw.tasks))
      if (Array.isArray(v)) tasks[k as Term] = pick<Task>(v, ["id", "text"], (o) => ({ done: o.done === true }));
  const picks: Record<string, string[]> = {};
  if (isObj(c.picks)) for (const [k, v] of Object.entries(c.picks)) picks[k] = strArr(v);
  const track = typeof c.track === "string" && c.track in TRACKS ? (c.track as TrackId) : "";
  const stage = p.stage === "ms" || p.stage === "hs" ? p.stage : "";
  const answers = numMap(raw.answers);
  return {
    ...base,
    profile: { name: str(p.name).trim(), school: str(p.school).trim(), grade: str(p.grade), stage: stage || (raw.version !== 2 && Object.keys(answers).length ? "ms" : ""), region: str(p.region), middle: str(p.middle) },
    answers,
    values: strArr(raw.values) as AppState["values"],
    strengths: strArr(raw.strengths),
    favorites: strArr(raw.favorites),
    favMajors: strArr(raw.favMajors),
    favSchools: strArr(raw.favSchools),
    hsQuiz: numMap(raw.hsQuiz),
    hsInterest: strArr(raw.hsInterest) as AppState["hsInterest"],
    tasks,
    goals: pick<Goal>(raw.goals, ["id", "term", "subject", "text"], (o) => ({ done: o.done === true })),
    logs: pick<Log>(raw.logs, ["id", "date", "title", "kind", "jobId", "why", "what", "learned", "next"]),
    books: pick<Book>(raw.books, ["id", "date", "title", "author", "why", "quote", "thought", "link", "next"]),
    hypothesis: str(raw.hypothesis),
    credits: {
      track,
      plan: Object.fromEntries(SEMS.map((s) => [s, strArr(plan[s])])) as AppState["credits"]["plan"],
      extra: Object.fromEntries(SEMS.map((s) => [s, strArr(extra[s])])) as AppState["credits"]["extra"],
      picks,
      curriculum: null, // 편제표는 모아 보기에 필요 없음(공유 링크 길이도 줄임)
      goal: null,
      school: null, // 학교 개설 과목 선택(D4)도 모아 보기에는 필요 없음
    },
    grades: [],
    portfolio: portfolioMap(raw.portfolio),
  };
}

