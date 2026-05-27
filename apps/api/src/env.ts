export const env = {
  PORT: Number(process.env["PORT"] ?? 8787),
  DATABASE_URL:
    process.env["DATABASE_URL"] ??
    "postgres://rocksa:rocksa@localhost:5432/rocksa",
  WEB_ORIGIN: process.env["WEB_ORIGIN"] ?? "http://localhost:5173",
  FIREBASE_PROJECT_ID: process.env["FIREBASE_PROJECT_ID"] ?? "rocksatpf",
  FIREBASE_AUTH_EMULATOR_HOST: process.env["FIREBASE_AUTH_EMULATOR_HOST"] ?? "",
  FIREBASE_SERVICE_ACCOUNT_JSON:
    process.env["FIREBASE_SERVICE_ACCOUNT_JSON"] ?? "",
} as const;
