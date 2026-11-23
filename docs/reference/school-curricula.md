# 경남 학교 편제표 (실제 학교 자료)

데이터: `src/data/curricula/index.ts` (`SCHOOL_CURRICULA`) · 화면: `/credits/school` 의 "경남 학교 편제표 불러오기" · 검사: `npm run validate`

## 출처와 방법
- 출처는 **경상남도교육청 고교학점제 누리집 「학교별 교육과정 편성표」 게시판**(https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbsList.do, 2026-11-23 기준 164건·17쪽)에 학교가 공개한 첨부 PDF예요. 로그인 없이 누구나 볼 수 있는 공개 자료예요.
- 게시글의 '미리보기'(공개 문서 뷰어)가 그려 주는 페이지 이미지를 읽어 옮겼어요. 파일 내려받기·압축 파일은 쓰지 않았어요.
- 학점은 표의 **운영학점**, 학기는 표의 학기 칸 기준이에요. 선택군의 고르는 수(pick)는 `표시된 학점 합 ÷ 운영학점`이에요. `↔`로 묶인 칸(음악↔미술, 정보↔한문)은 둘 중 하나를 고르는 선택군으로 옮겼어요.
- **검증**: 학기별로 (지정 과목 + 선택군 학점)을 더해 표의 '학교 지정/학생 선택/총 교과 이수 학점'(학기당 29, 3년 교과 174)과 모두 일치하는지 확인했고, `npm run validate`가 학교 이름(경남 고교 203곳), 출처 정보, 교과 합계 174, 선택군 학점 통일을 검사해요. 과목 이름은 한 곳(마산삼진 '프로그래밍')을 빼고 모두 우리 과목 목록과 일치해요(표에 그렇게 적혀 있어 그대로 두고 안내만 해요).

## 확보한 학교 — PDF 이미지로 옮긴 4곳 (모두 일반고)
| 학교 | 기준 | 문서 이름 | 출처 주소 | 메모 |
|---|---|---|---|---|
| 고성고등학교 | 2026학년도 입학생 | 2026학년도 입학생 3개년 교육과정 편성표.pdf | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260310171817699 | 선택군 A는 2학년 1·2학기 각 1과목. 3학년 예술 과목명은 글씨가 작아 확인 필요 |
| 거창여자고등학교 | 2026학년도 입학생 | 2026학년도 입학생 3개년 교육과정 편성표.pdf | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260715150210478 | 표의 '(경남온)' 표시는 과목 이름에서 뺌. 3학년 예술 과목명은 글씨가 작아 확인 필요 |
| 마산삼진고등학교 | 2026학년도 입학생 | 2026학년도 입학생 학교교육과정 편성표(마산삼진고등학교).pdf | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260618154039635 | 3학년 예술 과목명은 글씨가 작아 확인 필요 |
| 양산여자고등학교 | 2026학년도 입학생 | 2026학년도 입학생 3개년 학교교육과정 편성표(양산여고).pdf | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260616155847776 | 2025학년도 입학생 표와도 대조(같음) |


