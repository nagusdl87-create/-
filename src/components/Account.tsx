"use client";

import Link from "next/link";
import { useState } from "react";
import { Cloud, CloudOff, LogIn, LogOut, RefreshCw, Trash2, UserRound } from "lucide-react";
import { LOGIN_PUBLIC, useCloud } from "@/lib/cloud";

/** 헤더 버튼: 로그인 기능이 보일 때만 */
export function AccountButton() {
  const { visible, user, status } = useCloud();
  if (!visible) return null;
  return (
    <Link href="/account" className="btn-ghost rounded-full px-3 py-2" aria-label={user ? "내 계정과 동기화" : "로그인"}>
      {user ? (status === "error" ? <CloudOff className="h-4 w-4 text-rose-600" aria-hidden /> : <Cloud className="h-4 w-4 text-brand-600" aria-hidden />) : <LogIn className="h-4 w-4" aria-hidden />}
      <span className="hidden sm:inline">{user ? "동기화" : "로그인"}</span>
    </Link>
  );
}

/** 로그인 직후 이 기기 기록과 계정 기록이 다를 때 */
export function CloudConflict() {
  const { conflict, resolve } = useCloud();
  if (!conflict) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-labelledby="conflict-title">
      <div className="card w-full max-w-md">
        <h2 id="conflict-title" className="text-lg font-bold">어느 기록을 쓸까요?</h2>
        <p className="mt-2 text-sm text-slate-600">이 기기에 저장된 기록과 계정에 저장된 기록이 달라요. 하나를 고르면 다른 쪽은 그 기록으로 바뀌어요.</p>
        <div className="mt-4 grid gap-2">
          <button className="btn-primary justify-center" onClick={() => resolve("remote")}>계정에 저장된 기록 쓰기</button>
          <button className="btn-ghost justify-center" onClick={() => resolve("local")}>이 기기의 기록으로 계정 덮어쓰기</button>
        </div>
        <p className="mt-3 text-xs text-slate-500">헷갈리면 먼저 &lsquo;내 리포트&rsquo;에서 공유 링크나 파일로 이 기기 기록을 저장해 두세요.</p>
      </div>
    </div>
  );
}

const STATUS: Record<string, string> = { off: "로그인 안 함", loading: "계정 기록 확인 중", syncing: "저장 중", synced: "동기화됨", error: "동기화 오류" };

/** /account 페이지 본문 */
export function AccountPanel() {
  const c = useCloud();
  const [adult, setAdult] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [busy, setBusy] = useState(false);
  const run = (f: () => Promise<void>) => async () => { setBusy(true); try { await f(); } finally { setBusy(false); } };

  if (!c.visible) return null;

  return (
    <div className="space-y-4">
      {!LOGIN_PUBLIC && <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">미리보기: 개인정보 처리 방침을 게시하기 전이라 일반 이용자에게는 이 화면이 보이지 않아요.</p>}

      {c.user ? (
        <div className="card">
          <div className="flex items-center gap-3">
            <span className="icon-box"><UserRound className="h-5 w-5" aria-hidden /></span>
            <div className="min-w-0">
              <div className="font-bold">{c.user.name || "이름 없음"}</div>
              <div className="truncate text-sm text-slate-500">{c.user.email}</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className={`chip ${c.status === "error" ? "bg-rose-50 text-rose-700" : "bg-brand-50 text-brand-800"}`}>
              {c.status === "syncing" || c.status === "loading" ? <RefreshCw className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Cloud className="h-3.5 w-3.5" aria-hidden />} {STATUS[c.status]}
            </span>
            {c.lastSync && <span className="text-slate-500">마지막 저장 {new Date(c.lastSync).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</span>}
          </div>
          <p className="mt-3 text-sm text-slate-600">이제 학교·집 어느 기기에서든 같은 계정으로 로그인하면 같은 기록을 이어서 쓸 수 있어요. 바꾼 내용은 자동으로 저장돼요.</p>
          {c.error && <p className="mt-2 text-sm text-rose-600" role="alert">{c.error}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-ghost" disabled={busy} onClick={run(() => c.signOutNow(false))}><LogOut className="h-4 w-4" aria-hidden /> 로그아웃</button>
            <button className="btn-ghost" disabled={busy} onClick={run(() => c.signOutNow(true))}><LogOut className="h-4 w-4" aria-hidden /> 로그아웃하고 이 기기 기록 지우기</button>
          </div>
          <p className="mt-1 text-xs text-slate-500">학교·도서관 같은 공용 컴퓨터에서는 &lsquo;이 기기 기록 지우기&rsquo;로 로그아웃하세요.</p>
        </div>
      ) : (
        <div className="card">
          <h2 className="font-bold">로그인하면 여러 기기에서 이어 쓸 수 있어요</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>• 로그인은 선택이에요. 하지 않아도 모든 기능을 쓸 수 있어요.</li>
            <li>• 저장하는 것: 구글 계정의 이름·이메일, 내가 직접 입력한 진로 기록.</li>
            <li>• 기록은 서울 지역 서버에 저장되고, 나만 볼 수 있어요. 언제든 직접 삭제할 수 있어요.</li>
            <li>• 1년 동안 로그인하지 않으면 계정 기록은 삭제돼요.</li>
          </ul>
          <label className="mt-4 flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={adult} onChange={(e) => setAdult(e.target.checked)} />
            만 14세 이상이에요
          </label>
          <p className="mt-1 text-xs text-slate-500">만 14세 미만은 로그인 없이 이 기기에 저장해서 써 주세요.</p>
          {c.error && <p className="mt-2 text-sm text-rose-600" role="alert">{c.error}</p>}
          <button className="btn-primary mt-4" disabled={!adult || busy} onClick={run(c.signIn)}>
            <LogIn className="h-4 w-4" aria-hidden /> 구글 계정으로 로그인
          </button>
          <p className="mt-3 text-xs text-slate-500">
            {LOGIN_PUBLIC ? <Link href="/privacy" className="underline">개인정보 처리 방침</Link> : "개인정보 처리 방침(게시 예정)"}
          </p>
        </div>
      )}

      {c.user && (
        <div className="card border-rose-100">
          <h2 className="font-bold text-rose-800">계정 삭제</h2>
          <p className="mt-1 text-sm text-slate-600">계정과 서버에 저장된 기록을 바로 지워요. 되돌릴 수 없어요. 이 기기에 저장된 기록은 남아요.</p>
          {confirmDel ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn bg-rose-600 text-white hover:bg-rose-700" disabled={busy} onClick={run(c.deleteAccount)}><Trash2 className="h-4 w-4" aria-hidden /> 정말 삭제하기</button>
              <button className="btn-ghost" onClick={() => setConfirmDel(false)}>취소</button>
            </div>
          ) : (
            <button className="btn-ghost mt-3 text-rose-700" onClick={() => setConfirmDel(true)}><Trash2 className="h-4 w-4" aria-hidden /> 계정 삭제</button>
          )}
        </div>
      )}
    </div>
  );
}
