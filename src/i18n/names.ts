"use client";

// 과목·직업·학과 이름을 화면 언어에 맞게 보여 주는 도우미 (한 곳에서 관리)
//   const n = useNames();  n.subject("미적분Ⅰ") → 영어 모드 "Calculus I", 한국어 모드 "미적분Ⅰ"
// 영어 자료가 없는 이름은 한국어 그대로 둔다.
import { useMemo } from "react";
import { useEnData } from "@/lib/i18n";

const load = () => import("@/i18n/data/names.en");

export type Names = {
  subject: (ko: string) => string;
  subjectDesc: (ko: string, desc: string) => string;
  job: (ko: string) => string;
  jobById: (id: string, ko: string) => string;
  major: (ko: string) => string;
  majorById: (id: string, ko: string) => string;
};

export function useNames(): Names {
  const en = useEnData(load, "names");
  return useMemo(
    () => ({
      subject: (ko) => en?.subjectName(ko) ?? ko,
      subjectDesc: (ko, desc) => en?.subjectDesc(ko) ?? desc,
      job: (ko) => en?.jobName(ko) ?? ko,
      jobById: (id, ko) => en?.jobNameById(id) ?? ko,
      major: (ko) => en?.majorName(ko) ?? ko,
      majorById: (id, ko) => en?.majorNameById(id) ?? ko,
    }),
    [en],
  );
}
