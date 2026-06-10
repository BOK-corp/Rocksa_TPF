import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "@rocksa/auth";
import { CartProvider } from "@rocksa/cart";
import { OrderProvider } from "../state/order.tsx";

export interface RouterContext {
  queryClient: QueryClient;
  auth: AuthValue;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <CartProvider>
      <OrderProvider>
        <div className="min-h-screen text-ink-900">
          <Outlet />
        </div>
      </OrderProvider>
    </CartProvider>
  ),
});
