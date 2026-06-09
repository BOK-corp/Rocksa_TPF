import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, CardBody, Separator } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { useCart } from "../state/cart.tsx";
import { useSpecimenLookup } from "../data/api-specimens.ts";
import { ArrowRightIcon, CloseIcon, LockIcon } from "../components/Icons.tsx";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { items, subtotalCents, setQty, remove } = useCart();
  const findSpecimenById = useSpecimenLookup();

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-700/5 bg-surface-muted">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
          <Link to="/" className="font-display text-2xl text-brand-600">
            Rocksa
          </Link>
          <nav className="flex gap-8 font-display text-lg">
            <Link to="/" className="text-ink-900">
              Collections
            </Link>
            <a className="text-ink-500">Custom Design</a>
            <a className="text-ink-500">Investment</a>
            <a className="text-ink-500">Journal</a>
          </nav>
          <div className="w-24" />
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-12">
        <h1 className="font-display text-5xl">Your Cart</h1>
        <p className="text-ink-500 mt-2">
          {items.length} item{items.length === 1 ? "" : "s"} meticulously selected.
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
                <Card key={item.specimenId}>
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
                          onClick={() => remove(item.specimenId)}
                          aria-label="Remove"
                          className="text-ink-400 hover:text-ink-700"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                      <dl className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                        {Object.entries(specimen.attributes)
                          .slice(0, 4)
                          .map(([k, v]) => (
                            <div key={k}>
                              <dt className="text-ink-500">{k}</dt>
                              <dd className="text-ink-900">{v}</dd>
                            </div>
                          ))}
                      </dl>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="inline-flex items-center rounded-full border border-ink-700/10 px-3 py-1 text-xs">
                          <span className="text-ink-500">Qty</span>
                          <input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={(e) => setQty(item.specimenId, Number(e.target.value))}
                            className="ml-2 w-10 bg-transparent text-center text-ink-900 focus:outline-none"
                          />
                        </div>
                        <p className="font-display text-2xl text-brand-600">
                          {formatPrice(item.unitPriceCents * item.qty)}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
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
                  <span className="text-ink-900">{formatPrice(subtotalCents)}</span>
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
                  <span className="font-display text-2xl">{formatPrice(subtotalCents)}</span>
                </div>
                <Button asChild className="w-full mt-2" size="lg" disabled={items.length === 0}>
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
