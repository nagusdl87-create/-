"use client";

// "먼저 이것부터 고쳐요": 진단 결과를 중요한 순서로 3개까지만 보여 주고, 바로 고치는 버튼을 붙인다.
import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, Wrench } from "lucide-react";
import { SEMS, useStore } from "@/lib/store";
import { analyze } from "@/lib/credits";
import { applyFix, buildModelPicks, nextFixes, resolveGoal, type Fix } from "@/lib/modelPlan";
import { curriculumToPlan } from "@/data/curriculum";
import { useLabels } from "@/lib/subjectLabel";

export function FixFirst() {
  const { state, update } = useStore();
  const { t } = useLabels();
  const { plan, track, curriculum: cur, picks, extra } = state.credits;
  const goal = useMemo(() => resolveGoal(state.credits.goal), [state.credits.goal]);

  const unfilled = useMemo(() => {
    if (!cur) return 0;
    return SEMS.reduce((n, s) => n + cur.sems[s].groups.filter((g) => (picks[g.id] ?? []).length < g.pick).length, 0);
  }, [cur, picks]);
  const { top, more } = useMemo(() => nextFixes(plan, track, goal, { curriculum: !!cur, unfilledGroups: unfilled }), [plan, track, goal, cur, unfilled]);
  const total = useMemo(() => analyze(plan, track).total, [plan, track]);

  const run = (f: Fix) => {
    const kind = f.action?.kind;
    if (!kind) return;
    update((s) => {
      const c = s.credits;
      if (kind === "picks" && c.curriculum) {
        const fallback = resolveGoal(c.goal) ?? (c.track ? resolveGoal({ kind: "track", id: c.track }) : null);
        if (!fallback) return s; // 목표가 없으면 아래 안내 문구로 목표를 먼저 고르게 함
        const r = buildModelPicks(c.curriculum, fallback, c.picks);
        return { ...s, credits: { ...c, picks: r.picks, plan: curriculumToPlan(c.curriculum, r.picks, c.extra) } };
      }
      return { ...s, credits: { ...c, plan: applyFix(kind, c.plan, c.track, resolveGoal(c.goal)) } };
    });
  };
  const needGoal = !goal && !track;

  if (top.length === 0) {
    return (
      <div id="fix-first" className="card no-print mb-4 flex scroll-mt-24 items-start gap-3 border-emerald-200 bg-emerald-50" role="status">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
        <div>
          <div className="text-sm font-bold text-emerald-800">{t("큰 문제는 없어요")}</div>
          <p className="text-xs text-emerald-800/80">{t("교과 {n}/174학점이에요. 오른쪽 진단에서 더 다듬을 곳을 확인해 보세요.", { n: total })}</p>
        </div>
      </div>
    );
  }

  return (
    <section id="fix-first" className="card no-print mb-4 scroll-mt-24" aria-labelledby="fix-title">
      <div className="flex items-center gap-2">
        <Wrench className="h-4 w-4 text-brand-600" aria-hidden />
        <h2 id="fix-title" className="text-sm font-extrabold">{t("먼저 이것부터 고쳐요")}</h2>
        {more > 0 && <span className="text-xs text-slate-500">{t("이 밖에 {n}가지가 더 있어요 (오른쪽 진단)", { n: more })}</span>}
      </div>
      <ol className="mt-2 space-y-2">
        {top.map((f, i) => (
          <li key={f.id} className={`flex flex-wrap items-start gap-3 rounded-xl border p-3 ${f.level === "must" ? "border-amber-200 bg-amber-50/60" : "border-slate-200 bg-slate-50/60"}`}>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white" aria-hidden>{i + 1}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold">
                {f.level === "must" && <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-amber-600" aria-hidden />}
                {t(f.title.key, f.title.vars)}
              </div>
              <p className="mt-0.5 text-xs text-slate-600">{t(f.detail.key, f.detail.vars)}</p>
              {f.action?.kind === "picks" && needGoal && <p className="mt-1 text-xs font-semibold text-amber-700">{t("먼저 위에서 목표(학과·직업·계열)를 골라 주세요.")}</p>}
              {!f.action && cur && f.level !== "nice" && <p className="mt-1 text-xs text-slate-500">{t("편제표 모드에서는 선택군의 다른 과목으로 바꿔 보세요.")}</p>}
            </div>
            {f.action && (
              <button className="btn-primary shrink-0 py-1.5 text-xs" disabled={f.action.kind === "picks" && needGoal} onClick={() => run(f)}>
                {t(f.action.label)}
              </button>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
