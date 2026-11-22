"use client";

// 과목 이름 영어 표시 도우미. 영어 모드에서만 영어 과목 자료를 불러온다.
//   const sn = useSubjectEn();
//   sn("미적분Ⅰ")      → 영어 모드: "Calculus I", 한국어 모드(또는 불러오기 전): undefined
//   sn("미적분Ⅰ") ?? "미적분Ⅰ"
// 자료 모듈을 직접 쓰려면: useEnData(() => import("@/i18n/data/subjects.en"), "subjects") 후 en?.subjectEn(name)
import { useCallback } from "react";
import { useEnData } from "@/lib/i18n";

export const loadSubjectsEn = () => import("@/i18n/data/subjects.en");
export type SubjectsEnModule = Awaited<ReturnType<typeof loadSubjectsEn>>;

/** 영어 과목 자료 모듈(영어 모드일 때만, 아니면 null) */
export function useSubjectsEn(): SubjectsEnModule | null {
  return useEnData(loadSubjectsEn, "subjects");
}

/** 한국어 과목 정식명 → 영어 이름 (영어 모드가 아니거나 모르는 과목이면 undefined) */
export function useSubjectEn(): (koName: string) => string | undefined {
  const en = useSubjectsEn();
  return useCallback((koName: string) => en?.subjectEn(koName), [en]);
}
