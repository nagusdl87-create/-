"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { HS_QUIZ, HS_TYPES } from "@/data/highschools";
import { JOB_MAP, type HsTypeId } from "@/data/jobs";
import { OFFICIAL_LINKS } from "@/data/plan";
import { hsQuizResult } from "@/lib/match";
import { NextStep, PageHead } from "@/components/ui";

export default function HighschoolPage() {
  const { state, update, ready } = useStore();
  const [compare, setCompare] = useState<HsTypeId[]>(["general", "vocational"]);
  const favJobs = state.favorites.map((id) => JOB_MAP[id]).filter(Boolean);
  const answered = Object.keys(state.hsQuiz).length;
  const quizDone = answered === HS_QUIZ.length;
  const result = hsQuizResult(state.hsQuiz, favJobs);

  if (!ready) return <div className="h-64" />;

  const toggleInterest = (id: HsTypeId) =>
    update((s) => ({ ...s, hsInterest: s.hsInterest.includes(id) ? s.hsInterest.filter((x) => x !== id) : [...s.hsInterest, id] }));
  const toggleCompare = (id: HsTypeId) =>
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? [...c.slice(1), id] : [...c, id]));

  return (
    <div>
      <PageHead
        step={4}
        title="고교 고르기"
        desc="고등학교 유형마다 배우는 방식과 졸업 후 길이 달라요. 퀴즈로 나에게 맞는 유형을 알아보고, 나란히 비교해 보세요."
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card">
          <h2 className="font-bold">🧩 나에게 맞는 고교 유형 퀴즈</h2>
          <p className="mt-1 text-xs text-slate-500">
            {answered}/{HS_QUIZ.length} 응답{favJobs.length > 0 && " · 찜한 직업도 함께 반영돼요"}
          </p>
          <div className="mt-4 space-y-4">
            {HS_QUIZ.map((q, qi) => (
              <div key={q.q}>
                <div className="mb-2 text-sm font-semibold">
                  {qi + 1}. {q.q}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {q.options.map((o, oi) => {
                    const on = state.hsQuiz[qi] === oi;
                    return (
                      <button
                        key={o.label}
                        aria-pressed={on}
                        className={`chip px-3 py-1.5 text-[13px] ${on ? "chip-on" : ""}`}
                        onClick={() => update((s) => ({ ...s, hsQuiz: { ...s.hsQuiz, [qi]: oi } }))}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-bold">📊 비교해 볼 만한 유형</h2>
          {answered === 0 && favJobs.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">퀴즈에 답하면 결과가 여기에 나타나요.</p>
          ) : (
            <>
              {!quizDone && <p className="mt-1 text-xs text-amber-600">퀴즈를 끝까지 하면 더 정확해져요.</p>}
              <ul className="mt-3 space-y-2.5">
                {result.slice(0, 5).map(({ type, pct }, i) => (
                  <li key={type.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className={i === 0 ? "font-extrabold text-slate-900" : "font-semibold text-slate-700"}>
                        {type.emoji} {type.name}
                      </span>
                      <span className="text-xs text-slate-500">{pct}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${i === 0 ? "bg-brand-500" : "bg-brand-200"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
                점수는 &lsquo;합격 가능성&rsquo;이 아니라 내 응답과 각 학교 유형의 특징이 얼마나 비슷한지를 나타내요. 최종 선택은 보호자,
                선생님과 꼭 상의하세요.
              </p>
            </>
          )}
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold">고교 유형 한눈에 보기</h2>
      <p className="mb-3 text-sm text-slate-500">⭐ 관심 표시 · ⇄ 비교 담기(최대 3개)</p>
      <div className="grid gap-3 md:grid-cols-2">
        {HS_TYPES.map((h) => {
          const interested = state.hsInterest.includes(h.id);
          const inCompare = compare.includes(h.id);
          return (
            <div key={h.id} id={h.id} className={`card scroll-mt-20 ${interested ? "border-amber-300" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-lg font-extrabold">
                    {h.emoji} {h.name}
                  </div>
                  <span className="chip mt-1">{h.round === "별도" ? "별도 일정(가장 빠름)" : `${h.round} 지원(일반적)`}</span>
                </div>
                <div className="flex gap-1.5">
                  <button aria-pressed={interested} aria-label="관심 표시" onClick={() => toggleInterest(h.id)} className={`grid h-9 w-9 place-items-center rounded-full border ${interested ? "border-amber-300 bg-amber-50" : "border-slate-200"}`}>
                    {interested ? "⭐" : "☆"}
                  </button>
                  <button aria-pressed={inCompare} aria-label="비교 담기" onClick={() => toggleCompare(h.id)} className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-bold ${inCompare ? "border-brand-400 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-500"}`}>
                    ⇄
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-700">{h.oneLine}</p>
              <div className="mt-3 text-xs font-semibold text-slate-500">이런 학생에게 잘 맞아요</div>
              <ul className="mt-1 space-y-0.5 text-sm text-slate-600">
                {h.goodFor.map((g) => (
                  <li key={g}>• {g}</li>
                ))}
              </ul>
              {favJobs.some((j) => j.hsTypes.includes(h.id)) && (
                <div className="mt-3 rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs text-brand-800">
                  ❤️ 찜한 직업 연결:{" "}
                  {favJobs
                    .filter((j) => j.hsTypes.includes(h.id))
                    .map((j) => j.name)
                    .join(", ")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {compare.length > 0 && (
        <div className="card mt-6 overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="p-4 text-left font-bold">⇄ 나란히 비교</caption>
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50">
                <th className="w-28 p-3 text-xs text-slate-500">항목</th>
                {compare.map((id) => {
                  const h = HS_TYPES.find((x) => x.id === id)!;
                  return (
                    <th key={id} className="p-3">
                      {h.emoji} {h.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["배우는 방식", "curriculum"],
                  ["입학 방법", "admission"],
                  ["졸업 후", "afterGrad"],
                ] as const
              ).map(([label, key]) => (
                <tr key={key} className="border-b border-slate-100 align-top">
                  <th className="p-3 text-xs text-slate-500">{label}</th>
                  {compare.map((id) => (
                    <td key={id} className="p-3 text-slate-700">
                      {HS_TYPES.find((x) => x.id === id)![key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="align-top">
                <th className="p-3 text-xs text-slate-500">꼭 확인할 것</th>
                {compare.map((id) => (
                  <td key={id} className="p-3 text-slate-700">
                    <ul className="space-y-0.5">
                      {HS_TYPES.find((x) => x.id === id)!.consider.map((c) => (
                        <li key={c}>• {c}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="card mt-6">
        <h2 className="font-bold">🔗 우리 지역 학교 정보는 공식 사이트에서</h2>
        <p className="mt-1 text-xs text-slate-500">전형 일정과 방법은 지역·학교마다 달라요. 원서 쓰기 전에 꼭 확인하세요.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {OFFICIAL_LINKS.filter((l) => /학교|고입|특성화|고교/.test(l.name)).map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold hover:border-brand-300">
              {l.name} ↗
            </a>
          ))}
        </div>
      </div>

      <NextStep href="/plan" label="계획·기록" hint="이제 학기별로 할 일을 정하고 실천해 봐요" />
    </div>
  );
}
