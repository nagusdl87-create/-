// 영어 사전: subjects 영역(과목 백과 /subjects, 내신 산출 방법·192학점 기준표·고교학점제 안내 컴포넌트).
// 키는 화면의 한국어 문구 그대로, 값은 영어. 과목·교과·계열 이름은 src/i18n/data/subjects.en.ts.
export const SUBJECTS_UI: Record<string, string> = {
  // ── /subjects 페이지
  "탐색 백과": "Explore",
  "과목 백과": "Subject Guide",
  "2022 개정 교육과정 고등학교 보통교과 {n}과목의 내용, 학점, 평가 방식, 선수과목, 2028 수능 출제 여부와 관련 학과·직업을 한곳에서 확인하세요.":
    "See all {n} general high school subjects of the 2022 revised curriculum in one place: content, credits, grading, prerequisites, whether they are on the 2028 CSAT, and related majors and jobs.",
  "과목 찾기": "Find subjects",
  "과목 위계도": "Subject sequence",
  "내신 산출 방법": "How school grades work",
  "192학점 기준표": "192-credit standards",
  "고교학점제 안내": "About the credit system",
  "과목 이름·내용 검색 (예: 미적분, 인공지능, 기후)": "Search subject names and content (e.g., calculus, AI, climate)",
  "과목 검색": "Search subjects",
  "모든 유형": "All types",
  "검색 결과가 없어요.": "No results found.",
  "실시간 5등급 내신 시뮬레이터": "Live 5-level school grade simulator",
  "2028 수능": "2028 CSAT",
  "수능": "CSAT",
  "기본 {n}학점": "{n} credits (standard)",
  "선수: {list}": "Prerequisite: {list}",
  "왼쪽에서 오른쪽으로 갈수록 심화돼요. 과목을 누르면 선수과목과 이어지는 과목을 볼 수 있어요.":
    "Subjects get more advanced from left to right. Tap a subject to see its prerequisites and the subjects that follow it.",
  "{n}단계": "Step {n}",
  "{name} 상세": "{name} details",
  "닫기": "Close",
  "기본 학점": "Standard credits",
  "{n}학점": "{n} credits",
  "평가": "Grading",
  "먼저 배우면 좋은 과목": "Good to take first",
  "이어서 배우는 과목": "Subjects that follow",
  "추천 계열": "Recommended fields",
  "이 과목이 중요한 학과": "Majors where this subject matters",
  "관련 직업": "Related jobs",

  // ── 내신 시뮬레이터(Naesin.tsx)
  "공통과목": "Common subjects",
  "일반·진로선택 (융합선택 국·수·영 등 포함)": "General & career electives (incl. Korean/Math/English convergence electives, etc.)",
  "사회·과학 융합선택 9과목": "9 social studies & science convergence electives",
  "체육·예술·과학탐구실험": "PE, arts, Scientific Inquiry and Experiments",
  "교양": "Liberal arts",
  "P (이수)": "P (Pass)",
  "과목 유형": "Subject type",
  "수강자 수": "Number of students",
  "{n}명": "{n} students",
  "석차": "Rank",
  "동석차 인원": "Students tied at this rank",
  "원점수": "Raw score",
  "과목 평균": "Subject average",
  "석차백분율 = (석차 + (동석차 인원 − 1) ÷ 2) ÷ 수강자 수 × 100. 성취도는 기본 분할점(A 90, B 80, C 70, D 60) 기준이며 학교에 따라 다를 수 있어요.":
    "Rank percentile = (rank + (students tied − 1) ÷ 2) ÷ number of students × 100. Achievement levels use the default cut-offs (A 90, B 80, C 70, D 60) and may differ by school.",
  "석차등급(5등급)": "Rank grade (5 levels)",
  "{g}등급": "Grade {g}",
  "상위 {p}%": "Top {p}%",
  "성취도": "Achievement level",
  "예전 9등급이었다면": "Under the old 9-level system",
  "같은 석차라도 5등급제에서는 등급 구간이 넓어져요(9등급제 {g9}등급 → 5등급제 {g5}등급). 두 제도의 등급 숫자를 그대로 비교할 수는 없고, 대학은 성취도·원점수·과목 이수 내용도 함께 봐요.":
    "With the same rank, each grade band is wider under 5-level grading (9-level grade {g9} → 5-level grade {g5}). You can't compare grade numbers across the two systems directly, and universities also look at achievement levels, raw scores and the subjects you completed.",
  "학교생활기록부 기재 미리보기": "Preview of the school record entry",
  "원점수/과목평균": "Raw score / subject average",
  "성취도(수강자 수)": "Achievement level (number of students)",
  "석차등급": "Rank grade",
  "실제 성적표에는 성취도별 분포 비율도 함께 기재돼요(표준편차는 기재하지 않아요).":
    "The actual report card also shows the share of students at each achievement level (the standard deviation is not shown).",
  "수강자 {n}명일 때 등급 구간 (동석차 없을 때)": "Grade bands for {n} students (no ties)",
  "{a}~{b}등": "Rank {a}–{b}",

  // ── 내신 안내(Naesin.tsx)
  "① 9등급제 vs 5등급제 (수강자 200명 기준)": "① 9-level vs 5-level grading (200 students)",
  "등급": "Grade",
  "9등급제 인원": "Students (9-level)",
  "5등급제 인원": "Students (5-level)",
  "② 성취도 기준": "② Achievement level criteria",
  "A~E 5단계: A 90% 이상 · B 80% 이상 · C 70% 이상 · D 60% 이상 · E 60% 미만":
    "A–E (5 levels): A 90% or higher · B 80% or higher · C 70% or higher · D 60% or higher · E below 60%",
  "A·B·C 3단계(체육·예술·과학탐구실험): A 80% 이상 · B 60% 이상 · C 60% 미만":
    "A·B·C (3 levels; PE, arts, Scientific Inquiry and Experiments): A 80% or higher · B 60% or higher · C below 60%",
  "P(교양): 이수 여부만 기록": "P (liberal arts): only pass/completion is recorded",
  "③ 성적표 기재 변화": "③ Changes to the report card",
  "원점수, 과목 평균, 성취도(수강자 수), 성취도별 분포 비율, 석차등급을 기재해요. 예전 성적표의 표준편차는 기재하지 않아요.":
    "The report card shows the raw score, subject average, achievement level (number of students), share of students at each achievement level, and rank grade. The standard deviation from the old report card is no longer shown.",
  "④ 교과별 성적 제공 방식": "④ How grades are given by subject",
  "구분": "Category",
  "A~E": "A–E",
  "5등급": "5 levels",
  "일반·진로선택, 융합선택(국·수·영·정보 등)": "General & career electives, convergence electives (Korean, Math, English, Informatics, etc.)",
  "사회·과학 융합선택 9과목 (여행지리, 역사로 탐구하는 현대 세계, 사회문제 탐구, 금융과 경제생활, 윤리문제 탐구, 기후변화와 지속가능한 세계, 과학의 역사와 문화, 기후변화와 환경생태, 융합과학 탐구)":
    "9 social studies & science convergence electives (Travel Geography, Exploring the Modern World through History, Social Issues Inquiry, Finance and Economic Life, Ethical Issues Inquiry, Climate Change and a Sustainable World, History and Culture of Science, Climate Change and Ecology, Integrated Science Inquiry)",
  "산출 안 함": "Not calculated",
  "체육·예술, 과학탐구실험": "PE & arts, Scientific Inquiry and Experiments",
  "수강자가 아주 적은 소인수 과목, 공동교육과정·온라인학교 과목은 성적 산출 방식이 다를 수 있으니 학교 안내를 확인하세요.":
    "Grading may work differently for very small classes and for joint curriculum or online school subjects, so check your school's guidance.",

  // ── 192학점 기준표(CreditGuide.tsx)
  "총 이수 학점": "Total credits",
  "192학점": "192 credits",
  "필수 84 + 자율 90 + 창체 18": "Required 84 + elective 90 + creative activities 18",
  "창의적 체험활동": "Creative experiential activities",
  "18학점": "18 credits",
  "288시간": "288 hours",
  "국·수·영 상한": "Korean/Math/English cap",
  "81학점": "81 credits",
  "교과 174 × 50% − 한국사 6": "Subjects 174 × 50% − Korean History 6",
  "1학점 수업량": "Class time per credit",
  "50분 × 16회": "50 min × 16 sessions",
  "학기 단위 이수": "Completed by semester",
  "카드형 (모바일 추천)": "Cards (best on mobile)",
  "표 전체 보기": "Full table",
  "국어": "Korean",
  "수학": "Mathematics",
  "영어": "English",
  "사회(한국사 6 포함)": "Social Studies (incl. Korean History 6)",
  "과학": "Science",
  "체육": "Physical Education",
  "예술": "Arts",
  "기술·가정/정보/제2외국어/한문/교양": "Tech & Home Ec. / Informatics / Second Foreign Language / Classical Chinese / Liberal Arts",
  "필수 이수": "Required",
  "교과(군)": "Subject (group)",
  "필수 이수 학점": "Required credits",
  "비고": "Notes",
  "과학탐구실험 2학점 포함": "Incl. 2 credits of Scientific Inquiry and Experiments",
  "매 학기 편성": "Offered every semester",
  "통합사회 8 + 한국사 6": "Integrated Social Studies 8 + Korean History 6",
  "필수 이수 합계": "Total required",
  "나머지 자율 이수 90학점은 진로·적성에 따라 선택": "The other 90 elective credits are chosen based on your career goals and aptitude",
  "알아 두면 좋은 규칙": "Good rules to know",
  "공통과목을 제외한 선택과목은 기본 학점(4학점)에서 ±1학점 범위로 학교가 증감해 편성할 수 있어요.":
    "For electives (not common subjects), schools can raise or lower the standard 4 credits by ±1 credit.",
  "국어·수학·영어 합계는 81학점을 넘을 수 없어요(교과 174학점의 50%에서 한국사 6학점을 뺀 값).":
    "Korean, Math and English together can't go over 81 credits (50% of the 174 subject credits minus 6 credits of Korean History).",
  "체육은 매 학기 편성하는 것이 원칙이에요.": "As a rule, PE is offered every semester.",
  "과목 출석률 3분의 2 이상, 학업성취율 40% 이상이면 이수로 인정돼요. 미치지 못하면 보충 지도(최소 성취수준 보장지도)를 받아요.":
    "You complete a subject if you attend at least two-thirds of classes and reach an achievement rate of 40% or higher. If not, you get extra support (minimum achievement guarantee).",

  // ── 고교학점제 안내(CreditGuide.tsx)
  "1. 고교학점제란?": "1. What is the high school credit system?",
  "학생이 기초 소양과 기본 학력을 바탕으로 진로·적성에 따라 과목을 선택·이수하고, 이수 기준에 도달한 과목에 학점을 받아 누적 학점이 졸업 기준(192학점)에 이르면 졸업하는 제도예요. 2025학년도 고1부터 전면 적용돼요.":
    "It's a system where students build on basic skills and knowledge, choose and take subjects that fit their career goals and aptitude, earn credits for subjects where they meet the completion standard, and graduate once their total credits reach the graduation standard (192 credits). It applies fully to students entering 1st year of high school from the 2025 school year.",
  "2. 도입 배경과 기대 효과": "2. Why it was introduced and what it aims for",
  "모든 학생이 같은 과목을 듣던 방식에서 벗어나, 학생의 진로와 흥미에 맞는 배움을 보장하기 위해 도입됐어요. 학생 주도성, 수업 참여, 진로에 맞는 깊이 있는 학습을 기대해요.":
    "It was introduced to move away from everyone taking the same subjects and to make sure students can learn what fits their career goals and interests. It aims for student ownership, class participation and in-depth learning that fits each student's path.",
  "3. 운영 절차 (7단계)": "3. How it works (7 steps)",
  "① 진로·학업 설계 지도 → ② 과목 수요 조사 → ③ 개설 과목 확정 → ④ 수강 신청 → ⑤ 시간표 편성 → ⑥ 수업과 평가 → ⑦ 이수·미이수 판정과 보충 지도":
    "① Career and study planning guidance → ② Subject demand survey → ③ Final list of subjects offered → ④ Course registration → ⑤ Timetabling → ⑥ Classes and assessment → ⑦ Completion decision and extra support",
  "4. 192학점과 졸업": "4. 192 credits and graduation",
  "교과 174학점과 창의적 체험활동 18학점(288시간)을 합쳐 192학점을 이수하면 졸업해요. 교과는 필수 이수 84학점과 자율 이수 90학점으로 나뉘어요.":
    "You graduate after completing 192 credits: 174 subject credits plus 18 credits (288 hours) of creative experiential activities. Subject credits are split into 84 required credits and 90 elective credits.",
  "5. 평가": "5. Assessment",
  "공통·선택과목은 성취도(A~E)와 5등급 석차등급을 함께 기록해요. 사회·과학 융합선택 9과목은 성취도만, 체육·예술·과학탐구실험은 A·B·C, 교양은 P로 기록해요.":
    "Common subjects and electives record both an achievement level (A–E) and a 5-level rank grade. The 9 social studies & science convergence electives record only an achievement level, PE, arts and Scientific Inquiry and Experiments use A·B·C, and liberal arts subjects use P.",
  "6. 학교에 없는 과목 듣기": "6. Taking subjects your school doesn't offer",
  "다니는 학교에 개설되지 않은 과목은 여러 학교가 함께 여는 공동교육과정이나 교육청 온라인학교 등에서 들을 수 있는 경우가 있어요. 개설 여부와 신청 방법은 학교 교육과정 담당 선생님께 확인하세요.":
    "Subjects your school doesn't offer may be available through a joint curriculum run by several schools or through the Office of Education's online school. Ask the teacher in charge of your school's curriculum whether a subject is offered and how to apply.",
  "기존 vs 고교학점제": "Before vs the high school credit system",
  "기존": "Before",
  "고교학점제": "High school credit system",
  "과목 선택": "Choosing subjects",
  "학교가 정한 과목 중심": "Mostly subjects set by the school",
  "학생이 진로에 맞게 선택": "Students choose based on their career path",
  "졸업 기준": "Graduation standard",
  "출석 일수": "Days of attendance",
  "출석 + 과목 이수(192학점)": "Attendance + subject completion (192 credits)",
  "9등급 상대평가": "9-level relative grading",
  "성취도 + 5등급": "Achievement level + 5-level grade",
  "학업 지원": "Learning support",
  "최소 성취수준 보장지도": "Minimum achievement guarantee support",
  "7. 자주 묻는 질문": "7. Frequently asked questions",
  "과목을 잘못 고르면 대학 입시에 불리한가요?": "Will choosing the wrong subjects hurt my university admission?",
  "대학은 지원 학과와 관련된 과목을 이수했는지 살펴봐요. 다만 한 과목으로 결정되지는 않으니, 관심 학과의 권장과목을 확인하고 선생님과 상의해 균형 있게 고르세요.":
    "Universities check whether you took subjects related to the major you apply for. But no single subject decides it, so check the recommended subjects for majors you're interested in, talk with your teacher, and choose a balanced mix.",
  "수강 신청 후에 과목을 바꿀 수 있나요?": "Can I change subjects after registering?",
  "학교마다 정정 기간을 두는 경우가 많아요. 시간표 편성 이후에는 바꾸기 어려우니 학교 안내 일정을 꼭 확인하세요.":
    "Many schools have a change period. It's hard to change after the timetable is set, so be sure to check your school's schedule.",
  "미이수가 되면 어떻게 되나요?": "What happens if I don't complete a subject?",
  "출석률이나 학업성취율 기준에 미치지 못하면 보충 지도를 받고, 이를 마치면 이수로 인정받을 수 있어요.":
    "If you don't meet the attendance or achievement standard, you get extra support, and once you finish it, the subject can count as completed.",
  "어려운 과목을 피하면 내신에 유리한가요?": "Is it better for my school grades to avoid hard subjects?",
  "단기적으로는 그렇게 보일 수 있지만, 희망 진로에 필요한 과목을 듣지 않으면 대학 공부와 진로 준비에 어려움이 생길 수 있어요.":
    "It may look that way in the short term, but if you skip subjects your career path needs, you may struggle with university studies and career preparation.",
  "특성화고·마이스터고도 고교학점제를 하나요?": "Do specialized vocational and meister high schools use the credit system too?",
  "네. 직업계고도 고교학점제가 적용되며, 전문교과와 현장실습 등 학교 특성에 맞게 운영돼요.":
    "Yes. Vocational high schools also use the high school credit system, run to fit each school, with specialized subjects, field training and more.",
  "더 자세한 내용은": "For more details, see the",
  "고교학점제 누리집": "High School Credit System website",
  "과 경상남도교육청 안내를 확인하세요.": " and guidance from the Gyeongsangnam-do Office of Education.",
};
