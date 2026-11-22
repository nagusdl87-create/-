"use client";

// 경남 중학교 정보: 주소·연락처, 급식, 학사일정, 가까운 고등학교, 진로체험지원센터
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, MapPin, Navigation, Phone, School, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import { GN_MIDDLE, GN_SCHOOLS, KIND_INFO, type GnMiddle } from "@/data/gn";
import centersRaw from "@/data/gn-career-centers.json";
import { PageHead } from "@/components/ui";
import { SchoolTabs } from "@/components/SchoolTabs";
import { SchoolMeal, SchoolSchedule } from "@/components/Neis";

type Center = { name: string; office: string; address: string; tel: string; homepage: string; lat: number; lng: number };
const CENTERS = (centersRaw as { centers: Center[] }).centers;
const REGIONS = [...new Set(GN_MIDDLE.map((m) => m.region))].sort((a, b) => a.localeCompare(b, "ko"));

function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export default function MiddlePage() {
  const { state, update, ready } = useStore();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");
  const [sel, setSel] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    const h = decodeURIComponent(window.location.hash.slice(1));
    const hit = GN_MIDDLE.find((m) => m.code === h || m.name === h);
    if (hit) setSel(hit.code ?? hit.name);
    else { const my = GN_MIDDLE.find((m) => m.name === state.profile.middle); if (my) setSel(my.code ?? my.name); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const list = useMemo(() => {
    const t = q.trim();
    return GN_MIDDLE.filter((m) => (region === "all" || m.region === region) && (!t || (m.name + m.region + (m.addr ?? "")).includes(t)));
  }, [q, region]);
  const selected = GN_MIDDLE.find((m) => (m.code ?? m.name) === sel) ?? null;
  const mine = state.profile.middle;

  return (
    <div>
      <PageHead tone="emerald" eyebrow="경남 중학교" title="중학교 정보" desc={`경상남도 중학교 ${GN_MIDDLE.length}곳의 연락처, 급식, 학사일정과 가까운 고등학교를 한곳에서 봐요. 내 중학교로 정해 두면 홈과 고교 찾기에서도 함께 써요.`} />
      <SchoolTabs active="ms" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr] [&>*]:min-w-0">
        <div className="card">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="ms-q">중학교 이름·지역 검색</label>
            <input id="ms-q" className="input" placeholder="중학교 이름·지역 검색 (예: 삼천포, 진주)" value={q} onChange={(e) => setQ(e.target.value)} />
            <label className="sr-only" htmlFor="ms-region">지역</label>
            <select id="ms-region" className="input sm:w-36" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="all">경남 전체</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="mt-3 text-xs text-slate-500">{list.length}개교</div>
          <ul className="mt-2 max-h-[60vh] space-y-1.5 overflow-y-auto pr-1">
            {list.map((m) => (
              <li key={m.code ?? m.name + m.region}>
                <button type="button" aria-pressed={sel === (m.code ?? m.name)} onClick={() => { setSel(m.code ?? m.name); history.replaceState(null, "", `#${m.code ?? m.name}`); }}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition ${sel === (m.code ?? m.name) ? "border-brand-400 bg-brand-50" : "border-slate-200 hover:border-brand-200"}`}>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-slate-900">{m.name}{mine === m.name && <span className="ml-1.5 text-xs font-medium text-brand-700">내 학교</span>}</span>
                    <span className="block text-xs text-slate-500">{m.region}{m.coedu && ` · ${m.coedu}`}{m.found && ` · ${m.found}`}</span>
                  </span>
                </button>
              </li>
            ))}
            {!list.length && <li className="py-6 text-center text-sm text-slate-500">찾는 중학교가 없어요.</li>}
          </ul>
        </div>

        <div className="min-w-0">
          {selected ? (
            <Detail m={selected} mine={mine === selected.name} onMine={() => update((s) => ({ ...s, profile: { ...s.profile, middle: selected.name, school: s.profile.stage !== "hs" && !s.profile.school ? selected.name : s.profile.school } }))} />
          ) : (
            <div className="card grid min-h-[240px] place-items-center text-center text-sm text-slate-500">
              <div><School className="mx-auto h-8 w-8 text-slate-400" aria-hidden /><p className="mt-2">왼쪽 목록에서 중학교를 골라 주세요.</p></div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">학교 정보: 나이스 교육정보 개방 포털 학교기본정보·급식·학사일정, 공공데이터포털 전국초중등학교위치표준데이터. 거리는 직선거리예요.</p>
    </div>
  );
}

function Detail({ m, mine, onMine }: { m: GnMiddle; mine: boolean; onMine: () => void }) {
  const near = GN_SCHOOLS.filter((s) => s.lat != null && s.lng != null && s.quota !== 0)
    .map((s) => ({ s, d: km(m, { lat: s.lat as number, lng: s.lng as number }) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 8);
  const centers = CENTERS.map((c) => ({ c, d: km(m, c) })).sort((a, b) => a.d - b.d).slice(0, 2);
  const kakao = `https://map.kakao.com/link/to/${encodeURIComponent(m.name)},${m.lat},${m.lng}`;

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="text-xs font-semibold text-brand-700">{m.region} · 중학교</div>
        <h2 className="mt-0.5 text-xl font-extrabold text-slate-900">{m.name}</h2>
        {m.addr && <p className="mt-1 flex items-start gap-1 text-sm text-slate-600"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{m.addr}</p>}
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          {[["설립", m.found || "-"], ["성별", m.coedu || "-"], ["지역", m.region]].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-slate-50 p-2"><dt className="text-[11px] text-slate-500">{k}</dt><dd className="font-semibold">{v}</dd></div>
          ))}
        </dl>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={mine ? "btn bg-amber-100 text-amber-900" : "btn-primary"} onClick={onMine} aria-pressed={mine}>
            <Star className={`h-4 w-4 ${mine ? "fill-current" : ""}`} aria-hidden /> {mine ? "내 중학교로 저장됨" : "내 중학교로 정하기"}
          </button>
          <a className="btn-ghost" href={kakao} target="_blank" rel="noreferrer"><Navigation className="h-4 w-4" aria-hidden /> 카카오맵 길찾기</a>
          {m.home && <a className="btn-ghost" href={m.home} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" aria-hidden /> 학교 누리집</a>}
          {m.tel && <a className="btn-ghost" href={`tel:${m.tel}`}><Phone className="h-4 w-4" aria-hidden /> {m.tel}</a>}
        </div>
        <p className="mt-2 text-xs text-slate-500">내 중학교로 정하면 고교 찾기에서 이 학교 기준으로 가까운 순서로 정렬되고, 홈에서 급식·학사일정을 바로 볼 수 있어요.</p>
        {m.code && <SchoolMeal code={m.code} />}
        {m.code && <SchoolSchedule code={m.code} />}
      </div>

      <div className="card">
        <h3 className="font-bold">가까운 고등학교</h3>
        <ul className="mt-2 divide-y divide-slate-100">
          {near.map(({ s, d }) => (
            <li key={s.id}>
              <Link href={`/schools#${s.id}`} className="flex items-center justify-between gap-3 py-2 text-sm hover:text-brand-700">
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{s.name}</span>
                  <span className="block text-xs text-slate-500">{KIND_INFO[s.kind].name}{s.zone && ` · ${s.zone}`} · {s.round}</span>
                </span>
                <span className="shrink-0 text-xs font-bold text-brand-700">{d.toFixed(1)}km</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/schools" className="mt-2 inline-block text-sm font-semibold text-brand-700" onClick={onMine}>내 중학교로 정하고 고교 지도에서 보기 →</Link>
      </div>

      <div className="card">
        <h3 className="font-bold">가까운 진로체험지원센터</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {centers.map(({ c, d }) => (
            <li key={c.name} className="rounded-lg bg-slate-50 p-2.5">
              <div className="flex justify-between gap-2"><b>{c.name}</b><span className="text-xs text-slate-500">{d.toFixed(1)}km</span></div>
              <div className="text-xs text-slate-600">{c.address}</div>
              <div className="mt-1 flex flex-wrap gap-2 text-xs">
                {c.tel && <a className="underline" href={`tel:${c.tel}`}>{c.tel}</a>}
                {c.homepage && <a className="underline" href={c.homepage} target="_blank" rel="noreferrer">누리집</a>}
              </div>
            </li>
          ))}
        </ul>
        <Link href="/resources" className="mt-2 inline-block text-sm font-semibold text-brand-700">진로체험 자료 더 보기 →</Link>
      </div>
    </div>
  );
}
