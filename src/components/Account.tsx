"use client";

import Link from "next/link";
import { useState } from "react";
import { Cloud, CloudOff, Eye, LogIn, LogOut, RefreshCw, Trash2, UserRound } from "lucide-react";
import { LOGIN_PUBLIC, useCloud } from "@/lib/cloud";
import { useLang, useT } from "@/lib/i18n";

/** 헤더 버튼: 로그인 기능이 보일 때만 */
export function AccountButton() {
  const { visible, user, status } = useCloud();
  const t = useT();
  if (!visible) return null;
  return (
    <Link href="/account" className="btn-ghost whitespace-nowrap rounded-full px-2.5 py-2 sm:px-3" aria-label={t(user ? "내 계정과 동기화" : "로그인")}>
      {user ? (status === "error" ? <CloudOff className="h-4 w-4 text-rose-600" aria-hidden /> : <Cloud className="h-4 w-4 text-brand-600" aria-hidden />) : <LogIn className="h-4 w-4" aria-hidden />}
      <span className="hidden sm:inline">{t(user ? "동기화" : "로그인")}</span>
    </Link>
  );
}

/** 로그인 직후 이 기기 기록과 계정 기록이 다를 때 */
export function CloudConflict() {
  const { conflict, resolve } = useCloud();
  const t = useT();
  if (!conflict) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-labelledby="conflict-title">
      <div className="card w-full max-w-md">
        <h2 id="conflict-title" className="text-lg font-bold">{t("어느 기록을 쓸까요?")}</h2>
        <p className="mt-2 text-sm text-slate-600">{t("이 기기에 저장된 기록과 계정에 저장된 기록이 달라요. 하나를 고르면 다른 쪽은 그 기록으로 바뀌어요.")}</p>
        <div className="mt-4 grid gap-2">
          <button className="btn-primary justify-center" onClick={() => resolve("remote")}>{t("계정에 저장된 기록 쓰기")}</button>
          <button className="btn-ghost justify-center" onClick={() => resolve("local")}>{t("이 기기의 기록으로 계정 덮어쓰기")}</button>
        </div>
        <p className="mt-3 text-xs text-slate-500">{t("헷갈리면 먼저 ‘내 리포트’에서 공유 링크나 파일로 이 기기 기록을 저장해 두세요.")}</p>
      </div>
    </div>
  );
}

const STATUS: Record<string, string> = { off: "로그인 안 함", loading: "계정 기록 확인 중", syncing: "저장 중", synced: "동기화됨", error: "동기화 오류" };

