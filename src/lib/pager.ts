// 쪽 나누기 순수 함수 (Firestore 없이 확인할 수 있게 분리). 쓰임: src/lib/staff.ts, scripts/pager-check.cjs
// 문서 id 순서(__name__)로 쪽을 잇는다. 한 쪽이 PAGE_SIZE보다 적게 오면 끝이다.

export const PAGE_SIZE = 50; // 규칙의 한도(100) 이하

export type PageResult<T> = { items: T[]; cursor: string | null; done: boolean };

/** 이전 목록에 새 쪽을 붙인다. id가 겹치면 새 쪽 것으로 바꾸고, 순서는 처음 나온 자리를 지킨다. */
export function mergePage<T>(prev: T[], page: T[], key: (x: T) => string): T[] {
  const idx = new Map<string, number>();
  const out = prev.slice();
  out.forEach((x, i) => idx.set(key(x), i));
  for (const x of page) {
    const k = key(x);
    const at = idx.get(k);
    if (at === undefined) {
      idx.set(k, out.length);
      out.push(x);
    } else {
      out[at] = x;
    }
  }
  return out;
}

/** 이 쪽 문서 id들로 다음 커서(마지막 id)와 끝 여부를 정한다. 깨진 문서가 걸러져도 커서는 원본 기준이다. */
export function pageState(ids: string[], pageSize: number = PAGE_SIZE): { cursor: string | null; done: boolean } {
  return { cursor: ids.length ? ids[ids.length - 1] : null, done: ids.length < pageSize };
}

/** 이름·학교 검색(대소문자 무시) */
export function filterByText<T>(list: T[], q: string, text: (x: T) => string): T[] {
  const s = q.trim().toLowerCase();
  return s ? list.filter((x) => text(x).toLowerCase().includes(s)) : list;
}
