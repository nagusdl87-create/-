// 쪽 나누기 순수 함수 확인: node --experimental-strip-types scripts/pager-check.mts
import assert from "node:assert/strict";
import { mergePage, pageState, filterByText, PAGE_SIZE } from "../src/lib/pager.ts";

// 가짜 컬렉션 230명을 id 순으로 쪽씩 읽는다
const all = Array.from({ length: 230 }, (_, i) => ({ uid: "u" + String(i).padStart(4, "0"), n: i }));
const fetchPage = (after: string | null) => all.filter((x) => !after || x.uid > after).slice(0, PAGE_SIZE);
let list: typeof all = [];
let cursor: string | null = null;
let pages = 0;
for (;;) {
  const page = fetchPage(cursor);
  const st = pageState(page.map((x) => x.uid));
  list = mergePage(list, page, (x) => x.uid);
  cursor = st.cursor;
  pages++;
  if (st.done) break;
}
assert.equal(list.length, 230);
assert.equal(pages, 5);
assert.deepEqual(list.map((x) => x.uid), all.map((x) => x.uid));

// 정확히 PAGE_SIZE의 배수면 빈 쪽을 한 번 더 읽고 끝난다
assert.deepEqual(pageState(Array(PAGE_SIZE).fill("a")).done, false);
assert.deepEqual(pageState([]), { cursor: null, done: true });

// 중복 제거: 같은 id는 새 값으로 바꾸고 순서는 유지
const m = mergePage([{ uid: "a", n: 1 }, { uid: "b", n: 2 }], [{ uid: "b", n: 9 }, { uid: "c", n: 3 }], (x) => x.uid);
assert.deepEqual(m, [{ uid: "a", n: 1 }, { uid: "b", n: 9 }, { uid: "c", n: 3 }]);
assert.deepEqual(mergePage([], [{ uid: "x", n: 1 }, { uid: "x", n: 2 }], (x) => x.uid), [{ uid: "x", n: 2 }]);

// 검색
assert.equal(filterByText(["김민수 A중", "이서연 B고"], " 서연", (s) => s).length, 1);
assert.equal(filterByText(["a", "b"], "  ", (s) => s).length, 2);
console.log("pager-check OK");
