export const SITE_URL = "https://my-job-c1e50.web.app";
export const SITE_NAME = "마이로드 경남";
export const SITE_DESC = "경남 중·고등학생을 위한 진로·학업 설계: 흥미 탐색, 직업·학과, 경남 고교 찾기, 192학점 과목 설계, 2028 대입까지 한 흐름으로";
// 카카오맵 JavaScript 키(웹에 공개되는 키, developers.kakao.com에 등록한 도메인에서만 작동). 비어 있으면 OpenStreetMap 지도를 쓴다.
export const KAKAO_JS_KEY = "029295f379e1b97e82bcca1bd784e1a6";

// 교사·관리자 열람 기능(학생이 동의한 포트폴리오를 교사가 보는 기능). 사용자 승인 전에는 숨김.
// 켜려면 빌드 때 NEXT_PUBLIC_TEACHER_CLOUD=on. 미리보기: 주소 뒤에 ?teacher=1 (이 브라우저에만 기억).
export const TEACHER_CLOUD = process.env.NEXT_PUBLIC_TEACHER_CLOUD === "on";
// 최고 권한자(마스터) 구글 계정 한 곳. firestore.rules의 isMaster()에도 같은 주소가 있으니 바꿀 때 두 곳을 함께 고친다.
export const MASTER_EMAIL = "nagusdl87@gmail.com";

// 학생·선생님 의견 창구. 구글 폼 주소를 넣으면 그 폼으로 열리고, 비어 있으면 제작자에게 메일을 쓰는 창이 열린다.
// 폼을 만들 때는 이름·학교·연락처를 받지 말고 ‘어느 화면에서 무엇이 어려웠는지’만 묻는 것을 권한다(개인정보 최소화).
export const FEEDBACK_URL = "https://docs.google.com/forms/d/e/1FAIpQLSe0mS3y_UoF-jexl56Bi8WQYn3XUjNls0kdbsXuJsaB7HuuAQ/viewform";
export const FEEDBACK_MAIL = "nagusdl87@gmail.com";
export const feedbackHref = (path: string) =>
  FEEDBACK_URL ||
  `mailto:${FEEDBACK_MAIL}?subject=${encodeURIComponent("[마이로드 경남 의견] " + path)}&body=${encodeURIComponent("어느 화면에서 무엇이 어려웠나요?\n(이름·학교·연락처는 쓰지 않아도 돼요)\n\n")}`;
