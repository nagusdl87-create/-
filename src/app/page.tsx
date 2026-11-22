"use client";

import Link from "next/link";
import { MySchoolMeal } from "@/components/Neis";
import { BackupReminder } from "@/components/Backup";
import { ArrowRight, Backpack, BookOpenCheck, CalendarClock, Check, GraduationCap, MapPinned, Calculator, Sparkles, Route, Compass } from "lucide-react";
import { useStore } from "@/lib/store";
import { isTestComplete, progress, rankedJobs, riasecScores, topTypes } from "@/lib/match";
import { analyze } from "@/lib/credits";
import { EXPLORE, JOURNEY, TOOLS } from "@/lib/journey";
import { RIASEC } from "@/data/riasec";
import { TERMS_BY_STAGE, type Stage } from "@/data/plan";
import { dday, GN_SCHOOLS, upcomingSchedule } from "@/data/gn";
import { MAJOR_MAP } from "@/data/majors";
import { HubList, ProgressRing } from "@/components/ui";
import { LiveSearch } from "@/components/LiveSearch";
import { CreditCard } from "@/components/Credit";
import { CREDIT_RULES } from "@/data/subjects";

const FLOW = [
  { icon: Compass, t: "흥미·가치관 알기", d: "5분 흥미 탐색" },
  { icon: GraduationCap, t: "직업·학과 찾기", d: "나와 맞는 순서로 추천" },
  { icon: Route, t: "고교 과목으로 잇기", d: "핵심·권장 과목 연결" },
  { icon: MapPinned, t: "경남 고교 고르기", d: "203개교 지도·학과" },
  { icon: Calculator, t: "192학점·대입 설계", d: "실시간 진단" },
];

function StagePicker() {
  const { update } = useStore();
  const pick = (stage: Stage) => update((s) => ({ ...s, profile: { ...s.profile, stage }, currentTerm: stage === "hs" ? "h1-1" : "1-1" }));
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(
        [
          { s: "ms", t: "중학생이에요", icon: Backpack, d: ["흥미·적성 탐색과 직업 찾기", "경남 고등학교 유형 비교와 학교 찾기", "고입 전형 일정과 학군 안내"] },
          { s: "hs", t: "고등학생이에요", icon: GraduationCap, d: ["관심 학과의 핵심·권장 과목", "192학점 3개년 과목 설계와 진단", "2028 대입·5등급 내신 계산기"] },
        ] as const
      ).map((x) => {
        const Icon = x.icon;
        return (
          <button key={x.s} onClick={() => pick(x.s)} className="card group text-left transition hover:border-brand-300 hover:bg-brand-50/30">
            <span className="icon-box h-12 w-12">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <div className="mt-4 text-xl font-bold text-slate-900">{x.t}</div>
            <ul className="mt-2 space-y-1.5 text-[0.95rem] text-slate-600">
              {x.d.map((d) => (
                <li key={d} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-700" aria-hidden /> {d}
                </li>
              ))}
            </ul>
            <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
              이 과정으로 시작하기 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
            </div>
          </button>
        );
      })}
    </div>
  );
}

const POPULAR_MAJORS = ["cs", "medicine", "ai", "semiconductor", "business", "biology"];

