// 미래 신산업 진로 탐색 (자체 제작): 8대 분야, 퀴즈 20문항, 미래 트렌드 친화도 15문항
export type IndustryId = "ai" | "robot" | "mobility" | "bio" | "energy" | "semi" | "space" | "farm";

export const INDUSTRIES: Record<IndustryId, { name: string; desc: string; jobs: string[]; majors: string[]; subjects: string[]; gn?: string }> = {
  ai: { name: "인공지능·데이터", desc: "데이터를 학습해 판단하고 예측하는 기술로 모든 산업을 바꾸고 있어요.", jobs: ["ai-engineer", "data-analyst", "software-dev", "security"], majors: ["ai", "data-science", "cs"], subjects: ["정보", "인공지능 기초", "데이터 과학", "확률과 통계", "미적분Ⅱ"] },
  robot: { name: "로봇·스마트제조", desc: "공장과 병원, 가정에서 사람을 돕는 로봇과 자동화 기술이에요.", jobs: ["robot-engineer", "smart-factory", "mech-defense"], majors: ["robotics", "mech", "electrical"], subjects: ["물리학", "정보", "로봇과 공학세계", "기하"], gn: "창원 기계·방산 산업" },
  mobility: { name: "미래 모빌리티", desc: "전기차·자율주행·도심항공교통 등 이동 방식을 바꾸는 기술이에요.", jobs: ["car-engineer", "aerospace", "logistics"], majors: ["mech", "electrical", "aero"], subjects: ["물리학", "역학과 에너지", "정보", "미적분Ⅰ"], gn: "창원·김해 자동차 부품 산업" },
  bio: { name: "바이오헬스", desc: "질병 진단·치료, 신약, 건강 관리 기술로 사람의 생명을 지켜요.", jobs: ["biologist", "pharmacist", "anti-aging", "doctor"], majors: ["biology", "pharmacy", "medicine"], subjects: ["생명과학", "화학", "세포와 물질대사", "생물의 유전"], gn: "산청·함양 항노화, 김해·양산 의생명" },
  energy: { name: "친환경 에너지", desc: "탄소를 줄이는 재생에너지, 원자력, 수소, 배터리 기술이에요.", jobs: ["nuclear", "env-engineer", "climate-scientist", "electrician"], majors: ["nuclear-eng", "env-eng", "chem-eng"], subjects: ["물리학", "화학", "지구과학", "기후변화와 환경생태"], gn: "창원 원전·발전설비 산업" },
  semi: { name: "반도체·나노소재", desc: "모든 전자기기의 두뇌인 반도체와 새로운 소재를 만드는 기술이에요.", jobs: ["semiconductor", "nano", "chemist"], majors: ["semiconductor", "materials", "electrical"], subjects: ["물리학", "화학", "전자기와 양자", "물질과 에너지"], gn: "밀양 나노융합 산업" },
  space: { name: "우주항공·조선해양", desc: "항공기·위성·친환경 선박처럼 하늘과 바다를 여는 거대 기술이에요.", jobs: ["aerospace", "shipbuilding", "astronomer"], majors: ["aero", "naval", "astronomy"], subjects: ["물리학", "역학과 에너지", "미적분Ⅱ", "지구과학"], gn: "사천 우주항공, 거제·통영 조선" },
  farm: { name: "스마트팜·푸드테크", desc: "센서와 데이터로 농업·수산업을 자동화하고 미래 식량을 만드는 기술이에요.", jobs: ["smart-farmer", "aquaculture", "chef"], majors: ["marine-bio", "biology", "culinary"], subjects: ["생명과학", "정보", "지구과학", "화학"], gn: "남해안 스마트 양식" },
};

