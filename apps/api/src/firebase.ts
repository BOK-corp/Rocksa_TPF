import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { env } from "./env.ts";

let app: App | null = null;

const init = async (): Promise<App> => {
  if (getApps()[0]) return getApps()[0]!;
  if (env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const raw = env.FIREBASE_SERVICE_ACCOUNT_JSON.startsWith("{")
      ? env.FIREBASE_SERVICE_ACCOUNT_JSON
      : await Bun.file(env.FIREBASE_SERVICE_ACCOUNT_JSON).text();
    const parsed = JSON.parse(raw) as { project_id?: string };
    return initializeApp({
      credential: cert(parsed as Parameters<typeof cert>[0]),
      projectId: env.FIREBASE_PROJECT_ID || parsed.project_id,
    });
  }
  // No service account: rely on project id only. The verifier will skip
  // signature checks when FIREBASE_AUTH_EMULATOR_HOST is set.
  return initializeApp({
    projectId: env.FIREBASE_PROJECT_ID || "rocksa-dev",
  });
};

export const firebaseAuth = async (): Promise<Auth> => {
  if (!app) app = await init();
  return getAuth(app);
};

interface DecodedToken {
  uid: string;
  email: string | null;
  name: string | null;
}

const decodeUnverified = (token: string): DecodedToken | null => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = JSON.parse(
      Buffer.from(payload, "base64").toString("utf8"),
    ) as Record<string, unknown>;
    const uid =
      typeof json["user_id"] === "string"
        ? (json["user_id"] as string)
        : typeof json["sub"] === "string"
          ? (json["sub"] as string)
          : null;
    if (!uid) return null;
    return {
      uid,
      email: (json["email"] as string) ?? null,
      name: (json["name"] as string) ?? null,
    };
  } catch {
    return null;
  }
};

export const verifyIdToken = async (
  token: string,
): Promise<DecodedToken | null> => {
  console.log("EMULATOR_HOST:", JSON.stringify(env.FIREBASE_AUTH_EMULATOR_HOST));
  console.log("token prefix:", token.slice(0, 20));
  if (env.FIREBASE_AUTH_EMULATOR_HOST) return decodeUnverified(token);
  try {
    const auth = await firebaseAuth();
    const decoded = await auth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: decoded.name ?? null,
    };
  } catch (e) {
    console.error("verifyIdToken error:", e);
    return null;
  }
};
