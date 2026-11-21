"""전국 대학 학과 데이터 생성 → public/data/univ-index.json

입력(공공데이터포털, 이용허락범위 제한 없음):
  A. 전국대학별학과정보표준데이터 (한국대학교육협의회, data.go.kr 15107737)  — 학과·주요교과목·관련직업(2025)
     폐과 제외·학사/전문학사·중복 제거한 CSV: univ_major_active_undergrad_dedup.csv
  B. 대학알리미 대학별 학과정보 (한국대학교육협의회, data.go.kr 15014632) — 표준분류 대/중/소계열(2023)
사용: python3 scripts/build-univ.py <A.csv> <B.csv>
"""
import csv, json, os, re, sys
from collections import Counter, defaultdict

a_path, b_path = sys.argv[1], sys.argv[2]
A = list(csv.DictReader(open(a_path, encoding="utf-8-sig")))
B = [x for x in csv.DictReader(open(b_path, encoding="utf-8-sig")) if "폐지" not in x["학과상태"]]

STALE = {"경남과학기술대학교", "진주산업대학교", "진주산업대학교(산업대)", "창신대학"}  # 통합·개명 전 이름(데이터 잔존)
A = [x for x in A if x["학교명"] not in STALE and x["학위과정명"] in ("학사", "전문학사")]

# 학과명 → 소계열 (다수결), 표준분류코드 → 소계열 (다수결)
name2 = defaultdict(Counter)
for x in B:
    name2[x["학부_과(전공)명"]][(x["표준분류대계열"], x["표준분류중계열"], x["표준분류소계열"])] += 1
code2 = defaultdict(Counter)
for x in A:
    if x["학과명"] in name2:
        code2[x["표준분류계열코드"]][name2[x["학과명"]].most_common(1)[0][0]] += 1

def classify(x):
    if x["학과명"] in name2:
        return name2[x["학과명"]].most_common(1)[0][0]
    if x["표준분류계열코드"] in code2:
        return code2[x["표준분류계열코드"]].most_common(1)[0][0]
    return None

SIDO = {"경상남도": "경남", "경상북도": "경북", "서울특별시": "서울", "부산광역시": "부산", "대구광역시": "대구", "인천광역시": "인천", "광주광역시": "광주",
        "대전광역시": "대전", "울산광역시": "울산", "세종특별자치시": "세종", "경기도": "경기", "강원특별자치도": "강원", "강원도": "강원", "충청북도": "충북",
        "충청남도": "충남", "전북특별자치도": "전북", "전라북도": "전북", "전라남도": "전남", "제주특별자치도": "제주", "전남광주통합특별시": "광주·전남"}

schools, sidx = [], {}
groups = defaultdict(lambda: {"depts": [], "subj": Counter(), "jobs": Counter()})
unk = 0
for x in A:
    sido = SIDO.get(x["시도명"], x["시도명"])
    key = (x["학교명"], sido)  # 같은 학교라도 지역이 다른 캠퍼스는 따로 (예: 부산대학교 밀양캠퍼스)
    if key not in sidx:
        sidx[key] = len(schools)
        schools.append([x["학교명"], sido, x["시군구명"], x["학교구분명"]])
    c = classify(x)
    if not c:
        unk += 1
        c = ("기타", "기타", x["대학자체계열명"] or "기타")
    g = groups[c]
    g["depts"].append([sidx[key], x["학과명"], 1 if x["학위과정명"] == "학사" else 2])
    for s in [s for s in x["주요교과목명"].split("+") if s.strip() and s.strip() not in ("없음", "-", "해당없음")]:
        g["subj"][s.strip()] += 1
    for j in [j for j in x["관련직업명"].split("+") if j.strip() and j.strip() not in ("없음", "-", "해당없음")]:
        g["jobs"][j.strip()] += 1

out_groups = []
for (big, mid, small), g in sorted(groups.items(), key=lambda kv: (kv[0][2].startswith("N.C.E") or kv[0][0] == "기타", -len(kv[1]["depts"]))):
    out_groups.append({
        "big": big, "mid": mid, "small": small,
        "depts": g["depts"],
        "subjects": [s for s, _ in g["subj"].most_common(12)],
        "jobs": [j for j, _ in g["jobs"].most_common(12)],
    })

# 대학 누리집·2028 기본계획 PDF (경상남도교육청 경남대입정보센터 연도별대학정보, data.go.kr 15135448)
links = json.load(open(os.path.join(os.path.dirname(__file__), "raw", "gne-univ-list.json")))["universities"]
base = lambda n: re.sub(r"\(.*?\)", "", n).replace(" ", "")
lk = {}
for u in links:
    lk.setdefault(base(u["name"]), u)
hit = 0
for s in schools:
    u = lk.get(base(s[0]))
    s.extend([u["homepage"] if u else "", u["plan2028Pdf"] if u else ""])
    hit += 1 if u else 0
print("link matched", hit, "/", len(schools))

out = {
    "source": "한국대학교육협의회 전국대학별학과정보표준데이터(2025, data.go.kr 15107737) · 대학알리미 대학별 학과정보 표준분류(2023, data.go.kr 15014632)",
    "asOf": A[0]["데이터기준일자"] if A else "",
    "schools": schools,
    "groups": out_groups,
}
dst = os.path.join(os.path.dirname(__file__), "..", "public", "data", "univ-index.json")
json.dump(out, open(dst, "w"), ensure_ascii=False, separators=(",", ":"))
print("schools", len(schools), "groups", len(out_groups), "depts", sum(len(g["depts"]) for g in out_groups), "unclassified", unk, "bytes", os.path.getsize(dst))
print("경남 schools", sum(1 for s in schools if s[1] == "경남"), [s[0] for s in schools if s[1] == "경남"][:40])
