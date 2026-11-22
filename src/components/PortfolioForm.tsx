"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, FileText, Link2, Plus, Printer, RotateCcw, Save, Sparkles, Star, Trash2, Upload, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { EXAMPLES, FORMS, type Field, type FormDef, type Step } from "@/data/portfolio";
import { CreditPlanner } from "./CreditPlanner";
import { useEscape } from "./useEscape";
import { useEnData, useLang, useT } from "@/lib/i18n";

/** 포트폴리오 양식 문구 번역: 양식 영어 자료(STR) → 화면 사전(t) 순서. 저장 값은 한국어 그대로. */
export function usePfTr() {
  const t = useT();
  const en = useEnData(() => import("@/i18n/data/portfolio.en"), "portfolio");
  return useCallback((s: string, vars?: Record<string, string | number>) => (en?.STR[s] !== undefined ? en.STR[s] : t(s, vars)), [en, t]);
}
// "English (한국어)"의 괄호 속 한국어는 검사에서 제외(data-keep-ko)
function keepKo(s: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== "(") continue;
    let d = 0, j = i;
    for (; j < s.length; j++) { if (s[j] === "(") d++; else if (s[j] === ")" && --d === 0) break; }
    if (!/[가-힣]/.test(s.slice(i, j + 1))) { i = j; continue; }
    out.push(s.slice(last, i), <span key={i} data-keep-ko>{s.slice(i, j + 1)}</span>);
    last = j + 1;
    i = j;
  }
  return last ? [...out, s.slice(last)] : s;
}

const PREFIX = (id: string) => `pf.${id}.`;