export const QUIZ: { q: string; options: string[]; a: number; hint: string; why: string; ind: IndustryId }[] = [
  { q: "많은 데이터로 스스로 규칙을 배우는 인공지능 기술을 무엇이라고 할까요?", options: ["기계학습", "3D 프린팅", "블록체인", "가상현실"], a: 0, hint: "‘기계가 배운다’는 뜻이에요.", why: "기계학습(머신러닝)은 데이터에서 패턴을 찾아 예측하는 기술이에요.", ind: "ai" },
  { q: "개인정보가 담긴 데이터를 다룰 때 가장 먼저 지켜야 할 것은?", options: ["속도", "보안과 동의", "화면 디자인", "저장 용량"], a: 1, hint: "데이터의 주인은 누구일까요?", why: "개인정보는 당사자의 동의와 안전한 보호가 가장 중요해요.", ind: "ai" },
  { q: "사람과 같은 공간에서 안전하게 함께 일하도록 만든 로봇은?", options: ["협동로봇", "드론", "챗봇", "풍력발전기"], a: 0, hint: "‘함께 일한다’는 뜻이 이름에 있어요.", why: "협동로봇(코봇)은 센서로 사람을 감지해 안전하게 협업해요.", ind: "robot" },
  { q: "공장의 기계·센서가 데이터를 주고받으며 스스로 생산을 최적화하는 공장은?", options: ["스마트공장", "가내수공업", "물류창고", "발전소"], a: 0, hint: "‘똑똑한’ 공장이에요.", why: "스마트공장은 사물인터넷과 데이터로 생산을 자동화해요.", ind: "robot" },
  { q: "운전자의 조작 없이 스스로 주행하는 자동차 기술은?", options: ["자율주행", "하이브리드", "터보 엔진", "수동변속"], a: 0, hint: "‘스스로 달린다’", why: "자율주행은 센서·AI·지도로 주변을 인식해 스스로 운전해요.", ind: "mobility" },
  { q: "도시 안에서 사람을 태우고 하늘로 이동하는 미래 교통 수단을 줄여서 무엇이라 할까요?", options: ["UAM", "KTX", "BRT", "SUV"], a: 0, hint: "Urban Air Mobility", why: "UAM(도심항공교통)은 전기 수직이착륙기로 도심 하늘을 이동해요.", ind: "mobility" },
  { q: "전기차 배터리로 가장 많이 쓰이는 전지는?", options: ["리튬이온 전지", "망간 건전지", "수은 전지", "납축전지만"], a: 0, hint: "휴대폰에도 들어 있어요.", why: "리튬이온 전지는 가볍고 에너지 밀도가 높아 전기차에 널리 쓰여요.", ind: "mobility" },
  { q: "유전자의 특정 부분을 잘라 고치는 생명공학 기술은?", options: ["유전자 가위", "엑스레이", "백신 주사기", "현미경"], a: 0, hint: "자르는 도구 이름이에요.", why: "유전자 가위(예: CRISPR)는 원하는 DNA를 찾아 잘라 교정해요.", ind: "bio" },
  { q: "한약재·천연물에서 건강에 좋은 성분을 찾아 제품으로 만드는 경남 지리산권 산업은?", options: ["항노화 산업", "조선 산업", "석유화학", "반도체"], a: 0, hint: "‘늙지 않게’", why: "산청·함양 등은 한방 항노화 산업을 키우고 있어요.", ind: "bio" },
  { q: "햇빛을 받아 전기를 만드는 발전 방식은?", options: ["태양광 발전", "화력 발전", "디젤 발전", "수력 발전"], a: 0, hint: "패널을 지붕에 올려요.", why: "태양광 패널의 반도체가 빛을 전기로 바꿔요.", ind: "energy" },
  { q: "물을 전기분해해 얻을 수 있고, 탈 때 물만 나오는 친환경 연료는?", options: ["수소", "석탄", "휘발유", "천연가스"], a: 0, hint: "원소 기호 H", why: "수소는 연소하거나 연료전지에서 반응할 때 물만 생겨요.", ind: "energy" },
  { q: "작고 안전성을 높인 차세대 원자로를 줄여서 무엇이라 할까요?", options: ["SMR", "LED", "GPS", "USB"], a: 0, hint: "Small Modular Reactor", why: "SMR(소형모듈원자로)은 공장에서 모듈로 제작하는 소형 원자로예요.", ind: "energy" },
  { q: "반도체 칩에 회로를 새길 때 빛을 이용하는 공정은?", options: ["노광(포토) 공정", "용접 공정", "도장 공정", "주조 공정"], a: 0, hint: "사진(Photo)처럼 찍어요.", why: "노광 공정은 빛으로 웨이퍼에 미세한 회로 패턴을 새겨요.", ind: "semi" },
  { q: "머리카락 굵기의 수만 분의 1 크기 물질을 다루는 기술은?", options: ["나노기술", "거시경제", "토목공학", "원예기술"], a: 0, hint: "10억 분의 1미터 단위", why: "나노기술은 원자·분자 수준에서 새로운 성질의 소재를 만들어요.", ind: "semi" },
  { q: "반도체 웨이퍼의 주원료가 되는 원소는?", options: ["규소(실리콘)", "금", "납", "구리"], a: 0, hint: "모래에 많이 들어 있어요.", why: "실리콘은 반도체 성질을 가져 웨이퍼의 주원료로 쓰여요.", ind: "semi" },
  { q: "2024년 경남 사천에 문을 연 우리나라 우주항공 전담 기관은?", options: ["우주항공청", "기상청", "특허청", "관세청"], a: 0, hint: "이름에 ‘우주’가 들어가요.", why: "우주항공청은 우주항공 정책과 연구개발을 이끄는 기관이에요.", ind: "space" },
  { q: "액화천연가스를 영하 160℃ 이하로 실어 나르는, 우리나라 조선소가 강한 선박은?", options: ["LNG 운반선", "유람선", "어선", "요트"], a: 0, hint: "천연가스를 액체로", why: "LNG 운반선은 초저온 화물창 기술이 필요한 고부가가치 선박이에요.", ind: "space" },
  { q: "비행기 날개 위아래의 압력 차이로 생기는 위로 뜨는 힘은?", options: ["양력", "마찰력", "자기력", "탄성력"], a: 0, hint: "‘들어 올리는’ 힘", why: "날개 위쪽 공기 흐름이 빨라 압력이 낮아지면서 양력이 생겨요.", ind: "space" },
  { q: "온도·습도·빛을 센서로 측정해 작물을 자동으로 기르는 농장은?", options: ["스마트팜", "목장", "과수원", "다랑논"], a: 0, hint: "‘똑똑한’ 농장", why: "스마트팜은 센서와 자동 제어로 작물 생육 환경을 관리해요.", ind: "farm" },
  { q: "바닷물고기나 해조류를 육상 수조에서 데이터로 관리하며 기르는 방식은?", options: ["스마트 양식", "원양어업", "갯벌 체험", "낚시"], a: 0, hint: "기르는(養) 기술", why: "스마트 양식은 수질·먹이를 자동으로 관리해 지속가능한 수산물을 생산해요.", ind: "farm" },
];

