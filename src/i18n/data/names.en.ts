// 과목·직업·학과 한국어 이름 → 영어 이름 (영어 모드에서만 불러옴)
import { FIELDS, JOBS, type FieldId } from "@/data/jobs";
import { SUBJECTS_EN } from "./subjects.en";
import { FIELDS_EN, JOBS_EN } from "./jobs.en";
import { MAJOR_NAME_EN, MAJORS_EN } from "./majors.en";
import { EXTRA_MAJOR_NAMES_GEN } from "./majors.gen.en";
import { MAJORS } from "@/data/majors";
import { RIASEC, VALUES } from "@/data/riasec";
import { RIASEC_EN, VALUES_EN, STRENGTHS_EN } from "./riasec.en";
import { TASKS_EN } from "./plan.en";


// 직업 화면의 '관련 학과'에 나오지만 학과 백과(56개)에는 없는 학과·안내 문구
const EXTRA_MAJORS: Record<string, string> = {
  ...EXTRA_MAJOR_NAMES_GEN,
  정보통신공학과: "Information and Communication Engineering", 사이버보안학과: "Cyber Security", 산업공학과: "Industrial Engineering",
  경영정보학과: "Management Information Systems", 게임공학과: "Game Engineering", 게임콘텐츠학과: "Game Content", 디지털콘텐츠학과: "Digital Content",
  전자공학과: "Electronic Engineering", 메카트로닉스공학과: "Mechatronics Engineering", 자동차공학과: "Automotive Engineering", 전기공학과: "Electrical Engineering",
  미래모빌리티학과: "Future Mobility", 건축공학과: "Architectural Engineering", 실내건축학과: "Interior Architecture", 에너지공학과: "Energy Engineering",
  "전기과(전문대)": "Electrical Department (junior college)", 생명공학과: "Biotechnology", 분자생물학과: "Molecular Biology", 미생물학과: "Microbiology",
  대기과학과: "Atmospheric Science", 해양학과: "Oceanography", 재활학과: "Rehabilitation", "각 교과 사범대학(국어교육과, 수학교육과 등)": "Subject teacher-training colleges (Korean Education, Math Education, etc.)",
  상담심리학과: "Counseling Psychology", 아동학과: "Child Studies", 아동가족학과: "Child and Family Studies", 노인복지학과: "Elderly Welfare", 창업학과: "Entrepreneurship",
  "어떤 전공이든 가능": "Any major", 광고홍보학과: "Advertising and Public Relations", 소비자학과: "Consumer Science", 세무학과: "Taxation",
  "법학과 (이후 법학전문대학원 진학)": "Law (then law school)", 경찰대학: "Korean National Police University", 국제학부: "International Studies",
  "어문 계열 학과": "Language and literature majors", 정책학과: "Public Policy", 디지털미디어디자인학과: "Digital Media Design", 산업디자인학과: "Industrial Design",
  웹툰학과: "Webtoon", 문예창작학과: "Creative Writing", 작곡과: "Composition", 음향제작학과: "Sound Production", 신문방송학과: "Journalism and Broadcasting",
  영상학과: "Film and Video", 체육학과: "Physical Education", 스포츠과학과: "Sports Science", 운동처방학과: "Exercise Prescription", e스포츠학과: "Esports",
  스포츠경영학과: "Sports Management", 외식조리학과: "Food Service and Culinary Arts", 식품영양학과: "Food and Nutrition", 항공서비스학과: "Airline Services",
  환경과학과: "Environmental Science", 스마트팜학과: "Smart Farming", 원예학과: "Horticulture", 농업생명과학과: "Agricultural and Life Sciences",
  바이오시스템공학과: "Biosystems Engineering", 해양공학과: "Ocean Engineering", 항공정비학과: "Aircraft Maintenance", 기계설계공학과: "Mechanical Design Engineering",
  나노공학과: "Nano Engineering", 스마트팩토리학과: "Smart Factory", 승강기공학과: "Elevator Engineering", 수산생명의학과: "Aquatic Life Medicine",
  양식학과: "Aquaculture", 바이오산업학과: "Bio-industry", 식품공학과: "Food Engineering", 한약학과: "Herbal Pharmacy", 무역학과: "International Trade",
  항만물류학과: "Port Logistics",
};
// 직업 화면의 '고교 과목'에 나오는 묶음 이름
const EXTRA_SUBJECTS: Record<string, string> = {
  "전기·전자 관련 전문교과": "Electrical & electronics vocational subjects", "희망 교과 심화 과목": "Advanced subjects in the subject you want to teach",
  "조리 관련 전문교과": "Culinary vocational subjects", "농업 관련 전문교과": "Agriculture vocational subjects",
  "기계 관련 전문교과": "Mechanical vocational subjects", "기계·전기 관련 전문교과": "Mechanical & electrical vocational subjects",
};

