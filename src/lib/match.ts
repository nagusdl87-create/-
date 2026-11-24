import { QUESTIONS, RIASEC_ORDER, type RiasecKey } from "@/data/riasec";
import type { HsTypeId, Job } from "@/data/jobs-core";
import { HS_QUIZ, HS_TYPES } from "@/data/highschools";
import type { AppState } from "./store";
import { TERMS_BY_STAGE } from "@/data/plan";

export type Scores = Record<RiasecKey, number>; // 0~100

export function riasecScores(answers: Record<number, number>): Scores {
  const sums: Record<RiasecKey, { s: number; n: number }> = {
    R: { s: 0, n: 0 }, I: { s: 0, n: 0 }, A: { s: 0, n: 0 }, S: { s: 0, n: 0 }, E: { s: 0, n: 0 }, C: { s: 0, n: 0 },
  };
  for (const q of QUESTIONS) {
    const v = answers[q.id];
    if (v) {
      sums[q.type].s += v;
      sums[q.type].n += 1;
    }
  }
  const out = {} as Scores;
  for (const k of RIASEC_ORDER) {
    const { s, n } = sums[k];
    out[k] = n ? Math.round(((s / n - 1) / 3) * 100) : 0;
  }
  return out;
}

export function isTestComplete(answers: Record<number, number>) {
  return QUESTIONS.every((q) => answers[q.id]);
}

export function topTypes(scores: Scores, n = 2): RiasecKey[] {
  return [...RIASEC_ORDER].sort((a, b) => scores[b] - scores[a]).slice(0, n);
}

const POS_W = [3, 2, 1];

export function jobMatch(job: Pick<Job, "riasec" | "values">, scores: Scores, values: string[]): number {
  let wsum = 0;
  let acc = 0;
  job.riasec.forEach((k, i) => {
    const w = POS_W[i] ?? 1;
    acc += w * scores[k];
    wsum += w;
  });
  const interest = wsum ? acc / wsum : 0; // 0~100
  const overlap = job.values.filter((v) => values.includes(v)).length;
  const valueBonus = values.length ? (overlap / Math.min(3, job.values.length)) * 100 : interest;
  return Math.round(interest * 0.8 + valueBonus * 0.2);
}

export function hsQuizResult(hsQuiz: Record<number, number>, favorites: Job[]) {
  const totals = Object.fromEntries(HS_TYPES.map((h) => [h.id, 0])) as Record<HsTypeId, number>;
  HS_QUIZ.forEach((q, qi) => {
    const oi = hsQuiz[qi];
    if (oi === undefined) return;
    const w = q.options[oi]?.w ?? {};
    for (const [k, v] of Object.entries(w)) totals[k as HsTypeId] += v ?? 0;
  });
  // 찜한 직업에서 추천하는 고교 유형에 가산점
  for (const j of favorites) j.hsTypes.forEach((t, i) => (totals[t] += i === 0 ? 1.5 : 0.75));
  const max = Math.max(1, ...Object.values(totals));
  return HS_TYPES.map((h) => ({ type: h, pct: Math.round((totals[h.id] / max) * 100) })).sort((a, b) => b.pct - a.pct);
}

export function progress(state: AppState) {
  const allTasks = Object.values(state.tasks).flat();
  const hs = state.profile.stage === "hs";
  const planCount = Object.values(state.credits.plan).flat().length;
  const steps = [
    { key: "discover", done: isTestComplete(state.answers) && state.values.length > 0 },
    { key: "jobs", done: hs ? state.favorites.length + state.favMajors.length >= 1 : state.favorites.length >= 1 },
    { key: "path", done: state.hypothesis.trim().length > 0 },
    hs
      ? { key: "credits", done: planCount >= 30 }
      : { key: "highschool", done: Object.keys(state.hsQuiz).length === HS_QUIZ.length || state.hsInterest.length > 0 || state.favSchools.length > 0 },
    { key: "plan", done: state.logs.length > 0 || state.books.length > 0 || allTasks.some((t) => t.done) },
  ];
  const termTasks = TERMS_BY_STAGE[hs ? "hs" : "ms"].flatMap((x) => state.tasks[x.id] ?? []);
  const taskDone = termTasks.filter((t) => t.done).length;
  return { steps, doneCount: steps.filter((s) => s.done).length, taskDone, taskTotal: termTasks.length };
}
