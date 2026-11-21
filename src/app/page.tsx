"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { isTestComplete, progress, rankedJobs, riasecScores, topTypes } from "@/lib/match";
import { STEPS } from "@/components/Nav";
import { RIASEC } from "@/data/riasec";
import { JOB_MAP } from "@/data/jobs";
import { TERMS } from "@/data/plan";

const STEP_DESC: Record<string, string> = {
  discover: "5분 흥미 탐색 + 가치관·강점 고르기",
  jobs: "나와 잘 맞는 직업을 추천받고 찜하기",
  path: "직업 → 대학 학과 → 고교 과목을 한 줄로",
  highschool: "고교 유형 비교와 나에게 맞는 학교 찾기",
  plan: "학기별 할 일, 공부 목표, 진로 활동 기록",
};

export default function Home() {
  const { state, ready } = useStore();
  const p = progress(state);
  const tested = isTestComplete(state.answers);
  const scores = riasecScores(state.answers);
  const top = topTypes(scores);
  const nextStep = STEPS.find((s) => !p.steps.find((x) => x.key === s.key)?.done) ?? STEPS[4];
  const term = TERMS.find((t) => t.id === state.currentTerm)!;
  const termTasks = state.tasks[state.currentTerm] ?? [];
  const recs = tested ? rankedJobs(state).slice(0, 3) : [];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 text-white sm:p-10">
        <div className="text-sm font-semibold text-brand-100">중학생을 위한 진로·학업 설계</div>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
          {ready && state.profile.name ? `${state.profile.name}님의 길,` : "나를 알고, 꿈을 찾고,"}
          <br />
          {ready && state.profile.name ? "한 걸음씩 그려 볼까요?" : "고등학교까지 한 번에 잇기"}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-brand-100 sm:text-base">
          정보를 찾아 헤매지 않아도 돼요. 5단계를 따라가면 흥미 → 직업 → 학과 → 고교 과목 → 지금 할 일까지 나만의 진로 지도가
          완성돼요.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href={nextStep.href} className="btn bg-sun-400 text-slate-900 hover:bg-sun-500">
            {p.doneCount === 0 ? "1단계부터 시작하기" : `이어서 하기: ${nextStep.label}`} →
          </Link>
          <div className="text-sm text-brand-100">
            진행 {ready ? p.doneCount : 0}/5 단계
            <div className="mt-1 h-1.5 w-40 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-sun-400 transition-all" style={{ width: `${ready ? p.doneCount * 20 : 0}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">나의 진로 여정</h2>
        <ol className="grid gap-3 sm:grid-cols-5">
          {STEPS.map((s) => {
            const done = ready && p.steps.find((x) => x.key === s.key)?.done;
            const isNext = s.key === nextStep.key && !done;
            return (
              <li key={s.key}>
                <Link
                  href={s.href}
                  className={`card flex h-full items-start gap-3 p-4 transition hover:border-brand-200 sm:flex-col ${
                    isNext ? "border-brand-400 ring-2 ring-brand-100" : ""
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                      done ? "bg-emerald-500 text-white" : isNext ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {done ? "✓" : s.n}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900">
                      {s.emoji} {s.label}
                    </div>
                    <div className="mt-0.5 text-xs leading-relaxed text-slate-500">{STEP_DESC[s.key]}</div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {ready && (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 [&>*]:min-w-0">
          <div className="card">
            <div className="text-xs font-semibold text-slate-500">나의 흥미 유형</div>
            {tested ? (
              <>
                <div className="mt-2 text-2xl font-extrabold text-slate-900">
                  {RIASEC[top[0]].emoji} {RIASEC[top[0]].name} · {RIASEC[top[1]].name}
                </div>
                <p className="mt-1 text-sm text-slate-600">{RIASEC[top[0]].short}을(를) 좋아하는 타입</p>
                <Link href="/discover" className="mt-3 inline-block text-sm font-semibold text-brand-600">
                  결과 자세히 보기 →
                </Link>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-slate-600">30문항, 약 5분이면 나의 흥미 육각형을 볼 수 있어요.</p>
                <Link href="/discover" className="btn-primary mt-3">
                  흥미 탐색 시작
                </Link>
              </>
            )}
          </div>

          <div className="card">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>{tested ? "나에게 추천하는 직업" : "찜한 직업"}</span>
              <Link href="/jobs" className="text-brand-600">
                전체 →
              </Link>
            </div>
            <ul className="mt-2 space-y-2">
              {(tested ? recs.map((r) => ({ j: r.job, s: r.score })) : state.favorites.slice(0, 3).map((id) => ({ j: JOB_MAP[id], s: undefined })))
                .filter((x) => x.j)
                .map(({ j, s }) => (
                  <li key={j.id}>
                    <Link href={`/jobs/${j.id}`} className="flex items-center justify-between rounded-xl px-2 py-1.5 hover:bg-slate-50">
                      <span className="text-sm font-semibold">
                        {j.emoji} {j.name}
                      </span>
                      {s !== undefined && <span className="text-xs font-bold text-brand-600">{s}%</span>}
                    </Link>
                  </li>
                ))}
              {!tested && state.favorites.length === 0 && <li className="text-sm text-slate-500">흥미 탐색을 하면 맞춤 직업을 추천해 드려요.</li>}
            </ul>
          </div>

          <div className="card">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>이번 학기 할 일 · {term.label}</span>
              <Link href="/plan" className="text-brand-600">
                관리 →
              </Link>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">
              {termTasks.filter((t) => t.done).length}
              <span className="text-base text-slate-400"> / {termTasks.length} 완료</span>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {termTasks
                .filter((t) => !t.done)
                .slice(0, 2)
                .map((t) => (
                  <li key={t.id} className="truncate">
                    ◻︎ {t.text}
                  </li>
                ))}
            </ul>
          </div>
        </section>
      )}

      <section className="card bg-slate-900 text-white">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { t: "흩어진 정보 대신 하나의 흐름", d: "검사·직업·학과·고교 정보를 따로 찾지 않아도, 앞 단계 결과가 다음 단계로 자동 연결돼요." },
            { t: "중학생 눈높이", d: "어려운 입시 용어 대신 지금 내가 할 수 있는 일을 중심으로 안내해요." },
            { t: "선생님·보호자와 함께", d: "진로 리포트를 인쇄하거나 링크로 공유해 상담에 바로 활용할 수 있어요." },
          ].map((x) => (
            <div key={x.t}>
              <div className="font-bold">{x.t}</div>
              <p className="mt-1 text-sm text-slate-300">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