const JOB_BY_NAME: Record<string, string> = {};
for (const j of JOBS) if (JOBS_EN[j.id]) JOB_BY_NAME[j.name] = JOBS_EN[j.id].name;
const MAJOR_BY_NAME: Record<string, string> = { ...EXTRA_MAJORS, ...MAJOR_NAME_EN };
for (const m of MAJORS) if (MAJORS_EN[m.id] && !MAJOR_BY_NAME[m.name]) MAJOR_BY_NAME[m.name] = MAJORS_EN[m.id].name;

export const subjectName = (ko: string) => SUBJECTS_EN[ko]?.name ?? EXTRA_SUBJECTS[ko];
export const subjectDesc = (ko: string) => SUBJECTS_EN[ko]?.desc;
export const jobName = (ko: string) => JOB_BY_NAME[ko];
export const jobNameById = (id: string) => JOBS_EN[id]?.name;
export const majorName = (ko: string) => MAJOR_BY_NAME[ko] ?? MAJOR_BY_NAME[ko.replace(/\s+/g, "")];
export const majorNameById = (id: string) => MAJORS_EN[id]?.name;

// 기록 화면(리포트·상담 요약·계획 등)에 그대로 저장·표시되는 한국어 문구 → 영어
// (흥미 유형 이름·설명, 가치관, 강점, 직업별 중학생 활동, 학기 할 일)
const TEXT: Record<string, string> = { ...STRENGTHS_EN, ...TASKS_EN };
for (const f of Object.keys(FIELDS) as FieldId[]) if (FIELDS_EN[f]) TEXT[FIELDS[f].name] = FIELDS_EN[f];
for (const k of Object.keys(RIASEC) as (keyof typeof RIASEC)[]) {
  const ko = RIASEC[k], en = RIASEC_EN[k];
  TEXT[ko.name] = en.name; TEXT[ko.short] = en.short; TEXT[ko.desc] = en.desc;
  ko.keywords.forEach((w, i) => { if (en.keywords[i]) TEXT[w] = en.keywords[i]; });
}
for (const v of VALUES) if (VALUES_EN[v.id]) { TEXT[v.label] = VALUES_EN[v.id].label; TEXT[v.desc] = VALUES_EN[v.id].desc; }
for (const j of JOBS) {
  const e = JOBS_EN[j.id];
  if (!e) continue;
  j.msActions.forEach((a, i) => { if (e.msActions[i]) TEXT[a] = e.msActions[i]; });
  TEXT[j.summary] = e.summary;
}

/** 저장된 한국어 문구 하나 → 영어 (과목·직업·학과 이름 포함, 모르면 undefined) */
export const text = (ko: string) => TEXT[ko] ?? subjectName(ko) ?? jobName(ko) ?? majorName(ko);

/** 영어 사전에 함께 넣을 이름·문구 표 (사전에 없는 한국어 문구를 t()가 찾을 때 씀) */
export function allText(): Record<string, string> {
  const o: Record<string, string> = {};
  for (const [k, v] of Object.entries(SUBJECTS_EN)) o[k] = v.name;
  Object.assign(o, EXTRA_SUBJECTS, MAJOR_BY_NAME, JOB_BY_NAME, TEXT);
  return o;
}
