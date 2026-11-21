// 경상남도 지역 특화 정보
// 출처: 경상남도교육청 고등학교 입학포털(highschool.gne.go.kr) 「2027학년도 고등학교 입학전형」 공통사항·평준화지역 전형·전형 일정
//       공공데이터포털 전국초중등학교위치표준데이터(2026-10-01 기준), 교육정보 개방포털(NEIS) 학교기본정보
import schoolsRaw from "./gn-schools.json";
import middleRaw from "./gn-middle.json";

export type HsKind = "general" | "autonomous" | "science" | "foreign" | "arts" | "sports" | "meister" | "vocational" | "special";

export type GnSchool = {
  id: string;
  name: string;
  region: string;
  kind: HsKind;
  zone: string | null;
  round: "전기" | "후기";
  nationwide: boolean;
  unit: string;
  classes: number | null;
  quota: number | null;
  depts: { name: string; classes: number; quota: number }[];
  coedu: string;
  found: string;
  addr: string;
  tel: string;
  home: string;
  hischool: string;
  lat: number | null;
  lng: number | null;
};

export const GN_SCHOOLS = schoolsRaw as GnSchool[];
export const GN_MIDDLE = middleRaw as { name: string; region: string; lat: number; lng: number }[];
export const DATA_AS_OF = "2027학년도 고입전형(2026년 공개 자료) · 학교 위치 2026.10.";

export const KIND_INFO: Record<HsKind, { name: string; emoji: string; color: string }> = {
  general: { name: "일반고", emoji: "🏫", color: "#2f7bf5" },
  autonomous: { name: "자율형 공립고", emoji: "🧩", color: "#0ea5e9" },
  science: { name: "과학고", emoji: "🔬", color: "#7c3aed" },
  foreign: { name: "외국어고", emoji: "🌐", color: "#db2777" },
  arts: { name: "예술고", emoji: "🎭", color: "#c026d3" },
  sports: { name: "체육고", emoji: "🏅", color: "#ea580c" },
  meister: { name: "마이스터고", emoji: "🛠️", color: "#16a34a" },
  vocational: { name: "특성화고", emoji: "🔧", color: "#059669" },
  special: { name: "각종학교·고등기술학교", emoji: "🎬", color: "#64748b" },
};

export const REGIONS = [...new Set(GN_SCHOOLS.map((s) => s.region))].sort((a, b) => a.localeCompare(b, "ko"));

export const ZONES = [
  { id: "평준화 1학군", area: "창원시 성산구·의창구", note: "(구)창원시" },
  { id: "평준화 2학군", area: "창원시 마산합포구·마산회원구", note: "(구)마산시" },
  { id: "평준화 3학군", area: "진주시", note: "" },
  { id: "평준화 4학군", area: "김해시", note: "" },
  { id: "평준화 5학군", area: "거제시", note: "" },
];

// 체험위주 특성화고, 일반고 특성화과
export const EXPERIENCE_SCHOOLS = ["태봉고등학교", "간디고등학교", "지리산고등학교", "합천평화고등학교"];
export const GENERAL_WITH_VOC = [
  { school: "삼가고등학교", dept: "조리과" },
  { school: "창녕여자고등학교", dept: "보건간호과" },
];

