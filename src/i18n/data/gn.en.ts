// 영어 자료: src/data/gn.ts (경남 고입·산업·링크·학교 속성). 영어 모드에서만 불러온다.
// 학교·기관 이름과 주소는 한국어 그대로 둔다(고유명사). 날짜는 원문과 같다.
import type { HsKind } from "@/data/gn";

export const KIND_EN: Record<HsKind, string> = {
  general: "General high school",
  autonomous: "Autonomous public high school",
  science: "Science high school",
  foreign: "Foreign language high school",
  arts: "Arts high school",
  sports: "Sports high school",
  meister: "Meister high school",
  vocational: "Specialized vocational high school",
  alternative: "Alternative (experience-based) specialized high school",
  special: "Miscellaneous school · Technical high school",
};

export const REGION_EN: Record<string, string> = {
  거제: "Geoje", 거창: "Geochang", 고성: "Goseong", 김해: "Gimhae", 남해: "Namhae", 밀양: "Miryang",
  사천: "Sacheon", 산청: "Sancheong", 양산: "Yangsan", 의령: "Uiryeong", 진주: "Jinju", 창녕: "Changnyeong",
  창원: "Changwon", 통영: "Tongyeong", 하동: "Hadong", 함안: "Haman", 함양: "Hamyang", 합천: "Hapcheon",
};

export const ZONE_EN: Record<string, string> = {
  "평준화 1학군": "Equalization District 1",
  "평준화 2학군": "Equalization District 2",
  "평준화 3학군": "Equalization District 3",
  "평준화 4학군": "Equalization District 4",
  "평준화 5학군": "Equalization District 5",
  비평준화: "Non-equalization area",
  "평준화지역 학교장전형": "Principal-selection school in an equalization area",
};

export const ROUND_EN: Record<string, string> = { 전기: "Early round", 후기: "Late round", 추가: "Additional round", 별도: "Separate schedule" };
export const COEDU_EN: Record<string, string> = { 공학: "Co-ed", 남: "Boys", 여: "Girls" };
export const FOUND_EN: Record<string, string> = { 공립: "Public", 사립: "Private", 국립: "National" };
export const UNIT_EN: Record<string, string> = {
  경남: "Gyeongnam",
  전국: "Nationwide",
  "경남, 부산, 울산": "Gyeongnam, Busan, Ulsan",
  "경남, 전국(군특성화)": "Gyeongnam, nationwide (military track)",
};

