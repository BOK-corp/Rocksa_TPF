import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button, Card, CardBody, Input, Label, Separator } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { TopNav } from "../../components/TopNav.tsx";
import { useCart } from "@rocksa/cart";
import { useOrder } from "../../state/order.tsx";
import { useSpecimenLookup } from "../../data/api-specimens.ts";

export const Route = createFileRoute("/checkout/")({ component: Checkout });

function Checkout() {
  const { items, subtotal } = useCart();
  const { info, setInfo } = useOrder();
  const navigate = useNavigate();
  const findSpecimenById = useSpecimenLookup();
  const firstItem = items[0];
  const firstSpecimen = firstItem ? findSpecimenById(firstItem.specimenId) : null;

  return (
    <div>
      <TopNav variant="minimal" />
      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[1fr_360px]">
        <form
          className="space-y-10"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/checkout/payment" });
          }}
        >
          <nav className="flex items-center gap-2 text-sm text-ink-500">
            <Link to="/cart">Cart</Link>
            <span>›</span>
            <span className="font-medium text-brand-600 underline underline-offset-4">
              Information
            </span>
            <span>›</span>
            <span>Payment</span>
            <span>›</span>
            <span>Review</span>
          </nav>

          <section>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-3xl">Contact</h2>
              <p className="text-sm text-ink-500">
                Have an account?{" "}
                <Link to="/auth/login" className="text-brand-600">
                  Log in
                </Link>
              </p>
            </div>
            <div className="mt-4 space-y-3">
              <Input
                variant="underline"
                placeholder="Email address"
                type="email"
                value={info.email ?? ""}
                onChange={(e) => setInfo({ email: e.target.value })}
              />
              <label className="flex items-center gap-2 text-xs text-ink-700">
                <input type="checkbox" /> Email me with news and exclusive offers
              </label>
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl">Shipping address</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Input
                variant="underline"
                placeholder="United States"
                className="col-span-2"
                value={info.country ?? ""}
                onChange={(e) => setInfo({ country: e.target.value })}
              />
              <Input
                variant="underline"
                placeholder="First name"
                value={info.firstName ?? ""}
                onChange={(e) => setInfo({ firstName: e.target.value })}
              />
              <Input
                variant="underline"
                placeholder="Last name"
                value={info.lastName ?? ""}
                onChange={(e) => setInfo({ lastName: e.target.value })}
              />
              <Input
                variant="underline"
                placeholder="Address"
                className="col-span-2"
                value={info.address ?? ""}
                onChange={(e) => setInfo({ address: e.target.value })}
              />
              <Input
                variant="underline"
                placeholder="Apartment, suite, etc. (optional)"
                className="col-span-2"
                value={info.apartment ?? ""}
                onChange={(e) => setInfo({ apartment: e.target.value })}
              />
              <Input
                variant="underline"
                placeholder="City"
                value={info.city ?? ""}
                onChange={(e) => setInfo({ city: e.target.value })}
              />
              <Input
                variant="underline"
                placeholder="Postal code"
                value={info.postal ?? ""}
                onChange={(e) => setInfo({ postal: e.target.value })}
              />
              <Input
                variant="underline"
                placeholder="Phone"
                className="col-span-2"
                value={info.phone ?? ""}
                onChange={(e) => setInfo({ phone: e.target.value })}
              />
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl">Delivery method</h2>
            <div className="mt-4 space-y-2">
              {([
                ["standard", "Standard Secure Shipping", "Free"],
                ["express", "Express Insured Courier", "$150.00"],
              ] as const).map(([key, label, price]) => (
                <label
                  key={key}
                  className={
                    "flex items-center justify-between rounded-md border p-4 cursor-pointer " +
                    (info.delivery === key
                      ? "border-brand-600 bg-brand-50/40"
                      : "border-ink-700/10 bg-white")
                  }
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={info.delivery === key}
                      onChange={() => setInfo({ delivery: key })}
                      className="accent-brand-600"
                    />
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      {key === "express" && (
                        <p className="text-xs text-ink-500">1-2 business days</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm">{price}</p>
                </label>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-between">
            <Link to="/cart" className="text-sm text-brand-600">
              ← Return to cart
            </Link>
            <Button size="lg" type="submit">
              Continue to payment
            </Button>
          </div>
        </form>

        <aside>
          <Card>
            <CardBody className="space-y-4">
              <h2 className="font-display text-2xl">Order Summary</h2>
              {firstSpecimen && (
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md bg-surface-soft">
                    <img
                      src={firstSpecimen.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink-900 text-[10px] text-white">
                      {firstItem?.qty}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{firstSpecimen.name}</p>
                    <div className="mt-1 flex gap-2 text-xs">
                      {Object.entries(firstSpecimen.attributes)
                        .slice(0, 2)
                        .map(([, v]) => (
                          <span key={v} className="rounded bg-brand-50 px-1.5 py-0.5 text-brand-700">
                            {v}
                          </span>
                        ))}
                    </div>
                  </div>
                  <p className="text-sm">{formatPrice(firstItem!.unitPriceCents)}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input placeholder="Gift card or discount code" />
                <Button variant="secondary" size="sm">Apply</Button>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className="text-ink-500">Calculated at next step</span>
              </div>
              <Separator />
              <div className="flex items-baseline justify-between">
                <Label>Total</Label>
                <p className="font-display text-3xl">
                  <span className="text-xs uppercase tracking-wider text-ink-500 mr-2">
                    USD
                  </span>
                  {formatPrice(subtotal)}
                </p>
              </div>
            </CardBody>
          </Card>
        </aside>
      </main>
    </div>
  );
}
