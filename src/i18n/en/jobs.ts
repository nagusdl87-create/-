// 영어 사전: jobs 영역. 키는 화면의 한국어 문구 그대로, 값은 영어.
// 직업 찾기(/jobs)·직업 상세(/jobs/[id])·JobCard·Deep.tsx(직업·학과 상세 제목)·Videos 문구.
export const JOBS: Record<string, string> = {
  // 흥미 유형(RIASEC)·가치관 이름
  "현실형": "Realistic",
  "탐구형": "Investigative",
  "예술형": "Artistic",
  "사회형": "Social",
  "진취형": "Enterprising",
  "관습형": "Conventional",
  "안정": "Stability",
  "성취": "Achievement",
  "봉사": "Service",
  "창의": "Creativity",
  "자율": "Autonomy",
  "경제적 보상": "Financial reward",
  "지식 탐구": "Knowledge",
  "영향력": "Influence",

  // 직업 찾기 목록
  "탐색 백과": "Explore",
  "직업 찾기": "Find Jobs",
  "흥미 탐색 결과와 가치관을 바탕으로 잘 맞는 순서대로 보여 드려요. 마음에 드는 직업을 ❤️ 찜해 두면 다음 단계에서 길을 이어 드려요.":
    "Jobs are listed from best to least match, based on your interest test results and values. Save jobs you like with ❤️ and we'll map out the path to them in the next step.",
  "관심 있는 직업을 둘러보고 ❤️ 찜해 보세요. 1단계 흥미 탐색을 하면 나와 맞는 정도도 알려 드려요.":
    "Browse jobs you're interested in and save them with ❤️. Take the Step 1 interest test and we'll also show how well each job matches you.",
  "직업, 학과, 과목으로 검색 (예: 로봇, 간호학과, 정보)": "Search by job, major or subject (e.g., robot, nursing, information)",
  "직업 검색": "Search jobs",
  "전체": "All",
  "찜": "Saved",
  "모든 유형": "All types",
  "정렬": "Sort",
  "잘 맞는 순": "Best match",
  "가나다 순": "A–Z",
  "{n}개 직업": "{n} jobs",
  "직업 열람 진행률 {n} / {total} ({pct}%)": "Jobs viewed {n} / {total} ({pct}%)",
  "조건에 맞는 직업이 없어요. 필터를 바꿔 보세요.": "No jobs match. Try changing the filters.",
  "길 잇기": "Connect the Path",
  "찜한 직업까지 가는 길(학과·고교 과목)을 확인해 보세요": "See the path (majors and high school subjects) to the jobs you saved",

  // 직업 카드
  "찜 해제": "Remove from saved",
  "찜하기": "Save",
  "나와 {score}% 잘 맞아요": "{score}% match with you",

  // 직업 상세
  "직업 목록": "Job list",
  "나와 {score}% 잘 맞아요.": "{score}% match with you.",
  "이 직업은 {types} 흥미와, {values} 가치를 중요하게 여기는 사람에게 잘 맞아요.":
    "This job suits people with {types} interests who value {values}.",
  "흥미 탐색을 하면 이 직업이 나와 얼마나 잘 맞는지 알려 드려요 →": "Take the interest test to see how well this job matches you →",
  "직업인 영상": "Videos from people in the job",
  "이런 사람에게 잘 맞아요": "Good fit for people with",
  "되는 방법": "How to get there",
  "일하는 곳": "Where they work",
  "관련 자격": "Related qualifications",
  "꼭 필요한 자격증보다 실력과 경험(작품·경력)이 중요한 직업이에요.":
    "In this job, skills and experience (your work and career) matter more than any required certificate.",
  "응시 자격·시험 일정은 큐넷에서 확인": "Check exam eligibility and dates on Q-Net",
  "앞으로의 전망": "Future outlook",
  "경남에서는?": "In Gyeongnam",
  "관련 학과 (학과 백과)": "Related majors (Major Guide)",
  "이 직업까지 가는 길": "Your path to this job",
  // PathFlow 열 제목(컴포넌트에서 t()로 감싸면 바로 쓰임 — PathFlow는 /path와 함께 쓰여 이 작업 범위 밖)
  "중학교 지금": "Middle school now",
  "고교 선택과목": "High school electives",
  "대학 학과": "University major",
  "꿈": "Dream",
  "고려해 볼 만한 고등학교 유형": "High school types to consider",
  "어느 고등학교에서든 이 직업을 준비할 수 있어요. 학교 유형별 특징을 비교해 보세요.":
    "You can prepare for this job at any high school. Compare the features of each school type.",
  "비슷한 직업": "Similar jobs",
  "더 자세한 직업 정보(전망, 임금, 직업인 인터뷰)는 {link}에서 확인할 수 있어요.":
    "You can find more detailed job information (outlook, pay, interviews with workers) on {link}.",
  "커리어넷": "CareerNet",

  // 고등학교 유형 이름
  "일반고": "General high school",
  "자율형 고교": "Autonomous high school",
  "과학고": "Science high school",
  "외국어고·국제고": "Foreign language & international high school",
  "예술고·체육고": "Arts & sports high school",
  "특성화고": "Specialized vocational high school",
  "마이스터고": "Meister high school",
  "영재학교": "School for the gifted",

  // 경남 전략산업 이름·지역
  "조선·해양": "Shipbuilding & Marine",
  "항공·우주": "Aerospace",
  "기계·방산·원전": "Machinery, Defense & Nuclear",
  "나노융합": "Nano-convergence",
  "자동차·모빌리티": "Automotive & Mobility",
  "항노화·바이오헬스": "Anti-aging & Bio-health",
  "수산·해양관광": "Fisheries & Marine Tourism",
  "항만·물류": "Ports & Logistics",
  "승강기": "Elevators",
  "거제": "Geoje",
  "통영": "Tongyeong",
  "창원": "Changwon",
  "사천": "Sacheon",
  "진주": "Jinju",
  "밀양": "Miryang",
  "김해": "Gimhae",
  "양산": "Yangsan",
  "산청": "Sancheong",
  "함양": "Hamyang",
  "남해": "Namhae",
  "고성": "Goseong",
  "거창": "Geochang",

  // 직업·학과 상세 섹션(Deep.tsx)
  "자주 묻는 질문": "Frequently asked questions",
  "이런 일을 해요": "What they do",
  "하루는 이렇게 흘러가요": "A typical day",
  "(예시)": "(example)",
  "필요한 지식과 능력": "Knowledge and skills needed",
  "중학생인 지금 해 볼 수 있는 일": "Things to try now in middle school",
  "내 계획에 넣기": "Add to my plan",
  "고등학생이 되면 해 볼 활동": "Activities to try in high school",
  "일하는 환경": "Work environment",
  "학력·진로 경로": "Education and career path",
  "경력이 쌓이면": "As you gain experience",
  "기술이 바뀌면 이 일은?": "How will changing technology affect this job?",
  "이런 질문을 탐구해요": "Questions this major explores",
  "세부 전공 분야": "Specialized tracks",
  "학년별로 이렇게 배워요": "What you learn each year",
  "대학마다 교육과정이 달라요. 지원할 대학의 교육과정표를 확인하세요.":
    "Each university's curriculum is different. Check the curriculum of the universities you plan to apply to.",
  "이 학과에서 길러지는 능력": "Skills you build in this major",
  "헷갈리기 쉬운 학과와 차이": "How it differs from similar majors",
  "고등학교에서 해 볼 탐구 주제": "Research topics to try in high school",
  "졸업하면": "After graduation",

  // 영상
  "영상 재생: {title} - {channel}": "Play video: {title} - {channel}",
  "공식 채널에서 ‘{query}’ 관련 직업인 인터뷰·현장 영상을 찾아볼 수 있어요.":
    "You can find interviews and on-site videos about ‘{query}’ on official channels.",
  "{label}에서 찾기": "Search on {label}",
  "한국고용정보원 직업진로동영상": "KEIS Job & Career Videos",
  "한국고용정보원(고용24)": "KEIS (Work24)",
  "커리어넷 직업·학과 영상": "CareerNet job & major videos",
  "영상 {n}": "Video {n}",
};
