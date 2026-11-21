"use client";

import { Star } from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toggleIn, useStore } from "@/lib/store";
import { DATA_AS_OF, GN_INDUSTRIES, GN_MIDDLE, GN_SCHOOLS, KIND_INFO, OFFICIAL, REGIONS, EXPERIENCE_SCHOOLS, GENERAL_WITH_VOC, type GnSchool, type HsKind } from "@/data/gn";
import { JOB_MAP } from "@/data/jobs";
import { PageHead } from "@/components/ui";

const SchoolMap = dynamic(() => import("@/components/SchoolMap"), { ssr: false, loading: () => <div className="grid h-full min-h-[320px] place-items-center rounded-2xl bg-slate-100 text-sm text-slate-400">지도를 불러오는 중…</div> });

function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, d2r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * d2r, dLng = (b.lng - a.lng) * d2r;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * d2r) * Math.cos(b.lat * d2r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

const ADM_FILTERS = [
  { id: "all", label: "전체 전형" },
  { id: "eq", label: "평준화(교육감 배정)" },
  { id: "principal", label: "학교장 전형" },
  { id: "early", label: "전기" },
  { id: "late", label: "후기" },
] as const;

export default function SchoolsPage() {
  const { state, update, ready } = useStore();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");
  const [kind, setKind] = useState<HsKind | "all">("all");
  const [adm, setAdm] = useState<(typeof ADM_FILTERS)[number]["id"]>("all");
  const [coedu, setCoedu] = useState("all");
  const [onlySaved, setOnlySaved] = useState(false);
  const [nationwide, setNationwide] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [geo, setGeo] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [geoErr, setGeoErr] = useState("");
  const [addr, setAddr] = useState("");
  const [addrRes, setAddrRes] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const searchAddr = async (q: string) => {
    if (!q.trim()) return;
    setGeoErr("");
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=kr&limit=5&accept-language=ko&q=${encodeURIComponent(q.includes("경남") || q.includes("경상남도") ? q : `경상남도 ${q}`)}`);
      const j = (await r.json()) as { display_name: string; lat: string; lon: string }[];
      setAddrRes(j.map((x) => ({ name: x.display_name.split(",").slice(0, 3).join(","), lat: Number(x.lat), lng: Number(x.lon) })));
      if (!j.length) setGeoErr("검색 결과가 없어요. 동 이름이나 도로명으로 다시 찾아보세요.");
    } catch {
      setGeoErr("주소 검색에 실패했어요. 잠시 후 다시 시도하거나 내 중학교를 선택하세요.");
    }
  };

  const middle = GN_MIDDLE.find((m) => m.name === state.profile.middle);
  const origin = geo ?? (middle ? { lat: middle.lat, lng: middle.lng, label: middle.name } : null);

  useEffect(() => {
    const h = decodeURIComponent(window.location.hash.slice(1));
    if (h && GN_SCHOOLS.some((s) => s.id === h)) setSel(h);
  }, []);

  const list = useMemo(() => {
    let r = GN_SCHOOLS.filter((s) => {
      if (s.quota === 0) return false;
      if (q && !(s.name + s.region + s.addr + s.depts.map((d) => d.name).join(" ")).includes(q.trim())) return false;
      if (region !== "all" && s.region !== region) return false;
      if (kind !== "all" && s.kind !== kind) return false;
      if (coedu !== "all" && s.coedu !== coedu) return false;
      if (nationwide && !s.nationwide) return false;
      if (onlySaved && !state.favSchools.includes(s.id)) return false;
      if (adm === "eq" && !s.zone?.startsWith("평준화 ")) return false;
      if (adm === "principal" && !(s.zone === "비평준화" || s.zone === "평준화지역 학교장전형")) return false;
      if (adm === "early" && s.round !== "전기") return false;
      if (adm === "late" && s.round !== "후기") return false;
      return true;
    }).map((s) => ({ s, d: origin && s.lat != null && s.lng != null ? km(origin, { lat: s.lat, lng: s.lng }) : null }));
    if (origin) r = r.sort((a, b) => (a.d ?? 999) - (b.d ?? 999));
    return r;
  }, [q, region, kind, adm, coedu, nationwide, onlySaved, state.favSchools, origin]);

  const onSelect = useCallback((id: string) => setSel(id), []);
  const mapSchools = useMemo(() => list.map((x) => x.s), [list]);
  const selected = GN_SCHOOLS.find((s) => s.id === sel) ?? null;
  const saved = state.favSchools.map((id) => GN_SCHOOLS.find((s) => s.id === id)).filter(Boolean) as GnSchool[];

  return (
    <div>
      <PageHead
        title="경남 고교 찾기"
        desc={`경상남도 고등학교 ${GN_SCHOOLS.length}곳을 지도에서 찾아보세요. 내 중학교나 현재 위치를 출발점으로 정하면 가까운 순서로 정렬돼요.`}
      />

      <div className="card mb-4 space-y-3 p-4">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <input className="input" placeholder="학교 이름·지역·학과 검색 (예: 항공, 간호, 조리)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="학교 검색" />
          <select className="input sm:w-36" value={region} onChange={(e) => setRegion(e.target.value)} aria-label="시·군">
            <option value="all">경남 전체</option>
            {REGIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <select className="input sm:w-32" value={coedu} onChange={(e) => setCoedu(e.target.value)} aria-label="남녀공학">
            <option value="all">공학·남·여</option>
            <option value="공학">남녀공학</option>
            <option value="남">남고</option>
            <option value="여">여고</option>
          </select>
        </div>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          <button className={`chip shrink-0 ${kind === "all" ? "chip-on" : ""}`} onClick={() => setKind("all")}>모든 유형</button>
          {(Object.keys(KIND_INFO) as HsKind[]).map((k) => {
            const n = GN_SCHOOLS.filter((s) => s.kind === k).length;
            return (
              <button key={k} className={`chip shrink-0 ${kind === k ? "chip-on" : ""}`} onClick={() => setKind(k)}>
                <span className="h-2 w-2 rounded-full" style={{ background: KIND_INFO[k].color }} /> {KIND_INFO[k].name} {n}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {ADM_FILTERS.map((f) => (
            <button key={f.id} className={`chip ${adm === f.id ? "chip-on" : ""}`} onClick={() => setAdm(f.id)}>{f.label}</button>
          ))}
          <label className="chip cursor-pointer">
            <input type="checkbox" checked={nationwide} onChange={(e) => setNationwide(e.target.checked)} className="accent-brand-600" /> 전국 모집
          </label>
          <label className="chip cursor-pointer">
            <input type="checkbox" checked={onlySaved} onChange={(e) => setOnlySaved(e.target.checked)} className="accent-brand-600" /> ⭐ 저장 {ready ? state.favSchools.length : 0}
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <span className="text-xs font-semibold text-slate-500">출발점</span>
          <select
            className="input w-auto py-1.5 text-sm"
            value={state.profile.middle}
            onChange={(e) => {
              setGeo(null);
              update((s) => ({ ...s, profile: { ...s.profile, middle: e.target.value } }));
            }}
            aria-label="내 중학교"
          >
            <option value="">내 중학교 선택</option>
            {GN_MIDDLE.map((m) => (
              <option key={m.name} value={m.name}>
                {m.region} · {m.name}
              </option>
            ))}
          </select>
          <button
            className="btn-ghost py-1.5"
            onClick={() => {
              setGeoErr("");
              if (!navigator.geolocation) return setGeoErr("이 브라우저는 위치를 지원하지 않아요.");
              navigator.geolocation.getCurrentPosition(
                (p) => setGeo({ lat: p.coords.latitude, lng: p.coords.longitude, label: "현재 위치" }),
                () => setGeoErr("위치 권한이 없어요. 내 중학교를 선택해 보세요."),
                { timeout: 8000 }
              );
            }}
          >
            📍 현재 위치
          </button>
          <form
            className="flex gap-1.5"
            onSubmit={(e) => {
              e.preventDefault();
              searchAddr(addr);
            }}
          >
            <input className="input w-48 py-1.5 text-sm" placeholder="주소·동 이름 (예: 상남동)" value={addr} onChange={(e) => setAddr(e.target.value)} aria-label="출발지 주소 검색" />
            <button className="btn-ghost py-1.5">찾기</button>
          </form>
          <div className="flex flex-wrap gap-1">
            {["창원시청", "진주시청", "김해시청", "양산시청", "거제시청", "통영시청"].map((q) => (
              <button key={q} className="chip" onClick={() => searchAddr(q)}>
                {q.replace("시청", "")}
              </button>
            ))}
          </div>
          {origin && <span className="text-xs text-slate-500">‘{origin.label}’에서 가까운 순 (직선거리)</span>}
          {geoErr && <span className="text-xs text-rose-600">{geoErr}</span>}
          {addrRes.length > 0 && (
            <ul className="w-full space-y-1">
              {addrRes.map((a) => (
                <li key={a.name + a.lat}>
                  <button
                    className="w-full rounded-lg px-2 py-1 text-left text-xs hover:bg-slate-50"
                    onClick={() => {
                      setGeo({ lat: a.lat, lng: a.lng, label: a.name.split(",")[0] });
                      setAddrRes([]);
                    }}
                  >
                    📍 {a.name}
                  </button>
                </li>
              ))}
              <li className="px-2 text-[10px] text-slate-400">주소 검색: © OpenStreetMap 기여자 (Nominatim)</li>
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr] [&>*]:min-w-0">
        <div className="h-[340px] lg:sticky lg:top-20 lg:h-[calc(100vh-7rem)]">
          <SchoolMap schools={mapSchools} selected={sel} origin={origin} onSelect={onSelect} />
        </div>
        <div>
          {selected && <Detail s={selected} d={origin && selected.lat != null && selected.lng != null ? km(origin, { lat: selected.lat, lng: selected.lng }) : null} origin={origin} onClose={() => setSel(null)} />}
          <div className="mb-2 text-sm text-slate-500">{list.length}개교</div>
          <ul className="space-y-2">
            {list.map(({ s, d }) => {
              const on = state.favSchools.includes(s.id);
              return (
                <li key={s.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSel(s.id)}
                    onKeyDown={(e) => e.key === "Enter" && setSel(s.id)}
                    className={`card flex cursor-pointer items-start gap-3 p-3 transition hover:border-brand-200 ${sel === s.id ? "border-brand-400 ring-2 ring-brand-100" : ""}`}
                  >
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: KIND_INFO[s.kind].color }} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-bold">{s.name}</div>
                      <div className="text-xs text-slate-500">
                        {s.region} · {KIND_INFO[s.kind].name} · {s.coedu || "-"} · {s.found}
                        {s.zone && ` · ${s.zone}`}
                        {s.nationwide && " · 전국모집"}
                      </div>
                      {s.depts.length > 0 && <div className="truncate text-xs text-emerald-700">{s.depts.map((d) => d.name).join(" · ")}</div>}
                    </div>
                    {d !== null && <span className="shrink-0 text-xs font-bold text-brand-600">{d.toFixed(1)}km</span>}
                    <button
                      aria-label={on ? "저장 해제" : "저장"}
                      aria-pressed={on}
                      className="shrink-0 text-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        update((st) => ({ ...st, favSchools: toggleIn(st.favSchools, s.id) }));
                      }}
                    >
                      <Star className={`h-5 w-5 ${on ? "fill-sun-400 text-sun-500" : "text-slate-300"}`} aria-hidden />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {saved.length > 0 && (
        <div className="card mt-6 overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="p-4 text-left font-bold">저장한 학교 비교</caption>
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="p-3">학교</th>
                <th className="p-3">유형</th>
                <th className="p-3">전형</th>
                <th className="p-3">모집</th>
                <th className="p-3">학급/정원</th>
                <th className="p-3">거리</th>
              </tr>
            </thead>
            <tbody>
              {saved.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="p-3 font-semibold">{s.name}</td>
                  <td className="p-3">{KIND_INFO[s.kind].name}</td>
                  <td className="p-3">{s.round} · {s.zone ?? "학교장 전형"}</td>
                  <td className="p-3">{s.unit}</td>
                  <td className="p-3">{s.classes ?? "-"}학급 / {s.quota ?? "-"}명</td>
                  <td className="p-3">{origin && s.lat != null && s.lng != null ? `${km(origin, { lat: s.lat, lng: s.lng }).toFixed(1)}km` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-xs text-slate-400">
        자료 기준: {DATA_AS_OF}. 학급·정원은 경상남도교육청 고등학교 입학포털 고교현황 기준이며, 거리는 직선거리예요. 실제 통학 시간은 길찾기로 확인하세요. 개교 예정·신입생 미모집 학교는 목록에서 제외하거나 위치가 표시되지 않을 수 있어요.{" "}
        <a className="underline" href={OFFICIAL.gneHigh.url} target="_blank" rel="noreferrer">
          공식 고입포털 ↗
        </a>
      </p>
    </div>
  );
}

function Detail({ s, d, origin, onClose }: { s: GnSchool; d: number | null; origin: { lat: number; lng: number; label: string } | null; onClose: () => void }) {
  const { state, update } = useStore();
  const on = state.favSchools.includes(s.id);
  const inds = GN_INDUSTRIES.filter((i) => i.schools.includes(s.name));
  const exp = EXPERIENCE_SCHOOLS.includes(s.name);
  const voc = GENERAL_WITH_VOC.find((g) => g.school === s.name);
  const kakao = s.lat != null && s.lng != null
    ? origin
      ? `https://map.kakao.com/link/from/${encodeURIComponent(origin.label)},${origin.lat},${origin.lng}/to/${encodeURIComponent(s.name)},${s.lat},${s.lng}`
      : `https://map.kakao.com/link/to/${encodeURIComponent(s.name)},${s.lat},${s.lng}`
    : `https://map.kakao.com/?q=${encodeURIComponent(s.name)}`;

  return (
    <div className="card mb-4 border-brand-200">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-semibold" style={{ color: KIND_INFO[s.kind].color }}>
            {KIND_INFO[s.kind].emoji} {KIND_INFO[s.kind].name}
            {exp && " · 체험위주 특성화고"}
          </div>
          <h2 className="text-xl font-extrabold">{s.name}</h2>
          <div className="text-xs text-slate-500">{s.addr}</div>
        </div>
        <button className="text-slate-400" onClick={onClose} aria-label="상세 닫기">✕</button>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        {[
          ["지역", s.region],
          ["전형 시기", s.round],
          ["학군·전형", s.zone ?? "학교장 전형"],
          ["모집 단위", s.unit],
          ["학급 / 정원", s.classes != null ? `${s.classes}학급 / ${s.quota}명` : "-"],
          ["설립 · 성별", `${s.found || "-"} · ${s.coedu || "-"}`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-slate-50 p-2">
            <dt className="text-[11px] text-slate-500">{k}</dt>
            <dd className="font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      {s.depts.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-bold text-slate-500">학과별 모집 (2027학년도)</div>
          <ul className="mt-1 grid gap-1 sm:grid-cols-2">
            {s.depts.map((d) => (
              <li key={d.name} className="flex justify-between rounded-lg border border-slate-100 px-2.5 py-1.5 text-sm">
                <span className="font-semibold">{d.name}</span>
                <span className="text-xs text-slate-500">{d.classes}학급 · {d.quota}명</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {voc && <p className="mt-2 text-xs text-emerald-700">이 일반고에는 특성화과({voc.dept})가 있어 해당 학과는 전기에 선발해요.</p>}
      {d !== null && <Commute d={d} label={origin?.label ?? ""} />}
      {inds.length > 0 && (
        <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm">
          <div className="text-xs font-bold text-emerald-800">경남 산업 연계</div>
          {inds.map((i) => (
            <div key={i.id} className="mt-1">
              {i.emoji} {i.name}:{" "}
              {i.jobs.map((j) => JOB_MAP[j] && (
                <Link key={j} href={`/jobs/${j}`} className="mr-1 font-semibold text-emerald-900 underline">
                  {JOB_MAP[j].name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button className={`btn ${on ? "bg-amber-100 text-amber-900" : "btn-ghost"}`} onClick={() => update((st) => ({ ...st, favSchools: toggleIn(st.favSchools, s.id) }))}>
          {on ? "⭐ 저장됨" : "☆ 관심 학교 저장"}
        </button>
        <a className="btn-ghost" href={kakao} target="_blank" rel="noreferrer">🧭 카카오맵 길찾기</a>
        <a className="btn-ghost" href={`https://map.naver.com/p/search/${encodeURIComponent(s.name)}`} target="_blank" rel="noreferrer">네이버 지도</a>
        {s.home && <a className="btn-ghost" href={s.home} target="_blank" rel="noreferrer">🏠 학교 누리집</a>}
        {s.hischool && <a className="btn-ghost" href={s.hischool} target="_blank" rel="noreferrer">📄 고입정보포털</a>}
        <a className="btn-ghost" href={OFFICIAL.schoolinfo.url} target="_blank" rel="noreferrer">📊 학교알리미</a>
        {s.tel && <a className="btn-ghost" href={`tel:${s.tel}`}>☎ {s.tel}</a>}
      </div>
      <p className="mt-2 text-xs text-slate-400">교육과정 편제표(개설 과목)는 학교 누리집 또는 고입정보포털에서 확인한 뒤 192학점 설계에 반영해 보세요.</p>
    </div>
  );
}

// 직선거리 기반 통학 추정 (도로 우회 계수 1.3 적용, 참고용)
function Commute({ d, label }: { d: number; label: string }) {
  const road = d * 1.3;
  const walkMin = Math.round((road / 4.5) * 60);
  const steps = Math.round(road * 1300);
  const kcal = Math.round(road * 50);
  const carMin = Math.max(3, Math.round((road / 28) * 60));
  const busMin = Math.max(8, Math.round((road / 18) * 60 + 8));
  const verdict = walkMin <= 25 ? "걸어서 다닐 만해요" : busMin <= 40 ? "대중교통 권장" : "통학 시간이 길어요 (기숙사·통학버스 확인)";
  return (
    <div className="mt-3 rounded-xl border border-slate-200 p-3">
      <div className="text-xs font-semibold text-slate-500">{label}에서 통학 추정 · 직선 {d.toFixed(1)}km</div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg bg-slate-50 p-2">
          <div className="text-xs text-slate-500">도보</div>
          <b>약 {walkMin}분</b>
          <div className="text-[11px] text-slate-500">{steps.toLocaleString()}보 · {kcal}kcal</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <div className="text-xs text-slate-500">버스·대중교통</div>
          <b>약 {busMin}분</b>
          <div className="text-[11px] text-slate-500">대기·환승 포함 추정</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <div className="text-xs text-slate-500">승용차</div>
          <b>약 {carMin}분</b>
          <div className="text-[11px] text-slate-500">출근 시간 제외</div>
        </div>
      </div>
      <p className="mt-2 text-xs text-brand-700">{verdict}</p>
      <p className="text-[11px] text-slate-400">실제 노선·시간은 아래 길찾기(카카오맵·네이버 지도)에서 확인하세요. 배정과는 무관한 참고 정보예요.</p>
    </div>
  );
}
