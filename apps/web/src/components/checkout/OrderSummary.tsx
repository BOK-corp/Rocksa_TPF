import { Button, Card, CardBody, Input, Label, Separator } from "@rocksa/ui";
import { formatPrice, subtotal, total, type CartItem } from "@rocksa/domain";
import { useSpecimenLookup } from "../../data/api-specimens.ts";
import { shippingCentsForDelivery } from "../../lib/checkout-storage.ts";
import type { CheckoutInfo } from "../../state/order.tsx";
import type { ReactNode } from "react";

interface Props {
  items: CartItem[];
  info: CheckoutInfo;
  action?: ReactNode;
}

export const OrderSummary = ({ items, info, action }: Props) => {
  const findSpecimenById = useSpecimenLookup();
  const subtotalCents = subtotal(items);
  const shippingCents = shippingCentsForDelivery(info.delivery);
  const totalCents = total(subtotalCents, shippingCents);

  return (
    <Card>
      <CardBody className="space-y-4">
        <h2 className="font-display text-2xl">Order Summary</h2>

        <div className="space-y-3">
          {items.map((item) => {
            const specimen = findSpecimenById(item.specimenId);
            if (!specimen) return null;
            return (
              <div key={item.specimenId} className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface-soft">
                  <img
                    src={specimen.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink-900 text-[10px] text-white">
                    {item.qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{specimen.name}</p>
                  <p className="text-xs text-ink-500 line-clamp-1">
                    {Object.values(specimen.attributes).slice(0, 2).join(", ")}
                  </p>
                </div>
                <p className="shrink-0 text-sm">
                  {formatPrice(item.unitPriceCents * item.qty)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Input placeholder="Gift card or discount code" />
          <Button variant="secondary" size="sm" type="button">
            Apply
          </Button>
        </div>

        <Separator />

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(subtotalCents)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span className={shippingCents === 0 ? "text-brand-600" : undefined}>
            {shippingCents === 0 ? "Complimentary" : formatPrice(shippingCents)}
          </span>
        </div>

        <Separator />

        <div className="flex items-baseline justify-between">
          <Label>Total</Label>
          <p className="font-display text-3xl">
            <span className="mr-2 text-xs uppercase tracking-wider text-ink-500">
              USD
            </span>
            {formatPrice(totalCents)}
          </p>
        </div>

        {action}
      </CardBody>
    </Card>
  );
};

export const useCheckoutTotals = (items: CartItem[], info: CheckoutInfo) => {
  const subtotalCents = subtotal(items);
  const shippingCents = shippingCentsForDelivery(info.delivery);
  const totalCents = total(subtotalCents, shippingCents);
  return { subtotalCents, shippingCents, totalCents };
};
