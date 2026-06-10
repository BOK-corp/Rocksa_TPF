import { describe, expect, it } from "vitest";
import { Hono } from "hono";
import { meRouter } from "./me.ts";

describe("POST /v1/me/sync", () => {
  it("rejects missing authorization", async () => {
    const app = new Hono().route("/v1/me", meRouter);
    const res = await app.request("/v1/me/sync", { method: "POST" });
    expect(res.status).toBe(401);
  });
});
