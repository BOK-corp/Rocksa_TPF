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
import { useAuth } from "@rocksa/auth";
import {
  addItem as addItemFn,
  merge as mergeFn,
  removeItem as removeItemFn,
  setQty as setQtyFn,
  subtotal as subtotalFn,
  total as totalFn,
  type CartItem,
  type Specimen,
} from "@rocksa/domain";
import { loadServerCart, saveServerCart } from "./api.ts";
import { readCartStorage, writeCartStorage } from "./storage.ts";

export interface CartValue {
  items: CartItem[];
  subtotal: number;
  total: number;
  add: (specimen: Specimen, qty?: number) => void;
  remove: (specimenId: string) => void;
  setQty: (specimenId: string, qty: number) => void;
  merge: (guest: CartItem[], server?: CartItem[]) => CartItem[];
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, status, getIdToken } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => readCartStorage());
  const lastPushedRef = useRef<string>("");
  const mergedRef = useRef(false);

  useEffect(() => {
    writeCartStorage(items);
  }, [items]);

  useEffect(() => {
    if (status !== "authed" || !user) {
      mergedRef.current = false;
      return;
    }
    if (mergedRef.current) return;

    let cancelled = false;
    (async () => {
      try {
        const token = await getIdToken();
        const remote = await loadServerCart(token);
        const guest = readCartStorage();
        const merged = mergeFn(remote, guest);
        if (cancelled) return;
        mergedRef.current = true;
        setItems(merged);
        const serialized = JSON.stringify(merged);
        if (serialized !== lastPushedRef.current) {
          await saveServerCart(token, merged);
          lastPushedRef.current = serialized;
        }
      } catch {
        /* keep local cart */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, user, getIdToken]);

  useEffect(() => {
    if (status !== "authed" || !user) return;
    const serialized = JSON.stringify(items);
    if (serialized === lastPushedRef.current) return;
    lastPushedRef.current = serialized;
    (async () => {
      const token = await getIdToken();
      await saveServerCart(token, items);
    })().catch(() => {
      /* ignore transient failures */
    });
  }, [items, status, user, getIdToken]);

  const merge = useCallback(
    (guest: CartItem[], server: CartItem[] = items) => mergeFn(server, guest),
    [items],
  );

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

  const subtotal = subtotalFn(items);

  const value = useMemo<CartValue>(
    () => ({
      items,
      subtotal,
      total: totalFn(subtotal),
      add,
      remove,
      setQty,
      merge,
      clear,
    }),
    [items, subtotal, add, remove, setQty, merge, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};

/** Total line-item quantity for nav badges. */
export const useCartCount = (): number => {
  const { items } = useCart();
  return items.reduce((n, i) => n + i.qty, 0);
};