// 2027학년도 고입 전형 일정 (경남교육청 공고 기준, 학교별 세부 일정은 학교 누리집 확인)
export const ADMISSION_SCHEDULE: { round: string; who: string; apply: string; result: string }[] = [
  { round: "전기", who: "공군항공과학고(마이스터고, 국립)", apply: "2026. 7. 13. ~ 7. 17.", result: "2026. 10. 23." },
  { round: "전기", who: "과학고 2교 (경남과고, 창원과고) — 자기주도학습전형", apply: "2026. 8. 24. ~ 8. 27.", result: "2026. 12. 1." },
  { round: "전기", who: "체육고 (경남체육고)", apply: "2026. 8. 24. ~ 8. 27.", result: "2026. 9. 16." },
  { round: "전기", who: "예술고 (경남예술고)", apply: "2026. 10. 12. ~ 10. 15.", result: "학교 공고 확인" },
  { round: "전기", who: "마이스터고 3교 (거제공고, 삼천포공고, 한국나노마이스터고)", apply: "2026. 10. 19. ~ 10. 22.", result: "2026. 11. 4." },
  { round: "전기", who: "특정분야 인재양성 특성화고 — 특별전형", apply: "2026. 11. 20. ~ 11. 24.", result: "2026. 11. 27." },
  { round: "전기", who: "특성화고 일반전형 · 체험위주 특성화고 · 각종학교", apply: "2026. 11. 27. ~ 12. 1.", result: "2026. 12. 4." },
  { round: "추가", who: "전기 미달학교 추가모집", apply: "2026. 12. 7. ~ 12. 9.", result: "2026. 12. 11." },
  { round: "후기", who: "외국어고 2교 (김해외고, 경남외고) — 자기주도학습전형", apply: "2026. 12. 10. ~ 12. 14.", result: "2026. 12. 24." },
  { round: "후기", who: "비평준화지역 일반고 · 평준화지역 학교장전형 학교", apply: "2026. 12. 10. ~ 12. 14.", result: "2026. 12. 30." },
  { round: "후기", who: "평준화지역 일반고 (교육감 전형)", apply: "2026. 12. 10. ~ 12. 14.", result: "합격 2027. 1. 8. / 배정 1. 15." },
  { round: "추가", who: "평준화지역 미달 학군, 전·후기 미달학교", apply: "2027. 1. 12. ~ 1. 14.", result: "2027. 1. 21." },
];

// 고입 핵심 규칙 (공식 기본계획 요약)
export const ADMISSION_RULES = [
  { t: "전기와 후기", d: "과학고·예술고·체육고·마이스터고·특성화고는 전기, 일반고·자율고·외국어고는 후기에 선발해요." },
  { t: "1개교만 지원", d: "전기는 1개교(타 시·도 포함)만 지원할 수 있고, 전기에 합격하면 등록하지 않아도 후기에 지원할 수 없어요." },
  { t: "예외", d: "마이스터고에 떨어지면 특정분야 인재양성 특성화고에, 특성화고 특별전형에 떨어지면 같은 특성화고 일반전형에 다시 지원할 수 있어요." },
  { t: "평준화지역", d: "창원(2개 학군)·진주·김해·거제 5개 학군은 교육감이 중학교 내신(석차백분율)으로 선발한 뒤 지망 순서에 따라 컴퓨터 추첨으로 배정해요." },
  { t: "학군 지원", d: "평준화지역 중학생은 다니는 중학교가 있는 학군에 지원해요. 읍 이하 지역 등 일부 지역은 인접 학군도 선택할 수 있어요." },
  { t: "외고 동시지원", d: "외국어고 지원자는 평준화지역 학군(학교장전형 학교 제외)에 동시에 지원할 수 있어요." },
  { t: "과학고·외고 전형", d: "학교생활기록부, 자기소개서(과학고는 교사추천서 포함)로 자기주도학습전형을 실시하고, 정원의 20% 이상은 사회통합전형으로 뽑아요." },
  { t: "이중지원 금지", d: "합격한 뒤 다른 학교에 지원하거나 결과가 나오기 전에 다른 학교에 지원하면 이중지원으로 합격이 취소될 수 있어요." },
];

