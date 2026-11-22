// English data for src/data/subjects.ts (2022 revised curriculum). Loaded only in English mode:
//   const en = useEnData(() => import("@/i18n/data/subjects.en"), "subjects");
//   en?.subjectEn("미적분Ⅰ") → "Calculus I"
// Keys are the official Korean subject names. Schools use the Korean names, so pages show the
// Korean name next to the English one (wrapped in data-keep-ko).
import type { Cat, Eval, Group, TrackId } from "@/data/subjects";

export type SubjectEn = { name: string; desc: string };

const LANGS: [ko: string, en: string, world: string][] = [
  ["독일어", "German", "German-speaking"],
  ["프랑스어", "French", "French-speaking"],
  ["스페인어", "Spanish", "Spanish-speaking"],
  ["중국어", "Chinese", "Chinese-speaking"],
  ["일본어", "Japanese", "Japanese-speaking"],
  ["러시아어", "Russian", "Russian-speaking"],
  ["아랍어", "Arabic", "Arabic-speaking"],
  ["베트남어", "Vietnamese", "Vietnamese-speaking"],
];

const SCI = "A specialized subject mainly offered at science high schools (or science programs)";
const PE = "A specialized subject mainly offered at physical education high schools (or PE programs)";
const ART = "A specialized subject mainly offered at arts high schools (or arts programs)";
const INTL = "A specialized subject mainly offered at foreign language / international high schools (or programs)";

const spec = (desc: string, list: [string, string][]) => Object.fromEntries(list.map(([ko, name]) => [ko, { name, desc }]));

