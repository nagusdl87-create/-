"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lightbulb, RotateCcw, XCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { INDUSTRIES, QUIZ, TREND_ITEMS, type IndustryId } from "@/data/future";
import { JOB_MAP } from "@/data/jobs";
import { MAJOR_MAP } from "@/data/majors";
import { PageHead } from "@/components/ui";
import { useEnData, useT } from "@/lib/i18n";

type Tab = "quiz" | "trend" | "road";
const IDS = Object.keys(INDUSTRIES) as IndustryId[];

export default function FuturePage() {
  const { state, update, ready } = useStore();
  const t = useT();
  const en = useEnData(() => import("@/i18n/data/future.en"), "future");
  const ind = (id: IndustryId) => ({ ...INDUSTRIES[id], ...(en?.INDUSTRIES_EN[id] ?? {}) });
  const subj = (x: string) => en?.SUBJECT_NAMES[x] ?? x;
  const [tab, setTab] = useState<Tab>("quiz");
  const [road, setRoad] = useState<IndustryId>("ai");
  const quiz = useMemo(() => {
    try {
      return JSON.parse(state.portfolio["future.quiz"] ?? "{}") as Record<number, number>;
    } catch {
      return {};
    }
  }, [state.portfolio]);
  const trend = useMemo(() => {
    try {
      return JSON.parse(state.portfolio["future.trend"] ?? "{}") as Record<number, number>;
    } catch {
      return {};
    }
  }, [state.portfolio]);
  const [qi, setQi] = useState(0);
  const [hint, setHint] = useState(false);
  const save = (k: string, v: unknown) => update((s) => ({ ...s, portfolio: { ...s.portfolio, [k]: JSON.stringify(v) } }));

  if (!ready) return <div className="h-96" />;

  const answered = Object.keys(quiz).length;
  const correct = QUIZ.filter((q, i) => quiz[i] === q.a).length;
  const byInd = IDS.map((id) => {
    const qs = QUIZ.map((q, i) => ({ q, i })).filter((x) => x.q.ind === id);
    return { id, total: qs.length, ok: qs.filter((x) => quiz[x.i] === x.q.a).length };
  });
  const trendDone = Object.keys(trend).length === TREND_ITEMS.length;
  const trendScore = IDS.map((id) => {
    const items = TREND_ITEMS.map((t, i) => ({ t, i })).filter((x) => x.t.ind.includes(id));
    const sum = items.reduce((a, x) => a + (trend[x.i] ?? 0), 0);
    return { id, pct: items.length ? Math.round((sum / (items.length * 5)) * 100) : 0 };
  }).sort((a, b) => b.pct - a.pct);
  const q = { ...QUIZ[qi], ...(en?.QUIZ_EN[qi] ?? {}) };
  const picked = quiz[qi];

  return (
    <div>
      <PageHead tone="violet" eyebrow={t("진로 자료실")} title={t("미래 신산업 진로 탐색")} desc={t("인공지능·로봇·모빌리티·바이오헬스·친환경 에너지·반도체·우주항공·스마트팜 8대 신산업을 퀴즈와 친화도 검사로 알아보고, 관심 분야의 직업·학과·고교 과목 로드맵을 확인하세요.")} />
      <div className="mb-6 grid grid-cols-3 gap-1 rounded-xl bg-slate-200/60 p-1" role="tablist">
        {(
          [
            ["quiz", t("신산업 퀴즈 {a}/{n}", { a: answered, n: QUIZ.length })],
            ["trend", t("미래 트렌드 친화도")],
            ["road", t("진로·학업 로드맵")],
          ] as const
        ).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-lg py-2 text-xs font-semibold sm:text-sm ${tab === k ? "bg-white shadow-sm" : "text-slate-500"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "quiz" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_0.7fr] [&>*]:min-w-0">
          <div className="card">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                {t("문제 {i} / {n}", { i: qi + 1, n: QUIZ.length })} · {ind(q.ind).name}
              </span>
              <button className="flex items-center gap-1 text-brand-700" onClick={() => setHint(!hint)} aria-expanded={hint}>
                <Lightbulb className="h-4 w-4" /> {t("힌트")}
              </button>
            </div>
            <h2 className="mt-2 text-lg font-bold">{q.q}</h2>
            {hint && <p className="mt-1 rounded-lg bg-sun-100/70 px-3 py-2 text-sm text-amber-900">{q.hint}</p>}
            <div className="mt-4 grid gap-2">
              {q.options.map((o, oi) => {
                const chosen = picked === oi;
                const show = picked !== undefined;
                const right = oi === q.a;
                return (
                  <button
                    key={o}
                    disabled={show}
                    onClick={() => save("future.quiz", { ...quiz, [qi]: oi })}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${show && right ? "border-brand-500 bg-brand-50 text-brand-800" : show && chosen ? "border-rose-300 bg-rose-50 text-rose-700" : "border-slate-200 hover:border-brand-300"}`}
                  >
                    {o}
                    {show && right && <CheckCircle2 className="h-5 w-5" />}
                    {show && chosen && !right && <XCircle className="h-5 w-5" />}
                  </button>
                );
              })}
            </div>
            {picked !== undefined && <p className="mt-3 text-sm text-slate-700">💡 {q.why}</p>}
            <div className="mt-5 flex justify-between">
              <button className="btn-ghost" disabled={qi === 0} onClick={() => { setQi(qi - 1); setHint(false); }}>{t("이전")}</button>
              {qi < QUIZ.length - 1 ? (
                <button className="btn-primary" onClick={() => { setQi(qi + 1); setHint(false); }}>{t("다음 문제")}</button>
              ) : (
                <button className="btn-primary" onClick={() => setTab("trend")}>{t("친화도 검사로")}</button>
              )}
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-semibold text-slate-500">{t("나의 신산업 리포트")}</div>
            <div className="mt-2 text-3xl font-bold">
              {correct}
              <span className="text-base font-medium text-slate-400"> {t("/ {n} 정답", { n: QUIZ.length })}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {byInd.map((b) => (
                <li key={b.id} className="text-sm">
                  <div className="flex justify-between">
                    <span>{ind(b.id).name}</span>
                    <span className="text-slate-500">
                      {b.ok}/{b.total}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${(b.ok / b.total) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn-ghost mt-4 py-1.5 text-xs" onClick={() => { save("future.quiz", {}); setQi(0); }}>
              <RotateCcw className="h-3.5 w-3.5" /> {t("다시 풀기")}
            </button>
          </div>
        </div>
      )}

      {tab === "trend" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_0.7fr] [&>*]:min-w-0">
          <div className="card space-y-3">
            <p className="text-sm text-slate-600">{t("각 문장이 나와 얼마나 비슷한지 1(전혀 아니다)~5(매우 그렇다)로 골라 주세요.")}</p>
            {TREND_ITEMS.map((it, i) => (
              <div key={it.t} className="rounded-xl border border-slate-200 p-3">
                <div className="text-sm font-medium">
                  {i + 1}. {en?.TREND_ITEMS_EN[i] ?? it.t}
                </div>
                <div className="mt-2 grid grid-cols-5 gap-1" role="radiogroup" aria-label={en?.TREND_ITEMS_EN[i] ?? it.t}>
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button key={v} role="radio" aria-checked={trend[i] === v} onClick={() => save("future.trend", { ...trend, [i]: v })} className={`rounded-lg py-1.5 text-sm font-semibold ${trend[i] === v ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="card h-fit lg:sticky lg:top-20">
            <div className="text-sm font-semibold text-slate-500">{t("미래 트렌드 친화도")}</div>
            {trendDone ? (
              <>
                <div className="mt-2 text-xl font-bold">{t("가장 잘 맞는 분야: {name}", { name: ind(trendScore[0].id).name })}</div>
                <ul className="mt-4 space-y-2">
                  {trendScore.map((s) => (
                    <li key={s.id} className="text-sm">
                      <div className="flex justify-between">
                        <span>{ind(s.id).name}</span>
                        <span className="text-slate-500">{s.pct}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-brand-500" style={{ width: `${s.pct}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <button className="btn-primary mt-4" onClick={() => { setRoad(trendScore[0].id); setTab("road"); }}>
                  {t("{name} 로드맵 보기", { name: ind(trendScore[0].id).name })}
                </button>
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                {t("{a} / {n} 응답. 모두 답하면 결과가 나와요.", { a: Object.keys(trend).length, n: TREND_ITEMS.length })}
              </p>
            )}
          </div>
        </div>
      )}

      {tab === "road" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {IDS.map((id) => (
              <button key={id} aria-pressed={road === id} className={`chip px-3 py-1.5 ${road === id ? "chip-on" : ""}`} onClick={() => setRoad(id)}>
                {ind(id).name}
              </button>
            ))}
          </div>
          <div className="card">
            <h2 className="text-xl font-bold">{ind(road).name}</h2>
            <p className="mt-1 text-slate-600">{ind(road).desc}</p>
            {ind(road).gn && <p className="mt-2 inline-block rounded-lg bg-brand-50 px-2.5 py-1 text-sm text-brand-800">{t("경남 연결: {gn}", { gn: ind(road).gn ?? "" })}</p>}
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-xs font-semibold text-slate-500">{t("① 고교에서 배울 과목")}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {INDUSTRIES[road].subjects.map((s) => (
                    <Link key={s} href={`/subjects#${encodeURIComponent(s)}`} className="chip">{subj(s)}</Link>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">{t("② 대학 학과")}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {INDUSTRIES[road].majors.map((m) => MAJOR_MAP[m] && <Link key={m} href={`/majors/${m}`} className="chip">{en?.MAJOR_NAMES[m] ?? MAJOR_MAP[m].name}</Link>)}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">{t("③ 미래 직업")}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {INDUSTRIES[road].jobs.map((j) => JOB_MAP[j] && <Link key={j} href={`/jobs/${j}`} className="chip">{en?.JOB_NAMES[j] ?? JOB_MAP[j].name}</Link>)}
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/credits" className="btn-primary">{t("192학점 설계에 반영하기")}</Link>
              <Link href="/industry" className="btn-ghost">{t("경남 산업 진로 지도")}</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
