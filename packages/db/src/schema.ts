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
    attributes: jsonb("attributes").$type<Record<string, string>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
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
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
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
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
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
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
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
