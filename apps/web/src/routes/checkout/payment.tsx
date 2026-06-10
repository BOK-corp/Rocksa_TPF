import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { useCart } from "@rocksa/cart";
import { useOrder } from "../../state/order.tsx";

export const Route = createFileRoute("/checkout/payment")({
  beforeLoad: () => {
    if (readStoredCartItems().length === 0) {
      throw redirect({ to: "/cart" });
    }
    if (!isCheckoutInfoValid(readStoredCheckoutInfo())) {
      throw redirect({ to: "/checkout" });
    }
  },
  component: Payment,
});

function Payment() {
  const { items, subtotal, total, clear } = useCart();
  const { createOrder } = useOrder();
  const navigate = useNavigate();
  const findSpecimenById = useSpecimenLookup();
  const firstItem = items[0];
  const firstSpecimen = firstItem ? findSpecimenById(firstItem.specimenId) : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const order = await createOrder({
      items: [...items],
      subtotalCents: subtotal,
      shippingCents: 0,
      totalCents: total,
    });
    clear();
    navigate({ to: "/orders/$orderId", params: { orderId: order.id } });
  };

  return (
    <div>
      <TopNav variant="minimal" />
      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[1fr_360px]">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <CheckoutStepper current="payment" />

          <div>
            <h1 className="font-display text-4xl">Secure Payment</h1>
            <p className="mt-1 text-ink-500">
              All transactions are encrypted and secured.
            </p>
          </div>

          {errors.root && (
            <p className="text-sm text-red-600" role="alert">
              {errors.root.message}
            </p>
          )}
          {!errors.root && Object.keys(errors).length > 0 && (
            <p className="text-sm text-red-600" role="alert">
              {errors.method?.message ??
                errors.cardholderName?.message ??
                errors.cardNumber?.message ??
                errors.expiration?.message ??
                errors.cvc?.message ??
                "Please complete your payment details."}
            </p>
          )}

          <Tabs
            value={method}
            onValueChange={(value) =>
              setValue("method", value as PaymentForm["method"], {
                shouldValidate: true,
              })
            }
          >
            <TabsList>
              <TabsTrigger value="card">Credit Card</TabsTrigger>
              <TabsTrigger value="wire">Wire Transfer</TabsTrigger>
              <TabsTrigger value="wallet">Digital Wallet</TabsTrigger>
            </TabsList>

            <input type="hidden" {...register("method")} />

            <TabsContent value="card" className="pt-6">
              <Card>
                <CardBody className="space-y-5">
                  <div>
                    <Label>Cardholder Name</Label>
                    <Input
                      variant="underline"
                      placeholder="Name on card"
                      autoComplete="cc-name"
                      {...register("cardholderName")}
                    />
                  </div>
                  <div>
                    <Label>Card Number</Label>
                    <Input
                      variant="underline"
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      {...register("cardNumber")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label>Expiration Date</Label>
                      <Input
                        variant="underline"
                        placeholder="MM/YY"
                        autoComplete="cc-exp"
                        {...register("expiration")}
                      />
                    </div>
                    <div>
                      <Label>CVC</Label>
                      <Input
                        variant="underline"
                        placeholder="123"
                        autoComplete="cc-csc"
                        {...register("cvc")}
                      />
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
                    within 1 business day. Your order will be held in{" "}
                    <strong>pending_payment</strong> until funds clear.
                  </p>
                </CardBody>
              </Card>
            </TabsContent>

            <TabsContent value="wallet" className="pt-6">
              <Card>
                <CardBody>
                  <p className="text-sm text-ink-700">
                    Apple Pay and Google Pay support coming soon. Selecting this
                    option records your intent only.
                  </p>
                </CardBody>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between">
            <Link to="/checkout" className="text-sm text-brand-600">
              ← Return to information
            </Link>
            <Button size="lg" type="submit">
              Continue to review
            </Button>
          </div>
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
                <span>{formatPrice(subtotal)}</span>
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
                  {formatPrice(total)}
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
