import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  uuid,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

export const specimens = pgTable(
  "specimens",
  {
    slug: text("slug").primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    subcategory: text("subcategory"),
    description: text("description").notNull(),
    priceCents: integer("price_cents").notNull(),
    compareAtCents: integer("compare_at_cents"),
    stockStatus: text("stock_status").notNull().default("in_stock"),
    originCountry: text("origin_country"),
    imageUrl: text("image_url").notNull().default(""),
    attributes: jsonb("attributes")
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    categoryIdx: index("specimens_category_idx").on(t.category),
  }),
);

export const users = pgTable("users", {
  uid: text("uid").primaryKey(), // Firebase Auth UID
  email: text("email").notNull(),
  fullName: text("full_name"),
  role: text("role").notNull().default("buyer"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    userUid: text("user_uid")
      .notNull()
      .references(() => users.uid, { onDelete: "cascade" }),
    specimenSlug: text("specimen_slug")
      .notNull()
      .references(() => specimens.slug, { onDelete: "cascade" }),
    qty: integer("qty").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userUid, t.specimenSlug] }),
  }),
);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userUid: text("user_uid")
    .notNull()
    .references(() => users.uid, { onDelete: "cascade" }),
  reference: text("reference").notNull(),
  status: text("status").notNull().default("pending_payment"),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  specimenSlug: text("specimen_slug")
    .notNull()
    .references(() => specimens.slug, { onDelete: "cascade" }),
  qty: integer("qty").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
});

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const collectionItems = pgTable(
  "collection_items",
  {
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    specimenSlug: text("specimen_slug")
      .notNull()
      .references(() => specimens.slug, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.collectionId, t.specimenSlug] }),
  }),
);

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userUid: text("user_uid")
    .notNull()
    .references(() => users.uid, { onDelete: "cascade" }),
  kind: text("kind").notNull().default("shipping"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  line1: text("line_1").notNull(),
  line2: text("line_2"),
  city: text("city").notNull(),
  postal: text("postal").notNull(),
  country: text("country").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const shipments = pgTable("shipments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  carrier: text("carrier"),
  status: text("status").notNull().default("pending"),
  eta: timestamp("eta", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  fileUrl: text("file_url"),
  generatedAt: timestamp("generated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUid: text("actor_uid").references(() => users.uid, {
    onDelete: "set null",
  }),
  action: text("action").notNull(),
  target: text("target"),
  payloadJson: jsonb("payload_json").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
