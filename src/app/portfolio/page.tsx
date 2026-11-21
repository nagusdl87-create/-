"use client";

import { useState } from "react";
import Link from "next/link";
import { uid, useStore, SEMS, type Book } from "@/lib/store";
import { analyze, parseEntry, SEM_LABEL } from "@/lib/credits";
import { TRACKS } from "@/data/subjects";
import { MAJOR_MAP } from "@/data/majors";
import { JOB_MAP } from "@/data/jobs";
import { PageHead } from "@/components/ui";

type Kind = "activity" | "design" | "reading";

type Field = { k: string; label: string; hint: string; long?: boolean };
type StepDef = { t: string; sub: string; fields: Field[] };

const BASIC: StepDef = {
  t: "기본 정보",
  sub: "활동 개요",
  fields: [
    { k: "title", label: "활동(프로그램·동아리) 이름", hint: "예) 항공우주 메이커 동아리 ‘날개’" },
    { k: "area", label: "창의적 체험활동 영역", hint: "자율·자치 / 동아리 / 봉사 / 진로" },
    { k: "period", label: "활동 기간", hint: "예) 2027. 3. ~ 7." },
    { k: "dream", label: "관련 희망 진로", hint: "예) 항공우주 엔지니어" },
  ],
};

const MS_STEPS: StepDef[] = [
  BASIC,
  { t: "1단계 · 조사", sub: "동기·사전조사·질문", fields: [
    { k: "motive", label: "이 활동을 하게 된 계기", hint: "무엇이 궁금했거나 관심이 생겼나요?", long: true },
    { k: "research", label: "미리 조사한 내용", hint: "책, 영상, 누리집에서 알게 된 것", long: true },
    { k: "question", label: "나의 탐구 질문", hint: "예) 비행기는 어떻게 무거운데도 뜰까?" },
  ] },
  { t: "2단계 · 계획", sub: "목표·실천 계획", fields: [
    { k: "goal", label: "활동 목표", hint: "이 활동으로 이루고 싶은 것" },
    { k: "plan", label: "실천 계획 (언제·무엇을·어떻게)", hint: "주차별 또는 단계별로 적어 보세요", long: true },
  ] },
  { t: "3단계 · 실행", sub: "현장 기록", fields: [
    { k: "do", label: "실제로 한 일", hint: "구체적인 장면과 내 역할을 적어요", long: true },
    { k: "found", label: "탐구 질문에 대한 답", hint: "알아낸 것, 아직 모르는 것", long: true },
  ] },
  { t: "4단계 · 성찰", sub: "생각 변화·교과 연결", fields: [
    { k: "change", label: "활동 전과 후, 생각이 어떻게 바뀌었나요?", hint: "", long: true },
    { k: "subject", label: "관련 교과와 연결", hint: "예) 과학 ‘힘과 운동’ 단원과 연결" },
    { k: "next", label: "다음에 해 보고 싶은 것", hint: "" },
  ] },
];

const HS_STEPS: StepDef[] = [
  BASIC,
  { t: "1단계 · 질문", sub: "문제 발견", fields: [
    { k: "motive", label: "탐구 동기 (수업·경험에서 출발)", hint: "어떤 수업 장면이나 경험에서 질문이 생겼나요?", long: true },
    { k: "question", label: "탐구 질문", hint: "구체적이고 탐구 가능한 질문으로" },
  ] },
  { t: "2단계 · 설계", sub: "탐구 방법·자료", fields: [
    { k: "method", label: "탐구 방법", hint: "문헌 조사, 실험, 설문, 데이터 분석 등", long: true },
    { k: "source", label: "참고 자료", hint: "도서, 논문, 통계 출처" },
  ] },
  { t: "3단계 · 실행", sub: "과정 기록", fields: [
    { k: "do", label: "탐구 과정", hint: "시행착오와 해결 과정을 포함해서", long: true },
  ] },
  { t: "4단계 · 결과", sub: "결론·교과 연결", fields: [
    { k: "result", label: "결과와 결론", hint: "", long: true },
    { k: "subject", label: "연결된 교과·개념", hint: "예) 물리학 ‘유체와 압력’, 미적분Ⅰ ‘도함수’" },
  ] },
  { t: "5단계 · 성찰", sub: "성장·확장", fields: [
    { k: "change", label: "배우고 성장한 점", hint: "지식·태도·진로 생각의 변화", long: true },
    { k: "next", label: "후속 탐구·과목 선택 계획", hint: "다음 학기 어떤 과목·활동으로 이어 갈까요?" },
  ] },
];

