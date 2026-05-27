import { orderReference, type CartItem } from "@rocksa/domain";
import { apiOptional } from "../lib/api.ts";

export interface CreateOrderInput {
  items: CartItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export interface ServerOrder extends CreateOrderInput {
  id: string;
  reference: string;
  createdAt: string;
}

interface ServerOrderRow {
  id: string;
  reference: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  createdAt: string;
}

export const createServerOrder = async (
  input: CreateOrderInput,
): Promise<ServerOrder | null> => {
  const res = await apiOptional<{ order: ServerOrderRow }>("/v1/orders", {
    method: "POST",
    body: {
      items: input.items.map((i) => ({
        specimenId: i.specimenId,
        qty: i.qty,
      })),
    },
  });
  if (!res) return null;
  return {
    ...input,
    id: res.order.id,
    reference: res.order.reference,
    createdAt: res.order.createdAt,
  };
};

// Fallback for unauthenticated/local-only mode.
export const createLocalOrder = (input: CreateOrderInput): ServerOrder => ({
  ...input,
  id: crypto.randomUUID(),
  reference: orderReference(),
  createdAt: new Date().toISOString(),
});
