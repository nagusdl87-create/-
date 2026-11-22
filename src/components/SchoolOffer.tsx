"use client";

// 192학점 설계: 우리 학교 개설 과목(나이스 시간표)과 연결
import { useEffect, useMemo, useState } from "react";
import { Info, School, Search, X } from "lucide-react";
import { SEMS, type Sem } from "@/lib/store";
import { parseEntry } from "@/lib/credits";
import { fmtAsOf, normSubject, type NeisSubjects, type SchoolOffer } from "@/lib/schoolSubjects";
import { useT } from "@/lib/i18n";
import { useLabels } from "@/lib/subjectLabel";

type Pick = { code: string; name: string };
type Lite = { id: string; name: string; region: string };

/** 데이터 한계 안내 (항상 표시) */
export function OfferCaveat({ asOf }: { asOf: string }) {
  const t = useT();
  return (
    <p className="text-[11px] leading-relaxed text-slate-500">
      {t("이번 학기 실제 시간표(최근 3주)에 나온 과목이라 다른 학기 과목은 빠질 수 있어요 · 나이스 교육정보 개방 포털, 수집일 {date}", { date: fmtAsOf(asOf) || "-" })}
    </p>
  );
}

// 경남 고교 목록은 학교를 찾을 때만 불러와요(설계 화면 번들을 가볍게)
let schoolsP: Promise<Lite[]> | null = null;
const loadSchools = () =>
  (schoolsP ??= import("@/data/gn-schools.json")
    .then((m) => (m.default as Lite[]).map(({ id, name, region }) => ({ id, name, region })))
    .catch(() => {
      schoolsP = null;
      return [];
    }));

