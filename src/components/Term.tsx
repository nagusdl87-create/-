"use client";

// 화면 안의 낱말 풀이: 어려운 말을 누르면 그 자리에서 뜻이 나온다. 뜻은 src/data/glossary.ts(이용 안내와 같은 자료).
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { GLOSSARY_MAP } from "@/data/glossary";

export function Term({ id, children }: { id: string; children: React.ReactNode }) {
  const g = GLOSSARY_MAP[id];
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLSpanElement>(null);
  const pid = useId();
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  if (!g) return <>{children}</>;
  return (
    <span ref={box} className="relative inline">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? pid : undefined}
        onClick={() => setOpen((v) => !v)}
        className="cursor-help border-b border-dotted border-brand-600 font-semibold text-inherit hover:text-brand-700"
        title="누르면 뜻이 나와요"
      >
        {children}
      </button>
      {open && (
        <span id={pid} role="note" className="absolute left-0 top-full z-40 mt-1 block w-64 max-w-[80vw] rounded-xl border border-slate-200 bg-surface p-3 text-left text-xs font-normal leading-relaxed text-slate-700 shadow-lg">
          <b className="block text-brand-700">{g.w}</b>
          {g.d}
          <Link href="/help#words" className="mt-1 block font-semibold text-brand-700 underline">
            어려운 말 풀이 더 보기
          </Link>
        </span>
      )}
    </span>
  );
}
