import { describe, expect, it } from "vitest";
import { validateAddress, validateCard } from "./validation.ts";

describe("validateAddress", () => {
  const valid = {
    email: "buyer@example.com",
    firstName: "Jane",
    lastName: "Collector",
    country: "United States",
    address: "1 Museum Way",
    city: "New York",
    postal: "10001",
    phone: "+1 212 555 0100",
    delivery: "standard" as const,
  };

  it("accepts a complete address", () => {
    const result = validateAddress(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.email).toBe("buyer@example.com");
      expect(result.value.delivery).toBe("standard");
    }
  });

  it("rejects missing email", () => {
    const result = validateAddress({ ...valid, email: "" });
    expect(result).toEqual({
      ok: false,
      error: "Enter a valid email address.",
    });
  });

  it("rejects invalid phone", () => {
    const result = validateAddress({ ...valid, phone: "123" });
    expect(result).toEqual({
      ok: false,
      error: "Enter a valid phone number.",
    });
  });
});

describe("validateCard", () => {
  it("accepts a valid test card", () => {
    const result = validateCard({
      cardholderName: "Jane Collector",
      cardNumber: "4242 4242 4242 4242",
      expiration: "12/30",
      cvc: "123",
    });
    expect(result.ok).toBe(true);
  });

  it("rejects invalid card number", () => {
    const result = validateCard({
      cardholderName: "Jane Collector",
      cardNumber: "4111 1111 1111 1112",
      expiration: "12/30",
      cvc: "123",
    });
    expect(result).toEqual({
      ok: false,
      error: "Enter a valid card number.",
    });
  });

  it("rejects bad expiration format", () => {
    const result = validateCard({
      cardholderName: "Jane Collector",
      cardNumber: "4242 4242 4242 4242",
      expiration: "2025-12",
      cvc: "123",
    });
    expect(result).toEqual({
      ok: false,
      error: "Enter expiration as MM/YY.",
    });
  });
});
