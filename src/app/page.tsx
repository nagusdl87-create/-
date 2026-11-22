"use client";

// 홈: 학교 안내문처럼 차분한 구성(번호 단계·선·여백) + 공공 서비스처럼 큰 검색과 바로가기·고입 일정 알림
// + 진로 노트처럼 완료 체크와 형광펜 강조. 그라데이션 배경·기울어진 카드·숫자 띠는 쓰지 않는다.
import Link from "next/link";
import { STATS } from "@/data/stats";
import { MySchoolMeal, MySchoolSchedule } from "@/components/Neis";
import { BackupReminder } from "@/components/Backup";
import { EnglishHome } from "@/components/English";
import { ArrowRight, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { isTestComplete, progress, rankedJobs, riasecScores, topTypes } from "@/lib/match";
import { analyze } from "@/lib/credits";
import { EXPLORE, JOURNEY, TOOLS, type NavItem } from "@/lib/journey";
import { RIASEC } from "@/data/riasec";
import { TERMS_BY_STAGE, type Stage } from "@/data/plan";
import { dday, GN_SCHOOLS, upcomingSchedule } from "@/data/gn";
import { MAJOR_MAP } from "@/data/majors";
import { LiveSearch } from "@/components/LiveSearch";
import { CreditCard } from "@/components/Credit";
import { CREDIT_RULES } from "@/data/subjects";
import { useLang, useT } from "@/lib/i18n";

type T = ReturnType<typeof useT>;

const FLOW = [
  { t: "흥미·가치관 알기", d: "5분 흥미 탐색" },
  { t: "직업·학과 찾기", d: "나와 맞는 순서로 추천" },
  { t: "고교 과목으로 잇기", d: "핵심·권장 과목 연결" },
  { t: "경남 고교 고르기", d: `${STATS.schools}개교 지도·학과` },
  { t: "192학점·대입 설계", d: "실시간 진단" },
];

/** 섹션 제목: 위에 굵은 선(안내문 표 머리처럼) */
function Section({ title, more, children, className = "" }: { title: string; more?: { href: string; label: string }; children: React.ReactNode; className?: string }) {
  return (
    <section className={className}>
      <div className="flex items-end justify-between gap-3 border-b-2 border-slate-800 pb-2">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {more && (
          <Link href={more.href} className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">
            {more.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function StagePicker() {
  const { update } = useStore();
  const t = useT();
  const pick = (stage: Stage) => update((s) => ({ ...s, profile: { ...s.profile, stage }, currentTerm: stage === "hs" ? "h1-1" : "1-1" }));
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(
        [
          { s: "ms", t: "중학생이에요", d: ["흥미·적성 탐색과 직업 찾기", "경남 고등학교 유형 비교와 학교 찾기", "고입 전형 일정과 학군 안내"] },
          { s: "hs", t: "고등학생이에요", d: ["관심 학과의 핵심·권장 과목", "192학점 3개년 과목 설계와 진단", "2028 대입·5등급 내신 계산기"] },
        ] as const
      ).map((x) => (
        <button key={x.s} onClick={() => pick(x.s)} className="group rounded-xl border-2 border-slate-200 bg-surface p-5 text-left transition hover:border-brand-500">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-slate-900">{t(x.t)}</span>
            <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-700" aria-hidden />
          </div>
          <ul className="mt-2 space-y-1 text-[0.95rem] text-slate-600">
            {x.d.map((d) => (
              <li key={d}>· {t(d)}</li>
            ))}
          </ul>
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

/** 경남 고입 원서 일정(알림판처럼) */
function AdmissionNotice({ limit = 3 }: { limit?: number }) {
  const t = useT();
  const upcoming = upcomingSchedule().slice(0, limit);
  return (
    <ul className="divide-y divide-slate-200">
      {upcoming.map((x) => {
        const d = dday(x.period!.start);
        return (
          <li key={x.who} className="flex items-center gap-3 py-2.5">
            <span className={`w-16 shrink-0 rounded-md py-1 text-center text-sm font-bold ${d <= 0 ? "bg-sun-100 text-amber-800" : "bg-brand-50 text-brand-700"}`}>{d <= 0 ? t("접수 중") : `D-${d}`}</span>
            <span className="min-w-0">
              <span className="block truncate text-[0.95rem] font-medium text-slate-800">{t(x.who.split("—")[0].trim())}</span>
              <span className="block text-xs text-slate-500">{t("원서 {date}", { date: x.apply })}</span>
            </span>
          </li>
        );
      })}
      {upcoming.length === 0 && <li className="py-3 text-sm text-slate-500">{t("올해 원서 접수 일정이 모두 끝났어요. 다음 학년도 일정은 교육청 발표 후 반영돼요.")}</li>}
    </ul>
  );
}

/** 메뉴 목록(안내문 목차처럼: 이름 — 설명) */
function MenuList({ items }: { items: NavItem[] }) {
  const t = useT();
  return (
    <ul className="divide-y divide-slate-200">
      {items.map((i) => (
        <li key={i.href}>
          <Link href={i.href} className="group flex items-baseline justify-between gap-3 py-2.5">
            <span className="min-w-0">
              <span className="font-semibold text-slate-900 group-hover:text-brand-700 group-hover:underline">{t(i.label)}</span>
              <span className="ml-2 text-sm text-slate-500">{t(i.desc)}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 self-center text-slate-300 group-hover:text-brand-700" aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  );
}

const POPULAR_MAJORS = ["cs", "medicine", "ai", "semiconductor", "business", "biology"];

function Hubs({ search = true }: { search?: boolean }) {
  const t = useT();
  return (
    <>
      {search && (
        <section>
          <LiveSearch />
        </section>
      )}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] [&>*]:min-w-0">
        <Section title={t("인기 학과별 핵심 권장과목")} more={{ href: "/majors", label: t("학과 백과 →") }}>
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{t("인기 학과별 핵심 권장과목")}</caption>
            <tbody className="divide-y divide-slate-200">
              {POPULAR_MAJORS.map((id) => MAJOR_MAP[id]).filter(Boolean).map((m) => (
                <tr key={m.id}>
                  <th scope="row" className="w-32 py-2.5 pr-3 align-top font-semibold sm:w-40">
                    <Link href={`/majors/${m.id}`} className="text-slate-900 hover:text-brand-700 hover:underline">{t(m.name)}</Link>
                  </th>
                  <td className="py-2.5 text-slate-600">{m.core.map((s) => t(s)).join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
        <Section title={t("고교학점제 핵심 숫자")} more={{ href: "/credits#standards", label: t("이수 기준 →") }}>
          <dl className="divide-y divide-slate-200 text-sm">
            {[
              ["졸업 기준", "192학점", "교과 174 + 창체 18"],
              ["국·수·영 상한", t("{n}학점", { n: CREDIT_RULES.basicCap }), "교과의 50% − 한국사"],
              ["필수 이수", t("{n}학점", { n: CREDIT_RULES.required }), "교과(군)별 최소 학점 합"],
              ["고교 내신", "5등급제", "1등급 상위 10%"],
            ].map(([l, v, d]) => (
              <div key={l} className="flex items-baseline justify-between gap-3 py-2.5">
                <dt className="text-slate-600">{t(l)}</dt>
                <dd className="text-right">
                  <span className="font-bold text-slate-900">{t(v)}</span>
                  <span className="ml-2 text-xs text-slate-500">{t(d)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 [&>*]:min-w-0">
        <Section title={t("탐색 백과")}>
          <MenuList items={EXPLORE} />
        </Section>
        <Section title={t("도구")}>
          <MenuList items={TOOLS} />
        </Section>
      </div>
    </>
  );
}

export default function Home() {
  const { state, ready, update } = useStore();
  const t = useT();
  const { lang } = useLang();
  const stage = state.profile.stage;
  const p = progress(state);

  if (!ready) return <div className="h-96" />;

  if (!stage) {
    return (
      <div className="space-y-12">
        <section className="pt-2">
          <p className="text-sm font-semibold text-brand-700">{t("경남 중·고등학생 진로·학업 설계")}</p>
          <h1 className="mt-3 text-[2rem] font-bold leading-[1.25] tracking-tight text-slate-900 sm:text-[2.75rem]">
            {t("흩어진 진로 정보를")}
            <br />
            {lang === "en" && "into "}
            <span className="mark-hl">{t("나만의 지도 한 장")}</span>
            {lang !== "en" && "으로"}
          </h1>
          <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-slate-600">{t("흥미 탐색에서 시작해 직업과 학과, 고교 과목, 경남 고등학교, 192학점 설계, 2028 대입까지. 앞 단계의 결과가 다음 단계로 자동으로 이어져요.")}</p>
          <div className="mt-6">
            <LiveSearch />
          </div>
        </section>

        <section id="stage" className="scroll-mt-24">
          <h2 className="mb-3 text-lg font-bold text-slate-900">{t("지금 몇 학년인가요?")}</h2>
          <StagePicker />
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] [&>*]:min-w-0">
          <Section title={t("이렇게 진행해요")}>
            <ol className="divide-y divide-slate-200">
              {FLOW.map((f, i) => (
                <li key={f.t} className="flex items-center gap-4 py-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-slate-300 text-sm font-bold text-slate-600">{i + 1}</span>
                  <span className="font-semibold text-slate-900">{t(f.t)}</span>
                  <span className="ml-auto text-right text-sm text-slate-500">{t(f.d)}</span>
                </li>
              ))}
            </ol>
          </Section>
          <Section title={t("경남 고입 일정")} more={{ href: "/highschool#gn", label: t("전체 일정") }}>
            <AdmissionNotice />
          </Section>
        </div>

        <Hubs search={false} />
        <EnglishHome />
        <CreditCard />
      </div>
    );
  }

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
    <div className="space-y-10">
      <section className="pt-2">
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
        <h1 className="mt-2 text-[1.8rem] font-bold tracking-tight text-slate-900 sm:text-[2.25rem]">
          {state.profile.name ? t("{name}님, ", { name: state.profile.name }) : ""}
          {allDone ? t("진로 지도를 완성했어요") : p.doneCount === 0 ? t("첫 걸음을 시작해 볼까요?") : t("다음은 ‘{step}’ 차례예요", { step: t(nextStep.label) })}
        </h1>
        <Link href={allDone ? "/report" : nextStep.href} className="btn-primary mt-4 rounded-full px-5">
          {allDone ? t("내 리포트 보기") : t("{step} 이어서 하기", { step: t(nextStep.label) })} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>

      {/* 나의 진로 노트: 다섯 단계 체크 */}
      <section aria-labelledby="note-title" className="rounded-xl border-2 border-slate-200 bg-surface p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 id="note-title" className="font-bold text-slate-900">{t("나의 진로 여정")}</h2>
          <span className="text-sm font-semibold text-slate-600" role="img" aria-label={t("진행 {v}/{m}", { v: p.doneCount, m: 5 })}>
            {p.doneCount} / 5
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden>
          <div className="h-full rounded-full bg-brand-500" style={{ width: `${(p.doneCount / 5) * 100}%` }} />
        </div>
        <ol className="mt-3 grid gap-1 sm:grid-cols-5 sm:gap-3">
          {steps.map((s) => {
            const done = p.steps.find((x) => x.key === s.key)?.done;
            const isNext = s.key === nextStep.key && !done;
            return (
              <li key={s.key}>
                <Link href={s.href} className="group flex items-start gap-2.5 rounded-lg p-2 hover:bg-slate-50">
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border-2 ${done ? "border-brand-600 bg-brand-600 text-white" : isNext ? "border-brand-600" : "border-slate-300"}`} aria-hidden>
                    {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[0.95rem] font-semibold ${done ? "text-slate-500 line-through decoration-slate-300" : "text-slate-900"}`}>
                      <span className={isNext ? "mark-hl" : ""}>{s.n}. {t(s.label)}</span>
                    </span>
                    <span className="block text-xs text-slate-500">{t(s.desc)}</span>
                    {done && <span className="sr-only">{t("완료")}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <BackupReminder />
      <MySchoolMeal school={state.profile.school} />
      <MySchoolSchedule school={state.profile.school} grade={state.profile.grade} />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 [&>*]:min-w-0">
        <Section title={t("나의 흥미 유형")} more={tested ? { href: "/discover", label: t("결과 보기") } : undefined}>
          {tested ? (
            <>
              <div className="mt-3 text-xl font-bold text-slate-900">
                {t(RIASEC[top[0]].name)} · {t(RIASEC[top[1]].name)}
              </div>
              <ul className="mt-2 divide-y divide-slate-200">
                {recs.map(({ job, score }) => (
                  <li key={job.id}>
                    <Link href={`/jobs/${job.id}`} className="flex items-center justify-between py-2 text-[0.95rem] hover:text-brand-700">
                      <span className="truncate">{t(job.name)}</span>
                      <span className="text-sm font-semibold text-brand-700">{score}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="mt-3 text-[0.95rem] text-slate-600">{t("30문항, 약 5분이면 흥미 유형과 맞춤 직업을 볼 수 있어요.")}</p>
              <Link href="/discover" className="btn-primary mt-4 rounded-full">
                {t("흥미 탐색 시작")}
              </Link>
            </>
          )}
        </Section>

        {stage === "hs" ? (
          <Section title={t("192학점 설계")} more={{ href: "/credits", label: t("설계하기") }}>
            <div className="mt-3 text-3xl font-bold text-slate-900">
              {credit.total + 18}
              <span className="text-base font-medium text-slate-500"> {t("/ 192학점")}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, ((credit.total + 18) / 192) * 100)}%` }} />
            </div>
            <ul className="mt-3 space-y-1 text-xs">
              {credit.checks.filter((c) => c.level === "warn").slice(0, 2).map((c) => (
                <li key={c.text} className="text-amber-700">
                  {checkText(c.text, t)}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {state.favMajors.length ? (
                state.favMajors.map((id) => MAJOR_MAP[id] && <Link key={id} href={`/majors/${id}`} className="chip">{t(MAJOR_MAP[id].name)}</Link>)
              ) : (
                <Link href="/majors" className="text-sm font-medium text-brand-700">
                  {t("관심 학과 찾아보기 →")}
                </Link>
              )}
            </div>
          </Section>
        ) : (
          <Section title={t("경남 고입 D-day")} more={{ href: "/highschool#gn", label: t("전체 일정") }}>
            <AdmissionNotice />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {favSchools.length ? (
                favSchools.map((s) => <span key={s!.id} className="chip" data-keep-ko>{s!.name.replace("고등학교", "고")}</span>)
              ) : (
                <Link href="/schools" className="text-sm font-medium text-brand-700">
                  {t("경남 고교 찾아보기 →")}
                </Link>
              )}
            </div>
          </Section>
        )}

        <Section title={`${t("이번 학기")} · ${t(term.label)}`} more={{ href: "/plan", label: t("관리") }}>
          <div className="mt-3 text-3xl font-bold text-slate-900">
            {termTasks.filter((x) => x.done).length}
            <span className="text-base font-medium text-slate-500"> {t("/ {n} 완료", { n: termTasks.length })}</span>
          </div>
          <ul className="mt-2 divide-y divide-slate-200 text-[0.95rem] text-slate-700">
            {termTasks.filter((x) => !x.done).slice(0, 3).map((task) => (
              <li key={task.id} className="flex gap-2 py-1.5">
                <span className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-slate-300" aria-hidden />
                <span className="truncate">{t(task.text)}</span>
              </li>
            ))}
          </ul>
          {term.note && <p className="mt-3 border-l-4 border-sun-400 bg-sun-100/60 px-3 py-2 text-xs leading-relaxed text-amber-900">{t(term.note)}</p>}
        </Section>
      </div>

      <Hubs />
      <EnglishHome />
      <CreditCard />
    </div>
  );
}
