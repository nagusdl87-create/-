"use client";

// 선생님께 공유 코드 만들기 (학생용)
// 학생이 공유할 항목을 직접 고르면 그 항목만 담은 코드를 만든다. 서버로 아무것도 보내지 않고, 기기에도 따로 저장하지 않는다.
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Download, ShieldCheck, UserRoundCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { buildCard, DEFAULT_ITEMS, encodeCard, NICK_MAX, type ShareItems } from "@/lib/teacherShare";
import { RIASEC } from "@/data/riasec";
import { useCatalog } from "@/lib/catalog";
import { TRACKS } from "@/data/subjects";
import { useT } from "@/lib/i18n";

const OPTIONS: { key: keyof ShareItems; label: string; hint: string }[] = [
  { key: "level", label: "학교급·학년", hint: "중학생인지 고등학생인지와 학년만 보내요. 학교 이름은 보내지 않아요." },
  { key: "riasec", label: "흥미 유형", hint: "흥미 탐색에서 나온 1·2순위 유형만 보내요. 검사를 마쳤을 때만 담겨요." },
  { key: "favs", label: "찜한 직업·학과", hint: "찜한 직업과 학과 이름만 보내요." },
  { key: "logs", label: "진로 활동·독서 기록 개수", hint: "몇 개 썼는지만 보내요. 쓴 글의 내용은 보내지 않아요." },
  { key: "progress", label: "진로 설계 진행 단계", hint: "5단계 중 몇 단계를 마쳤는지 보내요." },
  { key: "credits", label: "192학점 진단 요약", hint: "고른 계열, 학점 합계, 진단에서 확인할 점의 개수만 보내요. 고른 과목 이름은 보내지 않아요." },
];

