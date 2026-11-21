// 홀랜드(Holland) 6가지 흥미 유형을 바탕으로 직접 작성한 중학생용 간이 흥미 탐색 문항입니다.
// 표준화된 심리검사가 아니므로, 결과는 "탐색의 출발점"으로만 사용합니다.

export type RiasecKey = "R" | "I" | "A" | "S" | "E" | "C";

export const RIASEC: Record<
  RiasecKey,
  { name: string; short: string; emoji: string; color: string; desc: string; keywords: string[] }
> = {
  R: {
    name: "현실형",
    short: "만들기·움직이기",
    emoji: "🔧",
    color: "#f97316",
    desc: "손이나 몸을 써서 무언가를 만들고, 고치고, 직접 해 보는 것을 좋아해요. 결과가 눈에 보이는 일에서 힘이 나요.",
    keywords: ["손재주", "기계", "운동", "실습", "자연"],
  },
  I: {
    name: "탐구형",
    short: "궁금증·분석",
    emoji: "🔬",
    color: "#2f7bf5",
    desc: "왜 그런지 궁금한 것을 끝까지 파고들어요. 관찰하고, 실험하고, 원리를 알아내는 과정이 즐거워요.",
    keywords: ["호기심", "과학", "수학", "논리", "연구"],
  },
  A: {
    name: "예술형",
    short: "상상·표현",
    emoji: "🎨",
    color: "#a855f7",
    desc: "생각과 느낌을 그림, 글, 음악, 영상 같은 나만의 방식으로 표현하는 것을 좋아해요. 정해진 틀보다 새로운 시도가 좋아요.",
    keywords: ["창의력", "감성", "디자인", "글쓰기", "음악"],
  },
  S: {
    name: "사회형",
    short: "돕기·함께하기",
    emoji: "🤝",
    color: "#10b981",
    desc: "사람들과 이야기하고, 가르치고, 돕는 일에서 보람을 느껴요. 다른 사람의 마음을 잘 알아차려요.",
    keywords: ["공감", "배려", "가르치기", "상담", "봉사"],
  },
  E: {
    name: "진취형",
    short: "이끌기·도전",
    emoji: "🚀",
    color: "#ef4444",
    desc: "목표를 세우고 사람들을 이끌며 일을 추진하는 것을 좋아해요. 설득하고, 계획하고, 새로운 일에 도전하는 게 신나요.",
    keywords: ["리더십", "설득", "기획", "경영", "도전"],
  },
  C: {
    name: "관습형",
    short: "정리·꼼꼼함",
    emoji: "📋",
    color: "#64748b",
    desc: "정해진 규칙에 따라 정리하고 계획대로 차근차근 해내는 것을 잘해요. 꼼꼼하고 책임감이 강해요.",
    keywords: ["정리", "계획", "숫자", "정확성", "책임감"],
  },
};

export const RIASEC_ORDER: RiasecKey[] = ["R", "I", "A", "S", "E", "C"];

