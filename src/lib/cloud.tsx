"use client";

// 선택 기능: 구글 로그인 + 기기 간 동기화 (결정 D1=B)
// - 로그인하지 않으면 Firebase 코드를 내려받지도 않는다(동적 import).
// - 기록은 Firestore users/{uid} 문서 하나에 JSON 문자열로 저장(보안 규칙: 본인만, firestore.rules).
// - 개인정보 처리 방침(/privacy) 게시와 함께 공개. NEXT_PUBLIC_LOGIN=off 로 빌드하면 숨김(/account?preview=1 미리보기).
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { initialState, useStore, type AppState } from "@/lib/store";

export const LOGIN_PUBLIC = process.env.NEXT_PUBLIC_LOGIN !== "off"; // 2026-11-22 공개(결정 D3=A). 끄려면 빌드 때 NEXT_PUBLIC_LOGIN=off
const FLAG = "myroad:cloud"; // 이 기기에서 로그인한 적 있음 → 시작할 때 세션 확인
const PREVIEW = "myroad:login-preview";

const firebaseConfig = {
  apiKey: "AIzaSyDXYRvZbU2DgaeU4c7QnIzw00YSkw6cV5o",
  authDomain: "my-job-c1e50.firebaseapp.com",
  projectId: "my-job-c1e50",
  storageBucket: "my-job-c1e50.firebasestorage.app",
  messagingSenderId: "397168019719",
  appId: "1:397168019719:web:8d18f0144407a2f1a0dda2",
};

type FB = {
  auth: typeof import("firebase/auth");
  fs: typeof import("firebase/firestore");
  a: import("firebase/auth").Auth;
  db: import("firebase/firestore").Firestore;
};
let fbPromise: Promise<FB> | null = null;
function loadFirebase(): Promise<FB> {
  if (!fbPromise) {
    fbPromise = (async () => {
      const [{ initializeApp, getApps }, auth, fs] = await Promise.all([import("firebase/app"), import("firebase/auth"), import("firebase/firestore")]);
      const app = getApps()[0] ?? initializeApp(firebaseConfig);
      return { auth, fs, a: auth.getAuth(app), db: fs.getFirestore(app) };
    })();
  }
  return fbPromise;
}

const ls = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  del: (k: string) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};
const deviceId = () => {
  let d = ls.get("myroad:device");
  if (!d) { d = Math.random().toString(36).slice(2, 10); ls.set("myroad:device", d); }
  return d;
};

export type CloudUser = { uid: string; name: string; email: string };
export type SyncStatus = "off" | "loading" | "syncing" | "synced" | "error";
type Ctx = {
  visible: boolean;
  user: CloudUser | null;
  status: SyncStatus;
  error: string;
  lastSync: number | null;
  conflict: AppState | null;
  signIn: () => Promise<void>;
  signOutNow: (wipeLocal?: boolean) => Promise<void>;
  deleteAccount: () => Promise<void>;
  resolve: (use: "local" | "remote") => Promise<void>;
  enablePreview: () => void;
};
const CloudContext = createContext<Ctx | null>(null);

const isEmpty = (s: AppState) => JSON.stringify({ ...s, currentTerm: "" }) === JSON.stringify({ ...initialState(), currentTerm: "" });
const msg = (e: unknown) => {
  const code = (e as { code?: string })?.code ?? "";
  if (code.includes("popup-closed") || code.includes("cancelled-popup")) return "로그인 창을 닫았어요. 다시 시도해 주세요.";
  if (code.includes("popup-blocked")) return "팝업이 막혔어요. 브라우저에서 이 사이트의 팝업을 허용해 주세요.";
  if (code.includes("network")) return "인터넷 연결을 확인해 주세요.";
  if (code.includes("permission-denied")) return "저장 권한이 없어요. 잠시 후 다시 시도해 주세요.";
  return "문제가 생겼어요. 잠시 후 다시 시도해 주세요.";
};

