export type StockStatus = "in_stock" | "low_stock" | "on_display" | "sold";

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "fulfilling"
  | "shipped"
  | "delivered"
  | "cancelled";

export type ShipmentStatus =
  | "pending"
  | "in_transit"
  | "pending_customs"
  | "customs_hold"
  | "out_for_delivery"
  | "delivered";

export type Category = "igneous" | "metamorphic" | "sedimentary" | "crystals";

export type UserRole = "buyer" | "curator" | "admin";

export interface Specimen {
  id: string;
  slug: string;
  name: string;
  category: Category;
  subcategory: string | null;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  stockStatus: StockStatus;
  originCountry: string | null;
  imageUrl: string;
  attributes: Record<string, string>;
}

export interface CartItem {
  specimenId: string;
  qty: number;
  unitPriceCents: number;
}

export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };
