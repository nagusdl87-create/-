"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CREDIT_RULES } from "@/data/subjects";
import { useT } from "@/lib/i18n";

// 192학점 이수 기준표 (카드형/표형)
export function CreditStandards() {
  const [view, setView] = useState<"card" | "table">("card");
  const t = useT();
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["총 이수 학점", "192학점", "필수 84 + 자율 90 + 창체 18"],
          ["창의적 체험활동", "18학점", "288시간"],
          ["국·수·영 상한", "81학점", "교과 174 × 50% − 한국사 6"],
          ["1학점 수업량", "50분 × 16회", "학기 단위 이수"],
        ].map(([k, v, d]) => (
          <div key={k} className="card p-4">
            <div className="text-xs font-semibold text-slate-500">{t(k)}</div>
            <div className="text-2xl font-bold">{t(v)}</div>
            <div className="text-xs text-slate-500">{t(d)}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5">
        <button aria-pressed={view === "card"} className={`chip px-3 py-1.5 ${view === "card" ? "chip-on" : ""}`} onClick={() => setView("card")}>{t("카드형 (모바일 추천)")}</button>
        <button aria-pressed={view === "table"} className={`chip px-3 py-1.5 ${view === "table" ? "chip-on" : ""}`} onClick={() => setView("table")}>{t("표 전체 보기")}</button>
      </div>
      {view === "card" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CREDIT_RULES.requiredByArea.map((r) => (
            <div key={r.area} className="card p-4">
              <div className="text-sm font-semibold text-slate-700">{t(r.area)}</div>
              <div className="text-2xl font-bold text-brand-700">{t("{n}학점", { n: r.min })}</div>
              <div className="text-xs text-slate-500">{t("필수 이수")}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="p-3">{t("교과(군)")}</th>
                <th className="p-3">{t("필수 이수 학점")}</th>
                <th className="p-3">{t("비고")}</th>
              </tr>
            </thead>
            <tbody>
              {CREDIT_RULES.requiredByArea.map((r) => (
                <tr key={r.area} className="border-t border-slate-100">
                  <td className="p-3">{t(r.area)}</td>
                  <td className="p-3 font-semibold">{t("{n}학점", { n: r.min })}</td>
                  <td className="p-3 text-xs text-slate-500">{t(r.area.startsWith("과학") ? "과학탐구실험 2학점 포함" : r.area.startsWith("체육") ? "매 학기 편성" : r.area.startsWith("사회") ? "통합사회 8 + 한국사 6" : "")}</td>
                </tr>
              ))}
              <tr className="border-t border-slate-200 bg-slate-50 font-bold">
                <td className="p-3">{t("필수 이수 합계")}</td>
                <td className="p-3">{t("{n}학점", { n: 84 })}</td>
                <td className="p-3 text-xs font-normal">{t("나머지 자율 이수 90학점은 진로·적성에 따라 선택")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div className="card text-sm leading-relaxed text-slate-700">
        <div className="font-bold text-slate-900">{t("알아 두면 좋은 규칙")}</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>{t("공통과목을 제외한 선택과목은 기본 학점(4학점)에서 ±1학점 범위로 학교가 증감해 편성할 수 있어요.")}</li>
          <li>{t("국어·수학·영어 합계는 81학점을 넘을 수 없어요(교과 174학점의 50%에서 한국사 6학점을 뺀 값).")}</li>
          <li>{t("체육은 매 학기 편성하는 것이 원칙이에요.")}</li>
          <li>{t("과목 출석률 3분의 2 이상, 학업성취율 40% 이상이면 이수로 인정돼요. 미치지 못하면 보충 지도(최소 성취수준 보장지도)를 받아요.")}</li>
        </ul>
      </div>
    </div>
  );
}

const SECTIONS = [
  { t: "1. 고교학점제란?", d: "학생이 기초 소양과 기본 학력을 바탕으로 진로·적성에 따라 과목을 선택·이수하고, 이수 기준에 도달한 과목에 학점을 받아 누적 학점이 졸업 기준(192학점)에 이르면 졸업하는 제도예요. 2025학년도 고1부터 전면 적용돼요." },
  { t: "2. 도입 배경과 기대 효과", d: "모든 학생이 같은 과목을 듣던 방식에서 벗어나, 학생의 진로와 흥미에 맞는 배움을 보장하기 위해 도입됐어요. 학생 주도성, 수업 참여, 진로에 맞는 깊이 있는 학습을 기대해요." },
  { t: "3. 운영 절차 (7단계)", d: "① 진로·학업 설계 지도 → ② 과목 수요 조사 → ③ 개설 과목 확정 → ④ 수강 신청 → ⑤ 시간표 편성 → ⑥ 수업과 평가 → ⑦ 이수·미이수 판정과 보충 지도" },
  { t: "4. 192학점과 졸업", d: "교과 174학점과 창의적 체험활동 18학점(288시간)을 합쳐 192학점을 이수하면 졸업해요. 교과는 필수 이수 84학점과 자율 이수 90학점으로 나뉘어요." },
  { t: "5. 평가", d: "공통·선택과목은 성취도(A~E)와 5등급 석차등급을 함께 기록해요. 사회·과학 융합선택 9과목은 성취도만, 체육·예술·과학탐구실험은 A·B·C, 교양은 P로 기록해요." },
  { t: "6. 학교에 없는 과목 듣기", d: "다니는 학교에 개설되지 않은 과목은 여러 학교가 함께 여는 공동교육과정이나 교육청 온라인학교 등에서 들을 수 있는 경우가 있어요. 개설 여부와 신청 방법은 학교 교육과정 담당 선생님께 확인하세요." },
];

const FAQ = [
  { q: "과목을 잘못 고르면 대학 입시에 불리한가요?", a: "대학은 지원 학과와 관련된 과목을 이수했는지 살펴봐요. 다만 한 과목으로 결정되지는 않으니, 관심 학과의 권장과목을 확인하고 선생님과 상의해 균형 있게 고르세요." },
  { q: "수강 신청 후에 과목을 바꿀 수 있나요?", a: "학교마다 정정 기간을 두는 경우가 많아요. 시간표 편성 이후에는 바꾸기 어려우니 학교 안내 일정을 꼭 확인하세요." },
  { q: "미이수가 되면 어떻게 되나요?", a: "출석률이나 학업성취율 기준에 미치지 못하면 보충 지도를 받고, 이를 마치면 이수로 인정받을 수 있어요." },
  { q: "어려운 과목을 피하면 내신에 유리한가요?", a: "단기적으로는 그렇게 보일 수 있지만, 희망 진로에 필요한 과목을 듣지 않으면 대학 공부와 진로 준비에 어려움이 생길 수 있어요." },
  { q: "특성화고·마이스터고도 고교학점제를 하나요?", a: "네. 직업계고도 고교학점제가 적용되며, 전문교과와 현장실습 등 학교 특성에 맞게 운영돼요." },
];

export function CreditSystemGuide() {
  const [open, setOpen] = useState<number | null>(0);
  const t = useT();
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        {SECTIONS.map((s) => (
          <div key={s.t} className="card p-5">
            <h3 className="font-bold">{t(s.t)}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{t(s.d)}</p>
          </div>
        ))}
      </div>
      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[480px] text-left text-sm">
          <caption className="p-4 text-left font-bold">{t("기존 vs 고교학점제")}</caption>
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="p-3">{t("구분")}</th>
              <th className="p-3">{t("기존")}</th>
              <th className="p-3">{t("고교학점제")}</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["과목 선택", "학교가 정한 과목 중심", "학생이 진로에 맞게 선택"],
              ["졸업 기준", "출석 일수", "출석 + 과목 이수(192학점)"],
              ["평가", "9등급 상대평가", "성취도 + 5등급"],
              ["학업 지원", "-", "최소 성취수준 보장지도"],
            ].map((r) => (
              <tr key={r[0]} className="border-t border-slate-100">
                <td className="p-3 font-medium">{t(r[0])}</td>
                <td className="p-3">{t(r[1])}</td>
                <td className="p-3">{t(r[2])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="mb-2 font-bold">{t("7. 자주 묻는 질문")}</h3>
        <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
          {FAQ.map((f, i) => (
            <li key={f.q}>
              <button className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                Q. {t(f.q)}
                <ChevronDown className={`h-4 w-4 shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="px-4 pb-4 text-sm text-slate-700">A. {t(f.a)}</p>}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-slate-500">
        {t("더 자세한 내용은")}{" "}
        <a className="underline" href="https://www.hscredit.kr/" target="_blank" rel="noreferrer">{t("고교학점제 누리집")}</a>{t("과 경상남도교육청 안내를 확인하세요.")}
      </p>
    </div>
  );
}
