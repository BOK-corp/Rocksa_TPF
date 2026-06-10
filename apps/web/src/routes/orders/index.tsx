import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Card, CardBody, Skeleton } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { useAuth } from "@rocksa/auth";
import { WorkspaceLayout } from "../../components/WorkspaceLayout.tsx";
import { OrderStatusBadge } from "../../components/OrderStatusBadge.tsx";
import { useOrdersList } from "../../data/api-orders.ts";

export const Route = createFileRoute("/orders/")({ component: OrdersListPage });

const formatOrderDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function OrdersListPage() {
  const { status } = useAuth();
  const { data: orders, isLoading, isError } = useOrdersList(status === "authed");

  if (status === "loading") {
    return (
      <WorkspaceLayout>
        <div className="p-10 space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full" />
        </div>
      </WorkspaceLayout>
    );
  }

  if (status !== "authed") {
    return <Navigate to="/auth/login" />;
  }

  return (
    <WorkspaceLayout>
      <div className="p-10">
        <h1 className="font-display text-5xl">Order History</h1>
        <p className="mt-1 text-ink-500">
          Past acquisitions and their fulfillment status.
        </p>

        <div className="mt-8 space-y-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}

          {isError && (
            <Card>
              <CardBody className="text-sm text-ink-500">
                Unable to load orders. Confirm the API is running and try again.
              </CardBody>
            </Card>
          )}

          {!isLoading && !isError && orders?.length === 0 && (
            <Card>
              <CardBody className="py-12 text-center text-ink-500">
                No orders yet. Complete a checkout to see acquisitions here.
              </CardBody>
            </Card>
          )}

          {orders?.map((order) => (
            <Link
              key={order.id}
              to="/orders/$orderId"
              params={{ orderId: order.id }}
              className="block rounded-md border border-ink-700/10 bg-white transition-colors hover:border-brand-200 hover:bg-brand-50/30"
            >
              <CardBody className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium">#{order.reference}</p>
                  <p className="text-xs text-ink-500">
                    {formatOrderDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <p className="font-display text-xl">
                    {formatPrice(order.totalCents)}
                  </p>
                </div>
              </CardBody>
            </Link>
          ))}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
