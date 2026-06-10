import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "@rocksa/ui";
import { TopNav } from "../../components/TopNav.tsx";
import { CheckoutStepper } from "../../components/checkout/CheckoutStepper.tsx";
import { OrderSummary } from "../../components/checkout/OrderSummary.tsx";
import {
  checkoutInfoSchema,
  type CheckoutInfoForm,
} from "../../components/checkout/checkout-schemas.ts";
import {
  readStoredCartItems,
  writeStoredCheckoutInfo,
} from "../../lib/checkout-storage.ts";
import { useCart } from "../../state/cart.tsx";
import { useOrder } from "../../state/order.tsx";

export const Route = createFileRoute("/checkout/")({
  beforeLoad: () => {
    if (readStoredCartItems().length === 0) {
      throw redirect({ to: "/cart" });
    }
  },
  component: Checkout,
});

function Checkout() {
  const { items } = useCart();
  const { info, setInfo } = useOrder();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutInfoForm>({
    resolver: zodResolver(checkoutInfoSchema),
    defaultValues: {
      email: info.email ?? "",
      firstName: info.firstName ?? "",
      lastName: info.lastName ?? "",
      country: info.country ?? "",
      address: info.address ?? "",
      apartment: info.apartment ?? "",
      city: info.city ?? "",
      postal: info.postal ?? "",
      phone: info.phone ?? "",
      delivery: info.delivery ?? "standard",
    },
  });

  const delivery = watch("delivery");

  useEffect(() => {
    const sub = watch((data) => writeStoredCheckoutInfo(data));
    return () => sub.unsubscribe();
  }, [watch]);

  const onSubmit = (data: CheckoutInfoForm) => {
    setInfo(data);
    navigate({ to: "/checkout/payment" });
  };

  return (
    <div>
      <TopNav variant="minimal" />
      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[1fr_360px]">
        <form className="space-y-10" onSubmit={handleSubmit(onSubmit)} noValidate>
          <CheckoutStepper current="information" />

          {errors.root && (
            <p className="text-sm text-red-600" role="alert">
              {errors.root.message}
            </p>
          )}
          {Object.keys(errors).length > 0 && !errors.root && (
            <p className="text-sm text-red-600" role="alert">
              {errors.email?.message ??
                errors.firstName?.message ??
                errors.lastName?.message ??
                errors.country?.message ??
                errors.address?.message ??
                errors.city?.message ??
                errors.postal?.message ??
                errors.phone?.message ??
                "Please complete all required fields."}
            </p>
          )}

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
                autoComplete="email"
                {...register("email")}
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
                placeholder="Country"
                className="col-span-2"
                autoComplete="country-name"
                {...register("country")}
              />
              <Input
                variant="underline"
                placeholder="First name"
                autoComplete="given-name"
                {...register("firstName")}
              />
              <Input
                variant="underline"
                placeholder="Last name"
                autoComplete="family-name"
                {...register("lastName")}
              />
              <Input
                variant="underline"
                placeholder="Address"
                className="col-span-2"
                autoComplete="street-address"
                {...register("address")}
              />
              <Input
                variant="underline"
                placeholder="Apartment, suite, etc. (optional)"
                className="col-span-2"
                autoComplete="address-line2"
                {...register("apartment")}
              />
              <Input
                variant="underline"
                placeholder="City"
                autoComplete="address-level2"
                {...register("city")}
              />
              <Input
                variant="underline"
                placeholder="Postal code"
                autoComplete="postal-code"
                {...register("postal")}
              />
              <Input
                variant="underline"
                placeholder="Phone"
                className="col-span-2"
                type="tel"
                autoComplete="tel"
                {...register("phone")}
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
                    "flex cursor-pointer items-center justify-between rounded-md border p-4 " +
                    (delivery === key
                      ? "border-brand-600 bg-brand-50/40"
                      : "border-ink-700/10 bg-white")
                  }
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      value={key}
                      className="accent-brand-600"
                      {...register("delivery")}
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
          <OrderSummary items={items} info={{ ...info, delivery }} />
        </aside>
      </main>
    </div>
  );
}
