// 포트폴리오 양식 정의 — 입력 화면·제출용 보고서·인쇄가 모두 이 정의를 따른다(번호가 항상 일치).
import { TRACKS } from "./subjects";

export type Col = { k: string; label: string; type?: "text" | "select" | "date"; options?: string[] };
export type Field =
  | { k: string; t: "text" | "textarea" | "date" | "time"; label: string; ph?: string; max?: number }
  | { k: string; t: "select"; label: string; options: string[]; etc?: boolean }
  | { k: string; t: "chips"; label: string; options: string[]; max?: number }
  | { k: string; t: "suggest"; label: string; ph?: string; suggestions: string[] }
  | { k: string; t: "table"; label: string; cols: Col[]; addLabel?: string }
  | { k: string; t: "rating"; label: string; items: string[]; scale: string[] }
  | { k: string; t: "stars"; label: string }
  | { k: string; t: "credits"; label: string }
  | { k: string; t: "group"; label: string; fields: Field[] };

export type Step = { title: string; sub: string; question?: string; fields: Field[]; numbered?: boolean };
export type FormDef = { id: string; title: string; subtitle: string; steps: Step[] };

const AREA = ["자율활동", "자치활동", "학술·문화 및 여가 활동", "봉사활동", "진로 탐색 활동", "진로 설계 및 실천 활동"];
const EXP = ["현장직업체험", "직업실무체험", "현장견학", "학과체험", "진로캠프", "강연·대화"];
const Q_JOB = ["이 일을 하는 사람은 하루를 어떻게 보낼까?", "이 분야에서 가장 중요한 기술은 무엇일까?", "이 일을 하며 가장 보람 있는 순간은 언제일까?", "인공지능이 이 일을 어떻게 바꾸고 있을까?"];
const Q_STUDY = ["이 일을 하려면 고등학교에서 어떤 과목이 중요할까?", "학교에서 배우는 개념이 현장에서는 어떻게 쓰일까?", "대학에서는 어떤 학과에서 무엇을 배울까?", "지금부터 어떤 공부 습관이 필요할까?"];
const Q_COMM = ["이 분야는 우리 지역(경남)의 어떤 문제를 해결할 수 있을까?", "이 기술이 사회에 미치는 좋은 점과 걱정되는 점은?", "이 일을 하는 사람에게 필요한 윤리는 무엇일까?", "누구에게 가장 도움이 되는 일일까?"];
const MS_SUBJ = ["역사", "국어", "사회", "도덕", "수학", "과학", "기술·가정", "정보", "영어", "음악", "미술", "체육"];
const HS_SUBJ = ["대수", "미적분Ⅰ", "확률과 통계", "기하", "미적분Ⅱ", "인공지능 수학", "물리학", "화학", "생명과학", "지구과학", "역학과 에너지", "정보", "인공지능 기초", "데이터 과학", "사회와 문화", "경제", "윤리와 사상", "현대사회와 윤리", "미술 창작", "음악 연주와 창작"];
const FOLLOW = ["동아리", "독서", "주제탐구", "봉사", "수업"];
const GROWTH = ["탐구력", "주도성", "협업", "소통", "배려", "끈기", "창의성", "윤리의식", "융합적 사고", "자기이해", "공동체 기여"];

const basic = (level: "ms" | "hs"): Step => ({
  title: "기본 정보",
  sub: "인적사항·활동 개요",
  question: "어떤 진로활동에 참여했나요?",
  numbered: false,
  fields: [
    { k: "school", t: "text", label: "학교명" },
    { k: "grade", t: "text", label: "학년" },
    { k: "cls", t: "text", label: "반" },
    { k: "num", t: "text", label: "번호" },
    { k: "name", t: "text", label: "성명" },
    { k: "dream", t: "text", label: "희망 직업" },
    { k: "interest", t: "text", label: "관심 분야와 희망 계열" },
    { k: "area", t: "chips", label: "창의적 체험활동 영역", options: AREA, max: 1 },
    { k: "program", t: "text", label: "프로그램명 또는 동아리명" },
    { k: "biz", t: "select", label: "활동·사업 영역", options: ["창의적 체험활동", "학교 자체", level === "ms" ? "자유학기 진로체험" : "신산업 진로체험", "교육청", "기타"], etc: true },
    { k: "exp", t: "chips", label: "체험 유형 (꿈길 분류)", options: EXP, max: 1 },
    { k: "place", t: "text", label: "체험 기관·장소" },
    { k: "date", t: "date", label: "체험 일시" },
    { k: "start", t: "time", label: "시작 시각" },
    { k: "end", t: "time", label: "종료 시각" },
  ],
});

