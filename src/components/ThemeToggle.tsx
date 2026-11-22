"use client";

// 화면 밝기: 기기 설정 따르기(기본) · 밝게 · 어둡게. 기기에만 저장(myroad:theme).
// 아이콘만으로는 뜻을 알기 어려워 "화면" 글자와 설명이 있는 선택 메뉴로 보여 준다.
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useEscape } from "./useEscape";

type Mode = "system" | "light" | "dark";
const KEY = "myroad:theme";
const OPTIONS: { m: Mode; label: string; desc: string; Icon: typeof Sun }[] = [
  { m: "system", label: "자동", desc: "휴대폰·컴퓨터 설정에 맞춰 바뀌어요", Icon: Monitor },
  { m: "light", label: "밝게", desc: "낮이나 밝은 곳에서 보기 좋아요", Icon: Sun },
  { m: "dark", label: "어둡게", desc: "밤에 눈이 덜 부시고 배터리도 아껴요", Icon: Moon },
];

export function applyTheme(m: Mode) {
  const dark = m === "dark" || (m === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

// <head>에서 그리기 전에 실행(깜빡임 방지)
export const THEME_INIT = `(function(){try{var m=localStorage.getItem("${KEY}")||"system";var d=m==="dark"||(m==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;

const read = (): Mode => { try { return (localStorage.getItem(KEY) as Mode) || "system"; } catch { return "system"; } };

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useEscape(close);

  useEffect(() => {
    setMode(read());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const on = () => { if (read() === "system") applyTheme("system"); };
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const pick = (m: Mode) => {
    setMode(m);
    try { localStorage.setItem(KEY, m); } catch { /* ignore */ }
    applyTheme(m);
    setOpen(false);
  };
  const cur = OPTIONS.find((o) => o.m === mode)!;

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`화면 밝기: ${cur.label} (바꾸기)`}
        className="flex h-10 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
      >
        <cur.Icon className="h-5 w-5" aria-hidden />
        <span className="hidden lg:inline">화면</span>
      </button>
      {open && (
        <div role="menu" aria-label="화면 밝기" className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-slate-200 bg-surface p-2 shadow-xl">
          <div className="px-2 pb-1.5 pt-1 text-xs font-semibold text-slate-500">화면 밝기</div>
          {OPTIONS.map(({ m, label, desc, Icon }) => (
            <button
              key={m}
              type="button"
              role="menuitemradio"
              aria-checked={mode === m}
              onClick={() => pick(m)}
              className={`flex w-full items-start gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-slate-50 ${mode === m ? "bg-brand-50" : ""}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${mode === m ? "text-brand-700" : "text-slate-500"}`} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-900">{label}</span>
                <span className="block text-xs text-slate-500">{desc}</span>
              </span>
              {mode === m && <Check className="mt-0.5 h-4 w-4 text-brand-700" aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
