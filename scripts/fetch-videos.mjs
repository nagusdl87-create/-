// 공식 채널 영상 자동 연결 (GitHub Actions에서 YOUTUBE_API_KEY로 실행)
// 검색(search.list, 100 units) 대신 채널 업로드 목록(1 unit/50개)을 받아 제목으로 매칭 → 하루 할당량(10,000)의 1% 미만 사용.
// 신뢰 채널만 사용: 한국고용정보원 직업진로동영상, 한국고용정보원(고용24), 교육부
import { writeFileSync } from "node:fs";

const KEY = process.env.YOUTUBE_API_KEY;
if (!KEY) {
  console.log("YOUTUBE_API_KEY 없음 → 건너뜀");
  process.exit(0);
}
const API = "https://www.googleapis.com/youtube/v3";
const get = async (path, params) => {
  const u = new URL(`${API}/${path}`);
  Object.entries({ ...params, key: KEY }).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u);
  if (!r.ok) throw new Error(`${path} ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json();
};

const CHANNELS = [
  { handle: "@KEISwork2011", name: "한국고용정보원 직업진로동영상", bonus: 0.5, only: null },
  { handle: "@worknet_keis", name: "한국고용정보원", bonus: 0.2, only: null },
  { handle: "@교육부", name: "교육부", bonus: 0.4, only: /직업탐구|별일|직업인|진로/ },
];

// 제목 매칭 키워드 (공백 없이 비교)
const JOB_KW = {
  "ai-engineer": ["인공지능개발자", "인공지능전문가", "AI개발자", "인공지능엔지니어", "머신러닝엔지니어"],
  "software-dev": ["소프트웨어개발자", "응용소프트웨어개발자", "프로그래머", "앱개발자"],
  security: ["정보보안전문가", "정보보호전문가", "화이트해커", "보안관제"],
  "data-analyst": ["데이터분석가", "빅데이터전문가", "데이터과학자", "빅데이터분석가"],
  "game-dev": ["게임개발자", "게임프로그래머", "게임기획자"],
  "robot-engineer": ["로봇공학자", "로봇공학기술자", "로봇개발자", "로봇연구원"],
  semiconductor: ["반도체공정엔지니어", "반도체공학기술자", "반도체엔지니어", "반도체"],
  "car-engineer": ["자동차공학기술자", "자율주행", "전기차", "자동차연구원"],
  architect: ["건축가", "건축사", "건축설계"],
  electrician: ["전기기술자", "전기공학기술자", "에너지공학기술자", "전기공사"],
  biologist: ["생명과학연구원", "생명과학자", "바이오연구원"],
  "climate-scientist": ["기후변화전문가", "기상연구원", "기후과학자", "기상캐스터", "예보관"],
  chemist: ["화학연구원", "화학공학기술자", "화학자"],
  astronomer: ["천문학자", "우주과학자", "천문연구원", "천체"],
  doctor: ["의사", "외과의사", "내과의사", "전공의"],
  nurse: ["간호사"],
  pharmacist: ["약사"],
  physio: ["물리치료사"],
  vet: ["수의사"],
  teacher: ["교사", "중등교사", "초등학교교사"],
  counselor: ["상담심리사", "심리상담사", "상담전문가", "임상심리사"],
  "social-worker": ["사회복지사"],
  "youth-leader": ["청소년지도사"],
  entrepreneur: ["창업가", "스타트업", "청년창업"],
  marketer: ["마케터", "마케팅전문가", "광고기획자"],
  accountant: ["회계사", "공인회계사"],
  lawyer: ["변호사"],
  police: ["경찰관", "경찰", "사이버경찰관", "과학수사"],
  diplomat: ["외교관"],
  "public-officer": ["공무원", "행정공무원"],
  designer: ["UX디자이너", "UI디자이너", "웹디자이너", "사용자경험"],
  webtoon: ["웹툰작가", "만화가"],
  musician: ["작곡가", "음악프로듀서", "음반기획자"],
  pd: ["PD", "방송연출가", "방송PD", "영상제작"],
  reporter: ["기자", "방송기자"],
  "sports-trainer": ["스포츠트레이너", "운동처방사", "트레이너"],
  esports: ["e스포츠", "프로게이머", "게임방송"],
  chef: ["셰프", "조리사", "요리사"],
  "flight-attendant": ["항공승무원", "승무원", "객실승무원"],
  "env-engineer": ["환경공학기술자", "환경공학자", "환경컨설턴트"],
  "smart-farmer": ["스마트팜", "스마트농업", "농업인"],
  shipbuilding: ["조선공학기술자", "조선해양", "선박설계", "조선"],
  aerospace: ["항공우주공학기술자", "항공우주", "항공기정비원", "드론"],
  "mech-defense": ["기계공학기술자", "정밀기계", "방위산업", "기계설계"],
  nuclear: ["원자력공학기술자", "원자력", "발전설비"],
  nano: ["나노공학기술자", "나노", "신소재"],
  "smart-factory": ["스마트공장", "스마트팩토리", "산업자동화"],
  elevator: ["승강기", "엘리베이터"],
  aquaculture: ["수산양식", "양식", "수산"],
  "anti-aging": ["항노화", "바이오헬스", "바이오의약"],
  logistics: ["물류관리사", "항만물류", "물류전문가", "물류"],
};
const MAJOR_KW = {
  korean: ["국어국문학과"], english: ["영어영문학과"], history: ["사학과", "역사학과"], philosophy: ["철학과"], chinese: ["중어중문학과"],
  politics: ["정치외교학과"], "public-admin": ["행정학과"], law: ["법학과"], "police-admin": ["경찰행정학과"], media: ["미디어커뮤니케이션학과", "신문방송학과", "언론정보학과"],
  psychology: ["심리학과"], "social-welfare": ["사회복지학과"], business: ["경영학과"], economics: ["경제학과"], accounting: ["회계학과"],
  trade: ["무역학과", "국제통상학과"], "logistics-major": ["물류학과", "물류시스템"], tourism: ["관광경영학과", "관광학과"], math: ["수학과"], statistics: ["통계학과"],
  physics: ["물리학과"], chemistry: ["화학과"], biology: ["생명과학과", "생물학과"], earth: ["지구환경과학과", "지구과학과"], astronomy: ["천문우주학과", "천문학과"],
  "marine-bio": ["해양생명과학과", "해양학과"], cs: ["컴퓨터공학과"], ai: ["인공지능학과"], software: ["소프트웨어학과"], security: ["정보보호학과", "정보보안학과"],
  "data-science": ["데이터사이언스학과", "빅데이터학과"], mech: ["기계공학과"], electrical: ["전기전자공학과", "전기공학과", "전자공학과"], semiconductor: ["반도체공학과"],
  materials: ["신소재공학과"], "chem-eng": ["화학공학과"], naval: ["조선해양공학과"], aero: ["항공우주공학과"], "nuclear-eng": ["원자력공학과"], robotics: ["로봇공학과"],
  architecture: ["건축학과"], "env-eng": ["환경공학과"], medicine: ["의예과", "의학과"], pharmacy: ["약학과"], nursing: ["간호학과"], "physio-major": ["물리치료학과", "물리치료과"],
  "vet-major": ["수의예과", "수의학과"], education: ["교육학과"], "elem-edu": ["초등교육과"], youth: ["청소년학과"], "visual-design": ["시각디자인학과", "시각디자인과"],
  animation: ["만화애니메이션학과", "애니메이션학과"], "music-prod": ["실용음악과"], film: ["연극영화과"], "sports-sci": ["체육학과", "스포츠과학과"], culinary: ["조리과학과", "조리학과", "외식조리"],
};

const EXCLUDE = /shorts|쇼츠|채용공고|모집공고|설명회|브리핑|보도|장관|정책|공청회|라이브|LIVE|생중계/i;
const norm = (t) => t.replace(/\[[^\]]*\]|【[^】]*】|<[^>]*>/g, "").replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
const head = (t) => norm(t.split(/[|｜\-–:_/]/)[0] || t);

async function uploads(ch) {
  const c = await get("channels", { part: "contentDetails", forHandle: ch.handle });
  const pl = c.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!pl) { console.log("채널 없음:", ch.handle); return []; }
  const out = [];
  let token = "";
  for (let i = 0; i < 120; i++) {
    const r = await get("playlistItems", { part: "snippet", playlistId: pl, maxResults: "50", ...(token ? { pageToken: token } : {}) });
    for (const it of r.items ?? []) {
      const s = it.snippet;
      const id = s?.resourceId?.videoId;
      if (!id || !s.title || /Private video|Deleted video/.test(s.title)) continue;
      if (EXCLUDE.test(s.title)) continue;
      if (ch.only && !ch.only.test(s.title)) continue;
      out.push({ id, title: s.title, channel: ch.name, bonus: ch.bonus });
    }
    token = r.nextPageToken;
    if (!token) break;
  }
  console.log(ch.handle, out.length, "개");
  return out;
}

const stem = (x) => x.replace(/(학과|학부|과)$/, "");
// "학과정보_수학ㆍ통계학과" → ["수학", "통계"] 같은 학과 이름 후보
function majorParts(title) {
  const m = title.match(/학과정보[_\s:]*([^|\-]+)/);
  if (!m) return [];
  return m[1].split(/[ㆍ·,\/]/).map((x) => stem(norm(x))).filter(Boolean);
}

function pick(all, kws, isMajor = false) {
  const scored = [];
  for (const v of all) {
    const n = norm(v.title), h = head(v.title);
    const parts = isMajor ? majorParts(v.title) : [];
    let best = 0;
    kws.forEach((k, ki) => {
      const kk = norm(k);
      const w = 1 - ki * 0.05; // 앞쪽 키워드 우선
      let s = 0;
      if (h === kk || n === kk) s = 3;
      else if (isMajor && parts.includes(stem(kk))) s = 3 - (parts.length - 1) * 0.3;
      else if (h.startsWith(kk) || n.startsWith(kk)) s = 2;
      else if (kk.length >= 4 && n.includes(kk)) s = 1;
      best = Math.max(best, s * w);
    });
    if (/Q&A|면세점|브이로그|vlog/i.test(v.title)) best *= 0.3;
    if (best > 0) scored.push({ v, s: best + v.bonus - Math.min(n.length, 60) / 200 });
  }
  scored.sort((a, b) => b.s - a.s);
  const seen = new Set();
  return scored.filter(({ v }) => !seen.has(v.id) && seen.add(v.id)).slice(0, 6).map(({ v }) => v);
}

async function filterEmbeddable(list) {
  const ids = [...new Set(list.map((v) => v.id))];
  const ok = new Set();
  for (let i = 0; i < ids.length; i += 50) {
    const r = await get("videos", { part: "status,contentDetails", id: ids.slice(i, i + 50).join(",") });
    for (const it of r.items ?? []) {
      const st = it.status;
      if (st.embeddable && st.privacyStatus === "public" && !st.madeForKids && !it.contentDetails?.regionRestriction?.blocked?.includes("KR")) ok.add(it.id);
    }
  }
  return ok;
}

const all = (await Promise.all(CHANNELS.map(uploads))).flat();
const jobs = Object.fromEntries(Object.entries(JOB_KW).map(([id, kw]) => [id, pick(all, kw)]));
const majors = Object.fromEntries(Object.entries(MAJOR_KW).map(([id, kw]) => [id, pick(all, kw, true)]));
const ok = await filterEmbeddable([...Object.values(jobs), ...Object.values(majors)].flat());
const clean = (m) => Object.fromEntries(Object.entries(m).map(([k, vs]) => [k, vs.filter((v) => ok.has(v.id)).slice(0, 3).map(({ id, title, channel }) => ({ id, title, channel }))]).filter(([, vs]) => vs.length));
const out = { asOf: new Date().toISOString().slice(0, 10), source: CHANNELS.map((c) => c.name).join(", "), jobs: clean(jobs), majors: clean(majors) };
writeFileSync(new URL("../src/data/videos-auto.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
console.log(`직업 ${Object.keys(out.jobs).length}/${Object.keys(JOB_KW).length}, 학과 ${Object.keys(out.majors).length}/${Object.keys(MAJOR_KW).length}`);
