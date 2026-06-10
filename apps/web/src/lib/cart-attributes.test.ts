import { describe, expect, it } from "vitest";
import type { Specimen } from "@rocksa/domain";
import { cartAttributeRows } from "./cart-attributes.ts";

const specimen = (overrides: Partial<Specimen>): Specimen => ({
  id: "deep-blue-sapphire",
  slug: "deep-blue-sapphire",
  name: "Deep Blue Sapphire",
  category: "crystals",
  subcategory: "Corundum",
  description: "",
  priceCents: 1_245_000,
  compareAtCents: null,
  stockStatus: "in_stock",
  originCountry: "Sri Lanka",
  imageUrl: "",
  attributes: {
    Cut: "Oval Mixed",
    Clarity: "VVS",
    Weight: "2.50 ct",
  },
  ...overrides,
});

describe("cartAttributeRows", () => {
  it("prefers carat, cut, clarity, and origin", () => {
    expect(cartAttributeRows(specimen({}))).toEqual([
      ["Carat", "2.50 ct"],
      ["Cut", "Oval Mixed"],
      ["Clarity", "VVS"],
      ["Origin", "Sri Lanka"],
    ]);
  });
});
