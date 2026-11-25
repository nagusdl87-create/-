"use client";

// 목표(학과·직업·계열)를 고르면 3년 전체 "모범안"을 보여 주고, 내 설계로 가져오게 하는 패널.
// 모범안은 정답이 아니라 우리 자료로 규칙대로 만든 참고 예시다(학과·직업 핵심·권장 과목, 필수 이수 학점, 선수과목 순서).
import { useMemo, useState } from "react";
import { Compass, Search, Sparkles, X } from "lucide-react";
import { SEMS, useStore, type CreditGoal } from "@/lib/store";
import { autoFill, parseEntry, SEM_LABEL } from "@/lib/credits";
import { buildModelPicks, buildModelPlan, hintsOf, reasonOf, resolveGoal } from "@/lib/modelPlan";
import { useLabels } from "@/lib/subjectLabel";
import { TRACKS, type TrackId } from "@/data/subjects";
import { curriculumToPlan } from "@/data/curriculum";
import { MAJORS_LITE } from "@/data/lite-majors";
import { JOBS_LITE } from "@/data/lite-jobs";

const same = (a: CreditGoal | null, b: CreditGoal) => !!a && a.kind === b.kind && a.id === b.id;

export function ModelPlanPanel() {
  const { state, update } = useStore();
  const { t, sl, tl } = useLabels();
  const cur = state.credits.curriculum;
  const [q, setQ] = useState("");
  const goal = useMemo(() => resolveGoal(state.credits.goal), [state.credits.goal]);

  const favMajors = state.favMajors.map((id) => MAJORS_LITE.find((m) => m.id === id)).filter(Boolean).slice(0, 5) as typeof MAJORS_LITE;
  const favJobs = state.favorites.map((id) => JOBS_LITE.find((j) => j.id === id)).filter(Boolean).slice(0, 5) as typeof JOBS_LITE;
  const found = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (k.length < 1) return [];
    const m = MAJORS_LITE.filter((x) => x.name.toLowerCase().includes(k)).slice(0, 6).map((x) => ({ goal: { kind: "major", id: x.id } as CreditGoal, name: x.name, tag: "학과" }));
    const j = JOBS_LITE.filter((x) => x.name.toLowerCase().includes(k)).slice(0, 6).map((x) => ({ goal: { kind: "job", id: x.id } as CreditGoal, name: x.name, tag: "직업" }));
    return [...m, ...j].slice(0, 10);
  }, [q]);

  const choose = (g: CreditGoal | null) => {
    const r = resolveGoal(g);
    update((s) => ({ ...s, credits: { ...s.credits, goal: g, track: r?.track || s.credits.track } }));
    setQ("");
  };

  // 미리보기: 편제표 모드면 그 학교의 선택군에서, 아니면 자유 설계 모범안
  const preview = useMemo(() => {
    if (!goal) return null;
    if (cur) return { plan: buildModelPicks(cur, goal, {}).plan, fixed: new Set(SEMS.flatMap((s) => cur.sems[s].fixed.map((i) => i.name))) };
    return { plan: buildModelPlan(goal), fixed: new Set<string>() };
  }, [goal, cur]);

  const nonEmpty = SEMS.some((s) => state.credits.plan[s].length > 0 && !cur);
  const replace = () => {
    if (!goal || !preview) return;
    if (nonEmpty && !confirm(t("지금 담아 둔 과목을 모범안으로 바꿀까요? (바꾼 뒤에도 자유롭게 고칠 수 있어요)"))) return;
    update((s) => ({ ...s, credits: { ...s.credits, track: goal.track || s.credits.track, plan: preview.plan } }));
  };
  const fillBlanks = () => {
    if (!goal) return;
    update((s) => ({ ...s, credits: { ...s.credits, track: goal.track || s.credits.track, plan: autoFill(s.credits.plan, goal.track, hintsOf(goal)) } }));
  };
  const fillPicks = () => {
    if (!goal || !cur) return;
    update((s) => {
      const c = s.credits;
      const r = buildModelPicks(cur, goal, c.picks);
      return { ...s, credits: { ...c, track: goal.track || c.track, picks: r.picks, plan: curriculumToPlan(cur, r.picks, c.extra) } };
    });
  };

  return (
    <section className="card no-print mb-4" aria-labelledby="model-title">
      <div className="flex items-start gap-3">
        <span className="icon-box shrink-0"><Compass className="h-5 w-5" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <h2 id="model-title" className="text-base font-extrabold">{t("내 목표로 모범안 만들기")}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{t("① 되고 싶은 학과·직업을 고르고 ② 3년 모범안을 보고 ③ 내 설계로 가져와 고쳐 보세요.")}</p>
        </div>
      </div>

      <div className="mt-3">
        {goal ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip chip-on">
              <b data-keep-ko>{goal.label}</b>
              <span className="opacity-80">· {t(goal.kindLabel)}</span>
              <button aria-label={t("목표 지우기")} className="ml-1" onClick={() => choose(null)}><X className="h-3.5 w-3.5" aria-hidden /></button>
            </span>
            {goal.track && <span className="text-xs text-slate-500">{t("계열")} {tl(goal.track)}</span>}
          </div>
        ) : (
          <p className="text-sm text-slate-600">{t("아직 목표가 없어요. 아래에서 고르면 그에 맞는 과목을 3년에 걸쳐 짜 드려요.")}</p>
        )}

        {(favMajors.length > 0 || favJobs.length > 0) && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-slate-500">{t("내가 찜한 것에서 고르기")}</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {favMajors.map((m) => (
                <button key={m.id} aria-pressed={same(state.credits.goal, { kind: "major", id: m.id })} className={`chip ${same(state.credits.goal, { kind: "major", id: m.id }) ? "chip-on" : ""}`} onClick={() => choose({ kind: "major", id: m.id })}>
                  <span data-keep-ko>{m.name}</span> <span className="opacity-60">{t("학과")}</span>
                </button>
              ))}
              {favJobs.map((j) => (
                <button key={j.id} aria-pressed={same(state.credits.goal, { kind: "job", id: j.id })} className={`chip ${same(state.credits.goal, { kind: "job", id: j.id }) ? "chip-on" : ""}`} onClick={() => choose({ kind: "job", id: j.id })}>
                  <span data-keep-ko>{j.emoji} {j.name}</span> <span className="opacity-60">{t("직업")}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3">
          <label className="relative block">
            <span className="sr-only">{t("학과·직업 이름으로 목표 찾기")}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input className="input pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("학과·직업 이름으로 찾기 (예: 간호, 컴퓨터, 교사)")} />
          </label>
          {found.length > 0 && (
            <ul className="mt-1 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-surface">
              {found.map((f) => (
                <li key={f.tag + f.goal.id}>
                  <button className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50" onClick={() => choose(f.goal)}>
                    <span data-keep-ko>{f.name}</span>
                    <span className="text-xs text-slate-500">{t(f.tag)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {q.trim() && found.length === 0 && <p className="mt-1 text-xs text-slate-500">{t("찾는 이름이 없어요. 아래 계열에서 골라도 돼요.")}</p>}
        </div>

        <div className="mt-3">
          <div className="text-xs font-semibold text-slate-500">{t("아직 정하지 못했다면 계열로 시작해요")}</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {(Object.keys(TRACKS) as TrackId[]).map((k) => {
              const g: CreditGoal = { kind: "track", id: k };
              return (
                <button key={k} aria-pressed={same(state.credits.goal, g)} className={`chip ${same(state.credits.goal, g) ? "chip-on" : ""}`} onClick={() => choose(same(state.credits.goal, g) ? null : g)}>
                  {TRACKS[k].emoji} {tl(k)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {goal && preview && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-600" aria-hidden />
            <h3 className="text-sm font-extrabold">{t("{label} 모범안", { label: goal.label })}{cur ? ` · ${t("편제표 기준")}` : ""}</h3>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            <b className="text-amber-600">★ {t("핵심")}</b> {goal.core.length ? goal.core.map(sl).join(", ") : t("계열 핵심 과목으로 짰어요")}
            {goal.rec.length > 0 && <> · <b className="text-sky-600">☆ {t("권장")}</b> {goal.rec.map(sl).join(", ")}</>}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {t("참고 예시예요. 정답이 아니에요. 우리 학교에 열리는 과목과 내 흥미에 맞게 바꿔 쓰세요. 대학별 권장과목은 학과 페이지의 원문 링크로 꼭 확인하세요.")}
          </p>

          <details open className="mt-3">
          <summary className="cursor-pointer text-xs font-bold text-brand-700">{t("6학기 표 접기·펼치기")}</summary>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SEMS.map((sem) => (
              <div key={sem} className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5">
                <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>{t(SEM_LABEL[sem])}</span>
                  <span>{t("{n}학점", { n: preview.plan[sem].reduce((x, e) => x + parseEntry(e).credits, 0) })}</span>
                </div>
                <ul className="space-y-1">
                  {preview.plan[sem].map((e, i) => {
                    const { name, credits } = parseEntry(e);
                    const r = reasonOf(name, preview.plan, goal, preview.fixed);
                    const mark = goal.core.includes(name) ? "core" : goal.rec.includes(name) ? "rec" : null;
                    return (
                      <li key={e + i} className="text-xs leading-snug">
                        <div className="flex justify-between gap-2">
                          <span className="min-w-0 truncate font-semibold text-slate-700">
                            {mark === "core" && <b className="text-amber-500">★ </b>}
                            {mark === "rec" && <b className="text-sky-500">☆ </b>}
                            {sl(name)}
                          </span>
                          <span className="shrink-0 text-slate-500">{credits}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{t(r.key, r.vars)}</div>
                      </li>
                    );
                  })}
                  {preview.plan[sem].length === 0 && <li className="text-xs text-slate-400">{t("비어 있어요")}</li>}
                </ul>
              </div>
            ))}
          </div>
          </details>

          <div className="mt-3 flex flex-wrap gap-2">
            {cur ? (
              <button className="btn-primary" onClick={fillPicks}>{t("이 모범안대로 내 선택군 채우기")}</button>
            ) : (
              <>
                <button className="btn-primary" onClick={replace}>{t("모범안을 내 설계로 가져오기")}</button>
                <button className="btn-ghost" onClick={fillBlanks}>{t("내가 담은 건 두고 빈 곳만 채우기")}</button>
              </>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {cur
              ? t("이미 고른 선택군은 그대로 두고, 비어 있는 곳만 목표에 맞게 채워요.")
              : t("가져온 뒤에도 과목을 마음대로 빼고 바꿀 수 있어요. 학교 편제표를 등록하면 그 학교의 선택군 안에서 골라 줘요.")}
          </p>
        </div>
      )}
    </section>
  );
}
