"use client";

// 카카오맵 (최신 지리: 카카오가 지도를 계속 갱신). 키: src/lib/site.ts의 KAKAO_JS_KEY (웹에 공개되는 JavaScript 키, 등록한 도메인에서만 작동)
// SDK를 못 불러오면(키 없음·도메인 미등록·차단) onFail을 불러 OpenStreetMap 지도로 바꾼다.
import { useEffect, useRef, useState } from "react";
import { gnText, KIND_INFO, type GnSchool } from "@/data/gn";
import { useEnData, useT } from "@/lib/i18n";
import { KAKAO_JS_KEY } from "@/lib/site";

type Props = {
  schools: GnSchool[];
  selected: string | null;
  origin: { lat: number; lng: number; label: string } | null;
  onSelect: (id: string) => void;
  onFail: () => void;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type K = any;
let sdk: Promise<K> | null = null;
function loadKakao(): Promise<K> {
  if (sdk) return sdk;
  sdk = new Promise((resolve, reject) => {
    const w = window as K;
    if (w.kakao?.maps) return w.kakao.maps.load(() => resolve(w.kakao));
    const s = document.createElement("script");
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`;
    s.async = true;
    s.onload = () => (w.kakao?.maps ? w.kakao.maps.load(() => resolve(w.kakao)) : reject(new Error("no kakao")));
    s.onerror = () => reject(new Error("kakao sdk blocked"));
    document.head.appendChild(s);
    setTimeout(() => reject(new Error("kakao sdk timeout")), 8000);
  });
  sdk.catch(() => { sdk = null; });
  return sdk;
}

function dot(color: string, big: boolean, label: string) {
  const d = document.createElement("button");
  d.type = "button";
  d.setAttribute("aria-label", label);
  d.title = label;
  const r = big ? 22 : 14;
  d.style.cssText = `width:${r}px;height:${r}px;border-radius:9999px;background:${color};border:${big ? 3 : 2}px solid ${big ? "#111827" : "#fff"};box-shadow:0 1px 3px rgba(0,0,0,.35);cursor:pointer;padding:0;transform:translate(-50%,-50%)`;
  return d;
}

export default function KakaoSchoolMap({ schools, selected, origin, onSelect, onFail }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<K>(null);
  const overlays = useRef<Map<string, { o: K; s: GnSchool }>>(new Map());
  const extra = useRef<K[]>([]);
  const [ready, setReady] = useState(false);
  const failRef = useRef(onFail);
  const t = useT();
  const g = gnText(useEnData(() => import("@/i18n/data/gn.en"), "gn"));
  const gRef = useRef({ t, g });
  gRef.current = { t, g };
  failRef.current = onFail;

  useEffect(() => {
    let alive = true;
    if (!KAKAO_JS_KEY) { failRef.current(); return; }
    loadKakao().then((kakao) => {
      if (!alive || !el.current) return;
      map.current = new kakao.maps.Map(el.current, { center: new kakao.maps.LatLng(35.25, 128.35), level: 11 });
      map.current.setZoomable(true);
      map.current.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
      const ro = new ResizeObserver(() => map.current?.relayout());
      ro.observe(el.current);
      setReady(true);
      return () => ro.disconnect();
    }).catch(() => alive && failRef.current());
    return () => { alive = false; };
  }, []);

  // 학교 점 그리기
  useEffect(() => {
    const m = map.current;
    const kakao = (window as K).kakao;
    if (!ready || !m || !kakao) return;
    overlays.current.forEach(({ o }) => o.setMap(null));
    overlays.current.clear();
    extra.current.forEach((o) => o.setMap(null));
    extra.current = [];
    const bounds = new kakao.maps.LatLngBounds();
    let n = 0;
    for (const s of schools) {
      if (s.lat == null || s.lng == null) continue;
      const pos = new kakao.maps.LatLng(s.lat, s.lng);
      const c = dot(KIND_INFO[s.kind].color, false, `${s.name} · ${gRef.current.g.kind(s.kind)}`);
      c.onclick = () => onSelect(s.id);
      const o = new kakao.maps.CustomOverlay({ position: pos, content: c, yAnchor: 0, xAnchor: 0, zIndex: 1 });
      o.setMap(m);
      overlays.current.set(s.id, { o, s });
      bounds.extend(pos);
      n++;
    }
    if (origin) {
      const pos = new kakao.maps.LatLng(origin.lat, origin.lng);
      const c = dot("#facc15", true, gRef.current.t("출발: {label}", { label: origin.label }));
      const o = new kakao.maps.CustomOverlay({ position: pos, content: c, yAnchor: 0, xAnchor: 0, zIndex: 3 });
      o.setMap(m);
      extra.current.push(o);
      bounds.extend(pos);
      n++;
    }
    if (n) m.setBounds(bounds, 40, 40, 40, 40);
  }, [ready, schools, origin, onSelect, g.en]);

  // 고른 학교 강조 + 이름표
  useEffect(() => {
    const m = map.current;
    const kakao = (window as K).kakao;
    if (!ready || !m || !kakao || !selected) return;
    const hit = overlays.current.get(selected);
    if (!hit) return;
    const { s, o } = hit;
    const pos = new kakao.maps.LatLng(s.lat, s.lng);
    o.setMap(null);
    const big = dot(KIND_INFO[s.kind].color, true, `${s.name} · ${gRef.current.g.kind(s.kind)}`);
    const sel = new kakao.maps.CustomOverlay({ position: pos, content: big, yAnchor: 0, xAnchor: 0, zIndex: 4 });
    const tag = document.createElement("div");
    tag.textContent = s.name;
    tag.setAttribute("data-keep-ko", "");
    tag.style.cssText = "transform:translate(-50%,-150%);background:#fff;border:1px solid #cbd5e1;border-radius:8px;padding:2px 8px;font-size:12px;font-weight:600;color:#0f172a;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.2)";
    const label = new kakao.maps.CustomOverlay({ position: pos, content: tag, yAnchor: 0, xAnchor: 0, zIndex: 5 });
    sel.setMap(m);
    label.setMap(m);
    if (m.getLevel() > 6) m.setLevel(6);
    m.panTo(pos);
    return () => { sel.setMap(null); label.setMap(null); o.setMap(m); };
  }, [ready, selected, g.en]);

  return <div ref={el} className="h-full min-h-[320px] w-full overflow-hidden rounded-2xl bg-slate-100" role="application" aria-label={t("경남 고등학교 지도 (카카오맵)")} />;
}
