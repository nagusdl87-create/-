"use client";

// 선생님 모아 보기 (결정 D6)
// 학생이 보낸 공유 링크·백업 파일을 이 기기의 화면(React 상태)에서만 모아 학급 현황을 보여 준다.
// 어떤 서버로도 보내지 않고, localStorage·sessionStorage에도 저장하지 않는다(새로고침하면 사라짐).
import { useMemo, useRef, useState } from "react";
import {
  ArrowDown, ArrowUp, ArrowUpDown, Download, ExternalLink, FileUp, Link2, Printer, ShieldCheck, Trash2, Users, X,
} from "lucide-react";
import { parseBackup } from "@/components/Backup";
import { decodeShare, encodeShare, initialState, SEMS, type AppState, type Book, type Goal, type Log, type Task } from "@/lib/store";
import { isTestComplete, progress, riasecScores, topTypes } from "@/lib/match";
import { analyze } from "@/lib/credits";
import { RIASEC, RIASEC_ORDER, type RiasecKey } from "@/data/riasec";
import { JOB_MAP } from "@/data/jobs";
import { MAJOR_MAP } from "@/data/majors";
import { GN_SCHOOLS } from "@/data/gn";
import { TRACKS, type TrackId } from "@/data/subjects";
import type { Term } from "@/data/plan";

/* ---------- 들어온 기록 다듬기 (store.tsx의 sanitize보다 엄격하게: 이상한 파일이 와도 화면이 멈추지 않도록) ---------- */

type Obj = Record<string, unknown>;
const isObj = (x: unknown): x is Obj => !!x && typeof x === "object" && !Array.isArray(x);
const str = (x: unknown) => (typeof x === "string" ? x : typeof x === "number" ? String(x) : "");
const strArr = (x: unknown) => (Array.isArray(x) ? x.filter((v): v is string => typeof v === "string") : []);
const numMap = (x: unknown) => {
  const out: Record<number, number> = {};
  if (isObj(x)) for (const [k, v] of Object.entries(x)) if (typeof v === "number" && Number.isFinite(v)) out[Number(k)] = v;
  return out;
};
function pick<T>(x: unknown, keys: string[], extra?: (o: Obj) => Partial<T>): T[] {
  if (!Array.isArray(x)) return [];
  return x.filter(isObj).map((o) => ({ ...Object.fromEntries(keys.map((k) => [k, str(o[k])])), ...(extra?.(o) ?? {}) }) as T);
}

function normalize(raw: unknown): AppState | null {
  if (!isObj(raw)) return null;
  const base = initialState();
  const p = isObj(raw.profile) ? raw.profile : {};
  const c = isObj(raw.credits) ? raw.credits : {};
  const plan = isObj(c.plan) ? c.plan : {};
  const extra = isObj(c.extra) ? c.extra : {};
  const tasks = { ...base.tasks };
  if (isObj(raw.tasks))
    for (const [k, v] of Object.entries(raw.tasks))
      if (Array.isArray(v)) tasks[k as Term] = pick<Task>(v, ["id", "text"], (o) => ({ done: o.done === true }));
  const picks: Record<string, string[]> = {};
  if (isObj(c.picks)) for (const [k, v] of Object.entries(c.picks)) picks[k] = strArr(v);
  const track = typeof c.track === "string" && c.track in TRACKS ? (c.track as TrackId) : "";
  const stage = p.stage === "ms" || p.stage === "hs" ? p.stage : "";
  const answers = numMap(raw.answers);
  return {
    ...base,
    profile: { name: str(p.name).trim(), school: str(p.school).trim(), grade: str(p.grade), stage: stage || (raw.version !== 2 && Object.keys(answers).length ? "ms" : ""), region: str(p.region), middle: str(p.middle) },
    answers,
    values: strArr(raw.values) as AppState["values"],
    strengths: strArr(raw.strengths),
    favorites: strArr(raw.favorites),
    favMajors: strArr(raw.favMajors),
    favSchools: strArr(raw.favSchools),
    hsQuiz: numMap(raw.hsQuiz),
    hsInterest: strArr(raw.hsInterest) as AppState["hsInterest"],
    tasks,
    goals: pick<Goal>(raw.goals, ["id", "term", "subject", "text"], (o) => ({ done: o.done === true })),
    logs: pick<Log>(raw.logs, ["id", "date", "title", "kind", "jobId", "why", "what", "learned", "next"]),
    books: pick<Book>(raw.books, ["id", "date", "title", "author", "why", "quote", "thought", "link", "next"]),
    hypothesis: str(raw.hypothesis),
    credits: {
      track,
      plan: Object.fromEntries(SEMS.map((s) => [s, strArr(plan[s])])) as AppState["credits"]["plan"],
      extra: Object.fromEntries(SEMS.map((s) => [s, strArr(extra[s])])) as AppState["credits"]["extra"],
      picks,
      curriculum: null, // 편제표는 모아 보기에 필요 없음(공유 링크 길이도 줄임)
      school: null, // 학교 개설 과목 선택(D4)도 모아 보기에는 필요 없음
    },
    grades: [],
    portfolio: {},
  };
}

