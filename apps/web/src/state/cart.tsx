import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  addItem as addItemFn,
  removeItem as removeItemFn,
  setQty as setQtyFn,
  subtotal as subtotalFn,
  type CartItem,
  type Specimen,
} from "@rocksa/domain";
import { useAuth } from "@rocksa/auth";
import { loadServerCart, saveServerCart } from "../data/api-cart.ts";

const STORAGE_KEY = "rocksa.cart.v1";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  add: (specimen: Specimen, qty?: number) => void;
  setQty: (specimenId: string, qty: number) => void;
  remove: (specimenId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const readStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const mergeItems = (a: CartItem[], b: CartItem[]): CartItem[] => {
  const byId = new Map<string, CartItem>();
  for (const it of [...a, ...b]) {
    const existing = byId.get(it.specimenId);
    byId.set(it.specimenId, existing ? { ...existing, qty: existing.qty + it.qty } : { ...it });
  }
  return [...byId.values()];
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, status } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => readStorage());
  const lastPushedRef = useRef<string>("");

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  useEffect(() => {
    if (status !== "authed" || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const remote = await loadServerCart();
        const guest = readStorage();
        const merged = mergeItems(remote, guest);
        if (cancelled) return;
        setItems(merged);
        const serialized = JSON.stringify(merged);
        if (serialized !== lastPushedRef.current) {
          await saveServerCart(merged);
          lastPushedRef.current = serialized;
        }
      } catch {
        /* leave local cart in place */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, user]);

  useEffect(() => {
    if (status !== "authed" || !user) return;
    const serialized = JSON.stringify(items);
    if (serialized === lastPushedRef.current) return;
    lastPushedRef.current = serialized;
    saveServerCart(items).catch(() => {
      /* ignore transient failures */
    });
  }, [items, status, user]);

  const add = useCallback(
    (specimen: Specimen, qty: number = 1) => setItems((prev) => addItemFn(prev, specimen, qty)),
    [],
  );
  const setQty = useCallback(
    (id: string, qty: number) => setItems((prev) => setQtyFn(prev, id, qty)),
    [],
  );
  const remove = useCallback((id: string) => setItems((prev) => removeItemFn(prev, id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotalCents: subtotalFn(items),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
