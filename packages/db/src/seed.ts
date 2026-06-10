import { db, sql } from "./client.ts";
import {
  auditLog,
  orderItems,
  orders,
  shipments,
  specimens,
  users,
} from "./schema.ts";

type SeedRow = typeof specimens.$inferInsert;

const DEMO: SeedRow[] = [
  { slug: "clear-quartz-cluster", name: "Clear Quartz Cluster", category: "crystals", subcategory: "Quartz", description: "High-clarity specimen from the Swiss Alps, featuring multiple termination points.", priceCents: 14_500_00, originCountry: "Switzerland", imageUrl: "", attributes: { Color: "Clear", Clarity: "VVS", Carat: "85.00" } },
  { slug: "amethyst-geode-slice", name: "Amethyst Geode Slice", category: "crystals", subcategory: "Quartz", description: "Deep purple coloration with a distinct agate banding edge.", priceCents: 35_000_00, originCountry: "Uruguay", imageUrl: "", attributes: { Color: "Purple", Clarity: "VS", Carat: "1,240" } },
  { slug: "raw-aquamarine", name: "Raw Aquamarine", category: "crystals", subcategory: "Beryl", description: "Gem-quality Beryl crystal showing excellent natural hexagonal form.", priceCents: 85_000_00, originCountry: "Pakistan", imageUrl: "", attributes: { Color: "Blue", Clarity: "VVS", Carat: "412" } },
  { slug: "deep-blue-sapphire", name: "Deep Blue Sapphire", category: "crystals", subcategory: "Corundum", description: "A stunning 2.5 carat natural sapphire exhibiting a velvety deep blue hue with exceptional saturation.", priceCents: 12_450_00, compareAtCents: 14_000_00, originCountry: "Sri Lanka", imageUrl: "", attributes: { Weight: "2.50 ct", Cut: "Oval Mixed", Hardness: "9.0 (Mohs)", Clarity: "VVS", Color: "Blue" } },
  { slug: "bismuth-hopper-crystal", name: "Bismuth Hopper Crystal", category: "crystals", subcategory: "Synthetic", description: "Lab-grown, intense iridescence. Stair-stepped cubic geometry.", priceCents: 8_500_00, stockStatus: "low_stock", originCountry: "Germany", imageUrl: "", attributes: { Color: "Iridescent" } },
  { slug: "fluorite-octahedron", name: "Fluorite Octahedron", category: "crystals", subcategory: "Fluorite", description: "Cleaved form, deep emerald green. Sharp octahedral cleavage.", priceCents: 11_000_00, originCountry: "USA", imageUrl: "", attributes: { Color: "Green", Clarity: "VS", Hardness: "4 (Mohs)" } },
  { slug: "imperial-amethyst", name: "Imperial Amethyst", category: "crystals", subcategory: "Quartz", description: "Cathedral-grade Uruguayan amethyst with saturated royal purple hue.", priceCents: 3_400_00, stockStatus: "on_display", originCountry: "Uruguay", imageUrl: "", attributes: { Color: "Purple", Clarity: "VS" } },
  { slug: "tourmaline-rough", name: "Paraiba Tourmaline Rough", category: "crystals", subcategory: "Tourmaline", description: "124.5 ct uncut Paraiba tourmaline from São José da Batalha.", priceCents: 145_000_00, originCountry: "Brazil", imageUrl: "", attributes: { Color: "Blue", Weight: "124.5 ct" } },
  { slug: "topaz-imperial", name: "Imperial Topaz", category: "crystals", subcategory: "Topaz", description: "Champagne-orange Brazilian topaz with brilliant clarity.", priceCents: 6_800_00, originCountry: "Brazil", imageUrl: "", attributes: { Color: "Iridescent", Clarity: "VVS" } },
  { slug: "spinel-burmese", name: "Burmese Red Spinel", category: "crystals", subcategory: "Spinel", description: "Pigeon-blood saturation rivaling Burmese ruby.", priceCents: 9_900_00, originCountry: "Myanmar", imageUrl: "", attributes: { Color: "Purple", Clarity: "VS" } },
  { slug: "midnight-obsidian", name: "Midnight Obsidian", category: "igneous", description: "Volcanic glass, jet black with conchoidal fracture pattern.", priceCents: 1_250_00, originCountry: "Mexico", imageUrl: "", attributes: { Color: "Black", Hardness: "5.5 (Mohs)" } },
  { slug: "snowflake-obsidian", name: "Snowflake Obsidian", category: "igneous", description: "Cristobalite inclusions form sharp white snowflakes on jet glass.", priceCents: 950_00, originCountry: "USA", imageUrl: "", attributes: { Color: "Black" } },
  { slug: "rose-granite-slab", name: "Rose Granite Slab", category: "igneous", description: "Pegmatitic granite slab with bold orthoclase phenocrysts.", priceCents: 2_100_00, originCountry: "Finland", imageUrl: "", attributes: { Color: "Purple" } },
  { slug: "basalt-column", name: "Columnar Basalt", category: "igneous", description: "Hexagonal basalt column section from the Giant's Causeway region.", priceCents: 3_400_00, originCountry: "Ireland", imageUrl: "", attributes: { Color: "Black" } },
  { slug: "pumice-specimen", name: "Pumice Specimen", category: "igneous", description: "Featherweight vesicular pumice with classic frothy texture.", priceCents: 280_00, originCountry: "Italy", imageUrl: "", attributes: { Color: "Clear" } },
  { slug: "malachite-polished-slab", name: "Malachite Polished Slab", category: "metamorphic", description: "Vivid banding, Congolese origin. Hand-polished to a mirror finish.", priceCents: 28_000_00, originCountry: "DR Congo", imageUrl: "", attributes: { Color: "Green" } },
  { slug: "royal-lapis-lazuli", name: "Royal Lapis Lazuli", category: "metamorphic", description: "Premium Afghan lapis, golden pyrite flecks throughout.", priceCents: 850_00, originCountry: "Afghanistan", imageUrl: "", attributes: { Color: "Blue", Hardness: "5.5 (Mohs)" } },
  { slug: "carrara-marble-block", name: "Carrara Marble Block", category: "metamorphic", description: "Quarry-fresh Carrara, fine even grain favored for editorial sculpture.", priceCents: 5_600_00, originCountry: "Italy", imageUrl: "", attributes: { Color: "Clear" } },
  { slug: "verdite-cabochon", name: "Verdite Cabochon", category: "metamorphic", description: "African verdite cabochon with chromite swirling.", priceCents: 1_900_00, originCountry: "Zimbabwe", imageUrl: "", attributes: { Color: "Green" } },
  { slug: "muscovite-book", name: "Muscovite Book", category: "metamorphic", description: "Sheet mica 'book' showing perfect basal cleavage.", priceCents: 740_00, originCountry: "India", imageUrl: "", attributes: { Color: "Clear" } },
  { slug: "ammonite-fossil", name: "Ammonite Fossil", category: "sedimentary", description: "Madagascar ammonite cross-section showing chambered iridescent shell.", priceCents: 4_200_00, originCountry: "Madagascar", imageUrl: "", attributes: { Color: "Iridescent" } },
  { slug: "selenite-tower", name: "Selenite Tower", category: "sedimentary", description: "Tall selenite tower with silky satin spar luster.", priceCents: 360_00, originCountry: "Morocco", imageUrl: "", attributes: { Color: "Clear" } },
  { slug: "trilobite-plate", name: "Trilobite Plate", category: "sedimentary", description: "Moroccan trilobite plate, articulated specimen on natural matrix.", priceCents: 1_400_00, originCountry: "Morocco", imageUrl: "", attributes: { Color: "Black" } },
  { slug: "banded-iron-formation", name: "Banded Iron Formation", category: "sedimentary", description: "Polished BIF slab, alternating hematite and chert bands.", priceCents: 1_150_00, originCountry: "Australia", imageUrl: "", attributes: { Color: "Black" } },
  { slug: "petrified-wood-round", name: "Petrified Wood Round", category: "sedimentary", description: "Arizona petrified wood round, fully agatized cell structure.", priceCents: 2_750_00, originCountry: "USA", imageUrl: "", attributes: { Color: "Iridescent" } },
  { slug: "moonstone-oval", name: "Moonstone Oval", category: "crystals", subcategory: "Feldspar", description: "Adularescent feldspar cabochon with a soft blue sheen.", priceCents: 4_500_00, originCountry: "India", imageUrl: "", attributes: { Color: "White", Clarity: "VS" } },
  { slug: "red-garnet-suite", name: "Red Garnet Suite", category: "crystals", subcategory: "Garnet", description: "Vivid almandine garnet crystals with excellent saturation.", priceCents: 7_200_00, originCountry: "India", imageUrl: "", attributes: { Color: "Red", Hardness: "7.5 (Mohs)" } },
  { slug: "andesite-boulder", name: "Andesite Boulder", category: "igneous", description: "Fine-grained volcanic boulder with layered flow banding.", priceCents: 1_650_00, originCountry: "Chile", imageUrl: "", attributes: { Color: "Gray", Texture: "Fine-grained" } },
  { slug: "serpentine-carving", name: "Serpentine Carving", category: "metamorphic", description: "Soft green serpentinite carving with silky polish.", priceCents: 3_300_00, originCountry: "Afghanistan", imageUrl: "", attributes: { Color: "Green", Hardness: "3.5 (Mohs)" } },
  { slug: "fossilized-wood-slab", name: "Fossilized Wood Slab", category: "sedimentary", description: "Cross-section slab preserving mineralized wood grain and texture.", priceCents: 2_400_00, originCountry: "USA", imageUrl: "", attributes: { Color: "Brown", Origin: "Petrified" } },
];