const investigate = (level: "ms" | "hs"): Step => ({
  title: "조사",
  sub: "동기·사전조사·질문",
  question: "무엇을, 왜 알고 싶은가?",
  fields: [
    { k: "motive", t: "textarea", label: "참여 동기", ph: "나는 ___에 관심이 생겼는데, 그 이유는 ___ 때문이다." },
    {
      k: "pre", t: "group", label: "사전 조사", fields: [
        { k: "trend", t: "textarea", label: "분야의 동향" },
        { k: "jobs", t: "textarea", label: "관련 직업과 하는 일" },
        { k: "local", t: "textarea", label: "우리 지역(경남)과의 연결" },
        { k: "refs", t: "text", label: "참고 출처" },
      ],
    },
    level === "ms"
      ? { k: "community", t: "textarea", label: "지역사회·공동체 문제 (학교 → 경남 → 우리나라 → 세계)" }
      : { k: "community", t: "textarea", label: "이 분야와 공동체 문제" },
    {
      k: "q", t: "group", label: "탐구 질문 3개", fields: [
        { k: "q1", t: "suggest", label: "Q1 직무·기술", suggestions: Q_JOB },
        { k: "q2", t: "suggest", label: "Q2 학업·과목", suggestions: Q_STUDY },
        { k: "q3", t: "suggest", label: "Q3 공동체", suggestions: Q_COMM },
      ],
    },
    level === "ms"
      ? { k: "kw", t: "group", label: "지금의 나를 나타내는 키워드 3개", fields: [{ k: "kw1", t: "text", label: "키워드 1" }, { k: "kw2", t: "text", label: "키워드 2" }, { k: "kw3", t: "text", label: "키워드 3" }] }
      : { k: "before", t: "textarea", label: "활동 전 나의 모습" },
  ],
});

const plan = (level: "ms" | "hs"): Step => ({
  title: level === "ms" ? "계획" : "준비",
  sub: level === "ms" ? "목표·실천 계획표" : "목표·인터뷰 질문",
  question: "어떻게 알아낼 것인가?",
  fields: [
    { k: "goals", t: "group", label: "목표 3개", fields: [1, 2, 3].map((n) => ({ k: `goal${n}`, t: "text" as const, label: `목표 ${n}`, ph: "___을 알게 된다 / ___을 할 수 있다" })) },
    level === "ms"
      ? { k: "plans", t: "table", label: "실천 계획표", addLabel: "실천 계획 추가", cols: [{ k: "text", label: "실천 계획" }, { k: "goal", label: "연결 목표", type: "select", options: ["목표1", "목표2", "목표3", "공통 계획"] }] }
      : { k: "mentorQ", t: "group", label: "전문가·멘토 인터뷰 질문표", fields: [1, 2, 3].map((n) => ({ k: `mq${n}`, t: "text" as const, label: `Q${n}` })) },
    { k: "risk", t: "textarea", label: "예상되는 어려움과 대처 방법" },
  ],
});

