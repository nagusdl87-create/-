"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore, type Sem } from "@/lib/store";
import { SEM_LABEL } from "@/lib/credits";
import { SUBJECTS } from "@/data/subjects";
import { GN_SCHOOLS } from "@/data/gn";
import {
  curriculumCredits, decodeCurriculum, emptyCurriculum, encodeCurriculum, parseCurriculum, SAMPLE_CURRICULUM, SEM_KEYS,
  type CurrGroup, type CurrItem, type SchoolCurriculum,
} from "@/data/curriculum";
import { PageHead } from "@/components/ui";

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const gid = () => Math.random().toString(36).slice(2, 8);

export default function SchoolCurriculumPage() {
  const { state, update, ready } = useStore();
  const router = useRouter();
  const [draft, setDraft] = useState<SchoolCurriculum | null>(null);
  const [incoming, setIncoming] = useState<SchoolCurriculum | null>(null);
  const [sem, setSem] = useState<Sem>("2-1");
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ready || draft) return;
    setDraft(clone(state.credits.curriculum ?? emptyCurriculum(state.profile.school)));
    const m = window.location.hash.match(/^#c=(.+)$/);
    if (m) setIncoming(decodeCurriculum(m[1]));
  }, [ready, draft, state.credits.curriculum, state.profile.school]);

  if (!ready || !draft) return <div className="h-96" />;

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2500);
  };
  const edit = (fn: (c: SchoolCurriculum) => void) => setDraft((d) => {
    const c = clone(d!);
    fn(c);
    return c;
  });
  const s = draft.sems[sem];
  const cr = curriculumCredits(draft, sem);
  const total = SEM_KEYS.reduce((a, k) => a + curriculumCredits(draft, k).total, 0);

  const apply = (c: SchoolCurriculum) => {
    const parsed = parseCurriculum(c);
    if (!parsed) return flash("편제표 형식이 올바르지 않아요.");
    update((st) => {
      const valid = new Set(SEM_KEYS.flatMap((k) => parsed.sems[k].groups.map((g) => g.id)));
      const picks = Object.fromEntries(Object.entries(st.credits.picks).filter(([k]) => valid.has(k)));
      return { ...st, credits: { ...st.credits, curriculum: parsed, picks } };
    });
    router.push("/credits");
  };

  return (
    <div>
      <PageHead title="학교 편제표 등록" desc="내 학교의 학기별 지정 과목과 선택군(택N)을 입력하면, 192학점 설계가 실제 수강 신청처럼 바뀌어요. 한 사람이 입력해 공유 링크나 파일로 친구·학생들과 나눌 수 있어요." />

      {incoming && (
        <div className="card mb-4 flex flex-wrap items-center justify-between gap-2 border-amber-300 bg-amber-50">
          <div className="text-sm">
            📨 공유받은 편제표: <b>{incoming.school}</b> {incoming.year && `· ${incoming.year}`}
          </div>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={() => apply(incoming)}>이 편제표로 설계하기</button>
            <button className="btn-ghost" onClick={() => { setDraft(clone(incoming)); setIncoming(null); }}>편집해서 쓰기</button>
          </div>
        </div>
      )}

      <div className="card mb-4 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="cs">학교 이름</label>
          <input id="cs" className="input" list="gn-schools" value={draft.school} maxLength={40} onChange={(e) => edit((c) => (c.school = e.target.value))} placeholder="예) ○○고등학교" />
          <datalist id="gn-schools">
            {GN_SCHOOLS.map((g) => <option key={g.id} value={g.name} />)}
          </datalist>
        </div>
        <div>
          <label className="label" htmlFor="cy">기준 (입학 연도)</label>
          <input id="cy" className="input" value={draft.year} maxLength={30} onChange={(e) => edit((c) => (c.year = e.target.value))} placeholder="예) 2027학년도 입학생" />
        </div>
        <div className="flex items-end text-sm text-slate-600">
          3개년 합계 <b className="mx-1 text-brand-700">{total}</b>학점 (교과 기준 174 이상 권장)
        </div>
      </div>

      <div className="mb-3 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1" role="tablist">
        {SEM_KEYS.map((k) => (
          <button key={k} role="tab" aria-selected={sem === k} onClick={() => setSem(k)} className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold ${sem === k ? "bg-white shadow-sm" : "text-slate-500"}`}>
            {SEM_LABEL[k]} <span className="text-xs text-slate-400">{curriculumCredits(draft, k).total}</span>
          </button>
        ))}
      </div>

      <datalist id="subject-names">
        {SUBJECTS.map((x) => <option key={x.name} value={x.name} />)}
      </datalist>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">🔒 학교 지정 과목</h2>
            <span className="text-xs text-slate-500">{cr.fixed}학점</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">모든 학생이 듣는 과목이에요.</p>
          <ItemList items={s.fixed} onChange={(items) => edit((c) => (c.sems[sem].fixed = items))} />
        </section>

        <section className="card">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">🧩 선택군</h2>
            <span className="text-xs text-slate-500">{cr.groups}학점</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">“선택군 A 중 2과목”처럼 학생이 고르는 과목 묶음이에요.</p>
          <div className="mt-3 space-y-3">
            {s.groups.map((g, gi) => (
              <GroupEditor
                key={g.id}
                g={g}
                onChange={(ng) => edit((c) => (c.sems[sem].groups[gi] = ng))}
                onRemove={() => edit((c) => c.sems[sem].groups.splice(gi, 1))}
              />
            ))}
          </div>
          <button
            className="mt-3 w-full rounded-lg border-2 border-dashed border-slate-200 py-2 text-sm font-semibold text-slate-500 hover:border-brand-300 hover:text-brand-600"
            onClick={() => edit((c) => c.sems[sem].groups.push({ id: `${sem}-${gid()}`, label: `선택군 ${String.fromCharCode(65 + c.sems[sem].groups.length)}`, pick: 1, options: [] }))}
          >
            + 선택군 추가
          </button>
        </section>
      </div>

      <div className="card mt-4 flex flex-wrap gap-2">
        <button className="btn-primary" disabled={!draft.school.trim()} onClick={() => apply(draft)}>✅ 이 편제표로 설계하기</button>
        <button
          className="btn-ghost"
          onClick={async () => {
            const url = `${location.origin}/credits/school#c=${encodeCurriculum(draft)}`;
            try {
              await navigator.clipboard.writeText(url);
              flash("공유 링크를 복사했어요.");
            } catch {
              prompt("아래 링크를 복사하세요", url);
            }
          }}
        >
          🔗 공유 링크 복사
        </button>
        <button
          className="btn-ghost"
          onClick={() => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" }));
            a.download = `편제표-${draft.school || "학교"}.json`;
            a.click();
            URL.revokeObjectURL(a.href);
          }}
        >
          ⬇️ 파일로 저장
        </button>
        <button className="btn-ghost" onClick={() => fileRef.current?.click()}>⬆️ 파일 불러오기</button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              const c = parseCurriculum(JSON.parse(await f.text()));
              if (!c) throw new Error();
              setDraft(c);
              flash("편제표를 불러왔어요.");
            } catch {
              flash("올바른 편제표 파일이 아니에요.");
            }
            e.target.value = "";
          }}
        />
        <button className="btn-ghost" onClick={() => confirm("예시 편제표로 바꿀까요? 입력 중인 내용은 사라져요.") && setDraft(clone(SAMPLE_CURRICULUM))}>예시 불러오기</button>
        <button className="btn-ghost text-rose-600" onClick={() => confirm("편제표를 모두 비울까요?") && setDraft(emptyCurriculum(draft.school))}>비우기</button>
        {msg && <span className="self-center text-sm font-semibold text-emerald-600" role="status">{msg}</span>}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        편제표는 보통 학교 누리집의 ‘교육과정’ 게시판이나 입학 안내 자료에 있어요. 학교 교육과정은 바뀔 수 있으니 최종 수강 신청 전에 학교 안내를 꼭 확인하세요. 편제표와 설계 내용은 이 기기에만 저장돼요.{" "}
        <Link href="/credits" className="underline">192학점 설계로 돌아가기</Link>
      </p>
    </div>
  );
}

