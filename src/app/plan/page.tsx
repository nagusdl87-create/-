"use client";

import { useState } from "react";
import { uid, useStore, type Log } from "@/lib/store";
import { activeTerm, REFLECTION_STEPS, SUBJECTS_HS, SUBJECTS_MS, TERMS_BY_STAGE } from "@/data/plan";
import { JOB_MAP } from "@/data/jobs";
import { NextStep, PageHead } from "@/components/ui";
import { useEnData, useT } from "@/lib/i18n";

const usePlanEn = () => useEnData(() => import("@/i18n/data/plan.en"), "plan");
// "English (한국어)"의 괄호 속 한국어는 검사에서 제외(data-keep-ko)
function keepKo(s: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== "(") continue;
    let d = 0, j = i;
    for (; j < s.length; j++) { if (s[j] === "(") d++; else if (s[j] === ")" && --d === 0) break; }
    if (!/[가-힣]/.test(s.slice(i, j + 1))) { i = j; continue; }
    out.push(s.slice(last, i), <span key={i} data-keep-ko>{s.slice(i, j + 1)}</span>);
    last = j + 1;
    i = j;
  }
  return last ? [...out, s.slice(last)] : s;
}

type Tab = "tasks" | "goals" | "logs";

export default function PlanPage() {
  const { state, ready } = useStore();
  const t = useT();
  const [tab, setTab] = useState<Tab>("tasks");
  if (!ready) return <div className="h-64" />;
  return (
    <div>
      <PageHead tone="indigo" step={5} title={t("계획·기록")} desc={t("진로는 생각만으로 완성되지 않아요. 학기마다 작은 할 일을 정하고, 경험한 것을 기록하며 나의 성장을 쌓아 가요.")} />
      <TermPicker />
      <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1" role="tablist">
        {(
          [
            ["tasks", t("✅ 할 일")],
            ["goals", t("📚 공부 목표")],
            ["logs", t("📝 활동 기록 {n}", { n: state.logs.length })],
          ] as const
        ).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`flex-1 rounded-lg py-2 text-sm font-semibold ${tab === k ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
            {l}
          </button>
        ))}
      </div>
      {tab === "tasks" && <Tasks />}
      {tab === "goals" && <Goals />}
      {tab === "logs" && <Logs />}
      <NextStep href="/report" label={t("내 리포트 보기")} hint={t("지금까지의 진로 설계를 한 장으로 정리해 보세요")} />
    </div>
  );
}

function TermPicker() {
  const { state, update } = useStore();
  const tr = useT();
  const en = usePlanEn();
  const terms = TERMS_BY_STAGE[state.profile.stage || "ms"].map((x) => ({ ...x, ...(en?.TERMS_EN[x.id] ?? {}) }));
  const t = terms.find((x) => x.id === state.currentTerm) ?? terms[0];
  return (
    <div className="mb-4">
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {terms.map((x) => {
          const tasks = state.tasks[x.id] ?? [];
          const d = tasks.filter((k) => k.done).length;
          return (
            <button key={x.id} onClick={() => update((s) => ({ ...s, currentTerm: x.id }))} className={`shrink-0 rounded-xl border px-3 py-2 text-left ${x.id === t.id ? "border-brand-500 bg-brand-600 text-white" : "border-slate-200 bg-white"}`}>
              <div className="text-sm font-bold">{x.label}</div>
              <div className={`text-[11px] ${x.id === t.id ? "text-white" : "text-slate-500"}`}>
                {tr("{d}/{n} 완료", { d, n: tasks.length })}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm">
        <span className="font-bold text-amber-900">{t.theme}</span>
        {t.note && <span className="ml-1 text-amber-800">· {keepKo(t.note)}</span>}
      </div>
    </div>
  );
}

function Tasks() {
  const { state, update } = useStore();
  const tr = useT();
  const en = usePlanEn();
  const taskText = (s: string) => en?.TASKS_EN[s] ?? s;
  const term = activeTerm(state.profile.stage, state.currentTerm);
  const tasks = state.tasks[term] ?? [];
  const [text, setText] = useState("");
  const setTasks = (fn: (t: typeof tasks) => typeof tasks) => update((s) => ({ ...s, tasks: { ...s.tasks, [term]: fn(s.tasks[term] ?? []) } }));
  const suggestions = state.favorites
    .map((id) => JOB_MAP[id])
    .filter(Boolean)
    .flatMap((j) => j.msActions.map((a) => ({ a, j: j.name })))
    .filter(({ a }) => !tasks.some((t) => t.text === a))
    .slice(0, 6);
  const add = (t: string) => t.trim() && setTasks((ts) => [...ts, { id: uid(), text: t.trim(), done: false }]);
  const done = tasks.filter((t) => t.done).length;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_0.7fr] [&>*]:min-w-0">
      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">{tr("이번 학기 할 일")}</h2>
          <span className="text-sm font-semibold text-brand-600">
            {tasks.length ? Math.round((done / tasks.length) * 100) : 0}%
          </span>
        </div>
        <ul className="space-y-1.5">
          {tasks.map((t) => (
            <li key={t.id} className="group flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50">
              <input
                type="checkbox"
                className="h-5 w-5 shrink-0 accent-brand-600"
                checked={t.done}
                onChange={() => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                aria-label={taskText(t.text)}
              />
              <span className={`flex-1 text-sm ${t.done ? "text-slate-400 line-through" : "text-slate-700"}`}>{keepKo(taskText(t.text))}</span>
              <button onClick={() => setTasks((ts) => ts.filter((x) => x.id !== t.id))} className="text-xs text-slate-300 hover:text-rose-500" aria-label={tr("삭제")}>
                ✕
              </button>
            </li>
          ))}
        </ul>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            add(text);
            setText("");
          }}
        >
          <input className="input" placeholder={tr("할 일 추가하기")} value={text} onChange={(e) => setText(e.target.value)} maxLength={80} />
          <button className="btn-primary shrink-0">{tr("추가")}</button>
        </form>
      </div>
      <div className="card">
        <h2 className="font-bold">{tr("찜한 직업 맞춤 추천")}</h2>
        {suggestions.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">{tr("직업을 찜하면 중학생 때 해 볼 만한 활동을 추천해 드려요.")}</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {suggestions.map(({ a, j }) => (
              <li key={a} className="flex items-start justify-between gap-2 rounded-xl border border-slate-200 p-2.5 text-sm">
                <div>
                  <div className="text-slate-700">{tr(a)}</div>
                  <div className="text-[11px] text-slate-400">{tr(j)}</div>
                </div>
                <button className="chip shrink-0 hover:border-brand-300" onClick={() => add(a)}>
                  {tr("+ 담기")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Goals() {
  const { state, update } = useStore();
  const t = useT();
  const en = usePlanEn();
  const subj = (s: string) => en?.SUBJECT_NAMES[s] ?? s;
  const term = activeTerm(state.profile.stage, state.currentTerm);
  const goals = state.goals.filter((g) => g.term === term);
  const SUBJ = state.profile.stage === "hs" ? SUBJECTS_HS : SUBJECTS_MS;
  const [subject, setSubject] = useState(SUBJ[0]);
  const [text, setText] = useState("");
  return (
    <div className="card">
      <h2 className="font-bold">{t("과목별 공부 목표")}</h2>
      <p className="mt-1 text-xs text-slate-500">{t("점수보다 ‘어떻게 공부할지’를 구체적으로 적어 보세요. 예) 수학: 틀린 문제 오답노트 주 3회")}</p>
      <form
        className="mt-3 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          update((s) => ({ ...s, goals: [...s.goals, { id: uid(), term, subject, text: text.trim(), done: false }] }));
          setText("");
        }}
      >
        <select className="input sm:w-36" value={subject} onChange={(e) => setSubject(e.target.value)} aria-label={t("과목")}>
          {SUBJ.map((s) => (
            <option key={s} value={s}>{subj(s)}</option>
          ))}
        </select>
        <input className="input" placeholder={t("목표 쓰기")} value={text} onChange={(e) => setText(e.target.value)} maxLength={80} />
        <button className="btn-primary shrink-0">{t("추가")}</button>
      </form>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {goals.map((g) => (
          <li key={g.id} className={`flex items-start gap-3 rounded-xl border p-3 ${g.done ? "border-emerald-200 bg-emerald-50" : "border-slate-200"}`}>
            <input type="checkbox" className="mt-0.5 h-5 w-5 accent-emerald-600" checked={g.done} onChange={() => update((s) => ({ ...s, goals: s.goals.map((x) => (x.id === g.id ? { ...x, done: !x.done } : x)) }))} aria-label={t("{s} 목표 달성", { s: subj(g.subject) })} />
            <div className="flex-1">
              <div className="text-xs font-bold text-brand-600">{subj(g.subject)}</div>
              <div className="text-sm text-slate-700">{g.text}</div>
            </div>
            <button className="text-xs text-slate-300 hover:text-rose-500" onClick={() => update((s) => ({ ...s, goals: s.goals.filter((x) => x.id !== g.id) }))} aria-label={t("삭제")}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      {goals.length === 0 && <p className="mt-4 text-center text-sm text-slate-400">{t("이번 학기 목표가 아직 없어요.")}</p>}
    </div>
  );
}

const KINDS = ["진로 체험", "동아리", "독서", "봉사", "대회·행사", "인터뷰", "기타"];

function Logs() {
  const { state, update } = useStore();
  const t = useT();
  const en = usePlanEn();
  const step = (r: (typeof REFLECTION_STEPS)[number]) => ({ ...r, ...(en?.REFLECTION_EN[r.key] ?? {}) });
  const empty = (): Log => ({ id: uid(), date: new Date().toISOString().slice(0, 10), title: "", kind: KINDS[0], jobId: "", why: "", what: "", learned: "", next: "" });
  const [draft, setDraft] = useState<Log | null>(null);

  if (draft) {
    const set = (k: keyof Log, v: string) => setDraft({ ...draft, [k]: v });
    return (
      <form
        className="card space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.title.trim()) return;
          update((s) => {
            const exists = s.logs.some((l) => l.id === draft.id);
            return { ...s, logs: exists ? s.logs.map((l) => (l.id === draft.id ? draft : l)) : [draft, ...s.logs] };
          });
          setDraft(null);
        }}
      >
        <h2 className="font-bold">{t("진로 활동 기록하기")}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <label className="label" htmlFor="lt">{t("활동 이름 *")}</label>
            <input id="lt" className="input" required value={draft.title} onChange={(e) => set("title", e.target.value)} maxLength={60} placeholder={t("예) 과학관 로봇 체험 프로그램")} />
          </div>
          <div>
            <label className="label" htmlFor="ld">{t("날짜")}</label>
            <input id="ld" type="date" className="input" value={draft.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="lk">{t("종류")}</label>
            <select id="lk" className="input" value={draft.kind} onChange={(e) => set("kind", e.target.value)}>
              {KINDS.map((k) => <option key={k} value={k}>{t(k)}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="lj">{t("관련 직업")}</label>
            <select id="lj" className="input" value={draft.jobId} onChange={(e) => set("jobId", e.target.value)}>
              <option value="">{t("선택 안 함")}</option>
              {state.favorites.map((id) => JOB_MAP[id] && <option key={id} value={id}>{t(JOB_MAP[id].name)}</option>)}
            </select>
          </div>
        </div>
        {REFLECTION_STEPS.map((r, i) => (
          <div key={r.key}>
            <label className="label" htmlFor={r.key}>
              {i + 1}. {step(r).label}
            </label>
            <textarea id={r.key} className="input min-h-[72px]" placeholder={step(r).hint} value={draft[r.key]} onChange={(e) => set(r.key, e.target.value)} maxLength={500} />
          </div>
        ))}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={() => setDraft(null)}>{t("취소")}</button>
          <button className="btn-primary">{t("저장")}</button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <button className="btn-primary mb-4" onClick={() => setDraft(empty())}>
        {t("+ 새 활동 기록")}
      </button>
      {state.logs.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
          {t("체험, 동아리, 독서 등 진로와 관련된 경험을 ‘계기 → 한 일 → 알게 된 점 → 다음 걸음’ 순서로 기록해 보세요.")}
          <br />
          {t("쌓인 기록은 고등학교 진학 상담과 자기소개에 큰 힘이 돼요.")}
        </p>
      ) : (
        <ul className="space-y-3">
          {state.logs.map((l) => (
            <li key={l.id} className="card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs text-slate-500">
                    {l.date} · {t(l.kind)}
                    {l.jobId && JOB_MAP[l.jobId] && ` · ${JOB_MAP[l.jobId].emoji} ${t(JOB_MAP[l.jobId].name)}`}
                  </div>
                  <div className="font-bold">{l.title}</div>
                </div>
                <div className="flex gap-2 text-xs">
                  <button className="text-slate-500 hover:text-brand-600" onClick={() => setDraft(l)}>{t("수정")}</button>
                  <button className="text-slate-400 hover:text-rose-500" onClick={() => confirm(t("이 기록을 삭제할까요?")) && update((s) => ({ ...s, logs: s.logs.filter((x) => x.id !== l.id) }))}>
                    {t("삭제")}
                  </button>
                </div>
              </div>
              <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                {REFLECTION_STEPS.filter((r) => l[r.key]).map((r) => (
                  <div key={r.key} className="rounded-lg bg-slate-50 p-2.5">
                    <dt className="text-[11px] font-bold text-slate-500">{step(r).label}</dt>
                    <dd className="whitespace-pre-wrap text-slate-700">{l[r.key]}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
