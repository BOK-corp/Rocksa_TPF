import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { orderReference, type CartItem } from "@rocksa/domain";
import { useAuth } from "@rocksa/auth";
import { createServerOrder } from "../data/api-orders.ts";

export interface CheckoutInfo {
  email?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  address?: string;
  apartment?: string;
  city?: string;
  postal?: string;
  phone?: string;
  delivery?: "standard" | "express";
}

export interface Order {
  id: string;
  reference: string;
  items: CartItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  createdAt: string;
}

interface OrderContextValue {
  info: CheckoutInfo;
  setInfo: (next: Partial<CheckoutInfo>) => void;
  lastOrder: Order | null;
  createOrder: (params: Omit<Order, "id" | "reference" | "createdAt">) => Promise<Order>;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { user, status } = useAuth();
  const [info, setInfoState] = useState<CheckoutInfo>({ delivery: "standard" });
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const setInfo = useCallback(
    (next: Partial<CheckoutInfo>) => setInfoState((prev) => ({ ...prev, ...next })),
    [],
  );

  const createOrder = useCallback(
    async (params: Omit<Order, "id" | "reference" | "createdAt">): Promise<Order> => {
      if (status === "authed" && user) {
        const server = await createServerOrder(params);
        if (server) {
          const order: Order = { ...params, ...server };
          setLastOrder(order);
          return order;
        }
        // fall through to local if API unreachable
      }
      const order: Order = {
        ...params,
        id: crypto.randomUUID(),
        reference: orderReference(),
        createdAt: new Date().toISOString(),
      };
      setLastOrder(order);
      return order;
    },
    [status, user],
  );

  const value = useMemo(
    () => ({ info, setInfo, lastOrder, createOrder }),
    [info, setInfo, lastOrder, createOrder],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = (): OrderContextValue => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside <OrderProvider>");
  return ctx;
};
