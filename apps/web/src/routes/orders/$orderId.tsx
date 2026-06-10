import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, CardBody, Skeleton } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { useAuth } from "@rocksa/auth";
import { useOrder } from "../../state/order.tsx";
import { useOrderDetail } from "../../data/api-orders.ts";
import { useSpecimenLookup } from "../../data/api-specimens.ts";
import { DiamondIcon } from "../../components/Icons.tsx";

export const Route = createFileRoute("/orders/$orderId")({ component: OrderPage });

function OrderPage() {
  const { orderId } = Route.useParams();
  const { status } = useAuth();
  const { lastOrder } = useOrder();
  const findSpecimenById = useSpecimenLookup();

  const authed = status === "authed";
  const { data: fetched, isLoading, isError } = useOrderDetail(orderId, authed);

  const sessionOrder =
    lastOrder && lastOrder.id === orderId ? lastOrder : null;
  const order = fetched ?? sessionOrder;

  if (authed && isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-muted px-6 py-16">
        <Card className="w-full max-w-2xl">
          <CardBody className="space-y-4 p-10">
            <Skeleton className="mx-auto h-14 w-14 rounded-md" />
            <Skeleton className="mx-auto h-10 w-72" />
            <Skeleton className="h-24 w-full" />
          </CardBody>
        </Card>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-muted">
        <Card className="max-w-md">
          <CardBody className="space-y-4 text-center">
            <p className="text-ink-500">
              {authed && isError
                ? "We couldn't locate this order. It may belong to another account."
                : "We couldn't locate this order in your session."}
            </p>
            {authed ? (
              <Button asChild>
                <Link to="/orders">View order history</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/auth/login">Sign in to view order</Link>
              </Button>
            )}
          </CardBody>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-6 py-16">
      <Card className="w-full max-w-2xl">
        <CardBody className="space-y-8 p-10">
          <div className="space-y-3 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-brand-100 text-brand-600">
              <DiamondIcon className="h-7 w-7" />
            </span>
            <h1 className="font-display text-5xl text-brand-600">
              Acquisition Confirmed
            </h1>
            <p className="text-xs uppercase tracking-wider text-ink-500">
              ORDER REFERENCE — #{order.reference}
            </p>
            <p className="mx-auto max-w-md leading-relaxed text-ink-700">
              Thank you for entrusting Rocksa with this exceptional addition to
              your collection. One of our senior curators will be in touch
              shortly to coordinate secure vault transfer, insurance
              underwriting, and personalized delivery logistics.
            </p>
          </div>

          <div className="space-y-3">
            {order.items.map((item) => {
              const s = findSpecimenById(item.specimenId);
              if (!s) return null;
              return (
                <div
                  key={item.specimenId}
                  className="flex gap-5 rounded-md border border-ink-700/5 bg-surface-muted p-4"
                >
                  <img
                    src={s.imageUrl}
                    alt=""
                    className="h-24 w-24 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-display text-xl">{s.name}</h3>
                      <p className="font-medium">
                        {formatPrice(item.unitPriceCents * item.qty)}
                      </p>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-ink-500">
                      {s.description}
                    </p>
                    <dl className="mt-3 grid grid-cols-4 gap-3 text-xs">
                      {Object.entries(s.attributes)
                        .slice(0, 4)
                        .map(([k, v]) => (
                          <div key={k}>
                            <dt className="uppercase tracking-wider text-ink-500">
                              {k}
                            </dt>
                            <dd className="text-ink-900">{v}</dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Button asChild>
              <Link to="/workspace/overview">Return to Dashboard</Link>
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
