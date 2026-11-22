"use client";

// 로그인 없이 기록 이어 쓰기: 백업 파일 내려받기 → 다음에 올리기
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Download, FileCheck2, HardDriveDownload, Upload, X } from "lucide-react";
import { initialState, useStore, type AppState } from "@/lib/store";
import { useCloud } from "@/lib/cloud";
import { useLang, useT } from "@/lib/i18n";

const APP = "myroad-gyeongnam";
const LAST = "myroad:lastBackup";
const SNOOZE = "myroad:backupSnooze";
const ls = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

const isEmpty = (s: AppState) => JSON.stringify({ ...s, currentTerm: "" }) === JSON.stringify({ ...initialState(), currentTerm: "" });
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const ago = (t: number, tr: (s: string, v?: Record<string, number>) => string) => {
  const d = Math.floor((Date.now() - t) / 86400000);
  return d <= 0 ? tr("오늘") : tr("{d}일 전", { d });
};

export function downloadBackup(state: AppState) {
  const body = { app: APP, version: 2, savedAt: new Date().toISOString(), data: state };
  const blob = new Blob([JSON.stringify(body, null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `myroad-backup-${ymd(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  ls.set(LAST, String(Date.now()));
}

/** 파일 내용 → 기록 (새 형식·예전 형식 모두) */
export function parseBackup(text: string): { data: unknown; savedAt?: string } | null {
  try {
    const o = JSON.parse(text);
    if (o && o.app === APP && o.data) return { data: o.data, savedAt: o.savedAt };
    if (o && typeof o === "object" && ("profile" in o || "answers" in o || "credits" in o)) return { data: o };
    return null;
  } catch {
    return null;
  }
}

/** 백업·불러오기 패널 (/account, /report) */
export function BackupPanel() {
  const { state, replace } = useStore();
  const t = useT();
  const { lang } = useLang();
  const fileRef = useRef<HTMLInputElement>(null);
  const [last, setLast] = useState<number | null>(null);
  const [pending, setPending] = useState<{ data: unknown; savedAt?: string; name: string } | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [drag, setDrag] = useState(false);

  useEffect(() => { const v = ls.get(LAST); if (v) setLast(+v); }, []);

  const read = async (f?: File | null) => {
    if (!f) return;
    const p = parseBackup(await f.text());
    if (!p) return setMsg({ ok: false, text: t("마이로드 백업 파일이 아니에요. ‘myroad-backup-날짜.json’ 파일을 골라 주세요.") });
    setMsg(null);
    setPending({ ...p, name: f.name });
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2">
        <span className="icon-box"><HardDriveDownload className="h-5 w-5" aria-hidden /></span>
        <div>
          <h2 className="font-bold">{t("백업 파일로 이어 쓰기")}</h2>
          <p className="text-xs text-slate-500">{t("로그인하지 않으면 기록은 이 기기에만 저장돼요.")}</p>
        </div>
      </div>

      <ol className="mt-4 grid gap-3 sm:grid-cols-2">
        <li className="rounded-xl border border-slate-200 p-3">
          <div className="text-xs font-bold text-brand-700">{t("1. 오늘 쓴 기록 저장")}</div>
          <p className="mt-1 text-sm text-slate-600">{t("백업 파일(myroad-backup-날짜.json)을 내려받아 USB, 메일, 클라우드 드라이브에 보관해요.")}</p>
          <button className="btn-primary mt-3 w-full justify-center" onClick={() => { downloadBackup(state); setLast(Date.now()); setMsg({ ok: true, text: t("백업 파일을 내려받았어요. 다운로드 폴더를 확인해 주세요.") }); }}>
            <Download className="h-4 w-4" aria-hidden /> {t("백업 파일 내려받기")}
          </button>
          <p className="mt-1.5 text-xs text-slate-500">{last ? t("마지막 백업: {when}", { when: ago(last, t) }) : t("아직 이 기기에서 백업한 적이 없어요.")}</p>
        </li>
        <li
          className={`rounded-xl border-2 border-dashed p-3 transition ${drag ? "border-brand-500 bg-brand-50" : "border-slate-200"}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); read(e.dataTransfer.files?.[0]); }}
        >
          <div className="text-xs font-bold text-brand-700">{t("2. 다음에 이어서 하기")}</div>
          <p className="mt-1 text-sm text-slate-600">{t("저장해 둔 백업 파일을 올리면 그때 기록 그대로 이어서 할 수 있어요.")}</p>
          <button className="btn-ghost mt-3 w-full justify-center" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" aria-hidden /> {t("백업 파일 올리기")}
          </button>
          <p className="mt-1.5 hidden text-xs text-slate-500 sm:block">{t("파일을 이 칸에 끌어다 놓아도 돼요.")}</p>
          <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" aria-label={t("백업 파일 선택")} onChange={(e) => { read(e.target.files?.[0]); e.target.value = ""; }} />
        </li>
      </ol>

      {pending && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3" role="alertdialog" aria-labelledby="restore-title">
          <div id="restore-title" className="flex items-center gap-1.5 text-sm font-bold text-amber-900"><FileCheck2 className="h-4 w-4" aria-hidden /> {t("이 백업으로 불러올까요?")}</div>
          <p className="mt-1 text-sm text-amber-900">
            {pending.name}
            {pending.savedAt && ` · ${t("{date} 저장", { date: new Date(pending.savedAt).toLocaleString(lang === "en" ? "en-US" : "ko-KR", { dateStyle: "medium", timeStyle: "short" }) })}`}
          </p>
          {!isEmpty(state) && <p className="mt-1 text-xs text-amber-800">{t("지금 이 기기에 있는 기록은 백업 내용으로 바뀌어요. 필요하면 먼저 ‘백업 파일 내려받기’로 저장해 두세요.")}</p>}
          <div className="mt-2 flex gap-2">
            <button className="btn-primary py-2" onClick={() => { replace(pending.data); setPending(null); setMsg({ ok: true, text: t("백업을 불러왔어요. 이어서 하면 돼요.") }); }}>{t("불러오기")}</button>
            <button className="btn-ghost py-2" onClick={() => setPending(null)}>{t("취소")}</button>
          </div>
        </div>
      )}
      {msg && <p className={`mt-3 text-sm font-semibold ${msg.ok ? "text-emerald-700" : "text-rose-600"}`} role="status">{msg.text}</p>}
      <p className="mt-3 text-xs text-slate-500">{t("학교·도서관 같은 공용 컴퓨터를 썼다면, 백업을 받은 뒤 ‘내 리포트 → 처음부터 다시’로 기록을 지워 주세요.")}</p>
    </div>
  );
}

