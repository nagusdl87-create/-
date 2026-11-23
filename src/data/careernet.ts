// 커리어넷 오픈API 자료(주 1회 scripts/fetch-careernet.mjs로 갱신). 서버(page.tsx)에서만 읽고 해당 항목만 화면에 넘긴다.
import jobDetail from "./careernet/job-detail.json";
import majorDetail from "./careernet/major-detail.json";

export type CnJob = {
  seq: number; name: string; updated: string;
  work: string[]; aptitude: string[]; interest: string[]; abilities: string[]; research: string[];
  curriculum: string[]; certificate: string[]; training: string[]; majors: string[]; certs: string[]; forecast: string[];
  orgs: { name: string; url: string }[];
  wage: string; wageNote: string; satisfaction: number | null; satisfactionNote: string; wlb: string; social: string;
  edu: { labels: string[]; values: number[]; source: string } | null;
};
export type CnMajor = {
  seq: number; name: string; summary: string; interest: string; property: string; salary: string; employment: string;
  jobs: string; qualifications: string; subjects2022: { kind: string; names: string }[];
  fields: { name: string; desc: string }[]; activities: { name: string; desc: string }[]; mainSubjects: { name: string; desc: string }[]; univCount: number;
};

const J = jobDetail as unknown as { fetchedAt: string; detail: Record<string, CnJob> };
const M = majorDetail as unknown as { fetchedAt: string; detail: Record<string, CnMajor> };
export const CN_FETCHED_AT = J.fetchedAt;
export const cnJob = (id: string): (CnJob & { fetchedAt: string }) | undefined => (J.detail[id] ? { ...J.detail[id], fetchedAt: J.fetchedAt } : undefined);
export const cnMajor = (id: string): (CnMajor & { fetchedAt: string }) | undefined => (M.detail[id] ? { ...M.detail[id], fetchedAt: M.fetchedAt } : undefined);
