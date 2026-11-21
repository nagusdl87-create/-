"use client";
// 전국 대학 학과 데이터 (public/data/univ-index.json, 필요할 때만 불러옴)
import { useEffect, useState } from "react";

export type School = [name: string, sido: string, sigungu: string, type: string, homepage: string, plan2028: string];
export type Dept = [school: number, name: string, degree: 1 | 2]; // 1 학사, 2 전문학사
export type UGroup = { big: string; mid: string; small: string; depts: Dept[]; subjects: string[]; jobs: string[] };
export type UnivIndex = { source: string; asOf: string; schools: School[]; groups: UGroup[] };

let cache: Promise<UnivIndex> | null = null;
export function loadUniv() {
  if (!cache) cache = fetch("/data/univ-index.json").then((r) => r.json());
  return cache;
}
export function useUniv() {
  const [d, setD] = useState<UnivIndex | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    loadUniv().then(setD).catch(() => setErr(true));
  }, []);
  return { data: d, error: err };
}

export const SIDO_ORDER = ["경남", "부산", "울산", "대구", "경북", "서울", "경기", "인천", "강원", "대전", "세종", "충북", "충남", "광주", "광주·전남", "전남", "전북", "제주"];
export const groupLabel = (g: UGroup) => (g.small.startsWith("N.C.E") ? `기타 (${g.big.replace("계열", "")} · 분류 외)` : g.small);
