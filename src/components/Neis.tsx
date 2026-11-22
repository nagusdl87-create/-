"use client";

// 나이스 교육정보 개방 포털 데이터 (빌드 때 scripts/fetch-neis.mjs가 public/data/neis/에 저장)
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Utensils } from "lucide-react";
import { SUBJECT_MAP } from "@/data/subjects";

type Subjects = { asOf: string; schools: Record<string, { ay: string; sem: string; grades: Record<string, string[]> }> };
type Meal = { asOf: string; days: Record<string, { dish: string[]; kcal: string }> };
type Schedule = { asOf: string; events: { d: string; t: string; g?: number[] }[] };

const cache = new Map<string, Promise<unknown>>();
function load<T>(url: string): Promise<T | null> {
  if (!cache.has(url)) cache.set(url, fetch(url).then((r) => (r.ok ? r.json() : null)).catch(() => null));
  return cache.get(url) as Promise<T | null>;
}
function useJson<T>(url: string | null) {
  const [d, setD] = useState<T | null | undefined>(undefined);
  useEffect(() => {
    if (!url) return setD(null);
    let on = true;
    load<T>(url).then((x) => on && setD(x));
    return () => { on = false; };
  }, [url]);
  return d;
}

const WD = ["일", "월", "화", "수", "목", "금", "토"];
const fmt = (k: string) => {
  const d = new Date(+k.slice(0, 4), +k.slice(4, 6) - 1, +k.slice(6, 8));
  return `${d.getMonth() + 1}/${d.getDate()}(${WD[d.getDay()]})`;
};
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
};

