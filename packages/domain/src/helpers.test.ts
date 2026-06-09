import { describe, expect, it } from "vitest";
import { cartSubtotal, cartTotal, formatPrice, validateEmail, validatePassword, validatePostal } from "./index.ts";

describe("domain helpers", () => {
  it("formats price values for display", () => {
    expect(formatPrice(1250)).toBe("$12.50");
    expect(formatPrice(1200, "EUR")).toBe("€12");
  });

  it("computes cart subtotal and total", () => {
    expect(
      cartSubtotal([
        { specimenId: "a", qty: 2, unitPriceCents: 1000 },
        { specimenId: "b", qty: 1, unitPriceCents: 500 },
      ]),
    ).toBe(2500);

    expect(cartTotal(2500, 150, 200)).toBe(2850);
  });

  it("validates email and password input", () => {
    expect(validateEmail(" buyer@example.com ")).toEqual({
      ok: true,
      value: "buyer@example.com",
    });
    expect(validateEmail("not-an-email")).toMatchObject({ ok: false });

    expect(validatePassword("secret12")).toEqual({ ok: true, value: "secret12" });
    expect(validatePassword("short")).toMatchObject({ ok: false });
  });

  it("validates postal codes by country", () => {
    expect(validatePostal("US", "02139")).toEqual({ ok: true, value: "02139" });
    expect(validatePostal("CA", "M5V 2T6")).toEqual({ ok: true, value: "M5V 2T6" });
    expect(validatePostal("US", "abc")).toMatchObject({ ok: false });
  });
});
