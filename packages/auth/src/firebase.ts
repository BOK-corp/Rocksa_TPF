import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  type Auth,
} from "firebase/auth";
import { readEnv } from "./env.ts";

export const firebaseConfig = {
  apiKey: readEnv("VITE_FIREBASE_API_KEY") ?? "demo-api-key",
  authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN") ?? "demo.firebaseapp.com",
  projectId: readEnv("VITE_FIREBASE_PROJECT_ID") ?? "rocksa-dev",
  appId: readEnv("VITE_FIREBASE_APP_ID") ?? "demo-app-id",
} as const;

export const firebaseApp: FirebaseApp =
  getApps()[0] ?? initializeApp(firebaseConfig);

export const firebaseAuth: Auth = getAuth(firebaseApp);

const emulatorHost =
  readEnv("VITE_FIREBASE_AUTH_EMULATOR") ??
  (readEnv("FIREBASE_AUTH_EMULATOR_HOST")
    ? `http://${readEnv("FIREBASE_AUTH_EMULATOR_HOST")}`
    : undefined);

if (emulatorHost) {
  try {
    connectAuthEmulator(firebaseAuth, emulatorHost, { disableWarnings: true });
  } catch {
    /* hot reload */
  }
}
