"use client";

import { useState } from "react";
import { uid, useStore, type Book } from "@/lib/store";
import { useT } from "@/lib/i18n";

export function BookLog() {
  const { state, update } = useStore();
  const t = useT();
  const empty = (): Book => ({ id: uid(), date: new Date().toISOString().slice(0, 10), title: "", author: "", why: "", quote: "", thought: "", link: "", next: "" });
  const [draft, setDraft] = useState<Book | null>(null);
  const F: [keyof Book, string, string, boolean][] = [
    ["why", t("이 책을 고른 이유"), t("진로·수업과 어떤 관련이 있나요?"), true],
    ["quote", t("기억에 남는 문장"), "", false],
    ["thought", t("생각과 느낌"), t("새롭게 알게 된 점, 생각이 바뀐 점"), true],
    ["link", t("진로·교과와의 연결"), t("예) 생명과학 ‘유전’ 단원, 희망 학과 생명공학과"), false],
    ["next", t("더 읽거나 탐구할 것"), "", false],
  ];
  if (draft) {
    return (
      <form
        className="card space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.title.trim()) return;
          update((s) => ({ ...s, books: s.books.some((b) => b.id === draft.id) ? s.books.map((b) => (b.id === draft.id ? draft : b)) : [draft, ...s.books] }));
          setDraft(null);
        }}
      >
        <h2 className="font-bold">{t("진로 연계 독서 기록")}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="bt">{t("책 제목 *")}</label>
            <input id="bt" className="input" required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength={80} />
          </div>
          <div>
            <label className="label" htmlFor="ba">{t("지은이")}</label>
            <input id="ba" className="input" value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} maxLength={40} />
          </div>
        </div>
        {F.map(([k, l, h, long]) => (
          <div key={k}>
            <label className="label" htmlFor={`b-${k}`}>{l}</label>
            {long ? (
              <textarea id={`b-${k}`} className="input min-h-[80px]" placeholder={h} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} maxLength={1000} />
            ) : (
              <input id={`b-${k}`} className="input" placeholder={h} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} maxLength={200} />
            )}
          </div>
        ))}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={() => setDraft(null)}>{t("취소")}</button>
          <button className="btn-primary">{t("저장")}</button>
        </div>
      </form>
    );
  }
  return (
    <div>
      <div className="no-print mb-4 flex gap-2">
        <button className="btn-primary" onClick={() => setDraft(empty())}>{t("+ 책 기록하기")}</button>
        {state.books.length > 0 && <button className="btn-ghost" onClick={() => window.print()}>{t("🖨️ 인쇄 / PDF")}</button>}
      </div>
      {state.books.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">{t("한 권의 책에서 진로를 넓혀 보세요. 고른 이유, 기억에 남는 문장, 생각의 변화, 진로·교과와의 연결을 기록해요.")}</p>
      ) : (
        <ul className="space-y-3">
          {state.books.map((b) => (
            <li key={b.id} className="card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold">{b.title} <span className="text-sm font-normal text-slate-500">{b.author}</span></div>
                  <div className="text-xs text-slate-400">{b.date}</div>
                </div>
                <div className="no-print flex gap-2 text-xs">
                  <button className="text-slate-500 hover:text-brand-600" onClick={() => setDraft(b)}>{t("수정")}</button>
                  <button className="text-slate-400 hover:text-rose-500" onClick={() => confirm(t("이 기록을 삭제할까요?")) && update((s) => ({ ...s, books: s.books.filter((x) => x.id !== b.id) }))}>{t("삭제")}</button>
                </div>
              </div>
              <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                {F.filter(([k]) => b[k]).map(([k, l]) => (
                  <div key={k} className="rounded-lg bg-slate-50 p-2.5">
                    <dt className="text-[11px] font-bold text-slate-500">{l}</dt>
                    <dd className="whitespace-pre-wrap">{b[k]}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