/* ---------- 학생 한 명 → 표 한 줄 ---------- */

type Student = { key: string; code: string; state: AppState; source: string };
type Row = {
  key: string;
  code: string;
  source: string;
  name: string;
  school: string;
  stage: "ms" | "hs" | "";
  tested: boolean;
  top: RiasecKey[];
  jobs: string[];
  majors: string[];
  schools: string[];
  track: string;
  credits: number; // 교과 + 창체 18, 설계 없으면 0
  done: number;
};

const STAGE_LABEL = { ms: "중학교", hs: "고등학교", "": "미입력" } as const;

function toRow(st: Student, i: number): Row {
  const s = st.state;
  const tested = isTestComplete(s.answers);
  const planned = Object.values(s.credits.plan).flat().length > 0;
  const a = analyze(s.credits.plan, s.credits.track);
  const grade = s.profile.grade ? `${s.profile.grade}학년` : "";
  return {
    key: st.key,
    code: st.code,
    source: st.source,
    name: s.profile.name || `학생 ${i + 1}`,
    school: [s.profile.school, grade].filter(Boolean).join(" ") || "-",
    stage: s.profile.stage,
    tested,
    top: tested ? topTypes(riasecScores(s.answers), 2) : [],
    jobs: s.favorites.map((id) => JOB_MAP[id]?.name).filter((x): x is string => !!x),
    majors: s.favMajors.map((id) => MAJOR_MAP[id]?.name).filter((x): x is string => !!x),
    schools: s.favSchools.map((id) => GN_SCHOOLS.find((g) => g.id === id)?.name).filter((x): x is string => !!x),
    track: s.credits.track ? TRACKS[s.credits.track].name : "",
    credits: planned ? a.total + 18 : 0,
    done: progress(s).doneCount,
  };
}

type SortKey = "name" | "school" | "stage" | "top" | "jobs" | "majors" | "schools" | "credits" | "done";
const COLS: { key: SortKey; label: string; val: (r: Row) => string | number }[] = [
  { key: "name", label: "이름", val: (r) => r.name },
  { key: "school", label: "학교·학년", val: (r) => r.school },
  { key: "stage", label: "학교급", val: (r) => STAGE_LABEL[r.stage] },
  { key: "top", label: "흥미 유형", val: (r) => (r.top.length ? r.top.map((k) => RIASEC_ORDER.indexOf(k)).join("") : "9") },
  { key: "jobs", label: "관심 직업", val: (r) => r.jobs.length },
  { key: "majors", label: "관심 학과", val: (r) => r.majors.length },
  { key: "schools", label: "관심 고교", val: (r) => r.schools.length },
  { key: "credits", label: "학점 설계", val: (r) => r.credits },
  { key: "done", label: "진행 단계", val: (r) => r.done },
];

const topLabel = (r: Row) => (r.tested ? r.top.map((k) => RIASEC[k].name).join(" · ") : "검사 전");
const creditLabel = (r: Row) => (r.credits ? `${r.track ? `${r.track} · ` : ""}${r.credits}학점` : r.track ? `${r.track} · 설계 전` : "-");

/* ---------- 입력 읽기 ---------- */