export const QUESTIONS: { id: number; type: RiasecKey; text: string }[] = [
  { id: 1, type: "R", text: "고장 난 물건을 직접 분해하거나 고쳐 보고 싶다." },
  { id: 2, type: "I", text: "과학 뉴스나 신기한 자연 현상을 보면 원리를 찾아보게 된다." },
  { id: 3, type: "A", text: "그림, 글, 노래, 영상 등으로 나만의 작품을 만드는 것이 즐겁다." },
  { id: 4, type: "S", text: "친구가 고민을 이야기하면 끝까지 들어 주고 도와주고 싶다." },
  { id: 5, type: "E", text: "모둠 활동에서 역할을 나누고 앞장서서 이끄는 편이다." },
  { id: 6, type: "C", text: "책상, 필기, 파일 등을 깔끔하게 정리해 두어야 마음이 편하다." },
  { id: 7, type: "R", text: "레고, 조립, 만들기처럼 손으로 무언가를 완성하는 활동이 좋다." },
  { id: 8, type: "I", text: "어려운 수학·과학 문제를 오래 붙잡고 풀어내면 뿌듯하다." },
  { id: 9, type: "A", text: "남들과 다른 독특한 아이디어를 떠올리는 것을 좋아한다." },
  { id: 10, type: "S", text: "동생이나 친구에게 모르는 것을 설명해 주는 것이 즐겁다." },
  { id: 11, type: "E", text: "학급 회장, 동아리 부장 같은 역할을 맡아 보고 싶다." },
  { id: 12, type: "C", text: "계획표를 세우고 그대로 실천했을 때 기분이 좋다." },
  { id: 13, type: "R", text: "체육, 기술 실습처럼 몸을 움직이는 수업이 더 좋다." },
  { id: 14, type: "I", text: "실험이나 관찰을 하고 결과를 기록하는 활동이 재미있다." },
  { id: 15, type: "A", text: "음악을 듣거나 영화를 보면 나라면 어떻게 만들지 상상해 본다." },
  { id: 16, type: "S", text: "봉사활동이나 누군가를 돕는 일에 보람을 느낀다." },
  { id: 17, type: "E", text: "내 의견으로 다른 사람을 설득하는 것에 자신이 있다." },
  { id: 18, type: "C", text: "숫자나 자료를 표로 정리하고 틀린 곳을 찾는 일을 잘한다." },
  { id: 19, type: "R", text: "식물 기르기, 동물 돌보기, 캠핑처럼 밖에서 하는 활동이 좋다." },
  { id: 20, type: "I", text: "왜 그럴까 궁금한 것이 생기면 스스로 찾아볼 때까지 신경이 쓰인다." },
  { id: 21, type: "A", text: "옷, 방, 노트 등을 내 취향대로 꾸미는 것을 좋아한다." },
  { id: 22, type: "S", text: "새로 전학 온 친구가 있으면 먼저 말을 걸어 준다." },
  { id: 23, type: "E", text: "물건을 팔거나 행사를 기획해서 성과를 내 보고 싶다." },
  { id: 24, type: "C", text: "규칙과 순서가 정해져 있는 일이 더 편하고 실수가 적다." },
  { id: 25, type: "R", text: "공구나 기계, 전자 부품을 다뤄 보는 것이 흥미롭다." },
  { id: 26, type: "I", text: "코딩, 퍼즐, 추리 게임처럼 논리적으로 생각하는 활동이 좋다." },
  { id: 27, type: "A", text: "일기, 소설, 웹툰 등 이야기를 지어내는 것이 즐겁다." },
  { id: 28, type: "S", text: "사람들 사이의 다툼을 중재하고 분위기를 좋게 만드는 편이다." },
  { id: 29, type: "E", text: "나중에 내 회사나 가게를 직접 운영해 보고 싶다." },
  { id: 30, type: "C", text: "용돈 기록, 일정 관리처럼 꼼꼼하게 기록하는 습관이 있다." },
];

export const SCALE = [
  { v: 1, label: "전혀 아니다" },
  { v: 2, label: "아니다" },
  { v: 3, label: "그렇다" },
  { v: 4, label: "매우 그렇다" },
];

export const VALUES = [
  { id: "stability", label: "안정", emoji: "🏠", desc: "오래 꾸준히 일할 수 있는 것" },
  { id: "achievement", label: "성취", emoji: "🏆", desc: "목표를 이루고 실력을 인정받는 것" },
  { id: "service", label: "봉사", emoji: "💗", desc: "다른 사람과 사회에 도움이 되는 것" },
  { id: "creativity", label: "창의", emoji: "💡", desc: "새로운 것을 만들고 시도하는 것" },
  { id: "autonomy", label: "자율", emoji: "🕊️", desc: "내 방식대로 자유롭게 일하는 것" },
  { id: "income", label: "경제적 보상", emoji: "💰", desc: "충분한 수입을 얻는 것" },
  { id: "knowledge", label: "지식 탐구", emoji: "📚", desc: "계속 배우고 새로운 것을 알아가는 것" },
  { id: "influence", label: "영향력", emoji: "📣", desc: "사람들을 이끌고 변화를 만드는 것" },
] as const;

export type ValueId = (typeof VALUES)[number]["id"];

export const STRENGTHS = [
  "꼼꼼함", "끈기", "호기심", "공감 능력", "말하기", "글쓰기", "손재주", "체력",
  "수학적 사고", "창의력", "리더십", "책임감", "관찰력", "협동", "외국어", "디지털 활용",
];
