"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { QUESTIONS, RIASEC, RIASEC_ORDER, SCALE, STRENGTHS, VALUES } from "@/data/riasec";
import { isTestComplete, rankedJobs, riasecScores, topTypes } from "@/lib/match";
import { Radar } from "@/components/Radar";
import { NextStep, PageHead } from "@/components/ui";

const PER_PAGE = 6;
const Q_PAGES = Math.ceil(QUESTIONS.length / PER_PAGE);
// 페이지: 0..Q_PAGES-1 문항, Q_PAGES 가치관, Q_PAGES+1 강점, 그 다음 결과
const TOTAL = Q_PAGES + 2;

export default function Discover() {
  const { state, update, ready } = useStore();
  const complete = isTestComplete(state.answers) && state.values.length > 0;
  const [page, setPage] = useState<number | null>(null);

  useEffect(() => {
    if (ready && page === null) setPage(complete ? TOTAL : 0);
  }, [ready, complete, page]);

  if (!ready || page === null) return <div className="h-64" />;

  if (page >= TOTAL) return <Result onRetry={() => setPage(0)} />;

  const pct = Math.round((page / TOTAL) * 100);

  return (
    <div>
      <PageHead step={1} title="나 알기" desc="정답은 없어요. 평소의 나와 가장 가까운 답을 솔직하게 골라 주세요." />
      <div className="mb-5 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {page + 1} / {TOTAL}
        </span>
      </div>

      {page < Q_PAGES && <QuestionPage page={page} />}
      {page === Q_PAGES && <ValuesPage />}
      {page === Q_PAGES + 1 && <StrengthPage />}

      <div className="mt-6 flex justify-between">
        <button className="btn-ghost" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
          ← 이전
        </button>
        <button
          className="btn-primary"
          disabled={!canGoNext(page)}
          onClick={() => {
            if (page === TOTAL - 1) update((s) => ({ ...s, testDoneAt: new Date().toISOString() }));
            setPage(page + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          {page === TOTAL - 1 ? "결과 보기 ✨" : "다음 →"}
        </button>
      </div>
    </div>
  );

  function canGoNext(p: number) {
    if (p < Q_PAGES) return QUESTIONS.slice(p * PER_PAGE, (p + 1) * PER_PAGE).every((q) => state.answers[q.id]);
    if (p === Q_PAGES) return state.values.length === 3;
    return true;
  }
}

function QuestionPage({ page }: { page: number }) {
  const { state, update } = useStore();
  const qs = QUESTIONS.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  return (
    <div className="space-y-3">
      {qs.map((q) => (
        <fieldset key={q.id} className="card p-4">
          <legend className="sr-only">{q.text}</legend>
          <div className="mb-3 font-semibold text-slate-900">
            <span className="mr-2 text-brand-500">Q{q.id}.</span>
            {q.text}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {SCALE.map((s) => {
              const on = state.answers[q.id] === s.v;
              return (
                <button
                  key={s.v}
                  type="button"
                  aria-pressed={on}
                  onClick={() => update((st) => ({ ...st, answers: { ...st.answers, [q.id]: s.v } }))}
                  className={`rounded-xl border px-1 py-2.5 text-xs font-semibold transition sm:text-sm ${
                    on ? "border-brand-500 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-brand-200"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

function ValuesPage() {
  const { state, update } = useStore();
  return (
    <div className="card">
      <h2 className="text-lg font-bold">내가 일할 때 가장 중요하게 생각하는 것 3가지를 골라 주세요</h2>
      <p className="mt-1 text-sm text-slate-500">{state.values.length}/3 선택</p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {VALUES.map((v) => {
          const on = state.values.includes(v.id);
          return (
            <button
              key={v.id}
              type="button"
              aria-pressed={on}
              onClick={() =>
                update((s) => ({
                  ...s,
                  values: on ? s.values.filter((x) => x !== v.id) : s.values.length < 3 ? [...s.values, v.id] : s.values,
                }))
              }
              className={`rounded-2xl border p-3 text-left transition ${on ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:border-brand-200"}`}
            >
              <div className="text-2xl">{v.emoji}</div>
              <div className="mt-1 font-bold">{v.label}</div>
              <div className="text-xs text-slate-500">{v.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StrengthPage() {
  const { state, update } = useStore();
  return (
    <div className="card space-y-5">
      <div>
        <h2 className="text-lg font-bold">나의 강점을 골라 주세요 (최대 5개)</h2>
        <p className="mt-1 text-sm text-slate-500">친구나 가족에게 자주 듣는 칭찬을 떠올려 보세요.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {STRENGTHS.map((s) => {
            const on = state.strengths.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  update((st) => ({
                    ...st,
                    strengths: on ? st.strengths.filter((x) => x !== s) : st.strengths.length < 5 ? [...st.strengths, s] : st.strengths,
                  }))
                }
                className={`chip px-3.5 py-2 text-sm ${on ? "chip-on" : ""}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="nm">
            이름 또는 별명 (선택)
          </label>
          <input
            id="nm"
            className="input"
            value={state.profile.name}
            maxLength={20}
            onChange={(e) => update((s) => ({ ...s, profile: { ...s.profile, name: e.target.value } }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="sc">
            학교 (선택)
          </label>
          <input
            id="sc"
            className="input"
            value={state.profile.school}
            maxLength={30}
            onChange={(e) => update((s) => ({ ...s, profile: { ...s.profile, school: e.target.value } }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="gr">
            학년
          </label>
          <select
            id="gr"
            className="input"
            value={`${state.profile.stage || "ms"}${state.profile.grade}`}
            onChange={(e) => {
              const st = e.target.value.slice(0, 2) as "ms" | "hs";
              const g = e.target.value.slice(2);
              update((s) => ({ ...s, profile: { ...s.profile, grade: g, stage: st }, currentTerm: (st === "hs" ? `h${g}-1` : `${g}-1`) as typeof s.currentTerm }));
            }}
          >
            {["1", "2", "3"].map((g) => <option key={"ms" + g} value={"ms" + g}>중학교 {g}학년</option>)}
            {["1", "2", "3"].map((g) => <option key={"hs" + g} value={"hs" + g}>고등학교 {g}학년</option>)}
          </select>
        </div>
      </div>
      <p className="text-xs text-slate-400">입력한 정보는 서버로 전송되지 않고 이 기기에만 저장돼요.</p>
    </div>
  );
}

function Result({ onRetry }: { onRetry: () => void }) {
  const { state } = useStore();
  const scores = riasecScores(state.answers);
  const [a, b] = topTypes(scores);
  const recs = rankedJobs(state).slice(0, 4);
  return (
    <div>
      <PageHead step={1} title="나의 흥미 탐색 결과" desc="흥미는 경험에 따라 계속 변해요. 학기마다 다시 해 보며 나의 변화를 살펴보세요." />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card flex flex-col items-center">
          <Radar scores={scores} />
          <div className="mt-2 text-center">
            <div className="text-xs font-semibold text-slate-500">나의 흥미 코드</div>
            <div className="text-3xl font-extrabold tracking-widest text-slate-900">
              {a}
              {b}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {[a, b].map((k, i) => (
            <div key={k} className="card" style={{ borderLeft: `5px solid ${RIASEC[k].color}` }}>
              <div className="text-xs font-semibold text-slate-500">{i === 0 ? "가장 강한 흥미" : "두 번째 흥미"}</div>
              <div className="mt-1 text-xl font-extrabold">
                {RIASEC[k].emoji} {RIASEC[k].name} <span className="text-sm font-semibold text-slate-500">· {RIASEC[k].short}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{RIASEC[k].desc}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {RIASEC[k].keywords.map((w) => (
                  <span key={w} className="chip">
                    #{w}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="card">
            <div className="text-xs font-semibold text-slate-500">내가 중요하게 여기는 가치 · 나의 강점</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {state.values.map((v) => {
                const x = VALUES.find((y) => y.id === v)!;
                return (
                  <span key={v} className="chip chip-on">
                    {x.emoji} {x.label}
                  </span>
                );
              })}
              {state.strengths.map((s) => (
                <span key={s} className="chip">
                  💪 {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">흥미 + 가치관으로 추천하는 직업</h2>
          <Link href="/jobs" className="text-sm font-semibold text-brand-600">
            전체 추천 보기 →
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-4">
          {recs.map(({ job, score }) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="rounded-xl border border-slate-200 p-3 hover:border-brand-300">
              <div className="text-2xl">{job.emoji}</div>
              <div className="mt-1 text-sm font-bold">{job.name}</div>
              <div className="text-xs font-semibold text-brand-600">{score}% 일치</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="card mt-4 text-sm text-slate-600">
        <div className="font-semibold text-slate-800">📌 더 정확하게 알고 싶다면</div>
        <p className="mt-1">
          이 탐색은 간단한 자기 이해 활동이에요. 학교나{" "}
          <a className="font-semibold text-brand-600 underline" href="https://www.career.go.kr/" target="_blank" rel="noreferrer">
            커리어넷
          </a>
          의 표준화된 진로심리검사(직업흥미검사·직업적성검사 등)도 함께 해 보고 결과를 비교해 보세요.
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {RIASEC_ORDER.map((k) => (
            <div key={k} className="rounded-lg bg-slate-50 p-2 text-center text-xs">
              <div className="font-bold" style={{ color: RIASEC[k].color }}>
                {RIASEC[k].name}
              </div>
              <div className="text-slate-500">{scores[k]}점</div>
            </div>
          ))}
        </div>
        <button className="btn-ghost mt-3" onClick={onRetry}>
          다시 해 보기
        </button>
      </div>

      <NextStep href={state.profile.stage === "hs" ? "/majors" : "/jobs"} label={state.profile.stage === "hs" ? "학과·직업 찾기" : "직업 찾기"} hint={state.profile.stage === "hs" ? "관심 학과와 직업을 찜해 보세요" : "나와 잘 맞는 직업을 찾아 찜해 보세요"} />
    </div>
  );
}
