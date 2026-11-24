"use client";

// 교사·관리자 열람 (로그인 기반) — 학생이 '교사·관리자에게 공개'를 켠 포트폴리오만 읽는다.
// 마스터는 관리자(교사)를 지정·회수할 수 있다. 불러온 기록은 이 화면의 메모리에만 두고, 저장·전송하지 않는다.
// 분석·세특 초안은 이 기기 안의 규칙으로만 만든다(외부 AI 없음). 규칙은 firestore.rules, 설명은 /privacy.
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ClipboardCopy, LogIn, Printer, RefreshCw, ShieldCheck, ShieldPlus, UserMinus, UserPlus } from "lucide-react";
import { useCloud } from "@/lib/cloud";
import { grantAdmin, loadAdmins, loadMembers, loadSharedPage, revokeAdmin, type AdminRec, type Member, type SharedStudent } from "@/lib/staff";
import { filterByText, mergePage } from "@/lib/pager";
import { analyzeStudent, draftSetuk } from "@/lib/staffAnalysis";
import { useCatalog } from "@/lib/catalog";
import { ReportBody } from "@/components/ReportBody";
import { FORMS, type Field } from "@/data/portfolio";
import type { AppState } from "@/lib/store";
import { useLang, useT } from "@/lib/i18n";

export function StaffPanel() {
  const c = useCloud();
  const t = useT();
  if (!c.teacherFeature) return null;

  return (
    <section className="space-y-4" aria-label={t("로그인한 학생 열람")}>
      <div className="no-print rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-slate-800">
        <h2 className="flex items-center gap-2 font-bold"><ShieldCheck className="h-4 w-4 text-brand-700" aria-hidden /> {t("로그인한 학생의 포트폴리오 보기")}</h2>
        <p className="mt-1">{t("학생이 계정 화면에서 ‘교사·관리자에게 내 포트폴리오 공개’를 직접 켠 경우에만 목록에 나와요. 학생이 끄면 바로 보이지 않아요. 열람은 읽기만 가능하고, 불러온 내용은 이 화면에만 있다가 새로고침하면 사라져요.")}</p>
        <p className="mt-1 text-xs text-slate-600">{t("학생 기록은 학생의 동의를 받은 상담·지도 목적으로만 보고, 인쇄물은 안전하게 보관·파기해 주세요.")}</p>
      </div>

      {!c.user ? (
        <div className="no-print card text-sm">
          <p>{t("교사·관리자 권한이 있는 구글 계정으로 로그인해 주세요.")}</p>
          <Link href="/account" className="btn-primary mt-3 inline-flex"><LogIn className="h-4 w-4" aria-hidden /> {t("로그인하러 가기")}</Link>
        </div>
      ) : c.role === "none" ? (
        <div className="no-print card text-sm">
          <p className="font-semibold">{t("이 계정에는 교사·관리자 권한이 없어요.")}</p>
          <p className="mt-1 text-slate-600">{t("마스터(최고 권한자)에게 이 계정의 관리자 지정을 요청해 주세요. 지정되면 다시 로그인하거나 새로고침해 주세요.")}</p>
        </div>
      ) : (
        <>
          {c.role === "master" && <AdminManager myEmail={c.user.email} />}
          <StudentViewer />
        </>
      )}
    </section>
  );
}

/* ---------- 마스터: 관리자 지정·회수 ---------- */

