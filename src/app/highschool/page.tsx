"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { HS_QUIZ, HS_TYPES } from "@/data/highschools";
import { JOB_MAP, type HsTypeId } from "@/data/jobs";
import { ADMISSION_RULES, ADMISSION_SCHEDULE, dday, GN_SCHOOLS, KIND_INFO, OFFICIAL, parsePeriod, scheduleToIcs, ZONES } from "@/data/gn";
import { ArrowLeftRight, CalendarPlus, Star } from "lucide-react";
import Link from "next/link";
import { hsQuizResult } from "@/lib/match";
import { NextStep, PageHead } from "@/components/ui";
import { EnglishHighschool } from "@/components/English";

export default function HighschoolPage() {
  const { state, update, ready } = useStore();
  const [compare, setCompare] = useState<HsTypeId[]>(["general", "vocational"]);
  const [roundF, setRoundF] = useState<"전체" | "전기" | "후기">("전체");
  const [openType, setOpenType] = useState<HsTypeId | null>(null);
  const favJobs = state.favorites.map((id) => JOB_MAP[id]).filter(Boolean);
  const answered = Object.keys(state.hsQuiz).length;
  const quizDone = answered === HS_QUIZ.length;
  const result = hsQuizResult(state.hsQuiz, favJobs);

  if (!ready) return <div className="h-64" />;

  const toggleInterest = (id: HsTypeId) =>
    update((s) => ({ ...s, hsInterest: s.hsInterest.includes(id) ? s.hsInterest.filter((x) => x !== id) : [...s.hsInterest, id] }));
  const toggleCompare = (id: HsTypeId) =>
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? [...c.slice(1), id] : [...c, id]));

  return (
    <div>
      <PageHead tone="emerald" eyebrow="경남 고입"
        step={4}
        title="고교 고르기"
        desc="고등학교 유형마다 배우는 방식과 졸업 후 길이 달라요. 퀴즈로 나에게 맞는 유형을 알아보고, 경남 고입 제도와 일정, 실제 학교까지 확인해 보세요."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr] [&>*]:min-w-0">
        <div className="card">
          <h2 className="font-bold">나에게 맞는 고교 유형 퀴즈</h2>
          <p className="mt-1 text-xs text-slate-500">
            {answered}/{HS_QUIZ.length} 응답{favJobs.length > 0 && " · 찜한 직업도 함께 반영돼요"}
          </p>
          <div className="mt-4 space-y-4">
            {HS_QUIZ.map((q, qi) => (
              <div key={q.q}>
                <div className="mb-2 text-sm font-semibold">
                  {qi + 1}. {q.q}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {q.options.map((o, oi) => {
                    const on = state.hsQuiz[qi] === oi;
                    return (
                      <button
                        key={o.label}
                        aria-pressed={on}
                        className={`chip px-3 py-1.5 text-[13px] ${on ? "chip-on" : ""}`}
                        onClick={() => update((s) => ({ ...s, hsQuiz: { ...s.hsQuiz, [qi]: oi } }))}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-bold">비교해 볼 만한 유형</h2>
          {answered === 0 && favJobs.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">퀴즈에 답하면 결과가 여기에 나타나요.</p>
          ) : (
            <>
              {!quizDone && <p className="mt-1 text-xs text-amber-600">퀴즈를 끝까지 하면 더 정확해져요.</p>}
              <ul className="mt-3 space-y-2.5">
                {result.slice(0, 5).map(({ type, pct }, i) => (
                  <li key={type.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className={i === 0 ? "font-extrabold text-slate-900" : "font-semibold text-slate-700"}>
                        {type.emoji} {type.name}
                      </span>
                      <span className="text-xs text-slate-500">{pct}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${i === 0 ? "bg-brand-500" : "bg-brand-200"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
                점수는 &lsquo;합격 가능성&rsquo;이 아니라 내 응답과 각 학교 유형의 특징이 얼마나 비슷한지를 나타내요. 최종 선택은 보호자,
                선생님과 꼭 상의하세요.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mb-3 mt-10 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold">고교 유형별 심층 분석</h2>
          <p className="text-sm text-slate-500">관심 표시(별) · 비교 담기(최대 3개) · 자세히 보기로 특장점과 유의사항을 확인하세요.</p>
        </div>
        <div className="flex gap-1.5">
          {(["전체", "전기", "후기"] as const).map((r) => (
            <button key={r} aria-pressed={roundF === r} className={`chip px-3 py-1.5 ${roundF === r ? "chip-on" : ""}`} onClick={() => setRoundF(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {HS_TYPES.filter((h) => roundF === "전체" || h.round === roundF || (roundF === "전기" && h.round === "별도")).map((h) => {
          const interested = state.hsInterest.includes(h.id);
          const inCompare = compare.includes(h.id);
          const open = openType === h.id;
          return (
            <div key={h.id} id={h.id} className={`card scroll-mt-20 ${interested ? "border-sun-400" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-lg font-bold">{h.name}</div>
                  <span className="chip mt-1">{h.round === "별도" ? "별도 일정(가장 빠름)" : `${h.round} 지원`}</span>
                </div>
                <div className="flex gap-1.5">
                  <button aria-pressed={interested} aria-label="관심 표시" onClick={() => toggleInterest(h.id)} className={`grid h-9 w-9 place-items-center rounded-full border ${interested ? "border-sun-400 bg-sun-100" : "border-slate-200"}`}>
                    <Star className={`h-4 w-4 ${interested ? "fill-sun-400 text-sun-500" : "text-slate-400"}`} />
                  </button>
                  <button aria-pressed={inCompare} aria-label="비교 담기" onClick={() => toggleCompare(h.id)} className={`grid h-9 w-9 place-items-center rounded-full border ${inCompare ? "border-brand-400 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-400"}`}>
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-700">{h.oneLine}</p>
              <div className="mt-3 text-xs font-semibold text-slate-500">이런 학생에게 잘 맞아요</div>
              <ul className="mt-1 space-y-0.5 text-sm text-slate-600">
                {h.goodFor.map((g) => (
                  <li key={g}>• {g}</li>
                ))}
              </ul>
              {open && (
                <dl className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
                  {h.features && (
                    <div>
                      <dt className="font-semibold">주요 특장점</dt>
                      <dd className="mt-1 grid gap-1 sm:grid-cols-2">
                        {h.features.map((f) => (
                          <span key={f} className="rounded-lg bg-slate-50 px-2 py-1">✓ {f}</span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {h.student && <div><dt className="font-semibold">추천 학생상</dt><dd className="text-slate-700">{h.student}</dd></div>}
                  {h.signature && <div><dt className="font-semibold">시그니처 교육과정</dt><dd className="text-slate-700">{h.signature}</dd></div>}
                  {h.strategy && <div><dt className="font-semibold">대입·진로 전략</dt><dd className="text-slate-700">{h.strategy}</dd></div>}
                  {h.caution && <div className="rounded-xl bg-sun-100/70 p-3"><dt className="font-semibold text-amber-900">지원 전 유의사항</dt><dd className="text-amber-900">{h.caution}</dd></div>}
                  <div><dt className="font-semibold">입학 방법 · 졸업 후</dt><dd className="text-slate-700">{h.admission} {h.afterGrad}</dd></div>
                </dl>
              )}
              <button className="mt-3 text-sm font-semibold text-brand-700" aria-expanded={open} onClick={() => setOpenType(open ? null : h.id)}>
                {open ? "접기" : "심층 분석 자세히 보기"}
              </button>
              {favJobs.some((j) => j.hsTypes.includes(h.id)) && (
                <div className="mt-3 rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs text-brand-800">
                  찜한 직업 연결:{" "}
                  {favJobs
                    .filter((j) => j.hsTypes.includes(h.id))
                    .map((j) => j.name)
                    .join(", ")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <section className="card mt-6">
        <h2 className="text-lg font-bold">실패 없는 고등학교 선택 3단계</h2>
        <ol className="mt-3 grid gap-3 md:grid-cols-3">
          {[
            { t: "1. 나의 적성·진로 분석", d: "흥미 탐색과 공식 진로검사로 나를 알고, 위 퀴즈로 맞는 학교 유형을 좁혀요.", href: "/discover", cta: "나 알기" },
            { t: "2. 학교별 교육과정 확인", d: "관심 학교의 편제표(개설 과목)와 학과, 특색 과정을 비교해요. 학교 누리집·고입정보포털에서 확인할 수 있어요.", href: "/schools", cta: "경남 고교 찾기" },
            { t: "3. 통학 거리와 생활 점검", d: "매일 다니는 길이에요. 편도 40~50분이 넘으면 피로가 쌓이기 쉬워요. 기숙사·통학버스 여부도 확인하세요.", href: "/schools", cta: "거리·길찾기" },
          ].map((s) => (
            <li key={s.t} className="rounded-2xl bg-slate-50 p-4">
              <div className="font-semibold">{s.t}</div>
              <p className="mt-1 text-sm text-slate-600">{s.d}</p>
              <Link href={s.href} className="mt-2 inline-block text-sm font-semibold text-brand-700">{s.cta} →</Link>
            </li>
          ))}
        </ol>
      </section>

      {compare.length > 0 && (
        <div className="card mt-6 overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="p-4 text-left font-bold">나란히 비교</caption>
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50">
                <th className="w-28 p-3 text-xs text-slate-500">항목</th>
                {compare.map((id) => {
                  const h = HS_TYPES.find((x) => x.id === id)!;
                  return (
                    <th key={id} className="p-3">
                      {h.emoji} {h.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["배우는 방식", "curriculum"],
                  ["입학 방법", "admission"],
                  ["졸업 후", "afterGrad"],
                ] as const
              ).map(([label, key]) => (
                <tr key={key} className="border-b border-slate-100 align-top">
                  <th className="p-3 text-xs text-slate-500">{label}</th>
                  {compare.map((id) => (
                    <td key={id} className="p-3 text-slate-700">
                      {HS_TYPES.find((x) => x.id === id)![key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="align-top">
                <th className="p-3 text-xs text-slate-500">꼭 확인할 것</th>
                {compare.map((id) => (
                  <td key={id} className="p-3 text-slate-700">
                    <ul className="space-y-0.5">
                      {HS_TYPES.find((x) => x.id === id)!.consider.map((c) => (
                        <li key={c}>• {c}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <GnAdmission />

      <EnglishHighschool />
      <NextStep href="/plan" label="계획·기록" hint="이제 학기별로 할 일을 정하고 실천해 봐요" />
    </div>
  );
}

function GnAdmission() {
  const count = (z: string) => GN_SCHOOLS.filter((s) => s.zone === z).length;
  const kinds = (["science", "foreign", "arts", "sports", "meister", "vocational", "alternative"] as const).map((k) => ({ k, n: GN_SCHOOLS.filter((s) => s.kind === k).length }));
  return (
    <section id="gn" className="mt-10 scroll-mt-20 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="text-xs font-bold text-brand-600">경상남도 고입 안내</div>
          <h2 className="text-2xl font-extrabold">2027학년도 경남 고등학교 입학전형</h2>
        </div>
        <Link href="/schools" className="btn-primary">🗺️ 경남 고교 지도에서 찾기</Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {ADMISSION_RULES.map((r) => (
          <div key={r.t} className="card p-4">
            <div className="font-bold">{r.t}</div>
            <p className="mt-1 text-sm text-slate-600">{r.d}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[520px] text-left text-sm">
          <caption className="p-4 text-left font-bold">평준화지역 5개 학군 (교육감 전형)</caption>
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="p-3">학군</th>
              <th className="p-3">지역</th>
              <th className="p-3">학교 수</th>
            </tr>
          </thead>
          <tbody>
            {ZONES.map((z) => (
              <tr key={z.id} className="border-t border-slate-100">
                <td className="p-3 font-semibold">{z.id.replace("평준화 ", "")}</td>
                <td className="p-3">{z.area} {z.note && <span className="text-xs text-slate-400">{z.note}</span>}</td>
                <td className="p-3">{count(z.id)}개교</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-4 pb-4 text-xs text-slate-500">
          이 밖에 평준화지역 안의 학교장 전형 학교 {count("평준화지역 학교장전형")}곳과 비평준화지역 일반고 {count("비평준화")}곳은 학교장이 직접 선발해요.
        </p>
      </div>

      <div className="card">
        <div className="font-bold">경남의 특수목적고·특성화고</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {kinds.map(({ k, n }) => (
            <Link key={k} href="/schools" className="chip px-3 py-1.5 text-sm">
              {KIND_INFO[k].emoji} {KIND_INFO[k].name} {n}곳
            </Link>
          ))}
        </div>
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          {GN_SCHOOLS.filter((s) => ["science", "foreign", "arts", "sports", "meister"].includes(s.kind)).map((s) => (
            <li key={s.id}>
              <span className="font-semibold">{s.name}</span> <span className="text-xs text-slate-400">· {s.region} · {KIND_INFO[s.kind].name} · {s.round}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-bold">2027학년도 전형 일정</div>
          <button
            className="btn-ghost py-1.5"
            onClick={() => {
              const a = document.createElement("a");
              a.href = URL.createObjectURL(new Blob([scheduleToIcs()], { type: "text/calendar;charset=utf-8" }));
              a.download = "경남-고입-일정-2027.ics";
              a.click();
              URL.revokeObjectURL(a.href);
            }}
          >
            <CalendarPlus className="h-4 w-4" aria-hidden /> 내 캘린더에 추가 (.ics)
          </button>
        </div>
        <ol className="mt-3 space-y-2">
          {ADMISSION_SCHEDULE.map((x) => {
            const per = parsePeriod(x.apply);
            const dd = per ? dday(per.start) : null;
            const over = per ? per.end < new Date() : false;
            return (
              <li key={x.who} className={`grid gap-1 rounded-xl border border-slate-100 p-3 text-sm sm:grid-cols-[60px_1fr_auto_72px] sm:items-center ${over ? "bg-slate-50 text-slate-500 grayscale" : ""}`}>
                <span className={`w-fit rounded px-1.5 py-0.5 text-[11px] font-bold text-white ${x.round === "전기" ? "bg-emerald-700" : x.round === "후기" ? "bg-brand-600" : "bg-slate-500"}`}>{x.round}</span>
                <span className="font-semibold">{x.who}</span>
                <span className="text-xs text-slate-500">원서 {x.apply} · 발표 {x.result}</span>
                <span className={`w-fit rounded-lg px-2 py-0.5 text-xs font-bold sm:justify-self-end ${over ? "bg-slate-100 text-slate-500" : dd !== null && dd <= 0 ? "bg-sun-100 text-amber-800" : "bg-brand-50 text-brand-700"}`}>
                  {over ? "마감" : dd !== null && dd <= 0 ? "접수 중" : `D-${dd}`}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-xs text-slate-400">
          일정은 바뀔 수 있어요. 학교별 세부 일정은 해당 학교 누리집에서 확인하세요.{" "}
          <a className="underline" href={OFFICIAL.gneSchedule.url} target="_blank" rel="noreferrer">경남교육청 공식 일정 ↗</a>
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {[OFFICIAL.gneHigh, OFFICIAL.gneEqual, OFFICIAL.hischool, OFFICIAL.hifive].map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold hover:border-brand-300">
            {l.name} ↗
          </a>
        ))}
      </div>
    </section>
  );
}
