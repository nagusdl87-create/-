"use client";

import { useState } from "react";
import { GRADE5 } from "@/data/subjects";
import { useT } from "@/lib/i18n";

const TYPES = [
  { id: "common", label: "공통과목", rank: true, ach: "AE" },
  { id: "elective", label: "일반·진로선택 (융합선택 국·수·영 등 포함)", rank: true, ach: "AE" },
  { id: "fusion", label: "사회·과학 융합선택 9과목", rank: false, ach: "AE" },
  { id: "abc", label: "체육·예술·과학탐구실험", rank: false, ach: "ABC" },
  { id: "pass", label: "교양", rank: false, ach: "P" },
] as const;

const NINE = [4, 11, 23, 40, 60, 77, 89, 96, 100];

export function grade5(pct: number) {
  return GRADE5.find((g) => pct <= g.cum)?.g ?? 5;
}
export function grade9(pct: number) {
  return NINE.findIndex((c) => pct <= c) + 1 || 9;
}
function achievement(score: number, kind: string) {
  if (kind === "P") return "P (이수)";
  if (kind === "ABC") return score >= 80 ? "A" : score >= 60 ? "B" : "C";
  return score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "E";
}

export function NaesinSimulator() {
  const tr = useT();
  const [type, setType] = useState<(typeof TYPES)[number]["id"]>("elective");
  const [n, setN] = useState(200);
  const [rank, setRank] = useState(21);
  const [ties, setTies] = useState(1);
  const [score, setScore] = useState(88);
  const [avg, setAvg] = useState(68.5);
  const t = TYPES.find((x) => x.id === type)!;
  const r = Math.min(Math.max(1, rank), n);
  const pct = ((r + (Math.max(1, ties) - 1) / 2) / n) * 100;
  const g5 = grade5(pct);
  const g9 = grade9(pct);
  const ach = achievement(score, t.ach);
  const cut = GRADE5.map((g) => ({ g: g.g, last: Math.floor((n * g.cum) / 100) }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr] [&>*]:min-w-0">
      <div className="card space-y-4">
        <div>
          <label className="label" htmlFor="ns-type">{tr("과목 유형")}</label>
          <select id="ns-type" className="input" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            {TYPES.map((x) => (
              <option key={x.id} value={x.id}>
                {tr(x.label)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="ns-n">
            {tr("수강자 수")} <b className="text-slate-900">{tr("{n}명", { n })}</b>
          </label>
          <input id="ns-n" type="range" min={10} max={400} step={5} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-full accent-brand-600" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="ns-rank">{tr("석차")}</label>
            <input id="ns-rank" type="number" min={1} max={n} className="input" value={rank} onChange={(e) => setRank(Number(e.target.value))} disabled={!t.rank} />
          </div>
          <div>
            <label className="label" htmlFor="ns-ties">{tr("동석차 인원")}</label>
            <input id="ns-ties" type="number" min={1} className="input" value={ties} onChange={(e) => setTies(Number(e.target.value))} disabled={!t.rank} />
          </div>
          <div>
            <label className="label" htmlFor="ns-score">{tr("원점수")}</label>
            <input id="ns-score" type="number" min={0} max={100} step={0.1} className="input" value={score} onChange={(e) => setScore(Number(e.target.value))} />
          </div>
          <div>
            <label className="label" htmlFor="ns-avg">{tr("과목 평균")}</label>
            <input id="ns-avg" type="number" min={0} max={100} step={0.1} className="input" value={avg} onChange={(e) => setAvg(Number(e.target.value))} />
          </div>
        </div>
        <p className="text-xs text-slate-500">{tr("석차백분율 = (석차 + (동석차 인원 − 1) ÷ 2) ÷ 수강자 수 × 100. 성취도는 기본 분할점(A 90, B 80, C 70, D 60) 기준이며 학교에 따라 다를 수 있어요.")}</p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="card p-3">
            <div className="text-xs text-slate-500">{tr("석차등급(5등급)")}</div>
            <div className="text-3xl font-bold text-brand-700">{t.rank ? tr("{g}등급", { g: g5 }) : "—"}</div>
            {t.rank && <div className="text-xs text-slate-500">{tr("상위 {p}%", { p: pct.toFixed(1) })}</div>}
          </div>
          <div className="card p-3">
            <div className="text-xs text-slate-500">{tr("성취도")}</div>
            <div className="text-3xl font-bold text-slate-900">{tr(ach)}</div>
          </div>
          <div className="card p-3">
            <div className="text-xs text-slate-500">{tr("예전 9등급이었다면")}</div>
            <div className="text-3xl font-bold text-slate-400">{t.rank ? tr("{g}등급", { g: g9 }) : "—"}</div>
          </div>
        </div>
        {t.rank && (
          <p className="rounded-xl bg-sun-100/70 p-3 text-xs leading-relaxed text-amber-900">
            {tr("같은 석차라도 5등급제에서는 등급 구간이 넓어져요(9등급제 {g9}등급 → 5등급제 {g5}등급). 두 제도의 등급 숫자를 그대로 비교할 수는 없고, 대학은 성취도·원점수·과목 이수 내용도 함께 봐요.", { g9, g5 })}
          </p>
        )}
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[420px] text-center text-sm">
            <caption className="p-3 text-left text-xs font-semibold text-slate-500">{tr("학교생활기록부 기재 미리보기")}</caption>
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="p-2">{tr("원점수/과목평균")}</th>
                <th className="p-2">{tr("성취도(수강자 수)")}</th>
                <th className="p-2">{tr("석차등급")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100">
                <td className="p-2">
                  {score}/{avg}
                </td>
                <td className="p-2">
                  {ach.split(" ")[0]}({n})
                </td>
                <td className="p-2">{t.rank ? g5 : "—"}</td>
              </tr>
            </tbody>
          </table>
          <p className="px-3 pb-3 text-[11px] text-slate-500">{tr("실제 성적표에는 성취도별 분포 비율도 함께 기재돼요(표준편차는 기재하지 않아요).")}</p>
        </div>
        {t.rank && (
          <div className="card p-4">
            <div className="text-xs font-semibold text-slate-500">{tr("수강자 {n}명일 때 등급 구간 (동석차 없을 때)", { n })}</div>
            <ul className="mt-2 grid grid-cols-5 gap-1 text-center text-xs">
              {cut.map((c, i) => (
                <li key={c.g} className={`rounded-lg p-2 ${c.g === g5 ? "bg-brand-600 text-white" : "bg-slate-50"}`}>
                  <b>{tr("{g}등급", { g: c.g })}</b>
                  <div>
                    {tr("{a}~{b}등", { a: i === 0 ? 1 : cut[i - 1].last + 1, b: c.last })}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function NaesinGuide() {
  const t = useT();
  const rows9 = NINE.map((c, i) => ({ g: i + 1, n: Math.round((200 * (c - (i ? NINE[i - 1] : 0))) / 100) }));
  const rows5 = GRADE5.map((g, i) => ({ g: g.g, n: Math.round((200 * (g.cum - (i ? GRADE5[i - 1].cum : 0))) / 100) }));
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-center text-sm">
            <caption className="p-3 text-left font-bold">{t("① 9등급제 vs 5등급제 (수강자 200명 기준)")}</caption>
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="p-2">{t("등급")}</th>
                <th className="p-2">{t("9등급제 인원")}</th>
                <th className="p-2">{t("5등급제 인원")}</th>
              </tr>
            </thead>
            <tbody>
              {rows9.map((r, i) => (
                <tr key={r.g} className="border-t border-slate-100">
                  <td className="p-1.5">{r.g}</td>
                  <td className="p-1.5">{t("{n}명", { n: r.n })}</td>
                  <td className="p-1.5">{rows5[i] ? t("{n}명", { n: rows5[i].n }) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          <div className="card text-sm">
            <div className="font-bold">{t("② 성취도 기준")}</div>
            <ul className="mt-2 space-y-1 text-slate-700">
              <li>{t("A~E 5단계: A 90% 이상 · B 80% 이상 · C 70% 이상 · D 60% 이상 · E 60% 미만")}</li>
              <li>{t("A·B·C 3단계(체육·예술·과학탐구실험): A 80% 이상 · B 60% 이상 · C 60% 미만")}</li>
              <li>{t("P(교양): 이수 여부만 기록")}</li>
            </ul>
          </div>
          <div className="card text-sm">
            <div className="font-bold">{t("③ 성적표 기재 변화")}</div>
            <p className="mt-1 text-slate-700">{t("원점수, 과목 평균, 성취도(수강자 수), 성취도별 분포 비율, 석차등급을 기재해요. 예전 성적표의 표준편차는 기재하지 않아요.")}</p>
          </div>
        </div>
      </div>
      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-left text-sm">
          <caption className="p-3 text-left font-bold">{t("④ 교과별 성적 제공 방식")}</caption>
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="p-2">{t("구분")}</th>
              <th className="p-2">{t("성취도")}</th>
              <th className="p-2">{t("석차등급")}</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["공통과목", "A~E", "5등급"],
              ["일반·진로선택, 융합선택(국·수·영·정보 등)", "A~E", "5등급"],
              ["사회·과학 융합선택 9과목 (여행지리, 역사로 탐구하는 현대 세계, 사회문제 탐구, 금융과 경제생활, 윤리문제 탐구, 기후변화와 지속가능한 세계, 과학의 역사와 문화, 기후변화와 환경생태, 융합과학 탐구)", "A~E", "산출 안 함"],
              ["체육·예술, 과학탐구실험", "A·B·C", "산출 안 함"],
              ["교양", "P", "산출 안 함"],
            ].map((r) => (
              <tr key={r[0]} className="border-t border-slate-100">
                <td className="p-2">{t(r[0])}</td>
                <td className="p-2">{t(r[1])}</td>
                <td className="p-2">{t(r[2])}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-3 pb-3 text-xs text-slate-500">{t("수강자가 아주 적은 소인수 과목, 공동교육과정·온라인학교 과목은 성적 산출 방식이 다를 수 있으니 학교 안내를 확인하세요.")}</p>
      </div>
    </div>
  );
}
