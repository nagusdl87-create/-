"use client";

// 나이스 교육정보 개방 포털 데이터 (빌드 때 scripts/fetch-neis.mjs가 public/data/neis/에 저장)
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Utensils } from "lucide-react";
import { SUBJECT_MAP } from "@/data/subjects";

type Subjects = { asOf: string; schools: Record<string, { ay: string; sem: string; grades: Record<string, string[]> }> };
type Meal = { asOf: string; days: Record<string, { dish: string[]; kcal: string }> };

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

/** 홈: 내 정보에 적은 학교의 급식 */
export function MySchoolMeal({ school }: { school: string }) {
  const codes = useJson<Record<string, string>>(school ? "/data/neis/codes.json" : null);
  if (!school || !codes) return null;
  const name = school.trim();
  const code = codes[name] ?? codes[`${name}학교`] ?? Object.entries(codes).find(([k]) => k.startsWith(name))?.[1];
  if (!code) return null;
  return (
    <section className="card">
      <SchoolMeal code={code} days={3} title={`${Object.keys(codes).find((k) => codes[k] === code)} 급식`} />
    </section>
  );
}
