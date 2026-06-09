import type { Result } from "./types.ts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTAL_RE = {
  US: /^\d{5}(?:-\d{4})?$/,
  CA: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] ?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
  GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
  FR: /^\d{5}$/,
  DE: /^\d{5}$/,
};

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
