import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeApp, getApps, deleteApp, type FirebaseApp } from "firebase/app";
import { syncSession } from "./sync.ts";

const EMULATOR = "http://127.0.0.1:9099";
const API = process.env["VITE_API_URL"] ?? "http://localhost:8787";

const emulatorReachable = async (): Promise<boolean> => {
  try {
    const res = await fetch(EMULATOR);
    return res.ok || res.status === 404;
  } catch {
    return false;
  }
};

const apiReachable = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API}/health`);
    return res.ok;
  } catch {
    return false;
  }
};

describe("auth happy path (Firebase emulator)", () => {
  let app: FirebaseApp;
  const email = `curator-${Date.now()}@rocksa.test`;
  const password = "password123";
  const fullName = "Test Curator";

  beforeAll(async () => {
    if (!(await emulatorReachable())) {
      throw new Error(
        "Firebase Auth emulator not running on :9099 — start with: firebase emulators:start --only auth",
      );
    }
    if (!(await apiReachable())) {
      throw new Error(
        `API not running at ${API} — start with: bun run api`,
      );
    }

    process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "127.0.0.1:9099";
    process.env["VITE_API_URL"] = API;

    app = getApps()[0] ?? initializeApp({
      apiKey: "demo-api-key",
      authDomain: "demo.firebaseapp.com",
      projectId: "rocksa-dev",
      appId: "demo-app-id",
    });
    const auth = getAuth(app);
    connectAuthEmulator(auth, EMULATOR, { disableWarnings: true });
  });

  afterAll(async () => {
    if (app) await deleteApp(app);
  });

  it("register → sign-in → workspace access → sign-out", async () => {
    const auth = getAuth(app);

    const registered = await createUserWithEmailAndPassword(auth, email, password);
    const registerToken = await registered.user.getIdToken();
    const profile = await syncSession(registerToken, {
      role: "curator",
      fullName,
    });

    expect(profile.email).toBe(email);
    expect(profile.role).toBe("curator");
    expect(profile.fullName).toBe(fullName);

    await signOut(auth);
    expect(auth.currentUser).toBeNull();

    const signedIn = await signInWithEmailAndPassword(auth, email, password);
    const signInToken = await signedIn.user.getIdToken();
    const loaded = await syncSession(signInToken);

    expect(loaded.email).toBe(email);
    expect(loaded.role).toBe("curator");
    expect(["curator", "admin"]).toContain(loaded.role);

    await signOut(auth);
    expect(auth.currentUser).toBeNull();
  });
});