// 학과 이름 (고교 학과·전공)
export const DEPT_EN: Record<string, string> = {
  조선기계과: "Shipbuilding Machinery", 조선용접설비과: "Shipbuilding Welding & Equipment", 조선전기과: "Shipbuilding Electrical", 조선플랜트설비과: "Shipbuilding Plant Equipment",
  경영사무과: "Business Administration", 관광서비스과: "Tourism Service", 카페디저트과: "Café & Dessert", 회계금융과: "Accounting & Finance",
  미용예술과: "Beauty Arts", 스마트팩토리과: "Smart Factory", 외식조리과: "Food Service & Culinary", 전기과: "Electrical",
  조경원예과: "Landscaping & Horticulture", 승강기설비엔지니어과: "Elevator Equipment Engineering", 승강기시스템제어과: "Elevator System Control", 연극뮤지컬과: "Theater & Musical",
  음악과: "Music", 항공기계과: "Aircraft Mechanics", 항공산업정비과: "Aviation Maintenance", 항공전기전자과: "Aviation Electrical & Electronics",
  AIoT전기과: "AIoT Electrical", 건설정보과: "Construction Information", 건축디자인과: "Architectural Design", 스마트융합기계과: "Smart Convergence Machinery",
  중기자동차시스템과: "Heavy Equipment & Automotive Systems", 농산업기계과: "Agricultural Machinery", 동물자원과: "Animal Resources", 식품가공과: "Food Processing",
  원예조경과: "Horticulture & Landscaping", 영어일본어과: "English-Japanese", 영어중국어과: "English-Chinese", 일본어영어과: "Japanese-English",
  중국어영어과: "Chinese-English", 보건간호과: "Health & Nursing", 보건의료행정과: "Health Care Administration", 스마트경영과: "Smart Business",
  영상크리에이터과: "Video Creator", 상업정보과: "Commercial Information", 스마트엔진과: "Smart Marine Engines", 스마트항해과: "Smart Navigation",
  공공행정과: "Public Administration", 뷰티케어과: "Beauty Care", 스마트IT과: "Smart IT", 영화예술과: "Film Arts",
  나노융합과: "Nano Convergence", 자영과: "Farm Management", 스마트디자인과: "Smart Design", 콘텐츠크리에이터과: "Content Creator",
  회계정보과: "Accounting Information", 조선산업과: "Shipbuilding Industry", 항공산업과: "Aviation Industry", 항공전기과: "Aviation Electrical",
  간호복지과: "Nursing & Welfare", 한방간호과: "Korean Medicine Nursing", AI융합팩토리과: "AI Convergence Factory", AI자동제어시스템과: "AI Automatic Control Systems",
  AI콘텐츠과: "AI Content", 바이오식품과: "Bio Food", 과학과: "Science", 만화애니메이션과: "Comics & Animation",
  미술과: "Fine Arts", 실용음악과: "Applied Music", AI로봇과: "AI Robotics", AI측정과: "AI Measurement",
  스마트전기과: "Smart Electrical", 자동차과: "Automotive", 자동차튜닝과: "Car Tuning", 정밀기계과: "Precision Machinery",
  IT소프트웨어과: "IT Software", 공공사무행정과: "Public Office Administration", 디지털콘텐츠과: "Digital Content", 창업비즈니스과: "Startup Business",
  체육과: "Physical Education", 도심항공모빌리티과: "Urban Air Mobility", 디지털영상콘텐츠과: "Digital Video Content", 뷰티과: "Beauty",
  컴퓨터전자과: "Computer Electronics", 콘텐츠디자인과: "Content Design", "K-푸드과": "K-Food", 경영정보과: "Business Information",
  금융회계과: "Finance & Accounting", 베이커리카페과: "Bakery & Café", 창업마케팅과: "Startup Marketing", 스마트위성건설과: "Smart Satellite Construction",
  스마트위성전기과: "Smart Satellite Electrical", 항공산업시스템과: "Aviation Industry Systems", 보통과: "General Course", 영어과: "English",
  스마트기계과: "Smart Machinery", 스마트원예과: "Smart Horticulture", 중기자동차과: "Heavy Equipment & Automotive", 전기전자과: "Electrical & Electronics",
  정밀기계조립과: "Precision Machine Assembly", 컴퓨터응용기계과: "Computer-Aided Machinery", 관광조리과: "Tourism Culinary", 관광호텔과: "Tourism & Hotel",
  식품가공발효과: "Food Processing & Fermentation", 호텔제과제빵과: "Hotel Baking & Pastry", AI네트워크과: "AI Network", e스포츠과: "Esports",
  드론전자과: "Drone Electronics", 웹툰미디어과: "Webtoon Media", 기계과: "Machinery", 메카트로닉스과: "Mechatronics",
  스마트융합설비과: "Smart Convergence Equipment", 로봇산업설비과: "Robot Industry Equipment", 스마트영상크리에이터과: "Smart Video Creator", 스마트제어디자인과: "Smart Control Design",
  웹툰디자인과: "Webtoon Design", 컴퓨터응용금형과: "Computer-Aided Mold Making", AI산업설비솔루션과: "AI Industrial Equipment Solutions", AI스마트기계과: "AI Smart Machinery",
  AI융합전기과: "AI Convergence Electrical", 지능형반도체전자과: "Intelligent Semiconductor Electronics", "3D융합디자인과": "3D Convergence Design", AI소프트웨어과: "AI Software",
  미디어콘텐츠과: "Media Content", 로봇소프트웨어과: "Robot Software", 스마트로봇전기과: "Smart Robot Electrical", AI에너지과: "AI Energy",
  농업과: "Agriculture", 조경토목과: "Landscaping & Civil Engineering", 조리과: "Culinary Arts", 멀티자동차과: "Multi Automotive",
  서비스마케팅과: "Service Marketing",
};

export const ZONES_EN: Record<string, { area: string; note: string }> = {
  "평준화 1학군": { area: "Changwon: Seongsan-gu, Uichang-gu", note: "(former Changwon City)" },
  "평준화 2학군": { area: "Changwon: Masanhappo-gu, Masanhoewon-gu", note: "(former Masan City)" },
  "평준화 3학군": { area: "Jinju", note: "" },
  "평준화 4학군": { area: "Gimhae", note: "" },
  "평준화 5학군": { area: "Geoje", note: "" },
};

