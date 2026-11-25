# .content-gen — 내용 생성·수집 도구 모음

앱 실행에는 필요 없는 **작업용 도구**예요(저장소에는 있지만 빌드에는 쓰이지 않아요). 다른 컴퓨터에서도 이어 쓸 수 있게 올려 두었어요.
`npm ci` 후 저장소 루트에서 `node .content-gen/...`로 실행해요. 경로는 저장소 위치에 맞게 자동으로 잡혀요.

## 폴더
- `curricula-tools/` 경남 학교 편제표 수집·검증·등록 도구. 순서·접속 예절·보류 기준은 `docs/reference/school-curricula.md`와 `CLAUDE.md` 결정 9번.
  - `list.cjs` 목록(`list.json`)과 미시도 게시글 확인, `getschoolN.cjs`+`runN.sh` 한 번에 수집(요청 60건 한도, 카운터 `countN.txt`는 저장소에 없음 — 새로 `echo 0 > countN.txt`), `merge2.cjs <게시글번호…>`로 `src/data/curricula/xlsx-schools.ts`에 등록.
  - 내려받은 원문은 `.content-gen/curricula-raw/`에 쌓이고 저장소에는 올리지 않아요(다시 받으면 돼요).
- 루트의 `*.mjs`·`INSTRUCTIONS.md`·`EN-INSTRUCTIONS.md` 직업·학과 본문 생성·영어 번역 작업용(2026-11 작업 기록). `src/data/gen/*.json`이 결과물이에요.

## 주의
- 접속 예절을 지키세요(한 번에 1건, 3초 이상 간격, 차단 신호가 나오면 즉시 중단·우회 금지).
- API 키·비밀번호를 이 폴더에 두지 마세요(저장소에 올라가요).
