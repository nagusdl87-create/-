// 다문화 학생·보호자용 페이지별 영어 안내 (헤더 「EN」 버튼에서 열림)
// 모든 화면을 번역하지 않고, 페이지마다 "무엇을 하는 곳인지 · 어떻게 쓰는지 · 핵심 낱말"만 쉬운 영어(CEFR B1)로 안내한다.
// 새 페이지(src/app/**/page.tsx)를 만들면 여기에 항목을 추가해야 `npm run validate`를 통과한다.
// 날짜·숫자·연락처는 넣지 않는다(바뀔 수 있고, 공식 출처에서 확인해야 함).
// 이 파일은 scripts/validate-data.ts에서도 읽으므로 "@/" 경로 import를 쓰지 않는다.

export type EnglishGuide = {
  /** 영어 페이지 이름 */
  title: string;
  /** 무엇을 하는 페이지인지 (1~2문장) */
  what: string;
  /** 쓰는 방법 (2~4단계) */
  how: string[];
  /** 상세 페이지의 각 부분 설명 [한국어 제목, 영어 설명] */
  sections?: [string, string][];
  /** 핵심 낱말 [한국어, 영어 뜻] */
  terms?: [string, string][];
};

// 여러 페이지에서 쓰는 낱말
const T = {
  credit: ["학점", "credit (a unit of study; high school students take 192 credits in 3 years)"],
  credit192: ["192학점", "the total credits needed to graduate from high school under the credit system"],
  hscs: ["고교학점제", "high school credit system (students choose many of their own subjects)"],
  naesin: ["내신", "school grades (your marks from high school classes)"],
  suneung: ["수능", "CSAT (national university entrance exam)"],
  jeongi: ["전기 / 후기", "early / late admission round (for high school entrance)"],
  equal: ["평준화", "equalization area (schools are assigned by the office of education)"],
  voc: ["특성화고", "specialized vocational high school"],
  meister: ["마이스터고", "meister high school (trains skilled technicians for one industry)"],
  general: ["일반고", "general high school"],
  major: ["학과 / 전공", "university department / major"],
  job: ["직업", "job / career"],
  wish: ["찜하기", "save to your list (the heart button)"],
  report: ["리포트", "report (a summary of your records)"],
  backup: ["백업 파일", "backup file (a copy of your records you can save and load later)"],
  share: ["공유 링크", "share link (a link that shows your report to someone else)"],
  elective: ["선택과목", "elective subject"],
  core: ["핵심 과목 / 권장 과목", "core subjects / recommended subjects"],
  hsAdmission: ["고입", "high school admission"],
  uniAdmission: ["대입", "university admission"],
  susi: ["수시 / 정시", "early admission (school records, essays, interviews) / regular admission (mainly CSAT scores)"],
  grade5: ["5등급제", "5-level grading system for school grades (from 2025 first-year students)"],
  semester: ["학기", "semester (school term)"],
  career: ["진로", "career path / future plans"],
  homeroom: ["담임 선생님", "homeroom teacher"],
} satisfies Record<string, [string, string]>;

