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
}

export const upsertUser = async (
  uid: string,
  email: string,
  name: string | null,
): Promise<AuthUser> => {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.firebaseUid, uid))
    .limit(1);
  if (existing[0]) {
    return {
      id: existing[0].id,
      uid,
      email: existing[0].email,
      role: existing[0].role,
    };
  }
  const inserted = await db
    .insert(users)
    .values({ firebaseUid: uid, email, fullName: name })
    .returning();
  const row = inserted[0]!;
  return { id: row.id, uid, email: row.email, role: row.role };
};

export const requireAuth: MiddlewareHandler<{
  Variables: { user: AuthUser };
}> = async (c, next) => {
  const header = c.req.header("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return c.json({ error: "unauthorized" }, 401);
  const decoded = await verifyIdToken(token);
  if (!decoded?.email) return c.json({ error: "invalid token" }, 401);
  const user = await upsertUser(decoded.uid, decoded.email, decoded.name);
  c.set("user", user);
  await next();
};
