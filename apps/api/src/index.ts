import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./env.ts";
import { specimensRouter } from "./routes/specimens.ts";
import { cartRouter } from "./routes/cart.ts";
import { ordersRouter } from "./routes/orders.ts";
import { meRouter } from "./routes/me.ts";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: env.WEB_ORIGIN,
    credentials: true,
    allowHeaders: ["Authorization", "Content-Type"],
  }),
);

app.get("/health", (c) => c.json({ ok: true }));
app.route("/v1/specimens", specimensRouter);
app.route("/v1/cart", cartRouter);
app.route("/v1/orders", ordersRouter);
app.route("/v1/me", meRouter);

console.log(`api listening on http://localhost:${env.PORT}`);

export default {
  port: env.PORT,
  fetch: app.fetch,
};
