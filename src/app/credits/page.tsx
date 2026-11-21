"use client";

import { useEffect, useState } from "react";
import { CreditPlanner } from "@/components/CreditPlanner";
import { CreditStandards, CreditSystemGuide } from "@/components/CreditGuide";

type Tab = "plan" | "standards" | "system";

export default function CreditsPage() {
  const [tab, setTab] = useState<Tab>("plan");
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (h === "standards" || h === "system") setTab(h);
  }, []);
  return (
    <div>
      <div className="no-print mb-6 flex gap-1 overflow-x-auto rounded-xl bg-slate-200/60 p-1" role="tablist">
        {(
          [
            ["plan", "192학점 과목 설계"],
            ["standards", "192학점 이수 기준표"],
            ["system", "고교학점제 안내"],
          ] as const
        ).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`flex-1 shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold ${tab === k ? "bg-white shadow-sm" : "text-slate-500"}`}>
            {l}
          </button>
        ))}
      </div>
      {tab === "plan" && <CreditPlanner />}
      {tab === "standards" && <CreditStandards />}
      {tab === "system" && <CreditSystemGuide />}
    </div>
  );
}