/** 홈: 기록이 있는데 백업이 오래됐으면 살짝 알려 주기 (로그인 중이면 숨김) */
export function BackupReminder() {
  const { state, ready } = useStore();
  const { user } = useCloud();
  const t = useT();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!ready || user || isEmpty(state)) return setShow(false);
    const last = +(ls.get(LAST) ?? 0);
    const snooze = +(ls.get(SNOOZE) ?? 0);
    setShow(Date.now() - last > 7 * 86400000 && Date.now() > snooze);
  }, [ready, user, state]);
  if (!show) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm">
      <span className="flex items-center gap-2 text-sky-900">
        <HardDriveDownload className="h-4 w-4 shrink-0" aria-hidden /> {t("기록은 이 기기에만 저장돼요. 다른 기기에서 이어 하려면 백업 파일을 받아 두세요.")}
      </span>
      <span className="flex items-center gap-1">
        <button className="btn-primary py-1.5 text-xs" onClick={() => { downloadBackup(state); setShow(false); }}>
          <Download className="h-3.5 w-3.5" aria-hidden /> {t("백업 받기")}
        </button>
        <Link href="/account" className="btn-ghost py-1.5 text-xs">{t("불러오기")}</Link>
        <button className="grid h-8 w-8 place-items-center rounded-full text-sky-700 hover:bg-sky-100" aria-label={t("일주일 동안 숨기기")} onClick={() => { ls.set(SNOOZE, String(Date.now() + 7 * 86400000)); setShow(false); }}>
          <X className="h-4 w-4" />
        </button>
      </span>
    </div>
  );
}