export function SchoolOfferCard({
  data, offer, school, onChange,
}: {
  data: NeisSubjects | null | undefined;
  offer: SchoolOffer | null;
  school: Pick | null;
  onChange: (s: Pick | null) => void;
}) {
  const [searching, setSearching] = useState(false);
  const t = useT();
  const hasData = !!data && Object.keys(data.schools ?? {}).length > 0;

  if (data === undefined) return null; // 불러오는 중
  if (!hasData) {
    // 자료가 없거나(오프라인 등) 비어 있으면: 고른 학교가 있을 때만 짧게 알려요
    if (!school) return null;
    return (
      <div className="card no-print mb-4 flex flex-wrap items-center gap-2 text-sm">
        <School className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        <span className="min-w-0 flex-1 break-words text-slate-600">
          <b data-keep-ko>{school.name}</b> {t("개설 과목 자료를 지금은 불러올 수 없어요. 인터넷에 연결되면 다시 보여 드릴게요.")}
        </span>
      </div>
    );
  }

  return (
    <div className="card no-print mb-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <School className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
          <div className="min-w-0 text-sm font-bold">
            {school ? <>{t("우리 학교")} · <span className="break-words" data-keep-ko>{school.name}</span></> : t("우리 학교 개설 과목으로 설계하기")}
          </div>
        </div>
        {school && !searching && (
          <div className="flex gap-2">
            <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => setSearching(true)}>{t("학교 바꾸기")}</button>
            <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => onChange(null)} aria-label={t("우리 학교 선택 해제")}>
              <X className="h-3.5 w-3.5" aria-hidden /> {t("해제")}
            </button>
          </div>
        )}
      </div>

      {(!school || searching) && (
        <>
          {!school && (
            <p className="mt-1 text-xs text-slate-600">
              {t("학교를 고르면 과목 담기에서 우리 학교에 개설된 과목을 표시하고, 설계한 과목 중 학교 시간표에 없는 과목을 알려 드려요.")}
            </p>
          )}
          <SchoolSearch
            data={data!}
            onPick={(p) => {
              onChange(p);
              setSearching(false);
            }}
            onCancel={school ? () => setSearching(false) : undefined}
          />
        </>
      )}

      {school && !searching && !offer && (
        <p className="mt-2 text-xs font-semibold text-amber-700">{t("아직 개설 과목 자료가 없어요. 학교 누리집의 교육과정 편제표를 확인해 주세요.")}</p>
      )}

      {offer && !searching && (
        <div className="mt-2 space-y-2">
          <p className="text-xs text-slate-600">
            {t("{ay}학년도 {sem}학기 시간표에 나온 과목 중", { ay: offer.ay, sem: offer.sem })} <b className="text-emerald-700">{t("{n}과목", { n: offer.offered.size })}</b>{t("이 과목 백과와 일치해요.")}{" "}
            {t("과목 담기에서")} <span className="rounded bg-emerald-100 px-1 text-[11px] font-bold text-emerald-800">{t("우리 학교")}</span> {t("표시를 확인하세요.")}
          </p>
          {offer.unknown.length > 0 && (
            <details className="rounded-lg border border-slate-200 p-2 text-xs">
              <summary className="cursor-pointer font-semibold text-slate-600">{t("학교 고유·전문 과목 {n}개", { n: offer.unknown.length })}</summary>
              <p className="mt-1 text-[11px] text-slate-500">{t("과목 백과에 없는 이름이에요. 전문교과, 학교 자율 과목, 이전 교육과정(3학년) 과목이 섞여 있을 수 있어요. 과목 담기의 「우리 학교 개설 과목만」에서 직접 담을 수 있어요.")}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {offer.unknown.map((n) => (
                  <span key={n} className="chip max-w-full break-words" data-keep-ko>{n}</span>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
      <div className="mt-2">
        <OfferCaveat asOf={data!.asOf} />
      </div>
    </div>
  );
}

function SchoolSearch({ data, onPick, onCancel }: { data: NeisSubjects; onPick: (p: Pick) => void; onCancel?: () => void }) {
  const [q, setQ] = useState("");
  const [list, setList] = useState<Lite[] | null>(null);
  const t = useT();
  useEffect(() => {
    let on = true;
    loadSchools().then((l) => on && setList(l));
    return () => { on = false; };
  }, []);
  const results = useMemo(() => {
    const k = normSubject(q);
    if (!list || !k) return [];
    return list
      .filter((s) => normSubject(s.name + s.region).includes(k))
      .sort((a, b) => Number(!!data.schools[b.id]) - Number(!!data.schools[a.id]) || a.name.localeCompare(b.name, "ko"))
      .slice(0, 8);
  }, [q, list, data]);

  return (
    <div className="mt-2">
      <label className="text-xs font-semibold text-slate-600" htmlFor="offer-school-q">{t("우리 학교 찾기 (경남 고등학교)")}</label>
      <div className="mt-1 flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input id="offer-school-q" className="input py-2 pl-9" placeholder={t("예: 거제고, 창원")} value={q} onChange={(e) => setQ(e.target.value)} maxLength={20} autoComplete="off" />
        </div>
        {onCancel && <button className="btn-ghost shrink-0 px-3 py-1.5 text-xs" onClick={onCancel}>{t("취소")}</button>}
      </div>
      {q && (
        <ul className="mt-2 space-y-1" aria-label={t("학교 검색 결과")}>
          {list === null && <li className="text-xs text-slate-500">{t("학교 목록을 불러오는 중이에요…")}</li>}
          {list && results.length === 0 && <li className="text-xs text-slate-500">{t("찾는 학교가 없어요. 학교 이름을 다시 확인해 주세요.")}</li>}
          {results.map((s) => {
            const ok = !!data.schools[s.id];
            return (
              <li key={s.id}>
                <button
                  className={`flex w-full flex-wrap items-center gap-x-2 rounded-lg border px-3 py-2 text-left text-sm ${ok ? "border-slate-200 bg-surface hover:border-brand-300" : "cursor-not-allowed border-dashed border-slate-200 text-slate-400"}`}
                  disabled={!ok}
                  onClick={() => ok && onPick({ code: s.id, name: s.name })}
                >
                  <span className="font-semibold" data-keep-ko>{s.name}</span>
                  <span className="text-xs text-slate-500" data-keep-ko>{s.region}</span>
                  {!ok && <span className="w-full text-[11px] sm:ml-auto sm:w-auto">{t("아직 개설 과목 자료가 없어요")}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** 진단: 설계한 과목 중 이번 학기 학교 시간표에 안 보인 과목 */
export function offerMissing(plan: Record<Sem, string[]>, offer: SchoolOffer): string[] {
  // 1·2처럼 학기별로 이어지는 과목(공통국어1·2 등)은 한쪽만 보여도 개설된 것으로 봐요
  const base = (n: string) => n.replace(/[12]$/, "");
  const seenBase = new Set([...offer.seen].map(base));
  const out: string[] = [];
  for (const s of SEMS) {
    for (const e of plan[s] ?? []) {
      const { name } = parseEntry(e);
      if (out.includes(name)) continue;
      const k = normSubject(name);
      if (offer.offered.has(name) || offer.seen.has(k) || seenBase.has(base(k))) continue;
      out.push(name);
    }
  }
  return out;
}

/** 번역된 문구 속 {school} 자리에 학교 이름(한국어 고유명사)을 넣는다 */
function KoIn({ text, name }: { text: string; name: string }) {
  const [a, b = ""] = text.split("{school}");
  return <>{a}<span data-keep-ko>{name}</span>{b}</>;
}

export function OfferDiagnosis({ plan, offer, schoolName }: { plan: Record<Sem, string[]>; offer: SchoolOffer; schoolName: string }) {
  const missing = useMemo(() => offerMissing(plan, offer), [plan, offer]);
  const planned = SEMS.some((s) => (plan[s] ?? []).length > 0);
  const { t, sl } = useLabels();
  if (!planned) return null;
  return (
    <div className="card p-4" data-testid="offer-diagnosis">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <School className="h-3.5 w-3.5" aria-hidden /> {t("우리 학교 시간표와 비교")}
      </div>
      {missing.length === 0 ? (
        <p className="mt-2 text-xs leading-relaxed text-emerald-700"><KoIn text={t("설계한 과목이 모두 {school} 이번 학기 시간표에 나와요.")} name={schoolName} /></p>
      ) : (
        <>
          <p className="mt-2 text-xs leading-relaxed text-slate-700">
            <span data-keep-ko>{schoolName}</span> {t("이번 학기 시간표에서 보이지 않은 과목")} <b>{t("{n}개", { n: missing.length })}</b>
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {missing.map((n) => (
              <span key={n} className="chip max-w-full break-words border-dashed border-slate-300 bg-surface">{sl(n)}</span>
            ))}
          </div>
          <p className="mt-2 flex gap-1 text-[11px] leading-relaxed text-slate-500">
            <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
            <span>{t("다른 학기에 열리거나 공동교육과정·온라인 공동교육과정으로 들을 수 있는 과목일 수 있어요. 학교 교육과정 편제표에서 꼭 확인해 주세요.")}</span>
          </p>
        </>
      )}
      <div className="mt-2">
        <OfferCaveat asOf={offer.asOf} />
      </div>
    </div>
  );
}
