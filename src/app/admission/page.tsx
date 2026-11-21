"use client";

import { useState } from "react";
import Link from "next/link";
import { SEMS, uid, useStore, type Sem } from "@/lib/store";
import { SEM_LABEL } from "@/lib/credits";
import { GRADE5, SUNEUNG_2028 } from "@/data/subjects";
import { OFFICIAL } from "@/data/gn";
import { PageHead } from "@/components/ui";
import { NaesinSimulator } from "@/components/Naesin";

const CHANGES = [
  { t: "통합형 수능", d: "국어·수학 선택과목이 없어지고 모든 수험생이 같은 과목으로 시험을 봐요. 사회·과학탐구는 문·이과 구분 없이 통합사회와 통합과학을 모두 응시해요." },
  { t: "내신 5등급제", d: "9등급에서 5등급으로 바뀌어 1등급이 상위 10%까지 넓어졌어요. 등급만으로는 차이가 덜 드러나 과목 이수 내용과 세부능력 및 특기사항(세특) 기록이 더 중요해져요." },
  { t: "과목 선택의 중요성", d: "고교학점제로 학생마다 듣는 과목이 달라요. 대학은 지원 학과와 관련된 과목을 들었는지, 그 과목에서 무엇을 배우고 탐구했는지를 살펴봐요." },
];

const TYPES = [
  { t: "학생부교과전형", w: "수시", d: "교과 성적(내신) 중심. 일부 대학은 서류 정성평가나 수능 최저학력기준을 함께 적용해요.", fit: "내신 관리를 꾸준히 해 온 학생" },
  { t: "학생부종합전형", w: "수시", d: "학교생활기록부 전체(교과 이수·세특·창체·행동특성)를 종합적으로 평가하고, 면접을 보기도 해요.", fit: "진로와 연계된 과목 선택·탐구 경험이 풍부한 학생" },
  { t: "논술전형", w: "수시", d: "대학별 논술고사 성적 중심. 수능 최저기준이 있는 경우가 많아요.", fit: "글쓰기·논리적 사고에 강한 학생" },
  { t: "실기·실적 위주 전형", w: "수시", d: "예체능 실기나 특기 실적을 중심으로 평가해요.", fit: "예체능·특기 분야 학생" },
  { t: "수능위주전형", w: "정시", d: "수능 성적 중심. 일부 대학은 학생부 교과·서류를 함께 반영해요.", fit: "수능 준비를 끝까지 하는 학생" },
];

const TIMELINE = [
  { g: "고1", items: ["공통과목 기초 다지기 (수능 사회·과학 범위는 1학년 통합사회·통합과학)", "진로 가설 세우고 2학년 과목 선택", "동아리·독서 등 관심 분야 활동 시작"] },
  { g: "고2", items: ["선택과목 수업 속 탐구로 세특 쌓기", "희망 학과 권장과목 확인 후 3학년 과목 확정", "모의고사로 수능 준비 상태 점검"] },
  { g: "고3", items: ["1학기까지 학생부 마무리 (수시 반영)", "9월 수시 원서 접수 (최대 6회)", "11월 수능 → 12월~1월 정시 원서 접수"] },
];

function gradeFromRank(rank: number, ties: number, total: number) {
  if (!rank || !total || rank > total) return null;
  const pct = ((rank + (Math.max(1, ties) - 1) / 2) / total) * 100;
  const g = GRADE5.find((x) => pct <= x.cum)?.g ?? 5;
  return { pct, g };
}

