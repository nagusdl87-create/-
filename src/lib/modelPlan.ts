// 192학점 설계: 목표(학과·직업·계열)로 만드는 "모범안"과 "먼저 고칠 것" 안내.
// 모범안은 지어낸 정답이 아니라, 우리 자료(학과·직업의 핵심·권장 과목, 계열 핵심 과목, 교육부 필수 이수 규칙, 선수과목)로 규칙대로 만든 참고 예시다.
import { SEMS, type CreditGoal, type Sem } from "./store";
import { analyze, autoFill, autoPick, entry, parseEntry, SEM_LABEL, TEMPLATE_Y1, type FillHints } from "./credits";
import { SUBJECT_MAP, TRACKS, type TrackId } from "@/data/subjects";
import { CORE_JOBS, type FieldId } from "@/data/jobs-core";
import { CORE_MAJOR_MAP } from "@/data/majors-core";
import { MAJORS_LITE } from "@/data/lite-majors";
import { JOBS_LITE } from "@/data/lite-jobs";
import { curriculumToPlan, type SchoolCurriculum } from "@/data/curriculum";

export type ResolvedGoal = {
  goal: CreditGoal;
  label: string; // 화면에 보이는 이름(학과·직업·계열)
  kindLabel: "학과" | "직업" | "계열";
  track: TrackId | "";
  core: string[];
  rec: string[];
};

const uniq = (a: string[]) => a.filter((n, i) => SUBJECT_MAP[n] && a.indexOf(n) === i);
const emptyPlan = () => Object.fromEntries(SEMS.map((s) => [s, [] as string[]])) as Record<Sem, string[]>;

// 직업 분야 → 계열(학과 연결이 없는 직업의 대비책)
const FIELD_TRACK: Record<FieldId, TrackId> = {
  it: "ai", eng: "eng", sci: "nat", med: "med", edu: "edu", biz: "biz", law: "soc", art: "art", media: "soc", sports: "art", life: "soc", env: "nat",
};

const topTrack = (tracks: TrackId[]): TrackId | "" => {
  const n: Record<string, number> = {};
  tracks.forEach((t) => (n[t] = (n[t] ?? 0) + 1));
  return ((Object.keys(n) as TrackId[]).sort((a, b) => n[b] - n[a])[0] ?? "") as TrackId | "";
};

/** 빈도 순으로 과목을 모은다(여러 학과에 공통인 과목이 앞에 온다) */
const byFreq = (lists: string[][]) => {
  const n = new Map<string, number>();
  lists.forEach((l) => l.forEach((x) => n.set(x, (n.get(x) ?? 0) + 1)));
  return [...n.keys()].sort((a, b) => n.get(b)! - n.get(a)!);
};

export function resolveGoal(goal: CreditGoal | null | undefined): ResolvedGoal | null {
  if (!goal) return null;
  if (goal.kind === "track") {
    const t = TRACKS[goal.id as TrackId];
    return t ? { goal, label: t.name, kindLabel: "계열", track: goal.id as TrackId, core: uniq(t.core), rec: uniq(t.rec) } : null;
  }
  if (goal.kind === "major") {
    const m = MAJORS_LITE.find((x) => x.id === goal.id);
    if (!m) return null;
    const c = CORE_MAJOR_MAP[goal.id];
    return { goal, label: m.name, kindLabel: "학과", track: m.track, core: uniq(c?.core ?? m.core), rec: uniq(c?.rec ?? []) };
  }
  const j = JOBS_LITE.find((x) => x.id === goal.id);
  if (!j) return null;
  const cj = CORE_JOBS.find((x) => x.id === goal.id);
  const related = MAJORS_LITE.filter((m) => m.jobs.includes(goal.id) || cj?.majors.includes(m.name));
  const hs = cj?.hsSubjects ?? [];
  const core = uniq([...hs.slice(0, 4), ...byFreq(related.map((m) => uniq(m.core))).slice(0, 4)]).slice(0, 6);
  const rec = uniq([...hs.slice(4), ...byFreq(related.map((m) => uniq(CORE_MAJOR_MAP[m.id]?.rec ?? []))).slice(0, 6)]).filter((n) => !core.includes(n));
  const track = topTrack(related.map((m) => m.track)) || FIELD_TRACK[j.field];
  return { goal, label: j.name, kindLabel: "직업", track, core, rec };
}

export const hintsOf = (g: ResolvedGoal | null): FillHints => ({ core: g?.core ?? [], rec: g?.rec ?? [] });

/** 목표 → 모범안(자유 설계용 6학기 표) */
export function buildModelPlan(g: ResolvedGoal): Record<Sem, string[]> {
  return autoFill(emptyPlan(), g.track, hintsOf(g));
}

