"use client";

import { useState } from "react";
import { PlayCircle, ExternalLink, Play } from "lucide-react";
import { videoSearchLinks, type Video } from "@/data/videos";

export function Videos({ videos, query }: { videos: Video[]; query: string }) {
  const [i, setI] = useState(0);
  const [play, setPlay] = useState<string | null>(null);
  const v = videos[i];
  return (
    <div>
      {v ? (
        <>
          <div className="aspect-video overflow-hidden rounded-2xl bg-slate-900">
            {play === v.id ? (
              <iframe
                key={v.id}
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0&autoplay=1`}
                title={`${v.title} - ${v.channel}`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              // 누르기 전에는 썸네일만(유튜브 플레이어 약 1MB를 미리 받지 않음)
              <button type="button" onClick={() => setPlay(v.id)} className="group relative block h-full w-full" aria-label={`영상 재생: ${v.title} - ${v.channel}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-black/60 text-white shadow-lg transition group-hover:scale-105 group-hover:bg-red-600">
                    <Play className="ml-1 h-8 w-8 fill-white" aria-hidden />
                  </span>
                </span>
              </button>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span>
              <b>{v.title}</b> <span className="text-slate-500">· {v.channel}</span>
            </span>
            {videos.length > 1 && (
              <span className="flex items-center gap-1">
                {videos.map((x, k) => (
                  <button key={x.id} aria-pressed={k === i} onClick={() => setI(k)} className={`chip ${k === i ? "chip-on" : ""}`}>
                    <PlayCircle className="h-3.5 w-3.5" /> {k + 1}
                  </button>
                ))}
              </span>
            )}
          </div>
        </>
      ) : (
        <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">공식 채널에서 ‘{query}’ 관련 직업인 인터뷰·현장 영상을 찾아볼 수 있어요.</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {videoSearchLinks(query).map((l) => (
          <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="btn-ghost py-1.5 text-xs">
            {l.label}에서 찾기 <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ))}
      </div>
    </div>
  );
}
