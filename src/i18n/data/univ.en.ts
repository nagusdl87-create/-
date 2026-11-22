// 전국 대학 학과 데이터(public/data/univ-index.json)의 분류 체계 영어 이름.
// 교육부 표준분류 대계열(big)·중계열(mid)·소계열(small), 시도, 학교 유형.
// 대학·학과 이름은 공식 명칭이라 번역하지 않는다(화면에서 data-keep-ko).
import type { UGroup } from "@/lib/univ";

export const BIG_EN: Record<string, string> = {
  전체: "All",
  인문사회계열: "Humanities and Social Sciences",
  예체능계열: "Arts and Physical Education",
  자연과학계열: "Natural Sciences",
  공학계열: "Engineering",
  의학계열: "Medicine",
  기타: "Other",
};

export const MID_EN: Record<string, string> = {
  사회과학: "Social Sciences",
  "경영・경제": "Business and Economics",
  "무용・체육": "Dance and Physical Education",
  미술: "Fine Arts",
  보건: "Health",
  기계: "Mechanical",
  "전기・전자・컴퓨터": "Electrical, Electronic and Computer",
  생활과학: "Human Ecology",
  건설: "Construction",
  교육: "Education",
  간호: "Nursing",
  "N.C.E": "Not classified elsewhere",
  "화학・생명과학・환경": "Chemistry, Life Sciences and Environment",
  "농림・수산": "Agriculture, Forestry and Fisheries",
  "언어・문학": "Languages and Literature",
  "화공・고분자・에너지": "Chemical, Polymer and Energy Engineering",
  응용예술: "Applied Arts",
  "산업・안전": "Industrial and Safety",
  음악: "Music",
  인문학: "Humanities",
  재료: "Materials",
  "연극・영화": "Theater and Film",
  법학: "Law",
  약학: "Pharmacy",
  "수학・물리・천문・지구": "Math, Physics, Astronomy and Earth Science",
  의료: "Medicine",
  의료예과: "Pre-medical Programs",
  "교통・수송": "Transportation",
  기타: "Other",
};