/** 목표 → 모범안(학교 편제표용: 지정 과목은 그대로, 선택군만 목표대로 고름) */
export function buildModelPicks(c: SchoolCurriculum, g: ResolvedGoal, keep: Record<string, string[]> = {}) {
  const track = g.track ? TRACKS[g.track] : null;
  const rank = (n: string) => (g.core.includes(n) ? 4 : g.rec.includes(n) ? 3 : track?.core.includes(n) ? 2 : track?.rec.includes(n) ? 1 : 0);
  const picks = autoPick(c, keep, rank);
  return { picks, plan: curriculumToPlan(c, picks, emptyPlan()) };
}

// ── 모범안의 과목별 "왜 이 과목인지"
export type Reason = { key: string; vars?: Record<string, string> };

export function reasonOf(name: string, plan: Record<Sem, string[]>, g: ResolvedGoal | null, fixedNames: Set<string> = new Set()): Reason {
  const s = SUBJECT_MAP[name];
  if (fixedNames.has(name)) return { key: "학교가 정해 둔 지정 과목이에요." };
  if (g?.core.includes(name)) return { key: "{label}의 핵심 과목이에요.", vars: { label: g.label } };
  if (g?.rec.includes(name)) return { key: "{label}에 도움이 되는 과목이에요.", vars: { label: g.label } };
  const tr = g?.track ? TRACKS[g.track] : null;
  if (tr?.core.includes(name)) return { key: "{track} 계열의 핵심 과목이에요.", vars: { track: tr.name } };
  if (tr?.rec.includes(name)) return { key: "{track} 계열에서 권장하는 과목이에요.", vars: { track: tr.name } };
  for (const sem of SEMS) {
    for (const e of plan[sem] ?? []) {
      const o = parseEntry(e);
      if (o.subject?.prereq?.includes(name)) return { key: "'{name}'을(를) 듣기 전에 먼저 배우는 과목이에요.", vars: { name: o.name } };
    }
  }
  if (s?.suneung) return { key: "2028 수능 출제 과목이에요." };
  if (s?.group === "체육") return { key: "체육은 매 학기 편성하는 것이 원칙이에요." };
  if (s?.group === "예술" || s?.group === "기술·가정/정보" || s?.group === "사회" || s?.group === "과학") return { key: "졸업에 필요한 {group} 필수 이수 학점을 채워요.", vars: { group: s.group } };
  return { key: "학점과 교과 균형을 맞춰 주는 과목이에요." };
}

// ── 먼저 고칠 것
export type FixAction = "y1" | "total" | "required" | "core" | "order" | "picks";
export type Fix = {
  id: string;
  level: "must" | "should" | "nice";
  title: Reason;
  detail: Reason;
  action?: { kind: FixAction; label: string };
};
type OrderIssue = { name: string; pre: string; idx: number };

function orderIssues(placed: Map<string, number>): OrderIssue[] {
  const out: OrderIssue[] = [];
  for (const [name, idx] of placed) {
    for (const p of SUBJECT_MAP[name]?.prereq ?? []) {
      const pi = placed.get(p);
      if (pi !== undefined && pi >= idx && idx > 0) out.push({ name, pre: p, idx });
    }
  }
  return out;
}