const now = new Date();
const daysFromNow = (days: number) =>
  new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
const daysAgo = (days: number) =>
  new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

await db
  .insert(users)
  .values({
    uid: "seed-curator",
    email: "curator@rocksa.test",
    fullName: "Seed Curator",
    role: "curator",
  })
  .onConflictDoNothing();

await db.delete(auditLog);
await db.delete(shipments);
await db.delete(orderItems);
await db.delete(orders);
await db.delete(specimens);

for (const row of DEMO) {
  await db.insert(specimens).values(row);
}

const demoOrder = await db
  .insert(orders)
  .values({
    userUid: "seed-curator",
    reference: "RK-SEED-26",
    status: "fulfilling",
    subtotalCents: 145_000_00,
    shippingCents: 0,
    totalCents: 145_000_00,
  })
  .returning();

const orderId = demoOrder[0]!.id;

await db.insert(orderItems).values({
  orderId,
  specimenSlug: "tourmaline-rough",
  qty: 1,
  unitPriceCents: 145_000_00,
});

const shipmentRows = [
  {
    orderId,
    specimenSlug: "tourmaline-rough",
    origin: "São José da Batalha, Brazil",
    status: "in_transit",
    eta: daysFromNow(5),
  },
  {
    orderId,
    specimenSlug: "royal-lapis-lazuli",
    origin: "Badakhshan Province, Afghanistan",
    status: "pending_customs",
    eta: daysFromNow(12),
  },
  {
    orderId,
    specimenSlug: "deep-blue-sapphire",
    origin: "Idar-Oberstein, Germany",
    status: "out_for_delivery",
    eta: daysFromNow(0),
  },
  {
    orderId,
    specimenSlug: "midnight-obsidian",
    origin: "Mexico City, Mexico",
    status: "customs_hold",
    eta: daysAgo(2),
  },
  {
    orderId,
    specimenSlug: "amethyst-geode-slice",
    origin: "Uruguay",
    status: "in_transit",
    eta: daysFromNow(3),
  },
  {
    orderId,
    specimenSlug: "malachite-polished-slab",
    origin: "DR Congo",
    status: "pending_customs",
    eta: daysFromNow(8),
  },
  {
    orderId,
    specimenSlug: "fluorite-octahedron",
    origin: "USA",
    status: "in_transit",
    eta: daysAgo(1),
  },
] as const;

await db.insert(shipments).values([...shipmentRows]);

await db.insert(auditLog).values([
  {
    actorUid: "seed-curator",
    action: "appraisal.registered",
    target: "deep-blue-sapphire",
    payloadJson: { title: "New appraisal registered for Sapphire Matrix." },
    createdAt: daysAgo(0.08),
  },
  {
    actorUid: "seed-curator",
    action: "shipment.cleared",
    target: "SHP-8492",
    payloadJson: { title: "Shipment #SHP-8492 cleared customs." },
    createdAt: daysAgo(1),
  },
  {
    actorUid: "seed-curator",
    action: "inventory.added",
    target: "tourmaline-rough",
    payloadJson: { title: "Added 3 new Tourmaline specimens to inventory.", count: 3 },
    createdAt: daysAgo(12),
  },
]);

await sql.end();
console.log(`✓ seeded ${DEMO.length} specimens, ${shipmentRows.length} shipments`);
