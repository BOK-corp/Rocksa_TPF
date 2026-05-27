import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { useCart } from "../../state/cart.tsx";
import { useOrder } from "../../state/order.tsx";
import { useSpecimenLookup } from "../../data/api-specimens.ts";
import { LockIcon, ShieldIcon } from "../../components/Icons.tsx";

export const Route = createFileRoute("/checkout/payment")({ component: Payment });

function Payment() {
  const { items, subtotalCents, clear } = useCart();
  const { createOrder } = useOrder();
  const navigate = useNavigate();
  const findSpecimenById = useSpecimenLookup();
  const firstItem = items[0];
  const firstSpecimen = firstItem ? findSpecimenById(firstItem.specimenId) : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const order = await createOrder({
      items: [...items],
      subtotalCents,
      shippingCents: 0,
      totalCents: subtotalCents,
    });
    clear();
    navigate({ to: "/orders/$orderId", params: { orderId: order.id } });
  };

  return (
    <div>
      <header className="border-b border-ink-700/5 bg-surface-muted">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-center px-6 relative">
          <Link to="/" className="font-display text-3xl text-brand-600">
            Rocksa
          </Link>
          <Link
            to="/cart"
            className="absolute right-6 inline-flex items-center gap-1 text-sm text-ink-500"
          >
            Cancel ✕
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="space-y-6">
          <div>
            <h1 className="font-display text-4xl">Secure Payment</h1>
            <p className="text-ink-500 mt-1">
              All transactions are encrypted and secured.
            </p>
          </div>

          <Tabs defaultValue="card">
            <TabsList>
              <TabsTrigger value="card">Credit Card</TabsTrigger>
              <TabsTrigger value="wire">Wire Transfer</TabsTrigger>
              <TabsTrigger value="wallet">Digital Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="pt-6">
              <Card>
                <CardBody className="space-y-5">
                  <div>
                    <Label>Cardholder Name</Label>
                    <Input variant="underline" placeholder="Name on card" required />
                  </div>
                  <div>
                    <Label>Card Number</Label>
                    <Input
                      variant="underline"
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label>Expiration Date</Label>
                      <Input variant="underline" placeholder="MM/YY" required />
                    </div>
                    <div>
                      <Label>CVC</Label>
                      <Input variant="underline" placeholder="123" required />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </TabsContent>

            <TabsContent value="wire" className="pt-6">
              <Card>
                <CardBody>
                  <p className="text-sm text-ink-700">
                    A senior curator will contact you with wire instructions
                    within 1 business day.
                  </p>
                </CardBody>
              </Card>
            </TabsContent>

            <TabsContent value="wallet" className="pt-6">
              <Card>
                <CardBody>
                  <p className="text-sm text-ink-700">
                    Apple Pay and Google Pay support coming soon.
                  </p>
                </CardBody>
              </Card>
            </TabsContent>
          </Tabs>
        </form>

        <aside>
          <Card>
            <CardBody className="space-y-4">
              <h2 className="font-display text-2xl">Order Summary</h2>
              {firstSpecimen && (
                <div className="flex gap-3">
                  <img
                    src={firstSpecimen.imageUrl}
                    alt=""
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{firstSpecimen.name}</p>
                    <p className="text-xs text-ink-500">
                      {Object.values(firstSpecimen.attributes).slice(0, 2).join(", ")}
                    </p>
                    <p className="font-display text-lg">
                      {formatPrice(firstSpecimen.priceCents)}
                    </p>
                  </div>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Insured Shipping</span>
                <span className="text-brand-600">Complimentary</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes</span>
                <span className="text-ink-500">Calculated at next step</span>
              </div>
              <Separator />
              <div className="flex items-baseline justify-between">
                <span className="font-display text-2xl">Total</span>
                <span className="font-display text-2xl text-brand-600">
                  {formatPrice(subtotalCents)}
                </span>
              </div>
              <Button
                onClick={(e) => void submit(e)}
                className="w-full"
                size="lg"
                type="button"
              >
                <LockIcon className="h-4 w-4" /> Complete Purchase
              </Button>
              <p className="flex items-center justify-center gap-1 text-xs text-ink-500">
                <ShieldIcon className="h-3 w-3" /> Backed by Rocksa Authenticity Guarantee
              </p>
            </CardBody>
          </Card>
        </aside>
      </main>
    </div>
  );
}
