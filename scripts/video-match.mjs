// 공식 채널 영상 제목 ↔ 직업·학과 이름 매칭 규칙 (scripts/fetch-videos.mjs와 오프라인 시험이 함께 쓴다)
// 제목 매칭 키워드 (공백 없이 비교)
export const BASE_JOB_KW = {
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
export const BASE_MAJOR_KW = {
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

// ── 이름 변형 ──────────────────────────────────────────────
// 너무 일반적이라 혼자서는 직업을 가리키지 못하는 조각(및·ㆍ로 나눈 뒤 남는 것)
const GENERIC_PART = /^(수리원|조작원|제조원|생산직|설치원|운전원|기술자|연구원|종사원|관리원|사무원|정비원|기사|전문가|조립원|노무자|제조|가공원|관련직|판매원|개발자|강사|작가|디자이너)$/;
// 이름은 다르지만 같은 직업을 가리키는 표기(확실한 것만. 이름은 공백 없이 비교)
const JOB_ALIAS = {
  일반의사: ["의사"],
  "제과사및제빵사": ["제과제빵사", "제빵사", "파티시에"],
  "철도및지하철기관사": ["기관사", "지하철기관사"],
  영화시나리오작가: ["시나리오작가"],
  항공기정비원: ["항공정비사", "항공기정비사"],
  무용가: ["무용수"],
  석유화학기술자: ["석유화학공학기술자"],
  모바일앱개발자: ["앱개발자"],
  "금융자산운용가(펀드매니저)": ["펀드매니저", "자산운용가"],
};
const NOSPACE = (s) => s.replace(/\s+/g, "");
export function jobVariants(name) {
  const out = [name];
  const noParen = name.replace(/\s*\([^)]*\)\s*/g, "");
  if (noParen !== name && noParen.length >= 2) out.push(noParen);
  // "아이티(IT)기술영업원" → "IT기술영업원"
  const inParen = name.match(/\(([^)]+)\)/);
  if (inParen && /^[A-Za-z0-9 ]+$/.test(inParen[1])) out.push(name.replace(/[^\s(]*\([^)]*\)/, inParen[1]));
  const parts = name.split(/\s*(?:및|ㆍ|·|\(|\)|,)\s*/).filter((p) => p.length >= 3 && !GENERIC_PART.test(p));
  out.push(...parts);
  // 연구원 ↔ 학자, 공학기술자 ↔ 공학자(영상 제목은 "천문학자", "항공우주공학자"처럼 쓴다)
  for (const x of [name, noParen]) {
    const m1 = x.match(/^(.{2,}학)연구원$/);
    if (m1) out.push(m1[1] + "자");
    const m2 = x.match(/^(.{2,}공학)기술자$/);
    if (m2) out.push(m2[1] + "자");
  }
  out.push(...(JOB_ALIAS[NOSPACE(name)] ?? []));
  return [...new Set(out.map((s) => s.trim()).filter((s) => s.length >= 2))];
}

// ── 제목 정리 ──────────────────────────────────────────────
export const EXCLUDE = /shorts|쇼츠|채용공고|모집공고|설명회|브리핑|보도|장관|정책|공청회|라이브|LIVE|생중계|진로체험센터|꿀팁|직무분석|직무평가|개요\s*및\s*특성|원자력기구/i;
export const norm = (t) => t.replace(/\[[^\]]*\]|【[^】]*】|<[^>]*>/g, "").replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
const head = (t) => norm(t.split(/[|｜\-–:_/]/)[0] || t);
// 제목 앞뒤에 붙는 시리즈·연도·회차 표기를 걷어 낸다 ("2018내일을Job아라_앱개발자", "요양보호사 2", "스마트팜 구축가 요약본")
const NOISE = /내일을\s*(?:잡아라|job\s*아라)|워크\s*앤\s*라이프|work\s*&\s*life|워크넷이\s*만난\s*사람들|직업\s*소개|신직업|굿잡러|vr\s*체험\s*영상|vr체험영상|한국고용정보원|요약본?|본편|\bfinal\b|\bvr\b|직무\s*\d+|\d{4}\s*년?|\d+\s*회/gi;
const cleanSeg = (s) => norm(s.replace(NOISE, " ").replace(/(?:\s|^)\d+$/, "").replace(/\s편$/, ""));
const segsOf = (title) => title.split(/[_|｜\-–:\[\]()/,~]/).map(cleanSeg).filter(Boolean);