## 엑셀 편성표로 늘린 학교 (30곳, 2026-11-23 확인)
많은 학교가 PDF 말고 **엑셀(xlsx) 편성표**도 같은 게시글에 올려 두었어요. 게시글의 '미리보기'는 엑셀을 사진이 아니라 **표 글자(HTML)**로 보여 주므로, 이미지 판독 없이 칸 값을 그대로 읽을 수 있어요(내려받기 없음, 공개 문서 뷰어만 사용).
- 방법: 게시글 → 첨부 '미리보기' 주소(/user/bbs/ND_filePreview.do?q_fileSn=…&q_fileId=…) → 뷰어가 가리키는 문서 번호 → 시트 파일(/synap/result/…/문서번호.files/N.xhtml) 중 '2026학년도 입학생 3개년 교육과정 편성표' 시트의 표를 읽음.
- 옮기는 규칙: 지정 과목은 학기 칸의 숫자를 학점으로, 선택군은 '표시된 칸 수 = 고르는 수(pick)', 학점은 운영학점. 선택군 소속 과목은 표시가 없는 줄까지 모두 선택지로 넣음. ↔ 칸은 택1 선택군.
- **자동 검증**: 학기별 (지정 + 선택군) 합이 표의 '총 교과 이수 학점 소계' 6개 학기 값과 모두 같고, 합계 174이며, 선택군 안 학점이 통일된 표만 등록했어요. 하나라도 어긋나면 등록하지 않았어요.
- 과목 이름 뒤 표시 (*)·(★)·(경남온)·(온)과 앞의 * 는 지웠고 '화법과언어'는 '화법과 언어'로 고쳤어요. 학교 자체 과목(우리 목록에 없는 이름)은 그대로 두고 npm run validate가 안내만 해요.
- 코드: `src/data/curricula/xlsx-schools.ts` (압축 데이터 + 변환), 합쳐 쓰는 곳은 `index.ts`.
- 같은 학교에 글이 둘이면 더 최근 글 기준(양산고 6월 글, 합천고 '수정' 글).

