"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BackupPanel } from "@/components/Backup";
import { decodeShare, encodeShare, useStore, type AppState } from "@/lib/store";
import { isTestComplete, progress, riasecScores, topTypes, hsQuizResult } from "@/lib/match";
import { RIASEC, VALUES } from "@/data/riasec";
import { HS_MAP } from "@/data/highschools";
import { TERMS_BY_STAGE } from "@/data/plan";
import { Radar } from "@/components/Radar";
import { GN_SCHOOLS, KIND_INFO } from "@/data/gn";
import { TRACKS } from "@/data/subjects";
import { analyze, parseEntry, SEM_LABEL } from "@/lib/credits";
import { SEMS } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { ReportBody } from "@/components/ReportBody";

export default function ReportPage() {
  const store = useStore();
  const t = useT();
  const [shared, setShared] = useState<AppState | null>(null);

  useEffect(() => {
    const read = () => {
      const m = window.location.hash.match(/^#d=(.+)$/);
      setShared(m ? decodeShare(m[1]) : null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  if (!store.ready) return <div className="h-64" />;
  const s = shared ?? store.state;

  return (
    <div>
      {shared && (
        <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
          <span>👀 {t("공유받은 진로 리포트를 보고 있어요 (읽기 전용).")}</span>
          <button
            className="btn-ghost py-1.5"
            onClick={() => {
              history.replaceState(null, "", "/report");
              setShared(null);
            }}
          >
            {t("내 리포트로 돌아가기")}
          </button>
        </div>
      )}
      <div className="no-print mb-4 flex justify-end">
        <Link href={`/report/summary${shared ? window.location.hash : ""}`} className="btn-ghost py-1.5">
          {t("상담용 한 장 요약")}
        </Link>
      </div>
      <ReportBody s={s} />
      {!shared && <Tools />}
    </div>
  );
}

function Tools() {
  const { state, reset } = useStore();
  const t = useT();
  const [msg, setMsg] = useState("");
  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  };

  return (
    <div className="no-print mt-8 space-y-4">
      <div className="card">
        <h2 className="font-bold">{t("리포트 활용하기")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-primary" onClick={() => window.print()}>
            🖨️ {t("인쇄 / PDF 저장")}
          </button>
          <button
            className="btn-ghost"
            onClick={async () => {
              const url = `${location.origin}/report#d=${encodeShare(state)}`;
              try {
                await navigator.clipboard.writeText(url);
                flash(t("공유 링크를 복사했어요. 선생님이나 보호자에게 보내 보세요."));
              } catch {
                prompt(t("아래 링크를 복사하세요"), url);
              }
            }}
          >
            🔗 {t("공유 링크 복사")}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">{t("공유 링크에는 리포트 내용이 담겨 있어 서버 저장 없이 열람할 수 있어요. 받는 사람에게만 보내 주세요.")}</p>
        <p className="mt-1 text-xs text-slate-500">{t("선생님께는 보여 줄 항목만 고르는 ‘공유 코드’가 더 안전해요.")} <Link href="/teacher/share" className="font-semibold text-brand-700 hover:underline">{t("공유 코드 만들기")}</Link></p>
        {msg && <p className="mt-2 text-sm font-semibold text-emerald-600">{msg}</p>}
      </div>

      <BackupPanel />
      <div className="card">
        <h2 className="font-bold">{t("처음부터 다시 하기")}</h2>
        <p className="mt-1 text-xs text-slate-500">{t("이 기기에 저장된 모든 기록을 지워요. 공용 컴퓨터를 다 쓴 뒤에도 눌러 주세요.")}</p>
        <button className="btn-ghost mt-3 text-rose-600" onClick={() => confirm(t("모든 기록을 지우고 처음부터 시작할까요? 되돌릴 수 없어요. 필요하면 먼저 백업 파일을 내려받아 두세요.")) && reset()}>
          {t("기록 모두 지우기")}
        </button>
      </div>
      <Link href="/" className="inline-block text-sm font-semibold text-slate-500">
        ← {t("홈으로")}
      </Link>
    </div>
  );
}