export const ENGLISH_GUIDE: Record<string, EnglishGuide> = {
  "/": {
    title: "Home",
    what: "MyRoad Gyeongnam is a free career and study planning site for middle and high school students in Gyeongsangnam-do. The home page shows the 5 planning steps and your progress.",
    how: [
      "Choose 중학생이에요 (I am a middle school student) or 고등학생이에요 (I am a high school student).",
      "Follow the steps in order: know yourself, find jobs or majors, connect the path, choose a high school or plan subjects, then plan and record.",
      "You do not need to log in. Your records stay only on this device.",
    ],
    terms: [["중학생 / 고등학생", "middle school student / high school student"], T.career, T.report, T.backup],
  },
  "/discover": {
    title: "Know Yourself (interest test)",
    what: "A short interest test, plus questions about your values and strengths. The results suggest jobs that may suit you.",
    how: [
      "Answer each question honestly. There are no right or wrong answers.",
      "Choose the 3 things that matter most to you at work, then choose up to 5 strengths.",
      "Look at your interest code and the suggested jobs. You can take the test again each semester.",
    ],
    terms: [["흥미 유형 / 흥미 코드", "interest type / interest code"], ["가치관", "values (what is important to you)"], ["강점", "strengths"], T.wish],
  },
  "/jobs": {
    title: "Find Jobs (job encyclopedia)",
    what: "A list of jobs, including jobs in Gyeongnam's main industries. You can sort jobs by how well they match your test results.",
    how: [
      "Search by name, or look through the list.",
      "Open a job to read what it does and how to prepare.",
      "Press the heart to save jobs you like. Saved jobs are used in the next steps.",
    ],
    terms: [T.job, T.wish, ["계열", "field / area of study"], ["추천순 / 이름순", "sort by match / sort by name"]],
  },
  "/jobs/[id]": {
    title: "Job Details",
    what: "Detailed information about one job: what the work is like and how to prepare for it, from middle school to after graduation.",
    how: [
      "Read the sections from top to bottom. The table below explains each section.",
      "Press the heart to save this job, or add it to your plan.",
      "Check related majors and similar jobs at the bottom of the page.",
    ],
    sections: [
      ["이런 일을 해요", "What this job does: the main tasks."],
      ["하루는 이렇게 흘러가요", "A typical day: what a working day can look like (an example)."],
      ["필요한 지식과 능력", "Skills and knowledge that help in this job."],
      ["일하는 환경 / 일하는 곳", "Work environment: where and how people in this job work."],
      ["학력·진로 경로 / 이 직업까지 가는 길", "Education path: the usual way to get this job (school, major, training)."],
      ["관련 자격·면허", "Related licenses or certificates. Check exam details on the official site (Q-Net)."],
      ["경력이 쌓이면", "Career growth: what you can do with more experience."],
      ["기술이 바뀌면 이 일은?", "How new technology may change this job."],
      ["중학생인 지금 해 볼 수 있는 일 / 고등학교에서 해 볼 활동", "Things you can try now in middle school, and activities for high school."],
      ["고등학교에서 들으면 좋은 과목", "Related high school subjects that help."],
      ["자주 묻는 질문", "FAQ: common questions about this job."],
      ["관련 학과 / 비슷한 직업", "Related university majors and similar jobs."],
    ],
    terms: [T.job, T.major, T.wish, ["자격증", "license / certificate"]],
  },
  "/majors": {
    title: "Majors (university major encyclopedia)",
    what: "Information about university majors: what you study, which high school subjects help, and what jobs graduates do. You can also search majors and universities across Korea.",
    how: [
      "Search for a major, or look through the list.",
      "Open a major to see details.",
      "Press the heart to save majors you like.",
    ],
    terms: [T.major, T.wish, ["계열", "field / area of study"], ["개설 대학", "universities that offer the major"]],
  },
  "/majors/[id]": {
    title: "Major Details",
    what: "Detailed information about one university major: what you study each year, which high school subjects help, and where you can study it.",
    how: [
      "Read the sections from top to bottom. The table below explains each section.",
      "Press the heart to save this major.",
      "Check the official links (Adiga, CareerNet, Academyinfo) for each university's own rules.",
    ],
    sections: [
      ["이런 질문을 탐구해요", "Questions this major tries to answer."],
      ["세부 전공 분야", "Sub-fields: smaller areas inside the major."],
      ["학년별로 이렇게 배워요", "Year-by-year study: what you learn in each year of university."],
      ["대학에서 배우는 과목", "Courses that many universities teach in this major. Each university is different."],
      ["이 학과에서 길러지는 능력", "Skills you build in this major."],
      ["헷갈리기 쉬운 학과와 차이", "How this major differs from similar majors."],
      ["졸업 후 진로 / 졸업하면", "Jobs and paths after graduation."],
      ["고등학교에서 들으면 좋은 과목 (핵심 과목 · 권장 과목)", "Related high school subjects: core and recommended subjects."],
      ["고등학교에서 해 볼 탐구 주제", "Research topics you can try in high school."],
      ["자주 묻는 질문", "FAQ: common questions about this major."],
      ["전국 개설 대학 (경남 먼저)", "Universities that offer this major, with Gyeongnam universities shown first."],
    ],
    terms: [T.major, T.core, ["권장과목 원문", "the university's official list of recommended subjects"], T.suneung],
  },
  "/subjects": {
    title: "Subjects (high school subject encyclopedia)",
    what: "All general high school subjects in the 2022 revised national curriculum: content, credits, how they are graded, which subjects to take first, and related majors and jobs.",
    how: [
      "Search for a subject, or look through the list.",
      "Open a subject to see what to learn before it and what comes after it.",
      "Check if the subject is on the CSAT and which majors find it important.",
    ],
    terms: [T.credit, T.elective, ["공통과목 / 일반선택 / 진로선택 / 융합선택", "common / general elective / career elective / convergence elective subjects"], ["선수과목", "subject to take first (prerequisite)"], T.suneung, T.naesin],
  },
  "/schools": {
    title: "Find High Schools in Gyeongnam",
    what: "A map and list of high schools in Gyeongsangnam-do. You can sort schools by distance from your middle school or your location.",
    how: [
      "Choose a starting point: your middle school or your current location.",
      "Filter by city, school type, and boys / girls / co-ed.",
      "Open a school to see details, and save schools to compare them.",
    ],
    terms: [T.general, T.voc, T.meister, ["남녀공학 / 남고 / 여고", "co-ed / boys' school / girls' school"], ["출발점", "starting point"], T.jeongi],
  },
  "/highschool": {
    title: "Choose a High School (types and admission)",
    what: "Compare high school types, take a quiz to find a type that may suit you, and learn about the high school admission system and schedule in Gyeongnam.",
    how: [
      "Take the quiz to see which school types may fit you.",
      "Read about each type and the early and late admission rounds.",
      "Find real schools on the map, and ask your homeroom teacher about applying.",
    ],
    terms: [T.hsAdmission, T.jeongi, T.equal, T.general, T.voc, T.meister, ["자율형 공립고", "autonomous public high school"], ["특수목적고 (과학고·외고·예고·체고)", "special-purpose high school (science, foreign language, arts, sports)"]],
  },
  "/admission": {
    title: "University Admission 2028",
    what: "The key points of the 2028 university admission system, which applies to students who started high school in 2025: the CSAT, the 5-level school grades, and types of admission.",
    how: [
      "Read the overview of admission types.",
      "Use the school grade calculator to calculate your average.",
      "Check each university's recommended subjects on the official sites.",
    ],
    terms: [T.uniAdmission, T.suneung, T.naesin, T.grade5, T.susi, ["학생부종합 / 학생부교과", "admission based on all school records / based mainly on school grades"]],
  },
  "/industry": {
    title: "Gyeongnam Industry Career Map",
    what: "Gyeongnam's local industries (for example shipbuilding and aerospace) connected to related jobs, university majors and high schools.",
    how: [
      "Choose an industry.",
      "See related jobs, majors and Gyeongnam high schools.",
      "Check school departments and admission on the school's website and the admission portal.",
    ],
    terms: [["산업", "industry"], ["조선", "shipbuilding"], ["항공우주", "aerospace"], ["기계·방산", "machinery and defense"]],
  },
  "/credits": {
    title: "192-Credit Course Planner",
    what: "High school students plan which subjects to take over 3 years. The planner checks your plan against the 192-credit graduation rules.",
    how: [
      "Choose your interest field or saved majors to fill in a draft plan.",
      "Add or remove subjects for each semester.",
      "Read the check results and fix any missing credits. Other tabs explain the rules and the credit system.",
    ],
    terms: [T.credit192, T.credit, T.hscs, T.elective, T.semester, ["편제표", "school curriculum table (the subjects your school offers each semester)"], ["이수 기준", "graduation requirements"]],
  },
  "/credits/school": {
    title: "Register Your School's Curriculum Table",
    what: "Enter your school's fixed subjects and elective groups for each semester. Then the 192-credit planner works like real course registration at your school.",
    how: [
      "Enter the subjects for each semester, including groups where you choose some subjects (택N = choose N).",
      "Save it. One person can enter it and share it by link or file with friends or students.",
      "Go back to the planner to choose your subjects.",
    ],
    terms: [["편제표", "school curriculum table"], ["선택군 (택N)", "elective group (choose N subjects)"], ["지정 과목", "fixed (required) subjects"], T.share],
  },
  "/path": {
    title: "Connect the Path",
    what: "Starting from your saved jobs or majors, see the road backwards: university major, high school subjects, and what you can do now.",
    how: [
      "Save some jobs or majors first.",
      "Choose your main dream, and see the subjects that help.",
      "Write one sentence about your career idea. You can change it any time.",
    ],
    terms: [["대표 꿈", "main dream / main goal"], ["Plan B", "backup path"], ["진로 가설", "career idea for now (it can change)"], T.core],
  },
  "/plan": {
    title: "Plan and Record",
    what: "Set small tasks and study goals for each semester, and record your career activities.",
    how: [
      "Add tasks for this semester.",
      "Write study goals for each subject: how you will study, not just a score.",
      "Record activities: the name, date, what you did, and what you learned.",
    ],
    terms: [T.semester, ["할 일", "to-do / task"], ["진로 활동 기록", "career activity record"], ["성적", "grades / scores"]],
  },
  "/portfolio": {
    title: "Career Portfolio",
    what: "Write a career activity portfolio, a 3-year study plan, and a reading portfolio. You can print them or save them as PDF.",
    how: [
      "Choose a form.",
      "Fill in each part. It saves on this device.",
      "Print or save as PDF to hand in.",
    ],
    terms: [["포트폴리오", "portfolio (a collection of your work and reflections)"], ["학업설계서", "study plan document"], ["독서", "reading"], ["성찰", "reflection"]],
  },
  "/tests": {
    title: "Career Tests and Counseling",
    what: "A guide to free official career tests (CareerNet and Work24) and places where you can get one-to-one career counseling.",
    how: [
      "Choose a test and open the official site.",
      "Take the test there, then enter your result here if you want.",
      "Use the counseling links if you want to talk to a counselor.",
    ],
    terms: [["진로심리검사", "career test"], ["진로상담", "career counseling"], ["커리어넷", "CareerNet (national career information site)"], ["고용24", "Work24 (national employment site)"]],
  },
  "/resources": {
    title: "Career Experience and Resources",
    what: "Official websites grouped by purpose: career experience programs, school information, and university admission information.",
    how: [
      "Find the purpose you need.",
      "Open the official site. Information there is from the official source.",
      "After an experience program, record it in Plan and Record.",
    ],
    terms: [["진로체험", "career experience program (visit a workplace or try a job)"], ["꿈길", "Ggumgil (national career experience booking site)"], ["진로체험지원센터", "career experience support center"]],
  },
  "/guide": {
    title: "Career and Study Planning Guidebook",
    what: "A 5-chapter guide for students, parents and teachers: why career and study planning matters, a step-by-step plan, growth by grade, choosing subjects, and re-planning when your career idea changes.",
    how: [
      "Choose a chapter.",
      "Read the key points and the actions for students, teachers and parents.",
    ],
    terms: [["보호자", "parent / guardian"], ["창의적 체험활동", "creative experiential activities (school activities outside regular classes)"], ["학교생활기록부", "school record"]],
  },
  "/explore": {
    title: "Explore (encyclopedia menu)",
    what: "A menu of all information pages: jobs, majors, subjects, Gyeongnam high schools, university admission and local industries.",
    how: ["Choose a topic to open it."],
    terms: [T.job, T.major, ["과목", "subject"]],
  },
  "/tools": {
    title: "Tools (menu)",
    what: "A menu of tools you can use yourself: course planning, grade calculator, portfolio, career tests and more.",
    how: ["Choose a tool to open it."],
    terms: [T.credit192, ["내신 계산기", "school grade calculator"]],
  },
  "/future": {
    title: "Future Industries",
    what: "Learn about new industries such as AI, robots, mobility, bio-health, green energy, semiconductors, aerospace and smart farms with a quiz and a short survey.",
    how: [
      "Take the quiz.",
      "Answer the survey (1 = not at all like me, 5 = very much like me).",
      "See subjects, majors and jobs for the industry you like, and add them to your course plan.",
    ],
    terms: [["신산업", "new (emerging) industry"], ["친화도", "how well it fits you"], ["로드맵", "roadmap"]],
  },
  "/transition": {
    title: "Grade 12 Transition Lessons",
    what: "10 lessons for the time between the CSAT and graduation, to prepare for university life or work. Students can read alone; teachers can print them for class.",
    how: [
      "Choose a lesson.",
      "Read the goals and key points, then do the activity and the checklist.",
      "Laws and amounts (for example the minimum wage) can change. Check official websites.",
    ],
    terms: [["고3", "grade 12 (third year of high school)"], T.suneung, ["체크리스트", "checklist"]],
  },
  "/report": {
    title: "My Report",
    what: "A one-page summary of all your records: interests, values, strengths, saved jobs and majors, and plans. You can print it or share it.",
    how: [
      "Check the summary.",
      "Print it, save it as PDF, or make a share link to show your teacher or family.",
      "Save a backup file to continue on another device.",
    ],
    terms: [T.report, T.share, T.backup, ["읽기 전용", "read-only (you can look but not change)"]],
  },
  "/report/summary": {
    title: "One-Page Summary (for counseling)",
    what: "A one-page A4 summary of the student's records, made for parent–teacher counseling.",
    how: [
      "Check the summary on screen.",
      "Print it on A4 paper or save it as PDF.",
      "Bring it to a counseling meeting with the homeroom teacher.",
    ],
    terms: [["상담", "counseling / meeting"], T.homeroom, ["보호자", "parent / guardian"]],
  },
  "/teacher": {
    title: "Teacher View",
    what: "For teachers: collect students' share links or backup files and see them together as a class overview. Everything stays only on the teacher's device.",
    how: [
      "Ask students to send their share link or backup file.",
      "Add the links or files here.",
      "See the class overview. Nothing is sent to a server.",
    ],
    terms: [T.share, T.backup, ["학급", "class"]],
  },
  "/search": {
    title: "Search",
    what: "Search jobs, majors, subjects and schools in one place.",
    how: ["Type a word (Korean works best).", "Choose a result to open it."],
    terms: [["검색", "search"], ["결과가 없어요", "no results"]],
  },
  "/account": {
    title: "Save and Continue (backup)",
    what: "Download your records as a backup file, and upload it later (or on another device) to continue. You can use every feature without logging in.",
    how: [
      "Press the download button to save a backup file.",
      "On another device, upload the file to continue.",
      "Login is optional. Without login, nothing is sent to a server.",
    ],
    terms: [T.backup, ["내려받기 / 올리기", "download / upload"], ["로그인 / 동기화", "log in / sync"]],
  },
  "/privacy": {
    title: "Privacy Policy",
    what: "How this site handles personal information. If you do not log in, the site does not collect your personal information.",
    how: ["Read each section.", "For questions, use the contact email (이용 문의) at the bottom of the page."],
    terms: [["개인정보", "personal information"], ["처리 방침", "policy"], ["시행일", "date the policy starts"]],
  },
  "/offline": {
    title: "No Internet Connection",
    what: "You are offline. Pages you opened before may still work.",
    how: ["Check your Wi-Fi or mobile data.", "Try again when you are connected."],
  },
};

/** 404 등 사전에 없는 경로 */
export const ENGLISH_FALLBACK: EnglishGuide = {
  title: "MyRoad Gyeongnam",
  what: "A free career and study planning site for middle and high school students in Gyeongsangnam-do.",
  how: ["Use the menu to go to the home page or another page."],
};

/** 현재 경로(usePathname)에 맞는 안내. 동적 경로는 [id] 패턴으로 찾는다. */
export function englishGuideFor(pathname: string): { key: string; guide: EnglishGuide } {
  const p = (pathname || "/").replace(/\/index(\.html)?$/, "").replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  if (ENGLISH_GUIDE[p]) return { key: p, guide: ENGLISH_GUIDE[p] };
  const parts = p.split("/");
  const dyn = [...parts.slice(0, -1), "[id]"].join("/");
  if (parts.length > 2 && ENGLISH_GUIDE[dyn]) return { key: dyn, guide: ENGLISH_GUIDE[dyn] };
  return { key: "", guide: ENGLISH_FALLBACK };
}