/** 고교 상세: 이번 학기 시간표에 나온 과목 */
export function SchoolSubjects({ code }: { code: string }) {
  const data = useJson<Subjects>("/data/neis/subjects.json");
  const s = data?.schools?.[code];
  if (!s) return null;
  const grades = Object.keys(s.grades).sort();
  return (
    <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/50 p-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
        <BookOpen className="h-3.5 w-3.5" aria-hidden /> {s.ay}학년도 {s.sem}학기 실제 시간표에 나온 과목
      </div>
      <div className="mt-2 space-y-2">
        {grades.map((g) => (
          <div key={g}>
            <div className="text-[11px] font-semibold text-slate-500">{g}학년</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {s.grades[g].map((n) =>
                SUBJECT_MAP[n] ? (
                  <Link key={n} href={`/subjects#${encodeURIComponent(n)}`} className="chip bg-white">{n}</Link>
                ) : (
                  <span key={n} className="chip bg-white text-slate-600">{n}</span>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-slate-500">최근 3주 시간표 기준이라 학기 중 일부 과목은 빠질 수 있어요. 전체 편제표는 학교 누리집에서 확인하세요. (나이스 교육정보 개방 포털, {data?.asOf.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3")} 수집)</p>
    </div>
  );
}

/** 학교 급식 (오늘부터 며칠) */
export function SchoolMeal({ code, days = 5, title = "이번 주 급식" }: { code: string; days?: number; title?: string }) {
  const m = useJson<Meal>(`/data/neis/meal/${code}.json`);
  if (!m) return null;
  const keys = Object.keys(m.days).filter((k) => k >= todayKey()).sort().slice(0, days);
  if (!keys.length) return null;
  return (
    <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
        <Utensils className="h-3.5 w-3.5" aria-hidden /> {title}
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {keys.map((k) => (
          <div key={k} className="rounded-lg bg-white p-2 text-xs">
            <div className="flex justify-between font-semibold text-slate-800">
              <span>{fmt(k)}{k === todayKey() && <span className="ml-1 text-brand-700">오늘</span>}</span>
              <span className="font-normal text-slate-400">{m.days[k].kcal}</span>
            </div>
            <div className="mt-1 leading-relaxed text-slate-600">{m.days[k].dish.join(" · ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 내 정보에 적은 학교 이름 → 나이스 학교코드 */
function useSchoolCode(school: string) {
  const codes = useJson<Record<string, string>>(school ? "/data/neis/codes.json" : null);
  if (!school || !codes) return null;
  const name = school.trim();
  const code = codes[name] ?? codes[`${name}학교`] ?? Object.entries(codes).find(([k]) => k.startsWith(name))?.[1];
  if (!code) return null;
  return { code, name: Object.keys(codes).find((k) => codes[k] === code) ?? name };
}

/** 홈: 내 정보에 적은 학교의 급식 */
export function MySchoolMeal({ school }: { school: string }) {
  const hit = useSchoolCode(school);
  if (!hit) return null;
  return (
    <section className="card">
      <SchoolMeal code={hit.code} days={3} title={`${hit.name} 급식`} />
    </section>
  );
}

// 학사일정 종류: 강조 색과 짧은 표시
const KINDS = [
  { re: /시험|고사/, label: "시험", cls: "bg-rose-100 text-rose-800" },
  { re: /방학/, label: "방학", cls: "bg-sky-100 text-sky-800" },
  { re: /체험학습|현장학습|수학여행|수련/, label: "체험", cls: "bg-emerald-100 text-emerald-800" },
  { re: /휴업|휴일|공휴|대체|재량/, label: "쉬는 날", cls: "bg-slate-100 text-slate-700" },
] as const;
const kindOf = (t: string) => KINDS.find((k) => k.re.test(t));
const keyToDate = (k: string) => new Date(+k.slice(0, 4), +k.slice(4, 6) - 1, +k.slice(6, 8));
const addDaysKey = (k: string, n: number) => {
  const d = keyToDate(k);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
};
const daysBetween = (a: string, b: string) => Math.round((keyToDate(b).getTime() - keyToDate(a).getTime()) / 86400000);

/** 학교 학사일정 (오늘부터 며칠). 같은 이름이 이어지면 기간으로 묶어요. */
export function SchoolSchedule({ code, grade, days = 30, title = "다가오는 학사일정", planLink = false }: { code: string; grade?: number; days?: number; title?: string; planLink?: boolean }) {
  const data = useJson<Schedule>(`/data/neis/schedule/${code}.json`);
  const [mine, setMine] = useState(true);
  const [more, setMore] = useState(false);
  if (!data?.events?.length) return null;
  const today = todayKey();
  const until = addDaysKey(today, days);
  const useGrade = !!grade && mine;
  const list = data.events.filter((e) => e.d >= today && e.d <= until && (!useGrade || !e.g?.length || e.g.includes(grade!)));
  // 같은 이름·학년이 3일 안에 이어지면(주말 포함) 한 기간으로
  const groups: { from: string; to: string; t: string; g?: number[] }[] = [];
  for (const e of list) {
    const last = groups.find((x) => x.t === e.t && String(x.g ?? "") === String(e.g ?? "") && daysBetween(x.to, e.d) <= 3 && e.d >= x.to);
    if (last) last.to = e.d;
    else groups.push({ from: e.d, to: e.d, t: e.t, g: e.g });
  }
  groups.sort((a, b) => a.from.localeCompare(b.from));
  const exam = groups.find((x) => kindOf(x.t)?.label === "시험" && x.to >= today);
  const examD = exam ? daysBetween(today, exam.from) : null;
  const shown = more ? groups : groups.slice(0, 6);
  return (
    <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-violet-900">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden /> {title}
        </div>
        {grade ? (
          <div className="flex gap-1 text-[11px]" role="group" aria-label="학년 보기">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={mine === v}
                onClick={() => setMine(v)}
                className={`rounded-full px-2 py-0.5 font-semibold ${mine === v ? "bg-accent text-white" : "bg-surface text-slate-600 ring-1 ring-slate-200"}`}
              >
                {v ? `${grade}학년` : "전체"}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {exam && examD !== null && (
        <p className="mt-2 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-800">
          {examD <= 0 ? `지금 ${exam.t} 기간이에요` : `${exam.t}까지 D-${examD}`} <span className="font-normal text-rose-700">({fmt(exam.from)}{exam.to !== exam.from ? ` ~ ${fmt(exam.to)}` : ""})</span>
        </p>
      )}
      {groups.length ? (
        <ul className="mt-2 space-y-1">
          {shown.map((x) => {
            const k = kindOf(x.t);
            return (
              <li key={x.from + x.t} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg bg-surface px-2.5 py-1.5 text-xs">
                <span className="order-1 shrink-0 font-semibold text-slate-700 sm:w-[7.5rem]">
                  {fmt(x.from)}{x.to !== x.from && <> ~ {fmt(x.to)}</>}
                </span>
                <span className="order-3 min-w-0 basis-full break-keep text-slate-800 sm:order-2 sm:basis-0 sm:flex-1">{x.t}</span>
                <span className="order-2 ml-auto flex shrink-0 items-center gap-1.5 sm:order-3">
                  {x.g?.length && x.g.length < 3 ? <span className="text-[10px] text-slate-500">{x.g.join("·")}학년</span> : null}
                  {k && <span className={`chip px-1.5 py-0 text-[10px] ${k.cls}`}>{k.label}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-slate-500">앞으로 {days}일 동안 등록된 일정이 없어요.</p>
      )}
      {(groups.length > 6 || planLink) && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs font-semibold">
          {groups.length > 6 && (
            <button type="button" className="text-brand-700" aria-expanded={more} onClick={() => setMore(!more)}>
              {more ? "접기" : `${groups.length - 6}개 더 보기`}
            </button>
          )}
          {planLink && (
            <Link href="/plan" className="inline-flex items-center gap-1 text-brand-700">
              학교 일정을 계획에 반영하세요 <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          )}
        </div>
      )}
      <p className="mt-2 text-[11px] text-slate-500">나이스 교육정보 개방 포털 학사일정 · 학교 사정에 따라 바뀔 수 있어요 ({data.asOf.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3")} 수집)</p>
    </div>
  );
}

/** 홈: 내 정보에 적은 학교의 학사일정 */
export function MySchoolSchedule({ school, grade }: { school: string; grade?: string }) {
  const hit = useSchoolCode(school);
  if (!hit) return null;
  const g = Number(grade) || undefined;
  return <ScheduleCard code={hit.code} grade={g} title={`${hit.name} 학사일정`} />;
}

// 파일이 없으면 카드 테두리까지 숨기도록 미리 확인
function ScheduleCard({ code, grade, title }: { code: string; grade?: number; title: string }) {
  const data = useJson<Schedule>(`/data/neis/schedule/${code}.json`);
  if (!data?.events?.length) return null;
  return (
    <section className="card">
      <SchoolSchedule code={code} grade={grade} title={title} planLink />
    </section>
  );
}
