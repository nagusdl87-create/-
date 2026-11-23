// 커리어넷 오픈API 자료(주 1회 scripts/fetch-careernet.mjs로 갱신). 서버(page.tsx)에서만 읽고 해당 항목만 화면에 넘긴다.
// 화면 코드(클라이언트)에서는 이 파일을 불러오지 않는다(상세 자료가 커서). 목록·개수는 careernet-summary.ts를 쓴다.
import jobDetail from "./careernet/job-detail.json";
import majorDetail from "./careernet/major-detail.json";
import jobList from "./careernet/jobs.json";
import majorList from "./careernet/majors.json";

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
export type CnJobItem = { seq: number; name: string; field: string; group: string; work: string; rel: string; wage: string; wlb: string; social: string };
export type CnMajorItem = { seq: number; name: string; field: string; alias: string };

const J = jobDetail as unknown as { fetchedAt: string; map: Record<string, number>; detail: Record<string, CnJob> };
const M = majorDetail as unknown as { fetchedAt: string; map: Record<string, number>; detail: Record<string, CnMajor> };
export const CN_JOBS = (jobList as unknown as { jobs: CnJobItem[] }).jobs;
export const CN_MAJORS = (majorList as unknown as { majors: CnMajorItem[] }).majors;
export const CN_FETCHED_AT = J.fetchedAt;

/** 우리 직업 id → 커리어넷 직업 번호, 그 반대 */
export const CN_JOB_MAP = J.map;
export const CN_MAJOR_MAP = M.map;
const jobOurId = Object.fromEntries(Object.entries(J.map).map(([id, seq]) => [seq, id]));
const majorOurId = Object.fromEntries(Object.entries(M.map).map(([id, seq]) => [seq, id]));
export const ourJobIdOf = (seq: number): string | undefined => jobOurId[seq];
export const ourMajorIdOf = (seq: number): string | undefined => majorOurId[seq];

type WithDate<T> = T & { fetchedAt: string };
const withDate = <T,>(x: T | undefined, at: string): WithDate<T> | undefined => (x ? { ...x, fetchedAt: at } : undefined);

/** 직업 백과 직업의 커리어넷 정보(처음부터 쓴 직업은 이어진 번호, `cn-번호` 직업은 그 번호) */
const seqOf = (id: string, map: Record<string, number>) => (id.startsWith("cn-") ? +id.slice(3) : map[id]);
export const cnJob = (id: string) => withDate<CnJob>(seqOf(id, J.map) != null ? J.detail[seqOf(id, J.map)] : undefined, J.fetchedAt);
export const cnMajor = (id: string) => withDate<CnMajor>(seqOf(id, M.map) != null ? M.detail[seqOf(id, M.map)] : undefined, M.fetchedAt);
/** 커리어넷 번호로 */
export const cnJobBySeq = (seq: number) => withDate<CnJob>(J.detail[seq], J.fetchedAt);
export const cnMajorBySeq = (seq: number) => withDate<CnMajor>(M.detail[seq], M.fetchedAt);

/** 우리 직업 백과와 이어지지 않은(따로 페이지를 만드는) 커리어넷 직업·학과 */
export const CN_EXTRA_JOBS = CN_JOBS.filter((j) => J.detail[j.seq] && !jobOurId[j.seq]);
export const CN_EXTRA_MAJORS = CN_MAJORS.filter((m) => M.detail[m.seq] && !majorOurId[m.seq]);
