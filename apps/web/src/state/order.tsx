import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { orderReference, type CartItem, type PaymentMethod } from "@rocksa/domain";
import { useAuth } from "@rocksa/auth";
import { createServerOrder } from "../data/api-orders.ts";
import {
  clearCheckoutSession,
  readStoredCheckoutInfo,
  readStoredPaymentInfo,
  writeStoredCheckoutInfo,
  writeStoredPaymentInfo,
} from "../lib/checkout-storage.ts";

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

export interface PaymentInfo {
  method: PaymentMethod;
  cardholderName?: string;
  cardNumber?: string;
  expiration?: string;
  cvc?: string;
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
  payment: PaymentInfo;
  setPayment: (next: Partial<PaymentInfo>) => void;
  lastOrder: Order | null;
  createOrder: (
    params: Omit<Order, "id" | "reference" | "createdAt">,
  ) => Promise<Order>;
  clearCheckout: () => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { user, status } = useAuth();
  const [info, setInfoState] = useState<CheckoutInfo>(() => readStoredCheckoutInfo());
  const [payment, setPaymentState] = useState<PaymentInfo>(() =>
    readStoredPaymentInfo(),
  );
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  useEffect(() => {
    writeStoredCheckoutInfo(info);
  }, [info]);

  useEffect(() => {
    writeStoredPaymentInfo(payment);
  }, [payment]);

  const setInfo = useCallback((next: Partial<CheckoutInfo>) => {
    setInfoState((prev) => {
      const merged = { ...prev, ...next };
      writeStoredCheckoutInfo(merged);
      return merged;
    });
  }, []);

  const setPayment = useCallback((next: Partial<PaymentInfo>) => {
    setPaymentState((prev) => {
      const merged = { ...prev, ...next };
      writeStoredPaymentInfo(merged);
      return merged;
    });
  }, []);

  const clearCheckout = useCallback(() => {
    clearCheckoutSession();
    setInfoState({ delivery: "standard" });
    setPaymentState({ method: "card" });
  }, []);

  const createOrder = useCallback(
    async (params: Omit<Order, "id" | "reference" | "createdAt">): Promise<Order> => {
      if (status === "authed" && user) {
        const server = await createServerOrder(params);
        if (server) {
          const order: Order = { ...params, ...server };
          setLastOrder(order);
          clearCheckout();
          return order;
        }
      }
      const order: Order = {
        ...params,
        id: crypto.randomUUID(),
        reference: orderReference(),
        createdAt: new Date().toISOString(),
      };
      setLastOrder(order);
      clearCheckout();
      return order;
    },
    [status, user, clearCheckout],
  );

  const value = useMemo(
    () => ({
      info,
      setInfo,
      payment,
      setPayment,
      lastOrder,
      createOrder,
      clearCheckout,
    }),
    [info, setInfo, payment, setPayment, lastOrder, createOrder, clearCheckout],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = (): OrderContextValue => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside <OrderProvider>");
  return ctx;
};
