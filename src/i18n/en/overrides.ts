// 영역별 사전에서 같은 한국어 문구를 서로 다르게 옮긴 경우, 여기서 하나로 정한다(가장 나중에 합침).
export const OVERRIDES: Record<string, string> = {
  "1학년 1학기": "Year 1, Semester 1",
  "1학년 2학기": "Year 1, Semester 2",
  "2학년 1학기": "Year 2, Semester 1",
  "2학년 2학기": "Year 2, Semester 2",
  "3학년 1학기": "Year 3, Semester 1",
  "3학년 2학기": "Year 3, Semester 2",
  "{n}명": "{n}",
  "길 잇기": "Connect the Path",
  "검색 결과가 없어요.": "No results found.",
  "도구": "Tools",
};
