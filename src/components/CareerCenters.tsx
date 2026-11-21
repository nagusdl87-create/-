"use client";

import { useState } from "react";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import centers from "@/data/gn-career-centers.json";

type C = { name: string; office: string; address: string; tel: string; homepage: string; lat: number; lng: number };

export function CareerCenters() {
  const [frame, setFrame] = useState(false);
  const list = (centers as { centers: C[] }).centers;
  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <div key={c.name} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="font-semibold text-slate-900">{c.name}</div>
            <div className="text-xs text-slate-500">{c.office}</div>
            <div className="mt-2 text-sm text-slate-600">
              <MapPin className="mr-1 inline h-3.5 w-3.5" aria-hidden />
              {c.address}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {c.tel && (
                <a href={`tel:${c.tel}`} className="chip">
                  <Phone className="h-3 w-3" /> {c.tel}
                </a>
              )}
              {c.homepage && (
                <a href={c.homepage.startsWith("http") ? c.homepage : `http://${c.homepage}`} target="_blank" rel="noreferrer" className="chip">
                  누리집 <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <a href={`https://map.kakao.com/link/to/${encodeURIComponent(c.name)},${c.lat},${c.lng}`} target="_blank" rel="noreferrer" className="chip">
                길찾기
              </a>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-400">출처: 꿈길 진로체험지원센터 안내(경상남도), 공공데이터포털 15123665.</p>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="font-semibold">꿈길에서 바로 찾아보기</div>
            <div className="text-xs text-slate-500">진로체험 프로그램 검색·신청은 꿈길에서 학교를 통해 해요.</div>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost py-1.5" onClick={() => setFrame(!frame)}>{frame ? "접기" : "이 화면에서 열기"}</button>
            <a className="btn-primary py-1.5" href="https://www.ggoomgil.go.kr/" target="_blank" rel="noreferrer">
              새 창으로 <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        {frame && <iframe title="꿈길" src="https://www.ggoomgil.go.kr/" className="mt-3 h-[70vh] w-full rounded-xl border border-slate-200" loading="lazy" />}
      </div>
    </div>
  );
}
