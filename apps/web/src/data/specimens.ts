import type { Category, Specimen } from "@rocksa/domain";
import { gemPlaceholder, paletteFor } from "./placeholder.ts";

export const CATEGORIES: { slug: Category; label: string; icon: string }[] = [
  { slug: "igneous", label: "Igneous", icon: "🌋" },
  { slug: "metamorphic", label: "Metamorphic", icon: "◆" },
  { slug: "sedimentary", label: "Sedimentary", icon: "△" },
  { slug: "crystals", label: "Crystals", icon: "💎" },
];

const make = (s: Specimen): Specimen => s;

export const SPECIMENS: Specimen[] = [
  make({
    id: "1",
    slug: "clear-quartz-cluster",
    name: "Clear Quartz Cluster",
    category: "crystals",
    subcategory: "Quartz",
    description:
      "High-clarity specimen from the Swiss Alps, featuring multiple termination points and exceptional optical clarity.",
    priceCents: 14_500_00,
    compareAtCents: null,
    stockStatus: "in_stock",
    originCountry: "Switzerland",
    imageUrl:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=80",
    attributes: {
      Color: "Clear",
      Clarity: "VVS",
      Carat: "85.00",
      Origin: "Switzerland",
    },
  }),
  make({
    id: "2",
    slug: "amethyst-geode-slice",
    name: "Amethyst Geode Slice",
    category: "crystals",
    subcategory: "Quartz",
    description:
      "Deep purple coloration with a distinct agate banding edge. Museum-grade slice cut to reveal the interior cavity.",
    priceCents: 35_000_00,
    compareAtCents: null,
    stockStatus: "in_stock",
    originCountry: "Uruguay",
    imageUrl:
      "https://images.unsplash.com/photo-1518930259200-3e5b85f0a0e7?w=600&q=80",
    attributes: { Color: "Purple", Clarity: "VS", Carat: "1,240" },
  }),
  make({
    id: "3",
    slug: "raw-aquamarine",
    name: "Raw Aquamarine",
    category: "crystals",
    subcategory: "Beryl",
    description:
      "Gem-quality Beryl crystal showing excellent natural hexagonal form. Untreated, sourced ethically from Pakistan.",
    priceCents: 85_000_00,
    compareAtCents: null,
    stockStatus: "in_stock",
    originCountry: "Pakistan",
    imageUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&q=80",
    attributes: { Color: "Blue", Clarity: "VVS", Carat: "412" },
  }),
  make({
    id: "4",
    slug: "deep-blue-sapphire",
    name: "Deep Blue Sapphire",
    category: "crystals",
    subcategory: "Corundum",
    description:
      "A stunning 2.5 carat natural sapphire exhibiting a velvety deep blue hue with exceptional saturation.",
    priceCents: 12_450_00,
    compareAtCents: 14_000_00,
    stockStatus: "in_stock",
    originCountry: "Sri Lanka",
    imageUrl:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    attributes: {
      Weight: "2.50 ct",
      Cut: "Oval Mixed",
      Hardness: "9.0 (Mohs)",
      "Specific Gravity": "4.00",
      Origin: "Sri Lanka",
      Clarity: "VVS",
      "Refractive Index": "1.762–1.770",
      Treatment: "Heat",
    },
  }),
  make({
    id: "5",
    slug: "malachite-polished-slab",
    name: "Malachite Polished Slab",
    category: "metamorphic",
    subcategory: null,
    description:
      "Vivid banding, Congolese origin. Specimen ID: ML-238. Hand-polished to a mirror finish.",
    priceCents: 28_000_00,
    compareAtCents: null,
    stockStatus: "in_stock",
    originCountry: "DR Congo",
    imageUrl:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80",
    attributes: { Color: "Green", "Specific Gravity": "3.80" },
  }),
  make({
    id: "6",
    slug: "bismuth-hopper-crystal",
    name: "Bismuth Hopper Crystal",
    category: "crystals",
    subcategory: "Synthetic",
    description:
      "Lab-grown, intense iridescence. Specimen-grade hopper formation with stair-stepped cubic geometry.",
    priceCents: 8_500_00,
    compareAtCents: null,
    stockStatus: "low_stock",
    originCountry: "Germany",
    imageUrl:
      "https://images.unsplash.com/photo-1606293459247-fa6f25edbabc?w=600&q=80",
    attributes: { Color: "Iridescent", Origin: "Synthetic" },
  }),
  make({
    id: "7",
    slug: "fluorite-octahedron",
    name: "Fluorite Octahedron",
    category: "crystals",
    subcategory: "Fluorite",
    description:
      "Cleaved form, deep emerald green. Specimen from a classic Illinois locality, sharp octahedral cleavage.",
    priceCents: 11_000_00,
    compareAtCents: null,
    stockStatus: "in_stock",
    originCountry: "USA",
    imageUrl:
      "https://images.unsplash.com/photo-1612886623429-b1a7df7e0cef?w=600&q=80",
    attributes: { Color: "Green", Clarity: "VS", Hardness: "4 (Mohs)" },
  }),
  make({
    id: "8",
    slug: "midnight-obsidian",
    name: "Midnight Obsidian",
    category: "igneous",
    subcategory: null,
    description: "Volcanic glass, jet black with conchoidal fracture pattern.",
    priceCents: 1_250_00,
    compareAtCents: null,
    stockStatus: "in_stock",
    originCountry: "Mexico",
    imageUrl:
      "https://images.unsplash.com/photo-1604332482225-89c9ae5cce30?w=600&q=80",
    attributes: { Color: "Black", Hardness: "5.5 (Mohs)" },
  }),
  make({
    id: "9",
    slug: "imperial-amethyst",
    name: "Imperial Amethyst",
    category: "crystals",
    subcategory: "Quartz",
    description: "Cathedral-grade Uruguayan amethyst with saturated royal purple hue.",
    priceCents: 3_400_00,
    compareAtCents: null,
    stockStatus: "on_display",
    originCountry: "Uruguay",
    imageUrl:
      "https://images.unsplash.com/photo-1551845041-63e8e76836ea?w=600&q=80",
    attributes: { Color: "Purple", Clarity: "VS" },
  }),
  make({
    id: "10",
    slug: "royal-lapis-lazuli",
    name: "Royal Lapis Lazuli",
    category: "metamorphic",
    subcategory: null,
    description: "Premium Afghan lapis, golden pyrite flecks throughout.",
    priceCents: 850_00,
    compareAtCents: null,
    stockStatus: "in_stock",
    originCountry: "Afghanistan",
    imageUrl:
      "https://images.unsplash.com/photo-1559664032-2c2bbf6b53ec?w=600&q=80",
    attributes: { Color: "Blue", Hardness: "5.5 (Mohs)" },
  }),
];

// Replace bare imageUrl strings with deterministic SVG gradient placeholders so
// the dev experience never depends on a remote image host being reachable.
for (const s of SPECIMENS) {
  if (!s.imageUrl || s.imageUrl.startsWith("https://images.unsplash")) {
    s.imageUrl = gemPlaceholder(s.slug, paletteFor(s.attributes["Color"]));
  }
}

export const findSpecimenBySlug = (slug: string): Specimen | undefined =>
  SPECIMENS.find((s) => s.slug === slug);

export const findSpecimenById = (id: string): Specimen | undefined =>
  SPECIMENS.find((s) => s.id === id);

export const specimensByCategory = (category: Category): Specimen[] =>
  SPECIMENS.filter((s) => s.category === category);
