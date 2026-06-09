import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, CardBody } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { useOrder } from "../../state/order.tsx";
import { useSpecimenLookup } from "../../data/api-specimens.ts";
import { DiamondIcon } from "../../components/Icons.tsx";

export const Route = createFileRoute("/orders/$orderId")({ component: OrderPage });

function OrderPage() {
  const { orderId } = Route.useParams();
  const { lastOrder } = useOrder();
  const findSpecimenById = useSpecimenLookup();
  const order = lastOrder && lastOrder.id === orderId ? lastOrder : null;

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface-muted">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4">
            <p className="text-ink-500">We couldn't locate this order in your session.</p>
            <Button asChild>
              <Link to="/">Return home</Link>
            </Button>
          </CardBody>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-muted px-6 py-16">
      <Card className="w-full max-w-2xl">
        <CardBody className="space-y-8 p-10">
          <div className="text-center space-y-3">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-brand-100 text-brand-600">
              <DiamondIcon className="h-7 w-7" />
            </span>
            <h1 className="font-display text-5xl text-brand-600">Acquisition Confirmed</h1>
            <p className="text-xs uppercase tracking-wider text-ink-500">
              Order Reference — #{order.reference}
            </p>
            <p className="text-ink-700 leading-relaxed max-w-md mx-auto">
              Thank you for entrusting Rocksa with this exceptional addition to your collection. One
              of our senior curators will be in touch shortly to coordinate secure vault transfer,
              insurance underwriting, and personalized delivery logistics.
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
                  <img src={s.imageUrl} alt="" className="h-24 w-24 rounded-md object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-display text-xl">{s.name}</h3>
                      <p className="font-medium">{formatPrice(item.unitPriceCents * item.qty)}</p>
                    </div>
                    <p className="text-xs text-ink-500 mt-1 line-clamp-2">{s.description}</p>
                    <dl className="mt-3 grid grid-cols-4 gap-3 text-xs">
                      {Object.entries(s.attributes)
                        .slice(0, 4)
                        .map(([k, v]) => (
                          <div key={k}>
                            <dt className="uppercase tracking-wider text-ink-500">{k}</dt>
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
