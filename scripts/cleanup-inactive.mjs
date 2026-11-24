// 1년 동안 로그인하지 않은 계정 정리 (개인정보 처리 방침 4항). GitHub Actions에서 매월 실행.
// 인증: GOOGLE_APPLICATION_CREDENTIALS(서비스 계정 JSON, 저장소 시크릿에서 임시 파일로). 개인정보(이메일 등)는 로그에 남기지 않는다.
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const DRY = process.env.DRY_RUN === "1";
// 실패 원인을 GitHub 주석(annotation)으로 남긴다(개인정보 없이 오류 코드·메시지만)
process.on("unhandledRejection", (e) => {
  const code = e?.code ?? e?.errorInfo?.code ?? "";
  console.log(`::error title=정리 실패::${code} ${String(e?.message ?? e).slice(0, 300).replace(/\n/g, " ")}`);
  process.exit(1);
});
initializeApp({ credential: applicationDefault(), projectId: "my-job-c1e50" });
const auth = getAuth();
const db = getFirestore();
const cutoff = Date.now() - 365 * 86400000;

let total = 0, removed = 0, token;
do {
  const page = await auth.listUsers(1000, token);
  for (const u of page.users) {
    total++;
    const last = Date.parse(u.metadata.lastRefreshTime || u.metadata.lastSignInTime || u.metadata.creationTime);
    if (last >= cutoff) continue;
    if (!DRY) {
      await db.doc(`users/${u.uid}`).delete();
      await db.doc(`shared/${u.uid}`).delete(); // 교사·관리자 공개용 사본
      await db.doc(`members/${u.uid}`).delete(); // 관리자 지정 후보 목록(이름·이메일)
      await db.doc(`admins/${u.uid}`).delete();
      await auth.deleteUser(u.uid);
    }
    removed++;
  }
  token = page.pageToken;
} while (token);

// 계정은 없는데 남은 기록(예: 계정만 지워진 경우) 정리
let orphans = 0;
for (const col of ["users", "shared", "members", "admins"]) {
  const snap = await db.collection(col).select().get();
  for (const d of snap.docs) {
    try { await auth.getUser(d.id); } catch (e) {
      if (e.code === "auth/user-not-found") { if (!DRY) await d.ref.delete(); orphans++; } else throw e;
    }
  }
}
console.log(`${DRY ? "[점검만] " : ""}전체 계정 ${total}, 1년 미접속 삭제 ${removed}, 계정 없는 기록 삭제 ${orphans}`);