export function TeacherShareMaker() {
  const { state } = useStore();
  const t = useT();
  const { JOB_MAP, MAJOR_MAP, full } = useCatalog();
  const [items, setItems] = useState<ShareItems>(DEFAULT_ITEMS);
  const [nick, setNick] = useState("");
  const [agree, setAgree] = useState(false);
  const [msg, setMsg] = useState("");

  const card = useMemo(() => buildCard(state, items, nick, { JOB_MAP, MAJOR_MAP, full }), [state, items, nick, JOB_MAP, MAJOR_MAP, full]);
  const code = useMemo(() => encodeCard(card), [card]);

  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      flash(t("코드를 복사했어요. 선생님께 보내 보세요."));
    } catch {
      prompt(t("아래 코드를 복사하세요"), code);
    }
  };
  const save = () => {
    const blob = new Blob([code + "\n"], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "myroad-share-code.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    flash(t("파일로 저장했어요."));
  };

  const jobs = (card.jobs ?? []).filter((id) => JOB_MAP[id]).map((id) => t(JOB_MAP[id].name));
  const majors = (card.majors ?? []).filter((id) => MAJOR_MAP[id]).map((id) => t(MAJOR_MAP[id].name));
  const preview: [string, string][] = [];
  if (card.nick) preview.push([t("닉네임"), card.nick]);
  if (items.level) preview.push([t("학교급·학년"), [card.stage ? t(card.stage === "ms" ? "중학교" : "고등학교") : "", card.grade ? t("{g}학년", { g: card.grade }) : ""].filter(Boolean).join(" ") || t("미입력")]);
  if (items.riasec) preview.push([t("흥미 유형"), card.riasec ? card.riasec.map((k) => t(RIASEC[k].name)).join(" · ") : t("검사 전")]);
  if (items.favs) {
    preview.push([t("찜한 직업"), jobs.length ? jobs.join(", ") : t("없음")]);
    preview.push([t("찜한 학과"), majors.length ? majors.join(", ") : t("없음")]);
  }
  if (items.logs) preview.push([t("활동·독서 기록"), t("활동 {a}개 · 독서 {b}권", { a: card.logs ?? 0, b: card.books ?? 0 })]);
  if (items.progress) preview.push([t("진행 단계"), `${card.done ?? 0}/5`]);
  if (items.credits && card.credits) {
    const k = card.credits;
    preview.push([
      t("192학점 진단"),
      k.planned ? `${k.track ? `${t(TRACKS[k.track].name)} · ` : ""}${t("{n}학점", { n: k.total })} · ${t("확인할 점 {n}개", { n: k.warn })}` : t("설계 전"),
    ]);
  }

  return (
    <div className="space-y-5">
      <p className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="note">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <span>{t("이 코드는 이 기기에서 만들어지고 어디에도 저장·전송되지 않아요. 아래에서 고른 내용만 담기고, 이름·학교·연락처·쓴 글은 담기지 않아요. 선생님께 직접 건네기 전에 담긴 내용을 꼭 확인하세요.")}</span>
      </p>

      <div className="card">
        <fieldset>
          <legend className="font-bold">{t("1. 선생님께 보여 줄 내용 고르기")}</legend>
          <p className="mt-1 text-sm text-slate-600">{t("보여 주고 싶지 않은 항목은 체크를 풀어 주세요.")}</p>
          <ul className="mt-3 space-y-2">
            {OPTIONS.map((o) => (
              <li key={o.key}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-surface p-3 hover:border-slate-300">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
                    checked={items[o.key]}
                    onChange={(e) => setItems((p) => ({ ...p, [o.key]: e.target.checked }))}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{t(o.label)}</span>
                    <span className="block text-xs text-slate-600">{t(o.hint)}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <div className="mt-4">
          <label htmlFor="teacher-nick" className="label">{t("닉네임 (선택)")}</label>
          <input
            id="teacher-nick"
            className="input sm:max-w-xs"
            value={nick}
            maxLength={NICK_MAX}
            onChange={(e) => setNick(e.target.value)}
            placeholder={t("선생님이 알아볼 수 있는 이름")}
            autoComplete="off"
          />
          <p className="mt-1 text-xs text-slate-500">{t("비워 두면 이름 없이 보내요. 선생님이 알아볼 수 있게 쓰되, 주민번호·연락처 같은 정보는 쓰지 마세요.")}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="font-bold">{t("2. 담기는 내용 확인")}</h2>
        {preview.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">{t("고른 항목이 없어요. 위에서 하나 이상 골라 주세요.")}</p>
        ) : (
          <dl className="mt-2 divide-y divide-slate-100 text-sm">
            {preview.map(([k, v]) => (
              <div key={k} className="flex flex-wrap gap-x-4 gap-y-0.5 py-1.5">
                <dt className="w-32 shrink-0 text-slate-500">{k}</dt>
                <dd className="min-w-0 flex-1 font-medium text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-slate-800">
          <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-brand-600" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>{t("위 내용을 선생님께 보여 주는 데 동의해요. (내 뜻으로 보내는 것이고, 보내기 싫으면 보내지 않아도 돼요.)")}</span>
        </label>
      </div>

      <div className="card">
        <h2 className="flex items-center gap-2 font-bold"><UserRoundCheck className="h-4 w-4 text-brand-700" aria-hidden /> {t("3. 코드 보내기")}</h2>
        {agree ? (
          <>
            <label htmlFor="teacher-code" className="label mt-3">{t("공유 코드")}</label>
            <textarea id="teacher-code" readOnly className="input min-h-[6rem] font-mono text-xs" value={code} onFocus={(e) => e.currentTarget.select()} spellCheck={false} />
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn-primary" onClick={copy}><Copy className="h-4 w-4" aria-hidden /> {t("코드 복사")}</button>
              <button className="btn-ghost" onClick={save}><Download className="h-4 w-4" aria-hidden /> {t("파일로 저장")}</button>
            </div>
            <p className="mt-2 text-xs text-slate-500">{t("선생님이 ‘선생님 모아 보기’에 이 코드를 붙여 넣거나 파일을 올리면 학급 현황에 들어가요. 내용을 바꾸면 코드를 새로 만들어 다시 보내야 해요.")}</p>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-500">{t("위 내용을 확인하고 동의 칸에 체크하면 코드가 나와요.")}</p>
        )}
        <p className="mt-2 min-h-[1.25rem] text-sm font-semibold text-emerald-700" role="status" aria-live="polite">
          {msg && <><Check className="mr-1 inline h-4 w-4" aria-hidden />{msg}</>}
        </p>
      </div>
    </div>
  );
}

/** /teacher 맨 위: 학생용 공유 코드 만들기로 가는 링크 */
export function ShareLink() {
  const t = useT();
  return (
    <p className="-mt-3 mb-5 text-sm text-slate-600">
      <Link href="/teacher/share" className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">{t("학생이라면 여기서 선생님께 보낼 공유 코드를 만들어요")} <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
    </p>
  );
}
