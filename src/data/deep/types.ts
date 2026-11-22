// 직업·학과 상세 콘텐츠 기준(docs/content-standard.md). 커리어넷 연동으로 추가되는 항목도 이 형식을 채운다.
export type JobDeep = {
  intro: string; // 직업 소개 2~3문장
  work: string[]; // 하는 일 상세 5~7개 (구체적인 동작으로)
  day: { t: string; d: string }[]; // 하루 흐름 예시 4단계 (일반적인 예시)
  skills: { k: string; why: string }[]; // 필요한 지식·능력 4~5개와 필요한 이유
  env: string; // 근무 환경(장소·근무 형태·함께 일하는 사람) 2~3문장
  edu: string; // 학력·경로 1~2문장 (여러 경로가 있으면 함께)
  growth: string; // 경력이 쌓이면 1~2문장
  future: string; // 기술 변화(AI·자동화)가 주는 영향과 대비 1~2문장
  hs: string[]; // 고등학생 때 해 볼 활동·탐구 3~4개
  faq: { q: string; a: string }[]; // 학생이 궁금해할 질문 2~3개
};

export type MajorDeep = {
  intro: string; // 학과 소개 2~3문장
  questions: string[]; // 이 학과가 답을 찾는 질문 3개
  tracks: { name: string; d: string }[]; // 세부 전공·분야 3~5개
  years: string[]; // 학년별 배우는 흐름 4단계(6년제는 단계로)
  skills: string[]; // 길러지는 능력 3~4개
  compare: { with: string; diff: string }[]; // 헷갈리기 쉬운 학과와 차이 1~2개
  after: string; // 졸업 후 진로 2문장(취업·대학원·자격)
  hs: string[]; // 고교에서 해 볼 탐구 주제 예시 3개
  faq: { q: string; a: string }[]; // 2개
};
