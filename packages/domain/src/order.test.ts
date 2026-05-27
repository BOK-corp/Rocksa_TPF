import { describe, expect, it } from "vitest";
import { orderReference } from "./order.ts";

describe("orderReference", () => {
  it("matches the RK-XXXX-YY pattern", () => {
    const ref = orderReference(new Date("2026-05-27"), () => 0.5);
    expect(ref).toMatch(/^RK-[A-Z2-9]{4}-26$/);
  });
});
