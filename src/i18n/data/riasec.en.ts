// 영어 자료: 흥미 탐색(riasec.ts). 키는 원본과 같은 id/유형/한국어 강점 이름.
import type { RiasecKey } from "@/data/riasec";

export const RIASEC_EN: Record<RiasecKey, { name: string; short: string; desc: string; keywords: string[] }> = {
  R: {
    name: "Realistic",
    short: "Making & doing",
    desc: "You like using your hands or body to make things, fix things and try things out yourself. Work with results you can see gives you energy.",
    keywords: ["handy", "machines", "sports", "hands-on practice", "nature"],
  },
  I: {
    name: "Investigative",
    short: "Curiosity & analysis",
    desc: "When you wonder why something happens, you dig in until you find out. You enjoy observing, experimenting and figuring out how things work.",
    keywords: ["curiosity", "science", "math", "logic", "research"],
  },
  A: {
    name: "Artistic",
    short: "Imagination & expression",
    desc: "You like expressing your thoughts and feelings in your own way, through drawing, writing, music or video. You prefer trying new things over following a fixed pattern.",
    keywords: ["creativity", "sensitivity", "design", "writing", "music"],
  },
  S: {
    name: "Social",
    short: "Helping & teamwork",
    desc: "You find meaning in talking with people, teaching them and helping them. You are good at noticing how other people feel.",
    keywords: ["empathy", "kindness", "teaching", "counseling", "volunteering"],
  },
  E: {
    name: "Enterprising",
    short: "Leading & challenges",
    desc: "You like setting goals, leading people and getting things done. Persuading, planning and taking on new challenges excite you.",
    keywords: ["leadership", "persuasion", "planning", "business", "challenge"],
  },
  C: {
    name: "Conventional",
    short: "Organizing & attention to detail",
    desc: "You are good at organizing things by the rules and getting them done step by step, as planned. You are careful and have a strong sense of responsibility.",
    keywords: ["organizing", "planning", "numbers", "accuracy", "responsibility"],
  },
};

// 문항 id → 영어 문장
export const QUESTIONS_EN: Record<number, string> = {
  1: "I want to take apart or fix broken things myself.",
  2: "When I see science news or an amazing natural event, I look up how it works.",
  3: "I enjoy making my own creations, like drawings, writing, songs or videos.",
  4: "When a friend shares a worry, I want to listen to the end and help.",
  5: "In group work, I am usually the one who divides roles and takes the lead.",
  6: "I feel at ease only when my desk, notes and files are neatly organized.",
  7: "I like activities where I finish something with my hands, like LEGO, assembling or crafts.",
  8: "I feel proud when I keep working on a hard math or science problem until I solve it.",
  9: "I like coming up with unique ideas that are different from other people's.",
  10: "I enjoy explaining things to a younger sibling or a friend who doesn't understand.",
  11: "I would like to take on a role like class president or club leader.",
  12: "I feel good when I make a plan and stick to it.",
  13: "I prefer classes where I move my body, like PE or technology practice.",
  14: "I find it fun to do experiments or observations and record the results.",
  15: "When I listen to music or watch a movie, I imagine how I would make it.",
  16: "I find volunteering or helping someone rewarding.",
  17: "I am confident about persuading other people with my opinion.",
  18: "I am good at organizing numbers or data into tables and finding mistakes.",
  19: "I like outdoor activities like growing plants, caring for animals or camping.",
  20: "When I wonder why something is the way it is, it bothers me until I look it up myself.",
  21: "I like decorating my clothes, room or notebooks in my own style.",
  22: "When a new student transfers in, I am the first to talk to them.",
  23: "I would like to sell things or plan an event and get good results.",
  24: "I am more comfortable and make fewer mistakes with work that has set rules and steps.",
  25: "I find it interesting to handle tools, machines or electronic parts.",
  26: "I like activities where I think logically, like coding, puzzles or mystery games.",
  27: "I enjoy making up stories, like diaries, novels or webtoons.",
  28: "I usually help settle arguments between people and improve the mood.",
  29: "Someday I would like to run my own company or shop.",
  30: "I have a habit of keeping careful records, like tracking my pocket money or managing my schedule.",
};

// 답 척도(v) → 영어
export const SCALE_EN: Record<number, string> = {
  1: "Not at all",
  2: "Not really",
  3: "Yes",
  4: "Very much",
};

export const VALUES_EN: Record<string, { label: string; desc: string }> = {
  stability: { label: "Stability", desc: "Being able to work steadily for a long time" },
  achievement: { label: "Achievement", desc: "Reaching goals and being recognized for my skills" },
  service: { label: "Service", desc: "Helping other people and society" },
  creativity: { label: "Creativity", desc: "Making and trying new things" },
  autonomy: { label: "Autonomy", desc: "Working freely in my own way" },
  income: { label: "Financial reward", desc: "Earning enough income" },
  knowledge: { label: "Pursuit of knowledge", desc: "Continuing to learn and discover new things" },
  influence: { label: "Influence", desc: "Leading people and making change" },
};

// 강점(한국어 이름) → 영어
export const STRENGTHS_EN: Record<string, string> = {
  "꼼꼼함": "Attention to detail",
  "끈기": "Persistence",
  "호기심": "Curiosity",
  "공감 능력": "Empathy",
  "말하기": "Speaking",
  "글쓰기": "Writing",
  "손재주": "Handiness",
  "체력": "Physical stamina",
  "수학적 사고": "Mathematical thinking",
  "창의력": "Creativity",
  "리더십": "Leadership",
  "책임감": "Responsibility",
  "관찰력": "Observation",
  "협동": "Teamwork",
  "외국어": "Foreign languages",
  "디지털 활용": "Digital skills",
};