// 경남 산업 지도: 지역 산업 ↔ 직업 ↔ 학교
export const GN_INDUSTRIES = [
  { id: "ship", name: "조선·해양", emoji: "🚢", regions: ["거제", "통영", "창원"], jobs: ["shipbuilding", "mech-defense"], schools: ["거제공업고등학교", "경남해양과학고등학교"], desc: "LNG선·친환경 선박 등 세계적 조선 산업 집적지" },
  { id: "aero", name: "항공·우주", emoji: "🛰️", regions: ["사천", "진주"], jobs: ["aerospace", "mech-defense"], schools: ["삼천포공업고등학교", "경남항공고등학교"], desc: "항공기 제작 산업과 우주항공청이 있는 항공우주 중심지" },
  { id: "mech", name: "기계·방산·원전", emoji: "⚙️", regions: ["창원"], jobs: ["mech-defense", "nuclear", "smart-factory", "robot-engineer"], schools: ["창원기계공업고등학교", "창원공업고등학교", "경남로봇고등학교"], desc: "창원 국가산업단지 중심의 기계·방위·발전설비 산업" },
  { id: "nano", name: "나노융합", emoji: "🔬", regions: ["밀양"], jobs: ["nano", "semiconductor"], schools: ["한국나노마이스터고등학교"], desc: "나노융합 국가산업단지 조성 지역" },
  { id: "auto", name: "자동차·모빌리티", emoji: "🚗", regions: ["창원", "김해", "양산"], jobs: ["car-engineer", "smart-factory"], schools: ["경남자동차고등학교"], desc: "자동차 부품·미래 모빌리티 산업" },
  { id: "bio", name: "항노화·바이오헬스", emoji: "🌿", regions: ["산청", "함양", "김해", "양산"], jobs: ["anti-aging", "biologist", "nurse"], schools: ["경남간호고등학교", "김해생명과학고등학교"], desc: "한방 항노화 산업과 의생명·의료기기 산업" },
  { id: "sea", name: "수산·해양관광", emoji: "🐟", regions: ["통영", "남해", "거제", "고성"], jobs: ["aquaculture", "chef", "flight-attendant"], schools: ["경남해양과학고등학교", "경남관광고등학교", "남해정보산업고등학교"], desc: "남해안 양식업과 해양 관광" },
  { id: "logi", name: "항만·물류", emoji: "📦", regions: ["창원"], jobs: ["logistics"], schools: [], desc: "부산항 신항·진해신항 중심의 항만물류" },
  { id: "elev", name: "승강기", emoji: "🛗", regions: ["거창"], jobs: ["elevator"], schools: ["거창승강기고등학교"], desc: "승강기 산업단지와 전문 인력 양성" },
];

// 경남 소재 4년제 대학 (2026년 기준, 학과 개설 현황은 대학알리미·각 대학 누리집에서 확인)
export const GN_UNIVERSITIES = [
  { name: "경상국립대학교", region: "진주·창원·통영", url: "https://www.gnu.ac.kr/" },
  { name: "국립창원대학교", region: "창원", url: "https://www.changwon.ac.kr/" },
  { name: "경남대학교", region: "창원(마산)", url: "https://www.kyungnam.ac.kr/" },
  { name: "인제대학교", region: "김해", url: "https://www.inje.ac.kr/" },
  { name: "영산대학교", region: "양산", url: "https://www.ysu.ac.kr/" },
  { name: "창신대학교", region: "창원", url: "https://www.cs.ac.kr/" },
  { name: "가야대학교", region: "김해", url: "https://www.kaya.ac.kr/" },
];

export const OFFICIAL = {
  gneHigh: { name: "경상남도교육청 고등학교 입학포털", url: "https://highschool.gne.go.kr/s10/hsa/user/main.do" },
  gneSchedule: { name: "2027학년도 고입 전형 일정", url: "https://highschool.gne.go.kr/s10/hsa/admission/processSchedule.do" },
  gneEqual: { name: "평준화지역 일반고 입학전형", url: "https://highschool.gne.go.kr/s10/hsa/admission/EqualizedProcess.do" },
  gne: { name: "경상남도교육청", url: "https://www.gne.go.kr/" },
  hischool: { name: "고입정보포털", url: "https://www.hischool.go.kr/" },
  hifive: { name: "하이파이브(특성화고·마이스터고)", url: "https://www.hifive.go.kr/" },
  schoolinfo: { name: "학교알리미", url: "https://www.schoolinfo.go.kr/" },
  career: { name: "커리어넷", url: "https://www.career.go.kr/" },
  work24: { name: "고용24 (직업심리검사)", url: "https://www.work24.go.kr/" },
  ggoomgil: { name: "꿈길 (진로체험)", url: "https://www.ggoomgil.go.kr/" },
  hscredit: { name: "고교학점제 누리집", url: "https://www.hscredit.kr/" },
  adiga: { name: "대입정보포털 어디가", url: "https://www.adiga.kr/" },
  academy: { name: "대학알리미", url: "https://www.academyinfo.go.kr/" },
  suneung: { name: "한국교육과정평가원 (수능)", url: "https://www.suneung.re.kr/" },
  ebsi: { name: "EBSi", url: "https://www.ebsi.co.kr/" },
};