export const SUBJECTS_EN: Record<string, SubjectEn> = {
  // ── Korean
  "공통국어1": { name: "Common Korean 1", desc: "Basic skills in listening and speaking, reading, writing, grammar and literature" },
  "공통국어2": { name: "Common Korean 2", desc: "Builds on Common Korean 1 to deepen critical and creative use of Korean" },
  "화법과 언어": { name: "Speech and Language", desc: "Explore discourse and the Korean grammar system, and communicate effectively" },
  "독서와 작문": { name: "Reading and Writing", desc: "Read various texts critically and write logically" },
  "문학": { name: "Literature", desc: "Appreciating and critiquing works of Korean and world literature" },
  "주제 탐구 독서": { name: "Topic-Based Inquiry Reading", desc: "Choose a topic in your field of interest and read and explore it in depth" },
  "문학과 영상": { name: "Literature and Film", desc: "Compare storytelling and expression in literature and film/video media, and create your own work" },
  "직무 의사소통": { name: "Workplace Communication", desc: "Speaking and writing skills needed in the workplace" },
  "독서 토론과 글쓰기": { name: "Reading, Discussion and Writing", desc: "Read books, discuss them and put your thoughts into writing" },
  "매체 의사소통": { name: "Media Communication", desc: "Read and produce digital media content critically" },
  "언어생활 탐구": { name: "Exploring Language in Daily Life", desc: "Explore language in everyday life and in society" },
  // ── Mathematics
  "공통수학1": { name: "Common Mathematics 1", desc: "Polynomials, equations and inequalities, counting, matrices" },
  "공통수학2": { name: "Common Mathematics 2", desc: "Equations of figures, sets and propositions, functions" },
  "기본수학1": { name: "Basic Mathematics 1", desc: "A foundation subject for students who find Common Mathematics 1 difficult" },
  "기본수학2": { name: "Basic Mathematics 2", desc: "A foundation subject for students who find Common Mathematics 2 difficult" },
  "대수": { name: "Algebra", desc: "Exponential and logarithmic functions, trigonometric functions, sequences" },
  "미적분Ⅰ": { name: "Calculus I", desc: "Limits and continuity of functions, differentiation, integration" },
  "확률과 통계": { name: "Probability and Statistics", desc: "Counting, probability, statistical estimation" },
  "미적분Ⅱ": { name: "Calculus II", desc: "Limits of sequences, differentiation and integration of various functions" },
  "기하": { name: "Geometry", desc: "Conic sections, solid figures and spatial coordinates, vectors" },
  "경제 수학": { name: "Mathematics for Economics", desc: "Understanding economic and financial phenomena through mathematics" },
  "인공지능 수학": { name: "Mathematics for AI", desc: "Mathematics behind how AI works (data, optimization)" },
  "직무 수학": { name: "Workplace Mathematics", desc: "Mathematics used in the workplace" },
  "수학과 문화": { name: "Mathematics and Culture", desc: "Explore mathematics in art, history and society" },
  "실용 통계": { name: "Practical Statistics", desc: "Statistics projects using real-life data" },
  "수학과제 탐구": { name: "Mathematics Research Project", desc: "Choose a math topic, explore it and write a report" },
  // ── English
  "공통영어1": { name: "Common English 1", desc: "Basic English skills focused on communication" },
  "공통영어2": { name: "Common English 2", desc: "Builds on Common English 1 to deepen English communication skills" },
  "기본영어1": { name: "Basic English 1", desc: "A foundation subject for students who find Common English 1 difficult" },
  "기본영어2": { name: "Basic English 2", desc: "A foundation subject for students who find Common English 2 difficult" },
  "영어Ⅰ": { name: "English I", desc: "Listening, reading, speaking and writing on various topics" },
  "영어Ⅱ": { name: "English II", desc: "English communication at a higher level than English I" },
  "영어 독해와 작문": { name: "English Reading and Writing", desc: "Read by understanding how texts are organized, and write logically" },
  "영미 문학 읽기": { name: "Reading English Literature", desc: "Appreciating British and American literary works" },
  "영어 발표와 토론": { name: "English Presentation and Debate", desc: "Giving presentations and debating in English" },
  "심화 영어": { name: "Advanced English", desc: "Advanced English on academic topics" },
  "심화 영어 독해와 작문": { name: "Advanced English Reading and Writing", desc: "Reading specialized texts and academic writing" },
  "직무 영어": { name: "Workplace English", desc: "English used in the workplace" },
  "실생활 영어 회화": { name: "Everyday English Conversation", desc: "English conversation for everyday situations" },
  "미디어 영어": { name: "Media English", desc: "Understanding and creating English media content" },
  "세계 문화와 영어": { name: "World Cultures and English", desc: "Understanding diverse cultures through English" },
  // ── Social Studies (incl. history and ethics)
  "한국사1": { name: "Korean History 1", desc: "Korean history from ancient times to the late Joseon period (before the opening of ports)" },
  "한국사2": { name: "Korean History 2", desc: "Korean history from the opening of ports to the present" },
  "통합사회1": { name: "Integrated Social Studies 1", desc: "Understanding people, society and the environment as a whole" },
  "통합사회2": { name: "Integrated Social Studies 2", desc: "Explore social issues such as human rights, the market economy, justice and globalization" },
  "세계시민과 지리": { name: "Global Citizenship and Geography", desc: "Geographic issues of the global village and global citizenship" },
  "사회와 문화": { name: "Society and Culture", desc: "Methods for studying social phenomena, and understanding culture" },
  "세계사": { name: "World History", desc: "The history of world regions and their exchanges" },
  "현대사회와 윤리": { name: "Ethics in Contemporary Society", desc: "Explore ethical issues in today's society" },
  "한국지리 탐구": { name: "Exploring Korean Geography", desc: "In-depth study of the geographic features of Korea" },
  "도시의 미래 탐구": { name: "Exploring the Future of Cities", desc: "Urban problems and sustainable cities" },
  "동아시아 역사 기행": { name: "Journey through East Asian History", desc: "East Asian history and exchanges between countries" },
  "정치": { name: "Politics", desc: "Democracy, political processes, international politics" },
  "법과 사회": { name: "Law and Society", desc: "Law and rights in daily life, the Constitution and basic rights" },
  "경제": { name: "Economics", desc: "Principles of markets, the national economy and the international economy" },
  "윤리와 사상": { name: "Ethics and Thought", desc: "Eastern and Western ethical thought and social thought" },
  "인문학과 윤리": { name: "Humanities and Ethics", desc: "Reflection through the humanities and living ethically" },
  "국제 관계의 이해": { name: "Understanding International Relations", desc: "Cooperation and conflict in the international community" },
  "여행지리": { name: "Travel Geography", desc: "World geography through travel" },
  "역사로 탐구하는 현대 세계": { name: "Exploring the Modern World through History", desc: "The historical background of issues in today's world" },
  "사회문제 탐구": { name: "Social Issues Inquiry", desc: "Projects where you investigate and analyze social problems yourself" },
  "금융과 경제생활": { name: "Finance and Economic Life", desc: "Smart financial life and managing assets" },
  "윤리문제 탐구": { name: "Ethical Issues Inquiry", desc: "Discussing and exploring ethical issues in daily life" },
  "기후변화와 지속가능한 세계": { name: "Climate Change and a Sustainable World", desc: "How society responds to the climate crisis and works toward sustainability" },
  // ── Science
  "통합과학1": { name: "Integrated Science 1", desc: "Matter and regularity, systems and interactions" },
  "통합과학2": { name: "Integrated Science 2", desc: "Change and diversity, environment and energy" },
  "과학탐구실험1": { name: "Scientific Inquiry and Experiments 1", desc: "Scientific thinking through inquiry experiments" },
  "과학탐구실험2": { name: "Scientific Inquiry and Experiments 2", desc: "Deeper inquiry following Scientific Inquiry and Experiments 1" },
  "물리학": { name: "Physics", desc: "Force and motion, energy, electromagnetism, light and matter" },
  "화학": { name: "Chemistry", desc: "Chemical bonds, chemical reactions, changes in matter" },
  "생명과학": { name: "Life Science", desc: "Living systems, homeostasis, heredity, evolution" },
  "지구과학": { name: "Earth Science", desc: "Earth systems, the atmosphere and oceans, space" },
  "역학과 에너지": { name: "Mechanics and Energy", desc: "Advanced study of the motion of objects and mechanical energy" },
  "전자기와 양자": { name: "Electromagnetism and Quantum Physics", desc: "Electric and magnetic phenomena and the basics of quantum physics" },
  "물질과 에너지": { name: "Matter and Energy", desc: "States of matter and chemical energy" },
  "화학 반응의 세계": { name: "The World of Chemical Reactions", desc: "Oxidation and reduction, reaction rates, equilibrium" },
  "세포와 물질대사": { name: "Cells and Metabolism", desc: "Cell structure and the energy for life processes" },
  "생물의 유전": { name: "Genetics", desc: "Genes and how traits are expressed, biotechnology" },
  "지구시스템과학": { name: "Earth System Science", desc: "Advanced study of interactions among the geosphere, hydrosphere and atmosphere" },
  "행성우주과학": { name: "Planetary and Space Science", desc: "The structure of the solar system and the universe, observing celestial objects" },
  "과학의 역사와 문화": { name: "History and Culture of Science", desc: "The history of scientific progress and its meaning for society" },
  "기후변화와 환경생태": { name: "Climate Change and Ecology", desc: "A scientific understanding of climate change and ecosystems" },
  "융합과학 탐구": { name: "Integrated Science Inquiry", desc: "Inquiry projects that cross several fields of science" },
  // ── Technology & Home Economics / Informatics
  "기술·가정": { name: "Technology and Home Economics", desc: "Technology systems and living independently" },
  "로봇과 공학세계": { name: "Robots and the World of Engineering", desc: "Designing and building robots, solving problems like an engineer" },
  "생활과학 탐구": { name: "Exploring Everyday Science", desc: "Explore the science in clothing, food and housing" },
  "창의 공학 설계": { name: "Creative Engineering Design", desc: "Turn ideas into engineering designs and build prototypes" },
  "지식 재산 일반": { name: "Introduction to Intellectual Property", desc: "Inventions, patents and intellectual property rights" },
  "생애 설계와 자립": { name: "Life Planning and Independence", desc: "Planning an independent life, including career, money and housing" },
  "아동발달과 부모": { name: "Child Development and Parenting", desc: "Understanding child development and the role of parents" },
  "정보": { name: "Informatics", desc: "Computational thinking, programming, data and information" },
  "인공지능 기초": { name: "Introduction to AI", desc: "How AI works, with hands-on machine learning" },
  "데이터 과학": { name: "Data Science", desc: "Collecting, analyzing and visualizing data" },
  "소프트웨어와 생활": { name: "Software and Everyday Life", desc: "Solving everyday problems with software" },
  // ── Second Foreign Language / Classical Chinese
  ...Object.fromEntries(LANGS.map(([ko, en]) => [ko, { name: en, desc: `Basic communication and cultural understanding in ${en}` }])),
  "중국어 회화": { name: "Chinese Conversation", desc: "Practical Chinese conversation" },
  "심화 중국어": { name: "Advanced Chinese", desc: "Advanced study of Chinese" },
  "일본어 회화": { name: "Japanese Conversation", desc: "Practical Japanese conversation" },
  "심화 일본어": { name: "Advanced Japanese", desc: "Advanced study of Japanese" },
  "중국 문화": { name: "Chinese Culture", desc: "Explore the culture of the Chinese-speaking world" },
  "일본 문화": { name: "Japanese Culture", desc: "Explore Japanese culture" },
  "한문": { name: "Classical Chinese", desc: "Basics of Classical Chinese and vocabulary written in Chinese characters" },
  "한문 고전 읽기": { name: "Reading Classical Chinese Texts", desc: "Reading classic works written in Classical Chinese" },
  "언어생활과 한자": { name: "Chinese Characters in Daily Life", desc: "Understanding Korean words based on Chinese characters in daily life" },
  // (added from the official hscredit.kr list)
  ...Object.fromEntries(
    LANGS.filter(([ko]) => ko !== "중국어" && ko !== "일본어").flatMap(([ko, en]) => [
      [`${ko} 회화`, { name: `${en} Conversation`, desc: `Practical conversation for speaking and listening in ${en} in everyday and career situations` }],
      [`심화 ${ko}`, { name: `Advanced ${en}`, desc: "A career elective in Second Foreign Language / Classical Chinese" }],
    ])
  ),
  "독일어권 문화": { name: "Cultures of the German-Speaking World", desc: "Explore the society and culture of the German-speaking world together with the language" },
  "프랑스어권 문화": { name: "Cultures of the French-Speaking World", desc: "Explore the society and culture of the French-speaking world together with the language" },
  "스페인어권 문화": { name: "Cultures of the Spanish-Speaking World", desc: "Explore the society and culture of the Spanish-speaking world together with the language" },
  "러시아 문화": { name: "Russian Culture", desc: "Explore the society and culture of the Russian-speaking world together with the language" },
  "아랍 문화": { name: "Arab Culture", desc: "Explore the society and culture of the Arab world together with the language" },
  "베트남 문화": { name: "Vietnamese Culture", desc: "Explore the society and culture of Vietnam together with the language" },
  // ── Physical Education
  "체육1": { name: "Physical Education 1", desc: "Managing your health and various physical activities" },
  "체육2": { name: "Physical Education 2", desc: "More advanced physical activities following Physical Education 1" },
  "운동과 건강": { name: "Exercise and Health", desc: "Planning exercise and building healthy habits" },
  "스포츠 문화": { name: "Sports Culture", desc: "The history and culture of sports" },
  "스포츠 과학": { name: "Sports Science", desc: "The science of exercise and analyzing athletic performance" },
  "스포츠 생활1": { name: "Sports for Life 1", desc: "Trying out recreational sports" },
  "스포츠 생활2": { name: "Sports for Life 2", desc: "Going deeper into recreational sports" },
  // ── Arts
  "음악": { name: "Music", desc: "Listening to, expressing and enjoying music in daily life" },
  "음악 연주와 창작": { name: "Music Performance and Composition", desc: "Performing, composing and arranging music" },
  "음악 감상과 비평": { name: "Music Appreciation and Criticism", desc: "Analyzing and critiquing musical works" },
  "음악과 미디어": { name: "Music and Media", desc: "Making music with digital media" },
  "미술": { name: "Art", desc: "Appreciating, expressing and enjoying art in daily life" },
  "미술 창작": { name: "Art Creation", desc: "Creating artworks with various media" },
  "미술 감상과 비평": { name: "Art Appreciation and Criticism", desc: "Analyzing and critiquing artworks" },
  "미술과 매체": { name: "Art and Media", desc: "Art in new media such as video and digital" },
  "연극": { name: "Drama", desc: "Making and performing plays" },
  // ── Liberal Arts
  "진로와 직업": { name: "Career and Occupation", desc: "Exploring careers, understanding the world of work, career planning" },
  "생태와 환경": { name: "Ecology and Environment", desc: "Ecological awareness and environmental issues" },
  "인간과 철학": { name: "Humans and Philosophy", desc: "Philosophical questions and thinking" },
  "논리와 사고": { name: "Logic and Thinking", desc: "Practice in logical and critical thinking" },
  "인간과 심리": { name: "Humans and Psychology", desc: "Basic psychology of the human mind and behavior" },
  "교육의 이해": { name: "Understanding Education", desc: "The meaning of education and how learning works" },
  "삶과 종교": { name: "Life and Religion", desc: "Religion and the meaning of life" },
  "보건": { name: "Health", desc: "Health and disease prevention, health care" },
  "인간과 경제활동": { name: "Humans and Economic Activity", desc: "Making rational choices as an economic actor" },
  "논술": { name: "Essay Writing", desc: "Argumentative writing" },
  // ── Science track (specialized)
  ...spec(SCI, [
    ["전문 수학", "Advanced Mathematics"],
    ["이산 수학", "Discrete Mathematics"],
    ["고급 기하", "Higher Geometry"],
    ["고급 대수", "Higher Algebra"],
    ["고급 미적분", "Higher Calculus"],
    ["고급 물리학", "Higher Physics"],
    ["고급 화학", "Higher Chemistry"],
    ["고급 생명과학", "Higher Life Science"],
    ["고급 지구과학", "Higher Earth Science"],
    ["과학과제 연구", "Science Research Project"],
    ["물리학 실험", "Physics Experiments"],
    ["화학 실험", "Chemistry Experiments"],
    ["생명과학 실험", "Life Science Experiments"],
    ["지구과학 실험", "Earth Science Experiments"],
    ["정보과학", "Computer Science"],
  ]),
  // ── Physical education track (specialized)
  ...spec(PE, [
    ["스포츠 개론", "Introduction to Sports"],
    ["육상", "Track and Field"],
    ["체조", "Gymnastics"],
    ["수상 스포츠", "Water Sports"],
    ["기초 체육 전공 실기", "Basic Sports Major Practice"],
    ["심화 체육 전공 실기", "Intermediate Sports Major Practice"],
    ["고급 체육 전공 실기", "Advanced Sports Major Practice"],
    ["스포츠 경기 체력", "Athletic Fitness"],
    ["스포츠 경기 기술", "Athletic Skills"],
    ["스포츠 경기 분석", "Game Analysis in Sports"],
    ["스포츠 교육", "Sports Education"],
    ["스포츠 생리의학", "Sports Physiology and Medicine"],
    ["스포츠 행정 및 경영", "Sports Administration and Management"],
  ]),
  // ── Arts track (specialized)
  ...spec(ART, [
    ["음악 이론", "Music Theory"],
    ["음악사", "Music History"],
    ["시창·청음", "Sight-Singing and Ear Training"],
    ["음악 전공 실기", "Music Major Practice"],
    ["합창·합주", "Choir and Ensemble"],
    ["음악 공연 실습", "Music Performance Practicum"],
    ["음악과 문화", "Music and Culture"],
    ["미술 이론", "Art Theory"],
    ["드로잉", "Drawing"],
    ["미술사", "Art History"],
    ["미술 전공 실기", "Art Major Practice"],
    ["조형 탐구", "Exploring Visual Form"],
    ["미술 매체 탐구", "Exploring Art Media"],
    ["미술과 사회", "Art and Society"],
    ["무용의 이해", "Understanding Dance"],
    ["무용과 몸", "Dance and the Body"],
    ["무용 기초 실기", "Basic Dance Practice"],
    ["무용 전공 실기", "Dance Major Practice"],
    ["안무", "Choreography"],
    ["무용 제작 실습", "Dance Production Practicum"],
    ["무용 감상과 비평", "Dance Appreciation and Criticism"],
    ["무용과 매체", "Dance and Media"],
    ["문예 창작의 이해", "Understanding Creative Writing"],
    ["문장론", "The Art of the Sentence"],
    ["문학 감상과 비평", "Literary Appreciation and Criticism"],
    ["시 창작", "Poetry Writing"],
    ["소설 창작", "Fiction Writing"],
    ["극 창작", "Playwriting"],
    ["문학과 매체", "Literature and Media"],
    ["연극과 몸", "Theater and the Body"],
    ["연극과 말", "Theater and Speech"],
    ["연기", "Acting"],
    ["무대 미술과 기술", "Stage Design and Technology"],
    ["연극 제작 실습", "Theater Production Practicum"],
    ["연극 감상과 비평", "Theater Appreciation and Criticism"],
    ["연극과 삶", "Theater and Life"],
    ["영화의 이해", "Understanding Film"],
    ["촬영·조명", "Cinematography and Lighting"],
    ["편집·사운드", "Editing and Sound"],
    ["영화 제작 실습", "Film Production Practicum"],
    ["영화 감상과 비평", "Film Appreciation and Criticism"],
    ["영화와 삶", "Film and Life"],
    ["사진의 이해", "Understanding Photography"],
    ["사진 촬영", "Photo Shooting"],
    ["사진 표현 기법", "Photographic Techniques"],
    ["영상 제작의 이해", "Understanding Video Production"],
    ["사진 감상과 비평", "Photography Appreciation and Criticism"],
    ["사진과 삶", "Photography and Life"],
  ]),
  // ── Foreign language / international track (specialized)
  ...spec(INTL, [
    ["심화 영어 회화Ⅰ", "Advanced English Conversation I"],
    ["심화 영어 회화Ⅱ", "Advanced English Conversation II"],
    ["심화 영어Ⅰ", "Advanced English I"],
    ["심화 영어Ⅱ", "Advanced English II"],
    ["심화 영어 독해Ⅰ", "Advanced English Reading I"],
    ["심화 영어 독해Ⅱ", "Advanced English Reading II"],
    ["심화 영어 작문Ⅰ", "Advanced English Writing I"],
    ["심화 영어 작문Ⅱ", "Advanced English Writing II"],
    ["국제 정치", "International Politics"],
    ["국제 경제", "International Economics"],
    ["국제법", "International Law"],
    ["지역 이해", "Area Studies"],
    ["한국 사회의 이해", "Understanding Korean Society"],
    ["비교 문화", "Comparative Culture"],
    ["세계 문제와 미래 사회", "Global Issues and Future Society"],
    ["국제 관계와 국제기구", "International Relations and Organizations"],
    ["현대 세계의 변화", "Changes in the Modern World"],
    ["사회 탐구 방법", "Social Research Methods"],
    ["사회과제 연구", "Social Studies Research Project"],
    ...LANGS.flatMap(([ko, en]): [string, string][] => [
      [`전공 기초 ${ko}`, `Foundations of ${en} for Majors`],
      [`${ko} 회화Ⅰ`, `${en} Conversation I`],
      [`${ko} 회화Ⅱ`, `${en} Conversation II`],
      [`${ko} 독해와 작문Ⅰ`, `${en} Reading and Writing I`],
      [`${ko} 독해와 작문Ⅱ`, `${en} Reading and Writing II`],
    ]),
  ]),
};

