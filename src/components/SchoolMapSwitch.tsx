"use client";

// 카카오맵을 먼저 쓰고, 불러오지 못하면 OpenStreetMap(Leaflet) 지도로 바꾼다.
import { useState } from "react";
import dynamic from "next/dynamic";
import type { GnSchool } from "@/data/gn";
import { KAKAO_JS_KEY } from "@/lib/site";
import { useT } from "@/lib/i18n";

function Loading() {
  const t = useT();
  return <div className="grid h-full min-h-[320px] place-items-center rounded-2xl bg-slate-100 text-sm text-slate-500">{t("지도를 불러오는 중…")}</div>;
}
const Kakao = dynamic(() => import("./KakaoSchoolMap"), { ssr: false, loading: Loading });
const Leaflet = dynamic(() => import("./SchoolMap"), { ssr: false, loading: Loading });

type Props = { schools: GnSchool[]; selected: string | null; origin: { lat: number; lng: number; label: string } | null; onSelect: (id: string) => void };

export function SchoolMapSwitch(p: Props) {
  const [kakao, setKakao] = useState(!!KAKAO_JS_KEY);
  return kakao ? <Kakao {...p} onFail={() => setKakao(false)} /> : <Leaflet {...p} />;
}
