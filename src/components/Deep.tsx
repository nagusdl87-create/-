"use client";

// 직업·학과 상세 섹션 (콘텐츠 기준: docs/content-standard.md). 제목은 t(), 내용은 부모가 언어에 맞는 자료(d)를 넘긴다.
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Briefcase, Clock, Compass, GraduationCap, HelpCircle, Layers, Lightbulb, MapPin, Search, Sparkles, TrendingUp, Wrench } from "lucide-react";
import type { JobDeep, MajorDeep } from "@/data/deep/types";
import { useT } from "@/lib/i18n";
import { KeepKo } from "@/components/KeepKo";

function H({ icon: Icon, children, tone = "text-brand-600" }: { icon: typeof Clock; children: React.ReactNode; tone?: string }) {
  return (
    <h2 className="flex items-center gap-1.5 font-bold">
      <Icon className={`h-4 w-4 ${tone}`} aria-hidden /> {children}
    </h2>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const t = useT();
  if (!items.length) return null;
  return (
    <div className="card">
      <H icon={HelpCircle} tone="text-violet-600">{t("자주 묻는 질문")}</H>
      <div className="mt-2 divide-y divide-slate-100">
        {items.map((f) => (
          <details key={f.q} className="group py-2.5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-semibold text-slate-900">
              <span>Q. <KeepKo text={f.q} /></span>
              <span className="shrink-0 text-slate-400 transition group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600"><KeepKo text={f.a} /></p>
          </details>
        ))}
      </div>
    </div>
  );
}

/** 직업: 하는 일 + 하루 흐름 + 필요한 능력 + 중·고등학생 활동 */
export function JobDeepMain({ d, tasks, ms }: { d?: JobDeep; tasks: string[]; ms: string[] }) {
  const t = useT();
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 [&>*]:min-w-0">
        <div className="card">
          <H icon={Briefcase}>{t("이런 일을 해요")}</H>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-slate-700">
            {(d?.work ?? tasks).map((w) => (
              <li key={w} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden /><KeepKo text={w} /></li>
            ))}
          </ul>
        </div>
        {d && (
          <div className="card">
            <H icon={Clock} tone="text-sky-600">{t("하루는 이렇게 흘러가요")} <span className="text-xs font-normal text-slate-500">{t("(예시)")}</span></H>
            <ol className="mt-3 space-y-3 border-l-2 border-sky-100 pl-4">
              {d.day.map((s) => (
                <li key={s.t} className="relative text-sm">
                  <span className="absolute -left-[1.4rem] top-1 h-3 w-3 rounded-full border-2 border-sky-400 bg-surface" aria-hidden />
                  <b className="text-slate-900">{s.t}</b>
                  <p className="text-slate-600"><KeepKo text={s.d} /></p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {d && (
        <div className="card">
          <H icon={Wrench} tone="text-amber-600">{t("필요한 지식과 능력")}</H>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {d.skills.map((s) => (
              <div key={s.k} className="rounded-xl bg-slate-50 p-3">
                <div className="text-sm font-semibold text-slate-900"><KeepKo text={s.k} /></div>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600"><KeepKo text={s.why} /></p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 [&>*]:min-w-0">
        <div className="card">
          <H icon={Compass}>{t("중학생인 지금 해 볼 수 있는 일")}</H>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {ms.map((x) => <li key={x}>✓ <KeepKo text={x} /></li>)}
          </ul>
          <Link href="/plan" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">{t("내 계획에 넣기")} <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
        </div>
        {d && (
          <div className="card">
            <H icon={GraduationCap} tone="text-violet-600">{t("고등학생이 되면 해 볼 활동")}</H>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              {d.hs.map((x) => <li key={x}>✓ <KeepKo text={x} /></li>)}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

/** 직업: 근무 환경·학력 경로 */
export function JobDeepWork({ d }: { d?: JobDeep }) {
  const t = useT();
  if (!d) return null;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 [&>*]:min-w-0">
      <div className="card">
        <H icon={MapPin} tone="text-sky-600">{t("일하는 환경")}</H>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-700"><KeepKo text={d.env} /></p>
      </div>
      <div className="card">
        <H icon={GraduationCap}>{t("학력·진로 경로")}</H>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-700"><KeepKo text={d.edu} /></p>
        <h3 className="mt-3 text-sm font-bold text-slate-800">{t("경력이 쌓이면")}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-700"><KeepKo text={d.growth} /></p>
      </div>
    </div>
  );
}

/** 직업: 기술 변화 */
export function JobFuture({ d }: { d?: JobDeep }) {
  const t = useT();
  if (!d) return null;
  return (
    <div className="card border-violet-100">
      <H icon={TrendingUp} tone="text-violet-600">{t("기술이 바뀌면 이 일은?")}</H>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-700"><KeepKo text={d.future} /></p>
    </div>
  );
}

/** 학과: 소개 아래 질문 + 세부 전공 + 학년별 흐름 + 능력 + 비교 + 졸업 후 + 탐구 주제 */
export function MajorDeepMain({ d }: { d?: MajorDeep }) {
  const t = useT();
  if (!d) return null;
  return (
    <>
      <div className="card">
        <H icon={Search} tone="text-sky-600">{t("이런 질문을 탐구해요")}</H>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {d.questions.map((q) => (
            <li key={q} className="rounded-xl bg-sky-50 p-3 text-sm font-medium leading-relaxed text-sky-900"><KeepKo text={q} /></li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 [&>*]:min-w-0">
        <div className="card">
          <H icon={Layers}>{t("세부 전공 분야")}</H>
          <ul className="mt-2 space-y-2">
            {d.tracks.map((tr) => (
              <li key={tr.name} className="text-sm">
                <b className="text-slate-900"><KeepKo text={tr.name} /></b>
                <p className="text-slate-600"><KeepKo text={tr.d} /></p>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <H icon={BookOpenCheck} tone="text-amber-600">{t("학년별로 이렇게 배워요")}</H>
          <ol className="mt-3 space-y-2.5 border-l-2 border-amber-100 pl-4">
            {d.years.map((y) => {
              const [a, ...b] = y.split(":");
              return (
                <li key={y} className="relative text-sm">
                  <span className="absolute -left-[1.4rem] top-1 h-3 w-3 rounded-full border-2 border-amber-400 bg-surface" aria-hidden />
                  {b.length ? (<><b className="text-slate-900"><KeepKo text={a} /></b><p className="text-slate-600"><KeepKo text={b.join(":").trim()} /></p></>) : <p className="text-slate-700"><KeepKo text={y} /></p>}
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-xs text-slate-500">{t("대학마다 교육과정이 달라요. 지원할 대학의 교육과정표를 확인하세요.")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 [&>*]:min-w-0">
        <div className="card">
          <H icon={Sparkles}>{t("이 학과에서 길러지는 능력")}</H>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {d.skills.map((s) => <span key={s} className="chip"><KeepKo text={s} /></span>)}
          </div>
          {d.compare.length > 0 && (
            <>
              <h3 className="mt-4 text-sm font-bold text-slate-800">{t("헷갈리기 쉬운 학과와 차이")}</h3>
              <ul className="mt-1.5 space-y-1.5 text-sm text-slate-700">
                {d.compare.map((c) => <li key={c.with}><b><KeepKo text={c.with} /></b>: <KeepKo text={c.diff} /></li>)}
              </ul>
            </>
          )}
        </div>
        <div className="card">
          <H icon={Lightbulb} tone="text-violet-600">{t("고등학교에서 해 볼 탐구 주제")}</H>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {d.hs.map((x) => <li key={x}>✓ <KeepKo text={x} /></li>)}
          </ul>
          <h3 className="mt-4 text-sm font-bold text-slate-800">{t("졸업하면")}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700"><KeepKo text={d.after} /></p>
        </div>
      </div>
    </>
  );
}
