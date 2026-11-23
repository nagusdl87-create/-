"use client";

// 커리어넷 공식 정보(직업백과·학과정보) 표시. 자료는 한국어 원문이라 영어 모드에서도 원문을 보여 주고(data-keep-ko) 안내를 붙인다.
import { ExternalLink } from "lucide-react";
import type { CnJob, CnMajor } from "@/data/careernet";
import { useLang, useT } from "@/lib/i18n";

const Box = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <div className="mb-1 text-xs font-bold text-slate-500">{title}</div>
    {children}
  </div>
);

function Head({ title, basis, fetchedAt }: { title: string; basis?: string; fetchedAt: string }) {
  const t = useT();
  const { lang } = useLang();
  return (
    <div className="mb-3">
      <h2 className="font-bold text-slate-900">{t(title)}</h2>
      <p className="mt-0.5 text-xs text-slate-500">
        {basis && <>{t("커리어넷에서 가장 가까운 직업")} ‘<span data-keep-ko>{basis}</span>’ {t("기준이에요.")} </>}
        {t("{date} 기준 · 매주 자동 갱신", { date: fetchedAt })}
        {lang === "en" && <> · {t("공식 자료라 한국어 원문으로 보여 줘요.")}</>}
      </p>
    </div>
  );
}

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="space-y-1 text-sm leading-relaxed text-slate-700" data-keep-ko lang="ko">
    {items.map((x) => (
      <li key={x} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden />{x}</li>
    ))}
  </ul>
);

const Chips = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-1.5" data-keep-ko lang="ko">
    {items.map((x) => <span key={x} className="rounded-lg bg-surface px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">{x}</span>)}
  </div>
);

