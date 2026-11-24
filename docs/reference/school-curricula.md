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


## 엑셀 편성표로 늘린 학교 (65곳: 2026-11-23 30곳 + 2026-11-24 17곳 + 2026-11-24 3차 18곳)
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
| 창원중앙여자고등학교 | 2026학년도 학교교육과정 편성표(창원중앙여고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260305110803526 |
| 김해영운고등학교 | 2026학년도 학교교육과정 편성표(김해영운고)(4종).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260305112722903 |
| 진양고등학교 | 2026학년도 학교교육과정 편성표.xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260305131033520 |
| 안의고등학교 | 2026학년도 학교교육과정 편성표(안의고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260305151707594 |
| 효암고등학교 | 2026학년도 학교교육과정 편성표(양산 효암고)(4종)(excel파일).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260305153444880 |
| 삼천포고등학교 | 2026학년도 학교교육과정 편성표(삼천포고등학교).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260305153953260 |
| 거창중앙고등학교 | 2026학년도 학교교육과정 편성표(거창중앙고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260305155112320 |
| 창원토월고등학교 | 2026학년도 학교교육과정 편성표(4종_창원토월고_변경).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260305160410782 |
| 김해임호고등학교 | 2026학년도 학교교육과정 편성표(김해임호고)_수정.xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260305201700322 |
| 충렬여자고등학교 | 2026학년도 학교교육과정 편성표(충렬여고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260309130119212 |
| 거제고등학교 | 2026학년도 학교교육과정 편성표(거제고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260619145439841 |
| 남해제일고등학교 | 2026학년도 학교교육과정 편성표(남해제일고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260305083224911 |
| 김해외국어고등학교 | 2026학년도 학교교육과정 편성표(4종)_김해외고.xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260304154653814 |
| 연초고등학교 | 2026학년도 학교교육과정 편성표(연초고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260304125411727 |
| 김해중앙여자고등학교 | 2026학년도 학교교육과정 편성표(김해중앙여자고등학교).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260304122208702 |
| 야로고등학교 | 2026학년도 학교교육과정 편성표(야로고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260304112657033 |
| 거제상문고등학교 | 2026학년도 학교교육과정 편성표(거제상문고등학교).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260304105801313 |
| 창원성민여자고등학교 | 2026학년도 학교교육과정 편성표(창원성민여고)(4종).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260304181920335 |
| 진해세화여자고등학교 | 2026학년도 학교교육과정 편성표(진해세화여고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260304155403694 |
| 마산중앙고등학교 | 2026학년도 학교교육과정 편성표(마산중앙고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260304155236017 |
| 밀양여자고등학교 | 2026학년도 학교교육과정 편성표(밀양여고_7.20.).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260304122357694 |
| 옥종고등학교 | 2026학년도 전학년 학교교육과정 편성표(옥종고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260618155656812 |
| 하동고등학교 | 2026학년도 학교교육과정 편성표(하동고)(일반고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260304104408138 |
| 창원중앙고등학교 | 2026학년도 학교교육과정 편성표(창원중앙고)_(0414).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260304102935840 |
| 밀성고등학교 | 2026학년도 학교교육과정 편성표(밀성고)_수정.xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260304090930341 |
| 김해율하고등학교 | 2026학년도 학교교육과정 편성표.xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260303161155888 |
| 의령여자고등학교 | 2026학년도 학교교육과정 편성표(의령여자고등학교).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260303154740800 |
| 칠원고등학교 | 2026학년도 학교교육과정 편성표(칠원고)(4종).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260305105815765 |
| 증산고등학교 | 2026학년도 학교교육과정 편성표(증산고등학교).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260305102326131 |
| 해성고등학교 | 2026학년도 학교교육과정 편성표(해성고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260311105305916 |
| 하동여자고등학교 | 2026학년도 학교교육과정 편성표(하동여자고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260303125056424 |
| 보광고등학교 | 2026학년도 학교교육과정 편성표(보광고등학교).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260303152224316 |
| 아림고등학교 | 2026학년도 학교교육과정 편성표(아림고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260303145310691 |
| 거제제일고등학교 | 2026학년도 학교교육과정 편성표(선택군 알파벳 수정본, 6.12).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260303114224979 |
| 거제중앙고등학교 | 2026학년도 학교교육과정 편성표(안)(거제중앙고).xlsx | https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=20260303111332984 |

### 2026-11-24 추가 작업 메모
- 접속 확인: 이전 차단은 풀려 있었어요(목록 200 응답, error.html 리다이렉트 없음). 요청은 한 번에 1건, 3초 이상 간격, 총 약 57건만 했어요(목록 1쪽 200건 보기 1건 + 학교당 4건: 게시글 → 미리보기 → 색인 xml → 시트). 차단 신호는 없었어요. 원문은 .content-gen/curricula-raw/(저장소 제외)에 저장해 재요청을 피해요.
- 읽는 규칙 보완: 시트는 표(table)가 아니라 div 기반(div.tr / div.td, 병합 칸은 빈 칸)이에요. 헤더는 '과목'(또는 '※과목명…' 안내가 붙은 칸)과 '운영학점', 학기 칸 6개로 찾고, 소계는 '총 교과 편성 학점' 행(또는 '총 교과 이수 학점 소계')으로 찾아요. '음악 ↔ 미술'처럼 과목 칸이 세로로 병합돼 2번째 줄이 빈 경우는 앞 줄 이름을 이어 써요. 선택군 칸에 붙은 안내 글('user:선택 교과(군)…')은 지웠어요.
- 이번에 등록: 충렬여자고, 김해임호고, 창원토월고, 거창중앙고, 삼천포고, 효암고, 안의고, 진양고, 김해영운고, 창원중앙여고. 모두 학기별 (지정+선택군) 합 = 총 교과 학점 6개 학기 값, 합계 174 일치. 삼천포고(29·29·29·30·30·27)와 김해영운고(29·29·29·29·30·28)는 학기별 값이 29가 아니어도 표의 학기별 값과 같아 등록했어요.
- 새로 확인한 보류: 용남고(총 교과 학점이 '174~177'처럼 범위이고 '심의 예정' 표시), 창선고(선택군 G 안에 학점 3과 2가 섞임). 선택군 안 학점이 섞인 표는 틀리게 옮기느니 보류해요.
- 아직 안 한 후보(요청 한도 때문에 시도하지 못함, 같은 방법으로 가능): 거제고, 옥종고, 남해제일고, 창원성민여고, 진해세화여고, 마산중앙고, 김해외국어고, 연초고, 밀양여고, 김해중앙여고, 사송고, 동원고, 야로고, 거제상문고, 하동고, 창원중앙고, 밀성고, 창원경일고, 김해율하고, 의령여고, 칠원고, 증산고, 해성고 등.

### 2026-11-24 2차 추가 작업 메모
- 접속 확인: 목록·게시글 200 응답, error.html 리다이렉트·429·403 없음. 한 번에 1건, 3초 이상 간격으로 약 60건(학교당 4건)만 요청했고 차단 신호는 없었어요. (실수로 거제고 한 곳을 4건 중복 요청함. 동시 요청은 아님) 확인일 2026-11-24.
- 이번에 등록(7곳, 학기별 합=표의 총 교과 학점 6개 값, 합계 174): 거제고(29×6), 남해제일고(29×6), 김해외국어고(영중·영일 시트, 29·29·29·29·30·28), 연초고(30·30·28·30·29·27), 김해중앙여고, 야로고, 거제상문고. 항목마다 출처 주소·문서 이름·확인일(2026-11-24)을 `xlsx-schools.ts`에 남겼어요. 김해외국어고는 같은 파일의 '영중·영일' 계열(1학년 시트) 기준이고 '중영·일영' 계열은 따로 옮기지 않았어요.
- 변환 실패·불일치(원인): 옥종고(선택군C 안 학점 5와 3이 섞임), 사송고(선택군E 2-1 표시값≠운영학점), 창원성민여고('선택군' 구분 행을 못 찾음, 표 형식이 다름), 진해세화여고·마산중앙고('과목'·'운영학점' 헤더를 못 찾음, 표 형식이 다름), 밀양여고(2-1 합 32 ≠ 표 29), 동원고(표 자체 합계가 175로 174가 아님). 모두 틀리게 옮기느니 보류.
- 요청 한도로 시도하지 못한 후보: 하동고, 창원중앙고, 밀성고, 창원경일고, 김해율하고, 의령여고, 칠원고, 증산고, 해성고.
- 규칙 보완 여지: 창원성민여·진해세화여·마산중앙은 '구분|교과(군)|과목유형|과목|기본학점|운영학점' 열 배치(구분 칸이 '학교지정과목' 같은 글이고 과목 칸 앞에 과목유형 열이 있음, 헤더 칸에 안내 글이 붙음)라 열 위치 찾기 규칙을 넓히면 풀릴 수 있어요(시트 원문은 .content-gen/curricula-raw/에 저장해 두어 재요청 없이 시험할 수 있어요). 선택군 안 학점이 섞인 표(옥종·창선)는 선택군을 학점별로 나누는 규칙이 필요해요.

### 2026-11-24 3차 추가 작업 메모
- 저장된 원문으로 읽기 규칙을 넓혀 5곳 등록(재요청 없음): 창원성민여고, 진해세화여고, 마산중앙고, 밀양여고, 옥종고. 규칙 보완 세 가지: (1) 과목 칸을 '기본학점' 바로 왼쪽 칸으로도 찾음(헤더 칸에 안내 글이 붙은 표), (2) '구분' 칸 위치를 헤더에서 찾음(앞에 빈 열이 있는 표), (3) '선택군' 뒤에 나오는 '학교내 소인수 선택과목·공동교육과정(증배)' 같은 묶음은 표의 총 교과 학점에 들어가지 않으므로 옮기지 않음(해당 학교 note에 밝힘). 이 규칙으로 밀양여고의 '2-1 합 32 ≠ 29'도 풀렸어요(증배 과목이 합에 섞인 것이 원인). 옛 등록분은 규칙을 바꿔도 결과가 그대로인지 전 표로 대조했어요.
- 옥종고: 선택군C 학점이 5와 3으로 섞여 있어 학점별로 '선택군C(5학점)'·'선택군C(3학점)'으로 나눠 옮겼어요(2-1은 5학점 칸 1개, 2-2는 3학점 칸 1개 표시, 학기별 합이 표와 일치, note에 밝힘).
- 접속 확인: 목록·게시글 200 응답, error.html 리다이렉트·429·403 없음. 한 번에 1건, 3초 이상 간격, 요청 58건(학교당 4건, 겹침 없음, 파일 카운터에 요청 전 순차 기록). 확인일 2026-11-24. 원문은 .content-gen/curricula-raw/에 저장.
- 새로 등록(13곳, 학기별 합=표의 총 교과 학점 6개 값, 합계 174): 하동고(30·29·30·29·30·26), 창원중앙고(30·30·30·30·28·26), 밀성고, 김해율하고, 의령여고, 칠원고, 증산고(30·30·30·30·27·27), 해성고, 하동여고(30·30·30·30·27·27), 보광고, 아림고, 거제제일고, 거제중앙고. 모두 '2026 입학생 3개년(1학년)' 시트 기준.
- 새로 확인한 보류: 창원경일고(선택군I 3-1에 표시 학점 3, 운영학점 4로 달라 칸 수를 확신할 수 없음), 창선고(학점이 섞인 선택군을 나눠 봤지만 표 합계가 175라 174가 아님), 신등고·김해고(엑셀 없이 PDF만 있음).
- 계속 보류: 사송고(선택군E 2-1 표시값≠운영학점), 동원고(표 합계 175).
- 아직 요청하지 않은 후보: 진주외고, 사천고, 김해경원고, 밀양고, 삼가고, 창원과학고, 단성고, 진교고, 진서고, 양산남부고, 통영고, 통영여고 등 목록의 나머지 게시글.

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