const SELF_MS = ["조사", "계획", "실행", "성찰", "협력", "나눔과 배려"];
const SELF_HS = ["나의 강점과 성장할 점을 알게 되었다", "새로운 도전으로 기술을 익혔다", "스스로 기획하고 추진했다", "끈기 있게 끝까지 해냈다", "다른 사람과 협력했다", "사회 문제에 관심을 갖고 참여했다", "윤리적인 판단을 고민했다"];
const SCALE_MS = ["잘했어요", "보통이에요", "더 노력할래요"];
const SCALE_HS = ["매우 그렇다", "그렇다", "보통", "노력 필요"];

const EXAMPLE: Record<"ms" | "hs", Record<string, string>> = {
  ms: {
    title: "우리 지역 조선 산업 탐구", area: "진로 활동", period: "2027. 4. ~ 6.", dream: "조선해양공학 기술자",
    motive: "거제에 사는데 매일 보는 거대한 배가 어떻게 바다에 뜨는지 궁금했다.",
    research: "부력의 원리(아르키메데스)와 우리 지역 조선소에서 만드는 배의 종류를 책과 영상으로 조사했다.",
    question: "쇠로 만든 무거운 배는 어떻게 물에 뜰까?",
    goal: "부력 원리를 실험으로 확인하고, 조선 관련 직업 3가지를 알아본다.",
    plan: "1주: 자료 조사 / 2주: 알루미늄 포일 배 실험 / 3주: 조선 관련 직업인 영상 시청 / 4주: 발표 자료 만들기",
    do: "포일 배의 모양을 바꿔 가며 동전을 몇 개까지 실을 수 있는지 측정했다. 바닥이 넓을수록 더 많이 실렸다.",
    found: "배는 속이 비어 있어 밀어낸 물의 무게만큼 떠오르는 힘을 받는다. 배 모양 설계가 중요하다는 것을 알았다.",
    change: "막연히 ‘배를 만드는 사람’이라고 생각했는데, 설계·용접·품질 관리 등 다양한 직업이 있다는 것을 알게 되었다.",
    subject: "과학 ‘힘과 운동’, 수학 ‘그래프’", next: "조선 분야 마이스터고 설명회에 참여해 보고 싶다.",
  },
  hs: {
    title: "날개 모양에 따른 양력 비교 탐구", area: "동아리 활동", period: "2027. 3. ~ 7.", dream: "항공우주 엔지니어",
    motive: "물리학 수업에서 베르누이 원리를 배우고, 사천의 항공 산업 견학에서 본 날개 단면이 왜 그런 모양인지 궁금해졌다.",
    question: "날개 단면의 곡률과 받음각이 양력에 어떤 영향을 줄까?",
    method: "3D 프린터로 곡률이 다른 날개 3종을 만들고, 선풍기 풍동과 전자저울로 양력을 측정했다. 받음각은 0~15°로 바꿨다.",
    source: "물리학 교과서, 항공 역학 입문서, 공공 연구기관 공개 자료",
    do: "처음에는 바람이 고르지 않아 측정값이 흔들렸다. 빨대를 묶어 정류기를 만들어 오차를 줄였다.",
    result: "곡률이 클수록, 받음각이 커질수록 양력이 증가했지만 약 12° 이후에는 오히려 줄어드는 실속 현상을 확인했다.",
    subject: "물리학 ‘유체와 압력’, 미적분Ⅰ ‘변화율’",
    change: "실험 설계에서 변인 통제가 얼마나 중요한지 배웠다. 문제를 끝까지 해결하는 끈기가 생겼다.",
    next: "2학년 2학기에 역학과 에너지를 선택해 유체 역학을 더 깊이 공부하겠다.",
  },
};

