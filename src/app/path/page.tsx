"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { JOB_MAP } from "@/data/jobs";
import { RIASEC, VALUES } from "@/data/riasec";
import { isTestComplete, riasecScores, topTypes } from "@/lib/match";
import { PathFlow } from "@/components/PathFlow";
import { MAJOR_MAP } from "@/data/majors";
import { TRACKS } from "@/data/subjects";
import { Empty, NextStep, PageHead } from "@/components/ui";

export default function PathPage() {
  const { state, update, ready } = useStore();
  const favs = state.favorites.map((id) => JOB_MAP[id]).filter(Boolean);
  const [main, setMain] = useState<string | null>(null);
  const mainId = main && state.favorites.includes(main) ? main : favs[0]?.id;
  const mainJob = mainId ? JOB_MAP[mainId] : undefined;

  if (!ready) return <div className="h-64" />;

  // 찜한 직업들에 공통으로 등장하는 고교 과목 = 꿈이 바뀌어도 쓸모 있는 과목
  const subjCount = new Map<string, string[]>();
  favs.forEach((j) => j.hsSubjects.forEach((s) => subjCount.set(s, [...(subjCount.get(s) ?? []), j.name])));
  const common = [...subjCount.entries()].filter(([, js]) => js.length >= 2).sort((a, b) => b[1].length - a[1].length);

  const majorSet = new Map<string, string[]>();
  favs.forEach((j) => j.majors.forEach((m) => majorSet.set(m, [...(majorSet.get(m) ?? []), j.name])));
  const commonMajors = [...majorSet.entries()].filter(([, js]) => js.length >= 2);

  const suggest = () => {
    if (!mainJob) return "";
    const tested = isTestComplete(state.answers);
    const top = tested ? topTypes(riasecScores(state.answers))[0] : mainJob.riasec[0];
    const val = state.values[0] ? VALUES.find((v) => v.id === state.values[0])?.label : null;
    return `나는 ${RIASEC[top].short}을(를) 좋아하는 강점을 살려${val ? ` '${val}'을(를) 이룰 수 있는` : ""} ${mainJob.name}에 도전해 보고 싶다. 그래서 고등학교에서는 ${mainJob.hsSubjects
      .slice(0, 3)
      .join(", ")} 과목을 배우고, 지금은 ${mainJob.msActions[0]}부터 시작하겠다.`;
  };

  return (
    <div>
      <PageHead tone="sky"
        step={3}
        title="길 잇기"
        desc="찜한 직업에서 거꾸로 거슬러 올라가 대학 학과, 고등학교 과목, 그리고 중학생인 지금 할 일까지 한 줄로 이어 봐요."
      />

      <MajorPaths />
      {favs.length === 0 ? (
        state.favMajors.length === 0 ? (
          <Empty href={state.profile.stage === "hs" ? "/majors" : "/jobs"} cta={state.profile.stage === "hs" ? "학과 찾으러 가기" : "직업 찾으러 가기"}>
            아직 찜한 {state.profile.stage === "hs" ? "학과나 직업" : "직업"}이 없어요. 2단계에서 관심 있는 것을 ❤️ 찜해 주세요.
          </Empty>
        ) : (
          <HypothesisBox suggest={() => ""} />
        )
      ) : (
        <div className="space-y-5">
          <div className="card">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-500">대표 꿈 선택:</span>
              {favs.map((j) => (
                <button key={j.id} className={`chip px-3 py-1.5 text-sm ${j.id === mainId ? "chip-on" : ""}`} onClick={() => setMain(j.id)}>
                  {j.emoji} {j.name}
                </button>
              ))}
            </div>
            {mainJob && <PathFlow job={mainJob} />}
            {mainJob && (
              <Link href={`/jobs/${mainJob.id}`} className="mt-3 inline-block text-sm font-semibold text-brand-600">
                {mainJob.name} 자세히 보기 →
              </Link>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="card">
              <h2 className="font-bold">꿈이 바뀌어도 든든한 과목</h2>
              <p className="mt-1 text-xs text-slate-500">찜한 직업 여러 개에 공통으로 도움이 되는 고교 과목이에요. 진로가 바뀌어도 쓸모가 있어요.</p>
              {favs.length < 2 ? (
                <p className="mt-3 text-sm text-slate-500">직업을 2개 이상 찜하면 공통 과목을 찾아 드려요.</p>
              ) : common.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">찜한 직업들 사이에 겹치는 과목이 없어요. 서로 다른 분야를 탐색 중이네요! 공통과목(국·영·수)을 탄탄히 해 두세요.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {common.slice(0, 6).map(([s, js]) => (
                    <li key={s} className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm">
                      <span className="font-semibold text-emerald-900">{s}</span>
                      <span className="text-xs text-emerald-700">{js.length}개 직업</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card">
              <h2 className="font-bold">Plan B 지도</h2>
              <p className="mt-1 text-xs text-slate-500">대표 꿈 외의 찜한 직업은 나의 대안 경로예요.</p>
              <ul className="mt-3 space-y-2 text-sm">
                {favs
                  .filter((j) => j.id !== mainId)
                  .map((j) => (
                    <li key={j.id} className="rounded-xl border border-slate-200 px-3 py-2">
                      <span className="font-semibold">
                        {j.emoji} {j.name}
                      </span>
                      <span className="ml-1 text-xs text-slate-500">· {j.majors[0]}</span>
                    </li>
                  ))}
                {favs.length < 2 && <li className="text-slate-500">관심 직업을 더 찜해서 대안 경로를 만들어 보세요.</li>}
              </ul>
              {commonMajors.length > 0 && (
                <p className="mt-3 text-xs text-slate-600">
                  💡 <b>{commonMajors.map(([m]) => m).join(", ")}</b>은(는) 여러 꿈으로 이어지는 학과예요.
                </p>
              )}
            </div>
          </div>

          <HypothesisBox suggest={suggest} />
        </div>
      )}

      <NextStep href={state.profile.stage === "hs" ? "/credits" : "/highschool"} label={state.profile.stage === "hs" ? "과목 설계" : "고교 고르기"} hint={state.profile.stage === "hs" ? "찜한 학과의 과목을 192학점 설계에 담아 보세요" : "나에게 맞는 고등학교 유형을 비교해 보세요"} />
    </div>
  );
}

function HypothesisBox({ suggest }: { suggest: () => string }) {
  const { state, update } = useStore();
  const majorDraft = () => {
    const m = MAJOR_MAP[state.favMajors[0]];
    return m ? `나는 ${m.name}에 진학해 ${m.careers[0]} 분야에서 일하고 싶다. 그래서 고등학교에서는 ${m.core.slice(0, 3).join(", ")} 과목을 중심으로 배우고, 수업 속 탐구로 관심을 깊게 키우겠다.` : "";
  };
  return (
    <div className="card mt-5">
      <h2 className="font-bold">나의 진로 가설 한 문장</h2>
      <p className="mt-1 text-xs text-slate-500">진로는 정답이 아니라 &lsquo;지금의 가설&rsquo;이에요. 경험하면서 언제든 고쳐 써도 괜찮아요.</p>
      <textarea
        className="input mt-3 min-h-[110px] leading-relaxed"
        placeholder="예) 나는 궁금한 것을 끝까지 파고드는 강점을 살려 사람을 돕는 생명과학 연구원에 도전해 보고 싶다…"
        value={state.hypothesis}
        maxLength={400}
        aria-label="나의 진로 가설"
        onChange={(e) => update((s) => ({ ...s, hypothesis: e.target.value }))}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {suggest() && <button className="btn-ghost" onClick={() => update((s) => ({ ...s, hypothesis: suggest() }))}>✨ 찜한 직업으로 초안</button>}
        {state.favMajors.length > 0 && <button className="btn-ghost" onClick={() => update((s) => ({ ...s, hypothesis: majorDraft() }))}>🎓 찜한 학과로 초안</button>}
        <span className="self-center text-xs text-slate-400">{state.hypothesis.length}/400</span>
      </div>
    </div>
  );
}

function MajorPaths() {
  const { state } = useStore();
  const majors = state.favMajors.map((id) => MAJOR_MAP[id]).filter(Boolean);
  if (!majors.length) return null;
  const placed = new Set(Object.values(state.credits.plan).flat().map((e) => e.split("|")[0]));
  return (
    <div className="card mb-5">
      <h2 className="font-bold">찜한 학과로 잇기</h2>
      <p className="mt-1 text-xs text-slate-500">학과가 원하는 고교 과목과, 내 192학점 설계에 담겼는지(✓)를 보여 줘요.</p>
      <div className="mt-3 space-y-3">
        {majors.map((m) => {
          const all = [...m.core, ...m.rec];
          const have = all.filter((s) => placed.has(s)).length;
          return (
            <div key={m.id} className="rounded-2xl border border-slate-200 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link href={`/majors/${m.id}`} className="font-bold hover:text-brand-700">{m.name} <span className="text-xs font-normal text-slate-500">{TRACKS[m.track].name}</span></Link>
                <span className="text-xs font-semibold text-brand-600">설계 반영 {have}/{all.length}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {m.core.map((s) => <span key={s} className={`rounded-md px-1.5 py-0.5 text-xs font-semibold ${placed.has(s) ? "bg-emerald-100 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{placed.has(s) ? "✓" : "★"} {s}</span>)}
                {m.rec.map((s) => <span key={s} className={`rounded-md px-1.5 py-0.5 text-xs ${placed.has(s) ? "bg-emerald-100 text-emerald-800" : "bg-sky-50 text-sky-800"}`}>{placed.has(s) ? "✓" : "☆"} {s}</span>)}
              </div>
            </div>
          );
        })}
      </div>
      <Link href="/credits" className="btn-primary mt-3">🧮 192학점 설계로 가기</Link>
    </div>
  );
}
