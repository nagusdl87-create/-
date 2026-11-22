// 학과 상세 콘텐츠 영어판 (src/data/deep/majors-a.ts·majors-b.ts와 같은 id·같은 형식).
// 서버 page.tsx에서 해당 학과만 골라 MajorDetail에 넘긴다(화면 코드에 전체를 싣지 않기).
import type { MajorDeep } from "./types";

export const MAJOR_DEEP_EN: Record<string, MajorDeep> = {
  korean: {
    intro: "The Department of Korean Language and Literature studies the rules that make up the Korean language and how Korean literature has continued from the past to today. Speech and writing are the most basic tools for sharing ideas, so understanding them deeply gives you strength in many fields, such as education, publishing and content.",
    questions: [
      "Why do people in different regions say the same thing in different ways?",
      "What can old classic novels tell us today?",
      "How are new slang words born, and why do they disappear?",
    ],
    tracks: [
      { name: "Korean Linguistics", d: "Analyze the structure of Korean scientifically, such as the rules of sounds, words and sentences." },
      { name: "Classical Literature", d: "Read old literary works such as hyangga, sijo and classic novels, and explore the ideas of their times." },
      { name: "Modern Literature", d: "Analyze modern poems, novels and plays, and look at how works connect to society." },
      { name: "Korean Language Education", d: "Learn how to teach Korean to foreigners and multicultural learners." },
    ],
    years: [
      "Year 1: Build the basics of studying language and literature with courses like Introduction to Korean Linguistics and Introduction to Literature.",
      "Year 2: Learn key courses in each area, such as Korean Grammar, History of Classical Literature and Theory of the Modern Novel.",
      "Year 3: Choose a period or genre you are interested in, read deeply, and do many presentations and discussions.",
      "Year 4: Write a graduation thesis or a report analyzing works, and take teaching, creative writing or planning courses for your career.",
    ],
    skills: ["Reading texts deeply and interpreting hidden meanings", "Organizing ideas into logical writing", "Analyzing language data to find rules"],
    compare: [
      { with: "Korean Language Education", diff: "Korean Language Education focuses on training Korean teachers, while Korean Language and Literature focuses on studying the language and literature themselves (some universities let you become a teacher through a teaching certificate course)." },
    ],
    after: "Graduates go into publishing companies, news media, broadcasting and content planning, public institutions and corporate PR departments. If you complete a teaching certificate course, you can take the Korean teacher recruitment exam. To study Korean linguistics or literature further, people go to graduate school, and some complete related courses to prepare for the Korean language teacher qualification for foreign learners.",
    hs: [
      "Make a dictionary that collects dialect words from your region and compares them with standard Korean",
      "Survey the slang your classmates use and explore how language changes",
      "Compare a classic novel with its webtoon or drama adaptations",
    ],
    faq: [
      { q: "Do I have to be good at writing to apply?", a: "You don't have to write well from the start. But there are many reading and writing assignments, so a habit of reading books and writing regularly makes it much easier." },
      { q: "Do I have to go to this department to become a writer?", a: "No. You can become a writer with any major, but in this department you gain experience reading and analyzing many works in depth." },
    ],
  },

  english: {
    intro: "The Department of English Language and Literature studies the structure and sounds of English together with the literature and culture of English-speaking countries. It goes beyond simply being good at English: it helps you understand how language works and how literature reflects society.",
    questions: [
      "Why are the spelling and pronunciation of English words often different?",
      "Why are works by British writers from hundreds of years ago still read today?",
      "Why are some expressions hard to translate with a translation app?",
    ],
    tracks: [
      { name: "English Linguistics", d: "Analyze the sounds, words and sentence structure of English from a linguistic point of view." },
      { name: "British and American Literature", d: "Read and critique novels, poems and plays from English-speaking countries such as the UK and the US." },
      { name: "British and American Culture", d: "Explore the history and culture of English-speaking societies, including film and popular culture." },
      { name: "Interpreting and Translation", d: "Practice carrying meaning accurately and naturally between English and Korean." },
    ],
    years: [
      "Year 1: Take basic English reading, writing and speaking courses and introductions to English linguistics and literature.",
      "Year 2: Learn key language and literature courses such as English Phonetics, English Grammar and British and American Novels.",
      "Year 3: Study your areas of interest in depth, such as literature by period, sociolinguistics and translation practice.",
      "Year 4: Do seminars and a graduation thesis or project, and take interpreting, translation or teaching courses for your career.",
    ],
    skills: ["Reading and writing English accurately", "Understanding and comparing other cultures", "Interpreting literary works critically"],
    compare: [
      { with: "English Education", diff: "English Education focuses on training English teachers and teaching methods, while English Language and Literature focuses on studying English linguistics and British and American literature." },
    ],
    after: "Many graduates go into fields that use English, such as interpreting and translation, trade and foreign companies, airlines and tourism, and publishing and media. If you complete a teaching certificate course, you can take the English teacher recruitment exam. Some go to a graduate school of interpretation and translation to become professional interpreters, or to graduate school to research linguistics or literature.",
    hs: [
      "Compare several Korean translations of the same English novel and analyze the differences in translation style",
      "Research the differences in polite speech between English and Korean and connect them to culture",
      "Collect English idioms that translation apps often get wrong and explore why",
    ],
    faq: [
      { q: "Do I need to be good at English conversation already?", a: "Not necessarily. But many classes involve reading original books and presenting and writing in English, so it is easier to adjust if you keep using English regularly." },
      { q: "Will this department become unnecessary as translation apps improve?", a: "Translation apps are used more and more as tools, but carrying culture and context accurately and checking the results still needs a deep understanding of language." },
    ],
  },

  history: {
    intro: "The Department of History uses sources such as old records and artifacts to study what happened in the past and why. Understanding the past well lets you look at today's social problems with a wider view.",
    questions: [
      "Why do different records tell different stories about the same event?",
      "Why didn't Gaya unite into one large kingdom like the Three Kingdoms?",
      "How did past epidemics and climate change transform societies?",
    ],
    tracks: [
      { name: "Korean History", d: "Study the flow of Korean history and major events from ancient times to today in depth." },
      { name: "Asian History", d: "Look at the history of various parts of Asia, such as China and Japan, and their exchanges with each other." },
      { name: "Western History", d: "Explore the history of Europe and the Americas and how modern societies were formed." },
      { name: "Historical Sources and Public History", d: "Learn how to read historical sources and how museums and archives share history." },
    ],
    years: [
      "Year 1: Learn the big picture through an introduction to history and survey courses on Korean, Asian and Western history.",
      "Year 2: Learn historical methods and how to read sources, and take advanced courses on different periods.",
      "Year 3: Choose a period and region you are interested in, find sources, give presentations and go on field trips.",
      "Year 4: Analyze sources yourself to write a graduation thesis, and take career courses such as curatorship or teaching.",
    ],
    skills: ["Critical thinking to judge how reliable a source is", "Organizing many sources to explain the flow of events", "Reading old records, including those written in Chinese characters"],
    compare: [
      { with: "Archaeology", diff: "Archaeology focuses on digging up and analyzing remains and artifacts in the ground, while History mainly studies the past by interpreting written records." },
      { with: "History Education", diff: "History Education aims to train history teachers, while History focuses on historical research itself." },
    ],
    after: "Graduates go into museums, archives, cultural heritage organizations, publishing and broadcasting content, and public institutions. If you complete a teaching certificate course, you can take the history teacher recruitment exam. Many go to graduate school to become researchers or curators, and the curator qualification requires related education and work experience.",
    hs: [
      "Visit Gaya sites in Gyeongnam and write a report on Gaya daily life seen through artifacts",
      "Compare how Korean, Japanese and Chinese textbooks describe the same historical event",
      "Research where old place names in your neighborhood come from and make a local history map",
    ],
    faq: [
      { q: "Do I need to memorize historical dates well?", a: "You need to know the basic flow, but at university the ability to read sources and explain why things happened matters more than memorizing." },
      { q: "Do I have to know Chinese characters?", a: "Korean and Asian history use many sources written in Classical Chinese, so knowing Chinese characters helps a lot. Many students also take Classical Chinese classes at university." },
    ],
  },

  philosophy: {
    intro: "The Department of Philosophy uses logic to examine basic questions such as 'What is right?' and 'What can we know?' The ability to think deeply about problems without a single answer is especially important in areas dealing with new problems, such as AI ethics, law and policy.",
    questions: [
      "When a self-driving car cannot avoid an accident, whom should it protect?",
      "How can I be sure that the world I see is real?",
      "What is a happy life, and how should we live to live well?",
    ],
    tracks: [
      { name: "Ethics", d: "Explore standards of right and wrong and the ethics of real-life issues such as life, technology and the environment." },
      { name: "Logic", d: "Learn the rules that separate good reasoning from bad reasoning." },
      { name: "Asian Philosophy", d: "Study Asian ideas about life, such as Confucianism, Buddhism and Taoism." },
      { name: "Western Philosophy", d: "Look at the main theories of Western philosophers from ancient Greece to today." },
    ],
    years: [
      "Year 1: Learn the basics of asking questions and reasoning through an introduction to philosophy and logic.",
      "Year 2: Learn the main branches of philosophy, such as Asian philosophy, the history of Western philosophy and ethics.",
      "Year 3: Read and discuss topics in depth, such as epistemology, metaphysics and applied ethics.",
      "Year 4: Choose a topic and write a graduation thesis that builds your own argument.",
    ],
    skills: ["Logical thinking to examine the reasons behind claims", "Reading difficult texts carefully", "Debating while respecting other opinions", "Writing your ideas persuasively"],
    compare: [
      { with: "Ethics Education", diff: "Ethics Education focuses on training moral and ethics teachers, while Philosophy studies philosophical theories themselves widely." },
    ],
    after: "Using their logical thinking, graduates go into many fields such as publishing and media, corporate planning and public institutions, and some go on to other professional fields such as law school. To become a philosophy researcher, people usually go to graduate school.",
    hs: [
      "Analyze fairness problems in AI hiring programs using ethical theories",
      "Find logical fallacies in advertising slogans and sort them by type",
      "Compare the ideas of happiness of Asian and Western thinkers and set your own standard of happiness",
    ],
    faq: [
      { q: "I heard it's hard to get a job with a philosophy degree. Is that true?", a: "It does not lead directly to one fixed job, so you need to plan your own career. Many students also plan a double major or various activities." },
      { q: "Do I need to read a lot of books?", a: "Yes, many classes involve reading difficult texts slowly and thinking about them. Reading one or two introductory philosophy books in high school helps you check if it suits you." },
    ],
  },

  chinese: {
    intro: "The Department of Chinese Language and Literature builds your ability to listen to, speak and read Chinese, and you also study Chinese literature, history and culture. China is close to Korea and the two countries interact a lot, so people who understand both the language and the culture are needed in many fields.",
    questions: [
      "How are Chinese, which uses Chinese characters, and Korean similar and different?",
      "Why does the same sound in Chinese have different meanings depending on the tone?",
      "How have classic Chinese poems and stories influenced Korean culture?",
    ],
    tracks: [
      { name: "Chinese Linguistics", d: "Analyze Chinese pronunciation, tones and grammar." },
      { name: "Chinese Literature", d: "Read and interpret Chinese literary works, from classical poems to modern novels." },
      { name: "Chinese Culture and Area Studies", d: "Gain a broad understanding of Chinese society, history, popular culture and economy." },
      { name: "Interpreting, Translation and Practical Chinese", d: "Practice Chinese and translation used in business and tourism situations." },
    ],
    years: [
      "Year 1: Focus on pronunciation, basic conversation and basic grammar.",
      "Year 2: Learn intermediate conversation and writing together with the history of Chinese literature and Chinese culture.",
      "Year 3: Take advanced reading, current affairs Chinese, translation practice and advanced major courses.",
      "Year 4: Do seminars and a graduation thesis or project, and strengthen practical Chinese for your career.",
    ],
    skills: ["Communicating in Chinese", "Understanding Chinese society and culture deeply", "Carrying meaning accurately between two languages"],
    compare: [
      { with: "Chinese Studies", diff: "Chinese Studies puts more weight on area studies such as Chinese politics, economy and society, while Chinese Language and Literature puts more weight on the Chinese language and literature (this may differ by university)." },
    ],
    after: "Graduates go into China-related fields such as trade and logistics companies, tourism and airlines, interpreting and translation, and public institutions. Those who complete a teaching certificate course can also become Chinese teachers. Some go to a graduate school of interpretation and translation or to graduate school for Chinese literature or area studies, and students also prepare language test scores such as the HSK.",
    hs: [
      "Research words that use the same Chinese characters in Korean and Chinese but have different meanings",
      "Check the Chinese translations of tourist information signs in Gyeongnam and suggest improvements",
      "Collect examples of Chinese four-character idioms that remain in everyday Korean expressions",
    ],
    faq: [
      { q: "I didn't learn Chinese in high school. Is that OK?", a: "Most students learn the basics, starting with pronunciation, in the first year, so it's fine to start from zero. Still, learning the basics in advance makes it much easier to adjust." },
      { q: "Do I need to know many Chinese characters?", a: "Chinese uses simplified characters, so many look different from the characters learned in Korea. Knowing Chinese characters helps, but learning them at university is enough." },
    ],
  },

  politics: {
    intro: "The Department of Political Science and International Relations studies how power is created and used, and how countries cooperate and come into conflict. It helps you understand decisions that greatly affect our lives, such as elections, diplomacy and international disputes, and find better solutions.",
    questions: [
      "What do people look at when choosing a candidate in an election?",
      "Why do countries sometimes cooperate and sometimes come into conflict?",
      "Why are problems like the climate crisis hard for one country to solve alone?",
    ],
    tracks: [
      { name: "International Politics and Diplomacy", d: "Analyze relations between countries, foreign policy, security and the role of international organizations." },
      { name: "Comparative Politics", d: "Compare the political systems, elections and parties of different countries." },
      { name: "Political Thought", d: "Explore key political ideas and concepts such as democracy, freedom and equality." },
      { name: "Korean Politics", d: "Study Korea's political system, elections and changes in political culture." },
    ],
    years: [
      "Year 1: Learn the basic concepts of politics through Introduction to Political Science and an introduction to international relations.",
      "Year 2: Learn key courses in each area, such as comparative politics, political thought and diplomatic history.",
      "Year 3: Take advanced courses such as area studies, security, and public opinion and election analysis, and hold discussions.",
      "Year 4: Analyze a topic of interest yourself through seminars and a graduation thesis.",
    ],
    skills: ["Analyzing social problems from different points of view", "Debating and persuading with evidence", "Interpreting international news and data"],
    compare: [
      { with: "Public Administration", diff: "Political Science and International Relations mainly deals with power, elections and international relations before a policy is decided, while Public Administration mainly deals with how the government actually runs decided policies." },
    ],
    after: "Graduates go into civil service, public institutions, media, political parties and civic groups, and the external relations departments of companies. Some take national exams such as the diplomat candidate selection exam. Many also go to graduate school aiming for international organizations or research jobs.",
    hs: [
      "Compare voter turnout by age group in local elections and suggest ways to increase participation",
      "After a Model UN activity, analyze how countries' positions on an international issue differ",
      "Compare how different news outlets report the same political news",
    ],
    faq: [
      { q: "Is this department only for people who want to become politicians?", a: "No. Graduates go to many places such as civil service, media, international organizations and companies, and you don't need a specific major to become a politician." },
      { q: "Do I need to be good at foreign languages?", a: "Foreign languages are important if you want to work in diplomacy or international fields. Many classes also involve reading English materials, so building your English steadily helps." },
    ],
  },

  "public-admin": {
    intro: "The Department of Public Administration teaches how the government, local governments and public institutions make policies, manage budgets and people, and provide public services. It thinks about how to run things that touch our daily lives better, such as bus routes, welfare and disaster response.",
    questions: [
      "What is a fair way to decide where and how much tax money is spent?",
      "Why does the same policy succeed in some regions and fail in others?",
      "How can regions with shrinking populations keep their public services?",
    ],
    tracks: [
      { name: "Policy Studies", d: "Learn how to define social problems and design and evaluate policies." },
      { name: "Organization and Personnel Administration", d: "Deal with the structure of public organizations and the hiring, training and evaluation of civil servants." },
      { name: "Public Finance Administration", d: "Study how government budgets are planned, spent and checked." },
      { name: "Local Government and Urban Administration", d: "Explore how local governments are run and regional development policies." },
    ],
    years: [
      "Year 1: Learn the basic concepts of the public sector through Principles of Public Administration and social science basics.",
      "Year 2: Learn key courses such as policy studies, organization theory and administrative law.",
      "Year 3: Study public finance administration, local government, and policy analysis methods and statistics.",
      "Year 4: Do seminars analyzing real policy cases and a graduation project, and prepare for your career.",
    ],
    skills: ["Defining social problems and designing solutions", "Examining policy effects with data and statistics", "Balancing different interests"],
    compare: [
      { with: "Political Science and International Relations", diff: "Public Administration focuses on how the government actually runs and manages policies, while Political Science and International Relations deals more broadly with power, elections and international relations." },
      { with: "Police Administration", diff: "Police Administration specializes in public safety and responding to crime, while Public Administration covers public administration as a whole." },
    ],
    after: "Graduates prepare for national and local civil service exams or go into public institutions, policy research institutes, and the government relations and planning departments of companies. Some go to graduate school, such as a graduate school of public administration, to become policy experts or researchers.",
    hs: [
      "Use population statistics for your region to predict how many schools and welfare facilities will be needed in the future",
      "Research the problems with bus routes in your neighborhood and write a policy proposal to improve them",
      "Research your local government's youth policies and analyze satisfaction with a survey of your peers",
    ],
    faq: [
      { q: "Do I have to graduate from Public Administration to become a civil servant?", a: "No. Anyone can take the civil service exam regardless of major. But some of what you learn in this department connects to exam subjects and real work." },
      { q: "Do we also learn math or statistics?", a: "Yes. Statistics are used to analyze policy effects, so there are often basic statistics classes. The ability to interpret data matters more than difficult math." },
    ],
  },

  law: {
    intro: "The Department of Law teaches how laws, the rules of society such as constitutional, civil and criminal law, are made and interpreted. Law is the standard for settling disputes between people fairly and protecting rights, so understanding it helps you know deeply how society works.",
    questions: [
      "Why do people interpret the same legal provision differently?",
      "What legal problems can happen if you use someone else's photo online?",
      "Who owns the copyright of a picture made by AI?",
    ],
    tracks: [
      { name: "Public Law", d: "Learn laws that deal with the relationship between the state and its people, such as constitutional and administrative law." },
      { name: "Civil Law", d: "Deal with rights and duties between people, such as contracts, property and family relationships." },
      { name: "Criminal Law", d: "Study crimes and punishments and the procedures of investigations and trials." },
      { name: "Business and Intellectual Property Law", d: "Deal with laws related to economic activity, such as running a company, copyright and patents." },
    ],
    years: [
      "Year 1: Learn the legal system and terms through Introduction to Law and the basics of constitutional law.",
      "Year 2: Study basic law courses in depth, such as General Civil Law and General Criminal Law.",
      "Year 3: Take advanced courses such as administrative law, commercial law and procedural law, and analyze court cases.",
      "Year 4: Apply the law to real problems through mock trials, case practice and seminars.",
    ],
    skills: ["Organizing complex facts", "Making logical arguments with evidence", "Reading long legal documents accurately"],
    compare: [
      { with: "Law School", diff: "The Department of Law is an undergraduate program. To become a lawyer, you must go to law school after university and pass the bar exam (you can apply to law school with any undergraduate major)." },
      { with: "Police Administration", diff: "Police Administration specializes in police work and responding to crime, while Law teaches the theory and interpretation of law as a whole." },
    ],
    after: "Graduates go to law school to prepare to become lawyers, or go into civil service, public institutions and corporate legal departments. Some take national qualification exams that require legal knowledge, such as those for judicial scriveners, labor attorneys and customs brokers.",
    hs: [
      "Compare school rules with the basic rights in the Constitution and suggest improvements",
      "Summarize copyright issues around AI-generated pictures using cases from Korea and abroad",
      "Choose a real court case, write a mock trial script and analyze the reasons for the ruling",
    ],
    faq: [
      { q: "Can I become a lawyer right after graduating from the Department of Law?", a: "No. Today, you must go to law school after university, finish the program and pass the bar exam to become a lawyer." },
      { q: "Is there really a lot to memorize?", a: "You need to learn terms and legal provisions, but what matters more is the ability to apply the law to cases and judge logically. A habit of reading and organizing regularly helps." },
    ],
  },

  "police-admin": {
    intro: "The Department of Police Administration teaches, in both theory and practice, why crimes happen, how to prevent and investigate them, and how to run police organizations. Keeping citizens safe is the basis of a working society, so public safety workers with expert knowledge are truly needed.",
    questions: [
      "What kind of environment helps reduce crime?",
      "How do we track new crimes such as voice phishing scams?",
      "How should people's rights be protected during investigations?",
    ],
    tracks: [
      { name: "Police Studies", d: "Learn the role and organization of the police and the legal basis of police work." },
      { name: "Criminology", d: "Study the causes and types of crime and ways to reduce it." },
      { name: "Criminal Law and Investigation", d: "Study criminal law, criminal procedure law and the steps of collecting evidence and investigating." },
      { name: "Public Safety Policy and Safety Management", d: "Deal with local safety strategies, disaster and safety management, and corrections and probation systems." },
    ],
    years: [
      "Year 1: Build the basics with Introduction to Policing, the basics of law and an introduction to social science.",
      "Year 2: Learn key courses such as criminal law, criminology and police administrative law.",
      "Year 3: Take advanced and practical courses such as criminal procedure law, investigation theory and crime analysis.",
      "Year 4: Take case study and field practice courses, and prepare for recruitment exams or your career.",
    ],
    skills: ["Judging situations based on the law", "Analyzing crime with data", "Sense of responsibility and handling crisis situations"],
    compare: [
      { with: "Law", diff: "Law teaches the law as a whole, while Police Administration focuses on criminal law, police practice and criminology." },
      { with: "Public Administration", diff: "Public Administration covers all of public administration, while Police Administration specializes in public safety administration." },
    ],
    after: "Graduates prepare for police officer recruitment exams (open recruitment, and career-based competitive recruitment for graduates of police administration and others) or go into corrections and probation civil service and security and protection companies. Some go to graduate school to research criminology or investigation.",
    hs: [
      "Research dangerous places around your school and suggest ideas for designing environments that prevent crime",
      "Research how voice phishing methods have changed and make card news for your peers to prevent it",
      "Write a debate report on cases where installing CCTV conflicts with protecting personal data",
    ],
    faq: [
      { q: "Will I definitely become a police officer if I graduate from this department?", a: "No. Even after graduating, you must pass the recruitment exam (written test, fitness test, interview and more) to become a police officer. But there is a separate recruitment route for graduates of this department." },
      { q: "Is physical fitness important?", a: "Police recruitment includes a fitness test, so keeping fit regularly is important. The coursework itself is mostly law and social science theory." },
    ],
  },

  media: {
    intro: "The Department of Media and Communication studies how media such as news, broadcasting, advertising and YouTube are made and how they affect people's thoughts and actions. In an age when anyone can make and spread content, it is important to understand media well and make it responsibly.",
    questions: [
      "Why does fake news spread faster than real news?",
      "How does a recommendation algorithm choose the videos I see?",
      "How does a good advertisement move people's hearts?",
    ],
    tracks: [
      { name: "Journalism", d: "Learn news gathering and reporting, article writing and media ethics." },
      { name: "Advertising and PR", d: "Study advertising planning and the PR strategies of companies and organizations." },
      { name: "Video and Digital Content", d: "Plan, shoot and edit videos and make content for digital platforms." },
      { name: "Media Theory and Culture", d: "Study the effects of media on society and culture." },
    ],
    years: [
      "Year 1: Learn the basic concepts through communication theory and an introduction to media.",
      "Year 2: Take courses in each area, such as journalism, advertising and PR, and the basics of video production.",
      "Year 3: Choose an area of interest and learn reporting, planning and production practice and media research methods.",
      "Year 4: Complete a graduation work or research project and organize your portfolio.",
    ],
    skills: ["Planning and delivering messages", "Reading media information critically", "Making video and written content", "Researching and analyzing how people respond"],
    compare: [
      { with: "Advertising and Public Relations", diff: "Advertising and Public Relations focuses on advertising and PR, while Media and Communication covers a wider range, including news, broadcasting and new media." },
      { with: "Film and Video", diff: "Film and Video puts more weight on creating and producing videos in practice, while Media and Communication puts more weight on media theory and research on social effects." },
    ],
    after: "Graduates go into newspapers and broadcasters, advertising and PR agencies, corporate PR and marketing departments, and content production companies, and some prepare separately for media company entrance exams. Some go to graduate school to become media researchers.",
    hs: [
      "Compare news headlines about the same event by news outlet and analyze differences in framing",
      "Record your video recommendation list for a week and explore the features of the algorithm",
      "Plan and make a short promotional video for a local festival and survey reactions",
    ],
    faq: [
      { q: "Do I need to know how to edit videos in advance?", a: "It is not required. You learn production in university practice classes, but trying it in advance helps you check if it suits you and build a portfolio." },
      { q: "Do I need this department to become a YouTuber?", a: "You can become a YouTuber with any major. In this department, you can systematically learn content planning, media ethics, audience analysis and more." },
    ],
  },

  psychology: {
    intro: "The Department of Psychology studies the human mind and behavior using scientific methods such as experiments, observation and statistics. Knowledge for understanding memory, emotion, learning and relationships is used not only in counseling but in many fields such as education, business and technology development.",
    questions: [
      "Does staying up all night studying before a test really help memory?",
      "Why do people tend to follow the opinion of the majority?",
      "How do smartphone notifications affect our concentration?",
    ],
    tracks: [
      { name: "Cognitive Psychology", d: "Study how information is processed in the mind, such as memory, attention and judgment." },
      { name: "Developmental Psychology", d: "Explore how the mind changes as people grow, from babies to old age." },
      { name: "Social Psychology", d: "Study how other people and groups affect an individual's thoughts and actions." },
      { name: "Clinical and Counseling Psychology", d: "Learn how to understand and help with mental difficulties." },
      { name: "Industrial and Organizational Psychology", d: "Deal with motivation and leadership at work and designing products that suit people." },
    ],
    years: [
      "Year 1: Get a taste of the many areas of psychology through Introduction to Psychology.",
      "Year 2: Learn psychological statistics and research methods, and take basic courses such as developmental, social and cognitive psychology.",
      "Year 3: Take advanced courses such as counseling, abnormal psychology and physiological psychology, and classes where you design your own experiments.",
      "Year 4: Carry out research on a topic of interest and write a graduation thesis or report.",
    ],
    skills: ["Observing human behavior objectively", "Designing experiments and analyzing them with statistics", "Understanding and empathizing with other people's points of view"],
    compare: [
      { with: "Counseling Psychology", diff: "Counseling Psychology focuses on counseling practice, while Psychology scientifically studies the whole mind, including cognition, development and social behavior." },
      { with: "Psychiatry (Medicine)", diff: "Psychiatrists go through medical school and can diagnose and prescribe medicine, while psychology majors mainly provide non-drug help such as psychological assessment, counseling and psychotherapy." },
    ],
    after: "Graduates go into corporate HR, marketing and UX research, public institutions and education, and some use their data analysis skills. To become a counseling or clinical psychology expert, people usually go to graduate school, complete training and prepare for related qualifications.",
    hs: [
      "Check with a simple experiment how listening to music while studying affects memory",
      "Analyze a survey on the relationship between classmates' smartphone use and sleep time",
      "Collect examples of the majority effect in advertising and explain them with social psychology theory",
    ],
    faq: [
      { q: "Do we also learn math in psychology?", a: "Yes, you must learn statistics to analyze experiment results. A sense for statistics to interpret data matters more than difficult math." },
      { q: "Can I become a counselor right after graduating?", a: "It is hard to become a professional counselor or clinical psychologist with only an undergraduate degree, and most people go through graduate school and training. In undergraduate study, you learn basic theory and research methods." },
    ],
  },

  "social-welfare": {
    intro: "The Department of Social Welfare teaches the systems and practical methods that help people in difficulty enjoy a basic life. The work supports the lives of many kinds of people, such as children, older people, people with disabilities and families, so it requires expert knowledge as well as empathy.",
    questions: [
      "How can the local community help older people who live alone and feel lonely?",
      "Why do welfare benefits sometimes fail to reach the people who need them most?",
      "What systems do we need to build a society where everyone lives together?",
    ],
    tracks: [
      { name: "Social Work Practice", d: "Learn counseling and case management methods to meet individuals and families, understand their problems and help them." },
      { name: "Social Welfare Policy", d: "Study how welfare systems, laws and budgets are made and run." },
      { name: "Welfare for Specific Groups", d: "Deal with support suited to each group, such as children and youth, older people, people with disabilities and multicultural families." },
      { name: "Community Welfare", d: "Learn how to connect local resources and solve problems together with residents." },
    ],
    years: [
      "Year 1: Take basic courses such as Introduction to Social Welfare and Human Behavior and the Social Environment.",
      "Year 2: Learn key courses such as social work practice and social welfare policy.",
      "Year 3: Learn welfare for specific groups and program development, and do field practice at welfare organizations.",
      "Year 4: Finish courses such as social welfare law and research methods, and prepare for the national exam or a job.",
    ],
    skills: ["Listening well to others and empathizing", "Understanding problems and connecting people to the support they need", "Planning and evaluating welfare programs"],
    compare: [
      { with: "Youth Studies", diff: "Youth Studies focuses on the growth of young people and guiding their activities, while Social Welfare widely covers many groups across the whole lifespan and welfare systems." },
    ],
    after: "If you complete the required courses and field practice, you receive the level 2 social worker qualification and can take the national exam for level 1. Graduates work at welfare centers, public institutions, medical institutions and welfare foundations, or prepare for the social welfare civil service exam.",
    hs: [
      "Mark welfare facilities in your neighborhood on a map and find areas that lack them",
      "Based on volunteering at a senior welfare center, plan a digital skills program for older people",
      "Research barriers in your school (such as stairs and door sills) and suggest improvements for everyone",
    ],
    faq: [
      { q: "Do I need to do a lot of volunteering?", a: "What you felt and learned matters more than how many times. Experience meeting a group you are interested in regularly helps you decide your career." },
      { q: "Isn't the work often emotionally hard?", a: "You face other people's difficulties up close, so it is not always easy. That is why university teaches you self-care along with professional methods." },
    ],
  },

  business: {
    intro: "The Department of Business Administration teaches how companies and organizations manage people, money and information and make strategies to reach their goals. Every organization needs management, not just companies but also hospitals, public institutions and startups, so there are many places to use what you learn.",
    questions: [
      "With the same product, why does one company succeed and another fail?",
      "What do people look at when deciding to buy something?",
      "How is a company where employees enjoy working created?",
    ],
    tracks: [
      { name: "Marketing", d: "Learn strategies for understanding consumers and promoting and selling products." },
      { name: "Finance", d: "Study how companies raise, invest and manage money." },
      { name: "Accounting", d: "Learn how to record a company's activities in numbers and read financial statements." },
      { name: "HR and Organization", d: "Deal with hiring and developing people and running organizations." },
      { name: "Operations and Management Information", d: "Study product manufacturing and supply, and using data and information systems." },
    ],
    years: [
      "Year 1: Build the basics with Principles of Management, Principles of Economics, and business math and statistics.",
      "Year 2: Learn key courses in each area, such as Principles of Accounting, Marketing and Organizational Behavior.",
      "Year 3: Analyze real company cases in advanced courses such as Financial Management, HR Management and Business Strategy.",
      "Year 4: Bring together what you learned through team projects and case studies, and prepare for your career.",
    ],
    skills: ["Analyzing problems and making strategies", "Making decisions with numbers and data", "Working in teams and giving presentations"],
    compare: [
      { with: "Economics", diff: "Business Administration focuses on how to run one company or organization well, while Economics analyzes how markets and the national economy work as a whole." },
      { with: "Accounting", diff: "Accounting teaches accounting, tax and auditing in depth, while Business Administration teaches management widely, including accounting, marketing, finance and HR." },
    ],
    after: "Graduates go into the planning, marketing, finance and HR departments of companies, financial institutions, consulting, or start their own businesses. Some prepare for qualifications such as certified public accountant or management consultant, or go to graduate school, such as an MBA program.",
    hs: [
      "Run a school festival booth and analyze the effect of your pricing strategy using sales records",
      "Choose a company in Gyeongnam and write a case report on its growth and business strategy",
      "Survey your friends' spending habits and explore how social media ads affect purchases",
    ],
    faq: [
      { q: "Does Business Administration use a lot of math too?", a: "It uses quite a lot of math in statistics, finance and accounting. Understanding probability and statistics well helps especially in university classes." },
      { q: "Is it only for people who want to become company owners?", a: "No. Most graduates work in various departments of companies or organizations, and starting a business is one of many career paths." },
    ],
  },

  economics: {
    intro: "The Department of Economics analyzes how people, companies and governments choose and share limited resources, and why prices, interest rates and jobs change. It is a field that uses math and data to explain economic events and find better policies.",
    questions: [
      "Why do prices rise, and how do interest rates affect our lives?",
      "What happens to jobs when the minimum wage changes?",
      "Is trade between countries good for everyone?",
    ],
    tracks: [
      { name: "Microeconomics", d: "Analyze how consumers and companies make choices and how market prices are set." },
      { name: "Macroeconomics", d: "Deal with the economy of a whole country, such as economic growth, prices, unemployment and interest rates." },
      { name: "Econometrics", d: "Learn how to test and predict economic theories with statistics and data." },
      { name: "International and Financial Economics", d: "Study how exchange rates, trade and financial markets work." },
      { name: "Public and Labor Economics", d: "Analyze policy issues such as taxes, welfare and jobs with economics." },
    ],
    years: [
      "Year 1: Learn the basic concepts and tools through Principles of Economics and mathematics for economics.",
      "Year 2: Learn key theories such as microeconomics, macroeconomics and economic statistics.",
      "Year 3: Study econometrics and applied areas such as financial, international and labor economics.",
      "Year 4: Do a seminar or graduation thesis analyzing economic problems with data.",
    ],
    skills: ["Explaining economic events with mathematical models", "Analyzing data to find evidence", "Weighing the pros and cons of policies"],
    compare: [
      { with: "Business Administration", diff: "Economics analyzes how markets and the national economy work as a whole, while Business Administration teaches more practical ways to run individual companies." },
      { with: "International Trade and Commerce", diff: "International Trade and Commerce puts more weight on trade practice and international business, while Economics puts more weight on economic theory and analysis methods." },
    ],
    after: "Graduates go into financial institutions such as banks, securities firms and insurance companies, economic research institutes, the planning and analysis departments of companies, and public institutions, and some prepare for civil service exams or qualifications such as certified public accountant. Many also go to graduate school to become economic researchers or experts.",
    hs: [
      "Graph local price data for the last few years and explore the causes of change",
      "Research how sales change when school store prices change and check the law of demand",
      "Analyze how exchange rate changes affect exporting companies in Gyeongnam using news materials",
    ],
    faq: [
      { q: "Do I need to be good at math?", a: "Yes, calculus and statistics are used a lot. If you study calculus and probability and statistics well in high school, university classes will be much easier." },
      { q: "Will I become good at investing in stocks?", a: "Economics is a field that teaches how markets work, not secret investment tips. But it will certainly broaden your view for understanding economic news." },
    ],
  },

  accounting: {
    intro: "The Department of Accounting teaches how to record how a company's money comes in and goes out, and how to analyze and verify that information. Accurate accounting information is the basis for investors, governments and companies to make the right decisions, so it is important work that protects trust.",
    questions: [
      "How can we tell from numbers whether a company is making money well?",
      "By what standards are taxes calculated?",
      "How can accounting fraud be found and stopped?",
    ],
    tracks: [
      { name: "Financial Accounting", d: "Learn how to organize a company's financial condition and results into financial statements." },
      { name: "Management and Cost Accounting", d: "Calculate the cost of products and deal with information used for decisions inside the company." },
      { name: "Tax Accounting", d: "Study how to calculate the taxes of companies and individuals based on tax law." },
      { name: "Auditing", d: "Learn how to independently check whether accounting information is accurate." },
    ],
    years: [
      "Year 1: Take basic courses such as Principles of Accounting, Principles of Management and Principles of Economics.",
      "Year 2: Learn key accounting courses such as Intermediate Accounting and Cost Accounting.",
      "Year 3: Study advanced courses such as Tax Law, Management Accounting and Financial Management.",
      "Year 4: Learn Auditing, Advanced Accounting and more, and prepare for qualification exams or a job.",
    ],
    skills: ["Handling numbers carefully and accurately", "Reading and analyzing financial statements", "Making judgments while following rules and ethics"],
    compare: [
      { with: "Business Administration", diff: "Business Administration teaches management widely, such as marketing and HR, while Accounting teaches accounting, tax and auditing in depth." },
      { with: "Taxation", diff: "Taxation focuses more on tax law and tax practice, while Accounting covers all of accounting, including financial accounting and auditing." },
    ],
    after: "Graduates go into corporate finance and accounting departments, accounting firms, tax firms and financial institutions. The CPA exam has requirements such as a set number of credits in accounting, tax, business and economics courses and an English test score, and many students also prepare for the tax accountant exam.",
    hs: [
      "Record your club's income and spending for a year in a ledger and make a budget plan",
      "Read the published financial statements of a company you are interested in and analyze changes over several years",
      "Research a real accounting fraud case and summarize the role of the audit system",
    ],
    faq: [
      { q: "Do I need to be fast at calculating?", a: "Computers do most of the calculating, but the ability to check numbers carefully and interpret their meaning is important." },
      { q: "Do I have to graduate from Accounting to become a CPA?", a: "No. You can take the exam with any major if you meet the required course credits and English score. But in the Department of Accounting, you naturally complete these courses." },
    ],
  },

  trade: {
    intro: "The Department of International Trade and Commerce teaches how goods and services move between countries and the rules and negotiations around them. In Korea, where exports and imports make up a large part of the economy, trade experts are needed in many industries.",
    questions: [
      "What journey did the imported fruit I bought take to reach my home?",
      "Why do countries agree to put taxes on imports or remove them?",
      "When a problem happens in an overseas deal, who solves it and how?",
    ],
    tracks: [
      { name: "Trade Practice", d: "Learn the real steps of a deal, such as import/export contracts, transport, payment and customs clearance." },
      { name: "International Commerce", d: "Study free trade agreements, trade rules and trade negotiations." },
      { name: "International Business", d: "Deal with the strategy and management of companies entering overseas markets." },
      { name: "International Finance and Logistics", d: "Study exchange rates, overseas payments, international transport and supply chains." },
    ],
    years: [
      "Year 1: Build the basics with Principles of Trade, Principles of Economics and business foreign languages.",
      "Year 2: Learn key courses such as Trade Practice, International Economics and International Business.",
      "Year 3: Take advanced courses such as International Trade Law, trade payments and international logistics.",
      "Year 4: Do trade case analysis or a mock trade project and prepare for your career.",
    ],
    skills: ["Doing business and communicating in foreign languages", "Reading trends in the global economy", "Checking contracts and rules carefully"],
    compare: [
      { with: "Economics", diff: "Economics teaches economic theory and analysis methods in depth, while International Trade and Commerce focuses more on real trade procedures and international deals." },
      { with: "Logistics", diff: "Logistics focuses on making the process of transporting and storing goods efficient, while International Trade and Commerce mainly deals with trade contracts and trade rules." },
    ],
    after: "Graduates go into import/export companies, trade and logistics companies, foreign companies, financial institutions and trade-related public institutions. Some prepare for national qualifications such as customs broker or related ones such as international trade specialist, and some go to graduate school to become trade experts.",
    hs: [
      "Research Gyeongnam's main export products and make a map of the countries they are exported to",
      "Explore how free trade agreements have affected imported farm products on our tables",
      "Calculate how overseas online shopping prices change when exchange rates change",
    ],
    faq: [
      { q: "Do I need to be good at foreign languages?", a: "Trade involves a lot of communication with other countries, so foreign language skills such as English help a lot. Many students also learn a second foreign language such as Chinese or Japanese." },
      { q: "Do I need math too?", a: "Basic math and statistics are used to calculate prices, exchange rates and transport costs and for economic analysis. The ability to handle numbers accurately matters more than very difficult math." },
    ],
  },

  "logistics-major": {
    intro: "The Department of Logistics teaches how to make the transport, storage and delivery of goods from factories to consumers faster and more efficient. As online shopping and international trade grow, logistics plays a role like the blood vessels that keep the economy moving.",
    questions: [
      "How can a parcel I ordered arrive in just one day?",
      "In what order is cargo loaded onto and unloaded from a huge container ship?",
      "How can we reduce the carbon released during logistics?",
    ],
    tracks: [
      { name: "Supply Chain Management", d: "Learn how to manage the whole flow efficiently, from getting raw materials to production and sales." },
      { name: "Port and Shipping Logistics", d: "Study port operations and transporting cargo by sea." },
      { name: "Warehouse and Distribution Logistics", d: "Deal with running logistics centers, managing inventory and delivery systems." },
      { name: "Logistics Data and Smart Logistics", d: "Learn how to improve logistics with data analysis and automation technology." },
    ],
    years: [
      "Year 1: Learn Introduction to Logistics, the basics of business and economics, and basic statistics.",
      "Year 2: Take key courses such as Logistics Management, Transportation and Inventory Management.",
      "Year 3: Study advanced courses such as Supply Chain Management, Port Logistics and Logistics Data Analysis.",
      "Year 4: Do projects or field practice dealing with real logistics problems and prepare for your career.",
    ],
    skills: ["Planning complex flows efficiently", "Finding and improving problems with data", "Working with many companies and organizations"],
    compare: [
      { with: "International Trade and Commerce", diff: "International Trade and Commerce focuses on trade contracts and trade rules, while Logistics focuses on making the actual moving and storing of goods efficient." },
      { with: "Industrial Engineering", diff: "Industrial Engineering uses engineering to improve production and service systems as a whole, while Logistics specializes in transport and supply chains." },
    ],
    after: "Graduates go into port and shipping companies, parcel and logistics companies, retail companies, the purchasing and logistics departments of manufacturers, and related public institutions. Some prepare for national qualifications such as certified logistics manager or go to graduate school in logistics and supply chains.",
    hs: [
      "Track the route of one parcel and analyze the time spent at each logistics step",
      "Research how ingredients for school lunches arrive and draw a supply chain diagram",
      "Research the role of ports in Gyeongnam and Busan and summarize their relationship with the local economy",
    ],
    faq: [
      { q: "Does the Department of Logistics teach how to carry heavy loads?", a: "No. It is a department where you learn how to plan and manage the flow of goods, analyze data and run systems." },
      { q: "Which subjects are good to be strong in?", a: "Economics and probability and statistics help, and English is also important because you often communicate with other countries." },
    ],
  },

  tourism: {
    intro: "The Department of Tourism Management looks at travel and the tourism industry through the eyes of business and teaches hotels, airlines, travel agencies, local tourism development and more. Tourism is an industry that helps local economies and promotes culture, so experts who understand both people and places are needed.",
    questions: [
      "Why do people choose the places they travel to?",
      "How do local residents' lives change when more tourists come?",
      "How can we turn the unique charm of our region into tourism products?",
    ],
    tracks: [
      { name: "Hotel and Food Service Management", d: "Learn the operation and services of hotels, resorts and restaurant businesses." },
      { name: "Travel and Airline Services", d: "Study planning travel products and running airlines and travel agencies." },
      { name: "Tourism Marketing", d: "Deal with strategies to promote tourist spots and attract tourists." },
      { name: "Local Tourism Development", d: "Learn how to plan sustainable tourism using local resources." },
    ],
    years: [
      "Year 1: Build the basics with Principles of Tourism, Principles of Management and foreign languages for tourism.",
      "Year 2: Learn key courses such as Hotel Management, travel agency management and tourist consumer behavior.",
      "Year 3: Take advanced courses such as Tourism Marketing, tourism development, and event and festival planning.",
      "Year 4: Do field practice or a tourism product planning project and prepare for your career.",
    ],
    skills: ["Thinking about service from the customer's point of view", "Planning tourism products and events", "Communicating in foreign languages"],
    compare: [
      { with: "Hotel Management", diff: "Hotel Management focuses on running hotels and restaurants, while Tourism Management covers the whole tourism industry, including travel agencies, airlines and local tourism development." },
      { with: "Airline Services", diff: "Airline Services focuses on practical airline service work such as cabin crew, while Tourism Management focuses on the management and planning of the tourism industry." },
    ],
    after: "Graduates go into hotels, airlines, travel agencies, theme parks, local government tourism departments and tourism-related public institutions. Some prepare for national qualifications such as tourist interpreter guide, domestic tour guide and hotel manager, or go to graduate school in tourism.",
    hs: [
      "Plan a one-day course for foreign tourists at a Gyeongnam tourist spot such as Tongyeong, Namhae or Geoje",
      "Analyze satisfaction and areas for improvement with a survey of visitors to a local festival",
      "Compare cases from Korea and abroad of how more tourists affected residents' lives",
    ],
    faq: [
      { q: "Do I need to have traveled a lot?", a: "Not necessarily. Looking around nearby areas with interest and thinking about why people visit them is also a meaningful experience." },
      { q: "Are foreign languages important?", a: "You often meet foreign tourists, so foreign languages such as English, Chinese or Japanese are a big strength." },
    ],
  },

  math: {
    intro: "The Department of Mathematics explores numbers, shapes, change and structure with logic and teaches how to prove why things are true. Math is the common language of science, engineering, finance and AI, so a deep understanding connects you to many fields.",
    questions: [
      "Can infinity be counted, and do infinities have different sizes?",
      "How does math protect passwords on the internet?",
      "What math rules are hidden in patterns in nature, such as petals and spirals?",
    ],
    tracks: [
      { name: "Analysis", d: "Deal rigorously with the principles of limits, derivatives and integrals." },
      { name: "Algebra", d: "Study the structure of numbers and operations and the properties of equations in an abstract way." },
      { name: "Geometry and Topology", d: "Explore the properties of space and shapes, including properties that do not change under continuous change." },
      { name: "Applied Mathematics", d: "Learn how to use math for real problems, such as numerical analysis, probability and optimization." },
    ],
    years: [
      "Year 1: Learn how to write proofs through calculus, basic linear algebra and foundations of mathematics.",
      "Year 2: Learn key courses such as analysis, linear algebra and differential equations.",
      "Year 3: Take abstract advanced courses such as modern algebra, topology and complex analysis.",
      "Year 4: Do seminars and a graduation project in your area of interest, and broaden your career options with applied or teaching courses.",
    ],
    skills: ["Proving and reasoning logically", "Abstraction to turn complex problems into simple structures", "Persistence to keep working on a problem"],
    compare: [
      { with: "Mathematics Education", diff: "Mathematics Education teaches education studies and teaching methods together to train math teachers, while Mathematics studies math theory itself in depth." },
      { with: "Statistics", diff: "Statistics focuses on methods for collecting and analyzing data, while Mathematics covers the structures and proofs of math more widely." },
    ],
    after: "Graduates go into finance and insurance, data analysis, IT and AI, and research institutes, and if you complete a teaching certificate course, you can take the math teacher recruitment exam. Some go to graduate school to become math researchers or prepare for qualification exams such as actuary.",
    hs: [
      "Express waiting time in the school lunch line as a math model and find ways to shorten it",
      "Write a research report explaining how codes work using the properties of prime numbers",
      "Find and analyze the Fibonacci sequence in the arrangement of pine cones and sunflower seeds",
    ],
    faq: [
      { q: "Is university math very different from high school math?", a: "Yes. At university, proving why something is true matters more than solving problems quickly. It feels unfamiliar at first, but understanding concepts deeply is very rewarding." },
      { q: "Do I need to learn coding too?", a: "It is not required, but it helps a lot if you want to go into data, finance or AI. Many students also learn programming." },
    ],
  },

  statistics: {
    intro: "The Department of Statistics teaches how to collect and analyze data to reach reliable conclusions. Statistics is the basis of almost everywhere data is used, from opinion polls and new drug trials to weather forecasts and AI.",
    questions: [
      "How can a poll of only a few thousand people tell us what everyone thinks?",
      "How do we check whether a new medicine really works?",
      "How can graphs mislead people?",
    ],
    tracks: [
      { name: "Mathematical Statistics", d: "Use probability theory to show mathematically why statistical methods are correct." },
      { name: "Applied Statistics", d: "Learn how to analyze real data with methods such as regression analysis and experimental design." },
      { name: "Data Mining and Statistical Learning", d: "Study how to find patterns in large data and build prediction models." },
      { name: "Survey Methods and Biostatistics", d: "Deal with designing surveys and analyzing data in medicine and life sciences." },
    ],
    years: [
      "Year 1: Learn basic statistics, calculus and the basics of programming.",
      "Year 2: Take key courses such as probability theory, mathematical statistics and statistical programming.",
      "Year 3: Study applied courses such as regression analysis, experimental design, sample surveys and data mining.",
      "Year 4: Do a project analyzing real data and present the results in a report.",
    ],
    skills: ["Organizing and analyzing data", "Explaining analysis results simply with graphs and words", "Using statistics software and coding", "Noticing errors or distortions in numbers"],
    compare: [
      { with: "Data Science", diff: "Data Science mixes statistics and computer technology to teach practical data processing and use of AI, while Statistics deals more deeply with the mathematical principles of analysis methods." },
      { with: "Mathematics", diff: "Mathematics widely studies the structures and proofs of math, while Statistics focuses on methods for drawing conclusions from uncertain data." },
    ],
    after: "Graduates go into corporate data analysis departments, finance and insurance, polling and research organizations, public institutions and research institutes. Some prepare for national qualifications such as social survey analyst and big data analysis engineer, or go to graduate school to become professional analysts.",
    hs: [
      "Analyze the correlation between sleep time and how students feel about their grades with a survey at your school",
      "Collect misleading graphs from the news and redraw them correctly",
      "Analyze population changes by city and county in Gyeongnam with public data and predict future student numbers",
    ],
    faq: [
      { q: "Do I need to be good at math?", a: "Statistics is based on probability and calculus, so basic math skills are needed. It is especially good to have a solid grasp of probability and statistics concepts." },
      { q: "Do I have to code?", a: "These days most statistical analysis is done with computer programs, so you often learn coding. It's fine to learn it for the first time at university." },
    ],
  },

  physics: {
    intro: "The Department of Physics uses experiments and math to explore the most basic laws that move nature, such as the motion of objects, light, electricity and atoms. Many of today's technologies, such as semiconductors, lasers and medical imaging equipment, started from discoveries in physics.",
    questions: [
      "Is light a wave or a particle?",
      "How can a semiconductor switch electricity on and off?",
      "Does time really pass more slowly near a black hole?",
    ],
    tracks: [
      { name: "Condensed Matter Physics", d: "Study the properties of materials such as solids, closely linked to semiconductors and new materials." },
      { name: "Particle and Nuclear Physics", d: "Explore the properties of the smallest particles that make up matter and of atomic nuclei." },
      { name: "Optics and Quantum Physics", d: "Deal with the properties of light, quantum phenomena, lasers and quantum technology." },
      { name: "Astrophysics and Statistical Physics", d: "Explain events in space and the properties of systems made of many particles with the laws of physics." },
    ],
    years: [
      "Year 1: Build the basics of physics with general physics and labs and calculus.",
      "Year 2: Learn key theories such as mechanics, electromagnetism and mathematical physics.",
      "Year 3: Take quantum mechanics, thermal and statistical physics, and advanced physics lab courses.",
      "Year 4: Take courses in specific areas such as solid-state physics and optics, and do graduation research.",
    ],
    skills: ["Expressing and predicting events with math", "Designing experiments and analyzing errors", "Solving difficult problems with persistence"],
    compare: [
      { with: "Electronic Engineering", diff: "Electronic Engineering focuses on engineering to design and build electronic circuits and devices, while Physics focuses on science to study the laws of nature behind them." },
      { with: "Astronomy and Space Science", diff: "Astronomy and Space Science focuses on stars, galaxies and observing space, while Physics widely covers the laws of matter and energy in general." },
    ],
    after: "Graduates go into semiconductor and display, energy, and electronics and optics companies and research institutes, and if you complete a teaching certificate course, you can also become a physics teacher. Many go to graduate school aiming for research jobs.",
    hs: [
      "Measure pendulum motion with smartphone sensors and find the acceleration due to gravity",
      "Drop balls of different materials and compare their bounce height and energy loss",
      "Experiment with how a solar panel's angle changes the amount of electricity it produces",
    ],
    faq: [
      { q: "How good at math do I need to be?", a: "The laws of physics are handled with equations, so math such as calculus is used a lot. Studying calculus well in high school helps a lot." },
      { q: "Isn't the career path narrow if I don't become a researcher?", a: "The analytical and math skills you build in physics are used in many fields such as semiconductors, data and finance. Still, it is good to think about your career early." },
    ],
  },

  chemistry: {
    intro: "The Department of Chemistry studies what matter is made of and how substances change when they meet each other. Most things around us, such as batteries, medicines, cosmetics and plastics, start from chemical knowledge.",
    questions: [
      "How does a battery store electricity and then release it?",
      "How does biodegradable plastic break down?",
      "How does medicine find the right place in the body?",
    ],
    tracks: [
      { name: "Organic Chemistry", d: "Study the structures and reactions of compounds containing carbon, connected to medicines and polymers." },
      { name: "Inorganic Chemistry", d: "Deal with substances made of various elements, such as metals and minerals." },
      { name: "Physical Chemistry", d: "Explain chemical reactions and energy changes with the laws of physics and math." },
      { name: "Analytical Chemistry", d: "Learn how to measure accurately what is in a substance and how much." },
      { name: "Biochemistry", d: "Study the chemical reactions that happen inside living things." },
    ],
    years: [
      "Year 1: Build the basics with general chemistry and labs, calculus and general physics.",
      "Year 2: Take key courses and labs such as organic, analytical and physical chemistry.",
      "Year 3: Learn advanced courses such as inorganic chemistry, biochemistry and instrumental analysis.",
      "Year 4: Do graduation research in a lab or take applied courses such as polymer and materials chemistry.",
    ],
    skills: ["Doing experiments safely and accurately", "Analyzing results and reasoning about causes", "Picturing the structure of substances in your mind"],
    compare: [
      { with: "Chemical Engineering", diff: "Chemical Engineering is engineering that scales chemical reactions up to factory size and designs processes, while Chemistry is science that studies the principles of substances and reactions themselves." },
    ],
    after: "Graduates go into chemical and materials, battery, pharmaceutical, cosmetics and semiconductor companies and research institutes, and if you complete a teaching certificate course, you can also become a chemistry teacher. Many go to graduate school aiming for R&D jobs, and some prepare for national qualifications such as chemical analysis engineer.",
    hs: [
      "Compare the acidity of household products with natural indicators made from fruits and vegetables",
      "Check by experiment how much vitamin C is destroyed at different temperatures",
      "Compare and observe how biodegradable and regular plastics break down",
    ],
    faq: [
      { q: "Are there a lot of experiments?", a: "Yes, there are lab classes almost every semester. A habit of writing careful lab reports and following safety rules is important." },
      { q: "Is there a lot to memorize?", a: "You need to learn reactions and structures, but once you understand the principles, there is much less to memorize. Math and physics concepts are also used." },
    ],
  },

  biology: {
    intro: "The Department of Life Sciences studies life at many levels, from cells and genes to organs and ecosystems. Problems important to the future of people and the planet, such as treating diseases, food problems and protecting the environment, are connected to life sciences.",
    questions: [
      "Why do siblings born to the same parents look different?",
      "How do viruses get into the body and cause disease?",
      "How is climate change changing where living things live?",
    ],
    tracks: [
      { name: "Molecular and Cell Biology", d: "Study genes, proteins and what happens inside cells." },
      { name: "Genetics", d: "Explore how genetic information is passed on and appears as traits." },
      { name: "Physiology and Neuroscience", d: "Study how the body's organs and nervous system work." },
      { name: "Ecology and Evolution", d: "Study the relationship between living things and the environment and how living things have changed over time." },
    ],
    years: [
      "Year 1: Build the basics with general biology and labs and general chemistry.",
      "Year 2: Learn key courses such as cell biology, genetics and biochemistry.",
      "Year 3: Take advanced courses and labs such as molecular biology, physiology, microbiology and ecology.",
      "Year 4: Do graduation research in a lab or take advanced courses in your area of interest.",
    ],
    skills: ["Observing and asking questions about life", "Designing experiments and interpreting results", "Thinking carefully about bioethics"],
    compare: [
      { with: "Biotechnology", diff: "Biotechnology focuses on applying life science knowledge to develop medicines, food and farming technology, while Life Sciences studies the principles of life itself." },
    ],
    after: "Graduates go into bio and pharmaceutical companies, research institutes and food and environment organizations, and if you complete a teaching certificate course, you can also become a life science teacher. Many go to graduate school aiming for research jobs, and some go on to graduate schools in other professional fields.",
    hs: [
      "Observe seasonal changes in plants around your school and explore their relationship with climate",
      "Compare the number of bacteria after different handwashing methods with a culture experiment",
      "Write a debate report on uses of gene editing (CRISPR) technology and bioethics issues",
    ],
    faq: [
      { q: "I want to become a doctor. Can I go to Life Sciences?", a: "The usual path to becoming a doctor is going to a medical school (pre-medicine). Keep in mind that Life Sciences is not a program for training doctors but a department that studies life." },
      { q: "Do I also need to study chemistry?", a: "Yes. Life processes are made of chemical reactions, so chemistry is used a lot. It is good to study chemistry in high school as well." },
    ],
  },

  earth: {
    intro: "The Department of Earth and Environmental Sciences studies how the atmosphere, oceans and land affect each other to shape the Earth's environment. It helps you understand scientifically problems directly related to our lives and safety, such as climate change, earthquakes and fine dust.",
    questions: [
      "Where do typhoons form, and why are they getting stronger?",
      "Can earthquakes be predicted?",
      "How does the weather change when ocean temperatures rise?",
    ],
    tracks: [
      { name: "Atmospheric Science", d: "Study the principles of weather, climate and air pollution, and learn forecasting methods." },
      { name: "Oceanography", d: "Explore the movement and composition of seawater and changes in the ocean environment." },
      { name: "Geology and Geophysics", d: "Study changes in the land, such as rocks and rock layers, earthquakes and volcanoes." },
      { name: "Climate and Environmental Science", d: "Analyze and predict changes in the Earth's environment with climate models and data." },
    ],
    years: [
      "Year 1: Build the basics with an introduction to earth science, general physics and chemistry, and calculus.",
      "Year 2: Learn introductory courses in each area, such as atmospheric science, oceanography and geology.",
      "Year 3: Take advanced courses in your area of interest, fieldwork and observation, and data analysis practice.",
      "Year 4: Take applied courses such as climate modeling and do graduation research.",
    ],
    skills: ["Analyzing observation data to read changes", "Doing fieldwork and observations", "Understanding the complex Earth system as a whole"],
    compare: [
      { with: "Environmental Engineering", diff: "Environmental Engineering is engineering that develops technologies to treat and reduce pollution, while Earth and Environmental Sciences is science that studies how the Earth's environment changes." },
      { with: "Astronomy and Space Science", diff: "Astronomy and Space Science studies space beyond the Earth, while Earth and Environmental Sciences studies the Earth's atmosphere, oceans and land." },
    ],
    after: "Graduates go into public institutions such as the Korea Meteorological Administration, environmental research institutes, environmental consulting companies and resource and energy companies, and if you complete a teaching certificate course, you can also become an earth science teacher. Some go to graduate school for research jobs or prepare for national qualifications such as meteorological engineer or the meteorological civil service exam.",
    hs: [
      "Analyze several decades of temperature data for your region to find climate change trends",
      "Compare fine dust levels around your school with weather conditions and analyze the relationship",
      "Visit geological sites in Gyeongnam and research how the rocks and rock layers were formed",
    ],
    faq: [
      { q: "Do I have to take earth science in high school?", a: "It helps a lot, but you learn from the basics at university. Physics and math are also used a lot, so it is good to study them as well." },
      { q: "Are there many outdoor activities?", a: "Depending on the area, there is fieldwork or observation. At the same time, there is also a lot of data analysis on computers, so you experience both." },
    ],
  },

  astronomy: {
    intro: "The Department of Astronomy and Space Science studies stars, planets, galaxies and the birth and change of the whole universe through observation and the laws of physics. Efforts to understand space also lead to advances in satellites, space exploration and cutting-edge observation technology.",
    questions: [
      "How are stars born, and how do they end their lives?",
      "How did the universe begin, and what will happen to it?",
      "Are there planets beyond Earth where life could exist?",
    ],
    tracks: [
      { name: "Astrophysics", d: "Study how stars and galaxies shine and evolve with the laws of physics." },
      { name: "Observational Astronomy", d: "Observe celestial objects with telescopes and instruments and analyze the data." },
      { name: "Cosmology", d: "Study the origin, structure and expansion of the universe." },
      { name: "Planetary and Space Science", d: "Deal with the planets of the solar system, the space environment and space exploration." },
    ],
    years: [
      "Year 1: Build the basics with an introduction to astronomy, general physics and calculus.",
      "Year 2: Learn physics basics and astronomy courses such as observation practice, mechanics and electromagnetism.",
      "Year 3: Study advanced courses such as astrophysics and stellar and galactic astronomy, and programming for data analysis.",
      "Year 4: Learn cosmology, planetary science and more, and do graduation research with observation data.",
    ],
    skills: ["Processing and analyzing observation data", "Explaining phenomena with physics and math", "Handling data with coding"],
    compare: [
      { with: "Aerospace Engineering", diff: "Aerospace Engineering is engineering that designs and builds airplanes, rockets and satellites, while Astronomy and Space Science is science that studies space and celestial objects themselves." },
      { with: "Physics", diff: "Physics deals with the laws of matter and energy in general, while Astronomy and Space Science focuses on applying those laws to space and celestial objects." },
    ],
    after: "Graduates go into astronomy and space research institutes, satellite and space companies, science museums and observatories, and data analysis. To become an astronomy researcher, people usually go to graduate school.",
    hs: [
      "Record the shape of the moon and the time it rises for a month and analyze the pattern of change",
      "Compare the brightness and color of stars using public astronomy photos to estimate their temperature",
      "Research how the aerospace field is connected to industries in Gyeongnam",
    ],
    faq: [
      { q: "If I like stargazing, will it suit me?", a: "Curiosity about space is a great motivation. But keep in mind that the actual study involves a lot of analyzing data with physics, math and coding." },
      { q: "Which high school subjects are important?", a: "Physics and calculus are especially important, and earth science also helps." },
    ],
  },

  "marine-bio": {
    intro: "The Department of Marine Life Sciences studies the ecology and body functions of sea life and teaches how to protect and use fishery resources. The sea is a treasure house of food and new materials and is also strongly affected by climate change, so experts play an important role.",
    questions: [
      "How will fish in Korean waters change when sea temperatures rise?",
      "How can fish at fish farms be raised healthily?",
      "Can we get new substances from seaweed or other sea life?",
    ],
    tracks: [
      { name: "Marine Biology and Ecology", d: "Study the kinds and ecology of sea life and changes in marine ecosystems." },
      { name: "Aquaculture", d: "Learn techniques for raising fish, shellfish and seaweed and managing farming environments." },
      { name: "Fish Physiology and Disease", d: "Study the body functions of aquatic animals and ways to prevent disease." },
      { name: "Marine Biotechnology", d: "Deal with finding useful substances in sea life and using them in food, medicine and more." },
    ],
    years: [
      "Year 1: Build the basics with general biology, general chemistry and an introduction to marine science.",
      "Year 2: Learn key courses such as marine biology, ichthyology (the study of fish) and the physiology of aquatic animals.",
      "Year 3: Take advanced courses such as aquaculture, marine ecology and fish diseases, and do field practice.",
      "Year 4: Apply what you learned through practice at fish farms or research institutes or graduation research.",
    ],
    skills: ["Observing and classifying sea life", "Doing experiments and field surveys", "A view toward managing fishery resources sustainably"],
    compare: [
      { with: "Oceanography", diff: "Oceanography mainly studies the physical and chemical environment of the sea, such as the movement and composition of seawater, while Marine Life Sciences focuses on the living things in the sea." },
      { with: "Life Sciences", diff: "Life Sciences deals with life in general, while Marine Life Sciences specializes in sea life and fishery resources." },
    ],
    after: "Graduates go into fishery and aquaculture companies, marine and fisheries research institutes, fishery-related public institutions, and food and marine bio companies, and some prepare for the fisheries civil service exam. Some go to graduate school for research jobs or prepare for national qualifications such as aquaculture engineer.",
    hs: [
      "Compare data on south coast water temperatures with changes in major fish species to explore the effects of climate change",
      "Summarize the features of different kinds of seaweed and examples of their use in food and materials",
      "Research the kinds of trash on beaches and analyze their effects on sea life",
    ],
    faq: [
      { q: "Do I need to be good at swimming?", a: "Swimming skills are not required for your studies. But there may be fieldwork or practice, so being comfortable around the sea helps." },
      { q: "How is it different from Life Sciences?", a: "You learn about life in a similar way, but you learn more content connected to the field, such as sea life, fish farming and fishery resources." },
    ],
  },

  cs: {
    intro: "The Department of Computer Science and Engineering teaches a wide range of topics, from how computers work to how to design and build software. Computer technology is in almost everything, from smartphone apps, games and internet services to cars and factories, so it can be used in many areas.",
    questions: [
      "How do results appear instantly when you type a word in a search box?",
      "What does it take for a service not to stop even when huge numbers of people connect at once?",
      "How do computers show pictures and videos using only 0s and 1s?",
    ],
    tracks: [
      { name: "Software Development", d: "Learn how to design and build real programs such as websites, apps and games." },
      { name: "Computer Systems", d: "Deal with where hardware and software meet, such as operating systems and computer architecture." },
      { name: "Networks and Security", d: "Study how computers exchange data and technologies to stop hacking." },
      { name: "Databases and Cloud", d: "Learn how to store and manage large amounts of data and run servers." },
      { name: "Artificial Intelligence", d: "Cover the basics of technologies such as machine learning that let computers learn from data." },
    ],
    years: [
      "Year 1: Build the basics with programming fundamentals, discrete math and calculus.",
      "Year 2: Learn key courses such as data structures, algorithms and computer architecture.",
      "Year 3: Take advanced courses such as operating systems, networks, databases and software engineering.",
      "Year 4: Do a graduation project (capstone design) where you build a real program in a team.",
    ],
    skills: ["Logic to break problems into steps and solve them", "Designing and building programs", "Learning new technologies on your own", "Working with teammates"],
    compare: [
      { with: "Software", diff: "Software puts more weight on development and projects that build real services, while Computer Science and Engineering covers more broadly, including hardware and how systems work (this differs a lot by university)." },
      { with: "Artificial Intelligence", diff: "Artificial Intelligence focuses on machine learning and deep learning, while Computer Science and Engineering teaches the whole computer field, including AI." },
    ],
    after: "Graduates work as software developers, security experts and system engineers at IT companies, game companies, the development departments of finance and manufacturing companies, and public institutions. Some prepare for national qualifications such as Engineer Information Processing or go to graduate school for research.",
    hs: [
      "Survey preferences for school lunch menus and make a simple program that recommends menus",
      "Code several sorting algorithms yourself and compare their speeds",
      "Design an app idea that solves a problem at your school and make a prototype",
    ],
    faq: [
      { q: "Do I need to know how to code in advance?", a: "You learn from the basics in the first year, so it's fine if you are new. But trying it in advance helps a lot to check if it suits you and to adjust." },
      { q: "Do I need to be good at math?", a: "Math is used a lot in algorithms, graphics, AI and more. Logical thinking and concepts such as calculus, probability and matrices especially help." },
    ],
  },

  ai: {
    intro: "The Department of Artificial Intelligence studies technologies that let computers learn from data on their own and see, hear and make judgments. AI is quickly being used in more places, from translation and voice assistants to medical image analysis and self-driving cars, so the ability to handle its effects responsibly is as important as the technology itself.",
    questions: [
      "How does AI recognize a cat in a picture?",
      "How does AI create natural sentences like a person?",
      "What should we be careful about so that AI's judgments are not unfair?",
    ],
    tracks: [
      { name: "Machine Learning", d: "Learn the principles of algorithms that find rules in data and make predictions." },
      { name: "Computer Vision", d: "Study technologies that let AI understand images and videos." },
      { name: "Natural Language Processing", d: "Deal with technologies that let AI understand and produce human language." },
      { name: "Robots and Intelligent Systems", d: "Study how to apply AI to real machines such as robots and self-driving cars." },
    ],
    years: [
      "Year 1: Learn the math and coding behind AI, such as programming, calculus and linear algebra.",
      "Year 2: Learn data structures, algorithms, probability and statistics, and an introduction to AI.",
      "Year 3: Take key courses such as machine learning, deep learning, computer vision and natural language processing.",
      "Year 4: Do a project building AI models with real data, and think about AI ethics as well.",
    ],
    skills: ["Using math to turn data into models", "Coding and experimenting with AI models", "Evaluating and improving results", "Thinking about how technology affects society"],
    compare: [
      { with: "Computer Science and Engineering", diff: "Computer Science and Engineering teaches computer systems and software broadly, while Artificial Intelligence teaches machine learning and deep learning in more depth." },
      { with: "Data Science", diff: "Data Science focuses on analyzing data to find meaning, while Artificial Intelligence focuses on building AI models and systems that learn on their own." },
    ],
    after: "Graduates work as AI engineers and data scientists at IT companies, the AI departments of manufacturing, finance and medical companies, and research institutes. Many go to graduate school to research new AI technologies, and some prepare for qualifications such as big data analysis engineer.",
    hs: [
      "Build a simple image classification model with photos you collected and explore ways to improve its accuracy",
      "Collect sentences that AI translators often get wrong and analyze why",
      "Research cases of bias in AI recommendation services and suggest principles for fair AI",
    ],
    faq: [
      { q: "Do I need to be good at math?", a: "Yes. AI is based on linear algebra, calculus, and probability and statistics, so math is very important. Build a solid grasp of these concepts in high school." },
      { q: "As AI improves, won't AI developers become unnecessary?", a: "AI tools are changing how people work, but people who design and check AI and take responsibility for using it properly will still be needed. Understanding the basic principles deeply is the way to prepare for change." },
    ],
  },
  software: {
    intro: "The Department of Software teaches how to plan and build apps, websites and services that people actually use. You learn not only how to write code but also how many people work together to design, test and fix a large program. That is why there are quite a lot of team projects.",
    questions: [
      "How do we build a service that doesn't stop even when many people use it at once?",
      "What is the secret behind programs that users find easy and comfortable?",
      "How can we reduce errors in code written by many developers together?",
    ],
    tracks: [
      { name: "Web and App Development", d: "Learn both the front end that builds screens and the back end that handles data to complete a service." },
      { name: "Software Engineering", d: "Learn how to build large software systematically, through requirements analysis, design, testing and maintenance." },
      { name: "AI Applications", d: "Add existing AI models to services to build features such as recommendations, translation and recognition." },
      { name: "Game and Content Software", d: "Make interactive content with game engines and graphics technology." },
    ],
    years: [
      "Year 1: Learn the basics of code and logic through programming fundamentals, an introduction to computers and discrete math.",
      "Year 2: Learn data structures, algorithms, object-oriented programming and databases.",
      "Year 3: Learn software engineering, web and app development, operating systems and networks, and do team projects.",
      "Year 4: Build a real service as a graduation project (capstone design) and prepare for internships or your career.",
    ],
    skills: ["Logical thinking to break problems into small steps", "Team development using collaboration tools", "A sense for design that thinks from the user's point of view", "Learning new technologies on your own"],
    compare: [
      { with: "Computer Science and Engineering", diff: "Computer Science and Engineering deals more deeply with how computers work, such as hardware and operating systems, while Software puts more weight on development and projects that build real services (at many universities the curricula are similar)." },
    ],
    after: "After graduating, people work as software developers at IT companies, game companies and the development departments of finance and manufacturing companies, or start their own services. If you want to research further, you can go to graduate school and major in AI or software engineering.",
    hs: [
      "Design and build a simple web page or app that solves an inconvenience at school (checking lunch menus, finding lost items and so on) and record the process",
      "Experiment comparing the speed of several sorting algorithms at different data sizes",
      "Analyze the screen layout of apps you use often and summarize what makes a design easy to use",
    ],
    faq: [
      { q: "I've never coded before. Is it OK to enter?", a: "Most departments teach programming from the basics in the first year, so it's fine to start from zero. But trying a simple language in advance makes adjusting much easier." },
      { q: "Do I need to be good at math?", a: "Mathematical thinking is used a lot when learning algorithms and AI. The ability to reason logically matters more than very difficult math, but it is good to build basic math skills." },
    ],
  },
  security: {
    intro: "The Department of Information Security teaches how to protect systems and data from cyber threats such as hacking and personal data leaks. It covers cryptography, network security, how hacking attacks work and how to defend against them, and digital forensics, which finds evidence after an incident. Along with technology, law and ethics are also taught as important subjects.",
    questions: [
      "How are passwords and messages encrypted and delivered safely?",
      "What weak points do hackers aim for, and how can we block them?",
      "When a cybercrime happens, how do we find the criminal through digital traces?",
    ],
    tracks: [
      { name: "Cryptography", d: "Learn the mathematical principles and encryption algorithms for safely hiding and checking information." },
      { name: "System and Network Security", d: "Learn how to find weak points in servers and networks and stop attacks." },
      { name: "Digital Forensics", d: "Analyze records left on computers and smartphones to find the causes of incidents and evidence." },
      { name: "Security Management and Policy", d: "Learn how companies and organizations set and follow security rules, and related laws." },
    ],
    years: [
      "Year 1: Build computer basics such as programming, an introduction to computers and discrete math.",
      "Year 2: Learn the basics of cryptography along with operating systems, networks and data structures.",
      "Year 3: Practice system hacking and defense, web security and digital forensics.",
      "Year 4: Gain experience through security projects or mock hacking contests, and learn security management and policy.",
    ],
    skills: ["Analytical skills to find weak points from an attacker's point of view", "Understanding whole computer systems", "Ethics and responsibility in handling information"],
    compare: [
      { with: "Computer Science and Engineering", diff: "Computer Science and Engineering teaches computers and software broadly, while Information Security focuses on security and attack and defense technologies." },
    ],
    after: "Graduates can work in security monitoring, vulnerability analysis and security consulting at security companies, financial institutions, public institutions and the security departments of IT companies. Some go into digital forensics at investigation agencies or research cryptography and security technology further in graduate school.",
    hs: [
      "Explore how codes developed, from the ancient Caesar cipher to modern public-key cryptography, and the math behind them",
      "Calculate the conditions for a safe password using counting (number of cases) and make a campaign for your schoolmates",
      "Research personal data leak cases and summarize their causes, prevention and the related law (Personal Information Protection Act)",
    ],
    faq: [
      { q: "Isn't learning hacking illegal?", a: "At university, you learn how attacks work in permitted practice environments and use that for defense. Accessing someone else's system without permission is illegal, so learning ethics and law together is important." },
      { q: "Do I need security contests or certificates?", a: "They are not required, but they are a good way to show your skills. It is not too late to prepare for qualifications such as information security engineer or contests step by step at university." },
    ],
  },
  "data-science": {
    intro: "The Department of Data Science teaches how to find meaningful information in huge amounts of data and solve problems with it. You learn statistics, programming and AI together, and build the ability to present analysis results clearly in graphs. It connects to almost every field that uses data, such as medicine, marketing, sports and public administration.",
    questions: [
      "How do we find the truly important patterns in huge amounts of data?",
      "How accurately can data predict tomorrow's weather or product sales?",
      "What should we be careful about so that data analysis results don't discriminate against people?",
    ],
    tracks: [
      { name: "Statistical Analysis", d: "Learn statistical methods to summarize features of data and test hypotheses." },
      { name: "Machine Learning and AI", d: "Train computers with data to build models that classify and predict." },
      { name: "Big Data Processing", d: "Learn technologies to store very large amounts of data and process them quickly." },
      { name: "Data Visualization", d: "Show analysis results in graphs and dashboards so others can understand them easily." },
    ],
    years: [
      "Year 1: Learn programming fundamentals, calculus, linear algebra and an introduction to statistics.",
      "Year 2: Learn databases, probability theory and programming for data analysis.",
      "Year 3: Learn machine learning, big data processing and data visualization, and do analysis projects with real data.",
      "Year 4: Finish with a capstone project dealing with data from a specific field (medicine, finance, marketing and so on).",
    ],
    skills: ["Statistical thinking to organize and interpret data", "Using analysis tools and programming", "Explaining results simply", "Awareness of data ethics and personal data"],
    compare: [
      { with: "Statistics", diff: "Statistics deals deeply with the principles of statistical theory and methods, while Data Science adds programming and AI and focuses more on solving real data problems." },
      { with: "Computer Science and Engineering", diff: "Computer Science and Engineering teaches computer systems and software as a whole, while Data Science focuses on analyzing and using data." },
    ],
    after: "Graduates can work as data analysts, data engineers and AI developers at companies, or analyze policy data at public institutions. Many students also go to graduate school to research AI or statistics in more depth.",
    hs: [
      "Collect data on school lunch food waste or library loans and analyze patterns by day of the week and season",
      "Visualize Gyeongnam data (population, transportation and so on) from the Public Data Portal in graphs and interpret its meaning",
      "Find cases where changing a graph's axis changes the impression of the same data and explore statistical misunderstandings",
    ],
    faq: [
      { q: "Is there a lot of math?", a: "Math such as statistics, probability and linear algebra is the foundation. Studying probability and statistics and calculus carefully in high school helps a lot." },
      { q: "Can I apply if I lean toward the humanities?", a: "It also suits students who want to understand social issues through data. But you need to keep learning math and programming, so be ready to prepare for that." },
    ],
  },
  mech: {
    intro: "The Department of Mechanical Engineering teaches the principles of designing and building moving machines such as cars, airplanes, generators and robots. The four core mechanics subjects, which deal with force, heat, fluid flow and the properties of materials, are at the center. Machines are used in almost every industry, so career fields are wide.",
    questions: [
      "How do heavy bridges and machines withstand forces without collapsing?",
      "How does an engine turn heat into motion?",
      "How do we design machines that move better while using less energy?",
    ],
    tracks: [
      { name: "Design and Manufacturing", d: "Learn how to design parts with CAD and actually machine and assemble them." },
      { name: "Thermal and Fluid Engineering", d: "Analyze heat transfer and the flow of air and water to deal with engines, heating and cooling, and power plant equipment." },
      { name: "Solid Mechanics and Structures", d: "Analyze how materials deform and break under force." },
      { name: "Control and Mechatronics", d: "Make machines move as you want using sensors, motors and programs." },
    ],
    years: [
      "Year 1: Learn calculus, general physics, engineering programming and basic drawing (CAD).",
      "Year 2: Learn basic mechanics such as statics and dynamics, solid mechanics and thermodynamics.",
      "Year 3: Learn fluid mechanics, machine design, control engineering and manufacturing processes, and do experiments.",
      "Year 4: Do capstone design where a team designs and builds a real machine, and study a specific area in depth.",
    ],
    skills: ["Applying the laws of physics to real problems", "Using design tools (CAD) and analysis software", "Working in a team to build prototypes"],
    compare: [
      { with: "Robotics Engineering", diff: "Mechanical Engineering teaches the principles of machines broadly, while Robotics Engineering focuses on robot systems that combine machines with electronics and software." },
    ],
    after: "Graduates can work as design, production and research engineers at car, shipbuilding, aerospace, defense, power plant equipment and robot companies. Gyeongnam has a well-developed machinery industry centered on Changwon, so many graduates join local companies, and some continue research in graduate school.",
    hs: [
      "Experiment with how the force and speed of pedaling change with bicycle gear ratios",
      "Build bridges out of paper or straws and compare how much weight they hold depending on structure shape (such as trusses)",
      "Research the machinery industry in Changwon, Gyeongnam, and summarize how mechanical engineering is used in the local economy",
    ],
    faq: [
      { q: "Do I have to be good at physics?", a: "Mechanics is at the center of the department, so physics, especially the units on force and energy, is very important. We recommend studying physics and calculus well in high school." },
      { q: "Is it OK if I'm not good with my hands?", a: "Mechanical engineering is more about understanding principles and designing than making things by hand. The ability to keep thinking and calculating matters more than manual skill." },
    ],
  },
  electrical: {
    intro: "The Department of Electrical and Electronic Engineering teaches everything from technology for producing and sending electrical energy to the electronic circuits in smartphones and communication systems. You understand and handle invisible electricity and signals with math and physics. It is the foundation of many industries, such as semiconductors, power, telecommunications and car electronics.",
    questions: [
      "How does electricity made at a power plant reach our homes safely?",
      "How does a smartphone connect to people far away through radio waves?",
      "How can one small circuit calculate and remember?",
    ],
    tracks: [
      { name: "Power and Energy", d: "Learn systems for producing, transmitting and distributing electricity and connecting renewable energy." },
      { name: "Electronic Circuits and Semiconductors", d: "Design circuits for electronic devices with transistors and integrated circuits." },
      { name: "Communications and Signal Processing", d: "Learn how to turn sound, video and data into signals and transmit and process them." },
      { name: "Control and Systems", d: "Use motors and sensors to make machines and equipment move automatically." },
    ],
    years: [
      "Year 1: Learn calculus, general physics and programming fundamentals.",
      "Year 2: Learn circuit theory, electromagnetics and digital logic circuits, and do basic experiments.",
      "Year 3: Learn specific areas such as electronic circuits, signals and systems, control engineering and power engineering.",
      "Year 4: Choose an area of interest, take advanced courses and do a capstone design project.",
    ],
    skills: ["Understanding invisible phenomena with equations and models", "Experimental skills to design and measure circuits", "Analytical skills to find the causes of problems step by step"],
    compare: [
      { with: "Semiconductor Engineering", diff: "Electrical and Electronic Engineering covers wide areas such as power, communications and circuits, while Semiconductor Engineering focuses on semiconductor devices and processes." },
    ],
    after: "Graduates can work as engineers at electronics and semiconductor companies, public power companies and power generation companies, telecom companies and car electronics companies. Some prepare for national technical qualifications such as electrical engineer or go to graduate school to continue research.",
    hs: [
      "Experiment with how bulb brightness and current change in series and parallel circuits and explain it with Ohm's law",
      "Measure how a solar panel's output changes with its angle and light intensity",
      "Connect sensors with Arduino to build a simple automatic lighting device and explain how it works",
    ],
    faq: [
      { q: "Are electrical and electronic engineering taught separately?", a: "Some universities split them into Electrical Engineering and Electronic Engineering, and others combine them. Combined departments teach the basics together and let you choose an area of interest in later years." },
      { q: "Which subjects are most important?", a: "Physics, especially the units on electricity and magnetism, and calculus are the most basic. Subjects such as Electromagnetism and Quantum also help." },
    ],
  },
  semiconductor: {
    intro: "The Department of Semiconductor Engineering teaches how to design and make semiconductors, the 'brains' of smartphones, computers and cars. You understand how electrons move in a very tiny world and learn the processes for carving huge numbers of devices onto a chip the size of a fingernail. Physics, chemistry and electronic engineering are all connected in this department.",
    questions: [
      "Why does a semiconductor sometimes conduct electricity and sometimes not?",
      "How can so many circuits fit inside a chip the size of a fingernail?",
      "What is needed to make semiconductors smaller and faster and use less power?",
    ],
    tracks: [
      { name: "Semiconductor Devices", d: "Learn the physical principles of how devices such as transistors and memory work." },
      { name: "Semiconductor Processes", d: "Learn the manufacturing steps that carve circuits onto wafers, such as lithography, etching and deposition." },
      { name: "Circuit Design", d: "Design and verify the circuits that go inside semiconductor chips." },
      { name: "Packaging and Testing", d: "Learn technologies to protect and connect finished chips and test whether they work properly." },
    ],
    years: [
      "Year 1: Build the basics with calculus, general physics, general chemistry and programming.",
      "Year 2: Learn circuit theory, electromagnetics and the basics of semiconductor physics.",
      "Year 3: Learn and practice semiconductor devices, processes, electronic circuits and circuit design.",
      "Year 4: Do process practice or design projects, and sometimes join programs linked with industry.",
    ],
    skills: ["Physical thinking to imagine and understand the tiny world", "Carefulness to carry out processes and experiments accurately", "Combining knowledge from many fields"],
    compare: [
      { with: "Electrical and Electronic Engineering", diff: "Electrical and Electronic Engineering covers electricity and electronics broadly, while Semiconductor Engineering focuses on semiconductor devices, processes and design." },
      { with: "Materials Science and Engineering", diff: "Materials Science and Engineering deals with many materials such as metals, ceramics and polymers, while Semiconductor Engineering focuses on making semiconductor chips." },
    ],
    after: "Graduates can work as process, design and quality engineers at semiconductor manufacturers, semiconductor equipment and materials companies, and display companies. Those who want to research go to graduate school to study next-generation devices or process technology.",
    hs: [
      "Write a report explaining the differences between conductors, insulators and semiconductors using atomic structure and energy bands",
      "Explore how semiconductors work by experimenting with the relationship between the voltage across an LED and the color of its light",
      "Research the chemicals used in semiconductor processes and related safety and environmental issues",
    ],
    faq: [
      { q: "Do I also need to study chemistry?", a: "Chemical reactions and properties of substances are used a lot in semiconductor processes. It is good to study chemistry along with physics." },
      { q: "How are departments contracted with semiconductor companies different?", a: "Some universities have contract departments linked with companies, with different curricula and career conditions. These differ by school, so be sure to check each university's admission guidelines." },
    ],
  },
  materials: {
    intro: "The Department of Materials Science and Engineering studies the materials that make up things, such as metals, ceramics, polymers and nanomaterials, and develops new materials. You learn how the arrangement and structure of atoms in a material decide its properties. Materials are the starting point of advanced technologies such as batteries, semiconductors, aerospace and medical devices.",
    questions: [
      "Diamond and graphite are both carbon, so why are their properties completely different?",
      "How can we make lighter and stronger materials?",
      "What materials are needed to make batteries that last long and charge quickly?",
    ],
    tracks: [
      { name: "Metallic Materials", d: "Learn the structure of metals such as steel and aluminum and how heat treatment increases their strength." },
      { name: "Ceramic and Electronic Materials", d: "Deal with ceramics with special heat and electrical properties and materials for semiconductors and displays." },
      { name: "Polymer Materials", d: "Learn the structure and properties of polymers such as plastics and fibers." },
      { name: "Energy and Nanomaterials", d: "Study materials used in batteries and solar cells and properties that appear at the nano scale." },
    ],
    years: [
      "Year 1: Build the basics with general chemistry, general physics and calculus.",
      "Year 2: Learn an introduction to materials science, crystallography and thermodynamics of materials.",
      "Year 3: Learn and experiment with the properties of metals, ceramics and polymers and analysis methods.",
      "Year 4: Take advanced courses such as electronic materials and energy materials, and do graduation research.",
    ],
    skills: ["Thinking that connects atomic structure with material properties", "Experimental skills using microscopes and analysis equipment", "Organizing and interpreting experiment results"],
    compare: [
      { with: "Chemical Engineering", diff: "Materials Science and Engineering studies the structure and properties of materials themselves, while Chemical Engineering deals with processes that use chemical reactions to produce substances in large amounts efficiently." },
    ],
    after: "Graduates can work in materials development and quality control at steel, battery, semiconductor and display, and car parts companies. Materials research needs deep knowledge, so many students also go to graduate school.",
    hs: [
      "Compare the conditions under which iron nails rust (water, salt water, air) and explore ways to prevent corrosion",
      "Research differences in structure and properties among carbon allotropes such as graphene and summarize future uses",
      "Research the structure of lithium-ion batteries and the roles of cathode and anode materials",
    ],
    faq: [
      { q: "Which is more important, chemistry or physics?", a: "Both are used. The structure of materials connects to chemistry, and electrical and mechanical properties connect to physics, so it is good to build the basics of both." },
      { q: "Is it the same as a materials engineering department?", a: "Universities use different names, such as Advanced Materials Engineering, Materials Engineering and Materials Science, but what you learn is often similar. It is good to compare the curricula." },
    ],
  },
  "chem-eng": {
    intro: "The Department of Chemical Engineering teaches how to scale up chemical reactions from the lab to factory size to make products such as fuel, plastics, medicines and battery materials. You calculate how matter and energy move and change to design safe and efficient processes. It also plays an important role in solving environmental and energy problems.",
    questions: [
      "What is needed to make a small reaction in a beaker happen in the same way in a huge factory?",
      "How are gasoline, plastics and fibers made from a barrel of crude oil?",
      "How do we design processes that make products while releasing less pollution?",
    ],
    tracks: [
      { name: "Process Design", d: "Design the whole process, such as reactors and separation equipment, from raw materials to products." },
      { name: "Energy and Environment", d: "Deal with clean energy and environmental technologies such as hydrogen, batteries and carbon capture." },
      { name: "Polymers and Materials", d: "Learn processes for making and processing polymers such as plastics and fibers." },
      { name: "Bioprocesses", d: "Learn how to produce medicines and food ingredients using microorganisms or enzymes." },
    ],
    years: [
      "Year 1: Learn general chemistry, general physics, calculus and engineering programming.",
      "Year 2: Learn physical chemistry, organic chemistry and chemical process calculations (material balances).",
      "Year 3: Learn chemical engineering thermodynamics, transport phenomena, reaction engineering and separation processes, and do experiments.",
      "Year 4: Learn process design and process control, and do a team design project.",
    ],
    skills: ["Quantitative thinking to calculate the flow of matter and energy", "Responsibility to put process safety first", "Applying chemical knowledge to engineering problems"],
    compare: [
      { with: "Chemistry", diff: "Chemistry is a natural science that explores the principles of substances and reactions, while Chemical Engineering is engineering that uses those principles to design processes for mass-producing products." },
      { with: "Materials Science and Engineering", diff: "Materials Science and Engineering studies the structure and properties of materials, while Chemical Engineering focuses on the whole process of making substances." },
    ],
    after: "Graduates can work as process, production and research engineers at petrochemical, battery and materials, pharmaceutical, semiconductor materials and energy companies. Some prepare for national technical qualifications such as chemical engineer or continue energy and materials research in graduate school.",
    hs: [
      "Experiment with how reaction speed changes with temperature and concentration, and connect it to factory processes",
      "Research how plastics are made from crude oil and compare the pros and cons of biodegradable plastics",
      "Research ways to produce and store hydrogen energy and summarize the challenges of eco-friendly energy processes",
    ],
    faq: [
      { q: "Are there a lot of experiments?", a: "There are chemical engineering lab courses, but calculation and design actually make up quite a large part. Math and physics are important as well as chemistry." },
      { q: "How do I choose between Chemistry and Chemical Engineering?", a: "If you are curious about the principles of substances themselves, Chemistry suits you. If you want to use those principles to make real products and processes, Chemical Engineering suits you." },
    ],
  },
  naval: {
    intro: "The Department of Naval Architecture and Ocean Engineering teaches how to design and build ships and structures at sea (offshore plants). You use mechanics to understand how huge ships float, withstand waves and move efficiently. Gyeongnam has a well-developed shipbuilding industry centered on Geoje, so this department is closely connected to the region.",
    questions: [
      "How does a huge ship made of steel float on water?",
      "How should a ship be designed so it doesn't capsize in strong waves and wind?",
      "How do we build eco-friendly ships that use less fuel and release less pollution?",
    ],
    tracks: [
      { name: "Ship Hydrodynamics", d: "Analyze the flow of water around a ship to reduce resistance and improve propulsion efficiency." },
      { name: "Ship Structures", d: "Design strong structures so ships can withstand the forces of waves and cargo." },
      { name: "Offshore Plants", d: "Deal with structures that produce resources or energy at sea." },
      { name: "Eco-friendly and Smart Ships", d: "Learn future ship technologies such as eco-friendly fuel propulsion and autonomous navigation." },
    ],
    years: [
      "Year 1: Learn calculus, general physics, an introduction to naval architecture and ocean engineering, and basic drawing.",
      "Year 2: Learn basic mechanics such as statics and dynamics, fluid mechanics and mechanics of materials.",
      "Year 3: Learn ship hydrodynamics, ship structures, ship design and ocean engineering.",
      "Year 4: Do a capstone project designing a real ship or offshore structure.",
    ],
    skills: ["System thinking to see large structures as a whole", "Calculating safety with mechanics", "Working with experts from many fields"],
    compare: [
      { with: "Mechanical Engineering", diff: "Mechanical Engineering covers the principles of machines broadly, while Naval Architecture and Ocean Engineering applies them with a focus on ships and offshore structures." },
    ],
    after: "Graduates can work as design and production engineers at shipyards, offshore plant companies, ship equipment companies, classification societies (ship safety inspection organizations) and research institutes. Some go to graduate school to research eco-friendly ships or ocean energy.",
    hs: [
      "Do model experiments on how water resistance and stability change with hull shape (bottom shape)",
      "Explain with calculations why a steel ship floats, using buoyancy and Archimedes' principle",
      "Research changes in the shipbuilding industry in Geoje and Tongyeong, Gyeongnam, and trends in eco-friendly ship technology",
    ],
    faq: [
      { q: "Do I build ships with my own hands?", a: "You mainly work on design, production management and research. Actual construction is done with many technicians, and engineers are largely responsible for planning and quality." },
      { q: "Doesn't the shipbuilding industry change a lot with the economy?", a: "The shipbuilding industry is affected by the world economy and demand for ships. So studying technological changes such as eco-friendly and smart ships widens your choices." },
    ],
  },
  aero: {
    intro: "The Department of Aerospace Engineering teaches how to design vehicles that fly in the sky and space, such as airplanes, helicopters, drones, satellites and rockets. It deals with airflow, light but strong structures, propulsion systems and flight control together. The Sacheon and Jinju area of Gyeongnam is home to many aerospace companies, so it is closely connected to the region.",
    questions: [
      "How can a heavy airplane stay up in the sky?",
      "How does a rocket escape Earth's gravity and go into space?",
      "Why do satellites circle the Earth instead of falling?",
    ],
    tracks: [
      { name: "Aerodynamics", d: "Analyze airflow around wings to calculate lift and drag." },
      { name: "Aerospace Structures", d: "Design light but strong aircraft structures and composite materials." },
      { name: "Propulsion", d: "Learn how jet engines and rocket engines create thrust." },
      { name: "Flight Mechanics and Control", d: "Learn how to control aircraft so they fly stably and follow the desired path." },
    ],
    years: [
      "Year 1: Learn calculus, general physics, an introduction to aerospace engineering and programming.",
      "Year 2: Learn statics and dynamics, thermodynamics, solid mechanics and fluid mechanics.",
      "Year 3: Learn aerodynamics, aircraft structures, propulsion and flight mechanics.",
      "Year 4: Do a capstone project designing and building a drone or small aircraft, and take advanced space engineering courses.",
    ],
    skills: ["Overall thinking to understand complex systems", "Analysis using math and physics", "Carefulness not to miss even small mistakes"],
    compare: [
      { with: "Mechanical Engineering", diff: "Mechanical Engineering deals with many kinds of machines broadly, while Aerospace Engineering applies the same mechanics with a focus on airplanes and spacecraft." },
    ],
    after: "Graduates can work at aircraft manufacturers, defense companies, satellite and launch vehicle companies and research institutes, and the maintenance and engineering departments of airlines. This field needs deep research, so many students also go to graduate school.",
    hs: [
      "Experiment comparing how far paper airplanes fly depending on wing shape and angle",
      "Build a water rocket, measure how far it flies depending on the amount of water and launch angle, and explain it with conservation of momentum",
      "Research the aerospace industry in Sacheon and Jinju, Gyeongnam, and trends in Korean space development such as the founding of the Korea AeroSpace Administration",
    ],
    faq: [
      { q: "Is this a department for becoming a pilot?", a: "No. Aerospace Engineering trains engineers who design and research aircraft. Pilots prepare through other routes, such as flight operations departments or flight training programs." },
      { q: "What are the most important high school subjects?", a: "Physics (especially mechanics) and calculus are the most important. Geometry also helps you understand space." },
    ],
  },
  "nuclear-eng": {
    intro: "The Department of Nuclear Engineering teaches how to use the energy in atomic nuclei safely. It covers not only nuclear power generation but also medical, industrial and research uses of radiation. Above all, it is a department where you learn with safety as the top priority.",
    questions: [
      "How does a tiny atomic nucleus release so much energy?",
      "What equipment and rules are needed to run a nuclear power plant safely?",
      "How is radiation used in hospitals and industry?",
    ],
    tracks: [
      { name: "Reactor Physics", d: "Learn how nuclear fission happens and how neutrons move inside a reactor." },
      { name: "Thermal Hydraulics and Safety", d: "Deal with technologies to cool the heat from a reactor safely and prevent accidents." },
      { name: "Radiation Applications", d: "Learn how to use radiation for medical diagnosis and treatment, non-destructive testing and research." },
      { name: "Nuclear Fuel and Radioactive Waste", d: "Learn the nuclear fuel cycle and how to manage spent nuclear fuel safely." },
    ],
    years: [
      "Year 1: Learn calculus, general physics, general chemistry and an introduction to nuclear engineering.",
      "Year 2: Learn modern physics, thermodynamics, engineering mathematics and the basics of radiation.",
      "Year 3: Learn reactor physics, thermal hydraulics, and radiation measurement and shielding, and do experiments.",
      "Year 4: Take advanced courses such as nuclear safety, reactor design and radiation applications, and do a graduation project.",
    ],
    skills: ["Responsibility to put safety first", "Calculating the laws of physics precisely", "Seeing energy issues from a social point of view"],
    compare: [
      { with: "Radiology", diff: "Radiology is a health field that trains radiologic technologists who take medical images and give treatments in hospitals, while Nuclear Engineering is engineering that covers reactors and radiation technology as a whole." },
    ],
    after: "Graduates can work at public and private companies related to nuclear power, nuclear plant equipment manufacturers, nuclear research institutes and nuclear safety regulators. Some go into medical and industrial radiation or continue research in graduate school.",
    hs: [
      "Compare the principles of nuclear fission and fusion and explain the amount of energy using mass-energy equivalence (E=mc²)",
      "Research the kinds and amounts of natural radiation in daily life and summarize myths and facts about radiation",
      "Compare the energy mix of different countries (nuclear, thermal, renewable) and make debate materials on the pros and cons",
    ],
    faq: [
      { q: "Isn't it dangerous because of radiation?", a: "Nuclear engineering is the study of how to handle radiation safely. Both practice and work sites are managed under strict safety rules." },
      { q: "Won't my career be uncertain if nuclear policy changes?", a: "Energy policy can change over time. But it's good to know that there are also wide fields that are steadily needed, such as medical and industrial radiation, safety regulation, and decommissioning and waste management." },
    ],
  },
  robotics: {
    intro: "The Department of Robotics Engineering combines mechanics, electronics and software into one to build robots that sense, decide and move on their own. It covers everything from factory robots to service robots, medical robots and self-driving machines. It is an interdisciplinary department where you learn many fields evenly.",
    questions: [
      "How does a robot recognize its surroundings with cameras and sensors?",
      "What does a robot arm need to grab things gently and accurately?",
      "How should robots be designed so that people and robots can work together safely?",
    ],
    tracks: [
      { name: "Robot Mechanisms and Design", d: "Design a robot's joints and body and calculate its movements." },
      { name: "Control", d: "Use motors and sensors to control robots so they perform the desired motions accurately." },
      { name: "Robot AI and Vision", d: "Use cameras and AI so robots can recognize objects and make decisions on their own." },
      { name: "Embedded Systems", d: "Deal with the small computers, circuits and programs inside robots." },
    ],
    years: [
      "Year 1: Learn calculus, general physics, programming and an introduction to robotics.",
      "Year 2: Learn dynamics, circuit theory, digital engineering and data structures.",
      "Year 3: Learn robot kinematics, control engineering, sensors and signal processing, and embedded systems.",
      "Year 4: Learn robot vision and AI, and do a capstone project building a robot in a team.",
    ],
    skills: ["Interdisciplinary thinking that connects mechanics, electronics and software", "Problem solving by building and fixing things yourself", "Teamwork to lead team projects"],
    compare: [
      { with: "Mechanical Engineering", diff: "Mechanical Engineering teaches the mechanics of machines in depth, while Robotics Engineering combines machines with electronics and software to deal with whole robot systems." },
    ],
    after: "Graduates can work as robot engineers at industrial robot companies, automation equipment companies, service and medical robot companies, and self-driving and drone companies. Some go to graduate school to research robot AI or control.",
    hs: [
      "Build a simple robot that avoids obstacles with an ultrasonic sensor and measure the sensor's distance error",
      "Research the differences between factory automation robots and collaborative robots and summarize cases from Gyeongnam manufacturing sites",
      "Make debate materials for and against on how robots affect jobs and on robot ethics",
    ],
    faq: [
      { q: "Do I need experience in a robotics club?", a: "It is not required. But experience building a small robot or using Arduino helps a lot in understanding your studies." },
      { q: "Is there a lot of programming?", a: "Yes. The software that moves robots is important, so you keep learning programming. You also learn mechanical and electronic subjects, so it's good to study evenly." },
    ],
  },
  architecture: {
    intro: "The Department of Architecture teaches how to design spaces where people live, work and gather. You design buildings thinking about function, safety, the environment and local history and culture, not just beauty. At many universities, it is a 5-year program, and design studio classes are at the center.",
    questions: [
      "What conditions make a space where people stay comfortably and happily?",
      "How can buildings fit in with the surrounding nature, city and history?",
      "How do we design eco-friendly buildings that use less energy?",
    ],
    tracks: [
      { name: "Architectural Design", d: "Plan and design the spaces of various buildings such as houses, schools and cultural facilities." },
      { name: "Urban Design", d: "Plan the spaces of streets, neighborhoods and cities where buildings come together." },
      { name: "Architectural History and Theory", d: "Learn the trends and ideas of architecture by period and region as a basis for design." },
      { name: "Building Technology and Environment", d: "Learn how to reflect structure, materials, energy and the building environment, such as light and wind, in design." },
    ],
    years: [
      "Years 1–2: Learn how to see and express space through drawing, model making and basic design.",
      "Around Year 3: Learn building structures, materials and history along with design studios for houses, public buildings and more.",
      "Around Year 4: Learn large-scale design such as cities and complex buildings, building codes and construction.",
      "Year 5 (around graduation): Complete your graduation design and prepare for practical training.",
    ],
    skills: ["Imagining spaces and expressing them in drawings and models", "Empathy that considers both users and society", "Design skills to balance many conditions and find solutions"],
    compare: [
      { with: "Architectural Engineering", diff: "Architecture focuses on designing spaces (often 5 years), while Architectural Engineering focuses on engineering technologies such as structures, building systems and construction (usually 4 years)." },
      { with: "Interior Design", diff: "Interior Design focuses on decorating and styling the spaces inside buildings, while Architecture designs the whole building and its surroundings." },
    ],
    after: "Graduates can work at architecture firms, construction companies, public institutions and in space design. After graduating from an accredited 5-year architecture program and completing the required practical training, you can take the registered architect qualification exam.",
    hs: [
      "Observe which spaces at your school students often stay in and which they avoid, and design improvements based on the reasons",
      "Visit traditional hanok houses or modern buildings in Gyeongnam and summarize how climate and lifestyle affected the architecture",
      "Experiment with a model on how indoor temperature changes with the direction of sunlight and window position",
    ],
    faq: [
      { q: "Do I need to be good at drawing?", a: "You need practice expressing ideas in sketches, but you don't need outstanding art skills. An attitude of imagining spaces and expressing them regularly matters more." },
      { q: "Is there a practical skills test?", a: "Most universities select students through regular admission, but some use practical tests or other methods. It differs by university, so be sure to check the admission guidelines." },
    ],
  },
  "env-eng": {
    intro: "The Department of Environmental Engineering teaches technologies to reduce pollution of water, air and land and protect a clean environment. You analyze the causes of pollution scientifically and design solutions such as water and wastewater treatment, air purification and waste recycling. It is also closely connected to responding to climate change.",
    questions: [
      "What process turns dirty water into water we can drink?",
      "Where does fine dust come from, and how can we reduce it?",
      "What ways are there to reduce waste and reuse it as resources?",
    ],
    tracks: [
      { name: "Water Quality and Water Supply", d: "Learn facilities and technologies for making water clean and treating used water." },
      { name: "Air Environment", d: "Analyze how air pollutants are produced and move, and learn ways to reduce them." },
      { name: "Waste and Resource Recycling", d: "Deal with ways to treat waste safely and recycle it." },
      { name: "Climate and Environmental Policy", d: "Learn about greenhouse gases and climate change, environmental impact assessment and related systems." },
    ],
    years: [
      "Year 1: Learn general chemistry, general biology, calculus and an introduction to environmental engineering.",
      "Year 2: Learn the basics of environmental chemistry, environmental microbiology and fluid mechanics.",
      "Year 3: Learn water treatment engineering, air pollution engineering and waste treatment engineering, and do analysis experiments.",
      "Year 4: Learn environmental facility design, environmental impact assessment and more, and do a graduation project.",
    ],
    skills: ["Experimental skills to measure and analyze pollutants", "Thinking to diagnose environmental problems scientifically", "Values that consider sustainability"],
    compare: [
      { with: "Environmental Science", diff: "Environmental Science focuses on exploring the principles of environmental phenomena, while Environmental Engineering focuses on designing facilities and technologies that reduce pollution." },
    ],
    after: "Graduates can work at environmental consulting companies, water supply, sewage and waste treatment companies, the environment and safety departments of manufacturers, and environment-related public institutions. Some prepare for national technical qualifications such as water pollution environmental engineer and air pollution environmental engineer, or continue research in graduate school.",
    hs: [
      "Collect water from streams near your school, measure pH and turbidity, and compare by location",
      "Measure fine dust levels before and after using a classroom air purifier and compare the effects of different ventilation methods",
      "Research how waste is sorted at your school and suggest ways to increase the recycling rate",
    ],
    faq: [
      { q: "Will it suit anyone who loves the environment?", a: "Interest in the environment is a good starting point. But there is a lot of engineering study that uses chemistry, biology and math for analysis, so prepare science subjects as well." },
      { q: "Which high school subjects help?", a: "Chemistry and life science help especially. Earth science and probability and statistics are also used to understand environmental data." },
    ],
  },
  medicine: {
    intro: "Pre-medicine and Medicine is the path to becoming a doctor who learns deeply about the human body and diseases and diagnoses and treats patients. You usually study for 6 years in total, 2 years of pre-medical courses and 4 years of medical school, and you must pass the national medical licensing exam after graduation to get a medical license. Along with knowledge, you also learn attitudes and ethics for communicating with patients as important subjects.",
    questions: [
      "How do the organs of our body work together to keep us alive?",
      "Why do symptoms and treatment effects differ from person to person, even for the same disease?",
      "How does medicine respond when a new infectious disease appears?",
    ],
    tracks: [
      { name: "Basic Medicine", d: "Study the principles of the body and diseases, such as anatomy, physiology, pathology and pharmacology." },
      { name: "Internal Medicine Fields", d: "Fields that diagnose and treat diseases inside the body with medicines and tests." },
      { name: "Surgical Fields", d: "Fields that treat diseases and injuries with surgery." },
      { name: "Preventive Medicine and Public Health", d: "Deal with ways to protect the health of the community and prevent disease." },
    ],
    years: [
      "Pre-medical years (Years 1–2): Learn basic sciences such as biology, chemistry and physics, the humanities and general education, and an introduction to medicine.",
      "Early medical school: Learn basic medicine such as anatomy, physiology, biochemistry, pathology and pharmacology.",
      "Later medical school: Learn clinical medicine such as internal medicine and surgery, and do clinical practice at hospitals.",
      "Around graduation: Finish clinical practice and prepare for the national medical licensing exam.",
    ],
    skills: ["Learning a huge amount of knowledge steadily", "Communication skills to listen to patients and empathize", "Responsibility and ethics in caring for human life"],
    compare: [
      { with: "Pre-Korean Medicine", diff: "Pre-medicine teaches modern medicine and leads to a medical doctor's license, while Pre-Korean Medicine teaches traditional Korean medicine and leads to a Korean medicine doctor's license, so the licenses and what you learn are different." },
      { with: "Biomedical Science", diff: "Biomedical Science trains scientists who study life and disease, and graduates do not receive a medical license." },
    ],
    after: "After passing the national exam and getting a license, you can treat patients as a general practitioner or go through internship and residency training to prepare for specialist qualification. Some broaden their careers into medical research, public health, or pharmaceutical and bio companies.",
    hs: [
      "Measure how heart rate changes with exercise intensity and time and explain it with the role of the heart",
      "Research how antibiotic-resistant bacteria develop and make campaign materials on using medicine correctly",
      "Research cases of medical AI being used for diagnosis and discuss changes in the doctor's role and ethical issues",
    ],
    faq: [
      { q: "Are good grades enough?", a: "Academic ability is important, but the persistence to get through long study and training and your attitude toward patients are also truly important. We recommend learning enough about what doctors do before deciding." },
      { q: "I'm scared of seeing blood. Will I be OK?", a: "Many people get used to it through practice, and there are fields with little surgery, such as laboratory medicine and radiology. But everyone has to go through clinical practice, so it's good to think about it in advance." },
    ],
  },
  pharmacy: {
    intro: "The Department of Pharmacy teaches how medicines work in the body and how to make them and use them safely. Colleges of pharmacy now run a 6-year integrated program, and after graduating you get a pharmacist license if you pass the national pharmacist exam. Based on chemistry and life science, it leads to many fields such as pharmacies, hospitals, pharmaceutical companies and research.",
    questions: [
      "How does medicine find the part of the body that hurts and act on it?",
      "What process does a new medicine go through before it is made?",
      "Why should we be careful when taking several medicines together?",
    ],
    tracks: [
      { name: "Pharmacology and Clinical Pharmacy", d: "Learn how medicines work, their side effects and how to use them to suit each patient." },
      { name: "Pharmaceutics", d: "Learn how to make medicines in effective and safe forms, such as pills and injections." },
      { name: "Medicinal Chemistry and Pharmacognosy", d: "Study the structure of substances that become medicines and find active ingredients in natural products." },
      { name: "Social Pharmacy and Pharmaceutical Administration", d: "Learn about drug systems, safety management and the pharmacist's role in public health." },
    ],
    years: [
      "Pre-pharmacy years (Years 1–2): Learn basic sciences such as chemistry, biology, physics and math, and general education.",
      "Early pharmacy school: Learn basic pharmacy courses such as organic chemistry, biochemistry, pharmacology and pharmaceutics.",
      "Later pharmacy school: Learn clinical pharmacy and pharmacotherapy, and do practical training at pharmacies, hospitals, pharmaceutical companies and more.",
      "Around graduation: Finish practical training and prepare for the national pharmacist exam.",
    ],
    skills: ["Scientific understanding that connects chemistry and life science", "Carefulness to check and record accurately", "Communication skills to explain medicines to patients simply"],
    compare: [
      { with: "Pharmaceutical Engineering", diff: "Pharmaceutical Engineering is an engineering field that teaches the processes and technology of producing medicines, and graduates are not eligible to take the pharmacist license exam." },
      { with: "Korean Herbal Pharmacy", diff: "Korean Herbal Pharmacy trains herbal pharmacists who handle traditional Korean medicines, and its license and what you learn are different from Pharmacy." },
    ],
    after: "If you pass the national pharmacist exam, you can work as a pharmacist at pharmacies, hospital pharmacy departments, pharmaceutical companies and public institutions (such as drug safety management). Some go to graduate school to become researchers developing new medicines.",
    hs: [
      "Compare how painkillers work and their cautions by ingredient (acetaminophen, ibuprofen and so on)",
      "Compare by experiment how fast different medicine coatings (capsules, coated tablets and so on) dissolve and explore why",
      "Research the process of developing a new medicine (from finding candidate substances to clinical trials) and summarize the role of each step",
    ],
    faq: [
      { q: "How do I get into Pharmacy?", a: "Colleges of pharmacy run a 6-year integrated program, so you can enter right after high school. Admission methods differ by university, so check the admission guidelines." },
      { q: "Do pharmacists only work at pharmacies?", a: "Besides pharmacies, they can work in many places such as hospitals, pharmaceutical companies, research institutes and public institutions." },
    ],
  },
  nursing: {
    intro: "The Department of Nursing teaches the nursing knowledge and skills for caring for people who are sick or need help and protecting health. For 4 years you study theory together with clinical practice at hospitals, and after graduating you get a nursing license if you pass the national nursing exam. It is the path to becoming the expert who cares for patients most closely, right at their side.",
    questions: [
      "What role does nursing play in a patient's recovery?",
      "How does care differ by age, from babies to older people?",
      "How can we protect the health of the community outside hospitals?",
    ],
    tracks: [
      { name: "Adult Nursing", d: "Learn nursing that helps adults understand and recover from various diseases." },
      { name: "Child and Women's Health Nursing", d: "Learn how to care for the health of children and of women during pregnancy and childbirth." },
      { name: "Mental Health Nursing", d: "Learn nursing that understands and helps people with mental illness." },
      { name: "Community and Public Health Nursing", d: "Learn how to protect the health of schools, public health centers and local residents and prevent disease." },
    ],
    years: [
      "Year 1: Learn the basics, such as human anatomy, physiology, microbiology and an introduction to nursing.",
      "Year 2: Learn fundamentals of nursing, health assessment and pharmacology, and practice nursing skills in the lab.",
      "Year 3: Learn adult, child, women's and mental health nursing, and start clinical practice at hospitals.",
      "Year 4: Learn community nursing and nursing management, continue clinical practice and prepare for the national nursing exam.",
    ],
    skills: ["Observation skills to notice changes in a patient's condition", "Communicating with medical staff and patients", "Responsibility to give care accurately and safely"],
    compare: [
      { with: "Health Administration", diff: "Health Administration teaches how to run and manage hospitals and health organizations, while Nursing trains nurses who care for patients directly and prepares students for the license exam." },
    ],
    after: "If you pass the national nursing exam, you can work as a hospital nurse or at public health centers, companies and public institutions. If you complete a teaching certificate course, you can get the school health teacher qualification, and some study a specialty in graduate school to become advanced practice nurses or researchers.",
    hs: [
      "Compare by culture experiment how the number of bacteria changes with different handwashing methods",
      "Research the care services needed in an aging society and the role of nurses",
      "Analyze students' sleep time and health with a survey and suggest ways to manage health",
    ],
    faq: [
      { q: "I heard clinical practice is hard. Is that true?", a: "There is a lot of clinical practice at hospitals, so it is fairly busy. But through practice, many students learn real nursing and become sure of their career." },
      { q: "Can I work somewhere other than a hospital?", a: "Yes. There are many paths, such as school health teacher, public health civil servant, occupational health manager at companies and researcher. Each path has different extra requirements, so it's good to learn about them in advance." },
    ],
  },
  "physio-major": {
    intro: "The Department of Physical Therapy teaches how to help people who find it hard to move because of injury or illness move well again, using exercise, hands-on treatment and physical methods such as electricity and heat. You understand body movement through anatomy and kinesiology and make rehabilitation plans. After graduating, you get a license if you pass the national physical therapist exam.",
    questions: [
      "What exercises help injured muscles and joints recover?",
      "How can we help people who have had illnesses such as a stroke walk again?",
      "How do good posture and movement help prevent pain?",
    ],
    tracks: [
      { name: "Musculoskeletal Physical Therapy", d: "Help injuries and pain of bones, joints and muscles recover with exercise and manual therapy." },
      { name: "Neurological Physical Therapy", d: "Help patients with neurological conditions, such as stroke and spinal cord injury, recover movement." },
      { name: "Sports Physical Therapy", d: "Prevent athletes' injuries and help them return quickly." },
      { name: "Pediatric and Geriatric Physical Therapy", d: "Maintain and improve the abilities of children with delayed development and older people." },
    ],
    years: [
      "Year 1: Learn the basics, such as human anatomy, physiology and an introduction to physical therapy.",
      "Year 2: Learn kinesiology, functional anatomy and physical agent therapy (electrical and heat therapy).",
      "Year 3: Learn musculoskeletal and neurological physical therapy and therapeutic exercise, and do clinical practice at hospitals.",
      "Year 4: Learn advanced courses such as pediatric and sports physical therapy, and prepare for the national physical therapist exam.",
    ],
    skills: ["Analyzing the body's structure and movement", "Empathy to encourage and support patients", "Judgment to observe treatment effects and adjust plans"],
    compare: [
      { with: "Occupational Therapy", diff: "Physical Therapy focuses on large body movements such as walking and standing and on recovering from pain, while Occupational Therapy focuses on helping people do daily activities again, such as getting dressed and eating." },
    ],
    after: "If you pass the national physical therapist exam, you can work as a physical therapist at hospitals, rehab centers, care facilities and sports teams. Some go to graduate school to research rehabilitation or continue specialized training.",
    hs: [
      "Measure changes in flexibility (sit-and-reach) before and after stretching and explain them with how muscles work",
      "Analyze the relationship between smartphone posture and neck pain with a survey and make a guide to good posture",
      "Write a report analyzing elbow and knee joint movements with the principle of levers",
    ],
    faq: [
      { q: "Should I choose a 3-year or 4-year program?", a: "Physical therapy departments exist at both junior colleges (3 years) and universities (4 years), and graduates of both can take the same national exam. Choose based on the curriculum and your plans for further study." },
      { q: "Does it require a lot of physical strength?", a: "You support patients and exercise with them, so you need some physical strength. Learning correct posture and techniques can reduce strain on your body." },
    ],
  },
  "vet-major": {
    intro: "Pre-veterinary Medicine and Veterinary Medicine is the path to becoming a veterinarian who learns about animal bodies and diseases and diagnoses and treats them. It covers not only pets but also livestock such as cows and pigs and wild animals, and you also learn public health to prevent diseases that pass from animals to people. You study for 6 years in total, 2 pre-veterinary years and 4 years of veterinary school, and must pass the national veterinary exam to get a license.",
    questions: [
      "How can we find out where an animal hurts when it cannot talk?",
      "How do livestock diseases spread, and how can they be stopped?",
      "How is animal health connected to human health?",
    ],
    tracks: [
      { name: "Companion Animal Medicine", d: "Diagnose and treat diseases of pets such as dogs and cats." },
      { name: "Livestock Medicine", d: "Manage the health and productivity of livestock such as cows, pigs and chickens." },
      { name: "Veterinary Public Health", d: "Deal with livestock disease control, the hygiene of animal products and diseases shared by people and animals." },
      { name: "Basic Veterinary Science and Research", d: "Study animal anatomy, physiology and pathology, and take part in developing new medicines and vaccines." },
    ],
    years: [
      "Pre-veterinary years (Years 1–2): Learn basic sciences such as biology, chemistry and zoology, and general education.",
      "Early veterinary school: Learn basic veterinary science such as veterinary anatomy, physiology, pathology and pharmacology.",
      "Later veterinary school: Learn clinical veterinary medicine such as internal medicine, surgery and obstetrics, and practice at animal hospitals.",
      "Around graduation: Finish clinical practice and prepare for the national veterinary exam.",
    ],
    skills: ["Observation skills to read an animal's condition from behavior and symptoms instead of words", "Responsibility and respect for life", "Communicating with pet owners and caretakers"],
    compare: [
      { with: "Animal Science (Animal Life Science)", diff: "Animal Science teaches raising and breeding livestock and the livestock industry and has nothing to do with a veterinary license. Veterinary Medicine is a 6-year program that trains veterinarians who treat animal diseases." },
      { with: "Companion animal departments", diff: "Companion animal departments teach training, grooming, health care and more, but treating animals and prescribing medicine requires a veterinary license." },
    ],
    after: "If you pass the national veterinary exam, you can work at animal hospitals, disease control and quarantine organizations, livestock-related public institutions, pharmaceutical and animal feed companies, and research institutes. Some go to graduate school to research a specialty, and in Gyeongnam, Gyeongsang National University has a College of Veterinary Medicine.",
    hs: [
      "Research infectious diseases shared by people and animals (zoonoses) and summarize the One Health concept",
      "Research the ingredients in human foods that are dangerous to pets (chocolate, onions and so on) and how they act",
      "Analyze the situation of abandoned animals in your region with public data and suggest solutions",
    ],
    faq: [
      { q: "Is loving animals enough?", a: "Love for animals is important, but you will also face the pain and death of sick animals. It's good to think about your mindset in advance along with studying science." },
      { q: "Do vets only treat pets?", a: "No. The fields are wide, including livestock, wild animals, lab animals, disease control and food safety." },
    ],
  },
  education: {
    intro: "The Department of Education studies how people learn and grow and what good education is. You learn widely about the philosophy of education, learner psychology, curriculum, assessment, education policy and more. It connects to every place where learning happens, not just schools but also companies, lifelong education and educational content.",
    questions: [
      "How do people learn, and what makes learning happen better?",
      "What is needed so that every student has a fair chance to learn?",
      "Can we assess students' growth in ways other than tests?",
    ],
    tracks: [
      { name: "Educational Psychology", d: "Understand learners' motivation, development and learning process through psychology." },
      { name: "Curriculum and Assessment", d: "Study what to teach, in what order and how to assess it." },
      { name: "Educational Technology", d: "Design effective lessons and educational content using digital technology and media." },
      { name: "Lifelong Education and Educational Administration", d: "Deal with adult learning, running schools and educational organizations, and education policy." },
    ],
    years: [
      "Year 1: Learn the basic concepts of education, such as an introduction to education, philosophy of education and history of education.",
      "Year 2: Learn educational psychology, sociology of education, curriculum and the basics of educational statistics.",
      "Year 3: Learn specific areas such as educational assessment, educational technology, educational administration and counseling.",
      "Year 4: Do teaching practice or a research project and study courses that suit your career in depth.",
    ],
    skills: ["Observation and empathy to understand how people grow", "Research skills to analyze education issues", "Planning skills to design lessons or programs"],
    compare: [
      { with: "Subject education departments at colleges of education (Korean Language Education, Mathematics Education and so on)", diff: "Subject education departments focus on training secondary school teachers for a specific subject, while Education widely studies the principles and systems of education itself." },
      { with: "Elementary Education", diff: "Elementary Education aims to train elementary school teachers and teaches how to teach all subjects, while Education covers education as a whole without being limited to one school level." },
    ],
    after: "Graduates can work at education companies, educational content and edtech companies, lifelong education organizations and education-related public institutions. If you complete a teaching certificate course, you can get a teaching qualification (the subjects differ by university), and some go to graduate school to become education researchers.",
    hs: [
      "Experiment with friends to compare the memory effects of different study methods (rereading, making your own questions and so on)",
      "Analyze the pros and cons of digital and paper textbooks with a survey",
      "Research the causes of education gaps between regions and summarize Gyeongnam's education support policies",
    ],
    faq: [
      { q: "Can I become a teacher if I graduate from Education?", a: "The Department of Education itself teaches the principles of education, so to become a teacher you need to get a teaching qualification, for example through a teaching certificate course, and prepare for the recruitment exam. Whether a teaching certificate course is offered differs by university, so you need to check." },
      { q: "Are there jobs besides teaching?", a: "Yes. There are many jobs that design learning, such as planning education programs, edtech, corporate talent development and lifelong education." },
    ],
  },
  "elem-edu": {
    intro: "The Department of Elementary Education is where you study to become an elementary school teacher. You learn how to teach every elementary school subject, from Korean and math to music, art and PE, and about child development. It is mainly studied at universities of education and the elementary education departments of some universities, and Gyeongnam has Chinju National University of Education.",
    questions: [
      "How do children think and learn at different ages?",
      "How can we teach difficult concepts so elementary students understand them happily?",
      "How do we make a classroom where every child in the class grows together?",
    ],
    tracks: [
      { name: "Subject Education", d: "Learn how to teach each subject, such as Korean, math, social studies and science, to elementary students." },
      { name: "Arts and PE Education", d: "Learn music, art and PE yourself and how to teach them." },
      { name: "Child Development and Counseling", d: "Learn how to understand children's minds and growth and support classroom life." },
      { name: "Advanced Specialization", d: "Choose one subject or area and study it more deeply (how this works differs by school)." },
    ],
    years: [
      "Year 1: Learn the basics of education, general education and the basic content of elementary school subjects.",
      "Year 2: Learn subject teaching theories, child development and educational psychology, and observe at schools.",
      "Year 3: Learn teaching methods for each subject and do teaching practice at elementary schools.",
      "Year 4: Finish teaching practice and prepare for the elementary school teacher recruitment exam.",
    ],
    skills: ["Explaining things at a child's level", "Broad knowledge to handle many subjects evenly", "Leading a class and resolving conflicts"],
    compare: [
      { with: "Early Childhood Education", diff: "Early Childhood Education trains kindergarten teachers, while Elementary Education trains elementary school teachers." },
      { with: "Education", diff: "Education is a department that studies education as a whole, while Elementary Education aims to train elementary school teachers." },
    ],
    after: "When you graduate, you get the elementary school teacher qualification, and if you pass the elementary teacher recruitment exam of a city or provincial Office of Education, you can become a teacher at a public elementary school. Some go to graduate school for education research or work at education-related organizations.",
    hs: [
      "Make teaching tools that explain an elementary math concept (such as fractions) simply, teach younger children and record the results",
      "Research theories of children's development stages and analyze how they are reflected in elementary textbooks",
      "Research elementary students' smart device habits and make digital citizenship education materials",
    ],
    faq: [
      { q: "Do I need to be good at music, art and PE too?", a: "Elementary teachers teach every subject, so you also learn how to teach arts and PE at university. You don't need to be good at them from the start, but you need an attitude of steadily learning them." },
      { q: "Are there interviews or practical tests?", a: "Universities of education and elementary education departments often hold interviews, and admission methods differ by school. Be sure to check the admission guidelines of the universities you apply to." },
    ],
  },
  youth: {
    intro: "The Department of Youth Studies teaches how to understand teenagers' growth and worries and support them through activities, counseling and welfare so they grow up healthy. It deals with youth activities, career programs, counseling, youth policy and more. You learn to see young people not as problems but as people with potential.",
    questions: [
      "What changes happen to the body and mind during adolescence?",
      "How do we plan activities where young people take part and grow on their own?",
      "How can the community help young people in crisis?",
    ],
    tracks: [
      { name: "Youth Activities", d: "Plan and run youth programs such as camps, clubs, volunteering and cultural activities." },
      { name: "Youth Counseling", d: "Learn how to listen to young people's worries and solve mental problems together." },
      { name: "Youth Welfare and Policy", d: "Learn the systems and policies that protect and support young people." },
    ],
    years: [
      "Year 1: Learn an introduction to youth studies, adolescent psychology and human development.",
      "Year 2: Learn youth activity theory, youth culture and the basics of counseling.",
      "Year 3: Learn program development and evaluation and youth welfare and policy, and do field practice.",
      "Year 4: Finish field practice and projects, and prepare for qualifications such as youth instructor and youth counselor.",
    ],
    skills: ["Empathy to listen to young people with respect", "Planning participation-based programs", "Communication skills to work with local organizations"],
    compare: [
      { with: "Social Welfare", diff: "Social Welfare widely covers welfare for all ages, while Youth Studies focuses on youth activities, counseling and welfare." },
      { with: "Education", diff: "Education mainly deals with school education and how learning works, while Youth Studies also widely covers youth activities and support outside school." },
    ],
    after: "Graduates can work at youth training centers, youth culture centers, youth counseling organizations and the youth departments of local governments. Some prepare for national qualifications such as youth instructor or youth counselor, or study counseling and youth studies further in graduate school.",
    hs: [
      "Survey how students at your school use their free time and suggest youth activities that are needed",
      "Research the role of youth participation bodies (youth councils, participation committees and so on) and summarize examples from your region",
      "Research the causes of youth stress and ways to relieve it, and plan a peer counseling program",
    ],
    faq: [
      { q: "Can I become a youth counselor right after graduating?", a: "To become a youth counselor, you must meet requirements such as education and work experience and then pass an exam. It's good to check the official guide for detailed requirements." },
      { q: "Do I need an outgoing personality to fit in?", a: "Not necessarily. There is work leading activities, but there is also work such as counseling, where you quietly listen, and policy research." },
    ],
  },
  "visual-design": {
    intro: "The Department of Visual Design teaches how to deliver information and messages clearly and attractively with letters, images, colors and video. You design posters, brand logos, books, web and app screens, motion graphics and more. The key is not decorating things to look pretty but solving problems visually.",
    questions: [
      "Why do some posters catch people's eyes while others get passed by?",
      "How do colors and letter shapes affect people's feelings and actions?",
      "How do we design information signs that anyone can understand easily?",
    ],
    tracks: [
      { name: "Graphic and Editorial Design", d: "Arrange text and images in harmony, as in posters, books and magazines." },
      { name: "Brand Design", d: "Express the personality of a company or product with logos, colors and typefaces." },
      { name: "UX/UI Design", d: "Design web and app screens so users can use them comfortably." },
      { name: "Motion Graphics and Video", d: "Deliver messages with moving graphics and video." },
    ],
    years: [
      "Year 1: Learn drawing, color, the basics of form and the basics of design software.",
      "Year 2: Learn typography, editorial design, photography and illustration.",
      "Year 3: Do projects in specific areas such as brand, UX/UI and motion graphics.",
      "Year 4: Complete and exhibit your graduation work and organize your portfolio.",
    ],
    skills: ["Expressing messages visually", "Empathy to observe people's needs", "Technical skills with design tools", "Willingness to accept feedback and revise"],
    compare: [
      { with: "Industrial Design", diff: "Industrial Design designs 3D products such as chairs and home appliances, while Visual Design designs visual information such as graphics, screens and video." },
    ],
    after: "Graduates can work as designers at design companies, advertising agencies, publishers, the UX/UI departments of IT companies, and broadcasting and video production companies, or work as freelancers. Some students go to graduate school or create their own brands.",
    hs: [
      "Analyze the information signs at your school and redesign them so anyone can understand them easily",
      "Show the same sentence in different typefaces (fonts) and survey how the feeling changes",
      "Research color combinations that are easy to tell apart even for people with color vision deficiency and make an infographic",
    ],
    faq: [
      { q: "Is there a practical skills test?", a: "Some universities hold practical tests, and others select students by school records or portfolios without a test. It differs by university and admission track, so be sure to check the admission guidelines." },
      { q: "Do I need to be good at drawing?", a: "Basic drawing skills help, but the ability to organize ideas and communicate them matters more. It's also good to practice expressing ideas with digital tools." },
    ],
  },
  animation: {
    intro: "The Department of Comics and Animation teaches how to plan, draw and produce webtoons, comics and animation. You learn storytelling to create stories, character design, directing, and 2D and 3D animation techniques together. Along with drawing skills, the ability to create stories that move people's hearts is important.",
    questions: [
      "What structure makes readers wait for the next episode of a story?",
      "How are drawings made to look like they are moving?",
      "How do we create characters that viewers remember right away?",
    ],
    tracks: [
      { name: "Webtoons and Comics", d: "Plan stories and panel layouts to produce webtoons and comics." },
      { name: "2D Animation", d: "Learn animation that creates movement by drawing pictures one by one." },
      { name: "3D Animation", d: "Create and move 3D characters and spaces on the computer." },
      { name: "Character and Concept Art", d: "Design the characters and background mood of works and games." },
    ],
    years: [
      "Year 1: Learn drawing, drawing the human figure, color and the basics of storytelling.",
      "Year 2: Learn character design, directing (storyboards) and digital drawing tools.",
      "Year 3: Do projects in each area, such as planning a webtoon series and making 2D and 3D animation.",
      "Year 4: Complete your graduation work and prepare your portfolio and contest entries.",
    ],
    skills: ["Storytelling skills to structure stories", "Drawing skills to express characters and scenes", "Persistence to finish long projects"],
    compare: [
      { with: "Visual Design", diff: "Visual Design focuses on design that delivers information and messages, while Comics and Animation focuses on creating works with stories and characters." },
      { with: "Game Graphics (Game Design)", diff: "Game Graphics focuses on creating graphics and characters for games, while Comics and Animation puts more weight on producing webtoon and animation works." },
    ],
    after: "Graduates can work as webtoon artists or assistants, or at animation studios, the art departments of game companies, and character and content companies. Some start their careers as artists through contests or serialization on platforms, and some research content in graduate school.",
    hs: [
      "Analyze the first episodes of several popular webtoons and summarize the story structures that draw readers in",
      "Make a flip book and compare how movement changes with the number of drawings per second",
      "Make a short webtoon plan and character settings based on a local folktale or a story from Gyeongnam",
    ],
    faq: [
      { q: "Is there a practical skills test?", a: "Many universities hold practical tests, but some select students through portfolios or other admission tracks. It differs by university and admission track, so be sure to check the admission guidelines." },
      { q: "Do I have to go to university to become a webtoon artist?", a: "You can debut through serialization or contests regardless of education. University has the advantage of building basics systematically and meeting people to work with." },
    ],
  },
  "music-prod": {
    intro: "The Department of Popular Music teaches singing, playing, composing, arranging and sound production, focusing on popular music. Along with performance skills for the stage, you learn music theory and production techniques such as recording and mixing. Students usually enter by area, such as vocals, instruments or composition, and practical classes make up a large part.",
    questions: [
      "What rules are hidden in pleasant harmonies and melodies?",
      "Why does the same song feel so different depending on the arrangement?",
      "How is sound polished in a recording studio to complete a music track?",
    ],
    tracks: [
      { name: "Vocals", d: "Build vocal technique and expression and practice songs in various genres." },
      { name: "Instrumental Performance", d: "Major in guitar, bass, drums, keyboards and more, and learn playing and ensemble." },
      { name: "Composition and Arrangement", d: "Write songs and plan the instruments to complete a song." },
      { name: "Sound and Producing", d: "Deal with recording, mixing, audio equipment and music production software." },
    ],
    years: [
      "Year 1: Learn harmony, sight-singing and ear training, the basics of your major instrument or voice, and the basics of music software.",
      "Year 2: Learn practical skills by genre, ensemble playing and the basics of arranging.",
      "Year 3: Do real projects such as producing works, recording and planning performances.",
      "Year 4: Complete a graduation concert or music release and organize your portfolio.",
    ],
    skills: ["A musical sense to hear and express sound accurately", "Self-management to practice every day", "Teamwork to play in sync with other musicians"],
    compare: [
      { with: "Music (vocal, instrumental, composition)", diff: "Music departments mainly focus on classical music, while Popular Music focuses on popular music genres and music production." },
    ],
    after: "Graduates can work as singers, session musicians, composers and arrangers, sound engineers and music producers, or as music academy instructors and at performance and entertainment companies. Even after graduation, many show their skills through steady creative work and experience.",
    hs: [
      "Analyze the chord progressions of songs you like and summarize commonly used progression patterns",
      "Experiment with the relationship between pitch and frequency using a sound measurement app and explore the connection between music and physics",
      "Make a short song with a free music production program and write a production journal comparing it before and after arranging",
    ],
    faq: [
      { q: "Is there a practical skills test?", a: "Most universities hold practical tests by major, and the number of pieces and how to prepare differ by university. It's good to check the admission guidelines of the universities you apply to in advance." },
      { q: "Is it OK if I can't read sheet music?", a: "You learn harmony, sight-singing and ear training after you enter, but learning basic sheet music and chords in advance makes it much easier." },
    ],
  },
  film: {
    intro: "The Department of Theater and Film teaches the process of creating stories on stage and screen, such as acting, directing, screenwriting, filming and editing. You experience many roles, not only actor but also director, writer, camera, editing and stage production. Teamwork to complete works together is truly important in this department.",
    questions: [
      "What do acting and directing need to draw the audience into a story?",
      "How does the same scene feel different depending on camera angles and editing?",
      "How are theater and film different in the way they tell stories?",
    ],
    tracks: [
      { name: "Acting", d: "Practice expressing characters with your body and voice on stage and in front of the camera." },
      { name: "Directing", d: "Learn how to interpret a whole work, build scenes and lead actors and staff." },
      { name: "Screenwriting and Playwriting", d: "Learn how to write plays and film scripts." },
      { name: "Camera, Editing and Video Production", d: "Learn techniques to complete videos with cameras, lighting and editing." },
    ],
    years: [
      "Year 1: Learn basic acting, introductions to theater and film, speech and the basics of video.",
      "Year 2: Learn scene acting, basic directing, screenwriting, and filming and editing.",
      "Year 3: Plan and produce short films or theater performances yourself.",
      "Year 4: Complete a graduation performance or film and prepare your portfolio.",
    ],
    skills: ["Sensitivity to interpret characters and stories", "Teamwork to complete works with many people", "Expressing ideas as scenes"],
    compare: [
      { with: "Broadcasting and Video (Media)", diff: "Broadcasting and Video mainly deals with producing broadcast and media content and the media industry, while Theater and Film teaches producing theater and film works with a focus on acting and directing." },
    ],
    after: "Graduates can work as actors, film and theater directors, broadcast producers, screenwriters, camera and editing staff, and performance planners. Creative work and experience are important in this field, so many people keep building experience through auditions, contests and short film festivals after graduation.",
    hs: [
      "Film the same scene with different camera angles and music and compare how audience reactions change",
      "Turn a scene from a novel into a short script and explore the differences between literary and theatrical expression",
      "Research film festivals and performance culture in Gyeongnam and make a plan for local cultural content",
    ],
    faq: [
      { q: "Is there a practical skills test?", a: "Many universities hold practical tests or interviews by major, such as acting or directing. What to prepare differs by university, so be sure to check the admission guidelines." },
      { q: "Can I apply even if I don't dream of being an actor?", a: "Yes. You can learn many roles in making works, such as directing, screenwriting, filming, editing and stage production." },
    ],
  },
  "sports-sci": {
    intro: "The Department of Physical Education and Sports Science teaches how to understand exercise and sports scientifically, improve health and performance, and coach and manage sports. You study changes in the body during exercise, how the mind works, effective training methods and more. You learn hands-on exercise together with scientific theory.",
    questions: [
      "How do our muscles and heart change when we exercise?",
      "How do we find training methods that improve athletes' records?",
      "How can we create community sports that everyone enjoys?",
    ],
    tracks: [
      { name: "Exercise Physiology and Training", d: "Understand the body's responses to exercise and make effective training plans." },
      { name: "Sport Psychology", d: "Study how the mind works in athletes, such as concentration, nervousness and motivation." },
      { name: "Biomechanics and Sports Data", d: "Analyze movements and help improve records with measurement equipment and data." },
      { name: "Sports Management and Community Sports", d: "Deal with the sports industry, events, facility management and community sports programs." },
    ],
    years: [
      "Year 1: Learn an introduction to physical education, the basics of human anatomy and practical skills in many sports.",
      "Year 2: Learn exercise physiology, sport psychology and biomechanics, and continue practical skills.",
      "Year 3: Learn training methods, sports coaching, and measurement and evaluation, and do field practice.",
      "Year 4: Take advanced courses such as sports management and rehabilitation exercise, do graduation research and prepare for qualifications.",
    ],
    skills: ["Explaining exercise and body changes scientifically", "Leadership to coach and encourage others", "Self-management to practice steadily"],
    compare: [
      { with: "Physical Education (teacher training)", diff: "Physical Education mainly aims to train secondary school PE teachers, while Physical Education and Sports Science covers wider careers such as sports science, coaching and the sports industry." },
      { with: "Physical Therapy", diff: "Physical Therapy is a license program for rehabilitation treatment of injuries and diseases, while Sports Science focuses on exercise coaching and science for health and performance." },
    ],
    after: "Graduates can work as trainers, community sports instructors, and at sports clubs and companies and sports facilities and organizations, and if you complete a teaching certificate course, you can also become a PE teacher (this differs by university). Some prepare for qualifications such as sports instructor and exercise health manager, or research sports science in graduate school.",
    hs: [
      "Measure heart rate and recovery time before and after exercise and compare them with students' fitness levels",
      "Film running or jumping in smartphone slow motion and analyze it with the principles of biomechanics",
      "Research how community sports facilities in your region are used and suggest ways to increase youth participation in exercise",
    ],
    faq: [
      { q: "Is there a practical skills test?", a: "Many universities hold practical tests, but some departments and admission tracks select students without one. The sports and methods differ by university, so be sure to check the admission guidelines." },
      { q: "Is it OK if I wasn't a student athlete?", a: "Yes. There are many fields that understand and study exercise, such as sports science, management and coaching. If you love exercise and enjoy it regularly, you can definitely give it a try." },
    ],
  },
  culinary: {
    intro: "The Department of Culinary Science teaches cooking skills together with the properties of ingredients, the science of taste, hygiene and nutrition, and restaurant management. You practice many kinds of cooking, such as Korean and Western cuisine, and learn how to develop new menus. It is a department that looks at cooking through the eyes of science and business too.",
    questions: [
      "Why does grilled meat develop a delicious smell and brown color?",
      "What cooking methods bring out the taste and nutrition of ingredients?",
      "What is different about the menus and management of restaurants that people come back to?",
    ],
    tracks: [
      { name: "Cooking Practice", d: "Practice cooking skills such as Korean, Western, Chinese and Japanese cuisine and baking." },
      { name: "Culinary and Food Science", d: "Learn scientifically about the components of ingredients and the changes that happen during cooking." },
      { name: "Menu Development and Food Styling", d: "Plan new menus and present food attractively." },
      { name: "Food Service Management", d: "Learn restaurant operation, cost management, service and marketing." },
    ],
    years: [
      "Year 1: Learn cooking basics, food science, hygiene, basic knife skills and basic cooking methods.",
      "Year 2: Learn cooking practice by cuisine, such as Korean and Western, principles of cooking and nutrition.",
      "Year 3: Learn menu development, food styling and food service management, and do field practice.",
      "Year 4: Do a graduation work or menu development project, and prepare for qualifications, jobs or starting a business.",
    ],
    skills: ["A delicate sense for telling tastes and ingredients apart", "Carefulness to keep hygiene and safety", "Teamwork in busy kitchens"],
    compare: [
      { with: "Food and Nutrition", diff: "Food and Nutrition focuses on nutrition, eating habits and careers as a dietitian, while Culinary Science focuses more on cooking skills and the restaurant industry." },
      { with: "Food Engineering", diff: "Food Engineering teaches technologies for mass-producing and storing food in factories, while Culinary Science focuses on cooking, menus and restaurant management." },
    ],
    after: "Graduates can become cooks at hotels and restaurants, or work in menu and product development at food companies, institutional food service and food styling, or start restaurants. Many prepare for national technical qualifications such as cook (craftsman) and grow into professional chefs while building experience in the field.",
    hs: [
      "Observe how the color and smell of meat change with grilling temperature and explain it with the Maillard reaction",
      "Develop youth snack menus using Gyeongnam specialties (anchovies, oysters, sweet persimmons and so on) and analyze their nutrition",
      "Research cooking and ingredient storage methods that reduce food waste and suggest improvements for school meals",
    ],
    faq: [
      { q: "Is there a practical skills test?", a: "Some universities hold practical tests, and others select students by school records or interviews. It differs by university and admission track, so be sure to check the admission guidelines." },
      { q: "Do I need to graduate from a cooking high school or have certificates?", a: "It is not required. But a cooking qualification or cooking experience can help show your interest in the major." },
    ],
  },
};
