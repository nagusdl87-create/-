"""경남 고등학교 데이터 생성 스크립트.

입력(수집 원본):
  - gne_schools.json : 경상남도교육청 고등학교 입학포털(highschool.gne.go.kr) 고교현황 목록
  - gn_hs.json       : 공공데이터포털 '전국초중등학교위치표준데이터' + NEIS 학교기본정보
출력: src/data/gn-schools.json
사용: python3 scripts/build-schools.py <수집폴더>
"""
import json, re, sys, os

src = sys.argv[1]
g = json.load(open(os.path.join(src, "gne_schools.json")))
n = json.load(open(os.path.join(src, "gn_hs.json")))
byname = {o["csv"]["학교명"]: o for o in n}

def short(name):
    return name.replace("고등학교", "고")

out = []
for s in g:
    o = byname.get(s["name"])
    csv, neis = (o or {}).get("csv", {}), (o or {}).get("neis") or {}
    trait = s["trait"]
    m = re.search(r"평준화 (\d)학군", trait)
    if s["code"] == "08":
        sub = neis.get("SPCLY_PURPS_HS_ORD_NM") or ""
        kind = {"과학계열": "science", "외국어계열": "foreign", "예술계열": "arts", "체육계열": "sports"}.get(sub, "meister")
        if "마이스터" in s["name"] or "산업수요" in sub or "항공과학" in s["name"]:
            kind = "meister"
    elif s["code"] == "09":
        kind = "vocational"
    elif s["code"] in ("10", "11"):
        kind = "special"
    else:
        kind = "autonomous" if neis.get("HS_SC_NM") == "자율고" else "general"
    if m:
        zone = f"평준화 {m.group(1)}학군"
    elif s["code"] == "06":
        zone = "평준화지역 학교장전형"
    elif s["code"] == "07":
        zone = "비평준화"
    else:
        zone = None
    round_ = "후기" if kind in ("general", "autonomous", "foreign") else "전기"
    segs = re.findall(r"(\d+)\(([^()]*?)(?:\(([^()]*)\))?\)\s*/\s*(\d+)", s["classes"])
    depts, genders = [], set()
    for n_cls, a, b, q in segs:
        gender = b or a
        if b:
            depts.append({"name": a, "classes": int(n_cls), "quota": int(q)})
        genders.add({"남자": "남", "여자": "여"}.get(gender, gender))
    genders.discard("")
    coedu = "공학" if ("공학" in genders or len(genders) > 1) else (genders.pop() if genders else {"남여공학": "공학", "남": "남", "여": "여"}.get(neis.get("COEDU_SC_NM"), ""))
    home = neis.get("HMPG_ADRES") or ""
    if home and not home.startswith("http"):
        home = "http://" + home
    lat, lng = csv.get("위도"), csv.get("경도")
    out.append({
        "id": neis.get("SD_SCHUL_CODE") or short(s["name"]),
        "name": s["name"],
        "region": s["region"],
        "kind": kind,
        "zone": zone,
        "round": round_,
        "nationwide": "전국" in s["unit"],
        "unit": s["unit"],
        "classes": sum(int(x[0]) for x in segs) if segs else None,
        "quota": sum(int(x[3]) for x in segs) if segs else None,
        "depts": depts,
        "coedu": coedu,
        "found": csv.get("설립형태") or neis.get("FOND_SC_NM") or "",
        "addr": csv.get("소재지도로명주소") or neis.get("ORG_RDNMA") or "",
        "tel": neis.get("ORG_TELNO") or "",
        "home": home,
        "hischool": s["hischool"],
        "lat": round(float(lat), 6) if lat else None,
        "lng": round(float(lng), 6) if lng else None,
    })

out.sort(key=lambda x: (x["region"], x["name"]))
dst = os.path.join(os.path.dirname(__file__), "..", "src", "data", "gn-schools.json")
json.dump(out, open(dst, "w"), ensure_ascii=False, separators=(",", ":"))
from collections import Counter
print(len(out), Counter(x["kind"] for x in out), Counter(x["zone"] for x in out), "no coords:", [x["name"] for x in out if x["lat"] is None])
