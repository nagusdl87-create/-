# 영어 이름·문구 번역 지침 (직업·학과)

목표: 한국어 직업·학과 자료를 영어로 옮긴다. 대상은 중·고등학생과 보호자. 규칙은 `docs/i18n.md`의 "번역 원칙"을 따른다.

## 입력·출력
- 입력: `.content-gen/en-input/<이름>.json` (배열). 출력: `.content-gen/en-output/<이름>.json` — 같은 이름, 같은 순서, 같은 id, 같은 배열 길이.
- 직업(`jobs-4xx`): 입력 `{id,name,summary,tasks[],msActions[]}` → 출력 같은 키. tasks·msActions는 **같은 개수·같은 순서**로 번역.
- 학과(`majors-4xx`): 입력 `{id,name,desc,univ[],careers[]}` → 출력 같은 키. univ·careers도 같은 개수·같은 순서.
- 이름 목록(`extras-4xx`): 입력 `{id,name}`(id는 한국어 학과 이름 그대로) → 출력 `{id, name}`: id는 **그대로 두고** name에 영어 학과 이름.
- 끝나면 반드시 `node .content-gen/en-check.mjs <이름>` 이 OK가 될 때까지 고친다. 출력 파일은 Write 도구로 쓰고, 한 번에 어려우면 임시 파일은 `.content-gen/tmp/`에 둔다.

## 번역 원칙
- 쉬운 영어(CEFR B1~B2). 한 문장은 짧게. 내용을 늘리거나 줄이지 않고, 사실을 바꾸지 않는다. 숫자·고유명사는 그대로.
- 직업 이름: 영어에서 실제로 쓰는 표준 직업명(예: 회계사 → Accountant, 간호사 → Nurse). 한국 고유 직업은 영어 설명 + 필요하면 괄호에 로마자(예: 해녀 → Haenyeo (traditional female sea diver)). 한국어 글자를 남기지 않는다(`[가-힣]` 0자).
- 학과 이름: 영어권 대학의 학과 이름 형태(예: 국어국문학과 → Korean Language and Literature, 간호학과 → Nursing). 대학 교과목(univ)은 표준 과목명 영어로.
- summary·desc는 입력과 같은 어조의 현재형 한 문장(주어 생략 가능). 예: "Designs and builds AI models ..." / "Study the structure of ...". 직업 summary는 3인칭 현재형 동사로 시작, 학과 desc는 명령형/동사 원형("Learn ...", "Study ...")도 가능하되 한 파일 안에서 일관되게.
- msActions(중학생 활동)는 "~해 보기" 같은 활동 문구라서 동사 원형 시작("Try ...", "Visit ...", "Make ...").
- 같은 파일 안에서 서로 다른 항목의 name은 가능하면 서로 다르게(비슷한 직업은 구분되는 단어를 쓴다).
- 한국어 제도 용어는 영어 + 괄호 한국어를 쓰지 않는다(검사에서 한글 0자여야 함). 영어만 쓴다.
- 입력에 없는 정보를 지어내지 않는다. 이 저장소의 다른 파일은 수정하지 않는다.
