// 모범안 점검: 대표 목표마다 174학점·필수 이수·선수과목 순서·핵심 과목이 맞는지 확인 (node --experimental-strip-types 대신 npx tsx)
import { buildModelPlan, resolveGoal, nextFixes } from "../src/lib/modelPlan";
import { analyze } from "../src/lib/credits";
import { MAJORS_LITE } from "../src/data/lite-majors";
import { JOBS_LITE } from "../src/data/lite-jobs";
import { SCHOOL_CURRICULA } from "../src/data/curricula";
import { buildModelPicks } from "../src/lib/modelPlan";
import { SEMS } from "../src/lib/store";
import { TRACKS } from "../src/data/subjects";

type G = { kind: "major" | "job" | "track"; id: string };
const goals: G[] = [
  ...(Object.keys(TRACKS) as string[]).map((id) => ({ kind: "track" as const, id })),
  ...MAJORS_LITE.map((m) => ({ kind: "major" as const, id: m.id })),
  ...JOBS_LITE.map((j) => ({ kind: "job" as const, id: j.id })),
];
let bad = 0, noTrack = 0, n = 0;
const issues: Record<string, number> = {};
for (const gg of goals) {
  const g = resolveGoal(gg);
  if (!g) { bad++; console.log("해석 실패", gg); continue; }
  if (!g.track) noTrack++;
  const plan = buildModelPlan(g);
  const a = analyze(plan, g.track);
  const f = nextFixes(plan, g.track, g, { curriculum: false, unfilledGroups: 0 });
  n++;
  const prob: string[] = [];
  if (a.total < 174) prob.push("총학점" + a.total);
  if (a.total > 180) prob.push("총학점초과" + a.total);
  if (a.areaResults.some((r) => !r.ok)) prob.push("필수부족");
  if (a.checks.some((c) => c.level === "warn" && /늦게|같은 학기|두 번/.test(c.key))) prob.push("순서");
  if (a.basic > 81) prob.push("국수영" + a.basic);
  for (const p of prob) issues[p] = (issues[p] ?? 0) + 1;
  if (prob.length && bad < 8) { console.log(g.label, prob.join(",")); bad++; }
}
console.log("목표", n, "계열 못 정함", noTrack, "문제 유형", issues);

// 편제표 모드: 등록된 모든 학교 편제표에서 대표 목표로 선택군을 채워 학점이 맞는지 확인
let cBad = 0, cN = 0;
for (const entry0 of SCHOOL_CURRICULA) {
  const c = entry0.curriculum;
  for (const id of ["nursing", "ai", "hum"]) {
    const g = resolveGoal(id === "nursing" ? { kind: "major", id } : { kind: "track", id: id === "ai" ? "ai" : "hum" });
    if (!g) continue;
    const r = buildModelPicks(c, g, {});
    const full = SEMS.every((s) => c.sems[s].groups.every((gr) => (r.picks[gr.id] ?? []).length >= Math.min(gr.pick, gr.options.length)));
    const tot = analyze(r.plan, g.track).total;
    cN++;
    if (!full || tot !== 174) { cBad++; if (cBad <= 5) console.log("편제표 문제", c.school, id, "채움", full, "합", tot); }
  }
}
console.log("편제표 점검", cN, "문제", cBad);
