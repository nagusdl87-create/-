// 선생님께 드리는 '공유 코드' (서버 없음)
// 학생이 자기 기기에서 공유할 항목을 직접 고르고, 그 항목만 담은 작은 코드를 만든다.
// 이름·학교·연락처·활동 글 내용은 어떤 경우에도 담지 않는다. 닉네임은 학생이 직접 쓸 때만 담는다.
// 코드 형식: "MRT1." + base64url(UTF-8 JSON). 선생님 화면(/teacher)이 같은 규칙으로 엄격하게 읽는다.
import type { AppState } from "./store";
import { isTestComplete, progress, riasecScores, topTypes } from "./match";
import { analyze } from "./credits";
import { RIASEC_ORDER, type RiasecKey } from "@/data/riasec";
import type { Catalog } from "./catalog";
import { TRACKS, type TrackId } from "@/data/subjects";

export const TEACHER_PREFIX = "MRT1.";

/** 학생이 체크해서 고르는 공유 항목 */
export type ShareItems = {
  level: boolean; // 학교급·학년
  riasec: boolean; // 흥미 유형 상위 2개
  favs: boolean; // 찜한 직업·학과
  logs: boolean; // 진로 활동 기록·독서 개수(내용은 제외)
  progress: boolean; // 여정 진행 단계(5단계 중)
  credits: boolean; // 192학점 진단 요약
};

export const DEFAULT_ITEMS: ShareItems = { level: true, riasec: true, favs: true, logs: true, progress: true, credits: true };

/** 코드에 실제로 담기는 내용 */
export type TeacherCard = {
  nick?: string;
  stage?: "ms" | "hs";
  grade?: string;
  riasec?: RiasecKey[];
  jobs?: string[]; // 직업 id
  majors?: string[]; // 학과 id
  logs?: number;
  books?: number;
  done?: number; // 0~5
  credits?: { planned: boolean; track: TrackId | ""; total: number; warn: number };
};

export const NICK_MAX = 20;

// 직업·학과 전체는 크기가 커서 불러오지 않는다. 아이디 모양만 확인하고, 이름은 화면에서 찾을 때 없는 것을 건너뛴다.
const ID_OK = /^[w-]{1,80}$/;

export function buildCard(s: AppState, items: ShareItems, nick: string, cat?: Pick<Catalog, "JOB_MAP" | "MAJOR_MAP" | "full">): TeacherCard {
  const c: TeacherCard = {};
  const n = nick.replace(/\s+/g, " ").trim().slice(0, NICK_MAX);
  if (n) c.nick = n;
  if (items.level) {
    if (s.profile.stage) c.stage = s.profile.stage;
    if (s.profile.grade) c.grade = s.profile.grade.slice(0, 2);
  }
  if (items.riasec && isTestComplete(s.answers)) c.riasec = topTypes(riasecScores(s.answers), 2);
  if (items.favs) {
    c.jobs = s.favorites.filter((id) => (cat?.full ? !!cat.JOB_MAP[id] : ID_OK.test(id))).slice(0, 30);
    c.majors = s.favMajors.filter((id) => (cat?.full ? !!cat.MAJOR_MAP[id] : ID_OK.test(id))).slice(0, 30);
  }
  if (items.logs) {
    c.logs = s.logs.length;
    c.books = s.books.length;
  }
  if (items.progress) c.done = progress(s).doneCount;
  if (items.credits) {
    const planned = Object.values(s.credits.plan).flat().length > 0;
    const a = planned ? analyze(s.credits.plan, s.credits.track) : null;
    c.credits = {
      planned,
      track: s.credits.track,
      total: a ? a.total + 18 : 0,
      warn: a ? a.checks.filter((k) => k.level === "warn").length : 0,
    };
  }
  return c;
}

function b64(s: string) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function unb64(code: string) {
  const bin = atob(code.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(bin, (ch) => ch.charCodeAt(0)));
}

export const encodeCard = (c: TeacherCard) => TEACHER_PREFIX + b64(JSON.stringify({ v: 1, ...c }));

const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x);
const count = (x: unknown) => (typeof x === "number" && Number.isFinite(x) ? Math.max(0, Math.min(9999, Math.round(x))) : undefined);

/** 코드를 읽는다. 형식이 맞지 않거나 이상한 값이 있으면 버리고, 알 수 없는 항목은 무시한다. 실패하면 null. */
export function decodeCard(raw: string): TeacherCard | null {
  try {
    const code = raw.trim();
    if (!code.startsWith(TEACHER_PREFIX) || code.length > 6000) return null;
    const o: unknown = JSON.parse(unb64(code.slice(TEACHER_PREFIX.length)));
    if (!isObj(o) || o.v !== 1) return null;
    const c: TeacherCard = {};
    if (typeof o.nick === "string" && o.nick.trim()) c.nick = o.nick.trim().slice(0, NICK_MAX);
    if (o.stage === "ms" || o.stage === "hs") c.stage = o.stage;
    if (typeof o.grade === "string" && /^[1-3]$/.test(o.grade)) c.grade = o.grade;
    if (Array.isArray(o.riasec)) {
      const r = o.riasec.filter((k): k is RiasecKey => typeof k === "string" && (RIASEC_ORDER as string[]).includes(k)).slice(0, 2);
      if (r.length) c.riasec = r;
    }
    if (Array.isArray(o.jobs)) c.jobs = o.jobs.filter((id): id is string => typeof id === "string" && ID_OK.test(id)).slice(0, 30);
    if (Array.isArray(o.majors)) c.majors = o.majors.filter((id): id is string => typeof id === "string" && ID_OK.test(id)).slice(0, 30);
    const logs = count(o.logs), books = count(o.books), done = count(o.done);
    if (logs !== undefined) c.logs = logs;
    if (books !== undefined) c.books = books;
    if (done !== undefined) c.done = Math.min(5, done);
    if (isObj(o.credits)) {
      const k = o.credits;
      const track = typeof k.track === "string" && k.track in TRACKS ? (k.track as TrackId) : "";
      c.credits = { planned: k.planned === true, track, total: Math.min(400, count(k.total) ?? 0), warn: Math.min(99, count(k.warn) ?? 0) };
    }
    return c;
  } catch {
    return null;
  }
}

/** 한 줄 또는 여러 줄 글에서 공유 코드만 뽑는다(파일·붙여 넣기 공용). */
export function extractCodes(text: string): string[] {
  return text.match(/MRT1\.[A-Za-z0-9_-]+/g) ?? [];
}
