import {
  validateAddress,
  validatePaymentIntent,
  type AddressInput,
  type PaymentIntent,
} from "@rocksa/domain";
import type { CartItem } from "@rocksa/domain";
import type { CheckoutInfo, PaymentInfo } from "../state/order.tsx";

export const CHECKOUT_INFO_KEY = "rocksa.checkout.info.v1";
export const CHECKOUT_PAYMENT_KEY = "rocksa.checkout.payment.v1";
export const CART_STORAGE_KEY = "rocksa.cart.v1";

export const EXPRESS_SHIPPING_CENTS = 15_000;

export const readStoredCheckoutInfo = (): CheckoutInfo => {
  if (typeof window === "undefined") return { delivery: "standard" };
  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_INFO_KEY);
    if (!raw) return { delivery: "standard" };
    return JSON.parse(raw) as CheckoutInfo;
  } catch {
    return { delivery: "standard" };
  }
};

export const writeStoredCheckoutInfo = (info: CheckoutInfo): void => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(CHECKOUT_INFO_KEY, JSON.stringify(info));
};

export const readStoredPaymentInfo = (): PaymentInfo => {
  if (typeof window === "undefined") return { method: "card" };
  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_PAYMENT_KEY);
    if (!raw) return { method: "card" };
    return JSON.parse(raw) as PaymentInfo;
  } catch {
    return { method: "card" };
  }
};

export const writeStoredPaymentInfo = (payment: PaymentInfo): void => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(CHECKOUT_PAYMENT_KEY, JSON.stringify(payment));
};

export const clearCheckoutSession = (): void => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(CHECKOUT_INFO_KEY);
  window.sessionStorage.removeItem(CHECKOUT_PAYMENT_KEY);
};

export const readStoredCartItems = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const isCheckoutInfoValid = (info: CheckoutInfo): boolean =>
  validateAddress(info as Partial<AddressInput>).ok;

export const isPaymentInfoValid = (payment: PaymentInfo): boolean =>
  validatePaymentIntent(payment as Partial<PaymentIntent>).ok;

export const shippingCentsForDelivery = (
  delivery: CheckoutInfo["delivery"],
): number => (delivery === "express" ? EXPRESS_SHIPPING_CENTS : 0);
