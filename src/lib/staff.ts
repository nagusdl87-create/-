// 교사·관리자용 Firestore 조회·관리 (firestore.rules 참고)
// - 학생 목록: shared 컬렉션(학생이 공개를 켠 사본)만 읽는다. 읽기 전용이며 화면 메모리에만 두고 저장하지 않는다.
// - 관리자 부여·회수: 마스터만 가능(규칙이 막는다).
import { loadFirebase } from "@/lib/cloud";
import { normalizeFull } from "@/lib/studentData";
import type { AppState } from "@/lib/store";
import { PAGE_SIZE, pageState, type PageResult } from "@/lib/pager";

export type SharedStudent = { uid: string; who: string; updatedAt: number; state: AppState };
export type Member = { uid: string; name: string; email: string };
export type AdminRec = { uid: string; name: string; email: string };

const ms = (v: unknown) => {
  const t = v as { toMillis?: () => number } | null;
  return t?.toMillis ? t.toMillis() : 0;
};

/** 학생 한 쪽(문서 id 순, 최대 PAGE_SIZE명). after = 이전 쪽의 cursor. 규칙의 limit<=100 안에서 인덱스 없이 동작한다. */
export async function loadSharedPage(after: string | null): Promise<PageResult<SharedStudent>> {
  const { fs, db } = await loadFirebase();
  const col = fs.collection(db, "shared");
  const snap = await fs.getDocs(
    after
      ? fs.query(col, fs.orderBy(fs.documentId()), fs.startAfter(after), fs.limit(PAGE_SIZE))
      : fs.query(col, fs.orderBy(fs.documentId()), fs.limit(PAGE_SIZE)),
  );
  const items: SharedStudent[] = [];
  snap.forEach((d) => {
    const v = d.data();
    try {
      const st = normalizeFull(JSON.parse(String(v.data)));
      if (st) items.push({ uid: d.id, who: typeof v.who === "string" ? v.who : "", updatedAt: ms(v.updatedAt), state: st });
    } catch { /* 깨진 문서는 건너뜀 */ }
  });
  return { items, ...pageState(snap.docs.map((d) => d.id)) };
}

export async function loadMembers(): Promise<Member[]> {
  const { fs, db } = await loadFirebase();
  const snap = await fs.getDocs(fs.query(fs.collection(db, "members"), fs.limit(500)));
  return snap.docs.map((d) => ({ uid: d.id, name: String(d.data().name ?? ""), email: String(d.data().email ?? "") }));
}

export async function loadAdmins(): Promise<AdminRec[]> {
  const { fs, db } = await loadFirebase();
  const snap = await fs.getDocs(fs.collection(db, "admins"));
  return snap.docs.map((d) => ({ uid: d.id, name: String(d.data().name ?? ""), email: String(d.data().email ?? "") }));
}

export async function grantAdmin(m: Member, byEmail: string) {
  const { fs, db } = await loadFirebase();
  await fs.setDoc(fs.doc(db, "admins", m.uid), { email: m.email, name: m.name, by: byEmail, at: Date.now() });
}

export async function revokeAdmin(uid: string) {
  const { fs, db } = await loadFirebase();
  await fs.deleteDoc(fs.doc(db, "admins", uid));
}
