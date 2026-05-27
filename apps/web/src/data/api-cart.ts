import type { CartItem } from "@rocksa/domain";
import { apiOptional } from "../lib/api.ts";

export const loadServerCart = async (): Promise<CartItem[]> => {
  const res = await apiOptional<{ items: CartItem[] }>("/v1/cart");
  return res?.items ?? [];
};

export const saveServerCart = async (items: CartItem[]): Promise<void> => {
  await apiOptional("/v1/cart", { method: "PUT", body: { items } });
};