const CODE_RE = /^[A-Za-z0-9_-]{16,}$/;
function codeFromLine(line: string): string | null {
  const m = line.match(/#d=([A-Za-z0-9_-]+)/);
  if (m) return m[1];
  return CODE_RE.test(line) ? line : null;
}

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const csvCell = (v: string | number) => {
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
function count(list: string[][]) {
  const m = new Map<string, number>();
  list.flat().forEach((x) => m.set(x, (m.get(x) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"));
}

type Msg = { ok: boolean; text: string };
type Incoming = { state: AppState; source: string; label: string } | { error: string };

export function TeacherBoard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [links, setLinks] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [drag, setDrag] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);
  const [stageFilter, setStageFilter] = useState<"all" | "ms" | "hs">("all");
  const fileRef = useRef<HTMLInputElement>(null);

  /** 새 기록들을 합친다. 똑같은 기록은 건너뛰고, 이름·학교·학년이 같으면 새 기록으로 바꾼다. */
  const latest = useRef<Student[]>([]);
  latest.current = students;
  const merge = (incoming: Incoming[]) => {
    const out: Msg[] = [];
    const next = [...latest.current];
    for (const it of incoming) {
      if ("error" in it) {
        out.push({ ok: false, text: it.error });
        continue;
      }
      const code = encodeShare(it.state);
      if (next.some((s) => s.key === code)) {
        out.push({ ok: false, text: `${it.label}: 이미 추가한 기록이라 건너뛰었어요.` });
        continue;
      }
      const p = it.state.profile;
      const idx = p.name ? next.findIndex((s) => s.state.profile.name === p.name && s.state.profile.school === p.school && s.state.profile.grade === p.grade) : -1;
      const st: Student = { key: code, code, state: it.state, source: it.source };
      if (idx >= 0) {
        next[idx] = st;
        out.push({ ok: true, text: `${it.label}: ${p.name} 학생의 기록을 새 내용으로 바꿨어요.` });
      } else {
        next.push(st);
        out.push({ ok: true, text: `${it.label}: ${p.name ? `${p.name} 학생` : "이름 없는 학생"}을 추가했어요.` });
      }
    }
    latest.current = next;
    setStudents(next);
    setMsgs(out);
  };

  const addLinks = () => {
    const lines = links.split(/\r?\n/).map((l) => l.trim());
    const incoming: Incoming[] = [];
    lines.forEach((line, i) => {
      if (!line) return;
      const label = `${i + 1}번째 줄`;
      const code = codeFromLine(line);
      if (!code) return incoming.push({ error: `${label}: 마이로드 공유 링크가 아니에요. ‘내 리포트 → 공유 링크 복사’로 만든 주소인지 확인해 주세요.` });
      const st = normalize(decodeShare(code));
      if (!st) return incoming.push({ error: `${label}: 링크가 잘렸거나 손상돼서 읽을 수 없어요. 학생에게 링크를 다시 받아 주세요.` });
      incoming.push({ state: st, source: "공유 링크", label });
    });
    if (!incoming.length) return setMsgs([{ ok: false, text: "공유 링크를 한 줄에 하나씩 붙여 넣어 주세요." }]);
    merge(incoming);
    if (incoming.some((it) => !("error" in it))) setLinks("");
  };

  const addFiles = async (files: FileList | File[] | null | undefined) => {
    const list = Array.from(files ?? []);
    if (!list.length) return;
    const incoming: Incoming[] = [];
    for (const f of list) {
      const label = f.name;
      if (f.size > 5 * 1024 * 1024) {
        incoming.push({ error: `${label}: 파일이 너무 커요(5MB 넘음). 마이로드 백업 파일인지 확인해 주세요.` });
        continue;
      }
      let text = "";
      try {
        text = await f.text();
      } catch {
        incoming.push({ error: `${label}: 파일을 열 수 없어요.` });
        continue;
      }
      const p = parseBackup(text);
      const st = p ? normalize(p.data) : null;
      if (!st) {
        incoming.push({ error: `${label}: 마이로드 백업 파일이 아니에요. ‘myroad-backup-날짜.json’ 파일을 골라 주세요.` });
        continue;
      }
      incoming.push({ state: st, source: "백업 파일", label });
    }
    merge(incoming);
  };

  const rows = useMemo(() => students.map(toRow), [students]);
  const shown = useMemo(() => {
    const r = rows.filter((x) => stageFilter === "all" || x.stage === stageFilter);
    if (!sort) return r;
    const col = COLS.find((c) => c.key === sort.key)!;
    return [...r].sort((a, b) => {
      const va = col.val(a), vb = col.val(b);
      const d = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "ko");
      return d * sort.dir;
    });
  }, [rows, sort, stageFilter]);

  const summary = useMemo(() => {
    const tested = shown.filter((r) => r.tested);
    const types = RIASEC_ORDER.map((k) => ({ k, n: tested.filter((r) => r.top[0] === k).length }));
    return {
      ms: shown.filter((r) => r.stage === "ms").length,
      hs: shown.filter((r) => r.stage === "hs").length,
      tested: tested.length,
      types,
      maxType: Math.max(1, ...types.map((t) => t.n)),
      jobs: count(shown.map((r) => r.jobs)).slice(0, 5),
      majors: count(shown.map((r) => r.majors)).slice(0, 5),
    };
  }, [shown]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s?.key !== key ? { key, dir: 1 } : s.dir === 1 ? { key, dir: -1 } : null));

  const downloadCsv = () => {
    const head = ["번호", "이름", "학교·학년", "학교급", "흥미 유형 1", "흥미 유형 2", "관심 직업", "관심 학과", "관심 고교", "학점 설계 계열", "학점 합계", "진행 단계(5단계 중)", "가져온 방법"];
    const body = shown.map((r, i) => [
      i + 1, r.name, r.school, STAGE_LABEL[r.stage],
      r.top[0] ? RIASEC[r.top[0]].name : r.tested ? "" : "검사 전", r.top[1] ? RIASEC[r.top[1]].name : "",
      r.jobs.join(" / "), r.majors.join(" / "), r.schools.join(" / "), r.track, r.credits || "", r.done, r.source,
    ]);
    const csv = "﻿" + [head, ...body].map((line) => line.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `myroad-class-${ymd(new Date())}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const clearAll = () => {
    if (!students.length) return;
    if (!window.confirm(`모아 둔 학생 ${students.length}명의 기록을 이 화면에서 모두 지울까요?`)) return;
    setStudents([]);
    setMsgs([{ ok: true, text: "모아 둔 기록을 모두 지웠어요." }]);
  };

  const remove = (key: string) => setStudents((prev) => prev.filter((s) => s.key !== key));

  return (
    <div className="space-y-6">
      <p className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="note">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <span>학생 기록은 이 기기의 화면에서만 처리하고 어디에도 저장·전송하지 않아요. 새로고침하면 사라져요. 학생에게 공유 동의를 받고 사용하세요.</span>
      </p>

      {/* 학생 추가 */}
      <section className="no-print grid gap-4 lg:grid-cols-2" aria-label="학생 기록 추가">
        <div className="card">
          <h2 className="flex items-center gap-2 font-bold"><Link2 className="h-4 w-4 text-brand-700" aria-hidden /> 공유 링크 붙여 넣기</h2>
          <p className="mt-1 text-sm text-slate-600">학생이 ‘내 리포트 → 공유 링크 복사’로 보낸 주소를 한 줄에 하나씩 붙여 넣어요. 여러 명을 한꺼번에 넣어도 돼요.</p>
          <label htmlFor="teacher-links" className="label mt-3">공유 링크 (한 줄에 하나)</label>
          <textarea
            id="teacher-links"
            className="input min-h-[7rem] font-mono text-xs"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            placeholder={"https://…/report#d=…\nhttps://…/report#d=…"}
            spellCheck={false}
          />
          <button className="btn-primary mt-3 w-full sm:w-auto" onClick={addLinks} disabled={!links.trim()}>
            <Users className="h-4 w-4" aria-hidden /> 링크로 학생 추가
          </button>
        </div>
        <div
          className={`card border-2 border-dashed transition ${drag ? "border-brand-500 bg-brand-50" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        >
          <h2 className="flex items-center gap-2 font-bold"><FileUp className="h-4 w-4 text-brand-700" aria-hidden /> 백업 파일 올리기</h2>
          <p className="mt-1 text-sm text-slate-600">학생이 ‘내 기록 백업’에서 내려받은 myroad-backup-날짜.json 파일을 여러 개 골라 올려요. 이 칸에 끌어다 놓아도 돼요.</p>
          <button className="btn-ghost mt-3 w-full sm:w-auto" onClick={() => fileRef.current?.click()}>
            <FileUp className="h-4 w-4" aria-hidden /> 백업 파일 고르기
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".json,application/json"
            className="hidden"
            aria-label="학생 백업 파일 선택 (여러 개 가능)"
            onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
          />
        </div>
      </section>

      {msgs.length > 0 && (
        <div className="no-print rounded-2xl border border-slate-200 bg-surface p-4" role="status" aria-live="polite">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold">가져오기 결과</h2>
            <button className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="결과 닫기" onClick={() => setMsgs([])}>
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <ul className="mt-1 space-y-0.5 text-sm">
            {msgs.map((m, i) => (
              <li key={i} className={m.ok ? "text-emerald-700" : "text-rose-600"}>{m.text}</li>
            ))}
          </ul>
        </div>
      )}

      {students.length === 0 ? (
        <div className="card text-center text-sm text-slate-500">
          아직 모은 학생이 없어요. 위에서 공유 링크를 붙여 넣거나 백업 파일을 올려 주세요.
        </div>
      ) : (
        <>
          {/* 도구 */}
          <div className="no-print flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="학교급으로 거르기">
              {([["all", "전체"], ["ms", "중학교"], ["hs", "고등학교"]] as const).map(([k, l]) => (
                <button key={k} className={`chip ${stageFilter === k ? "chip-on" : ""}`} aria-pressed={stageFilter === k} onClick={() => setStageFilter(k)}>
                  {l}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-ghost py-2" onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden /> 인쇄</button>
              <button className="btn-ghost py-2" onClick={downloadCsv}><Download className="h-4 w-4" aria-hidden /> CSV 내려받기</button>
              <button className="btn-ghost py-2 text-rose-600" onClick={clearAll}><Trash2 className="h-4 w-4" aria-hidden /> 모두 지우기</button>
            </div>
          </div>

          <div className="hidden print:block">
            <h1 className="text-xl font-bold">학급 진로 현황</h1>
            <p className="text-xs text-slate-500">{ymd(new Date())} · 마이로드 경남 선생님 모아 보기{stageFilter !== "all" && ` · ${STAGE_LABEL[stageFilter]}`}</p>
          </div>

          {/* 요약 */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4" aria-label="학급 요약">
            <div className="card">
              <h2 className="text-sm font-bold text-slate-600">학생 수</h2>
              <p className="mt-1 text-3xl font-bold text-slate-900">{shown.length}<span className="ml-0.5 text-base font-semibold">명</span></p>
              <p className="mt-1 text-xs text-slate-500">중학교 {summary.ms} · 고등학교 {summary.hs}{shown.length - summary.ms - summary.hs > 0 && ` · 미입력 ${shown.length - summary.ms - summary.hs}`}</p>
              <p className="text-xs text-slate-500">흥미 검사 완료 {summary.tested}명</p>
            </div>
            <div className="card">
              <h2 className="text-sm font-bold text-slate-600">흥미 유형 분포</h2>
              <p className="text-xs text-slate-500">검사를 마친 학생의 1순위 유형</p>
              <ul className="mt-2 space-y-1">
                {summary.types.map(({ k, n }) => (
                  <li key={k} className="flex items-center gap-2 text-xs">
                    <span className="w-12 shrink-0 text-slate-700">{RIASEC[k].name}</span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100" aria-hidden>
                      <span className="block h-full rounded-full" style={{ width: `${(n / summary.maxType) * 100}%`, background: RIASEC[k].color }} />
                    </span>
                    <span className="w-8 shrink-0 text-right font-semibold text-slate-700">{n}명</span>
                  </li>
                ))}
              </ul>
            </div>
            <TopList title="많이 고른 직업 TOP 5" items={summary.jobs} />
            <TopList title="많이 고른 학과 TOP 5" items={summary.majors} />
          </section>

          {/* 표 */}
          <section aria-label="학생별 현황">
            <div className="relative overflow-x-auto rounded-2xl border border-slate-200 bg-surface print:overflow-visible print:border-0">
              <table className="w-full min-w-[60rem] text-left text-sm print:min-w-0 print:text-[10px]">
                <caption className="sr-only">학생별 진로 현황. 열 제목을 누르면 정렬해요.</caption>
                <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-600">
                  <tr>
                    {COLS.map((c) => {
                      const on = sort?.key === c.key;
                      const Icon = !on ? ArrowUpDown : sort!.dir === 1 ? ArrowUp : ArrowDown;
                      return (
                        <th key={c.key} scope="col" className="whitespace-nowrap px-3 py-2 font-semibold" aria-sort={on ? (sort!.dir === 1 ? "ascending" : "descending") : "none"}>
                          <button className="inline-flex items-center gap-1 hover:text-slate-900" onClick={() => toggleSort(c.key)}>
                            {c.label}
                            <Icon className={`no-print h-3.5 w-3.5 ${on ? "text-brand-700" : "text-slate-400"}`} aria-hidden />
                          </button>
                        </th>
                      );
                    })}
                    <th scope="col" className="no-print px-3 py-2 font-semibold"><span className="sr-only">보기·빼기</span></th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => (
                    <tr key={r.key} className="border-b border-slate-100 align-top last:border-0">
                      <th scope="row" className="whitespace-nowrap px-3 py-2 font-semibold text-slate-900">
                        {r.name}
                        <div className="text-[11px] font-normal text-slate-400">{r.source}</div>
                      </th>
                      <td className="px-3 py-2">{r.school}</td>
                      <td className="whitespace-nowrap px-3 py-2">{STAGE_LABEL[r.stage]}</td>
                      <td className="whitespace-nowrap px-3 py-2">{r.tested ? topLabel(r) : <span className="text-slate-400">검사 전</span>}</td>
                      <td className="px-3 py-2"><ListCell items={r.jobs} /></td>
                      <td className="px-3 py-2"><ListCell items={r.majors} /></td>
                      <td className="px-3 py-2"><ListCell items={r.schools} /></td>
                      <td className="whitespace-nowrap px-3 py-2">{creditLabel(r)}</td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <span className="font-semibold">{r.done}</span>/5
                        <span className="mt-1 block h-1.5 w-14 overflow-hidden rounded-full bg-slate-100" aria-hidden>
                          <span className="block h-full rounded-full bg-brand-500" style={{ width: `${(r.done / 5) * 100}%` }} />
                        </span>
                      </td>
                      <td className="no-print whitespace-nowrap px-3 py-2">
                        <a
                          href={`/report#d=${r.code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
                          aria-label={`${r.name} 리포트 새 탭에서 보기`}
                        >
                          리포트 <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        </a>
                        <button className="ml-2 inline-grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-rose-600" aria-label={`${r.name} 빼기`} onClick={() => remove(r.key)}>
                          <X className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {shown.length === 0 && (
                    <tr><td colSpan={COLS.length + 1} className="px-3 py-6 text-center text-slate-500">이 학교급 학생이 없어요.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="no-print mt-2 text-xs text-slate-500">표가 화면보다 넓으면 옆으로 밀어서 볼 수 있어요. ‘리포트’를 누르면 그 학생의 리포트를 새 탭에서 읽기 전용으로 열어요(기록은 주소의 # 뒤에만 담겨 서버로 가지 않아요).</p>
          </section>
        </>
      )}
    </div>
  );
}

function ListCell({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-slate-400">-</span>;
  return <span className="block min-w-[7rem]">{items.join(", ")}</span>;
}

function TopList({ title, items }: { title: string; items: [string, number][] }) {
  return (
    <div className="card">
      <h2 className="text-sm font-bold text-slate-600">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-xs text-slate-500">아직 고른 학생이 없어요.</p>
      ) : (
        <ol className="mt-2 space-y-1 text-sm">
          {items.map(([name, n], i) => (
            <li key={name} className="flex items-baseline justify-between gap-2">
              <span className="min-w-0 truncate"><span className="mr-1.5 text-xs font-bold text-brand-700">{i + 1}</span>{name}</span>
              <span className="shrink-0 text-xs font-semibold text-slate-600">{n}명</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
