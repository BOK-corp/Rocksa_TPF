import { z } from "zod";
import { validateAddress, validatePaymentIntent } from "@rocksa/domain";

export const checkoutInfoSchema = z
  .object({
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    country: z.string(),
    address: z.string(),
    apartment: z.string().optional(),
    city: z.string(),
    postal: z.string(),
    phone: z.string(),
    delivery: z.enum(["standard", "express"]),
  })
  .superRefine((data, ctx) => {
    const result = validateAddress(data);
    if (!result.ok) {
      ctx.addIssue({ code: "custom", message: result.error });
    }
  });

export type CheckoutInfoForm = z.infer<typeof checkoutInfoSchema>;

export const paymentSchema = z
  .object({
    method: z.enum(["card", "wire", "wallet"]),
    cardholderName: z.string().optional(),
    cardNumber: z.string().optional(),
    expiration: z.string().optional(),
    cvc: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const result = validatePaymentIntent(data);
    if (!result.ok) {
      ctx.addIssue({ code: "custom", message: result.error });
    }
  });

export type PaymentForm = z.infer<typeof paymentSchema>;