function AdminManager({ myEmail }: { myEmail: string }) {
  const t = useT();
  const [members, setMembers] = useState<Member[]>([]);
  const [admins, setAdmins] = useState<AdminRec[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setBusy(true);
    setMsg("");
    try {
      const [m, a] = await Promise.all([loadMembers(), loadAdmins()]);
      setMembers(m);
      setAdmins(a);
    } catch {
      setMsg(t("목록을 불러오지 못했어요. 규칙 게시와 로그인 상태를 확인해 주세요."));
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const adminIds = useMemo(() => new Set(admins.map((a) => a.uid)), [admins]);
  const cand = members
    .filter((m) => !adminIds.has(m.uid) && m.email !== myEmail)
    .filter((m) => !q.trim() || (m.email + " " + m.name).toLowerCase().includes(q.trim().toLowerCase()))
    .slice(0, 20);

  const act = async (f: () => Promise<void>, ok: string) => {
    setBusy(true);
    try {
      await f();
      setMsg(ok);
      setAdmins(await loadAdmins());
    } catch {
      setMsg(t("저장하지 못했어요. 잠시 후 다시 시도해 주세요."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="no-print card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-bold"><ShieldPlus className="h-4 w-4 text-brand-700" aria-hidden /> {t("관리자(교사) 지정 · 마스터 전용")}</h2>
        <button className="btn-ghost py-1.5" onClick={load} disabled={busy}><RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} aria-hidden /> {t("목록 새로고침")}</button>
      </div>
      <p className="mt-1 text-sm text-slate-600">{t("이 사이트에 로그인한 적이 있는 사용자 중에서 고를 수 있어요. 관리자는 학생이 공개를 켠 포트폴리오를 읽을 수만 있고, 다른 관리자를 지정할 수는 없어요.")}</p>

      <h3 className="mt-4 text-sm font-bold">{t("현재 관리자 {n}명", { n: admins.length })}</h3>
      {admins.length === 0 ? (
        <p className="mt-1 text-sm text-slate-500">{t("아직 없어요.")}</p>
      ) : (
        <ul className="mt-1 divide-y divide-slate-100 text-sm">
          {admins.map((a) => (
            <li key={a.uid} className="flex items-center justify-between gap-2 py-1.5">
              <span className="min-w-0 truncate"><b>{a.name || t("이름 없음")}</b> <span className="text-slate-500">{a.email}</span></span>
              <button
                className="btn-ghost py-1 text-rose-600"
                disabled={busy}
                onClick={() => window.confirm(t("{who}의 관리자 권한을 회수할까요? 바로 학생 목록을 볼 수 없게 돼요.", { who: a.name || a.email })) && act(() => revokeAdmin(a.uid), t("관리자 권한을 회수했어요."))}
              >
                <UserMinus className="h-4 w-4" aria-hidden /> {t("회수")}
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3 className="mt-4 text-sm font-bold">{t("관리자로 지정할 사용자 찾기")}</h3>
      <label htmlFor="admin-q" className="label mt-1">{t("이메일 또는 이름")}</label>
      <input id="admin-q" className="input sm:max-w-sm" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      <ul className="mt-2 divide-y divide-slate-100 text-sm">
        {cand.map((m) => (
          <li key={m.uid} className="flex items-center justify-between gap-2 py-1.5">
            <span className="min-w-0 truncate"><b>{m.name || t("이름 없음")}</b> <span className="text-slate-500">{m.email}</span></span>
            <button
              className="btn-ghost py-1"
              disabled={busy}
              onClick={() => window.confirm(t("{who}을(를) 관리자(교사)로 지정할까요? 학생이 공개한 포트폴리오를 읽을 수 있게 돼요.", { who: m.email })) && act(() => grantAdmin(m, myEmail), t("관리자로 지정했어요."))}
            >
              <UserPlus className="h-4 w-4" aria-hidden /> {t("관리자로 지정")}
            </button>
          </li>
        ))}
        {cand.length === 0 && <li className="py-2 text-slate-500">{t("지정할 수 있는 사용자가 없어요. 대상이 먼저 이 사이트에 로그인해야 목록에 나와요.")}</li>}
      </ul>
      <p className="mt-2 min-h-[1.25rem] text-sm font-semibold text-emerald-700" role="status" aria-live="polite">{msg}</p>
    </div>
  );
}

/* ---------- 학생 목록 · 열람 · 인쇄 ---------- */

function studentName(s: SharedStudent, t: (k: string, v?: Record<string, string | number>) => string) {
  return s.state.profile.name || s.who || t("이름 없음");
}

function StudentViewer() {
  const t = useT();
  const { lang } = useLang();
  const [list, setList] = useState<SharedStudent[] | null>(null);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [extra, setExtra] = useState(false); // 인쇄할 때 분석·세특 초안도 넣기

  const [cursor, setCursor] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [q, setQ] = useState("");

  // more=false: 처음부터 다시, more=true: 다음 쪽을 이어 붙이기
  const load = async (more = false) => {
    setBusy(true);
    setErr("");
    try {
      const r = await loadSharedPage(more ? cursor : null);
      setCursor(r.cursor);
      setDone(r.done);
      if (more) {
        setList((prev) => mergePage(prev ?? [], r.items, (x) => x.uid));
      } else {
        setList(r.items);
        setSel((prev) => new Set([...prev].filter((id) => r.items.some((x) => x.uid === id))));
      }
    } catch {
      setErr(t("학생 목록을 불러오지 못했어요. 권한과 인터넷 연결을 확인해 주세요."));
    } finally {
      setBusy(false);
    }
  };

  const chosen = list?.filter((x) => sel.has(x.uid)) ?? [];
  const shown = list ? filterByText(list, q, (x) => `${studentName(x, t)} ${x.state.profile.school}`) : [];
  const allShownSelected = shown.length > 0 && shown.every((x) => sel.has(x.uid));
  // 인쇄할 때 아래 학생 모아 보기 표는 숨기고 선택한 학생 기록만 나오게
  useEffect(() => {
    document.body.classList.toggle("print-folio", chosen.length > 0);
    return () => document.body.classList.remove("print-folio");
  }, [chosen.length]);

  const toggle = (id: string) => setSel((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  return (
    <div className="space-y-4">
      <div className="no-print card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold">{t("공개에 동의한 학생")}</h2>
          <button className="btn-primary py-2" onClick={() => load(false)} disabled={busy}><RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} aria-hidden /> {t(list ? "다시 불러오기" : "학생 목록 불러오기")}</button>
        </div>
        {err && <p className="mt-2 text-sm text-rose-600" role="alert">{err}</p>}
        {list && list.length === 0 && <p className="mt-3 text-sm text-slate-500">{t("지금 공개를 켠 학생이 없어요.")}</p>}
        {list && list.length > 0 && (
          <>
            <label htmlFor="student-q" className="label mt-3">{t("이름 또는 학교로 찾기 (불러온 학생 안에서)")}</label>
            <input id="student-q" className="input sm:max-w-sm" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-brand-600"
                  checked={allShownSelected}
                  onChange={(e) => setSel((p) => { const n = new Set(p); shown.forEach((x) => (e.target.checked ? n.add(x.uid) : n.delete(x.uid))); return n; })}
                />
                {q.trim() ? t("보이는 학생 모두 선택") : t("전체 선택")}
              </label>
              <span className="text-slate-500">{t("{n}명 중 {m}명 선택", { n: list.length, m: sel.size })}{!done ? t(" · 더 있을 수 있어요") : ""}</span>
            </div>
            <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 text-sm">
              {shown.length === 0 && <li className="px-3 py-3 text-slate-500">{t("찾는 학생이 없어요. ‘더 불러오기’를 눌러 다음 학생도 확인해 보세요.")}</li>}
              {shown.map((x) => {
                const p = x.state.profile;
                return (
                  <li key={x.uid}>
                    <label className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-0.5 px-3 py-2 hover:bg-slate-50">
                      <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={sel.has(x.uid)} onChange={() => toggle(x.uid)} />
                      <span className="font-semibold"><span data-keep-ko>{studentName(x, t)}</span></span>
                      <span className="text-slate-500"><span data-keep-ko>{p.school}</span>{p.school && p.grade ? " " : ""}{p.grade ? t("{g}학년", { g: p.grade }) : ""}</span>
                      <span className="ml-auto text-xs text-slate-400">{x.updatedAt ? t("마지막 갱신 {d}", { d: new Date(x.updatedAt).toLocaleDateString(lang === "en" ? "en-US" : "ko-KR") }) : ""}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            {!done && (
              <button className="btn-ghost mt-2 py-2" onClick={() => load(true)} disabled={busy}>{t("더 불러오기")}</button>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={extra} onChange={(e) => setExtra(e.target.checked)} />
                {t("인쇄할 때 현황 분석·세특 초안도 넣기")}
              </label>
              <button className="btn-ghost py-2" disabled={!chosen.length} onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden /> {t("선택한 {n}명 인쇄", { n: chosen.length })}</button>
            </div>
          </>
        )}
      </div>

      {chosen.map((x, i) => (
        <Folio key={x.uid} s={x} extra={extra} last={i === chosen.length - 1} />
      ))}
    </div>
  );
}

/* ---------- 학생 한 명의 전체 기록 ---------- */

function Folio({ s, extra, last }: { s: SharedStudent; extra: boolean; last: boolean }) {
  const t = useT();
  const st = s.state;
  return (
    <div className={`space-y-4 rounded-2xl border border-slate-200 p-4 print:border-0 print:p-0 ${last ? "" : "print:break-after-page"}`}>
      <ReportBody s={st} />
      <FullRecords s={st} />
      <div className={extra ? "space-y-4" : "no-print space-y-4"}>
        <AnalysisCard s={st} />
        <SetukCard s={st} name={studentName(s, t)} />
      </div>
    </div>
  );
}

function FullRecords({ s }: { s: AppState }) {
  const t = useT();
  const forms = Object.values(FORMS)
    .map((f) => ({ f, rows: portfolioRows(f.id, f.steps.flatMap((x) => x.fields), s.portfolio) }))
    .filter((x) => x.rows.length);
  return (
    <section className="space-y-4" aria-label={t("전체 기록")}>
      <h2 className="text-base font-bold">{t("전체 기록")}</h2>
      {s.logs.length > 0 && (
        <div className="card">
          <h3 className="text-xs font-bold text-slate-500">{t("진로 활동 기록 ({n})", { n: s.logs.length })}</h3>
          <ul className="mt-2 divide-y divide-slate-100 text-sm" data-keep-ko>
            {s.logs.map((l) => (
              <li key={l.id} className="space-y-0.5 py-2">
                <div className="font-semibold">{l.title || "-"} <span className="text-xs font-normal text-slate-500">{l.date} · {l.kind}</span></div>
                {l.why && <div>왜: {l.why}</div>}
                {l.what && <div>한 일: {l.what}</div>}
                {l.learned && <div>배운 점: {l.learned}</div>}
                {l.next && <div>다음 계획: {l.next}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {s.books.length > 0 && (
        <div className="card">
          <h3 className="text-xs font-bold text-slate-500">{t("진로 독서 ({n})", { n: s.books.length })}</h3>
          <ul className="mt-2 divide-y divide-slate-100 text-sm" data-keep-ko>
            {s.books.map((b) => (
              <li key={b.id} className="space-y-0.5 py-2">
                <div className="font-semibold">{b.title} <span className="text-xs font-normal text-slate-500">{b.author} {b.date}</span></div>
                {b.why && <div>읽은 이유: {b.why}</div>}
                {b.quote && <div>기억에 남는 문장: {b.quote}</div>}
                {b.thought && <div>생각: {b.thought}</div>}
                {b.next && <div>이어서: {b.next}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {s.goals.length > 0 && (
        <div className="card">
          <h3 className="text-xs font-bold text-slate-500">{t("학기별 목표 ({n})", { n: s.goals.length })}</h3>
          <ul className="mt-2 space-y-0.5 text-sm" data-keep-ko>
            {s.goals.map((g) => <li key={g.id}>[{g.term}{g.subject ? ` ${g.subject}` : ""}] {g.text} {g.done ? "✓" : ""}</li>)}
          </ul>
        </div>
      )}
      {forms.map(({ f, rows }) => (
        <div key={f.id} className="card">
          <h3 className="text-xs font-bold text-slate-500" data-keep-ko>{f.title}</h3>
          <dl className="mt-2 space-y-1.5 text-sm" data-keep-ko>
            {rows.map(([label, v]) => (
              <div key={label}><dt className="text-xs font-semibold text-slate-500">{label}</dt><dd className="whitespace-pre-wrap">{v}</dd></div>
            ))}
          </dl>
        </div>
      ))}
    </section>
  );
}

/** 포트폴리오 양식에 쓴 글을 (질문, 답) 목록으로 */
function portfolioRows(formId: string, fields: Field[], data: Record<string, string>): [string, string][] {
  const leaf = (f: Field): Field[] => (f.t === "group" ? f.fields.flatMap(leaf) : [f]);
  const out: [string, string][] = [];
  for (const f of fields.flatMap(leaf)) {
    const raw = data[`pf.${formId}.${f.k}`];
    if (!raw || !raw.trim()) continue;
    const v = readable(raw);
    if (v) out.push([f.label, v]);
  }
  return out;
}
function readable(raw: string): string {
  const x = raw.trim();
  if (!x.startsWith("[") && !x.startsWith("{")) return x;
  try {
    const j = JSON.parse(x);
    const flat = (o: unknown): string =>
      Array.isArray(o) ? o.map(flat).filter(Boolean).join(" / ") : o && typeof o === "object" ? Object.entries(o as Record<string, unknown>).map(([k, v]) => `${k}: ${flat(v)}`).join(", ") : String(o ?? "");
    return flat(j);
  } catch {
    return x;
  }
}

/* ---------- 규칙 기반 진로 현황 분석 ---------- */

function AnalysisCard({ s }: { s: AppState }) {
  const t = useT();
  const { JOB_MAP, MAJOR_MAP } = useCatalog();
  const a = useMemo(() => analyzeStudent(s, { JOB_MAP, MAJOR_MAP }), [s, JOB_MAP, MAJOR_MAP]);
  return (
    <section className="card" aria-label={t("진로 현황 분석")}>
      <h3 className="font-bold">{t("진로 현황 분석")}</h3>
      <p className="mt-0.5 text-xs text-slate-500">{t("학생이 쓴 기록을 이 기기 안의 규칙으로 정리한 것이에요. 외부 AI나 서버로 보내지 않아요. 참고 자료로만 써 주세요.")}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2" data-keep-ko>
        <div>
          <div className="text-xs font-bold text-slate-500">관심 직업·학과 일관성: <span className="text-slate-900">{a.consistency.level}</span></div>
          <ul className="mt-1 list-disc pl-5 text-sm">{a.consistency.lines.map((l) => <li key={l}>{l}</li>)}</ul>
        </div>
        <div>
          <div className="text-xs font-bold text-slate-500">활동·독서 분포</div>
          <ul className="mt-1 list-disc pl-5 text-sm">
            <li>진로 활동 {a.activity.logsTotal}개{a.activity.logKinds.length ? ` (${a.activity.logKinds.map(([k, n]) => `${k} ${n}`).join(", ")})` : ""}</li>
            <li>관심 직업과 연결된 활동 {a.activity.linkedToFav}개 · 배운 점과 다음 계획까지 쓴 활동 {a.activity.withReflection}개</li>
            <li>진로 독서 {a.activity.books}권</li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold text-slate-500">여정 진행률</div>
          <ul className="mt-1 list-disc pl-5 text-sm">
            <li>진로 설계 {a.journey.total}단계 중 {a.journey.done}단계 완료</li>
            <li>학기별 할 일 {a.journey.tasksDone}/{a.journey.tasksTotal}</li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold text-slate-500">192학점 진단</div>
          <ul className="mt-1 list-disc pl-5 text-sm">
            {a.credits.planned ? <li>{a.credits.track ? `${a.credits.track} 계열 · ` : ""}{a.credits.total}학점 설계, 확인할 점 {a.credits.warns}개</li> : <li>설계 전이거나 해당 없음</li>}
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold text-emerald-700">잘하고 있는 점</div>
          <ul className="mt-1 list-disc pl-5 text-sm">{a.strengths.length ? a.strengths.map((l) => <li key={l}>{l}</li>) : <li>아직 뚜렷한 기록이 없어요.</li>}</ul>
        </div>
        <div>
          <div className="text-xs font-bold text-amber-700">보완하면 좋은 점</div>
          <ul className="mt-1 list-disc pl-5 text-sm">{a.gaps.length ? a.gaps.map((l) => <li key={l}>{l}</li>) : <li>눈에 띄는 빈틈이 없어요.</li>}</ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- 세특 초안 ---------- */

function SetukCard({ s, name }: { s: AppState; name: string }) {
  const t = useT();
  const { JOB_MAP, MAJOR_MAP } = useCatalog();
  const parts = useMemo(() => draftSetuk(s, { JOB_MAP, MAJOR_MAP }), [s, JOB_MAP, MAJOR_MAP]);
  const initial = useMemo(() => parts.map((p) => p.text).join(" "), [parts]);
  const [text, setText] = useState(initial);
  const [done, setDone] = useState(false);
  useEffect(() => setText(initial), [initial]);
  const noSpace = text.replace(/\s/g, "").length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      window.prompt(t("아래 내용을 복사하세요"), text);
    }
  };

  return (
    <section className="card" aria-label={t("세특 초안")}>
      <h3 className="font-bold">{t("세부능력 및 특기사항(세특) 초안")}</h3>
      <p className="mt-1 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900" role="note">
        {t("초안이에요. 학생이 직접 쓴 기록에서만 문장을 만들었고, 교사가 수업·상담에서 관찰하고 확인한 내용으로 직접 고쳐 써야 해요. 기록에 없는 내용은 넣지 않았어요. 생활기록부 작성 지침과 기재 요령을 꼭 확인해 주세요.")}
      </p>
      {parts.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">{t("초안을 만들 기록이 아직 없어요.")}</p>
      ) : (
        <>
          <label htmlFor={`setuk-${s.profile.name}-${s.profile.school}`} className="label mt-3">{t("{name} 학생 세특 초안 (직접 고쳐 쓸 수 있어요)", { name })}</label>
          <textarea id={`setuk-${s.profile.name}-${s.profile.school}`} className="input min-h-[8rem] leading-relaxed" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-600" aria-live="polite">{t("글자 수 {a}자 (공백 제외 {b}자) · 바이트 {c}", { a: text.length, b: noSpace, c: new TextEncoder().encode(text).length })}</span>
            <div className="no-print flex gap-2">
              <button className="btn-ghost py-1.5" onClick={() => setText(initial)}>{t("처음 초안으로")}</button>
              <button className="btn-primary py-1.5" onClick={copy}><ClipboardCopy className="h-4 w-4" aria-hidden /> {t(done ? "복사했어요" : "복사")}</button>
            </div>
          </div>
          <h4 className="mt-4 text-xs font-bold text-slate-500">{t("문장별 근거 기록")}</h4>
          <ul className="mt-1 space-y-1.5 text-sm" data-keep-ko>
            {parts.map((p, i) => (
              <li key={i}>
                <div>{p.text}</div>
                <div className="text-xs text-slate-500">근거: {p.evidence.join(" · ")}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
