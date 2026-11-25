"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, Printer } from "lucide-react";
import { PageHead } from "@/components/ui";
import { CURRICULUM_PREP, LESSON_PLANS, WORKSHEETS } from "@/data/lessons";

type Tab = "plan" | "sheet" | "prep";

export default function LessonKitPage() {
  const [tab, setTab] = useState<Tab>("plan");
  const [n, setN] = useState(1);
  const lesson = LESSON_PLANS.find((l) => l.n === n) ?? LESSON_PLANS[0];

  return (
    <div>
      <div className="no-print">
        <PageHead tone="indigo" eyebrow="선생님용" title="진로 시간 수업 꾸러미"
          desc="진로 시간에 바로 쓰는 45분 수업 3차시예요. 수업 흐름과 발문, 학생이 막히는 곳, 인쇄용 활동지, 우리 학교 편제표를 학생에게 나눠 주는 방법을 담았어요." />
        <div role="tablist" aria-label="꾸러미 구성" className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-slate-200/60 p-1">
          {([["plan", "수업 흐름"], ["sheet", "학생 활동지"], ["prep", "교사 준비(편제표)"]] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={`flex-1 shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold ${tab === k ? "bg-white shadow-sm" : "text-slate-500"}`}>{l}</button>
          ))}
        </div>
      </div>

      {tab === "plan" && (
        <section aria-label="수업 흐름">
          <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2">
            <div role="group" aria-label="차시 선택" className="flex gap-1.5">
              {LESSON_PLANS.map((l) => (
                <button key={l.n} aria-pressed={n === l.n} onClick={() => setN(l.n)} className={`chip px-3 py-1.5 text-sm ${n === l.n ? "chip-on" : ""}`}>{l.n}차시</button>
              ))}
            </div>
            <button className="btn-ghost py-2" onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden /> 이 차시 인쇄</button>
          </div>
          <article className="card">
            <div className="eyebrow">{lesson.n}차시 · 45분</div>
            <h2 className="mt-1 text-xl font-extrabold">{lesson.title}</h2>
            <p className="mt-2 rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-900"><b>학습 목표</b> {lesson.goal}</p>

            <h3 className="mt-4 text-sm font-bold">준비</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">{lesson.prep.map((p) => <li key={p}>{p}</li>)}</ul>

            <h3 className="mt-4 text-sm font-bold">수업 흐름</h3>
            <ol className="mt-2 space-y-2">
              {lesson.steps.map((s) => (
                <li key={s.t} className="flex gap-3 rounded-xl border border-slate-200 p-3 break-inside-avoid">
                  <span className="w-12 shrink-0 text-center text-sm font-extrabold text-brand-700">{s.min}분</span>
                  <div><div className="font-bold">{s.t}</div><p className="mt-0.5 text-sm leading-relaxed text-slate-600">{s.d}</p></div>
                </li>
              ))}
            </ol>
            <p className="mt-1 text-right text-xs text-slate-500">합계 {lesson.steps.reduce((a, s) => a + s.min, 0)}분</p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="break-inside-avoid">
                <h3 className="text-sm font-bold">교사 발문</h3>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">{lesson.ask.map((a) => <li key={a}>{a}</li>)}</ul>
              </div>
              <div className="break-inside-avoid">
                <h3 className="text-sm font-bold">학생이 막히는 곳</h3>
                <ul className="mt-1 space-y-1.5 text-sm text-slate-700">
                  {lesson.stuck.map((s) => <li key={s.q}><b>{s.q}</b><br /><span className="text-slate-600">{s.a}</span></li>)}
                </ul>
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900 break-inside-avoid"><b>기록·평가 유의</b> {lesson.record}</p>
            <div className="no-print mt-4 flex flex-wrap gap-2">
              {lesson.links.map((l) => <Link key={l.href} href={l.href} className="btn-ghost py-1.5 text-xs">{l.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>)}
            </div>
          </article>
        </section>
      )}

      {tab === "sheet" && (
        <section aria-label="학생 활동지">
          <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-600">종이에 쓰는 활동지예요. 이름은 인쇄한 종이에만 쓰고 사이트에는 저장하지 않아요. ‘활동지 인쇄’를 누르면 3장이 한 장씩 나와요.</p>
            <button className="btn-primary" onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden /> 활동지 인쇄</button>
          </div>
          <div className="space-y-4">
            {WORKSHEETS.map((w) => (
              <article key={w.n} className="card break-after-page">
                <h2 className="text-lg font-extrabold">{w.title}</h2>
                <p className="mt-1 text-sm text-slate-600">학년 반 번호 ____________ 이름 ____________________</p>
                <div className="mt-3 space-y-4">
                  {w.items.map((it) => (
                    <div key={it.q}>
                      <p className="text-sm font-semibold">{it.q}</p>
                      <div className="mt-2 space-y-5" aria-hidden>{Array.from({ length: it.lines }, (_, i) => <div key={i} className="border-b border-slate-300" />)}</div>
                    </div>
                  ))}
                </div>
                {w.note && <p className="mt-4 text-xs text-slate-500">{w.note}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "prep" && (
        <section aria-label="교사 준비" className="no-print">
          <div className="card">
            <div className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-brand-600" aria-hidden /><h2 className="text-lg font-extrabold">우리 학교 편제표를 학생에게 나눠 주기</h2></div>
            <p className="mt-1 text-sm text-slate-600">192학점 설계는 우리 학교 편제표가 있을 때 가장 쓸모 있어요. 한 번만 준비하면 학급·학년 전체가 같은 편제표로 연습할 수 있어요.</p>
            <ol className="mt-3 space-y-2">
              {CURRICULUM_PREP.map((s, i) => (
                <li key={s.t} className="flex gap-3 rounded-xl border border-slate-200 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white" aria-hidden>{i + 1}</span>
                  <div><div className="font-bold">{s.t}</div><p className="mt-0.5 text-sm leading-relaxed text-slate-600">{s.d}</p></div>
                </li>
              ))}
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/credits/school" className="btn-primary">학교 편제표 등록하러 가기 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link href="/teacher" className="btn-ghost">학급 현황 모아 보기</Link>
              <Link href="/teacher/share" className="btn-ghost">학생 공유 코드 만들기 안내</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
