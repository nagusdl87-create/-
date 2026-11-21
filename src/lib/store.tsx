"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ValueId } from "@/data/riasec";
import type { HsTypeId } from "@/data/jobs";
import type { TrackId } from "@/data/subjects";
import { DEFAULT_TASKS, TERMS, type Stage, type Term } from "@/data/plan";
import type { SchoolCurriculum } from "@/data/curriculum";

export type Task = { id: string; text: string; done: boolean };
export type Goal = { id: string; term: Term; subject: string; text: string; done: boolean };
export type Log = {
  id: string;
  date: string;
  title: string;
  kind: string;
  jobId?: string;
  why: string;
  what: string;
  learned: string;
  next: string;
};
export type Book = { id: string; date: string; title: string; author: string; why: string; quote: string; thought: string; link: string; next: string };
export type Sem = "1-1" | "1-2" | "2-1" | "2-2" | "3-1" | "3-2";
export type GradeRow = { id: string; sem: Sem; subject: string; credits: number; grade: number; ach: string };

export type AppState = {
  version: 2;
  profile: { name: string; school: string; grade: string; stage: Stage | ""; region: string; middle: string };
  answers: Record<number, number>;
  values: ValueId[];
  strengths: string[];
  testDoneAt?: string;
  favorites: string[];
  favMajors: string[];
  favSchools: string[];
  hsQuiz: Record<number, number>;
  hsInterest: HsTypeId[];
  currentTerm: Term;
  tasks: Record<Term, Task[]>;
  goals: Goal[];
  logs: Log[];
  books: Book[];
  hypothesis: string;
  credits: {
    track: TrackId | "";
    plan: Record<Sem, string[]>;
    curriculum: SchoolCurriculum | null; // 학교 편제표 (있으면 편제표 모드)
    picks: Record<string, string[]>; // 선택군 id → 고른 과목
    extra: Record<Sem, string[]>; // 편제표 외 추가 과목(공동교육과정 등)
  };
  grades: GradeRow[];
  portfolio: Record<string, string>;
};

const KEY = "myroad:v1";
export const SEMS: Sem[] = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2"];

export const uid = () => Math.random().toString(36).slice(2, 10);

const emptyPlan = () => Object.fromEntries(SEMS.map((s) => [s, [] as string[]])) as Record<Sem, string[]>;

export function initialState(): AppState {
  const tasks = Object.fromEntries(
    TERMS.map((t) => [t.id, DEFAULT_TASKS[t.id].map((text) => ({ id: uid(), text, done: false }))])
  ) as Record<Term, Task[]>;
  return {
    version: 2,
    profile: { name: "", school: "", grade: "1", stage: "", region: "", middle: "" },
    answers: {},
    values: [],
    strengths: [],
    favorites: [],
    favMajors: [],
    favSchools: [],
    hsQuiz: {},
    hsInterest: [],
    currentTerm: "1-1",
    tasks,
    goals: [],
    logs: [],
    books: [],
    hypothesis: "",
    credits: { track: "", plan: emptyPlan(), curriculum: null, picks: {}, extra: emptyPlan() },
    grades: [],
    portfolio: {},
  };
}

function sanitize(raw: unknown): AppState {
  const base = initialState();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<AppState> & { version?: number };
  const s: AppState = {
    ...base,
    ...r,
    profile: { ...base.profile, ...(r.profile ?? {}) },
    tasks: { ...base.tasks, ...(r.tasks ?? {}) },
    credits: {
      ...base.credits,
      ...(r.credits ?? {}),
      plan: { ...emptyPlan(), ...(r.credits?.plan ?? {}) },
      extra: { ...emptyPlan(), ...(r.credits?.extra ?? {}) },
      picks: r.credits?.picks ?? {},
      curriculum: r.credits?.curriculum ?? null,
    },
    version: 2,
  };
  // v1(중학생 전용) 데이터 이관
  if (r.version !== 2 && !s.profile.stage && (r.answers && Object.keys(r.answers).length)) s.profile.stage = "ms";
  return s;
}

type Ctx = {
  state: AppState;
  ready: boolean;
  update: (fn: (s: AppState) => AppState) => void;
  reset: () => void;
  replace: (s: unknown) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setState(sanitize(JSON.parse(saved)));
    } catch {
      /* 저장소를 쓸 수 없는 환경에서는 메모리 상태만 사용 */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, ready]);

  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), []);
  const reset = useCallback(() => setState(initialState()), []);
  const replace = useCallback((s: unknown) => setState(sanitize(s)), []);

  const value = useMemo(() => ({ state, ready, update, reset, replace }), [state, ready, update, reset, replace]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function toggleIn<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

// 공유 링크용 인코딩 (서버 없이 URL 해시에 담음)
export function encodeShare(s: AppState): string {
  const slim = {
    p: s.profile, a: s.answers, v: s.values, st: s.strengths, f: s.favorites, fm: s.favMajors, fs: s.favSchools,
    hi: s.hsInterest, hq: s.hsQuiz, h: s.hypothesis, l: s.logs.slice(0, 8), b: s.books.slice(0, 5), g: s.goals, t: s.tasks, c: s.credits,
  };
  const bytes = new TextEncoder().encode(JSON.stringify(slim));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeShare(code: string): AppState | null {
  try {
    const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const o = JSON.parse(new TextDecoder().decode(bytes));
    return sanitize({
      version: 2, profile: o.p, answers: o.a, values: o.v, strengths: o.st, favorites: o.f, favMajors: o.fm, favSchools: o.fs,
      hsInterest: o.hi, hsQuiz: o.hq, hypothesis: o.h, logs: o.l, books: o.b, goals: o.g, tasks: o.t, credits: o.c,
    });
  } catch {
    return null;
  }
}
