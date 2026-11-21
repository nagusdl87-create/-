"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { isTestComplete, progress, rankedJobs, riasecScores, topTypes } from "@/lib/match";
import { analyze } from "@/lib/credits";
import { EXPLORE, JOURNEY, TOOLS } from "@/lib/journey";
import { RIASEC } from "@/data/riasec";
import { TERMS_BY_STAGE, type Stage } from "@/data/plan";
import { ADMISSION_SCHEDULE, GN_SCHOOLS } from "@/data/gn";
import { MAJOR_MAP } from "@/data/majors";

function StagePicker() {
  const { update } = useStore();
  const pick = (stage: Stage) =>
    update((s) => ({ ...s, profile: { ...s.profile, stage }, currentTerm: stage === "hs" ? "h1-1" : "1-1" }));
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(
        [
          { s: "ms", t: "중학생이에요", e: "🎒", d: ["흥미·적성 탐색과 직업 찾기", "경남 고등학교 유형 비교와 학교 찾기", "고입 전형 일정과 학군 안내"] },
          { s: "hs", t: "고등학생이에요", e: "🎓", d: ["관심 학과의 핵심·권장 과목", "192학점 3개년 과목 설계와 진단", "2028 대입·5등급 내신 계산기"] },
        ] as const
      ).map((x) => (
        <button key={x.s} onClick={() => pick(x.s)} className="card group text-left transition hover:border-brand-300 hover:shadow-md">
          <div className="text-4xl">{x.e}</div>
          <div className="mt-2 text-xl font-extrabold text-slate-900 group-hover:text-brand-700">{x.t}</div>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {x.d.map((d) => (
              <li key={d}>✓ {d}</li>
            ))}
          </ul>
          <div className="mt-4 text-sm font-bold text-brand-600">이 과정으로 시작하기 →</div>
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const { state, ready, update } = useStore();
  const stage = state.profile.stage;
  const p = progress(state);

  if (!ready) return <div className="h-96" />;

  if (!stage) {
    return (
      <div className="space-y-8">
        <section className="rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 text-white sm:p-10">
          <div className="text-sm font-semibold text-brand-100">경남 중·고등학생을 위한 진로·학업 설계</div>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
            흩어진 진로 정보를
            <br />
            나만의 한 장의 지도로
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-brand-100 sm:text-base">
            흥미 탐색 → 직업·학과 → 고교 과목 → 경남 고교 선택 → 192학점 설계 → 2028 대입까지. 앞 단계의 결과가 다음 단계로 자동으로 이어져요.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            {["경남 고교 203곳 지도", "2027 경남 고입 일정", "137개 과목 백과", "192학점 실시간 진단", "5등급 내신 계산기", "포트폴리오 3종"].map((t) => (
              <span key={t} className="rounded-full bg-white/15 px-3 py-1 font-semibold">
                {t}
              </span>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold">지금 몇 학년인가요?</h2>
          <StagePicker />
        </section>
        <HubGrid />
      </div>
    );
  }

  const steps = JOURNEY[stage];
  const nextStep = steps.find((s) => !p.steps.find((x) => x.key === s.key)?.done) ?? steps[4];
  const tested = isTestComplete(state.answers);
  const top = topTypes(riasecScores(state.answers));
  const termList = TERMS_BY_STAGE[stage];
  const term = termList.find((t) => t.id === state.currentTerm) ?? termList[0];
  const termTasks = state.tasks[term.id] ?? [];
  const recs = tested ? rankedJobs(state).slice(0, 3) : [];
  const credit = analyze(state.credits.plan, state.credits.track);
  const favSchools = state.favSchools.map((id) => GN_SCHOOLS.find((s) => s.id === id)).filter(Boolean);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold text-brand-100">{stage === "hs" ? "고등학생 과정" : "중학생 과정"} · {term.label}</div>
          <button
            className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/25"
            onClick={() => update((s) => ({ ...s, profile: { ...s.profile, stage: stage === "hs" ? "ms" : "hs" }, currentTerm: stage === "hs" ? "1-1" : "h1-1" }))}
          >
            {stage === "hs" ? "중학생 과정으로 전환" : "고등학생 과정으로 전환"}
          </button>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
          {state.profile.name ? `${state.profile.name}님, ` : ""}
          {p.doneCount === 0 ? "첫 걸음을 시작해 볼까요?" : p.doneCount === 5 ? "진로 지도를 완성했어요! 🎉" : `${p.doneCount}단계까지 왔어요`}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Link href={nextStep.href} className="btn bg-sun-400 text-slate-900 hover:bg-sun-500">
            {p.doneCount === 5 ? "리포트 보기" : `이어서: ${nextStep.label}`} →
          </Link>
          <div className="text-sm text-brand-100">
            진행 {p.doneCount}/5
            <div className="mt-1 h-1.5 w-40 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-sun-400 transition-all" style={{ width: `${p.doneCount * 20}%` }} />
            </div>
          </div>
        </div>
      </section>

      <ol className="grid gap-3 sm:grid-cols-5">
        {steps.map((s) => {
          const done = p.steps.find((x) => x.key === s.key)?.done;
          const isNext = s.key === nextStep.key && !done;
          return (
            <li key={s.key}>
              <Link href={s.href} className={`card flex h-full items-start gap-3 p-4 transition hover:border-brand-200 sm:flex-col ${isNext ? "border-brand-400 ring-2 ring-brand-100" : ""}`}>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${done ? "bg-emerald-500 text-white" : isNext ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {done ? "✓" : s.n}
                </span>
                <div>
                  <div className="font-bold text-slate-900">
                    {s.emoji} {s.label}
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-slate-500">{s.desc}</div>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 [&>*]:min-w-0">
        <div className="card">
          <div className="text-xs font-semibold text-slate-500">나의 흥미 유형</div>
          {tested ? (
            <>
              <div className="mt-2 text-2xl font-extrabold">
                {RIASEC[top[0]].emoji} {RIASEC[top[0]].name} · {RIASEC[top[1]].name}
              </div>
              <Link href="/discover" className="mt-2 inline-block text-sm font-semibold text-brand-600">
                결과 보기 →
              </Link>
            </>
          ) : (
            <Link href="/discover" className="btn-primary mt-3">
              5분 흥미 탐색 시작
            </Link>
          )}
          <div className="mt-4 text-xs font-semibold text-slate-500">{tested ? "추천 직업" : "찜한 직업"}</div>
          <ul className="mt-1 space-y-1">
            {(tested ? recs.map((r) => ({ j: r.job, s: r.score as number | undefined })) : [])
              .map(({ j, s }) => (
                <li key={j.id}>
                  <Link href={`/jobs/${j.id}`} className="flex justify-between rounded-lg px-1 py-1 text-sm hover:bg-slate-50">
                    <span className="truncate font-semibold">
                      {j.emoji} {j.name}
                    </span>
                    {s !== undefined && <span className="text-xs font-bold text-brand-600">{s}%</span>}
                  </Link>
                </li>
              ))}
            {!tested && <li className="text-sm text-slate-500">흥미 탐색을 하면 추천해 드려요.</li>}
          </ul>
        </div>

        {stage === "hs" ? (
          <div className="card">
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>192학점 설계</span>
              <Link href="/credits" className="text-brand-600">
                설계하기 →
              </Link>
            </div>
            <div className="mt-2 text-2xl font-extrabold">
              {credit.total + 18}
              <span className="text-base text-slate-400"> / 192학점</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, ((credit.total + 18) / 192) * 100)}%` }} />
            </div>
            <ul className="mt-3 space-y-1 text-xs">
              {credit.checks.filter((c) => c.level === "warn").slice(0, 3).map((c) => (
                <li key={c.text} className="text-amber-700">⚠ {c.text}</li>
              ))}
            </ul>
            <div className="mt-3 text-xs font-semibold text-slate-500">찜한 학과</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {state.favMajors.length ? state.favMajors.map((id) => MAJOR_MAP[id] && <Link key={id} href={`/majors/${id}`} className="chip">{MAJOR_MAP[id].name}</Link>) : <Link href="/majors" className="text-sm text-brand-600">학과 찾아보기 →</Link>}
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>경남 고입 다가오는 일정</span>
              <Link href="/highschool#gn" className="text-brand-600">
                전체 →
              </Link>
            </div>
            <ul className="mt-2 space-y-2 text-sm">
              {ADMISSION_SCHEDULE.filter((x) => x.round !== "추가").slice(0, 4).map((x) => (
                <li key={x.who} className="rounded-lg bg-slate-50 px-2.5 py-1.5">
                  <span className={`mr-1 rounded px-1 text-[10px] font-bold text-white ${x.round === "전기" ? "bg-emerald-600" : "bg-brand-600"}`}>{x.round}</span>
                  <span className="font-semibold">{x.who.split("—")[0]}</span>
                  <div className="text-xs text-slate-500">원서 {x.apply}</div>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-xs font-semibold text-slate-500">저장한 경남 고교</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {favSchools.length ? favSchools.map((s) => <span key={s!.id} className="chip">{s!.name.replace("고등학교", "고")}</span>) : <Link href="/schools" className="text-sm text-brand-600">고교 찾아보기 →</Link>}
            </div>
          </div>
        )}

        <div className="card">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>이번 학기 할 일 · {term.label}</span>
            <Link href="/plan" className="text-brand-600">
              관리 →
            </Link>
          </div>
          <div className="mt-2 text-2xl font-extrabold">
            {termTasks.filter((t) => t.done).length}
            <span className="text-base text-slate-400"> / {termTasks.length} 완료</span>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {termTasks.filter((t) => !t.done).slice(0, 3).map((t) => (
              <li key={t.id} className="truncate">
                ◻︎ {t.text}
              </li>
            ))}
          </ul>
          {term.note && <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">💡 {term.note}</p>}
        </div>
      </section>

      <HubGrid />
    </div>
  );
}

function HubGrid() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      {[
        { t: "탐색 백과", items: EXPLORE },
        { t: "도구", items: TOOLS },
      ].map((g) => (
        <div key={g.t}>
          <h2 className="mb-3 text-lg font-bold">{g.t}</h2>
          <div className="grid grid-cols-2 gap-2">
            {g.items.map((i) => (
              <Link key={i.href} href={i.href} className="card p-3 transition hover:border-brand-200">
                <div className="text-xl">{i.emoji}</div>
                <div className="mt-1 text-sm font-bold">{i.label}</div>
                <div className="text-xs text-slate-500">{i.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
