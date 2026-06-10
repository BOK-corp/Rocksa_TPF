import type { CartItem } from "@rocksa/domain";
import { apiBaseUrl } from "./env.ts";

const request = async <T>(
  path: string,
  token: string | null,
  init?: RequestInit,
): Promise<T | null> => {
  if (!token) return null;
  try {
    const res = await fetch(`${apiBaseUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
};

export const loadServerCart = async (
  token: string | null,
): Promise<CartItem[]> => {
  const res = await request<{ items: CartItem[] }>("/v1/cart", token);
  return res?.items ?? [];
};

export const saveServerCart = async (
  token: string | null,
  items: CartItem[],
): Promise<void> => {
  await request("/v1/cart", token, {
    method: "PUT",
    body: JSON.stringify({ items }),
  });
};
