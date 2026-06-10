import { useQuery } from "@tanstack/react-query";
import { orderReference, type CartItem, type OrderStatus } from "@rocksa/domain";
import { api, apiOptional } from "../lib/api.ts";
import type { Order } from "../state/order.tsx";

export interface CreateOrderInput {
  items: CartItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export interface OrderSummary {
  id: string;
  reference: string;
  status: OrderStatus;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  createdAt: string;
}

interface ServerOrderRow {
  id: string;
  reference: string;
  status: OrderStatus;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  createdAt: string;
}

interface ServerOrderItemRow {
  specimenSlug: string;
  qty: number;
  unitPriceCents: number;
}

const toOrder = (
  row: ServerOrderRow,
  items: ServerOrderItemRow[],
): Order => ({
  id: row.id,
  reference: row.reference,
  subtotalCents: row.subtotalCents,
  shippingCents: row.shippingCents,
  totalCents: row.totalCents,
  createdAt:
    typeof row.createdAt === "string"
      ? row.createdAt
      : new Date(row.createdAt).toISOString(),
  items: items.map((i) => ({
    specimenId: i.specimenSlug,
    qty: i.qty,
    unitPriceCents: i.unitPriceCents,
  })),
});

export const createServerOrder = async (
  input: CreateOrderInput,
): Promise<Order | null> => {
  const res = await apiOptional<{ order: ServerOrderRow }>("/v1/orders", {
    method: "POST",
    body: {
      items: input.items.map((i) => ({
        specimenId: i.specimenId,
        qty: i.qty,
      })),
      shippingCents: input.shippingCents,
    },
  });
  if (!res) return null;
  return {
    ...input,
    id: res.order.id,
    reference: res.order.reference,
    createdAt:
      typeof res.order.createdAt === "string"
        ? res.order.createdAt
        : new Date(res.order.createdAt).toISOString(),
  };
};

export const fetchOrder = async (orderId: string): Promise<Order> => {
  const res = await api<{ order: ServerOrderRow; items: ServerOrderItemRow[] }>(
    `/v1/orders/${orderId}`,
  );
  return toOrder(res.order, res.items);
};

export const fetchOrders = async (): Promise<OrderSummary[]> => {
  const res = await api<{ orders: ServerOrderRow[] }>("/v1/orders");
  return res.orders.map((row) => ({
    id: row.id,
    reference: row.reference,
    status: row.status,
    subtotalCents: row.subtotalCents,
    shippingCents: row.shippingCents,
    totalCents: row.totalCents,
    createdAt:
      typeof row.createdAt === "string"
        ? row.createdAt
        : new Date(row.createdAt).toISOString(),
  }));
};

export const createLocalOrder = (input: CreateOrderInput): Order => ({
  ...input,
  id: crypto.randomUUID(),
  reference: orderReference(),
  createdAt: new Date().toISOString(),
});

export const useOrderDetail = (orderId: string, enabled: boolean) =>
  useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled,
    retry: false,
    staleTime: 30_000,
  });

export const useOrdersList = (enabled: boolean) =>
  useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    enabled,
    staleTime: 30_000,
  });
