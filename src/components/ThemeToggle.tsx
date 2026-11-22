"use client";

// 화면 밝기: 시스템 설정 따르기(기본) → 밝게 → 어둡게. 기기에만 저장(myroad:theme).
import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type Mode = "system" | "light" | "dark";
const KEY = "myroad:theme";
const LABEL: Record<Mode, string> = { system: "화면 밝기: 기기 설정 따르기", light: "화면 밝기: 밝게", dark: "화면 밝기: 어둡게" };

export function applyTheme(m: Mode) {
  const dark = m === "dark" || (m === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

// <head>에서 그리기 전에 실행(깜빡임 방지)
export const THEME_INIT = `(function(){try{var m=localStorage.getItem("${KEY}")||"system";var d=m==="dark"||(m==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");
  useEffect(() => {
    let m: Mode = "system";
    try { m = (localStorage.getItem(KEY) as Mode) || "system"; } catch { /* ignore */ }
    setMode(m);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const on = () => { let cur: Mode = "system"; try { cur = (localStorage.getItem(KEY) as Mode) || "system"; } catch { /* ignore */ } if (cur === "system") applyTheme("system"); };
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const next = () => {
    const n: Mode = mode === "system" ? "light" : mode === "light" ? "dark" : "system";
    setMode(n);
    try { localStorage.setItem(KEY, n); } catch { /* ignore */ }
    applyTheme(n);
  };
  const Icon = mode === "dark" ? Moon : mode === "light" ? Sun : Monitor;
  return (
    <button type="button" onClick={next} className="grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100" aria-label={`${LABEL[mode]} (눌러서 바꾸기)`} title={LABEL[mode]}>
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}
