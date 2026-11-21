"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Monitor, Clock, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { RIASEC, RIASEC_ORDER, type RiasecKey } from "@/data/riasec";
import { isTestComplete, riasecScores, topTypes } from "@/lib/match";
import { CAREERNET_TESTS, COUNSEL_CHANNELS, WORK24_TESTS } from "@/data/tests";
import { PageHead } from "@/components/ui";

type Tab = "tests" | "compare" | "counsel";

export default function TestsPage() {
  const { state, update, ready } = useStore();
  const [tab, setTab] = useState<Tab>("tests");
  const [area, setArea] = useState("전체");
  const official = (state.portfolio["official.holland"] ?? "") as string;
  const mine = isTestComplete(state.answers) ? topTypes(riasecScores(state.answers)) : null;
  const off = official.split("").filter((c): c is RiasecKey => RIASEC_ORDER.includes(c as RiasecKey)).slice(0, 2);
  const match = mine && off.length === 2 ? mine.filter((k) => off.includes(k)).length : null;
  const areas = ["전체", ...new Set([...CAREERNET_TESTS, ...WORK24_TESTS].map((t) => t.area))];

  return (
    <div>
      <PageHead title="진로검사·진로상담" desc="국가 진로정보망 커리어넷(7종)과 고용24(13종)의 무료 진로심리검사 20종을 안내하고, 결과를 마이로드와 연결해요. 1:1 상담 창구도 한곳에 모았어요." />
      <div className="mb-6 grid grid-cols-3 gap-1 rounded-xl bg-slate-200/60 p-1" role="tablist">
        {(
          [
            ["tests", "진로검사 20종"],
            ["compare", "결과 연결하기"],
            ["counsel", "1:1 진로상담"],
          ] as const
        ).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-lg py-2 text-sm font-semibold ${tab === k ? "bg-white shadow-sm" : "text-slate-500"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "tests" && (
        <div className="space-y-8">
          <div className="flex flex-wrap gap-1.5">
            {areas.map((a) => (
              <button key={a} aria-pressed={area === a} className={`chip px-3 py-1.5 ${area === a ? "chip-on" : ""}`} onClick={() => setArea(a)}>
                {a}
              </button>
            ))}
          </div>
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">커리어넷 진로심리검사 7종</h2>
              <span className="text-xs text-slate-500">회원·비회원 무료</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {CAREERNET_TESTS.filter((t) => area === "전체" || t.area === area).map((t) => (
                <div key={t.id} className="card flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold">{t.n}</div>
                    <span className="chip">{t.area}</span>
                  </div>
                  <div className="mt-1 flex gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {t.who}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t.time}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{t.d}</p>
                  <ul className="mt-2 space-y-0.5 text-sm text-slate-600">
                    {t.items.map((i) => (
                      <li key={i}>• {i}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-brand-700">마이로드 활용: {t.use}</p>
                  <a className="btn-primary mt-4 self-start" href={`https://www.career.go.kr/cloud/w/inspect/${t.id}/intro`} target="_blank" rel="noreferrer">
                    검사 소개·바로 응시 <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </section>
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold">고용24 청소년 직업심리검사 13종</h2>
              <a className="btn-ghost py-1.5" href="https://www.work24.go.kr/" target="_blank" rel="noreferrer">
                고용24에서 검사하기 <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="card overflow-x-auto p-0">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="p-3">검사</th>
                    <th className="p-3">영역</th>
                    <th className="p-3">대상</th>
                    <th className="p-3">소요 시간</th>
                    <th className="p-3">비슷한 커리어넷 검사</th>
                  </tr>
                </thead>
                <tbody>
                  {WORK24_TESTS.filter((t) => area === "전체" || t.area === area).map((t) => (
                    <tr key={t.n} className={`border-t border-slate-100 ${t.adult ? "text-slate-500" : ""}`}>
                      <td className="p-3 font-medium">
                        {t.n}
                        {t.pc && (
                          <span className="ml-1 inline-flex items-center gap-0.5 rounded bg-slate-100 px-1 text-[10px] text-slate-600">
                            <Monitor className="h-3 w-3" /> PC 권장
                          </span>
                        )}
                      </td>
                      <td className="p-3">{t.area}</td>
                      <td className="p-3">{t.who}</td>
                      <td className="p-3">{t.time}</td>
                      <td className="p-3 text-xs">{t.similar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-slate-500">
              <li>• 고용24에서 ‘직업심리검사 → 청소년 대상’ 메뉴로 들어가 검사 이름을 찾아 응시해요.</li>
              <li>• 회원으로 응시하면 결과가 저장되고, 비회원은 결과를 일정 기간만 볼 수 있어요.</li>
              <li>• AI 직업선호도검사는 만 18세 이상 대상이라 졸업생·보호자에게 알맞아요.</li>
              <li>• 검사 이름과 구성은 기관 사정에 따라 바뀔 수 있어요.</li>
            </ul>
          </section>
        </div>
      )}

      {tab === "compare" && (
        <section className="card">
          <h2 className="text-lg font-bold">공식 검사 결과와 비교하기</h2>
          <p className="mt-1 text-sm text-slate-600">커리어넷 직업흥미검사(H)나 고용24 청소년 직업흥미검사에서 받은 흥미 코드 상위 2개를 골라 주세요.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {RIASEC_ORDER.map((k) => {
              const on = off.includes(k);
              return (
                <button
                  key={k}
                  aria-pressed={on}
                  className={`chip px-3 py-1.5 text-sm ${on ? "chip-on" : ""}`}
                  onClick={() => {
                    const next = on ? off.filter((x) => x !== k) : off.length < 2 ? [...off, k] : [off[1], k];
                    update((s) => ({ ...s, portfolio: { ...s.portfolio, "official.holland": next.join("") } }));
                  }}
                >
                  {RIASEC[k].name}({k})
                </button>
              );
            })}
          </div>
          {ready && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <div className="text-xs text-slate-500">마이로드 탐색</div>
                <div className="text-2xl font-bold tracking-widest">{mine ? mine.join("") : "—"}</div>
                {!mine && <Link href="/discover" className="text-xs text-brand-700 underline">탐색하러 가기</Link>}
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <div className="text-xs text-slate-500">공식 검사</div>
                <div className="text-2xl font-bold tracking-widest">{off.length ? off.join("") : "—"}</div>
              </div>
              <div className="rounded-xl bg-brand-50 p-3 text-center">
                <div className="text-xs text-slate-500">일치</div>
                <div className="text-lg font-bold text-brand-700">{match === null ? "—" : match === 2 ? "아주 비슷해요" : match === 1 ? "한 가지 겹쳐요" : "서로 달라요"}</div>
              </div>
            </div>
          )}
          {match === 0 && <p className="mt-2 text-sm text-slate-600">결과가 다르다면 두 유형과 관련된 직업을 모두 탐색해 보세요. 흥미는 경험에 따라 달라질 수 있어요.</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/jobs" className="btn-ghost">흥미 유형별 직업 보기</Link>
            <Link href="/plan" className="btn-ghost">검사 결과로 할 일 세우기</Link>
          </div>
        </section>
      )}

      {tab === "counsel" && (
        <section className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {COUNSEL_CHANNELS.map((c) => (
              <div key={c.n} className="card flex flex-col">
                <div className="font-bold">{c.n}</div>
                <p className="mt-1 text-sm text-slate-700">{c.d}</p>
                <p className="mt-1 text-xs text-slate-500">{c.note}</p>
                <a className="btn-ghost mt-4 self-start" href={c.url} target="_blank" rel="noreferrer">
                  바로가기 <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
          <div className="card bg-brand-50">
            <div className="font-bold">가장 가까운 상담 창구는 학교 진로전담교사예요</div>
            <p className="mt-1 text-sm text-slate-700">마이로드 리포트를 인쇄하거나 공유 링크로 보여 드리면 상담이 훨씬 구체적이 돼요.</p>
            <Link href="/report" className="btn-primary mt-3">리포트 준비하기</Link>
          </div>
        </section>
      )}
    </div>
  );
}
