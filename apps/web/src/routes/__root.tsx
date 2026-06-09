import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "@rocksa/auth";
import { Button, Card, CardBody } from "@rocksa/ui";
import { CartProvider } from "../state/cart.tsx";
import { OrderProvider } from "../state/order.tsx";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  errorComponent: ({ error }) => <RouteError error={error} />,
  notFoundComponent: () => <NotFoundState />,
});

function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <div className="min-h-screen text-ink-900">
            <Outlet />
          </div>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

function RouteError({ error }: { error: Error }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted p-8">
      <Card className="max-w-xl">
        <CardBody className="space-y-4">
          <p className="text-sm uppercase tracking-[0.25em] text-brand-700">Something went wrong</p>
          <h1 className="font-display text-3xl text-ink-900">The app shell could not render.</h1>
          <p className="text-sm text-ink-500">{error.message}</p>
          <Button asChild>
            <Link to="/">Return home</Link>
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}

function NotFoundState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted p-8">
      <Card className="max-w-xl">
        <CardBody className="space-y-4">
          <p className="text-sm uppercase tracking-[0.25em] text-brand-700">404</p>
          <h1 className="font-display text-3xl text-ink-900">Page not found</h1>
          <p className="text-sm text-ink-500">The route you tried to open does not exist yet.</p>
          <Button asChild>
            <Link to="/">Go to the storefront</Link>
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}
