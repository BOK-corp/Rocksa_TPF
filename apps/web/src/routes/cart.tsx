import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, CardBody, Separator } from "@rocksa/ui";
import { formatPrice, type Specimen } from "@rocksa/domain";
import { useCart } from "@rocksa/cart";
import { useSpecimenLookup } from "../data/api-specimens.ts";
import { ArrowRightIcon, CloseIcon, LockIcon } from "../components/Icons.tsx";
import { StorefrontNav } from "../components/StorefrontNav.tsx";
import { QtyStepper } from "../components/QtyStepper.tsx";
import { cartAttributeRows } from "../lib/cart-attributes.ts";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { items, subtotal, total, setQty, remove } = useCart();
  const findSpecimenById = useSpecimenLookup();
  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <div className="min-h-screen">
      <StorefrontNav />

      <main className="mx-auto max-w-[1200px] px-6 py-12">
        <h1 className="font-display text-5xl">Your Cart</h1>
        <p className="text-ink-500 mt-2">
          {count} item{count === 1 ? "" : "s"} meticulously selected.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.length === 0 && (
              <Card>
                <CardBody className="text-center py-12">
                  <p className="text-ink-500">Your cart is empty.</p>
                  <Button asChild className="mt-4" variant="secondary">
                    <Link to="/">Explore the collection</Link>
                  </Button>
                </CardBody>
              </Card>
            )}
            {items.map((item) => {
              const specimen = findSpecimenById(item.specimenId);
              if (!specimen) return null;
              return (
                <CartRow
                  key={item.specimenId}
                  specimen={specimen}
                  qty={item.qty}
                  lineCents={item.unitPriceCents * item.qty}
                  onQty={(qty) => setQty(item.specimenId, qty)}
                  onRemove={() => remove(item.specimenId)}
                />
              );
            })}
          </div>

          <aside>
            <Card>
              <CardBody className="space-y-3">
                <h2 className="font-display text-2xl">Summary</h2>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-ink-700">Subtotal</span>
                  <span className="text-ink-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-700">Estimated Shipping</span>
                  <span className="text-brand-600">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-700">Duties &amp; Taxes</span>
                  <span className="text-ink-500">Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl">Total</span>
                  <span className="font-display text-2xl">
                    {formatPrice(total)}
                  </span>
                </div>
                <Button
                  asChild
                  className="w-full mt-2"
                  size="lg"
                  disabled={items.length === 0}
                >
                  <Link to="/checkout">
                    PROCEED TO CHECKOUT <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="mt-2 flex items-center justify-center gap-1 text-xs text-ink-500">
                  <LockIcon className="h-3 w-3" /> Secure Encrypted Checkout
                </p>
              </CardBody>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}

const CartRow = ({
  specimen,
  qty,
  lineCents,
  onQty,
  onRemove,
}: {
  specimen: Specimen;
  qty: number;
  lineCents: number;
  onQty: (qty: number) => void;
  onRemove: () => void;
}) => (
  <Card>
    <CardBody className="flex gap-5 p-0">
      <img
        src={specimen.imageUrl}
        alt=""
        className="h-40 w-40 rounded-l-lg object-cover"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex justify-between">
          <h3 className="font-display text-2xl">{specimen.name}</h3>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove"
            className="text-ink-400 hover:text-ink-700"
          >
            <CloseIcon />
          </button>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
          {cartAttributeRows(specimen).map(([label, value]) => (
            <div key={label}>
              <dt className="text-ink-500">{label}</dt>
              <dd className="text-ink-900">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto flex items-center justify-between pt-4">
          <QtyStepper value={qty} onChange={onQty} />
          <p className="font-display text-2xl text-brand-600">
            {formatPrice(lineCents)}
          </p>
        </div>
      </div>
    </CardBody>
  </Card>
);
