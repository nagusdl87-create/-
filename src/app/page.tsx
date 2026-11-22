"use client";

// 홈: 당근처럼 친근한 생활 앱 구성 (2026-11-22 사용자 결정)
// 큰 검색 + 학년 버튼 → 색 아이콘 바로가기 → 왼쪽 콘텐츠(경남 산업 직업·분야별 직업·인기 학과) + 오른쪽 정보판(고입 D-day·급식·핵심 숫자)
// 그라데이션 배경·기울어진 목업 카드·숫자 띠는 쓰지 않는다. 조회 수 자료가 없으므로 '인기 순위'처럼 꾸미지 않는다.
import Link from "next/link";
import { MySchoolMeal, MySchoolSchedule } from "@/components/Neis";
import { BackupReminder } from "@/components/Backup";
import { EnglishHome } from "@/components/English";
import { ArrowRight, BookOpen, Calculator, CalendarClock, Check, ChevronRight, Compass, GraduationCap, LayoutGrid, MapPinned, Percent, Briefcase, type LucideIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { isTestComplete, progress, rankedJobs, riasecScores, topTypes } from "@/lib/match";
import { analyze } from "@/lib/credits";
import { EXPLORE, JOURNEY, TOOLS, type NavItem } from "@/lib/journey";
import { RIASEC } from "@/data/riasec";
import { TERMS_BY_STAGE, type Stage } from "@/data/plan";
import { dday, GN_SCHOOLS, upcomingSchedule } from "@/data/gn";
import { FIELDS, JOBS, type FieldId } from "@/data/jobs";
import { MAJOR_MAP } from "@/data/majors";
import { LiveSearch } from "@/components/LiveSearch";
import { CreditCard } from "@/components/Credit";
import { CREDIT_RULES } from "@/data/subjects";
import { useLang, useT } from "@/lib/i18n";

type T = ReturnType<typeof useT>;

// 바로가기 8칸: 색은 tailwind 토큰(다크 모드 자동)
const SHORTCUTS: { href: string; label: string; icon: LucideIcon; tone: string }[] = [
  { href: "/discover", label: "흥미 탐색", icon: Compass, tone: "bg-emerald-100 text-emerald-700" },
  { href: "/jobs", label: "직업 백과", icon: Briefcase, tone: "bg-coral-100 text-coral-700" },
  { href: "/majors", label: "학과 백과", icon: GraduationCap, tone: "bg-sky-100 text-sky-700" },
  { href: "/subjects", label: "과목 백과", icon: BookOpen, tone: "bg-violet-100 text-violet-700" },
  { href: "/schools", label: "경남 고교 찾기", icon: MapPinned, tone: "bg-amber-100 text-amber-800" },
  { href: "/credits", label: "192학점 설계", icon: LayoutGrid, tone: "bg-brand-100 text-brand-700" },
  { href: "/admission#calc", label: "내신 계산기", icon: Percent, tone: "bg-rose-100 text-rose-700" },
  { href: "/highschool#gn", label: "고입 일정", icon: CalendarClock, tone: "bg-indigo-100 text-indigo-700" },
];

// 분야 카드 바탕색
const FIELD_TONE: Record<FieldId, string> = {
  it: "bg-sky-50", eng: "bg-slate-100", sci: "bg-indigo-50", med: "bg-rose-50", edu: "bg-amber-50", biz: "bg-emerald-50",
  law: "bg-violet-50", art: "bg-coral-50", media: "bg-sun-100", sports: "bg-lime-50", life: "bg-amber-50", env: "bg-emerald-50",
};

const GN_JOBS = JOBS.filter((j) => j.gn);
const POPULAR_MAJORS = ["cs", "medicine", "ai", "semiconductor", "business", "biology"];

/** 둥근 흰 판(정보판·콘텐츠 묶음) */
function Panel({ title, more, children, className = "" }: { title: string; more?: { href: string; label: string }; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-surface p-4 sm:p-5 ${className}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-[1.05rem] font-bold text-slate-900">{title}</h2>
        {more && (
          <Link href={more.href} className="flex shrink-0 items-center text-sm font-medium text-slate-500 hover:text-brand-700">
            {more.label} <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function Shortcuts() {
  const t = useT();
  return (
    <nav aria-label={t("바로가기 메뉴")} className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {SHORTCUTS.map(({ href, label, icon: Icon, tone }) => (
        <Link key={href} href={href} className="group flex flex-col items-center gap-1.5 rounded-2xl p-2 text-center hover:bg-surface">
          <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tone} transition group-hover:scale-105 sm:h-14 sm:w-14`}>
            <Icon className="h-6 w-6" aria-hidden />
          </span>
          <span className="text-[0.8rem] font-semibold leading-tight text-slate-700 sm:text-sm">{t(label)}</span>
        </Link>
      ))}
    </nav>
  );
}

function StageButtons() {
  const { update } = useStore();
  const t = useT();
  const pick = (stage: Stage) => update((s) => ({ ...s, profile: { ...s.profile, stage }, currentTerm: stage === "hs" ? "h1-1" : "1-1" }));
  return (
    <div id="stage" className="grid scroll-mt-24 grid-cols-2 gap-2 sm:gap-3">
      {(
        [
          { s: "ms", t: "중학생이에요", d: "흥미 탐색 · 직업 찾기 · 고교 고르기" },
          { s: "hs", t: "고등학생이에요", d: "학과별 과목 · 192학점 · 2028 대입" },
        ] as const
      ).map((x) => (
        <button key={x.s} onClick={() => pick(x.s)} className={`rounded-2xl px-4 py-3.5 text-left transition sm:px-5 ${x.s === "ms" ? "bg-accent text-white hover:opacity-95" : "border-2 border-brand-600 bg-surface text-brand-800 hover:bg-brand-50"}`}>
          <span className="flex items-center justify-between text-[1.05rem] font-bold sm:text-lg">
            {t(x.t)} <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
          </span>
          <span className={`mt-0.5 hidden text-sm sm:block ${x.s === "ms" ? "text-white" : "text-brand-700"}`}>{t(x.d)}</span>
        </button>
      ))}
    </div>
  );
}

// 192학점 진단 문구(src/lib/credits.ts)를 영어 모드에서 바꿔 보여 주기. 모르는 문구는 사전(t)에 맡긴다.
function checkText(text: string, t: T) {
  let m = text.match(/^교과 학점이 (\d+)학점 부족해요\. \(현재 (\d+) \/ (\d+)\)$/);
  if (m) return t("교과 학점이 {n}학점 부족해요. (현재 {have} / {total})", { n: m[1], have: m[2], total: m[3] });
  m = text.match(/^(.+) 필수 이수 학점이 부족해요 \((\d+)\/(\d+)\)\.$/);
  if (m) return t("{area} 필수 이수 학점이 부족해요 ({have}/{min}).", { area: t(m[1]), have: m[2], min: m[3] });
  return t(text);
}

/** 경남 고입 원서 일정 */
function AdmissionList({ limit = 3 }: { limit?: number }) {
  const t = useT();
  const upcoming = upcomingSchedule().slice(0, limit);
  return (
    <ul className="space-y-2.5">
      {upcoming.map((x) => {
        const d = dday(x.period!.start);
        return (
          <li key={x.who} className="flex items-center gap-3">
            <span className={`w-14 shrink-0 rounded-lg py-1 text-center text-sm font-bold ${d <= 0 ? "bg-sun-100 text-amber-800" : "bg-brand-50 text-brand-700"}`}>{d <= 0 ? t("접수 중") : `D-${d}`}</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-slate-800">{t(x.who.split("—")[0].trim())}</span>
              <span className="block text-xs text-slate-500">{t("원서 {date}", { date: x.apply })}</span>
            </span>
          </li>
        );
      })}
      {upcoming.length === 0 && <li className="text-sm text-slate-500">{t("올해 원서 접수 일정이 모두 끝났어요. 다음 학년도 일정은 교육청 발표 후 반영돼요.")}</li>}
    </ul>
  );
}

/** 경남 주력 산업 직업 목록(번호 + 이모지 + 한 줄 소개) */
function GnJobs({ limit = 5 }: { limit?: number }) {
  const t = useT();
  return (
    <Panel title={t("경남 주력 산업 직업")} more={{ href: "/industry", label: t("더보기") }}>
      <ol className="divide-y divide-slate-100">
        {GN_JOBS.slice(0, limit).map((j, i) => (
          <li key={j.id}>
            <Link href={`/jobs/${j.id}`} className="group flex items-center gap-3 py-2.5">
              <span className="w-4 shrink-0 text-center text-sm font-bold text-slate-400">{i + 1}</span>
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl ${FIELD_TONE[j.field]}`} aria-hidden>{j.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-900 group-hover:text-brand-700">{t(j.name)}</span>
                <span className="block truncate text-sm text-slate-500">{t(j.summary)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

/** 분야별 직업(옆으로 넘겨 보기) */
function FieldCards() {
  const t = useT();
  const count = (f: FieldId) => JOBS.filter((j) => j.field === f).length;
  return (
    <Panel title={t("분야별 직업 둘러보기")} more={{ href: "/jobs", label: t("전체") }}>
      <ul className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
        {(Object.keys(FIELDS) as FieldId[]).map((f) => (
          <li key={f} className="shrink-0 snap-start">
            <Link href={`/jobs#field=${f}`} className={`flex h-28 w-28 flex-col justify-between rounded-2xl p-3 transition hover:-translate-y-0.5 ${FIELD_TONE[f]}`}>
              <span className="text-3xl" aria-hidden>{FIELDS[f].emoji}</span>
              <span>
                <span className="block text-sm font-bold leading-tight text-slate-900">{t(FIELDS[f].name)}</span>
                <span className="block text-xs text-slate-600">{t("{n}개 직업", { n: count(f) })}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function PopularMajors() {
  const t = useT();
  return (
    <Panel title={t("인기 학과별 핵심 권장과목")} more={{ href: "/majors", label: t("더보기") }}>
      <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 [&>*]:min-w-0">
        {POPULAR_MAJORS.map((id) => MAJOR_MAP[id]).filter(Boolean).map((m) => (
          <li key={m.id} className="border-b border-slate-100 last:border-0 sm:[&:nth-last-child(2)]:border-0">
            <Link href={`/majors/${m.id}`} className="group block py-2.5">
              <span className="block truncate font-semibold text-slate-900 group-hover:text-brand-700">{t(m.name)}</span>
              <span className="block truncate text-sm text-slate-500">{m.core.map((s) => t(s)).join(" · ")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function KeyNumbers() {
  const t = useT();
  return (
    <Panel title={t("고교학점제 핵심 숫자")} more={{ href: "/credits#standards", label: t("자세히") }}>
      <dl className="grid grid-cols-2 gap-2">
        {[
          ["졸업 기준", "192학점"],
          ["국·수·영 상한", t("{n}학점", { n: CREDIT_RULES.basicCap })],
          ["필수 이수", t("{n}학점", { n: CREDIT_RULES.required })],
          ["고교 내신", "5등급제"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl bg-slate-50 px-3 py-2">
            <dt className="text-xs text-slate-500">{t(l)}</dt>
            <dd className="font-bold text-slate-900">{t(v)}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

function AllMenus() {
  const t = useT();
  const col = (title: string, items: NavItem[]) => (
    <div>
      <h3 className="mb-1 text-sm font-bold text-slate-500">{title}</h3>
      <ul className="grid grid-cols-2 gap-x-4">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="block truncate py-1.5 text-sm text-slate-700 hover:text-brand-700 hover:underline">{t(i.label)}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <Panel title={t("전체 메뉴")}>
      <div className="grid gap-5 sm:grid-cols-2">
        {col(t("탐색 백과"), EXPLORE)}
        {col(t("도구"), TOOLS)}
      </div>
    </Panel>
  );
}

export default function Home() {
  const { state, ready, update } = useStore();
  const t = useT();
  const { lang } = useLang();
  const stage = state.profile.stage;
  const p = progress(state);

  if (!ready) return <div className="h-96" />;

  // ── 처음 방문(학년을 고르기 전)
  if (!stage) {
    return (
      <div className="space-y-6">
        <section className="space-y-4 pt-1">
          <h1 className="text-[1.65rem] font-bold leading-snug tracking-tight text-slate-900 sm:text-[2.1rem]">
            {lang === "en" ? (
              <>{t("흩어진 진로 정보를")} {t("나만의 지도 한 장")}</>
            ) : (
              <>
                흩어진 진로 정보를 <span className="text-brand-700">나만의 지도 한 장</span>으로
              </>
            )}
          </h1>
          <LiveSearch />
          <StageButtons />
        </section>

        <Shortcuts />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px] [&>*]:min-w-0">
          <div className="space-y-4">
            <GnJobs />
            <FieldCards />
            <PopularMajors />
          </div>
          <aside className="space-y-4">
            <Panel title={t("경남 고입 일정")} more={{ href: "/highschool#gn", label: t("전체") }}>
              <AdmissionList />
            </Panel>
            <Panel title={t("나의 흥미 유형")}>
              <p className="text-sm text-slate-600">{t("30문항, 약 5분이면 흥미 유형과 맞춤 직업을 볼 수 있어요.")}</p>
              <Link href="/discover" className="btn-primary mt-3 w-full justify-center rounded-xl">{t("흥미 탐색 시작")}</Link>
            </Panel>
            <KeyNumbers />
          </aside>
        </div>

        <AllMenus />
        <EnglishHome />
        <CreditCard />
      </div>
    );
  }

  // ── 학년을 고른 뒤(내 진로 홈)
  const steps = JOURNEY[stage];
  const nextStep = steps.find((s) => !p.steps.find((x) => x.key === s.key)?.done) ?? steps[4];
  const tested = isTestComplete(state.answers);
  const top = topTypes(riasecScores(state.answers));
  const termList = TERMS_BY_STAGE[stage];
  const term = termList.find((x) => x.id === state.currentTerm) ?? termList[0];
  const termTasks = state.tasks[term.id] ?? [];
  const recs = tested ? rankedJobs(state).slice(0, 3) : [];
  const credit = analyze(state.credits.plan, state.credits.track);
  const favSchools = state.favSchools.map((id) => GN_SCHOOLS.find((s) => s.id === id)).filter(Boolean);
  const allDone = p.doneCount === 5;

  return (
    <div className="space-y-6">
      <section className="space-y-4 pt-1">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="font-semibold text-brand-700">{t(stage === "hs" ? "고등학생 과정" : "중학생 과정")}</span>
          <span aria-hidden>·</span>
          <span>{t(term.label)}</span>
          <button
            className="ml-1 rounded-full px-2 py-0.5 text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
            onClick={() => update((s) => ({ ...s, profile: { ...s.profile, stage: stage === "hs" ? "ms" : "hs" }, currentTerm: stage === "hs" ? "1-1" : "h1-1" }))}
          >
            {t(stage === "hs" ? "중학생 과정으로 전환" : "고등학생 과정으로 전환")}
          </button>
        </div>
        <LiveSearch />
      </section>

      {/* 나의 진로 여정: 다음 할 일 + 다섯 단계 체크 */}
      <section aria-labelledby="journey-title" className="rounded-2xl border border-slate-200 bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 id="journey-title" className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {state.profile.name ? t("{name}님, ", { name: state.profile.name }) : ""}
              {allDone ? t("진로 지도를 완성했어요") : p.doneCount === 0 ? t("첫 걸음을 시작해 볼까요?") : t("다음은 ‘{step}’ 차례예요", { step: t(nextStep.label) })}
            </h1>
            <p className="mt-0.5 text-sm text-slate-500" role="img" aria-label={t("진행 {v}/{m}", { v: p.doneCount, m: 5 })}>
              {t("나의 진로 여정")} · {p.doneCount} / 5
            </p>
          </div>
          <Link href={allDone ? "/report" : nextStep.href} className="btn-primary rounded-xl px-5">
            {allDone ? t("내 리포트 보기") : t("{step} 이어서 하기", { step: t(nextStep.label) })} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden>
          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(p.doneCount / 5) * 100}%` }} />
        </div>
        <ol className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-5 sm:gap-2">
          {steps.map((s) => {
            const done = p.steps.find((x) => x.key === s.key)?.done;
            const isNext = s.key === nextStep.key && !done;
            return (
              <li key={s.key}>
                <Link href={s.href} className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition hover:bg-slate-50 ${isNext ? "bg-brand-50 ring-1 ring-brand-200" : ""}`}>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${done ? "bg-brand-600 text-white" : isNext ? "bg-accent text-white" : "bg-slate-100 text-slate-500"}`} aria-hidden>
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : s.n}
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate text-sm font-semibold ${done ? "text-slate-500" : "text-slate-900"}`}>{t(s.label)}</span>
                    <span className="block truncate text-xs text-slate-500">{t(s.desc)}</span>
                  </span>
                  {done && <span className="sr-only">{t("완료")}</span>}
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <BackupReminder />
      <Shortcuts />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px] [&>*]:min-w-0">
        <div className="space-y-4">
          <Panel title={t("나의 흥미 유형")} more={tested ? { href: "/discover", label: t("결과 보기") } : undefined}>
            {tested ? (
              <>
                <div className="text-lg font-bold text-slate-900">
                  {t(RIASEC[top[0]].name)} · {t(RIASEC[top[1]].name)}
                </div>
                <ul className="mt-1 divide-y divide-slate-100">
                  {recs.map(({ job, score }) => (
                    <li key={job.id}>
                      <Link href={`/jobs/${job.id}`} className="group flex items-center gap-3 py-2">
                        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl ${FIELD_TONE[job.field]}`} aria-hidden>{job.emoji}</span>
                        <span className="min-w-0 flex-1 truncate font-medium text-slate-800 group-hover:text-brand-700">{t(job.name)}</span>
                        <span className="text-sm font-bold text-brand-700">{score}%</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-600">{t("30문항, 약 5분이면 흥미 유형과 맞춤 직업을 볼 수 있어요.")}</p>
                <Link href="/discover" className="btn-primary rounded-xl">{t("흥미 탐색 시작")}</Link>
              </div>
            )}
          </Panel>

          <Panel title={`${t("이번 학기")} · ${t(term.label)}`} more={{ href: "/plan", label: t("관리") }}>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{termTasks.filter((x) => x.done).length}</span>
              <span className="text-sm text-slate-500">{t("/ {n} 완료", { n: termTasks.length })}</span>
            </div>
            <ul className="mt-1 divide-y divide-slate-100 text-[0.95rem] text-slate-700">
              {termTasks.filter((x) => !x.done).slice(0, 3).map((task) => (
                <li key={task.id} className="flex items-center gap-2.5 py-2">
                  <span className="h-4 w-4 shrink-0 rounded-md border-2 border-slate-300" aria-hidden />
                  <span className="truncate">{t(task.text)}</span>
                </li>
              ))}
            </ul>
            {term.note && <p className="mt-2 rounded-xl bg-sun-100/70 px-3 py-2 text-xs leading-relaxed text-amber-900">{t(term.note)}</p>}
          </Panel>

          <GnJobs limit={4} />
          <FieldCards />
        </div>

        <aside className="space-y-4">
          {stage === "hs" ? (
            <Panel title={t("192학점 설계")} more={{ href: "/credits", label: t("설계하기") }}>
              <div className="text-3xl font-bold text-slate-900">
                {credit.total + 18}
                <span className="text-base font-medium text-slate-500"> {t("/ 192학점")}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, ((credit.total + 18) / 192) * 100)}%` }} />
              </div>
              <ul className="mt-2 space-y-1 text-xs">
                {credit.checks.filter((c) => c.level === "warn").slice(0, 2).map((c) => (
                  <li key={c.text} className="text-amber-700">{checkText(c.text, t)}</li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {state.favMajors.length ? (
                  state.favMajors.map((id) => MAJOR_MAP[id] && <Link key={id} href={`/majors/${id}`} className="chip">{t(MAJOR_MAP[id].name)}</Link>)
                ) : (
                  <Link href="/majors" className="text-sm font-medium text-brand-700">{t("관심 학과 찾아보기 →")}</Link>
                )}
              </div>
            </Panel>
          ) : (
            <Panel title={t("경남 고입 D-day")} more={{ href: "/highschool#gn", label: t("전체") }}>
              <AdmissionList />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {favSchools.length ? (
                  favSchools.map((s) => <span key={s!.id} className="chip" data-keep-ko>{s!.name.replace("고등학교", "고")}</span>)
                ) : (
                  <Link href="/schools" className="text-sm font-medium text-brand-700">{t("경남 고교 찾아보기 →")}</Link>
                )}
              </div>
            </Panel>
          )}
          <MySchoolMeal school={state.profile.school} />
          <MySchoolSchedule school={state.profile.school} grade={state.profile.grade} />
          <KeyNumbers />
        </aside>
      </div>

      <PopularMajors />
      <AllMenus />
      <EnglishHome />
      <CreditCard />
    </div>
  );
}