/** English subject name for an official Korean subject name (undefined if unknown). */
export function subjectEn(koName: string): string | undefined {
  return SUBJECTS_EN[koName]?.name;
}

/** Subject categories (CAT_INFO labels/desc) */
export const CAT_EN: Record<Cat, { label: string; desc: string }> = {
  공통: { label: "Common", desc: "Foundation subjects that all students take, mostly in 1st year" },
  기본: { label: "Basic", desc: "Alternative subjects for students who find the common subjects difficult" },
  일반: { label: "General elective", desc: "Subjects covering the main content of each academic area" },
  진로: { label: "Career elective", desc: "Advanced study in each subject area and career-related subjects" },
  융합: { label: "Convergence elective", desc: "Subjects that combine topics within or across subjects and apply them to real life" },
  전문: { label: "Specialized", desc: "Specialized subjects of science, PE, arts, foreign language and international high schools (or programs)" },
};

/** Subject groups (교과) */
export const GROUP_EN: Record<Group, string> = {
  국어: "Korean",
  수학: "Mathematics",
  영어: "English",
  사회: "Social Studies",
  과학: "Science",
  "기술·가정/정보": "Technology & Home Economics / Informatics",
  "제2외국어/한문": "Second Foreign Language / Classical Chinese",
  체육: "Physical Education",
  예술: "Arts",
  교양: "Liberal Arts",
  과학계열: "Science track",
  체육계열: "PE track",
  예술계열: "Arts track",
  "외국어·국제계열": "Foreign Language & International track",
};

