"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, FileText } from "lucide-react";
import { useT } from "@/lib/i18n";

type Row = [name: string, region: string, type: string, homepage: string, plan: string, susi: string];
const CHO = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const choOf = (s: string) => {
  const c = s.charCodeAt(0) - 0xac00;
  if (c < 0 || c > 11171) return "";
  const i = Math.floor(c / 588);
  return ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"][i].replace("ㄲ", "ㄱ").replace("ㄸ", "ㄷ").replace("ㅃ", "ㅂ").replace("ㅆ", "ㅅ").replace("ㅉ", "ㅈ");
};
const REGION_GROUP: Record<string, string> = { 서울: "서울", 경기: "경기·인천", 인천: "경기·인천", 경남: "부울경", 부산: "부울경", 울산: "부울경", 대구: "대구·경북", 경북: "대구·경북", 대전: "대전·충청·세종", 충남: "대전·충청·세종", 충북: "대전·충청·세종", 세종: "대전·충청·세종", 광주: "광주·전라", 전남: "광주·전라", 전북: "광주·전라", 강원: "강원·제주", 제주: "강원·제주" };

export function UnivDirectory() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [region, setRegion] = useState("전체");
  const [type, setType] = useState("4년제");
  const [cho, setCho] = useState("");
  const [q, setQ] = useState("");
  const [onlyPlan, setOnlyPlan] = useState(true);
  const t = useT();
  useEffect(() => {
    fetch("/data/univ-list.json").then((r) => r.json()).then((d) => setRows(d.rows)).catch(() => setRows([]));
  }, []);
  const list = useMemo(
    () =>
      (rows ?? [])
        .filter((r) => region === "전체" || (region === "경남" ? r[1] === "경남" : REGION_GROUP[r[1]] === region))
        .filter((r) => type === "전체" || r[2] === type)
        .filter((r) => !cho || choOf(r[0]) === cho)
        .filter((r) => !q.trim() || r[0].includes(q.trim()))
        .filter((r) => !onlyPlan || r[4])
        .sort((a, b) => (a[1] === "경남" ? -1 : 0) - (b[1] === "경남" ? -1 : 0) || a[0].localeCompare(b[0], "ko")),
    [rows, region, type, cho, q, onlyPlan]
  );
  if (!rows) return <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />;
  return (
    <div>
      <div className="card mb-3 space-y-2 p-4">
        <input className="input" placeholder={t("대학 이름 검색")} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t("대학 검색")} />
        <div className="flex flex-wrap gap-1.5">
          {["전체", "경남", "부울경", "서울", "경기·인천", "대구·경북", "대전·충청·세종", "광주·전라", "강원·제주"].map((r) => (
            <button key={r} aria-pressed={region === r} className={`chip ${region === r ? "chip-on" : ""}`} onClick={() => setRegion(r)}>
              {t(r)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {["4년제", "2/3년제", "전체"].map((k) => (
            <button key={k} aria-pressed={type === k} className={`chip ${type === k ? "chip-on" : ""}`} onClick={() => setType(k)}>
              {t(k)}
            </button>
          ))}
          <label className="chip cursor-pointer">
            <input type="checkbox" checked={onlyPlan} onChange={(e) => setOnlyPlan(e.target.checked)} className="accent-brand-600" /> {t("2028 기본계획 있는 대학만")}
          </label>
        </div>
        <div className="flex flex-wrap gap-1" data-keep-ko aria-label={t("대학 이름 첫 자음")} role="group">
          <button className={`chip ${cho === "" ? "chip-on" : ""}`} onClick={() => setCho("")}>{t("전체")}</button>
          {CHO.map((c) => (
            <button key={c} aria-pressed={cho === c} className={`chip w-8 justify-center ${cho === c ? "chip-on" : ""}`} onClick={() => setCho(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-2 text-sm text-slate-500">{t("{n}개 대학", { n: list.length })}</div>
      <ul className="grid gap-2 md:grid-cols-2">
        {list.map((r) => (
          <li key={r[0]} className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2.5 ${r[1] === "경남" ? "border-brand-200" : "border-slate-200"}`}>
            <div>
              <div className="font-semibold" data-keep-ko>{r[0]}</div>
              <div className="text-xs text-slate-500">
                {t(r[1])} · {r[2] ? t(r[2]) : "-"}
                {r[1] === "경남" && <b className="ml-1 text-brand-700">{t("경남")}</b>}
              </div>
            </div>
            <div className="flex gap-1">
              {r[4] && (
                <a className="chip" href={r[4]} target="_blank" rel="noreferrer">
                  <FileText className="h-3 w-3" /> {t("2028 기본계획")}
                </a>
              )}
              {r[3] && (
                <a className="chip" href={r[3]} target="_blank" rel="noreferrer">
                  {t("입학처")} <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-slate-400">{t("출처: 경상남도교육청 경남대입정보센터 연도별 대학정보(공공데이터포털). PDF는 경남대입정보센터에서 제공하는 각 대학의 「2028학년도 대학입학전형 기본계획」이에요. 세부 모집요강은 대학 입학처에서 확인하세요.")}</p>
    </div>
  );
}
