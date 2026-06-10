import { describe, expect, it } from "vitest";
import { applyListing, attributeValues, filterSpecimens } from "./catalog.ts";
import type { Specimen } from "./types.ts";

const specimen = (overrides: Partial<Specimen> & Pick<Specimen, "slug">): Specimen => ({
  id: overrides.slug,
  name: overrides.slug,
  category: "crystals",
  subcategory: "Quartz",
  description: "",
  priceCents: 10_000,
  compareAtCents: null,
  stockStatus: "in_stock",
  originCountry: null,
  imageUrl: "",
  attributes: { Color: "Blue", Clarity: "VVS" },
  ...overrides,
});

const FIXTURES: Specimen[] = [
  specimen({ slug: "a", subcategory: "Quartz", priceCents: 3000, attributes: { Color: "Blue", Clarity: "VVS" } }),
  specimen({ slug: "b", subcategory: "Beryl", priceCents: 8000, attributes: { Color: "Green", Clarity: "VS" } }),
  specimen({ slug: "c", subcategory: "Quartz", priceCents: 5000, attributes: { Color: "Blue", Clarity: "VS" } }),
];

describe("catalog filters", () => {
  it("filters by subcategory, color, clarity, and price", () => {
    expect(
      filterSpecimens(FIXTURES, {
        subcategory: "Quartz",
        color: "Blue",
        clarity: "VVS",
        minPriceCents: 2500,
        maxPriceCents: 4000,
      }),
    ).toEqual([FIXTURES[0]]);
  });

  it("sorts by price ascending and descending", () => {
    expect(
      applyListing(FIXTURES, { category: "crystals" }, "price-asc").map(
        (s) => s.slug,
      ),
    ).toEqual(["a", "c", "b"]);
    expect(
      applyListing(FIXTURES, { category: "crystals" }, "price-desc").map(
        (s) => s.slug,
      ),
    ).toEqual(["b", "c", "a"]);
  });

  it("collects unique attribute values", () => {
    expect(attributeValues(FIXTURES, "Color")).toEqual(["Blue", "Green"]);
  });
});