export function CareerNetJob({ d, ourName }: { d: CnJob & { fetchedAt: string }; ourName: string }) {
  const t = useT();
  const same = d.name.replace(/\s/g, "") === ourName.replace(/\s/g, "");
  const eduMax = d.edu ? Math.max(...d.edu.values, 1) : 1;
  return (
    <section className="card" aria-labelledby="cn-job">
      <div id="cn-job">
        <Head title="커리어넷 공식 직업 정보" basis={same ? undefined : d.name} fetchedAt={d.fetchedAt} />
      </div>
      <div className="grid gap-2 sm:grid-cols-4">
        {d.wage && <Box title={t("연봉(중앙값)")}><div className="text-lg font-bold text-slate-900">{t("{n}만 원", { n: d.wage })}</div></Box>}
        {d.satisfaction != null && <Box title={t("직업 만족도")}><div className="text-lg font-bold text-slate-900">{d.satisfaction}%</div></Box>}
        {d.wlb && <Box title={t("일·가정 균형")}><div className="text-lg font-bold text-slate-900" data-keep-ko>{d.wlb}</div></Box>}
        {d.social && <Box title={t("사회 공헌")}><div className="text-lg font-bold text-slate-900" data-keep-ko>{d.social}</div></Box>}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {d.work.length > 0 && <div><h3 className="mb-1.5 text-sm font-bold">{t("하는 일")}</h3><Bullets items={d.work} /></div>}
        <div className="space-y-4">
          {(d.aptitude.length > 0 || d.interest.length > 0) && <div><h3 className="mb-1.5 text-sm font-bold">{t("적성과 흥미")}</h3><Bullets items={[...d.aptitude, ...d.interest]} /></div>}
          {d.abilities.length > 0 && <div><h3 className="mb-1.5 text-sm font-bold">{t("핵심 능력")}</h3><Chips items={d.abilities} /></div>}
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {d.majors.length > 0 && <div><h3 className="mb-1.5 text-sm font-bold">{t("관련 학과")}</h3><Chips items={d.majors} /></div>}
        {d.certs.length > 0 && <div><h3 className="mb-1.5 text-sm font-bold">{t("관련 자격")}</h3><Chips items={d.certs} /></div>}
      </div>
      {d.curriculum.length > 0 && <div className="mt-4"><h3 className="mb-1.5 text-sm font-bold">{t("되는 방법")}</h3><Bullets items={d.curriculum} /></div>}
      {d.research.length > 0 && <div className="mt-4"><h3 className="mb-1.5 text-sm font-bold">{t("지금 해 볼 수 있는 탐색 활동")}</h3><Bullets items={d.research} /></div>}
      {d.forecast.length > 0 && <div className="mt-4"><h3 className="mb-1.5 text-sm font-bold">{t("일자리 전망")}</h3><Bullets items={d.forecast} /></div>}
      {d.edu && (
        <div className="mt-4">
          <h3 className="mb-1.5 text-sm font-bold">{t("종사자 학력 분포")}</h3>
          <ul className="space-y-1">
            {d.edu.labels.map((l, i) => (
              <li key={l} className="flex items-center gap-2 text-xs">
                <span className="w-16 shrink-0 text-slate-600" data-keep-ko>{l}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-brand-500" style={{ width: `${(d.edu!.values[i] / eduMax) * 100}%` }} /></span>
                <span className="w-9 shrink-0 text-right font-semibold text-slate-700">{d.edu!.values[i]}%</span>
              </li>
            ))}
          </ul>
          <p className="mt-1 text-[11px] text-slate-500" data-keep-ko>{d.edu.source}</p>
        </div>
      )}
      {d.orgs.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-1.5 text-sm font-bold">{t("관련 기관")}</h3>
          <div className="flex flex-wrap gap-2 text-sm" data-keep-ko>
            {d.orgs.map((o) => (o.url ? <a key={o.name} href={o.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-700 underline-offset-2 hover:underline">{o.name}<ExternalLink className="h-3 w-3" aria-hidden /></a> : <span key={o.name}>{o.name}</span>))}
          </div>
        </div>
      )}
      <p className="mt-4 text-[11px] text-slate-500">{t("출처: 커리어넷 직업백과(오픈API). 임금·만족도는 커리어넷이 인용한 워크넷 조사 자료예요.")}</p>
    </section>
  );
}

export function CareerNetMajor({ d }: { d: CnMajor & { fetchedAt: string } }) {
  const t = useT();
  return (
    <section className="card" aria-labelledby="cn-major">
      <div id="cn-major">
        <Head title="커리어넷 공식 학과 정보" fetchedAt={d.fetchedAt} />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {d.employment && <Box title={t("취업률")}><div className="text-lg font-bold text-slate-900" data-keep-ko>{d.employment}</div></Box>}
        {d.salary && <Box title={t("졸업 후 첫 직장 월평균 임금")}><div className="text-lg font-bold text-slate-900">{t("{n}만 원", { n: d.salary })}</div></Box>}
        {d.univCount > 0 && <Box title={t("개설 대학")}><div className="text-lg font-bold text-slate-900">{t("{n}곳", { n: d.univCount })}</div></Box>}
      </div>
      {d.subjects2022.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-1.5 text-sm font-bold">{t("관련 고교 선택 과목(2022 개정)")}</h3>
          <dl className="space-y-1.5 text-sm" data-keep-ko lang="ko">
            {d.subjects2022.map((s) => (
              <div key={s.kind} className="flex gap-2"><dt className="w-20 shrink-0 font-semibold text-slate-600">{s.kind}</dt><dd className="text-slate-700">{s.names}</dd></div>
            ))}
          </dl>
        </div>
      )}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {d.fields.length > 0 && <div><h3 className="mb-1.5 text-sm font-bold">{t("졸업 후 진출 분야")}</h3><Bullets items={d.fields.map((f) => `${f.name}: ${f.desc}`)} /></div>}
        {d.activities.length > 0 && <div><h3 className="mb-1.5 text-sm font-bold">{t("고등학생 진로 탐색 활동")}</h3><Bullets items={d.activities.map((a) => `${a.name}: ${a.desc}`)} /></div>}
      </div>
      {d.jobs && <div className="mt-4"><h3 className="mb-1.5 text-sm font-bold">{t("관련 직업")}</h3><Chips items={d.jobs.split(/,\s*/).filter(Boolean)} /></div>}
      {d.qualifications && <div className="mt-4"><h3 className="mb-1.5 text-sm font-bold">{t("관련 자격")}</h3><Chips items={d.qualifications.split(/,\s*/).filter(Boolean)} /></div>}
      <p className="mt-4 text-[11px] text-slate-500">{t("출처: 커리어넷 학과정보(오픈API).")}</p>
    </section>
  );
}
