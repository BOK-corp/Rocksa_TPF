import type { CartItem, Specimen } from "./types.ts";

export const addItem = (
  items: ReadonlyArray<CartItem>,
  specimen: Specimen,
  qty: number = 1,
): CartItem[] => {
  const existing = items.find((i) => i.specimenId === specimen.id);
  if (existing) {
    return items.map((i) => (i.specimenId === specimen.id ? { ...i, qty: i.qty + qty } : i));
  }
  return [...items, { specimenId: specimen.id, qty, unitPriceCents: specimen.priceCents }];
};

export const setQty = (
  items: ReadonlyArray<CartItem>,
  specimenId: string,
  qty: number,
): CartItem[] =>
  qty <= 0
    ? items.filter((i) => i.specimenId !== specimenId)
    : items.map((i) => (i.specimenId === specimenId ? { ...i, qty } : i));

export const removeItem = (items: ReadonlyArray<CartItem>, specimenId: string): CartItem[] =>
  items.filter((i) => i.specimenId !== specimenId);

export const merge = (
  a: ReadonlyArray<CartItem>,
  b: ReadonlyArray<CartItem>,
): CartItem[] => {
  const byId = new Map<string, CartItem>();
  for (const item of [...a, ...b]) {
    const existing = byId.get(item.specimenId);
    byId.set(
      item.specimenId,
      existing
        ? { ...existing, qty: existing.qty + item.qty }
        : { ...item },
    );
  }
  return [...byId.values()];
};

export const subtotal = (items: ReadonlyArray<CartItem>): number =>
  items.reduce((sum, i) => sum + i.unitPriceCents * i.qty, 0);

export const cartSubtotal = subtotal;

export const total = (
  subtotalCents: number,
  shippingCents: number = 0,
  taxesCents: number = 0,
): number => subtotalCents + shippingCents + taxesCents;

export const cartTotal = total;
