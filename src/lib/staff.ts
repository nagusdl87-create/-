// 교사·관리자용 Firestore 조회·관리 (firestore.rules 참고)
// - 학생 목록: shared 컬렉션(학생이 공개를 켠 사본)만 읽는다. 읽기 전용이며 화면 메모리에만 두고 저장하지 않는다.
// - 관리자 부여·회수: 마스터만 가능(규칙이 막는다).
import { loadFirebase } from "@/lib/cloud";
import { normalizeFull } from "@/lib/studentData";
import type { AppState } from "@/lib/store";

export type SharedStudent = { uid: string; who: string; updatedAt: number; state: AppState };
export type Member = { uid: string; name: string; email: string };
export type AdminRec = { uid: string; name: string; email: string };

const ms = (v: unknown) => {
  const t = v as { toMillis?: () => number } | null;
  return t?.toMillis ? t.toMillis() : 0;
};

export async function loadSharedStudents(): Promise<SharedStudent[]> {
  const { fs, db } = await loadFirebase();
  const snap = await fs.getDocs(fs.query(fs.collection(db, "shared"), fs.limit(100)));
  const out: SharedStudent[] = [];
  snap.forEach((d) => {
    const v = d.data();
    try {
      const st = normalizeFull(JSON.parse(String(v.data)));
      if (st) out.push({ uid: d.id, who: typeof v.who === "string" ? v.who : "", updatedAt: ms(v.updatedAt), state: st });
    } catch { /* 깨진 문서는 건너뜀 */ }
  });
  return out;
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
