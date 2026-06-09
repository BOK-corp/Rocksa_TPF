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

export const subtotal = (items: ReadonlyArray<CartItem>): number =>
  items.reduce((sum, i) => sum + i.unitPriceCents * i.qty, 0);

export const total = (
  subtotalCents: number,
  shippingCents: number = 0,
  taxesCents: number = 0,
): number => subtotalCents + shippingCents + taxesCents;
