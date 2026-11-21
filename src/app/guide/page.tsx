"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, ListOrdered, ThumbsDown, ThumbsUp, Type } from "lucide-react";
import { PageHead } from "@/components/ui";
import { CH1, CH2, CH3, CH4, CH5 } from "@/data/guide";

const CHAPTERS = [
  { t: "진로·학업설계란?", sub: "개념과 3대 핵심 원리" },
  { t: "5단계 실천 로드맵", sub: "질문이 진로가 되는 길" },
  { t: "학년별 성장 & 학교생활", sub: "중1~고3 로드맵 · 창체 기록" },
  { t: "나만의 과목 설계법", sub: "전공에서 거꾸로 찾는 과목 선택" },
  { t: "꿈이 바뀌었을 때 (Plan B)", sub: "진로 변경 유형 · GROW 대화" },
];

function Ch1() {
  return (
    <div className="space-y-6">
      <p>
        진로·학업설계는 ‘장래희망 적기’나 ‘입시 상담’이 아니에요. <b>나를 알고, 관심을 키우기 위해 3년 동안 무엇을 어떻게 배울지 스스로 계획하는 과정</b>이에요. 고교학점제에서는 학생마다 듣는 과목이 달라 이 설계가 더 중요해졌어요.
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        {CH1.columns.map((c) => (
          <div key={c.t} className={`rounded-2xl border p-4 ${c.core ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white"}`}>
            <div className="text-[0.7rem] font-semibold tracking-wider text-brand-600">{c.en}</div>
            <div className="mt-1 font-bold">{c.t}</div>
            <p className="mt-1 text-sm italic text-slate-600">“{c.q}”</p>
            <ul className="mt-3 space-y-1 text-sm">
              {c.acts.map((a) => (
                <li key={a}>• {a}</li>
              ))}
            </ul>
            <p className="mt-3 rounded-xl bg-white/70 p-2.5 text-xs text-slate-600">
              <b>성장 포인트</b> {c.point}
            </p>
          </div>
        ))}
      </div>
      <h3 className="text-lg font-bold">학생과 보호자가 꼭 기억할 3대 핵심 원리</h3>
      <div className="space-y-3">
        {CH1.principles.map((p, i) => (
          <div key={p.t} className="rounded-2xl border border-slate-200 p-4">
            <div className="text-xs font-semibold text-brand-600">원리 {i + 1}</div>
            <div className="font-bold">{p.t}</div>
            <p className="mt-1 text-sm text-slate-700">{p.d}</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {p.tips.map((t) => (
                <li key={t}>✓ {t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Ch2() {
  const [s, setS] = useState(0);
  const st = CH2[s];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-1" role="tablist">
        {CH2.map((x, i) => (
          <button key={x.n} role="tab" aria-selected={s === i} onClick={() => setS(i)} className={`rounded-xl px-1 py-2 text-center text-xs font-semibold sm:text-sm ${s === i ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>
            {x.n}단계
            <span className="block text-[0.7rem] font-normal opacity-80 sm:text-xs">{x.t}</span>
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 p-5">
        <div className="text-xs font-semibold text-brand-600">{st.n}단계</div>
        <h3 className="text-xl font-bold">
          {st.t} <span className="text-base font-normal text-slate-500">· {st.sub}</span>
        </h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-semibold text-slate-800">핵심 배움 목표</dt>
            <dd className="text-slate-700">{st.goal}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-800">학생 실천 활동</dt>
            <dd>
              <ol className="list-decimal space-y-0.5 pl-5 text-slate-700">
                {st.acts.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ol>
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-800">나에게 던지는 진로 질문</dt>
            <dd className="text-slate-700">{st.questions.map((q) => `“${q}”`).join("  ")}</dd>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3">
              <dt className="font-semibold text-slate-800">선생님의 지도와 조언</dt>
              <dd className="mt-1 text-slate-700">{st.teacher}</dd>
            </div>
            <div className="rounded-xl bg-sun-100/60 p-3">
              <dt className="font-semibold text-slate-800">보호자의 응원</dt>
              <dd className="mt-1 text-slate-700">{st.parent}</dd>
            </div>
          </div>
          <div>
            <dt className="font-semibold text-slate-800">산출물</dt>
            <dd className="text-slate-700">{st.output}</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap justify-between gap-2">
          <button className="btn-ghost py-2" disabled={s === 0} onClick={() => setS(s - 1)}>
            <ChevronLeft className="h-4 w-4" /> 이전 단계
          </button>
          <Link href={st.link.href} className="btn-primary py-2">
            {st.link.label}에서 해 보기 <ArrowRight className="h-4 w-4" />
          </Link>
          <button className="btn-ghost py-2" disabled={s === 4} onClick={() => setS(s + 1)}>
            다음 단계 <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Ch3() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CH3.grades.map((g) => (
          <div key={g.g} className="rounded-2xl border border-slate-200 p-4">
            <div className="text-lg font-bold text-brand-700">{g.g}</div>
            <div className="font-semibold">{g.t}</div>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {g.acts.map((a) => (
                <li key={a}>• {a}</li>
              ))}
            </ul>
            <p className="mt-2 rounded-lg bg-sun-100/60 p-2 text-xs text-amber-900">💡 {g.tip}</p>
          </div>
        ))}
      </div>
      <h3 className="text-lg font-bold">창의적 체험활동, 이렇게 기록하면 달라요</h3>
      <div className="space-y-3">
        {CH3.records.map((r) => (
          <div key={r.area} className="rounded-2xl border border-slate-200 p-4">
            <div className="font-bold">{r.area}</div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl bg-rose-50 p-3 text-sm">
                <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-rose-700">
                  <ThumbsDown className="h-3.5 w-3.5" /> 아쉬운 기록
                </div>
                {r.weak}
              </div>
              <div className="rounded-xl bg-brand-50 p-3 text-sm">
                <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-brand-700">
                  <ThumbsUp className="h-3.5 w-3.5" /> 돋보이는 기록
                </div>
                {r.strong}
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              <b>핵심 차이</b> {r.diff}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Ch4() {
  const [s, setS] = useState(0);
  const st = CH4.steps[s];
  return (
    <div className="space-y-5">
      <ol className="grid gap-2 sm:grid-cols-5">
        {CH4.steps.map((x, i) => (
          <li key={x.t}>
            <button aria-pressed={s === i} onClick={() => setS(i)} className={`w-full rounded-xl p-3 text-left text-sm ${s === i ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
              <span className="text-xs opacity-80">Step {String(i + 1).padStart(2, "0")}</span>
              <span className="block font-semibold">{x.t}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="rounded-2xl border border-slate-200 p-5">
        <div className="font-bold">{st.t}</div>
        <dl className="mt-3 space-y-2 text-sm">
          <div>
            <dt className="font-semibold">핵심 질문</dt>
            <dd className="text-slate-700">{st.q}</dd>
          </div>
          <div>
            <dt className="font-semibold">실천 가이드</dt>
            <dd className="text-slate-700">{st.guide}</dd>
          </div>
          <div className="rounded-xl bg-brand-50 p-3">
            <dt className="font-semibold text-brand-800">💡 사례</dt>
            <dd className="text-slate-700">{st.ex}</dd>
          </div>
        </dl>
      </div>
      <h3 className="text-lg font-bold">선택과목 3가지 유형</h3>
      <div className="grid gap-3 md:grid-cols-3">
        {CH4.types.map((t) => (
          <div key={t.t} className="rounded-2xl border border-slate-200 p-4 text-sm">
            <div className="font-bold">{t.t}</div>
            <p className="mt-1 text-slate-700">{t.d}</p>
            <p className="mt-2 text-xs text-slate-500">평가: {t.eval}</p>
          </div>
        ))}
      </div>
      <Link href="/credits" className="btn-primary">
        192학점 설계 해 보기 <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Ch5() {
  const [g, setG] = useState(0);
  return (
    <div className="space-y-6">
      <p>진로가 바뀌는 것은 실패가 아니라 탐색이 잘 되고 있다는 신호예요. 중요한 것은 바뀐 이유를 설명하고 다음 계획을 세우는 것이에요.</p>
      <h3 className="text-lg font-bold">진로 변경 5가지 유형별 재설계</h3>
      <div className="space-y-3">
        {CH5.types.map((t, i) => (
          <div key={t.t} className="rounded-2xl border border-slate-200 p-4">
            <div className="text-xs font-semibold text-brand-600">유형 {i + 1}</div>
            <div className="font-bold">{t.t}</div>
            <p className="text-sm text-slate-500">예: {t.ex}</p>
            <p className="mt-2 rounded-xl bg-brand-50 p-3 text-sm">
              <b className="text-brand-800">브릿지 스토리 전략</b> {t.bridge}
            </p>
            <ul className="mt-2 grid gap-1 text-sm text-slate-700 sm:grid-cols-3">
              {t.guide.map((x) => (
                <li key={x}>✓ {x}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <h3 className="text-lg font-bold">GROW 진로 대화 모델 (가정·교실에서)</h3>
      <div className="grid grid-cols-4 gap-1" role="tablist">
        {CH5.grow.map((x, i) => (
          <button key={x.k} role="tab" aria-selected={g === i} onClick={() => setG(i)} className={`rounded-xl py-2 text-sm font-semibold ${g === i ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>
            {x.k}
            <span className="block text-xs font-normal opacity-80">{x.t}</span>
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {CH5.grow[g].qs.map((q) => (
          <li key={q} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
            “{q}”
          </li>
        ))}
      </ul>
    </div>
  );
}

const BODIES = [Ch1, Ch2, Ch3, Ch4, Ch5];

export default function GuidePage() {
  const [ch, setCh] = useState(0);
  const [big, setBig] = useState(false);
  const [toc, setToc] = useState(false);
  useEffect(() => {
    try {
      setBig(localStorage.getItem("myroad:guide-big") === "1");
      const h = Number(window.location.hash.replace("#ch", ""));
      if (h >= 1 && h <= 5) setCh(h - 1);
    } catch {}
  }, []);
  const go = (i: number) => {
    setCh(i);
    setToc(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const Body = BODIES[ch];
  return (
    <div>
      <PageHead title="진로·학업설계 가이드북" desc="학생, 보호자, 선생님이 함께 읽는 5장짜리 안내서예요. 진로·학업설계의 원리부터 5단계 실천 로드맵, 학년별 성장, 과목 설계법, 진로가 바뀌었을 때의 재설계까지 담았어요." />
      <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-5">
        {CHAPTERS.map((c, i) => (
          <button key={c.t} onClick={() => go(i)} aria-current={ch === i} className={`rounded-2xl border p-3 text-left transition ${ch === i ? "border-brand-400 bg-brand-50" : "border-slate-200 bg-white hover:border-slate-300"}`}>
            <span className="text-xs font-semibold text-brand-600">제 {i + 1}장 {ch === i && "· 읽는 중"}</span>
            <span className="block text-sm font-bold">{c.t}</span>
            <span className="block text-xs text-slate-500">{c.sub}</span>
          </button>
        ))}
      </div>
      <article className={`card ${big ? "text-[1.08rem]" : ""}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> 제 {ch + 1}장 / 5 · 진행률 {(ch + 1) * 20}%
          </span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-brand-500" style={{ width: `${(ch + 1) * 20}%` }} />
            </div>
            <button
              className="chip"
              onClick={() => {
                setBig(!big);
                try {
                  localStorage.setItem("myroad:guide-big", big ? "0" : "1");
                } catch {}
              }}
              aria-pressed={big}
            >
              <Type className="h-3.5 w-3.5" /> {big ? "크게 (A+)" : "보통 (A)"}
            </button>
          </div>
        </div>
        <h2 className="mt-3 text-2xl font-bold">{CHAPTERS[ch].t}</h2>
        <p className="mb-5 text-slate-500">{CHAPTERS[ch].sub}</p>
        <div className="leading-relaxed text-slate-800">
          <Body />
        </div>
        <div className="mt-8 flex justify-between border-t border-slate-100 pt-4">
          <button className="btn-ghost" disabled={ch === 0} onClick={() => go(ch - 1)}>
            <ChevronLeft className="h-4 w-4" /> 이전 장
          </button>
          <button className="btn-ghost" disabled={ch === 4} onClick={() => go(ch + 1)}>
            다음 장 <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </article>
      <div className="no-print fixed bottom-24 right-4 z-20 sm:bottom-8">
        {toc && (
          <div className="mb-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
            {CHAPTERS.map((c, i) => (
              <button key={c.t} onClick={() => go(i)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${ch === i ? "bg-brand-50 font-semibold text-brand-800" : "hover:bg-slate-50"}`}>
                {i + 1}장. {c.t}
              </button>
            ))}
          </div>
        )}
        <button className="btn-primary rounded-full shadow-lg" onClick={() => setToc(!toc)} aria-expanded={toc}>
          <ListOrdered className="h-4 w-4" /> 목차(1~5장)
        </button>
      </div>
    </div>
  );
}
