"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useT } from "@/lib/i18n";

export function ScrollTop() {
  const t = useT();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="no-print fixed bottom-24 left-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md hover:text-brand-700 sm:bottom-8" aria-label={t("맨 위로")}>
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
