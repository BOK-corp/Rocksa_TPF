import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";

const url =
  process.env["DATABASE_URL"] ??
  "postgres://rocksa:rocksa@localhost:5432/rocksa";

export const sql = postgres(url, { prepare: false });
export const db = drizzle(sql, { schema });
export type DB = typeof db;
