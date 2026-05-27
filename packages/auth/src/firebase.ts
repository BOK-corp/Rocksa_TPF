import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  type Auth,
} from "firebase/auth";

interface Env {
  VITE_FIREBASE_API_KEY?: string;
  VITE_FIREBASE_AUTH_DOMAIN?: string;
  VITE_FIREBASE_PROJECT_ID?: string;
  VITE_FIREBASE_APP_ID?: string;
  VITE_FIREBASE_AUTH_EMULATOR?: string;
}

const env = (import.meta as unknown as { env: Env }).env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? "demo-api-key",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? "demo.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? "rocksa-dev",
  appId: env.VITE_FIREBASE_APP_ID ?? "demo-app-id",
} as const;

export const firebaseApp: FirebaseApp =
  getApps()[0] ?? initializeApp(firebaseConfig);

export const firebaseAuth: Auth = getAuth(firebaseApp);

if (env.VITE_FIREBASE_AUTH_EMULATOR) {
  try {
    connectAuthEmulator(firebaseAuth, env.VITE_FIREBASE_AUTH_EMULATOR, {
      disableWarnings: true,
    });
  } catch {
    /* hot reload */
  }
}