export default function PortfolioPage() {
  const { ready } = useStore();
  const [kind, setKind] = useState<Kind>("activity");
  if (!ready) return <div className="h-96" />;
  return (
    <div>
      <PageHead title="진로 포트폴리오" desc="활동을 질문과 성찰로 엮는 진로활동 포트폴리오, 3개년 학업설계서, 진로 연계 독서 기록을 작성하고 인쇄·PDF로 저장하세요. 내용은 이 기기에 자동 저장돼요." />
      <div className="no-print mb-4 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1" role="tablist">
        {(
          [
            ["activity", "🧪 진로활동"],
            ["design", "🧮 학업설계서"],
            ["reading", "📖 진로 독서"],
          ] as const
        ).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={kind === k} onClick={() => setKind(k)} className={`rounded-lg py-2 text-sm font-semibold ${kind === k ? "bg-white shadow-sm" : "text-slate-500"}`}>
            {l}
          </button>
        ))}
      </div>
      {kind === "activity" && <Activity />}
      {kind === "design" && <Design />}
      {kind === "reading" && <Reading />}
      <p className="no-print mt-6 text-xs text-slate-400">학교 공용 PC에서는 기록이 지워질 수 있어요. 작성 후 인쇄/PDF로 저장하거나 리포트 페이지에서 백업 파일을 만들어 두세요.</p>
    </div>
  );
}

