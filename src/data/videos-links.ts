// 공식 채널에서 영상 찾기 링크(화면 코드에서 가볍게 쓰도록 영상 목록과 따로 둔다)
export const videoSearchLinks = (q: string) => [
  { label: "한국고용정보원 직업진로동영상", url: `https://www.youtube.com/@KEISwork2011/search?query=${encodeURIComponent(q)}` },
  { label: "한국고용정보원(고용24)", url: `https://www.youtube.com/@worknet_keis/search?query=${encodeURIComponent(q)}` },
  { label: "커리어넷 직업·학과 영상", url: "https://www.career.go.kr/" },
];
