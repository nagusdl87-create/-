# 심화 글 작성 지침 (직업·학과)

목표: 커리어넷 자료(입력 파일)를 근거로, 중·고등학생이 읽기 쉬운 "마이로드 심화" 글을 쓴다. 한국어 해요체, 한 문장은 짧게.

## 입력·출력
- 입력: `.content-gen/input/<이름>.json` (배열, 항목마다 커리어넷 자료). 직업이면 jobs-3xx, 학과면 majors-3xx.
- 출력: `.content-gen/output/<이름>.json` — 같은 이름으로 저장. JSON 배열, 항목은 `{ "seq": 번호, "base": {...}, "deep": {...} }`. 입력의 모든 항목을 빠짐없이.
- 파일은 Write 도구로 쓴다. 한 번에 다 쓰기 어려우면 5~7개씩 나눠 임시 파일을 만들었다가 하나의 배열로 합쳐도 된다(최종 출력은 하나의 JSON 배열).
- 끝나면 반드시 `node .content-gen/check.mjs <이름>` 을 실행해 "OK"가 나올 때까지 고친다.

## 예시 (그대로 형식을 따른다)
- 직업: `.content-gen/output/jobs-201.json` 앞의 2개 항목.
- 학과: `src/data/gen/majors.json`의 첫 항목(base)과 `src/data/gen/majors-deep.json`의 `cn-10006`(deep).

## 직업 항목 (jobs)
base: `emoji`(이모지 1개), `field`(life|sci|med|eng|art|media|env|law|edu|biz|it|sports 중 하나), `riasec`(R,I,A,S,E,C 중 1~3개), `values`(stability|service|autonomy|knowledge|achievement|creativity|influence|income 중 2~3개), `summary`(1문장, 80자 이하), `tasks`(3개 짧은 구), `majors`(관련 학과 이름 1~6개, 자료의 관련학과, 없으면 ["특정 학과 제한 없음"]), `hsSubjects`(고교 과목 4~6개, 아래 과목 목록의 이름만), `hsTypes`(general|vocational|science|gifted|autonomous|meister|arts|foreign 중 1~5개), `msActions`(중학생 활동 3개).
deep: `intro`(2~3문장), `work`(5~7개), `day`(정확히 4개 `{t,d}`), `skills`(4~5개 `{k,why}`), `env`, `edu`, `growth`, `future`(각 1~3문장), `hs`(3~4개), `faq`(2~3개 `{q,a}`).

## 학과 항목 (majors)
base: `track`(edu|soc|med|art|eng|ai|biz|hum|nat 중 하나), `desc`(1문장 100자 이하), `univ`(대학에서 배우는 과목 3~6개, 주요교과목 참고), `core`(고교 핵심 과목 2~4개), `rec`(권장 과목 3~6개) — core·rec은 과목 목록의 이름만, `careers`(진출 분야·직업 3~6개). **`jobs` 항목은 넣지 않는다(자동 생성).**
deep: `intro`(2~3문장), `questions`(정확히 3개), `tracks`(3~5개 `{name,d}`), `years`(정확히 4개, "1학년: …" 형식), `skills`(3~4개 문자열), `compare`(1~2개 `{with,diff}` 헷갈리는 학과와 차이), `after`(2문장: 취업·대학원·자격), `hs`(정확히 3개 탐구 주제), `faq`(2~3개 `{q,a}`).

## 과목 이름
`.content-gen/valid-subjects.txt`(한 줄에 하나)에 있는 이름만 쓴다. 입력 자료의 "고교과목2022"는 참고하되, 목록에 없는 이름은 쓰지 않는다(예: "영어 I"이 아니라 목록의 표기를 확인).

## 원칙 (어기면 안 됨)
- **지어내지 않는다.** 연봉·취업률·합격선 같은 숫자, 실존 인물·기관의 확인 안 된 사실은 쓰지 않는다. 입력에 없는 자격증 이름·학교 이름을 만들어 쓰지 않는다. 입력 자료에 근거해서 쓰고, 자료에 없는 일반 설명은 누구나 아는 수준으로만.
- 커리어넷 원문을 길게 그대로 옮기지 않고 학생 눈높이로 다시 쓴다.
- 성별·외모 고정관념 표현을 쓰지 않는다. 학과·직업을 깎아내리거나 과장하지 않는다.
- 일반적인 경로 외에 다른 경로(특성화고·전문대 등)가 있으면 함께 쓴다.
- 직업 이름·학과 이름은 입력의 `name`을 그대로 쓴다.
- 이 저장소의 다른 파일은 수정하지 않는다. 오직 `.content-gen/output/<이름>.json` 한 파일만 만든다(임시 파일은 `.content-gen/tmp/`).
