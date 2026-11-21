"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { PageHead } from "@/components/ui";
import { PortfolioForm, decodePf } from "@/components/PortfolioForm";
import { BookLog } from "@/components/BookLog";
import { FORMS } from "@/data/portfolio";

type Tab = "activity" | "roadmap" | "reading";

export default function PortfolioPage() {
  const { state, update, ready } = useStore();
  const [tab, setTab] = useState<Tab>("activity");
  const [level, setLevel] = useState<"ms" | "hs">("ms");
  const [readMode, setReadMode] = useState<"pf" | "log">("pf");
  const [incoming, setIncoming] = useState<{ id: string; data: Record<string, string> } | null>(null);

  useEffect(() => {
    if (!ready) return;
    setLevel(state.profile.stage === "hs" ? "hs" : "ms");
    const m = window.location.hash.match(/^#pf=(.+)$/);
    if (m) setIncoming(decodePf(m[1]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (!ready) return <div className="h-96" />;

  const restore = () => {
    if (!incoming) return;
    const p = `pf.${incoming.id}.`;
    update((s) => {
      const rest = Object.fromEntries(Object.entries(s.portfolio).filter(([k]) => !k.startsWith(p)));
      for (const [k, v] of Object.entries(incoming.data)) rest[p + k] = v;
      return { ...s, portfolio: rest };
    });
    if (incoming.id === "roadmap") setTab("roadmap");
    else if (incoming.id === "reading") setTab("reading");
    else {
      setTab("activity");
      setLevel(incoming.id === "act-hs" ? "hs" : "ms");
    }
    setIncoming(null);
    history.replaceState(null, "", "/portfolio");
  };

  return (
    <div>
      <PageHead tone="coral" eyebrow="도구"
        title="진로 포트폴리오"
        desc="체험과 탐구를 질문과 성찰로 엮는 진로활동 포트폴리오, 3개년 학업을 설계하는 192학점 로드맵, 한 권의 책에서 진로를 넓히는 독서 포트폴리오를 작성하고 제출용 보고서로 인쇄·PDF 저장하세요."
      />
      {incoming && (
        <div className="card mb-4 flex flex-wrap items-center justify-between gap-2 border-sun-400 bg-sun-100/60">
          <span className="text-sm">
            이어쓰기 링크로 받은 <b>{FORMS[incoming.id].title}</b>이 있어요. 불러오면 이 기기의 같은 양식 내용이 바뀌어요.
          </span>
          <div className="flex gap-2">
            <button className="btn-primary py-2" onClick={restore}>불러오기</button>
            <button className="btn-ghost py-2" onClick={() => setIncoming(null)}>취소</button>
          </div>
        </div>
      )}
      <div className="no-print mb-4 grid grid-cols-3 gap-1 rounded-xl bg-slate-200/60 p-1" role="tablist">
        {(
          [
            ["activity", "진로활동"],
            ["roadmap", "192학점 로드맵"],
            ["reading", "진로 독서"],
          ] as const
        ).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-lg py-2 text-sm font-semibold ${tab === k ? "bg-white shadow-sm" : "text-slate-500"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "activity" && (
        <>
          <div className="no-print mb-3 flex gap-1.5">
            {(["ms", "hs"] as const).map((l) => (
              <button key={l} aria-pressed={level === l} className={`chip px-3 py-1.5 text-sm ${level === l ? "chip-on" : ""}`} onClick={() => setLevel(l)}>
                {l === "ms" ? "중학교 (4단계)" : "고등학교 (5단계)"}
              </button>
            ))}
          </div>
          <PortfolioForm formId={level === "hs" ? "act-hs" : "act-ms"} />
        </>
      )}
      {tab === "roadmap" && <PortfolioForm formId="roadmap" />}
      {tab === "reading" && (
        <>
          <div className="no-print mb-3 flex gap-1.5">
            <button aria-pressed={readMode === "pf"} className={`chip px-3 py-1.5 text-sm ${readMode === "pf" ? "chip-on" : ""}`} onClick={() => setReadMode("pf")}>
              독서 포트폴리오 (5단계)
            </button>
            <button aria-pressed={readMode === "log"} className={`chip px-3 py-1.5 text-sm ${readMode === "log" ? "chip-on" : ""}`} onClick={() => setReadMode("log")}>
              간단 독서 기록장 ({state.books.length})
            </button>
          </div>
          {readMode === "pf" ? <PortfolioForm formId="reading" /> : <BookLog />}
        </>
      )}
      <p className="no-print mt-6 text-xs text-slate-500">
        작성 내용은 이 기기의 브라우저에 실시간 자동 저장돼요. 학교 공용 PC는 재부팅하면 지워질 수 있으니 작성 후 인쇄/PDF로 저장하거나 ‘저장 / 이어쓰기’로 백업해 두세요.
      </p>
    </div>
  );
}