export function CloudProvider({ children }: { children: React.ReactNode }) {
  const { state, ready, replace } = useStore();
  const [visible, setVisible] = useState(LOGIN_PUBLIC);
  const [user, setUser] = useState<CloudUser | null>(null);
  const [status, setStatus] = useState<SyncStatus>("off");
  const [error, setError] = useState("");
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [conflict, setConflict] = useState<AppState | null>(null);
  const lastJson = useRef<string>(""); // 서버와 같은 내용(중복 업로드·되돌림 방지)
  const unsub = useRef<(() => void) | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (LOGIN_PUBLIC) return;
    const q = new URLSearchParams(window.location.search);
    if (q.get("preview") === "1") ls.set(PREVIEW, "1");
    setVisible(ls.get(PREVIEW) === "1");
  }, []);

  const upload = useCallback(async (uid: string, s: AppState) => {
    const { fs, db } = await loadFirebase();
    const json = JSON.stringify(s);
    setStatus("syncing");
    await fs.setDoc(fs.doc(db, "users", uid), { v: 2, data: json, clientAt: Date.now(), device: deviceId(), updatedAt: fs.serverTimestamp() });
    lastJson.current = json;
    setLastSync(Date.now());
    setStatus("synced");
  }, []);

  // 로그인 직후: 서버 기록과 이 기기 기록을 맞춘다
  const attach = useCallback(async (u: CloudUser) => {
    const { fs, db } = await loadFirebase();
    setStatus("loading");
    const ref = fs.doc(db, "users", u.uid);
    const snap = await fs.getDoc(ref);
    const local = stateRef.current;
    const remoteJson = snap.exists() ? (snap.data().data as string) : "";
    if (!remoteJson) await upload(u.uid, local);
    else if (remoteJson === JSON.stringify(local)) { lastJson.current = remoteJson; setStatus("synced"); setLastSync(Date.now()); }
    else if (isEmpty(local)) { lastJson.current = remoteJson; replace(JSON.parse(remoteJson)); setStatus("synced"); setLastSync(Date.now()); }
    else { setConflict(JSON.parse(remoteJson)); setStatus("synced"); }
    // 다른 기기에서 바뀌면 받아 온다
    unsub.current?.();
    unsub.current = fs.onSnapshot(ref, (d) => {
      if (!d.exists() || d.metadata.hasPendingWrites) return;
      const v = d.data();
      if (v.device === deviceId() || v.data === lastJson.current) return;
      lastJson.current = v.data;
      replace(JSON.parse(v.data));
      setLastSync(Date.now());
    });
  }, [replace, upload]);

  // 시작할 때: 이 기기에서 로그인한 적이 있을 때만 Firebase를 불러 세션 확인
  useEffect(() => {
    if (!ready || !visible || ls.get(FLAG) !== "1") return;
    let off: (() => void) | undefined;
    loadFirebase().then(({ auth, a }) => {
      off = auth.onAuthStateChanged(a, (fu) => {
        if (fu) {
          const u = { uid: fu.uid, name: fu.displayName ?? "", email: fu.email ?? "" };
          setUser(u);
          attach(u).catch((e) => { setStatus("error"); setError(msg(e)); });
        } else { setUser(null); setStatus("off"); ls.del(FLAG); }
      });
    });
    return () => { off?.(); unsub.current?.(); };
  }, [ready, visible, attach]);

  // 기록이 바뀌면 1.5초 뒤 저장
  useEffect(() => {
    if (!user || conflict || status === "loading") return;
    const json = JSON.stringify(state);
    if (json === lastJson.current) return;
    const t = setTimeout(() => upload(user.uid, state).catch((e) => { setStatus("error"); setError(msg(e)); }), 1500);
    return () => clearTimeout(t);
  }, [state, user, conflict, status, upload]);

  const signIn = useCallback(async () => {
    setError("");
    try {
      const { auth, a } = await loadFirebase();
      const cred = await auth.signInWithPopup(a, new auth.GoogleAuthProvider());
      ls.set(FLAG, "1");
      const u = { uid: cred.user.uid, name: cred.user.displayName ?? "", email: cred.user.email ?? "" };
      setUser(u);
      await attach(u);
    } catch (e) { setError(msg(e)); setStatus(user ? "error" : "off"); }
  }, [attach, user]);

  const signOutNow = useCallback(async (wipeLocal = false) => {
    const { auth, a } = await loadFirebase();
    unsub.current?.();
    await auth.signOut(a);
    ls.del(FLAG);
    setUser(null); setStatus("off"); setConflict(null); lastJson.current = "";
    if (wipeLocal) replace(initialState());
  }, [replace]);

  const deleteAccount = useCallback(async () => {
    const { auth, fs, a, db } = await loadFirebase();
    const cu = a.currentUser;
    if (!cu) return;
    unsub.current?.();
    try {
      await fs.deleteDoc(fs.doc(db, "users", cu.uid));
      try { await auth.deleteUser(cu); }
      catch (e) {
        if ((e as { code?: string }).code === "auth/requires-recent-login") {
          await auth.reauthenticateWithPopup(cu, new auth.GoogleAuthProvider());
          await auth.deleteUser(cu);
        } else throw e;
      }
      ls.del(FLAG);
      setUser(null); setStatus("off"); lastJson.current = "";
    } catch (e) { setError(msg(e)); }
  }, []);

  const resolve = useCallback(async (use: "local" | "remote") => {
    if (!user || !conflict) return;
    if (use === "remote") { lastJson.current = JSON.stringify(conflict); replace(conflict); }
    else await upload(user.uid, stateRef.current);
    setConflict(null);
  }, [user, conflict, replace, upload]);

  const enablePreview = useCallback(() => { ls.set(PREVIEW, "1"); setVisible(true); }, []);

  const value = useMemo(
    () => ({ visible, user, status, error, lastSync, conflict, signIn, signOutNow, deleteAccount, resolve, enablePreview }),
    [visible, user, status, error, lastSync, conflict, signIn, signOutNow, deleteAccount, resolve, enablePreview],
  );
  return <CloudContext.Provider value={value}>{children}</CloudContext.Provider>;
}

export function useCloud() {
  const c = useContext(CloudContext);
  if (!c) throw new Error("useCloud must be used within CloudProvider");
  return c;
}