/** /account 페이지 본문 */
export function AccountPanel() {
  const c = useCloud();
  const t = useT();
  const { lang } = useLang();
  const [adult, setAdult] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [busy, setBusy] = useState(false);
  const run = (f: () => Promise<void>) => async () => { setBusy(true); try { await f(); } finally { setBusy(false); } };

  if (!c.visible) return null;

  return (
    <div className="space-y-4">
      {!LOGIN_PUBLIC && <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">{t("미리보기: 개인정보 처리 방침을 게시하기 전이라 일반 이용자에게는 이 화면이 보이지 않아요.")}</p>}

      {c.user ? (
        <div className="card">
          <div className="flex items-center gap-3">
            <span className="icon-box"><UserRound className="h-5 w-5" aria-hidden /></span>
            <div className="min-w-0">
              <div className="font-bold">{c.user.name || t("이름 없음")}</div>
              <div className="truncate text-sm text-slate-500">{c.user.email}</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className={`chip ${c.status === "error" ? "bg-rose-50 text-rose-700" : "bg-brand-50 text-brand-800"}`}>
              {c.status === "syncing" || c.status === "loading" ? <RefreshCw className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Cloud className="h-3.5 w-3.5" aria-hidden />} {t(STATUS[c.status])}
            </span>
            {c.lastSync && <span className="text-slate-500">{t("마지막 저장 {time}", { time: new Date(c.lastSync).toLocaleTimeString(lang === "en" ? "en-US" : "ko-KR", { hour: "2-digit", minute: "2-digit" }) })}</span>}
          </div>
          <p className="mt-3 text-sm text-slate-600">{t("이제 학교·집 어느 기기에서든 같은 계정으로 로그인하면 같은 기록을 이어서 쓸 수 있어요. 바꾼 내용은 자동으로 저장돼요.")}</p>
          {c.error && <p className="mt-2 text-sm text-rose-600" role="alert">{t(c.error)}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-ghost" disabled={busy} onClick={run(() => c.signOutNow(false))}><LogOut className="h-4 w-4" aria-hidden /> {t("로그아웃")}</button>
            <button className="btn-ghost" disabled={busy} onClick={run(() => c.signOutNow(true))}><LogOut className="h-4 w-4" aria-hidden /> {t("로그아웃하고 이 기기 기록 지우기")}</button>
          </div>
          <p className="mt-1 text-xs text-slate-500">{t("학교·도서관 같은 공용 컴퓨터에서는 ‘이 기기 기록 지우기’로 로그아웃하세요.")}</p>
        </div>
      ) : (
        <div className="card">
          <h2 className="font-bold">{t("로그인하면 여러 기기에서 이어 쓸 수 있어요")}</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>• {t("로그인은 선택이에요. 하지 않아도 모든 기능을 쓸 수 있어요.")}</li>
            <li>• {t("저장하는 것: 구글 계정의 이름·이메일, 내가 직접 입력한 진로 기록.")}</li>
            <li>• {t("기록은 서울 지역 서버에 저장되고, 나만 볼 수 있어요. 언제든 직접 삭제할 수 있어요.")}</li>
            <li>• {t("1년 동안 로그인하지 않으면 계정 기록은 삭제돼요.")}</li>
          </ul>
          <label className="mt-4 flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={adult} onChange={(e) => setAdult(e.target.checked)} />
            {t("만 14세 이상이에요")}
          </label>
          <p className="mt-1 text-xs text-slate-500">{t("만 14세 미만은 로그인 없이 이 기기에 저장해서 써 주세요.")}</p>
          {c.error && <p className="mt-2 text-sm text-rose-600" role="alert">{t(c.error)}</p>}
          <button className="btn-primary mt-4" disabled={!adult || busy} onClick={run(c.signIn)}>
            <LogIn className="h-4 w-4" aria-hidden /> {t("구글 계정으로 로그인")}
          </button>
          <p className="mt-3 text-xs text-slate-500">
            {LOGIN_PUBLIC ? <Link href="/privacy" className="underline">{t("개인정보 처리 방침")}</Link> : t("개인정보 처리 방침(게시 예정)")}
          </p>
        </div>
      )}

      {c.user && c.teacherFeature && <ShareToggle />}

      {c.user && (
        <div className="card border-rose-100">
          <h2 className="font-bold text-rose-800">{t("계정 삭제")}</h2>
          <p className="mt-1 text-sm text-slate-600">{t("계정과 서버에 저장된 기록을 바로 지워요. 되돌릴 수 없어요. 이 기기에 저장된 기록은 남아요.")}</p>
          {confirmDel ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn bg-rose-600 text-white hover:bg-rose-700" disabled={busy} onClick={run(c.deleteAccount)}><Trash2 className="h-4 w-4" aria-hidden /> {t("정말 삭제하기")}</button>
              <button className="btn-ghost" onClick={() => setConfirmDel(false)}>{t("취소")}</button>
            </div>
          ) : (
            <button className="btn-ghost mt-3 text-rose-700" onClick={() => setConfirmDel(true)}><Trash2 className="h-4 w-4" aria-hidden /> {t("계정 삭제")}</button>
          )}
        </div>
      )}
    </div>
  );
}

/** 교사·관리자에게 내 포트폴리오 공개: 기본 꺼짐, 켤 때 범위를 확인하고 동의, 언제든 끄면 바로 열람 불가 */
function ShareToggle() {
  const c = useCloud();
  const t = useT();
  const [ask, setAsk] = useState(false);
  const [busy, setBusy] = useState(false);
  const go = async (on: boolean) => { setBusy(true); try { await c.setShare(on); setAsk(false); } finally { setBusy(false); } };
  return (
    <div className="card" aria-labelledby="share-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="share-title" className="flex items-center gap-2 font-bold"><Eye className="h-4 w-4 text-brand-700" aria-hidden /> {t("교사·관리자에게 내 포트폴리오 공개")}</h2>
          <p className="mt-1 text-sm text-slate-600">{c.shareOn ? t("지금 공개 중이에요. 끄면 바로 교사·관리자가 볼 수 없어요.") : t("꺼져 있어요. 켜기 전에는 아무도 내 기록을 볼 수 없어요.")}</p>
        </div>
        <button
          role="switch"
          aria-checked={c.shareOn}
          aria-labelledby="share-title"
          disabled={busy}
          onClick={() => (c.shareOn ? go(false) : setAsk(true))}
          className={`relative mt-1 h-7 w-12 shrink-0 rounded-full border transition ${c.shareOn ? "border-accent bg-accent" : "border-slate-300 bg-slate-200"}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${c.shareOn ? "left-6" : "left-0.5"}`} />
        </button>
      </div>
      {(ask || c.shareOn) && (
        <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-semibold">{t("공개되는 범위")}</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            <li>{t("보이는 것: 구글 표시 이름, 프로필(이름·학교·학년), 흥미 탐색 결과, 찜한 직업·학과·학교, 진로 활동·독서 기록, 학기별 계획·목표, 포트폴리오에 쓴 글, 192학점 설계")}</li>
            <li>{t("보이지 않는 것: 이메일 주소, 내신 성적, 학교 편제표")}</li>
            <li>{t("볼 수 있는 사람: 마스터와 마스터가 지정한 관리자(교사). 읽기만 가능해요.")}</li>
            <li>{t("공개 중에는 내가 고친 내용이 자동으로 반영돼요. 끄면 공개용 사본이 바로 지워져요.")}</li>
          </ul>
        </div>
      )}
      {ask && !c.shareOn && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-primary" disabled={busy} onClick={() => go(true)}>{t("위 범위에 동의하고 공개")}</button>
          <button className="btn-ghost" disabled={busy} onClick={() => setAsk(false)}>{t("취소")}</button>
        </div>
      )}
      {c.error && <p className="mt-2 text-sm text-rose-600" role="alert">{t(c.error)}</p>}
    </div>
  );
}
