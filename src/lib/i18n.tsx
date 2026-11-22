"use client";

// 한국어/English 전환 (결정: 모든 내용 완전 영어)
// - 화면 문구: t("한국어 문구") → 영어 사전(src/i18n/en/*.ts)에 있으면 영어, 없으면 한국어 그대로.
// - 자료(직업·학과·과목 등): useEnData(() => import("@/i18n/data/…"))로 영어 자료를 필요할 때만 불러옴.
// - 한국어 사용자는 영어 사전·자료를 내려받지 않는다(동적 import).
// - 처음 그릴 때는 서버 HTML과 같게 한국어로 그리고, 화면이 붙은 뒤 영어로 바꾼다(화면 불일치 방지).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "ko" | "en";
// 번역이 끝나기 전에는 전환 버튼을 숨김. ?lang=en 으로 들어오면 그 브라우저에서 미리보기.
export const LANG_PUBLIC = false;
const KEY = "myroad:lang";
type Dict = Record<string, string>;

let dictPromise: Promise<Dict> | null = null;
const loadDict = () => (dictPromise ??= import("@/i18n/en").then((m) => m.EN as Dict));

type Ctx = { lang: Lang; setLang: (l: Lang) => void; dict: Dict | null; toggle: boolean };
const LangContext = createContext<Ctx>({ lang: "ko", setLang: () => {}, dict: null, toggle: LANG_PUBLIC });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ko");
  const [dict, setDict] = useState<Dict | null>(null);
  const [toggle, setToggle] = useState(LANG_PUBLIC);

  useEffect(() => {
    let saved: Lang = "ko";
    try { saved = (localStorage.getItem(KEY) as Lang) === "en" ? "en" : "ko"; } catch { /* ignore */ }
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "en" || q === "ko") { saved = q; try { localStorage.setItem(KEY, q); localStorage.setItem("myroad:lang-preview", "1"); } catch { /* ignore */ } }
    try { if (localStorage.getItem("myroad:lang-preview") === "1") setToggle(true); } catch { /* ignore */ }
    setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (lang === "en") loadDict().then(setDict).catch(() => setDict({}));
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch { /* ignore */ }
  }, []);

  const value = useMemo(() => ({ lang, setLang, dict, toggle }), [lang, setLang, dict, toggle]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** 화면 문구 번역. 변수는 {name} 자리표시: t("{n}개 직업", { n: 51 }) */
export function useT() {
  const { lang, dict } = useLang();
  return useCallback(
    (ko: string, vars?: Record<string, string | number>) => {
      let s = lang === "en" && dict && dict[ko] !== undefined ? dict[ko] : ko;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
      return s;
    },
    [lang, dict],
  );
}

/** 영어 자료 모듈을 영어 모드일 때만 불러온다. 한국어 모드나 불러오기 전에는 null. */
const dataCache = new Map<unknown, Promise<unknown>>();
export function useEnData<T>(loader: () => Promise<T>, key: string): T | null {
  const { lang } = useLang();
  const [mod, setMod] = useState<T | null>(null);
  useEffect(() => {
    if (lang !== "en") return setMod(null);
    if (!dataCache.has(key)) dataCache.set(key, loader());
    let on = true;
    (dataCache.get(key) as Promise<T>).then((m) => on && setMod(m)).catch(() => {});
    return () => { on = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, key]);
  return mod;
}

/** 머리글의 언어 전환 버튼 */
export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, toggle } = useLang();
  if (!toggle) return null;
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "ko" : "en")}
      className={`flex h-10 items-center rounded-full px-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 ${className}`}
      aria-label={lang === "en" ? "한국어: 한국어로 보기 (Korean)" : "English: view in English (영어로 보기)"}
      lang={lang === "en" ? "ko" : "en"}
    >
      {lang === "en" ? "한국어" : "English"}
    </button>
  );
}
