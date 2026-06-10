import { Hono } from "hono";
import { z } from "zod";
import {
  bearerToken,
  requireAuth,
  upsertUser,
  type AuthUser,
} from "../auth.ts";
import { verifyIdToken } from "../firebase.ts";

export const meRouter = new Hono<{ Variables: { user: AuthUser } }>();

const syncBody = z.object({
  role: z.string().optional(),
  fullName: z.string().nullable().optional(),
});

meRouter.post("/sync", async (c) => {
  const token = bearerToken(c.req.header("authorization"));
  if (!token) return c.json({ error: "unauthorized" }, 401);
  const decoded = await verifyIdToken(token);
  if (!decoded?.email) return c.json({ error: "invalid token" }, 401);

  const body = syncBody.safeParse(await c.req.json().catch(() => ({})));
  const user = await upsertUser(
    decoded.uid,
    decoded.email,
    body.success ? (body.data.fullName ?? decoded.name) : decoded.name,
    body.success ? body.data.role : undefined,
  );
  return c.json({ user });
});

meRouter.get("/", requireAuth, (c) => c.json({ user: c.get("user") }));