export const SMALL_EN: Record<string, string> = {
  // 사회과학
  사회복지학: "Social Welfare", 행정학: "Public Administration", 심리학: "Psychology", "언론・방송・매체학": "Journalism, Broadcasting and Media",
  "군사・국방・안보": "Military, Defense and Security", 국제학: "International Studies", "아동・가족학": "Child and Family Studies", 정치외교학: "Political Science and Diplomacy",
  사회학: "Sociology", 문헌정보학: "Library and Information Science", "도시・지역・지리학": "Urban, Regional and Geography Studies", "소비자・가정자원": "Consumer and Family Resources",
  교양사회과학: "Liberal Arts Social Sciences", 인류학: "Anthropology",
  // 경영・경제
  경영학: "Business Administration", 관광학: "Tourism", "무역・유통학": "Trade and Distribution", "회계・세무학": "Accounting and Taxation", 경제학: "Economics",
  부동산: "Real Estate", 경영정보학: "Management Information Systems", "광고・홍보학": "Advertising and PR", "금융・보험학": "Finance and Insurance",
  // 무용・체육, 미술
  체육: "Physical Education", 무용: "Dance", 디자인: "Design", 순수미술: "Fine Art", 공예: "Crafts", 미술학: "Art Studies", 응용미술: "Applied Art",
  // 보건
  임상보건: "Clinical Health", 재활치료: "Rehabilitation Therapy", 피부미용: "Skin Care and Beauty", 보건관리: "Health Management", 보건학: "Public Health",
  // 기계
  기계공학: "Mechanical Engineering", 자동차공학: "Automotive Engineering", "항공・우주공학": "Aerospace Engineering", 메카트로닉스공학: "Mechatronics Engineering",
  "조선・해양공학": "Naval Architecture and Ocean Engineering", 철도공학: "Railway Engineering",
  // 전기・전자・컴퓨터
  "전산학・컴퓨터공학": "Computer Science and Engineering", 응용소프트웨어공학: "Applied Software Engineering", 전기공학: "Electrical Engineering", 전자공학: "Electronic Engineering",
  "정보・통신공학": "Information and Communication Engineering", 인공지능공학: "AI Engineering", 의공학: "Biomedical Engineering", 제어계측공학: "Control and Instrumentation Engineering", 광학공학: "Optical Engineering",
  // 생활과학
  조리과학: "Culinary Science", 식품영양학: "Food and Nutrition", "의류・의상학": "Clothing and Textiles", 주거학: "Housing Studies",
  // 건설
  건축학: "Architecture", 토목공학: "Civil Engineering", 건축공학: "Architectural Engineering", 도시공학: "Urban Engineering", 환경공학: "Environmental Engineering", 조경학: "Landscape Architecture",
  // 교육
  유아교육: "Early Childhood Education", 초등교육: "Elementary Education", 언어교육: "Language Education", 교육학: "Education", 사회과교육: "Social Studies Education", 특수교육: "Special Education",
  자연과학교육: "Science Education", "예술・체육교육": "Arts and PE Education", 공학교육: "Engineering Education", 교양공학: "Liberal Arts Engineering",
  // 간호, 예체능 기타
  간호학: "Nursing", 뷰티아트: "Beauty Arts",
  // 화학・생명과학・환경
  생명과학: "Life Sciences", 화학: "Chemistry", 바이오테크놀로지학: "Biotechnology", 환경학: "Environmental Studies",
  // 농림・수산
  축산학: "Animal Science", "작물・원예학": "Crop Science and Horticulture", 식품공학: "Food Engineering", 산림학: "Forestry", 수산학: "Fisheries Science",
  농림수산환경생태학: "Agricultural and Fisheries Ecology", 농림수산바이오시스템공학: "Agricultural and Fisheries Biosystems Engineering",
  // 언어・문학
  "국어・국문학": "Korean Language and Literature", "영어・영문학": "English Language and Literature", "중국어・문학": "Chinese Language and Literature", "일본어・문학": "Japanese Language and Literature",
  "프랑스어・문학": "French Language and Literature", "독일어・문학": "German Language and Literature", 문예창작학: "Creative Writing", "기타아시아어・문학": "Other Asian Languages and Literature",
  "러시아어・문학": "Russian Language and Literature", "기타유럽어・문학": "Other European Languages and Literature", "스페인어・문학": "Spanish Language and Literature", 언어학: "Linguistics", "교양어・문학": "Liberal Arts Languages and Literature",
  // 화공・고분자・에너지
  화학공학: "Chemical Engineering", 에너지공학: "Energy Engineering", 생명공학: "Bioengineering", 고분자공학: "Polymer Engineering", 섬유공학: "Textile Engineering",
  // 응용예술
  영상예술: "Visual Media Arts", 애니메이션: "Animation", 만화: "Comics", 게임: "Games", 사진: "Photography", 음향: "Sound",
  // 산업・안전
  산업공학: "Industrial Engineering", 안전공학: "Safety Engineering", 방재공학: "Disaster Prevention Engineering",
  // 음악
  실용음악: "Popular Music", 음악학: "Musicology", 기악: "Instrumental Music", 성악: "Vocal Music", 국악: "Korean Traditional Music", 작곡: "Composition",
  // 인문학
  국제지역학: "International Area Studies", 종교학: "Religious Studies", "역사・고고학": "History and Archaeology", "문화・민속・미술사학": "Culture, Folklore and Art History",
  "철학・윤리학": "Philosophy and Ethics", 교양인문학: "Liberal Arts Humanities",
  // 재료
  반도체공학: "Semiconductor Engineering", 신소재공학: "Advanced Materials Engineering", 재료공학: "Materials Engineering", 금속공학: "Metallurgical Engineering",
  // 연극・영화
  연극: "Theater", 영화: "Film", 방송연예: "Broadcasting and Entertainment",
  // 법학, 약학
  법학: "Law", 약학: "Pharmacy", 한약학: "Korean Herbal Pharmacy",
  // 수학・물리・천문・지구
  통계학: "Statistics", 수학: "Mathematics", 물리학: "Physics", 해양학: "Oceanography", "천문・대기과학": "Astronomy and Atmospheric Science", "지구・지질학": "Earth Science and Geology",
  // 의료, 의료예과
  의학: "Medicine", 한의학: "Korean Medicine", 수의학: "Veterinary Medicine", 치의학: "Dentistry",
  의예과: "Pre-medicine", 한의예과: "Pre-Korean Medicine", 수의예과: "Pre-veterinary Medicine", 치의예과: "Pre-dentistry",
  // 기타
  비서: "Secretarial Studies", 교양자연과학: "Liberal Arts Natural Sciences",
  철도운전제어학: "Railway Operation and Control", 항공운항학: "Flight Operations", "무인항공기(운항)학": "Unmanned Aircraft (Drone) Operation",
  공학: "Engineering",
};

export const SIDO_EN: Record<string, string> = {
  경남: "Gyeongnam", 부산: "Busan", 울산: "Ulsan", 대구: "Daegu", 경북: "Gyeongbuk", 서울: "Seoul", 경기: "Gyeonggi", 인천: "Incheon",
  강원: "Gangwon", 대전: "Daejeon", 세종: "Sejong", 충북: "Chungbuk", 충남: "Chungnam", 광주: "Gwangju", "광주·전남": "Gwangju/Jeonnam",
  전남: "Jeonnam", 전북: "Jeonbuk", 제주: "Jeju",
};

export const SCHOOL_TYPE_EN: Record<string, string> = {
  대학교: "University",
  산업대학: "Industrial university",
  전문대학: "Junior college",
  기능대학: "Polytechnic college",
  교육대학: "University of education",
  기술대학: "Technical college",
  방송통신대학: "Open university",
  "사이버대학(대학)": "Cyber university (bachelor's)",
  "사이버대학(전문)": "Cyber university (associate)",
  "각종학교(대학)": "Miscellaneous school (bachelor's)",
  "각종학교(전문)": "Miscellaneous school (associate)",
};

const tr = (m: Record<string, string>, k: string) => m[k.trim()] ?? k;
export const bigEn = (k: string) => tr(BIG_EN, k);
export const midEn = (k: string) => tr(MID_EN, k);
export const sidoEn = (k: string) => tr(SIDO_EN, k);
export const schoolTypeEn = (k: string) => tr(SCHOOL_TYPE_EN, k);
/** src/lib/univ.ts groupLabel의 영어판 */
export const groupLabelEn = (g: UGroup) =>
  g.small.startsWith("N.C.E") ? `Other (${bigEn(g.big)} · not classified elsewhere)` : tr(SMALL_EN, g.small);
