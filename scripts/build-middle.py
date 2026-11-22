"""경남 중학교 정보 보강: src/data/gn-middle.json(이름·지역·좌표)에 나이스 학교기본정보(학교코드·주소·전화·누리집·남녀공학·설립)를 더한다.
인증키 없이 학교명 단건 조회로 동작(나이스 공개 표본 호출). 사용: python3 scripts/build-middle.py
해마다 개교·폐교·교명 변경 후 다시 실행한다."""
import json, os, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor

P = os.path.join(os.path.dirname(__file__), "..", "src", "data", "gn-middle.json")
data = json.load(open(P))

def info(m):
    name = m["name"]
    u = "https://open.neis.go.kr/hub/schoolInfo?" + urllib.parse.urlencode({"Type": "json", "pIndex": 1, "pSize": 5, "ATPT_OFCDC_SC_CODE": "S10", "SCHUL_NM": name})
    for t in range(3):
        try:
            j = json.load(urllib.request.urlopen(u, timeout=20))
            rows = j.get("schoolInfo", [{}, {}])[1].get("row", []) if "schoolInfo" in j else []
            same = [x for x in rows if x["SCHUL_NM"] == name]
            # 같은 이름 학교가 여러 곳이면(예: 해성중학교 거제·남해) 주소의 시·군으로 고른다
            r = next((x for x in same if m["region"] in (x.get("ORG_RDNMA") or "")), None) or (same[0] if len(same) == 1 else None)
            return r
        except Exception:
            time.sleep(1 + t)
    return None

with ThreadPoolExecutor(6) as ex:
    rows = list(ex.map(info, data))

miss = []
for m, r in zip(data, rows):
    if not r:
        miss.append(m["name"]); continue
    home = (r.get("HMPG_ADRES") or "").strip()
    if home in ("http://", "https://"): home = ""
    if home and not home.startswith("http"): home = "http://" + home
    tel = (r.get("ORG_TELNO") or "").strip()
    m.update({
        "code": (r.get("SD_SCHUL_CODE") or "").strip(),
        "addr": (r.get("ORG_RDNMA") or "").strip(),
        "tel": "" if tel.startswith("0551111") else tel,
        "home": home,
        "coedu": {"남여공학": "공학", "남": "남", "여": "여"}.get(r.get("COEDU_SC_NM") or "", r.get("COEDU_SC_NM") or ""),
        "found": (r.get("FOND_SC_NM") or "").strip(),
    })
json.dump(data, open(P, "w"), ensure_ascii=False, separators=(",", ":"))
print(f"중학교 {len(data)}곳, 나이스 정보 보강 {len(data) - len(miss)}곳, 못 찾음 {miss}")