const act = (level: "ms" | "hs"): Step => ({
  title: level === "ms" ? "실행" : "행동",
  sub: "질문 추적·현장 기록",
  question: "현장에서 무엇을 보고, 묻고, 해냈는가?",
  fields: [
    { k: "log", t: "table", label: "현장 활동 기록표", addLabel: "행 추가", cols: [{ k: "time", label: "시간대" }, { k: "what", label: "활동 내용" }, { k: "learn", label: "관찰 및 배운 점" }] },
    {
      k: "track", t: "group", label: "탐구 질문 추적", fields: [1, 2, 3].flatMap((n) => [
        { k: `t${n}a`, t: "textarea" as const, label: `Q${n} 현장에서 찾은 답` },
        { k: `t${n}s`, t: "text" as const, label: `Q${n} 출처·멘토` },
        { k: `t${n}d`, t: "chips" as const, label: `Q${n} 해결 정도`, options: ["해결", "부분 해결", "미해결"], max: 1 },
        { k: `t${n}n`, t: "text" as const, label: `Q${n} 새로 생긴 질문` },
      ]),
    },
    { k: "mentor", t: "group", label: "멘토 인터뷰 핵심", fields: [{ k: "mBest", t: "text", label: "가장 중요했던 질문" }, { k: "mAns", t: "textarea", label: "답변" }, { k: "mMine", t: "textarea", label: "나의 해석" }] },
    { k: "lead", t: "textarea", label: "주도적으로 한 행동" },
    { k: "coop", t: "textarea", label: "협력과 공동체" },
    { k: "scene", t: "textarea", label: "가장 인상 깊은 장면" },
  ],
});

const reflect = (level: "ms" | "hs"): Step => ({
  title: "성찰",
  sub: "생각 변화·교과 연결",
  question: "무엇이 달라졌는가?",
  fields: [
    { k: "change", t: "textarea", label: "생각의 변화 (활동 전 → 활동 후)" },
    { k: "subj", t: "group", label: "연결 교과", fields: [{ k: "subjects", t: "chips", label: "관련 교과 (여러 개 선택)", options: level === "ms" ? MS_SUBJ : HS_SUBJ }, { k: "subjWhy", t: "textarea", label: level === "ms" ? "연결한 이유" : "교과 연계 탐구 계획" }] },
    ...(level === "ms"
      ? ([{ k: "product", t: "textarea", label: "산출물 소개" }, { k: "oneline", t: "text", label: "성장 한 문장", max: 100 }] as Field[])
      : []),
    { k: "follow", t: "table", label: "후속 실천 계획", addLabel: "계획 추가", cols: [{ k: "text", label: "실천 내용" }, { k: "date", label: "언제", type: "date" }, { k: "type", label: "유형", type: "select", options: FOLLOW }] },
  ],
});

const prove: Step = {
  title: "입증",
  sub: "산출물·성장 키워드",
  question: "성장을 무엇으로 보여줄 것인가?",
  fields: [
    { k: "product", t: "textarea", label: "산출물 소개 (보고서·발표·영상 등)" },
    { k: "oneline", t: "text", label: "성장 한 문장 (100자)", max: 100 },
    { k: "keywords", t: "chips", label: "핵심 성장 키워드 (최대 3개)", options: GROWTH, max: 3 },
  ],
};

const selfMs: Step = {
  title: "자기 평가",
  sub: "6대 목표",
  numbered: false,
  fields: [{ k: "self", t: "rating", label: "스스로 평가해 보세요", items: ["조사", "계획", "실행", "성찰", "협력", "나눔과 배려"], scale: ["잘했어요", "보통이에요", "더 노력할래요"] }],
};
const selfHs: Step = {
  title: "자기 평가",
  sub: "7대 학습 성과",
  numbered: false,
  fields: [{
    k: "self", t: "rating", label: "스스로 평가해 보세요",
    items: ["강점과 성장할 점을 알게 되었다", "새로운 도전으로 기술을 익혔다", "주도적으로 기획하고 추진했다", "끈기 있게 끝까지 해냈다", "다른 사람과 협업했다", "사회 문제에 관심을 갖고 참여했다", "윤리적인 선택을 고민했다"],
    scale: ["매우 그렇다", "그렇다", "보통", "노력 필요"],
  }],
};

export const ACTIVITY_MS: FormDef = { id: "act-ms", title: "진로활동 포트폴리오 · 중학교", subtitle: "4단계(조사-계획-실행-성찰) 학생 주도 탐구", steps: [basic("ms"), investigate("ms"), plan("ms"), act("ms"), reflect("ms"), selfMs] };
export const ACTIVITY_HS: FormDef = { id: "act-hs", title: "진로활동 포트폴리오 · 고등학교", subtitle: "5단계(조사-준비-행동-성찰-입증) 학생 주도 탐구", steps: [basic("hs"), investigate("hs"), plan("hs"), act("hs"), reflect("hs"), prove, selfHs] };

