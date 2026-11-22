"use client";

// 과목명·계열 이름 표기 (영어 모드 대응)
// 영어 과목명은 src/i18n/names.ts(useNames)에서 가져온다.
import { useCallback, useMemo } from "react";
import { TRACKS, type TrackId } from "@/data/subjects";
import { useLang, useT } from "@/lib/i18n";
import { useNames } from "@/i18n/names";
import type { CheckFmt } from "@/lib/credits";

/** 과목명 → 화면 표기. 지금은 한국어 그대로 (영어 과목명 연결 예정) */
export function subjectLabel(name: string, _lang: "ko" | "en" = "ko"): string {
  // 영어 과목명: src/i18n/subjectName.ts 의 subjectEn 연결 예정
  return name;
}

/** 과목 설명 → 화면 표기. 지금은 한국어 그대로 (영어 과목 설명 연결 예정) */
export function subjectDescLabel(_name: string, desc: string, _lang: "ko" | "en" = "ko"): string {
  return desc;
}

/** 화면용 표기 도구: 과목명(sl)·과목 설명(sd)·계열 이름(tl)·진단 문구 형식(fmt) */
export function useLabels() {
  const t = useT();
  const { lang } = useLang();
  const n = useNames();
  const sl = useCallback((name: string) => n.subject(name), [n]);
  const sd = useCallback((name: string, desc: string) => n.subjectDesc(name, desc), [n]);
  // 계열 이름은 credits 사전(src/i18n/en/credits.ts)에서 번역
  const tl = useCallback((id: TrackId) => t(TRACKS[id].name), [t]);
  const fmt = useMemo<CheckFmt>(() => ({ t, subject: sl, track: tl }), [t, sl, tl]);
  return { t, lang, sl, sd, tl, fmt };
}

/** 계열 이름 (훅 없이 쓸 때: 번역 함수를 넘김) */
export const trackLabel = (id: TrackId, t: (ko: string) => string = (s) => s) => t(TRACKS[id].name);
