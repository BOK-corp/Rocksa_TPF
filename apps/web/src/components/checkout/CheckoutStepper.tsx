import { Link } from "@tanstack/react-router";
import {
  isCheckoutInfoValid,
  isPaymentInfoValid,
  readStoredCheckoutInfo,
  readStoredPaymentInfo,
} from "../../lib/checkout-storage.ts";

export type CheckoutStep = "information" | "payment" | "review";

interface Props {
  current: CheckoutStep;
}

const steps = [
  { key: "cart" as const, label: "Cart", to: "/cart" as const },
  { key: "information" as const, label: "Information", to: "/checkout" as const },
  { key: "payment" as const, label: "Payment", to: "/checkout/payment" as const },
  { key: "review" as const, label: "Review", to: "/checkout/review" as const },
];

export const CheckoutStepper = ({ current }: Props) => {
  const info = readStoredCheckoutInfo();
  const payment = readStoredPaymentInfo();
  const step1Valid = isCheckoutInfoValid(info);
  const step2Valid = isPaymentInfoValid(payment);

  const canVisit = (key: (typeof steps)[number]["key"]): boolean => {
    if (key === "cart") return true;
    if (key === "information") return true;
    if (key === "payment") return step1Valid;
    if (key === "review") return step1Valid && step2Valid;
    return false;
  };

  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-ink-500">
      {steps.map((step, index) => {
        const active = step.key === current;
        const visitable = canVisit(step.key);
        const content = (
          <span
            className={
              active
                ? "font-medium text-brand-600 underline underline-offset-4"
                : visitable
                  ? "hover:text-brand-600"
                  : ""
            }
          >
            {step.label}
          </span>
        );

        return (
          <span key={step.key} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden>›</span>}
            {visitable && step.key !== current ? (
              <Link to={step.to}>{content}</Link>
            ) : (
              content
            )}
          </span>
        );
      })}
    </nav>
  );
};
