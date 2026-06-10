import type { Result } from "./types.ts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CARD_NUMBER_RE = /^\d{13,19}$/;
const CARD_EXP_RE = /^(0[1-9]|1[0-2])\/\d{2}$/;
const CARD_CVC_RE = /^\d{3,4}$/;
const PHONE_RE = /^[\d\s()+-]{7,}$/;

export const normalizeInput = (input: string): string => input.trim();

export const validateEmail = (input: string): Result<string> => {
  const normalized = normalizeInput(input).toLowerCase();
  return EMAIL_RE.test(normalized)
    ? { ok: true, value: normalized }
    : { ok: false, error: "Enter a valid email address." };
};

export const validatePassword = (input: string): Result<string> =>
  normalizeInput(input).length >= 8
    ? { ok: true, value: normalizeInput(input) }
    : { ok: false, error: "Password must be at least 8 characters." };

export const validatePostal = (
  country: string,
  input: string,
): Result<string> => {
  const normalized = normalizeInput(input).toUpperCase();
  const pattern = POSTAL_RE[country.toUpperCase() as keyof typeof POSTAL_RE];

  if (!pattern) {
    return { ok: true, value: normalized };
  }

  return pattern.test(normalized)
    ? { ok: true, value: normalized }
    : { ok: false, error: "Enter a valid postal code for this country." };
};

export const validateRequired = (
  label: string,
  input: string,
): Result<string> =>
  input.trim().length > 0
    ? { ok: true, value: input.trim() }
    : { ok: false, error: `${label} is required.` };

export interface AddressInput {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  apartment?: string;
  city: string;
  postal: string;
  phone: string;
  delivery: "standard" | "express";
}

export const validateAddress = (
  input: Partial<AddressInput>,
): Result<AddressInput> => {
  const email = validateEmail(input.email ?? "");
  if (!email.ok) return email;

  const firstName = validateRequired("First name", input.firstName ?? "");
  if (!firstName.ok) return firstName;

  const lastName = validateRequired("Last name", input.lastName ?? "");
  if (!lastName.ok) return lastName;

  const country = validateRequired("Country", input.country ?? "");
  if (!country.ok) return country;

  const address = validateRequired("Address", input.address ?? "");
  if (!address.ok) return address;

  const city = validateRequired("City", input.city ?? "");
  if (!city.ok) return city;

  const postal = validateRequired("Postal code", input.postal ?? "");
  if (!postal.ok) return postal;

  const phoneRaw = (input.phone ?? "").trim();
  if (!PHONE_RE.test(phoneRaw)) {
    return { ok: false, error: "Enter a valid phone number." };
  }

  const delivery = input.delivery === "express" ? "express" : "standard";

  const apartment = input.apartment?.trim();
  return {
    ok: true,
    value: {
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      country: country.value,
      address: address.value,
      ...(apartment ? { apartment } : {}),
      city: city.value,
      postal: postal.value,
      phone: phoneRaw,
      delivery,
    },
  };
};

export interface CardInput {
  cardholderName: string;
  cardNumber: string;
  expiration: string;
  cvc: string;
}

const luhnCheck = (digits: string): boolean => {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

export const validateCard = (input: Partial<CardInput>): Result<CardInput> => {
  const cardholderName = validateRequired(
    "Cardholder name",
    input.cardholderName ?? "",
  );
  if (!cardholderName.ok) return cardholderName;

  const digits = (input.cardNumber ?? "").replace(/\s+/g, "");
  if (!CARD_NUMBER_RE.test(digits) || !luhnCheck(digits)) {
    return { ok: false, error: "Enter a valid card number." };
  }

  const expiration = (input.expiration ?? "").trim();
  if (!CARD_EXP_RE.test(expiration)) {
    return { ok: false, error: "Enter expiration as MM/YY." };
  }

  const cvc = (input.cvc ?? "").trim();
  if (!CARD_CVC_RE.test(cvc)) {
    return { ok: false, error: "Enter a valid CVC." };
  }

  return {
    ok: true,
    value: {
      cardholderName: cardholderName.value,
      cardNumber: digits,
      expiration,
      cvc,
    },
  };
};

export type PaymentMethod = "card" | "wire" | "wallet";

export interface PaymentIntent {
  method: PaymentMethod;
  cardholderName?: string;
  cardNumber?: string;
  expiration?: string;
  cvc?: string;
}

export const validatePaymentIntent = (
  input: Partial<PaymentIntent>,
): Result<PaymentIntent> => {
  const method = input.method;
  if (method !== "card" && method !== "wire" && method !== "wallet") {
    return { ok: false, error: "Select a payment method." };
  }

  if (method === "card") {
    const card = validateCard({
      cardholderName: input.cardholderName,
      cardNumber: input.cardNumber,
      expiration: input.expiration,
      cvc: input.cvc,
    });
    if (!card.ok) return card;
    return {
      ok: true,
      value: { method: "card", ...card.value },
    };
  }

  return { ok: true, value: { method } };
};