/** Evaluation types */
export const EVAL_EN: Record<Eval, string> = {
  "5등급+성취도": "5-level rank grade + achievement level",
  "성취도(A~E)": "Achievement level (A–E)",
  "성취도(3단계)": "Achievement level (3 levels)",
  "성취도(3단계)+3등급": "Achievement level (3 levels) + 3-level rank grade",
  "이수(P)": "Pass (P)",
};

/** CREDIT_RULES.requiredByArea[].area */
export const CREDIT_AREA_EN: Record<string, string> = {
  국어: "Korean",
  수학: "Mathematics",
  영어: "English",
  "사회(한국사 6 포함)": "Social Studies (incl. Korean History 6)",
  과학: "Science",
  체육: "Physical Education",
  예술: "Arts",
  "기술·가정/정보/제2외국어/한문/교양": "Tech & Home Ec. / Informatics / Second Foreign Language / Classical Chinese / Liberal Arts",
};

/** TRACKS (계열) */
export const TRACKS_EN: Record<TrackId, { name: string; desc: string }> = {
  hum: { name: "Humanities", desc: "Languages and literature, history, philosophy" },
  soc: { name: "Social Sciences", desc: "Politics, public administration, media, society" },
  biz: { name: "Business and Economics", desc: "Business, economics, trade" },
  nat: { name: "Natural Sciences", desc: "Mathematics, physics, chemistry, life science, earth science" },
  ai: { name: "Engineering (AI & SW)", desc: "Computers, software, artificial intelligence" },
  eng: { name: "Engineering (Mechanical, Electronics, Semiconductors)", desc: "Mechanical, electrical and electronic, semiconductors, shipbuilding, aerospace" },
  med: { name: "Medicine and Health", desc: "Pre-medicine, pharmacy, nursing, public health" },
  edu: { name: "Education", desc: "Teacher training, education studies" },
  art: { name: "Arts and Sports", desc: "Fine arts, music, physical education, design" },
};

