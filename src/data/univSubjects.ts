// 대학이 공식 발표한 2028학년도 전공 연계(권장) 과목 자료. 과목 목록은 대학마다 기준이 다르고 바뀔 수 있어 옮겨 적지 않고 원문으로 연결한다.
// 확인: 2026-11-22 (주소 접속·문서 제목 확인). 링크는 매일 숫자 점검(scripts/check-stats.ts)에서 접속 여부를 함께 확인한다.
export type SubjectDoc = { univ: string; title: string; url: string; note?: string };

export const SUBJECT_DOCS: SubjectDoc[] = [
  { univ: "서울대학교", title: "2028학년도 전공 연계 과목 선택 안내", url: "https://admission.snu.ac.kr/undergraduate/notice?md=v&bbsidx=156194" },
  { univ: "연세대학교", title: "2028학년도 전공연계과목 선택 가이드라인", url: "https://www2.yonsei.ac.kr/entrance/plan/2028_guide.pdf" },
  { univ: "중앙대학교", title: "2028학년도 학문단위별 권장과목", url: "https://admission.cau.ac.kr/files/2026/CAU_2028_subjects.pdf" },
  { univ: "경희대학교", title: "2028 자연계열 학문 분야 고교 교과 이수 권장과목", url: "https://iphak.khu.ac.kr", note: "입학처 공지사항에서 확인" },
  { univ: "고려대학교", title: "자연계열 권장 이수 과목 가이드라인", url: "https://oku.korea.ac.kr", note: "입학처 공지사항에서 확인" },
];

export const SUBJECT_DOCS_NOTE =
  "대학마다 권장과목을 정하는 기준이 달라요(정하지 않는 대학도 있어요). 경남 지역 대학을 포함한 다른 대학은 대입정보포털 어디가와 각 대학 입학처에서 2028학년도 자료를 확인하세요.";