function Activity() {
  const { state, update } = useStore();
  const [level, setLevel] = useState<"ms" | "hs">(state.profile.stage === "hs" ? "hs" : "ms");
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState(false);
  const steps = level === "hs" ? HS_STEPS : MS_STEPS;
  const key = (k: string) => `act.${level}.${k}`;
  const val = (k: string) => state.portfolio[key(k)] ?? "";
  const set = (k: string, v: string) => update((s) => ({ ...s, portfolio: { ...s.portfolio, [key(k)]: v } }));
  const SELF = level === "hs" ? SELF_HS : SELF_MS;
  const SC = level === "hs" ? SCALE_HS : SCALE_MS;
  const filled = steps.flatMap((s) => s.fields).filter((f) => val(f.k).trim()).length;
  const total = steps.flatMap((s) => s.fields).length;

  if (preview) {
    return (
      <div>
        <div className="no-print mb-3 flex gap-2">
          <button className="btn-ghost" onClick={() => setPreview(false)}>← 작성으로</button>
          <button className="btn-primary" onClick={() => window.print()}>🖨️ 인쇄 / PDF</button>
        </div>
        <article className="card space-y-3">
          <header className="border-b-2 border-slate-900 pb-2">
            <div className="text-xs font-bold text-brand-600">진로활동 포트폴리오 ({level === "hs" ? "고교 5단계" : "중학 4단계"})</div>
            <h2 className="text-xl font-extrabold">{val("title") || "(활동 이름)"}</h2>
            <div className="text-sm text-slate-500">{[state.profile.school, state.profile.name, val("period"), val("dream")].filter(Boolean).join(" · ")}</div>
          </header>
          {steps.slice(1).map((s) => (
            <section key={s.t}>
              <h3 className="font-bold text-brand-700">{s.t} <span className="text-xs font-normal text-slate-500">{s.sub}</span></h3>
              <dl className="mt-1 space-y-1.5">
                {s.fields.map((f) => (
                  <div key={f.k}>
                    <dt className="text-xs font-semibold text-slate-500">{f.label}</dt>
                    <dd className="whitespace-pre-wrap text-sm">{val(f.k) || "-"}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
          <section>
            <h3 className="font-bold text-brand-700">자기 평가</h3>
            <ul className="mt-1 grid gap-1 text-sm sm:grid-cols-2">
              {SELF.map((g, i) => (
                <li key={g} className="flex justify-between rounded bg-slate-50 px-2 py-1">
                  <span>{g}</span>
                  <b>{val(`self${i}`) || "-"}</b>
                </li>
              ))}
            </ul>
          </section>
          <section className="hidden print:block">
            <div className="text-xs font-semibold text-slate-500">학생 확인 (인) · 지도교사 확인 (인)</div>
            <div className="mt-1 h-16 rounded border border-dashed border-slate-300" />
          </section>
        </article>
      </div>
    );
  }

  const cur = steps[Math.min(step, steps.length - 1)];
  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1">
          {(["ms", "hs"] as const).map((l) => (
            <button key={l} className={`chip ${level === l ? "chip-on" : ""}`} onClick={() => { setLevel(l); setStep(0); }}>
              {l === "ms" ? "중학 4단계" : "고교 5단계"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="chip"
            onClick={() => {
              if (filled && !confirm("작성 중인 내용을 예시로 바꿀까요?")) return;
              update((s) => {
                const p = Object.fromEntries(Object.entries(s.portfolio).filter(([k]) => !k.startsWith(`act.${level}.`)));
                Object.entries(EXAMPLE[level]).forEach(([k, v]) => (p[`act.${level}.${k}`] = v));
                return { ...s, portfolio: p };
              });
            }}
          >
            예시 불러오기
          </button>
          <button
            className="chip"
            onClick={() =>
              confirm("이 포트폴리오를 비울까요?") &&
              update((s) => ({ ...s, portfolio: Object.fromEntries(Object.entries(s.portfolio).filter(([k]) => !k.startsWith(`act.${level}.`))) }))
            }
          >
            초기화
          </button>
          <span className="text-xs text-slate-500">작성 {filled}/{total}</span>
        </div>
      </div>
      <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
        {steps.map((s, i) => (
          <button key={s.t} onClick={() => setStep(i)} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${i === step ? "bg-brand-600 text-white" : s.fields.every((f) => val(f.k).trim()) ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            {s.t}
          </button>
        ))}
        <button onClick={() => setStep(steps.length)} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${step === steps.length ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"}`}>
          자기 평가
        </button>
      </div>
      {step === steps.length ? (
        <div className="mt-4">
          <h2 className="text-lg font-bold">자기 평가 <span className="text-sm font-normal text-slate-500">{level === "hs" ? "7가지 학습 성과" : "6가지 목표"}</span></h2>
          <ul className="mt-3 space-y-2">
            {SELF.map((g, i) => (
              <li key={g} className="rounded-xl border border-slate-200 p-3">
                <div className="text-sm font-semibold">{g}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {SC.map((s) => (
                    <button key={s} aria-pressed={val(`self${i}`) === s} className={`chip ${val(`self${i}`) === s ? "chip-on" : ""}`} onClick={() => set(`self${i}`, s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <button className="btn-ghost" onClick={() => setStep(steps.length - 1)}>← 이전</button>
            <button className="btn-primary" onClick={() => setPreview(true)}>작성 완료! 제출용 보기 ✨</button>
          </div>
        </div>
      ) : (
      <>
      <h2 className="mt-4 text-lg font-bold">{cur.t} <span className="text-sm font-normal text-slate-500">{cur.sub}</span></h2>
      <div className="mt-3 space-y-3">
        {cur.fields.map((f) => (
          <div key={f.k}>
            <label className="label" htmlFor={key(f.k)}>{f.label}</label>
            {f.long ? (
              <textarea id={key(f.k)} className="input min-h-[96px]" placeholder={f.hint} value={val(f.k)} onChange={(e) => set(f.k, e.target.value)} maxLength={1500} />
            ) : (
              <input id={key(f.k)} className="input" placeholder={f.hint} value={val(f.k)} onChange={(e) => set(f.k, e.target.value)} maxLength={120} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-between gap-2">
        <button className="btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>← 이전</button>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => setPreview(true)}>📄 제출용 보기</button>
          <button className="btn-primary" onClick={() => setStep(step + 1)}>다음 →</button>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

function Design() {
  const { state, update } = useStore();
  const a = analyze(state.credits.plan, state.credits.track);
  const val = (k: string) => state.portfolio[`design.${k}`] ?? "";
  const set = (k: string, v: string) => update((s) => ({ ...s, portfolio: { ...s.portfolio, [`design.${k}`]: v } }));
  const majors = state.favMajors.map((id) => MAJOR_MAP[id]).filter(Boolean);
  const jobs = state.favorites.map((id) => JOB_MAP[id]).filter(Boolean);
  const hasPlan = Object.values(state.credits.plan).flat().length > 0;

  return (
    <article className="card space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-2 border-b-2 border-slate-900 pb-2">
        <div>
          <div className="text-xs font-bold text-brand-600">3개년 진로·학업 설계서</div>
          <h2 className="text-xl font-extrabold">{state.profile.name || "이름"} · {state.profile.school || "학교"}</h2>
        </div>
        <button className="btn-primary no-print" onClick={() => window.print()}>🖨️ 인쇄 / PDF</button>
      </header>
      <section className="grid gap-3 sm:grid-cols-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">희망 계열</div><b>{state.credits.track ? TRACKS[state.credits.track].name : "-"}</b></div>
        <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">희망 학과</div><b>{majors.map((m) => m.name).join(", ") || "-"}</b></div>
        <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">희망 직업</div><b>{jobs.map((j) => j.name).join(", ") || "-"}</b></div>
      </section>
      {state.hypothesis && <p className="rounded-xl bg-brand-50 p-3 text-sm">✍️ {state.hypothesis}</p>}
      <section>
        <div className="flex items-center justify-between">
          <h3 className="font-bold">학기별 이수 계획 · 총 {a.total + 18}/192학점</h3>
          <Link href="/credits" className="no-print text-sm font-semibold text-brand-600">설계 수정 →</Link>
        </div>
        {hasPlan ? (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {SEMS.map((sem) => (
              <div key={sem} className="rounded-xl border border-slate-200 p-2.5 text-sm">
                <div className="text-xs font-bold text-slate-500">{SEM_LABEL[sem]} · {a.semTotals[sem]}학점</div>
                <div className="mt-0.5">{state.credits.plan[sem].map((e) => { const p = parseEntry(e); return `${p.name}(${p.credits})`; }).join(", ") || "-"}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">아직 과목 설계가 없어요. <Link href="/credits" className="text-brand-600 underline">192학점 설계</Link>에서 과목을 담으면 자동으로 채워져요.</p>
        )}
      </section>
      <section className="space-y-3">
        {[
          ["y1", "1학년: 공통과목을 배우며 세운 진로 가설과 2학년 과목 선택 이유"],
          ["y2", "2학년: 선택과목을 통해 깊이 탐구하고 싶은 주제"],
          ["y3", "3학년: 진로를 위해 마무리할 과목과 활동"],
          ["planb", "Plan B: 진로가 바뀐다면 어떤 과목·경로로 전환할까요?"],
        ].map(([k, l]) => (
          <div key={k}>
            <label className="label" htmlFor={`d-${k}`}>{l}</label>
            <textarea id={`d-${k}`} className="input min-h-[80px] print:border-0 print:p-0" value={val(k)} onChange={(e) => set(k, e.target.value)} maxLength={1000} />
          </div>
        ))}
      </section>
      <section>
        <h3 className="font-bold">진단 요약</h3>
        <ul className="mt-1 space-y-0.5 text-xs">
          {a.checks.map((c) => <li key={c.text} className={c.level === "warn" ? "text-amber-700" : c.level === "ok" ? "text-emerald-700" : "text-slate-500"}>{c.level === "ok" ? "✓" : c.level === "warn" ? "⚠" : "ℹ"} {c.text}</li>)}
        </ul>
      </section>
    </article>
  );
}

function Reading() {
  const { state, update } = useStore();
  const empty = (): Book => ({ id: uid(), date: new Date().toISOString().slice(0, 10), title: "", author: "", why: "", quote: "", thought: "", link: "", next: "" });
  const [draft, setDraft] = useState<Book | null>(null);
  const F: [keyof Book, string, string, boolean][] = [
    ["why", "이 책을 고른 이유", "진로·수업과 어떤 관련이 있나요?", true],
    ["quote", "기억에 남는 문장", "", false],
    ["thought", "생각과 느낌", "새롭게 알게 된 점, 생각이 바뀐 점", true],
    ["link", "진로·교과와의 연결", "예) 생명과학 ‘유전’ 단원, 희망 학과 생명공학과", false],
    ["next", "더 읽거나 탐구할 것", "", false],
  ];
  if (draft) {
    return (
      <form
        className="card space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.title.trim()) return;
          update((s) => ({ ...s, books: s.books.some((b) => b.id === draft.id) ? s.books.map((b) => (b.id === draft.id ? draft : b)) : [draft, ...s.books] }));
          setDraft(null);
        }}
      >
        <h2 className="font-bold">진로 연계 독서 기록</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="bt">책 제목 *</label>
            <input id="bt" className="input" required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength={80} />
          </div>
          <div>
            <label className="label" htmlFor="ba">지은이</label>
            <input id="ba" className="input" value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} maxLength={40} />
          </div>
        </div>
        {F.map(([k, l, h, long]) => (
          <div key={k}>
            <label className="label" htmlFor={`b-${k}`}>{l}</label>
            {long ? (
              <textarea id={`b-${k}`} className="input min-h-[80px]" placeholder={h} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} maxLength={1000} />
            ) : (
              <input id={`b-${k}`} className="input" placeholder={h} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} maxLength={200} />
            )}
          </div>
        ))}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={() => setDraft(null)}>취소</button>
          <button className="btn-primary">저장</button>
        </div>
      </form>
    );
  }
  return (
    <div>
      <div className="no-print mb-4 flex gap-2">
        <button className="btn-primary" onClick={() => setDraft(empty())}>+ 책 기록하기</button>
        {state.books.length > 0 && <button className="btn-ghost" onClick={() => window.print()}>🖨️ 인쇄 / PDF</button>}
      </div>
      {state.books.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">한 권의 책에서 진로를 넓혀 보세요. 고른 이유, 기억에 남는 문장, 생각의 변화, 진로·교과와의 연결을 기록해요.</p>
      ) : (
        <ul className="space-y-3">
          {state.books.map((b) => (
            <li key={b.id} className="card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold">📖 {b.title} <span className="text-sm font-normal text-slate-500">{b.author}</span></div>
                  <div className="text-xs text-slate-400">{b.date}</div>
                </div>
                <div className="no-print flex gap-2 text-xs">
                  <button className="text-slate-500 hover:text-brand-600" onClick={() => setDraft(b)}>수정</button>
                  <button className="text-slate-400 hover:text-rose-500" onClick={() => confirm("이 기록을 삭제할까요?") && update((s) => ({ ...s, books: s.books.filter((x) => x.id !== b.id) }))}>삭제</button>
                </div>
              </div>
              <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                {F.filter(([k]) => b[k]).map(([k, l]) => (
                  <div key={k} className="rounded-lg bg-slate-50 p-2.5">
                    <dt className="text-[11px] font-bold text-slate-500">{l}</dt>
                    <dd className="whitespace-pre-wrap">{b[k]}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