/** Non-subject entries that appear in TRACKS rec lists */
export const TRACK_REC_EN: Record<string, string> = {
  "희망 교과의 진로선택 과목": "Career electives in your preferred subject",
};

/** GRADE5[].label */
export const GRADE5_EN: Record<number, string> = {
  1: "Top 10%",
  2: "Above 10% – 34%",
  3: "Above 34% – 66%",
  4: "Above 66% – 90%",
  5: "Above 90%",
};

/** SUNEUNG_2028 (keyed by area) */
export const SUNEUNG_2028_EN: Record<string, { area: string; subjects: string; note: string }> = {
  국어: { area: "Korean", subjects: "Speech and Language, Reading and Writing, Literature (common)", note: "Everyone takes the same test, with no electives" },
  수학: { area: "Mathematics", subjects: "Algebra, Calculus I, Probability and Statistics (common)", note: "Calculus II and Geometry are not on the test" },
  영어: { area: "English", subjects: "English I, English II", note: "Absolute grading continues" },
  한국사: { area: "Korean History", subjects: "Korean History 1, Korean History 2", note: "Required, absolute grading" },
  "사회·과학탐구": { area: "Social Studies & Science Inquiry", subjects: "Integrated Social Studies + Integrated Science (take both)", note: "Everyone takes the same subjects, with no humanities/science split" },
  직업탐구: { area: "Vocational Inquiry", subjects: "Successful Working Life", note: "Optional, e.g. for vocational high school students" },
  "제2외국어/한문": { area: "Second Foreign Language / Classical Chinese", subjects: "Choose 1 of 9 subjects", note: "Absolute grading" },
};
