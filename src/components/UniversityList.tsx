"use client";

import { useMemo, useState } from "react";
import { ExternalLink, FileText, MapPin } from "lucide-react";
import { SIDO_ORDER, useUniv, type Dept, type School } from "@/lib/univ";
import { useEnData, useT } from "@/lib/i18n";

type Props = { match?: { inc: RegExp; exc?: RegExp }; groupIndex?: number; title?: string };

export function UniversityList({ match, groupIndex, title }: Props) {
  const { data, error } = useUniv();
  const t = useT();
  const en = useEnData(() => import("@/i18n/data/univ.en"), "univ");
  const sidoL = (k: string) => (en ? en.sidoEn(k) : k);
  const typeL = (k: string) => (en ? en.schoolTypeEn(k) : k);
  const [deg, setDeg] = useState<"all" | 1 | 2>("all");
  const [openSido, setOpenSido] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (!data) return [] as { s: School; si: number; depts: string[]; deg: Set<number> }[];
    const depts: Dept[] =
      groupIndex !== undefined
        ? data.groups[groupIndex]?.depts ?? []
        : data.groups.flatMap((g) => g.depts).filter((d) => match && match.inc.test(d[1]) && !(match.exc && match.exc.test(d[1])));
    const by = new Map<number, { depts: Set<string>; deg: Set<number> }>();
    for (const d of depts) {
      if (deg !== "all" && d[2] !== deg) continue;
      const e = by.get(d[0]) ?? { depts: new Set(), deg: new Set() };
      e.depts.add(d[1]);
      e.deg.add(d[2]);
      by.set(d[0], e);
    }
    return [...by.entries()].map(([si, e]) => ({ s: data.schools[si], si, depts: [...e.depts], deg: e.deg }));
  }, [data, match, groupIndex, deg]);

  if (error) return <p className="text-sm text-slate-500">{t("대학 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.")}</p>;
  if (!data) return <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />;

  const bySido = new Map<string, typeof rows>();
  rows.forEach((r) => bySido.set(r.s[1], [...(bySido.get(r.s[1]) ?? []), r]));
  const sidos = [...bySido.keys()].sort((a, b) => (SIDO_ORDER.indexOf(a) + 100 * +(SIDO_ORDER.indexOf(a) < 0)) - (SIDO_ORDER.indexOf(b) + 100 * +(SIDO_ORDER.indexOf(b) < 0)));
  const gn = bySido.get("경남") ?? [];
  const deptCount = rows.reduce((a, r) => a + r.depts.length, 0);

  const Row = ({ r }: { r: (typeof rows)[number] }) => (
    <li className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
      <div className="min-w-0">
        <div className="font-semibold text-slate-900">
          <span data-keep-ko>{r.s[0]}</span>
          <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">{typeL(r.s[3])}</span>
        </div>
        <div className="text-xs text-slate-500">
          <MapPin className="mr-0.5 inline h-3 w-3" aria-hidden />
          {sidoL(r.s[1])} <span data-keep-ko>{r.s[2]}</span> · <span data-keep-ko>{r.depts.slice(0, 4).join(", ")}</span>
          {r.depts.length > 4 && t(" 외 {n}", { n: r.depts.length - 4 })}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        {r.s[4] && (
          <a href={r.s[4]} target="_blank" rel="noreferrer" className="chip" aria-label={t("{name} 누리집", { name: r.s[0] })}>
            {t("누리집")} <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {r.s[5] && (
          <a href={r.s[5]} target="_blank" rel="noreferrer" className="chip" aria-label={t("{name} 2028 계획 (전형 기본계획)", { name: r.s[0] })}>
            <FileText className="h-3 w-3" /> {t("2028 계획")}
          </a>
        )}
      </div>
    </li>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm">
          <b className="text-slate-900">{title ?? t("개설 대학")}</b> <span className="text-slate-500">{t("전국 {s}개 대학 · {d}개 학과", { s: rows.length, d: deptCount })}</span>
        </div>
        <div className="flex gap-1">
          {(
            [
              ["all", "전체"],
              [1, "4년제(학사)"],
              [2, "전문대(전문학사)"],
            ] as const
          ).map(([k, l]) => (
            <button key={String(k)} aria-pressed={deg === k} className={`chip ${deg === k ? "chip-on" : ""}`} onClick={() => setDeg(k)}>
              {t(l)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-brand-200 bg-brand-50/60 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-sm font-bold text-brand-800">
          <MapPin className="h-4 w-4" /> {t("경남 소재 대학 {n}곳", { n: gn.length })}
        </div>
        {gn.length ? (
          <ul className="grid gap-2 md:grid-cols-2">
            {gn.map((r) => (
              <Row key={r.si} r={r} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600">{t("경남에는 이 학과가 개설된 대학이 없어요. 가까운 부산·울산·대구 지역 대학을 살펴보세요.")}</p>
        )}
      </div>

      <div className="mt-3 space-y-1.5">
        {sidos
          .filter((s) => s !== "경남")
          .map((sd) => {
            const list = bySido.get(sd)!;
            const open = openSido === sd;
            return (
              <div key={sd} className="rounded-xl border border-slate-200 bg-white">
                <button className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm" aria-expanded={open} onClick={() => setOpenSido(open ? null : sd)}>
                  <span className="font-semibold text-slate-800">{sidoL(sd)}</span>
                  <span className="text-xs text-slate-500">
                    {t("{n}개 대학", { n: list.length })} {open ? "▲" : "▼"}
                  </span>
                </button>
                {open && (
                  <ul className="grid gap-2 px-3 pb-3 md:grid-cols-2">
                    {list.map((r) => (
                      <Row key={r.si} r={r} />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
      </div>
      <p className="mt-3 text-[11px] text-slate-400">
        {t("출처: 한국대학교육협의회 전국대학별학과정보표준데이터({asOf} 기준, 공공데이터포털), 경상남도교육청 경남대입정보센터 대학정보. 학과명이 비슷한 학과를 함께 보여 줘요. 모집 여부와 정원은 각 대학 누리집에서 확인하세요.", { asOf: data.asOf || "2025" })}
      </p>
    </div>
  );
}