function ItemList({ items, onChange }: { items: CurrItem[]; onChange: (i: CurrItem[]) => void }) {
  const [name, setName] = useState("");
  const [credits, setCredits] = useState(4);
  return (
    <div className="mt-3">
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={it.name + i} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5 text-sm">
            <span className="flex-1 truncate">{it.name}</span>
            <select aria-label={`${it.name} 학점`} className="rounded border border-slate-200 bg-white text-xs" value={it.credits} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, credits: Number(e.target.value) } : x)))}>
              {[1, 2, 3, 4, 5, 6].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="text-xs text-slate-300 hover:text-rose-500" aria-label={`${it.name} 삭제`} onClick={() => onChange(items.filter((_, j) => j !== i))}>✕</button>
          </li>
        ))}
      </ul>
      <form
        className="mt-2 flex gap-1.5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          onChange([...items, { name: name.trim(), credits }]);
          setName("");
        }}
      >
        <input className="input py-1.5 text-sm" list="subject-names" placeholder="과목명 (목록에서 고르거나 직접 입력)" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} aria-label="과목명" />
        <select className="input w-16 px-1 py-1.5 text-sm" value={credits} onChange={(e) => setCredits(Number(e.target.value))} aria-label="학점">
          {[1, 2, 3, 4, 5, 6].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn-ghost shrink-0 px-3 py-1.5 text-xs">추가</button>
      </form>
    </div>
  );
}

function GroupEditor({ g, onChange, onRemove }: { g: CurrGroup; onChange: (g: CurrGroup) => void; onRemove: () => void }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <input className="input flex-1 py-1.5 text-sm" value={g.label} maxLength={30} onChange={(e) => onChange({ ...g, label: e.target.value })} aria-label="선택군 이름" />
        <label className="flex items-center gap-1 text-xs text-slate-600">
          택
          <select className="input w-16 px-1 py-1.5 text-sm" value={g.pick} onChange={(e) => onChange({ ...g, pick: Number(e.target.value) })} aria-label="고를 과목 수">
            {Array.from({ length: Math.max(1, g.options.length) }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <button className="text-xs text-rose-500" onClick={onRemove}>선택군 삭제</button>
      </div>
      <ItemList items={g.options} onChange={(options) => onChange({ ...g, options, pick: Math.min(g.pick, Math.max(1, options.length)) })} />
    </div>
  );
}