const stem = (x) => x.replace(/(학과|학부|전공|과)$/, "");
// 학과 이름 같음: 수학↔수학과, 전기↔전기공학, 생물↔생물학 (두 글자 이상일 때만)
const sameStem = (a, b, loose) => a === b || (a.length >= 2 && b.length >= 2 && (a + "학" === b || b + "학" === a || (loose && (a + "공학" === b || b + "공학" === a))));
// 제목에서 학과 이름 후보: "학과정보_수학ㆍ통계학과", "'경영학과' 수업", "국어국문학/문예창작과"
export function majorParts(title) {
  const t = title.replace(/\[[^\]]*\]/g, " ");
  const m = title.match(/학과정보[_\s:\-–]*([^|]+)/);
  let raw = null, loose = false;
  if (m) { raw = m[1]; loose = true; } // KEIS 학과정보는 계열 묶음이라 "전기ㆍ전자공학"이 전기공학과도 가리킨다
  else {
    const q = t.match(/['‘’"“”]([^'‘’"“”]{2,20})['‘’"“”]\s*수업/) || t.match(/[-–]\s*([^-–'‘’"“”]{2,20}?)\s*수업/);
    if (q) raw = q[1];
    else if (/(학과|학부|전공|과)$/.test(t.trim()) && t.trim().length <= 25 && !/\s/.test(t.trim().replace(/\//g, ""))) raw = t.trim();
  }
  if (!raw) return [];
  const ps = raw.split(/[ㆍ·,\/]/).map((x) => stem(norm(x.replace(/\([^)]*\)/g, "")))).filter(Boolean);
  ps.loose = loose;
  return ps;
}

export function pick(all, kws, isMajor = false) {
  const scored = [];
  const exactOnly = kws.map((k) => k.startsWith("=")); // "=이름": 관련 직업명처럼 제목이 그 이름 자체일 때만 쓴다
  const kks = kws.map((k) => norm(k.replace(/^=/, "")));
  for (const v of all) {
    const n = norm(v.title), h = head(v.title);
    const parts = isMajor ? majorParts(v.title) : [];
    const segs = [...new Set([...v.title.split(/[_|｜\-–:\[\]()]/).map(norm).filter(Boolean), ...segsOf(v.title)])];
    let best = 0;
    kks.forEach((kk, ki) => {
      if (!kk) return;
      const w = 1 - ki * 0.05; // 앞쪽 키워드 우선
      let s = 0;
      if (h === kk || n === kk) s = 3;
      else if (segs.includes(kk)) s = 2.5; // "내일을 잡아라_회계사_한국고용정보원"처럼 가운데에 있는 직업명
      else if (exactOnly[ki]) s = 0;
      else if (isMajor && parts.some((p) => sameStem(p, stem(kk), parts.loose))) s = 3 - (parts.length - 1) * 0.3;
      else if (h.startsWith(kk) || n.startsWith(kk)) s = 2;
      else if (kk.length >= 4 && n.includes(kk) && (!isMajor || /(학과|학부|전공|과)$/.test(kk))) s = 1;
      best = Math.max(best, s * w);
    });
    if (/Q&A|면세점|브이로그|vlog/i.test(v.title)) best = 0;
    // 같은 점수면 회차·요약·VR판보다 본편 소개 영상을 먼저
    const minor = /요약|\bvr\b|^\s*\d+회|\d+회\s|\s\d\s*$|final/i.test(v.title) ? 0.15 : 0;
    if (best > 0) scored.push({ v, s: best + v.bonus - minor - Math.min(n.length, 60) / 200 });
  }
  scored.sort((a, b) => b.s - a.s);
  const seen = new Set();
  return scored.filter(({ v }) => !seen.has(v.id) && seen.add(v.id)).slice(0, 6).map(({ v }) => v);
}

// 커리어넷 자료(src/data/gen)로 심화 글을 쓴 직업·학과(id: cn-번호)와 기존 직업·학과의 키워드를 만든다
// R(경로) → JSON 읽기. 반환: { jobKw, majorKw, jobNames, majorNames }
export function buildKeywords(R, { rich = true } = {}) {
  const safe = (p) => { try { return R(p); } catch { return null; } };
  const cnJobList = safe("../src/data/careernet/jobs.json")?.jobs ?? [];
  const cnMajorList = safe("../src/data/careernet/majors.json")?.majors ?? [];
  const jmap = safe("../src/data/careernet/job-detail.json")?.map ?? {};
  const cnBySeq = new Map(cnJobList.map((j) => [j.seq, j]));
  const jobKw = { ...BASE_JOB_KW }, majorKw = { ...BASE_MAJOR_KW }, jobNames = {}, majorNames = {};
  // 기존(수작업) 직업: 커리어넷의 같은 직업 이름·관련 직업명을 뒤쪽 키워드로 보탠다
  if (rich) for (const id of Object.keys(BASE_JOB_KW)) {
    const c = cnBySeq.get(jmap[id]);
    if (!c) continue;
    jobNames[id] = c.name;
    // 직접 고른 키워드가 이미 있으므로 커리어넷 이름의 변형만 보탠다(관련 직업명 rel은 다른 직업이 섞여 있어 쓰지 않는다)
    const extra = jobVariants(c.name).filter((k) => k && k.length >= 3 && !GENERIC_PART.test(k));
    jobKw[id] = [...new Set([...BASE_JOB_KW[id], ...extra])].slice(0, 14);
  }
  for (const g of safe("../src/data/gen/jobs.json") ?? []) {
    const c = cnBySeq.get(+g.id.slice(3));
    jobNames[g.id] = g.name;
    const rel = c?.rel ? c.rel.split(/,\s*/) : [];
    // 이름 변형은 원래 이름 바로 뒤에, 관련 직업명(커리어넷 rel)은 그 다음에. 관련 직업명은 제목이 그 이름 그대로일 때만 쓴다("=" 표시)
    const list = rich ? [g.name, ...jobVariants(g.name).slice(1), ...rel.map((r) => "=" + r)] : [g.name, ...rel,...g.name.split(/\s*(?:및|ㆍ|·|\(|\)|,)\s*/).filter((p) => p.length >= 3)];
    jobKw[g.id] = [...new Set(list)].filter((k) => k && k.length >= 2).slice(0, rich ? 14 : 8);
  }
  for (const g of safe("../src/data/gen/majors.json") ?? []) {
    const c = cnMajorList.find((x) => x.seq === +g.id.slice(3));
    majorNames[g.id] = g.name;
    // 별칭은 가나다 순으로 아무 학과나 섞여 있어(예: 패션디자인과의 별칭에 "K-POP과") 이름과 겹치는 것만 쓴다
    const sn = stem(norm(g.name));
    const al = (c?.alias ? c.alias.split(/,\s*/) : []).filter((a) => { const sa = stem(norm(a.replace(/\([^)]*\)/g, ""))); return sa.length >= 2 && sa !== sn && (sa.includes(sn) || (sa.length >= 3 && sn.includes(sa))); });
    majorKw[g.id] = [g.name, ...al.slice(0, 3)].filter((k) => k && k.length >= 2);
  }
  for (const k of Object.keys(jobKw)) jobNames[k] ??= k;
  for (const k of Object.keys(majorKw)) majorNames[k] ??= k;
  return { jobKw, majorKw, jobNames, majorNames };
}

const bigrams = (t) => { const n = norm(t); const r = new Set(); for (let i = 0; i < n.length - 1; i++) r.add(n.slice(i, i + 2)); return r; };
const sim = (a, b) => { const x = bigrams(a), y = bigrams(b); let c = 0; x.forEach((g) => y.has(g) && c++); return c / Math.max(1, Math.min(x.size, y.size)); };

// 직접 영상이 없는 직업 → 같은 분야(없으면 같은 직업군) 직업의 영상. 이름이 비슷한 직업의 영상을 먼저 고른다
export function buildRelated(cleanJobs, allJobIds, cnJobList, jmap) {
  const seqOf = (id) => (id.startsWith("cn-") ? +id.slice(3) : jmap[id]);
  const cnBySeq = new Map(cnJobList.map((j) => [j.seq, j]));
  const related = {};
  for (const id of allJobIds) {
    if (cleanJobs[id]?.length) continue;
    const me = cnBySeq.get(seqOf(id));
    if (!me) continue;
    const pool = allJobIds.filter((o) => o !== id && cleanJobs[o]?.length && cnBySeq.get(seqOf(o))?.field === me.field);
    const pool2 = pool.length ? pool : allJobIds.filter((o) => o !== id && cleanJobs[o]?.length && cnBySeq.get(seqOf(o))?.group === me.group);
    const ranked = pool2.map((o) => ({ o, s: sim(me.name, cnBySeq.get(seqOf(o)).name) })).sort((a, b) => b.s - a.s);
    const seen = new Set();
    const vids = [];
    for (const { o } of ranked) {
      const v = cleanJobs[o][0];
      if (v && !seen.has(v.id)) { seen.add(v.id); vids.push(v); }
      if (vids.length >= 2) break;
    }
    if (vids.length) related[id] = { field: me.field, videos: vids };
  }
  return related;
}

// 확인용: 직접 영상이 없는 직업 이름과 제목(시리즈 표기를 뗀 것)이 거의 같은 영상
export function nearMisses(all, ids, names) {
  const cores = all.map((v) => ({ v, core: segsOf(v.title).sort((a, b) => b.length - a.length)[0] ?? "" })).filter((x) => x.core.length >= 3);
  const out = [];
  for (const id of ids) {
    const nm = names[id] ?? id;
    let best = null;
    for (const { v, core } of cores) { const s = sim(nm, core); if (s >= 0.8 && (!best || s > best.s)) best = { s, v }; }
    if (best) out.push(`  ${nm} ~ ${best.v.title} (${best.s.toFixed(2)})`);
  }
  return out;
}
