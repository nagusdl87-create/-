import type { HsTypeId } from "./jobs";

export type HsType = {
  id: HsTypeId;
  name: string;
  emoji: string;
  oneLine: string;
  goodFor: string[];
  curriculum: string;
  admission: string;
  afterGrad: string;
  consider: string[];
  round: "전기" | "후기" | "별도";
};

// 전국 공통의 일반적인 특징을 정리했습니다. 선발 방식·일정은 시·도와 학교마다 다르므로
// 반드시 해당 지역 교육청 고입 정보와 학교 입학 요강을 확인해야 합니다.
export const HS_TYPES: HsType[] = [
  {
    id: "general", name: "일반고", emoji: "🏫", round: "후기",
    oneLine: "가장 많은 학생이 진학하며, 고교학점제로 진로에 맞는 과목을 골라 듣는 학교",
    goodFor: ["진로를 아직 탐색 중인 학생", "다양한 분야의 과목을 폭넓게 배우고 싶은 학생", "대학 진학을 생각하는 학생"],
    curriculum: "공통과목을 배운 뒤 2~3학년에 일반선택·진로선택·융합선택 과목을 골라 3년간 192학점을 이수해요. 학교마다 개설 과목이 달라요.",
    admission: "보통 후기에 지원해요. 지역에 따라 추첨·배정(평준화) 방식이 많아요.",
    afterGrad: "대부분 대학에 진학하며, 진로에 따라 취업이나 다른 진로를 선택하기도 해요.",
    consider: ["우리 지역 일반고들이 어떤 선택과목을 여는지", "통학 거리와 학교 분위기", "중점학교·특색 과정 운영 여부"],
  },
  {
    id: "autonomous", name: "자율형 고교", emoji: "🧩", round: "후기",
    oneLine: "교육과정과 학교 운영을 더 자율적으로 꾸리는 학교(자율형 공립고·자율형 사립고)",
    goodFor: ["학교만의 특색 있는 교육과정에 관심 있는 학생", "자기주도적으로 공부하는 습관이 있는 학생"],
    curriculum: "학교가 교육과정을 비교적 자유롭게 구성해 특색 프로그램을 운영해요. 자율형 사립고는 학교마다 특징이 뚜렷해요.",
    admission: "후기에 지원하는 경우가 많고, 학교에 따라 추첨이나 면접 등 선발 방식이 달라요.",
    afterGrad: "대부분 대학에 진학해요.",
    consider: ["자율형 사립고는 학비가 일반고보다 높을 수 있음", "기숙사·통학 여부", "학교별 전형 방법"],
  },
  {
    id: "science", name: "과학고", emoji: "🔬", round: "전기",
    oneLine: "수학·과학에 재능과 열정이 있는 학생을 위한 특수목적고",
    goodFor: ["수학·과학 탐구를 깊이 즐기는 학생", "연구자·공학자를 꿈꾸는 학생"],
    curriculum: "수학·과학 전문 교과의 비중이 높고, 연구 활동과 실험이 많아요.",
    admission: "전기에 지원하며 자기주도학습전형(서류, 면접 등)으로 선발하는 것이 일반적이에요. 보통 해당 지역 학생만 지원할 수 있어요.",
    afterGrad: "이공계 대학 진학이 대부분이에요. 조기 졸업 제도를 운영하기도 해요.",
    consider: ["많은 학습량과 경쟁을 즐길 수 있는지", "중학교 수학·과학 탐구 경험", "기숙사 생활"],
  },
  {
    id: "foreign", name: "외국어고·국제고", emoji: "🌐", round: "후기",
    oneLine: "외국어와 국제 분야 전문 인재를 기르는 특수목적고",
    goodFor: ["외국어 공부와 다른 문화를 좋아하는 학생", "외교·국제·통번역 분야를 꿈꾸는 학생"],
    curriculum: "전공 외국어와 국제 관련 과목의 비중이 높아요.",
    admission: "후기에 지원하며 자기주도학습전형으로 선발하는 경우가 많아요.",
    afterGrad: "인문·사회·어문 계열 대학 진학이 많아요.",
    consider: ["전공 언어를 3년간 깊이 배우고 싶은지", "학비와 기숙사", "학교별 전형 방법"],
  },
  {
    id: "arts", name: "예술고·체육고", emoji: "🎭", round: "전기",
    oneLine: "음악·미술·무용·연극·체육 등 실기 능력을 전문적으로 기르는 학교",
    goodFor: ["예술·체육 분야에 꾸준히 실기를 준비해 온 학생", "그 분야를 직업으로 진지하게 생각하는 학생"],
    curriculum: "전공 실기 수업의 비중이 높고 공연·전시·대회 경험이 많아요.",
    admission: "전기에 지원하며 실기 시험 비중이 커요.",
    afterGrad: "예술·체육 계열 대학 진학이나 전문 활동으로 이어져요.",
    consider: ["오랜 기간 실기 준비가 필요함", "레슨 등 비용", "일반고 예체능 과정도 함께 비교"],
  },
  {
    id: "vocational", name: "특성화고", emoji: "🛠️", round: "전기",
    oneLine: "특정 분야의 직업 교육을 받으며 취업과 진학을 모두 준비하는 학교",
    goodFor: ["일찍 전문 기술을 배우고 싶은 학생", "자격증·실습 위주의 공부가 잘 맞는 학생"],
    curriculum: "IT, 디자인, 조리, 회계, 보건 등 학과별 전문 교과와 실습, 자격증 준비가 중심이에요.",
    admission: "보통 전기에 지원해요. 학교·학과별 선발 기준을 확인해야 해요.",
    afterGrad: "취업, 선취업 후 대학 진학(재직자 특별전형 등), 대학 진학 등 길이 다양해요.",
    consider: ["관심 학과가 개설된 학교 찾기", "학교의 취업·진학 실적", "현장실습 프로그램"],
  },
  {
    id: "meister", name: "마이스터고", emoji: "🏅", round: "전기",
    oneLine: "산업 현장과 연계해 분야별 최고의 기술 전문가(마이스터)를 기르는 학교",
    goodFor: ["반도체·기계·전자·에너지 등 기술 분야가 확실히 좋은 학생", "졸업 후 바로 전문 기업 취업을 원하는 학생"],
    curriculum: "기업과 함께 만든 교육과정으로 현장 실습과 기술 교육이 깊이 있게 이루어져요.",
    admission: "전기에 지원하며 전국에서 지원할 수 있는 경우가 많아요. 면접·적성 평가 등을 해요.",
    afterGrad: "대부분 취업하며, 일하면서 대학에 다니는 선취업·후진학 길도 있어요.",
    consider: ["분야를 일찍 정해야 함", "기숙사 생활", "학비·기숙사비 지원 여부"],
  },
  {
    id: "gifted", name: "영재학교", emoji: "💎", round: "별도",
    oneLine: "수학·과학 분야 영재를 위한 학교로, 다른 고교보다 먼저 별도로 선발",
    goodFor: ["수학·과학에 뛰어난 재능과 깊은 탐구 경험이 있는 학생"],
    curriculum: "학점제·무학년제 등으로 운영되며, 연구 중심의 심화 교육을 해요.",
    admission: "전기·후기와 별도로 일정이 가장 빨라요. 전국 단위로 지원하고 여러 단계의 선발을 거쳐요.",
    afterGrad: "이공계 대학 진학과 연구자의 길로 이어지는 경우가 많아요.",
    consider: ["높은 경쟁률과 이른 준비", "학교별 선발 단계", "과학고와의 차이"],
  },
];