| 학교 | 문서 이름 | 출처 주소 |
|---|---|---|
| 범어고등학교 | 2026학년도 학교교육과정 편성표(범어고)(4종).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 양산고등학교 | 2026학년도 학교교육과정 편성표(양산고) - 2026, 2025, 2024 및 전학년(2026.06 공동교육과정 편성 반영).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 창원대암고등학교 | 2026학년도 학교교육과정 편성표(창원대암고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 함안고등학교 | 2026학년도 학교교육과정 편성표(함안고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 성지여자고등학교 | 2026학년도 학교교육과정 편성표(성지여고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 합천고등학교 | 2026학년도 학교교육과정 편성표(수정OX).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 마산무학여자고등학교 | 2026학년도 학교교육과정 편성표(마산무학여고 4종)(excel파일).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 산청고등학교 | 2026학년도 학교교육과정 편성표(산청고등학교).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 마산내서여자고등학교 | 2026학년도 학교교육과정 편성표.xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 창원남고등학교 | 2026학년도 학교교육과정 편성표(창원남고등학교).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 덕산고등학교 | 2026학년도 학교교육과정 편성표 (덕산고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 진해고등학교 | 2026학년도 학교교육과정 편성표(진해고등학교).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 서상고등학교 | 2026학년도 학교교육과정 편성표.xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 창원신월고등학교 | 2026학년도 학교교육과정 편성표(창원신월고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 물금고등학교 | 2026학년도 학교교육과정 편성표(물금고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 철성고등학교 | 2026학년도 철성고 학교교육과정 편성표(전학년).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 양산제일고등학교 | 2026학년도 학교교육과정 편성표(양산제일고등학교).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 창원사파고등학교 | 2026학년도 학교교육과정 편성표(창원사파고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 서창고등학교 | 2026학년도 학교교육과정 편성표(서창고)_2026.05.21..xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 거제옥포고등학교 | 2026학년도 학교교육과정 편성표(거제옥포고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 남해해성고등학교 | 2026학년도 학교교육과정 편성표(남해해성고)(4종).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 웅천고등학교 | 2026학년도 웅천고등학교 학교교육과정 편성표.xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 창원남산고등학교 | 2026학년도 학교교육과정 편성표(4종)(창원남산고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 마산제일고등학교 | 2026학년도 학교육과정 편성표(마산제일고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 창녕대성고등학교 | 2026학년도 학교교육과정 편성표(창녕대성고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 김해분성고등학교 | 2026학년도 학교교육과정 편성표(김해분성고등학교)7.14..xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 창원경일여자고등학교 | 2026학년도 학교교육과정 편성표(창원경일여고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 웅상고등학교 | 2026학년도 학교교육과정 편성표(웅상고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 창원용호고등학교 | 2026학년도 학교교육과정 편성표(창원용호고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |
| 함양고등학교 | 2026학년도 학교교육과정 편성표(함양고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=undefined |

### 이 방식으로 못 옮긴 학교 (사유)
- **엑셀 없이 PDF·한글 파일만 있는 학교(약 60곳)**: 이미지 판독이 필요해 보류(예: 거창여고는 앞서 PDF로 등록했고, 김해가야고·거창고·통영고·진주제일여고·김해분성여고 등).
- **엑셀은 있으나 표 모양이 달라 자동 검증이 안 된 학교(약 39곳)**: 거제고·마산삼진고·고성고·해성고·충렬여고·김해임호고·창원토월고·거창중앙고·삼천포고·효암고·안의고·옥종고·용남고·창선고·진양고·김해영운고·창원중앙여고·칠원고·증산고·남해제일고·창원성민여고·진해세화여고·마산중앙고·김해외국어고·연초고·밀양여고·김해중앙여고·사송고·동원고·야로고·거제상문고·하동고·창원중앙고·밀성고·창원경일고·김해율하고·의령여고 등. 학기별 합은 29×6=174로 맞지만 '총 교과 이수 학점 소계' 행을 못 찾거나 과목 이름 칸이 비어 있어(병합 칸) 읽는 규칙을 더 다듬어야 해요. 자료가 없는 게 아니라 **다음에 이어서 시도할 후보**예요.
- **학기별 합이 표의 소계와 어긋나 보류(약 16곳)**: 옥종고·양산여고(이미 PDF로 등록)·의령고·거창대성고·창녕옥야고·남해고·마산고·명덕고·창원고·창녕여고·창녕고·경남체육고·삼천포여고·경남외국어고·군북고·김해삼방고. 선택군 학점이 학기별로 달라 읽기 규칙이 안 맞는 경우가 많았어요(틀리게 옮기느니 보류).
- **시트를 못 찾은 학교(약 12곳)**: 창신고·대성일고·경남과학고·경남예술고·진해중앙고·삼랑진고·영산고·구산고·진주여고·김해대청고·금남고·진주고(2026 입학생 시트 이름이 달라 찾지 못함).

## (앞선 PDF 작업) 확보 못 한 학교와 사유
같은 게시판에서 첫 쪽(10곳)만 열어 봤고, 나머지 154건(16쪽)은 **시간 때문에 시도하지 못했어요**(자료가 없는 게 아니에요).
| 학교 | 사유 |
|---|---|
| 거제고등학교 | 2026 PDF를 읽었으나 선택군 칸에 대각선 표시(해당 학기 없음)와 병합 칸이 많아 학기 배치를 확신할 수 없어 보류 |
| 양산고등학교 | 글씨가 작고 학년별 학점 합계가 맞지 않아(학기 배치 판독 불확실) 보류 |
| 김해가야고등학교 | '음악·미술↔한문' 같은 복합 칸(2·2↔4학점) 해석이 불확실하고 학기별 학점이 29가 아니라 보류 |
| 범어고등학교 | 열어 보기만 했고 옮기지 못함(글씨가 작고 선택군이 많음) |
| 옥종고등학교 | 학년별로 파일이 나뉘어 있어 시도하지 못함(미열람) |
| 해성고등학교 | 학년별 파일(2026학년도 전 학년)이라 입학생 기준 3개년 표가 아님. 미열람 |
| 그 외 게시판 154건·게시판에 없는 학교 | 미시도. 학교 누리집에 따로 올린 표도 확인하지 않음 |

## 알려 둘 점
- 학교 사정으로 바뀔 수 있어, 화면에서 "학교 공지로 다시 확인"을 안내하고 출처 문서 링크를 붙였어요.
- 문서 뷰어의 이미지가 작아 일부 작은 글씨(3학년 예술 한 쌍)는 판독이 불확실해요. 데이터 안내문(note)에도 적어 두었어요.
- 학교 측 동의는 받지 않았어요(이미 학교가 공개 게시판에 올린 자료). 필요하면 학교별 확인 요청을 별도로 진행하세요.
