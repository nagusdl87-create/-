"use client";

// 커리어넷 공식 직업·학과 페이지 화면(마이로드 심화 내용이 없는 직업·학과)
import Link from "next/link";
import type { CnJob, CnJobItem, CnMajor, CnMajorItem } from "@/data/careernet";
import { JOB_GROUP_EMOJI, MAJOR_GROUP_EMOJI } from "@/data/careernet-summary";
import { CareerNetJob, CareerNetMajor } from "@/components/CareerNet";
import { useLang, useT } from "@/lib/i18n";

type Link2 = { name: string; href: string };

function Notice() {
  const t = useT();
  return (
    <p className="rounded-xl bg-sky-50 px-3 py-2 text-xs leading-relaxed text-sky-900">
      {t("이 페이지는 커리어넷 공식 자료로 만들었어요. 하루 흐름·자주 묻는 질문 같은 마이로드 심화 내용은 아직 없어요.")}
    </p>
  );
}

function Same({ title, items }: { title: string; items: Link2[] }) {
  const t = useT();
  if (!items.length) return null;
  return (
    <section className="card">
      <h2 className="mb-2 font-bold">{t(title)}</h2>
      <div className="flex flex-wrap gap-1.5" data-keep-ko>
        {items.map((x) => <Link key={x.href} href={x.href} className="chip hover:border-brand-300">{x.name}</Link>)}
      </div>
    </section>
  );
}

export function CnJobPage({ item, d, same, ourMajors }: { item: CnJobItem; d: CnJob & { fetchedAt: string }; same: Link2[]; ourMajors: { id: string; name: string }[] }) {
  const t = useT();
  const { lang } = useLang();
  return (
    <div className="space-y-4">
      <Link href="/jobs#cn" className="text-sm font-semibold text-slate-500 hover:text-brand-600">{t("← 직업 백과")}</Link>
      <div className="card">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-800" data-keep-ko>{JOB_GROUP_EMOJI[item.group] ?? "💼"} {item.group}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-700" data-keep-ko>{item.field}</span>
          <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-sky-800">{t("커리어넷 공식 정보")}</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900" data-keep-ko lang="ko">{item.name}</h1>
        {lang === "en" && <p className="text-xs text-slate-500">{t("공식 자료라 한국어 원문으로 보여 줘요.")}</p>}
        {d.work[0] && <p className="mt-2 leading-relaxed text-slate-700" data-keep-ko lang="ko">{d.work[0]}</p>}
        {item.rel && <p className="mt-2 text-sm text-slate-500">{t("비슷한 이름")}: <span data-keep-ko>{item.rel}</span></p>}
        <div className="mt-3"><Notice /></div>
      </div>
      <CareerNetJob d={d} ourName={item.name} />
      {ourMajors.length > 0 && (
        <section className="card">
          <h2 className="mb-2 font-bold">{t("마이로드 학과 백과에서 더 보기")}</h2>
          <div className="flex flex-wrap gap-1.5">
            {ourMajors.map((m) => <Link key={m.id} href={`/majors/${m.id}`} className="chip hover:border-brand-300">{t(m.name)}</Link>)}
          </div>
        </section>
      )}
      <Same title="같은 분야의 다른 직업" items={same} />
    </div>
  );
}

export function CnMajorPage({ item, d, same }: { item: CnMajorItem; d: CnMajor & { fetchedAt: string }; same: Link2[] }) {
  const t = useT();
  const { lang } = useLang();
  return (
    <div className="space-y-4">
      <Link href="/majors#cn" className="text-sm font-semibold text-slate-500 hover:text-brand-600">{t("← 학과 백과")}</Link>
      <div className="card">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-violet-800" data-keep-ko>{MAJOR_GROUP_EMOJI[item.field] ?? "🎓"} {item.field}</span>
          <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-sky-800">{t("커리어넷 공식 정보")}</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900" data-keep-ko lang="ko">{item.name}</h1>
        {lang === "en" && <p className="text-xs text-slate-500">{t("공식 자료라 한국어 원문으로 보여 줘요.")}</p>}
        {d.summary && <p className="mt-2 leading-relaxed text-slate-700" data-keep-ko lang="ko">{d.summary}</p>}
        {item.alias && <p className="mt-2 text-sm text-slate-500">{t("대학별 학과 이름")}: <span data-keep-ko>{item.alias}</span></p>}
        {(d.interest || d.property) && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2" data-keep-ko lang="ko">
            {d.interest && <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700"><b className="mb-1 block text-xs text-slate-500">{t("흥미와 적성")}</b>{d.interest}</div>}
            {d.property && <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700"><b className="mb-1 block text-xs text-slate-500">{t("학과 특성")}</b>{d.property}</div>}
          </div>
        )}
        <div className="mt-3"><Notice /></div>
      </div>
      <CareerNetMajor d={d} />
      {d.mainSubjects.length > 0 && (
        <section className="card">
          <h2 className="mb-2 font-bold">{t("대학에서 배우는 주요 과목")}</h2>
          <ul className="grid gap-2 sm:grid-cols-2" data-keep-ko lang="ko">
            {d.mainSubjects.map((s) => (
              <li key={s.name} className="rounded-xl bg-slate-50 p-3 text-sm"><b className="block text-slate-900">{s.name}</b><span className="text-slate-600">{s.desc}</span></li>
            ))}
          </ul>
        </section>
      )}
      <Same title="같은 계열의 다른 학과" items={same} />
    </div>
  );
}
