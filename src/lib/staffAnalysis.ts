// 교사용 진로 현황 분석과 세특(세부능력 및 특기사항) 초안 — 규칙 기반, 이 기기 안에서만 계산한다.
// 서버·외부 AI로 학생 기록을 보내지 않는다. 기록에 없는 사실은 만들지 않고, 문장마다 근거 기록을 함께 돌려준다.
// 결과 문장은 학교생활기록부용이라 한국어로만 만든다.
import type { AppState } from "@/lib/store";
import { isTestComplete, progress, riasecScores, topTypes } from "@/lib/match";
import { analyze } from "@/lib/credits";
import { RIASEC } from "@/data/riasec";
import { FIELDS } from "@/data/jobs-core";
import type { Catalog } from "./catalog";
import { TRACKS } from "@/data/subjects";

export type Analysis = {
  consistency: { level: "높음" | "보통" | "낮음" | "판단 불가"; lines: string[] };
  activity: { logKinds: [string, number][]; books: number; logsTotal: number; linkedToFav: number; withReflection: number };
  journey: { done: number; total: number; tasksDone: number; tasksTotal: number };
  credits: { planned: boolean; total: number; warns: number; track: string };
  strengths: string[];
  gaps: string[];
};

const shorten = (s: string, n: number) => {
  const x = s.replace(/\s+/g, " ").trim();
  return x.length > n ? x.slice(0, n - 1) + "…" : x;
};

type Maps = Pick<Catalog, "JOB_MAP" | "MAJOR_MAP">;