export function nextFixes(
  plan: Record<Sem, string[]>,
  track: TrackId | "",
  g: ResolvedGoal | null,
  opts: { curriculum: boolean; unfilledGroups: number }
): { top: Fix[]; more: number } {
  const a = analyze(plan, track);
  const fixes: Fix[] = [];
  const empty = a.total === 0;

  if (opts.curriculum && opts.unfilledGroups > 0) {
    fixes.push({
      id: "picks", level: "must",
      title: { key: "아직 고르지 않은 선택군이 {n}곳 있어요.", vars: { n: String(opts.unfilledGroups) } },
      detail: { key: "선택군마다 정해진 개수만큼 고르면 학점이 채워져요. 목표에 맞게 자동으로 골라 드릴 수 있어요." },
      action: { kind: "picks", label: "목표에 맞게 선택군 채우기" },
    });
  } else if (empty && !opts.curriculum) {
    fixes.push({
      id: "y1", level: "must",
      title: { key: "아직 비어 있어요. 1학년 공통과목부터 채워 볼까요?" },
      detail: { key: "1학년은 대부분 학교가 정해 둔 공통과목이에요. 위에서 목표를 고르면 모범안으로 3년 전체를 볼 수도 있어요." },
      action: { kind: "y1", label: "1학년 공통과목 채우기" },
    });
  }

  if (!empty) {
    const lack = Math.max(0, 174 - a.total);
    if (lack > 0 && !opts.curriculum) {
      fixes.push({
        id: "total", level: "must",
        title: { key: "교과 학점이 {n}학점 부족해요.", vars: { n: String(lack) } },
        detail: { key: "졸업하려면 교과 174학점 + 창체 18학점이 필요해요. 빈 학기를 목표에 맞는 과목으로 채워 드려요." },
        action: { kind: "total", label: "부족한 학점 채우기" },
      });
    }
    const miss = a.areaResults.filter((r) => !r.ok);
    if (miss.length && !opts.curriculum) {
      fixes.push({
        id: "required", level: "must",
        title: { key: "필수 이수 학점이 모자란 교과가 있어요: {list}", vars: { list: miss.map((m) => `${m.area} ${m.have}/${m.min}`).join(", ") } },
        detail: { key: "교과(군)마다 정해진 최소 학점이 있어요. 모자란 교과에 과목을 넣어 드려요." },
        action: { kind: "required", label: "필수 학점 채우기" },
      });
    }
    const order = orderIssues(a.placed);
    if (order.length) {
      const o = order[0];
      fixes.push({
        id: "order", level: "must",
        title: { key: "과목 순서를 바로잡아야 해요: '{pre}'은(는) '{name}'보다 먼저 배워야 해요.", vars: { pre: o.pre, name: o.name } },
        detail: { key: "선수과목을 먼저 배워야 이어지는 과목을 따라갈 수 있어요." },
        action: opts.curriculum ? undefined : { kind: "order", label: "순서 자동으로 바꾸기" },
      });
    }
    if (a.basic > 81) {
      fixes.push({
        id: "basic", level: "should",
        title: { key: "국어·수학·영어가 {n}학점 넘쳐요.", vars: { n: String(a.basic - 81) } },
        detail: { key: "국어·수학·영어는 합쳐서 81학점까지만 인정돼요. 한 과목을 줄이고 다른 교과로 바꿔 보세요." },
      });
    }
    const filled = SEMS.filter((s) => (plan[s] ?? []).length > 0);
    const noPE = filled.filter((s) => !(plan[s] ?? []).some((e) => parseEntry(e).subject?.group === "체육"));
    if (filled.length === 6 && noPE.length) {
      fixes.push({
        id: "pe", level: "should",
        title: { key: "{sems}에 체육 과목이 없어요.", vars: { sems: noPE.map((s) => SEM_LABEL[s]).join(", ") } },
        detail: { key: "체육은 매 학기 편성하는 것이 원칙이에요." },
        action: opts.curriculum ? undefined : { kind: "required", label: "체육 과목 넣기" },
      });
    }
    const wantCore = g ? g.core : track ? TRACKS[track].core.filter((n) => SUBJECT_MAP[n]) : [];
    const lackCore = wantCore.filter((n) => !a.placed.has(n));
    if (lackCore.length) {
      fixes.push({
        id: "core", level: "should",
        title: { key: "{label}에 중요한 과목이 빠져 있어요: {list}", vars: { label: g?.label ?? (track ? TRACKS[track].name : ""), list: lackCore.join(", ") } },
        detail: { key: "빠진 핵심 과목을 선수과목 순서에 맞는 학기에 넣어 드려요." },
        action: opts.curriculum ? undefined : { kind: "core", label: "핵심 과목 넣기" },
      });
    }
    const noSuneung = ["화법과 언어", "독서와 작문", "문학", "대수", "미적분Ⅰ", "확률과 통계", "영어Ⅰ", "영어Ⅱ"].filter((n) => !a.placed.has(n));
    if (noSuneung.length) {
      fixes.push({
        id: "suneung", level: "nice", title: { key: "수능 출제 과목 중 빠진 것이 있어요: {list}", vars: { list: noSuneung.join(", ") } },
        detail: { key: "수능을 볼 계획이라면 확인해 보세요. 계획이 없다면 괜찮아요." },
      });
    }
  }
  return { top: fixes.slice(0, 3), more: Math.max(0, fixes.length - 3) };
}

/** 고치기 버튼을 누르면 설계를 바꾼다(자유 설계 전용) */
export function applyFix(kind: FixAction, plan: Record<Sem, string[]>, track: TrackId | "", g: ResolvedGoal | null): Record<Sem, string[]> {
  const hints = hintsOf(g);
  if (kind === "y1") return { ...plan, ...TEMPLATE_Y1 };
  if (kind === "total") return autoFill(plan, track || g?.track || "", hints, "all");
  if (kind === "required") return autoFill(plan, track || g?.track || "", hints, "required");
  if (kind === "core") return autoFill(plan, track || g?.track || "", hints, "core");
  if (kind === "order") {
    const next = Object.fromEntries(SEMS.map((s) => [s, [...(plan[s] ?? [])]])) as Record<Sem, string[]>;
    // 한 번에 하나씩 최대 12번: 선수과목을 의존 과목보다 앞 학기로 옮긴다
    for (let guard = 0; guard < 12; guard++) {
      const placed = analyze(next, track).placed;
      const o = orderIssues(placed)[0];
      if (!o) break;
      const from = SEMS[placed.get(o.pre)!];
      const to = SEMS[o.idx - 1];
      const k = next[from].findIndex((e) => parseEntry(e).name === o.pre);
      if (k < 0) break;
      const [moved] = next[from].splice(k, 1);
      next[to].push(entry(parseEntry(moved).name, parseEntry(moved).credits));
    }
    return next;
  }
  return plan;
}
