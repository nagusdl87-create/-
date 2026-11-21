"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { RIASEC, RIASEC_ORDER, type RiasecKey } from "@/data/riasec";
import { isTestComplete, riasecScores, topTypes } from "@/lib/match";
import { OFFICIAL } from "@/data/gn";
import { PageHead } from "@/components/ui";

const CAREERNET = [
  { n: "직업흥미검사(K)", who: "중·고", d: "여러 직업 활동에 대한 흥미를 영역별로 알아보고 관련 직업을 추천받아요.", use: "직업 찾기에서 흥미 영역 관련 직업 찜하기" },
  { n: "직업흥미검사(H)", who: "중·고", d: "홀랜드 6유형(현실·탐구·예술·사회·진취·관습)으로 흥미 유형을 진단해요.", use: "아래에 결과 코드를 입력해 마이로드 결과와 비교" },
  { n: "직업적성검사", who: "중·고", d: "언어·수리·공간·창의 등 영역별 상대적 강점을 알아봐요.", use: "나 알기의 강점 선택과 비교" },
  { n: "직업가치관검사", who: "중·고", d: "일할 때 중요하게 여기는 가치를 확인해요.", use: "나 알기의 가치관 3개와 비교" },
  { n: "진로성숙도검사", who: "중·고", d: "진로 결정에 필요한 태도·능력·행동 준비 정도를 확인해요.", use: "부족한 영역을 학기별 할 일로 추가" },
  { n: "진로개발역량검사", who: "중·고", d: "진로를 스스로 개발해 나가는 역량을 영역별로 확인해요.", use: "결과를 담임·진로 선생님 상담에 활용" },
  { n: "진로실행력검사", who: "중·고", d: "진로 목표를 실천으로 옮기는 힘을 점검해요.", use: "계획·기록에서 실천 과제 세우기" },
];

const WORK24 = [
  { n: "청소년 직업흥미검사", d: "흥미 유형과 관련 직업·학과를 안내해요." },
  { n: "중학생 진로적성검사", d: "중학생의 적성 요인을 측정해 진로 탐색을 도와요." },
  { n: "고등학생 적성검사", d: "직업 수행에 필요한 적성 요인을 측정해요." },
  { n: "청소년 인성검사", d: "성격 특성을 알아보고 진로 탐색에 활용해요." },
  { n: "청소년 직업가치관검사", d: "직업 선택에서 중요하게 여기는 가치를 알아봐요." },
  { n: "중·고등학생용 진로발달검사(커리어UP)", d: "진로 성숙도와 진로 결정 수준을 확인해요." },
];

export default function TestsPage() {
  const { state, update, ready } = useStore();
  const official = (state.portfolio["official.holland"] ?? "") as string;
  const mine = isTestComplete(state.answers) ? topTypes(riasecScores(state.answers)) : null;
  const off = official.split("").filter((c): c is RiasecKey => RIASEC_ORDER.includes(c as RiasecKey)).slice(0, 2);
  const match = mine && off.length === 2 ? mine.filter((k) => off.includes(k)).length : null;

  return (
    <div className="space-y-8">
      <PageHead title="진로검사·상담" desc="국가 진로정보망(커리어넷·고용24)의 무료 표준화 검사로 나를 더 정확히 알아보고, 결과를 마이로드에 연결해 다음 행동으로 이어 가세요." />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">커리어넷 진로심리검사</h2>
          <a href={OFFICIAL.career.url} target="_blank" rel="noreferrer" className="btn-ghost py-1.5">커리어넷 ↗</a>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {CAREERNET.map((t) => (
            <div key={t.n} className="card">
              <div className="flex items-center justify-between">
                <div className="font-bold">{t.n}</div>
                <span className="chip">{t.who}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{t.d}</p>
              <p className="mt-2 text-xs text-brand-700">➜ 마이로드 활용: {t.use}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">고용24 청소년 직업심리검사</h2>
          <a href={OFFICIAL.work24.url} target="_blank" rel="noreferrer" className="btn-ghost py-1.5">고용24 ↗</a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {WORK24.map((t) => (
            <div key={t.n} className="card p-4">
              <div className="font-bold">{t.n}</div>
              <p className="mt-1 text-sm text-slate-600">{t.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">검사 종류와 이름은 각 기관 사정에 따라 바뀔 수 있어요. 최신 목록은 각 누리집에서 확인하세요.</p>
      </section>

      <section className="card">
        <h2 className="text-lg font-bold">공식 검사 결과와 비교하기</h2>
        <p className="mt-1 text-sm text-slate-600">커리어넷 직업흥미검사(H)나 고용24 직업흥미검사에서 받은 흥미 코드 상위 2개를 골라 주세요.</p>
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
                {RIASEC[k].emoji} {RIASEC[k].name}({k})
              </button>
            );
          })}
        </div>
        {ready && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3 text-center">
              <div className="text-xs text-slate-500">마이로드 탐색</div>
              <div className="text-2xl font-extrabold tracking-widest">{mine ? mine.join("") : "—"}</div>
              {!mine && <Link href="/discover" className="text-xs text-brand-600 underline">탐색하러 가기</Link>}
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-center">
              <div className="text-xs text-slate-500">공식 검사</div>
              <div className="text-2xl font-extrabold tracking-widest">{off.length ? off.join("") : "—"}</div>
            </div>
            <div className="rounded-xl bg-brand-50 p-3 text-center">
              <div className="text-xs text-slate-500">일치</div>
              <div className="text-lg font-extrabold text-brand-700">
                {match === null ? "—" : match === 2 ? "아주 비슷해요" : match === 1 ? "한 가지 겹쳐요" : "서로 달라요"}
              </div>
            </div>
          </div>
        )}
        {match === 0 && <p className="mt-2 text-sm text-slate-600">결과가 다르다면 두 유형 모두와 관련된 직업을 탐색해 보세요. 흥미는 경험에 따라 달라질 수 있어요.</p>}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">진로 상담 받기</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="card">
            <div className="font-bold">학교 진로전담교사</div>
            <p className="mt-1 text-sm text-slate-600">가장 가까운 상담 창구예요. 마이로드 리포트를 인쇄하거나 공유 링크로 보여 드리면 상담이 훨씬 구체적이 돼요.</p>
            <Link href="/report" className="btn-primary mt-3">리포트 준비하기</Link>
          </div>
          <div className="card">
            <div className="font-bold">커리어넷 진로상담</div>
            <p className="mt-1 text-sm text-slate-600">온라인 진로상담과 상담 사례를 이용할 수 있어요.</p>
            <a href={OFFICIAL.career.url} target="_blank" rel="noreferrer" className="btn-ghost mt-3">커리어넷 ↗</a>
          </div>
          <div className="card">
            <div className="font-bold">대입 상담 (고등학생)</div>
            <p className="mt-1 text-sm text-slate-600">경상남도교육청 대입정보센터 1:1 상담, 대학입학상담센터(1600-1615)를 이용할 수 있어요.</p>
            <Link href="/admission" className="btn-ghost mt-3">대입 정보 보기</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