export function analyzeStudent(s: AppState, { JOB_MAP, MAJOR_MAP }: Maps): Analysis {
  const jobs = s.favorites.map((id) => JOB_MAP[id]).filter(Boolean);
  const majors = s.favMajors.map((id) => MAJOR_MAP[id]).filter(Boolean);
  const tested = isTestComplete(s.answers);
  const top = tested ? topTypes(riasecScores(s.answers), 2) : [];
  const p = progress(s);
  const lines: string[] = [];
  const parts: number[] = [];

  // 관심 직업·학과 일관성: (1) 같은 분야에 몰렸는지 (2) 관심 학과가 관심 직업과 이어지는지 (3) 흥미 유형과 직업이 맞는지
  if (jobs.length >= 2) {
    const cnt = new Map<string, number>();
    jobs.forEach((j) => cnt.set(j.field, (cnt.get(j.field) ?? 0) + 1));
    const [f, n] = [...cnt.entries()].sort((a, b) => b[1] - a[1])[0];
    parts.push(n / jobs.length);
    lines.push(`관심 직업 ${jobs.length}개 중 ${n}개가 ‘${FIELDS[f as keyof typeof FIELDS].name}’ 분야예요.`);
  } else if (jobs.length === 1) lines.push(`관심 직업이 1개(${jobs[0].name})라 분야 일관성은 판단하기 어려워요.`);
  if (majors.length && jobs.length) {
    const linked = majors.filter((m) => jobs.some((j) => j.majors.includes(m.name) || m.jobs.includes(j.id))).length;
    parts.push(linked / majors.length);
    lines.push(`관심 학과 ${majors.length}개 중 ${linked}개가 관심 직업과 이어져요.`);
  }
  if (top.length && jobs.length) {
    const hit = jobs.filter((j) => j.riasec.slice(0, 2).some((k) => top.includes(k))).length;
    parts.push(hit / jobs.length);
    lines.push(`흥미 유형(${top.map((k) => RIASEC[k].name).join("·")})과 맞는 관심 직업이 ${jobs.length}개 중 ${hit}개예요.`);
  }
  const avg = parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0;
  const level = !parts.length ? "판단 불가" : avg >= 0.6 ? "높음" : avg >= 0.35 ? "보통" : "낮음";

  // 활동·독서 분포
  const kinds = new Map<string, number>();
  s.logs.forEach((l) => kinds.set(l.kind || "기타", (kinds.get(l.kind || "기타") ?? 0) + 1));
  const linkedToFav = s.logs.filter((l) => l.jobId && s.favorites.includes(l.jobId)).length;
  const withReflection = s.logs.filter((l) => l.learned.trim() && l.next.trim()).length;

  const planned = Object.values(s.credits.plan).flat().length > 0;
  const a = planned ? analyze(s.credits.plan, s.credits.track) : null;
  const warns = a ? a.checks.filter((c) => c.level === "warn").length : 0;

  const strengths: string[] = [];
  const gaps: string[] = [];
  if (level === "높음") strengths.push("관심 직업·학과가 한 방향으로 모여 있어요.");
  if (tested) strengths.push(`흥미 탐색을 마쳤어요(${top.map((k) => RIASEC[k].name).join("·")} 유형).`);
  if (s.logs.length >= 3) strengths.push(`진로 활동 기록이 ${s.logs.length}개 쌓였어요.`);
  if (kinds.size >= 3) strengths.push(`활동 종류가 ${kinds.size}가지로 다양해요.`);
  if (s.books.length >= 2) strengths.push(`진로 독서 기록이 ${s.books.length}권이에요.`);
  if (withReflection >= 2) strengths.push(`배운 점과 다음 계획까지 쓴 활동이 ${withReflection}개예요.`);
  if (s.hypothesis.trim()) strengths.push("진로 가설을 직접 세웠어요.");
  if (a && warns === 0) strengths.push("192학점 설계에서 확인할 점이 없어요.");

  if (!tested) gaps.push("흥미 탐색을 아직 마치지 않았어요.");
  if (!s.values.length) gaps.push("중요한 가치를 아직 고르지 않았어요.");
  if (!jobs.length) gaps.push("찜한 직업이 없어요.");
  if (s.profile.stage === "hs" && !majors.length) gaps.push("관심 학과가 없어요.");
  if (level === "낮음") gaps.push("관심 직업·학과가 서로 이어지지 않아요. 공통점이나 이유를 함께 이야기해 보세요.");
  if (!s.logs.length) gaps.push("진로 활동 기록이 없어요.");
  else {
    if (jobs.length && !linkedToFav) gaps.push("관심 직업과 연결된 활동 기록이 없어요.");
    if (withReflection < Math.ceil(s.logs.length / 2)) gaps.push("‘배운 점’이나 ‘다음 계획’이 비어 있는 활동이 많아요.");
    if (s.logs.length >= 3 && kinds.size === 1) gaps.push("활동이 한 가지 종류에 몰려 있어요.");
  }
  if (!s.books.length) gaps.push("진로 독서 기록이 없어요.");
  if (!s.hypothesis.trim()) gaps.push("진로 가설을 아직 쓰지 않았어요.");
  if (s.profile.stage === "hs") {
    if (!planned) gaps.push("192학점 설계를 시작하지 않았어요.");
    else if (warns > 0) gaps.push(`192학점 진단에서 확인할 점이 ${warns}개 있어요.`);
  }
  if (p.taskTotal && p.taskDone === 0) gaps.push("학기별 할 일을 하나도 마치지 않았어요.");

  return {
    consistency: { level, lines: lines.length ? lines : ["관심 직업·학과 기록이 부족해서 판단하기 어려워요."] },
    activity: { logKinds: [...kinds.entries()].sort((x, y) => y[1] - x[1]), books: s.books.length, logsTotal: s.logs.length, linkedToFav, withReflection },
    journey: { done: p.doneCount, total: p.steps.length, tasksDone: p.taskDone, tasksTotal: p.taskTotal },
    credits: { planned, total: a ? a.total + 18 : 0, warns, track: s.credits.track ? TRACKS[s.credits.track].name : "" },
    strengths,
    gaps,
  };
}

/* ---------- 세특 초안 ---------- */

export type DraftPart = { text: string; evidence: string[] };

