// 화면별 "이 화면 사용법"(머리글 ? 버튼). 길이는 3~4줄, 쉬운 말. 더 자세한 설명은 /help 의 해당 구역으로 이어진다.
export type PageHelpEntry = { match: (path: string) => boolean; title: string; what: string; steps: string[]; tip?: string; more?: string };

const starts = (...p: string[]) => (path: string) => p.some((x) => path === x || path.startsWith(x + "/"));

export const PAGE_HELP: PageHelpEntry[] = [
  { match: (p) => p === "/", title: "홈", what: "내 진로 여정의 시작 화면이에요.",
    steps: ["‘중학생’ 또는 ‘고등학생’을 눌러 내 학년을 골라요.", "위 5단계를 차례로 하면 돼요. 어디까지 했는지 자동으로 표시돼요.", "위쪽 검색창에 직업·학과·학교 이름을 쓰면 바로 찾아요."], tip: "처음이라 막막하면 ‘나 알기’부터 시작해요.", more: "start" },
  { match: starts("/discover"), title: "나 알기", what: "내가 좋아하는 것과 잘하는 것을 알아봐요.",
    steps: ["질문마다 ‘나와 더 가까운 쪽’을 골라요. 정답은 없어요.", "끝나면 흥미 유형과 어울리는 직업이 나와요.", "중요하게 생각하는 가치와 강점도 골라 보세요."], tip: "다시 해도 돼요. 결과는 계속 바뀔 수 있어요.", more: "steps" },
  { match: starts("/jobs"), title: "직업 백과", what: "직업이 하는 일과 되는 길을 알아봐요.",
    steps: ["검색창이나 분야 버튼으로 직업을 찾아요.", "직업을 눌러 하는 일·하루 모습·필요한 능력을 읽어요.", "마음에 들면 하트(찜)를 눌러요. 찜은 ‘길 잇기’와 ‘과목 설계’에서 쓰여요."], more: "steps" },
  { match: starts("/majors"), title: "학과 백과", what: "대학 학과가 무엇을 배우고 졸업 후 어디로 가는지 알아봐요.",
    steps: ["학과 이름이나 계열로 찾아요.", "학과를 눌러 배우는 내용과 고등학교에서 중요한 과목을 확인해요.", "마음에 들면 찜해요."], tip: "대학마다 권장 과목이 다를 수 있어서 원문 링크를 꼭 확인해요.", more: "steps" },
  { match: starts("/path"), title: "길 잇기", what: "직업 → 학과 → 고등학교 과목을 한 줄로 이어 봐요.",
    steps: ["찜한 직업이나 학과를 골라요.", "이어지는 학과와 핵심·권장 과목을 확인해요."], tip: "찜한 것이 없으면 먼저 직업이나 학과를 하나 찜해요.", more: "steps" },
  { match: starts("/credits/school"), title: "학교 편제표 등록", what: "우리 학교 편제표를 고르거나 직접 만들어요.",
    steps: ["등록된 학교 목록에서 우리 학교를 찾아 불러와요.", "없으면 학교 누리집의 편제표를 보면서 직접 입력하거나, 선생님이 만든 공유 코드를 넣어요."], tip: "등록하면 학교 지정 과목이 잠기고 선택군만 고를 수 있어요.", more: "credits" },
  { match: starts("/credits"), title: "192학점 과목 설계", what: "3년 동안 들을 과목을 학기별로 담아 졸업 학점(192)을 맞춰요.",
    steps: ["위의 ‘한 걸음씩 따라 하기’가 지금 할 일을 알려 줘요.", "목표(학과·직업)를 고르면 3년 모범안이 나와요. ‘내 설계로 가져오기’를 눌러요.", "‘먼저 이것부터 고쳐요’ 1번부터 버튼으로 고쳐요."], tip: "모범안은 정답이 아니라 참고 예시예요. 마음대로 바꿔요.", more: "credits" },
  { match: starts("/highschool", "/schools"), title: "고교 고르기", what: "고등학교 종류를 비교하고 경남 고등학교를 찾아봐요.",
    steps: ["유형(일반고·특목고·특성화고 등) 설명을 읽어요.", "지도나 목록에서 학교를 눌러 학과·급식·위치를 확인해요.", "마음에 들면 찜해요."], more: "steps" },
  { match: starts("/plan"), title: "계획·기록", what: "학기별 할 일을 정하고 한 활동을 기록해요.",
    steps: ["학기 탭에서 할 일을 체크해요.", "활동·독서·성적을 짧게 적어 두면 나중에 모아 볼 수 있어요."], tip: "기록은 이 기기에 저장돼요. ‘내 기록 백업’으로 파일도 만들어 두세요.", more: "faq" },
  { match: starts("/report"), title: "내 리포트", what: "지금까지 한 것을 한 장으로 모아 보여 줘요.",
    steps: ["빈 부분이 있으면 그 단계로 가서 채워요.", "‘인쇄’로 종이나 PDF로 만들어 선생님·보호자와 이야기해요."], more: "steps" },
  { match: starts("/portfolio"), title: "포트폴리오", what: "진로 활동, 독서, 학업설계서를 모아요.",
    steps: ["활동을 쓰고 저장해요.", "독서 기록과 학업설계서도 여기서 볼 수 있어요."], more: "steps" },
  { match: starts("/admission"), title: "2028 대입", what: "수능 개편과 5등급 내신, 전형을 알아봐요.",
    steps: ["수능 영역 구성을 읽어요.", "내신 계산기에서 과목 성적과 학점을 넣어 평균 등급을 확인해요."], more: "words" },
  { match: starts("/subjects"), title: "과목 백과", what: "2022 개정 교육과정의 모든 과목을 찾아봐요.",
    steps: ["이름이나 교과군으로 찾아요.", "과목을 눌러 학점·평가 방식·선수과목을 확인해요."], tip: "‘선수과목’은 먼저 배워야 하는 과목이에요.", more: "words" },
  { match: starts("/tests"), title: "진로검사·상담", what: "공식 진로검사와 상담 창구를 안내해요.", steps: ["하고 싶은 검사를 골라 공식 사이트로 가요.", "결과가 나오면 선생님과 함께 읽어 보세요."], more: "steps" },
  { match: starts("/account"), title: "내 기록 백업·로그인", what: "내 기록을 파일로 저장하거나 계정에 저장해 다른 기기에서 이어 써요.",
    steps: ["‘백업 파일 저장’으로 지금 기록을 내려받아요.", "다른 기기에서 ‘불러오기’로 파일을 올려요.", "로그인(선택)하면 자동으로 동기화돼요."], tip: "기록은 로그인하지 않으면 이 기기에만 있어요.", more: "faq" },
  { match: starts("/teacher"), title: "선생님 화면", what: "학급 학생들의 진로 현황을 모아 봐요.",
    steps: ["학생이 만든 공유 코드·파일을 붙여 넣거나, 로그인해서 공개한 학생을 불러와요.", "학생을 골라 전체 기록, 현황 분석, 세특 초안을 볼 수 있어요."], tip: "학생 기록은 상담·지도 목적으로만 써요.", more: "faq" },
  { match: starts("/search"), title: "검색", what: "직업·학과·과목·학교를 한 번에 찾아요.", steps: ["검색어를 바꿔 다시 찾아 보세요.", "결과를 누르면 자세한 화면으로 가요."] },
];

export const GENERIC_HELP: PageHelpEntry = {
  match: () => true, title: "이 사이트 쓰는 법", what: "위쪽 메뉴의 ‘나의 설계’ 5단계를 차례로 하면 돼요.",
  steps: ["‘나의 설계’에서 내 학년의 5단계를 차례로 해요.", "‘탐색’에서 직업·학과·과목·학교를 둘러봐요.", "‘도구’에서 192학점 설계, 포트폴리오, 백업을 써요."], more: "start",
};

export function pageHelpFor(path: string): PageHelpEntry {
  return PAGE_HELP.find((p) => p.match(path)) ?? GENERIC_HELP;
}
