import type { MiddlewareHandler } from "hono";
import { eq } from "drizzle-orm";
import { db } from "@rocksa/db";
import { users } from "@rocksa/db/schema";
import { verifyIdToken } from "./firebase.ts";

export interface AuthUser {
  id: string;
  uid: string;
  email: string;
  role: string;
  fullName: string | null;
}

export const bearerToken = (header: string | undefined): string | null => {
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7) || null;
};

const toAuthUser = (row: typeof users.$inferSelect): AuthUser => ({
  id: row.uid,
  uid: row.uid,
  email: row.email,
  role: row.role,
  fullName: row.fullName,
});

export const upsertUser = async (
  firebaseUid: string,
  email: string,
  name: string | null,
  role?: string,
): Promise<AuthUser> => {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.uid, firebaseUid))
    .limit(1);
  if (existing[0]) return toAuthUser(existing[0]);

  const inserted = await db
    .insert(users)
    .values({
      uid: firebaseUid,
      email,
      fullName: name,
      role: role ?? "buyer",
    })
    .returning();
  return toAuthUser(inserted[0]!);
};

export const loadUser = async (firebaseUid: string): Promise<AuthUser | null> => {
  const row = await db
    .select()
    .from(users)
    .where(eq(users.uid, firebaseUid))
    .limit(1);
  return row[0] ? toAuthUser(row[0]) : null;
};

export const requireAuth: MiddlewareHandler<{
  Variables: { user: AuthUser };
}> = async (c, next) => {
  const token = bearerToken(c.req.header("authorization"));
  if (!token) return c.json({ error: "unauthorized" }, 401);
  const decoded = await verifyIdToken(token);
  if (!decoded?.email) return c.json({ error: "invalid token" }, 401);
  const user = await loadUser(decoded.uid);
  if (!user) return c.json({ error: "session not bootstrapped" }, 401);
  c.set("user", user);
  await next();
};

export const requireCurator: MiddlewareHandler<{
  Variables: { user: AuthUser };
}> = async (c, next) => {
  const user = c.get("user");
  if (!["curator", "admin"].includes(user.role)) {
    return c.json({ error: "forbidden" }, 403);
  }
  await next();
};