// ADMISSION_SCHEDULE와 같은 순서
export const SCHEDULE_EN: { who: string; ko?: string; result?: string }[] = [
  { who: "Air Force aviation meister high school (national)", ko: "공군항공과학고" },
  { who: "2 science high schools: self-directed learning admission", ko: "경남과고, 창원과고" },
  { who: "Sports high school", ko: "경남체육고" },
  { who: "Arts high school", ko: "경남예술고", result: "See school notice" },
  { who: "3 meister high schools", ko: "거제공고, 삼천포공고, 한국나노마이스터고" },
  { who: "Specialized vocational high schools for talent in specific fields: special admission" },
  { who: "Specialized vocational high schools (general admission) · experience-based specialized high schools · miscellaneous schools" },
  { who: "Additional recruitment for early-round schools with open seats" },
  { who: "2 foreign language high schools: self-directed learning admission", ko: "김해외고, 경남외고" },
  { who: "General high schools in non-equalization areas · principal-selection schools in equalization areas" },
  { who: "General high schools in equalization areas (Office-of-Education assignment)", result: "Pass 2027. 1. 8. / Assignment 1. 15." },
  { who: "Equalization districts with open seats, early/late-round schools with open seats" },
];

// ADMISSION_RULES와 같은 순서
export const RULES_EN: { t: string; d: string }[] = [
  { t: "Early and late rounds", d: "Science, arts, sports, meister and specialized vocational high schools select students in the early round. General, autonomous and foreign language high schools select in the late round." },
  { t: "Apply to only one school", d: "In the early round you can apply to only one school (including schools in other provinces). If you pass in the early round, you cannot apply in the late round, even if you do not register." },
  { t: "Exceptions", d: "If you fail at a meister high school, you can apply again to a specialized vocational high school for talent in specific fields. If you fail the special admission of a specialized vocational high school, you can apply again to the general admission of the same school." },
  { t: "Equalization areas", d: "In the 5 districts of Changwon (2 districts), Jinju, Gimhae and Geoje, the Superintendent of Education selects students by middle school grades (class rank percentile). Then a computer lottery assigns schools in order of your choices." },
  { t: "Applying by district", d: "Middle school students in an equalization area apply to the district where their middle school is. In some areas, such as towns (eup) and smaller areas, you can also choose a nearby district." },
  { t: "Applying to a foreign language high school at the same time", d: "Applicants to a foreign language high school can also apply to an equalization district at the same time (except principal-selection schools)." },
  { t: "Science and foreign language high school admission", d: "They use self-directed learning admission with the school record and a self-introduction letter (science high schools also need a teacher recommendation). At least 20% of seats go to the social integration admission." },
  { t: "No double applications", d: "If you apply to another school after passing, or before your result comes out, it counts as a double application and your acceptance may be canceled." },
];

export const INDUSTRY_EN: Record<string, { name: string; desc: string }> = {
  ship: { name: "Shipbuilding · Marine", desc: "A world-class shipbuilding cluster making LNG carriers and eco-friendly ships" },
  aero: { name: "Aerospace", desc: "An aerospace hub with aircraft manufacturing and the Korea AeroSpace Administration" },
  mech: { name: "Machinery · Defense · Nuclear power", desc: "Machinery, defense and power-plant equipment industries centered on the Changwon National Industrial Complex" },
  nano: { name: "Nano convergence", desc: "Area where a nano convergence national industrial complex is being built" },
  auto: { name: "Automotive · Mobility", desc: "Auto parts and future mobility industries" },
  bio: { name: "Anti-aging · Bio-health", desc: "Korean-medicine anti-aging industry and biomedical and medical device industries" },
  sea: { name: "Fisheries · Marine tourism", desc: "Fish farming and marine tourism on the south coast" },
  logi: { name: "Ports · Logistics", desc: "Port logistics centered on Busan New Port and Jinhae New Port" },
  elev: { name: "Elevators", desc: "An elevator industrial complex and specialist training" },
};

export const OFFICIAL_EN: Record<string, string> = {
  gneHigh: "Gyeongnam Office of Education High School Admission Portal",
  gneSchedule: "2027 High School Admission Schedule",
  gneEqual: "General High School Admission in Equalization Areas",
  gne: "Gyeongsangnam-do Office of Education",
  hischool: "High School Admission Info Portal (hischool)",
  hifive: "HiFive (specialized vocational & meister high schools)",
  schoolinfo: "SchoolInfo (school disclosure)",
  career: "CareerNet",
  work24: "Work24 (career aptitude tests)",
  ggoomgil: "Ggoomgil (career experience)",
  hscredit: "High School Credit System website",
  adiga: "Adiga (university admission info portal)",
  academy: "Academyinfo (university disclosure)",
  suneung: "KICE (CSAT)",
  ebsi: "EBSi",
};

export const DATA_AS_OF_EN = "2027 high school admission (data released in 2026) · school locations as of Oct 2026";
