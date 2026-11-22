"use client";

// 헤더 「EN」 버튼: 지금 보고 있는 페이지의 영어 안내(다문화 학생·보호자용)를 대화 상자로 보여 준다.
// 내용은 src/data/englishGuide.ts (페이지마다 하나, npm run validate가 빠진 페이지를 잡아냄).
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Languages, X } from "lucide-react";
import { englishGuideFor } from "@/data/englishGuide";
import { useEscape } from "./useEscape";

export function EnglishGuideButton() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);
  openRef.current = open;
  // 닫으면 포커스를 「EN」 버튼으로 돌려준다(열려 있을 때만)
  const close = useCallback(() => {
    if (!openRef.current) return;
    setOpen(false);
    btn.current?.focus();
  }, []);
  useEscape(close);

  // 페이지가 바뀌면 닫기
  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Tab 순환(대화 상자 안에 포커스 가두기)
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", trap);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", trap); };
  }, [open]);

  const { guide: g } = englishGuideFor(path);

  return (
    <>
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="English guide (영어 안내)"
        title="English guide (영어 안내)"
        className="flex h-10 items-center gap-0.5 rounded-full px-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 sm:gap-1 sm:px-2"
      >
        <Languages className="h-5 w-5" aria-hidden />
        <span className="lg:hidden xl:inline">EN</span>
      </button>
      {/* 헤더의 backdrop-blur가 fixed 위치 기준을 바꾸므로 body로 옮겨 그린다 */}
      {open && createPortal(
        <div className="no-print fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-3 sm:p-4" onClick={close}>
          <div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="en-guide-title"
            lang="en"
            className="relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                  <Languages className="h-3.5 w-3.5" aria-hidden /> English guide for this page
                </div>
                <h2 id="en-guide-title" className="mt-1 text-lg font-bold text-slate-900">{g.title}</h2>
              </div>
              <button ref={closeBtn} type="button" onClick={close} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-600 hover:bg-slate-100" aria-label="Close (닫기)">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-slate-700">
              <p>{g.what}</p>
              <div>
                <h3 className="font-bold text-slate-900">How to use</h3>
                <ol className="mt-1 list-decimal space-y-1 pl-5">
                  {g.how.map((h) => <li key={h}>{h}</li>)}
                </ol>
              </div>
              {g.sections && (
                <div>
                  <h3 className="font-bold text-slate-900">Sections on this page</h3>
                  <dl className="mt-1 divide-y divide-slate-100">
                    {g.sections.map(([ko, en]) => (
                      <div key={ko} className="py-1.5">
                        <dt className="font-semibold text-slate-800" lang="ko">{ko}</dt>
                        <dd>{en}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              {g.terms && g.terms.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900">Key Korean words</h3>
                  <dl className="mt-1 grid gap-1.5">
                    {g.terms.map(([ko, en]) => (
                      <div key={ko} className="rounded-lg bg-slate-50 px-2.5 py-1.5">
                        <dt className="mr-1 inline font-semibold text-slate-800" lang="ko">{ko}</dt>
                        <dd className="inline"><span aria-hidden>= </span>{en}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
            <p className="border-t border-slate-200 px-5 py-3 text-xs leading-relaxed text-slate-500">
              This site is unofficial. It is not run by the Gyeongsangnam-do Office of Education. Always confirm dates and admission details with the school. To read the Korean text in English, use your browser&apos;s translate feature (Chrome, Edge, Samsung Internet or Safari).
            </p>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