export const HS_MAP = Object.fromEntries(HS_TYPES.map((h) => [h.id, h])) as Record<HsTypeId, HsType>;

// 고교 유형 탐색 퀴즈: 정답이 아니라 "비교해 볼 학교 유형"을 알려 주는 용도
export const HS_QUIZ: { q: string; options: { label: string; w: Partial<Record<HsTypeId, number>> }[] }[] = [
  {
    q: "지금 나의 진로 방향은?",
    options: [
      { label: "아직 찾는 중이에요", w: { general: 3, autonomous: 1 } },
      { label: "분야는 정했어요 (예: 공학, 의료)", w: { general: 1, autonomous: 1, science: 1, foreign: 1 } },
      { label: "구체적인 기술·직업을 정했어요", w: { vocational: 2, meister: 3 } },
      { label: "예술·체육을 전문적으로 하고 싶어요", w: { arts: 4 } },
    ],
  },
  {
    q: "어떤 방식의 공부가 더 잘 맞나요?",
    options: [
      { label: "여러 과목을 골고루", w: { general: 2, autonomous: 1 } },
      { label: "수학·과학을 깊고 어렵게", w: { science: 3, gifted: 3 } },
      { label: "언어·문화를 깊게", w: { foreign: 3 } },
      { label: "직접 만들고 실습하며", w: { vocational: 2, meister: 2 } },
    ],
  },
  {
    q: "고등학교 졸업 후 계획은?",
    options: [
      { label: "대학에 진학하고 싶어요", w: { general: 2, autonomous: 2, science: 1, foreign: 1 } },
      { label: "바로 취업해 일찍 전문가가 되고 싶어요", w: { meister: 3, vocational: 2 } },
      { label: "일하면서 나중에 대학도 가고 싶어요", w: { vocational: 3, meister: 2 } },
      { label: "잘 모르겠어요", w: { general: 2 } },
    ],
  },
  {
    q: "수학·과학 탐구(대회, 연구 등) 경험은?",
    options: [
      { label: "많고 정말 좋아해요", w: { science: 3, gifted: 3 } },
      { label: "조금 있어요", w: { science: 1, general: 1 } },
      { label: "별로 없어요", w: { general: 1, foreign: 1, vocational: 1 } },
    ],
  },
  {
    q: "기숙사 생활은 어때요?",
    options: [
      { label: "해 보고 싶어요", w: { science: 1, foreign: 1, meister: 1, gifted: 1, autonomous: 1 } },
      { label: "집에서 다니고 싶어요", w: { general: 2, vocational: 1 } },
      { label: "상관없어요", w: {} },
    ],
  },
  {
    q: "외국어 공부는?",
    options: [
      { label: "아주 좋아하고 자신 있어요", w: { foreign: 3 } },
      { label: "보통이에요", w: { general: 1 } },
      { label: "다른 분야가 더 좋아요", w: { science: 1, vocational: 1, meister: 1 } },
    ],
  },
];