export function encodePf(id: string, data: Record<string, string>) {
  const bytes = new TextEncoder().encode(JSON.stringify({ id, data }));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export function decodePf(code: string): { id: string; data: Record<string, string> } | null {
  try {
    const bin = atob(code.replace(/-/g, "+").replace(/_/g, "/"));
    const o = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
    if (!FORMS[o.id] || typeof o.data !== "object") return null;
    const data: Record<string, string> = {};
    for (const [k, v] of Object.entries(o.data)) if (typeof v === "string") data[k] = v.slice(0, 5000);
    return { id: o.id, data };
  } catch {
    return null;
  }
}

function useFormData(id: string) {
  const { state, update } = useStore();
  const p = PREFIX(id);
  const data = Object.fromEntries(Object.entries(state.portfolio).filter(([k]) => k.startsWith(p)).map(([k, v]) => [k.slice(p.length), v]));
  const set = (k: string, v: string) => update((s) => ({ ...s, portfolio: { ...s.portfolio, [p + k]: v } }));
  const replaceAll = (next: Record<string, string>) =>
    update((s) => {
      const rest = Object.fromEntries(Object.entries(s.portfolio).filter(([k]) => !k.startsWith(p)));
      for (const [k, v] of Object.entries(next)) rest[p + k] = v;
      return { ...s, portfolio: rest };
    });
  return { data, set, replaceAll };
}

const parseJSON = <T,>(v: string | undefined, d: T): T => {
  if (!v) return d;
  try {
    return JSON.parse(v) as T;
  } catch {
    return d;
  }
};

function leafFields(f: Field): Field[] {
  return f.t === "group" ? f.fields.flatMap(leafFields) : [f];
}
function filled(f: Field, data: Record<string, string>) {
  const v = data[f.k];
  if (!v) return false;
  if (f.t === "table" || f.t === "chips") return parseJSON<unknown[]>(v, []).length > 0;
  if (f.t === "rating") return Object.keys(parseJSON<Record<string, string>>(v, {})).length > 0;
  return v.trim().length > 0;
}
const stepNumber = (form: FormDef, si: number) => form.steps.slice(0, si + 1).filter((s) => s.numbered !== false).length;

function FieldInput({ f, data, set, num }: { f: Field; data: Record<string, string>; set: (k: string, v: string) => void; num?: string }) {
  const tr = usePfTr();
  const id = `f-${f.k}`;
  const v = data[f.k] ?? "";
  const Label = () => (
    <label htmlFor={id} className="label text-[0.8rem] text-slate-700">
      {num && <span className="mr-1.5 font-bold text-brand-700">{num}</span>}
      {keepKo(tr(f.label))}
    </label>
  );
  const ph = (x?: string) => (x ? tr(x) : x);
  switch (f.t) {
    case "group":
      return (
        <fieldset className="rounded-2xl border border-slate-200 p-4">
          <legend className="px-1 text-[0.8rem] font-semibold text-slate-700">
            {num && <span className="mr-1.5 font-bold text-brand-700">{num}</span>}
            {keepKo(tr(f.label))}
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {f.fields.map((x) => (
              <div key={x.k} className={x.t === "textarea" || x.t === "table" || x.t === "chips" || x.t === "suggest" ? "sm:col-span-2" : ""}>
                <FieldInput f={x} data={data} set={set} />
              </div>
            ))}
          </div>
        </fieldset>
      );
    case "text":
    case "date":
    case "time":
      return (
        <div>
          <Label />
          <input id={id} type={f.t === "text" ? "text" : f.t} className="input" value={v} placeholder={ph(f.ph)} maxLength={f.max ?? 200} onChange={(e) => set(f.k, e.target.value)} />
        </div>
      );
    case "textarea":
      return (
        <div>
          <Label />
          <textarea id={id} className="input min-h-[92px]" value={v} placeholder={ph(f.ph)} maxLength={f.max ?? 2000} onChange={(e) => set(f.k, e.target.value)} />
        </div>
      );
    case "select":
      return (
        <div>
          <Label />
          <select id={id} className="input" value={v} onChange={(e) => set(f.k, e.target.value)}>
            <option value="">{tr("선택")}</option>
            {f.options.map((o) => (
              <option key={o} value={o}>{tr(o)}</option>
            ))}
          </select>
          {f.etc && v === "기타" && <input className="input mt-2" placeholder={tr("직접 입력")} value={data[f.k + "Etc"] ?? ""} onChange={(e) => set(f.k + "Etc", e.target.value)} aria-label={tr("{label} 직접 입력", { label: tr(f.label) })} />}
        </div>
      );
    case "suggest":
      return (
        <div>
          <Label />
          <textarea id={id} className="input min-h-[64px]" value={v} placeholder={ph(f.ph) ?? tr("질문을 직접 쓰거나 아래에서 예시를 골라 고쳐 쓰세요")} onChange={(e) => set(f.k, e.target.value)} />
          <select className="input mt-1.5 py-1.5 text-xs text-slate-500" value="" onChange={(e) => e.target.value && set(f.k, e.target.value)} aria-label={tr("{label} 예시 질문 추천", { label: tr(f.label) })}>
            <option value="">{tr("💡 예시 질문 추천")}</option>
            {f.suggestions.map((s) => (
              <option key={s} value={tr(s)}>{tr(s)}</option>
            ))}
          </select>
        </div>
      );
    case "chips": {
      const arr = f.max === 1 ? (v ? [v] : []) : parseJSON<string[]>(v, []);
      const toggle = (o: string) => {
        if (f.max === 1) return set(f.k, v === o ? "" : o);
        const next = arr.includes(o) ? arr.filter((x) => x !== o) : f.max && arr.length >= f.max ? arr : [...arr, o];
        set(f.k, JSON.stringify(next));
      };
      return (
        <div role="group" aria-label={tr(f.label)}>
          <div className="label text-[0.8rem] text-slate-700">
            {num && <span className="mr-1.5 font-bold text-brand-700">{num}</span>}
            {keepKo(tr(f.label))}
            {f.max && f.max > 1 && <span className="ml-1 font-normal text-slate-400">({arr.length}/{f.max})</span>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {f.options.map((o) => (
              <button key={o} type="button" aria-pressed={arr.includes(o)} onClick={() => toggle(o)} className={`chip px-3 py-1.5 text-[0.8rem] ${arr.includes(o) ? "chip-on" : ""}`}>
                {tr(o)}
              </button>
            ))}
          </div>
        </div>
      );
    }
    case "table": {
      const rows = parseJSON<Record<string, string>[]>(v, []);
      const save = (r: Record<string, string>[]) => set(f.k, JSON.stringify(r));
      const empty = Object.fromEntries(f.cols.map((c) => [c.k, ""]));
      const list = rows.length ? rows : [empty];
      return (
        <div>
          <div className="label text-[0.8rem] text-slate-700">
            {num && <span className="mr-1.5 font-bold text-brand-700">{num}</span>}
            {tr(f.label)}
          </div>
          <div className="space-y-2">
            {list.map((r, ri) => (
              <div key={ri} className="flex items-start gap-2 rounded-xl bg-slate-50 p-2">
                <div className={`grid flex-1 gap-2 ${f.cols.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"} ${f.cols.length === 4 ? "lg:grid-cols-4" : ""}`}>
                  {f.cols.map((c) =>
                    c.type === "select" ? (
                      <select key={c.k} className="input py-2" value={r[c.k] ?? ""} aria-label={tr("{r}행 {label}", { r: ri + 1, label: tr(c.label) })} onChange={(e) => save(list.map((x, j) => (j === ri ? { ...x, [c.k]: e.target.value } : x)))}>
                        <option value="">{tr(c.label)}</option>
                        {c.options?.map((o) => (
                          <option key={o} value={o}>{tr(o)}</option>
                        ))}
                      </select>
                    ) : (
                      <input key={c.k} type={c.type === "date" ? "date" : "text"} className="input py-2" placeholder={tr(c.label)} aria-label={tr("{r}행 {label}", { r: ri + 1, label: tr(c.label) })} value={r[c.k] ?? ""} onChange={(e) => save(list.map((x, j) => (j === ri ? { ...x, [c.k]: e.target.value } : x)))} />
                    )
                  )}
                </div>
                <button type="button" className="mt-2 text-slate-300 hover:text-rose-500" aria-label={tr("{r}행 삭제", { r: ri + 1 })} onClick={() => save(list.filter((_, j) => j !== ri))}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="btn-ghost mt-2 py-1.5 text-xs" onClick={() => save([...list, empty])}>
            <Plus className="h-3.5 w-3.5" /> {tr(f.addLabel ?? "행 추가")}
          </button>
        </div>
      );
    }
    case "rating": {
      const val = parseJSON<Record<string, string>>(v, {});
      return (
        <div>
          <div className="label text-[0.8rem] text-slate-700">{tr(f.label)}</div>
          <ul className="space-y-2">
            {f.items.map((it) => (
              <li key={it} className="rounded-xl border border-slate-200 p-3">
                <div className="text-sm font-medium text-slate-800">{tr(it)}</div>
                <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label={tr(it)}>
                  {f.scale.map((s) => (
                    <button key={s} type="button" role="radio" aria-checked={val[it] === s} onClick={() => set(f.k, JSON.stringify({ ...val, [it]: s }))} className={`chip ${val[it] === s ? "chip-on" : ""}`}>
                      {tr(s)}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    case "stars": {
      const n = Number(v) || 0;
      return (
        <div>
          <div className="label text-[0.8rem] text-slate-700">
            {num && <span className="mr-1.5 font-bold text-brand-700">{num}</span>}
            {tr(f.label)}
          </div>
          <div className="flex gap-1" role="radiogroup" aria-label={tr(f.label)}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} type="button" role="radio" aria-checked={n === i} aria-label={tr("{n}점", { n: i })} onClick={() => set(f.k, String(i))}>
                <Star className={`h-7 w-7 ${i <= n ? "fill-sun-400 text-sun-500" : "text-slate-300"}`} />
              </button>
            ))}
          </div>
        </div>
      );
    }
    case "credits":
      return (
        <div className="-mx-2 sm:mx-0">
          <CreditPlanner embedded />
        </div>
      );
  }
}

function ReportValue({ f, data }: { f: Field; data: Record<string, string> }) {
  const tr = usePfTr();
  const v = data[f.k] ?? "";
  if (f.t === "chips") {
    const arr = f.max === 1 ? (v ? [v] : []) : parseJSON<string[]>(v, []);
    return <span>{arr.map((x) => tr(x)).join(", ") || "-"}</span>;
  }
  if (f.t === "select") return <span>{v === "기타" && data[f.k + "Etc"] ? `${tr("기타")}(${data[f.k + "Etc"]})` : (v && tr(v)) || "-"}</span>;
  if (f.t === "stars") return <span>{v ? "★".repeat(Number(v)) + "☆".repeat(5 - Number(v)) : "-"}</span>;
  if (f.t === "table") {
    const rows = parseJSON<Record<string, string>[]>(v, []).filter((r) => Object.values(r).some((x) => x));
    if (!rows.length) return <span>-</span>;
    return (
      <table className="mt-1 w-full border-collapse text-left text-[0.8rem]">
        <thead>
          <tr>
            {f.cols.map((c) => (
              <th key={c.k} className="border border-slate-300 bg-slate-50 px-2 py-1 font-semibold">
                {tr(c.label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {f.cols.map((c) => (
                <td key={c.k} className="border border-slate-300 px-2 py-1 align-top">
                  {(r[c.k] && (c.type === "select" ? tr(r[c.k]) : r[c.k])) || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  if (f.t === "rating") {
    const val = parseJSON<Record<string, string>>(v, {});
    return (
      <ul className="mt-1 grid gap-1 sm:grid-cols-2">
        {f.items.map((it) => (
          <li key={it} className="flex justify-between gap-2 rounded bg-slate-50 px-2 py-1 text-[0.8rem]">
            <span>{tr(it)}</span>
            <b>{val[it] ? tr(val[it]) : "-"}</b>
          </li>
        ))}
      </ul>
    );
  }
  return <span className="whitespace-pre-wrap">{v || "-"}</span>;
}

function ReportField({ f, data, num }: { f: Field; data: Record<string, string>; num?: string }) {
  const tr = usePfTr();
  if (f.t === "credits") return <CreditsReport />;
  if (f.t === "group")
    return (
      <div className="break-inside-avoid">
        <div className="text-[0.85rem] font-semibold text-slate-800">
          {num && <span className="mr-1 text-brand-700">{num}</span>}
          {keepKo(tr(f.label))}
        </div>
        <dl className="mt-1 grid gap-x-4 gap-y-1 pl-3 sm:grid-cols-2">
          {f.fields.map((x) => (
            <div key={x.k} className={x.t === "textarea" || x.t === "table" ? "sm:col-span-2" : ""}>
              <dt className="text-[0.75rem] text-slate-500">{keepKo(tr(x.label))}</dt>
              <dd className="text-[0.85rem]">
                <ReportValue f={x} data={data} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  return (
    <div className="break-inside-avoid">
      <div className="text-[0.85rem] font-semibold text-slate-800">
        {num && <span className="mr-1 text-brand-700">{num}</span>}
        {keepKo(tr(f.label))}
      </div>
      <div className="pl-3 text-[0.85rem] text-slate-800">
        <ReportValue f={f} data={data} />
      </div>
    </div>
  );
}

function CreditsReport() {
  const { state } = useStore();
  const tr = usePfTr();
  const plan = state.credits.plan;
  const sems = Object.keys(plan) as (keyof typeof plan)[];
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {sems.map((s) => (
        <div key={s} className="rounded border border-slate-300 p-2 text-[0.8rem]">
          <b>{tr(`${s[0]}학년 ${s[2]}학기`)}</b>
          <div>{plan[s].map((e) => e.split("|")[0]).join(", ") || "-"}</div>
        </div>
      ))}
    </div>
  );
}

function SaveModal({ form, data, onClose, onRestore }: { form: FormDef; data: Record<string, string>; onClose: () => void; onRestore: (d: Record<string, string>) => void }) {
  const [msg, setMsg] = useState("");
  const tr = usePfTr();
  const fileRef = useRef<HTMLInputElement>(null);
  useEscape(onClose);
  return (
    <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-3xl" role="dialog" aria-modal="true" aria-label={tr("저장 / 이어쓰기")} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{tr("저장 / 이어쓰기")}</h2>
          <button onClick={onClose} aria-label={tr("닫기")} className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-sm text-slate-500">{tr("작성 내용은 이 기기에 자동 저장돼요. 다른 기기에서 이어 쓰려면 아래 방법을 쓰세요.")}</p>
        <div className="mt-4 space-y-2">
          <button
            className="btn-ghost w-full justify-start"
            onClick={() => {
              const a = document.createElement("a");
              a.href = URL.createObjectURL(new Blob([JSON.stringify({ id: form.id, data }, null, 2)], { type: "application/json" }));
              a.download = `${tr(form.title)}.json`;
              a.click();
              URL.revokeObjectURL(a.href);
            }}
          >
            <Download className="h-4 w-4" /> {tr("백업 파일 저장")}
          </button>
          <button className="btn-ghost w-full justify-start" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> {tr("백업 파일로 복원")}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                const o = JSON.parse(await f.text());
                if (o.id !== form.id || typeof o.data !== "object") throw new Error();
                onRestore(o.data);
                setMsg(tr("복원했어요."));
              } catch {
                setMsg(tr("이 양식의 백업 파일이 아니에요."));
              }
              e.target.value = "";
            }}
          />
          <button
            className="btn-ghost w-full justify-start"
            onClick={async () => {
              const url = `${location.origin}/portfolio#pf=${encodePf(form.id, data)}`;
              try {
                await navigator.clipboard.writeText(url);
                setMsg(tr("이어쓰기 링크를 복사했어요. 메일이나 학급 게시판에 붙여 넣어 보세요."));
              } catch {
                prompt(tr("아래 링크를 복사하세요"), url);
              }
            }}
          >
            <Link2 className="h-4 w-4" /> {tr("이어쓰기 링크 복사")}
          </button>
        </div>
        {msg && (
          <p className="mt-3 text-sm font-medium text-brand-700" role="status">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

export function PortfolioForm({ formId }: { formId: string }) {
  const form = FORMS[formId];
  const { state } = useStore();
  const tr = usePfTr();
  const { lang } = useLang();
  const exEn = useEnData(() => import("@/i18n/data/portfolio.en"), "portfolio");
  const { data, set, replaceAll } = useFormData(formId);
  const [si, setSi] = useState(0);
  const [report, setReport] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setSi(0);
    setReport(false);
  }, [formId]);

  const allLeaves = form.steps.flatMap((s) => s.fields.flatMap(leafFields)).filter((f) => f.t !== "credits");
  const done = allLeaves.filter((f) => filled(f, data)).length;
  const step: Step = form.steps[si];
  const sn = step.numbered === false ? null : stepNumber(form, si);

  const toolbar = (
    <div className="no-print flex flex-wrap gap-2">
      <button
        className="btn-ghost py-2"
        onClick={() => {
          if (done && !confirm(tr("작성 중인 내용을 예시로 바꿀까요?"))) return;
          replaceAll({ ...(EXAMPLES[formId] ?? {}), ...(lang === "en" ? exEn?.EXAMPLES_EN[formId] ?? {} : {}) });
        }}
      >
        <Sparkles className="h-4 w-4" /> {tr("예시 불러오기")}
      </button>
      <button className="btn-ghost py-2" onClick={() => confirm(tr("이 포트폴리오의 내용을 모두 지울까요?")) && replaceAll({})}>
        <RotateCcw className="h-4 w-4" /> {tr("초기화")}
      </button>
      <button className="btn-ghost py-2" onClick={() => setReport(!report)}>
        <FileText className="h-4 w-4" /> {report ? tr("작성 화면") : tr("제출용 보고서")}
      </button>
      <button className="btn-ghost py-2" onClick={() => (report ? window.print() : (setReport(true), setTimeout(() => window.print(), 300)))}>
        <Printer className="h-4 w-4" /> {tr("인쇄 / PDF")}
      </button>
      <button className="btn-primary py-2" onClick={() => setSaving(true)}>
        <Save className="h-4 w-4" /> {tr("저장 / 이어쓰기")}
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-500">
          {tr("작성")} <b className="text-slate-800">{done}</b> / {allLeaves.length}
          <div className="mt-1 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${(done / Math.max(1, allLeaves.length)) * 100}%` }} />
          </div>
        </div>
        {toolbar}
      </div>

      {report ? (
        <article className="card space-y-5 print:border-0 print:p-0">
          <header className="border-b-2 border-slate-900 pb-2">
            <div className="text-xs font-semibold text-brand-700">{tr(form.title)}</div>
            <h2 className="text-xl font-bold">{tr(form.subtitle)}</h2>
            <div className="text-sm text-slate-500">{[data.school, data.name || state.profile.name].filter(Boolean).join(" · ")}</div>
          </header>
          {form.steps.map((s, i) => {
            const n = s.numbered === false ? null : stepNumber(form, i);
            return (
              <section key={s.title} className="space-y-2">
                <h3 className="rounded bg-slate-100 px-2 py-1 text-sm font-bold">
                  {n ? tr("[{n}단계] ", { n }) : ""}
                  {tr(s.title)} <span className="font-normal text-slate-500">· {tr(s.sub)}</span>
                </h3>
                <div className="grid gap-2 pl-1">
                  {s.fields.map((f, fi) => (
                    <ReportField key={f.k} f={f} data={data} num={n ? `${n}-${fi + 1}` : undefined} />
                  ))}
                </div>
              </section>
            );
          })}
          <footer className="grid grid-cols-2 gap-6 pt-6 text-sm">
            <div className="border-t border-slate-400 pt-2">{tr("학생 확인 (인)")}</div>
            <div className="border-t border-slate-400 pt-2">{tr("지도교사 확인 (인)")}</div>
          </footer>
        </article>
      ) : (
        <div className="card">
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-2" role="tablist">
            {form.steps.map((s, i) => {
              const n = s.numbered === false ? null : stepNumber(form, i);
              const leaves = s.fields.flatMap(leafFields).filter((f) => f.t !== "credits");
              const complete = leaves.length > 0 && leaves.every((f) => filled(f, data));
              return (
                <button key={s.title} role="tab" aria-selected={i === si} onClick={() => setSi(i)} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${i === si ? "bg-brand-600 text-white" : complete ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-500"}`}>
                  {n ? tr("{n}단계 · ", { n }) : ""}
                  {tr(s.title)}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold">
              {sn ? tr("{n}단계 · ", { n: sn }) : ""}
              {tr(step.title)} <span className="text-sm font-normal text-slate-500">{tr(step.sub)}</span>
            </h2>
            <span className="text-xs text-slate-400">
              {si + 1} / {form.steps.length}
            </span>
          </div>
          {step.question && <p className="mt-1 rounded-xl bg-brand-50 px-3 py-2 text-sm font-medium text-brand-800">❓ {tr(step.question)}</p>}
          <div className={`mt-4 ${step.numbered === false && step.fields.length > 3 ? "grid gap-3 sm:grid-cols-2" : "space-y-4"}`}>
            {step.fields.map((f, fi) => (
              <div key={f.k} className={step.numbered === false && (f.t === "chips" || f.t === "textarea" || f.t === "rating") ? "sm:col-span-2" : ""}>
                <FieldInput f={f} data={data} set={set} num={sn ? `${sn}-${fi + 1}` : undefined} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <button className="btn-ghost" disabled={si === 0} onClick={() => setSi(si - 1)}>
              <ChevronLeft className="h-4 w-4" /> {tr("이전")}
            </button>
            {si < form.steps.length - 1 ? (
              <button className="btn-primary" onClick={() => setSi(si + 1)}>
                {tr("다음")} <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button className="btn-primary" onClick={() => setReport(true)}>
                {tr("작성 완료! 제출용 보고서 보기")}
              </button>
            )}
          </div>
        </div>
      )}
      {saving && <SaveModal form={form} data={data} onClose={() => setSaving(false)} onRestore={replaceAll} />}
    </div>
  );
}