export default function AdmissionPage() {
  return (
    <div className="space-y-8">
      <PageHead title="2028 대입" desc="2025년 고1부터 적용되는 2028학년도 대입 제도의 핵심을 정리했어요. 수능 구조, 5등급 내신, 전형 종류와 학년별 준비를 확인하고 내신을 직접 계산해 보세요." />

      <section className="grid gap-3 md:grid-cols-3">
        {CHANGES.map((c, i) => (
          <div key={c.t} className="card">
            <div className="text-xs font-bold text-brand-600">변화 {i + 1}</div>
            <div className="text-lg font-extrabold">{c.t}</div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.d}</p>
          </div>
        ))}
      </section>

      <section className="card overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-left text-sm">
          <caption className="p-4 text-left text-lg font-bold">2028 수능 영역별 출제 과목</caption>
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="p-3">영역</th>
              <th className="p-3">출제 과목</th>
              <th className="p-3">비고</th>
            </tr>
          </thead>
          <tbody>
            {SUNEUNG_2028.map((r) => (
              <tr key={r.area} className="border-t border-slate-100">
                <td className="p-3 font-semibold">{r.area}</td>
                <td className="p-3">{r.subjects}</td>
                <td className="p-3 text-slate-500">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-4 pb-4 text-xs text-slate-400">
          출처: 교육부 2028 대입제도 개편 확정안(2023.12.). 예시 문항과 세부 사항은{" "}
          <a className="underline" href={OFFICIAL.suneung.url} target="_blank" rel="noreferrer">한국교육과정평가원</a>에서 확인하세요.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">실시간 5등급 내신 시뮬레이터</h2>
        <NaesinSimulator />
      </section>

      <Calculator />

      <section>
        <h2 className="mb-3 text-lg font-bold">대입 전형 한눈에 보기</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {TYPES.map((t) => (
            <div key={t.t} className="card">
              <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold text-white ${t.w === "수시" ? "bg-brand-600" : "bg-emerald-600"}`}>{t.w}</span>
              <div className="mt-1 font-bold">{t.t}</div>
              <p className="mt-1 text-sm text-slate-600">{t.d}</p>
              <p className="mt-2 text-xs text-slate-500">👍 {t.fit}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">학년별 대입 준비</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {TIMELINE.map((t) => (
            <div key={t.g} className="card">
              <div className="text-xl font-extrabold text-brand-700">{t.g}</div>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-700">{t.items.map((i) => <li key={i}>✓ {i}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="card">
          <h2 className="font-bold">대학별 권장과목 확인하기</h2>
          <p className="mt-1 text-sm text-slate-600">
            주요 대학들은 학과별 핵심·권장 과목을 발표하고 있어요. 마이로드의 학과 백과에서 일반적인 권장과목을 보고, 지원할 대학의 실제 발표 자료로 꼭 확인하세요.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/majors" className="btn-primary">학과별 권장과목</Link>
            <a className="btn-ghost" href={OFFICIAL.adiga.url} target="_blank" rel="noreferrer">어디가 ↗</a>
          </div>
        </div>
        <div className="card">
          <h2 className="font-bold">대입 상담 받기</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            <li>
              <b>학교 진로전담교사·담임 선생님</b> — 학교생활기록부와 과목 선택을 가장 잘 아는 분이에요.
            </li>
            <li>
              <b>경상남도교육청 대입정보센터</b> — 현직 교사 진학지도단의 1:1 대입 상담. 신청 방법은{" "}
              <a className="text-brand-600 underline" href={OFFICIAL.gne.url} target="_blank" rel="noreferrer">경남교육청 누리집</a> 공지를 확인하세요.
            </li>
            <li>
              <b>대학입학상담센터 1600-1615</b> — 한국대학교육협의회 무료 전화·온라인 상담 (
              <a className="text-brand-600 underline" href={OFFICIAL.adiga.url} target="_blank" rel="noreferrer">어디가</a>)
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function Calculator() {
  const { state, update, ready } = useStore();
  const [sem, setSem] = useState<Sem>("1-1");
  const [subject, setSubject] = useState("");
  const [credits, setCredits] = useState(4);
  const [grade, setGrade] = useState(1);
  const [rank, setRank] = useState({ r: "", t: "", total: "" });
  const rows = state.grades;
  const avg = (rs: typeof rows) => {
    const c = rs.reduce((s, r) => s + r.credits, 0);
    return c ? rs.reduce((s, r) => s + r.credits * r.grade, 0) / c : null;
  };
  const all = avg(rows);
  const conv = gradeFromRank(Number(rank.r), Number(rank.t || 1), Number(rank.total));

  return (
    <section id="calc" className="scroll-mt-20">
      <h2 className="mb-3 text-lg font-bold">5등급 내신 계산기</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_0.6fr] [&>*]:min-w-0">
        <div className="card">
          <form
            className="grid gap-2 sm:grid-cols-[auto_1fr_auto_auto_auto]"
            onSubmit={(e) => {
              e.preventDefault();
              if (!subject.trim()) return;
              update((s) => ({ ...s, grades: [...s.grades, { id: uid(), sem, subject: subject.trim(), credits, grade, ach: "" }] }));
              setSubject("");
            }}
          >
            <select className="input" value={sem} onChange={(e) => setSem(e.target.value as Sem)} aria-label="학기">
              {SEMS.map((s) => <option key={s} value={s}>{SEM_LABEL[s]}</option>)}
            </select>
            <input className="input" placeholder="과목명" value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="과목명" maxLength={30} />
            <select className="input" value={credits} onChange={(e) => setCredits(Number(e.target.value))} aria-label="학점">
              {[1, 2, 3, 4, 5].map((c) => <option key={c} value={c}>{c}학점</option>)}
            </select>
            <select className="input" value={grade} onChange={(e) => setGrade(Number(e.target.value))} aria-label="등급">
              {[1, 2, 3, 4, 5].map((g) => <option key={g} value={g}>{g}등급</option>)}
            </select>
            <button className="btn-primary">추가</button>
          </form>
          {ready && rows.length > 0 ? (
            <div className="mt-4 space-y-3">
              {SEMS.filter((s) => rows.some((r) => r.sem === s)).map((s) => {
                const rs = rows.filter((r) => r.sem === s);
                return (
                  <div key={s}>
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>{SEM_LABEL[s]}</span>
                      <span>평균 {avg(rs)?.toFixed(2)}등급</span>
                    </div>
                    <ul className="mt-1 divide-y divide-slate-100 rounded-xl border border-slate-100">
                      {rs.map((r) => (
                        <li key={r.id} className="flex items-center gap-2 px-3 py-1.5 text-sm">
                          <span className="flex-1">{r.subject}</span>
                          <span className="text-slate-500">{r.credits}학점</span>
                          <span className="w-12 text-right font-bold">{r.grade}등급</span>
                          <button className="text-xs text-slate-300 hover:text-rose-500" aria-label={`${r.subject} 삭제`} onClick={() => update((st) => ({ ...st, grades: st.grades.filter((x) => x.id !== r.id) }))}>✕</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">석차등급이 나오는 과목의 학점과 등급을 입력하면 학점 가중 평균을 계산해요. (성취도만 기록되는 과목은 제외)</p>
          )}
        </div>
        <div className="space-y-3">
          <div className="card text-center">
            <div className="text-xs font-semibold text-slate-500">전체 학점 가중 평균</div>
            <div className="text-4xl font-extrabold text-brand-700">{all ? all.toFixed(2) : "-"}</div>
            <div className="text-xs text-slate-500">등급 · {rows.reduce((s, r) => s + r.credits, 0)}학점</div>
          </div>
          <div className="card">
            <div className="text-xs font-semibold text-slate-500">석차로 등급 알아보기</div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              <input className="input px-2" inputMode="numeric" placeholder="석차" value={rank.r} onChange={(e) => setRank({ ...rank, r: e.target.value.replace(/\D/g, "") })} aria-label="석차" />
              <input className="input px-2" inputMode="numeric" placeholder="동석차" value={rank.t} onChange={(e) => setRank({ ...rank, t: e.target.value.replace(/\D/g, "") })} aria-label="동석차 인원" />
              <input className="input px-2" inputMode="numeric" placeholder="수강자" value={rank.total} onChange={(e) => setRank({ ...rank, total: e.target.value.replace(/\D/g, "") })} aria-label="수강자 수" />
            </div>
            {conv && (
              <p className="mt-2 text-sm">
                상위 <b>{conv.pct.toFixed(1)}%</b> → <b className="text-brand-700">{conv.g}등급</b>
              </p>
            )}
            <p className="mt-2 text-[11px] text-slate-400">석차백분율 = (석차 + (동석차 인원 − 1) ÷ 2) ÷ 수강자 수 × 100. 학교 산출 방식과 다를 수 있어요.</p>
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">대학마다 내신 반영 방법(반영 과목·학년별 비율·성취도 활용)이 달라요. 이 평균은 참고용이에요.</p>
    </section>
  );
}