const REC_CHOICES = [...new Set(Object.values(TRACKS).flatMap((t) => [...t.core, ...t.rec]))].filter((s) => !s.includes("희망"));

export const ROADMAP: FormDef = {
  id: "roadmap",
  title: "진로·학업설계 192학점 로드맵",
  subtitle: "3개년 종합 계획서",
  steps: [
    {
      title: "진로 비전 설정", sub: "목표와 사명", fields: [
        { k: "name", t: "text", label: "학생 성명" },
        { k: "school", t: "text", label: "학교 및 학년·반" },
        { k: "track", t: "select", label: "희망 계열", options: [...Object.values(TRACKS).map((t) => t.name), "기타(직접 구성)"] },
        { k: "major", t: "text", label: "목표 학과·전공" },
        { k: "job", t: "text", label: "목표 직업" },
        { k: "mission", t: "text", label: "나의 진로 사명 (한 줄 다짐)", max: 80 },
      ],
    },
    {
      title: "핵심 질문 & 역량", sub: "거꾸로 설계(백워드)", fields: [
        { k: "question", t: "textarea", label: "내 진로의 핵심 탐구 질문" },
        { k: "comp", t: "group", label: "목표에 필요한 역량 3가지", fields: [1, 2, 3].map((n) => ({ k: `comp${n}`, t: "text" as const, label: `역량 ${n}` })) },
        { k: "rec", t: "chips", label: "대학·학과 권장이수과목 (192학점 설계에서 이수 여부 확인)", options: REC_CHOICES },
        { k: "strategy", t: "textarea", label: "이수 전략 메모 (개설되지 않은 과목은 공동교육과정·온라인학교 등)" },
      ],
    },
    { title: "192학점 설계", sub: "학기별 과목 배치", fields: [{ k: "credits", t: "credits", label: "192학점 설계" }] },
    { title: "자기성찰 & 메모", sub: "질문이 진로가 되는 탐구 메모", fields: [{ k: "memo", t: "textarea", label: "설계하며 든 생각, 고민, 선생님께 여쭤볼 점" }] },
    {
      title: "창체 & 세특 연계", sub: "활동 계획과 학기별 성찰", fields: [
        { k: "chang", t: "textarea", label: "창의적 체험활동 계획 (자율·자치 / 동아리 / 진로)", ph: "자율·자치: \n동아리: \n진로: " },
        { k: "setuk", t: "textarea", label: "교과 세특 연계 계획 (교과 연계 탐구 보고서 주제)" },
        { k: "refl", t: "group", label: "학기별 성찰", fields: ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2"].map((s) => ({ k: `r${s}`, t: "textarea" as const, label: `${s[0]}학년 ${s[2]}학기` })) },
      ],
    },
  ],
};

export const READING: FormDef = {
  id: "reading",
  title: "진로연계 독서 포트폴리오",
  subtitle: "한 권의 책에서 진로를 넓히는 5단계 독서",
  steps: [
    {
      title: "기본 정보", sub: "책과 나", fields: [
        { k: "name", t: "text", label: "성명" },
        { k: "school", t: "text", label: "학교·학년·반" },
        { k: "dream", t: "text", label: "관심 진로·희망 직업" },
        { k: "kw", t: "chips", label: "진로 키워드 (최대 3개)", max: 3, options: ["인공지능", "빅데이터·SW", "로봇", "미래자동차·모빌리티", "바이오헬스", "에너지·환경", "반도체", "조선·해양", "항공·우주", "문화콘텐츠·미디어", "공연·예술", "교육·상담", "보건·의료", "경영·경제", "법률·행정", "기타"] },
        { k: "title", t: "text", label: "도서명" },
        { k: "author", t: "text", label: "저자" },
        { k: "publisher", t: "text", label: "출판사" },
        { k: "startDate", t: "date", label: "읽기 시작한 날" },
        { k: "endDate", t: "date", label: "다 읽은 날" },
        { k: "fields", t: "chips", label: "책 분야 (최대 2개)", max: 2, options: ["과학·기술", "인문·철학", "사회·경제", "역사", "문학", "예술", "진로·자기계발", "환경·생태", "의학·건강", "기타"] },
        { k: "reason", t: "select", label: "독서 계기", options: ["선생님 추천", "친구·가족 추천", "수업 연계", "진로 관련 검색", "서점·도서관에서 발견", "기타"] },
        { k: "why", t: "textarea", label: "이 책을 고른 이유" },
      ],
    },
    {
      title: "독서 전", sub: "질문과 예측", fields: [
        { k: "qs", t: "group", label: "이 책에서 답을 찾고 싶은 질문", fields: [1, 2, 3].map((n) => ({ k: `q${n}`, t: "text" as const, label: `Q${n}` })) },
        { k: "predict", t: "textarea", label: "표지·목차를 보고 한 예측" },
        { k: "expect", t: "textarea", label: "기대하는 점" },
      ],
    },
    {
      title: "독서 중", sub: "장면 기록·인물 탐구", fields: [
        { k: "scenes", t: "table", label: "인상 깊은 장면 기록", addLabel: "기록 행 추가", cols: [{ k: "page", label: "페이지·구간" }, { k: "sum", label: "내 언어로 요약" }, { k: "why", label: "인상 깊은 이유" }, { k: "link", label: "진로와의 연결점" }] },
        { k: "person", t: "group", label: "인물 탐구", fields: [{ k: "pName", t: "text", label: "이름" }, { k: "pRole", t: "text", label: "직업·활동" }, { k: "pLearn", t: "textarea", label: "배울 점" }] },
      ],
    },
    {
      title: "독서 후", sub: "답 찾기·생각 변화", fields: [
        { k: "ans", t: "group", label: "질문의 답", fields: [1, 2, 3].flatMap((n) => [
          { k: `a${n}d`, t: "chips" as const, label: `Q${n} 해결 정도`, options: ["답을 찾음", "부분적으로", "아직"], max: 1 },
          { k: `a${n}`, t: "textarea" as const, label: `Q${n} 책에서 찾은 답` },
        ]) },
        { k: "newinfo", t: "textarea", label: "새로 알게 된 직업·분야 정보" },
        { k: "beforeAfter", t: "group", label: "생각의 변화", fields: [{ k: "before", t: "textarea", label: "이전 생각" }, { k: "after", t: "textarea", label: "변화된 생각" }] },
        { k: "critical", t: "textarea", label: "비판적 성찰 (동의하지 않는 부분, 더 생각해 볼 점)" },
        { k: "followQ", t: "text", label: "후속 질문" },
      ],
    },
    {
      title: "확장 활동", sub: "심화·나눔·세특 연계", fields: [
        { k: "ext", t: "table", label: "심화 활동", addLabel: "활동 추가", cols: [{ k: "type", label: "유형", type: "select", options: ["주제탐구 보고서", "발표·토론", "서평·글쓰기", "카드뉴스·영상", "기타"] }, { k: "what", label: "내용" }, { k: "result", label: "결과물" }] },
        { k: "nextBook", t: "group", label: "연계 후속 도서", fields: [{ k: "nbTitle", t: "text", label: "도서명" }, { k: "nbWhy", t: "text", label: "고른 이유" }] },
        { k: "share", t: "group", label: "나눔", fields: [{ k: "shWhere", t: "select", label: "공유한 곳", options: ["학급 게시판", "동아리", "독서 토론", "블로그·SNS", "가족", "기타"] }, { k: "shWho", t: "text", label: "공유 대상" }, { k: "shFb", t: "textarea", label: "받은 피드백" }] },
        { k: "setuk", t: "textarea", label: "교과 세특 연계 아이디어" },
        { k: "review", t: "text", label: "한 줄 총평", max: 100 },
        { k: "stars", t: "stars", label: "별점" },
        { k: "growth", t: "text", label: "성장 한 문장", max: 100 },
      ],
    },
  ],
};

export const FORMS: Record<string, FormDef> = { "act-ms": ACTIVITY_MS, "act-hs": ACTIVITY_HS, roadmap: ROADMAP, reading: READING };

// 예시 (경남 사례로 새로 작성)
export const EXAMPLES: Record<string, Record<string, string>> = {
  "act-ms": {
    school: "○○중학교", grade: "2", cls: "3", num: "14", name: "김하늘", dream: "조선해양공학 기술자", interest: "공학(기계·조선)",
    area: "진로 탐색 활동", program: "우리 지역 산업 탐방", biz: "자유학기 진로체험", exp: "현장견학", place: "거제 지역 조선 산업 홍보관", date: "2027-05-18", start: "09:30", end: "15:00",
    motive: "나는 거제에 살면서 매일 보는 거대한 배에 관심이 생겼는데, 쇠로 만든 배가 어떻게 바다에 뜨는지 궁금했기 때문이다.",
    trend: "친환경 연료 선박과 자율운항 선박 개발이 활발하다.", jobs: "선박 설계, 용접, 품질 관리, 해양 플랜트 엔지니어", local: "거제·통영·창원은 우리나라 조선 산업의 중심지다.", refs: "조선 관련 도서, 과학관 자료, 직업인 인터뷰 영상",
    community: "조선소 주변의 해양 오염과 안전 문제를 줄이는 방법이 필요하다.",
    q1: "이 일을 하는 사람은 하루를 어떻게 보낼까?", q2: "이 일을 하려면 고등학교에서 어떤 과목이 중요할까?", q3: "이 분야는 우리 지역(경남)의 어떤 문제를 해결할 수 있을까?",
    kw1: "호기심", kw2: "끈기", kw3: "만들기",
    goal1: "배가 뜨는 원리(부력)를 알게 된다", goal2: "조선 관련 직업 3가지를 알게 된다", goal3: "탐방 내용을 카드뉴스로 만들 수 있다",
    plans: JSON.stringify([{ text: "부력 원리 책 읽고 정리하기", goal: "목표1" }, { text: "직업인 인터뷰 영상 2편 보기", goal: "목표2" }, { text: "카드뉴스 6장 만들기", goal: "목표3" }]),
    risk: "견학 시간이 짧을 수 있어 질문을 미리 3개로 정리해 간다.",
    log: JSON.stringify([{ time: "09:30", what: "선박 모형 전시 관람", learn: "배 바닥이 넓을수록 안정적이다" }, { time: "13:00", what: "엔지니어 강연", learn: "설계·생산·품질 등 다양한 직무가 있다" }]),
    t1a: "엔지니어는 설계 도면을 검토하고 현장에서 문제를 해결한다.", t1s: "홍보관 강연", t1d: "해결", t1n: "자율운항 선박은 언제쯤 상용화될까?",
    t2a: "수학과 물리가 중요하다고 했다.", t2s: "강연자 답변", t2d: "부분 해결", t2n: "중학교 과학의 어떤 단원과 연결될까?",
    t3a: "친환경 선박이 바다 오염을 줄인다.", t3s: "전시 자료", t3d: "부분 해결", t3n: "",
    mBest: "가장 필요한 능력은 무엇인가요?", mAns: "끝까지 문제를 해결하는 끈기와 협동이라고 하셨다.", mMine: "혼자보다 팀으로 일하는 능력도 중요하다는 것을 알았다.",
    lead: "모둠 질문을 정리해서 대표로 질문했다.", coop: "친구들과 사진 담당, 기록 담당을 나눴다.", scene: "실제 배의 프로펠러 크기를 보고 놀랐다.",
    change: "막연히 배를 만드는 사람이라고 생각했는데 설계, 생산, 품질 등 다양한 직업이 있다는 것을 알게 되었다.",
    subjects: JSON.stringify(["과학", "수학", "기술·가정"]), subjWhy: "부력과 힘은 과학, 설계 도면은 수학과 기술·가정과 연결된다.",
    product: "조선 산업 탐방 카드뉴스 6장", oneline: "궁금증을 질문으로 만들고, 질문을 답으로 바꾸는 법을 배웠다.",
    follow: JSON.stringify([{ text: "조선 관련 마이스터고 설명회 참여", date: "2027-10-10", type: "주제탐구" }, { text: "부력 실험 보고서 쓰기", date: "2027-06-20", type: "수업" }]),
    self: JSON.stringify({ "조사": "잘했어요", "계획": "잘했어요", "실행": "보통이에요", "성찰": "잘했어요", "협력": "잘했어요", "나눔과 배려": "보통이에요" }),
  },
  "act-hs": {
    school: "○○고등학교", grade: "2", cls: "5", num: "19", name: "정바다", dream: "항공우주 엔지니어", interest: "공학(기계·항공)",
    area: "진로 설계 및 실천 활동", program: "항공 산업 직무 체험", biz: "신산업 진로체험", exp: "직업실무체험", place: "사천 지역 항공 산업 체험관", date: "2027-08-21", start: "10:00", end: "16:00",
    motive: "나는 물리학 시간에 배운 베르누이 원리에 관심이 생겼는데, 실제 항공기 날개 설계에 어떻게 쓰이는지 알고 싶었기 때문이다.",
    trend: "도심항공교통(UAM)과 위성 산업이 성장하고 있다.", jobs: "항공기 구조 설계, 비행 시험, 위성 시스템 엔지니어", local: "사천·진주는 항공우주 산업 중심지이며 우주항공청이 있다.", refs: "항공 역학 입문서, 공공기관 공개 자료",
    community: "항공 산업 성장과 함께 소음·탄소 배출 문제를 해결해야 한다.",
    q1: "이 분야에서 가장 중요한 기술은 무엇일까?", q2: "학교에서 배우는 개념이 현장에서는 어떻게 쓰일까?", q3: "이 기술이 사회에 미치는 좋은 점과 걱정되는 점은?",
    before: "막연히 비행기를 좋아했지만 어떤 공부가 필요한지는 몰랐다.",
    goal1: "날개 단면과 양력의 관계를 설명할 수 있다", goal2: "항공 엔지니어의 직무를 3가지 이상 알게 된다", goal3: "체험 내용을 탐구 보고서로 정리할 수 있다",
    mq1: "설계할 때 가장 많이 쓰는 수학 개념은 무엇인가요?", mq2: "실패했던 경험과 극복 방법이 궁금합니다.", mq3: "고등학생 때 해 두면 좋은 활동은 무엇인가요?",
    risk: "전문 용어가 어려울 수 있어 사전 조사로 용어집을 만든다.",
    log: JSON.stringify([{ time: "10:00", what: "풍동 실험 시연 관람", learn: "받음각이 커지면 양력이 늘다가 실속이 생긴다" }, { time: "14:00", what: "엔지니어 멘토링", learn: "미분으로 변화율을 계산해 설계를 최적화한다" }]),
    t1a: "공기역학 해석과 복합재료 기술이 핵심이다.", t1s: "멘토 답변", t1d: "해결", t1n: "복합재료는 왜 가벼우면서 튼튼할까?",
    t2a: "미적분Ⅰ의 변화율과 물리학의 유체 개념이 그대로 쓰인다.", t2s: "멘토링", t2d: "해결", t2n: "",
    t3a: "UAM은 교통 문제를 줄이지만 소음 규제가 필요하다.", t3s: "체험관 자료", t3d: "부분 해결", t3n: "소음을 줄이는 날개 설계는?",
    mBest: "실패 경험이 궁금합니다.", mAns: "시험 비행 실패 원인을 데이터로 찾아 개선했다고 하셨다.", mMine: "실패를 데이터로 분석하는 태도가 중요하다.",
    lead: "체험 후 친구들과 날개 모형 실험을 직접 기획했다.", coop: "실험 역할을 나누고 결과를 함께 분석했다.", scene: "풍동 속 연기가 날개를 따라 흐르는 모습",
    change: "비행기를 좋아하는 마음이 구체적인 공부 계획으로 바뀌었다.",
    subjects: JSON.stringify(["물리학", "미적분Ⅰ", "역학과 에너지", "정보"]), subjWhy: "2학년 2학기에 역학과 에너지를 선택해 유체 역학 탐구 보고서를 쓰겠다.",
    follow: JSON.stringify([{ text: "날개 모양별 양력 비교 탐구", date: "2027-10-01", type: "주제탐구" }, { text: "항공 관련 도서 읽기", date: "2027-09-15", type: "독서" }]),
    product: "날개 단면에 따른 양력 비교 탐구 보고서", oneline: "좋아하는 것을 설명할 수 있는 지식으로 바꾸는 법을 배웠다.", keywords: JSON.stringify(["탐구력", "끈기", "협업"]),
    self: JSON.stringify({ "강점과 성장할 점을 알게 되었다": "매우 그렇다", "새로운 도전으로 기술을 익혔다": "그렇다", "주도적으로 기획하고 추진했다": "매우 그렇다", "끈기 있게 끝까지 해냈다": "그렇다", "다른 사람과 협업했다": "그렇다", "사회 문제에 관심을 갖고 참여했다": "보통", "윤리적인 선택을 고민했다": "보통" }),
  },
  roadmap: {
    name: "정바다", school: "○○고 2학년 5반", track: "공학(기계·전자·반도체)", major: "항공우주공학과", job: "항공우주 엔지니어", mission: "더 멀리, 더 안전하게 나는 기술을 만든다",
    question: "더 가볍고 조용한 비행체는 어떻게 만들 수 있을까?", comp1: "수학적 모델링", comp2: "물리적 사고", comp3: "협업과 문제 해결",
    rec: JSON.stringify(["물리학", "역학과 에너지", "미적분Ⅱ", "기하"]), strategy: "학교에 없는 고급 물리학은 공동교육과정으로 신청한다.",
    memo: "3학년 1학기에 미적분Ⅱ와 기하를 함께 들을지 담임 선생님과 상의하기.",
    chang: "자율·자치: 학급 과학 행사 기획\n동아리: 항공 메이커 동아리\n진로: 항공 산업 직무 체험", setuk: "물리학: 날개 양력 탐구 / 미적분Ⅰ: 변화율로 본 비행 성능",
    "r1-1": "공통과목 기초를 다졌다.", "r1-2": "2학년 과목을 공학 계열로 선택했다.",
  },
  reading: {
    name: "정바다", school: "○○고 2학년 5반", dream: "항공우주 엔지니어", kw: JSON.stringify(["항공·우주", "인공지능"]),
    title: "(읽은 책 제목)", author: "(저자)", publisher: "(출판사)", startDate: "2027-08-01", endDate: "2027-08-20", fields: JSON.stringify(["과학·기술"]), reason: "수업 연계",
    why: "물리학 수업에서 배운 내용을 더 깊이 알고 싶었다.",
    q1: "비행기는 어떻게 뜰까?", q2: "미래 항공 기술은 어떻게 바뀔까?", q3: "항공 엔지니어에게 필요한 자질은?",
    predict: "양력과 엔진의 원리를 설명하는 책일 것 같다.", expect: "수업 개념이 실제로 쓰이는 예를 알고 싶다.",
    scenes: JSON.stringify([{ page: "45~60쪽", sum: "날개 위아래 압력 차이로 양력이 생긴다", why: "수업 내용과 바로 연결됨", link: "날개 설계 탐구 주제" }]),
    pName: "책 속 엔지니어", pRole: "시험 비행 엔지니어", pLearn: "실패를 기록하고 개선하는 태도",
    a1d: "답을 찾음", a1: "압력 차이와 받음각으로 양력이 생긴다.", a2d: "부분적으로", a2: "전기 추진과 자율 비행이 늘어난다.", a3d: "답을 찾음", a3: "끈기와 협업, 수학적 사고",
    newinfo: "비행 시험 엔지니어라는 직업을 알게 되었다.", before: "비행기는 엔진 힘으로만 난다고 생각했다.", after: "날개 모양과 공기 흐름이 핵심이다.",
    critical: "환경 문제에 대한 내용이 부족해 다른 자료를 더 찾아보고 싶다.", followQ: "소음을 줄이는 날개 설계는 가능할까?",
    ext: JSON.stringify([{ type: "주제탐구 보고서", what: "날개 단면별 양력 비교", result: "탐구 보고서 1편" }]),
    nbTitle: "(후속 도서)", nbWhy: "추진 기술을 더 알고 싶어서", shWhere: "동아리", shWho: "항공 메이커 동아리 친구들", shFb: "실험으로 확인해 보자는 의견",
    setuk: "물리학 세특: 독서 후 양력 실험 설계", review: "수업과 꿈을 연결해 준 책", stars: "5", growth: "읽은 것을 실험으로 확인하는 습관이 생겼다.",
  },
};
