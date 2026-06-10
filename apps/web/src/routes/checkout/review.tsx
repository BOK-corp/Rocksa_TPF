import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { TopNav } from "../../components/TopNav.tsx";
import { CheckoutStepper } from "../../components/checkout/CheckoutStepper.tsx";
import {
  OrderSummary,
  useCheckoutTotals,
} from "../../components/checkout/OrderSummary.tsx";
import {
  isCheckoutInfoValid,
  isPaymentInfoValid,
  readStoredCartItems,
  readStoredCheckoutInfo,
  readStoredPaymentInfo,
} from "../../lib/checkout-storage.ts";
import { LockIcon, ShieldIcon } from "../../components/Icons.tsx";
import { useCart } from "../../state/cart.tsx";
import { useOrder } from "../../state/order.tsx";

export const Route = createFileRoute("/checkout/review")({
  beforeLoad: () => {
    if (readStoredCartItems().length === 0) {
      throw redirect({ to: "/cart" });
    }
    if (!isCheckoutInfoValid(readStoredCheckoutInfo())) {
      throw redirect({ to: "/checkout" });
    }
    if (!isPaymentInfoValid(readStoredPaymentInfo())) {
      throw redirect({ to: "/checkout/payment" });
    }
  },
  component: Review,
});

const paymentLabel = (method: string): string => {
  switch (method) {
    case "card":
      return "Credit Card";
    case "wire":
      return "Wire Transfer";
    case "wallet":
      return "Digital Wallet";
    default:
      return method;
  }
};

function Review() {
  const { items, clear } = useCart();
  const { info, payment, createOrder } = useOrder();
  const navigate = useNavigate();
  const { subtotalCents, shippingCents, totalCents } = useCheckoutTotals(
    items,
    info,
  );

  const completePurchase = async () => {
    const order = await createOrder({
      items: [...items],
      subtotalCents,
      shippingCents,
      totalCents,
    });
    clear();
    navigate({ to: "/orders/$orderId", params: { orderId: order.id } });
  };

  return (
    <div>
      <TopNav variant="minimal" />
      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <CheckoutStepper current="review" />

          <div>
            <h1 className="font-display text-4xl">Review your order</h1>
            <p className="mt-1 text-ink-500">
              Confirm your details before completing your acquisition.
            </p>
          </div>

          <section className="space-y-3 rounded-md border border-ink-700/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Contact &amp; shipping</h2>
              <Link to="/checkout" className="text-sm text-brand-600">
                Edit
              </Link>
            </div>
            <dl className="grid gap-2 text-sm">
              <div>
                <dt className="text-ink-500">Email</dt>
                <dd>{info.email}</dd>
              </div>
              <div>
                <dt className="text-ink-500">Ship to</dt>
                <dd>
                  {info.firstName} {info.lastName}
                  <br />
                  {info.address}
                  {info.apartment ? `, ${info.apartment}` : ""}
                  <br />
                  {info.city}, {info.postal}
                  <br />
                  {info.country}
                </dd>
              </div>
              <div>
                <dt className="text-ink-500">Delivery</dt>
                <dd>
                  {info.delivery === "express"
                    ? "Express Insured Courier"
                    : "Standard Secure Shipping"}
                  {shippingCents > 0 && ` — ${formatPrice(shippingCents)}`}
                </dd>
              </div>
            </dl>
          </section>

          <section className="space-y-3 rounded-md border border-ink-700/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Payment</h2>
              <Link to="/checkout/payment" className="text-sm text-brand-600">
                Edit
              </Link>
            </div>
            <p className="text-sm">
              {paymentLabel(payment.method)}
              {payment.method === "card" && payment.cardNumber
                ? ` ending in ${payment.cardNumber.slice(-4)}`
                : ""}
            </p>
            <p className="text-xs text-ink-500">
              Payment will be processed after order creation (status: pending_payment).
            </p>
          </section>

          <div className="flex items-center justify-between">
            <Link to="/checkout/payment" className="text-sm text-brand-600">
              ← Return to payment
            </Link>
          </div>
        </div>

        <aside>
          <OrderSummary
            items={items}
            info={info}
            action={
              <>
                <Button
                  className="w-full"
                  size="lg"
                  type="button"
                  onClick={() => void completePurchase()}
                >
                  <LockIcon className="h-4 w-4" /> Complete Purchase
                </Button>
                <p className="flex items-center justify-center gap-1 text-xs text-ink-500">
                  <ShieldIcon className="h-3 w-3" /> Backed by Rocksa Authenticity
                  Guarantee
                </p>
              </>
            }
          />
        </aside>
      </main>
    </div>
  );
}