function Hubs() {
  return (
    <>
    <section>
      <LiveSearch />
    </section>
    <section>
      <h2 className="mb-3 text-lg font-bold text-slate-900">인기 학과별 핵심 권장과목</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {POPULAR_MAJORS.map((id) => MAJOR_MAP[id]).filter(Boolean).map((m) => (
          <Link key={m.id} href={`/majors/${m.id}`} className="card p-4 transition hover:border-brand-300">
            <div className="font-semibold text-slate-900">{m.name}</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {m.core.map((s) => (
                <span key={s} className="rounded-md bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-brand-800">{s}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
    <section className="grid gap-3 sm:grid-cols-4">
      {[
        ["192학점", "졸업 기준", "교과 174 + 창체 18"],
        [`${CREDIT_RULES.basicCap}학점`, "국·수·영 상한", "교과의 50% − 한국사"],
        [`${CREDIT_RULES.required}학점`, "필수 이수", "교과(군)별 최소 학점 합"],
        ["5등급제", "고교 내신", "1등급 상위 10%"],
      ].map(([v, t, d]) => (
        <Link key={t} href="/credits#standards" className="card p-4 transition hover:border-brand-300">
          <div className="text-xs font-semibold text-slate-500">{t}</div>
          <div className="text-xl font-bold text-slate-900">{v}</div>
          <div className="text-xs text-slate-500">{d}</div>
        </Link>
      ))}
    </section>
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 [&>*]:min-w-0">
      <div>
        <h2 className="mb-3 text-lg font-bold text-slate-900">탐색 백과</h2>
        <HubList items={EXPLORE} />
      </div>
      <div>
        <h2 className="mb-3 text-lg font-bold text-slate-900">도구</h2>
        <HubList items={TOOLS} />
      </div>
    </section>
    </>
  );
}

export default function Home() {
  const { state, ready, update } = useStore();
  const stage = state.profile.stage;
  const p = progress(state);

  if (!ready) return <div className="h-96" />;

  if (!stage) {
    return (
      <div className="space-y-14">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-coral-50 px-6 py-10 sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-200/50 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-sun-400/30 blur-3xl" aria-hidden />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> 경남 중·고등학생 진로·학업 설계
              </span>
              <h1 className="mt-4 text-[2.2rem] font-bold leading-[1.18] tracking-tight text-slate-900 sm:text-[3.2rem]">
                흩어진 진로 정보를
                <br />
                <span className="bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">나만의 지도 한 장</span>으로
              </h1>
              <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-slate-600">흥미 탐색에서 시작해 직업과 학과, 고교 과목, 경남 고등학교, 192학점 설계, 2028 대입까지. 앞 단계의 결과가 다음 단계로 자동으로 이어져요.</p>
              <div className="mt-7 flex flex-wrap gap-2">
                <a href="#stage" className="btn rounded-full bg-coral-500 px-6 py-3 text-white shadow-lg shadow-coral-500/25 hover:bg-coral-600">지금 시작하기 <ArrowRight className="h-4 w-4" aria-hidden /></a>
                <Link href="/explore" className="btn-ghost rounded-full px-6 py-3">둘러보기</Link>
              </div>
            </div>
            <div className="relative mx-auto h-[360px] w-full max-w-[460px]" aria-hidden>
              <div className="absolute left-0 top-4 w-[62%] rotate-[-3deg] rounded-2xl bg-white p-4 shadow-xl shadow-slate-900/10 ring-1 ring-slate-100">
                <div className="text-xs font-semibold text-slate-500">나의 흥미 유형</div>
                <svg viewBox="0 0 120 104" className="mx-auto mt-2 h-28 w-32">
                  <polygon points="60,4 112,32 112,76 60,100 8,76 8,32" fill="none" stroke="#e2e8f0" />
                  <polygon points="60,18 100,36 96,70 60,84 22,66 28,38" fill="rgba(29,150,126,.18)" stroke="#127a67" strokeWidth="2" />
                </svg>
                <div className="text-center text-sm font-bold text-slate-900">탐구형 · 현실형</div>
              </div>
              <div className="absolute right-0 top-0 w-[48%] rotate-[3deg] rounded-2xl bg-white p-4 shadow-xl shadow-slate-900/10 ring-1 ring-slate-100">
                <div className="text-xs font-semibold text-slate-500">경남 고입</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-lg bg-coral-50 px-2 py-1 text-sm font-bold text-coral-700">D-6</span>
                  <span className="text-xs text-slate-600">특성화고 원서</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-lg bg-brand-50 px-2 py-1 text-sm font-bold text-brand-700">D-19</span>
                  <span className="text-xs text-slate-600">후기 일반고</span>
                </div>
              </div>
              <div className="absolute right-0 top-[44%] z-10 w-[52%] rotate-[2deg] rounded-2xl bg-ink-900 p-4 text-white shadow-xl shadow-slate-900/20">
                <div className="text-xs font-semibold text-brand-200">192학점 진단</div>
                <div className="mt-1 text-2xl font-bold">
                  192<span className="text-sm font-medium text-white/60"> / 192</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/15">
                  <div className="h-full w-full rounded-full bg-sun-400" />
                </div>
                <div className="mt-2 text-xs text-white/80">✓ 필수 84학점 · ✓ 국수영 81 이내</div>
              </div>
              <div className="absolute bottom-0 left-2 w-[44%] rotate-[-2deg] rounded-2xl bg-white p-4 shadow-xl shadow-slate-900/10 ring-1 ring-slate-100">
                <div className="text-xs font-semibold text-slate-500">추천 직업</div>
                <div className="mt-1 flex items-center justify-between text-sm"><span>🛰️ 항공우주</span><b className="text-brand-700">92%</b></div>
                <div className="mt-1 flex items-center justify-between text-sm"><span>🚢 조선해양</span><b className="text-brand-700">88%</b></div>
              </div>
            </div>
          </div>
        </section>
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-ink-800 sm:grid-cols-5">
          {[
            ["203", "경남 고등학교"],
            ["290", "고교 과목"],
            ["444", "전국 대학·캠퍼스"],
            ["51", "직업"],
            ["20", "공식 진로검사"],
          ].map(([n, l]) => (
            <div key={l} className="bg-ink-900 px-5 py-6 text-center">
              <div className="text-3xl font-bold text-white">{n}</div>
              <div className="mt-1 text-xs font-medium text-brand-200">{l}</div>
            </div>
          ))}
        </section>
        <section id="stage" className="scroll-mt-24">
          <h2 className="mb-4 text-xl font-bold text-slate-900">지금 몇 학년인가요?</h2>
          <StagePicker />
        </section>
        <Hubs />
        <CreditCard />
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
  const upcoming = upcomingSchedule().slice(0, 3);
  const allDone = p.doneCount === 5;

  return (
    <div className="space-y-10">
      <section className="relative flex items-start justify-between gap-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-sun-100/70 px-6 py-8 sm:items-center sm:gap-6 sm:px-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-200/40 blur-3xl" aria-hidden />
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span className="font-semibold text-brand-700">{stage === "hs" ? "고등학생 과정" : "중학생 과정"}</span>
            <span aria-hidden>·</span>
            <span>{term.label}</span>
            <button
              className="ml-1 rounded-full px-2 py-0.5 text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
              onClick={() => update((s) => ({ ...s, profile: { ...s.profile, stage: stage === "hs" ? "ms" : "hs" }, currentTerm: stage === "hs" ? "1-1" : "h1-1" }))}
            >
              {stage === "hs" ? "중학생 과정으로 전환" : "고등학생 과정으로 전환"}
            </button>
          </div>
          <h1 className="mt-2 text-[1.8rem] font-bold tracking-tight text-slate-900 sm:text-[2.25rem]">
            {state.profile.name ? `${state.profile.name}님, ` : ""}
            {allDone ? "진로 지도를 완성했어요" : p.doneCount === 0 ? "첫 걸음을 시작해 볼까요?" : `다음은 ‘${nextStep.label}’ 차례예요`}
          </h1>
          <Link href={allDone ? "/report" : nextStep.href} className="btn-primary mt-5 rounded-full px-5">
            {allDone ? "내 리포트 보기" : `${nextStep.label} 이어서 하기`} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="shrink-0 sm:hidden">
          <ProgressRing value={p.doneCount} max={5} size={68} />
        </div>
        <div className="hidden shrink-0 sm:block">
          <ProgressRing value={p.doneCount} max={5} size={104} />
        </div>
      </section>

      <ol className="grid gap-2 sm:grid-cols-5 sm:gap-0" aria-label="나의 진로 여정">
        {steps.map((s, i) => {
          const done = p.steps.find((x) => x.key === s.key)?.done;
          const isNext = s.key === nextStep.key && !done;
          const Icon = s.icon;
          return (
            <li key={s.key} className="relative">
              {i < 4 && <span className={`absolute left-[calc(50%+1.5rem)] right-[calc(-50%+1.5rem)] top-6 hidden h-0.5 sm:block ${done ? "bg-brand-500" : "bg-slate-200"}`} aria-hidden />}
              <Link href={s.href} className={`group flex items-center gap-3 rounded-2xl p-3 transition hover:bg-white sm:flex-col sm:text-center ${isNext ? "bg-white ring-1 ring-brand-200" : ""}`}>
                <span className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full ${done ? "bg-brand-600 text-white" : isNext ? "bg-white text-brand-700 ring-2 ring-brand-500" : "bg-white text-slate-400 ring-1 ring-slate-200"}`}>
                  {done ? <Check className="h-5 w-5" aria-hidden /> : <Icon className="h-5 w-5" aria-hidden />}
                </span>
                <span>
                  <span className="block text-[0.95rem] font-semibold text-slate-900">
                    {s.n}. {s.label}
                  </span>
                  <span className="block text-xs text-slate-500">{s.desc}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <BackupReminder />
      <MySchoolMeal school={state.profile.school} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 [&>*]:min-w-0">
        <div className="card">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Sparkles className="h-4 w-4 text-brand-600" aria-hidden /> 나의 흥미 유형
          </div>
          {tested ? (
            <>
              <div className="mt-3 text-2xl font-bold text-slate-900">
                {RIASEC[top[0]].name} · {RIASEC[top[1]].name}
              </div>
              <ul className="mt-4 space-y-1">
                {recs.map(({ job, score }) => (
                  <li key={job.id}>
                    <Link href={`/jobs/${job.id}`} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-[0.95rem] hover:bg-slate-50">
                      <span className="truncate">{job.name}</span>
                      <span className="text-sm font-semibold text-brand-700">{score}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="mt-3 text-[0.95rem] text-slate-600">30문항, 약 5분이면 흥미 유형과 맞춤 직업을 볼 수 있어요.</p>
              <Link href="/discover" className="btn-primary mt-4 rounded-full">
                흥미 탐색 시작
              </Link>
            </>
          )}
        </div>

        {stage === "hs" ? (
          <div className="card">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-brand-600" aria-hidden /> 192학점 설계
              </span>
              <Link href="/credits" className="text-brand-700">
                설계하기
              </Link>
            </div>
            <div className="mt-3 text-3xl font-bold text-slate-900">
              {credit.total + 18}
              <span className="text-base font-medium text-slate-400"> / 192학점</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, ((credit.total + 18) / 192) * 100)}%` }} />
            </div>
            <ul className="mt-3 space-y-1 text-xs">
              {credit.checks.filter((c) => c.level === "warn").slice(0, 2).map((c) => (
                <li key={c.text} className="text-amber-700">
                  {c.text}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {state.favMajors.length ? (
                state.favMajors.map((id) => MAJOR_MAP[id] && <Link key={id} href={`/majors/${id}`} className="chip">{MAJOR_MAP[id].name}</Link>)
              ) : (
                <Link href="/majors" className="text-sm font-medium text-brand-700">
                  관심 학과 찾아보기 →
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-brand-600" aria-hidden /> 경남 고입 D-day
              </span>
              <Link href="/highschool#gn" className="text-brand-700">
                전체 일정
              </Link>
            </div>
            <ul className="mt-3 space-y-2">
              {upcoming.map((x) => {
                const d = dday(x.period!.start);
                return (
                  <li key={x.who} className="flex items-center gap-3">
                    <span className={`w-16 shrink-0 rounded-lg py-1 text-center text-sm font-bold ${d <= 0 ? "bg-sun-100 text-amber-800" : "bg-brand-50 text-brand-700"}`}>{d <= 0 ? "접수 중" : `D-${d}`}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-800">{x.who.split("—")[0].trim()}</span>
                      <span className="block text-xs text-slate-500">원서 {x.apply}</span>
                    </span>
                  </li>
                );
              })}
              {upcoming.length === 0 && <li className="text-sm text-slate-500">올해 원서 접수 일정이 모두 끝났어요. 다음 학년도 일정은 교육청 발표 후 반영돼요.</li>}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {favSchools.length ? (
                favSchools.map((s) => <span key={s!.id} className="chip">{s!.name.replace("고등학교", "고")}</span>)
              ) : (
                <Link href="/schools" className="text-sm font-medium text-brand-700">
                  경남 고교 찾아보기 →
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="card">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-2">
              <BookOpenCheck className="h-4 w-4 text-brand-600" aria-hidden /> 이번 학기 · {term.label}
            </span>
            <Link href="/plan" className="text-brand-700">
              관리
            </Link>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">
            {termTasks.filter((t) => t.done).length}
            <span className="text-base font-medium text-slate-400"> / {termTasks.length} 완료</span>
          </div>
          <ul className="mt-3 space-y-1.5 text-[0.95rem] text-slate-600">
            {termTasks.filter((t) => !t.done).slice(0, 3).map((t) => (
              <li key={t.id} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" aria-hidden />
                <span className="truncate">{t.text}</span>
              </li>
            ))}
          </ul>
          {term.note && <p className="mt-4 rounded-xl bg-sun-100/70 p-3 text-xs leading-relaxed text-amber-900">{term.note}</p>}
        </div>
      </section>

      <Hubs />
      <CreditCard />
    </div>
  );
}
