import { Hono } from "hono";
import { requireAuth, type AuthUser } from "../auth.ts";

export const meRouter = new Hono<{ Variables: { user: AuthUser } }>();
meRouter.use("*", requireAuth);
meRouter.get("/", (c) => c.json({ user: c.get("user") }));
