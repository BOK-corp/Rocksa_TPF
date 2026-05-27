import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "@rocksa/auth";
import { CartProvider } from "../state/cart.tsx";
import { OrderProvider } from "../state/order.tsx";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <div className="min-h-screen text-ink-900">
            <Outlet />
          </div>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  ),
});
