import { describe, expect, it } from "vitest";
import { addItem, merge, removeItem, setQty, subtotal, total } from "./cart.ts";
import type { Specimen } from "./types.ts";

const specimen = (id: string, priceCents: number): Specimen => ({
  id,
  slug: id,
  name: id,
  category: "crystals",
  subcategory: null,
  description: "",
  priceCents,
  compareAtCents: null,
  stockStatus: "in_stock",
  originCountry: null,
  imageUrl: "",
  attributes: {},
});

describe("cart", () => {
  it("adds a new item", () => {
    const items = addItem([], specimen("a", 1000));
    expect(items).toEqual([{ specimenId: "a", qty: 1, unitPriceCents: 1000 }]);
  });

  it("increments qty when adding existing", () => {
    const items = addItem(
      [{ specimenId: "a", qty: 1, unitPriceCents: 1000 }],
      specimen("a", 1000),
      2,
    );
    expect(items[0]?.qty).toBe(3);
  });

  it("removes item when setQty <= 0", () => {
    const items = setQty([{ specimenId: "a", qty: 1, unitPriceCents: 1000 }], "a", 0);
    expect(items).toEqual([]);
  });

  it("removes item by id", () => {
    expect(removeItem([{ specimenId: "a", qty: 1, unitPriceCents: 1000 }], "a")).toEqual([]);
  });

  it("computes subtotal", () => {
    expect(
      subtotal([
        { specimenId: "a", qty: 2, unitPriceCents: 1000 },
        { specimenId: "b", qty: 1, unitPriceCents: 500 },
      ]),
    ).toBe(2500);
  });

  it("computes total with shipping & tax", () => {
    expect(total(2500, 150, 200)).toBe(2850);
  });

  it("merges carts by specimenId and sums qty", () => {
    expect(
      merge(
        [{ specimenId: "a", qty: 2, unitPriceCents: 1000 }],
        [
          { specimenId: "a", qty: 1, unitPriceCents: 1000 },
          { specimenId: "b", qty: 1, unitPriceCents: 500 },
        ],
      ),
    ).toEqual([
      { specimenId: "a", qty: 3, unitPriceCents: 1000 },
      { specimenId: "b", qty: 1, unitPriceCents: 500 },
    ]);
  });
});
