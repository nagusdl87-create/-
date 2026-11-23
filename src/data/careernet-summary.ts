// 커리어넷 요약(전체 개수·분야/계열별 개수). 화면 코드에서 써도 되는 작은 파일.
import s from "./careernet/summary.json";
export type CnSummary = typeof s;
export const CN_SUMMARY = s as CnSummary;
/** 직업 분야(커리어넷 직업분류 대분류) 순서와 이모지 */
export const JOB_GROUP_EMOJI: Record<string, string> = {
  "연구직 및 공학 기술직": "🔬", "예술·디자인·방송·스포츠직": "🎨", "설치·정비·생산직": "🔧", "경영·사무·금융·보험직": "💼",
  "교육·법률·사회복지·경찰·소방직 및 군인": "⚖️", "미용·여행·숙박·음식·경비·청소직": "🍽️", "보건·의료직": "🩺",
  "영업·판매·운전·운송직": "🚚", "건설·채굴직": "🏗️", "농림어업직": "🌾",
};
export const MAJOR_GROUP_EMOJI: Record<string, string> = {
  공학계열: "⚙️", 예체능계열: "🎨", 사회계열: "🏛️", 자연계열: "🔭", 인문계열: "📖", 교육계열: "🏫", 의약계열: "🩺",
};
