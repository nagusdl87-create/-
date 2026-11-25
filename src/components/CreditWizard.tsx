"use client";

// 192학점 설계 "단계별 도우미": 지금 해야 할 한 걸음만 크게 보여 주고, 버튼 하나로 그 일을 하게 한다.
// 단계 진행은 설계 내용(목표·학점·진단)에서 자동으로 계산하므로 따로 저장하지 않는다(접기만 기기에 기억).
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronUp, Footprints } from "lucide-react";
import { SEMS, useStore } from "@/lib/store";
import { analyze } from "@/lib/credits";
import { buildModelPicks, buildModelPlan, nextFixes, resolveGoal } from "@/lib/modelPlan";
import { curriculumToPlan } from "@/data/curriculum";
import { useLabels } from "@/lib/subjectLabel";
import { Term } from "@/components/Term";

const KEY = "myroad:wizard";
const goTo = (id: string, focus?: string) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
  if (focus) setTimeout(() => document.getElementById(focus)?.focus({ preventScroll: true }), 350);
};

export function CreditWizard() {
  const { state, update } = useStore();
  const { t } = useLabels();
  const [open, setOpen] = useState(true);
  useEffect(() => { try { if (localStorage.getItem(KEY) === "0") setOpen(false); } catch { /* 저장소를 못 쓰면 항상 펼침 */ } }, []);
  const toggle = () => setOpen((v) => { try { localStorage.setItem(KEY, v ? "0" : "1"); } catch { /* 무시 */ } return !v; });

  const { plan, track, curriculum: cur, picks } = state.credits;
  const goal = useMemo(() => resolveGoal(state.credits.goal), [state.credits.goal]);
  const total = useMemo(() => analyze(plan, track).total, [plan, track]);
  const unfilled = useMemo(() => (cur ? SEMS.reduce((n, s) => n + cur.sems[s].groups.filter((g) => (picks[g.id] ?? []).length < g.pick).length, 0) : 0), [cur, picks]);
  const fixes = useMemo(() => nextFixes(plan, track, goal, { curriculum: !!cur, unfilledGroups: unfilled }), [plan, track, goal, cur, unfilled]);

  const hasGoal = !!(goal || track);
  const later = SEMS.slice(2).some((s) => plan[s].length > 0);
  const filled = later || (!!cur && Object.keys(picks).length > 0);
  const clean = filled && total >= 174 && fixes.top.length === 0;

  const steps = [
    { done: hasGoal, title: "목표를 골라요", desc: "되고 싶은 학과나 직업을 하나 골라요. 아직 모르겠으면 계열(인문·자연·공학…)만 골라도 돼요.",
      btn: "목표 고르러 가기", run: () => goTo("model-plan", "model-search") },
    { done: filled, title: "3년 모범안을 가져와요", desc: "고른 목표에 맞는 과목을 6학기로 나눠 담아 드려요. 정답이 아니라 시작점이에요.",
      btn: cur ? "모범안대로 선택군 채우기" : "모범안을 내 설계로 가져오기", disabled: !goal && !track,
      run: () => {
        const g = goal ?? (track ? resolveGoal({ kind: "track", id: track }) : null);
        if (!g) return;
        update((s) => {
          const c = s.credits;
          if (c.curriculum) { const r = buildModelPicks(c.curriculum, g, c.picks); return { ...s, credits: { ...c, picks: r.picks, plan: curriculumToPlan(c.curriculum, r.picks, c.extra) } }; }
          return { ...s, credits: { ...c, plan: buildModelPlan(g) } };
        });
        setTimeout(() => goTo("planner-grid"), 200);
      } },
    { done: clean, title: "빨간 안내부터 고쳐요", desc: "‘먼저 이것부터 고쳐요’의 1번부터 버튼을 눌러 고쳐요. 다 고치면 ‘큰 문제는 없어요’가 나와요.",
      btn: "고칠 곳 보러 가기", run: () => goTo("fix-first") },
    { done: !!cur, optional: true, title: "우리 학교 편제표로 맞춰 봐요 (선택)", desc: "학교를 고르면 학교가 정한 과목은 잠기고, 내가 고를 수 있는 칸만 남아요. 실제 수강 신청처럼 연습할 수 있어요.",
      link: "/credits/school", btn: "학교 편제표 등록하러 가기" },
    { done: false, last: true, title: "저장하고 선생님과 이야기해요", desc: "학업설계서를 인쇄(PDF)해서 선생님과 상의해요. 다른 기기에서도 쓰려면 ‘내 기록 백업’을 해 두세요.",
      btn: "학업설계서 인쇄", run: () => window.print(), link2: "/account" },
  ];
  const core = steps.slice(0, 3);
  const doneCount = core.filter((s) => s.done).length;
  const curIdx = steps.findIndex((s) => !s.done && !("optional" in s && s.optional));
  const now = steps[curIdx < 0 ? 4 : curIdx];

  return (
    <section className="card no-print mb-4 border-brand-200 bg-brand-50/40" aria-labelledby="wiz-title">
      <div className="flex items-center gap-2">
        <span className="icon-box shrink-0"><Footprints className="h-5 w-5" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <h2 id="wiz-title" className="text-base font-extrabold">{t("한 걸음씩 따라 하기")}</h2>
          <p className="text-xs text-slate-600">{t("핵심 3단계 중 {n}단계를 마쳤어요", { n: doneCount })}</p>
        </div>
        <button className="btn-ghost px-2 py-1.5 text-xs" aria-expanded={open} aria-controls="wiz-body" onClick={toggle}>
          {open ? <>{t("접기")} <ChevronUp className="h-3.5 w-3.5" aria-hidden /></> : <>{t("펼치기")} <ChevronDown className="h-3.5 w-3.5" aria-hidden /></>}
        </button>
      </div>

      {open && (
        <div id="wiz-body" className="mt-3">
          <ol className="flex flex-wrap gap-1.5" aria-label={t("단계")}>
            {steps.map((s, i) => (
              <li key={s.title} aria-current={s === now ? "step" : undefined}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${s.done ? "border-emerald-300 bg-emerald-50 text-emerald-800" : s === now ? "border-brand-500 bg-brand-600 text-white" : "border-slate-200 bg-surface text-slate-500"}`}>
                {s.done ? <Check className="h-3.5 w-3.5" aria-hidden /> : <span aria-hidden>{i + 1}</span>}
                <span className="sr-only">{s.done ? t("완료") : s === now ? t("지금 할 일") : t("다음")}:</span>
                {t(s.title.replace(" (선택)", ""))}
              </li>
            ))}
          </ol>

          <div className="mt-3 rounded-xl border border-brand-200 bg-surface p-4">
            <div className="text-xs font-bold text-brand-700">{t("지금 할 일")}</div>
            <div className="mt-0.5 text-lg font-extrabold">{t(now.title)}</div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{t(now.desc)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {"link" in now && now.link && !("run" in now && now.run) ? (
                <Link href={now.link} className="btn-primary">{t(now.btn)}</Link>
              ) : (
                <button className="btn-primary" disabled={"disabled" in now && now.disabled} onClick={() => "run" in now && now.run?.()}>{t(now.btn)}</button>
              )}
              {"link2" in now && now.link2 && <Link href={now.link2} className="btn-ghost">{t("내 기록 백업")}</Link>}
              {"optional" in now && now.optional && <span className="self-center text-xs text-slate-500">{t("건너뛰어도 돼요")}</span>}
              {"disabled" in now && now.disabled && <span className="self-center text-xs text-amber-700">{t("먼저 목표를 골라 주세요")}</span>}
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {t("모르는 말을 눌러 보세요:")} <Term id="편제표">{t("편제표")}</Term> · <Term id="선택군">{t("선택군")}</Term> · <Term id="선수과목">{t("선수과목")}</Term> · <Term id="핵심권장">{t("핵심·권장")}</Term> · <Term id="교과·창체">{t("창체")}</Term> · <Link href="/help#credits" className="font-semibold text-brand-700 underline">{t("자세한 설명 보기")}</Link>
          </p>
        </div>
      )}
    </section>
  );
}
