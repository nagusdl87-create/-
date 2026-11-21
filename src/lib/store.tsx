"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ValueId } from "@/data/riasec";
import type { HsTypeId } from "@/data/jobs";
import { DEFAULT_TASKS, TERMS, type Term } from "@/data/plan";

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

export type AppState = {
  version: 1;
  profile: { name: string; school: string; grade: string };
  answers: Record<number, number>;
  values: ValueId[];
  strengths: string[];
  testDoneAt?: string;
  favorites: string[];
  hsQuiz: Record<number, number>;
  hsInterest: HsTypeId[];
  currentTerm: Term;
  tasks: Record<Term, Task[]>;
  goals: Goal[];
  logs: Log[];
  hypothesis: string;
};

const KEY = "myroad:v1";

export const uid = () => Math.random().toString(36).slice(2, 10);

export function initialState(): AppState {
  const tasks = Object.fromEntries(
    TERMS.map((t) => [t.id, DEFAULT_TASKS[t.id].map((text) => ({ id: uid(), text, done: false }))])
  ) as Record<Term, Task[]>;
  return {
    version: 1,
    profile: { name: "", school: "", grade: "1" },
    answers: {},
    values: [],
    strengths: [],
    favorites: [],
    hsQuiz: {},
    hsInterest: [],
    currentTerm: "1-1",
    tasks,
    goals: [],
    logs: [],
    hypothesis: "",
  };
}

function sanitize(raw: unknown): AppState {
  const base = initialState();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<AppState>;
  return {
    ...base,
    ...r,
    profile: { ...base.profile, ...(r.profile ?? {}) },
    tasks: { ...base.tasks, ...(r.tasks ?? {}) },
    version: 1,
  };
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

// 공유 링크용 인코딩 (서버 없이 URL 해시에 담음)
export function encodeShare(s: AppState): string {
  const slim = {
    p: s.profile,
    a: s.answers,
    v: s.values,
    st: s.strengths,
    f: s.favorites,
    hi: s.hsInterest,
    hq: s.hsQuiz,
    h: s.hypothesis,
    l: s.logs.slice(0, 10),
    g: s.goals,
    t: s.tasks,
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
      profile: o.p, answers: o.a, values: o.v, strengths: o.st, favorites: o.f,
      hsInterest: o.hi, hsQuiz: o.hq, hypothesis: o.h, logs: o.l, goals: o.g, tasks: o.t,
    });
  } catch {
    return null;
  }
}