/** 받침 있으면 '을', 없으면 '를'. 한글이 아니면 '을(를)' */
const eul = (w: string) => {
  const c = w.trim().slice(-1).charCodeAt(0);
  if (!(c >= 0xac00 && c <= 0xd7a3)) return "을(를)";
  return (c - 0xac00) % 28 === 0 ? "를" : "을";
};

/**
 * 학생이 쓴 기록에서만 문장을 만든다. 문장마다 근거(어느 기록에서 가져왔는지)를 붙인다.
 * 교사가 직접 관찰·확인한 내용으로 고쳐 써야 하는 초안이다.
 */
export function draftSetuk(s: AppState, { JOB_MAP, MAJOR_MAP }: Maps): DraftPart[] {
  const out: DraftPart[] = [];
  const jobs = s.favorites.map((id) => JOB_MAP[id]).filter(Boolean);
  const majors = s.favMajors.map((id) => MAJOR_MAP[id]).filter(Boolean);
  const tested = isTestComplete(s.answers);
  const top = tested ? topTypes(riasecScores(s.answers), 2) : [];

  if (top.length) out.push({ text: `흥미 탐색 검사에서 ${top.map((k) => RIASEC[k].name).join("·")} 유형이 높게 나타났음.`, evidence: ["흥미 탐색 검사 결과"] });
  if (jobs.length || majors.length) {
    const j = jobs.slice(0, 3).map((x) => x.name).join(", ");
    const m = majors.slice(0, 3).map((x) => x.name).join(", ");
    const what = [j && `직업(${j})`, m && `학과(${m})`].filter(Boolean).join(", ");
    out.push({ text: `관심 ${what}${eul(what.replace(/\)$/, ""))} 직접 찾아 정리하며 진로 방향을 탐색함.`, evidence: [`찜한 직업·학과: ${[j, m].filter(Boolean).join(" / ")}`] });
  }
  if (s.hypothesis.trim()) out.push({ text: `진로 가설을 ‘${shorten(s.hypothesis, 80)}’(이)라고 세우고 이를 확인해 가려는 태도를 보임.`, evidence: ["나의 진로 가설"] });

  const logs = [...s.logs].sort((a, b) => (b.learned ? 1 : 0) - (a.learned ? 1 : 0) || b.date.localeCompare(a.date)).slice(0, 3);
  for (const l of logs) {
    const head = `‘${shorten(l.title || "제목 없음", 30)}’(${l.kind || "기타"})`;
    const ev = `진로 활동 기록: ${l.title || "제목 없음"} (${l.date})`;
    if (l.learned.trim()) {
      const next = l.next.trim() ? ` 이후 ‘${shorten(l.next, 60)}’${eul(l.next)} 이어가려는 계획을 세움.` : "";
      out.push({ text: `${head} 활동에 참여하여 ‘${shorten(l.learned, 80)}’(이)라는 점을 배웠다고 정리함.${next}`, evidence: [ev] });
    } else if (l.what.trim()) out.push({ text: `${head} 활동에서 ‘${shorten(l.what, 80)}’${eul(l.what)} 수행함.`, evidence: [ev] });
    else out.push({ text: `${head} 활동에 참여하고 기록으로 남김.`, evidence: [ev] });
  }
  for (const b of s.books.slice(0, 2)) {
    const ev = `진로 독서: ${b.title}`;
    out.push({
      text: b.thought.trim() ? `‘${shorten(b.title, 30)}’${eul(b.title)} 읽고 ‘${shorten(b.thought, 80)}’(이)라는 생각을 남김.` : `‘${shorten(b.title, 30)}’${eul(b.title)} 읽고 독서 기록을 작성함.`,
      evidence: [ev],
    });
  }
  const planned = Object.values(s.credits.plan).flat().length > 0;
  if (s.profile.stage === "hs" && planned && s.credits.track) out.push({ text: `${TRACKS[s.credits.track].name} 계열을 중심으로 3개년 과목 이수 계획을 설계함.`, evidence: ["192학점 설계"] });
  return out;
}