export const TREND_ITEMS: { t: string; ind: IndustryId[] }[] = [
  { t: "새로 나온 앱이나 기기를 먼저 써 보는 편이다.", ind: ["ai"] },
  { t: "데이터나 그래프를 보고 숨은 규칙을 찾는 것이 재미있다.", ind: ["ai"] },
  { t: "기계가 어떻게 움직이는지 분해하거나 조립해 보고 싶다.", ind: ["robot", "mobility"] },
  { t: "자율주행차나 드론 같은 미래 교통수단에 관심이 많다.", ind: ["mobility"] },
  { t: "사람의 몸과 건강, 질병 치료에 관한 뉴스를 찾아본다.", ind: ["bio"] },
  { t: "기후 변화와 에너지 문제를 해결하는 일에 참여하고 싶다.", ind: ["energy"] },
  { t: "작은 부품 하나가 큰 기계를 움직이는 원리가 궁금하다.", ind: ["semi"] },
  { t: "우주, 비행기, 거대한 배를 보면 설렌다.", ind: ["space"] },
  { t: "식물이나 바다 생물을 기르고 관찰하는 것이 좋다.", ind: ["farm"] },
  { t: "코딩이나 프로그램 만들기를 배워 보고 싶다.", ind: ["ai", "robot"] },
  { t: "실험을 반복하며 더 나은 결과를 찾는 과정이 즐겁다.", ind: ["bio", "semi"] },
  { t: "새로운 기술이 사회에 미칠 영향을 토론하는 것이 좋다.", ind: ["ai", "bio"] },
  { t: "친환경 제품을 고르거나 에너지를 아끼려고 노력한다.", ind: ["energy", "farm"] },
  { t: "지도·위성 사진으로 지역의 변화를 살펴보는 것이 흥미롭다.", ind: ["space", "mobility"] },
  { t: "우리 지역(경남) 산업이 어떻게 바뀌는지 궁금하다.", ind: ["robot", "space", "energy"] },
];
