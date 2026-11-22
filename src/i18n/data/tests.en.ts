// 영어 자료: 진로검사·상담(tests.ts). 커리어넷은 id, 고용24·상담 창구는 순서(index)로 맞춘다.

export const CAREERNET_TESTS_EN: Record<string, { n: string; who: string; time: string; d: string; items: string[]; use: string }> = {
  itrstk: { n: "Career Interest Test (K) (직업흥미검사(K))", who: "Middle & high", time: "About 20 min", d: "Find out your level of interest in different areas of work by area, and get job suggestions related to the areas you are most interested in.", items: ["Interest level by job area", "Areas of relatively high interest", "Job suggestions for those areas"], use: "Save jobs from the suggested areas in Job Guide" },
  holland: { n: "Career Interest Test (H) (직업흥미검사(H))", who: "Middle & high", time: "About 20 min", d: "Identifies your interest type using Holland's six types (Realistic, Investigative, Artistic, Social, Enterprising, Conventional).", items: ["General interests and preferred job interests", "Six-type profile", "Suggested jobs and career activities"], use: "Enter your interest code below and compare it with your MyRoad result" },
  vocation: { n: "Career Aptitude Test (직업적성검사)", who: "Middle & high", time: "About 30 min", d: "Find your relative strengths across aptitude areas such as language, math, spatial and creative skills.", items: ["Relative strengths by aptitude area", "Job groups linked to your strengths", "Information to help choose subjects"], use: "Compare with the strengths you chose in Know Myself" },
  value2: { n: "Work Values Test (직업가치관검사)", who: "Middle & high", time: "About 15 min", d: "Check which values matter most to you at work (stability, achievement, service, etc.).", items: ["Your work value priorities", "Jobs that match your values", "Value-based career choices"], use: "Compare with the 3 values you chose in Know Myself" },
  able: { n: "Career Development Competency Test (진로개발역량검사)", who: "Middle & high", time: "About 20 min", d: "Check, by area, your ability to explore and develop your career on your own.", items: ["Self-understanding and exploration skills", "Career design and preparation skills", "Areas that need work"], use: "Add the weaker areas as tasks for each semester" },
  exc: { n: "Career Action Test (진로실행력검사)", who: "Middle & high", time: "About 15 min", d: "Check how well you turn your career goals into real action.", items: ["Goal setting and planning", "Habits of acting and checking", "Tips to act more"], use: "Set practice tasks in Plan & Record" },
  grow3: { n: "Career Maturity Test (진로성숙도검사)", who: "Middle & high", time: "About 20 min", d: "Check how ready your attitudes, abilities and actions are for making career decisions.", items: ["Career attitude", "Career decision-making ability", "Career exploration behavior"], use: "Use the results when talking with your homeroom or career teacher" },
};

export const WORK24_TESTS_EN: { n: string; who: string; time: string; similar: string }[] = [
  { n: "Youth Career Interest Test (revised) (청소년 직업흥미검사(개정))", who: "Middle & high school students", time: "About 20 min", similar: "CareerNet Career Interest Test (H)" },
  { n: "Career Interest Exploration Test (short) (직업흥미탐색검사(간편형))", who: "Youth & adults", time: "About 5 min", similar: "-" },
  { n: "Job Exploration by Interest (Job아드림)", who: "Youth", time: "About 2 min", similar: "-" },
  { n: "Job Preference Test, Type S (revised) (직업선호도검사 S형(개정))", who: "High school students and older", time: "About 25 min", similar: "CareerNet Career Interest Test (H)" },
  { n: "Middle School Career Aptitude Test (중학생 진로적성검사)", who: "Middle school students", time: "About 63 min", similar: "CareerNet Career Aptitude Test" },
  { n: "High School Aptitude Test (고등학생 적성검사)", who: "High school students", time: "About 65 min", similar: "CareerNet Career Aptitude Test" },
  { n: "Youth Personality Test (청소년 인성검사)", who: "Middle & high school students", time: "About 25 min", similar: "-" },
  { n: "Youth Work Values Test (청소년 직업가치관검사)", who: "Middle & high school students", time: "About 20 min", similar: "CareerNet Work Values Test" },
  { n: "Middle School Career Development Test (Career UP) (중학생 진로발달검사(커리어UP))", who: "Middle school students", time: "About 15 min", similar: "CareerNet Career Maturity Test" },
  { n: "High School Career Development Test (Career UP) (고등학생 진로발달검사(커리어UP))", who: "High school students", time: "About 15 min", similar: "CareerNet Career Maturity Test" },
  { n: "Career Readiness Test (찾아Dream) (진로준비진단검사(찾아Dream))", who: "Youth", time: "About 2 min", similar: "-" },
  { n: "Elementary Career Awareness Test (초등학생 진로인식검사)", who: "Upper elementary & incoming middle school students", time: "About 30 min", similar: "-" },
  { n: "AI Job Preference Test (AI 직업선호도검사)", who: "Age 18+ (graduates & parents)", time: "About 20 min", similar: "-" },
];

export const COUNSEL_CHANNELS_EN: { n: string; d: string; note: string }[] = [
  { n: "CareerNet Career Counseling (커리어넷 진로상담)", d: "You can get online counseling about career worries from counselors such as dedicated career teachers. You can also read public counseling cases.", note: "Posting requires a CareerNet login" },
  { n: "EBS Career & Study Planning Counseling (EBS 진로·학업 설계 상담)", d: "Use lectures and counseling services on career and study planning run by EBS.", note: "Check the EBS website for available services" },
  { n: "EBSi College Admission Counseling (EBSi 대입 상담)", d: "See college admission counseling and study strategy briefing materials for high school students.", note: "For high school students" },
  { n: "College Admission Counseling Center (대학입학상담센터) 1600-1615", d: "College admission counseling (phone and online) run by the Korean Council for University Education. Current teachers serve as counselors.", note: "College admission portal Adiga (어디가)" },
  { n: "Gyeongsangnam-do Office of Education College Admission Center (경상남도교육청 대입정보센터)", d: "One-on-one college admission counseling for Gyeongnam students by a team of current teachers. Check Office of Education notices for when to apply.", note: "For Gyeongnam students" },
];
